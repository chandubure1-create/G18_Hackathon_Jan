
import React, { useState, useEffect, useCallback } from 'react';
import { LayoutDashboard, ArrowRightLeft, MessageSquare, History, LogOut, Leaf, Loader2, User as UserIcon } from 'lucide-react';
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
import { InventoryItem, Transaction, Listing, MaterialType, QualityGrade } from './types';
import { MOCK_LISTINGS } from './mockData';

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
  const [marketplaceListings, setMarketplaceListings] = useState<Listing[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(0);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'marketplace', label: 'Exchange', icon: ArrowRightLeft },
    { id: 'inbox', label: 'Messages', icon: MessageSquare },
    { id: 'history', label: 'History', icon: History },
  ];

  const fetchGlobalData = useCallback(async (userId: string) => {
    try {
      const { data: dbListings } = await supabase.from('listings').select('*').order('created_at', { ascending: false });
      const mappedDbListings: Listing[] = (dbListings || []).map(l => ({
        id: l.id,
        sellerId: l.seller_id,
        sellerName: l.seller_name,
        materialType: l.material_type as MaterialType,
        quantity: l.quantity,
        unit: l.unit as 'tons' | 'kg' | 'units',
        grade: l.grade as QualityGrade,
        location: l.location,
        pricePerUnit: l.price_per_unit,
        description: l.description || '',
        imageUrl: l.image_url || `https://picsum.photos/seed/${l.id}/600/400`,
        createdAt: l.created_at,
        isVerified: true
      }));
      setMarketplaceListings([...mappedDbListings.filter(l => l.sellerId === userId), ...MOCK_LISTINGS]);

      const { data: txs } = await supabase.from('transactions').select('*').eq('user_id', userId).order('timestamp', { ascending: false });
      if (txs) {
        setTransactions(txs.map(t => ({
          id: t.id, 
          type: t.type, 
          materialName: t.material_name,
          quantity: t.quantity, 
          unit: t.unit, 
          price: t.price,
          grade: t.grade, 
          timestamp: new Date(t.timestamp).toLocaleString()
        })));
      }
    } catch (err) {
      console.error("Data refresh failed:", err);
    }
  }, []);

  const validateProfile = useCallback(async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    // Strict check for profile completeness
    if (data && data.name && data.address && data.phone && data.pincode) {
      setUserProfile(data);
      setWalletBalance(data.wallet_balance || 0);
      setUserRole(data.role || 'seller');
      setAppState('main');
      await fetchGlobalData(userId);
    } else {
      setAppState('onboarding');
    }
  }, [fetchGlobalData]);

  useEffect(() => {
    const init = async () => {
      await supabase.auth.getSession();
      setIsInitializing(false);
    };
    init();
  }, []);

  const handleEnterExchange = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await validateProfile(session.user.id);
    } else {
      setAppState('login');
    }
  };

  const handleLoginSuccess = async (role: 'buyer' | 'seller') => {
    setUserRole(role);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) await validateProfile(user.id);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAppState('landing');
    setUserProfile(null);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-emerald-950 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-emerald-400 mb-4" size={32} />
        <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Protocol Initializing</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f7f4] overflow-hidden selection:bg-emerald-200 relative">
      {appState !== 'landing' && <CursorTrail />}
      <AnimatePresence mode="wait">
        {appState === 'landing' && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LandingPage onGetStarted={handleEnterExchange} />
          </motion.div>
        )}
        {appState === 'login' && (
          <motion.div key="login" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}>
            <Login onLogin={handleLoginSuccess} />
          </motion.div>
        )}
        {appState === 'onboarding' && (
          <motion.div key="onboarding" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}>
            <Onboarding role={userRole} onComplete={() => {
              supabase.auth.getUser().then(({data}) => {
                if(data.user) validateProfile(data.user.id);
              });
            }} />
          </motion.div>
        )}
        {appState === 'main' && (
          <div className="flex flex-col md:flex-row h-screen relative bg-transparent z-10">
            <motion.aside 
              animate={{ width: isSidebarCollapsed ? '96px' : '280px' }} 
              onMouseEnter={() => setIsSidebarCollapsed(false)} 
              onMouseLeave={() => setIsSidebarCollapsed(true)} 
              className="hidden md:flex flex-col bg-white border-r border-emerald-100 z-40 relative shadow-xl"
            >
              <div className="p-8 flex items-center gap-4">
                <div className="bg-emerald-600 p-2 rounded-xl"><Leaf className="text-white" size={24} /></div>
                {!isSidebarCollapsed && <span className="font-display text-2xl font-black text-emerald-950">ReStart</span>}
              </div>
              <nav className="flex-1 px-4 mt-8 space-y-4">
                {navigationItems.map(item => (
                  <button key={item.id} onClick={() => setActiveView(item.id as View)} className={`w-full flex items-center gap-5 px-5 py-4 rounded-2xl transition-all ${activeView === item.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`}>
                    <item.icon size={20} className="flex-shrink-0" />
                    {!isSidebarCollapsed && <span className="text-sm font-bold">{item.label}</span>}
                  </button>
                ))}
              </nav>
              <div className="p-6 border-t border-emerald-50">
                <button onClick={handleLogout} className="w-full flex items-center gap-5 px-5 py-4 rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors">
                  <LogOut size={20} className="flex-shrink-0" />
                  {!isSidebarCollapsed && <span className="text-xs font-black uppercase tracking-widest">Logout</span>}
                </button>
              </div>
            </motion.aside>
            <main className="flex-1 overflow-y-auto relative p-4 md:p-12 pb-24 md:pb-12 scrollbar-hide">
              <div className="sticky top-0 right-0 p-2 md:p-4 flex justify-between md:justify-end z-30 pointer-events-none items-center mb-6">
                <div className="md:hidden bg-white/95 backdrop-blur-sm border border-emerald-50 p-2 px-4 rounded-xl pointer-events-auto flex items-center gap-2 shadow-md">
                   <Leaf className="text-emerald-600" size={16} />
                   <span className="font-black text-emerald-950 text-xs">ReStart</span>
                </div>
                <button onClick={() => setActiveView('profile')} className="bg-white/95 backdrop-blur-sm border border-emerald-50 flex items-center gap-3 p-1.5 px-4 rounded-full pointer-events-auto shadow-lg group transition-all">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-bold text-white text-xs shadow-sm group-hover:scale-110">
                    {userProfile?.name?.[0] || 'U'}
                  </div>
                  <span className="hidden sm:block text-xs font-bold text-slate-900">{userProfile?.name || 'Partner'}</span>
                </button>
              </div>
              <motion.div key={activeView} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                {activeView === 'dashboard' && <Dashboard listings={marketplaceListings} onBrowse={() => setActiveView('marketplace')} />}
                {activeView === 'marketplace' && <Marketplace userProfile={userProfile} inventory={inventory} onTradeSuccess={() => validateProfile(userProfile.id)} onNavigateToProfile={() => setActiveView('profile')} onUpdateInventory={setInventory} />}
                {activeView === 'inbox' && <Inbox />}
                {activeView === 'history' && <HistoryView transactions={transactions} />}
                {activeView === 'profile' && <Profile onUpdate={() => validateProfile(userProfile.id)} userProfile={userProfile} setWalletBalance={setWalletBalance} inventory={inventory} onUpdateInventory={setInventory} stats={{ deals: transactions.length, totalExchanged: transactions.reduce((acc, t) => acc + t.quantity, 0) }} />}
              </motion.div>
            </main>
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-emerald-50 px-4 py-3 flex justify-around items-center z-50 shadow-lg">
              {navigationItems.map(item => (
                <button key={item.id} onClick={() => setActiveView(item.id as View)} className={`flex flex-col items-center gap-1 ${activeView === item.id ? 'text-emerald-600' : 'text-slate-300'}`}>
                  <div className={`p-2 rounded-xl ${activeView === item.id ? 'bg-emerald-50' : ''}`}><item.icon size={22} /></div>
                  <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
                </button>
              ))}
              <button onClick={() => setActiveView('profile')} className={`flex flex-col items-center gap-1 ${activeView === 'profile' ? 'text-emerald-600' : 'text-slate-300'}`}>
                <div className={`p-2 rounded-xl ${activeView === 'profile' ? 'bg-emerald-50' : ''}`}><UserIcon size={22} /></div>
                <span className="text-[8px] font-black uppercase tracking-widest">Account</span>
              </button>
            </nav>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
