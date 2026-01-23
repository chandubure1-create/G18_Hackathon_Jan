
import React, { useState } from 'react';
import { 
  Search, 
  Send, 
  MessageSquare,
  Star,
  MapPin,
  ArrowLeft,
  Paperclip,
  CheckCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_DEALERS = [
  { id: 'd1', name: 'Ravi Metals', specialization: 'Aluminum & Steel', location: 'Hyderabad', rating: 4.6, lastMsg: 'I have 5 tons of grade A aluminum ready.' },
  { id: 'd2', name: 'GreenLoop Plastics', specialization: 'PET & HDPE', location: 'Bengaluru', rating: 4.4, lastMsg: 'Are you looking for bulk PET shipments?' },
  { id: 'd3', name: 'EcoGlass Vizag', specialization: 'Glass', location: 'Vizag', rating: 4.5, lastMsg: 'Confirmed the delivery schedule.' },
  { id: 'd4', name: 'Delhi Scraps', specialization: 'Paper & Cardboard', location: 'Delhi', rating: 4.7, lastMsg: 'Price updated for the next cycle.' }
];

const Inbox: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');

  const generateAutoReply = (userMsg: string) => {
    const lower = userMsg.toLowerCase();
    const dealerName = selectedChat?.name || 'Partner';
    
    if (lower.includes('hi') || lower.includes('hello')) {
      return `Hi, I'm ${dealerName}. How can I assist with your recycling requirements today?`;
    }
    
    const keywords = ['paper', 'plastic', 'metal', 'glass', 'grade', 'tons', 'kg', 'aluminum', 'steel'];
    const hasKeyword = keywords.some(k => lower.includes(k));
    
    if (hasKeyword) {
      return `Thank you for sharing the specifications. We've updated our notes. We will proceed with the logistics once the trade is finalized in the exchange.`;
    }

    return "Received. A representative from our facility will get back to you shortly.";
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const userMsg = {
      id: Date.now().toString(),
      sender: 'me',
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    setTimeout(() => {
      const replyText = generateAutoReply(inputValue);
      const replyMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'dealer',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, replyMsg]);
    }, 1200);
  };

  return (
    <div className="h-[calc(100vh-160px)] flex bg-white rounded-[2.5rem] md:rounded-[4rem] border border-emerald-50 shadow-2xl overflow-hidden">
      <div className={`w-full md:w-96 border-r border-emerald-50 flex flex-col bg-slate-50/10 ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6 md:p-10 border-b border-emerald-50">
          <h2 className="text-xl md:text-2xl font-bold text-emerald-950">Partner Support</h2>
          <div className="relative mt-4 md:mt-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
            <input type="text" placeholder="Search partners..." className="w-full pl-11 pr-4 py-3 md:py-4 bg-white border border-emerald-100 rounded-2xl text-xs outline-none shadow-sm focus:ring-4 focus:ring-emerald-500/10" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hide p-4 md:p-6 space-y-4">
          {MOCK_DEALERS.map(d => (
            <motion.div 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              key={d.id} 
              onClick={() => { setSelectedChat(d); setMessages([]); }}
              className={`p-4 md:p-6 rounded-[2rem] md:rounded-[2.5rem] cursor-pointer transition-all border ${selectedChat?.id === d.id ? 'bg-white border-emerald-200 shadow-xl shadow-emerald-100/50' : 'bg-white/5 border-transparent hover:border-emerald-100'}`}
            >
              <div className="flex items-center gap-4 md:gap-5">
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xl md:text-2xl border border-emerald-100">
                  {d.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-xs md:text-sm font-bold text-slate-900 truncate">{d.name}</h4>
                    <div className="flex items-center gap-1 text-[8px] md:text-[9px] font-black text-amber-500"><Star size={10} className="fill-amber-500" /> {d.rating}</div>
                  </div>
                  <p className="text-[9px] md:text-[10px] text-slate-400 truncate font-medium">{d.lastMsg}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className={`flex-1 flex flex-col ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
        {selectedChat ? (
          <>
            <div className="p-4 md:p-8 border-b border-emerald-50 flex items-center justify-between bg-white shadow-sm relative z-10">
              <div className="flex items-center gap-3 md:gap-5">
                <button onClick={() => setSelectedChat(null)} className="md:hidden p-2.5 bg-slate-50 rounded-xl text-slate-400"><ArrowLeft size={18} /></button>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg md:text-xl shadow-lg shadow-emerald-100">{selectedChat.name[0]}</div>
                <div>
                  <h3 className="text-sm md:text-lg font-bold text-slate-900">{selectedChat.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[8px] md:text-[10px] text-emerald-600 font-black uppercase tracking-widest">Online Now</p>
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-emerald-50 px-6 py-3 rounded-full border border-emerald-100">
                <MapPin size={12} className="text-emerald-500" /> {selectedChat.location}
              </div>
            </div>
            
            <div className="flex-1 p-6 md:p-10 overflow-y-auto space-y-6 md:space-y-8 bg-slate-50/30 scrollbar-hide">
              <div className="flex justify-center mb-4 md:mb-8">
                <span className="bg-white px-6 py-2 rounded-full border border-slate-100 text-[8px] md:text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Secure Channel</span>
              </div>
              {messages.map((m) => (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={m.id} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] md:max-w-[75%] p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] text-xs md:text-sm shadow-sm ${m.sender === 'me' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white text-slate-900 rounded-tl-none border border-emerald-50'}`}>
                    {m.text}
                    <div className={`flex items-center gap-2 mt-2 md:mt-3 text-[7px] md:text-[8px] font-black uppercase tracking-widest opacity-50`}>
                      {m.timestamp} {m.sender === 'me' && <CheckCheck size={10} />}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-4 md:p-8 bg-white border-t border-emerald-50 flex gap-3 md:gap-5 items-center">
               <button className="p-3 md:p-4 text-slate-300 hover:text-emerald-600 transition-colors">
                 {/* Fixed: removed invalid md:size prop which is not supported by Lucide icons */}
                 <Paperclip size={20} />
               </button>
               <input 
                type="text" 
                placeholder="Type your message..." 
                className="flex-1 bg-slate-50 border border-transparent focus:border-emerald-200 rounded-[1.5rem] md:rounded-[2rem] px-5 md:px-8 py-4 md:py-5 outline-none text-xs md:text-sm transition-all shadow-inner"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
               />
               <button onClick={handleSendMessage} className="p-4 md:p-5 bg-emerald-600 text-white rounded-xl md:rounded-2xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 active:scale-95 transition-all flex-shrink-0">
                 {/* Fixed: removed invalid md:size prop which is not supported by Lucide icons */}
                 <Send size={20} />
               </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-10 md:p-20 text-center space-y-6 md:space-y-10">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-emerald-50 rounded-[2.5rem] md:rounded-[3.5rem] flex items-center justify-center text-emerald-100 shadow-inner">
              {/* Fixed: removed invalid md:size prop which is not supported by Lucide icons */}
              <MessageSquare size={48} />
            </div>
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-xl md:text-3xl font-display font-bold text-emerald-950 leading-tight">Partner Communication</h3>
              <p className="text-[11px] md:text-sm text-slate-400 max-w-xs md:max-w-sm mx-auto font-medium">Select a verified partner to discuss specifications and logistical arrangements.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;
