import { STEPS } from "../../constants";

export default function ProcessingView({ stepIndex, filename }) {
  return (
    <div style={{
      animation: "fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
      background: "var(--surface)",
      borderRadius: 16,
      border: "1px solid var(--border)",
      overflow: "hidden",
    }}>
      <div style={{
        padding: "1rem 1.25rem",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "var(--surface2)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "var(--gold)",
            animation: "pulse 1.2s ease-in-out infinite",
          }} />
          <span style={{
            fontSize: "0.78rem", color: "var(--text2)",
            fontFamily: "var(--font-mono)",
            maxWidth: 280, overflow: "hidden",
            textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {filename}
          </span>
        </div>
        <span style={{
          fontSize: "0.72rem", color: "var(--text3)",
          fontFamily: "var(--font-mono)",
        }}>
          processing
        </span>
      </div>

      <div style={{ padding: "1.25rem" }}>
        {STEPS.map((step, i) => {
          const done = i < stepIndex;
          const active = i === stepIndex;
          return (
            <div key={step.id} style={{
              display: "flex", alignItems: "center", gap: "0.85rem",
              padding: "0.7rem 0.85rem",
              marginBottom: i < STEPS.length - 1 ? "0.35rem" : 0,
              borderRadius: 9,
              background: active ? "rgba(0,200,150,0.07)" : "transparent",
              border: `1px solid ${active ? "var(--jade-border)" : "transparent"}`,
              transition: "all 0.3s ease",
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: done ? "var(--jade)" : active ? "transparent" : "var(--surface3)",
                border: active ? "1.5px solid var(--jade)" : done ? "none" : "1.5px solid var(--border-hover)",
                fontSize: 9, color: done ? "#000" : active ? "var(--jade)" : "var(--text3)",
                fontWeight: 700,
                animation: active ? "spin 1.2s linear infinite" : "none",
              }}>
                {done ? "✓" : active ? "◌" : ""}
              </div>

              <span style={{
                fontSize: "0.85rem",
                color: done ? "var(--text2)" : active ? "var(--jade)" : "var(--text3)",
                fontWeight: active ? 500 : 400,
                flex: 1, transition: "color 0.3s",
              }}>
                {step.label}
              </span>

              {done && (
                <span style={{
                  fontSize: "0.7rem", color: "var(--jade)",
                  fontFamily: "var(--font-mono)", opacity: 0.7,
                }}>
                  done
                </span>
              )}
              {active && (
                <div style={{ display: "flex", gap: 3 }}>
                  {[0, 1, 2].map(j => (
                    <div key={j} style={{
                      width: 3, height: 3, borderRadius: "50%",
                      background: "var(--jade)",
                      animation: `pulse 1s ease-in-out ${j * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{
        padding: "0.85rem 1.25rem",
        borderTop: "1px solid var(--border)",
        background: "var(--surface2)",
      }}>
        <div style={{
          height: 3, background: "var(--surface3)", borderRadius: 99, overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            width: `${Math.min(100, (stepIndex / STEPS.length) * 100)}%`,
            background: "var(--jade)", borderRadius: 99,
            transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)",
          }} />
        </div>
        <p style={{
          marginTop: "0.5rem", fontSize: "0.72rem",
          color: "var(--text3)", fontFamily: "var(--font-mono)",
        }}>
          {Math.min(100, Math.round((stepIndex / STEPS.length) * 100))}% complete
        </p>
      </div>
    </div>
  );
}