from .views import CategoryViwSet, BrandViewSet, CarViewSet, RentalAvailabilityViewSet, RentalViewSet, CarImageViewSet
from rest_framework import routers
from django.urls import path

router = routers.SimpleRouter()

router.register(r'car-image', CarImageViewSet, basename='Car-Image')
router.register(r'car', CarViewSet, basename='Car')
router.register(r'rental', RentalViewSet, basename='Rental')
router.register(r'availability', RentalAvailabilityViewSet, basename='Rental-Avalability')
router.register(r'brand', BrandViewSet, basename='Brand')
router.register(r'category', CategoryViwSet, basename='category')

urlpatterns = [
    *router.urls
]