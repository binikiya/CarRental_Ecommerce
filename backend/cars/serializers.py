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
        fields = ['id', 'car', 'image_url', 'is_primary']


class CarSerializer(serializers.ModelSerializer):
    category_details = CategorySerializer(source='category', read_only=True)
    images = CarImageSerializer(many=True, read_only=True)
    class Meta:
        model = Car
        fields = '__all__'
        read_only_fields = ['seller']