from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Order
from .helpers import send_order_notification

@receiver(post_save, sender=Order)
def notify_seller_on_new_order(sender, instance, created, **kwargs):
    if created:
        try:
            send_order_notification(instance)
        except Exception as e:
            print(f"Email failed to send: {e}")