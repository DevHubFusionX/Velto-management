import React, { useState, useEffect } from 'react';
import {
    Settings,
    Save,
    Shield,
    DollarSign,
    ArrowRight,
    Lock,
    Unlock,
    Info,
    RefreshCw,
    Wallet,
    Percent,
    Loader2
} from 'lucide-react';
import { adminService } from '../services/admin.service';
import { useToast } from '../context/ToastContext';
import { cn } from '../utils';

const SettingSection = ({ title, icon: Icon, children, description }) => (
    <div className="premium-card p-8 space-y-6 relative overflow-hidden group">
        <div className="flex items-start justify-between">
            <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/5 border border-blue-600/10 flex items-center justify-center text-blue-600 transition-transform group-hover:scale-110 duration-500">
                    <Icon size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-800 tracking-tight">{title}</h3>
                    <p className="text-sm text-gray-400 mt-1 font-medium">{description}</p>
                </div>
            </div>
        </div>
        <div className="pt-2">
            {children}
        </div>
    </div>
);

const InputField = ({ label, value, onChange, type = "number", suffix, prefix, helper }) => (
    <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">{label}</label>
        <div className="relative group/input">
            {prefix && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                    {prefix}
                </div>
            )}
            <input
                type={type}
                value={value !== undefined && value !== null ? value : ''}
                onChange={(e) => onChange(e.target.value)}
                className={cn(
                    "w-full bg-white border border-gray-100 rounded-xl py-4 px-6 text-sm font-bold text-gray-800 outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 hover:border-blue-200",
                    prefix && "pl-10",
                    suffix && "pr-12"
                )}
            />
            {suffix && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                    {suffix}
                </div>
            )}
        </div>
        {helper && <p className="text-[10px] text-gray-400 font-medium ml-1 italic">{helper}</p>}
    </div>
);

