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
    Loader2,
    Plus,
    Trash2,
    Edit2,
    Copy,
    Check
} from 'lucide-react';
import { adminService } from '../services/admin.service';
import { useToast } from '../context/ToastContext';
import { usePlatform } from '../context/PlatformContext';
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

const CRYPTO_OPTIONS = [
    { value: 'BTC', label: 'Bitcoin (BTC)' },
    { value: 'ETH', label: 'Ethereum (ETH)' },
    { value: 'BNB', label: 'BNB (BNB)' },
    { value: 'LTC', label: 'Litecoin (LTC)' },
    { value: 'USDT_TRC20', label: 'Tether (USDT TRC20)' },
    { value: 'USDT_ERC20', label: 'Tether (USDT ERC20)' }
];

const NETWORK_OPTIONS = [
    { value: 'Bitcoin', label: 'Bitcoin Network' },
    { value: 'Ethereum', label: 'Ethereum (ERC20)' },
    { value: 'BEP20', label: 'BNB Chain (BEP20)' },
    { value: 'Litecoin', label: 'Litecoin Network' },
    { value: 'TRC20', label: 'Tron (TRC20)' },
    { value: 'ERC20', label: 'Ethereum (ERC20)' }
];

const PlatformSettings = () => {
    const toast = useToast();
    const { health, handleToggleSystemFreeze, refreshData } = usePlatform();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState(null);
    const [wallets, setWallets] = useState([]);
    const [walletsLoading, setWalletsLoading] = useState(false);

    // New Wallet Modal State
    const [showWalletModal, setShowWalletModal] = useState(false);
    const [editingWallet, setEditingWallet] = useState(null);
    const [walletForm, setWalletForm] = useState({
        currency: 'BTC',
        address: '',
        network: 'Bitcoin',
        label: '',
        isActive: true
    });

    useEffect(() => {
        fetchSettings();
        fetchWallets();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const data = await adminService.getSettings();
            setSettings(data);
        } catch (error) {
            toast.error('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await adminService.updateSettings(settings);
            toast.success('Settings updated successfully');
        } catch (error) {
            toast.error('Failed to update settings');
        } finally {
            setSaving(false);
        }
    };

    const fetchWallets = async () => {
        try {
            setWalletsLoading(true);
            const data = await adminService.getAdminCryptoWallets();
            setWallets(data || []);
        } catch (error) {
            console.error('Failed to load wallets:', error);
            toast.error('Failed to load crypto wallets');
        } finally {
            setWalletsLoading(false);
        }
    };

    const handleSaveWallet = async () => {
        try {
            if (editingWallet) {
                await adminService.updateCryptoWallet(editingWallet._id, walletForm);
                toast.success('Wallet updated');
            } else {
                await adminService.createCryptoWallet(walletForm);
                toast.success('Wallet created');
            }
            setShowWalletModal(false);
            fetchWallets();
        } catch (error) {
            toast.error('Failed to save wallet');
        }
    };

    const handleDeleteWallet = async (id) => {
        if (!window.confirm('Are you sure you want to delete this wallet?')) return;
        try {
            await adminService.deleteCryptoWallet(id);
            toast.success('Wallet deleted');
            fetchWallets();
        } catch (error) {
            toast.error('Failed to delete wallet');
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Address copied');
    };

    const toggleMaintenance = async () => {
        try {
            await handleToggleSystemFreeze();
            fetchSettings(); // Refresh settings to show updated status
        } catch (error) {
            toast.error('Maintenance toggle failed');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Accessing System Core...</p>
            </div>
        );
    }

    if (!settings) {
        return (
            <div className="flex flex-col items-center justify-center py-40 px-6 text-center">
                <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center text-red-500 mb-6 shadow-xl shadow-red-100/50">
                    <Shield size={40} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Connection Severed</h3>
                <p className="text-gray-500 font-medium max-w-sm mb-8">The platform engine is currently unreachable. Please verify backend status and security credentials.</p>
                <button
                    onClick={() => {
                        fetchSettings();
                        fetchWallets();
                    }}
                    className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all hover:scale-105 active:scale-95"
                >
                    Re-establish Uplink
                </button>
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
                                Last Sync: {settings?.updatedAt ? new Date(settings.updatedAt).toLocaleTimeString() : 'Never'}
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
                        health?.status === 'Maintenance'
                            ? "bg-red-50/50 border-red-100 ring-4 ring-red-500/5"
                            : "bg-emerald-50/50 border-emerald-100 ring-4 ring-emerald-500/5"
                    )}>
                        <div className="flex gap-4">
                            <div className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500",
                                health?.status === 'Maintenance' ? "bg-red-600 text-white shadow-lg shadow-red-200" : "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                            )}>
                                {health?.status === 'Maintenance' ? <Lock size={20} /> : <Unlock size={20} />}
                            </div>
                            <div>
                                <h4 className={cn("text-sm font-black uppercase tracking-widest", health?.status === 'Maintenance' ? "text-red-700" : "text-emerald-700")}>
                                    {health?.status === 'Maintenance' ? "Maintenance Active" : "Systems Nominal"}
                                </h4>
                                <p className="text-[11px] text-gray-500 font-medium mt-1 leading-relaxed max-w-[180px]">
                                    {health?.status === 'Maintenance'
                                        ? "Dashboard access is restricted. Transaction processing is frozen."
                                        : "All systems operational. User access is unrestricted."}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={toggleMaintenance}
                            className={cn(
                                "relative w-14 h-8 rounded-full transition-all duration-500 p-1 group-hover/m:scale-110",
                                health?.status === 'Maintenance' ? "bg-red-600" : "bg-emerald-600"
                            )}
                        >
                            <div className={cn(
                                "w-6 h-6 bg-white rounded-full transition-all duration-500 shadow-md",
                                health?.status === 'Maintenance' ? "translate-x-6" : "translate-x-0"
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
                                value={settings?.referral?.rewardPercent}
                                onChange={(val) => setSettings(s => ({ ...s, referral: { ...s.referral, rewardPercent: parseFloat(val) } }))}
                                suffix="%"
                                helper="Percentage of the referred user's first investment."
                            />
                            <InputField
                                label="Max Reward Per User"
                                value={settings?.referral?.maxRewardPerReferral}
                                onChange={(val) => setSettings(s => ({ ...s, referral: { ...s.referral, maxRewardPerReferral: parseFloat(val) } }))}
                                prefix="$"
                                helper="Maximum bonus amount for a single referral."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                label="Max Referrals Lifetime"
                                value={settings?.referral?.maxReferralsLifetime}
                                onChange={(val) => setSettings(s => ({ ...s, referral: { ...s.referral, maxReferralsLifetime: parseInt(val) } }))}
                                helper="Limit on total referrals per user."
                            />
                            <InputField
                                label="Max Earnings Lifetime"
                                value={settings?.referral?.maxEarningsLifetime}
                                onChange={(val) => setSettings(s => ({ ...s, referral: { ...s.referral, maxEarningsLifetime: parseFloat(val) } }))}
                                prefix="$"
                                helper="Total referral earnings limit per user."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                label="Unlock Period"
                                value={settings?.referral?.unlockDays}
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
                                        settings?.referral?.activeInvestmentRequired ? "bg-blue-600" : "bg-gray-200"
                                    )}>
                                        <div className={cn(
                                            "w-4 h-4 bg-white rounded-full transition-all duration-500 shadow-sm",
                                            settings?.referral?.activeInvestmentRequired ? "translate-x-4" : "translate-x-0"
                                        )} />
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-400 font-medium ml-1 italic">Referrer must have an active investment to earn.</p>
                            </div>
                        </div>
                    </div>
                </SettingSection>

                {/* Crypto Architecture */}
                <SettingSection
                    title="Crypto Protocol"
                    icon={Wallet}
                    description="Blockchain parameters and transactional boundaries"
                >
                    <div className="space-y-8">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 mb-4">
                            <div className="flex items-center gap-3">
                                <div className={cn("w-3 h-3 rounded-full", settings?.crypto?.enabled ? "bg-emerald-500 animate-pulse" : "bg-gray-400")} />
                                <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">Crypto Gateway {settings?.crypto?.enabled ? 'Active' : 'Offline'}</span>
                            </div>
                            <button
                                onClick={() => setSettings(s => ({ ...s, crypto: { ...s?.crypto, enabled: !s?.crypto?.enabled } }))}
                                className={cn(
                                    "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                    settings?.crypto?.enabled ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                )}
                            >
                                {settings?.crypto?.enabled ? 'Disable' : 'Enable'}
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-1 h-4 bg-blue-500 rounded-full" />
                                <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest">Inbound Boundaries (USD)</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <InputField
                                    label="Min Deposit"
                                    value={settings?.crypto?.depositMinUsd}
                                    onChange={(val) => setSettings(s => ({ ...s, crypto: { ...s.crypto, depositMinUsd: parseFloat(val) } }))}
                                    prefix="$"
                                />
                                <InputField
                                    label="Max Deposit"
                                    value={settings?.crypto?.depositMaxUsd}
                                    onChange={(val) => setSettings(s => ({ ...s, crypto: { ...s.crypto, depositMaxUsd: parseFloat(val) } }))}
                                    prefix="$"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-gray-50">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                                <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest">Outbound Boundaries (USD)</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <InputField
                                    label="Min Withdrawal"
                                    value={settings?.crypto?.withdrawalMinUsd}
                                    onChange={(val) => setSettings(s => ({ ...s, crypto: { ...s.crypto, withdrawalMinUsd: parseFloat(val) } }))}
                                    prefix="$"
                                />
                                <InputField
                                    label="Max Withdrawal"
                                    value={settings?.crypto?.withdrawalMaxUsd}
                                    onChange={(val) => setSettings(s => ({ ...s, crypto: { ...s.crypto, withdrawalMaxUsd: parseFloat(val) } }))}
                                    prefix="$"
                                />
                            </div>
                        </div>
                    </div>
                </SettingSection>

                {/* Crypto Wallets Control */}
                <div className="md:col-span-2">
                    <SettingSection
                        title="Admin Deposit Wallets"
                        icon={Wallet}
                        description="Manage the addresses used for customer deposits"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-xs text-gray-500 font-medium">Configure wallets for each supported network. Revisit regularily to ensure security.</p>
                            <button
                                onClick={() => {
                                    setEditingWallet(null);
                                    setWalletForm({ currency: 'BTC', address: '', network: 'Bitcoin', label: '', isActive: true });
                                    setShowWalletModal(true);
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                            >
                                <Plus size={14} />
                                Add New Wallet
                            </button>
                        </div>

                        {walletsLoading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="animate-spin text-blue-600" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {wallets.map(wallet => (
                                    <div key={wallet._id} className="p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-all group/wallet relative overflow-hidden">
                                        <div className="flex items-start justify-between relative z-10">
                                            <div className="flex gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                                                    <span className="text-sm font-black text-blue-600">{wallet.currency}</span>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="text-sm font-bold text-gray-800">{wallet.label || wallet.currency}</h4>
                                                        {!wallet.isActive && <span className="text-[8px] font-black text-red-500 uppercase px-1.5 py-0.5 bg-red-50 rounded">Inactive</span>}
                                                    </div>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{wallet.network}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover/wallet:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => {
                                                        setEditingWallet(wallet);
                                                        setWalletForm({ ...wallet });
                                                        setShowWalletModal(true);
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-blue-600 bg-white border border-gray-100 rounded-lg shadow-sm"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteWallet(wallet._id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 bg-white border border-gray-100 rounded-lg shadow-sm"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mt-4 p-3 bg-white rounded-xl border border-gray-100 flex items-center justify-between gap-4">
                                            <span className="text-[10px] font-mono text-gray-500 truncate">{wallet.address}</span>
                                            <button
                                                onClick={() => handleCopy(wallet.address)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Copy size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {wallets.length === 0 && (
                                    <div className="col-span-2 py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No wallets configured</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </SettingSection>
                </div>
            </div>

            {/* Wallet Modal */}
            {showWalletModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setShowWalletModal(false)} />
                    <div className="relative bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-300">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">{editingWallet ? 'Edit Wallet' : 'Add New Wallet'}</h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Asset</label>
                                <select
                                    value={walletForm.currency}
                                    onChange={(e) => setWalletForm({ ...walletForm, currency: e.target.value })}
                                    className="w-full bg-white border border-gray-100 rounded-xl py-4 px-6 text-sm font-bold text-gray-800 outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 hover:border-blue-200 appearance-none"
                                >
                                    {CRYPTO_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Network</label>
                                <select
                                    value={walletForm.network}
                                    onChange={(e) => setWalletForm({ ...walletForm, network: e.target.value })}
                                    className="w-full bg-white border border-gray-100 rounded-xl py-4 px-6 text-sm font-bold text-gray-800 outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 hover:border-blue-200 appearance-none"
                                >
                                    {NETWORK_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>

                            <InputField
                                label="Wallet Address"
                                type="text"
                                value={walletForm.address}
                                onChange={(val) => setWalletForm({ ...walletForm, address: val })}
                                helper="The public address where users send funds"
                            />
                            <InputField
                                label="Label"
                                type="text"
                                value={walletForm.label}
                                onChange={(val) => setWalletForm({ ...walletForm, label: val })}
                                helper="A friendly name for this wallet"
                            />
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Status</span>
                                <button
                                    onClick={() => setWalletForm({ ...walletForm, isActive: !walletForm.isActive })}
                                    className={cn(
                                        "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                        walletForm.isActive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                                    )}
                                >
                                    {walletForm.isActive ? 'Active' : 'Inactive'}
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={() => setShowWalletModal(false)}
                                className="flex-1 py-4 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveWallet}
                                className="flex-1 py-4 bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all"
                            >
                                {editingWallet ? 'Save Changes' : 'Create Wallet'}
                            </button>
                        </div>
                    </div>
                </div>
            )}


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
