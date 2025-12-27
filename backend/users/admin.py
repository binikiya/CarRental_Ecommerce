from django.contrib import admin
from .models import User, SavedAddress, PaymentMethod, Review, Wishlist

admin.site.register(User)
admin.site.register(SavedAddress)
admin.site.register(PaymentMethod)
admin.site.register(Review)
admin.site.register(Wishlist)