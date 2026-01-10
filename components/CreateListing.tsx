
import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Info, 
  Loader2, 
  Sparkles,
  RefreshCw,
  ChevronRight,
  Zap,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { MaterialType, QualityGrade } from '../types';
import { analyzeMaterial } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';

const CreateListing: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    materialType: MaterialType.PLASTIC_PET,
    quantity: '',
    unit: 'tons',
    grade: QualityGrade.GRADE_A,
    location: '',
    price: '',
    description: ''
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(',')[1];
      setPreviewUrl(reader.result as string);
      setAiAnalyzing(true);
      try {
        const result = await analyzeMaterial(base64String);
        setAiResult(result);
        setFormData(prev => ({
          ...prev,
          materialType: Object.values(MaterialType).find(v => v.includes(result.detectedMaterial)) || prev.materialType,
          grade: Object.values(QualityGrade).find(v => v.includes(result.suggestedGrade)) || prev.grade
        }));
      } catch (err) {
        console.error("AI Analysis failed:", err);
      } finally {
        setAiAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setPreviewUrl(null);
    setAiResult(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-1000">
      <header className="reveal">
        <h1 className="text-4xl font-display tracking-tight">Deploy Stock</h1>
        <p className="text-slate-500 font-medium text-sm mt-2">Injection of high-liquidity scrap to circular index.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Visual Identification Side */}
        <div className="lg:col-span-5 space-y-8">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className={`
              aspect-square rounded-[3rem] border-4 border-dashed flex flex-col items-center justify-center p-8 cursor-pointer transition-all overflow-hidden relative group
              ${previewUrl ? 'border-emerald-500 bg-white shadow-xl' : 'border-slate-200 bg-white/60 hover:border-emerald-300'}
            `}
          >
            {previewUrl ? (
              <>
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
                <div className="absolute inset-0 bg-emerald-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                  <div className="flex gap-4">
                    <button onClick={() => fileInputRef.current?.click()} className="p-4 bg-white text-emerald-600 rounded-full shadow-lg hover:scale-110 transition-transform">
                      <RefreshCw className="w-6 h-6" />
                    </button>
                    <button onClick={removeImage} className="p-4 bg-rose-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center space-y-6" onClick={() => fileInputRef.current?.click()}>
                <div className="bg-emerald-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-4 border border-emerald-100 group-hover:bg-emerald-100 transition-colors">
                  <Camera className="w-10 h-10 text-emerald-600" />
                </div>
                <p className="font-display text-2xl tracking-tight text-slate-800">Identify Stock</p>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-[0.2em] leading-loose px-4">Gemini AI Analysis Required</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload} 
            />
          </motion.div>

          <AnimatePresence>
            {aiAnalyzing && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-emerald-950 p-8 rounded-[2rem] flex items-center gap-6 border border-emerald-500/20 shadow-2xl relative overflow-hidden"
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                />
                <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                <span className="text-[10px] font-medium text-white uppercase tracking-[0.3em]">Protocol Analysis In Progress...</span>
              </motion.div>
            )}

            {aiResult && !aiAnalyzing && (
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white p-10 rounded-[3rem] border border-emerald-100 shadow-xl shadow-emerald-500/5 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="flex items-center gap-3 text-emerald-600 font-medium mb-8 text-[10px] uppercase tracking-[0.3em] italic">
                  <Sparkles size={16} className="text-amber-400" /> Gemini Protocol Report
                </div>
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-emerald-50 pb-4">
                    <span className="text-[9px] text-slate-400 font-medium uppercase tracking-[0.3em]">Material</span>
                    <span className="text-slate-900 font-medium uppercase text-sm">{aiResult.detectedMaterial}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-emerald-50 pb-4">
                    <span className="text-[9px] text-slate-400 font-medium uppercase tracking-[0.3em]">Grading</span>
                    <span className="text-blue-600 font-medium uppercase text-sm">{aiResult.suggestedGrade}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-emerald-50 pb-4">
                    <span className="text-[9px] text-slate-400 font-medium uppercase tracking-[0.3em]">Purity Index</span>
                    <div className="text-right">
                      <span className="text-emerald-600 font-medium text-sm">{100 - aiResult.contaminationPercentage}%</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <p className="text-xs text-slate-600 italic leading-relaxed">
                      "{aiResult.observations}"
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Data Entry Side */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white p-10 md:p-14 rounded-[3rem] border border-white shadow-xl space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-[9px] font-medium text-slate-400 uppercase tracking-[0.3em] ml-2">Material Category</label>
              <select 
                className="w-full bg-slate-50/80 border-none rounded-2xl p-5 focus:ring-4 focus:ring-emerald-500/10 outline-none font-medium text-slate-900 uppercase text-xs appearance-none transition-all shadow-inner"
                value={formData.materialType}
                onChange={e => setFormData({...formData, materialType: e.target.value as MaterialType})}
              >
                {Object.values(MaterialType).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-[9px] font-medium text-slate-400 uppercase tracking-[0.3em] ml-2">Verified Grade</label>
              <select 
                className="w-full bg-slate-50/80 border-none rounded-2xl p-5 focus:ring-4 focus:ring-emerald-500/10 outline-none font-medium text-slate-900 uppercase text-xs appearance-none transition-all shadow-inner"
                value={formData.grade}
                onChange={e => setFormData({...formData, grade: e.target.value as QualityGrade})}
              >
                {Object.values(QualityGrade).map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-[9px] font-medium text-slate-400 uppercase tracking-[0.3em] ml-2">Density (Quantity)</label>
              <div className="flex bg-slate-50/80 rounded-2xl overflow-hidden shadow-inner">
                <input 
                  type="number" 
                  placeholder="0.00" 
                  required
                  className="flex-1 bg-transparent border-none p-5 focus:ring-4 focus:ring-emerald-500/10 outline-none font-medium text-slate-900 uppercase text-xs"
                  value={formData.quantity}
                  onChange={e => setFormData({...formData, quantity: e.target.value})}
                />
                <select 
                  className="bg-slate-200 border-none px-6 text-[10px] font-medium text-slate-600 uppercase"
                  value={formData.unit}
                  onChange={e => setFormData({...formData, unit: e.target.value})}
                >
                  <option value="tons">Tons</option>
                  <option value="kg">kg</option>
                  <option value="bales">Bales</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[9px] font-medium text-slate-400 uppercase tracking-[0.3em] ml-2">Node Value (Price/MT)</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500 font-medium text-sm">$</span>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  required
                  className="w-full pl-12 pr-6 py-5 bg-slate-50/80 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none font-medium text-slate-900 uppercase text-xs shadow-inner"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[9px] font-medium text-slate-400 uppercase tracking-[0.3em] ml-2">Node Location</label>
            <input 
              type="text" 
              placeholder="E.G. CHICAGO, IL_USA_NODE" 
              required
              className="w-full bg-slate-50/80 border-none rounded-2xl p-5 focus:ring-4 focus:ring-emerald-500/10 outline-none font-medium text-slate-900 uppercase text-xs shadow-inner"
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[9px] font-medium text-slate-400 uppercase tracking-[0.3em] ml-2">Protocol Specs</label>
            <textarea 
              rows={3} 
              placeholder="MATERIAL COMPOSITION_HAULING PARAMETERS..."
              className="w-full bg-slate-50/80 border-none rounded-[1.5rem] p-6 focus:ring-4 focus:ring-emerald-500/10 outline-none font-medium text-slate-900 uppercase text-xs tracking-widest placeholder:text-slate-200 shadow-inner"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="pt-6">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 text-white font-medium py-6 rounded-full hover:bg-emerald-600 transition-all flex items-center justify-center gap-4 uppercase tracking-[0.3em] text-[10px] shadow-xl active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Finalizing Protocol...
                </>
              ) : (
                <>
                  Confirm Deployment <ChevronRight size={18} />
                </>
              )}
            </button>
            <div className="flex items-center justify-center gap-2 mt-6 text-[8px] text-slate-400 uppercase tracking-[0.2em]">
              <CheckCircle2 size={12} className="text-emerald-500" />
              Binding ReStart Protocol Offer
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
