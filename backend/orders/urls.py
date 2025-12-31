from .views import OrderViewSet, OrderItemViewSet, PaymentViewSet
from rest_framework import routers

router = routers.SimpleRouter()

router.register(r'items', OrderItemViewSet, basename='order-item')
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'', OrderViewSet, basename='order')

urlpatterns = [
    *router.urls,
]