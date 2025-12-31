import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Users, CheckCircle2, XCircle, Activity, RefreshCw, Zap } from 'lucide-react';
import { adminService } from '../../services/admin.service';
import { toast } from 'sonner';

const InvestmentAnalytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [triggering, setTriggering] = useState(false);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const data = await adminService.getInvestmentAnalytics();
            setAnalytics(data);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
            toast.error('Failed to load investment analytics');
        } finally {
            setLoading(false);
        }
    };

    const handleTriggerPayouts = async () => {
        try {
            setTriggering(true);
            await adminService.triggerPayouts();
            toast.success('Payouts triggered successfully');
            fetchAnalytics(); // Refresh data
        } catch (error) {
            console.error('Failed to trigger payouts:', error);
            toast.error('Failed to trigger payouts');
        } finally {
            setTriggering(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (!analytics) return null;

    const stats = [
        {
            label: 'Total Locked',
            value: `$${(analytics.totalLocked / 1000).toFixed(1)}K`,
            icon: DollarSign,
            color: 'blue'
        },
        {
            label: 'Total Paid Out',
            value: `$${(analytics.totalPaid / 1000).toFixed(1)}K`,
            icon: TrendingUp,
            color: 'emerald'
        },
        {
            label: 'Active Investments',
            value: analytics.activeCount,
            icon: Activity,
            color: 'amber'
        },
        {
            label: 'Completed',
            value: analytics.completedCount,
            icon: CheckCircle2,
            color: 'green'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Investment Analytics</h2>
                <button
                    onClick={handleTriggerPayouts}
                    disabled={triggering}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all"
                >
                    {triggering ? (
                        <>
                            <RefreshCw size={16} className="animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <Zap size={16} />
                            Trigger Payouts
                        </>
                    )}
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    {stat.label}
                                </span>
                                <div className={`w-10 h-10 rounded-lg bg-${stat.color}-50 flex items-center justify-center`}>
                                    <Icon className={`w-5 h-5 text-${stat.color}-600`} />
                                </div>
                            </div>
                            <div className="text-2xl font-black text-gray-900">{stat.value}</div>
                        </div>
                    );
                })}
            </div>

            {/* Investment Distribution */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Investment Distribution by Plan</h3>
                <div className="space-y-3">
                    {analytics.distribution && analytics.distribution.length > 0 ? (
                        analytics.distribution.map((plan, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-bold text-gray-900">{plan.planName}</p>
                                    <p className="text-sm text-gray-500">{plan.count} investors</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-blue-600">${(plan.total / 1000).toFixed(1)}K</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-400 py-8">No active investments yet</p>
                    )}
                </div>
            </div>

            {/* Recent Payouts */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Payouts</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-2 px-3 text-xs font-bold text-gray-500 uppercase">Date</th>
                                <th className="text-left py-2 px-3 text-xs font-bold text-gray-500 uppercase">User</th>
                                <th className="textleft py-2 px-3 text-xs font-bold text-gray-500 uppercase">Type</th>
                                <th className="text-right py-2 px-3 text-xs font-bold text-gray-500 uppercase">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analytics.recentPayouts && analytics.recentPayouts.slice(0, 10).map((payout, idx) => (
                                <tr key={idx} className="border-b border-gray-100">
                                    <td className="py-3 px-3 text-sm text-gray-600">
                                        {new Date(payout.date).toLocaleDateString()}
                                    </td>
                                    <td className="py-3 px-3 text-sm text-gray-900 font-medium">
                                        {payout.user?.email || 'N/A'}
                                    </td>
                                    <td className="py-3 px-3">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${payout.type === 'daily' ? 'bg-blue-100 text-blue-700' :
                                            payout.type === 'withdrawal' ? 'bg-rose-100 text-rose-700' :
                                                'bg-emerald-100 text-emerald-700'
                                            }`}>
                                            {payout.type}
                                        </span>
                                    </td>
                                    <td className="py-3 px-3 text-right text-sm font-bold text-emerald-600">
                                        ${payout.amount.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InvestmentAnalytics;
