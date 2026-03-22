import { useRef, useCallback } from "react";

export default function UploadZone({ onFile, isDragging, setIsDragging }) {
  const inputRef = useRef();

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  }, [onFile, setIsDragging]);

  return (
    <div style={{ animation: "fadeUp 0.6s 0.1s cubic-bezier(0.16,1,0.3,1) both" }}>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => inputRef.current.click()}
        style={{
          border: `2px dashed ${isDragging ? "var(--jade)" : "var(--border-hover)"}`,
          borderRadius: 16, padding: "2.5rem 2rem",
          textAlign: "center", cursor: "pointer",
          background: isDragging ? "var(--jade-dim)" : "var(--surface)",
          transition: "all 0.25s ease",
          boxShadow: isDragging ? "0 0 0 4px var(--jade-dim), var(--shadow-card)" : "var(--shadow-card)",
          position: "relative", overflow: "hidden",
        }}
      >
        {!isDragging && (
          <div style={{
            position: "absolute", top: 0, left: "-100%",
            width: "60%", height: "100%",
            background: "linear-gradient(90deg, transparent, var(--jade-dim), transparent)",
            animation: "shimmer 3s ease-in-out 2s infinite",
            pointerEvents: "none",
          }} />
        )}

        <input ref={inputRef} type="file" accept="image/*,.heic,.heif" style={{ display: "none" }}
          onChange={(e) => e.target.files[0] && onFile(e.target.files[0])} />

        <div style={{
          width: 52, height: 52, margin: "0 auto 1.25rem",
          background: isDragging ? "var(--jade-dim)" : "var(--surface2)",
          borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
          border: `1px solid ${isDragging ? "var(--jade-border)" : "var(--border-hover)"}`,
          fontSize: 22, transition: "all 0.25s",
          transform: isDragging ? "scale(1.1)" : "scale(1)",
        }}>
          {isDragging ? "⬇" : "📷"}
        </div>

        <p style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.35rem", letterSpacing: "-0.02em" }}>
          {isDragging ? "Release to process" : "Drop your study sheet here"}
        </p>
        <p style={{ fontSize: "0.82rem", color: "var(--text3)", marginBottom: "1.5rem" }}>
          Textbooks, worksheets, handouts · JPG PNG HEIC
        </p>

        <button onClick={(e) => { e.stopPropagation(); inputRef.current.click(); }} style={{
          background: "var(--jade)", color: "#fff",
          border: "none", padding: "0.6rem 1.5rem",
          borderRadius: 8, fontWeight: 700, fontSize: "0.88rem",
          cursor: "pointer", letterSpacing: "-0.01em",
          fontFamily: "var(--font-body)", transition: "all 0.15s",
          boxShadow: "0 2px 8px rgba(0,200,150,0.3)",
        }}
          onMouseOver={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseOut={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          Choose file
        </button>
      </div>

      <div style={{
        display: "flex", justifyContent: "center", gap: "1.5rem",
        marginTop: "1rem", flexWrap: "wrap",
      }}>
        {[
          { dot: "var(--jade)", label: "Dictionary-verified" },
          { dot: "var(--gold)", label: "AI-polished" },
          { dot: "#818CF8", label: "Anki-ready" },
        ].map(f => (
          <div key={f.label} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", color: "var(--text3)" }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: f.dot, display: "inline-block" }} />
            {f.label}
          </div>
        ))}
      </div>
    </div>
  );
}