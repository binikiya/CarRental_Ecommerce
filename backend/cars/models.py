from django.db import models
from sellers.models import Seller
from django.core.exceptions import ValidationError
from datetime import date
from orders.models import Order


class Category(models.Model):
    CATEGORY_CHOICES = (
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    )

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    category_slug = models.SlugField(unique=True)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, blank=True, null=True, related_name='subcategories')
    status = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='active')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['parent']),
            models.Index(fields=['status']),
        ]

    def clean(self):
        if self.parent == self:
            raise ValidationError("A category cannot be its own parent.")

    def __str__(self):
        return self.name


class Brand(models.Model):
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    )

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)
    country = models.CharField(max_length=100)
    founded_year = models.PositiveIntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['name']),
        ]

    def clean(self):
        current_year = date.today().year
        if self.founded_year > current_year:
            raise ValidationError("Founded year cannot be in the future.")

    def __str__(self):
        return self.name


class Car(models.Model):
    CAR_CHOICES = (
        ('rent', 'Rent'),
        ('sell', 'Sell'),
        ('both', 'Both'),
    )

    STATUS_CHOICES = (
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('sold', 'Sold'),
    )

    FUEL_CHOICES = (
        ('petrol', 'Petrol'),
        ('diesel', 'Diesel'),
        ('electric', 'Electric'),
        ('hybrid', 'Hybrid'),
    )

    TRANSMISSION_CHOICES = (
        ('manual', 'Manual'),
        ('automatic', 'Automatic'),
    )

    id = models.AutoField(primary_key=True)
    seller = models.ForeignKey(Seller, on_delete=models.CASCADE, related_name='cars')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='cars')
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True, related_name='cars')
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    car_type = models.CharField(max_length=20, choices=CAR_CHOICES)
    price_sell = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    price_per_day = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    model_year = models.PositiveIntegerField()
    fuel_type = models.CharField(max_length=50, choices=FUEL_CHOICES)
    transmission = models.CharField(max_length=50, choices=TRANSMISSION_CHOICES)
    mileage = models.PositiveIntegerField(help_text="Mileage in kilometers")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    views_count = models.PositiveIntegerField(default=0)

    is_available = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['price_sell']),
            models.Index(fields=['price_per_day']),
            models.Index(fields=['category']),
            models.Index(fields=['brand']),
            models.Index(fields=['status']),
            models.Index(fields=['car_type']),
        ]

    def clean(self):
        current_year = date.today().year
        if self.model_year > current_year:
            raise ValidationError("Model year cannot be in the future.")

        if self.car_type == 'rent' and self.price_per_day is None:
            raise ValidationError("Price per day must be set for rental cars.")

        if self.car_type == 'sell' and self.price_sell is None:
            raise ValidationError("Sell price must be set for cars for sale.")
        
        if self.car_type == 'both' and (self.price_sell is None or self.price_per_day is None):
            raise ValidationError("Both sell price and price per day must be set for cars available for both rent and sale.")

    def __str__(self):
        return f"{self.title}"


class RentalAvailability(models.Model):
    STATUS_CHOICES = (
        ('available', 'Available'),
        ('booked', 'Booked'),
        ('blocked', 'Blocked'),
    )

    id = models.AutoField(primary_key=True)
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='rental_availabilities')
    available_from = models.DateField()
    available_to = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['car']),
            models.Index(fields=['status']),
            models.Index(fields=['available_from', 'available_to']),
        ]
        unique_together = ('car', 'available_from', 'available_to')

    def clean(self):
        if self.available_to < self.available_from:
            raise ValidationError("End date cannot be before start date.")
        
        overlapping_bookings = RentalAvailability.objects.filter(
            car=self.car,
            status='booked',
            available_from__lt=self.available_to,
            available_to__gt=self.available_from
        ).exclude(id=self.id)

        if overlapping_bookings.exists():
            raise ValidationError("This car is already booked for the selected date range.")

    def __str__(self):
        return f"Rental Availability for {self.car.title} from {self.available_from} to {self.available_to}"


class Rental(models.Model):
    id = models.AutoField(primary_key=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='rental')
    car = models.ForeignKey(Car, on_delete=models.PROTECT, related_name='rentals')
    pickup_date = models.DateField()
    dropoff_date = models.DateField()
    pickup_location = models.CharField(max_length=255)
    dropoff_location = models.CharField(max_length=255)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def total_days(self):
        return (self.dropoff_date - self.pickup_date).days

    class Meta:
        indexes = [
            models.Index(fields=['car']),
            models.Index(fields=['pickup_date']),
            models.Index(fields=['dropoff_date']),
        ]

    def clean(self):
        if self.dropoff_date < self.pickup_date:
            raise ValidationError("Rental end date cannot be before start date.")

        overlapping_rentals = Rental.objects.filter(
            car=self.car,
            pickup_date__lt=self.dropoff_date,
            dropoff_date__gt=self.pickup_date
        ).exclude(id=self.id)
        if overlapping_rentals.exists():
            raise ValidationError("This car is already rented for the selected date range.")

    def __str__(self):
        return f"Rental of {self.car.title} from {self.pickup_date} to {self.dropoff_date}"