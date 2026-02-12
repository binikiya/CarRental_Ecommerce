from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from .models import Seller, Commission, AuditLog, Dispute
from rest_framework.decorators import action
from cars.models import Car
from cars.serializers import CarSerializer
from .serializers import SellerSerializer, CommissionSerializer, AuditLogSerializer, DisputeSerializer
from .helpers import log_action, export_to_csv


class AdminAnalyticsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        total_revenue = 500000
        active_cars = Car.objects.filter(status='active').count()
        total_sellers = Seller.objects.count()

        revenue_history = [4000, 3000, 5000, 2000, 6000, 8000]

        return Response({
            "total_revenue": total_revenue,
            "commission": total_revenue * 0.10,
            "active_listings": active_cars,
            "total_sellers": total_sellers,
            "pending_disputes": 5,
            "revenue_history": revenue_history
        })


class SellerViewSet(viewsets.ModelViewSet):
    serializer_class = SellerSerializer
    permission_classes = [IsAuthenticated,]

    queryset = Seller.objects.all()

    def get_queryset(self):
        queryset = Seller.objects.all()
        return queryset.filter(user=self.request.user) if not self.request.user.is_staff else queryset

    def perform_create(self, serializer):
        if Seller.objects.filter(user=self.request.user).exists():
            raise PermissionDenied("Seller Profile Already Exists")

        serializer.save(user=self.request.user)
        log_action(self.request, 'create')

    @action(detail=True, methods=['patch'])
    def update_verification(self, request, pk=None):
        seller = self.get_object()
        new_status = request.data.get('status')
        
        if new_status in ['pending', 'approved', 'rejected']:
            seller.verification_status = new_status
            seller.save()
            log_action(self.request, 'update_verification')
            return Response({'status': f'Seller status updated to {new_status}'})
        
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)


class SellerInventoryViewSet(viewsets.ModelViewSet):
    serializer_class = CarSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Car.objects.filter(seller=self.request.user.seller)

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user.seller)

class SellerProfileViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def retrieve(self, request):
        seller = request.user.seller
        serializer = SellerSerializer(seller)
        return Response(serializer.data)

    def update(self, request):
        seller = request.user.seller
        serializer = SellerSerializer(seller, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class CommissionViewSet(viewsets.ModelViewSet):
    queryset = Commission.objects.all().order_by('-created_at')
    serializer_class = CommissionSerializer
    permission_classes = [IsAuthenticated,]

    def get_queryset(self):
        user = self.request.user

        if user.is_staff or user.is_superuser:
            return Commission.objects.all().order_by('-created_at')

        try:
            seller_profile = user.seller
            return Commission.objects.filter(seller=seller_profile).order_by('-created_at')
        except Seller.DoesNotExist:
            return Commission.objects.none()
    
    @action(detail=True, methods=['patch'])
    def mark_as_paid(self, request, pk=None):
        commission = self.get_object()
        if commission.paid:
            return Response({'error': 'Commission already paid'}, status=status.HTTP_400_BAD_REQUEST)

        commission.paid = True
        commission.paid_at = timezone.now()
        commission.save()

        log_action(request, 'payment')
        return Response({'status': 'Commission marked as paid'})

    @action(detail=False, methods=['get'])
    def export_csv(self, request):
        if not request.user.is_staff:
            return Response({"detail": "Unauthorized"}, status=403)
            
        commissions = self.get_queryset()
        fields = ['id', 'seller.company_name', 'order.id', 'amount', 'percentage', 'paid', 'created_at']
        return export_to_csv(commissions, fields, "platform_commissions")


class AuditLogViewSet(viewsets.ModelViewSet):
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuthenticated,]

    def get_queryset(self):
        return AuditLog.objects.filter(user=self.request.user).order_by('-created_at')


class DisputeViewSet(viewsets.ModelViewSet):
    serializer_class = DisputeSerializer

    queryset = Dispute.objects.all().order_by('-created_at')

    def get_queryset(self):
        return Dispute.objects.all().order_by('-created_at')

    @action(detail=True, methods=['patch'])
    def resolve(self, request, pk=None):
        dispute = self.get_object()
        dispute.status = 'resolved'
        dispute.admin_note = request.data.get('note', '')
        dispute.save()
        log_action(request, 'update')
        return Response({'status': 'Dispute resolved'})