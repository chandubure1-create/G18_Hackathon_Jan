import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ArrowRightLeft,
  MessageSquare,
  History,
  LogOut,
  Leaf,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import Dashboard from "./components/Dashboard";
import Marketplace from "./components/Marketplace";
import Inbox from "./components/Inbox";
import HistoryView from "./components/HistoryView";
import Profile from "./components/Profile";
import Login from "./components/Login";
import LandingPage from "./components/LandingPage";
import Onboarding from "./components/Onboarding";
import CursorTrail from "./components/CursorTrail";

import { supabase } from "./services/supabase";

type AppState = "landing" | "login" | "onboarding" | "main";
type View = "dashboard" | "marketplace" | "inbox" | "history" | "profile";

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>("landing");
  const [activeView, setActiveView] = useState<View>("dashboard");
  const [userRole, setUserRole] = useState<"buyer" | "seller">("seller");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [exchangePrefill, setExchangePrefill] = useState<any>(null);

  /* ---------------- PROFILE FETCH ---------------- */

  const fetchProfileAndNavigate = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (data) {
      setUserProfile(data);
      setUserRole(data.role || "seller");
      setActiveView("dashboard");
      setAppState("main");
    } else {
      setAppState("onboarding");
    }
  };

  /* ---------------- INITIAL LOAD ---------------- */

  useEffect(() => {
    // 🚫 NEVER auto-login on refresh
    setAppState("landing");
    setIsInitializing(false);
  }, []);

  /* ---------------- LOGIN HANDLER (🔥 FIX) ---------------- */

  const handleLoginSuccess = async (role: "buyer" | "seller") => {
    setUserRole(role);

    // ✅ DIRECTLY read session AFTER login
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      console.error("Login succeeded but no session found");
      return;
    }

    await fetchProfileAndNavigate(session.user.id);
  };

  /* ---------------- PROFILE REFRESH ---------------- */

  const refreshProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) setUserProfile(data);
  };

  /* ---------------- VIEW RENDER ---------------- */

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <Dashboard
            onBrowse={() => setActiveView("marketplace")}
            onItemClick={(listing) => {
              setExchangePrefill(listing);
              setActiveView("marketplace");
            }}
          />
        );
      case "marketplace":
        return (
          <Marketplace
            userProfile={userProfile}
            prefillData={exchangePrefill}
            onClearPrefill={() => setExchangePrefill(null)}
            onPurchaseSuccess={refreshProfile}
          />
        );
      case "inbox":
        return <Inbox />;
      case "history":
        return <HistoryView />;
      case "profile":
        return <Profile userProfile={userProfile} onUpdate={refreshProfile} />;
      default:
        return null;
    }
  };

  /* ---------------- LOADING ---------------- */

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f4f1]">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-[#f0f4f1] overflow-hidden">
      <CursorTrail />

      <AnimatePresence mode="wait">
        {appState === "landing" && (
          <LandingPage onGetStarted={() => setAppState("login")} />
        )}

        {appState === "login" && (
          <Login onLogin={handleLoginSuccess} />
        )}

        {appState === "onboarding" && (
          <Onboarding
            role={userRole}
            onComplete={async () => {
              const {
                data: { user },
              } = await supabase.auth.getUser();
              if (user) await fetchProfileAndNavigate(user.id);
            }}
          />
        )}

        {appState === "main" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex h-screen"
          >
            {/* SIDEBAR */}
            <aside className="w-72 bg-white/60 backdrop-blur-xl border-r border-white/30 p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-10">
                <Leaf className="text-emerald-500" />
                <span className="font-display text-xl">ReStart</span>
              </div>

              {[
                { id: "dashboard", label: "Overview", icon: LayoutDashboard },
                { id: "marketplace", label: "Exchange", icon: ArrowRightLeft },
                { id: "inbox", label: "Messages", icon: MessageSquare },
                { id: "history", label: "Activity", icon: History },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as View)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl mb-2 ${
                    activeView === item.id
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-400 hover:bg-white"
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}

              <button
                onClick={() => supabase.auth.signOut()}
                className="mt-auto flex items-center gap-2 text-rose-500 text-xs uppercase tracking-widest"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </aside>

            {/* MAIN */}
            <main className="flex-1 overflow-y-auto p-10">
              <div className="flex justify-end mb-6">
                <button
                  onClick={() => setActiveView("profile")}
                  className="flex items-center gap-3 bg-white rounded-full p-2 shadow"
                >
                  <div className="w-10 h-10 bg-emerald-600 text-white flex items-center justify-center rounded-full font-bold">
                    {userProfile?.name?.[0] || "P"}
                  </div>
                  <ChevronDown size={14} />
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeView}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {renderView()}
                </motion.div>
              </AnimatePresence>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
