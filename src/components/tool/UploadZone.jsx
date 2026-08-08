import { useRef, useCallback } from "react";
import { MAX_IMAGES_PER_UPLOAD } from "../../constants";

export default function UploadZone({ files, onAddFiles, onRemoveFile, onSubmit, isDragging, setIsDragging }) {
  const inputRef = useRef();
  const cameraInputRef = useRef();
  const atLimit = files.length >= MAX_IMAGES_PER_UPLOAD;

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) onAddFiles(Array.from(e.dataTransfer.files));
  }, [onAddFiles, setIsDragging]);

  // Clear the input value after reading so selecting the same file twice
  // (e.g. after removing it from the staged list) still fires onChange.
  const handlePicked = useCallback((e) => {
    if (e.target.files.length) onAddFiles(Array.from(e.target.files));
    e.target.value = "";
  }, [onAddFiles]);

  return (
    <div style={{ animation: "fadeUp 0.6s 0.1s cubic-bezier(0.16,1,0.3,1) both" }}>
      {/* Rendered outside the clickable box below: input.click() dispatches a
          real bubbling click event, and if these lived inside that box it would
          re-trigger the box's own onClick right after opening the picker. */}
      <input ref={inputRef} type="file" accept="image/*,.heic,.heif" multiple style={{ display: "none" }}
        onChange={handlePicked} />
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }}
        onChange={handlePicked} />

      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); if (!atLimit) setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => !atLimit && inputRef.current.click()}
        style={{
          border: `2px dashed ${isDragging ? "var(--jade)" : "var(--border-hover)"}`,
          borderRadius: 12, padding: "2.5rem 2rem",
          textAlign: "center", cursor: atLimit ? "default" : "pointer",
          background: isDragging ? "var(--jade-dim)" : "var(--surface)",
          transition: "all 0.25s ease",
          boxShadow: isDragging ? "0 0 0 4px var(--jade-dim), var(--shadow-card)" : "var(--shadow-card)",
          position: "relative", overflow: "hidden",
          opacity: atLimit ? 0.65 : 1,
          // Mobile browsers paint a translucent tap-highlight over any element
          // with cursor:pointer on touch — since this box wraps the camera/
          // choose-files buttons, that made the whole box flash on every tap.
          WebkitTapHighlightColor: "transparent",
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

        <div style={{
          width: 52, height: 52, margin: "0 auto 1.25rem",
          background: isDragging ? "var(--jade-dim)" : "var(--surface2)",
          borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
          border: `1px solid ${isDragging ? "var(--jade-border)" : "var(--border-hover)"}`,
          fontSize: 22, transition: "all 0.25s",
          transform: isDragging ? "scale(1.1)" : "scale(1)",
        }}>
          {isDragging ? "⬇" : "📷"}
        </div>

        <p style={{
          fontFamily: "var(--font-display)", fontWeight: 600,
          fontSize: "1.2rem", marginBottom: "0.4rem", letterSpacing: "-0.01em",
        }}>
          {atLimit ? `${MAX_IMAGES_PER_UPLOAD} images staged` : isDragging ? "Release to add" : "Drop your study sheets here"}
        </p>
        <p style={{ fontSize: "0.82rem", color: "var(--text3)", marginBottom: "1.5rem", fontFamily: "var(--font-mono)" }}>
          {atLimit
            ? "Remove one below to add another"
            : `Up to ${MAX_IMAGES_PER_UPLOAD} pages at once · JPG PNG HEIC`}
        </p>

        <div style={{ display: "flex", gap: "0.6rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button disabled={atLimit} onClick={(e) => { e.stopPropagation(); inputRef.current.click(); }} style={{
            background: "var(--jade)", color: "#0B0A08",
            border: "none", padding: "0.6rem 1.5rem",
            borderRadius: 7, fontWeight: 700, fontSize: "0.88rem",
            cursor: atLimit ? "not-allowed" : "pointer", letterSpacing: "-0.01em",
            fontFamily: "var(--font-body)", transition: "all 0.15s",
            boxShadow: "0 2px 8px rgba(0,200,150,0.3)",
            opacity: atLimit ? 0.6 : 1,
            WebkitTapHighlightColor: "transparent",
          }}
            onMouseOver={e => { if (!atLimit) { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
            onMouseOut={e => { e.currentTarget.style.opacity = atLimit ? "0.6" : "1"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Choose files
          </button>

          <button
            className="upload-camera-btn"
            disabled={atLimit}
            onClick={(e) => { e.stopPropagation(); cameraInputRef.current.click(); }}
            style={{
              background: "var(--surface2)", color: "var(--text1)",
              border: "1px solid var(--border-hover)", padding: "0.6rem 1.5rem",
              borderRadius: 7, fontWeight: 700, fontSize: "0.88rem",
              cursor: atLimit ? "not-allowed" : "pointer", letterSpacing: "-0.01em",
              fontFamily: "var(--font-body)", transition: "all 0.15s",
              alignItems: "center", gap: "0.4rem",
              opacity: atLimit ? 0.6 : 1,
              WebkitTapHighlightColor: "transparent",
            }}
            onMouseOver={e => { if (!atLimit) e.currentTarget.style.borderColor = "var(--jade-border)"; }}
            onMouseOut={e => e.currentTarget.style.borderColor = "var(--border-hover)"}
          >
            📷 Take photo
          </button>
        </div>
      </div>

      {files.length > 0 && (
        <div style={{ marginTop: "1rem", animation: "fadeUp 0.3s cubic-bezier(0.16,1,0.3,1) forwards" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "0.85rem" }}>
            {files.map((file, i) => (
              <div key={`${file.name}-${i}`} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: 8, padding: "0.55rem 0.5rem 0.55rem 0.85rem",
              }}>
                <span style={{
                  fontSize: "0.82rem", color: "var(--text2)", fontFamily: "var(--font-mono)",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {i + 1}. {file.name}
                </span>
                <button
                  onClick={() => onRemoveFile(i)}
                  title="Remove"
                  style={{
                    flexShrink: 0, width: 26, height: 26,
                    background: "transparent", border: "none", color: "var(--text3)",
                    cursor: "pointer", fontSize: "0.85rem", borderRadius: 6,
                    transition: "all 0.15s",
                  }}
                  onMouseOver={e => { e.currentTarget.style.color = "var(--flame)"; e.currentTarget.style.background = "var(--flame-dim)"; }}
                  onMouseOut={e => { e.currentTarget.style.color = "var(--text3)"; e.currentTarget.style.background = "transparent"; }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button onClick={onSubmit} style={{
            width: "100%", padding: "0.85rem",
            background: "var(--jade)", color: "#0B0A08", border: "none",
            borderRadius: 8, fontWeight: 800, fontSize: "0.92rem",
            cursor: "pointer", fontFamily: "var(--font-body)",
            letterSpacing: "-0.02em", transition: "opacity 0.15s",
            boxShadow: "0 2px 12px rgba(0,200,150,0.25)",
          }}
            onMouseOver={e => e.currentTarget.style.opacity = "0.88"}
            onMouseOut={e => e.currentTarget.style.opacity = "1"}
          >
            Generate cards from {files.length} image{files.length === 1 ? "" : "s"}
          </button>
        </div>
      )}

      <div style={{
        display: "flex", justifyContent: "center", gap: "1.5rem",
        marginTop: "1rem", flexWrap: "wrap",
      }}>
        {[
          { dot: "var(--jade)", label: "Dictionary-verified" },
          { dot: "var(--gold)", label: "AI-polished" },
          { dot: "var(--seal)", label: "Anki-ready" },
        ].map(f => (
          <div key={f.label} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", color: "var(--text3)", fontFamily: "var(--font-mono)" }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: f.dot, display: "inline-block" }} />
            {f.label}
          </div>
        ))}
      </div>
    </div>
  );
}
