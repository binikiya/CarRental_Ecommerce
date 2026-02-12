from rest_framework import routers
from django.urls import path
from .views import SellerViewSet, CommissionViewSet, AuditLogViewSet, AdminAnalyticsView, DisputeViewSet, SellerProfileViewSet

router = routers.SimpleRouter()

router.register(r'commission', CommissionViewSet, basename='seller-commission')
router.register(r'audit', AuditLogViewSet, basename='seller-auditlog')
router.register(r'disputes', DisputeViewSet, basename='seller-disputes')
router.register(r'', SellerViewSet, basename='Seller')

urlpatterns = [
    path('analytics/', AdminAnalyticsView.as_view(), name='admin-analytics'),
    path('retrieve/', SellerProfileViewSet.as_view({'get': 'retrieve'}), name='Seller-Profile'),
    path('update/', SellerProfileViewSet.as_view({'get': 'update'}), name='Seller-Update'),
    *router.urls
]
