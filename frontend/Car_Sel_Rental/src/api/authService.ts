import axios from 'axios';

const API_URL = 'http://localhost:8000/users/login/';

export const login = async (email: string, password: string) => {
    const response = await axios.post(API_URL, { email, password });
    if (response.data.access) {
        localStorage.setItem('role', response.data.user.role);
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('user', JSON.stringify(response.data.user)); 
    }
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
};