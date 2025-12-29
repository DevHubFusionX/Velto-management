import React, { useEffect, useState } from 'react';
import { Loader2, TrendingUp, User, Calendar } from 'lucide-react';
import { adminService } from '../../services/admin.service';
import { cn, formatCurrency } from '../../utils';

const ActiveInvestmentsList = () => {
    const [investments, setInvestments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvestments = async () => {
            try {
                const response = await adminService.getAllUserInvestments();
                const investmentsArray = response.data || response;

                if (Array.isArray(investmentsArray)) {
                    setInvestments(investmentsArray);
                } else {
                    console.warn('Investments data is not an array:', response);
                    setInvestments([]);
                }
            } catch (error) {
                console.error('Failed to fetch investments', error);
            } finally {
                setLoading(false);
            }
        };
        fetchInvestments();
    }, []);

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-blue-500" /></div>;
    }

    return (
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">Active Investments</h3>
                    <p className="text-xs text-gray-500 font-medium mt-1">Real-time tracking of user portfolios</p>
                </div>
                <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold">
                    {investments.length} Active
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">User</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Plan</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Returns</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Next Payout</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {investments.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-gray-400 text-sm">
                                    No active investments found.
                                </td>
                            </tr>
                        ) : (
                            investments.map((inv) => (
                                <tr key={inv._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                                <User size={14} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-700">{inv.user?.name || 'Unknown User'}</p>
                                                <p className="text-xs text-gray-400">{inv.user?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                                            <span className="text-sm font-medium text-gray-600">{inv.plan?.name || 'Unknown Plan'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-gray-700">{formatCurrency(inv.amount)}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-emerald-600">+{formatCurrency(inv.dailyPayoutAmount)} / day</span>
                                            <span className="text-[10px] text-gray-400">Total: {formatCurrency(inv.totalPayoutReceived)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Calendar size={12} />
                                            <span className="text-xs font-medium">
                                                {new Date(inv.nextPayoutDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "px-2.5 py-1 rounded-lg text-xs font-bold",
                                            inv.status === 'active' ? "bg-emerald-100 text-emerald-700" :
                                                inv.status === 'completed' ? "bg-blue-100 text-blue-700" :
                                                    "bg-gray-100 text-gray-600"
                                        )}>
                                            {inv.status.toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ActiveInvestmentsList;
