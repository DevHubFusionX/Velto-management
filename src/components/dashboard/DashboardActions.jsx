import React, { useState } from 'react';
import { PlusCircle, History, Snowflake, X, Target, Zap, Shield } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

const DashboardActions = () => {
    const { handleToggleSystemFreeze, handleCreateStrategy, refreshData } = usePlatform();
    const [showModal, setShowModal] = useState(false);
    const [newPlan, setNewPlan] = useState({
        name: '', minAmount: '', maxAmount: '', dailyPayout: '', durationDays: '',
        isPercentage: true, type: 'General Growth', color: '#3b82f6', description: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleCreateStrategy({
            ...newPlan,
            minAmount: Number(newPlan.minAmount),
            maxAmount: Number(newPlan.maxAmount),
            dailyPayout: Number(newPlan.dailyPayout),
            durationDays: Number(newPlan.durationDays)
        });
        setShowModal(false);
        setNewPlan({ name: '', minAmount: '', maxAmount: '', dailyPayout: '', durationDays: '', isPercentage: true, type: 'General Growth', color: '#3b82f6', description: '' });
    };

    return (
        <div className="flex flex-wrap items-center gap-4 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '400ms' }}>
            <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 hover:translate-y-[-2px] active:scale-95"
            >
                <PlusCircle size={18} />
                Add New Strategy
            </button>
            <button
                onClick={handleToggleSystemFreeze}
                className="px-6 py-3 bg-white border border-gray-200 text-gray-700 hover:text-rose-500 hover:border-rose-200 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center gap-2 hover:translate-y-[-2px] active:scale-95 group"
            >
                <Snowflake size={18} className="group-hover:rotate-12 transition-transform" />
                Freeze All Assets
            </button>
            <button
                onClick={refreshData}
                className="px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-sm shadow-xl transition-all flex items-center gap-2 hover:translate-y-[-2px] active:scale-95 group"
            >
                <History size={18} className="group-hover:rotate-[-45deg] transition-transform" />
                Neural Report
            </button>

            {/* Strategy Creation Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 tracking-tight">New Strategy Protocol</h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Configure asset deployment</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-rose-500 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Plan Identifier</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g., Quantum Alpha Fund"
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                    value={newPlan.name}
                                    onChange={e => setNewPlan({ ...newPlan, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Min Amount ($)</label>
                                    <input
                                        required
                                        type="number"
                                        placeholder="e.g., 500"
                                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                        value={newPlan.minAmount}
                                        onChange={e => setNewPlan({ ...newPlan, minAmount: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Max Amount ($)</label>
                                    <input
                                        required
                                        type="number"
                                        placeholder="e.g., 10000"
                                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                        value={newPlan.maxAmount}
                                        onChange={e => setNewPlan({ ...newPlan, maxAmount: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Daily Payout (%)</label>
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        placeholder="e.g., 2"
                                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                        value={newPlan.dailyPayout}
                                        onChange={e => setNewPlan({ ...newPlan, dailyPayout: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Duration (Days)</label>
                                    <input
                                        required
                                        type="number"
                                        placeholder="e.g., 30"
                                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                        value={newPlan.durationDays}
                                        onChange={e => setNewPlan({ ...newPlan, durationDays: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-3">
                                <Zap size={18} />
                                Initialize Protocol
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardActions;
