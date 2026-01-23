import React from 'react';
import { 
  CheckCircle2, 
  Download, 
  Activity as ActivityIcon,
  Recycle,
  Layers,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar
} from 'lucide-react';
import { Transaction } from '../types';

interface HistoryViewProps {
  transactions: Transaction[];
}

const HistoryView: React.FC<HistoryViewProps> = ({ transactions }) => {
  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-emerald-950">Trading Log</h1>
          <p className="text-slate-400 font-medium">Historical audit of all your circular marketplace activities.</p>
        </div>
        <button className="flex items-center gap-2 px-8 py-4 bg-white border border-emerald-100 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-sm">
          <Download size={16} /> Export Statement
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Total Volume', value: `${transactions.reduce((acc, t) => acc + t.quantity, 0)} kg`, icon: Recycle, color: 'emerald' },
          { label: 'Settled Value', value: `₹${transactions.reduce((acc, t) => acc + t.price, 0).toLocaleString()}`, icon: CheckCircle2, color: 'blue' },
          { label: 'Network Activity', value: `${transactions.length} Deals`, icon: ActivityIcon, color: 'amber' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-10 rounded-[3rem] border border-emerald-50 shadow-sm relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/5 rounded-full -translate-y-8 translate-x-8 blur-2xl group-hover:scale-110 transition-transform`} />
            <span className="text-slate-300 text-[10px] font-black uppercase tracking-widest block mb-4">{stat.label}</span>
            <div className={`text-4xl font-display font-bold text-slate-900`}>{stat.value}</div>
            <p className={`text-[10px] text-${stat.color}-600 font-bold mt-4 flex items-center gap-2`}>
              <stat.icon size={16} /> Real-time Verified
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[4rem] border border-emerald-50 shadow-xl overflow-hidden min-h-[500px]">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[500px] p-20 text-center space-y-8">
            <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200"><Layers size={40} /></div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-emerald-950">No Activity Yet</h3>
              <p className="text-slate-400 max-w-xs font-medium">Your historical records will appear here as soon as you execute your first swap or listing.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-emerald-50">
                  <th className="px-12 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Activity Type</th>
                  <th className="px-12 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Material Specification</th>
                  <th className="px-12 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Volume (Tons)</th>
                  <th className="px-12 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Quality Grade</th>
                  <th className="px-12 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Settlement Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50/50">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-emerald-50/20 transition-colors">
                    <td className="px-12 py-8">
                      <div className={`flex items-center gap-3 text-[11px] font-black uppercase tracking-widest ${t.type === 'Buy' ? 'text-blue-600' : 'text-emerald-600'}`}>
                        <div className={`p-2 rounded-xl ${t.type === 'Buy' ? 'bg-blue-50' : 'bg-emerald-50'}`}>
                          {t.type === 'Buy' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                        </div>
                        {t.type}
                      </div>
                    </td>
                    <td className="px-12 py-8">
                      <p className="text-sm font-bold text-slate-900">{t.materialName}</p>
                      <p className="text-[10px] text-slate-300 flex items-center gap-1 mt-1"><Calendar size={10} /> {t.timestamp}</p>
                    </td>
                    <td className="px-12 py-8 text-sm text-slate-500 font-bold">{t.quantity} <span className="text-[10px] opacity-40 uppercase">Tons</span></td>
                    <td className="px-12 py-8">
                      <span className="text-[9px] font-black text-slate-400 border border-slate-200 px-4 py-1.5 rounded-full uppercase tracking-widest">{t.grade}</span>
                    </td>
                    <td className="px-12 py-8 text-right">
                      <p className={`text-lg font-bold ${t.type === 'Buy' ? 'text-slate-900' : 'text-emerald-600'}`}>
                        {t.type === 'Buy' ? '-' : '+'} ₹{t.price.toLocaleString()}
                      </p>
                      <p className="text-[9px] text-slate-300 uppercase tracking-widest font-bold">Cleared</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryView;