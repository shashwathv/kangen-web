import { useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";

function CardField({ label, value, onChange, mono, area }) {
  const Tag = area ? "textarea" : "input";
  return (
    <label style={{ display: "block", marginBottom: "0.6rem" }}>
      <span style={{
        display: "block", fontSize: "0.68rem", fontWeight: 600,
        color: "var(--text3)", textTransform: "uppercase",
        letterSpacing: "0.06em", marginBottom: "0.3rem",
      }}>
        {label}
      </span>
      <Tag
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={area ? 2 : undefined}
        style={{
          width: "100%", padding: "0.5rem 0.65rem",
          background: "var(--surface2)", border: "1px solid var(--border)",
          borderRadius: 8, color: "var(--text1)",
          fontSize: "0.85rem", fontFamily: mono ? "var(--font-mono)" : "var(--font-body)",
          outline: "none", transition: "border-color 0.15s",
          resize: area ? "vertical" : "none",
        }}
        onFocus={e => { e.target.style.borderColor = "var(--jade-border)"; e.target.style.boxShadow = "0 0 0 3px var(--jade-dim)"; }}
        onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
      />
    </label>
  );
}

// Boxes are sized for a single character. `card.kanji` is often a full
// jukugo compound (2-4 characters) though, so scale the font down — and let
// the box grow to fit — instead of letting long words wrap into a stack.
const KANJI_FONT_SIZES = ["2.4rem", "2.4rem", "1.85rem", "1.4rem", "1.15rem"];
function kanjiFontSize(text) {
  const len = [...(text || "")].length;
  return KANJI_FONT_SIZES[Math.min(len, KANJI_FONT_SIZES.length - 1)];
}

function CardEditor({ card, onChange, onRemove }) {
  const set = (field) => (value) => onChange({ ...card, [field]: value });
  const fontSize = kanjiFontSize(card.kanji);

  return (
    <div className="card-editor-row" style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 10, padding: "1.1rem", marginBottom: "0.75rem",
      display: "flex", gap: "1rem", position: "relative",
    }}>
      <div className="card-editor-kanji" style={{
        "--kanji-font-size": fontSize,
        fontSize, fontWeight: 800, lineHeight: 1.15,
        color: "var(--text1)", flexShrink: 0, minWidth: 64,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--surface2)", borderRadius: 8,
        border: "1px solid var(--border)",
        padding: "0.5rem 0.6rem", whiteSpace: "nowrap",
      }}>
        {card.kanji}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <CardField label="Meaning" value={card.meaning} onChange={set("meaning")} />
        <div className="review-fields" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
          <CardField label="On-yomi" value={card.on_yomi} onChange={set("on_yomi")} mono />
          <CardField label="Kun-yomi" value={card.kun_yomi} onChange={set("kun_yomi")} mono />
        </div>
        <CardField label="Example" value={card.example} onChange={set("example")} area />
      </div>

      <button
        className="card-editor-remove"
        onClick={onRemove}
        title="Remove this card"
        style={{
          flexShrink: 0, width: 28, height: 28, alignSelf: "flex-start",
          background: "var(--surface2)", border: "1px solid var(--border)",
          borderRadius: 7, color: "var(--text3)", cursor: "pointer",
          fontSize: "0.8rem", transition: "all 0.15s",
        }}
        onMouseOver={e => { e.currentTarget.style.borderColor = "var(--flame-border)"; e.currentTarget.style.color = "var(--flame)"; }}
        onMouseOut={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text3)"; }}
      >
        ✕
      </button>
    </div>
  );
}

export default function ReviewView({ cards, onBuild, onReset, isBuilding, buildError }) {
  const [items, setItems] = useState(() => cards.map((c, i) => ({ ...c, _key: i })));
  const [deckName, setDeckName] = useState("");
  const { user } = useAuth();

  const updateCard = useCallback((key, next) => {
    setItems(prev => prev.map(c => (c._key === key ? { ...next, _key: key } : c)));
  }, []);

  const removeCard = useCallback((key) => {
    setItems(prev => prev.filter(c => c._key !== key));
  }, []);

  const handleSubmit = () => {
    const payload = items.map(({ _key, ...card }) => card);
    onBuild(payload, deckName.trim() || undefined);
  };

  return (
    <div style={{ animation: "fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards" }}>
      <div style={{ marginBottom: "1.25rem" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.55rem", fontWeight: 600, letterSpacing: "-0.01em", marginBottom: "0.35rem" }}>
          Review your cards
        </h2>
        <p style={{ color: "var(--text2)", fontSize: "0.85rem" }}>
          {items.length} kanji found. Fix anything that looks off, remove what you don't need, then generate the deck.
        </p>
      </div>

      {user && (
        <label style={{ display: "block", marginBottom: "1.1rem" }}>
          <span style={{
            display: "block", fontSize: "0.68rem", fontWeight: 600,
            color: "var(--text3)", textTransform: "uppercase",
            letterSpacing: "0.06em", marginBottom: "0.3rem",
          }}>
            Deck name (saved to your dashboard)
          </span>
          <input
            value={deckName}
            onChange={e => setDeckName(e.target.value)}
            placeholder={`Deck — ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
            style={{
              width: "100%", padding: "0.6rem 0.75rem",
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 8, color: "var(--text1)",
              fontSize: "0.9rem", fontFamily: "var(--font-body)",
              outline: "none", transition: "border-color 0.15s, box-shadow 0.15s",
            }}
            onFocus={e => { e.target.style.borderColor = "var(--jade-border)"; e.target.style.boxShadow = "0 0 0 3px var(--jade-dim)"; }}
            onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
          />
        </label>
      )}

      {items.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "2rem",
          border: "1px dashed var(--border-hover)", borderRadius: 10,
          color: "var(--text3)", fontSize: "0.85rem", marginBottom: "1rem",
        }}>
          No cards left. Go back and try another image.
        </div>
      ) : (
        items.map(card => (
          <CardEditor
            key={card._key}
            card={card}
            onChange={(next) => updateCard(card._key, next)}
            onRemove={() => removeCard(card._key)}
          />
        ))
      )}

      {buildError && (
        <p style={{
          color: "var(--flame)", fontSize: "0.82rem",
          marginBottom: "0.75rem", textAlign: "center",
        }}>
          {buildError}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={items.length === 0 || isBuilding}
        style={{
          display: "block", width: "100%",
          background: items.length === 0 ? "var(--surface3)" : "var(--jade)",
          color: items.length === 0 ? "var(--text3)" : "#0B0A08",
          border: "none", padding: "0.9rem 1.5rem", borderRadius: 8,
          fontWeight: 800, fontSize: "0.95rem", letterSpacing: "-0.02em",
          cursor: items.length === 0 || isBuilding ? "not-allowed" : "pointer",
          marginBottom: "0.6rem", fontFamily: "var(--font-body)",
          transition: "opacity 0.15s", opacity: isBuilding ? 0.7 : 1,
        }}
      >
        {isBuilding ? "Generating deck…" : `Generate deck (${items.length} card${items.length === 1 ? "" : "s"})`}
      </button>

      <button
        onClick={onReset}
        disabled={isBuilding}
        style={{
          display: "block", width: "100%",
          background: "transparent", color: "var(--text3)",
          border: "1px solid var(--border)", padding: "0.75rem",
          borderRadius: 8, cursor: isBuilding ? "not-allowed" : "pointer",
          fontSize: "0.85rem", fontFamily: "var(--font-body)",
        }}
      >
        Start over
      </button>
    </div>
  );
}
