import api from './api';

export const adminService = {
    // --- Dashboard & System Stats ---
    getStats: async (range = 'ALL') => {
        const response = await api.get(`/admin/stats?range=${range}`);
        return response.data;
    },

    getSystemHealth: async () => {
        const response = await api.get('/admin/health');
        return response.data;
    },

    getLogs: async () => {
        const response = await api.get('/admin/logs');
        return response.data;
    },

    // --- User Management ---
    getUsers: async () => {
        const response = await api.get('/admin/users');
        return response.data;
    },

    getUserDetails: async (userId) => {
        const response = await api.get(`/admin/users/${userId}/details`);
        return response.data;
    },

    updateUserBalance: async (userId, amount, type, reason) => {
        const response = await api.post(`/admin/users/${userId}/balance`, { amount, type, reason });
        return response.data;
    },

    suspendUser: async (userId, reason) => {
        const response = await api.post(`/admin/users/${userId}/suspend`, { reason });
        return response.data;
    },

    activateUser: async (userId) => {
        const response = await api.post(`/admin/users/${userId}/activate`);
        return response.data;
    },

    deleteUser: async (userId) => {
        const response = await api.delete(`/admin/users/${userId}`);
        return response.data;
    },

    revokeUserSession: async (userId) => {
        const response = await api.post(`/admin/users/${userId}/revoke-session`);
        return response.data;
    },

    // --- KYC Management ---
    getPendingKYC: async () => {
        const response = await api.get('/admin/kyc/pending');
        return response.data;
    },

    approveKYC: async (kycId) => {
        const response = await api.post(`/admin/kyc/${kycId}/approve`);
        return response.data;
    },

    rejectKYC: async (kycId) => {
        const response = await api.post(`/admin/kyc/${kycId}/reject`);
        return response.data;
    },

    // --- Transaction Management (Deposits) ---
    getDeposits: async () => {
        const response = await api.get('/admin/deposits');
        return response.data;
    },

    approveDeposit: async (depositId, data) => {
        const response = await api.post(`/admin/deposits/${depositId}/approve`, data);
        return response.data;
    },

    rejectDeposit: async (depositId, reason) => {
        const response = await api.post(`/admin/deposits/${depositId}/reject`, { reason });
        return response.data;
    },

    // --- Transaction Management (Withdrawals) ---
    getWithdrawals: async () => {
        const response = await api.get('/admin/withdrawals');
        return response.data;
    },

    approveWithdrawal: async (transactionId) => {
        // Updated to use the correct /release endpoint defined in routes
        const response = await api.post(`/admin/withdrawals/${transactionId}/release`);
        return response.data;
    },

    rejectWithdrawal: async (transactionId, reason) => {
        const response = await api.post(`/admin/withdrawals/${transactionId}/reject`, { reason });
        return response.data;
    },

    // --- Investment System & Strategy ---
    getInvestmentPlans: async () => {
        const response = await api.get('/investments/plans/admin/list');
        return response.data;
    },

    createInvestmentPlan: async (plan) => {
        const response = await api.post('/investments/plans', plan);
        return response.data;
    },

    updateInvestmentPlan: async (id, plan) => {
        const response = await api.put(`/investments/plans/${id}`, plan);
        return response.data;
    },

    deleteInvestmentPlan: async (id) => {
        const response = await api.delete(`/investments/plans/${id}`);
        return response.data;
    },

    toggleInvestmentPlanStatus: async (id, status) => {
        const response = await api.patch(`/investments/plans/${id}/status`, { status });
        return response.data;
    },

    getAllUserInvestments: async () => {
        const response = await api.get('/investments/admin/all');
        return response.data;
    },

    getInvestmentAnalytics: async () => {
        const response = await api.get('/admin/analytics/investments');
        return response.data;
    },

    triggerPayouts: async () => {
        const response = await api.post('/admin/payouts/trigger');
        return response.data;
    },

    getPayoutLogs: async (limit = 100) => {
        const response = await api.get(`/admin/payouts/logs?limit=${limit}`);
        return response.data;
    },

    // --- Settings & Security ---
    getSettings: async () => {
        const response = await api.get('/admin/settings');
        return response.data;
    },

    updateSettings: async (settings) => {
        const response = await api.put('/admin/settings', settings);
        return response.data;
    },

    toggleSystemFreeze: async () => {
        const response = await api.post('/admin/system/toggle-freeze');
        return response.data;
    },

    addWhitelistedIp: async (ip) => {
        const response = await api.post('/admin/settings/whitelist/add', { ip });
        return response.data;
    },

    removeWhitelistedIp: async (ip) => {
        const response = await api.post('/admin/settings/whitelist/remove', { ip });
        return response.data;
    },

    getMyIp: async () => {
        const response = await api.get('/admin/security/my-ip');
        return response.data;
    },

    // --- Notifications ---
    getAdminNotifications: async () => {
        const response = await api.get('/admin/notifications');
        return response.data;
    },

    markAdminNotificationRead: async (id) => {
        const response = await api.patch(`/admin/notifications/${id}/read`);
        return response.data;
    },

    markAllAdminNotificationsRead: async () => {
        const response = await api.post('/admin/notifications/mark-all-read');
        return response.data;
    }
};
