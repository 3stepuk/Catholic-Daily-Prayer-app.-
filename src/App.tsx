import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  Sunset, 
  Sun, 
  Moon, 
  History, 
  Clock, 
  Sparkles, 
  Heart, 
  ExternalLink,
  ChevronRight,
  Info,
  Feather,
  Check
} from "lucide-react";

import { PrayerMoment, JournalEntry, ChatMessage } from "./types";
import MorningOffering from "./components/MorningOffering";
import MiddayAngelus from "./components/MiddayAngelus";
import EveningExamen from "./components/EveningExamen";
import NightPrayer from "./components/NightPrayer";
import OfficeBreviary from "./components/OfficeBreviary";

export default function App() {
  // Application UI Toggles
  const [activeMoment, setActiveMoment] = useState<PrayerMoment | null>(null);
  const [leftPanelTab, setLeftPanelTab] = useState<"breviary" | "devotions">("breviary");
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  
  // Local storage lists
  const [journal, setJournal] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem("catholic_prayer_journal");
    return saved ? JSON.parse(saved) : [];
  });

  // Spontaneous journal input form states
  const [spontaneousText, setSpontaneousText] = useState("");
  const [journalCategory, setJournalCategory] = useState<"Quiet Contemplation" | "Spontaneous Prayer" | "Morning Intention" | "Evening Examen">("Spontaneous Prayer");
  const [showSuccess, setShowSuccess] = useState(false);

  // Maintain local clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Save journal logs to localStorage
  const saveJournalToStateAndStorage = (updated: JournalEntry[]) => {
    setJournal(updated);
    localStorage.setItem("catholic_prayer_journal", JSON.stringify(updated));
  };

  // Determine current recommended prayer hour based on local time
  const getRecommendedHour = (): { key: PrayerMoment; title: string; desc: string; icon: any } => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 10) {
      return { 
        key: "morning", 
        title: "Morning Offering", 
        desc: "Sanctify your day. Offer all your works, prayers, and sorrows in union with the Holy Mass.", 
        icon: Sun 
      };
    } else if (hour >= 10 && hour < 15) {
      return { 
        key: "midday", 
        title: "Midday Angelus / Regina Caeli", 
        desc: "Pause at noon. Meditate on the mystery of God breaking into human history.", 
        icon: Clock 
      };
    } else if (hour >= 15 && hour < 20) {
      return { 
        key: "evening", 
        title: "Evening Examen", 
        desc: "Review your hours. Re-trace your steps under God's gentle, merciful gaze.", 
        icon: Sunset 
      };
    } else {
      return { 
        key: "night", 
        title: "Night Prayer (Compline)", 
        desc: "Seek quiet mercy. Entrust your soul and your rest into the hands of the Father.", 
        icon: Moon 
      };
    }
  };

  const recommendation = getRecommendedHour();

  // Commit guided prayer logs directly to history
  const handleSaveJournalLog = (entry: Omit<JournalEntry, "id" | "timestamp">) => {
    const newEntry: JournalEntry = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleString(),
      ...entry
    };
    saveJournalToStateAndStorage([newEntry, ...journal]);
  };

  // Log spontaneous reflections
  const handleSaveSpontaneous = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spontaneousText.trim()) return;

    const newEntry: JournalEntry = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleString(),
      category: journalCategory,
      text: spontaneousText.trim()
    };

    saveJournalToStateAndStorage([newEntry, ...journal]);
    setSpontaneousText("");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleClearJournal = () => {
    if (window.confirm("Do you wish to clear your spiritual journal history? This cannot be undone.")) {
      saveJournalToStateAndStorage([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0b09] text-[#e5e0d5] border-t-[6px] border-amber-600/70 flex flex-col transition-colors selection:bg-amber-900/40 selection:text-amber-200">
      
      {/* Sanctified Header */}
      <header className="border-b border-stone-850 bg-[#0e0d0b]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-none w-full px-4 md:px-8 xl:px-12 py-4 md:py-5 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Logo & Display Title */}
          <div className="text-center md:text-left">
            <h1 className="font-display text-xl md:text-2xl font-bold tracking-wider text-amber-100 flex items-center justify-center md:justify-start gap-2">
              <span className="text-amber-500">†</span> CATHOLIC Daily Prayer
              <span className="text-[9px] tracking-widest font-sans font-bold bg-amber-950/50 text-amber-400 border border-amber-900/60 px-1.5 py-0.5 rounded uppercase">UK Edition</span>
            </h1>
            <p className="text-xs font-sans tracking-wide text-stone-400 mt-1 uppercase italic">
              "The Divine Office according to the UK & Ireland Lectionary & Grail Psalter"
            </p>
          </div>

          {/* Temporal aware recommended bar */}
          <div className="flex items-center gap-3 bg-[#151311] px-4 py-2.5 rounded-xl border border-stone-800/80 shadow-inner font-sans">
            <Clock size={16} className="text-amber-500 animate-spin duration-35000" />
            <div className="text-xs text-left">
              <p className="font-semibold text-amber-100">
                {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
              <p className="text-[10px] text-stone-400 mt-0.5">
                Hour Focus: <span className="text-amber-450 font-bold">{recommendation.title}</span>
              </p>
            </div>
            <button
              id="btn-quick-pray-hour"
              onClick={() => setActiveMoment(recommendation.key)}
              className="ml-2 bg-amber-600 hover:bg-amber-500 text-neutral-900 rounded-lg text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 transition-all"
            >
              Pray
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-none w-full px-4 md:px-8 xl:px-12 py-6 md:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        
        {/* Left Column: Traditional Daily Liturgy (60% width) */}
        <section className="lg:col-span-7 xl:col-span-7 flex flex-col gap-6">
          {/* Left Panel Tabs */}
          <div className="flex bg-[#12110f] p-1 rounded-xl border border-stone-800 font-sans text-xs">
            <button
              id="left-tab-breviary"
              onClick={() => { setLeftPanelTab("breviary"); setActiveMoment(null); }}
              className={`flex-1 py-2.5 text-center rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none ${
                leftPanelTab === "breviary" && !activeMoment
                  ? "bg-[#1d1b17] text-amber-200 shadow-sm border border-amber-900/35"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <BookOpen size={13} className="text-amber-500" /> The Liturgy of the Hours (Breviary)
            </button>
            <button
              id="left-tab-devotions"
              onClick={() => setLeftPanelTab("devotions")}
              className={`flex-1 py-2.5 text-center rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none ${
                leftPanelTab === "devotions" || activeMoment
                  ? "bg-[#1d1b17] text-amber-200 shadow-sm border border-amber-900/35"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <Sparkles size={13} className="text-amber-500" /> Interactive Guided Devotions
            </button>
          </div>

          <AnimatePresence mode="wait">
            {leftPanelTab === "breviary" && !activeMoment ? (
              <motion.div
                key="breviary-selection-view"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <OfficeBreviary
                  onSaveJournal={handleSaveJournalLog}
                  onClose={() => {}}
                />
              </motion.div>
            ) : !activeMoment ? (
              // Selection view: display the options for daily prayers
              <motion.div
                key="prayer-selection"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6"
              >
                {/* Visual Recommendation Banner */}
                <div className="bg-amber-950/20 rounded-2xl p-6 border border-amber-500/25 flex flex-col md:flex-row items-center gap-5 relative overflow-hidden shadow-sm shadow-amber-950/40">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full filter blur-xl" />
                  
                  <div className="p-4 bg-amber-600 text-neutral-900 rounded-xl shadow-md">
                    {React.createElement(recommendation.icon, { size: 24, className: "text-neutral-900" })}
                  </div>
                  <div className="space-y-1.5 flex-1 text-center md:text-left">
                    <span className="text-[10px] tracking-widest font-sans font-bold text-amber-300 uppercase bg-amber-950/40 border border-amber-900/50 px-2 py-0.5 rounded-full inline-block">
                      Suggested Moment
                    </span>
                    <h2 className="font-display text-lg text-amber-100 font-bold">
                      {recommendation.title}
                    </h2>
                    <p className="text-xs text-stone-300 leading-relaxed max-w-md italic">
                      {recommendation.desc}
                    </p>
                  </div>
                  <button
                    id="btn-trigger-suggested"
                    onClick={() => setActiveMoment(recommendation.key)}
                    className="w-full md:w-auto bg-amber-600 hover:bg-amber-500 text-neutral-950 font-sans text-xs tracking-wider uppercase font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm shrink-0 font-bold"
                  >
                    Begin Meditation
                  </button>
                </div>

                {/* Grid of All Hours */}
                <div className="space-y-4">
                  <h3 className="font-display text-sm font-bold tracking-widest text-stone-400 uppercase border-b border-stone-800 pb-2">
                    Liturgy of the Ordinary Day
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Morning Card */}
                    <button
                      id="card-morning"
                      onClick={() => setActiveMoment("morning")}
                      className="liturgy-button text-left flex bg-[#171512] rounded-xl p-5 border border-stone-800/80 hover:border-amber-500/40 hover:bg-[#1f1d19] hover:shadow-md transition-all group relative overflow-hidden cursor-pointer"
                    >
                      <div className="mr-4 p-3 rounded-lg bg-[#24211d] text-amber-400 font-sans group-hover:bg-amber-950 transition-colors">
                        <Sun size={20} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-display text-[15px] text-stone-100 font-semibold flex items-center gap-1 group-hover:text-amber-400 transition-colors">
                          Morning Offering <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 tracking-normal transition-all" />
                        </h4>
                        <p className="text-[11px] text-stone-400 leading-relaxed font-sans mt-0.5">
                          Traditionally at sunrise. Commit your daily labours and worries to the Sacred Heart.
                        </p>
                      </div>
                    </button>

                    {/* Midday Card */}
                    <button
                      id="card-midday"
                      onClick={() => setActiveMoment("midday")}
                      className="liturgy-button text-left flex bg-[#171512] rounded-xl p-5 border border-stone-800/80 hover:border-amber-500/40 hover:bg-[#1f1d19] hover:shadow-md transition-all group cursor-pointer"
                    >
                      <div className="mr-4 p-3 rounded-lg bg-[#24211d] text-amber-400 font-sans group-hover:bg-amber-950">
                        <Clock size={20} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-display text-[15px] text-stone-100 font-semibold flex items-center gap-1 group-hover:text-amber-400">
                          Midday Angelus <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
                        </h4>
                        <p className="text-[11px] text-stone-400 leading-relaxed font-sans mt-0.5">
                          Traditionally at midday. Recite the joyful Angelus response, followed by the silent "Jesus Prayer".
                        </p>
                      </div>
                    </button>

                    {/* Evening Card */}
                    <button
                      id="card-evening"
                      onClick={() => setActiveMoment("evening")}
                      className="liturgy-button text-left flex bg-[#171512] rounded-xl p-5 border border-stone-800/80 hover:border-amber-500/40 hover:bg-[#1f1d19] hover:shadow-md transition-all group cursor-pointer"
                    >
                      <div className="mr-4 p-3 rounded-lg bg-[#24211d] text-amber-400 group-hover:bg-amber-950">
                        <Sunset size={20} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-display text-[15px] text-stone-100 font-semibold flex items-center gap-1 group-hover:text-amber-400">
                          Evening Examen <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
                        </h4>
                        <p className="text-[11px] text-stone-400 leading-relaxed font-sans mt-0.5">
                          Traditionally at sunset. Guided Ignatian self-examination of conscience focused heavily on gratitude.
                        </p>
                      </div>
                    </button>

                    {/* Night Card */}
                    <button
                      id="card-night"
                      onClick={() => setActiveMoment("night")}
                      className="liturgy-button text-left flex bg-[#171512] rounded-xl p-5 border border-stone-800/80 hover:border-amber-500/40 hover:bg-[#1f1d19] hover:shadow-md transition-all group cursor-pointer"
                    >
                      <div className="mr-4 p-3 rounded-lg bg-[#24211d] text-amber-400 group-hover:bg-amber-950">
                        <Moon size={20} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-display text-[15px] text-stone-100 font-semibold flex items-center gap-1 group-hover:text-amber-400">
                          Night Prayer (Compline) <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
                        </h4>
                        <p className="text-[11px] text-stone-400 leading-relaxed font-sans mt-0.5">
                          The final hour before rest. Simplified Liturgy of the Hours chanting layout with Psalms and Salve Regina.
                        </p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Quote of Comfort */}
                <div className="bg-[#12110f] border border-stone-800 rounded-xl p-5 text-center italic text-stone-300 text-xs font-serif leading-relaxed">
                  "Pray, hope, and don't worry. Worry is useless. God is merciful and will hear your prayer." <br />
                  <span className="block font-sans rounded text-[10px] font-bold text-amber-450 uppercase tracking-wider mt-1.5">— Saint Padre Pio</span>
                </div>
              </motion.div>
            ) : (
              // Active guided prayer panel is rendering
              <motion.div
                key="prayer-active"
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center bg-[#151311] p-3 rounded-xl border border-stone-800/80">
                  <button
                    id="btn-return-overview"
                    onClick={() => setActiveMoment(null)}
                    className="text-xs font-sans text-stone-400 hover:text-stone-200 font-semibold flex items-center gap-1 transition-colors cursor-pointer font-bold"
                  >
                    ← Exit & Return to Liturgy Hours
                  </button>
                  <span className="text-[10px] font-sans text-stone-450 uppercase tracking-widest bg-[#1f1d19] px-2 py-0.5 rounded italic border border-stone-800/80">
                    Silent Sanctuary mode
                  </span>
                </div>

                {activeMoment === "morning" && (
                  <MorningOffering
                    onSaveJournal={handleSaveJournalLog}
                    onClose={() => setActiveMoment(null)}
                  />
                )}

                {activeMoment === "midday" && (
                  <MiddayAngelus
                    onClose={() => setActiveMoment(null)}
                  />
                )}

                {activeMoment === "evening" && (
                  <EveningExamen
                    onSaveJournal={handleSaveJournalLog}
                    onClose={() => setActiveMoment(null)}
                  />
                )}

                {activeMoment === "night" && (
                  <NightPrayer
                    onClose={() => setActiveMoment(null)}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Right Column: Dedicated Spiritual Journal Hub (40% width) */}
        <section className="lg:col-span-5 xl:col-span-5 flex flex-col bg-[#161412] rounded-2xl border border-stone-800/80 shadow-sm overflow-hidden h-[600px] lg:h-auto min-h-[500px]">
          
          {/* Header */}
          <div className="bg-[#12110f] p-4 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Feather size={16} className="text-amber-500 animate-pulse" />
              <div>
                <h3 className="font-sans font-bold text-sm text-amber-100 tracking-wide">Spiritual Journal</h3>
                <p className="text-[10px] font-sans text-stone-400">Log private graces, reflections, & spontaneous prayers.</p>
              </div>
            </div>
            <span className="text-[10px] font-sans font-bold bg-amber-950/50 text-amber-450 border border-amber-900/60 px-2 py-0.5 rounded-full">
              {journal.length} {journal.length === 1 ? "Inscription" : "Inscriptions"}
            </span>
          </div>

          {/* Embedded Spontaneous Entry Form */}
          <form onSubmit={handleSaveSpontaneous} className="p-4 bg-[#12110f]/40 border-b border-stone-850 space-y-3 font-sans">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="text-[10px] tracking-widest font-bold text-amber-455 uppercase flex items-center gap-1.5 hover:text-amber-500 text-stone-300">
                <Feather size={11} className="text-amber-500" /> Scribe New Entry
              </span>
              <div className="flex items-center gap-1">
                <select
                  id="select-journal-category"
                  value={journalCategory}
                  onChange={(e: any) => setJournalCategory(e.target.value)}
                  className="bg-[#1e1c19] text-[10px] border border-stone-800 text-stone-350 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500/50 cursor-pointer font-bold"
                >
                  <option value="Spontaneous Prayer">Spontaneous Prayer</option>
                  <option value="Quiet Contemplation">Contemplation</option>
                  <option value="Morning Intention">Morning Intention</option>
                  <option value="Evening Examen">Evening Examen</option>
                </select>
              </div>
            </div>
            
            <div className="relative">
              <textarea
                id="spontaneous-journal-textarea"
                rows={3}
                value={spontaneousText}
                onChange={(e) => setSpontaneousText(e.target.value)}
                placeholder="Type a spontaneous grace, offering, or private intention received today..."
                className="w-full text-xs p-3 bg-[#181614] border border-stone-800/80 text-stone-200 rounded-xl placeholder-stone-600 focus:outline-none focus:ring-1 focus:ring-amber-500/50 leading-relaxed resize-none font-sans"
              />
            </div>

            <div className="flex justify-between items-center">
              <AnimatePresence mode="wait">
                {showSuccess ? (
                  <motion.div
                    key="success-prompt"
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[10px] text-emerald-400 font-sans flex items-center gap-1 font-semibold"
                  >
                    <Check size={11} /> Grace recorded successfully.
                  </motion.div>
                ) : (
                  <div className="text-[9px] text-stone-500 italic font-sans">
                    Saved locally on this browser cache
                  </div>
                )}
              </AnimatePresence>
              <button
                id="btn-submit-spontaneous-log"
                type="submit"
                disabled={!spontaneousText.trim()}
                className={`text-[10px] uppercase font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
                  spontaneousText.trim()
                    ? "bg-amber-600 text-neutral-950 hover:bg-amber-500 cursor-pointer shadow-sm font-extrabold"
                    : "bg-[#252320] text-stone-500 cursor-not-allowed border border-stone-850"
                }`}
              >
                Save
              </button>
            </div>
          </form>

          {/* Wrapper for the rest */}
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            <div className="bg-[#0e0d0b] px-4 py-2 bg-opacity-70 flex justify-between items-center border-b border-stone-850 font-sans">
              <span className="text-[9px] uppercase font-bold text-stone-400 tracking-wider">
                Historic Diary Entries
              </span>
              {journal.length > 0 && (
                <button
                  id="btn-clear-sp-journal-sidebar"
                  onClick={handleClearJournal}
                  className="text-[10px] font-sans text-red-500 hover:text-red-400 underline font-semibold cursor-pointer"
                >
                  Clear Ledger
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 pr-2 select-text">
              {journal.length === 0 ? (
                <div className="text-center py-20 text-stone-500 italic space-y-3">
                  <BookOpen className="mx-auto w-10 h-10 opacity-30 text-stone-400" />
                  <p className="text-xs font-serif leading-relaxed max-w-xs mx-auto text-stone-400">
                    Your spiritual ledger is empty. Recite interactive guided devotions (like the Morning Offering or Evening Examen) or use the form above to record spontaneous graces.
                  </p>
                </div>
              ) : (
                journal.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-[#13110f] border border-stone-850 p-4 rounded-xl space-y-2 text-left text-xs font-serif shadow-sm relative overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-600" />
                    
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-sans font-bold text-[9px] text-amber-250 bg-amber-950/50 border border-amber-900/40 px-2 py-0.5 rounded uppercase tracking-wide">
                        {entry.category}
                      </span>
                      <span className="text-[9px] font-sans text-stone-500 tracking-tight shrink-0">
                        {new Date(entry.timestamp).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    {entry.details?.gratitude && (
                       <div className="space-y-1 pl-2 font-serif">
                        <span className="text-[10px] font-sans font-semibold text-stone-400 uppercase block">Gratitude:</span>
                        <p className="text-[#d7d2c7] bg-[#1e1c19] p-2 border border-stone-800/80 rounded italic whitespace-pre-wrap">{entry.details.gratitude}</p>
                       </div>
                    )}

                    {entry.details?.sorrow && (
                       <div className="space-y-1 pl-2 font-serif">
                        <span className="text-[10px] font-sans font-semibold text-stone-400 uppercase block">Shortcomings:</span>
                        <p className="text-[#d7d2c7] bg-[#1e1c19] p-2 border border-stone-800/80 rounded italic whitespace-pre-wrap">{entry.details.sorrow}</p>
                       </div>
                    )}

                    {entry.details?.hope && (
                       <div className="space-y-1 pl-2 font-serif">
                        <span className="text-[10px] font-sans font-semibold text-stone-400 uppercase block">Desired grace for tomorrow:</span>
                        <p className="text-[#d7d2c7] bg-[#1e1c19] p-2 border border-stone-800/80 rounded italic whitespace-pre-wrap">{entry.details.hope}</p>
                       </div>
                    )}

                    {!entry.details?.gratitude && entry.text && (
                      <p className="text-[#d7d2c7] bg-[#1e1c19] p-2 rounded border border-stone-800/80 italic leading-relaxed whitespace-pre-wrap">
                        "{entry.text}"
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 pb-3 px-3 border-t border-stone-850 mt-auto bg-[#12110f] flex items-center gap-1.5 text-[9px] font-sans text-stone-400">
              <Info size={11} className="text-stone-500 shrink-0" />
              <span>Graces are fully private and saved only inside your device's browser memory cache.</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-850 bg-[#12110f] py-6 mt-12 text-center text-xs font-sans text-stone-400">
        <div className="max-w-none w-full px-4 md:px-8 xl:px-12 space-y-1.5">
          <p className="italic font-serif text-stone-300">
            "Lord Jesus Christ, Son of the living God, have mercy on me, a sinner."
          </p>
          <div className="flex justify-center gap-2 text-[10px] tracking-wider uppercase font-semibold text-amber-500/80 mt-2">
            <span>Morning Offering</span>
            <span>•</span>
            <span>Midday Angelus</span>
            <span>•</span>
            <span>Evening Examen</span>
            <span>•</span>
            <span>Night Prayer</span>
          </div>
          <p className="text-[9px] text-stone-500 pt-1">
            © 2026 Catholic Daily Prayer Companion. Under the protection of the Holy Family.
          </p>
        </div>
      </footer>
    </div>
  );
}
