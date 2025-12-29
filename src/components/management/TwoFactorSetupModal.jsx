import React, { useState, useEffect } from 'react';
import { X, Smartphone, CheckCircle, ShieldAlert, Loader2, ArrowRight } from 'lucide-react';
import { authService } from '../../services/auth.service';
import { useToast } from '../../context/ToastContext';

const TwoFactorSetupModal = ({ onClose, onComplete }) => {
    const [step, setStep] = useState(1); // 1: Scan, 2: Verify, 3: Success
    const [qrData, setQrData] = useState(null);
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);
    const toast = useToast();

    useEffect(() => {
        const initSetup = async () => {
            try {
                const data = await authService.setup2FA();
                setQrData(data);
            } catch (err) {
                toast.error('Failed to initialize 2FA setup');
                onClose();
            } finally {
                setLoading(false);
            }
        };
        initSetup();
    }, []);

    const handleVerify = async (e) => {
        e.preventDefault();
        setVerifying(true);
        try {
            await authService.verify2FASetup(code);
            setStep(3);
            if (onComplete) onComplete();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid verification code');
        } finally {
            setVerifying(false);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#020617]/80 backdrop-blur-sm p-4">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Generating Secure Secret...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#020617]/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-[#0f172a] border border-white/5 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative">
                {/* Header HUD */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <Smartphone size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-white uppercase tracking-wider">2FA Configuration</h3>
                            <p className="text-[10px] text-gray-500 mt-0.5">Google Authenticator Provisioning</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-8">
                    {step === 1 && (
                        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                            <div className="flex flex-col items-center gap-6">
                                <div className="p-4 bg-white rounded-2xl shadow-[0_0_40px_-10px_rgba(255,255,255,0.2)]">
                                    <img src={qrData?.qrCode} alt="2FA QR Code" className="w-48 h-48" />
                                </div>
                                <div className="space-y-3 text-center">
                                    <p className="text-xs text-gray-300 leading-relaxed max-w-[280px]">
                                        Scan this QR code using your <span className="text-blue-400 font-bold">Google Authenticator</span> or compatible TOTP application.
                                    </p>
                                    <div className="flex items-center justify-center gap-2 py-1.5 px-3 bg-white/5 rounded-lg border border-white/5">
                                        <ShieldAlert size={12} className="text-blue-500" />
                                        <code className="text-[10px] font-mono font-bold text-blue-300">
                                            {qrData?.secret.replace(/(.{4})/g, '$1 ')}
                                        </code>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setStep(2)}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl shadow-lg shadow-blue-500/10 transition-all flex items-center justify-center gap-2 group"
                            >
                                <span className="text-xs uppercase tracking-widest">Secret Scanned</span>
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleVerify} className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                            <div className="space-y-6">
                                <div className="text-center space-y-2">
                                    <h4 className="text-lg font-bold text-white uppercase tracking-tight">Enter Verification Code</h4>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Verify setup by syncing your first token</p>
                                </div>
                                <input
                                    type="text"
                                    placeholder="000000"
                                    maxLength={6}
                                    required
                                    autoFocus
                                    className="w-full bg-black/40 border border-white/5 rounded-2xl py-6 text-center text-4xl font-black tracking-[0.6em] text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                />
                                <div className="flex items-start gap-3 p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                                    <ShieldAlert size={16} className="text-amber-500 shrink-0 mt-0.5" />
                                    <p className="text-[10px] text-amber-200/60 leading-normal">
                                        Once verified, this account will require a dynamic token for all future administrative access attempts.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex-1 bg-white/5 hover:bg-white/10 text-gray-400 font-bold py-4 rounded-xl text-xs uppercase tracking-widest transition-all"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={verifying || code.length !== 6}
                                    className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl shadow-lg shadow-blue-500/10 transition-all flex items-center justify-center"
                                >
                                    {verifying ? <Loader2 size={18} className="animate-spin" /> : <span className="text-xs uppercase tracking-widest">Authorize 2FA</span>}
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 3 && (
                        <div className="flex flex-col items-center gap-8 py-4 animate-in zoom-in duration-500">
                            <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center relative">
                                <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
                                <CheckCircle size={48} className="text-emerald-500 relative z-10" />
                            </div>
                            <div className="text-center space-y-2">
                                <h4 className="text-2xl font-black text-white uppercase italic tracking-tight">Security Hardened</h4>
                                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">2FA Protocol successfully provisioned</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-xl transition-all uppercase text-xs tracking-widest"
                            >
                                Return to Genesis
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TwoFactorSetupModal;
