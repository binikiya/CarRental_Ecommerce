from rest_framework import serializers
from .models import Order, OrderItem, Payment


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['id', 'user', 'order_type', 'status', 'total_amount', 'quantity', 'created_at', 'updated_at', 'paid_at', 'canceled_at', 'completed_at']


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'car', 'price_snapshot', 'quantity', 'rental_start_date', 'rental_end_date', 'created_at']


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'order', 'payment_provider', 'payment_status', 'transaction_id', 'amount', 'currency', 'created_at']