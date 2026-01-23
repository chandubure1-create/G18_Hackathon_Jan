import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  MessageSquare, 
  History, 
  LogOut,
  Leaf,
  Loader2,
  ChevronDown,
  Menu,
  ShieldCheck
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
import { MOCK_LISTINGS } from './mockData';
import { InventoryItem, Transaction, Listing } from './types';

type AppState = 'landing' | 'login' | 'onboarding' | 'main';
type View = 'dashboard' | 'marketplace' | 'inbox' | 'history' | 'profile';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('landing');
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [userRole, setUserRole] = useState<'buyer' | 'seller'>('seller');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [marketplaceListings, setMarketplaceListings] = useState<Listing[]>(MOCK_LISTINGS);
  const [walletBalance, setWalletBalance] = useState<number>(0);

  const fetchProfileAndNavigate = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (data && data.name && data.address && data.pincode) {
        const balance = typeof data.wallet_balance === 'number' ? data.wallet_balance : 0;
        setWalletBalance(balance);
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
      if (session) {
        await fetchProfileAndNavigate(session.user.id);
      }
      setIsInitializing(false);
    };
    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchProfileAndNavigate(session.user.id);
      } else {
        setUserProfile(null);
        setAppState('landing');
        setWalletBalance(0);
        setInventory([]);
        setTransactions([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
      if (data) {
        setUserProfile(data);
      }
    }
  };

  const handlePurchase = (tx: Transaction, totalCost: number) => {
    setWalletBalance(prev => prev - totalCost);
    setTransactions(prev => [tx, ...prev]);
  };

  const handleSale = (tx: Transaction, listing: Listing, inventoryId: string, soldQty: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === inventoryId) {
        return { ...item, quantity: item.quantity - soldQty };
      }
      return item;
    }).filter(item => item.quantity > 0));

    setMarketplaceListings(prev => [listing, ...prev]);
    setTransactions(prev => [tx, ...prev]);
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': 
        return <Dashboard listings={marketplaceListings} onBrowse={() => setActiveView('marketplace')} />;
      case 'marketplace': 
        return (
          <Marketplace 
            userProfile={{...userProfile, wallet_balance: walletBalance}} 
            inventory={inventory}
            onPurchaseSuccess={handlePurchase}
            onSaleSuccess={handleSale}
            onNavigateToProfile={() => setActiveView('profile')}
          />
        );
      case 'inbox': return <Inbox />;
      case 'history': return <HistoryView transactions={transactions} />;
      case 'profile': return (
        <Profile 
          onUpdate={refreshProfile} 
          userProfile={{...userProfile, wallet_balance: walletBalance}} 
          setWalletBalance={setWalletBalance}
          inventory={inventory}
          onUpdateInventory={setInventory}
          stats={{
            deals: transactions.length,
            totalExchanged: transactions.reduce((acc, t) => acc + t.quantity, 0)
          }}
        />
      );
      default: return <Dashboard listings={marketplaceListings} onBrowse={() => setActiveView('marketplace')} />;
    }
  };

  if (isInitializing) return (
    <div className="min-h-screen bg-emerald-950 flex items-center justify-center">
      <Loader2 className="animate-spin text-emerald-400" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f1f8f4] overflow-hidden selection:bg-emerald-200">
      {appState !== 'landing' && <CursorTrail />}
      <AnimatePresence mode="wait">
        {appState === 'landing' && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LandingPage onGetStarted={() => setAppState('login')} />
          </motion.div>
        )}
        {appState === 'login' && (
          <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Login onLogin={(role) => setUserRole(role)} />
          </motion.div>
        )}
        {appState === 'onboarding' && (
          <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Onboarding 
              role={userRole} 
              onComplete={async () => { 
                const { data: { user } } = await supabase.auth.getUser(); 
                if (user) await fetchProfileAndNavigate(user.id); 
              }} 
            />
          </motion.div>
        )}
        {appState === 'main' && (
          <motion.div key="main" className="flex flex-col md:flex-row h-screen relative bg-emerald-50/20">
            <motion.aside 
              onMouseEnter={() => setIsSidebarCollapsed(false)}
              onMouseLeave={() => setIsSidebarCollapsed(true)}
              animate={{ width: isSidebarCollapsed ? '96px' : '280px' }}
              className="hidden md:flex flex-col bg-white border-r border-emerald-100 z-40 relative shadow-2xl"
            >
              <div className="p-8 flex items-center gap-4">
                <div className="bg-emerald-600 p-2 rounded-xl shadow-lg shadow-emerald-100">
                  <Leaf className="text-white flex-shrink-0" size={24} />
                </div>
                {!isSidebarCollapsed && <span className="font-display text-2xl font-black text-emerald-950 whitespace-nowrap">ReStart</span>}
              </div>
              <nav className="flex-1 px-4 mt-8 space-y-4">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                  { id: 'marketplace', label: 'Material Trade', icon: ArrowRightLeft },
                  { id: 'inbox', label: 'Partner Chat', icon: MessageSquare },
                  { id: 'history', label: 'Trade Records', icon: History },
                ].map((item) => (
                  <button 
                    key={item.id} 
                    onClick={() => setActiveView(item.id as View)} 
                    className={`w-full flex items-center gap-5 px-5 py-4 rounded-2xl transition-all duration-300 ${activeView === item.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200/50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50/50'}`}
                  >
                    <item.icon size={20} className="flex-shrink-0" /> 
                    {!isSidebarCollapsed && <span className="text-sm font-bold whitespace-nowrap">{item.label}</span>}
                  </button>
                ))}
              </nav>
              <div className="p-6 border-t border-emerald-50">
                <button onClick={() => supabase.auth.signOut()} className="w-full flex items-center gap-5 px-5 py-4 rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors">
                  <LogOut size={20} className="flex-shrink-0" />
                  {!isSidebarCollapsed && <span className="text-xs font-black uppercase tracking-widest">Sign Out</span>}
                </button>
              </div>
            </motion.aside>
            
            <main className="flex-1 overflow-y-auto relative p-6 md:p-12 scrollbar-hide bg-gradient-to-br from-[#f1f8f4] via-white to-[#eef7f2]">
              <div className="sticky top-0 right-0 p-4 flex justify-end z-30 pointer-events-none">
                <button onClick={() => setActiveView('profile')} className="bg-white/95 backdrop-blur-sm border border-emerald-50 flex items-center gap-4 p-2 pr-6 rounded-full pointer-events-auto shadow-lg hover:shadow-emerald-200/40 transition-all group">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-bold text-white shadow-md group-hover:scale-105 transition-transform">
                    {userProfile?.name?.[0] || 'U'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-slate-900">{userProfile?.name || 'Partner'}</p>
                    <div className="flex items-center gap-1">
                      <ShieldCheck size={10} className="text-emerald-500" />
                      <p className="text-[10px] uppercase text-emerald-600 font-bold">Verified Partner</p>
                    </div>
                  </div>
                  <ChevronDown size={14} className="text-slate-300 group-hover:text-emerald-500" />
                </button>
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={activeView} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}>
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