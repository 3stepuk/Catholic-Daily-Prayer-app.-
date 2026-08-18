import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Book, Compass, Clock, Sun, Sunset, Moon, Sparkles, RefreshCw, BookOpen, Check, Feather, Calendar, Info } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface OfficeBreviaryProps {
  onSaveJournal: (entry: { category: "Morning Intention" | "Evening Examen" | "Quiet Contemplation" | "Spontaneous Prayer"; text: string; details?: any }) => void;
  onClose: () => void;
}

type OfficeHour = "lauds" | "vespers" | "compline" | "readings" | "daytime";

interface HourMetadata {
  key: OfficeHour;
  title: string;
  subtitle: string;
  timeLabel: string;
  icon: any;
  desc: string;
}

const HOURS_INFO: HourMetadata[] = [
  {
    key: "readings",
    title: "Office of Readings",
    subtitle: "Officium Lectionis – Matins",
    timeLabel: "Any hour / Midnight / Dawn",
    icon: BookOpen,
    desc: "A prayer of deep meditation featuring extensive readings from Sacred Scripture and the writings of the Saints or Church Fathers."
  },
  {
    key: "lauds",
    title: "Morning Prayer",
    subtitle: "Laudes – Sunrise",
    timeLabel: "6:00 AM – 9:00 AM",
    icon: Sun,
    desc: "The major morning prayer of praise. Consecrating our first daily thoughts and labours to our Lord Jesus, our Saviour."
  },
  {
    key: "daytime",
    title: "Daytime Prayer",
    subtitle: "Terce / Sext / None",
    timeLabel: "9:00 AM / Noon / 3:00 PM",
    icon: Compass,
    desc: "A brief pause during work or daytime to refresh the spirit and align our daily endeavours with the heavenly kingdom."
  },
  {
    key: "vespers",
    title: "Evening Prayer",
    subtitle: "Vesperae – Sunset",
    timeLabel: "5:00 PM – 7:30 PM",
    icon: Sunset,
    desc: "The major evening prayer of thanksgiving. Includes the Blessed Virgin Mary's beautiful Canticle, the Magnificat."
  },
  {
    key: "compline",
    title: "Night Prayer",
    subtitle: "Completorium – Nighttime",
    timeLabel: "Before sleep / Rest",
    icon: Moon,
    desc: "The final prayer of the day. A quiet entrustment of our soul to God before sleeping, ending with the Marian antiphon."
  }
];

