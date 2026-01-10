
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  MessageSquare, 
  History, 
  Menu,
  X,
  LogOut,
  Leaf,
  Loader2,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './components/Dashboard';
import Marketplace from './components/Marketplace';
import Inbox from './components/Inbox';
import HistoryView from './components/HistoryView';
import Profile from './components/Profile';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import Onboarding from './components/Onboarding';
import CursorTrail from './components/CursorTrail';
import { supabase } from './services/supabase';

type AppState = 'landing' | 'login' | 'onboarding' | 'main';
type View = 'dashboard' | 'marketplace' | 'inbox' | 'history' | 'profile';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('landing');
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<'buyer' | 'seller'>('seller');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [exchangePrefill, setExchangePrefill] = useState<any>(null);

  const fetchProfileAndNavigate = async (userId: string) => {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
      if (data) {
        setUserProfile(data);
        setUserRole(data.role || 'seller');
        setAppState('main');
      } else {
        setAppState('onboarding');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setAppState('onboarding');
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) await fetchProfileAndNavigate(session.user.id);
      setIsInitializing(false);
    };
    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) fetchProfileAndNavigate(session.user.id);
      else {
        setUserProfile(null);
        setAppState('landing');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
      if (data) setUserProfile(data);
    }
  };

  const handleExchangeRedirect = (listingData: any) => {
    setExchangePrefill(listingData);
    setActiveView('marketplace');
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': 
        return <Dashboard onBrowse={() => setActiveView('marketplace')} onItemClick={handleExchangeRedirect} />;
      case 'marketplace': 
        return (
          <Marketplace 
            userProfile={userProfile} 
            onPurchaseSuccess={refreshProfile} 
            prefillData={exchangePrefill} 
            onClearPrefill={() => setExchangePrefill(null)}
          />
        );
      case 'inbox': return <Inbox />;
      case 'history': return <HistoryView />;
      case 'profile': return <Profile onUpdate={refreshProfile} userProfile={userProfile} />;
      default: return <Dashboard onBrowse={() => setActiveView('marketplace')} onItemClick={handleExchangeRedirect} />;
    }
  };

  if (isInitializing) return <div className="min-h-screen bg-[#f0f4f1] flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500" size={32} /></div>;

  return (
    <div className="min-h-screen bg-[#f0f4f1] overflow-hidden">
      <CursorTrail />
      <AnimatePresence mode="wait">
        {appState === 'landing' && <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><LandingPage onGetStarted={() => setAppState('login')} /></motion.div>}
        {appState === 'login' && <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Login onLogin={setUserRole} /></motion.div>}
        {appState === 'onboarding' && <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Onboarding role={userRole} onComplete={async () => { const { data: { user } } = await supabase.auth.getUser(); if (user) await fetchProfileAndNavigate(user.id); }} /></motion.div>}
        {appState === 'main' && (
          <motion.div key="main" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col md:flex-row h-screen relative">
            <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-white/40 backdrop-blur-xl border-r border-white/20 transform transition-transform duration-500 ease-[0.16,1,0.3,1] md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
              <div className="p-10 hidden md:flex flex-col gap-1 items-start">
                <div className="flex items-center gap-2.5"><Leaf className="text-emerald-500" size={24} /><span className="font-display text-2xl tracking-tight text-emerald-950">ReStart</span></div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mt-1 font-medium">Circular Terminal</p>
              </div>
              <nav className="px-6 mt-4 space-y-1">
                {[
                  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
                  { id: 'marketplace', label: 'Exchange', icon: ArrowRightLeft },
                  { id: 'inbox', label: 'Messages', icon: MessageSquare },
                  { id: 'history', label: 'Activity', icon: History },
                ].map((item) => (
                  <button key={item.id} onClick={() => { setActiveView(item.id as View); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group relative ${activeView === item.id ? 'bg-emerald-50 text-emerald-800' : 'text-slate-400 hover:text-emerald-600 hover:bg-white/50'}`}>
                    <item.icon size={18} /> <span className="text-sm font-medium">{item.label}</span>
                    {activeView === item.id && <motion.div layoutId="nav-pill" className="absolute left-2 w-1 h-5 bg-emerald-500 rounded-full" />}
                  </button>
                ))}
              </nav>
              <div className="absolute bottom-8 w-full px-6">
                <button onClick={() => supabase.auth.signOut()} className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-50/50 transition-all text-[10px] uppercase tracking-widest font-medium"><LogOut size={14} /> Sign Out</button>
              </div>
            </aside>
            <main className="flex-1 overflow-y-auto scrollbar-hide relative">
              <div className="sticky top-0 right-0 p-6 flex justify-end items-start pointer-events-none z-30">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setActiveView('profile')} className="glass flex items-center gap-3 p-2 pr-5 rounded-full border border-white/60 shadow-lg pointer-events-auto transition-all group">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-medium uppercase shadow-md">{userProfile?.name?.[0] || 'P'}</div>
                  <div className="hidden sm:flex flex-col items-start"><span className="text-xs font-bold text-slate-900 truncate max-w-[100px]">{userProfile?.name || 'Partner'}</span><span className="text-[9px] uppercase tracking-widest text-emerald-600 font-bold">{userProfile?.role || userRole}</span></div>
                  <ChevronDown size={14} className="text-slate-300 group-hover:text-emerald-500 transition-colors ml-1" />
                </motion.button>
              </div>
              <div className="px-6 md:px-12 pb-10 -mt-16"><div className="max-w-6xl mx-auto pt-10"><AnimatePresence mode="wait"><motion.div key={activeView} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>{renderView()}</motion.div></AnimatePresence></div></div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
