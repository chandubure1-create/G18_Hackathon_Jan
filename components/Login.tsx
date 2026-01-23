
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Eye, EyeOff, Loader2, AlertCircle, Package, ShoppingBag, CheckCircle } from 'lucide-react';
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

  // Validation Logic
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
          setErrorMsg("Verification email sent. Please check your inbox.");
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
      setErrorMsg(err.message || 'Access Denied.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-950 px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#064e3b_0%,_#022c22_100%)] opacity-50" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-dark w-full max-w-lg p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] relative z-10 shadow-2xl border border-white/5"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-500 rounded-2xl md:rounded-[2rem] flex items-center justify-center text-emerald-950 mb-6 shadow-xl">
            <Leaf size={32} />
          </div>
          <h2 className="text-3xl font-display text-white text-center font-bold">
            {isSignUp ? 'Join ReStart' : 'Welcome Back'}
          </h2>
          <p className="text-emerald-500/50 text-[10px] mt-3 uppercase tracking-[0.5em] font-black">Authorized Node Access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <div className="flex justify-center gap-4">
              {(['seller', 'buyer'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all ${role === r ? 'bg-emerald-500/20 border-emerald-500 text-white' : 'bg-white/5 border-transparent text-slate-500'}`}
                >
                  <div className={`p-3 rounded-xl ${role === r ? 'bg-emerald-500 text-emerald-950' : 'bg-white/5'}`}>
                    {r === 'seller' ? <Package size={20} /> : <ShoppingBag size={20} />}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest">{r === 'seller' ? 'Supplier' : 'Buyer'}</span>
                </button>
              ))}
            </div>
          )}

          <div className="space-y-4">
            <input 
              type="email" 
              required 
              placeholder="BUSINESS EMAIL"
              className={`w-full bg-white/5 border rounded-2xl px-6 py-4 text-sm text-white placeholder:text-slate-700 outline-none transition-all ${email && !isEmailValid ? 'border-rose-500/50' : 'border-white/10 focus:border-emerald-500'}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative">
              <input 
                type={showPass ? "text" : "password"} 
                required 
                placeholder="PASSWORD"
                className={`w-full bg-white/5 border rounded-2xl px-6 py-4 text-sm text-white placeholder:text-slate-700 outline-none transition-all ${password && isSignUp && !isPasswordValid ? 'border-rose-500/50' : 'border-white/10 focus:border-emerald-500'}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {isSignUp && (
              <div className="grid grid-cols-2 gap-2 px-2 py-2">
                {[
                  { label: '8+ Chars', valid: hasMinLength },
                  { label: 'Uppercase', valid: hasUpper },
                  { label: 'Number', valid: hasNumber },
                  { label: 'Special', valid: hasSpecial },
                ].map((cond, idx) => (
                  <div key={idx} className={`flex items-center gap-2 text-[8px] font-black uppercase tracking-widest ${cond.valid ? 'text-emerald-500' : 'text-slate-600'}`}>
                    <CheckCircle size={10} className={cond.valid ? 'text-emerald-500' : 'text-slate-800'} />
                    {cond.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {errorMsg && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400 text-[10px] font-black uppercase tracking-widest">
              <AlertCircle size={16} /> {errorMsg}
            </div>
          )}

          <button 
            disabled={isLoading || !canSubmit}
            className={`w-full py-5 md:py-7 rounded-full text-xs font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 transition-all ${canSubmit ? 'bg-emerald-500 text-emerald-950 shadow-xl' : 'bg-slate-900 text-slate-700 opacity-50'}`}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <>{isSignUp ? 'Create Account' : 'Sign In'} <ArrowRight size={20} /></>}
          </button>
        </form>

        <div className="mt-10 text-center">
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-[10px] text-slate-500 uppercase tracking-widest hover:text-emerald-500 transition-colors font-black">
            {isSignUp ? 'Have an account? Login' : 'New here? Sign Up'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
