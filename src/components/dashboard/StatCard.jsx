import React from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Users, FileCheck, Activity, Banknote } from 'lucide-react';
import { cn } from '../../utils';

const iconMap = {
    'Total Users': Users,
    'Pending KYC': FileCheck,
    'Active Investments': TrendingUp,
    'Clearance Queue': Banknote
};

const colorMap = {
    'Total Users': {
        gradient: 'from-blue-500 via-blue-400 to-cyan-400',
        glowColor: 'rgba(59, 130, 246, 0.15)',
        iconColor: 'text-blue-600',
        accentColor: 'bg-blue-500'
    },
    'Pending KYC': {
        gradient: 'from-amber-500 via-orange-400 to-yellow-400',
        glowColor: 'rgba(245, 158, 11, 0.15)',
        iconColor: 'text-amber-600',
        accentColor: 'bg-amber-500'
    },
    'Active Investments': {
        gradient: 'from-emerald-500 via-green-400 to-teal-400',
        glowColor: 'rgba(16, 185, 129, 0.15)',
        iconColor: 'text-emerald-600',
        accentColor: 'bg-emerald-500'
    },
    'Clearance Queue': {
        gradient: 'from-violet-500 via-purple-400 to-fuchsia-400',
        glowColor: 'rgba(139, 92, 246, 0.15)',
        iconColor: 'text-violet-600',
        accentColor: 'bg-violet-500'
    }
};

const FloatingDots = () => (
    <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-2 right-4 w-1 h-1 rounded-full bg-current animate-pulse" />
        <div className="absolute top-8 right-8 w-1.5 h-1.5 rounded-full bg-current animate-pulse delay-150" style={{ animationDelay: '150ms' }} />
        <div className="absolute bottom-6 right-6 w-1 h-1 rounded-full bg-current animate-pulse delay-300" style={{ animationDelay: '300ms' }} />
    </div>
);

const StatCard = ({ title, value, change, trend }) => {
    const colors = colorMap[title] || colorMap['Total Users'];
    const Icon = iconMap[title] || Activity;

    return (
        <div className="group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-500 overflow-hidden">
            {/* Animated gradient background */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                    background: `radial-gradient(circle at 100% 0%, ${colors.glowColor}, transparent 70%)`
                }}
            />

            {/* Floating decorative dots */}
            <div className={colors.iconColor}>
                <FloatingDots />
            </div>

            <div className="p-4 relative">
                {/* Icon and badge row */}
                <div className="flex items-center justify-between mb-3">
                    <div className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6",
                        "bg-gradient-to-br shadow-sm",
                        colors.gradient
                    )}>
                        <Icon className="w-4 h-4 text-white" strokeWidth={2.5} />
                    </div>

                    {change && (
                        <div className={cn(
                            "flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider",
                            trend === 'up'
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-rose-50 text-rose-600"
                        )}>
                            {trend === 'up' ? <ArrowUpRight size={10} strokeWidth={3} /> : <ArrowDownRight size={10} strokeWidth={3} />}
                            {change}
                        </div>
                    )}
                </div>

                {/* Value */}
                <div className="space-y-0.5 mb-3">
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-none">
                        {value}
                    </h3>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        {title}
                    </p>
                </div>

                {/* Progress bar indicator */}
                <div className="relative h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={cn(
                            "absolute inset-y-0 left-0 rounded-full transition-all duration-1000 group-hover:w-full",
                            colors.accentColor
                        )}
                        style={{ width: trend === 'up' ? '75%' : '45%' }}
                    />
                </div>
            </div>

            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>

            {/* Corner accent */}
            <div className={cn(
                "absolute top-0 right-0 w-16 h-16 rounded-bl-full opacity-0 group-hover:opacity-10 transition-opacity duration-500",
                colors.accentColor
            )} />
        </div>
    );
};

export default StatCard;
