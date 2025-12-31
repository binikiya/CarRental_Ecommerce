from . import views
from authenticate.views import RegisterViewSet, LoginViewSet, RefreshTokenViewSet
from rest_framework import routers

router = routers.SimpleRouter()

# Register, Login, and Refresh all viewsets
router.register(r'register', RegisterViewSet, basename='register')
router.register(r'login', LoginViewSet, basename='login')
router.register(r'refresh', RefreshTokenViewSet, basename='refresh')

# SavedAddress, PaymentMethod, Review, and Wishlist viewsets
router.register(r'saved-addresses', views.SavedAddressViewSet, basename='saved-address')
router.register(r'payment-methods', views.PaymentMethodViewSet, basename='payment-method')
router.register(r'reviews', views.ReviewViewSet, basename='review')
router.register(r'wishlist', views.WishlistViewSet, basename='wishlist')

# User list viewset
router.register(r'', views.UserListView, basename='user')


urlpatterns = [
    *router.urls,
]