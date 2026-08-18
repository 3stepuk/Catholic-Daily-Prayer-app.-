import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Moon, ArrowLeft, ArrowRight, EyeOff, Sparkles, Check } from "lucide-react";

interface NightPrayerProps {
  onClose: () => void;
}

export default function NightPrayer({ onClose }: NightPrayerProps) {
  const [step, setStep] = useState(1);
  const [conscienceExamined, setConscienceExamined] = useState(false);

  return (
    <div id="night-prayer-panel" className="prayer-card bg-[#161412] text-[#e5e0d5] rounded-2xl p-6 md:p-8 max-w-2xl mx-auto border border-stone-800 shadow-xl relative overflow-hidden font-serif">
      {/* Decorative Vatican Gold Header Line - Deep Dark Amber */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-500" />

      {/* Progress display */}
      <div className="flex justify-between items-center mb-6 mt-2">
        <div>
          <h3 className="text-xs font-sans uppercase tracking-widest text-[#e5e0d5] font-bold flex items-center gap-1.5">
            <Moon size={14} className="text-amber-500" /> Compline (Night Prayer)
          </h3>
          <p className="text-[10px] font-sans text-stone-400 mt-1">
            The final prayer of the Liturgy of the Hours before sleep.
          </p>
        </div>
        <div className="flex gap-1.5 font-sans">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-350 ${
                i <= step ? "w-5 bg-amber-500" : "w-1.5 bg-stone-850"
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="text-center space-y-4 py-3">
              <h4 className="font-display text-xl text-amber-100 font-medium">† The Silent Examination</h4>
              <p className="text-stone-300 text-sm leading-relaxed max-w-md mx-auto italic">
                "In the name of the Father, and of the Son, and of the Holy Spirit. Amen."
              </p>
              
              <div className="p-5 bg-[#12110f] rounded-xl border border-stone-850 text-left space-y-3 font-sans">
                <span className="font-sans font-bold text-[10px] uppercase text-amber-400 tracking-wider">Examination of Conscience</span>
                <p className="text-stone-300 text-sm leading-relaxed">
                  Spend a silent moment recalling the failures, selfish choices, or missed opportunities of the day. Do not hide your wounds from the Good Shepherd.
                </p>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    id="btn-examine-conscience"
                    onClick={() => setConscienceExamined(true)}
                    className={`text-xs font-sans px-3 py-1.5 rounded-md border flex items-center gap-1.5 transition-all cursor-pointer ${
                      conscienceExamined
                        ? "bg-emerald-950/40 text-emerald-400 border-emerald-900"
                        : "bg-transparent border-stone-800 text-stone-400 hover:text-stone-100 hover:bg-[#1e1c19]"
                    }`}
                  >
                    <EyeOff size={12} /> {conscienceExamined ? "Conscience Examined" : "Mark Moment of Silence"}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 font-sans">
              <button
                id="btn-night-step1-next"
                onClick={() => setStep(2)}
                disabled={!conscienceExamined}
                className={`font-sans text-xs tracking-wide px-5 py-2.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
                  conscienceExamined
                    ? "bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold"
                    : "bg-[#252320] text-stone-500 cursor-not-allowed border border-stone-900"
                }`}
              >
                Hymn & Antiphon <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="space-y-5">
              <div className="bg-[#12110f] border border-stone-850 p-5 rounded-xl text-center space-y-3">
                <span className="text-xs font-sans uppercase font-bold text-amber-400 block tracking-widest">
                  The Compline Hymn
                </span>
                <p className="text-stone-200 italic text-[14.5px] leading-relaxed max-w-lg mx-auto">
                  "Before the ending of the day, <br />
                  Creator of the world, we pray <br />
                  That with Thy wonted favour Thou <br />
                  Wouldst be our Guard and Keeper now."
                </p>
              </div>

              <div className="bg-[#12110f]/40 border border-amber-900/20 p-4 rounded-xl text-left space-y-1.5">
                <span className="text-[10px] font-sans uppercase font-semibold text-amber-500 block tracking-wider">
                  Traditional Antiphon
                </span>
                <p className="text-stone-300 text-sm font-serif leading-relaxed italic pr-4">
                  “Protect us, Lord, as we stay awake; watch over us as we sleep, that awake we may keep watch with Christ, and asleep, rest in His peace.”
                </p>
              </div>
            </div>

            <div className="flex justify-between font-sans text-xs pt-4 border-t border-stone-800">
              <button
                id="btn-night-step2-prev"
                onClick={() => setStep(1)}
                className="flex items-center gap-1 text-stone-400 hover:text-stone-200 cursor-pointer"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <button
                id="btn-night-step2-next"
                onClick={() => setStep(3)}
                className="bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold px-4 py-2 rounded-lg flex items-center gap-1 shadow-sm cursor-pointer"
              >
                Pray Psalm <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-5"
          >
            <div className="space-y-4">
              <div className="text-center font-sans">
                <span className="font-sans font-bold text-xs uppercase text-amber-400 tracking-wider">Psalm 4</span>
                <h4 className="font-display text-lg text-amber-100 font-bold">Confidence in God's Night-Shield</h4>
              </div>

              <div className="bg-[#12110f] p-5 rounded-xl border border-stone-850 max-h-60 overflow-y-auto space-y-3 font-serif text-[13.5px] leading-relaxed italic text-stone-300">
                <p>
                  "When I call, answer me, O God of my justice. In my distress, You set me free. Have mercy on me and hear my prayer."
                </p>
                <p>
                  "Know that the Lord does wonders for His faithful one; the Lord hears when I call to Him. Tremble, and do not sin: speak in your hearts upon your beds, and be silent."
                </p>
                <p>
                  "I will lie down in peace, and sleep comes at once; for You alone, Lord, make me dwell in safety."
                </p>
              </div>
            </div>

            <div className="flex justify-between font-sans text-xs pt-4 border-t border-stone-800">
              <button
                id="btn-night-step3-prev"
                onClick={() => setStep(2)}
                className="flex items-center gap-1 text-stone-400 hover:text-stone-200 cursor-pointer"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <button
                id="btn-night-step3-next"
                onClick={() => setStep(4)}
                className="bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold px-4 py-2 rounded-lg flex items-center gap-1 shadow-sm cursor-pointer"
              >
                Canticle of Simeon <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-5"
          >
            <div className="space-y-4">
              <div className="bg-[#12110f]/50 p-4 rounded-xl border border-stone-850 text-center">
                <span className="font-sans text-[10px] uppercase font-bold text-stone-400 block tracking-widest mb-1">
                  Brief Scripture & Responsory
                </span>
                <p className="text-stone-300 text-sm leading-relaxed max-w-md mx-auto italic">
                  "You, O Lord, are in our midst, and we are called by Your name. Do not desert us, O Lord our God." <cite className="block text-[10px] font-sans font-bold text-amber-500 mt-1">Jeremiah 14:9</cite>
                </p>
              </div>

              <div className="bg-amber-955/15 bg-opacity-20 border border-amber-900/30 p-5 rounded-xl text-center space-y-2">
                <span className="font-sans font-bold text-xs uppercase text-amber-400 tracking-wider">
                  The Canticle of Simeon (Nunc Dimittis)
                </span>
                <p className="text-stone-200 text-[14px] leading-relaxed italic">
                  “Now, Lord, You let Your servant go in peace, according to Your word. 
                  For my eyes have seen Your salvation, which You have prepared in the sight of all peoples: 
                  A Light to reveal You to the nations, and the glory of Your people Israel.”
                </p>
              </div>
            </div>

            <div className="flex justify-between font-sans text-xs pt-4 border-t border-stone-800">
              <button
                id="btn-night-step4-prev"
                onClick={() => setStep(3)}
                className="flex items-center gap-1 text-stone-400 hover:text-stone-200 cursor-pointer"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <button
                id="btn-night-step4-next"
                onClick={() => setStep(5)}
                className="bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold px-4 py-2 rounded-lg flex items-center gap-1 shadow-sm cursor-pointer"
              >
                Marian Antiphon <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="bg-[#12110f] border border-stone-850 p-4 rounded-xl text-center space-y-2">
                <span className="font-sans text-[10px] uppercase font-bold text-amber-500 block tracking-widest">
                  Concluding Prayer
                </span>
                <p className="text-stone-300 text-xs italic leading-relaxed">
                  "Visit this house, we pray You, Lord; drive far from it all snares of the enemy. May Your holy angels dwell here to keep us in peace, and may Your blessing be always upon us. Through Christ our Lord. Amen."
                </p>
              </div>

              <div className="bg-[#12110f]/40 border border-stone-850 p-4 rounded-xl text-center space-y-2.5">
                <span className="font-sans text-[10px] uppercase font-bold text-amber-400 block tracking-widest">
                  Salve Regina (Hail Holy Queen)
                </span>
                <p className="text-stone-200 text-xs italic leading-relaxed max-w-md mx-auto">
                  "Hail, Holy Queen, Mother of Mercy, our life, our sweetness, and our hope. To thee do we cry, poor banished children of Eve. To thee do we send up our sighs, mourning and weeping in this valley of tears... Turn then, most gracious advocate, thine eyes of mercy toward us, and after this our exile, show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary. Amen."
                </p>
              </div>

              <div className="text-center font-display text-amber-100 text-base py-1">
                † May the all-powerful Lord grant us a quiet night and a perfect end. Amen.
              </div>
            </div>

            <div className="flex justify-between font-sans text-xs pt-4 border-t border-stone-800">
              <button
                id="btn-night-step5-prev"
                onClick={() => setStep(4)}
                className="flex items-center gap-1 text-stone-400 hover:text-stone-200 cursor-pointer"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <button
                id="btn-night-finish"
                onClick={onClose}
                className="bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold px-6 py-2.5 rounded-lg flex items-center gap-1 shadow-md cursor-pointer"
              >
                Close Compline <Check size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
