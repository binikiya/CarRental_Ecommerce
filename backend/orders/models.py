from django.db import models
from users.models import User
from django.core.exceptions import ValidationError


class Order(models.Model):
    ORDER_CHOICES = (
        ('rent', 'Rent'),
        ('sell', 'Sell'),
    )

    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('canceled', 'Canceled'),
        ('completed', 'Completed'),
    )

    PAYMENT_PROVIDER_CHOICES = (
        ('stripe', 'Stripe'),
        ('paypal', 'PayPal'),
        ('razorpay', 'Razorpay'),
    )

    id = models.AutoField(primary_key=True)
    order_number = models.CharField(max_length=100, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    seller = models.ForeignKey('sellers.Seller', on_delete=models.CASCADE, related_name='orders')
    order_type = models.CharField(max_length=50, choices=ORDER_CHOICES)
    payment_status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_provider = models.CharField(max_length=50, choices=PAYMENT_PROVIDER_CHOICES, null=True, blank=True)
    billing_address_json = models.JSONField(null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)
    payment_reference = models.CharField(max_length=255, null=True, blank=True)

    paid_at = models.DateTimeField(null=True, blank=True)
    canceled_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def clean(self):
        if self.quantity <= 0:
            raise ValidationError("Quantity must be greater than zero.")
        if self.total_amount < 0:
            raise ValidationError("Total amount cannot be negative.")

    def __str__(self):
        return f"Order {self.id} - {self.user.email} - {self.status}"


class OrderItem(models.Model):
    id = models.AutoField(primary_key=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='order_items')
    car = models.ForeignKey("cars.Car", on_delete=models.PROTECT, related_name='order_items')
    price_snapshot = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)

    rental_start_date = models.DateField(null=True, blank=True)
    rental_end_date = models.DateField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        if self.quantity <= 0:
            raise ValidationError("Quantity must be greater than zero.")
        if self.price_snapshot < 0:
            raise ValidationError("Price cannot be negative.")
        if self.order.order_type == 'rent':
            if not self.rental_start_date or not self.rental_end_date:
                raise ValidationError("Rental start and end dates must be provided for rental orders.")
            if self.rental_start_date >= self.rental_end_date:
                raise ValidationError("Rental end date must be after start date.")
            if self.quantity != 1:
                raise ValidationError("Quantity must be 1 for rental orders.")

    def __str__(self):
        return f"OrderItem {self.id} - Order {self.order.id} - Car {self.car.title}"


class Payment(models.Model):
    PAYMENT_STATUS_CHOICES = (
        ('initiated', 'Initiated'),
        ('successful', 'Successful'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    )

    CURRENCY_CHOICES = (
        ('USD', 'US Dollar'),
        ('EUR', 'Euro'),
        ('GBP', 'British Pound'),
    )

    id = models.AutoField(primary_key=True)
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='payment')
    payment_provider = models.CharField(max_length=50, choices=Order.PAYMENT_PROVIDER_CHOICES)
    transaction_id = models.CharField(max_length=255, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, choices=CURRENCY_CHOICES, default='USD')
    status = models.CharField(max_length=50, choices=PAYMENT_STATUS_CHOICES, default='initiated')

    paid_at = models.DateTimeField(null=True, blank=True)
    initiated_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['order']),
            models.Index(fields=['status']),
            models.Index(fields=['payment_provider']),
        ]

    def clean(self):
        if self.amount < 0:
            raise ValidationError("Payment amount cannot be negative.")

    def __str__(self):
        return f"Payment {self.id} - Order {self.order.id} - {self.status}"