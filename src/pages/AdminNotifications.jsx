import React, { useState, useEffect } from 'react';
import {
    Bell,
    AlertCircle,
    CheckCircle,
    DollarSign,
    TrendingUp,
    User,
    ChevronRight,
    Search,
    Filter,
    Check,
    RefreshCcw,
    ExternalLink,
    Loader2
} from 'lucide-react';
import { adminService } from '../services/admin.service';
import UserDetailModal from '../components/UserDetailModal';
import { toast } from 'sonner';

const AdminNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await adminService.getAdminNotifications();
            if (response.success) {
                setNotifications(response.notifications);
                setUnreadCount(response.unreadCount);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            toast.error('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        try {
            await adminService.markAdminNotificationRead(id);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            toast.error('Failed to update notification');
        }
    };

    const markAllRead = async () => {
        try {
            await adminService.markAllAdminNotificationsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
            toast.success('All notifications marked as read');
        } catch (error) {
            toast.error('Failed to update notifications');
        }
    };

    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);

    const handleViewUser = async (userId) => {
        try {
            const userDetails = await adminService.getUserDetails(userId);
            setSelectedUser(userDetails);
            setShowUserModal(true);
        } catch (error) {
            console.error('Error fetching user details:', error);
            toast.error('Failed to load user details');
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success': return CheckCircle;
            case 'warning': return AlertCircle;
            case 'deposit': return DollarSign;
            case 'withdrawal': return ExternalLink;
            case 'investment': return TrendingUp;
            default: return Bell;
        }
    };

    const getPriorityStyles = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-50 text-red-600 border-red-100';
            case 'low': return 'bg-gray-50 text-gray-500 border-gray-100';
            default: return 'bg-blue-50 text-blue-600 border-blue-100';
        }
    };

    const getTypeColors = (type) => {
        switch (type) {
            case 'warning': return 'text-amber-600 bg-amber-50 border border-amber-100';
            case 'success': return 'text-emerald-600 bg-emerald-50 border border-emerald-100';
            case 'admin': return 'text-purple-600 bg-purple-50 border border-purple-100';
            default: return 'text-blue-600 bg-blue-50 border border-blue-100';
        }
    };

    const filteredNotifs = notifications.filter(n => {
        const matchesFilter = filter === 'all' ? true : (filter === 'unread' ? !n.read : n.type === filter);
        const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            n.message.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
                        Operational Alerts
                        {unreadCount > 0 && (
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200">
                                {unreadCount} New
                            </span>
                        )}
                    </h2>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1 italic">Real-time system and transaction notifications</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchNotifications}
                        className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-blue-600 hover:border-blue-100 shadow-sm transition-all active:scale-95 group"
                    >
                        <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
                    </button>
                    <button
                        onClick={markAllRead}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all flex items-center gap-2 shadow-sm hover:shadow-md active:scale-95"
                    >
                        <Check size={18} />
                        Mark All Read
                    </button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search specific alerts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
                    />
                </div>
                <div className="flex gap-2 p-1.5 bg-white border border-gray-200 rounded-xl overflow-x-auto shadow-sm">
                    {[
                        { id: 'all', label: 'All' },
                        { id: 'unread', label: 'Unread' },
                        { id: 'warning', label: 'Warnings' },
                        { id: 'admin', label: 'System' }
                    ].map(f => (
                        <button
                            key={f.id}
                            onClick={() => setFilter(f.id)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${filter === f.id ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Notification List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="py-20 flex flex-col items-center gap-4">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest animate-pulse">Synchronizing Alerts...</p>
                    </div>
                ) : filteredNotifs.length > 0 ? (
                    filteredNotifs.map((n) => {
                        const Icon = getIcon(n.type);
                        return (
                            <div
                                key={n._id}
                                className={`group relative bg-white border ${n.read ? 'border-gray-100 opacity-75 grayscale-[0.5]' : 'border-blue-100 shadow-sm'} rounded-xl p-5 hover:shadow-md hover:border-blue-200 transition-all`}
                            >
                                <div className="flex items-start gap-5">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${getTypeColors(n.type)}`}>
                                        <Icon size={24} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <h3 className={`font-bold transition-colors ${n.read ? 'text-gray-500' : 'text-gray-900'}`}>
                                                    {n.title}
                                                </h3>
                                                {n.priority === 'high' && (
                                                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter border ${getPriorityStyles('high')}`}>
                                                        URGENT
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                                {new Date(n.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed mb-4">{n.message}</p>

                                        <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                                            <div className="flex items-center gap-4">
                                                {n.metadata?.transactionId && (
                                                    <button className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1.5 font-bold transition-colors">
                                                        View Transaction <ChevronRight size={14} />
                                                    </button>
                                                )}
                                                {n.metadata?.userId && (
                                                    <button
                                                        onClick={() => handleViewUser(n.metadata.userId)}
                                                        className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1.5 font-bold transition-colors"
                                                    >
                                                        <User size={14} /> View User
                                                    </button>
                                                )}
                                            </div>
                                            {!n.read && (
                                                <button
                                                    onClick={() => markAsRead(n._id)}
                                                    className="px-3 py-1.5 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-lg text-xs font-bold transition-all border border-gray-100 hover:border-blue-100"
                                                >
                                                    Mark as Read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50">
                        <Bell className="mx-auto text-gray-300 mb-4" size={48} />
                        <h3 className="text-gray-900 font-bold text-lg">No alerts found</h3>
                        <p className="text-gray-500 text-sm mt-1">All systems are operational and quiet.</p>
                    </div>
                )}
            </div>

            <UserDetailModal
                isOpen={showUserModal}
                onClose={() => setShowUserModal(false)}
                user={selectedUser}
            />
        </div>
    );
};

export default AdminNotifications;
