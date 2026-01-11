import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Phone,
  Loader2,
  MapPin,
  Sparkles,
  Building2,
  Home,
  AlertCircle,
} from "lucide-react";
import { supabase } from "../services/supabase";

interface OnboardingProps {
  onComplete: () => void;
  role?: "buyer" | "seller";
}

const Onboarding: React.FC<OnboardingProps> = ({
  onComplete,
  role = "seller",
}) => {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [data, setData] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
  });

  const steps = [
    {
      title: "Operational Name",
      desc: "Identify your business or persona.",
      icon: Building2,
      field: "name",
      placeholder: "Company / Full Name",
    },
    {
      title: "Communication Link",
      desc: "Secure contact for logistics.",
      icon: Phone,
      field: "phone",
      placeholder: "+91 XXXXX XXXXX",
    },
    {
      title: "Facility Address",
      desc: "Your operational base.",
      icon: Home,
      field: "address",
      placeholder: "Street, City",
    },
    {
      title: "Regional Sector",
      desc: "Pincode for routing.",
      icon: MapPin,
      field: "pincode",
      placeholder: "Pincode",
    },
    {
      title: "Terminal Ready",
      desc: "Authorization verified.",
      icon: Sparkles,
      field: null,
    },
  ];

  const current = steps[step];

  const handleNext = async () => {
    setErrorMsg(null);

    // Normal step navigation
    if (step < steps.length - 1) {
      setStep(step + 1);
      return;
    }

    // FINAL SUBMIT
    setIsLoading(true);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;
      if (!session?.user) throw new Error("Session expired. Please login again.");

      const user = session.user;

      const { error: upsertError } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          name: data.name || "Partner",
          phone: data.phone,
          address: data.address,
          pincode: data.pincode,
          role,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

      if (upsertError) throw upsertError;

      // ✅ VERY IMPORTANT
      // Let App.tsx handle navigation & dashboard load
      onComplete();
    } catch (err: any) {
      console.error("Onboarding failed:", err);
      setErrorMsg(err.message || "Onboarding failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-stone">
      <div className="max-w-md w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass p-10 rounded-[3rem] text-center shadow-2xl"
          >
            <current.icon className="mx-auto mb-6 text-emerald-500" size={36} />

            <h2 className="text-2xl font-bold mb-2">{current.title}</h2>
            <p className="text-slate-400 mb-6">{current.desc}</p>

            {errorMsg && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs flex items-center gap-2">
                <AlertCircle size={14} /> {errorMsg}
              </div>
            )}

            {current.field ? (
              <>
                <input
                  autoFocus
                  placeholder={current.placeholder}
                  className="w-full text-center text-xl border-b py-3 mb-6 focus:outline-none"
                  value={(data as any)[current.field]}
                  onChange={(e) =>
                    setData({ ...data, [current.field]: e.target.value })
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleNext()}
                />
                <button
                  onClick={handleNext}
                  className="w-full bg-emerald-600 text-white py-4 rounded-full"
                >
                  Continue <ArrowRight className="inline ml-2" size={16} />
                </button>
              </>
            ) : (
              <button
                onClick={handleNext}
                disabled={isLoading}
                className="w-full bg-emerald-950 text-white py-5 rounded-full"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin mx-auto" />
                ) : (
                  "Initialize Terminal"
                )}
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
