from django.contrib import admin
from .models import CarImage, Category, Brand, Car, RentalAvailability, Rental

admin.site.register(Category)
admin.site.register(Brand)
admin.site.register(Car)
admin.site.register(RentalAvailability)
admin.site.register(Rental)
admin.site.register(CarImage)