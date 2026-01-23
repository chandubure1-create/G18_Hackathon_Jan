import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Scale, 
  ChevronRight,
  CheckCircle2,
  Users,
  Star,
  Info,
  TrendingUp,
  Package
} from 'lucide-react';
import { Listing } from '../types';

interface DashboardProps {
  listings: Listing[];
  onBrowse: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ listings, onBrowse }) => {
  const [showAllMaterials, setShowAllMaterials] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const SEEDED_SELLERS = [
    { id: 's1', name: 'Vertex Recycling', rating: 4.8, deals: 412, location: 'Mumbai, IN', type: 'Metals & Plastics', color: 'emerald' },
    { id: 's2', name: 'GreenHub Pune', rating: 4.6, deals: 156, location: 'Pune, IN', type: 'Electronics', color: 'blue' },
    { id: 's3', name: 'EcoLink Vizag', rating: 4.9, deals: 89, location: 'Visakhapatnam, IN', type: 'Paper & Glass', color: 'amber' },
    { id: 's4', name: 'Apex Logistics', rating: 4.5, deals: 230, location: 'Delhi, IN', type: 'Mixed Industrial', color: 'indigo' },
    { id: 's5', name: 'RecycleOne', rating: 4.7, deals: 67, location: 'Bengaluru, IN', type: 'Battery Waste', color: 'rose' },
  ];

  const displayedListings = useMemo(() => {
    const filtered = listings.filter(l => 
      l.materialType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // Fixed View All logic: if showAllMaterials is true, show all. Else show first 4.
    return showAllMaterials ? filtered : filtered.slice(0, 4);
  }, [listings, showAllMaterials, searchTerm]);

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display text-emerald-950 font-black tracking-tight">Market Overview</h1>
          <p className="text-emerald-700/60 font-medium">Real-time verified listings from industrial partners.</p>
        </div>
        <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm p-4 rounded-3xl border border-emerald-100 shadow-xl">
           <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600"><TrendingUp size={20} /></div>
           <div className="text-sm">
             <span className="font-black text-emerald-950">₹4.2M</span> 
             <span className="text-emerald-600/60 font-black uppercase text-[9px] ml-2 block leading-none">Market Flow Today</span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-300 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Find materials or regions..."
                className="w-full pl-14 pr-6 py-5 bg-white border border-emerald-100 rounded-3xl outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-sm shadow-lg shadow-emerald-900/5"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setShowAllMaterials(!showAllMaterials)} 
              className="group flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200"
            >
              {showAllMaterials ? 'Featured Materials' : 'See All Materials'} 
              <ChevronRight className={`transition-transform duration-300 ${showAllMaterials ? 'rotate-90' : 'group-hover:translate-x-1'}`} size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {displayedListings.map((listing, idx) => (
                <motion.div 
                  layout
                  key={listing.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white p-8 rounded-[3rem] border border-emerald-50 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all group"
                >
                  <div className="flex gap-6">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-emerald-50 flex-shrink-0 border border-emerald-100 p-2 group-hover:bg-white transition-colors">
                      <img src={listing.imageUrl} className="w-full h-full object-cover rounded-xl" alt="" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">{listing.materialType}</span>
                        {listing.isVerified && (
                          <div className="bg-emerald-100 text-emerald-600 p-1 rounded-full"><CheckCircle2 size={12} /></div>
                        )}
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 mt-2">{listing.sellerName}</h4>
                      <div className="flex flex-wrap gap-4 mt-4 text-slate-400 text-[9px] font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg"><Scale size={14} className="text-emerald-500" /> {listing.quantity} {listing.unit}</span>
                        <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg"><MapPin size={14} className="text-blue-500" /> {listing.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-emerald-50 flex justify-between items-center">
                    <div>
                      <span className="block text-[8px] text-emerald-300 font-black uppercase tracking-widest mb-1">Price Unit</span>
                      <p className="text-2xl font-display font-black text-emerald-950">₹{listing.pricePerUnit.toLocaleString()}</p>
                    </div>
                    <button onClick={onBrowse} className="bg-emerald-600 text-white p-4 rounded-[1.5rem] hover:bg-emerald-700 hover:scale-105 transition-all shadow-lg shadow-emerald-100">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white/80 backdrop-blur-sm p-10 rounded-[3rem] border border-emerald-100 shadow-xl">
            <div className="flex items-center gap-3 mb-10">
              <div className="bg-blue-50 p-2 rounded-xl text-blue-600 shadow-inner"><Users size={20} /></div>
              <h3 className="text-xl font-black text-emerald-950 tracking-tight">Active Partners</h3>
            </div>
            <div className="space-y-6">
              {SEEDED_SELLERS.map((seller) => (
                <div key={seller.id} className="group flex items-center justify-between p-4 rounded-3xl hover:bg-emerald-50 transition-all cursor-pointer border border-transparent hover:border-emerald-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center font-black text-lg group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all shadow-sm">
                      {seller.name[0]}
                    </div>
                    <div>
                      <h5 className="text-sm font-black text-emerald-950 group-hover:text-emerald-700 transition-colors">{seller.name}</h5>
                      <p className="text-[9px] text-emerald-400/60 font-black uppercase tracking-widest">{seller.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1 text-[10px] font-black text-amber-500"><Star size={12} className="fill-amber-500" /> {seller.rating}</div>
                    <p className="text-[8px] text-slate-300 uppercase tracking-widest mt-1 font-bold">{seller.deals} deals</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-10 bg-emerald-950 rounded-[4rem] text-white space-y-8 relative overflow-hidden shadow-2xl border border-emerald-900">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[80px]" />
            <div className="relative z-10">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-6">Network Insight</h4>
              <div className="space-y-5">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Online Partners</span>
                  <span className="text-sm font-black">1,248</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Total Vol.</span>
                  <span className="text-sm font-black">42.5K Tons</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Reliability</span>
                  <span className="text-sm font-black text-emerald-400">98.4%</span>
                </div>
              </div>
            </div>
            <button onClick={onBrowse} className="w-full py-5 bg-emerald-600 rounded-3xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-950/40 relative z-10">
              Submit Trade Listing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;