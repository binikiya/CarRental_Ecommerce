from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Q
from .models import Order, OrderItem, Payment
from users.models import Wishlist
from .serializers import OrderSerializer, OrderItemSerializer, PaymentSerializer

LOCKED_STATUSES = ['paid', 'completed', 'canceled']


class CustomerDashboardSummary(APIView):
    def get(self, request):
        user = request.user

        active_bookings = Order.objects.filter(
            user=user, 
            order_type='rent', 
            payment_status__in=['paid', 'pending']
        ).count()

        wishlist_count = Wishlist.objects.filter(user=user).count()

        total_spent = Order.objects.filter(
            user=user, 
            payment_status__in=['paid', 'completed']
        ).aggregate(Sum('total_amount'))['total_amount__sum'] or 0

        recent_orders = Order.objects.filter(user=user).order_by('-id')[:3]
        serializer = OrderSerializer(recent_orders, many=True)

        return Response({
            "active_bookings": active_bookings,
            "wishlist_count": wishlist_count,
            "total_spent": total_spent,
            "recent_activity": serializer.data
        })


class OrderViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'patch']
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Order.objects.all().order_by('-id')

        if hasattr(user, 'seller'):
            return Order.objects.filter(seller=user.seller).order_by('-id')

        return Order.objects.filter(user=user).order_by('-id')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        order = self.get_object()
        if order.status in LOCKED_STATUSES:
            raise PermissionDenied("This order cannot be modified.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.status in LOCKED_STATUSES:
            raise PermissionDenied("This order cannot be deleted.")
        instance.delete()
    
    @action(detail=True, methods=['patch'])
    def request_cancel(self, request, pk=None):
        order = self.get_object()
        if order.user != request.user:
            return Response({"error": "Forbidden"}, status=403)
        
        order.payment_status = 'canceled'
        order.canceled_at = timezone.now()
        order.save()
        
        log_action(request, 'update')
        return Response({"status": "Cancellation requested"})

    @action(detail=True, methods=['patch'])
    def change_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status')
        if new_status in ['pending', 'paid', 'canceled', 'completed']:
            order.payment_status = new_status
            order.save()
            return Response({'status': 'updated'})
        return Response({'error': 'Invalid status'}, status=400)


class OrderItemViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'patch']
    serializer_class = OrderItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return OrderItem.objects.filter(order__user=self.request.user)
    
    def perform_create(self, serializer):
        order = serializer.validated_data['order']
        if order.user != self.request.user:
            raise PermissionDenied("You do not have permission to add items to this order.")
        if order.status != 'pending':
            raise PermissionDenied("Items can only be added to pending orders.")
        serializer.save()

    def perform_update(self, serializer):
        order = serializer.instance.order
        if order.status != 'pending':
            raise PermissionDenied("Items in this order cannot be modified.")
        if order.status in LOCKED_STATUSES:
            raise PermissionDenied("Items in this order cannot be modified.")
        serializer.save()

    def perform_destroy(self, instance):
        order = instance.order
        if order.status != 'pending':
            raise PermissionDenied("Items in this order cannot be deleted.")
        if order.status in LOCKED_STATUSES:
            raise PermissionDenied("Items in this order cannot be deleted.")
        instance.delete()


class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(order__user=self.request.user)

    def perform_create(self, serializer):
        order = serializer.validated_data['order']
        if order.user != self.request.user:
            raise PermissionDenied("You do not have permission to add payments to this order.")
        if order.status != 'pending':
            raise PermissionDenied("Payments can only be made for pending orders.")
        if hasattr(order, 'payment'):
            raise PermissionDenied("This order already has a payment.")
        if serializer.validated_data['amount'] != order.total_amount:
            raise PermissionDenied("Payment amount must match order total amount.")
        payment = serializer.save()

        if payment.payment_status == 'successful':
            order.status = 'paid'
            order.paid_at = payment.created_at
            order.save()