from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.exceptions import PermissionDenied
from django_filters import rest_framework as filters
from rest_framework.decorators import action
from rest_framework.response import Response
import uuid
from .models import Category, Brand, Car, RentalAvailability, Rental, CarImage
from orders.models import Order, OrderItem
from users.models import Inquiry
from .serializers import CategorySerializer, BrandSerializer, CarSerializer, RentalSerializer, RentalAvailabilitySerializer, CarImageSerializer
from sellers.helpers import log_action


class CarFilter(filters.FilterSet):
    min_price = filters.NumberFilter(field_name="price", lookup_expr='gte')
    max_price = filters.NumberFilter(field_name="price", lookup_expr='lte')
    brand = filters.CharFilter(lookup_expr='icontains')
    category = filters.CharFilter(lookup_expr='iexact')

    class Meta:
        model = Car
        fields = ['brand', 'category', 'transmission', 'fuel_type', 'car_type']


class CategoryViwSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    http_method_names = ['patch', 'get', 'post']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        if self.action in ['list', 'retrieve']:
            return Category.objects.all()

        user = self.request.user

        if user.is_superuser:
            return Category.objects.all()

        return Category.objects.all()

    def perform_destroy(self, instance):
        log_action(self.request, 'delete')
        instance.delete()

    def perform_create(self, serializer):
        serializer.save()
        log_action(self.request, 'create')


class BrandViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'patch', 'post']
    serializer_class = BrandSerializer
    permission_classes = [IsAdminUser,]

    def get_queryset(self):
        return Brand.objects.filter(band=self.request.user)
    
    def perform_create(self, serializer):
        if not self.request.user.is_staff:
            raise PermissionDenied("Only admin can create brands")
        serializer.save()


class CarViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'patch', 'post', 'delete']
    serializer_class = CarSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        if self.action in ['list', 'retrieve', 'book_car', 'contact_seller']:
            return Car.objects.filter(status='active', is_available=True)

        user = self.request.user

        if user.is_superuser:
            return Car.objects.all()

        return Car.objects.filter(seller__user=user)

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user.seller)

    @action(detail=True, methods=['post'], url_path='book_car')
    def book_car(self, request, pk=None):
        car = self.get_object()
        if car.car_type == 'rent':
            price_snapshot = getattr(car, 'price_per_day', car.price_per_day)

        else:
            price_snapshot = getattr(car, 'price_sell', car.price_sell)

        default_address = {
            "address": "Pending Checkout",
            "city": "Pending",
            "country": "Pending"
        }

        order = Order.objects.create(
            user=request.user,
            seller=car.seller,
            order_number=f"ORD-{uuid.uuid4().hex[:8].upper()}",
            total_amount=price_snapshot,
            order_type='rent' if car.car_type == 'rent' else 'sell',
            payment_status='pending',
            quantity=1,
            billing_address_json=default_address,
            payment_provider='stripe'
        )

        OrderItem.objects.create(order=order, car=car, price_snapshot=price_snapshot)
        return Response({
            "status": "Booking created", 
            "order_id": order.id,
            "order_number": order.order_number
        })

    @action(detail=True, methods=['post'])
    def contact_seller(self, request, pk=None):
        car = self.get_object()
        message = request.data.get('message')
        Inquiry.objects.create(user=request.user, car=car, message=message)
        return Response({"status": "Message sent to seller"})


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
    serializer_class = CarImageSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        if self.action in ['list', 'retrieve']:
            return CarImage.objects.select_related('car').all()

        user = self.request.user
        if not hasattr(user, 'seller'):
            return CarImage.objects.none()

        return CarImage.objects.filter(car__seller=user.seller)

    def perform_create(self, serializer):
        car = serializer.validated_data['car']
        if car.seller.user != self.request.user:
            raise PermissionDenied("You do not own this car")
        serializer.save()