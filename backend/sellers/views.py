from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from .models import Seller, Commission, AuditLog
from rest_framework.decorators import action
from cars.models import Car
from .serializers import SellerSerializer, CommissionSerializer, AuditLogSerializer


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
        return Seller.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        if Seller.objects.filter(user=self.request.user).exists():
            raise PermissionDenied("Seller Profile Already Exists")

        serializer.save(user=self.request.user)

    @action(detail=True, methods=['patch'])
    def toggle_verify(self, request, pk=None):
        seller = self.get_object()
        seller.is_verified = not seller.is_verified
        seller.save()
        return Response({'status': 'Verification updated', 'is_verified': seller.is_verified})

    @action(detail=True, methods=['patch'])
    def toggle_status(self, request, pk=None):
        seller = self.get_object()
        seller.status = 'active' if seller.status == 'banned' else 'banned'
        seller.save()
        return Response({'status': f'Seller is now {seller.status}'})


class CommissionViewSet(viewsets.ModelViewSet):
    serializer_class = CommissionSerializer
    permission_classes = [IsAuthenticated,]

    def get_queryset(self):
        return Commission.objects.filter(seller=self.request.user)


class AuditLogViewSet(viewsets.ModelViewSet):
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuthenticated,]

    def get_queryset(self):
        return AuditLog.objects.filter(user=self.request.user)