
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Leaf, Eye, EyeOff, Loader2, AlertCircle, Info, Package, ShoppingBag } from 'lucide-react';
import { supabase } from '../services/supabase';

interface LoginProps {
  onLogin: (role: 'buyer' | 'seller') => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<'buyer' | 'seller'>('seller');
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setInfoMsg(null);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: { data: { role } }
        });
        if (error) throw error;
        if (!data.session) {
          setInfoMsg("Registration successful! Check your email to verify your terminal connection.");
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
      setErrorMsg(err.message || 'Authentication protocol failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-mesh px-6 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass w-full max-w-md p-10 md:p-14 rounded-[3.5rem] relative z-10 shadow-2xl border border-white/40"
      >
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-emerald-950 text-white px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl">
          Login 1/3
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-emerald-500 mb-6 shadow-sm border border-emerald-50">
            <Leaf size={32} />
          </div>
          <h2 className="font-display text-3xl tracking-tight text-emerald-950 text-center">
            Hello, Welcome to <br/> <span className="text-emerald-600">ReStart Terminal</span>
          </h2>
          <p className="text-slate-400 text-[10px] mt-4 uppercase tracking-[0.3em] font-bold">Identity Selection</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 text-rose-600 text-xs font-medium">
            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {infoMsg && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3 text-blue-700 text-xs font-medium">
            <Info size={14} className="flex-shrink-0 mt-0.5" />
            <span>{infoMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="flex justify-center gap-6">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setRole('seller')}
              className={`flex flex-col items-center gap-3 p-6 rounded-[2.5rem] border-2 transition-all w-32 ${role === 'seller' ? 'bg-emerald-50 border-emerald-500 shadow-lg' : 'bg-white/40 border-transparent text-slate-400 opacity-60'}`}
            >
              <Package size={32} className={role === 'seller' ? 'text-emerald-600' : ''} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Seller</span>
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setRole('buyer')}
              className={`flex flex-col items-center gap-3 p-6 rounded-[2.5rem] border-2 transition-all w-32 ${role === 'buyer' ? 'bg-emerald-50 border-emerald-500 shadow-lg' : 'bg-white/40 border-transparent text-slate-400 opacity-60'}`}
            >
              <ShoppingBag size={32} className={role === 'buyer' ? 'text-emerald-600' : ''} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Buyer</span>
            </motion.button>
          </div>

          <div className="space-y-8">
            <div className="relative group">
              <input 
                type="email" 
                required 
                placeholder=" "
                className="w-full bg-transparent border-b border-slate-200 py-3 focus:outline-none focus:border-emerald-500 transition-colors peer text-sm text-emerald-950 font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label className="absolute left-0 top-3 text-slate-400 text-xs uppercase tracking-widest pointer-events-none transition-all duration-300 font-bold">
                Email Address
              </label>
            </div>

            <div className="relative group">
              <input 
                type={showPass ? "text" : "password"} 
                required 
                placeholder=" "
                className="w-full bg-transparent border-b border-slate-200 py-3 focus:outline-none focus:border-emerald-500 transition-colors peer text-sm text-emerald-950 font-medium"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label className="absolute left-0 top-3 text-slate-400 text-xs uppercase tracking-widest pointer-events-none transition-all duration-300 font-bold">
                Security Key
              </label>
              <button 
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-0 top-3 text-slate-300 hover:text-emerald-500 transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            className="w-full bg-emerald-600 text-white rounded-full py-5 text-[10px] font-bold uppercase tracking-[0.4em] shadow-xl shadow-emerald-500/20 flex justify-center items-center gap-2"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <>{isSignUp ? 'Next Phase' : 'Initialize'} <ArrowRight size={14} /></>}
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(null); setInfoMsg(null); }}
            className="text-[10px] text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-colors font-bold"
          >
            {isSignUp ? 'Back to Sign In' : 'New Terminal? Register 1/3'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
