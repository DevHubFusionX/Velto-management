import React, { useState, useEffect } from 'react';
import {
    ShieldAlert,
    ShieldCheck,
    Shield,
    Lock,
    Users,
    Activity,
    Zap,
    AlertTriangle,
    Eye,
    Globe,
    Fingerprint,
    Smartphone,
    Network
} from 'lucide-react';
import { cn } from '../utils';
import { usePlatform } from '../context/PlatformContext';
import { adminService } from '../services/admin.service';

const ProtocolToggle = ({ label, description, icon: Icon, active, onToggle, disabled }) => (
    <div className={cn("premium-card p-6 flex items-start justify-between group", disabled && "opacity-50 cursor-not-allowed")}>
        <div className="flex gap-4">
            <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm",
                active ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
            )}>
                <Icon size={24} />
            </div>
            <div className="space-y-1">
                <h4 className="text-sm font-bold text-gray-800">{label}</h4>
                <p className="text-[11px] text-gray-500 max-w-[200px] leading-relaxed">{description}</p>
            </div>
        </div>
        <button
            onClick={onToggle}
            disabled={disabled}
            className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                active ? "bg-blue-600" : "bg-gray-200"
            )}
        >
            <span className={cn(
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                active ? "translate-x-5" : "translate-x-0"
            )} />
        </button>
    </div>
);

import SecurityVaultModal from '../components/management/SecurityVaultModal';
import IpWhitelistModal from '../components/management/IpWhitelistModal';
import TwoFactorSetupModal from '../components/management/TwoFactorSetupModal';
import { LogOut } from 'lucide-react';
import { authService } from '../services/auth.service';

