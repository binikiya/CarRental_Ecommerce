from rest_framework import serializers
from .models import Order, OrderItem, Payment


class OrderItemSerializer(serializers.ModelSerializer):
    car_name = serializers.ReadOnlyField(source='car.title')
    car_image = serializers.ImageField(source='car.main_image', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'car', 'car_name', 'car_image', 'price_snapshot', 'quantity', 'rental_start_date', 'rental_end_date', 'created_at']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(source='order_items', many=True, read_only=True)
    customer_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'seller', 'order_type', 'order_number', 'payment_status', 'total_amount', 'payment_provider', 'billing_address_json', 'quantity', 'payment_reference', 'paid_at', 'canceled_at', 'completed_at', 'items', 'customer_email']


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'order', 'payment_provider', 'payment_status', 'transaction_id', 'amount', 'currency', 'created_at']