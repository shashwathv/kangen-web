import { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionValueEvent } from "framer-motion";
import { STEPS } from "../../constants";
import FloatingKanji from "./FloatingKanji";

function useElapsed(active) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [active]);
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function StepIcon({ step, state }) {
  return (
    <div style={{
      position: "relative", width: 38, height: 38, borderRadius: 9, flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
      background: state === "done" ? "var(--jade)" : state === "active" ? "var(--jade-dim)" : "var(--surface3)",
      border: state === "active" ? "1.5px solid var(--jade)" : "1px solid var(--border-hover)",
      transition: "background 0.35s ease, border-color 0.35s ease",
    }}>
      {state === "active" && (
        <motion.div
          style={{ position: "absolute", inset: -4, borderRadius: 11, border: "1.5px solid var(--jade-border)" }}
          animate={{ opacity: [0.9, 0, 0.9], scale: [1, 1.28, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={state}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 22 }}
          style={{ color: state === "done" ? "#0B0A08" : "var(--text1)", fontWeight: 700, lineHeight: 1 }}
        >
          {state === "done" ? "✓" : step.icon}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function AnimatedPercent({ value }) {
  const [display, setDisplay] = useState(Math.round(value.get()));
  useMotionValueEvent(value, "change", (v) => setDisplay(Math.round(v)));
  return <>{display}% complete</>;
}

export default function ProcessingView({ stepIndex, filename }) {
  const elapsed = useElapsed(true);
  const progress = useMotionValue(0);
  const smoothProgress = useSpring(progress, { stiffness: 90, damping: 22 });
  const widthPct = useTransform(smoothProgress, v => `${v}%`);

  useEffect(() => {
    progress.set(Math.min(100, (stepIndex / STEPS.length) * 100));
  }, [stepIndex, progress]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "relative", background: "var(--surface)",
        borderRadius: 14, border: "1px solid var(--border)",
        overflow: "hidden", boxShadow: "var(--shadow-card)",
      }}
    >
      <FloatingKanji />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{
          padding: "1rem 1.25rem", borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "var(--surface2)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: 0 }}>
            <motion.div
              style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--gold)", flexShrink: 0 }}
              animate={{ opacity: [1, 0.35, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <span style={{
              fontSize: "0.78rem", color: "var(--text2)", fontFamily: "var(--font-mono)",
              maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {filename}
            </span>
          </div>
          <span style={{ fontSize: "0.72rem", color: "var(--text3)", fontFamily: "var(--font-mono)", flexShrink: 0 }}>
            {elapsed}
          </span>
        </div>

        <div style={{ padding: "1.25rem" }}>
          {STEPS.map((step, i) => {
            const state = i < stepIndex ? "done" : i === stepIndex ? "active" : "pending";
            return (
              <div key={step.id} style={{ display: "flex", gap: "0.9rem" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <StepIcon step={step} state={state} />
                  {i < STEPS.length - 1 && (
                    <div style={{
                      width: 2, flex: 1, minHeight: 28, marginTop: 6,
                      borderRadius: 1, background: "var(--border)",
                      overflow: "hidden", position: "relative",
                    }}>
                      <motion.div
                        style={{ position: "absolute", inset: 0, background: "var(--jade)", transformOrigin: "top" }}
                        initial={false}
                        animate={{ scaleY: i < stepIndex ? 1 : 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  )}
                </div>

                <div style={{
                  flex: 1, borderRadius: 8, border: "1px solid transparent",
                  padding: "0.55rem 0.75rem",
                  marginBottom: i < STEPS.length - 1 ? "0.1rem" : 0,
                  background: state === "active" ? "var(--jade-dim)" : "transparent",
                  borderColor: state === "active" ? "var(--jade-border)" : "transparent",
                  transition: "background 0.35s ease, border-color 0.35s ease",
                }}>
                  <p style={{
                    fontSize: "0.87rem",
                    fontWeight: state === "pending" ? 400 : 600,
                    color: state === "done" ? "var(--text2)" : state === "active" ? "var(--jade)" : "var(--text3)",
                    transition: "color 0.3s",
                  }}>
                    {step.label}
                  </p>
                  <AnimatePresence initial={false}>
                    {state === "active" && (
                      <motion.p
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 3 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ fontSize: "0.73rem", color: "var(--text3)", fontFamily: "var(--font-mono)", overflow: "hidden" }}
                      >
                        {step.detail}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ padding: "0.85rem 1.25rem", borderTop: "1px solid var(--border)", background: "var(--surface2)" }}>
          <div style={{ height: 3, background: "var(--surface3)", borderRadius: 99, overflow: "hidden" }}>
            <motion.div
              style={{
                height: "100%", background: "var(--jade)", borderRadius: 99,
                width: widthPct,
                position: "relative", overflow: "hidden",
              }}
            >
              <motion.div
                style={{
                  position: "absolute", top: 0, bottom: 0, width: "40%",
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
                }}
                animate={{ x: ["-120%", "280%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>
          <p style={{ marginTop: "0.5rem", fontSize: "0.72rem", color: "var(--text3)", fontFamily: "var(--font-mono)" }}>
            <AnimatedPercent value={smoothProgress} />
          </p>
        </div>
      </div>
    </motion.div>
  );
}
