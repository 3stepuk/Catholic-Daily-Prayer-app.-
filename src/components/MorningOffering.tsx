import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MORNING_SCRIPTURES } from "../data";
import { JournalEntry, ScriptureVerse } from "../types";
import { Compass, BookOpen, PenTool, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";

interface MorningOfferingProps {
  onSaveJournal: (entry: Omit<JournalEntry, "id" | "timestamp">) => void;
  onClose: () => void;
}

export default function MorningOffering({ onSaveJournal, onClose }: MorningOfferingProps) {
  const [step, setStep] = useState(1);
  const [offeringText, setOfferingText] = useState("");
  const [selectedScripture] = useState<ScriptureVerse>(() => {
    // Select seed random based on today's date
    const day = new Date().getDate();
    return MORNING_SCRIPTURES[day % MORNING_SCRIPTURES.length];
  });
  const [showHailMary, setShowHailMary] = useState(false);

  const nextStep = () => setStep((s) => Math.min(s + 1, 5));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleFinish = () => {
    onSaveJournal({
      category: "Morning Intention",
      text: offeringText || "I offered my day to the Lord in faith.",
      details: {
        intention: offeringText
      }
    });
    onClose();
  };

  return (
    <div id="morning-offering-panel" className="prayer-card bg-[#161412] text-[#e5e0d5] rounded-2xl p-6 md:p-8 max-w-2xl mx-auto border border-stone-800 shadow-sm relative overflow-hidden font-serif">
      {/* Decorative Vatican Gold Header Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-500" />

      {/* Progress indicators */}
      <div className="flex justify-between items-center mb-6 mt-2">
        <span className="text-xs font-sans uppercase tracking-widest text-amber-400 font-semibold">
          Morning Offering
        </span>
        <div className="flex gap-1.5 font-sans">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= step ? "w-6 bg-amber-500" : "w-2 bg-stone-800"
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            className="space-y-6"
          >
            <div className="text-center space-y-4 py-6">
              <h3 className="font-display text-2xl text-amber-100 font-semibold tracking-wide">
                † The Sign of the Cross
              </h3>
              <p className="text-stone-300 italic text-sm">
                Let us begin by quieting our minds, taking a slow breath, and entering into the sacred space of the Father's presence.
              </p>
              <div className="p-4 bg-[#12110f] rounded-xl border border-stone-800 inline-block px-8 py-4 font-display text-lg text-amber-500 tracking-wider">
                In nomine Patris, et Filii, et Spiritus Sancti. Amen.
              </div>
              <p className="text-xs font-sans text-stone-400">
                In the name of the Father, and of the Son, and of the Holy Spirit. Amen.
              </p>
            </div>

            <div className="flex justify-center font-sans">
              <button
                id="btn-morning-start"
                onClick={nextStep}
                className="liturgy-button bg-amber-600 hover:bg-amber-500 text-neutral-950 font-sans tracking-wide px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm shadow-sm cursor-pointer font-bold"
              >
                Enter Presence <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            className="space-y-6 animate-pulse-duration-10"
          >
            <div className="text-center space-y-4 py-4">
              <Compass className="text-amber-500 mx-auto w-10 h-10" />
              <h3 className="font-display text-2xl text-[#e5e0d5] font-medium tracking-wide">
                Sacred Silence
              </h3>
              <blockquote className="border-l-4 border-amber-500/40 pl-4 py-2 italic text-stone-300 text-left my-4 bg-[#12110f] rounded-r-lg max-w-lg mx-auto">
                "Our hearts are restless, O Lord, until they rest in Thee."
                <cite className="block text-xs font-sans font-semibold text-stone-400 mt-1 not-italic">
                  — Saint Augustine, Confessions
                </cite>
              </blockquote>
              <p className="text-stone-300 text-sm leading-relaxed max-w-lg mx-auto">
                Spend thirty seconds in absolute quiet. Rest under God's merciful gaze, looking towards Him with complete trust. Let go of whatever task lies ahead of you.
              </p>
              <div className="flex justify-center py-2">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-12 h-12 rounded-full border-2 border-amber-500/20 pulse-glow"></div>
                  <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="flex justify-between font-sans pt-4 border-t border-stone-800">
              <button
                id="btn-step2-prev"
                onClick={prevStep}
                className="flex items-center gap-1.5 text-stone-400 hover:text-stone-200 text-sm transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                id="btn-step2-next"
                onClick={nextStep}
                className="bg-amber-600 hover:bg-amber-500 text-neutral-950 font-sans tracking-wide px-6 py-2 rounded-lg flex items-center gap-2 text-sm shadow-sm transition-all cursor-pointer font-bold"
              >
                Morning Offering <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h4 className="font-display text-xl text-amber-100 border-b border-amber-900/40 pb-2 tracking-wide text-center">
                The Traditional Morning Offering
              </h4>
              
              <p className="text-stone-200 leading-relaxed text-center px-4 italic text-[1.05rem] md:text-lg bg-[#12110f] p-6 rounded-xl border border-stone-850">
                “O Jesus, through the Immaculate Heart of Mary, I offer You my prayers, labours, joys, and sufferings of this day, in union with the Holy Sacrifice of the Mass throughout the world. 
                <span className="block my-2 h-px bg-stone-800"></span>
                I offer them for all the intentions of Your Sacred Heart: the salvation of souls, reparation for sin, and the reunion of all Christians. 
                <span className="block my-2 h-px bg-stone-800"></span>
                I offer them for the intentions of our bishops and all apostles of prayer, and in particular for those recommended by our Holy Father this month. Amen.”
              </p>

              <div className="text-center py-2">
                <button
                  id="toggle-hail-mary"
                  onClick={() => setShowHailMary(!showHailMary)}
                  className="text-xs text-amber-500 hover:text-amber-400 underline font-sans transition-all cursor-pointer"
                >
                  {showHailMary ? "Hide Mary's Prayer" : "Reflect on the Hail Mary..."}
                </button>
                {showHailMary && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-[#c5c0b5] mt-2 bg-[#12110f] p-3 rounded border border-stone-800 max-w-sm mx-auto font-sans"
                  >
                    "Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen."
                  </motion.p>
                )}
              </div>
            </div>

            <div className="flex justify-between font-sans pt-4 border-t border-stone-800">
              <button
                id="btn-step3-prev"
                onClick={prevStep}
                className="flex items-center gap-1.5 text-stone-400 hover:text-stone-200 text-sm cursor-pointer"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                id="btn-step3-next"
                onClick={nextStep}
                className="bg-amber-600 hover:bg-amber-500 text-neutral-950 font-sans tracking-wide px-6 py-2 rounded-lg flex items-center gap-2 text-sm shadow-sm transition-all cursor-pointer font-bold"
              >
                Scripture & Reflection <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2 justify-center text-amber-400">
                <BookOpen size={18} />
                <span className="font-sans text-xs uppercase tracking-wider font-semibold">Scripture of the Day</span>
              </div>
              
              <div className="bg-amber-950/15 rounded-xl p-5 border border-amber-900/30 text-center space-y-3">
                <p className="text-stone-200 italic text-base leading-relaxed">
                  "{selectedScripture.text}"
                </p>
                <p className="text-xs font-sans font-bold text-amber-400">
                  — {selectedScripture.reference}
                </p>
                <div className="w-12 h-0.5 bg-amber-900 mx-auto my-1"></div>
                <p className="text-xs text-stone-400 font-sans italic">
                  Reflect: {selectedScripture.reflection}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-sans uppercase font-semibold text-stone-400 flex items-center gap-1.5">
                  <PenTool size={14} className="text-amber-500" /> Scribe your daily offering (your personal intentions, crosses, or joys):
                </label>
                <textarea
                  id="morning-intention-input"
                  rows={3}
                  value={offeringText}
                  onChange={(e) => setOfferingText(e.target.value)}
                  placeholder="Lord, I offer You my travels today, my patience with colleagues, and my joys in serving..."
                  className="w-full text-sm font-sans p-3 bg-[#1e1c19] text-stone-100 rounded-lg border border-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500/50 italic shadow-inner"
                />
              </div>
            </div>

            <div className="flex justify-between font-sans pt-4 border-t border-stone-800">
              <button
                id="btn-step4-prev"
                onClick={prevStep}
                className="flex items-center gap-1.5 text-stone-400 hover:text-stone-200 text-sm cursor-pointer"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                id="btn-step4-next"
                onClick={nextStep}
                className="bg-amber-600 hover:bg-amber-500 text-neutral-950 font-sans tracking-wide px-6 py-2 rounded-lg flex items-center gap-2 text-sm shadow-sm transition-all cursor-pointer font-bold"
              >
                Final Blessing <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            className="space-y-6"
          >
            <div className="text-center space-y-4 py-4">
              <CheckCircle className="text-emerald-500 w-12 h-12 mx-auto animate-bounce" />
              <h3 className="font-display text-2xl text-stone-100 font-bold tracking-wide">
                Go Forth in Grace
              </h3>
              <p className="text-stone-300 text-sm leading-relaxed max-w-md mx-auto">
                "May the Holy Spirit guide your tongue today, that you speak only truth; your brain, that you act with wisdom; and your heart, that you extend supreme love to all your brothers and sisters."
              </p>
              
              <div className="p-3 bg-[#12110f] rounded-lg max-w-sm mx-auto text-xs font-sans text-stone-400 text-left border border-stone-800">
                <span className="font-bold text-amber-400 block mb-1">Morning Prayer Completed</span>
                Your offering and personal intentions will be safely committed to your private spiritual diary below.
              </div>

              <div className="font-display text-lg text-amber-500">
                † In nomine Patris, et Filii, et Spiritus Sancti. Amen.
              </div>
            </div>

            <div className="flex justify-between font-sans pt-4 border-t border-stone-800 font-sans">
              <button
                id="btn-step5-prev"
                onClick={prevStep}
                className="flex items-center gap-1.5 text-stone-400 hover:text-stone-150 text-sm cursor-pointer"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                id="btn-morning-finish"
                onClick={handleFinish}
                className="bg-amber-600 hover:bg-amber-500 text-neutral-950 px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm shadow-md font-bold transition-all cursor-pointer"
              >
                Commit & Complete <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
