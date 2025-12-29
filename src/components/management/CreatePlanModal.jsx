import React, { useState, useEffect } from 'react';
import { X, Check, Loader2 } from 'lucide-react';

const CreatePlanModal = ({ onClose, onCreate, initialData = null }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        minAmount: initialData?.min || '',
        maxAmount: initialData?.max || '',
        isPercentage: initialData?.returns?.includes('%') ?? true,
        dailyPayout: initialData?.returns?.replace(/[^0-9.]/g, '') || '',
        durationDays: initialData?.duration?.replace(/[^0-9]/g, '') || '',
        type: initialData?.type || 'General Growth',
        risk: initialData?.risk || 'Medium',
        roiDescription: initialData?.roiDescription || ''
    });
    // If it's pure data from backend (not formatted for UI yet), handle that case too if needed, but for now assuming UI format or raw
    // Actually, getting raw data is better. Let's assume we might pass raw plan data or handle UI mapping.
    // Let's refine: The parent passes `plan` which format? 
    // In InvestmentManagement, we map it. So we should pass the original plan object if possible, or reverse map.
    // Easier: Pass the original plan object from InvestmentManagement if available. 
    // Let's adjust InvestmentManagement to store original plans or just pass what we have.
    // The current props are `plan` which is the UI mapped version.

    // Improving state initialization to be more robust
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                description: initialData.description || '',
                // Parse numbers from strings if necessary, or use raw if passed raw
                minAmount: initialData.minAmount || initialData.min || '',
                maxAmount: initialData.maxAmount || initialData.max || '',
                isPercentage: initialData.isPercentage ?? (initialData.returns?.includes('%')),
                dailyPayout: initialData.dailyPayout || initialData.returns?.replace(/[^0-9.]/g, '') || '',
                durationDays: initialData.durationDays || initialData.duration?.replace(/[^0-9]/g, '') || '',
                type: initialData.type || 'General Growth',
                risk: initialData.risk || 'Medium',
                roiDescription: initialData.roiDescription || ''
            });
        }
    }, [initialData]);

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onCreate({
                ...formData,
                minAmount: Number(formData.minAmount),
                maxAmount: Number(formData.maxAmount),
                dailyPayout: Number(formData.dailyPayout),
                durationDays: Number(formData.durationDays)
            });
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-xs sm:max-w-md lg:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
                    <h3 className="text-base sm:text-lg font-bold text-gray-800">Create Investment Plan</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
                    <div className="p-4 sm:p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Min Amount</label>
                                <input
                                    type="number"
                                    name="minAmount"
                                    required
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    value={formData.minAmount}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Max Amount</label>
                                <input
                                    type="number"
                                    name="maxAmount"
                                    required
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    value={formData.maxAmount}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Daily Payout</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="dailyPayout"
                                        required
                                        step="0.01"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        value={formData.dailyPayout}
                                        onChange={handleChange}
                                    />
                                    <span className="absolute right-4 top-2.5 text-gray-400 text-sm">{formData.isPercentage ? '%' : 'FIXED'}</span>
                                </div>
                            </div>
                            <div className="flex items-center pt-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isPercentage"
                                        checked={formData.isPercentage}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-600">Is Percentage?</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Days)</label>
                            <input
                                type="number"
                                name="durationDays"
                                required
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                value={formData.durationDays}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                name="description"
                                rows="3"
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                                value={formData.description}
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Type</label>
                                <input
                                    type="text"
                                    name="type"
                                    placeholder="e.g. Real Estate"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    value={formData.type}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Risk Profile</label>
                                <select
                                    name="risk"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                                    value={formData.risk}
                                    onChange={handleChange}
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ROI Display Text</label>
                            <input
                                type="text"
                                name="roiDescription"
                                placeholder="e.g. 12-15%"
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                value={formData.roiDescription}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="p-4 sm:p-6 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3 flex-shrink-0 bg-gray-50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full sm:w-auto px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl flex items-center justify-center gap-2 transition-colors"
                        >
                            {loading && <Loader2 size={16} className="animate-spin" />}
                            Create Plan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePlanModal;
