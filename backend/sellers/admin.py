from django.contrib import admin
from .models import Seller, Commission, AuditLog

admin.site.register(Seller)
admin.site.register(Commission)
admin.site.register(AuditLog)