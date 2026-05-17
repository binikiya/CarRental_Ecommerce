from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Car

@receiver(post_save, sender=Car)
def notify_seller_low_stock(sender, instance, **kwargs):
    # Only trigger if stock is 0 or low
    if instance.quantity == 0:
        print(f"CRITICAL: {instance.title} is SOLD OUT. Notifying seller {instance.seller.user.email}")
        # Here you would call your email function:
        # send_mail('Car Sold Out', f'Your {instance.title} is now out of stock.', ...)
    elif instance.quantity <= 2:
        print(f"WARNING: {instance.title} is low on stock ({instance.quantity} left).")