import React, { useState } from 'react';
import {
    Terminal,
    Search,
    Download,
    Trash2,
    Cpu,
    User,
    Calendar,
    Layers,
    Activity,
    ArrowRight
} from 'lucide-react';
import { cn } from '../utils';

const ActionLogs = () => {
    const [filter, setFilter] = useState('All Events');

    const logs = [
        { id: '1', action: 'Asset Strategic Shift', admin: 'Prime Admin', date: '2024-10-15 10:30:12', type: 'Strategy', status: 'Verified', details: 'Treasury ROI updated to 15.5%' },
        { id: '2', user: 'Sarah Wilson', action: 'Neural Identity Cleared', admin: 'System Engine', date: '2024-10-15 09:12:45', type: 'Validation', status: 'Verified', details: 'KYC Tier 2 automated approval' },
        { id: '3', action: 'System Kernel Patch', admin: 'Prime Admin', date: '2024-10-15 08:00:00', type: 'Maintenance', status: 'Nominal', details: 'API v2.4 deployment successful' },
        { id: '4', user: 'Michael Chen', action: 'Capital Restricted', admin: 'Risk Module', date: '2024-10-14 23:45:10', type: 'Security', status: 'Alert', details: 'Suspicious withdrawal attempt of $12K' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header HUD */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-2">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                        <Terminal size={32} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 tracking-tight leading-none">System Audit Vault</h2>
                        <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Immutable Event Stream</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-gray-300" />
                            <span className="text-xs font-medium text-emerald-600 flex items-center gap-1.5">
                                <Activity size={12} />
                                System Integrity: 99.9%
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl text-xs font-bold transition-all hover:opacity-90 active:scale-95 shadow-lg">
                        <Download size={16} />
                        Export Vault
                    </button>
                    <button className="p-3 bg-white border border-gray-200 hover:border-rose-200 hover:text-rose-500 rounded-xl text-gray-400 transition-all shadow-sm">
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {/* Event Log Stream */}
            <div className="premium-card overflow-hidden">
                <div className="p-6 lg:p-8 space-y-8">
                    {/* Search / Filter Context */}
                    <div className="flex flex-col md:flex-row items-center gap-6 pb-8 border-b border-gray-100">
                        <div className="relative flex-1 group w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search system traces..."
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-12 pr-6 text-sm focus:border-blue-500/30 focus:bg-white outline-none transition-all placeholder:text-gray-400 font-medium"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            {['All Events', 'Security', 'Strategy'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={cn(
                                        "px-5 py-2 rounded-lg text-xs font-bold transition-all",
                                        filter === f ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600"
                                    )}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Timeline Interaction */}
                    <div className="space-y-4">
                        {logs.map((log, index) => (
                            <div
                                key={log.id}
                                className="group premium-card !bg-gray-50/50 hover:!bg-white border-transparent hover:border-gray-100 p-6 flex flex-col xl:flex-row items-start xl:items-center gap-8 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Timestamp HUD */}
                                <div className="flex items-center gap-4 shrink-0 xl:w-48">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-emerald-600 transition-colors shadow-sm">
                                        <Calendar size={18} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-gray-800 tracking-tight font-mono">{log.date.split(' ')[1]}</span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">{log.date.split(' ')[0]}</span>
                                    </div>
                                </div>

                                {/* Event Details */}
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className={cn(
                                            "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                                            log.type === 'Security' ? "bg-rose-50 text-rose-600 border-rose-100" :
                                                log.type === 'Strategy' ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                    "bg-emerald-50 text-emerald-600 border-emerald-100"
                                        )}>
                                            {log.type}
                                        </span>
                                        <h4 className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                            {log.action}
                                        </h4>
                                    </div>
                                    <p className="text-xs text-gray-500 font-medium">Trace Context: <span className="text-gray-700 italic font-medium">{log.details}</span></p>
                                </div>

                                {/* Actor Protocol */}
                                <div className="flex items-center gap-4 shrink-0 xl:w-56 justify-start xl:justify-end">
                                    <div className="text-left xl:text-right">
                                        <p className="text-xs font-bold text-gray-800 leading-none">{log.admin}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5 flex items-center gap-1.5 justify-start xl:justify-end">
                                            <Layers size={10} />
                                            Origin Node
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white overflow-hidden shadow-sm">
                                        <img src={`https://ui-avatars.com/api/?name=${log.admin}&background=random`} alt={log.admin} />
                                    </div>
                                </div>

                                <div className="absolute right-6 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 hidden xl:block">
                                    <ArrowRight className="text-blue-500" size={18} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActionLogs;
