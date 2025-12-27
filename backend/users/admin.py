from django.contrib import admin
from .models import User, SavedAddress, PaymentMethod

admin.site.register(User)
admin.site.register(SavedAddress)
admin.site.register(PaymentMethod)