import React, { useState } from 'react';
import {
    Send,
    Mail,
    MessageSquare,
    Bell,
    Users,
    Zap,
    BarChart3,
    Clock,
    CheckCircle2,
    AlertCircle,
    Plus,
    Filter,
    ArrowUpRight,
    Telescope
} from 'lucide-react';
import { cn } from '../utils';

const CommunicationsCenter = () => {
    const [selectedType, setSelectedType] = useState('Email');
    const [audience, setAudience] = useState('All Users');

    const recentBroadcasts = [
        { id: 1, title: 'October Performance Report', type: 'Email', date: '2024-10-20 09:00', status: 'Delivered', reach: '1,240' },
        { id: 2, title: 'System Security Protocol Update', type: 'Push', date: '2024-10-19 14:30', status: 'Processing', reach: '850' },
        { id: 3, title: 'Flash Interest Rate Hike', type: 'SMS', date: '2024-10-18 10:15', status: 'Failed', reach: '3,100' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header HUD */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-2">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                        <Telescope size={32} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 tracking-tight leading-none">Command Center</h2>
                        <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Transmission Active</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-gray-300" />
                            <span className="text-xs font-medium text-blue-600 flex items-center gap-1.5">
                                <Zap size={12} />
                                1.2M Ready for Dispatch
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl text-xs font-bold transition-all hover:opacity-90 active:scale-95 shadow-lg">
                        <Plus size={16} />
                        New Blueprint
                    </button>
                </div>
            </div>

            {/* Transmission HUD Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Network Reach', value: '45.2K', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Transmission Rate', value: '98.4%', icon: Send, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Engagement HUD', value: '24.1%', icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Avg. Latency', value: '1.2s', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                ].map((stat, i) => (
                    <div key={i} className="premium-card p-6 flex items-center gap-6 group">
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110", stat.bg)}>
                            <stat.icon size={24} className={stat.color} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-xl font-bold text-gray-800 mt-1">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Broadcast Hub */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="premium-card p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold text-gray-800">Omnichannel Dispatch</h3>
                            <div className="flex p-1 bg-gray-100 rounded-xl">
                                {['Email', 'Push', 'SMS'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setSelectedType(type)}
                                        className={cn(
                                            "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                                            selectedType === type ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                                        )}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Audience</label>
                                    <select
                                        value={audience}
                                        onChange={(e) => setAudience(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    >
                                        <option>All Users</option>
                                        <option>Active Investors</option>
                                        <option>High Net Worth</option>
                                        <option>Pending KYCs</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Blueprint Theme</label>
                                    <div className="flex gap-2">
                                        <div className="w-10 h-10 rounded-lg bg-blue-600" />
                                        <div className="w-10 h-10 rounded-lg bg-emerald-500" />
                                        <div className="w-10 h-10 rounded-lg bg-amber-500" />
                                        <div className="w-10 h-10 rounded-lg bg-purple-500" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Blueprint Content</label>
                                <input
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    placeholder="Enter subject line..."
                                />
                                <textarea
                                    rows={5}
                                    className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    placeholder="Compose your transmission..."
                                />
                            </div>

                            <div className="flex items-center justify-between pt-4">
                                <span className="text-xs text-gray-500 italic">Targeting {audience} via {selectedType} blueprint.</span>
                                <button className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                                    <Send size={16} />
                                    Initiate Dispatch
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dispatch Log Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center justify-between px-1">
                        Recent Log
                        <button className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">View All</button>
                    </h3>
                    <div className="space-y-4">
                        {recentBroadcasts.map((log) => (
                            <div key={log.id} className="premium-card p-5 group hover:border-gray-200 transition-all">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-9 h-9 rounded-lg flex items-center justify-center border",
                                            log.type === 'Email' ? "bg-blue-50 border-blue-100 text-blue-600" :
                                                log.type === 'Push' ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                                                    "bg-purple-50 border-purple-100 text-purple-600"
                                        )}>
                                            {log.type === 'Email' ? <Mail size={16} /> : log.type === 'Push' ? <Bell size={16} /> : <MessageSquare size={16} />}
                                        </div>
                                        <div className="space-y-0.5">
                                            <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{log.title}</h4>
                                            <p className="text-[10px] text-gray-400 font-medium">{log.date}</p>
                                        </div>
                                    </div>
                                    <ArrowUpRight size={14} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <div className={cn(
                                            "w-1.5 h-1.5 rounded-full",
                                            log.status === 'Delivered' ? "bg-emerald-500" :
                                                log.status === 'Processing' ? "bg-blue-500 animate-pulse" : "bg-rose-500"
                                        )} />
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{log.status}</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-800">{log.reach} Reach</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunicationsCenter;
