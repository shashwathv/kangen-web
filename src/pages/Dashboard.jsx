import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const MOCK_DECKS = [
  { id: 1, name: "Lesson 10 — Kasajizo", cards: 38, date: "Mar 22, 2026", image: "20250806_115949.jpg" },
  { id: 2, name: "Lesson 11 — Vocabulary", cards: 27, date: "Mar 20, 2026", image: "sheet2.jpg" },
  { id: 3, name: "JLPT N4 Chapter 3", cards: 45, date: "Mar 18, 2026", image: "sheet3.jpg" },
];

function DeckCard({ deck }) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 14, padding: "1.25rem",
      boxShadow: "var(--shadow-card)", transition: "border-color 0.15s, transform 0.15s",
      cursor: "pointer",
    }}
      onMouseOver={e => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseOut={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{
        height: 80, background: "var(--surface2)",
        borderRadius: 9, marginBottom: "1rem",
        display: "flex", alignItems: "center", justifyContent: "center",
        border: "1px solid var(--border)", fontSize: 28, color: "var(--text3)",
        letterSpacing: "0.1em",
      }}>
        漢字
      </div>
      <p style={{ fontWeight: 600, fontSize: "0.88rem", marginBottom: "0.3rem", letterSpacing: "-0.01em" }}>
        {deck.name}
      </p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{
          fontSize: "0.72rem", color: "var(--jade)",
          background: "var(--jade-dim)", border: "1px solid var(--jade-border)",
          borderRadius: 99, padding: "0.15rem 0.5rem",
          fontWeight: 600,
        }}>
          {deck.cards} cards
        </span>
        <span style={{ fontSize: "0.72rem", color: "var(--text3)", fontFamily: "var(--font-mono)" }}>
          {deck.date}
        </span>
      </div>
      <div style={{
        marginTop: "0.85rem", paddingTop: "0.85rem",
        borderTop: "1px solid var(--border)",
        display: "flex", gap: "0.5rem",
      }}>
        <button style={{
          flex: 1, padding: "0.45rem",
          background: "var(--jade)", color: "#fff",
          border: "none", borderRadius: 7,
          fontSize: "0.75rem", fontWeight: 600,
          cursor: "pointer", fontFamily: "var(--font-body)",
          transition: "opacity 0.15s",
        }}
          onMouseOver={e => e.currentTarget.style.opacity = "0.85"}
          onMouseOut={e => e.currentTarget.style.opacity = "1"}
        >
          ↓ Download
        </button>
        <button style={{
          padding: "0.45rem 0.75rem",
          background: "var(--surface2)", color: "var(--text2)",
          border: "1px solid var(--border)", borderRadius: 7,
          fontSize: "0.75rem", cursor: "pointer",
          fontFamily: "var(--font-body)", transition: "all 0.15s",
        }}
          onMouseOver={e => e.currentTarget.style.borderColor = "var(--border-hover)"}
          onMouseOut={e => e.currentTarget.style.borderColor = "var(--border)"}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", transition: "background 0.3s" }}>
      <Header theme={theme} onToggleTheme={() => setTheme(t => t === "dark" ? "light" : "dark")} />
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "3rem 1.5rem" }}>

        <div style={{
          display: "flex", alignItems: "flex-start",
          justifyContent: "space-between", flexWrap: "wrap",
          gap: "1rem", marginBottom: "2.5rem",
          animation: "fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
        }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "0.25rem" }}>
              Your decks
            </h1>
            <p style={{ color: "var(--text2)", fontSize: "0.85rem" }}>
              3 decks · 110 cards total
            </p>
          </div>
          <Link to="/app" style={{
            textDecoration: "none",
            background: "var(--jade)", color: "#fff",
            padding: "0.65rem 1.25rem", borderRadius: 9,
            fontWeight: 700, fontSize: "0.88rem",
            boxShadow: "0 2px 12px rgba(0,200,150,0.2)",
            transition: "all 0.15s",
          }}
            onMouseOver={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseOut={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            + New deck
          </Link>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "1rem",
          animation: "fadeUp 0.6s 0.1s cubic-bezier(0.16,1,0.3,1) both",
        }}>
          {MOCK_DECKS.map(deck => (
            <DeckCard key={deck.id} deck={deck} />
          ))}

          <Link to="/app" style={{
            textDecoration: "none",
            background: "transparent",
            border: "2px dashed var(--border-hover)",
            borderRadius: 14, padding: "1.25rem",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: "0.5rem", minHeight: 200,
            cursor: "pointer", transition: "all 0.2s",
            color: "var(--text3)",
          }}
            onMouseOver={e => { e.currentTarget.style.borderColor = "var(--jade-border)"; e.currentTarget.style.color = "var(--jade)"; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.color = "var(--text3)"; }}
          >
            <span style={{ fontSize: 28 }}>+</span>
            <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>Generate new deck</span>
          </Link>
        </div>

        <div style={{
          marginTop: "3rem", padding: "1.25rem 1.5rem",
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 14,
          animation: "fadeUp 0.6s 0.2s cubic-bezier(0.16,1,0.3,1) both",
        }}>
          <p style={{ fontSize: "0.78rem", color: "var(--text3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>
            Note
          </p>
          <p style={{ fontSize: "0.85rem", color: "var(--text2)", lineHeight: 1.7 }}>
            Dashboard history requires an account. Auth with Supabase is coming soon — decks will be saved automatically after you sign in. For now, download your deck immediately after generation.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}