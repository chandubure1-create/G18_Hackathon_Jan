import React, { useState } from "react";
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

interface ProfileProps {
  userProfile: any;
  onUpdate: () => void;
}

const Profile: React.FC<ProfileProps> = ({ userProfile, onUpdate }) => {
  const [profile, setProfile] = useState(userProfile);
  const [isAddingMoney, setIsAddingMoney] = useState(false);
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddMoney = async () => {
    const num = parseFloat(amount);
    if (!num || num <= 0) return;

    setIsLoading(true);
    try {
      const newBalance = (profile.wallet_balance || 0) + num;

      const { error } = await supabase
        .from("profiles")
        .update({ wallet_balance: newBalance })
        .eq("id", profile.id);

      if (error) throw error;

      setProfile({ ...profile, wallet_balance: newBalance });
      onUpdate();

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      setAmount("");
      setIsAddingMoney(false);
    } catch (err) {
      console.error("Add money failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* HEADER */}
      <div className="relative">
        <div className="h-64 bg-slate-900 rounded-[3rem] relative">
          <div className="absolute -bottom-16 left-12 bg-white p-3 rounded-[2.5rem]">
            <div className="w-40 h-40 bg-emerald-600 rounded-[2rem] flex items-center justify-center text-white text-7xl font-black uppercase">
              {profile.name?.[0] || "U"}
            </div>
          </div>
        </div>

        <div className="pt-20 px-12 flex justify-between items-end">
          <div>
            <div className="flex gap-3 items-center">
              <h1 className="text-5xl font-black">{profile.name}</h1>
              <span className="flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-xl">
                <ShieldCheck size={14} /> VERIFIED
              </span>
            </div>
            <p className="text-lg font-bold text-slate-500 flex gap-2 items-center">
              <Building2 size={18} /> {profile.role} Terminal
            </p>
          </div>
          <button className="px-8 py-4 bg-white border rounded-2xl">
            <Settings className="inline mr-2" /> Edit Info
          </button>
        </div>
      </div>

      {/* WALLET */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-12">
        <div className="col-span-2 bg-emerald-950 text-white rounded-[2.5rem] p-8">
          <p className="text-4xl">₹{profile.wallet_balance}</p>

          <AnimatePresence>
            {isAddingMoney ? (
              <motion.div className="flex gap-2 mt-6">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 rounded-xl px-4 py-3 text-black"
                />
                <button onClick={handleAddMoney} className="bg-emerald-500 px-4 py-3 rounded-xl">
                  {isLoading ? <Loader2 className="animate-spin" /> : <Plus />}
                </button>
              </motion.div>
            ) : (
              <button
                onClick={() => setIsAddingMoney(true)}
                className="mt-6 bg-white text-black px-6 py-3 rounded-xl"
              >
                Add Money
              </button>
            )}
          </AnimatePresence>

          {showSuccess && (
            <motion.div className="absolute top-4 right-4 text-emerald-400">
              <CheckCircle size={24} />
            </motion.div>
          )}
        </div>
      </div>

      {/* FACILITY */}
      <div className="px-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem]">
          <p><Home /> {profile.address}</p>
          <p><MapPin /> {profile.pincode}</p>
          <p><Phone /> {profile.phone}</p>
        </div>
        <div className="bg-emerald-900 text-white p-10 rounded-[2.5rem]">
          <Award /> Certifications Locked
        </div>
      </div>
    </div>
  );
};

export default Profile;
