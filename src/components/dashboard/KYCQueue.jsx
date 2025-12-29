import React, { useState } from 'react';
import { MoreHorizontal, Loader2 } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

const KYCQueue = ({ requests }) => {
    const { handleApproveKYC, handleRejectKYC } = usePlatform();
    const [processingId, setProcessingId] = useState(null);

    const queue = requests || [];

    const handleAction = async (id, action) => {
        setProcessingId(id);
        try {
            await action(id);
        } catch (error) {
            // Error handling is done in context (toast), just reset loading here
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="premium-card overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '200ms' }}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white/50 backdrop-blur-sm">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.2em]">KYC Verification Queue</h3>
                <MoreHorizontal size={16} className="text-gray-400" />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <tr>
                            <th className="px-6 py-4">Identity Holder</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-center">Protocol</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {queue.map((kyc, i) => (
                            <tr key={kyc._id || i} className="hover:bg-blue-50/30 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                                            {kyc.user?.name?.charAt(0) || 'U'}
                                        </div>
                                        <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">{kyc.user?.name || 'Unknown User'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                        {kyc.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => handleAction(kyc._id, handleApproveKYC)}
                                            disabled={processingId === kyc._id}
                                            className="px-4 py-1.5 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm transition-all hover:scale-105 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed flex items-center gap-1"
                                        >
                                            {processingId === kyc._id ? <Loader2 size={12} className="animate-spin" /> : 'Approve'}
                                        </button>
                                        <button
                                            onClick={() => handleAction(kyc._id, handleRejectKYC)}
                                            disabled={processingId === kyc._id}
                                            className="px-4 py-1.5 bg-transparent border border-gray-100 text-gray-400 hover:text-rose-500 hover:border-rose-100 disabled:opacity-50 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 disabled:scale-100 disabled:cursor-not-allowed"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {queue.length === 0 && (
                    <div className="p-8 text-center text-gray-400 text-xs uppercase tracking-widest font-bold">
                        No pending verifications
                    </div>
                )}
            </div>
        </div>
    );
};

export default KYCQueue;
