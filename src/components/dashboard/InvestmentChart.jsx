import React, { useState } from 'react';
import { cn } from '../../utils';
import { usePlatform } from '../../context/PlatformContext';
import { TrendingUp, Calendar, ArrowUpRight, Loader2 } from 'lucide-react';

const InvestmentChart = ({ data }) => {
    const { refreshData } = usePlatform();
    const [activeRange, setActiveRange] = useState('ALL');
    const [chartLoading, setChartLoading] = useState(false);

    // Fallback or specific data handling
    const chartData = (data && data.length > 0) ? data : [
        { date: 'Jan', balance: 3000 }, { date: 'Feb', balance: 4500 }, { date: 'Mar', balance: 3500 },
        { date: 'Apr', balance: 6000 }, { date: 'May', balance: 5000 }, { date: 'Jun', balance: 7500 },
        { date: 'Jul', balance: 6500 }, { date: 'Aug', balance: 9000 }, { date: 'Sep', balance: 8500 }
    ];

    const handleRangeChange = async (range) => {
        setActiveRange(range);
        setChartLoading(true);
        await refreshData(range);
        setChartLoading(false);
    };

    const maxValue = Math.max(...chartData.map(d => d.balance || 0), 100);
    const padding = 40;
    const width = 1000;
    const height = 300;
    const usableWidth = width - (padding * 2);
    const usableHeight = height - (padding * 2);

    const points = chartData.map((d, i) => ({
        x: padding + (i * (usableWidth / (chartData.length - 1 || 1))),
        y: height - padding - (((d.balance || 0) / maxValue) * usableHeight),
        value: d.balance || 0,
        label: d.date
    }));

    // Generate SVG path for line (simple polyline for now, can be improved to bezier)
    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

    return (
        <div className="lg:col-span-2 premium-card p-6 relative overflow-hidden group">
            {/* Background Decorative Gradient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] -mr-32 -mt-32 rounded-full" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="p-1.5 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
                            <TrendingUp size={14} className="text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 tracking-tight">Investments Overview</h3>
                    </div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Real-time portfolio scaling
                    </p>
                </div>

                <div className="flex items-center p-1 bg-gray-50/80 backdrop-blur-sm border border-gray-100 rounded-xl">
                    {['1W', '1M', '1Y', 'ALL'].map((t) => (
                        <button
                            key={t}
                            onClick={() => handleRangeChange(t)}
                            disabled={chartLoading}
                            className={cn(
                                "px-4 py-1.5 rounded-lg text-[10px] font-black transition-all duration-300",
                                activeRange === t
                                    ? "bg-white text-blue-600 shadow-sm border border-gray-100"
                                    : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative h-[300px] w-full mt-4 group/chart-container">
                {chartLoading && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-[2px] transition-all duration-300">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                )}

                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full h-full overflow-visible drop-shadow-[0_10px_20px_rgba(37,99,235,0.1)]"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.01" />
                        </linearGradient>
                        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#2563eb" />
                        </linearGradient>
                    </defs>

                    {/* Grid Lines */}
                    {[0, 1, 2, 3, 4].map((i) => {
                        const y = padding + (i * (usableHeight / 4));
                        return (
                            <line
                                key={i}
                                x1={padding}
                                y1={y}
                                x2={width - padding}
                                y2={y}
                                stroke="#f1f5f9"
                                strokeWidth="1"
                                strokeDasharray="4 4"
                            />
                        );
                    })}

                    {/* Area path */}
                    <path
                        d={areaPath}
                        fill="url(#areaGradient)"
                        className="transition-all duration-700"
                    />

                    {/* Line path */}
                    <path
                        d={linePath}
                        fill="none"
                        stroke="url(#lineGradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-all duration-700"
                    />

                    {/* Interactive Points */}
                    {points.map((p, i) => (
                        <g key={i} className="group/point">
                            {/* Hover focus line */}
                            <line
                                x1={p.x}
                                y1={padding}
                                x2={p.x}
                                y2={height - padding}
                                stroke="#3b82f6"
                                strokeWidth="1.5"
                                className="opacity-0 group-hover/point:opacity-20 transition-opacity pointer-events-none"
                                strokeDasharray="4 4"
                            />

                            {/* Data point circle */}
                            <circle
                                cx={p.x}
                                cy={p.y}
                                r="4"
                                fill="#2563eb"
                                stroke="white"
                                strokeWidth="2.5"
                                className="transition-all duration-300 shadow-xl group-hover/point:r-6 cursor-pointer"
                            />

                            {/* Label */}
                            <text
                                x={p.x}
                                y={height - 10}
                                textAnchor="middle"
                                className="text-[10px] fill-gray-400 font-bold uppercase tracking-tighter"
                            >
                                {p.label.split('-').pop()}
                            </text>

                            {/* Tooltip (SVG based to avoid z-index issues) */}
                            <g className="opacity-0 group-hover/point:opacity-100 transition-opacity pointer-events-none">
                                <rect
                                    x={p.x - 50}
                                    y={p.y - 45}
                                    width="100"
                                    height="35"
                                    rx="6"
                                    fill="white"
                                    className="filter drop-shadow-md border border-gray-100"
                                />
                                <text
                                    x={p.x}
                                    y={p.y - 23}
                                    textAnchor="middle"
                                    className="text-[11px] font-black fill-gray-900"
                                >
                                    ${p.value.toLocaleString()}
                                </text>
                            </g>
                        </g>
                    ))}
                </svg>
            </div>

            {/* Summary Footer Widget */}
            <div className="mt-6 flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="user" />
                            </div>
                        ))}
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold shadow-sm">
                            +12
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Active Investors</p>
                        <p className="text-xs font-black text-gray-900">Trending Velocity Increased</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
                    <ArrowUpRight size={14} />
                    <span className="text-[10px] font-black">+24.8%</span>
                </div>
            </div>
        </div>
    );
};

export default InvestmentChart;
