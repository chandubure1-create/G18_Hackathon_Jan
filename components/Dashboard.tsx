import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Scale,
  ChevronRight,
  Box,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MOCK_LISTINGS } from "../mockData";
import { MaterialType, Listing } from "../types";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("All");
  const [filterRole, setFilterRole] = useState<"All" | "Buy" | "Sell">("All");

  const enrichedListings = useMemo(() => {
    const list: Listing[] = [...MOCK_LISTINGS];
    const newMaterials = [
      { type: MaterialType.PLASTIC_LDPE, qty: 8, price: 520, loc: "Dallas, TX" },
      { type: MaterialType.METAL_STEEL, qty: 50, price: 380, loc: "Pittsburgh, PA" },
      { type: MaterialType.METAL_IRON, qty: 100, price: 180, loc: "Cleveland, OH" },
      { type: MaterialType.TEXTILES, qty: 15, price: 300, loc: "Coimbatore, IN" },
      { type: MaterialType.ELECTRONICS, qty: 2.5, price: 2100, loc: "San Jose, CA" },
    ];

    newMaterials.forEach((m, i) => {
      list.push({
        id: `gen-${i}`,
        sellerId: `s-gen-${i}`,
        sellerName: "Global Recycler",
        materialType: m.type,
        quantity: m.qty,
        unit: "tons",
        grade: "Grade A (Clean)" as any,
        location: m.loc,
        pricePerUnit: m.price,
        description: `Industrial quantity of ${m.type} available for trade.`,
        imageUrl: `https://picsum.photos/seed/${m.type.replace(/\s/g, "")}/600/400`,
        createdAt: new Date().toISOString(),
        isVerified: true,
        tradeType: i % 2 === 0 ? "Sell" : "Buy",
      });
    });

    return list.map((l, i) => ({
      ...l,
      tradeType: l.tradeType || (i % 2 === 0 ? "Sell" : "Buy"),
    }));
  }, []);

  const filteredListings = enrichedListings.filter((l) => {
    const matchesSearch =
      l.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.materialType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || l.materialType === filterType;
    const matchesRole = filterRole === "All" || l.tradeType === filterRole;
    return matchesSearch && matchesType && matchesRole;
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-10 pb-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display tracking-tight text-emerald-950">
            Overview
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-medium">
            Verified circular stock signals.
          </p>
        </div>

        <div className="flex gap-3 bg-white/60 p-1 rounded-full border border-white">
          {(["All", "Buy", "Sell"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setFilterRole(r)}
              className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                filterRole === r
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "text-slate-400"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
          <input
            type="text"
            placeholder="Search material, location or specs..."
            className="w-full pl-14 pr-8 py-5 bg-white/60 rounded-3xl border border-white focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all text-sm shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-white/60 rounded-3xl px-6 py-5 border border-white shadow-sm text-[10px] uppercase tracking-widest font-bold outline-none appearance-none cursor-pointer"
        >
          <option value="All">All Materials</option>
          {Object.values(MaterialType).map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <AnimatePresence>
          {filteredListings.map((listing) => (
            <motion.div
              layout
              key={listing.id}
              variants={item}
              onClick={() => navigate("/marketplace")}
              className="bg-white p-8 rounded-[2.5rem] border border-white shadow-sm hover:shadow-2xl transition-all group relative cursor-pointer active:scale-[0.99]"
            >
              <div className="flex gap-6 items-start">
                <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100">
                  <img
                    src={listing.imageUrl}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                        listing.tradeType === "Sell"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {listing.tradeType}
                    </span>
                    {listing.isVerified && (
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    )}
                  </div>

                  <h4 className="text-xl font-display text-slate-900 group-hover:text-emerald-600 transition-colors">
                    {listing.materialType}
                  </h4>

                  <div className="flex gap-3 mt-3 text-slate-400">
                    <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest">
                      <Scale size={12} /> {listing.quantity} {listing.unit}
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest">
                      <MapPin size={12} /> {listing.location}
                    </div>
                  </div>

                  <div className="mt-2 text-[8px] font-black uppercase tracking-widest text-slate-300">
                    {listing.grade}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-1">
                    Approx. Value
                  </p>
                  <p className="text-xl font-display font-medium text-slate-900">
                    ₹{listing.pricePerUnit.toLocaleString()}
                    <span className="text-[10px] text-slate-300 ml-1">/MT</span>
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/marketplace");
                  }}
                  className="bg-slate-900 text-white p-3 rounded-xl group-hover:bg-emerald-600 transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredListings.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full py-20 text-center"
          >
            <Box className="text-slate-200 w-16 h-16 mx-auto mb-4" />
            <p className="text-slate-400 italic text-sm">
              No operational signals match your parameters.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
