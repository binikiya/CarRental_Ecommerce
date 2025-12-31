from rest_framework import serializers
from .models import Seller, Commission, AuditLog


class SellerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seller
        fields = ['id', 'user', 'company_name', 'business_email', 'business_phone', 'verification_status', 'created_at', 'updated_at']
        read_only_fields = ['verification_status']


class CommissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Commission
        fields = ['id', 'seller', 'order', 'percentage', 'amount', 'paid', 'paid_at', 'created_at']


class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = ['id', 'user', 'user_agent', 'action', 'ip_address', 'created_at']