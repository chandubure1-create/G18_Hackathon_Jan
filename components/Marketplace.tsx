
import React, { useState } from 'react';
import { 
  ArrowRightLeft, 
  Package, 
  ShoppingBag, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  Wallet,
  Info,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Scale
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MaterialType, QualityGrade, InventoryItem, Listing } from '../types';

interface MarketplaceProps {
  userProfile: any;
  inventory: InventoryItem[];
  onPurchaseSuccess: (tx: any, cost: number) => void;
  onSaleSuccess: (tx: any, listing: Listing, inventoryId: string, soldQty: number) => void;
  onNavigateToProfile: () => void;
}

const MARKET_PRICES: Record<string, number> = {
  [MaterialType.PAPER]: 120,
  [MaterialType.CARDBOARD]: 150,
  [MaterialType.GLASS]: 80,
  [MaterialType.ALUMINUM]: 1100,
  [MaterialType.STEEL]: 400,
  [MaterialType.PLASTIC]: 550,
  [MaterialType.ELECTRONICS]: 2200,
  [MaterialType.BATTERIES]: 1800,
};

const Marketplace: React.FC<MarketplaceProps> = ({ userProfile, inventory, onPurchaseSuccess, onSaleSuccess, onNavigateToProfile }) => {
  const [tradeType, setTradeType] = useState<'Buy' | 'Sell'>('Sell');
  const [selectedInvId, setSelectedInvId] = useState<string>('');
  const [material, setMaterial] = useState(MaterialType.PAPER);
  const [quantity, setQuantity] = useState<string>('');
  const [grade, setGrade] = useState<QualityGrade>(QualityGrade.GRADE_A);
  const [priceInput, setPriceInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'low-funds' | 'no-inventory'>('idle');

  const gradeMultiplier = {
    [QualityGrade.GRADE_A]: 1.0,
    [QualityGrade.GRADE_B]: 0.8,
    [QualityGrade.GRADE_C]: 0.5
  }[grade];

  const marketRefPrice = MARKET_PRICES[material] || 100;
  
  // Total calculation logic
  const activePrice = parseFloat(priceInput) || marketRefPrice;
  const calculatedTotal = (parseFloat(quantity) || 0) * activePrice * gradeMultiplier;

  // Validation for pricing during Sell
  const selectedInvItem = inventory.find(i => i.id === selectedInvId);
  const isPriceHigh = activePrice > marketRefPrice * 1.3;
  const isPriceLow = activePrice > 0 && activePrice < marketRefPrice * 0.7;

  const handleExecute = async () => {
    setStatus('idle');
    const qty = parseFloat(quantity);
    if (!qty || qty <= 0) return;

    if (tradeType === 'Sell') {
      if (!selectedInvId) {
        setStatus('no-inventory');
        return;
      }
      setIsProcessing(true);
      
      const invItem = inventory.find(i => i.id === selectedInvId)!;
      if (qty > invItem.quantity) {
        setStatus('error');
        setIsProcessing(false);
        return;
      }

      const listing: Listing = {
        id: Math.random().toString(36).substr(2, 9),
        sellerId: userProfile.id,
        sellerName: userProfile.name,
        materialType: invItem.materialType,
        quantity: qty,
        unit: 'tons',
        grade: grade,
        location: userProfile.location || 'Central Hub',
        pricePerUnit: activePrice,
        description: `Industrial grade ${invItem.materialType} from a trusted business partner.`,
        imageUrl: `https://picsum.photos/seed/${invItem.materialType}/400`,
        createdAt: new Date().toISOString(),
        isVerified: true
      };

      const tx = {
        id: Date.now().toString(),
        type: 'Sell' as const,
        materialName: invItem.materialType,
        quantity: qty,
        unit: 'tons',
        price: activePrice * qty,
        grade: grade,
        timestamp: new Date().toLocaleString()
      };

      onSaleSuccess(tx, listing, selectedInvId, qty);
      setStatus('success');
      setQuantity('');
      setPriceInput('');
      setIsProcessing(false);
    } else {
      if (userProfile.wallet_balance < calculatedTotal) {
        setStatus('low-funds');
        return;
      }
      setIsProcessing(true);
      
      const tx = {
        id: Date.now().toString(),
        type: 'Buy' as const,
        materialName: material,
        quantity: qty,
        unit: 'tons',
        price: calculatedTotal,
        grade: grade,
        timestamp: new Date().toLocaleString()
      };

      onPurchaseSuccess(tx, calculatedTotal);
      setStatus('success');
      setQuantity('');
      setPriceInput('');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl font-display font-bold text-emerald-950 tracking-tighter">Circular Trade</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">B2B Material Exchange Terminal</p>
        </div>
        <div className="bg-white px-8 py-5 rounded-[2.5rem] border border-emerald-50 flex items-center gap-6 shadow-sm">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><Wallet size={24} /></div>
          <div>
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Available Credits</p>
            <p className="text-2xl font-black text-emerald-950">₹{userProfile.wallet_balance.toLocaleString()}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 bg-white p-12 rounded-[3.5rem] border border-emerald-50 shadow-2xl relative">
          <div className="flex p-2 bg-slate-50 rounded-3xl mb-12">
            <button onClick={() => setTradeType('Sell')} className={`flex-1 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${tradeType === 'Sell' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-200' : 'text-slate-400 hover:text-emerald-600'}`}>
              <Package size={18} /> Post Material
            </button>
            <button onClick={() => setTradeType('Buy')} className={`flex-1 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${tradeType === 'Buy' ? 'bg-emerald-900 text-white shadow-xl shadow-slate-900' : 'text-slate-400 hover:text-emerald-900'}`}>
              <ShoppingBag size={18} /> Purchase Stock
            </button>
          </div>

          <div className="space-y-8">
            {tradeType === 'Sell' ? (
              <div className="space-y-6">
                {inventory.length === 0 ? (
                  <div className="p-12 bg-emerald-50/30 border-2 border-dashed border-emerald-100 rounded-[3rem] text-center space-y-4">
                    <AlertTriangle className="mx-auto text-emerald-400" size={32} />
                    <p className="text-sm font-bold text-emerald-800">Your Facility Stock is Empty</p>
                    <p className="text-[10px] text-emerald-500 uppercase tracking-widest font-black">Register materials in your profile to list them here.</p>
                    <button onClick={onNavigateToProfile} className="mt-4 bg-emerald-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg">Go to Inventory</button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Select Material From Stock</label>
                      <select className="w-full bg-slate-50 rounded-2xl p-6 border-none outline-none font-bold text-slate-900 shadow-inner appearance-none" value={selectedInvId} onChange={(e) => {
                        setSelectedInvId(e.target.value);
                        const item = inventory.find(i => i.id === e.target.value);
                        if(item) { setMaterial(item.materialType); setGrade(item.grade); }
                      }}>
                        <option value="">Select an Item...</option>
                        {inventory.map(i => <option key={i.id} value={i.id}>{i.materialType} (Available: {i.quantity} Tons)</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Quantity to Sell (Tons)</label>
                        <input type="number" placeholder="0.00" className="w-full bg-slate-50 rounded-2xl p-6 border-none outline-none font-bold text-slate-900 shadow-inner" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Your Asking Price (₹/Ton)</label>
                        <input type="number" placeholder={`Market: ₹${marketRefPrice}`} className="w-full bg-slate-50 rounded-2xl p-6 border-none outline-none font-bold text-slate-900 shadow-inner" value={priceInput} onChange={(e) => setPriceInput(e.target.value)} />
                      </div>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                       <div className="flex items-center gap-3 text-[10px] font-black text-emerald-800 uppercase tracking-widest"><Info size={16} /> Current Market Price</div>
                       <span className="text-sm font-bold text-emerald-600">₹{marketRefPrice} / Ton</span>
                    </div>
                    {(isPriceHigh || isPriceLow) && (
                      <div className={`p-4 rounded-2xl flex items-center gap-4 text-[10px] font-black uppercase ${isPriceHigh ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                        {isPriceHigh ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        Price Alert: Your value is {isPriceHigh ? 'too high' : 'too low'} compared to market average.
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Material Category</label>
                  <select className="w-full bg-slate-50 rounded-2xl p-6 border-none outline-none font-bold text-slate-900 shadow-inner" value={material} onChange={(e) => setMaterial(e.target.value as MaterialType)}>
                    {Object.values(MaterialType).map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Purchase Quantity (Tons)</label>
                    <input type="number" placeholder="0.00" className="w-full bg-slate-50 rounded-2xl p-6 border-none outline-none font-bold text-slate-900 shadow-inner" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Desired Grade</label>
                    <select className="w-full bg-slate-50 rounded-2xl p-6 border-none outline-none font-bold text-slate-900 shadow-inner" value={grade} onChange={(e) => setGrade(e.target.value as QualityGrade)}>
                      {Object.values(QualityGrade).map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                   <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest"><TrendingUp size={16} /> Purchase Price (Approx)</div>
                   <span className="text-sm font-bold text-slate-900">₹{marketRefPrice} / Ton</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-12">
            <AnimatePresence>
              {status === 'low-funds' && <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="mb-4 p-4 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold text-center">Insufficient balance to authorize purchase.</motion.div>}
              {status === 'success' && <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="mb-4 p-4 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold text-center">Trade confirmed and processed successfully.</motion.div>}
              {status === 'error' && <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="mb-4 p-4 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold text-center">Error: Sale quantity exceeds available stock.</motion.div>}
            </AnimatePresence>

            <button onClick={handleExecute} disabled={isProcessing || (tradeType === 'Sell' && inventory.length === 0)} className={`w-full py-8 rounded-[2rem] font-black text-sm uppercase tracking-[0.4em] transition-all flex justify-center items-center gap-4 ${tradeType === 'Sell' ? 'bg-emerald-600 text-white' : 'bg-emerald-950 text-white'} shadow-xl disabled:opacity-30 active:scale-95`}>
              {isProcessing ? <Loader2 className="animate-spin" /> : <>{tradeType === 'Sell' ? 'Confirm Sale Listing' : 'Complete Purchase'} <ChevronRight size={20} /></>}
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white p-12 rounded-[4rem] border border-emerald-50 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-emerald-600 text-[10px] font-black uppercase tracking-[0.4em] mb-6 flex items-center gap-2"><Scale size={14} /> Trade Valuation</p>
            <h3 className="text-4xl font-display font-bold text-slate-900 mb-12 leading-tight">Investment <br/> Preview</h3>
            
            <div className="space-y-10">
              <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Total Contract Value</p>
                <p className="text-6xl font-display font-bold text-emerald-600 tracking-tighter">₹{calculatedTotal.toLocaleString()}</p>
              </div>
              <div className="space-y-5 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                  <span className="uppercase tracking-widest text-[9px] text-slate-400">Rate Basis</span>
                  <span>₹{activePrice} / Ton</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                  <span className="uppercase tracking-widest text-[9px] text-slate-400">Quality Adjustment</span>
                  <span className={gradeMultiplier < 1 ? 'text-amber-500' : 'text-emerald-500'}>{(gradeMultiplier * 100).toFixed(0)}% Value</span>
                </div>
                <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-950">Net Amount</span>
                  <span className="text-xl font-bold text-emerald-600">₹{calculatedTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 p-6 bg-emerald-50 rounded-3xl flex items-center gap-4 text-[9px] text-emerald-700 font-bold uppercase tracking-widest">
            <CheckCircle2 size={18} /> Verified B2B transaction secured by protocol.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
