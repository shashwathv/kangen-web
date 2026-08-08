import { motion } from "framer-motion";
import { useMemo } from "react";
import { KANJI_BG } from "../../constants";

// Deterministic pseudo-random so particle layout doesn't jitter on re-render.
function seeded(n) {
  const x = Math.sin(n) * 10000;
  return x - Math.floor(x);
}

export default function FloatingKanji({ count = 7 }) {
  const particles = useMemo(() => Array.from({ length: count }, (_, i) => ({
    char: KANJI_BG[Math.floor(seeded(i * 12.9) * KANJI_BG.length)],
    left: `${seeded(i * 3.1 + 1) * 92}%`,
    top: `${seeded(i * 7.7 + 2) * 88}%`,
    size: 18 + seeded(i * 5.3) * 24,
    duration: 7 + seeded(i * 2.9) * 5,
    delay: seeded(i * 4.4) * 4,
  })), [count]);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {particles.map((p, i) => (
        <motion.span
          key={i}
          style={{
            position: "absolute", left: p.left, top: p.top,
            fontSize: p.size, fontWeight: 800, color: "var(--jade)",
            userSelect: "none",
          }}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 0.12, 0], y: [-4, -26] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          {p.char}
        </motion.span>
      ))}
    </div>
  );
}
