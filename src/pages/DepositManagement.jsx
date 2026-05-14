import React, { useState, useEffect } from 'react';
import {
    CheckCircle2,
    XCircle,
    Clock,
    DollarSign,
    Loader2,
    RefreshCw,
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
    // Verification Modal State
    const [verificationModal, setVerificationModal] = useState({
        isOpen: false,
        deposit: null
    });

    useEffect(() => {
        fetchDeposits();
    }, []);

    const fetchDeposits = async () => {
        try {
            setLoading(true);
            const data = await adminService.getDeposits();
            setDeposits(Array.isArray(data) ? data : (data?.data || []));
        } catch (error) {
            console.error('Failed to fetch deposits:', error);
            toast.error('Failed to load deposits');
        } finally {
            setLoading(false);
        }
    };

    const openVerificationModal = (deposit) => {
        setVerificationModal({ isOpen: true, deposit });
    };

    const closeVerificationModal = () => {
        setVerificationModal({ isOpen: false, deposit: null });
    };

    const handleVerifyApprove = async () => {
        const { deposit } = verificationModal;
        if (!deposit) return;

        try {
            setProcessingId(deposit._id);
            const result = await adminService.approveCryptoDeposit(deposit._id, {});
            if (result.verified) {
                toast.success(`✅ On-chain verified! $${result.onChainAmount} USDT credited.`);
            } else {
                toast.success('Deposit approved');
            }
            closeVerificationModal();
            await fetchDeposits();
        } catch (error) {
            const msg = error.response?.data?.message || 'Verification failed';
            toast.error(msg);
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
        pendingCount: Array.isArray(deposits) ? deposits.filter(d => d.status === 'Pending').length : 0
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
                    { label: 'Pending Verification', value: `$${(stats.pendingTotal / 1000).toFixed(1)}K`, color: 'text-amber-500', icon: Clock, bg: 'bg-amber-50' },
                    { label: 'Approved Today', value: `$${(stats.clearedToday / 1000).toFixed(1)}K`, color: 'text-emerald-500', icon: CheckCircle2, bg: 'bg-emerald-50' },
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
                                <th className="px-8 py-6 text-xs font-bold uppercase tracking-wider text-gray-400">Proof</th>
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
                                                    ${deposit.amount.toLocaleString()}
                                                </span>
                                                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">
                                                    USDT — {deposit.network || (deposit.cryptoCurrency?.includes('TRC20') ? 'TRC20' : 'ERC20')}
                                                </span>
                                                {deposit.txHash && (
                                                    <span className="mt-1 text-[9px] text-blue-500 font-mono truncate max-w-[160px]" title={deposit.txHash}>
                                                        TX: {deposit.txHash}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {deposit.txHash ? (
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">TX Hash</span>
                                                    <span className="text-xs font-mono text-blue-600 truncate max-w-[160px]" title={deposit.txHash}>{deposit.txHash}</span>
                                                    <a href={`https://${deposit.network === 'TRC20' ? 'tronscan.org/#/transaction/' : 'etherscan.io/tx/'}${deposit.txHash}`}
                                                        target="_blank" rel="noopener noreferrer"
                                                        className="text-[10px] text-blue-400 hover:underline flex items-center gap-1">
                                                        Verify on-chain ↗
                                                    </a>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400">No TX Hash</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                                                    <span className="text-emerald-600 font-bold text-xs">₮</span>
                                                </div>
                                                <span className="text-xs font-bold text-emerald-600">USDT</span>
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
                                                {deposit.description?.includes('Manual Proof Submitted') && (
                                                    <span className="ml-1 px-1 py-0.5 bg-blue-100 text-blue-700 rounded text-[7px] font-black">PROOFED</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end gap-2">
                                                {deposit.status === 'Pending' ? (
                                                    <>
                                                        <button
                                                            onClick={() => openVerificationModal(deposit)}
                                                            disabled={processingId === deposit._id}
                                                            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:opacity-90 disabled:opacity-50 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95 disabled:cursor-not-allowed"
                                                        >
                                                            {processingId === deposit._id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                                                            Verify
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
                                    <td colSpan="6" className="px-8 py-12 text-center text-gray-400 text-sm">
                                        No deposit requests found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Verification Modal */}
            {verificationModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Verify Deposit</h3>
                            <button onClick={closeVerificationModal} className="text-gray-400 hover:text-gray-600">
                                <XCircle size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* TX Hash */}
                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                                <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mb-1">Transaction Hash</p>
                                <p className="text-sm font-mono text-gray-900 break-all">{verificationModal.deposit?.txHash || 'No TX hash'}</p>
                                {verificationModal.deposit?.txHash && (
                                    <a
                                        href={`https://${verificationModal.deposit?.network === 'TRC20' ? 'tronscan.org/#/transaction/' : 'etherscan.io/tx/'}${verificationModal.deposit.txHash}`}
                                        target="_blank" rel="noopener noreferrer"
                                        className="text-xs text-blue-500 hover:underline mt-2 inline-flex items-center gap-1"
                                    >
                                        View on {verificationModal.deposit?.network === 'TRC20' ? 'Tronscan' : 'Etherscan'} ↗
                                    </a>
                                )}
                            </div>

                            <div className="p-4 bg-gray-50 rounded-xl space-y-2 text-sm">
                                {[['User', verificationModal.deposit?.user?.name || verificationModal.deposit?.user?.email],
                                  ['Amount Claimed', `$${verificationModal.deposit?.amount}`],
                                  ['Network', verificationModal.deposit?.network],
                                  ['Submitted', new Date(verificationModal.deposit?.date).toLocaleString()]
                                ].map(([label, value]) => (
                                    <div key={label} className="flex justify-between">
                                        <span className="text-gray-500">{label}</span>
                                        <span className="font-bold text-gray-800">{value}</span>
                                    </div>
                                ))}
                            </div>

                            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-xl p-3">
                                Clicking <strong>Verify &amp; Approve</strong> will automatically check this TX hash on-chain.
                                The actual on-chain USDT amount will be credited — not the user-submitted amount.
                            </p>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={closeVerificationModal}
                                    className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleVerifyApprove}
                                    disabled={processingId === verificationModal.deposit?._id}
                                    className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-md shadow-emerald-200 disabled:opacity-50"
                                >
                                    {processingId ? <Loader2 className="animate-spin mx-auto" /> : 'Verify & Approve'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DepositManagement;
