import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ANGELUS_TEXT, REGINA_CAELI_TEXT } from "../data";
import { Sun, ArrowLeft, ArrowRight, Play, CheckCircle } from "lucide-react";

interface MiddayAngelusProps {
  onClose: () => void;
}

export default function MiddayAngelus({ onClose }: MiddayAngelusProps) {
  // Check if current date falls within Eastertide (usually late March/April to late May/early June)
  const [isEasterSeason, setIsEasterSeason] = useState(() => {
    const today = new Date();
    const month = today.getMonth(); // 0-indexed
    // Approximate Easter tide for typical Catholic Calendars (April & May)
    return month === 3 || month === 4; 
  });

  const [middayStep, setMiddayStep] = useState(1);
  const [hailMaryProgress, setHailMaryProgress] = useState<Record<number, boolean>>({});
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathText, setBreathText] = useState("Inhale: 'Lord Jesus Christ, Son of the Living God...'");

  // Cycle breath text if active
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBreathingActive) {
      let phase = 0;
      interval = setInterval(() => {
        phase = (phase + 1) % 2;
        if (phase === 0) {
          setBreathText("Inhale: 'Lord Jesus Christ, Son of the Living God...'");
        } else {
          setBreathText("Exhale: '...have mercy on me, a sinner.'");
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isBreathingActive]);

  const handleHailMaryClick = (index: number) => {
    setHailMaryProgress((prev) => ({ ...prev, [index]: true }));
  };

  const handleFinish = () => {
    onClose();
  };

  return (
    <div id="midday-prayer-panel" className="prayer-card bg-[#161412] text-[#e5e0d5] rounded-2xl p-6 md:p-8 max-w-2xl mx-auto border border-stone-800 shadow-sm relative overflow-hidden font-serif">
      {/* Decorative Vatican Gold Header Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-500" />

      {/* Season Toggle Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6 border-b border-stone-800 pb-4">
        <div>
          <h3 className="text-xs font-sans uppercase tracking-widest text-amber-400 font-semibold flex items-center gap-1.5">
            <Sun size={14} className="text-amber-500 animate-spin duration-10000" /> Midday Prayer (The Angelus)
          </h3>
          <p className="text-[11px] font-sans text-stone-400 mt-1">
            Traditionally recited at 12:00 Noon to sanctify the middle of the day.
          </p>
        </div>
        
        {/* Toggle option */}
        <div className="flex items-center gap-1.5 bg-[#12110f] p-1 rounded-lg border border-stone-800 font-sans text-[11px]">
          <button
            id="toggle-season-ordinary"
            type="button"
            onClick={() => { setIsEasterSeason(false); setMiddayStep(1); }}
            className={`px-2 py-1 rounded transition-all cursor-pointer ${
              !isEasterSeason 
                ? "bg-amber-600 text-neutral-950 font-bold shadow-sm" 
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            Ordinary Time
          </button>
          <button
            id="toggle-season-easter"
            type="button"
            onClick={() => { setIsEasterSeason(true); setMiddayStep(1); }}
            className={`px-2 py-1 rounded transition-all cursor-pointer ${
              isEasterSeason 
                ? "bg-amber-600 text-neutral-950 font-bold shadow-sm" 
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            Eastertide
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isEasterSeason ? (
          // THE ANGELUS FLOW
          <div key="angelus-section" className="space-y-6">
            {middayStep === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="text-center space-y-4">
                  <h4 className="font-display text-xl text-amber-100 font-medium">† In nomine Patris...</h4>
                  <p className="text-stone-300 text-sm italic max-w-md mx-auto leading-relaxed">
                    The Angelus recalls the mystery of the Incarnation of Christ. As the midday bells toll, let us reflect on Mary's perfect "Yes" to God.
                  </p>
                </div>

                <div className="space-y-5 py-2">
                  {/* Part 1 */}
                  <div className="bg-[#12110f] p-4 rounded-xl border border-stone-850 space-y-3">
                    <p className="text-[#e5e0d5] text-[15px] leading-relaxed">
                      <strong className="text-amber-500 font-display">℣.</strong> {ANGELUS_TEXT.v1} <br />
                      <strong className="text-amber-500 font-display">℟.</strong> {ANGELUS_TEXT.r1}
                    </p>
                    
                    {!hailMaryProgress[1] ? (
                      <button
                        id="pray-hailmary-1"
                        onClick={() => handleHailMaryClick(1)}
                        className="text-xs font-sans bg-amber-600 hover:bg-amber-500 text-neutral-950 px-3 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer font-bold"
                      >
                        <Play size={10} /> Pray Hail Mary...
                      </button>
                    ) : (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-stone-300 italic mt-2 bg-[#1e1c19] p-3 rounded-lg border border-stone-800 font-sans"
                      >
                        "Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen."
                      </motion.p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-2 font-sans">
                  <button
                    id="btn-angelus-next-1"
                    onClick={() => setMiddayStep(2)}
                    className="bg-amber-650 hover:bg-amber-500 text-neutral-950 bg-amber-600 font-sans text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    Second Devotion <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {middayStep === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="space-y-5">
                  {/* Part 2 */}
                  <div className="bg-[#12110f] p-4 rounded-xl border border-stone-850 space-y-3">
                    <p className="text-[#e5e0d5] text-[15px] leading-relaxed">
                      <strong className="text-amber-500 font-display">℣.</strong> {ANGELUS_TEXT.v2} <br />
                      <strong className="text-amber-500 font-display">℟.</strong> {ANGELUS_TEXT.r2}
                    </p>
                    
                    {!hailMaryProgress[2] ? (
                      <button
                        id="pray-hailmary-2"
                        onClick={() => handleHailMaryClick(2)}
                        className="text-xs font-sans bg-amber-600 hover:bg-amber-500 text-neutral-950 px-3 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer font-bold"
                      >
                        <Play size={10} /> Pray Hail Mary...
                      </button>
                    ) : (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-stone-300 italic mt-2 bg-[#1e1c19] p-3 rounded-lg border border-stone-800 font-sans"
                      >
                        "Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen."
                      </motion.p>
                    )}
                  </div>

                  {/* Part 3 */}
                  <div className="bg-[#12110f] p-4 rounded-xl border border-stone-850 space-y-3">
                    <p className="text-[#e5e0d5] text-[15px] leading-relaxed">
                      <strong className="text-amber-500 font-display">℣.</strong> {ANGELUS_TEXT.v3} <br />
                      <strong className="text-amber-500 font-display">℟.</strong> {ANGELUS_TEXT.r3}
                    </p>
                    
                    {!hailMaryProgress[3] ? (
                      <button
                        id="pray-hailmary-3"
                        onClick={() => handleHailMaryClick(3)}
                        className="text-xs font-sans bg-amber-600 hover:bg-amber-500 text-neutral-950 px-3 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer font-bold"
                      >
                        <Play size={10} /> Pray Hail Mary...
                      </button>
                    ) : (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-stone-300 italic mt-2 bg-[#1e1c19] p-3 rounded-lg border border-stone-800 font-sans"
                      >
                        "Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen."
                      </motion.p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between font-sans text-xs pt-4 border-t border-stone-800">
                  <button
                    id="btn-angelus-back-2"
                    onClick={() => setMiddayStep(1)}
                    className="flex items-center gap-1 text-stone-400 hover:text-stone-200 cursor-pointer"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button
                    id="btn-angelus-next-2"
                    onClick={() => setMiddayStep(3)}
                    className="bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold px-4 py-2 rounded-lg flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    Collect Prayer <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {middayStep === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="bg-[#12110f] p-4 rounded-xl border border-stone-850">
                    <p className="text-[#e5e0d5] text-[14px] leading-relaxed">
                      <strong className="text-amber-500 font-display">℣.</strong> {ANGELUS_TEXT.v4} <br />
                      <strong className="text-amber-500 font-display">℟.</strong> {ANGELUS_TEXT.r4}
                    </p>
                  </div>

                  <div className="bg-amber-950/15 p-5 rounded-xl border border-amber-900/30 space-y-2">
                    <p className="text-xs font-sans uppercase font-bold tracking-wider text-amber-400 text-center">
                      Let us Pray
                    </p>
                    <p className="text-stone-200 text-[14.5px] leading-relaxed italic text-center">
                      "{ANGELUS_TEXT.prayer}"
                    </p>
                  </div>
                </div>

                <div className="flex justify-between font-sans text-xs pt-4 border-t border-stone-800">
                  <button
                    id="btn-angelus-back-3"
                    onClick={() => setMiddayStep(2)}
                    className="flex items-center gap-1 text-stone-400 hover:text-stone-200 cursor-pointer"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button
                    id="btn-angelus-next-3"
                    onClick={() => setMiddayStep(4)}
                    className="bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold px-4 py-2 rounded-lg flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    Enter Contemplation <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          // REGINA CAELI FLOW
          <div key="regina-caeli-section" className="space-y-6">
            {middayStep === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="text-center space-y-4 bg-amber-950/15 p-4 rounded-xl border border-amber-900/30">
                  <h4 className="font-display text-xl text-amber-400 font-semibold">
                    {REGINA_CAELI_TEXT.title}
                  </h4>
                  <p className="text-stone-300 text-xs italic">
                    Recited during the Easter season, celebrating Christ's triumphant resurrection and the joy of our Blessed Mother.
                  </p>
                </div>

                <div className="space-y-3 bg-[#12110f] p-4 rounded-xl border border-stone-800">
                  {REGINA_CAELI_TEXT.english.map((line, idx) => (
                    <p key={idx} className="text-[#e5e0d5] text-[14.5px] leading-normal font-serif">
                      {line}
                    </p>
                  ))}
                </div>

                <div className="flex justify-end font-sans text-xs">
                  <button
                    id="btn-regina-next"
                    onClick={() => setMiddayStep(3)} // Route to Collect Prayer
                    className="bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold px-4 py-2 rounded-lg flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    Collect Prayer <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {middayStep === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="bg-amber-950/15 p-5 rounded-xl border border-amber-900/30 space-y-2">
                  <p className="text-xs font-sans uppercase font-bold tracking-wider text-amber-400 text-center">
                    Let us Pray
                  </p>
                  <p className="text-stone-205 text-[14.5px] leading-relaxed italic text-center text-stone-200">
                    "{REGINA_CAELI_TEXT.collect}"
                  </p>
                </div>

                <div className="flex justify-between font-sans text-xs pt-4 border-t border-stone-800">
                  <button
                    id="btn-regina-back"
                    onClick={() => setMiddayStep(1)}
                    className="flex items-center gap-1 text-stone-400 hover:text-stone-200 cursor-pointer"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button
                    id="btn-regina-next-contemplation"
                    onClick={() => setMiddayStep(4)}
                    className="bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold px-4 py-2 rounded-lg flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    Enter Contemplation <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* CONTEMPLATION / JESUS PRAYER */}
        {middayStep === 4 && (
          <motion.div
            key="contemplation-section"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="text-center space-y-5 py-2">
              <CheckCircle className="text-emerald-500 w-11 h-11 mx-auto" />
              <h4 className="font-display text-xl text-amber-100 font-medium">The Jesus Prayer</h4>
              <p className="text-stone-300 text-xs italic max-w-sm mx-auto leading-relaxed">
                As you return to the duties of your afternoon, carry this simple, breath-based prayer in your heart to sustain your awareness of God's presence.
              </p>

              <div className="bg-[#12110f] text-amber-100 p-6 rounded-xl border border-stone-800 relative overflow-hidden">
                <div className="relative z-10 space-y-3">
                  <p className="text-sm font-sans uppercase tracking-widest text-amber-500/80 font-bold">
                    Contemplative Hesychastic Breathing Circle
                  </p>
                  
                  {isBreathingActive ? (
                    <motion.p
                      key={breathText}
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-base text-stone-105 italic"
                    >
                      {breathText}
                    </motion.p>
                  ) : (
                    <p className="text-base text-stone-100 italic">
                      "Lord Jesus Christ, Son of the living God, have mercy on me, a sinner."
                    </p>
                  )}

                  <div className="flex justify-center pt-2 font-sans text-xs">
                    <button
                      id="btn-toggle-breathing"
                      onClick={() => setIsBreathingActive(!isBreathingActive)}
                      className={`text-[11px] font-sans px-3 py-1.5 rounded border transition-all cursor-pointer ${
                        isBreathingActive 
                          ? "bg-amber-600 border-amber-600 text-neutral-950 font-bold" 
                          : "bg-[#1d1b17] border-amber-900/50 text-amber-400 hover:bg-[#24211d] hover:text-amber-300"
                      }`}
                    >
                      {isBreathingActive ? "Stop Breathing Metronome" : "Start 10s Paced Breathing"}
                    </button>
                  </div>
                </div>

                {/* Pulsing breathing ring background */}
                {isBreathingActive && (
                  <div className="absolute inset-0 bg-amber-500/5 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full border-2 border-amber-500/20 pulse-glow animate-pulse"></div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between font-sans text-xs pt-4 border-t border-stone-800">
              <button
                id="btn-midday-back-to-prayer"
                onClick={() => setMiddayStep(isEasterSeason ? 3 : 3)}
                className="flex items-center gap-1 text-stone-400 hover:text-stone-200 cursor-pointer"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <button
                id="btn-midday-finish"
                onClick={handleFinish}
                className="bg-amber-600 hover:bg-amber-500 text-[#0c0b09] px-6 py-2 rounded-lg flex items-center shadow-md justify-center cursor-pointer font-bold"
              >
                Close Prayer
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
