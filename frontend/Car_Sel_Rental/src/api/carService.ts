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