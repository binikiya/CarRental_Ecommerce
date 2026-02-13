from rest_framework import serializers
from .models import User, SavedAddress, PaymentMethod, Review, Wishlist, Inquiry
from cars.serializers import CarSerializer


class UserSerializer(serializers.ModelSerializer):
    created = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    updated = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)

    class Meta:
        model = User
        fields = ['id', 'role', 'first_name', 'last_name', 'gender', 'email', 'phone', 'email_verified', 'status', 'created', 'updated']


class SavedAddressSerializer(serializers.ModelSerializer):
    created = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    updated = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)

    class Meta:
        model = SavedAddress
        fields = ['id', 'user', 'address_type', 'full_name', 'phone', 'country', 'city', 'state', 'street', 'postal_code', 'is_default', 'created', 'updated']


class PaymentMethodSerializer(serializers.ModelSerializer):
    created = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    updated = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)

    class Meta:
        model = PaymentMethod
        fields = ['id', 'user', 'provider', 'payment_token', 'card_brand', 'last4', 'expiry_year', 'expiry_month', 'is_default', 'created', 'updated']


class ReviewSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user', 'car', 'rating', 'comment', 'status', 'created_at']


class WishlistSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    car_details = CarSerializer(source='car', read_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'user', 'car', 'car_details', 'created_at']