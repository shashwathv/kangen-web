export default function GridBackground() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 0,
      overflow: "hidden", pointerEvents: "none",
    }}>
      <div style={{
        position: "absolute", inset: "-100%",
        backgroundImage: `
          linear-gradient(var(--border) 1px, transparent 1px),
          linear-gradient(90deg, var(--border) 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
        animation: "gridScroll 20s linear infinite",
        opacity: 0.6,
      }} />
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