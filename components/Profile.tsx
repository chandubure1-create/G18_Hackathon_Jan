
import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Award, 
  Settings,
  ChevronRight,
  TrendingUp,
  Leaf,
  Recycle,
  Home,
  Wallet,
  Plus,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../services/supabase';

interface ProfileProps {
  onUpdate: () => void;
  userProfile?: any;
}

const Profile: React.FC<ProfileProps> = ({ onUpdate, userProfile }) => {
  const [isAddingMoney, setIsAddingMoney] = useState(false);
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const profile = userProfile || {
    name: 'New Partner',
    company: 'Unregistered Terminal',
    role: 'None',
    phone: '---',
    address: '---',
    pincode: '---',
    wallet_balance: 0
  };

  const handleAddMoney = async () => {
    const num = parseFloat(amount);
    if (!num || num <= 0) return;

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newBalance = (profile.wallet_balance || 0) + num;

      const { error } = await supabase
        .from('profiles')
        .update({ wallet_balance: newBalance })
        .eq('id', user.id);

      if (error) throw error;

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      setAmount('');
      setIsAddingMoney(false);
      onUpdate();
    } catch (err) {
      console.error('Failed to add money:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in zoom-in-95 duration-700 ease-out">
      <div className="relative group">
        <div className="h-64 bg-slate-900 rounded-[3rem] overflow-hidden relative shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1530124560676-586cad3ad276?q=80&w=2000&auto=format&fit=crop')] opacity-20 bg-center bg-cover mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/60 to-transparent"></div>
          
          <div className="absolute -bottom-16 left-12 p-3 bg-white rounded-[2.5rem] shadow-2xl border-4 border-slate-50">
            <div className="w-40 h-40 bg-emerald-600 rounded-[2rem] flex items-center justify-center text-white text-7xl font-black shadow-inner shadow-black/20 relative overflow-hidden uppercase">
               {profile.name[0]}
            </div>
          </div>
        </div>

        <div className="pt-20 px-12 flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter">{profile.name}</h1>
              <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-xl border border-emerald-200">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">ReStart Verified</span>
              </div>
            </div>
            <p className="text-lg font-bold text-slate-500 flex items-center gap-2 capitalize">
              <Building2 className="w-5 h-5 text-emerald-600" /> {profile.role} Terminal
            </p>
          </div>
          <button onClick={onUpdate} className="px-8 py-4 bg-white border border-slate-200 text-slate-900 font-black rounded-2xl shadow-sm hover:shadow-xl transition-all flex items-center gap-2 group">
            <Settings className="w-5 h-5 text-slate-400 group-hover:rotate-90 transition-transform duration-500" /> Edit Operational Info
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-12">
        {/* Wallet Feature */}
        <div className="col-span-1 md:col-span-2 bg-emerald-950 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 text-[9px] font-black uppercase tracking-[0.3em] mb-4">
                <Wallet size={14} /> Account Wallet
              </div>
              <p className="text-4xl font-display font-medium text-white mb-1">
                ₹{(profile.wallet_balance || 0).toLocaleString()}
              </p>
              <p className="text-[10px] text-emerald-100/40 uppercase tracking-widest">Available Credits</p>
            </div>
            
            <div className="mt-8">
              <AnimatePresence mode="wait">
                {isAddingMoney ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex gap-2"
                  >
                    <input 
                      autoFocus
                      type="number"
                      placeholder="Amount (₹)"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button 
                      onClick={handleAddMoney}
                      disabled={isLoading}
                      className="bg-emerald-500 text-white px-4 py-3 rounded-xl hover:bg-emerald-400 transition-colors"
                    >
                      {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                    </button>
                    <button 
                      onClick={() => setIsAddingMoney(false)}
                      className="bg-white/10 text-white px-4 py-3 rounded-xl hover:bg-white/20 transition-colors text-[10px] font-bold uppercase tracking-widest"
                    >
                      Cancel
                    </button>
                  </motion.div>
                ) : (
                  <motion.button 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setIsAddingMoney(true)}
                    className="flex items-center gap-2 bg-white text-emerald-950 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-lg"
                  >
                    <Plus size={14} /> Add Money
                  </motion.button>
                )}
              </AnimatePresence>
              {showSuccess && (
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="absolute top-4 right-4 text-emerald-400">
                  <CheckCircle size={24} />
                </motion.div>
              )}
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />
        </div>

        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 text-center shadow-inner">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Deals Secured</p>
          <p className="text-4xl font-black text-slate-900">0</p>
        </div>
        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 text-center shadow-inner">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Exchanged</p>
          <p className="text-4xl font-black text-slate-900">0 kg</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 px-12 pb-20">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 mb-8">Facility Identity</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Address</p>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-50 rounded-xl text-emerald-600"><Home className="w-5 h-5" /></div>
                  <p className="text-slate-800 font-bold leading-tight">{profile.address || 'Not set'}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sector Code</p>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-50 rounded-xl text-emerald-600"><MapPin className="w-5 h-5" /></div>
                  <p className="text-slate-800 font-bold leading-tight">{profile.pincode || 'Not set'}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Security Link</p>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-50 rounded-xl text-emerald-600"><Phone className="w-5 h-5" /></div>
                  <p className="text-slate-800 font-bold leading-tight">{profile.phone || 'Not set'}</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-emerald-900 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <h2 className="text-xl font-black mb-8 flex items-center gap-2">
              <Award className="w-6 h-6 text-emerald-400" /> Certifications
            </h2>
            <p className="text-xs text-emerald-200 font-medium leading-relaxed mb-6">Complete your first exchange to earn your first industrial sustainability badge.</p>
            <button className="w-full py-4 border border-white/20 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">
               Certification Vault
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
