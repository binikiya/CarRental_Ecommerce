from rest_framework import routers
from django.urls import path
from .views import SellerViewSet, CommissionViewSet, AuditLogViewSet, AdminAnalyticsView

router = routers.SimpleRouter()

router.register(r'commission', CommissionViewSet, basename='seller-commission')
router.register(r'audit', AuditLogViewSet, basename='seller-auditlog')
router.register(r'', SellerViewSet, basename='Seller')

urlpatterns = [
    path('analytics/', AdminAnalyticsView.as_view(), name='admin-analytics'),
    *router.urls
]
