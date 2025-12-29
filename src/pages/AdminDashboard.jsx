import React from 'react';
import {
    Terminal,
    Loader2,
    RefreshCw
} from 'lucide-react';
import { cn } from '../utils';
import StatCard from '../components/dashboard/StatCard';
import InvestmentChart from '../components/dashboard/InvestmentChart';
import RevenueBreakdown from '../components/dashboard/RevenueBreakdown';
import KYCQueue from '../components/dashboard/KYCQueue';
import WithdrawalQueue from '../components/dashboard/WithdrawalQueue';
import DashboardActions from '../components/dashboard/DashboardActions';
import { usePlatform } from '../context/PlatformContext';

const AdminDashboard = () => {
    const { stats, loading, refreshData, pendingKYC, pendingWithdrawals } = usePlatform();

    if (loading && !stats) {
        return (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest animate-pulse">Syncing Audit Data...</p>
            </div>
        );
    }

    const displayStats = stats ? [
        { title: 'Total Users', value: stats.users.total.toLocaleString(), change: stats.users.change, trend: stats.users.trend },
        { title: 'Pending KYC', value: stats.kyc.pending, change: stats.kyc.change, trend: stats.kyc.trend },
        { title: 'Active Investments', value: `₦${(stats.investments.totalValue / 1000).toFixed(1)}K`, change: `${stats.investments.active} active`, trend: stats.investments.trend },
        { title: 'Clearance Queue', value: `₦${(stats.withdrawals.pending / 1000).toFixed(1)}K`, change: stats.withdrawals.change, trend: stats.withdrawals.trend },
    ] : [];

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-700">
            {/* Header HUD */}
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Executive Overview</h2>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1 italic">Real-time system performance telemetry</p>
                </div>
                <button
                    onClick={refreshData}
                    className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-blue-600 hover:border-blue-100 shadow-sm transition-all active:scale-95 group"
                >
                    <RefreshCw size={18} className={cn(loading && "animate-spin")} />
                </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayStats.map((stat, i) => (
                    <div key={i} className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${i * 100}ms` }}>
                        <StatCard {...stat} />
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <InvestmentChart data={stats?.revenue.growth} />
                <RevenueBreakdown data={stats?.revenue.breakdown} total={stats ? `${(stats.users.totalBalance / 1000000).toFixed(2)}M` : '0'} />
            </div>

            {/* Bottom Section: Tables Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <KYCQueue requests={pendingKYC} />
                <WithdrawalQueue requests={pendingWithdrawals} />
            </div>

            {/* Quick Actions Bar */}
            <DashboardActions />
        </div>
    );
};

export default AdminDashboard;
