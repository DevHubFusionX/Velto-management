import React from 'react';
import { cn } from '../../utils';

const RevenueBreakdown = ({ data, total }) => {
    return (
        <div className="premium-card p-8 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '100ms' }}>
            <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-8">Revenue Breakdown</h3>
            <div className="flex flex-col items-center">
                {/* CSS Circle Chart */}
                <div className="w-48 h-48 rounded-full border-[20px] border-gray-50 flex items-center justify-center relative group">
                    <div className="absolute inset-[-20px] rounded-full border-[20px] border-transparent border-t-yellow-400 border-r-blue-500 border-b-rose-400 rotate-45 transition-transform duration-1000 group-hover:rotate-[225deg]" />
                    <div className="text-center">
                        <p className="text-3xl font-black text-gray-900 tracking-tighter">${total || '84.2K'}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Total Yield</p>
                    </div>
                </div>
                <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-4 w-full">
                    {(data || [
                        { name: 'Stocks', value: 35, color: '#94a3b8' },
                        { name: 'Estate', value: 25, color: '#facc15' },
                        { name: 'Crypto', value: 20, color: '#60a5fa' },
                        { name: 'Bonds', value: 20, color: '#fb7185' },
                    ]).map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.name}</span>
                            </div>
                            <span className="text-[10px] font-bold text-gray-900">{item.value}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RevenueBreakdown;
