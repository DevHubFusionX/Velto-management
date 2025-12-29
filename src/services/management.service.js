import api from './api';

export const managementService = {
    // User Management
    getUsers: async () => {
        const response = await api.get('/admin/users');
        return response.data;
    },
    updateUserStatus: async (userId, status) => {
        const response = await api.put(`/admin/users/${userId}/status`, { status });
        return response.data;
    },
    approveKYC: async (userId) => {
        const response = await api.post(`/admin/users/${userId}/approve-kyc`);
        return response.data;
    },

    // Investment Management
    getPlans: async () => {
        const response = await api.get('/admin/plans');
        return response.data;
    },
    createPlan: async (planData) => {
        const response = await api.post('/admin/plans', planData);
        return response.data;
    },
    updatePlanStatus: async (planId, status) => {
        const response = await api.put(`/admin/plans/${planId}/status`, { status });
        return response.data;
    },

    // Withdrawal Management
    getWithdrawals: async () => {
        const response = await api.get('/admin/withdrawals');
        return response.data;
    },
    processWithdrawal: async (withdrawalId, action) => {
        // action: 'approve' | 'reject'
        const response = await api.post(`/admin/withdrawals/${withdrawalId}/${action}`);
        return response.data;
    }
};
