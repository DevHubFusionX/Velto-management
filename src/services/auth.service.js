import api from './api';

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('admin_token', response.data.token);
            localStorage.setItem('admin_user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        window.location.href = '/login';
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('admin_user'));
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('admin_token');
    },

    // 2FA Support
    setup2FA: async () => {
        const response = await api.post('/auth/2fa/setup');
        return response.data;
    },

    verify2FASetup: async (code) => {
        const response = await api.post('/auth/2fa/verify-setup', { code });
        return response.data;
    },

    disable2FA: async () => {
        const response = await api.post('/auth/2fa/disable');
        return response.data;
    },

    verify2FALogin: async (userId, code) => {
        const response = await api.post('/auth/2fa/verify-login', { userId, code });
        if (response.data.token) {
            localStorage.setItem('admin_token', response.data.token);
            localStorage.setItem('admin_user', JSON.stringify(response.data.user));
        }
        return response.data;
    }
};
