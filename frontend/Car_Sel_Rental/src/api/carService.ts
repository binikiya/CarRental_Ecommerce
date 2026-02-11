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