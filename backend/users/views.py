from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework.decorators import action
from django.contrib.auth.hashers import check_password
from rest_framework.response import Response
from rest_framework import status
from .models import User, SavedAddress, PaymentMethod, Review, Wishlist
from .serializers import UserSerializer, SavedAddressSerializer, PaymentMethodSerializer, ReviewSerializer, WishlistSerializer


class UserListView(viewsets.ModelViewSet):
    http_method_names = ['patch', 'get', 'put', 'delete']
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated,]

    def get_queryset(self):
        if self.request.user.is_superuser:
            return User.objects.all()
        return User.objects.exclude(is_superuser=True)

    def get_object(self):
        obj = User.objects.get_object_by_public_id(self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj
    
    @action(detail=False, methods=['get', 'patch'], url_path='me')
    def manage_profile(self, request):
        user = request.user
        if request.method == 'GET':
            serializer = self.get_serializer(user)
            return Response(serializer.data)
        
        serializer = self.get_serializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='change-password')
    def change_password(self, request):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        if not check_password(old_password, user.password):
            return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({"status": "password changed"})

    @action(detail=False, methods=['post'], url_path='deactivate')
    def deactivate_account(self, request):
        user = request.user
        user.is_active = False
        user.save()
        return Response({"status": "account deactivated"})


class SavedAddressViewSet(viewsets.ModelViewSet):
    queryset = SavedAddress.objects.all()
    serializer_class = SavedAddressSerializer
    permission_classes = [IsAuthenticated,]

    def get_queryset(self):
        return SavedAddress.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        is_first = not SavedAddress.objects.filter(user=self.request.user).exists()
        serializer.save(user=self.request.user, is_default=is_first)

    @action(detail=True, methods=['post'])
    def set_default(self, request, pk=None):
        address = self.get_object()
        SavedAddress.objects.filter(user=request.user).update(is_default=False)
        address.is_default = True
        address.save()
        return Response({'status': 'Default address updated'})

    def get_object(self):
        obj = SavedAddress.objects.get_object_by_public_id(self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj


class PaymentMethodViewSet(viewsets.ModelViewSet):
    queryset = PaymentMethod.objects.all()
    serializer_class = PaymentMethodSerializer
    permission_classes = [IsAuthenticated,]

    def get_queryset(self):
        return PaymentMethod.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        if serializer.validated_data.get('is_default'):
            PaymentMethod.objects.filter(user=self.request.user).update(is_default=False)
        serializer.save(user=self.request.user)

    def get_object(self):
        obj = PaymentMethod.objects.get_object_by_public_id(self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated,]

    def get_queryset(self):
        return Review.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_update(self, serializer):
        serializer.save(status='pending')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, status='pending')

    def get_object(self):
        obj = Review.objects.get_object_by_public_id(self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj


class WishlistViewSet(viewsets.ModelViewSet):
    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated,]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_object(self):
        obj = Wishlist.objects.get_object_by_public_id(self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj

    @action(detail=False, methods=['post'])
    def toggle(self, request):
        car_id = request.data.get('car_id')
        wishlist_item = Wishlist.objects.filter(user=request.user, car_id=car_id)

        if wishlist_item.exists():
            wishlist_item.delete()
            return Response({'status': 'removed', 'message': 'Removed from wishlist'})

        Wishlist.objects.create(user=request.user, car_id=car_id)
        return Response({'status': 'added', 'message': 'Added to wishlist'})