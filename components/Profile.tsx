import React, { useEffect, useState } from "react";
import {
  Building2,
  MapPin,
  Phone,
  ShieldCheck,
  Award,
  Settings,
  Home,
  Wallet,
  Plus,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../services/supabase";

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [isAddingMoney, setIsAddingMoney] = useState(false);
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setProfile(
      data || {
        name: "New Partner",
        company: "Unregistered Terminal",
        role: "None",
        phone: "---",
        address: "---",
        pincode: "---",
        wallet_balance: 0,
      }
    );
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAddMoney = async () => {
    const num = parseFloat(amount);
    if (!num || num <= 0) return;

    setIsLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const newBalance = (profile.wallet_balance || 0) + num;

      const { error } = await supabase
        .from("profiles")
        .update({ wallet_balance: newBalance })
        .eq("id", user.id);

      if (error) throw error;

      setProfile({ ...profile, wallet_balance: newBalance });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      setAmount("");
      setIsAddingMoney(false);
    } catch (err) {
      console.error("Failed to add money:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in zoom-in-95 duration-700 ease-out">
      {/* Header */}
      <div className="relative group">
        <div className="h-64 bg-slate-900 rounded-[3rem] overflow-hidden relative shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/60 to-transparent" />
          <div className="absolute -bottom-16 left-12 p-3 bg-white rounded-[2.5rem] shadow-2xl border-4 border-slate-50">
            <div className="w-40 h-40 bg-emerald-600 rounded-[2rem] flex items-center justify-center text-white text-7xl font-black uppercase">
              {profile.name?.[0] || "U"}
            </div>
          </div>
        </div>

        <div className="pt-20 px-12 flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-5xl font-black text-slate-900">
                {profile.name}
              </h1>
              <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-xl border">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Verified
                </span>
              </div>
            </div>
            <p className="text-lg font-bold text-slate-500 flex items-center gap-2 capitalize">
              <Building2 className="w-5 h-5 text-emerald-600" /> {profile.role}
            </p>
          </div>

          <button className="px-8 py-4 bg-white border font-black rounded-2xl flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-400" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Wallet */}
      <div className="px-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-emerald-950 text-white rounded-[2.5rem] p-8 shadow-2xl relative">
          <p className="text-[9px] uppercase tracking-widest text-emerald-400 font-black">
            Wallet Balance
          </p>
          <p className="text-4xl font-display mt-2">
            ₹{profile.wallet_balance.toLocaleString()}
          </p>

          <AnimatePresence>
            {isAddingMoney ? (
              <motion.div className="mt-6 flex gap-2">
                <input
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 rounded-xl px-4 py-3 text-black"
                />
                <button
                  onClick={handleAddMoney}
                  disabled={isLoading}
                  className="bg-emerald-500 px-4 py-3 rounded-xl"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Plus />
                  )}
                </button>
              </motion.div>
            ) : (
              <button
                onClick={() => setIsAddingMoney(true)}
                className="mt-6 bg-white text-emerald-950 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest"
              >
                Add Money
              </button>
            )}
          </AnimatePresence>

          {showSuccess && (
            <CheckCircle className="absolute top-4 right-4 text-emerald-400" />
          )}
        </div>

        {/* Info */}
        <div className="bg-white rounded-[2.5rem] p-8 border shadow-sm">
          <h2 className="font-black mb-6">Facility Info</h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <Home className="text-emerald-600" />
              <span>{profile.address || "Not set"}</span>
            </div>
            <div className="flex gap-3">
              <MapPin className="text-emerald-600" />
              <span>{profile.pincode || "Not set"}</span>
            </div>
            <div className="flex gap-3">
              <Phone className="text-emerald-600" />
              <span>{profile.phone || "Not set"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div className="px-12">
        <div className="bg-emerald-900 text-white p-10 rounded-[2.5rem] shadow-2xl">
          <h2 className="font-black mb-4 flex items-center gap-2">
            <Award className="text-emerald-400" /> Certifications
          </h2>
          <p className="text-xs text-emerald-200">
            Complete exchanges to unlock sustainability badges.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
