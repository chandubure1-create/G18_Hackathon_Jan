
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Phone, Loader2, MapPin, Sparkles, Home, AlertCircle, Briefcase, ChevronDown, Search, Check, X } from 'lucide-react';
import { supabase } from '../services/supabase';

const ALL_COUNTRIES = [
  { name: 'Afghanistan', code: '+93', flag: '🇦🇫' }, { name: 'Albania', code: '+355', flag: '🇦🇱' },
  { name: 'Algeria', code: '+213', flag: '🇩🇿' }, { name: 'American Samoa', code: '+1-684', flag: '🇦🇸' },
  { name: 'Andorra', code: '+376', flag: '🇦🇩' }, { name: 'Angola', code: '+244', flag: '🇦🇴' },
  { name: 'Anguilla', code: '+1-264', flag: '🇦🇮' }, { name: 'Antarctica', code: '+672', flag: '🇦🇶' },
  { name: 'Antigua and Barbuda', code: '+1-268', flag: '🇦🇬' }, { name: 'Argentina', code: '+54', flag: '🇦🇷' },
  { name: 'Armenia', code: '+374', flag: '🇦🇲' }, { name: 'Aruba', code: '+297', flag: '🇦🇼' },
  { name: 'Australia', code: '+61', flag: '🇦🇺' }, { name: 'Austria', code: '+43', flag: '🇦🇹' },
  { name: 'Azerbaijan', code: '+994', flag: '🇦🇿' }, { name: 'Bahamas', code: '+1-242', flag: '🇧🇸' },
  { name: 'Bahrain', code: '+973', flag: '🇧🇭' }, { name: 'Bangladesh', code: '+880', flag: '🇧🇩' },
  { name: 'Barbados', code: '+1-246', flag: '🇧🇧' }, { name: 'Belarus', code: '+375', flag: '🇧🇾' },
  { name: 'Belgium', code: '+32', flag: '🇧🇪' }, { name: 'Belize', code: '+501', flag: '🇧🇿' },
  { name: 'Benin', code: '+229', flag: '🇧🇯' }, { name: 'Bermuda', code: '+1-441', flag: '🇧🇲' },
  { name: 'Bhutan', code: '+975', flag: '🇧🇹' }, { name: 'Bolivia', code: '+591', flag: '🇧🇴' },
  { name: 'Bosnia and Herzegovina', code: '+387', flag: '🇧🇦' }, { name: 'Botswana', code: '+267', flag: '🇧🇼' },
  { name: 'Brazil', code: '+55', flag: '🇧🇷' }, { name: 'British Virgin Islands', code: '+1-284', flag: '🇻🇬' },
  { name: 'Brunei', code: '+673', flag: '🇧🇳' }, { name: 'Bulgaria', code: '+359', flag: '🇧🇬' },
  { name: 'Burkina Faso', code: '+226', flag: '🇧🇫' }, { name: 'Burundi', code: '+257', flag: '🇧🇮' },
  { name: 'Cambodia', code: '+855', flag: '🇰🇭' }, { name: 'Cameroon', code: '+237', flag: '🇨🇲' },
  { name: 'Canada', code: '+1', flag: '🇨🇦' }, { name: 'Cape Verde', code: '+238', flag: '🇨🇻' },
  { name: 'Cayman Islands', code: '+1-345', flag: '🇰🇾' }, { name: 'Central African Republic', code: '+236', flag: '🇨🇫' },
  { name: 'Chad', code: '+235', flag: '🇹🇩' }, { name: 'Chile', code: '+56', flag: '🇨🇱' },
  { name: 'China', code: '+86', flag: '🇨🇳' }, { name: 'Christmas Island', code: '+61', flag: '🇨🇽' },
  { name: 'Cocos Islands', code: '+61', flag: '🇨🇨' }, { name: 'Colombia', code: '+57', flag: '🇨🇴' },
  { name: 'Comoros', code: '+269', flag: '🇰🇲' }, { name: 'Congo', code: '+242', flag: '🇨🇬' },
  { name: 'Cook Islands', code: '+682', flag: '🇨🇰' }, { name: 'Costa Rica', code: '+506', flag: '🇨🇷' },
  { name: 'Croatia', code: '+385', flag: '🇭🇷' }, { name: 'Cuba', code: '+53', flag: '🇨🇺' },
  { name: 'Curacao', code: '+599', flag: '🇨🇼' }, { name: 'Cyprus', code: '+357', flag: '🇨🇾' },
  { name: 'Czech Republic', code: '+420', flag: '🇨🇿' }, { name: 'Denmark', code: '+45', flag: '🇩🇰' },
  { name: 'Djibouti', code: '+253', flag: '🇩🇯' }, { name: 'Dominica', code: '+1-767', flag: '🇩🇲' },
  { name: 'Dominican Republic', code: '+1-809', flag: '🇩🇴' }, { name: 'Ecuador', code: '+593', flag: '🇪🇨' },
  { name: 'Egypt', code: '+20', flag: '🇪🇬' }, { name: 'El Salvador', code: '+503', flag: '🇸🇻' },
  { name: 'Equatorial Guinea', code: '+240', flag: '🇬🇶' }, { name: 'Eritrea', code: '+291', flag: '🇪🇷' },
  { name: 'Estonia', code: '+372', flag: '🇪🇪' }, { name: 'Ethiopia', code: '+251', flag: '🇪🇹' },
  { name: 'Fiji', code: '+679', flag: '🇫🇯' }, { name: 'Finland', code: '+358', flag: '🇫🇮' },
  { name: 'France', code: '+33', flag: '🇫🇷' }, { name: 'Gabon', code: '+241', flag: '🇬🇦' },
  { name: 'Gambia', code: '+220', flag: '🇬🇲' }, { name: 'Georgia', code: '+995', flag: '🇬🇪' },
  { name: 'Germany', code: '+49', flag: '🇩🇪' }, { name: 'Ghana', code: '+233', flag: '🇬🇭' },
  { name: 'Greece', code: '+30', flag: '🇬🇷' }, { name: 'Greenland', code: '+299', flag: '🇬🇱' },
  { name: 'Grenada', code: '+1-473', flag: '🇬🇩' }, { name: 'Guatemala', code: '+502', flag: '🇬🇹' },
  { name: 'Guinea', code: '+224', flag: '🇬🇳' }, { name: 'Guinea-Bissau', code: '+245', flag: '🇬🇼' },
  { name: 'Guyana', code: '+592', flag: '🇬🇾' }, { name: 'Haiti', code: '+509', flag: '🇭🇹' },
  { name: 'Honduras', code: '+504', flag: '🇭🇳' }, { name: 'Hong Kong', code: '+852', flag: '🇭🇰' },
  { name: 'Hungary', code: '+36', flag: '🇭🇺' }, { name: 'Iceland', code: '+354', flag: '🇮🇸' },
  { name: 'India', code: '+91', flag: '🇮🇳' }, { name: 'Indonesia', code: '+62', flag: '🇮🇩' },
  { name: 'Iran', code: '+98', flag: '🇮🇷' }, { name: 'Iraq', code: '+964', flag: '🇮🇶' },
  { name: 'Ireland', code: '+353', flag: '🇮🇪' }, { name: 'Israel', code: '+972', flag: '🇮🇱' },
  { name: 'Italy', code: '+39', flag: '🇮🇹' }, { name: 'Jamaica', code: '+1-876', flag: '🇯🇲' },
  { name: 'Japan', code: '+81', flag: '🇯🇵' }, { name: 'Jordan', code: '+962', flag: '🇯🇴' },
  { name: 'Kazakhstan', code: '+7', flag: '🇰🇿' }, { name: 'Kenya', code: '+254', flag: '🇰🇪' },
  { name: 'Kuwait', code: '+965', flag: '🇰🇼' }, { name: 'Kyrgyzstan', code: '+996', flag: '🇰🇬' },
  { name: 'Laos', code: '+856', flag: '🇱🇦' }, { name: 'Latvia', code: '+371', flag: '🇱🇻' },
  { name: 'Lebanon', code: '+961', flag: '🇱🇧' }, { name: 'Lesotho', code: '+266', flag: '🇱🇸' },
  { name: 'Liberia', code: '+231', flag: '🇱🇷' }, { name: 'Libya', code: '+218', flag: '🇱🇾' },
  { name: 'Liechtenstein', code: '+423', flag: '🇱🇮' }, { name: 'Lithuania', code: '+370', flag: '🇱🇹' },
  { name: 'Luxembourg', code: '+352', flag: '🇱🇺' }, { name: 'Macao', code: '+853', flag: '🇲🇴' },
  { name: 'Macedonia', code: '+389', flag: '🇲🇰' }, { name: 'Madagascar', code: '+261', flag: '🇲🇬' },
  { name: 'Malawi', code: '+265', flag: '🇲🇼' }, { name: 'Malaysia', code: '+60', flag: '🇲🇾' },
  { name: 'Maldives', code: '+960', flag: '🇲🇻' }, { name: 'Mali', code: '+223', flag: '🇲🇱' },
  { name: 'Malta', code: '+356', flag: '🇲🇹' }, { name: 'Mauritania', code: '+222', flag: '🇲🇷' },
  { name: 'Mauritius', code: '+230', flag: '🇲🇺' }, { name: 'Mexico', code: '+52', flag: '🇲🇽' },
  { name: 'Moldova', code: '+373', flag: '🇲🇩' }, { name: 'Monaco', code: '+377', flag: '🇲🇨' },
  { name: 'Mongolia', code: '+976', flag: '🇲🇳' }, { name: 'Montenegro', code: '+382', flag: '🇲🇪' },
  { name: 'Morocco', code: '+212', flag: '🇲🇦' }, { name: 'Mozambique', code: '+258', flag: '🇲🇿' },
  { name: 'Namibia', code: '+264', flag: '🇳🇦' }, { name: 'Nepal', code: '+977', flag: '🇳🇵' },
  { name: 'Netherlands', code: '+31', flag: '🇳🇱' }, { name: 'New Zealand', code: '+64', flag: '🇳🇿' },
  { name: 'Nicaragua', code: '+505', flag: '🇳🇮' }, { name: 'Niger', code: '+227', flag: '🇳🇪' },
  { name: 'Nigeria', code: '+234', flag: '🇳🇬' }, { name: 'Norway', code: '+47', flag: '🇳🇴' },
  { name: 'Oman', code: '+968', flag: '🇴🇲' }, { name: 'Pakistan', code: '+92', flag: '🇵🇰' },
  { name: 'Palestine', code: '+970', flag: '🇵🇸' }, { name: 'Panama', code: '+507', flag: '🇵🇦' },
  { name: 'Paraguay', code: '+595', flag: '🇵🇾' }, { name: 'Peru', code: '+51', flag: '🇵🇪' },
  { name: 'Philippines', code: '+63', flag: '🇵🇭' }, { name: 'Poland', code: '+48', flag: '🇵🇱' },
  { name: 'Portugal', code: '+351', flag: '🇵🇹' }, { name: 'Qatar', code: '+974', flag: '🇶🇦' },
  { name: 'Romania', code: '+40', flag: '🇷🇴' }, { name: 'Russia', code: '+7', flag: '🇷🇺' },
  { name: 'Rwanda', code: '+250', flag: '🇷🇼' }, { name: 'Samoa', code: '+685', flag: '🇼🇸' },
  { name: 'Saudi Arabia', code: '+966', flag: '🇸🇦' }, { name: 'Senegal', code: '+221', flag: '🇸🇳' },
  { name: 'Serbia', code: '+381', flag: '🇷🇸' }, { name: 'Seychelles', code: '+248', flag: '🇸🇨' },
  { name: 'Sierra Leone', code: '+232', flag: '🇸🇱' }, { name: 'Singapore', code: '+65', flag: '🇸🇬' },
  { name: 'Slovakia', code: '+421', flag: '🇸🇰' }, { name: 'Slovenia', code: '+386', flag: '🇸🇮' },
  { name: 'Somalia', code: '+252', flag: '🇸🇴' }, { name: 'South Africa', code: '+27', flag: '🇿🇦' },
  { name: 'South Korea', code: '+82', flag: '🇰🇷' }, { name: 'Spain', code: '+34', flag: '🇪🇸' },
  { name: 'Sri Lanka', code: '+94', flag: '🇱🇰' }, { name: 'Sudan', code: '+249', flag: '🇸🇩' },
  { name: 'Sweden', code: '+46', flag: '🇸🇪' }, { name: 'Switzerland', code: '+41', flag: '🇨🇭' },
  { name: 'Taiwan', code: '+886', flag: '🇹🇼' }, { name: 'Thailand', code: '+66', flag: '🇹🇭' },
  { name: 'Turkey', code: '+90', flag: '🇹🇷' }, { name: 'Uganda', code: '+256', flag: '🇺🇬' },
  { name: 'Ukraine', code: '+380', flag: '🇺🇦' }, { name: 'United Arab Emirates', code: '+971', flag: '🇦🇪' },
  { name: 'United Kingdom', code: '+44', flag: '🇬🇧' }, { name: 'United States', code: '+1', flag: '🇺🇸' },
  { name: 'Uruguay', code: '+598', flag: '🇺🇾' }, { name: 'Uzbekistan', code: '+998', flag: '🇺🇿' },
  { name: 'Venezuela', code: '+58', flag: '🇻🇪' }, { name: 'Vietnam', code: '+84', flag: '🇻🇳' },
  { name: 'Zambia', code: '+260', flag: '🇿🇲' }, { name: 'Zimbabwe', code: '+263', flag: '🇿🇼' }
].sort((a, b) => a.name.localeCompare(b.name));

