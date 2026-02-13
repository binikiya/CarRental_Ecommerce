from .views import OrderViewSet, OrderItemViewSet, PaymentViewSet, CustomerDashboardSummary
from rest_framework import routers
from django.urls import path

router = routers.SimpleRouter()

router.register(r'items', OrderItemViewSet, basename='order-item')
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'', OrderViewSet, basename='order')

urlpatterns = [
    path('dashboard/', CustomerDashboardSummary.as_view(), name='customer-dashboard'),
    *router.urls,
]