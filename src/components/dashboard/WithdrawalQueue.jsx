import React, { useState } from 'react';
import { MoreHorizontal, Loader2 } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

const WithdrawalQueue = ({ requests }) => {
    const { handleReleaseWithdrawal, handleRejectWithdrawal } = usePlatform();
    const [processingId, setProcessingId] = useState(null);

    const queue = requests || [];

    const formatCurrency = (val) => {
        const absVal = Math.abs(val);
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(absVal);
    };

    const handleAction = async (id, action, ...args) => {
        setProcessingId(id);
        try {
            await action(id, ...args);
        } catch (error) {
            // Error handling done in context
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="premium-card overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '300ms' }}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white/50 backdrop-blur-sm">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.2em]">Capital Clearance</h3>
                <MoreHorizontal size={16} className="text-gray-400" />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <tr>
                            <th className="px-6 py-4">Origin / Route</th>
                            <th className="px-6 py-4">Magnitude</th>
                            <th className="px-6 py-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {queue.map((req, i) => (
                            <tr key={req._id || i} className="hover:bg-emerald-50/30 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-700">{req.user?.name || 'External Account'}</span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{req.method || req.reference || 'Bank Transfer'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-gray-900 tracking-tight">
                                    {formatCurrency(req.amount)}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => handleAction(req._id, handleReleaseWithdrawal)}
                                            disabled={processingId === req._id}
                                            className="px-4 py-1.5 bg-emerald-500 text-white hover:bg-emerald-600 disabled:bg-emerald-300 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm transition-all hover:scale-105 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed flex items-center gap-1"
                                        >
                                            {processingId === req._id ? <Loader2 size={12} className="animate-spin" /> : 'Release'}
                                        </button>
                                        <button
                                            onClick={() => handleAction(req._id, handleRejectWithdrawal, 'Administrative Hold')}
                                            disabled={processingId === req._id}
                                            className="px-4 py-1.5 bg-gray-900 text-white hover:bg-black disabled:bg-gray-500 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 disabled:scale-100 disabled:cursor-not-allowed"
                                        >
                                            Hold
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {queue.length === 0 && (
                    <div className="p-8 text-center text-gray-400 text-xs uppercase tracking-widest font-bold">
                        No pending clearances
                    </div>
                )}
            </div>
        </div>
    );
};

export default WithdrawalQueue;
