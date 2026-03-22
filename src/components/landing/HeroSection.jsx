import { useEffect, useRef } from "react";

const KANJI_CARDS = [
  { char: "住", on: "ジュウ", kun: "す(む)", meaning: "to live" },
  { char: "正", on: "セイ", kun: "ただ(しい)", meaning: "correct" },
  { char: "年", on: "ネン", kun: "とし", meaning: "year" },
  { char: "売", on: "バイ", kun: "う(る)", meaning: "to sell" },
  { char: "買", on: "バイ", kun: "か(う)", meaning: "to buy" },
  { char: "町", on: "チョウ", kun: "まち", meaning: "town" },
  { char: "長", on: "チョウ", kun: "なが(い)", meaning: "long" },
  { char: "道", on: "ドウ", kun: "みち", meaning: "road" },
];

function FloatingCard({ card, style }) {
  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--border-hover)",
      borderRadius: 12,
      padding: "0.75rem 1rem",
      display: "flex", flexDirection: "column", gap: 2,
      boxShadow: "var(--shadow-card)",
      minWidth: 110,
      animation: "float 4s ease-in-out infinite",
      ...style,
    }}>
      <span style={{ fontSize: "1.8rem", fontWeight: 900, lineHeight: 1, color: "var(--text1)" }}>
        {card.char}
      </span>
      <span style={{ fontSize: "0.65rem", color: "var(--jade)", fontFamily: "var(--font-mono)", fontWeight: 600 }}>
        {card.on} · {card.kun}
      </span>
      <span style={{ fontSize: "0.7rem", color: "var(--text2)" }}>
        {card.meaning}
      </span>
    </div>
  );
}

export default function HeroSection() {
  return (
    <div style={{ position: "relative", marginBottom: "4rem" }}>
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: "0.75rem",
        position: "absolute", right: "-2rem", top: "0",
        opacity: 0.85,
      }}>
        {KANJI_CARDS.slice(0, 4).map((card, i) => (
          <FloatingCard
            key={card.char}
            card={card}
            style={{ animationDelay: `${i * 0.7}s`, animationDuration: `${3.5 + i * 0.5}s` }}
          />
        ))}
      </div>

      <div style={{
        position: "relative", zIndex: 2,
        maxWidth: 420,
        animation: "fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "0.4rem",
          background: "var(--jade-dim)", border: "1px solid var(--jade-border)",
          borderRadius: 99, padding: "0.3rem 0.85rem", marginBottom: "1.25rem",
        }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--jade)", display: "inline-block" }} />
          <span style={{ fontSize: "0.72rem", color: "var(--jade)", fontWeight: 600, letterSpacing: "0.04em" }}>
            KANJI → ANKI IN SECONDS
          </span>
        </div>

        <h1 style={{
          fontSize: "clamp(2.2rem, 5vw, 3rem)", fontWeight: 800,
          lineHeight: 1.08, letterSpacing: "-0.04em", marginBottom: "1rem",
        }}>
          Scan your sheet.<br />
          <span style={{
            color: "var(--jade)",
            textShadow: "0 0 40px rgba(0,200,150,0.3)",
          }}>
            Get flashcards.
          </span>
        </h1>

        <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75, maxWidth: 380 }}>
          Drop a photo of any kanji worksheet or textbook page.
          KanGen validates every reading against a real dictionary
          and exports a ready-to-import Anki deck.
        </p>
      </div>
    </div>
  );
}