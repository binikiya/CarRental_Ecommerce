import api from './api';

export const getCars = async () => {
    const response = await api.get('/cars/car/');
    
    return response.data.map((car: any) => ({
        ...car,
        category_name: car.category_details?.name || 'Uncategorized',
        displayImage: car.images?.find((img: any) => img.is_primary)?.image_url || car.images[0]?.image_url || "placeholder.jpg",
        
        name: car.title
    }));
};

export const getCarById = async (id: string) => {
    const response = await api.get(`/cars/car/${id}/`);
    const car = response.data;

    return {
        ...car,
        category_name: car.category_details?.name || 'Uncategorized',
        displayImage: car.images?.find((img: any) => img.is_primary)?.image_url || car.images[0]?.image_url || "/placeholder.jpg"
    };
};

export const createCar = async (carData: any) => {
    const response = await api.post('/cars/car/', carData);
    return response.data; 
};

export const uploadCarImage = async (carId: number, imageUrl: string, isPrimary: boolean) => {
    const response = await api.post('/cars/car-image/', {
        car: carId,
        image_url: imageUrl,
        is_primary: isPrimary
    });
    return response.data;
};

export const deleteCar = async (id: number) => {
    const response = await api.delete(`/cars/car/${id}/`);
    return response.data;
};

export const updateCar = async (id: number, carData: any) => {
    const response = await api.patch(`/cars/car/${id}/`, carData);
    return response.data;
};

export const getCarDetails = async (id: string) => {
    const response = await api.get(`/cars/car/${id}/`);
    return response.data;
};

export const getFilteredCars = async (params: any) => {
    const response = await api.get('/cars/car/', { params });
    return response.data;
};

export const getAdminAnalytics = async () => {
    const response = await api.get('/seller/analytics/'); 
    return response.data;
};

export const getSellers = () => api.get('/seller/');
export const updateSellerStatus = (id: number, status: 'pending' | 'approved' | 'rejected') => 
    api.patch(`/seller/${id}/update_verification/`, { status });

export const getAuditLogs = () => api.get('/seller/audit/');

export const getCommissions = () => api.get('/seller/commission/');
export const markCommissionPaid = (id: number) => api.patch(`/seller/commission/${id}/mark_as_paid/`);

export const getDisputes = () => api.get('/seller/disputes/');
export const resolveDispute = (id: number) => api.patch(`/seller/disputes/${id}/resolve/`);

export const getAllUsers = () => api.get('/users/');
export const updateUserRole = (id: number, role: string) => api.patch(`/users/${id}/update_role/`, { role });

export const exportCommissionCSV = () => api.get('/seller/commission/export_csv/', { responseType: 'blob' });

export const getOrders = () => api.get('/orders/');
export const requestOrderCancel = (orderId: number) => api.patch(`/orders/${orderId}/request_cancel/`);
export const updateOrderStatus = (id: number, status: string) => 
    api.patch(`/orders/${id}/change_status/`, { status });

export const getSellerProfile = () => api.get('/seller/retrieve/');
export const updateSellerProfile = (data: any) => api.patch('/seller/update/', data);

// Customer Dashboard
export const getDashboardSummary = () => api.get('/orders/dashboard/');

// Wishlists
export const getWishlist = () => api.get('/users/wishlist/');
export const toggleWishlist = (car_id: number) => api.post('/users/wishlist/toggle/', { car_id });

// Addresses
export const getAddresses = () => api.get('/users/saved-addresses/');
export const addAddress = (data: any) => api.post('/users/saved-addresses/', data);
export const deleteAddress = (id: number) => api.delete(`/users/saved-addresses/${id}/`);
export const setDefaultAddress = (id: number) => api.post(`/users/saved-addresses/${id}/set_default/`);

// Payments
export const getPayments = () => api.get('/users/payment-methods/');
export const addPayments = (data: any) => api.post('/users/payment-methods/', data);
export const deletePayment = (id: number) => api.delete(`/users/payment-methods/${id}/`);
export const setDefaultPayment = (id: number) => api.post(`/users/payment-methods/${id}/set_default/`);

// Reviews
export const getMyReviews = () => api.get('/users/reviews/');
export const updateReview = (id: number, data: any) => api.patch(`/users/reviews/${id}/`, data);
export const deleteReview = (id: number) => api.delete(`/users/reviews/${id}/`);

// User Profile
export const getProfile = () => api.get('/users/me/');
export const updateProfile = (data: any) => api.patch('/users/me/', data);
export const changePassword = (data: any) => api.post('/users/change-password/', data);
export const deactivateAccount = () => api.post('/users/deactivate/');

// Inquiry
export const bookCar = (id: number) => api.post(`/cars/car/${id}/book_car/`);
export const contactSeller = (id: number, message: string) => api.post(`/cars/car/${id}/contact_seller/`, { message });