import React from 'react';
import { TrendingUp, Info, Edit3, Pause, Play, Trash2, Zap, ArrowUpRight } from 'lucide-react';
import { cn, formatCurrency } from '../../utils';

const InvestmentCard = ({ plan, onStatusToggle, onEdit, onDelete }) => (
    <div className="premium-card group hover:translate-y-[-4px] transition-all duration-300">
        <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border border-gray-100" style={{ backgroundColor: `${plan.color}10`, color: plan.color }}>
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 leading-tight group-hover:text-blue-600 transition-colors">
                            {plan.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{plan.type}</span>
                        </div>
                    </div>
                </div>

                <div className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                    plan.status === 'Active'
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : "bg-amber-50 text-amber-600 border-amber-100"
                )}>
                    {plan.status}
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-2xl mb-6">
                <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Expected ROI</span>
                    <div className="text-xl font-bold text-gray-800">{plan.roiDescription || plan.returns}</div>
                </div>
                <div className="space-y-1 pl-4 border-l border-gray-200">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Duration</span>
                    <div className="text-xl font-bold text-gray-800">{plan.duration}</div>
                </div>
                <div className="space-y-1 pt-2 border-t border-gray-200 col-span-2 flex justify-between">
                    <div className='flex flex-col'>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Minimal Entry</span>
                        <div className="text-sm font-bold text-gray-800">{formatCurrency(plan.min)}</div>
                    </div>
                    <div className='flex flex-col items-end'>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Risk Profile</span>
                        <div className={cn("text-sm font-bold",
                            plan.risk === 'High' ? 'text-rose-500' :
                                plan.risk === 'Medium' ? 'text-amber-500' : 'text-emerald-500'
                        )}>{plan.risk || 'Medium'}</div>
                    </div>
                </div>
            </div>

            {/* Investors */}
            <div className="flex items-center justify-between mb-8 px-1">
                <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200" />
                        ))}
                    </div>
                    <span className="text-xs font-medium text-gray-500">
                        <span className="font-bold text-gray-700">{plan.investors}</span> Investors
                    </span>
                </div>
                <ArrowUpRight size={16} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
            </div>

            {/* Actions */}
            <div className="grid grid-cols-4 gap-2">
                <button
                    onClick={() => onEdit(plan)}
                    className="col-span-2 py-3 bg-gray-900 text-white rounded-xl text-xs font-bold transition-all hover:opacity-90 active:scale-95"
                >
                    Configure
                </button>
                <button
                    onClick={() => onStatusToggle(plan.id, plan.status === 'Active' ? 'Paused' : 'Active')}
                    className="py-3 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-bold transition-all hover:bg-gray-50 active:scale-95 flex items-center justify-center"
                >
                    {plan.status === 'Active' ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <button
                    onClick={() => onDelete(plan.id)}
                    className="py-3 bg-rose-50 border border-rose-100 text-rose-500 rounded-xl text-xs font-bold transition-all hover:bg-rose-100 active:scale-95 flex items-center justify-center"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    </div>
);


export default InvestmentCard;
