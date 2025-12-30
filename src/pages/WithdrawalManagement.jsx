import React, { useState, useEffect } from 'react';
import {
    CheckCircle2,
    XCircle,
    Clock,
    ExternalLink,
    ShieldCheck,
    Zap,
    Filter,
    ArrowRightLeft,
    Loader2,
    RefreshCw
} from 'lucide-react';
import { cn, formatCurrency } from '../utils';
import { adminService } from '../services/admin.service';
import WithdrawalDetailModal from '../components/WithdrawalDetailModal';
import { toast } from 'sonner';

const WithdrawalManagement = () => {
    const [activeTab, setActiveTab] = useState('All');
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        fetchWithdrawals();
    }, []);

    const fetchWithdrawals = async () => {
        try {
            setLoading(true);
            const data = await adminService.getWithdrawals();
            setWithdrawals(data);
        } catch (error) {
            console.error('Failed to fetch withdrawals:', error);
            toast.error('Failed to load withdrawals');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            setProcessingId(id);
            await adminService.approveWithdrawal(id);
            toast.success('Withdrawal approved successfully');
            await fetchWithdrawals();
        } catch (error) {
            console.error('Approval failed:', error);
            toast.error('Failed to approve withdrawal');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id) => {
        try {
            setProcessingId(id);
            await adminService.rejectWithdrawal(id, 'Administrative decision');
            toast.success('Withdrawal rejected');
            await fetchWithdrawals();
        } catch (error) {
            console.error('Rejection failed:', error);
            toast.error('Failed to reject withdrawal');
        } finally {
            setProcessingId(null);
        }
    };

    // Calculate stats
    const stats = {
        pendingTotal: withdrawals
            .filter(w => w.status === 'Pending')
            .reduce((sum, w) => sum + Math.abs(w.amount), 0),
        clearedToday: withdrawals
            .filter(w => {
                const today = new Date().toDateString();
                const txDate = new Date(w.date).toDateString();
                return w.status === 'Completed' && txDate === today;
            })
            .reduce((sum, w) => sum + Math.abs(w.amount), 0),
        pendingCount: withdrawals.filter(w => w.status === 'Pending').length
    };

    // Filter withdrawals based on active tab
    const filteredWithdrawals = activeTab === 'All'
        ? withdrawals
        : activeTab === 'Pending'
            ? withdrawals.filter(w => w.status === 'Pending')
            : activeTab === 'Completed'
                ? withdrawals.filter(w => w.status === 'Completed')
                : withdrawals.filter(w => w.status === 'Processing' || w.status === 'Rejected');

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        );
    }


    const handleViewDetails = (withdrawal) => {
        setSelectedWithdrawal(withdrawal);
        setShowDetailModal(true);
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header HUD */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-2">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-200">
                        <ArrowRightLeft size={32} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 tracking-tight leading-none">Withdrawal Requests</h2>
                        <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Financial Hub</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-gray-300" />
                            <span className="text-xs font-medium text-amber-600 flex items-center gap-1.5">
                                <Clock size={12} />
                                {stats.pendingCount} Pending Requests
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
                        {['All', 'Pending', 'Processing'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-6 py-2 rounded-lg text-xs font-bold transition-all",
                                    activeTab === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={fetchWithdrawals}
                        className="p-3 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-gray-500 transition-all shadow-sm"
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>
            </div>

            {/* Stats Summary HUD */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Pending Liquidation', value: `₦${(stats.pendingTotal / 1000).toFixed(1)}K`, color: 'text-amber-500', icon: Clock, bg: 'bg-amber-50' },
                    { label: 'Cleared Today', value: `₦${(stats.clearedToday / 1000).toFixed(1)}K`, color: 'text-emerald-500', icon: ShieldCheck, bg: 'bg-emerald-50' },
                    { label: 'Network Stability', value: '98.2%', color: 'text-blue-500', icon: Zap, bg: 'bg-blue-50' },
                ].map((stat, i) => (
                    <div key={i} className="premium-card p-6 flex items-center gap-6 group">
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm", stat.bg)}>
                            <stat.icon size={28} className={stat.color} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                            <p className={cn("text-2xl font-bold tracking-tight mt-1", stat.color)}>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Clearance Table */}
            <div className="premium-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-6 text-xs font-bold uppercase tracking-wider text-gray-400">Recipient</th>
                                <th className="px-8 py-6 text-xs font-bold uppercase tracking-wider text-gray-400">Value</th>
                                <th className="px-8 py-6 text-xs font-bold uppercase tracking-wider text-gray-400">Destination</th>
                                <th className="px-8 py-6 text-xs font-bold uppercase tracking-wider text-gray-400">Status</th>
                                <th className="px-8 py-6 text-xs font-bold uppercase tracking-wider text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-5">
                            {filteredWithdrawals.length > 0 ? (
                                filteredWithdrawals.map((req, index) => (
                                    <tr key={req._id} className="hover:bg-gray-50/50 transition-colors group animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${index * 50}ms` }}>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                                    {req.user?.name || req.user?.email || 'Unknown User'}
                                                </span>
                                                <span className="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-wider">
                                                    {new Date(req.date).toLocaleString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-900 tracking-tight">
                                                    ₦{Math.abs(req.amount).toLocaleString()}
                                                </span>
                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                                                    {req.method || 'Bank Transfer'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                                    <ExternalLink size={14} className="text-gray-400" />
                                                </div>
                                                <span className="text-xs font-medium text-gray-600 font-mono">
                                                    {req.description?.match(/to (.+?) -/)?.[1] || 'Bank Account'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className={cn(
                                                "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm",
                                                req.status === 'Completed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                    req.status === 'Pending' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                        req.status === 'Processing' ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                            "bg-rose-50 text-rose-600 border-rose-100"
                                            )}>
                                                <div className={cn("w-1.5 h-1.5 rounded-full",
                                                    req.status === 'Completed' ? "bg-emerald-500" :
                                                        req.status === 'Pending' ? "bg-amber-500" :
                                                            req.status === 'Processing' ? "bg-blue-500" : "bg-rose-500"
                                                )} />
                                                {req.status}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end gap-2">
                                                {req.status === 'Pending' ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(req._id)}
                                                            disabled={processingId === req._id}
                                                            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:opacity-90 disabled:opacity-50 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95 disabled:cursor-not-allowed"
                                                        >
                                                            {processingId === req._id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(req._id)}
                                                            disabled={processingId === req._id}
                                                            className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 border border-rose-100 text-rose-500 hover:bg-rose-100 disabled:opacity-50 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 disabled:cursor-not-allowed"
                                                        >
                                                            {processingId === req._id ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                                                            Reject
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => handleViewDetails(req)}
                                                        className="px-6 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-gray-700 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all"
                                                    >
                                                        Details
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-12 text-center text-gray-400 text-sm">
                                        No withdrawal requests found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <WithdrawalDetailModal
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                withdrawal={selectedWithdrawal}
            />
        </div>
    );
};

export default WithdrawalManagement;
