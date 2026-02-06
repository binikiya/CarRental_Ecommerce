from django.db import models
from users.models import User
from orders.models import Order


class Seller(models.Model):
    VERIFICATION_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )

    id = models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='seller')
    company_name = models.CharField(max_length=255)
    business_email = models.EmailField(unique=True)
    business_phone = models.CharField(max_length=20)
    verification_status = models.CharField(max_length=50, choices=VERIFICATION_CHOICES, default='pending')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.company_name


class Commission(models.Model):
    id = models.AutoField(primary_key=True)
    seller = models.ForeignKey(Seller, on_delete=models.CASCADE, related_name='commissions')
    order = models.ForeignKey(Order, on_delete=models.PROTECT, related_name='commissions')
    percentage = models.DecimalField(max_digits=5, decimal_places=2)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    paid = models.BooleanField(default=False)
    paid_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Commission {self.id} - Seller: {self.seller.company_name} - Percentage: {self.percentage}"


class AuditLog(models.Model):
    ACTION_CHOICES = (
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('create', 'Create'),
        ('update', 'Update'),
        ('delete', 'Delete'),
        ('payment', 'Payment'),
        ('order', 'Order'),
    )

    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='audit_logs')
    user_agent = models.CharField(null=True, blank=True, max_length=255)
    action = models.CharField(max_length=255, choices=ACTION_CHOICES)
    ip_address = models.GenericIPAddressField()

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"AuditLog {self.id} - {self.user.email} - {self.action}"