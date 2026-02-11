from rest_framework import serializers
from .models import Seller, Commission, AuditLog, Dispute


class SellerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seller
        fields = ['id', 'user', 'company_name', 'business_email', 'business_phone', 'verification_status', 'created_at', 'updated_at']
        read_only_fields = ['verification_status']


class CommissionSerializer(serializers.ModelSerializer):
    seller_name = serializers.CharField(source='seller.company_name', read_only=True)

    class Meta:
        model = Commission
        fields = ['id', 'seller', 'seller_name', 'order', 'percentage', 'amount', 'paid', 'paid_at', 'created_at']


class AuditLogSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    class Meta:
        model = AuditLog
        fields = ['id', 'user', 'user_email', 'user_agent', 'action', 'ip_address', 'created_at']


class DisputeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dispute
        fields = ['id', 'order', 'seller', 'customer', 'reason', 'status', 'created_at', 'updated_at']
        read_only_fields = ['status']