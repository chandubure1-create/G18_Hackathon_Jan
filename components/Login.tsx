
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Eye, EyeOff, Loader2, AlertCircle, Package, ShoppingBag, CheckCircle, Info } from 'lucide-react';
import { supabase } from '../services/supabase';

interface LoginProps {
  onLogin: (role: 'buyer' | 'seller') => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [role, setRole] = useState<'buyer' | 'seller'>('seller');
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isPasswordValid = hasMinLength && hasNumber && hasUpper && hasSpecial;

  const canSubmit = isEmailValid && (isSignUp ? isPasswordValid : password.length > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsLoading(true);
    setErrorMsg(null);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: { data: { role } }
        });
        if (error) throw error;
        if (!data.session) {
          setErrorMsg("Account request sent. Check email for verification.");
          setIsLoading(false);
          return;
        }
        onLogin(role);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onLogin(role);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login rejected.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-emerald-950 px-6 py-12 overflow-hidden selection:bg-emerald-500 selection:text-emerald-950">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&q=80')] opacity-10 grayscale scale-110 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-dark w-full max-w-lg p-12 md:p-16 rounded-[4rem] relative z-10 shadow-[0_30px_100px_rgba(0,0,0,0.6)] border border-white/5"
      >
        <div className="flex flex-col items-center mb-12">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-emerald-950 mb-8 shadow-2xl"
          >
            <Leaf size={40} />
          </motion.div>
          <h2 className="font-display text-5xl tracking-tight text-white text-center font-bold">
            {isSignUp ? 'Create Business Account' : 'Partner Login'}
          </h2>
          <p className="text-emerald-500/50 text-[10px] mt-4 uppercase tracking-[0.5em] font-black">Authorized B2B Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {isSignUp && (
            <div className="flex justify-center gap-8">
              {(['seller', 'buyer'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex flex-col items-center gap-4 p-8 rounded-[3rem] border-2 transition-all w-36 ${role === r ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-xl shadow-emerald-500/10' : 'bg-white/5 border-transparent text-slate-500 hover:bg-white/10'}`}
                >
                  <div className={`p-4 rounded-2xl ${role === r ? 'bg-emerald-500 text-emerald-950' : 'bg-white/5'}`}>
                    {r === 'seller' ? <Package size={28} /> : <ShoppingBag size={28} />}
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest">{r === 'seller' ? 'Supplier' : 'Purchaser'}</span>
                </button>
              ))}
            </div>
          )}

          <div className="space-y-6">
            <div className="group relative">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-2 block flex items-center gap-2">
                Business Email <span className="text-slate-700 normal-case font-medium tracking-normal">(e.g. office@company.com)</span>
              </label>
              <input 
                type="email" 
                required 
                placeholder="office@company.com"
                className={`w-full bg-white/5 border ${email && !isEmailValid ? 'border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.1)]' : 'border-white/10'} rounded-[1.5rem] px-8 py-5 text-sm text-white placeholder:text-slate-700 outline-none transition-all focus:border-emerald-500 focus:bg-white/10`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="group relative">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-2 block">Security Password</label>
              <div className="relative">
                <input 
                  type={showPass ? "text" : "password"} 
                  required 
                  placeholder="••••••••••••"
                  className={`w-full bg-white/5 border ${password && isSignUp && !isPasswordValid ? 'border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.1)]' : 'border-white/10'} rounded-[1.5rem] px-8 py-5 text-sm text-white placeholder:text-slate-700 outline-none transition-all focus:border-emerald-500 focus:bg-white/10`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-600 hover:text-emerald-500 transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {isSignUp && (
                <div className="mt-4 grid grid-cols-2 gap-2 px-4">
                  {[
                    { label: '8+ Characters', valid: hasMinLength },
                    { label: '1 Uppercase', valid: hasUpper },
                    { label: '1 Number', valid: hasNumber },
                    { label: '1 Special', valid: hasSpecial },
                  ].map((cond, i) => (
                    <div key={i} className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${cond.valid ? 'text-emerald-500' : 'text-slate-700'}`}>
                      <CheckCircle size={10} className={cond.valid ? 'text-emerald-500' : 'text-slate-800'} />
                      {cond.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {errorMsg && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-[1.5rem] flex items-center gap-4 text-rose-400 text-[11px] font-black uppercase tracking-widest leading-relaxed">
              <AlertCircle size={18} className="flex-shrink-0" /> {errorMsg}
            </motion.div>
          )}

          <motion.button 
            whileHover={canSubmit ? { scale: 1.02 } : {}}
            whileTap={canSubmit ? { scale: 0.98 } : {}}
            disabled={isLoading || !canSubmit}
            className={`w-full py-8 rounded-full text-[14px] font-black uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-4 transition-all ${canSubmit ? 'bg-emerald-500 text-emerald-950' : 'bg-slate-900 text-slate-700 cursor-not-allowed opacity-40'}`}
          >
            {isLoading ? <Loader2 size={22} className="animate-spin" /> : <>{isSignUp ? 'Get Started' : 'Sign In'} <ArrowRight size={22} /></>}
          </motion.button>
        </form>

        <div className="mt-14 text-center">
          <button 
            onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(null); }}
            className="text-[11px] text-slate-500 uppercase tracking-[0.4em] hover:text-emerald-500 transition-colors font-black border-b border-transparent hover:border-emerald-500/30 pb-1"
          >
            {isSignUp ? 'Already a partner? Login here' : 'New business? Register account'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