const PlatformSettings = () => {
    const { addToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const data = await adminService.getSettings();
            setSettings(data);
        } catch (error) {
            addToast('Failed to load settings', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await adminService.updateSettings(settings);
            addToast('Settings updated successfully', 'success');
        } catch (error) {
            addToast('Failed to update settings', 'error');
        } finally {
            setSaving(false);
        }
    };

    const toggleMaintenance = () => {
        setSettings(prev => ({
            ...prev,
            maintenanceMode: !prev.maintenanceMode
        }));
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Accessing System Core...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header HUD */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-gray-900 flex items-center justify-center text-white shadow-2xl shadow-gray-200 transition-transform hover:rotate-6">
                        <Settings size={32} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-gray-800 tracking-tight leading-none">System Engine</h2>
                        <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Platform Core v4.2</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-gray-200" />
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <RefreshCw size={12} className={saving ? 'animate-spin' : ''} />
                                Last Sync: {new Date(settings.updatedAt).toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="group relative px-8 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-gray-200 disabled:opacity-50 flex items-center gap-3 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <span className="relative flex items-center gap-3">
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {saving ? 'Synchronizing...' : 'Commit Changes'}
                    </span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Global Protocols */}
                <SettingSection
                    title="Defense Protocol"
                    icon={Shield}
                    description="Global system state and access restrictions"
                >
                    <div className={cn(
                        "p-6 rounded-2xl border transition-all duration-500 flex items-center justify-between group/m",
                        settings.maintenanceMode
                            ? "bg-red-50/50 border-red-100 ring-4 ring-red-500/5"
                            : "bg-emerald-50/50 border-emerald-100 ring-4 ring-emerald-500/5"
                    )}>
                        <div className="flex gap-4">
                            <div className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500",
                                settings.maintenanceMode ? "bg-red-600 text-white shadow-lg shadow-red-200" : "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                            )}>
                                {settings.maintenanceMode ? <Lock size={20} /> : <Unlock size={20} />}
                            </div>
                            <div>
                                <h4 className={cn("text-sm font-black uppercase tracking-widest", settings.maintenanceMode ? "text-red-700" : "text-emerald-700")}>
                                    {settings.maintenanceMode ? "Maintenance Active" : "Systems Nominal"}
                                </h4>
                                <p className="text-[11px] text-gray-500 font-medium mt-1 leading-relaxed max-w-[180px]">
                                    {settings.maintenanceMode
                                        ? "Dashboard access is restricted. Transaction processing is frozen."
                                        : "All systems operational. User access is unrestricted."}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={toggleMaintenance}
                            className={cn(
                                "relative w-14 h-8 rounded-full transition-all duration-500 p-1 group-hover/m:scale-110",
                                settings.maintenanceMode ? "bg-red-600" : "bg-emerald-600"
                            )}
                        >
                            <div className={cn(
                                "w-6 h-6 bg-white rounded-full transition-all duration-500 shadow-md",
                                settings.maintenanceMode ? "translate-x-6" : "translate-x-0"
                            )} />
                        </button>
                    </div>
                </SettingSection>

                {/* Referral Ecosystem */}
                <SettingSection
                    title="Referral Ecosystem"
                    icon={Percent}
                    description="Growth parameters and anti-fraud protocols"
                >
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                label="Reward Percentage"
                                value={settings.referral?.rewardPercent}
                                onChange={(val) => setSettings(s => ({ ...s, referral: { ...s.referral, rewardPercent: parseFloat(val) } }))}
                                suffix="%"
                                helper="Percentage of the referred user's first investment."
                            />
                            <InputField
                                label="Max Reward Per User"
                                value={settings.referral?.maxRewardPerReferral}
                                onChange={(val) => setSettings(s => ({ ...s, referral: { ...s.referral, maxRewardPerReferral: parseFloat(val) } }))}
                                prefix="₦"
                                helper="Maximum bonus amount for a single referral."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                label="Max Referrals Lifetime"
                                value={settings.referral?.maxReferralsLifetime}
                                onChange={(val) => setSettings(s => ({ ...s, referral: { ...s.referral, maxReferralsLifetime: parseInt(val) } }))}
                                helper="Limit on total referrals per user."
                            />
                            <InputField
                                label="Max Earnings Lifetime"
                                value={settings.referral?.maxEarningsLifetime}
                                onChange={(val) => setSettings(s => ({ ...s, referral: { ...s.referral, maxEarningsLifetime: parseFloat(val) } }))}
                                prefix="₦"
                                helper="Total referral earnings limit per user."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                label="Unlock Period"
                                value={settings.referral?.unlockDays}
                                onChange={(val) => setSettings(s => ({ ...s, referral: { ...s.referral, unlockDays: parseInt(val) } }))}
                                suffix="Days"
                                helper="Wait time before reward matures."
                            />
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Investment Required</label>
                                <div
                                    onClick={() => setSettings(s => ({ ...s, referral: { ...s.referral, activeInvestmentRequired: !s.referral?.activeInvestmentRequired } }))}
                                    className={cn(
                                        "w-full bg-white border border-gray-100 rounded-xl py-4 px-6 flex items-center justify-between cursor-pointer transition-all duration-300 hover:border-blue-200",
                                        settings.referral?.activeInvestmentRequired ? "bg-blue-50/30 border-blue-100" : ""
                                    )}
                                >
                                    <span className="text-sm font-bold text-gray-800">Active Investment</span>
                                    <div className={cn(
                                        "w-10 h-6 rounded-full p-1 transition-all duration-500",
                                        settings.referral?.activeInvestmentRequired ? "bg-blue-600" : "bg-gray-200"
                                    )}>
                                        <div className={cn(
                                            "w-4 h-4 bg-white rounded-full transition-all duration-500 shadow-sm",
                                            settings.referral?.activeInvestmentRequired ? "translate-x-4" : "translate-x-0"
                                        )} />
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-400 font-medium ml-1 italic">Referrer must have an active investment to earn.</p>
                            </div>
                        </div>
                    </div>
                </SettingSection>

                {/* Financial Architecture */}
                <SettingSection
                    title="Financial Gates"
                    icon={Wallet}
                    description="Transactional limits and boundary parameters"
                >
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-1 h-4 bg-blue-500 rounded-full" />
                                <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest">Deposit Boundaries</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <InputField
                                    label="Min (NGN)"
                                    value={settings.limits.deposit.min.ngn}
                                    onChange={(val) => setSettings(s => ({ ...s, limits: { ...s.limits, deposit: { ...s.limits.deposit, min: { ...s.limits.deposit.min, ngn: parseFloat(val) } } } }))}
                                />
                                <InputField
                                    label="Min (USD)"
                                    value={settings.limits.deposit.min.usd}
                                    onChange={(val) => setSettings(s => ({ ...s, limits: { ...s.limits, deposit: { ...s.limits.deposit, min: { ...s.limits.deposit.min, usd: parseFloat(val) } } } }))}
                                    prefix="$"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <InputField
                                    label="Max (NGN)"
                                    value={settings.limits.deposit.max.ngn}
                                    onChange={(val) => setSettings(s => ({ ...s, limits: { ...s.limits, deposit: { ...s.limits.deposit, max: { ...s.limits.deposit.max, ngn: parseFloat(val) } } } }))}
                                />
                                <InputField
                                    label="Max (USD)"
                                    value={settings.limits.deposit.max.usd}
                                    onChange={(val) => setSettings(s => ({ ...s, limits: { ...s.limits, deposit: { ...s.limits.deposit, max: { ...s.limits.deposit.max, usd: parseFloat(val) } } } }))}
                                    prefix="$"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-gray-50">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                                <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest">Withdrawal Boundaries</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <InputField
                                    label="Min (NGN)"
                                    value={settings.limits.withdrawal.min.ngn}
                                    onChange={(val) => setSettings(s => ({ ...s, limits: { ...s.limits, withdrawal: { ...s.limits.withdrawal, min: { ...s.limits.withdrawal.min, ngn: parseFloat(val) } } } }))}
                                />
                                <InputField
                                    label="Min (USD)"
                                    value={settings.limits.withdrawal.min.usd}
                                    onChange={(val) => setSettings(s => ({ ...s, limits: { ...s.limits, withdrawal: { ...s.limits.withdrawal, min: { ...s.limits.withdrawal.min, usd: parseFloat(val) } } } }))}
                                    prefix="$"
                                />
                            </div>
                        </div>
                    </div>
                </SettingSection>
            </div>

            {/* Bottom Info Bar */}
            <div className="premium-card p-6 bg-blue-50/50 border-blue-100 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-100">
                        <Info size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-blue-800 uppercase tracking-widest leading-none">Configuration Notice</p>
                        <p className="text-[11px] text-blue-600/70 font-medium mt-1">Updates to financial gates and protocols are immutable once committed and affect all active users immediately.</p>
                    </div>
                </div>
                <ArrowRight size={20} className="text-blue-400 group-hover:translate-x-2 transition-transform duration-500" />
            </div>
        </div>
    );
};

export default PlatformSettings;
