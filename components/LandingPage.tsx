import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

/**
 * Twinkling Star Component
 * Static time-based animation for subtle twinkle.
 */
const Star = ({ delay = 0, top = 0, left = 0, size = 1 }) => (
  <motion.div
    initial={{ opacity: 0.2 }}
    animate={{ opacity: [0.2, 0.9, 0.2] }}
    transition={{
      duration: 3 + Math.random() * 4,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
    className="absolute bg-white rounded-full pointer-events-none"
    style={{
      width: size,
      height: size,
      top: `${top}%`,
      left: `${left}%`,
      boxShadow: size > 1.5 ? '0 0 4px rgba(255, 255, 255, 0.8)' : 'none',
    }}
  />
);

/**
 * Floating Leaf Component
 * Animates diagonally from bottom-left to top-right.
 */
const FloatingLeaf = ({ delay = 0, startX = 0 }) => {
  const duration = 10 + Math.random() * 8;
  const size = 16 + Math.random() * 10;
  const initialRotation = Math.random() * 360;

  return (
    <motion.div
      initial={{ 
        x: `${startX}vw`, 
        y: "110vh", 
        rotate: initialRotation, 
        opacity: 0,
        scale: 0.7
      }}
      animate={{ 
        x: `${startX + 60}vw`, 
        y: "-10vh", 
        rotate: initialRotation + 720,
        opacity: [0, 0.8, 0.8, 0],
        scale: [0.7, 1, 1, 0.7]
      }}
      transition={{ 
        duration, 
        repeat: Infinity, 
        delay, 
        ease: "linear" 
      }}
      className="absolute text-emerald-400 pointer-events-none"
    >
      <Leaf size={size} fill="currentColor" fillOpacity={0.25} />
    </motion.div>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  // Stable set of background stars
  const stars = useMemo(() => 
    Array.from({ length: 110 }).map((_, i) => ({
      id: i,
      delay: Math.random() * 5,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2 + 0.5
    })), []);

  // Increased leaf count to 100 for a much denser "sakura" effect with green leaves
  const leaves = useMemo(() => 
    Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      delay: i * 0.4,
      startX: Math.random() * 160 - 80 // Broad start range for diagonal coverage
    })), []);

  return (
    <div className="min-h-screen bg-[#0a0c0b] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden select-none">
      {/* Time-Based Space Background Layers */}
      <div className="absolute inset-0 z-0">
        {/* Deep cosmic gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#111814_0%,_#0a0c0b_100%)] opacity-85" />
        
        {/* Twinkling Stars */}
        {stars.map((s) => (
          <Star key={s.id} {...s} />
        ))}

        {/* Floating Diagonal Leaves (Under the Card) */}
        {leaves.map((l) => (
          <FloatingLeaf key={l.id} {...l} />
        ))}
      </div>

      {/* Center Content Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-2xl w-full"
      >
        {/* Card: Removed glass effect (blur) and switched to solid opaque dark background */}
        <div className="bg-[#121413] border border-white/10 p-12 md:p-20 rounded-[3.5rem] shadow-[0_40px_120px_rgba(0,0,0,0.8)]">
          {/* Sustainability Icon */}
          <motion.div 
            animate={{ 
              y: [0, -8, 0],
              rotate: [0, 2, -2, 0]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="w-24 h-24 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-400 mx-auto mb-10 border border-emerald-500/20"
          >
            <Leaf size={48} className="drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]" />
          </motion.div>

          <h1 className="text-6xl md:text-7xl font-display font-bold tracking-tight text-white mb-6">
            Circular <br />
            <span className="text-emerald-400">Liquidity</span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-12 font-light max-w-md mx-auto">
            The premier terminal for high-liquidity resource recovery and industrial circularity.
          </p>

          <motion.button
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "rgba(16, 185, 129, 1)",
              boxShadow: "0 0 40px rgba(16, 185, 129, 0.3)"
            }}
            whileTap={{ scale: 0.98 }}
            onClick={onGetStarted}
            className="w-full md:w-auto px-16 py-7 bg-emerald-600 text-emerald-950 rounded-full text-[14px] font-black uppercase tracking-[0.4em] transition-all flex justify-center items-center gap-4 mx-auto"
          >
            Enter Exchange <ArrowRight size={20} />
          </motion.button>
        </div>

        {/* Professional Metadata footer tags */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1.2, duration: 2 }}
          className="mt-16 flex flex-wrap justify-center gap-12"
        >
          {['Immutable Protocol', 'Real-Time Clearing', 'Verified Impact'].map((tag) => (
            <div key={tag} className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              <span className="text-[10px] text-white uppercase tracking-[0.3em] font-bold">
                {tag}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LandingPage;