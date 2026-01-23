
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Phone, Check, Loader2, MapPin, Sparkles, Building2, Home, AlertCircle, Globe, Briefcase } from 'lucide-react';
import { supabase } from '../services/supabase';

interface OnboardingProps {
  onComplete: () => void;
  role?: 'buyer' | 'seller';
}

const COUNTRIES = [
  { name: 'India', code: '+91', phoneLen: 10, pinLen: 6 },
  { name: 'USA', code: '+1', phoneLen: 10, pinLen: 5 },
  { name: 'UK', code: '+44', phoneLen: 10, pinLen: 7 },
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, role = 'seller' }) => {
  const [step, setStep] = useState(0);
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [data, setData] = useState({ 
    name: '', 
    phone: '', 
    address: '',
    pincode: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const steps = [
    { id: 'name', title: 'What is your Business called?', desc: 'Your registered or trading name.', icon: Briefcase },
    { id: 'phone', title: 'Your Phone Number', desc: 'Best contact for order updates.', icon: Phone },
    { id: 'address', title: 'Warehouse Address', desc: 'Where is your material stored?', icon: Home },
    { id: 'pincode', title: 'Regional Pin Code', desc: 'To find nearby trading partners.', icon: MapPin },
    { id: 'final', title: 'Verify Details', desc: 'One last look at your business profile.', icon: Sparkles }
  ];

  const validateCurrentStep = () => {
    setErrorMsg(null);
    if (step === 0) {
      if (!data.name.trim()) return "Business name is required.";
      if (data.name.length < 2) return "Please enter a valid name.";
    }
    if (step === 1) {
      const cleanPhone = data.phone.replace(/\D/g, '');
      if (cleanPhone.length !== country.phoneLen) {
        return `Phone must be ${country.phoneLen} digits.`;
      }
    }
    if (step === 2) {
      if (!data.address.trim()) return "Address is required.";
      if (data.address.length < 5) return "Please provide a more complete address.";
    }
    if (step === 3) {
      const cleanPin = data.pincode.replace(/\D/g, '');
      if (cleanPin.length !== country.pinLen) {
        return `Code must be ${country.pinLen} digits.`;
      }
    }
    return null;
  };

  const handleNext = async () => {
    const err = validateCurrentStep();
    if (err) {
      setErrorMsg(err);
      return;
    }

    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) throw new Error("Session expired.");

        const { error } = await supabase.from('profiles').upsert({
          id: session.user.id,
          name: data.name.trim(),
          phone: `${country.code}${data.phone.replace(/\D/g, '')}`,
          address: data.address.trim(),
          pincode: data.pincode.replace(/\D/g, ''),
          country: country.name,
          role: role,
          wallet_balance: 0,
          updated_at: new Date().toISOString()
        });

        if (error) throw error;
        onComplete();
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to save profile.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const current = steps[step];

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-950 p-6 selection:bg-emerald-500 overflow-hidden relative">
      {/* Background patterns same as Login */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&q=80')] opacity-10 grayscale scale-110 pointer-events-none" />

      <div className="max-w-xl w-full relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.98, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 1.02, x: -20 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="glass-dark p-12 md:p-16 rounded-[4rem] text-center shadow-[0_40px_120px_rgba(0,0,0,0.6)] relative border border-white/5"
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-10 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.4em] shadow-xl">
              Registration: {step + 1} of {steps.length}
            </div>

            <motion.div 
              layout
              className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center text-emerald-400 mx-auto mb-10 shadow-inner border border-white/10"
            >
              <current.icon size={40} />
            </motion.div>

            <h2 className="text-4xl font-display mb-4 text-white tracking-tight font-black leading-tight">{current.title}</h2>
            <p className="text-emerald-500/50 text-sm mb-12 font-black uppercase tracking-[0.2em]">{current.desc}</p>

            <div className="space-y-10">
              {step === 0 && (
                <input 
                  autoFocus
                  placeholder="EX: GREEN CYCLE LTD"
                  className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-8 text-center text-xl font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-white placeholder:text-slate-800 shadow-inner"
                  value={data.name}
                  onChange={(e) => setData({...data, name: e.target.value})}
                  onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                />
              )}

              {step === 1 && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <select 
                      className="bg-white/5 border border-white/10 text-white rounded-2xl px-6 py-6 text-xs font-black outline-none shadow-inner"
                      onChange={(e) => {
                        const next = COUNTRIES.find(c => c.name === e.target.value) || COUNTRIES[0];
                        setCountry(next);
                        setData({...data, phone: '', pincode: ''});
                      }}
                      value={country.name}
                    >
                      {COUNTRIES.map(c => <option key={c.name} value={c.name} className="bg-emerald-950">{c.code} {c.name}</option>)}
                    </select>
                    <input 
                      autoFocus
                      type="tel"
                      placeholder="CONTACT NUMBER"
                      className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 text-xl font-bold tracking-[0.2em] outline-none focus:ring-4 focus:ring-emerald-500/10 text-white placeholder:text-slate-800 shadow-inner"
                      value={data.phone}
                      maxLength={country.phoneLen}
                      onChange={(e) => setData({...data, phone: e.target.value.replace(/\D/g, '')})}
                      onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                    />
                  </div>
                  <p className="text-[10px] text-emerald-500/40 font-black uppercase tracking-widest">Expected: {country.phoneLen} digits</p>
                </div>
              )}

              {step === 2 && (
                <textarea 
                  autoFocus
                  placeholder="FULL WAREHOUSE ADDRESS"
                  className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-8 text-sm font-bold uppercase tracking-[0.2em] outline-none focus:ring-4 focus:ring-emerald-500/10 min-h-[160px] text-white placeholder:text-slate-800 shadow-inner leading-relaxed"
                  value={data.address}
                  onChange={(e) => setData({...data, address: e.target.value})}
                />
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-center gap-3 text-[11px] font-black text-emerald-500/40 uppercase tracking-widest">
                    <Globe size={18} /> Region: {country.name}
                  </div>
                  <input 
                    autoFocus
                    placeholder="PIN CODE"
                    className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-8 text-center text-3xl font-black tracking-[0.8em] outline-none focus:ring-4 focus:ring-emerald-500/10 text-white placeholder:text-slate-800 shadow-inner"
                    value={data.pincode}
                    maxLength={country.pinLen}
                    onChange={(e) => setData({...data, pincode: e.target.value.replace(/\D/g, '')})}
                    onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                  />
                </div>
              )}

              {step === 4 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-10 bg-white/5 rounded-[3rem] border border-white/10 shadow-inner text-left"
                >
                   <div className="space-y-4">
                     <p className="text-[10px] text-emerald-500/40 font-black uppercase tracking-widest">Account Summary</p>
                     <p className="text-white text-sm font-black uppercase leading-relaxed tracking-[0.1em]">
                       Company: <span className="text-emerald-400 ml-2">{data.name}</span><br/>
                       Location: <span className="text-emerald-400 ml-2">{data.pincode}</span><br/>
                       Contact: <span className="text-emerald-400 ml-2">{country.code} {data.phone}</span><br/>
                       Industry Role: <span className="text-emerald-400 ml-2">{role}</span>
                     </p>
                   </div>
                </motion.div>
              )}

              {errorMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="flex items-center justify-center gap-3 text-rose-500 text-[11px] font-black uppercase tracking-widest p-4 bg-rose-500/10 rounded-2xl border border-rose-500/20 shadow-sm"
                >
                  <AlertCircle size={18} /> {errorMsg}
                </motion.div>
              )}

              <button 
                onClick={handleNext}
                disabled={isLoading}
                className="w-full bg-emerald-500 text-emerald-950 rounded-full py-8 text-[14px] font-black uppercase tracking-[0.5em] shadow-2xl flex justify-center items-center gap-4 transition-all hover:bg-emerald-400 active:scale-95 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" size={24} /> : <>{step === steps.length - 1 ? 'Launch Profile' : 'Next Step'} <ArrowRight size={24} /></>}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
