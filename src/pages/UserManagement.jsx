import React, { useState, useEffect } from 'react';
import {
    Users,
    Search,
    Filter,
    UserPlus,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
    Loader2
} from 'lucide-react';
import { cn, formatCurrency } from '../utils';
import UserRow from '../components/management/UserRow';
import { adminService } from '../services/admin.service';
import { toast } from 'sonner';

const UserManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const data = await adminService.getUsers();
            if (!Array.isArray(data)) {
                setUsers([]);
                return;
            }
            const formattedUsers = data.map(u => ({
                id: u._id,
                name: u.name,
                email: u.email,
                joined: new Date(u.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                status: u.suspended ? 'Suspended' : 'Active',
                kyc: u.kycStatus === 'Approved' ? 'Verified' : u.kycStatus || 'Unverified',
                emailVerified: u.isEmailVerified || false,
                balance: formatCurrency(u.totalBalance || 0),
                totalInvested: formatCurrency(u.totalInvestedCalculated || 0),
                activeHoldings: formatCurrency(u.activeHoldings || 0)
            }));
            setUsers(formattedUsers);
        } catch (error) {
            console.error('Failed to fetch users', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleViewDetails = async (userId) => {
        try {
            const details = await adminService.getUserDetails(userId);
            alert(`User Details:\nName: ${details.name}\nEmail: ${details.email}\nBalance: ${formatCurrency(details.totalBalance)}\nTotal Investments: ${formatCurrency(details.totalInvestments)}\nActive Investments: ${formatCurrency(details.activeInvestments)}`);
        } catch (error) {
            console.error('Failed to fetch user details', error);
            toast.error('Failed to load user details');
        }
    };

    const handleSuspend = async (userId, reason) => {
        try {
            await adminService.suspendUser(userId, reason);
            toast.success('User suspended successfully');
            fetchUsers(); // Refresh list
        } catch (error) {
            console.error('Failed to suspend user', error);
            toast.error('Failed to suspend user');
        }
    };

    const handleActivate = async (userId) => {
        try {
            await adminService.activateUser(userId);
            toast.success('User activated successfully');
            fetchUsers(); // Refresh list
        } catch (error) {
            console.error('Failed to activate user', error);
            toast.error('Failed to activate user');
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-12">
            {/* Header / Search HUD */}
            <div className="flex flex-col xl:flex-row items-center justify-between gap-8 px-2 animate-stagger-1">
                <div className="flex items-center gap-6 w-full xl:w-auto">
                    <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                        <Users size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none">User Directory</h2>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2">Managing {users.length.toLocaleString()} Verified Node Identities</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
                    <div className="relative w-full md:w-96 group">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                            <Search className="text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Find by name, email or ID..."
                            className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all placeholder:text-gray-300 font-bold shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 py-4 bg-white border border-gray-100 hover:border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 transition-all active:scale-95 shadow-sm">
                            <Filter size={18} />
                            Parameters
                        </button>
                        <button className="flex-1 md:flex-none btn-premium flex items-center justify-center gap-3 px-8 py-4">
                            <UserPlus size={18} />
                            Add User
                        </button>
                    </div>
                </div>
            </div>

            {/* User Database Table */}
            <div className="premium-card overflow-hidden animate-stagger-2">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-4 sm:px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                    <div className="flex items-center gap-2">
                                        Entity Identity
                                        <ArrowUpDown size={12} className="opacity-30" />
                                    </div>
                                </th>
                                <th className="hidden md:table-cell px-4 lg:px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">KYC Status</th>
                                <th className="hidden lg:table-cell px-4 lg:px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Email Status</th>
                                <th className="hidden sm:table-cell px-4 sm:px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Access Level</th>
                                <th className="hidden xl:table-cell px-4 xl:px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Total Invested</th>
                                <th className="hidden xl:table-cell px-4 xl:px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Holdings</th>
                                <th className="px-4 sm:px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Balance</th>
                                <th className="px-2 sm:px-4 lg:px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center">
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Directory...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <UserRow
                                        key={user.id}
                                        user={user}
                                        onViewDetails={handleViewDetails}
                                        onSuspend={handleSuspend}
                                        onActivate={handleActivate}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">
                                        No users found matching "{searchTerm}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Intelligent Pagination */}
                <div className="px-10 py-8 border-t border-gray-100 bg-gray-50/30 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Slicing Database Index: <span className="text-gray-900">5 of 1,284 Identifiers</span></p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-gray-900 transition-all disabled:opacity-20 disabled:pointer-events-none shadow-sm" disabled>
                            <ChevronLeft size={20} />
                        </button>
                        <div className="flex items-center gap-1.5 bg-gray-100/50 p-1.5 rounded-xl border border-gray-100">
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white text-[10px] font-black shadow-lg shadow-blue-500/20 transition-all">1</button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-gray-400 hover:text-gray-900 text-[10px] font-black transition-all">2</button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-gray-400 hover:text-gray-900 text-[10px] font-black transition-all">3</button>
                            <span className="px-1 text-gray-300 font-black">...</span>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-gray-400 hover:text-gray-900 text-[10px] font-black transition-all">128</button>
                        </div>
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-gray-900 transition-all shadow-sm">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
