
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Phone, User, Check, Loader2, MapPin, Sparkles, Building2, Home, AlertCircle, ChevronDown, ChevronUp, RefreshCw, Copy, ExternalLink, Terminal } from 'lucide-react';
import { supabase } from '../services/supabase';

interface OnboardingProps {
  onComplete: () => void;
  role?: 'buyer' | 'seller';
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, role = 'seller' }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ 
    name: '', 
    phone: '', 
    address: '',
    pincode: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [rawError, setRawError] = useState<any>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [copied, setCopied] = useState(false);

  const steps = [
    { 
      id: 'name', 
      title: 'Operational Name', 
      desc: 'Identify your business or professional persona.',
      icon: Building2,
      field: 'name',
      placeholder: 'Full Name / Company',
      stepLabel: 'User Details 1/3'
    },
    { 
      id: 'phone', 
      title: 'Communication Link', 
      desc: 'A secure channel for logistics verification.',
      icon: Phone,
      field: 'phone',
      placeholder: '+1 (555) 000-0000',
      stepLabel: 'User Details 1/3'
    },
    { 
      id: 'address', 
      title: 'Facility Address', 
      desc: 'Your physical operational base for material exchange.',
      icon: Home,
      field: 'address',
      placeholder: 'Street, Building, Suite',
      stepLabel: 'User Details 1/3'
    },
    { 
      id: 'pincode', 
      title: 'Regional Sector', 
      desc: 'Your Pincode for optimized routing.',
      icon: MapPin,
      field: 'pincode',
      placeholder: 'Pincode / ZIP',
      stepLabel: 'User Details 1/3'
    },
    { 
      id: 'success', 
      title: 'Authorization Verified', 
      desc: 'Your terminal is now live and synchronized.',
      icon: Sparkles,
      field: null,
      stepLabel: 'Welcome 3/3'
    }
  ];

  const fixSql = `-- Run this in Supabase SQL Editor:
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can select own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(fixSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNext = async () => {
    setErrorMsg(null);
    setRawError(null);

    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setIsLoading(true);
      try {
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        
        if (authError) throw authError;
        if (!session?.user) throw new Error("Terminal session expired. Please refresh.");

        const user = session.user;

        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            name: (data.name || 'Partner').trim(),
            phone: (data.phone || '').trim(),
            address: (data.address || '').trim(),
            pincode: (data.pincode || '').trim(),
            role: role || 'seller',
            updated_at: new Date().toISOString()
          }, { 
            onConflict: 'id'
          });

        if (upsertError) throw upsertError;
        
        onComplete();
      } catch (err: any) {
        console.error('Onboarding sync failed:', err);
        setRawError(err);
        
        let displayMessage = 'Synchronization failed.';
        if (err.message) {
          displayMessage = err.message;
          if (err.details) displayMessage += ` | ${err.details}`;
        } else if (typeof err === 'string') {
          displayMessage = err;
        }

        if (err.code === '42501') {
          setErrorMsg(`ACCESS DENIED (RLS): Your Supabase 'profiles' table needs policies for SELECT, INSERT, and UPDATE for your own ID.`);
        } else if (err.code === '23505') {
          setErrorMsg(`CONFLICT: Unique constraint violation on profile ID.`);
        } else {
          setErrorMsg(displayMessage);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const current = steps[step];

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone p-6">
      <div className="max-w-md w-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="glass p-10 md:p-14 rounded-[3.5rem] text-center shadow-2xl border border-white/50 relative"
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-emerald-950 text-white px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl whitespace-nowrap">
              {current.stepLabel}
            </div>

            <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-500 mx-auto mb-10 shadow-inner border border-emerald-100/50">
              <current.icon size={32} />
            </div>

            <h2 className="text-2xl font-display mb-4 text-emerald-950 tracking-tight">
              {step === steps.length - 1 ? `Welcome, ${data.name || 'Partner'}` : current.title}
            </h2>
            <p className="text-slate-400 text-sm mb-8 font-medium leading-relaxed">{current.desc}</p>

            {errorMsg && (
              <div className="mb-8 p-5 bg-rose-50 border border-rose-100 rounded-[2rem] text-rose-600 text-[10px] text-left font-bold uppercase tracking-wider leading-relaxed shadow-sm">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle size={16} className="flex-shrink-0 text-rose-500" />
                  <span className="break-words leading-normal">{errorMsg}</span>
                </div>
                
                {rawError?.code === '42501' && (
                  <div className="mb-4 space-y-3 bg-white/50 p-4 rounded-2xl border border-rose-200">
                    <p className="text-[9px] text-rose-800 font-black flex items-center gap-2">
                      <Terminal size={12} /> ACTION REQUIRED: DATABASE PERMISSIONS
                    </p>
                    <p className="text-[8px] text-slate-500 normal-case leading-relaxed">
                      To fix this, go to your <strong>Supabase SQL Editor</strong> and run the following command to allow user-level profile updates:
                    </p>
                    <div className="relative group">
                      <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl text-[7px] font-mono overflow-x-auto whitespace-pre select-all">
                        {fixSql}
                      </pre>
                      <button 
                        onClick={handleCopySql}
                        className="absolute top-2 right-2 p-1.5 bg-white/10 hover:bg-white/20 rounded-md transition-colors"
                      >
                        {copied ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 border-t border-rose-100 pt-3">
                  <button 
                    onClick={() => setShowDebug(!showDebug)}
                    className="flex items-center gap-1 text-[8px] text-rose-400 hover:text-rose-600 transition-colors"
                  >
                    {showDebug ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                    {showDebug ? 'Hide Logs' : 'View Protocol Logs'}
                  </button>
                  <button 
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-1 text-[8px] text-emerald-600 hover:text-emerald-700 transition-colors ml-auto"
                  >
                    <RefreshCw size={10} /> Restart Session
                  </button>
                </div>
                
                {showDebug && (
                  <pre className="mt-3 p-3 bg-rose-100/40 rounded-xl text-[8px] overflow-auto max-h-40 text-rose-800 lowercase font-mono border border-rose-200/50">
                    {typeof rawError === 'object' ? JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2) : String(rawError)}
                  </pre>
                )}
              </div>
            )}

            {current.field ? (
              <div className="space-y-10">
                <input 
                  autoFocus
                  type="text"
                  placeholder={current.placeholder}
                  className="w-full bg-slate-50/50 border-b-2 border-slate-100 py-4 focus:outline-none focus:border-emerald-500 text-center text-xl transition-all placeholder:text-slate-200 font-medium rounded-t-2xl"
                  value={(data as any)[current.field]}
                  onChange={(e) => setData({ ...data, [current.field]: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                />
                <button 
                  onClick={handleNext}
                  className="w-full bg-emerald-600 text-white rounded-full py-5 text-[10px] font-bold uppercase tracking-[0.3em] shadow-xl shadow-emerald-500/20 flex justify-center items-center gap-2 transition-all hover:bg-emerald-700 active:scale-95"
                >
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                 <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100">
                   <p className="text-emerald-800 text-xs font-bold leading-relaxed">
                     Your circular profile is verified as a <span className="uppercase text-emerald-600">{role}</span>. <br/>
                     Let's begin optimizing your supply chain.
                   </p>
                 </div>
                 <button 
                  onClick={handleNext}
                  disabled={isLoading}
                  className="w-full bg-emerald-950 text-white rounded-full py-6 text-[10px] font-bold uppercase tracking-[0.4em] flex justify-center items-center gap-2 shadow-2xl shadow-black/20 transition-all hover:bg-black active:scale-[0.97] disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Initialize Terminal"}
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
