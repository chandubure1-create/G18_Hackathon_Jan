
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Globe, Zap, Recycle } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-stone flex flex-col items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl space-y-12"
      >
        <div className="flex flex-col items-center gap-6">
          <div className="w-24 h-24 glass rounded-[2.5rem] flex items-center justify-center text-emerald-500 shadow-2xl">
            <Recycle size={48} className="animate-[spin_12s_linear_infinite]" />
          </div>
          <h1 className="text-6xl md:text-8xl font-display tracking-tight leading-[0.9]">
            Circular <span className="text-emerald-600">Liquidity</span>.
          </h1>
        </div>

        <p className="text-lg md:text-xl text-slate-500 max-w-xl mx-auto leading-relaxed">
          The minimal industrial terminal for trading sustainable stock. Secure, fluid, and zero-waste.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onGetStarted}
            className="bg-emerald-950 text-white rounded-full px-12 py-6 text-[11px] font-medium uppercase tracking-[0.4em] shadow-2xl shadow-black/10 flex items-center gap-3 transition-colors"
          >
            Launch Exchange <ArrowRight size={16} />
          </motion.button>
          <button className="glass rounded-full px-12 py-6 text-[11px] font-medium uppercase tracking-[0.4em] hover:bg-white/60 transition-colors">
            View Whitepaper
          </button>
        </div>

        <div className="flex justify-center gap-12 pt-20 opacity-30">
          <div className="flex items-center gap-2">
            <Globe size={16} />
            <span className="text-[10px] uppercase tracking-widest">Global Nodes</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={16} />
            <span className="text-[10px] uppercase tracking-widest">Instant Settlement</span>
          </div>
          <div className="flex items-center gap-2">
            <Leaf size={16} />
            <span className="text-[10px] uppercase tracking-widest">Certified Impact</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
