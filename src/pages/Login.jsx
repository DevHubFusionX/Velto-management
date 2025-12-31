import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2, ShieldCheck, Fingerprint, ArrowRight, ShieldAlert, Key, Cpu, Activity } from 'lucide-react';
import { authService } from '../services/auth.service';
import { toast } from 'sonner';

const Login = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email/Password, 2: 2FA
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        code: ''
    });
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleInitialLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authService.login(formData.email, formData.password);

            if (response.require2FA) {
                setUserId(response.userId);
                setStep(2);
                toast.info('Secondary authentication required');
                setLoading(false);
                return;
            }

            if (response.user.role !== 'admin' && response.user.role !== 'Superuser') {
                toast.error('Unauthorized access. Admin privileges required.');
                authService.logout();
                return;
            }

            toast.success('Access Granted. Welcome back, Administrator.');
            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
            toast.error(error.response?.data?.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const handle2FAVerify = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authService.verify2FALogin(userId, formData.code);
            toast.success('2FA Verified. Dashboard unlocked.');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid 2FA code');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Immersive Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10 pointer-events-none">
                    <div className="w-full h-full bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px]" />
                </div>
            </div>

            <div className="w-full max-w-lg relative z-10 animate-in fade-in zoom-in duration-500">
                {/* Brand HUD */}
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
                        <div className="relative w-24 h-24 bg-[#0f172a] border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden p-2">
                            <img src="/Velto-logo.svg" alt="Velto Logo" className="w-full h-full object-contain" />
                        </div>
                    </div>
                    <div className="mt-6 space-y-2">
                        <h1 className="text-4xl font-black text-white tracking-tight uppercase italic">
                            Velto <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">Investment</span>
                        </h1>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.4em]">Administrative Nexus Node</p>
                    </div>
                </div>

                {/* Login Terminal */}
                <div className="bg-[#0f172a]/80 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

                    {step === 1 ? (
                        <form onSubmit={handleInitialLogin} className="space-y-6 animate-in slide-in-from-left-4 duration-500">
                            <div className="space-y-2 text-center mb-4">
                                <h2 className="text-lg font-bold text-white flex items-center justify-center gap-2">
                                    <Fingerprint size={18} className="text-blue-400" />
                                    Identity Verification
                                </h2>
                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Enter authorized credentials to continue</p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2 group">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Access Email</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-600 group-focus-within:text-blue-500 transition-colors" />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            className="w-full bg-black/40 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-medium text-sm"
                                            placeholder="admin@security-genesis.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="space-y- group">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Security Key</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-600 group-focus-within:text-blue-500 transition-colors" />
                                        </div>
                                        <input
                                            type="password"
                                            name="password"
                                            required
                                            className="w-full bg-black/40 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-medium text-sm"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl shadow-lg shadow-blue-500/10 transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin h-5 w-5" />
                                        <span className="text-sm uppercase tracking-widest">Verifying...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-sm uppercase tracking-widest">Initialize Node Access</span>
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handle2FAVerify} className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                            <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl flex items-center gap-4 mb-2">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 shrink-0">
                                    <ShieldAlert size={28} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white uppercase tracking-tight">2FA Protocol Active</h3>
                                    <p className="text-[10px] text-gray-400 uppercase font-black">Multi-step verification required</p>
                                </div>
                            </div>

                            <div className="space-y-3 text-center">
                                <h2 className="text-lg font-bold text-white flex items-center justify-center gap-2">
                                    <Key size={18} className="text-emerald-400" />
                                    Enter Access Code
                                </h2>
                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-[0.2em]">Input the 6-digit code from your authenticator</p>
                            </div>

                            <div className="space-y-2 group">
                                <input
                                    type="text"
                                    name="code"
                                    required
                                    autoFocus
                                    className="w-full bg-black/40 border border-white/5 rounded-2xl py-6 text-center text-3xl font-black tracking-[0.5em] text-blue-400 placeholder-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                                    placeholder="000000"
                                    maxLength={6}
                                    value={formData.code}
                                    onChange={handleChange}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-xl shadow-lg shadow-emerald-500/10 transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin h-5 w-5" />
                                ) : (
                                    <span className="text-sm uppercase tracking-widest">Verify & Decrypt</span>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full text-[10px] text-gray-500 font-bold uppercase tracking-widest hover:text-white transition-colors"
                            >
                                ← Back to Identity Check
                            </button>
                        </form>
                    )}
                </div>

                {/* Secure Footer */}
                <div className="mt-10 flex flex-col items-center gap-4 opacity-50 hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase">
                            <Lock size={10} />
                            SSL Secured
                        </div>
                        <div className="w-1 h-1 bg-gray-700 rounded-full" />
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase">
                            <Cpu size={10} />
                            AES-256 Bit
                        </div>
                        <div className="w-1 h-1 bg-gray-700 rounded-full" />
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase">
                            <Activity size={10} />
                            Active Monitoring
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>
        </div>
    );
};

export default Login;

