const STATS = [
  { value: "< 60s", label: "Processing time" },
  { value: "99%", label: "Dictionary accuracy" },
  { value: ".apkg", label: "Anki native format" },
  { value: "Free", label: "No account needed" },
];

export default function StatsBar() {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
      gap: "0.5rem", marginTop: "2.5rem", marginBottom: "3rem",
      animation: "fadeUp 0.7s 0.2s cubic-bezier(0.16,1,0.3,1) both",
    }}>
      {STATS.map(s => (
        <div key={s.label} style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 10, padding: "0.85rem 0.75rem",
          textAlign: "center",
          boxShadow: "var(--shadow-card)",
          transition: "border-color 0.2s",
        }}
          onMouseOver={e => e.currentTarget.style.borderColor = "var(--border-hover)"}
          onMouseOut={e => e.currentTarget.style.borderColor = "var(--border)"}
        >
          <div style={{
            fontSize: "1.2rem", fontWeight: 800,
            color: "var(--jade)", letterSpacing: "-0.03em",
            fontFamily: "var(--font-mono)", marginBottom: "0.2rem",
          }}>
            {s.value}
          </div>
          <div style={{ fontSize: "0.68rem", color: "var(--text3)", letterSpacing: "0.02em" }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}