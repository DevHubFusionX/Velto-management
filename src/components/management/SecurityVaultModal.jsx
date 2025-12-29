import React, { useState, useEffect } from 'react';
import { X, Shield, Terminal, Clock, User, Info, AlertTriangle, CheckCircle2, History } from 'lucide-react';
import { adminService } from '../../services/admin.service';
import { cn } from '../../utils';

const SecurityVaultModal = ({ onClose }) => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const data = await adminService.getLogs();
                setLogs(data);
            } catch (err) {
                console.error('Failed to fetch audit logs:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'success': return <CheckCircle2 size={14} className="text-emerald-400" />;
            case 'warning': return <AlertTriangle size={14} className="text-amber-400" />;
            case 'error': return <AlertTriangle size={14} className="text-red-400" />;
            default: return <Info size={14} className="text-blue-400" />;
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-300">
            <div className="bg-[#0a0a0c] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                {/* Modal Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-gray-900 to-black">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400 border border-blue-500/20">
                            <Shield size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-2">
                                Security Vault
                                <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">IMMUTABLE</span>
                            </h3>
                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                                <History size={12} />
                                Comprehensive Audit Stream for Platform Integrity
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Log List */}
                <div className="flex-1 overflow-y-auto p-4 bg-[#050505] font-mono">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 gap-4">
                            <Terminal className="text-blue-500 animate-pulse" size={48} />
                            <p className="text-xs text-blue-400 animate-pulse font-bold tracking-[0.2em] uppercase">Decrypting Audit Stream...</p>
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 gap-4 text-gray-500">
                            <Shield size={48} className="opacity-20" />
                            <p className="text-xs font-bold uppercase tracking-widest">No Security Events Recorded</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {logs.map((log) => (
                                <div key={log._id} className="group border border-white/[0.03] hover:border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] p-4 rounded-xl transition-all">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1">
                                                {getStatusIcon(log.status)}
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-wider bg-blue-400/10 px-2 py-0.5 rounded">
                                                        {log.action}
                                                    </span>
                                                    <span className="text-xs font-bold text-gray-200">{log.details}</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-[10px] text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <User size={10} />
                                                        {log.user?.name || 'SYSTEM/ANONYMOUS'}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={10} />
                                                        {new Date(log.timestamp).toLocaleString()}
                                                    </span>
                                                    <span className="text-[8px] opacity-40 uppercase font-bold tracking-tight">IP: {log.ip || '---'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-[9px] text-gray-600 hidden lg:block max-w-[200px] truncate opacity-40 group-hover:opacity-100 transition-opacity">
                                            {log.userAgent}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t border-white/5 bg-black flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Live Monitoring Active
                    </div>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/5"
                    >
                        Close Vault
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SecurityVaultModal;
