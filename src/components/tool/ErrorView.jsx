export default function ErrorView({ message, onReset }) {
  return (
    <div style={{
      animation: "fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
      background: "var(--flame-dim)",
      border: "1px solid var(--flame-border)",
      borderRadius: 16, padding: "2rem", textAlign: "center",
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: "rgba(255,77,0,0.15)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, margin: "0 auto 1rem",
        border: "1px solid var(--flame-border)",
      }}>
        ✕
      </div>
      <h3 style={{
        fontWeight: 700, fontSize: "1rem",
        marginBottom: "0.4rem", letterSpacing: "-0.02em",
      }}>
        Processing failed
      </h3>
      <p style={{
        color: "var(--text2)", fontSize: "0.83rem",
        maxWidth: 320, margin: "0 auto 1.5rem",
      }}>
        {message || "Something went wrong. Please try again with a clearer image."}
      </p>
      <button
        onClick={onReset}
        style={{
          background: "var(--flame)", color: "#fff", border: "none",
          padding: "0.7rem 1.75rem", borderRadius: 8, cursor: "pointer",
          fontWeight: 700, fontSize: "0.88rem",
          fontFamily: "var(--font-body)", transition: "opacity 0.15s",
        }}
        onMouseOver={e => e.currentTarget.style.opacity = "0.85"}
        onMouseOut={e => e.currentTarget.style.opacity = "1"}
      >
        Try again
      </button>
    </div>
  );
}