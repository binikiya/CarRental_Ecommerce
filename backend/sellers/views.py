from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from .models import Seller, Commission, AuditLog
from .serializers import SellerSerializer, CommissionSerializer, AuditLogSerializer


class SellerViewSet(viewsets.ModelViewSet):
    serializer_class = SellerSerializer
    permission_classes = [IsAuthenticated,]

    def get_queryset(self):
        return Seller.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        if Seller.objects.filter(user=self.request.user).exists():
            raise PermissionDenied("Seller Profile Already Exists")

        serializer.save(user=self.request.user)


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