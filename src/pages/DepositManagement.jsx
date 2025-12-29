import React, { useState, useEffect } from 'react';
import {
    CheckCircle2,
    XCircle,
    Clock,
    DollarSign,
    CreditCard,
    Landmark,
    Loader2,
    RefreshCw,
    Filter,
    Zap
} from 'lucide-react';
import { cn } from '../utils';
import { adminService } from '../services/admin.service';
import { toast } from 'sonner';

const DepositManagement = () => {
    const [activeTab, setActiveTab] = useState('All');
    const [deposits, setDeposits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        fetchDeposits();
    }, []);

    const fetchDeposits = async () => {
        try {
            setLoading(true);
            const data = await adminService.getDeposits();
            setDeposits(data);
        } catch (error) {
            console.error('Failed to fetch deposits:', error);
            toast.error('Failed to load deposits');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            setProcessingId(id);
            await adminService.approveDeposit(id);
            toast.success('Deposit approved successfully');
            await fetchDeposits();
        } catch (error) {
            console.error('Approval failed:', error);
            toast.error('Failed to approve deposit');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id) => {
        try {
            setProcessingId(id);
            await adminService.rejectDeposit(id, 'Invalid payment verification');
            toast.success('Deposit rejected');
            await fetchDeposits();
        } catch (error) {
            console.error('Rejection failed:', error);
            toast.error('Failed to reject deposit');
        } finally {
            setProcessingId(null);
        }
    };

    // Calculate stats
    const stats = {
        pendingTotal: deposits
            .filter(d => d.status === 'Pending')
            .reduce((sum, d) => sum + d.amount, 0),
        clearedToday: deposits
            .filter(d => {
                const today = new Date().toDateString();
                const txDate = new Date(d.date).toDateString();
                return d.status === 'Completed' && txDate === today;
            })
            .reduce((sum, d) => sum + d.amount, 0),
        pendingCount: deposits.filter(d => d.status === 'Pending').length
    };

    // Filter deposits based on active tab
    const filteredDeposits = activeTab === 'All'
        ? deposits
        : deposits.filter(d => d.status === activeTab);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-2">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                        <DollarSign size={32} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 tracking-tight leading-none">Deposit Requests</h2>
                        <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Payment Hub</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-gray-300" />
                            <span className="text-xs font-medium text-emerald-600 flex items-center gap-1.5">
                                <Clock size={12} />
                                {stats.pendingCount} Pending Verification
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
                        {['All', 'Pending', 'Completed', 'Rejected'].map((tab) => (
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
                        onClick={fetchDeposits}
                        className="p-3 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-gray-500 transition-all shadow-sm"
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Pending Verification', value: `₦${(stats.pendingTotal / 1000).toFixed(1)}K`, color: 'text-amber-500', icon: Clock, bg: 'bg-amber-50' },
                    { label: 'Approved Today', value: `₦${(stats.clearedToday / 1000).toFixed(1)}K`, color: 'text-emerald-500', icon: CheckCircle2, bg: 'bg-emerald-50' },
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

            {/* Deposits Table */}
            <div className="premium-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-6 text-xs font-bold uppercase tracking-wider text-gray-400">User</th>
                                <th className="px-8 py-6 text-xs font-bold uppercase tracking-wider text-gray-400">Amount</th>
                                <th className="px-8 py-6 text-xs font-bold uppercase tracking-wider text-gray-400">Method</th>
                                <th className="px-8 py-6 text-xs font-bold uppercase tracking-wider text-gray-400">Status</th>
                                <th className="px-8 py-6 text-xs font-bold uppercase tracking-wider text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredDeposits.length > 0 ? (
                                filteredDeposits.map((deposit, index) => (
                                    <tr key={deposit._id} className="hover:bg-gray-50/50 transition-colors group animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${index * 50}ms` }}>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                                    {deposit.user?.name || deposit.user?.email || 'Unknown User'}
                                                </span>
                                                <span className="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-wider">
                                                    {new Date(deposit.date).toLocaleString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-900 tracking-tight">
                                                    ₦{deposit.amount.toLocaleString()}
                                                </span>
                                                <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest mt-1">
                                                    {deposit.reference}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                                    {deposit.method === 'card' ? (
                                                        <CreditCard size={14} className="text-gray-400" />
                                                    ) : (
                                                        <Landmark size={14} className="text-gray-400" />
                                                    )}
                                                </div>
                                                <span className="text-xs font-medium text-gray-600 capitalize">
                                                    {deposit.method || 'Card'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className={cn(
                                                "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm",
                                                deposit.status === 'Completed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                    deposit.status === 'Pending' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                        "bg-rose-50 text-rose-600 border-rose-100"
                                            )}>
                                                <div className={cn("w-1.5 h-1.5 rounded-full",
                                                    deposit.status === 'Completed' ? "bg-emerald-500" :
                                                        deposit.status === 'Pending' ? "bg-amber-500" : "bg-rose-500"
                                                )} />
                                                {deposit.status}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end gap-2">
                                                {deposit.status === 'Pending' ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(deposit._id)}
                                                            disabled={processingId === deposit._id}
                                                            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:opacity-90 disabled:opacity-50 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95 disabled:cursor-not-allowed"
                                                        >
                                                            {processingId === deposit._id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(deposit._id)}
                                                            disabled={processingId === deposit._id}
                                                            className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 border border-rose-100 text-rose-500 hover:bg-rose-100 disabled:opacity-50 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 disabled:cursor-not-allowed"
                                                        >
                                                            {processingId === deposit._id ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                                                            Reject
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">
                                                        {deposit.status === 'Completed' ? 'Approved' : 'Rejected'}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-12 text-center text-gray-400 text-sm">
                                        No deposit requests found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DepositManagement;
