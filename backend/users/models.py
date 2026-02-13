from django.db import models
from django.contrib.auth.models import AbstractUser, PermissionsMixin
from django.http import Http404
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.contrib.auth.base_user import BaseUserManager
from datetime import date
from django.core.validators import MinValueValidator, MaxValueValidator


class UserManager(BaseUserManager):
    def get_object_by_public_id(self, public_id):
        try:
            return self.get(id=public_id)
        except (ObjectDoesNotExist, ValueError, TypeError):
            raise Http404("User does not exist")

    def create_user(self, email, password=None, **kwargs):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **kwargs)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **kwargs):
        if not email:
            raise ValueError('The Email field must be set')

        user = self.create_user(email, password, **kwargs)

        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user


class User(AbstractUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('customer', 'Customer'),
        ('seller', 'Seller'),
        ('admin', 'Admin'),
    )

    STATUS_CHOICES = (
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('banned', 'Banned'),
    )

    GENDER_CHOICES = (
        ('male', 'Male'),
        ('female', 'Female'),
    )

    id = models.AutoField(primary_key=True)
    role = models.CharField(max_length=150, choices=ROLE_CHOICES)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)

    email_verified = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.email

    @property
    def name(self):
        return f"{self.first_name} {self.last_name}"


class SavedAddress(models.Model):
    ADDRESS_CHOICES = (
        ('billing', 'Billing'),
        ('shipping', 'Shipping'),
    )

    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_addresses')
    address_type = models.CharField(max_length=20, choices=ADDRESS_CHOICES)
    full_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=15)
    country = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    street = models.CharField(max_length=200)
    postal_code = models.CharField(max_length=20)
    is_default = models.BooleanField(default=False)

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if self.is_default:
            SavedAddress.objects.filter(
                user=self.user,
                is_default=True).exclude(is_default=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.street}, {self.city}, {self.country}"


class PaymentMethod(models.Model):
    PROVIDER_CHOICES = (
        ('stripe', 'Stripe'),
        ('razorpay', 'Razorpay'),
        ('paypal', 'PayPal'),
    )

    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payment_methods')
    provider = models.CharField(max_length=20, choices=PROVIDER_CHOICES)
    payment_token = models.CharField(max_length=255)
    card_brand = models.CharField(max_length=50, null=True, blank=True)
    last4 = models.CharField(max_length=4, null=True, blank=True)
    expiry_month = models.IntegerField(null=True, blank=True)
    expiry_year = models.IntegerField(null=True, blank=True)

    is_default = models.BooleanField(default=False)

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def clean(self):
        today = date.today()
        if self.expiry_year < today.year or (self.expiry_year == today.year and self.expiry_month < today.month):
            raise ValidationError("Payment method has expired.")

    def save(self, *args, **kwargs):
        if self.is_default:
            PaymentMethod.objects.filter(
                user=self.user,
                is_default=True).exclude(pk=self.pk).update(is_default=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.provider} - ****{self.last4}"

    class Meta:
        unique_together = ('user', 'provider', 'payment_token')


class Review(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    car = models.ForeignKey('cars.Car', on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'car')
        indexes = [
            models.Index(fields=['car', 'status']),
        ]

    def __str__(self):
        return f"Review {self.id} - User: {self.user.email} - Car: {self.car.title}"


class Wishlist(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlist')
    car = models.ForeignKey('cars.Car', on_delete=models.CASCADE, related_name='wishlist')

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'car')
        indexes = [
            models.Index(fields=['user']),
        ]

    def __str__(self):
        return f"Wishlist Item {self.id} - User: {self.user.email} - Car: {self.car.title}"


class Inquiry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    car = models.ForeignKey('cars.Car', on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Inquiry by {self.user.username} for {self.car.title}"