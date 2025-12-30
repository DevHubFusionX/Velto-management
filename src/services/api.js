import axios from 'axios';
import { toast } from 'sonner';

const rawBaseURL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'https://velto-backend.onrender.com/api';
const baseURL = rawBaseURL.endsWith('/') ? rawBaseURL : `${rawBaseURL}/`;

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('admin_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message || 'Something went wrong';

        if (error.response?.status === 401) {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
            toast.error('Session expired. Please login again.');
            window.location.href = '/login';
        } else if (error.response?.status === 503) {
            // Maintenance mode handling
            toast.info('System is undergoing maintenance. Please try again later.');
        } else {
            // Don't show toast for 405 here if we want to debug, but generally useful
            // However, the Login page handles its own errors too.
            // toast.error(message);
        }
        return Promise.reject(error);
    }
);

export default api;
