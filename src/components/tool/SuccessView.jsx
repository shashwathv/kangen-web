export default function SuccessView({ stats, downloadUrl, savedToDashboard, onReset }) {
  return (
    <div style={{ animation: "fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards" }}>
      <div style={{
        background: "var(--jade-dim)",
        border: "1px solid var(--jade-border)",
        borderRadius: 12, padding: "2rem",
        marginBottom: "1rem",
        display: "flex", alignItems: "center", gap: "1rem",
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: "var(--jade)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, fontWeight: 900, color: "#0B0A08", flexShrink: 0,
        }}>
          ✓
        </div>
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.15rem", marginBottom: "0.15rem", letterSpacing: "-0.01em" }}>
            Deck generated
          </p>
          <p style={{ fontSize: "0.8rem", color: "var(--text2)" }}>
            Your Anki flashcard deck is ready to import
          </p>
        </div>
      </div>

      {savedToDashboard && (
        <p style={{
          fontSize: "0.78rem", color: "var(--jade)", textAlign: "center",
          marginBottom: "1rem", fontFamily: "var(--font-mono)",
        }}>
          ✓ Saved to your dashboard
        </p>
      )}

      <div className="success-stats" style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
        gap: "0.6rem", marginBottom: "1rem",
      }}>
        {[
          { label: "Created", value: stats?.created ?? "—", color: "var(--jade)" },
          { label: "Skipped", value: stats?.skipped ?? "—", color: "var(--text3)" },
          { label: "Processed", value: stats?.total_processed ?? "—", color: "var(--gold)" },
        ].map(s => (
          <div key={s.label} style={{
            background: "var(--surface2)", borderRadius: 8,
            padding: "1rem 0.85rem", border: "1px solid var(--border)",
            textAlign: "center",
          }}>
            <div style={{
              fontSize: "1.9rem", fontWeight: 700, color: s.color,
              lineHeight: 1, marginBottom: "0.3rem", letterSpacing: "-0.02em",
              fontFamily: "var(--font-mono)",
            }}>
              {s.value}
            </div>
            <div style={{
              fontSize: "0.68rem", color: "var(--text3)",
              textTransform: "uppercase", letterSpacing: "0.08em",
            }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      
      <a
        href={downloadUrl}
        target="_blank"
        rel="noreferrer"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
          background: "var(--jade)", color: "#0B0A08", textDecoration: "none",
          padding: "0.9rem 1.5rem", borderRadius: 8,
          fontWeight: 800, fontSize: "0.95rem",
          letterSpacing: "-0.02em", marginBottom: "0.6rem",
          transition: "opacity 0.15s",
          fontFamily: "var(--font-body)",
        }}
        onMouseOver={e => e.currentTarget.style.opacity = "0.88"}
        onMouseOut={e => e.currentTarget.style.opacity = "1"}
      >
        <span>↓</span> Download .apkg deck
      </a>

      <button
        onClick={onReset}
        style={{
          display: "block", width: "100%",
          background: "transparent", color: "var(--text3)",
          border: "1px solid var(--border)", padding: "0.75rem",
          borderRadius: 8, cursor: "pointer", fontSize: "0.85rem",
          transition: "all 0.15s", fontFamily: "var(--font-body)",
        }}
        onMouseOver={e => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.color = "var(--text2)"; }}
        onMouseOut={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text3)"; }}
      >
        Process another image
      </button>

      <p style={{
        marginTop: "0.85rem", textAlign: "center",
        fontSize: "0.72rem", color: "var(--text3)",
        fontFamily: "var(--font-mono)",
      }}>
        Open .apkg in Anki Desktop or AnkiDroid to import
      </p>
    </div>
  );
}