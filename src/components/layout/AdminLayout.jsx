import React from 'react';
import {
    LayoutDashboard,
    Users,
    TrendingUp,
    CreditCard,
    History,
    Settings,
    LogOut,
    Bell,
    Search,
    ChevronLeft,
    Menu,
    ShieldCheck,
    Cpu,
    Zap,
    MessageSquare,
    Activity
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils';
import { authService } from '../../services/auth.service';

const NavItem = ({ icon: Icon, label, path, isOpen, isActive }) => (
    <Link
        to={path}
        className={cn(
            "flex items-center gap-4 px-5 py-3.5 transition-all duration-300 relative group overflow-hidden",
            isActive
                ? "bg-white/5 text-white nav-item-active"
                : "text-[#B1B5BA] hover:bg-white/5 hover:text-white"
        )}
    >
        <div className={cn(
            "shrink-0 transition-all duration-300 relative z-10",
            isActive ? "text-blue-400 scale-110" : "group-hover:text-white group-hover:scale-110"
        )}>
            <Icon size={20} />
        </div>
        <span className={cn(
            "text-sm font-medium transition-all duration-300 whitespace-nowrap overflow-hidden relative z-10",
            isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
        )}>
            {label}
        </span>

        {isActive && (
            <div className="active-nav-indicator" />
        )}

        {/* Subtle hover glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </Link>
);

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
    const [isMobileOpen, setIsMobileOpen] = React.useState(false);
    const location = useLocation();

    // Close mobile sidebar on route change
    React.useEffect(() => {
        setIsMobileOpen(false);
    }, [location.pathname]);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Users, label: 'User Management', path: '/users' },
        { icon: TrendingUp, label: 'Investments', path: '/investments' },
        { icon: CreditCard, label: 'Withdrawals', path: '/withdrawals' },
        { icon: CreditCard, label: 'Deposits', path: '/deposits' },
        { icon: ShieldCheck, label: 'Security', path: '/security' },
        { icon: MessageSquare, label: 'Communications', path: '/communications' },
        { icon: Bell, label: 'Notifications', path: '/notifications' },
        { icon: Activity, label: 'Logs', path: '/logs' },
    ];

    const currentModule = menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard';

    return (
        <div className="min-h-screen mesh-gradient text-[#333333] font-sans relative">
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-[55] bg-black/50 lg:hidden transition-all duration-300"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed top-0 left-0 z-[60] h-screen transition-all duration-500 bg-[#2D333D] lg:translate-x-0 cursor-default select-none shadow-2xl",
                isSidebarOpen ? "w-64" : "w-20",
                isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"
            )}>
                <div className="flex flex-col h-full">
                    {/* Sidebar Brand */}
                    <div className="flex items-center gap-3 px-6 h-16 border-b border-white/5 mb-4">
                        <div className="w-10 h-10 bg-gray-400/20 rounded-full flex items-center justify-center">
                            <Users className="text-white" size={24} />
                        </div>
                        <span className={cn(
                            "text-white font-bold text-lg tracking-tight transition-all",
                            !isSidebarOpen && "lg:hidden"
                        )}>
                            Admin Dashboard
                        </span>
                    </div>

                    <nav className="flex-1 overflow-y-auto custom-sidebar-scroll">
                        {menuItems.map((item) => (
                            <NavItem
                                key={item.path}
                                {...item}
                                isOpen={isSidebarOpen || isMobileOpen}
                                isActive={location.pathname === item.path}
                            />
                        ))}
                    </nav>

                    <div className="mt-auto border-t border-white/5">
                        <Link
                            to="/settings"
                            className={cn(
                                "flex items-center gap-4 w-full px-6 py-4 transition-all text-sm font-medium",
                                location.pathname === '/settings'
                                    ? "bg-white/5 text-white"
                                    : "text-[#B1B5BA] hover:bg-[#3D444F] hover:text-white"
                            )}
                        >
                            <Settings size={20} className={cn(location.pathname === '/settings' && "text-blue-400")} />
                            <span className={cn(!isSidebarOpen && "lg:hidden")}>Settings</span>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className={cn(
                "transition-all duration-300 min-h-screen",
                isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
            )}>
                {/* Header */}
                <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileOpen(true)}
                            className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                        >
                            <Menu size={20} />
                        </button>
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="hidden lg:block p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                        >
                            <Menu size={20} />
                        </button>
                        <h2 className="text-xl font-bold text-gray-800">{currentModule}</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/notifications"
                            className="p-2.5 text-gray-400 hover:text-blue-500 hover:bg-gray-100 rounded-xl transition-all relative group"
                        >
                            <Bell size={20} className="group-hover:scale-110 transition-transform" />
                            <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-white ring-2 ring-blue-500/10"></div>
                        </Link>
                        <div className="flex items-center gap-3 py-1 px-3 border border-gray-100 rounded-full bg-gray-50">
                            <div className="w-8 h-8 rounded-full bg-gray-200 border border-white overflow-hidden">
                                <img src="https://ui-avatars.com/api/?name=Admin&background=random" alt="Admin" />
                            </div>
                            <span className="text-sm font-semibold text-gray-700">Admin</span>
                        </div>
                        <button
                            onClick={() => authService.logout()}
                            className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                <div className="p-6 md:p-8 lg:p-10">
                    {children}
                </div>
            </main>

            <style>{`
                .custom-sidebar-scroll::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-sidebar-scroll::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-sidebar-scroll::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.05);
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};

export default AdminLayout;
