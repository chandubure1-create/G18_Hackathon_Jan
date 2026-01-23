import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Plus, 
  ShieldCheck, 
  Wallet,
  CheckCircle,
  TrendingUp,
  AlertTriangle,
  Loader2,
  Trash2,
  Package,
  ArrowUpRight,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../services/supabase';
import { MaterialType, QualityGrade, InventoryItem } from '../types';

interface ProfileProps {
  onUpdate: () => void;
  userProfile?: any;
  setWalletBalance: (bal: number) => void;
  inventory: InventoryItem[];
  onUpdateInventory: (inventory: InventoryItem[]) => void;
  stats: { deals: number; totalExchanged: number };
}

const Profile: React.FC<ProfileProps> = ({ onUpdate, userProfile, setWalletBalance, inventory, onUpdateInventory, stats }) => {
  const [isAddingMoney, setIsAddingMoney] = useState(false);
  const [walletAmount, setWalletAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Inventory Form State
  const [isAddingInventory, setIsAddingInventory] = useState(false);
  const [invMaterial, setInvMaterial] = useState(MaterialType.PAPER);
  const [invQty, setInvQty] = useState('');
  const [invGrade, setInvGrade] = useState(QualityGrade.GRADE_A);

  const handleAddMoney = async () => {
    const num = parseFloat(walletAmount);
    if (!num || num <= 0) return;
    setIsLoading(true);
    
    // Simulate credit injection locally for this demo
    const newBalance = (userProfile.wallet_balance || 0) + num;
    setWalletBalance(newBalance);
    
    // Attempt persist to DB
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('profiles').update({ wallet_balance: newBalance }).eq('id', user.id);
    }
    
    setWalletAmount('');
    setIsAddingMoney(false);
    setIsLoading(false);
    onUpdate();
  };

  const handleAddInventory = () => {
    const newItem: InventoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      materialType: invMaterial,
      quantity: parseFloat(invQty) || 0,
      unit: 'tons',
      grade: invGrade,
      pricePerUnit: 0 // Price is decided when posting a listing
    };
    onUpdateInventory([...inventory, newItem]);
    setIsAddingInventory(false);
    setInvQty('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="bg-emerald-950 rounded-[4rem] p-12 text-white shadow-2xl relative overflow-hidden border border-emerald-900">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="relative">
              <div className="w-40 h-40 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-[3rem] flex items-center justify-center text-6xl font-black uppercase shadow-2xl border-4 border-white/20">
                {userProfile?.name?.[0] || 'U'}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white text-emerald-600 p-3 rounded-2xl shadow-xl border border-emerald-50">
                <ShieldCheck size={24} />
              </div>
            </div>
            <div className="space-y-4 text-center md:text-left">
              <div className="space-y-1">
                <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tighter">{userProfile?.name}</h1>
                <p className="text-emerald-400 text-xs font-black uppercase tracking-[0.4em] mb-4">Verified Material Hub Partner</p>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-10 pt-4 border-t border-white/10">
                <div><p className="text-3xl font-bold">{stats.deals}</p><p className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Total Deals</p></div>
                <div><p className="text-3xl font-bold">{stats.totalExchanged} Tons</p><p className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Material Flow</p></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm p-12 rounded-[3.5rem] border border-white/10 text-center min-w-[320px] shadow-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-3">Material Credits (Wallet)</p>
            <p className="text-6xl font-display font-bold text-emerald-400 mb-10 tracking-tighter">₹{(userProfile.wallet_balance || 0).toLocaleString()}</p>
            <AnimatePresence mode="wait">
              {isAddingMoney ? (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-400 font-bold">₹</span>
                    <input autoFocus type="number" placeholder="Amount" className="w-full bg-white/10 border border-white/10 rounded-2xl pl-12 pr-6 py-5 outline-none text-sm text-white focus:bg-white/20 transition-all" value={walletAmount} onChange={(e) => setWalletAmount(e.target.value)} />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleAddMoney} disabled={isLoading} className="flex-1 bg-emerald-500 py-4 rounded-xl font-bold flex items-center justify-center gap-2">{isLoading ? <Loader2 className="animate-spin" size={20} /> : <><Plus size={18} /> Add</>}</button>
                    <button onClick={() => setIsAddingMoney(false)} className="px-6 bg-white/10 rounded-xl text-[10px] font-black uppercase">Cancel</button>
                  </div>
                </motion.div>
              ) : (
                <button onClick={() => setIsAddingMoney(true)} className="w-full py-5 bg-emerald-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-950/40">Inject Funds</button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
             <div className="flex items-center gap-4">
               <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600"><Package size={24} /></div>
               <div>
                 <h2 className="text-2xl font-bold text-slate-900">Current Stock</h2>
                 <p className="text-xs text-slate-400 font-medium">Manage your staged materials for future listings.</p>
               </div>
             </div>
             <button onClick={() => setIsAddingInventory(true)} className="flex items-center justify-center gap-3 bg-emerald-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"><Plus size={18} /> Add Material</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inventory.length === 0 ? (
              <div className="col-span-2 p-24 border-4 border-dashed border-emerald-50 rounded-[4rem] text-center space-y-6 bg-white/50">
                 <Package size={64} className="mx-auto text-emerald-100" />
                 <div className="space-y-2">
                   <p className="text-xl font-bold text-slate-900">No Materials Staged</p>
                   <p className="text-sm text-slate-400 max-w-xs mx-auto">Your facility stock is currently empty. Add items to list them on the marketplace.</p>
                 </div>
              </div>
            ) : (
              inventory.map((item, idx) => (
                <motion.div key={item.id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: idx*0.1 }} className="bg-white p-8 rounded-[3rem] border border-emerald-50 shadow-sm flex items-center justify-between group hover:shadow-xl hover:-translate-y-1 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 font-bold text-xl border border-emerald-100">{item.materialType[0]}</div>
                    <div>
                      <h4 className="font-bold text-slate-900">{item.materialType}</h4>
                      <div className="flex gap-4 mt-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">{item.quantity} Tons</span>
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest py-1">{item.grade}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => onUpdateInventory(inventory.filter(i => i.id !== item.id))} className="p-3 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={20} /></button>
                </motion.div>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <section className="bg-white p-10 rounded-[3rem] border border-emerald-50 shadow-sm space-y-8">
            <h3 className="text-lg font-bold flex items-center gap-3"><Building2 size={20} className="text-emerald-600" /> Facility Specs</h3>
            <div className="space-y-6">
               <div className="p-6 bg-slate-50 rounded-2xl space-y-2">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Base Operation</p>
                 <p className="text-sm font-bold text-slate-900 leading-relaxed">{userProfile?.address || 'Address not set'}</p>
               </div>
               <div className="p-6 bg-slate-50 rounded-2xl space-y-2">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Region Sector</p>
                 <div className="flex items-center gap-3 text-sm font-bold text-slate-900"><MapPin size={18} className="text-emerald-500" /> {userProfile?.pincode}</div>
               </div>
               <div className="p-6 bg-emerald-50 rounded-2xl flex items-center gap-4">
                  <div className="bg-white p-3 rounded-xl text-emerald-600 shadow-sm"><Target size={20} /></div>
                  <div>
                    <p className="text-sm font-bold text-emerald-950">Active Partner</p>
                    <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Trust Rating: High</p>
                  </div>
               </div>
            </div>
          </section>
        </div>
      </div>

      <AnimatePresence>
        {isAddingInventory && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-emerald-950/40 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} className="bg-white w-full max-w-lg rounded-[4rem] p-12 shadow-2xl space-y-12">
              <header className="text-center">
                 <h2 className="text-3xl font-bold text-emerald-950">Add Facility Stock</h2>
                 <p className="text-sm text-slate-400 mt-2 font-medium">Materials added here can later be posted on the exchange.</p>
              </header>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Material Category</label>
                  <select className="w-full bg-slate-50 rounded-3xl p-6 border-none outline-none font-bold text-slate-900 appearance-none shadow-inner" value={invMaterial} onChange={(e) => setInvMaterial(e.target.value as MaterialType)}>
                    {Object.values(MaterialType).map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Quantity (Tons)</label>
                    <input type="number" placeholder="0.0" className="w-full bg-slate-50 rounded-3xl p-6 border-none outline-none font-bold shadow-inner" value={invQty} onChange={(e) => setInvQty(e.target.value)} />
                   </div>
                   <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Quality Grade</label>
                    <select className="w-full bg-slate-50 rounded-3xl p-6 border-none outline-none font-bold shadow-inner" value={invGrade} onChange={(e) => setInvGrade(e.target.value as QualityGrade)}>
                      {Object.values(QualityGrade).map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                   </div>
                </div>
              </div>

              <div className="flex gap-4">
                 <button onClick={() => setIsAddingInventory(false)} className="flex-1 py-6 rounded-3xl text-[11px] font-black uppercase text-slate-400 hover:bg-slate-50 transition-all tracking-widest">Discard</button>
                 <button onClick={handleAddInventory} className="flex-1 py-6 rounded-3xl text-[11px] font-black uppercase text-white bg-emerald-600 shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all tracking-widest">Confirm Stock</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;