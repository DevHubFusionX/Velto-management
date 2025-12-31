import React from 'react';
import { X, User, Calendar, CreditCard, Activity, CheckCircle2, XCircle, Clock, AlertTriangle, Building, Hash } from 'lucide-react';

const WithdrawalDetailModal = ({ isOpen, onClose, withdrawal }) => {
    if (!isOpen || !withdrawal) return null;

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-emerald-100 text-emerald-800';
            case 'Pending': return 'bg-amber-100 text-amber-800';
            case 'Processing': return 'bg-blue-100 text-blue-800';
            case 'Rejected': return 'bg-rose-100 text-rose-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed': return <CheckCircle2 size={16} />;
            case 'Pending': return <Clock size={16} />;
            case 'Processing': return <Activity size={16} />;
            case 'Rejected': return <XCircle size={16} />;
            default: return <AlertTriangle size={16} />;
        }
    };

    // Parse description for bank details if available
    const bankDetails = withdrawal.description?.match(/to (.+?) - (\d+)/);
    const bankName = bankDetails ? bankDetails[1] : 'N/A';
    const accountNumber = bankDetails ? bankDetails[2] : 'N/A';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto m-4 animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Withdrawal Details</h2>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Transaction ID: {withdrawal._id}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Amount & Status */}
                    <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Net Amount</span>
                        <h3 className="text-4xl font-black text-gray-900 tracking-tight">
                            ${Math.abs(withdrawal.amount).toLocaleString()}
                        </h3>
                        <div className={`mt-4 flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(withdrawal.status)}`}>
                            {getStatusIcon(withdrawal.status)}
                            {withdrawal.status}
                        </div>
                    </div>

                    {/* Transaction Info */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                            <Activity size={14} className="text-blue-500" /> Transaction Metadata
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-white border border-gray-100 rounded-xl">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Date Initiated</p>
                                <p className="font-bold text-gray-800 text-sm">{new Date(withdrawal.date).toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-white border border-gray-100 rounded-xl">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Method</p>
                                <p className="font-bold text-gray-800 text-sm flex items-center gap-2">
                                    <CreditCard size={14} className="text-gray-400" />
                                    {withdrawal.method || 'Bank Transfer'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Recipient Details */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                            <Building size={14} className="text-blue-500" /> Destination Details
                        </h3>
                        <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 font-medium">Platform/Network</span>
                                <span className="text-sm font-bold text-gray-900">{withdrawal.cryptoCurrency || bankName}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 font-medium">Address</span>
                                <span className="text-sm font-bold text-gray-900 font-mono tracking-wider">{withdrawal.cryptoAddress || accountNumber}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 font-medium">Account Name</span>
                                <span className="text-sm font-bold text-gray-900">{withdrawal.user?.name || 'User Account'}</span>
                            </div>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                            <User size={14} className="text-blue-500" /> User Identity
                        </h3>
                        <div className="flex items-center gap-4 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                                {withdrawal.user?.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">{withdrawal.user?.name || 'Unknown User'}</p>
                                <p className="text-xs text-gray-500 font-medium">{withdrawal.user?.email || 'No Email'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-all shadow-sm transform active:scale-95"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WithdrawalDetailModal;
