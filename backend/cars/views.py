from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.exceptions import PermissionDenied
from .models import Category, Brand, Car, RentalAvailability, Rental, CarImage
from .serializers import CategorySerializer, BrandSerializer, CarSerializer, RentalSerializer, RentalAvailabilitySerializer, CarImageSerializer


class CategoryViwSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser,]
    serializer_class = CategorySerializer
    http_method_names = ['patch', 'get', 'post']

    def get_queryset(self):
        return Category.objects.filter(category=self.request.user)

    def perform_create(self, serializer):
        category = serializer.validated_data['Category']
        if category.user != self.request.user:
            raise PermissionDenied("You do not have permission to create this Category.")
        if category.status == 'active':
            raise PermissionDenied("Currently this category are active")
        serializer.save()


class BrandViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'patch', 'post']
    serializer_class = BrandSerializer
    permission_classes = [IsAdminUser,]

    def get_queryset(self):
        return Brand.objects.filter(band=self.request.user)
    
    def perform_create(self, serializer):
        brand = serializer.validated_data['Brand']
        if brand.user != self.request.user:
            raise PermissionDenied("You do not have permission to create this Brand.")
        if brand.status == 'active':
            raise PermissionDenied("Currently this brand are active")
        serializer.save()


class CarViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'patch', 'post']
    serializer_class = CarSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Car.objects.filter(car=self.request.user)

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user.seller)


class RentalAvailabilityViewSet(viewsets.ModelViewSet):
    http_method_name = ['get', 'patch' , 'post']
    serializer_class = RentalAvailabilitySerializer
    permission_class = [IsAuthenticated,]

    def get_queryset(self):
        return RentalAvailability.objects.filter(rentAvail=self.request.user)

    def perform_update(self, serializer):
        rentAvail = self.get_object()
        if rentAvail.status == 'booked':
            raise PermissionDenied("This car already booked. Please check another")
        if rentAvail.status == 'blocked':
            raise PermissionDenied("This car already blocked")
        serializer.save()


class RentalViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'patch', 'post']
    serializer_class = RentalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Rental.objects.filter(car=self.request.user)


class CarImageViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'patch', 'post']
    serializer_class = CarImageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CarImage.objects.filter(car=self.request.user)

    def perform_create(self, serializer):
        carImage = serializer.validated_data['Car']
        if carImage.user != self.request.user:
            raise PermissionDenied("You do not have permission to create this Car")
        serializer.save()