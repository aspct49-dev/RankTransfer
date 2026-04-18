"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import ImageUpload from "@/components/ImageUpload";
import { RoobetGradient } from "@/components/ui/stripe-gradient";
import { ShineBorder } from "@/components/ui/shine-border";
import { Text_03 } from "@/components/ui/wave-text";
import { sanitizeText } from "@/lib/fileValidation";
import toast from "react-hot-toast";

const LOSSBACK_OPTIONS = ["10%", "15%", "20%", "N/A"];

export default function Home() {
  const [roobetName, setRoobetName] = useState("");
  const [discordUsername, setDiscordUsername] = useState("");
  const [gamesPlayed, setGamesPlayed] = useState("");
  const [vipLossback, setVipLossback] = useState("");
  const [last30DaysProof, setLast30DaysProof] = useState<File[]>([]);
  const [totalWagerProof, setTotalWagerProof] = useState<File[]>([]);
  const [kycHelp, setKycHelp] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!roobetName.trim() || !gamesPlayed.trim() || !vipLossback || last30DaysProof.length === 0 || totalWagerProof.length === 0) {
      toast.error("Please fill in all fields and upload required screenshots.");
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("roobetName", sanitizeText(roobetName));
      formData.append("discordUsername", sanitizeText(discordUsername));
      formData.append("gamesPlayed", sanitizeText(gamesPlayed));
      formData.append("vipLossback", vipLossback);
      formData.append("kycHelp", kycHelp === true ? "Yes" : kycHelp === false ? "No" : "Not specified");
      last30DaysProof.forEach((f) => formData.append("last30DaysProof", f));
      totalWagerProof.forEach((f) => formData.append("totalWagerProof", f));

      const res = await fetch("/api/submit", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setSubmitted(true);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0b0d1a" }}>
        <RoobetGradient />
        <div className="fixed inset-0 pointer-events-none" style={{ background: "rgba(8,5,28,0.55)", zIndex: 0 }} />
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl border border-[rgba(245,197,24,0.2)] p-8 md:p-12 text-center max-w-md w-full gold-glow"
          style={{ zIndex: 1 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
            className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "linear-gradient(135deg, #f0b429, #ffd740)" }}
          >
            <svg className="w-7 h-7 md:w-8 md:h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          <h2 className="text-lg md:text-xl font-bold text-white mb-2">Application Submitted!</h2>
          <p className="text-white/40 text-sm mb-6 leading-relaxed">
            Your application has been sent to our team. You&apos;ll be contacted within 24–48 hours with your offer.
          </p>
          <button
            onClick={() => { setSubmitted(false); setRoobetName(""); setGamesPlayed(""); setVipLossback(""); setLast30DaysProof([]); setTotalWagerProof([]); }}
            className="btn-secondary text-sm w-full justify-center"
          >
            Submit Another
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center" style={{ background: "#0b0d1a", overflowX: "hidden" }}>
      <RoobetGradient />
      <div className="fixed inset-0 pointer-events-none" style={{ background: "rgba(8,5,28,0.55)", zIndex: 0 }} />

      {/* Top banner */}
      <div className="w-full flex flex-wrap items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium" style={{ background: "rgba(18,15,40,0.9)", borderBottom: "1px solid rgba(240,180,41,0.15)", zIndex: 10, position: "relative" }}>
        <span style={{ color: "#f0b429" }}>★</span>
        <span className="text-white/80 text-xs sm:text-sm text-center">Sign up with code <span className="font-bold" style={{ color: "#f0b429" }}>DOUG</span> for exclusive lossback</span>
        <a
          href="https://roobet.com/?ref=doug"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary shrink-0"
          style={{ padding: "5px 14px", fontSize: "11px", borderRadius: "8px" }}
        >
          SIGN UP →
        </a>
      </div>

      <div className="w-full px-4 py-6 sm:py-8 md:py-12 flex flex-col items-center" style={{ boxSizing: "border-box" }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 md:mb-8 relative w-full"
        style={{ zIndex: 1 }}
      >
        <div className="flex items-center justify-center mb-4">
          <Image
            src="/rank_logo.png"
            alt="RankTransfer"
            width={150}
            height={50}
            className="object-contain w-[130px] md:w-[180px]"
            priority
          />
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="font-black text-white mb-2 font-modernist text-xl sm:text-2xl md:text-3xl px-2"
        >
          <Text_03
            text="VIP Rank Transfer Application"
            className="font-black text-white font-modernist text-xl sm:text-2xl md:text-3xl"
          />
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
          className="text-white/40 text-xs md:text-sm px-4"
        >
          Fill in your details below. Our team will review and contact you within 24–48 hours.
        </motion.p>
      </motion.div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-xl relative mx-auto"
        style={{ zIndex: 1 }}
      >
        <ShineBorder
          borderRadius={20}
          borderWidth={2}
          duration={20}
          color={["#ffc200", "#45107a", "#f0b429", "#7c1fd4", "#ffd700"]}
        >
          <form onSubmit={handleSubmit} className="w-full p-3 sm:p-5 md:p-8 space-y-4 sm:space-y-5">

            {/* Roobet Name */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-white/80">
                Roobet Username <span className="text-[#f0b429]">*</span>
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Your exact Roobet display name"
                value={roobetName}
                onChange={(e) => setRoobetName(e.target.value)}
                maxLength={50}
                autoComplete="off"
                autoCapitalize="off"
              />
            </div>

            {/* Discord Username */}
            <div className="border-t border-white/5 pt-4 space-y-1.5">
              <label className="block text-sm font-semibold text-white/80">
                Discord Username <span className="text-white/30 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. username or user#1234"
                value={discordUsername}
                onChange={(e) => setDiscordUsername(e.target.value)}
                maxLength={50}
                autoComplete="off"
                autoCapitalize="off"
              />
            </div>

            {/* Last 30 Days Proof */}
            <div className="border-t border-white/5 pt-5">
              <ImageUpload
                label="Last 30 Days Wager Stats (screenshots)"
                files={last30DaysProof}
                onChange={setLast30DaysProof}
              />
            </div>

            {/* Total Wager Proof */}
            <div className="border-t border-white/5 pt-5">
              <ImageUpload
                label="Total Wager Stats (screenshots)"
                files={totalWagerProof}
                onChange={setTotalWagerProof}
              />
            </div>

            {/* Primary Games */}
            <div className="border-t border-white/5 pt-5 space-y-1.5">
              <label className="block text-sm font-semibold text-white/80">
                Primary Games Played <span className="text-[#f0b429]">*</span>
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Slots, Crash, Sports"
                value={gamesPlayed}
                onChange={(e) => setGamesPlayed(e.target.value)}
                maxLength={100}
              />
            </div>

            {/* VIP Lossback */}
            <div className="border-t border-white/5 pt-5 space-y-2">
              <label className="block text-sm font-semibold text-white/80">
                Current VIP Lossback <span className="text-[#f0b429]">*</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {LOSSBACK_OPTIONS.map((opt) => (
                  <motion.button
                    key={opt}
                    type="button"
                    onClick={() => setVipLossback(opt)}
                    whileTap={{ scale: 0.96 }}
                    className="rounded-xl border py-3 text-sm font-bold transition-all"
                    style={{
                      borderColor: vipLossback === opt ? "#f0b429" : "rgba(255,255,255,0.1)",
                      background: vipLossback === opt ? "rgba(240,180,41,0.12)" : "rgba(255,255,255,0.03)",
                      color: vipLossback === opt ? "#f0b429" : "rgba(255,255,255,0.45)",
                    }}
                  >
                    {opt}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* KYC Help */}
            <div className="border-t border-white/5 pt-5 space-y-2">
              <label className="block text-sm font-semibold text-white/80">
                Do you need help with KYC?
              </label>
              <div className="flex gap-3">
                {([true, false] as const).map((val) => (
                  <button
                    key={String(val)}
                    type="button"
                    onClick={() => setKycHelp(val)}
                    className="flex-1 rounded-xl border py-3 text-sm font-bold transition-all"
                    style={{
                      borderColor: kycHelp === val ? "#f0b429" : "rgba(255,255,255,0.1)",
                      background: kycHelp === val ? "rgba(240,180,41,0.12)" : "rgba(255,255,255,0.03)",
                      color: kycHelp === val ? "#f0b429" : "rgba(255,255,255,0.45)",
                    }}
                  >
                    {val ? "Yes" : "No"}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="border-t border-white/5 pt-5">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed text-base"
                style={submitting ? { transform: "none", boxShadow: "none" } : {}}
              >
                {submitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting...
                  </>
                ) : "Submit Application"}
              </button>
              <p className="text-white/20 text-xs text-center mt-3">
                Your information is kept confidential and only reviewed by our team.
              </p>
            </div>

          </form>
        </ShineBorder>
      </motion.div>
    </div>
    </div>
  );
}
