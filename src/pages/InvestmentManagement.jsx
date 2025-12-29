import React, { useState, useEffect } from 'react';
import {
    Plus,
    TrendingUp,
    Zap,
    ShieldAlert,
    BarChart3,
    Layers,
    Sparkles,
    Loader2
} from 'lucide-react';
import { cn, formatCurrency } from '../utils';
import InvestmentCard from '../components/management/InvestmentCard';
import CreatePlanModal from '../components/management/CreatePlanModal';
import ActiveInvestmentsList from '../components/management/ActiveInvestmentsList';
import { adminService } from '../services/admin.service';
import { toast } from 'sonner';

const InvestmentManagement = () => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPlans = async () => {
        try {
            const response = await adminService.getInvestmentPlans();
            const plansArray = response.data || response;

            if (!Array.isArray(plansArray)) {
                console.warn('Investment plans data is not an array:', response);
                setPlans([]);
                return;
            }
            const formattedPlans = plansArray.map(p => ({
                // Store raw objects? Or formatted? 
                // Better to format for UI but keep necessary raw IDs/values for editing.
                id: p._id,
                _id: p._id, // Keep original ID accessible
                name: p.name,
                type: p.type || 'General',
                status: (p.status === 'active') ? 'Active' : 'Paused',
                duration: p.durationDays % 30 === 0 ? `${p.durationDays / 30} Months` : `${p.durationDays} Days`,
                durationDays: p.durationDays,
                risk: p.risk || 'Medium',
                color: p.color || '#3b82f6',
                description: p.description,
                min: p.minAmount,
                max: p.maxAmount,
                dailyPayout: p.dailyPayout,
                isPercentage: p.isPercentage,
                // Map to 'returns' for card display compatibility if roiDescription is missing
                returns: p.roiDescription || `${p.dailyPayout}${p.isPercentage ? '%' : ''} Daily`,
                roiDescription: p.roiDescription,
                investors: p.investorsCount || 0
            }));
            setPlans(formattedPlans);
        } catch (error) {
            console.error('Failed to fetch plans', error);
            if (error.response?.status !== 401 && error.response?.status !== 403) {
                toast.error('Failed to load investment plans');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleCreateOrUpdatePlan = async (planData) => {
        try {
            if (editingPlan) {
                await adminService.updateInvestmentPlan(editingPlan.id, planData);
                toast.success('Investment Plan Updated Successfully');
            } else {
                await adminService.createInvestmentPlan(planData);
                toast.success('Investment Plan Created Successfully');
            }
            setShowCreateModal(false);
            setEditingPlan(null);
            fetchPlans();
        } catch (error) {
            console.error('Save plan error', error);
            toast.error(editingPlan ? 'Failed to update plan' : 'Failed to create plan');
        }
    };

    const handleStatusToggle = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'active' ? 'inactive' : 'active'; // Logic handled in backend too but good for optimism or check
            // Send exact status if needed, or let toggle handle it. Backend toggle is smart.
            // Let's us explicit status to be safe if UI state desyncs slightly.
            // Actually our backend toggle can take a status too.
            // Let's pass undefined to just toggle, or pass the target.
            // Based on InvestmentCard, it passes 'active' or 'paused' (which matches 'inactive' usually). 
            // My backend used 'active'/'inactive'.
            // InvestmentCard usually displays 'Active' or 'Paused'.
            // Let's standardize: UI 'Active' -> Backend 'active', UI 'Paused' -> Backend 'inactive'.

            await adminService.toggleInvestmentPlanStatus(id);
            toast.success('Plan Status Updated');
            fetchPlans();
        } catch (error) {
            console.error('Toggle status error', error);
            toast.error('Failed to update status');
        }
    };

    const handleEdit = (plan) => {
        setEditingPlan(plan);
        setShowCreateModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this plan? This action cannot be undone.')) return;

        try {
            await adminService.deleteInvestmentPlan(id);
            toast.success('Plan Deleted Successfully');
            fetchPlans();
        } catch (error) {
            console.error('Delete plan error', error);
            toast.error('Failed to delete plan');
        }
    };

    const handleCloseModal = () => {
        setShowCreateModal(false);
        setEditingPlan(null);
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header HUD */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-2">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                        <Layers size={32} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 tracking-tight leading-none">Investment Plans</h2>
                        <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Management Center</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-gray-300" />
                            <span className="text-xs font-medium text-blue-600 flex items-center gap-1.5">
                                <Sparkles size={12} />
                                {plans.length} Plans Active
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-bold text-gray-600 transition-all hover:bg-gray-50">
                        <BarChart3 size={16} />
                        Performance
                    </button>
                    <button
                        onClick={() => { setEditingPlan(null); setShowCreateModal(true); }}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-gray-900 hover:opacity-90 text-white rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95"
                    >
                        <Plus size={18} />
                        New Plan
                    </button>
                </div>
            </div>

            {/* Strategy Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-24 gap-4">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Plans...</p>
                    </div>
                ) : (
                    plans.map((plan, index) => (
                        <div key={plan.id} className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${index * 100}ms` }}>
                            <InvestmentCard
                                plan={plan}
                                onStatusToggle={() => handleStatusToggle(plan.id, plan.status)}
                                onEdit={() => handleEdit(plan)}
                                onDelete={() => handleDelete(plan.id)}
                            />
                        </div>
                    ))
                )}

                <button
                    onClick={() => { setEditingPlan(null); setShowCreateModal(true); }}
                    className="group relative min-h-[300px] bg-white/50 border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center gap-6 hover:border-blue-400/50 hover:bg-blue-50/30 transition-all duration-500 overflow-hidden"
                >
                    <div className="w-20 h-20 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-blue-500 group-hover:scale-110 group-hover:rotate-90 transition-all duration-500 shadow-sm">
                        <Plus size={40} strokeWidth={1.5} />
                    </div>

                    <div className="text-center">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Available Slot</p>
                        <p className="text-sm font-bold text-gray-600 mt-2">Create New Plan</p>
                    </div>
                </button>
            </div>

            {/* Active Investments Section */}
            <div className="pt-8">
                <ActiveInvestmentsList />
            </div>

            {/* Security Notice */}
            <div className="premium-card p-8 bg-amber-50 border-amber-200/50 flex flex-col md:flex-row items-center gap-8 mt-10">
                <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                    <ShieldAlert size={32} />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h4 className="text-sm font-bold text-amber-900 uppercase tracking-wider mb-2">Security Protocol</h4>
                    <p className="text-xs text-amber-800 font-medium leading-relaxed max-w-3xl">Note: All portfolio modifications are logged in the secure audit trail. High-volume changes may require multi-signature authorization before execution.</p>
                </div>
            </div>

            {showCreateModal && (
                <CreatePlanModal
                    onClose={handleCloseModal}
                    onCreate={handleCreateOrUpdatePlan}
                    initialData={editingPlan}
                />
            )}
        </div>
    );
};

export default InvestmentManagement;