const SecuritySettings = () => {
    const { health, handleToggleSystemFreeze, refreshData, handleRevokeSession } = usePlatform();
    const [updating, setUpdating] = useState(false);
    const [adminList, setAdminList] = useState([]);
    const [showVault, setShowVault] = useState(false);
    const [showWhitelist, setShowWhitelist] = useState(false);
    const [show2FASetup, setShow2FASetup] = useState(false);
    const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());

    const fetchAdmins = async () => {
        try {
            const users = await adminService.getUsers();
            setAdminList(users.filter(u => u.role === 'admin' || u.role === 'Superuser').slice(0, 5));

            // Sync current user status if they are in the list
            const me = users.find(u => u._id === currentUser?.id);
            if (me) {
                const updatedUser = { ...currentUser, ...me };
                setCurrentUser(updatedUser);
                localStorage.setItem('admin_user', JSON.stringify(updatedUser));
            }
        } catch (err) {
            console.error('Failed to fetch admins:', err);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, [health?.activeSessions]); // Refresh when session count changes

    const handleProtocolToggle = async (key) => {
        try {
            setUpdating(true);
            const currentProtocols = health?.protocols || {};
            const updatedProtocols = {
                ...currentProtocols,
                [key]: !currentProtocols[key]
            };

            await adminService.updateSettings({ securityProtocols: updatedProtocols });
            await refreshData();
        } catch (err) {
            console.error('Failed to update protocol:', err);
        } finally {
            setUpdating(false);
        }
    };

    const isMaintenance = health?.status === 'Maintenance';

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header HUD (Same as before) */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-2">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-gray-900 flex items-center justify-center text-white shadow-lg shadow-gray-200">
                        <ShieldAlert size={32} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 tracking-tight leading-none">Security Genesis</h2>
                        <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-2">
                                <div className={cn("w-2 h-2 rounded-full animate-pulse", isMaintenance ? "bg-red-500" : "bg-blue-500")} />
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    {isMaintenance ? "Defense Protocol Active" : "Defense Protocol Alpha"}
                                </span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-gray-300" />
                            <span className="text-xs font-medium text-emerald-600 flex items-center gap-1.5">
                                <ShieldCheck size={12} />
                                System Encrypted
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trust Score</span>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="h-1.5 w-32 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full w-[94%] bg-gradient-to-r from-blue-500 to-emerald-500" />
                            </div>
                            <span className="text-xs font-bold text-gray-800">94%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Threat Intelligence Grid (Same as before) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Active Sessions', value: health?.activeSessions || '1', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Failed Attempts', value: health?.failedAttempts || '0', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Uptime Protocol', value: health?.uptime || '99.9%', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Global Traffic', value: 'Nominal', icon: Globe, color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map((stat, i) => (
                    <div key={i} className="premium-card p-6 flex flex-col items-center text-center gap-3">
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg)}>
                            <stat.icon size={24} className={stat.color} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-800 mt-2">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Global & Personal Protocols */}
                <div className="lg:col-span-1 space-y-10">
                    {/* Platform Enforcement */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-3">
                                <Zap size={20} className="text-blue-500" />
                                Global Protocols
                            </h3>
                            <button
                                onClick={() => setShowWhitelist(true)}
                                className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest"
                            >
                                Manage IPs
                            </button>
                        </div>
                        <div className="space-y-4">
                            <ProtocolToggle
                                label="Maintenance Mode"
                                description="Immediately freeze all user transactions and dashboard access."
                                icon={Lock}
                                active={isMaintenance}
                                onToggle={handleToggleSystemFreeze}
                            />
                            <ProtocolToggle
                                label="2FA Enforcement"
                                description="Require biometric or authenticator codes for all admin accounts."
                                icon={Smartphone}
                                active={health?.protocols?.enforce2fa}
                                disabled={updating}
                                onToggle={() => handleProtocolToggle('enforce2fa')}
                            />
                            <ProtocolToggle
                                label="IP Whitelisting"
                                description="Only allow access from recognized organizational network gateways."
                                icon={Network}
                                active={health?.protocols?.ipWhitelisting}
                                disabled={updating}
                                onToggle={() => handleProtocolToggle('ipWhitelisting')}
                            />
                        </div>
                    </div>

                    {/* Personal Account Security */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-3 px-1">
                            <ShieldCheck size={20} className="text-emerald-500" />
                            Personal Security
                        </h3>
                        <div className="space-y-4">
                            <ProtocolToggle
                                label="Google Authenticator"
                                description={currentUser?.twoFactorEnabled ? "Your account is protected by 2FA." : "Provision TOTP for your administrator node."}
                                icon={Smartphone}
                                active={currentUser?.twoFactorEnabled}
                                onToggle={() => currentUser?.twoFactorEnabled ? authService.disable2FA().then(fetchAdmins) : setShow2FASetup(true)}
                            />
                        </div>
                    </div>
                </div>

                {/* Access Control & Audit */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-3 px-1">
                            <Fingerprint size={20} className="text-blue-500" />
                            Access Control Matrix
                        </h3>
                        <div className="premium-card overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">Admin Entity</th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">Power Level</th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">Status</th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 text-right">Scope</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {(adminList.length > 0 ? adminList : [
                                        { _id: 1, name: 'Admin Node', role: 'admin', status: 'Active' }
                                    ]).map((admin) => (
                                        <tr key={admin._id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200">
                                                        <Users size={14} />
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-800">{admin.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase">
                                                    {admin.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    <span className="text-xs text-gray-500">Live</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button
                                                        onClick={() => handleRevokeSession(admin._id)}
                                                        title="Revoke Session"
                                                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                    >
                                                        <LogOut size={16} />
                                                    </button>
                                                    <button className="p-2 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                                        <Eye size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Quick Audit Bar */}
                    <div className="premium-card p-6 bg-gray-900 text-white flex items-center justify-between group overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:opacity-20 transition-opacity" />
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-blue-400 border border-white/5">
                                <Shield size={24} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold uppercase tracking-[0.1em]">Complete Audit Stream</h4>
                                <p className="text-[11px] text-gray-400 mt-1">Monitoring {health?.protocols?.auditLogsEnabled ? "Immutable" : "Standard"} security event records</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowVault(true)}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-900/40"
                        >
                            Launch Vault
                        </button>
                    </div>
                </div>
            </div>

            {showVault && (
                <SecurityVaultModal onClose={() => setShowVault(false)} />
            )}

            {showWhitelist && (
                <IpWhitelistModal onClose={() => setShowWhitelist(false)} />
            )}

            {show2FASetup && (
                <TwoFactorSetupModal
                    onClose={() => setShow2FASetup(false)}
                    onComplete={() => {
                        setShow2FASetup(false);
                        fetchAdmins();
                    }}
                />
            )}
        </div>
    );
};

export default SecuritySettings;

