import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { JournalEntry } from "../types";
import { Moon, ArrowLeft, ArrowRight, Book, PenTool, CheckCircle } from "lucide-react";

interface EveningExamenProps {
  onSaveJournal: (entry: Omit<JournalEntry, "id" | "timestamp">) => void;
  onClose: () => void;
}

export default function EveningExamen({ onSaveJournal, onClose }: EveningExamenProps) {
  const [step, setStep] = useState(1);
  const [gratitudeText, setGratitudeText] = useState("");
  const [reviewFocus, setReviewFocus] = useState<"morning" | "afternoon" | "evening" | null>(null);
  const [sorrowText, setSorrowText] = useState("");
  const [hopeText, setHopeText] = useState("");
  const [contritionType, setContritionType] = useState<"traditional" | "simple">("simple");

  const nextStep = () => setStep((s) => Math.min(s + 1, 6));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleFinish = () => {
    const textRef = [
      `Gratitude: ${gratitudeText || "Quiet thanks."}`,
      `Sorrow/Failures: ${sorrowText || "None specified."}`,
      `Tomorrow's Grace: ${hopeText || "Perseverance aligned with God's will."}`
    ].join(" | ");

    onSaveJournal({
      category: "Evening Examen",
      text: textRef,
      details: {
        gratitude: gratitudeText,
        sorrow: sorrowText,
        hope: hopeText
      }
    });
    onClose();
  };

  return (
    <div id="examen-prayer-panel" className="prayer-card bg-[#161412] text-[#e5e0d5] rounded-2xl p-6 md:p-8 max-w-2xl mx-auto border border-stone-800 shadow-sm relative overflow-hidden font-serif">
      {/* Decorative Vatican Gold Header Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-neutral-800" />

      {/* Progress display */}
      <div className="flex justify-between items-center mb-6 mt-2">
        <div>
          <h3 className="text-xs font-sans uppercase tracking-widest text-[#e5e0d5] font-bold flex items-center gap-1.5">
            <Moon size={14} className="text-amber-500" /> Ignatian Evening Examen
          </h3>
        </div>
        <div className="flex gap-1.5 font-sans">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-350 ${
                i <= step ? "w-5 bg-amber-500" : "w-1.5 bg-stone-800"
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
            <div className="text-center space-y-4 py-4">
              <h4 className="font-display text-xl text-amber-100 font-semibold">
                † Presence and Loving Gaze
              </h4>
              <p className="text-stone-300 italic leading-relaxed text-sm max-w-md mx-auto">
                Begin with the Sign of the Cross: "In the name of the Father, and of the Son, and of the Holy Spirit. Amen."
              </p>
              <div className="p-5 bg-[#12110f] rounded-xl max-w-md mx-auto border border-stone-850 text-left space-y-2 font-sans">
                <span className="font-sans font-bold text-xs uppercase text-amber-500 block">Step 1: Quiet Awareness</span>
                <p className="text-stone-300 text-sm leading-relaxed">
                  Become aware of God's warm, loving gaze. Take a slow, quiet breath. Know that the Lord is not here to critique you, but to hold you and companion you through your memories of today.
                </p>
              </div>
            </div>

            <div className="flex justify-center font-sans">
              <button
                id="btn-examen-start"
                onClick={nextStep}
                className="bg-amber-600 hover:bg-amber-500 text-neutral-950 font-sans text-xs tracking-wide px-5 py-2.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-all font-bold cursor-pointer"
              >
                Recall Gratitude <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-5"
          >
            <div className="space-y-4">
              <div className="bg-amber-95/15 bg-opacity-20 p-4 rounded-xl border border-amber-900/30 text-center">
                <span className="font-sans font-bold text-xs uppercase text-amber-400 tracking-wider">Step 2: Gratitude</span>
                <p className="text-stone-200 text-sm italic mt-2 leading-relaxed">
                  "I thank You, Lord, for the gift of life, and for the specific graces of these hours."
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-sans uppercase font-bold text-stone-400 flex items-center gap-1">
                  <PenTool size={13} className="text-amber-500" /> Record two or three specific blessings or gifts you received today:
                </label>
                <textarea
                  id="examen-gratitude-input"
                  rows={4}
                  value={gratitudeText}
                  onChange={(e) => setGratitudeText(e.target.value)}
                  placeholder="Today I am grateful for the safety of my children, a quiet conversation during lunch, and the strength to finish my projects..."
                  className="w-full text-sm font-sans p-3 bg-[#1e1c19] rounded-lg border border-stone-800 focus:outline-none focus:ring-1 focus:ring-[#1e1c19] text-stone-100 shadow-inner italic"
                />
              </div>
            </div>

            <div className="flex justify-between font-sans text-xs pt-4 border-t border-stone-800">
              <button
                id="btn-step2-back"
                onClick={prevStep}
                className="flex items-center gap-1 text-stone-400 hover:text-stone-200 cursor-pointer"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <button
                id="btn-step2-next"
                onClick={nextStep}
                className="bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold px-4 py-2 rounded-lg flex items-center gap-1 shadow-sm cursor-pointer"
              >
                Review the Day <ArrowRight size={14} />
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
                <span className="font-sans font-bold text-xs uppercase text-stone-400 tracking-wider">Step 3: Review the Day</span>
                <h4 className="font-display text-lg text-amber-100 mt-1 font-bold">Walk Hour by Hour</h4>
                <p className="text-stone-300 text-xs italic mt-1 leading-relaxed max-w-sm mx-auto font-serif">
                  Gently replay your day like a film. Notice where God's hand was at work, and identify moments where you felt consolation or desolation.
                </p>
              </div>

              {/* Interactive Timeline Review */}
              <div className="grid grid-cols-3 gap-2.5 pt-2 font-sans">
                <button
                  id="review-morning"
                  type="button"
                  onClick={() => setReviewFocus("morning")}
                  className={`p-3 rounded-lg border text-center transition-all cursor-pointer ${
                    reviewFocus === "morning"
                      ? "bg-amber-950/45 border-amber-550 text-amber-200 font-bold"
                      : "bg-[#12110f] border-stone-800 hover:bg-stone-900 text-stone-400"
                  }`}
                >
                  <span className="block text-xs font-sans font-bold">Morning</span>
                  <span className="text-[10px] italic">Waking to Noon</span>
                </button>
                <button
                  id="review-afternoon"
                  type="button"
                  onClick={() => setReviewFocus("afternoon")}
                  className={`p-3 rounded-lg border text-center transition-all cursor-pointer ${
                    reviewFocus === "afternoon"
                      ? "bg-amber-950/45 border-amber-550 text-amber-200 font-bold"
                      : "bg-[#12110f] border-stone-800 hover:bg-stone-900 text-stone-400"
                  }`}
                >
                  <span className="block text-xs font-sans font-bold">Afternoon</span>
                  <span className="text-[10px] italic">Noon to 5 PM</span>
                </button>
                <button
                  id="review-evening"
                  type="button"
                  onClick={() => setReviewFocus("evening")}
                  className={`p-3 rounded-lg border text-center transition-all cursor-pointer ${
                    reviewFocus === "evening"
                      ? "bg-amber-950/45 border-amber-550 text-amber-200 font-bold"
                      : "bg-[#12110f] border-stone-800 hover:bg-stone-900 text-stone-400"
                  }`}
                >
                  <span className="block text-xs font-sans font-bold">Evening</span>
                  <span className="text-[10px] italic">5 PM to Night</span>
                </button>
              </div>

              <AnimatePresence mode="wait">
                {reviewFocus && (
                  <motion.div
                    key={reviewFocus}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-[#12110f] rounded-lg text-xs text-stone-300 leading-relaxed italic border border-stone-800 font-serif"
                  >
                    {reviewFocus === "morning" && (
                      <span>Think of your initial disposition. Did you offer your morning activities in charity? Were you hurried or peaceful? Let us pause and remember...</span>
                    )}
                    {reviewFocus === "afternoon" && (
                      <span>Reflect on your direct interactions with persons, family, and colleagues. Did you speak patiently? Did you notice God's gentle presence in the midst of labour?</span>
                    )}
                    {reviewFocus === "evening" && (
                      <span>Remember your transition into your home space or private hour. Did you seek quiet restoration, or did you fall into mindless distractions? Rest with the memory.</span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex justify-between font-sans text-xs pt-4 border-t border-stone-800">
              <button
                id="btn-step3-back"
                onClick={prevStep}
                className="flex items-center gap-1 text-stone-400 hover:text-stone-200 cursor-pointer"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <button
                id="btn-step3-next"
                onClick={nextStep}
                className="bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold px-4 py-2 rounded-lg flex items-center gap-1 shadow-sm cursor-pointer"
              >
                Acknowledge Sorrow <ArrowRight size={14} />
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
              <div className="bg-red-950/20 p-4 rounded-xl border border-red-900/30 text-center">
                <span className="font-sans font-bold text-xs uppercase text-red-450 tracking-wider">Step 4: Sorrow & Mercy</span>
                <p className="text-stone-200 text-sm italic mt-2 leading-relaxed">
                  "O God, have mercy on me, a sinner. Grant me the grace of honest conversion."
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-sans uppercase font-bold text-stone-400 flex items-center gap-1">
                  <PenTool size={13} className="text-amber-500" /> Confess your shortcomings, failures in charity, or sins today:
                </label>
                <textarea
                  id="examen-sorrow-input"
                  rows={4}
                  value={sorrowText}
                  onChange={(e) => setSorrowText(e.target.value)}
                  placeholder="Lord, forgive my impatience with my family this afternoon, my self-pity when things went wrong, and my lack of trust..."
                  className="w-full text-sm font-sans p-3 bg-[#1e1c19] rounded-lg border border-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-600 text-stone-100 shadow-inner italic"
                />
              </div>
            </div>

            <div className="flex justify-between font-sans text-xs pt-4 border-t border-stone-800">
              <button
                id="btn-step4-back"
                onClick={prevStep}
                className="flex items-center gap-1 text-stone-400 hover:text-stone-200 cursor-pointer"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <button
                id="btn-step4-next"
                onClick={nextStep}
                className="bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold px-4 py-2 rounded-lg flex items-center gap-1 shadow-sm cursor-pointer"
              >
                Act of Contrition <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-5"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-stone-800 pb-2">
                <span className="font-sans font-bold text-xs uppercase text-amber-200">Act of Contrition</span>
                
                <div className="flex gap-2 font-sans text-[10px]">
                  <button
                    id="contrition-simple"
                    onClick={() => setContritionType("simple")}
                    className={`px-2 py-0.5 rounded cursor-pointer ${contritionType === "simple" ? "bg-amber-600 text-neutral-950 font-bold" : "bg-stone-800 text-stone-300"}`}
                  >
                    Simple
                  </button>
                  <button
                    id="contrition-traditional"
                    onClick={() => setContritionType("traditional")}
                    className={`px-2 py-0.5 rounded cursor-pointer ${contritionType === "traditional" ? "bg-amber-600 text-neutral-950 font-bold" : "bg-stone-800 text-stone-300"}`}
                  >
                    Traditional
                  </button>
                </div>
              </div>

              <div className="bg-[#12110f] p-5 rounded-xl border border-stone-850 text-center font-serif leading-relaxed italic text-[14.5px] text-stone-200">
                {contritionType === "simple" ? (
                  <div>
                    "My God, I am sorry for my sins with all my heart. In choosing to do wrong and failing to do good, I have sinned against You whom I should love above all things. I firmly intend, with Your help, to do penance, to sin no more, and to avoid whatever leads me to sin. Amen."
                  </div>
                ) : (
                  <div>
                    "O my God, I am heartily sorry for having offended Thee, and I detest all my sins because of Thy just punishments, but most of all because they offend Thee, my God, who art all good and deserving of all my love. I firmly resolve with the help of Thy grace to sin no more and to avoid the near occasion of sin. Amen."
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between font-sans text-xs pt-4 border-t border-stone-800">
              <button
                id="btn-step5-back"
                onClick={prevStep}
                className="flex items-center gap-1 text-stone-400 hover:text-stone-200 cursor-pointer"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <button
                id="btn-step5-next"
                onClick={nextStep}
                className="bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold px-4 py-2 rounded-lg flex items-center gap-1 shadow-sm cursor-pointer"
              >
                Hope for Tomorrow <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 6 && (
          <motion.div
            key="step6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-5"
          >
            <div className="space-y-4">
              <div className="text-center font-sans">
                <span className="font-sans font-bold text-xs uppercase text-amber-450 tracking-wider">Step 5: Hope & The Our Father</span>
                <h4 className="font-display text-lg text-amber-100 mt-1 font-bold">Gazing at Tomorrow</h4>
              </div>

              <div className="space-y-2 font-sans">
                <label className="text-xs font-sans uppercase font-bold text-stone-400 flex items-center gap-1">
                  <PenTool size={13} className="text-amber-500" /> What specific grace or strength do you request from the Lord for tomorrow?
                </label>
                <input
                  id="examen-hope-input"
                  type="text"
                  value={hopeText}
                  onChange={(e) => setHopeText(e.target.value)}
                  placeholder="I seek the grace of supreme patience during conflict, and peace in my schedule..."
                  className="w-full text-xs font-sans p-2.5 bg-[#1e1c19] rounded-lg border border-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500/50 text-stone-100 shadow-inner italic"
                />
              </div>

              <div className="bg-[#12110f] p-4 rounded-xl border border-stone-850 space-y-2 text-center">
                <p className="text-xs font-sans font-bold text-amber-400 uppercase tracking-widest mb-1">
                  Conclude with the Our Father
                </p>
                <p className="text-[13.5px] leading-relaxed text-stone-200 italic font-serif">
                  "Our Father, who art in heaven, hallowed be thy name; thy kingdom come; thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen."
                </p>
              </div>
            </div>

            <div className="flex justify-between font-sans text-xs pt-4 border-t border-stone-800">
              <button
                id="btn-step6-back"
                onClick={prevStep}
                className="flex items-center gap-1 text-stone-400 hover:text-stone-200 cursor-pointer"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <button
                id="btn-examen-finish"
                onClick={handleFinish}
                className="bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold px-6 py-2.5 rounded-lg flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                Commit Examen <CheckCircle size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
