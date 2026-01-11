
import React, { useState, useEffect } from 'react';
import { 
  ArrowRightLeft, 
  Scale, 
  Tag, 
  ChevronRight,
  Zap,
  Info,
  Package,
  ShoppingBag,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MaterialType, QualityGrade } from '../types';
import { supabase } from '../services/supabase';

interface MarketplaceProps {
  userProfile?: any;
  onPurchaseSuccess?: () => void;
  prefillData?: any;
  onClearPrefill?: () => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ userProfile, onPurchaseSuccess, prefillData, onClearPrefill }) => {
  const [tradeType, setTradeType] = useState<'Buy' | 'Sell'>('Sell');
  const [material, setMaterial] = useState(MaterialType.PLASTIC_PET);
  const [quantity, setQuantity] = useState<string>('');
  const [grade, setGrade] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [approxPrice, setApproxPrice] = useState(0);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderStatus, setOrderStatus] = useState<'idle' | 'success' | 'insufficient'>('idle');

  // Mocked averages per MT
  const priceMatrix: Record<string, number> = {
    [MaterialType.PLASTIC_PET]: 450,
    [MaterialType.PLASTIC_HDPE]: 600,
    [MaterialType.PLASTIC_LDPE]: 550,
    [MaterialType.METAL_ALUMINUM]: 1200,
    [MaterialType.METAL_COPPER]: 8000,
    [MaterialType.METAL_STEEL]: 350,
    [MaterialType.METAL_IRON]: 200,
    [MaterialType.PAPER_CARDBOARD]: 100,
    [MaterialType.GLASS]: 80,
    [MaterialType.TEXTILES]: 300,
    [MaterialType.ELECTRONICS]: 2200
  };

  useEffect(() => {
    if (prefillData) {
      setMaterial(prefillData.materialType);
      // If someone is selling, the user wants to buy. If someone is buying, the user wants to sell.
      setTradeType(prefillData.tradeType === 'Sell' ? 'Buy' : 'Sell');
      setQuantity(prefillData.quantity.toString());
      if (prefillData.grade) {
        if (prefillData.grade.includes('A')) setGrade('A');
        else if (prefillData.grade.includes('B')) setGrade('B');
        else if (prefillData.grade.includes('C')) setGrade('C');
      }
      onClearPrefill?.();
    }
  }, [prefillData, onClearPrefill]);

  useEffect(() => {
    const base = priceMatrix[material] || 0;
    const qtyNum = parseFloat(quantity) || 0;
    const gradeMod = { A: 1, B: 0.85, C: 0.7, D: 0.5 }[grade];
    setApproxPrice(Math.round(base * qtyNum * gradeMod));
  }, [material, quantity, grade]);

  const handleOrder = async () => {
    if (isOrdering) return;
    setOrderStatus('idle');

    const balance = userProfile?.wallet_balance || 0;

    if (tradeType === 'Buy') {
      if (balance < approxPrice) {
        setOrderStatus('insufficient');
        return;
      }
    }

    setIsOrdering(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      // Refetch latest balance for atomicity check
      const { data: latestProfile } = await supabase.from('profiles').select('wallet_balance').eq('id', user.id).single();
      const currentBalance = latestProfile?.wallet_balance ?? 0;

      let newBalance = currentBalance;
      if (tradeType === 'Buy') {
        if (currentBalance < approxPrice) {
          setOrderStatus('insufficient');
          setIsOrdering(false);
          return;
        }
        newBalance = currentBalance - approxPrice;
      } else {
        // Selling logic - user gets paid
        newBalance = currentBalance + approxPrice;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ wallet_balance: newBalance })
        .eq('id', user.id);

      if (error) throw error;

      // Log transaction to history (simulated for now, as types/history view show transactions)
      // Real implementation would use a 'transactions' table

      setOrderStatus('success');
      onPurchaseSuccess?.(); // Refresh global profile balance
      
      setTimeout(() => {
        setOrderStatus('idle');
        setQuantity('');
      }, 5000);
    } catch (err) {
      console.error('Exchange protocol failed:', err);
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display tracking-tight text-emerald-950">Exchange</h1>
          <p className="text-slate-400 text-sm mt-1 font-medium">Configure circular trade protocols.</p>
        </div>
        {userProfile && (
          <motion.div 
            layout
            className="bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 flex items-center gap-3 shadow-sm"
          >
            <Wallet size={16} className="text-emerald-600" />
            <div>
              <p className="text-[8px] font-black text-emerald-600/40 uppercase tracking-widest">Available Balance</p>
              <p className="text-sm font-black text-emerald-950">₹{userProfile.wallet_balance.toLocaleString()}</p>
            </div>
          </motion.div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border border-white shadow-xl space-y-10">
            {/* Buy/Sell Toggle */}
            <div className="flex p-1 bg-slate-100 rounded-2xl">
              <button 
                onClick={() => { setTradeType('Sell'); setOrderStatus('idle'); }}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${tradeType === 'Sell' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400'}`}
              >
                <Package size={14} /> Sell Stock
              </button>
              <button 
                onClick={() => { setTradeType('Buy'); setOrderStatus('idle'); }}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${tradeType === 'Buy' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}
              >
                <ShoppingBag size={14} /> Buy Stock
              </button>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Material Type</label>
                <select 
                  className="w-full bg-slate-50 border-none rounded-2xl p-5 outline-none font-bold text-slate-900 text-xs shadow-inner appearance-none transition-all focus:ring-2 focus:ring-emerald-100"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value as MaterialType)}
                >
                  {Object.values(MaterialType).map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Quantity (MT)</label>
                  <input 
                    type="number"
                    placeholder="0.00"
                    className="w-full bg-slate-50 border-none rounded-2xl p-5 outline-none font-bold text-slate-900 text-xs shadow-inner focus:ring-2 focus:ring-emerald-100 transition-all"
                    value={quantity}
                    onChange={(e) => { setQuantity(e.target.value); setOrderStatus('idle'); }}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Quality Grade</label>
                  <div className="flex gap-2">
                    {['A', 'B', 'C', 'D'].map((g) => (
                      <button 
                        key={g}
                        onClick={() => { setGrade(g as any); setOrderStatus('idle'); }}
                        className={`flex-1 py-4 rounded-xl font-bold text-xs transition-all ${grade === g ? 'bg-emerald-950 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {orderStatus === 'insufficient' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 overflow-hidden">
                  <AlertTriangle size={14} className="flex-shrink-0" /> Insufficient balance. Please add money to your account to continue.
                </motion.div>
              )}
              {orderStatus === 'success' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 text-[10px] font-bold uppercase tracking-widest flex flex-col gap-2 overflow-hidden shadow-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="flex-shrink-0" /> Order placed successfully! Credits synchronized.
                  </div>
                  <div className="text-[8px] pl-6 text-emerald-800/60 font-black">
                    DEBIT: ₹{approxPrice.toLocaleString()} | REMAINING: ₹{(userProfile?.wallet_balance || 0).toLocaleString()}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              onClick={handleOrder}
              disabled={isOrdering || !quantity || approxPrice === 0}
              className={`w-full py-6 rounded-full font-black text-[10px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-xl ${tradeType === 'Buy' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'} text-white disabled:opacity-50 disabled:cursor-not-allowed active:scale-95`}
            >
              {isOrdering ? <Loader2 className="animate-spin" size={16} /> : (
                <>
                  {tradeType === 'Buy' ? 'Initialize Purchase' : 'Deploy Stock'} <ArrowRightLeft size={16} />
                </>
              )}
            </button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-emerald-950 p-10 rounded-[3rem] text-white space-y-8 shadow-2xl sticky top-10 overflow-hidden">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"
            />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">
                <Zap size={14} className="fill-emerald-400" /> Settlement Preview
              </div>
              <h3 className="text-2xl font-display">Approximate <br/> Settlement</h3>
              <div className="mt-8">
                <p className="text-5xl font-display font-medium text-emerald-400">₹{approxPrice.toLocaleString()}</p>
                <p className="text-[10px] text-emerald-100/40 uppercase tracking-widest mt-2">Total Node Transfer</p>
              </div>
            </div>

            <div className="relative z-10 space-y-4 pt-8 border-t border-white/10">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                <span className="text-emerald-100/60">Balance After</span>
                <span className={tradeType === 'Buy' && (userProfile?.wallet_balance || 0) < approxPrice ? 'text-rose-400' : 'text-emerald-400'}>
                  ₹{tradeType === 'Buy' ? ((userProfile?.wallet_balance || 0) - approxPrice).toLocaleString() : ((userProfile?.wallet_balance || 0) + approxPrice).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                <span className="text-emerald-100/60">Protocol Fee</span>
                <span className="text-emerald-400">₹0 (PROMO)</span>
              </div>
            </div>

            <div className="relative z-10 p-5 bg-white/5 rounded-2xl border border-white/10 flex items-start gap-3">
              <Info size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-emerald-100/60 leading-relaxed italic">
                {tradeType === 'Buy' ? 'Funds will be escrowed until quality verification is confirmed at delivery node.' : 'Sale settlement will be credited to your terminal wallet upon recipient verification.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
