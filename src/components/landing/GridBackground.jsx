// Genkouyoushi — the squared manuscript paper Japanese students write kanji on.
// Each cell carries the faint centre cross real practice sheets use to guide
// character proportions. It's the one motif every page shares.
export default function GridBackground() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 0,
      overflow: "hidden", pointerEvents: "none",
    }}>
      <svg
        style={{ position: "absolute", inset: "-100%", animation: "gridScroll 24s linear infinite", opacity: 0.7 }}
        aria-hidden="true"
      >
        <defs>
          <pattern id="genkouyoushi-cell" width="48" height="48" patternUnits="userSpaceOnUse">
            <rect x="0.5" y="0.5" width="47" height="47" fill="none" stroke="var(--border)" strokeWidth="1" />
            <line x1="24" y1="18" x2="24" y2="30" stroke="var(--border-hover)" strokeWidth="1" />
            <line x1="18" y1="24" x2="30" y2="24" stroke="var(--border-hover)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#genkouyoushi-cell)" />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 60% 50% at 50% 0%, var(--jade-dim) 0%, transparent 70%)",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 80% 60% at 50% 100%, var(--bg) 0%, transparent 60%)",
      }} />
    </div>
  );
}
