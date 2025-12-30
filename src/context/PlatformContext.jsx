import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminService } from '../services/admin.service';
import { useToast } from './ToastContext';

const PlatformContext = createContext();

export const PlatformProvider = ({ children }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [health, setHealth] = useState(null);
    const [pendingKYC, setPendingKYC] = useState([]);
    const [pendingWithdrawals, setPendingWithdrawals] = useState([]);

    const toast = useToast();

    const refreshData = async (range = 'ALL') => {
        try {
            // Don't set global loading true on refresh to avoid flickering if already loaded
            // setLoading(true); 
            const [statsData, healthData, kycData, withdrawalData] = await Promise.all([
                adminService.getStats(range),
                adminService.getSystemHealth(),
                adminService.getPendingKYC(),
                adminService.getWithdrawals()
            ]);
            setStats(statsData || {});
            setHealth(healthData || {});
            setPendingKYC(Array.isArray(kycData) ? kycData : []);

            // Filter only pending withdrawals for the dashboard Capital Clearance section
            const withdrawals = Array.isArray(withdrawalData) ? withdrawalData : [];
            const pendingOnly = withdrawals.filter(w => w.status === 'Pending');
            setPendingWithdrawals(pendingOnly);
        } catch (error) {
            console.error('Failed to fetch platform data:', error);
            // Optional: toast.error('Failed to sync data');
        } finally {
            setLoading(false);
        }
    };

    const handleApproveKYC = async (kycId) => {
        try {
            await adminService.approveKYC(kycId);
            toast.success('KYC Approved Successfully');
            await refreshData();
        } catch (error) {
            console.error('KYC Approval failed:', error);
            toast.error('Failed to approve KYC');
            throw error; // Rethrow for UI loading state
        }
    };

    const handleRejectKYC = async (kycId) => {
        try {
            await adminService.rejectKYC(kycId);
            toast.success('KYC Rejected Successfully');
            await refreshData();
        } catch (error) {
            console.error('KYC Rejection failed:', error);
            toast.error('Failed to reject KYC');
            throw error;
        }
    };

    const handleReleaseWithdrawal = async (txId) => {
        try {
            await adminService.approveWithdrawal(txId);
            toast.success('Funds Released Successfully');
            await refreshData();
        } catch (error) {
            console.error('Withdrawal release failed:', error);
            toast.error('Failed to release funds');
            throw error;
        }
    };

    const handleRejectWithdrawal = async (txId, reason) => {
        try {
            await adminService.rejectWithdrawal(txId, reason);
            toast.success('Withdrawal Rejected');
            await refreshData();
        } catch (error) {
            console.error('Withdrawal rejection failed:', error);
            toast.error('Failed to reject withdrawal');
            throw error;
        }
    };

    const handleToggleSystemFreeze = async () => {
        try {
            await adminService.toggleSystemFreeze();
            toast.success('System Status Updated');
            await refreshData();
        } catch (error) {
            console.error('System freeze toggle failed:', error);
            toast.error('Details update failed');
        }
    };

    const handleCreateStrategy = async (plan) => {
        try {
            await adminService.createInvestmentPlan(plan);
            toast.success('New Strategy Created');
            await refreshData();
        } catch (error) {
            console.error('Strategy creation failed:', error);
            toast.error('Failed to create plan');
        }
    };

    const handleRevokeSession = async (userId) => {
        try {
            await adminService.revokeUserSession(userId);
            toast.success('Admin Session Revoked');
            await refreshData();
        } catch (error) {
            console.error('Session revocation failed:', error);
            toast.error('Failed to revoke session');
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    return (
        <PlatformContext.Provider value={{
            stats,
            health,
            loading,
            refreshData,
            pendingKYC,
            pendingWithdrawals,
            handleApproveKYC,
            handleRejectKYC,
            handleReleaseWithdrawal,
            handleRejectWithdrawal,
            handleToggleSystemFreeze,
            handleCreateStrategy,
            handleRevokeSession
        }}>
            {children}
        </PlatformContext.Provider>
    );
};

export const usePlatform = () => useContext(PlatformContext);
