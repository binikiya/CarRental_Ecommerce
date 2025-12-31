from rest_framework import routers
from .views import SellerViewSet, CommissionViewSet, AuditLogViewSet

router = routers.SimpleRouter()

router.register(r'commission', CommissionViewSet, basename='seller-commission')
router.register(r'audit', AuditLogViewSet, basename='seller-auditlog')
router.register(r'', SellerViewSet, basename='Seller')

urlpatterns = [
    *router.urls
]
