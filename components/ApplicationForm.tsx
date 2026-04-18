"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import ImageUpload from "./ImageUpload";
import { GameType, VIPLossback } from "@/types";
import { sanitizeText } from "@/lib/fileValidation";

const GAMES: GameType[] = ["Slots", "Sports", "Keno", "Table Games", "Crash"];
const LOSSBACK_OPTIONS: VIPLossback[] = ["10%", "15%", "20%", "N/A"];

const GAME_ICONS: Record<GameType, string> = {
  Slots: "🎰",
  Sports: "⚽",
  Keno: "🎱",
  "Table Games": "🃏",
  Crash: "📈",
};

export default function ApplicationForm() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [roobetName, setRoobetName] = useState("");
  const [gamesPlayed, setGamesPlayed] = useState<GameType[]>([]);
  const [vipLossback, setVipLossback] = useState<VIPLossback | "">("");
  const [last30DaysProof, setLast30DaysProof] = useState<File[]>([]);
  const [totalWagerProof, setTotalWagerProof] = useState<File[]>([]);

  const toggleGame = (game: GameType) => {
    setGamesPlayed((prev) =>
      prev.includes(game) ? prev.filter((g) => g !== game) : [...prev, game]
    );
  };

  const canProceedStep1 = roobetName.trim().length >= 2;
  const canProceedStep2 = last30DaysProof.length > 0 && totalWagerProof.length > 0;
  const canSubmit = gamesPlayed.length > 0 && vipLossback !== "";

  const handleReset = () => {
    setSubmitted(false);
    setStep(1);
    setRoobetName("");
    setGamesPlayed([]);
    setVipLossback("");
    setLast30DaysProof([]);
    setTotalWagerProof([]);
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canProceedStep2 || !canSubmit) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("roobetName", sanitizeText(roobetName));
      formData.append("gamesPlayed", JSON.stringify(gamesPlayed));
      formData.append("vipLossback", vipLossback);
      last30DaysProof.forEach((f) => formData.append("last30DaysProof", f));
      totalWagerProof.forEach((f) => formData.append("totalWagerProof", f));

      const res = await fetch("/api/submit", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Submission failed");

      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return <SuccessView onNew={handleReset} />;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass rounded-2xl border border-white/10 overflow-hidden">
        {/* Step Indicator */}
        <div className="px-8 pt-8 pb-4">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <motion.div
                  animate={{
                    background:
                      s < step
                        ? "linear-gradient(135deg, #f5c518, #ffd740)"
                        : s === step
                        ? "linear-gradient(135deg, #f5c518, #ffd740)"
                        : "rgba(255,255,255,0.08)",
                    scale: s === step ? 1.1 : 1,
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ color: s <= step ? "#0d0d0f" : "rgba(255,255,255,0.25)" }}
                >
                  {s < step ? "✓" : s}
                </motion.div>
                {s < 3 && (
                  <div className="h-0.5 w-20 md:w-36 mx-2 rounded overflow-hidden bg-white/10">
                    <motion.div
                      animate={{ width: s < step ? "100%" : "0%" }}
                      className="h-full"
                      style={{ background: "linear-gradient(to right, #f5c518, #ffd740)" }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-white/30 mt-1 px-0.5">
            <span>Your Info</span>
            <span className="ml-4">Upload Proof</span>
            <span>Game Details</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-8 pt-2">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Your Roobet Account</h2>
                  <p className="text-white/40 text-sm">Enter your exact Roobet username.</p>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white/80">
                    Roobet Username
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. CryptoKing99"
                    value={roobetName}
                    onChange={(e) => setRoobetName(e.target.value)}
                    maxLength={50}
                    autoComplete="off"
                    spellCheck={false}
                  />
                  <p className="text-white/30 text-xs">
                    Must match your exact Roobet display name.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!canProceedStep1}
                  className="btn-primary w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                  style={canProceedStep1 ? {} : { transform: "none", boxShadow: "none" }}
                >
                  Continue
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Upload Proof Screenshots</h2>
                  <p className="text-white/40 text-sm">
                    Screenshots are sent securely to our review team.
                  </p>
                </div>

                <ImageUpload
                  label="Last 30 Days Wager Stats"
                  files={last30DaysProof}
                  onChange={setLast30DaysProof}
                />
                <div className="border-t border-white/5" />
                <ImageUpload
                  label="Total Wager Stats Proof"
                  files={totalWagerProof}
                  onChange={setTotalWagerProof}
                />

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn-secondary text-sm"
                    style={{ padding: "13px 20px", flexShrink: 0 }}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={!canProceedStep2}
                    className="btn-primary flex-1 justify-center text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                    style={canProceedStep2 ? {} : { transform: "none", boxShadow: "none" }}
                  >
                    Continue
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Game Preferences</h2>
                  <p className="text-white/40 text-sm">
                    Help us tailor the best offer for you.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white/80">
                    Primary Games Played
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {GAMES.map((game) => {
                      const selected = gamesPlayed.includes(game);
                      return (
                        <motion.button
                          key={game}
                          type="button"
                          onClick={() => toggleGame(game)}
                          whileTap={{ scale: 0.96 }}
                          className="flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all"
                          style={{
                            borderColor: selected ? "#f5c518" : "rgba(255,255,255,0.1)",
                            background: selected ? "rgba(245,197,24,0.1)" : "rgba(255,255,255,0.03)",
                            color: selected ? "#fff" : "rgba(255,255,255,0.5)",
                          }}
                        >
                          <span>{GAME_ICONS[game]}</span>
                          {game}
                          {selected && (
                            <span className="ml-auto text-[#f5c518] text-xs">✓</span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white/80">
                    Current VIP Lossback
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {LOSSBACK_OPTIONS.map((opt) => {
                      const selected = vipLossback === opt;
                      return (
                        <motion.button
                          key={opt}
                          type="button"
                          onClick={() => setVipLossback(opt)}
                          whileTap={{ scale: 0.96 }}
                          className="rounded-xl border px-4 py-3 text-sm font-bold transition-all"
                          style={{
                            borderColor: selected ? "#f5c518" : "rgba(255,255,255,0.1)",
                            background: selected ? "rgba(245,197,24,0.1)" : "rgba(255,255,255,0.03)",
                            color: selected ? "#f5c518" : "rgba(255,255,255,0.5)",
                          }}
                        >
                          {opt}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div className="glass-gold rounded-xl p-4 flex gap-3">
                  <span className="text-[#f5c518] mt-0.5 flex-shrink-0">🔒</span>
                  <p className="text-white/60 text-xs leading-relaxed">
                    Your data and screenshots are sent securely to our review team and never shared with third parties.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn-secondary text-sm flex-shrink-0"
                    style={{ padding: "13px 20px" }}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={!canSubmit || submitting}
                    className="btn-primary flex-1 justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                    style={canSubmit && !submitting ? {} : { transform: "none", boxShadow: "none" }}
                  >
                    {submitting ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}

function SuccessView({ onNew }: { onNew: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="glass rounded-2xl border border-[rgba(245,197,24,0.2)] p-12 text-center gold-glow">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "linear-gradient(135deg, #f5c518, #ffd740)" }}
        >
          <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-3">Application Submitted!</h2>
        <p className="text-white/50 mb-2 text-sm leading-relaxed">
          Your VIP rank transfer application has been received and forwarded to our team via Discord.
        </p>
        <p className="text-white/30 text-xs mb-8">
          You&apos;ll be contacted within 24–48 hours with your customized offer.
        </p>
        <button onClick={onNew} className="btn-secondary text-sm">
          Submit Another Application
        </button>
      </div>
    </motion.div>
  );
}
