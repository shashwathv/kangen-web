const FEATURES = [
  {
    icon: "🎯",
    title: "Layout-agnostic extraction",
    desc: "Doesn't try to parse table borders or columns. Uses each kanji character as a spatial anchor — works on any layout.",
    tag: "Core tech",
    tagColor: "var(--jade)",
    tagBg: "var(--jade-dim)",
    tagBorder: "var(--jade-border)",
  },
  {
    icon: "📖",
    title: "Dictionary-first, AI-second",
    desc: "SudachiPy provides ground-truth readings. Gemini can polish meanings but cannot invent or override what the dictionary says.",
    tag: "No hallucinations",
    tagColor: "var(--jade)",
    tagBg: "var(--jade-dim)",
    tagBorder: "var(--jade-border)",
  },
  {
    icon: "⚡",
    title: "Single batched API call",
    desc: "All kanji from your image go to Gemini in one request — stays well within free tier quota regardless of deck size.",
    tag: "Efficient",
    tagColor: "#818CF8",
    tagBg: "rgba(129,140,248,0.1)",
    tagBorder: "rgba(129,140,248,0.25)",
  },
  {
    icon: "🔄",
    title: "Fails safely, always",
    desc: "No API key? Falls back to dictionary-only. One card fails? The rest still process. No silent errors, no misleading cards.",
    tag: "Resilient",
    tagColor: "var(--gold)",
    tagBg: "var(--gold-dim)",
    tagBorder: "rgba(255,184,0,0.25)",
  },
  {
    icon: "📱",
    title: "Anki + AnkiDroid native",
    desc: "Exports standard .apkg files. Open it on your phone and AnkiDroid imports automatically — no extra steps.",
    tag: "Compatible",
    tagColor: "#818CF8",
    tagBg: "rgba(129,140,248,0.1)",
    tagBorder: "rgba(129,140,248,0.25)",
  },
  {
    icon: "🆓",
    title: "Completely free",
    desc: "Open source. No account required. No usage limits on the tool. Built by a student, for students.",
    tag: "Free forever",
    tagColor: "var(--jade)",
    tagBg: "var(--jade-dim)",
    tagBorder: "var(--jade-border)",
  },
];

export default function FeaturesSection() {
  return (
    <div style={{
      marginTop: "5rem",
      animation: "fadeUp 0.7s 0.2s cubic-bezier(0.16,1,0.3,1) both",
    }}>
      <p style={{
        fontSize: "0.68rem", color: "var(--text3)",
        textTransform: "uppercase", letterSpacing: "0.12em",
        fontWeight: 600, marginBottom: "0.6rem",
      }}>
        Why KanGen
      </p>
      <h2 style={{
        fontSize: "1.6rem", fontWeight: 800,
        letterSpacing: "-0.03em", marginBottom: "2.5rem",
        maxWidth: 500,
      }}>
        Built to be reliable,<br />not just impressive
      </h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: "1rem",
      }}>
        {FEATURES.map(f => (
          <div key={f.title} style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 14, padding: "1.5rem",
            boxShadow: "var(--shadow-card)", transition: "border-color 0.2s, transform 0.2s",
          }}
            onMouseOver={e => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.85rem" }}>
              <span style={{ fontSize: 22 }}>{f.icon}</span>
              <span style={{
                fontSize: "0.65rem", padding: "0.15rem 0.55rem",
                background: f.tagBg, border: `1px solid ${f.tagBorder}`,
                borderRadius: 99, color: f.tagColor, fontWeight: 600,
                letterSpacing: "0.03em",
              }}>
                {f.tag}
              </span>
            </div>
            <p style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.4rem", letterSpacing: "-0.01em" }}>
              {f.title}
            </p>
            <p style={{ fontSize: "0.8rem", color: "var(--text3)", lineHeight: 1.65 }}>
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
