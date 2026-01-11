
import React, { useState } from 'react';
import { 
  Search, 
  Send, 
  MessageSquare,
  Box,
  ChevronRight,
  MoreVertical,
  Paperclip,
  Truck,
  DollarSign,
  Users,
  Star,
  MapPin,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_DEALERS = [
  { id: 'd1', name: 'Ravi Metals', specialization: 'Aluminum & Steel', location: 'Hyderabad', rating: 4.6 },
  { id: 'd2', name: 'GreenLoop Plastics', specialization: 'PET & HDPE', location: 'Bengaluru', rating: 4.4 },
  { id: 'd3', name: 'EcoGlass Recyclers', specialization: 'Glass', location: 'Pune', rating: 4.5 },
  { id: 'd4', name: 'IronCore Traders', specialization: 'Iron & Steel', location: 'Vizag', rating: 4.3 },
  { id: 'd5', name: 'ReTex Solutions', specialization: 'Textile waste', location: 'Coimbatore', rating: 4.2 },
  { id: 'd6', name: 'E-Cycle Hub', specialization: 'Electronics scrap', location: 'Delhi', rating: 4.7 }
];

const Inbox: React.FC = () => {
  const [isDiscoveryMode, setIsDiscoveryMode] = useState(false);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    const newMessage = {
      id: Date.now().toString(),
      sender: 'me',
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
    setInputValue('');
  };

  const handleSelectDealer = (dealer: any) => {
    setSelectedChat(dealer);
    setIsDiscoveryMode(false);
    setMessages([]); // Reset for demo
  };

  return (
    <div className="h-[calc(100vh-160px)] flex bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500 relative">
      <div className="w-full md:w-80 border-r border-slate-200 flex flex-col bg-slate-50/10">
        <div className="p-6 border-b border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display text-emerald-950">Messages</h2>
            <button 
              onClick={() => setIsDiscoveryMode(true)}
              className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors"
              title="Discover Dealers"
            >
              <Users size={18} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search terminals..." 
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-100 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/10 outline-none"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {selectedChat ? (
            <button 
              className="w-full p-4 border-b border-slate-50 bg-emerald-50/30 flex items-center gap-4 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                {selectedChat.name[0]}
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-bold text-slate-900">{selectedChat.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{messages[messages.length-1]?.text || 'No messages yet'}</p>
              </div>
            </button>
          ) : (
             <div className="p-10 text-center space-y-4">
               <MessageSquare className="mx-auto text-slate-200" size={32} />
               <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">No active threads</p>
             </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white">
        {selectedChat ? (
          <>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                  {selectedChat.name[0]}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{selectedChat.name}</h3>
                  <p className="text-[9px] text-emerald-600 uppercase tracking-widest font-bold">Online</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-slate-300 hover:text-slate-600"><Truck size={18} /></button>
                <button className="p-2 text-slate-300 hover:text-slate-600"><DollarSign size={18} /></button>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4 scrollbar-hide bg-slate-50/30">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-40">
                   <p className="text-xs italic text-slate-400">Initialize secure communication channel.</p>
                </div>
              )}
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[70%] p-4 rounded-3xl text-sm ${m.sender === 'me' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white border border-slate-100 text-slate-900 rounded-tl-none shadow-sm'}`}>
                      {m.text}
                      <p className={`text-[8px] mt-2 ${m.sender === 'me' ? 'text-emerald-100' : 'text-slate-300'}`}>{m.timestamp}</p>
                   </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-white border-t border-slate-100">
              <div className="flex gap-4">
                <button className="p-4 text-slate-300 hover:text-emerald-600 transition-colors">
                  <Paperclip size={20} />
                </button>
                <input 
                  type="text"
                  placeholder="Type message..."
                  className="flex-1 bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-emerald-500/10 outline-none"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button 
                  onClick={handleSendMessage}
                  className="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-500/20 hover:scale-105 transition-transform"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 shadow-inner mb-6 border border-slate-100">
              <MessageSquare size={48} />
            </div>
            <h3 className="text-2xl font-display text-emerald-950 mb-2">Secure Comms</h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto mb-8 font-medium">
              Initialize industrial dialogue or discover verified recycling nodes to optimize your stock flow.
            </p>
            <button 
              onClick={() => setIsDiscoveryMode(true)}
              className="bg-emerald-600 text-white px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-emerald-500/10 hover:bg-emerald-700 transition-all active:scale-95 flex items-center gap-2"
            >
              <Users size={16} /> Discover Dealers
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isDiscoveryMode && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-0 bg-white z-50 flex flex-col"
          >
            <div className="p-8 border-b border-slate-100 flex items-center gap-6">
              <button 
                onClick={() => setIsDiscoveryMode(false)}
                className="p-2 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h2 className="text-2xl font-display text-emerald-950">Discover Dealers</h2>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Verified Supply Chain Nodes</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_DEALERS.map((dealer) => (
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    key={dealer.id}
                    onClick={() => handleSelectDealer(dealer)}
                    className="p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-xl transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 font-bold text-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        {dealer.name[0]}
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black">
                        <Star size={12} className="fill-amber-600" /> {dealer.rating}
                      </div>
                    </div>
                    <h4 className="text-xl font-display text-slate-900 mb-1">{dealer.name}</h4>
                    <p className="text-xs text-slate-500 mb-4">{dealer.specialization}</p>
                    <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                      <MapPin size={12} /> {dealer.location}
                    </div>
                    <button className="w-full mt-6 py-4 bg-slate-50 group-hover:bg-emerald-600 group-hover:text-white text-slate-600 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all">
                      Initialize Chat
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Inbox;
