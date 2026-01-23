
import React, { useState } from 'react';
import { Building2, MapPin, Plus, ShieldCheck, Wallet, Loader2, Trash2, Package, Target, ChevronDown, Check, X, LogOut } from 'lucide-react';
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

const CustomSelect = ({ label, options, value, onChange }: { label: string, options: { label: string, value: string }[], value: string, onChange: (v: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find(o => o.value === value);

  return (
    <div className="space-y-3 relative">
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">{label}</label>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full bg-slate-50 border border-emerald-50 rounded-2xl p-5 text-left flex justify-between items-center group transition-all focus:border-emerald-500 shadow-inner">
        <span className="font-bold text-slate-900">{selected?.label}</span>
        <ChevronDown size={18} className={`text-emerald-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute z-[110] w-full mt-2 bg-white border border-emerald-100 rounded-3xl shadow-2xl max-h-48 overflow-y-auto py-2">
            {options.map(opt => (
              <button key={opt.value} onClick={() => { onChange(opt.value); setIsOpen(false); }} className="w-full px-6 py-4 text-left hover:bg-emerald-50 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-600">{opt.label}</span>
                {value === opt.value && <Check size={16} className="text-emerald-600" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Profile: React.FC<ProfileProps> = ({ onUpdate, userProfile, setWalletBalance, inventory, onUpdateInventory, stats }) => {
  const [isAddingMoney, setIsAddingMoney] = useState(false);
  const [walletAmount, setWalletAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [isAddingInventory, setIsAddingInventory] = useState(false);
  const [invMaterial, setInvMaterial] = useState(MaterialType.PAPER);
  const [invQty, setInvQty] = useState('');
  const [invGrade, setInvGrade] = useState(QualityGrade.GRADE_A);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload(); // Force full reload to reset app state safely
  };

  const handleAddMoney = async () => {
    const num = parseFloat(walletAmount);
    if (!num || num <= 0) return;
    setIsLoading(true);
    const newBalance = (userProfile.wallet_balance || 0) + num;
    const { data: { user } } = await supabase.auth.getUser();
    if (user) await supabase.from('profiles').update({ wallet_balance: newBalance }).eq('id', user.id);
    setWalletBalance(newBalance);
    setWalletAmount(''); setIsAddingMoney(false); setIsLoading(false); onUpdate();
  };

  const handleAddInventory = () => {
    if (!invQty || parseFloat(invQty) <= 0) return;
    const newItem: InventoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      materialType: invMaterial, quantity: parseFloat(invQty) || 0,
      unit: 'tons', grade: invGrade, pricePerUnit: 0
    };
    onUpdateInventory([...inventory, newItem]);
    setIsAddingInventory(false); setInvQty('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 md:space-y-12 pb-24 md:pb-12">
      <div className="bg-emerald-950 rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-14 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-emerald-500/10 rounded-full blur-[80px] md:blur-[100px]" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-10">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 text-center md:text-left w-full md:w-auto">
            <div className="w-20 h-20 md:w-32 md:h-32 bg-emerald-600 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center text-3xl md:text-4xl font-black shadow-2xl">
              {userProfile?.name?.[0] || 'U'}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-4xl font-display font-black tracking-tight">{userProfile?.name}</h1>
              <p className="text-emerald-400 text-[8px] md:text-[10px] font-black uppercase tracking-widest mt-1.5 flex items-center justify-center md:justify-start gap-2">
                <ShieldCheck size={12} /> Verified Industry Node
              </p>
              <div className="flex gap-6 md:gap-8 mt-4 md:mt-6 justify-center md:justify-start">
                <div><p className="text-lg md:text-xl font-bold">{stats.deals}</p><p className="text-[7px] md:text-[8px] uppercase tracking-widest opacity-40 font-black">Deals</p></div>
                <div><p className="text-lg md:text-xl font-bold">{stats.totalExchanged}T</p><p className="text-[7px] md:text-[8px] uppercase tracking-widest opacity-40 font-black">Volume</p></div>
              </div>
            </div>
          </div>
          <div className="bg-white/5 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 text-center w-full md:min-w-[280px] md:w-auto">
            <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest opacity-40 mb-1.5">Credits</p>
            <p className="text-3xl md:text-4xl font-display font-black text-emerald-400 mb-6 md:mb-8">₹{(userProfile.wallet_balance || 0).toLocaleString()}</p>
            {isAddingMoney ? (
              <div className="space-y-3">
                <input autoFocus type="number" placeholder="Amount" className="w-full bg-white/10 border border-white/10 rounded-xl p-4 text-white text-sm outline-none" value={walletAmount} onChange={(e) => setWalletAmount(e.target.value)} />
                <div className="flex gap-2">
                  <button onClick={handleAddMoney} className="flex-1 bg-emerald-500 text-emerald-950 p-4 rounded-xl font-black text-[10px] uppercase">Add</button>
                  <button onClick={() => setIsAddingMoney(false)} className="bg-white/10 p-4 rounded-xl text-[10px] font-black uppercase">X</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setIsAddingMoney(true)} className="w-full py-4 bg-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-colors">Recharge Balance</button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
        <div className="lg:col-span-8 space-y-6 md:space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-lg md:text-xl font-black text-emerald-950 flex items-center gap-3"><Package size={20} className="text-emerald-600" /> Current Inventory</h2>
            <button onClick={() => setIsAddingInventory(true)} className="p-2.5 md:p-3 bg-emerald-600 text-white rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all">
              {/* Fixed: removed invalid md:size prop which is not supported by Lucide icons */}
              <Plus size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {inventory.length === 0 ? (
              <div className="col-span-2 p-12 md:p-16 border-4 border-dashed border-emerald-50 rounded-[2rem] md:rounded-[3rem] text-center text-slate-300 font-bold uppercase tracking-widest text-xs">No stock added</div>
            ) : (
              inventory.map(item => (
                <div key={item.id} className="bg-white p-5 md:p-6 rounded-[2rem] border border-emerald-50 shadow-sm flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-black text-lg">{item.materialType[0]}</div>
                    <div>
                      <h4 className="text-xs md:text-sm font-black text-slate-900">{item.materialType}</h4>
                      <p className="text-[9px] md:text-[10px] text-emerald-600 font-bold">{item.quantity} Tons • {item.grade.split(' ')[0]}</p>
                    </div>
                  </div>
                  <button onClick={() => onUpdateInventory(inventory.filter(i => i.id !== item.id))} className="p-2.5 md:p-3 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={16} /></button>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="lg:col-span-4 space-y-6 md:space-y-8">
          <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-emerald-50 shadow-sm space-y-6">
            <h3 className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-emerald-950 flex items-center gap-3"><Target size={18} className="text-emerald-600" /> Details</h3>
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 md:p-5 rounded-2xl">
                <p className="text-[7px] md:text-[8px] font-black uppercase text-slate-300 mb-1">Office Address</p>
                <p className="text-[11px] md:text-xs font-bold text-slate-900">{userProfile?.address || 'Not specified'}</p>
              </div>
              <div className="bg-slate-50 p-4 md:p-5 rounded-2xl">
                <p className="text-[7px] md:text-[8px] font-black uppercase text-slate-300 mb-1">Market Region</p>
                <div className="flex items-center gap-2 text-[11px] md:text-xs font-bold"><MapPin size={12} className="text-emerald-500" /> {userProfile?.pincode}</div>
              </div>
            </div>
          </div>

          {/* Mobile Logout Button */}
          <button 
            onClick={handleLogout}
            className="md:hidden w-full flex items-center justify-center gap-3 py-5 bg-rose-50 text-rose-500 rounded-[2rem] text-[10px] font-black uppercase tracking-widest border border-rose-100 active:scale-95 transition-all shadow-sm"
          >
            <LogOut size={16} /> Logout Node
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isAddingInventory && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-emerald-950/40 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white w-full max-w-lg rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-10 shadow-2xl relative">
              <button onClick={() => setIsAddingInventory(false)} className="absolute top-6 right-6 md:top-8 md:right-8 text-slate-300 hover:text-rose-50"><X size={24} /></button>
              <h2 className="text-xl md:text-2xl font-black text-emerald-950 mb-6 md:mb-8 text-center">Update Stock</h2>
              <div className="space-y-5 md:space-y-6">
                <CustomSelect label="Material Category" value={invMaterial} onChange={(v) => setInvMaterial(v as MaterialType)} options={Object.values(MaterialType).map(m => ({ label: m, value: m }))} />
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Volume (Tons)</label>
                    <input type="number" placeholder="0.0" className="w-full bg-slate-50 border border-emerald-50 rounded-2xl p-4 md:p-5 font-bold shadow-inner text-sm outline-none focus:border-emerald-500" value={invQty} onChange={(e) => setInvQty(e.target.value)} />
                  </div>
                  <CustomSelect label="Quality Grade" value={invGrade} onChange={(v) => setInvGrade(v as QualityGrade)} options={Object.values(QualityGrade).map(g => ({ label: g, value: g }))} />
                </div>
                <button onClick={handleAddInventory} className="w-full py-5 md:py-6 bg-emerald-600 text-white rounded-[1.5rem] md:rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all">Add Material</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
