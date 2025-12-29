import React, { useState } from 'react';
import { ShieldAlert, Eye, XCircle, MoreVertical, CheckCircle2, Ban, Mail, MailCheck } from 'lucide-react';
import { cn, formatCurrency } from '../../utils';

const UserRow = ({ user, onViewDetails, onSuspend, onActivate }) => {
    const [showMenu, setShowMenu] = useState(false);

    const handleSuspend = () => {
        const reason = prompt('Enter suspension reason:');
        if (reason) {
            onSuspend(user.id, reason);
        }
    };

    return (
        <tr key={user.id} className="hover:bg-blue-50/30 transition-all group border-b border-gray-100 last:border-0">
            {/* User Identity - Always visible */}
            <td className="px-4 sm:px-8 py-4 sm:py-6">
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="relative">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500 font-black border border-gray-200 group-hover:scale-110 transition-transform duration-500 group-hover:border-blue-200 group-hover:bg-blue-50 text-xs sm:text-sm">
                            {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        {user.status === 'Active' && (
                            <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-emerald-500 border-2 border-white shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors tracking-tight truncate">{user.name}</p>
                        <p className="text-[9px] sm:text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5 truncate">{user.email}</p>
                    </div>
                </div>
            </td>

            {/* KYC Status - Hidden on mobile, visible on md+ */}
            <td className="hidden md:table-cell px-4 lg:px-8 py-4 lg:py-6">
                <div className={cn(
                    "inline-flex items-center gap-1.5 px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg text-[8px] lg:text-[9px] font-black uppercase tracking-widest border shadow-sm",
                    user.kyc === 'Verified' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                        user.kyc === 'Pending' ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-gray-50 text-gray-500 border-gray-100"
                )}>
                    <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        user.kyc === 'Verified' ? "bg-emerald-500" :
                            user.kyc === 'Pending' ? "bg-amber-500 animate-pulse" : "bg-gray-400"
                    )} />
                    <span className="hidden lg:inline">{user.kyc}</span>
                    <span className="lg:hidden">{user.kyc === 'Verified' ? 'V' : user.kyc === 'Pending' ? 'P' : 'U'}</span>
                </div>
            </td>

            {/* Email Status - Hidden on mobile, visible on lg+ */}
            <td className="hidden lg:table-cell px-4 lg:px-8 py-4 lg:py-6">
                <div className={cn(
                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm",
                    user.emailVerified ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-gray-50 text-gray-500 border-gray-100"
                )}>
                    {user.emailVerified ? (
                        <>
                            <MailCheck size={12} className="text-blue-600" />
                            Verified
                        </>
                    ) : (
                        <>
                            <Mail size={12} className="text-gray-400" />
                            Unverified
                        </>
                    )}
                </div>
            </td>

            {/* Access Level - Hidden on mobile, visible on sm+ */}
            <td className="hidden sm:table-cell px-4 sm:px-8 py-4 sm:py-6">
                <span className={cn(
                    "text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md whitespace-nowrap",
                    user.status === 'Active' ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
                )}>
                    {user.status}
                </span>
            </td>

            {/* Total Invested - Hidden on mobile, visible on xl+ */}
            <td className="hidden xl:table-cell px-4 xl:px-8 py-4 xl:py-6">
                <div className="flex flex-col">
                    <span className="text-sm font-black text-gray-900 tracking-tight whitespace-nowrap">{user.totalInvested}</span>
                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-0.5">Lifetime</span>
                </div>
            </td>

            {/* Holdings - Hidden on mobile, visible on xl+ */}
            <td className="hidden xl:table-cell px-4 xl:px-8 py-4 xl:py-6">
                <div className="flex flex-col">
                    <span className="text-sm font-black text-gray-900 tracking-tight whitespace-nowrap">{user.activeHoldings}</span>
                    <span className="text-[9px] text-emerald-500 font-black uppercase tracking-widest mt-0.5">Active</span>
                </div>
            </td>

            {/* Balance - Visible on all screens */}
            <td className="px-4 sm:px-8 py-4 sm:py-6">
                <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-black text-gray-900 tracking-tight whitespace-nowrap">{user.balance}</span>
                    <span className="text-[8px] sm:text-[9px] text-gray-400 font-black uppercase tracking-widest mt-0.5">Available</span>
                </div>
            </td>

            {/* Operations - Always visible */}
            <td className="px-2 sm:px-4 lg:px-8 py-4 sm:py-6">
                <div className="flex items-center justify-end gap-1 sm:gap-2">
                    <button
                        onClick={() => onViewDetails(user.id)}
                        className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg sm:rounded-xl bg-gray-50 border border-gray-100 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-90"
                        title='View Details'
                    >
                        <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>
                    {user.status === 'Active' ? (
                        <button
                            onClick={handleSuspend}
                            className="hidden sm:flex w-10 h-10 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all active:scale-90"
                            title='Suspend Account'
                        >
                            <Ban size={18} />
                        </button>
                    ) : (
                        <button
                            onClick={() => onActivate(user.id)}
                            className="hidden sm:flex w-10 h-10 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all active:scale-90"
                            title='Activate Account'
                        >
                            <CheckCircle2 size={18} />
                        </button>
                    )}
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg sm:rounded-xl bg-gray-50 border border-gray-100 text-gray-400 hover:text-gray-900 transition-all"
                        >
                            <MoreVertical size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-10">
                                <button
                                    onClick={() => {
                                        setShowMenu(false);
                                        onViewDetails(user.id);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                                >
                                    View Full Profile
                                </button>
                                <button
                                    onClick={() => {
                                        setShowMenu(false);
                                        handleSuspend();
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors sm:hidden"
                                >
                                    {user.status === 'Active' ? 'Suspend User' : 'Activate User'}
                                </button>
                                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors">
                                    Adjust Balance
                                </button>
                                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors text-rose-600">
                                    Delete User
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </td>
        </tr>
    );
};

export default UserRow;
