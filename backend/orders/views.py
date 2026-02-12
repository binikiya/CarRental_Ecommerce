from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action
from .models import Order, OrderItem, Payment
from .serializers import OrderSerializer, OrderItemSerializer, PaymentSerializer

LOCKED_STATUSES = ['paid', 'completed', 'canceled']


class OrderViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'patch']
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Order.objects.all().order_by('-id')
        return Order.objects.filter(seller=user.seller).order_by('-id')

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