export default function OfficeBreviary({ onSaveJournal, onClose }: OfficeBreviaryProps) {
  const [selectedHour, setSelectedHour] = useState<OfficeHour | null>(null);
  const [liturgyText, setLiturgyText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userReflection, setUserReflection] = useState<string>("");
  const [journalLogged, setJournalLogged] = useState<boolean>(false);
  
  // Custom Date selection to let users pray ahead or review yesterday
  const [targetDate, setTargetDate] = useState<string>(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });

  const fetchLiturgy = async (hour: OfficeHour, dateString: string) => {
    setLoading(true);
    setError(null);
    setLiturgyText("");
    setJournalLogged(false);
    setUserReflection("");

    try {
      const response = await fetch("/api/office", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          hour,
          date: dateString
        })
      });

      if (!response.ok) {
        throw new Error("Unable to reach the liturgical sanctuary. Let us attempt to load once more or check your credentials.");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setLiturgyText(data.liturgy);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred while looking up today's breviary.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHour = (hour: OfficeHour) => {
    setSelectedHour(hour);
    fetchLiturgy(hour, targetDate);
  };

  const handleCommitJournal = () => {
    if (!userReflection.trim() || !selectedHour) return;
    
    const hourMetadata = HOURS_INFO.find(h => h.key === selectedHour);
    const hourTitle = hourMetadata ? hourMetadata.title : selectedHour;

    onSaveJournal({
      category: "Quiet Contemplation",
      text: userReflection,
      details: {
        intention: `Prayed ${hourTitle} for ${targetDate}.`,
        gratitude: `Recited the Divine Office of the Church in holy union.`
      }
    });

    setJournalLogged(true);
  };

  // Convert weekday
  const getDisplayDate = (dStr: string) => {
    try {
      const parts = dStr.split("-");
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return d.toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    } catch {
      return dStr;
    }
  };

  return (
    <div id="office-breviary-panel" className="bg-[#161412] text-[#e5e0d5] rounded-2xl border border-stone-800 overflow-hidden shadow-sm flex flex-col font-serif">
      {/* Decorative Vatican Gold Header Stripe */}
      <div className="h-2 bg-amber-500 w-full" />
      
      {!selectedHour ? (
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-850 pb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-amber-100 tracking-tight flex items-center gap-2">
                <Book className="text-amber-500" size={24} /> Liturgy of the Hours
              </h2>
              <p className="text-stone-400 font-sans text-xs uppercase tracking-wider mt-1">
                The continuous daily prayer of the Roman Catholic Church (Grail Psalter Translation)
              </p>
            </div>

            {/* Date Picker */}
            <div className="flex items-center gap-2 bg-[#12110f] border border-stone-800 rounded-xl p-2 font-sans text-xs">
              <Calendar size={14} className="text-amber-500" />
              <span className="font-semibold text-stone-300">Liturgy Date:</span>
              <input
                id="breviary-calendar-picker"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="bg-transparent border-none text-stone-200 font-medium focus:ring-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Liturgy Introduction Advice */}
          <div className="bg-amber-950/15 rounded-xl p-4 border border-amber-900/30 text-stone-300 text-xs font-sans leading-relaxed">
            <span className="font-bold text-amber-400 block mb-1">What is the Liturgy of the Hours?</span>
            Also known as the <span className="font-semibold text-amber-200">Divine Office</span>, this structure is a series of prayers prayed at canonically designated hours throughout the day. When you pray these hours, your voice joins millions of priests, religious, and laity across the globe, sanctifying every moment under the sight of Heaven.
          </div>

          {/* Hours grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {HOURS_INFO.map((hourObj) => {
              const IconComp = hourObj.icon;
              return (
                <button
                  id={`btn-select-hour-${hourObj.key}`}
                  key={hourObj.key}
                  onClick={() => handleSelectHour(hourObj.key)}
                  className="text-left bg-[#13110f] hover:bg-[#1e1c19] border border-stone-800 hover:border-amber-500/35 rounded-xl p-5 transition-all group pointer-events-auto flex flex-col justify-between cursor-pointer"
                >
                  <div className="flex items-start justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-[#24211d] text-amber-500 group-hover:bg-amber-950 transition-colors">
                        <IconComp size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-100 text-base">{hourObj.title}</h4>
                        <span className="text-[10px] text-stone-500 font-mono tracking-wide block uppercase mt-0.5">{hourObj.subtitle}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-sans font-bold uppercase tracking-wider bg-stone-800/60 text-stone-300 px-2 py-0.5 rounded-full">
                      {hourObj.timeLabel}
                    </span>
                  </div>
                  <p className="text-xs text-[#c5c0b5] font-serif leading-relaxed mt-3 italic pl-1">
                    {hourObj.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col min-h-[500px]">
          {/* Liturgical Reader Header */}
          <div className="bg-[#12110f] border-b border-stone-800 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <button
                id="btn-breviary-back"
                onClick={() => setSelectedHour(null)}
                className="text-xs font-sans font-bold text-amber-450 hover:text-amber-300 flex items-center gap-1 mb-1 transition-colors cursor-pointer"
              >
                ← Return to Liturgical Hours
              </button>
              <h3 className="text-lg font-bold text-amber-100 tracking-tight flex items-center gap-2">
                {HOURS_INFO.find(h => h.key === selectedHour)?.title} <span className="text-xs font-mono font-normal text-stone-500">({HOURS_INFO.find(h => h.key === selectedHour)?.subtitle})</span>
              </h3>
              <p className="text-[11px] font-sans text-stone-400 flex items-center gap-1 mt-0.5">
                <Calendar size={12} className="text-amber-500" /> Grounded Office: <span className="text-stone-200 font-bold">{getDisplayDate(targetDate)}</span>
              </p>
            </div>

            <button
              id="btn-re-fetch-liturgy"
              onClick={() => fetchLiturgy(selectedHour, targetDate)}
              disabled={loading}
              className="text-xs font-sans px-3 py-1.5 rounded-lg border border-stone-880 hover:bg-[#1f1d19] flex items-center gap-1.5 text-stone-200 transition-all font-semibold cursor-pointer border-stone-800"
            >
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh Text
            </button>
          </div>

          {/* Liturgy Text Body */}
          <div className="flex-1 overflow-y-auto max-h-[500px] bg-[#0d0c0a] p-6 md:p-8 relative">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-20 text-center space-y-4 font-sans"
                >
                  <RefreshCw size={36} className="text-amber-500 animate-spin" />
                  <div className="space-y-1.5 max-w-sm">
                    <p className="text-xs font-bold text-stone-200 font-sans">Consulting Liturgical Archives...</p>
                    <p className="text-[10px] text-stone-550 leading-relaxed font-sans text-stone-400">
                      Securing grounded readings, antiphons, and intercessions from UK Breviary servers to match the proper day.
                    </p>
                  </div>
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 max-w-md mx-auto space-y-4"
                >
                  <p className="text-red-450 italic font-medium">{error}</p>
                  <button
                    id="btn-retry-liturgy"
                    onClick={() => fetchLiturgy(selectedHour, targetDate)}
                    className="bg-amber-600 text-neutral-950 font-sans font-bold text-xs px-4 py-2 rounded-xl hover:bg-amber-500 transition-colors cursor-pointer"
                  >
                    Attempt Reconnection
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="liturgy-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="prose prose-stone max-w-none text-left"
                >
                  {/* Decorative Cross Accent */}
                  <div className="text-center text-amber-500 mb-6 text-xl">†</div>
                  
                  {/* Styled markdown output */}
                  <div className="markdown-body font-serif text-[14.5px] leading-relaxed text-stone-200 space-y-6">
                    <ReactMarkdown
                      components={{
                        h3: ({ node, ...props }) => <h3 className="font-sans font-bold text-sm tracking-widest text-[#ff5555] uppercase border-b border-stone-800 pb-1 mt-6 mb-3" {...props} />,
                        h4: ({ node, ...props }) => <h4 className="font-sans font-semibold text-xs tracking-wide text-amber-400 uppercase mt-4 mb-2" {...props} />,
                        p: ({ node, ...props }) => <p className="mb-4 pr-1 leading-relaxed text-[#d7d2c7]" {...props} />,
                        em: ({ node, ...props }) => <span className="italic text-stone-400" {...props} />,
                        blockquote: ({ node, ...props }) => <blockquote className="border-l-2 border-amber-600/60 pl-4 py-1 italic my-4 text-amber-200 bg-amber-950/20 rounded-r-lg" {...props} />,
                      }}
                    >
                      {liturgyText}
                    </ReactMarkdown>
                  </div>

                  {/* End of liturgy marker */}
                  <div className="text-center text-amber-500 mt-10 text-xl font-sans font-semibold italic">
                    † Amen.
                  </div>

                  {/* Journal reflection interaction drawer */}
                  <div className="mt-12 p-5 bg-[#13110f] border border-stone-800 rounded-xl space-y-4">
                    <div className="flex items-center gap-2">
                      <Feather size={16} className="text-amber-500" />
                      <h4 className="font-sans font-bold text-amber-100 text-xs uppercase tracking-wider">Spiritual Diary Integration</h4>
                    </div>
                    
                    <p className="text-stone-400 font-sans text-[11px] leading-relaxed">
                      Scribe any graces, quiet promptings, or words of comfortable silence that occurred in your mind during this liturgical hour into your spiritual journal.
                    </p>

                    {journalLogged ? (
                      <div className="p-3 bg-emerald-950/30 border border-emerald-900/40 rounded-lg text-emerald-400 flex items-center gap-2 text-xs font-sans">
                        <Check size={16} className="shrink-0" /> Reflection successfully added to your private spiritual ledger.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <textarea
                          id="breviary-reflection-textbox"
                          rows={3}
                          value={userReflection}
                          onChange={(e) => setUserReflection(e.target.value)}
                          placeholder="Lord, in this hour You spoke to me of Your quiet comfort..."
                          className="w-full text-xs p-3 border border-stone-800 bg-[#1e1c19] text-[#e5e0d5] rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500/50 font-sans placeholder-stone-500"
                        />
                        <div className="flex justify-end">
                          <button
                            id="btn-commit-breviary-reflection"
                            onClick={handleCommitJournal}
                            disabled={!userReflection.trim()}
                            className={`text-xs font-sans px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                              userReflection.trim()
                                ? "bg-amber-600 hover:bg-amber-500 text-neutral-950 shadow-sm"
                                : "bg-[#252320] text-stone-500 cursor-not-allowed"
                            }`}
                          >
                            Commit Reflection to Journal
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Liturgical Reader Footer Controls */}
          <div className="bg-[#12110f] p-4 border-t border-stone-800 flex justify-between items-center text-xs font-sans">
            <span className="text-[10px] text-stone-500">
              Under the protection of the Holy Family
            </span>
            <button
              id="btn-close-liturgical-reading"
              onClick={() => setSelectedHour(null)}
              className="bg-[#24211d] hover:bg-stone-850 text-[#e5e0d5] border border-stone-700/60 px-4 py-2 rounded-lg font-bold transition-all shadow-sm cursor-pointer"
            >
              Close Divine Liturgy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
