import React from 'react';
import { X, Mail, Phone, Calendar, Shield, Wallet, CreditCard, Activity } from 'lucide-react';

const UserDetailModal = ({ isOpen, onClose, user }) => {
    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4 animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${user.suspended
                                ? 'bg-red-100 text-red-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                            {user.suspended ? 'Suspended' : 'Active'}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Key Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <div className="flex items-center gap-2 text-blue-600 mb-2">
                                <Wallet size={18} />
                                <span className="text-xs font-bold uppercase tracking-wider">Balance</span>
                            </div>
                            <p className="text-xl font-black text-gray-900">₦{(user.totalBalance || 0).toLocaleString()}</p>
                        </div>
                        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                            <div className="flex items-center gap-2 text-emerald-600 mb-2">
                                <Activity size={18} />
                                <span className="text-xs font-bold uppercase tracking-wider">Investments</span>
                            </div>
                            <p className="text-xl font-black text-gray-900">{user.activeInvestments} / {user.totalInvestments}</p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                            <div className="flex items-center gap-2 text-purple-600 mb-2">
                                <Shield size={18} />
                                <span className="text-xs font-bold uppercase tracking-wider">KYC Status</span>
                            </div>
                            <p className="text-xl font-black text-gray-900">{user.kycStatus || 'Unverified'}</p>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Contact Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                                <Mail size={18} className="text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Email Address</p>
                                    <p className="font-medium text-gray-900">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                                <Phone size={18} className="text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Phone Number</p>
                                    <p className="font-medium text-gray-900">{user.phone || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                                <Calendar size={18} className="text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Joined Date</p>
                                    <p className="font-medium text-gray-900">{new Date(user.createdAt || user.joinedAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    {user.recentTransactions?.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Recent Activity</h3>
                            <div className="border border-gray-100 rounded-xl overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-500 font-medium">
                                        <tr>
                                            <th className="px-4 py-3">Type</th>
                                            <th className="px-4 py-3">Amount</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3 text-right">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {user.recentTransactions.map((tx, i) => (
                                            <tr key={i} className="hover:bg-gray-50/50">
                                                <td className="px-4 py-3 font-medium text-gray-900">{tx.type}</td>
                                                <td className="px-4 py-3 text-gray-600">
                                                    {tx.type === 'Withdrawal' ? '-' : '+'}
                                                    ₦{Math.abs(tx.amount).toLocaleString()}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${tx.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                            tx.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'
                                                        }`}>
                                                        {tx.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right text-gray-500">
                                                    {new Date(tx.date || tx.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserDetailModal;
