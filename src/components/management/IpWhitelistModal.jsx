import React, { useState, useEffect } from 'react';
import { X, Network, Plus, Trash2, Globe, Shield, Loader2, AlertTriangle } from 'lucide-react';
import { adminService } from '../../services/admin.service';
import { useToast } from '../../context/ToastContext';

const IpWhitelistModal = ({ onClose, refreshParent }) => {
    const [whitelist, setWhitelist] = useState([]);
    const [newIp, setNewIp] = useState('');
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [myIp, setMyIp] = useState('');
    const toast = useToast();

    const fetchData = async () => {
        try {
            const [settings, ipData] = await Promise.all([
                adminService.getSettings(),
                adminService.getMyIp()
            ]);
            setWhitelist(settings.securityProtocols.ipWhitelist || []);
            setMyIp(ipData.ip);
        } catch (err) {
            console.error('Failed to fetch IP data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddIp = async (ipToAdd = newIp) => {
        if (!ipToAdd) return;
        try {
            setActionLoading(true);
            await adminService.addWhitelistedIp(ipToAdd);
            toast.success('IP Added to Whitelist');
            setNewIp('');
            await fetchData();
            if (refreshParent) refreshParent();
        } catch (err) {
            toast.error('Failed to add IP');
        } finally {
            setActionLoading(false);
        }
    };

    const handleRemoveIp = async (ip) => {
        try {
            setActionLoading(true);
            await adminService.removeWhitelistedIp(ip);
            toast.success('IP Removed');
            await fetchData();
            if (refreshParent) refreshParent();
        } catch (err) {
            toast.error('Failed to remove IP');
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl w-full max-w-lg flex flex-col overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <Network size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">IP Whitelist Matrix</h3>
                            <p className="text-[10px] text-gray-500 mt-0.5">Manage recognized network gateways</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Add IP */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Register New Entry</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Enter IPv4 or IPv6 address"
                                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                                value={newIp}
                                onChange={(e) => setNewIp(e.target.value)}
                            />
                            <button
                                onClick={() => handleAddIp()}
                                disabled={actionLoading || !newIp}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                                {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                                ADD
                            </button>
                        </div>
                        {myIp && !whitelist.includes(myIp) && (
                            <button
                                onClick={() => handleAddIp(myIp)}
                                className="text-[10px] text-blue-600 font-bold hover:underline flex items-center gap-1.5 px-1"
                            >
                                <Globe size={10} />
                                Trust My Current IP: {myIp}
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Whitelist</label>
                        <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                            {loading ? (
                                <div className="py-10 flex flex-col items-center justify-center gap-3">
                                    <Loader2 className="text-blue-500 animate-spin" size={24} />
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">Scanning Network...</span>
                                </div>
                            ) : whitelist.length === 0 ? (
                                <div className="py-10 text-center border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center gap-3">
                                    <Shield className="text-gray-200" size={32} />
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">No Restricted Gateways</p>
                                </div>
                            ) : (
                                whitelist.map((ip, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            <span className="text-xs font-mono font-bold text-gray-700">{ip}</span>
                                            {ip === myIp && <span className="text-[8px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-black">YOU</span>}
                                        </div>
                                        <button
                                            onClick={() => handleRemoveIp(ip)}
                                            className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] text-amber-600 font-bold uppercase tracking-tight">
                        <AlertTriangle size={12} />
                        Enforcement active on all Admin APIs
                    </div>
                    <button
                        onClick={onClose}
                        className="text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IpWhitelistModal;
