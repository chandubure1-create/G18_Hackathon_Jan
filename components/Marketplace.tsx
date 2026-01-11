import React, { useState, useEffect } from "react";
import {
  ArrowRightLeft,
  Zap,
  Info,
  Package,
  ShoppingBag,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Wallet,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MaterialType } from "../types";
import { supabase } from "../services/supabase";

const Marketplace: React.FC = () => {
  const navigate = useNavigate();

  const [tradeType, setTradeType] = useState<"Buy" | "Sell">("Sell");
  const [material, setMaterial] = useState(MaterialType.PLASTIC_PET);
  const [quantity, setQuantity] = useState<string>("");
  const [grade, setGrade] = useState<"A" | "B" | "C" | "D">("A");
  const [approxPrice, setApproxPrice] = useState(0);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderStatus, setOrderStatus] =
    useState<"idle" | "success" | "insufficient">("idle");
  const [walletBalance, setWalletBalance] = useState<number>(0);

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
    [MaterialType.ELECTRONICS]: 2200,
  };

  useEffect(() => {
    const fetchWallet = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("wallet_balance")
        .eq("id", user.id)
        .single();

      setWalletBalance(data?.wallet_balance ?? 0);
    };

    fetchWallet();
  }, []);

  useEffect(() => {
    const base = priceMatrix[material] || 0;
    const qtyNum = parseFloat(quantity) || 0;
    const gradeMod = { A: 1, B: 0.85, C: 0.7, D: 0.5 }[grade];
    setApproxPrice(Math.round(base * qtyNum * gradeMod));
  }, [material, quantity, grade]);

  const handleOrder = async () => {
    if (isOrdering) return;
    setOrderStatus("idle");

    if (tradeType === "Buy" && walletBalance < approxPrice) {
      setOrderStatus("insufficient");
      return;
    }

    setIsOrdering(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      let newBalance =
        tradeType === "Buy"
          ? walletBalance - approxPrice
          : walletBalance + approxPrice;

      const { error } = await supabase
        .from("profiles")
        .update({ wallet_balance: newBalance })
        .eq("id", user.id);

      if (error) throw error;

      setWalletBalance(newBalance);
      setOrderStatus("success");

      setTimeout(() => {
        setOrderStatus("idle");
        setQuantity("");
      }, 4000);
    } catch (err) {
      console.error("Order failed:", err);
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display tracking-tight text-emerald-950">
            Exchange
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-medium">
            Configure circular trade protocols.
          </p>
        </div>

        <div className="bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 flex items-center gap-3 shadow-sm">
          <Wallet size={16} className="text-emerald-600" />
          <div>
            <p className="text-[8px] font-black text-emerald-600/40 uppercase tracking-widest">
              Available Balance
            </p>
            <p className="text-sm font-black text-emerald-950">
              ₹{walletBalance.toLocaleString()}
            </p>
          </div>
        </div>
      </header>

      <div className="bg-white p-10 rounded-[3rem] border border-white shadow-xl space-y-10">
        <div className="flex p-1 bg-slate-100 rounded-2xl">
          <button
            onClick={() => setTradeType("Sell")}
            className={`flex-1 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest ${
              tradeType === "Sell"
                ? "bg-emerald-600 text-white"
                : "text-slate-400"
            }`}
          >
            <Package size={14} /> Sell
          </button>
          <button
            onClick={() => setTradeType("Buy")}
            className={`flex-1 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest ${
              tradeType === "Buy"
                ? "bg-blue-600 text-white"
                : "text-slate-400"
            }`}
          >
            <ShoppingBag size={14} /> Buy
          </button>
        </div>

        <select
          value={material}
          onChange={(e) => setMaterial(e.target.value as MaterialType)}
          className="w-full bg-slate-50 rounded-2xl p-5 font-bold text-xs"
        >
          {Object.values(MaterialType).map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantity (MT)"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full bg-slate-50 rounded-2xl p-5 font-bold text-xs"
        />

        <div className="flex gap-2">
          {["A", "B", "C", "D"].map((g) => (
            <button
              key={g}
              onClick={() => setGrade(g as any)}
              className={`flex-1 py-4 rounded-xl font-bold ${
                grade === g
                  ? "bg-emerald-950 text-white"
                  : "bg-slate-50 text-slate-400"
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {orderStatus === "insufficient" && (
            <motion.div className="p-4 bg-rose-50 rounded-xl text-rose-600 text-xs font-bold">
              <AlertTriangle size={14} /> Insufficient balance
            </motion.div>
          )}
          {orderStatus === "success" && (
            <motion.div className="p-4 bg-emerald-50 rounded-xl text-emerald-600 text-xs font-bold">
              <CheckCircle2 size={14} /> Order placed successfully
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={handleOrder}
          disabled={isOrdering || !quantity || approxPrice === 0}
          className="w-full py-6 rounded-full font-black uppercase tracking-widest bg-emerald-600 text-white disabled:opacity-50"
        >
          {isOrdering ? (
            <Loader2 className="animate-spin mx-auto" />
          ) : (
            <>
              Execute Order <ArrowRightLeft size={16} />
            </>
          )}
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full text-center text-xs text-slate-400 hover:underline"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="bg-emerald-950 p-8 rounded-3xl text-white">
        <Zap className="text-emerald-400 mb-2" />
        <p className="text-3xl font-display text-emerald-400">
          ₹{approxPrice.toLocaleString()}
        </p>
        <p className="text-[10px] uppercase tracking-widest text-emerald-100/50">
          Estimated Settlement
        </p>
      </div>
    </div>
  );
};

export default Marketplace;
