from rest_framework import serializers
from .models import Category, Brand, Car, RentalAvailability, Rental, CarImage


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'category_slug', 'parent', 'status', 'created_at', 'updated_at']


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug', 'country', 'founded_year', 'status', 'created_at', 'updated_at']


class CarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Car
        fields = ['id', 'seller', 'category', 'brand', 'title', 'slug', 'description', 'car_type', 'price_sell', 'price_per_day', 'model_year', 'fuel_type', 'transmission', 'mileage', 'status', 'views_count', 'is_available', 'created_at', 'updated_at']


class RentalAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = RentalAvailability
        fields = ['id', 'name', 'available_from', 'available_to', 'status', 'created_at']


class RentalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rental
        fields = ['id', 'order', 'car', 'pickup_date', 'dropoff_date', 'pickup_location', 'dropoff_location', 'created_at', 'updated_at']


class CarImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarImage
        fields = ['id', 'car', 'image_url', 'is_primary', 'created_at']