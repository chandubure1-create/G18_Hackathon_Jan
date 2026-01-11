import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Leaf,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Info,
  Package,
  ShoppingBag,
} from "lucide-react";
import { supabase } from "../services/supabase";

interface LoginProps {
  onLogin: (role: "buyer" | "seller") => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<"buyer" | "seller">("seller");
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setInfoMsg(null);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { role } },
        });

        if (error) throw error;

        if (!data.session) {
          setInfoMsg(
            "Registration successful. Check your email to verify your account."
          );
          setIsLoading(false);
          return;
        }

        // ✅ SUCCESS
        onLogin(role);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // ✅ SUCCESS
        onLogin(role);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-mesh px-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass w-full max-w-md p-10 md:p-14 rounded-[3.5rem] shadow-2xl border border-white/40"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-emerald-500 mb-6">
            <Leaf size={32} />
          </div>
          <h2 className="font-display text-3xl tracking-tight text-emerald-950 text-center">
            Welcome to <br />
            <span className="text-emerald-600">ReStart Terminal</span>
          </h2>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex gap-3 text-rose-600 text-xs">
            <AlertCircle size={14} /> {errorMsg}
          </div>
        )}

        {infoMsg && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3 text-blue-700 text-xs">
            <Info size={14} /> {infoMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="flex justify-center gap-6">
            <button
              type="button"
              onClick={() => setRole("seller")}
              className={`p-6 rounded-3xl w-32 border-2 ${
                role === "seller"
                  ? "bg-emerald-50 border-emerald-500"
                  : "opacity-60"
              }`}
            >
              <Package className="mx-auto mb-2 text-emerald-600" />
              <p className="text-[10px] uppercase tracking-widest font-bold">
                Seller
              </p>
            </button>

            <button
              type="button"
              onClick={() => setRole("buyer")}
              className={`p-6 rounded-3xl w-32 border-2 ${
                role === "buyer"
                  ? "bg-emerald-50 border-emerald-500"
                  : "opacity-60"
              }`}
            >
              <ShoppingBag className="mx-auto mb-2 text-emerald-600" />
              <p className="text-[10px] uppercase tracking-widest font-bold">
                Buyer
              </p>
            </button>
          </div>

          <input
            type="email"
            required
            placeholder="Email"
            className="w-full border-b py-3 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              required
              placeholder="Password"
              className="w-full border-b py-3 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-0 top-3 text-slate-400"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button
            disabled={isLoading}
            className="w-full bg-emerald-600 text-white rounded-full py-5 uppercase tracking-widest font-bold flex justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                {isSignUp ? "Register" : "Login"} <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg(null);
              setInfoMsg(null);
            }}
            className="text-[10px] uppercase tracking-widest text-slate-400 hover:text-emerald-600"
          >
            {isSignUp ? "Back to Login" : "New user? Register"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