interface OnboardingProps {
  onComplete: () => void;
  role?: 'buyer' | 'seller';
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, role = 'seller' }) => {
  const [step, setStep] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [country, setCountry] = useState(ALL_COUNTRIES.find(c => c.name === 'India') || ALL_COUNTRIES[0]);
  const [data, setData] = useState({ name: '', phone: '', address: '', pincode: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const filteredCountries = useMemo(() => 
    ALL_COUNTRIES.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())), 
    [searchQuery]
  );

  const steps = [
    { id: 'name', title: 'Business Entity', desc: 'Registered Trading Name', icon: Briefcase },
    { id: 'phone', title: 'Secure Contact', desc: 'Trade Verification Number', icon: Phone },
    { id: 'address', title: 'Facility Address', desc: 'Material Processing Hub', icon: Home },
    { id: 'pincode', title: 'Regional Node', desc: 'Logistics Clearing Code', icon: MapPin },
    { id: 'final', title: 'Verify Data', desc: 'Confirm Circular Profile', icon: Sparkles }
  ];

  const handleNext = async () => {
    setErrorMsg(null);
    if (step === 0 && !data.name.trim()) { setErrorMsg("Entity name required"); return; }
    if (step === 1 && data.phone.length < 10) { setErrorMsg("10 digits required"); return; }
    if (step === 2 && !data.address.trim()) { setErrorMsg("Address required"); return; }
    if (step === 3 && data.pincode.length < 6) { setErrorMsg("6 digits required"); return; }

    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) throw new Error("Session invalid");
        await supabase.from('profiles').upsert({
          id: session.user.id,
          name: data.name.trim(),
          phone: `${country.code}${data.phone}`,
          address: data.address.trim(),
          pincode: data.pincode,
          country: country.name,
          role: role,
          wallet_balance: 0,
          updated_at: new Date().toISOString()
        });
        onComplete();
      } catch (err: any) {
        setErrorMsg(err.message || "Onboarding failed");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const current = steps[step];

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-950 p-4 md:p-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#064e3b_0%,_#022c22_100%)] opacity-50" />
      <div className="max-w-xl w-full relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="glass-dark p-6 md:p-14 rounded-[2.5rem] md:rounded-[3rem] text-center shadow-2xl border border-white/5"
          >
            <div className="bg-emerald-600/20 text-emerald-400 px-4 py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] mb-6 inline-block">
              Stage {step + 1}
            </div>

            <motion.div layout className="w-14 h-14 md:w-16 md:h-16 bg-white/5 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto mb-6">
              <current.icon size={24} />
            </motion.div>

            <h2 className="text-xl md:text-3xl font-display mb-2 text-white font-black">{current.title}</h2>
            <p className="text-emerald-500/50 text-[9px] md:text-[10px] uppercase tracking-widest mb-8">{current.desc}</p>

            <div className="space-y-6">
              {step === 0 && (
                <input autoFocus placeholder="EX: GREEN CYCLE" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 md:p-5 text-center text-base md:text-lg font-bold uppercase tracking-widest outline-none focus:border-emerald-500 transition-all text-white" value={data.name} onChange={(e) => setData({...data, name: e.target.value})} />
              )}

              {step === 1 && (
                <div className="space-y-4 text-left">
                  <div className="relative">
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 md:p-5 text-white flex justify-between items-center hover:bg-white/10 transition-all text-sm">
                      <span className="font-bold flex items-center gap-2">
                        <span className="text-lg">{country.flag}</span>
                        {country.name} ({country.code})
                      </span>
                      <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute z-50 mt-2 w-full bg-[#051a14] border border-white/10 rounded-2xl shadow-2xl max-h-56 overflow-hidden flex flex-col">
                           <div className="p-3 border-b border-white/5 bg-white/10 flex items-center gap-3">
                              <Search size={14} className="text-emerald-500" />
                              <input autoFocus placeholder="Search..." className="bg-transparent text-white text-xs outline-none flex-1 font-bold" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            </div>
                            <div className="overflow-y-auto scrollbar-hide flex-1">
                              {filteredCountries.map(c => (
                                <button key={c.name} onClick={() => { setCountry(c); setIsDropdownOpen(false); setSearchQuery(''); }} className="w-full p-4 text-left hover:bg-emerald-600/30 text-xs text-white flex items-center gap-3">
                                  <span>{c.flag}</span>
                                  <span className="flex-1 font-bold">{c.name}</span>
                                  <span className="text-emerald-500 font-bold">{c.code}</span>
                                </button>
                              ))}
                            </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <input 
                    type="tel" 
                    inputMode="tel"
                    placeholder="10-DIGIT MOBILE" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 md:p-5 text-lg font-bold tracking-[0.2em] outline-none focus:border-emerald-500 text-white text-center" 
                    value={data.phone} 
                    onChange={(e) => setData({...data, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})} 
                  />
                </div>
              )}

              {step === 2 && (
                <textarea autoFocus placeholder="FULL FACILITY ADDRESS" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 md:p-5 text-xs md:text-sm font-bold uppercase tracking-widest outline-none focus:border-emerald-500 min-h-[100px] text-white" value={data.address} onChange={(e) => setData({...data, address: e.target.value})} />
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <input 
                    autoFocus 
                    type="tel"
                    inputMode="numeric"
                    placeholder="6-DIGIT PIN" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 md:p-5 text-center text-2xl md:text-3xl font-black tracking-[0.5em] outline-none focus:border-emerald-500 text-white" 
                    value={data.pincode} 
                    onChange={(e) => setData({...data, pincode: e.target.value.replace(/\D/g, '').slice(0, 6)})} 
                  />
                </div>
              )}

              {step === 4 && (
                <div className="bg-white/5 p-4 md:p-6 rounded-2xl border border-white/10 text-left space-y-3">
                  <div className="flex justify-between border-b border-white/5 pb-2 text-[10px] md:text-xs">
                    <span className="text-emerald-500/50 uppercase font-black">Entity</span>
                    <span className="text-white font-bold">{data.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2 text-[10px] md:text-xs">
                    <span className="text-emerald-500/50 uppercase font-black">Contact</span>
                    <span className="text-white font-bold">{country.code} {data.phone}</span>
                  </div>
                  <div className="flex justify-between text-[10px] md:text-xs">
                    <span className="text-emerald-500/50 uppercase font-black">Region</span>
                    <span className="text-white font-bold">{data.pincode}, {country.name}</span>
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="text-rose-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                  <AlertCircle size={14} /> {errorMsg}
                </div>
              )}

              <div className="flex gap-3">
                {step > 0 && (
                  <button onClick={() => setStep(step - 1)} className="p-4 md:p-5 bg-white/5 text-white rounded-2xl hover:bg-white/10 transition-all">
                    <X className="rotate-45" size={20} />
                  </button>
                )}
                <button onClick={handleNext} disabled={isLoading} className="flex-1 bg-emerald-500 text-emerald-950 rounded-full py-4 md:py-6 text-[11px] md:text-sm font-black uppercase tracking-[0.3em] flex justify-center items-center gap-2 md:gap-4 hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-950/20">
                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : <>{step === steps.length - 1 ? 'Finish Setup' : 'Continue'} <ArrowRight size={18} /></>}
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
