
import React, { useState } from 'react';
import { Package, ShoppingBag, CheckCircle2, AlertTriangle, Loader2, Wallet, Info, ChevronRight, TrendingUp, Scale, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../services/supabase';
import { MaterialType, QualityGrade, InventoryItem } from '../types';

interface MarketplaceProps {
  userProfile: any;
  inventory: InventoryItem[];
  onTradeSuccess: () => void;
  onNavigateToProfile: () => void;
  onUpdateInventory: (inv: InventoryItem[]) => void;
}

const MARKET_PRICES: Record<string, number> = {
  [MaterialType.PAPER]: 120, [MaterialType.CARDBOARD]: 150, [MaterialType.GLASS]: 80,
  [MaterialType.ALUMINUM]: 1100, [MaterialType.STEEL]: 400, [MaterialType.PLASTIC]: 550,
  [MaterialType.ELECTRONICS]: 2200, [MaterialType.BATTERIES]: 1800,
};

const CustomSelect = ({ label, options, value, onChange, placeholder = "Select..." }: { label: string, options: { label: string, value: string }[], value: string, onChange: (v: string) => void, placeholder?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find(o => o.value === value);

  return (
    <div className="space-y-3 relative z-[100]">
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">{label}</label>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full bg-slate-50 border border-emerald-50 rounded-2xl p-5 text-left flex justify-between items-center group transition-all focus:border-emerald-500 shadow-inner hover:bg-white hover:border-emerald-200">
        <span className={`font-bold text-sm ${selected ? 'text-slate-900' : 'text-slate-400'}`}>{selected ? selected.label : placeholder}</span>
        <ChevronDown size={18} className={`text-emerald-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: 10, scale: 0.95 }} 
              className="absolute z-[110] w-full mt-2 bg-white/95 backdrop-blur-xl border border-emerald-100 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] max-h-60 overflow-y-auto scrollbar-hide py-2"
            >
              {options.map(opt => (
                <button key={opt.value} onClick={() => { onChange(opt.value); setIsOpen(false); }} className="w-full px-6 py-4 text-left hover:bg-emerald-50/50 flex justify-between items-center transition-colors group">
                  <span className={`text-sm font-bold ${value === opt.value ? 'text-emerald-600' : 'text-slate-600 group-hover:text-emerald-500'}`}>{opt.label}</span>
                  {value === opt.value && <Check size={16} className="text-emerald-600" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const Marketplace: React.FC<MarketplaceProps> = ({ userProfile, inventory, onTradeSuccess, onNavigateToProfile, onUpdateInventory }) => {
  const [tradeType, setTradeType] = useState<'Buy' | 'Sell'>('Sell');
  const [selectedInvId, setSelectedInvId] = useState<string>('');
  const [material, setMaterial] = useState(MaterialType.PAPER);
  const [quantity, setQuantity] = useState<string>('');
  const [grade, setGrade] = useState<QualityGrade>(QualityGrade.GRADE_A);
  const [priceInput, setPriceInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const marketRefPrice = MARKET_PRICES[material] || 100;
  const activePrice = parseFloat(priceInput) || marketRefPrice;
  const calculatedTotal = (parseFloat(quantity) || 0) * activePrice;

  // Price analysis
  const priceDifference = activePrice - marketRefPrice;
  const diffPercent = (priceDifference / marketRefPrice) * 100;
  let priceHint = "";
  let hintColor = "";

  if (priceInput && parseFloat(priceInput) > 0) {
    if (diffPercent > 20) {
      priceHint = "Premium Pricing (Above Market Avg)";
      hintColor = "text-amber-500";
    } else if (diffPercent < -20) {
      priceHint = "Competitive Pricing (Below Market Avg)";
      hintColor = "text-blue-500";
    } else {
      priceHint = "Standard Market Rate";
      hintColor = "text-emerald-500";
    }
  }

  const handleExecute = async () => {
    const qty = parseFloat(quantity);
    if (!qty || qty <= 0) return;

    setIsProcessing(true);
    try {
      if (tradeType === 'Sell') {
        if (!selectedInvId) { setIsProcessing(false); return; }
        const item = inventory.find(i => i.id === selectedInvId)!;
        if (qty > item.quantity) { setIsProcessing(false); return; }

        await supabase.from('listings').insert({
          seller_id: userProfile.id, seller_name: userProfile.name,
          material_type: item.materialType, quantity: qty,
          unit: 'tons', grade: grade, location: userProfile.location || 'Local Warehouse',
          price_per_unit: activePrice, image_url: `https://picsum.photos/seed/${item.materialType}/400`
        });

        const newInv = inventory.map(i => i.id === selectedInvId ? { ...i, quantity: i.quantity - qty } : i).filter(i => i.quantity > 0);
        onUpdateInventory(newInv);
      } else {
        if (userProfile.wallet_balance < calculatedTotal) { setIsProcessing(false); return; }
        const newBal = userProfile.wallet_balance - calculatedTotal;
        await supabase.from('profiles').update({ wallet_balance: newBal }).eq('id', userProfile.id);
      }

      await supabase.from('transactions').insert({
        user_id: userProfile.id, type: tradeType, material_name: material,
        quantity: qty, unit: 'tons', price: calculatedTotal, grade: grade
      });

      setQuantity(''); setPriceInput(''); setSelectedInvId('');
      onTradeSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 md:space-y-12 pb-12">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-emerald-950 tracking-tight">Resource Exchange</h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Industrial Material Trading</p>
        </div>
        <div className="bg-white p-5 rounded-[2.5rem] border border-emerald-50 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><Wallet size={20} /></div>
          <div>
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Account Balance</p>
            <p className="text-xl md:text-2xl font-black text-emerald-950">₹{(userProfile?.wallet_balance || 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
        <div className="lg:col-span-7 bg-white p-6 md:p-12 rounded-[3.5rem] border border-emerald-50 shadow-2xl relative">
          <div className="flex bg-slate-50 p-1.5 md:p-2 rounded-[1.5rem] md:rounded-3xl mb-8 md:mb-12">
            {['Sell', 'Buy'].map(type => (
              <button key={type} onClick={() => setTradeType(type as any)} className={`flex-1 py-4 md:py-5 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${tradeType === type ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-200' : 'text-slate-400 hover:text-emerald-600'}`}>
                {type === 'Sell' ? 'Sell Material' : 'Buy Material'}
              </button>
            ))}
          </div>

          <div className="space-y-8 md:space-y-10">
            {tradeType === 'Sell' ? (
              inventory.length === 0 ? (
                <div className="p-12 md:p-20 border-2 border-dashed border-emerald-100 rounded-[2.5rem] md:rounded-[3.5rem] text-center space-y-6 bg-emerald-50/20">
                  <AlertTriangle className="mx-auto text-emerald-300" size={40} />
                  <div>
                    <p className="text-base font-bold text-slate-600">Inventory is Empty</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">Add materials to your profile to list them for sale.</p>
                  </div>
                  <button onClick={onNavigateToProfile} className="bg-emerald-600 text-white px-8 md:px-10 py-4 md:py-5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-emerald-700 transition-all">Update My Inventory</button>
                </div>
              ) : (
                <>
                  <CustomSelect label="Select from Inventory" placeholder="Choose material..." value={selectedInvId} onChange={(v) => { setSelectedInvId(v); const item = inventory.find(i => i.id === v); if(item) { setMaterial(item.materialType); setGrade(item.grade); }}} options={inventory.map(i => ({ label: `${i.materialType} (${i.quantity} Tons)`, value: i.id }))} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Quantity (Tons)</label>
                      <input type="number" placeholder="0.00" className="w-full bg-slate-50 border border-emerald-50 rounded-2xl p-5 md:p-6 font-bold shadow-inner outline-none focus:border-emerald-500 transition-all" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Selling Price (₹/Ton)</label>
                      <input type="number" placeholder={`Market avg: ₹${marketRefPrice}`} className="w-full bg-slate-50 border border-emerald-50 rounded-2xl p-5 md:p-6 font-bold shadow-inner outline-none focus:border-emerald-500 transition-all" value={priceInput} onChange={(e) => setPriceInput(e.target.value)} />
                      {priceHint && (
                        <p className={`text-[9px] font-black uppercase tracking-widest ml-4 mt-1 transition-all ${hintColor}`}>
                          {priceHint}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )
            ) : (
              <>
                <CustomSelect label="Material Category" value={material} onChange={(v) => setMaterial(v as MaterialType)} options={Object.values(MaterialType).map(m => ({ label: m, value: m }))} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Required Quantity (Tons)</label>
                    <input type="number" placeholder="0.00" className="w-full bg-slate-50 border border-emerald-50 rounded-2xl p-5 md:p-6 font-bold shadow-inner outline-none focus:border-emerald-500 transition-all" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                  </div>
                  <CustomSelect label="Quality Grade" value={grade} onChange={(v) => setGrade(v as QualityGrade)} options={Object.values(QualityGrade).map(g => ({ label: g, value: g }))} />
                </div>
              </>
            )}
            
            <button onClick={handleExecute} disabled={isProcessing || (tradeType === 'Sell' && !selectedInvId)} className="w-full py-7 md:py-8 bg-emerald-900 text-white rounded-[2rem] md:rounded-[2.5rem] font-black uppercase text-xs md:text-sm tracking-[0.4em] shadow-2xl hover:bg-emerald-950 active:scale-95 transition-all disabled:opacity-30">
              {isProcessing ? <Loader2 className="animate-spin mx-auto" /> : `Confirm ${tradeType}`}
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 bg-emerald-950 p-10 md:p-14 rounded-[3.5rem] md:rounded-[4rem] text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -translate-y-20 translate-x-20" />
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-display font-black mb-10 flex items-center gap-4">
              <Scale size={28} className="text-emerald-400" /> Transaction Summary
            </h3>
            <div className="space-y-8">
              <div>
                <span className="text-[10px] uppercase font-black text-emerald-500/50 block mb-2 tracking-widest">Estimated Value</span>
                <p className="text-5xl md:text-6xl font-display font-black text-emerald-400 tracking-tighter">₹{calculatedTotal.toLocaleString()}</p>
              </div>
              <div className="bg-white/5 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 space-y-6">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest"><span className="text-white/40">Market Rate</span><span>₹{activePrice}</span></div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest"><span className="text-white/40">Processing Fee</span><span className="text-emerald-400">0.00%</span></div>
              </div>
            </div>
          </div>
          <div className="mt-12 p-5 bg-emerald-500/10 rounded-2xl flex items-center gap-4 text-[9px] md:text-[10px] text-emerald-500 font-bold uppercase tracking-widest border border-emerald-500/20">
            <CheckCircle2 size={18} className="flex-shrink-0" /> Verified B2B Transaction Support
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
