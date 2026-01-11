import React, { useState, useRef } from "react";
import {
  Camera,
  Loader2,
  Sparkles,
  RefreshCw,
  ChevronRight,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { MaterialType, QualityGrade } from "../types";
import { analyzeMaterial } from "../services/geminiService";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CreateListing: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    materialType: MaterialType.PLASTIC_PET,
    quantity: "",
    unit: "tons",
    grade: QualityGrade.GRADE_A,
    location: "",
    price: "",
    description: "",
  });

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(",")[1];
      setPreviewUrl(reader.result as string);
      setAiAnalyzing(true);

      try {
        const result = await analyzeMaterial(base64String);
        setAiResult(result);

        setFormData((prev) => ({
          ...prev,
          materialType:
            Object.values(MaterialType).find((v) =>
              v.includes(result.detectedMaterial)
            ) || prev.materialType,
          grade:
            Object.values(QualityGrade).find((v) =>
              v.includes(result.suggestedGrade)
            ) || prev.grade,
        }));
      } catch (err) {
        console.error("AI analysis failed:", err);
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
      navigate("/dashboard"); // redirect after create
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-1000">
      <header>
        <h1 className="text-4xl font-display tracking-tight">
          Deploy Stock
        </h1>
        <p className="text-slate-500 font-medium text-sm mt-2">
          Injection of high-liquidity scrap to circular index.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* AI SIDE */}
        <div className="lg:col-span-5 space-y-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`aspect-square rounded-[3rem] border-4 border-dashed flex items-center justify-center p-8 cursor-pointer relative group ${
              previewUrl
                ? "border-emerald-500 bg-white"
                : "border-slate-200 bg-white/60 hover:border-emerald-300"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            {previewUrl ? (
              <>
                <img
                  src={previewUrl}
                  className="w-full h-full object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition">
                  <button className="p-4 bg-white rounded-full">
                    <RefreshCw />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage();
                    }}
                    className="p-4 bg-rose-500 text-white rounded-full"
                  >
                    <Trash2 />
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center space-y-4">
                <Camera className="mx-auto w-10 h-10 text-emerald-600" />
                <p className="font-display text-xl">
                  Identify Stock
                </p>
                <p className="text-[10px] uppercase tracking-widest text-slate-400">
                  Gemini AI Required
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </motion.div>

          <AnimatePresence>
            {aiAnalyzing && (
              <motion.div className="bg-emerald-950 p-6 rounded-2xl flex items-center gap-4 text-white">
                <Loader2 className="animate-spin" />
                <span className="text-[10px] uppercase tracking-widest">
                  Analyzing...
                </span>
              </motion.div>
            )}

            {aiResult && !aiAnalyzing && (
              <motion.div className="bg-white p-8 rounded-3xl shadow">
                <div className="flex items-center gap-2 text-emerald-600 text-xs uppercase tracking-widest mb-4">
                  <Sparkles className="text-amber-400" /> Gemini Report
                </div>
                <p className="text-sm">
                  Material:{" "}
                  <strong>{aiResult.detectedMaterial}</strong>
                </p>
                <p className="text-sm">
                  Grade:{" "}
                  <strong>{aiResult.suggestedGrade}</strong>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 bg-white p-10 rounded-[3rem] shadow-xl space-y-8"
        >
          <select
            value={formData.materialType}
            onChange={(e) =>
              setFormData({
                ...formData,
                materialType: e.target.value as MaterialType,
              })
            }
            className="w-full rounded-xl p-4 bg-slate-50"
          >
            {Object.values(MaterialType).map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Quantity"
            required
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: e.target.value })
            }
            className="w-full rounded-xl p-4 bg-slate-50"
          />

          <input
            type="number"
            placeholder="Price / MT"
            required
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className="w-full rounded-xl p-4 bg-slate-50"
          />

          <input
            type="text"
            placeholder="Location"
            required
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className="w-full rounded-xl p-4 bg-slate-50"
          />

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full rounded-xl p-4 bg-slate-50"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-6 rounded-full uppercase tracking-widest flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" /> Deploying...
              </>
            ) : (
              <>
                Confirm Deployment <ChevronRight />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest">
            <CheckCircle2 className="text-emerald-500" />
            Binding Protocol Offer
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;

