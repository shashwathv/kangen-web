import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { API_URL } from "../../constants";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Tool", to: "/app" },
  { label: "Dashboard", to: "/dashboard" },
];

export default function Header({ theme, onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [apiStatus, setApiStatus] = useState("checking");
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(`${API_URL}/health`, {
          signal: AbortSignal.timeout(4000),
        });
        setApiStatus(res.ok ? "online" : "degraded");
      } catch {
        setApiStatus("offline");
      }
    };
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);

  const STATUS = {
    online:   { color: "#00C896", label: "online" },
    offline:  { color: "#FF4D00", label: "offline" },
    degraded: { color: "#FFB800", label: "degraded" },
    checking: { color: "#A1A1AA", label: "..." },
  };
  const s = STATUS[apiStatus];

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      padding: "0.9rem 2rem",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      background: scrolled ? "var(--surface)" : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      transition: "all 0.3s ease",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.6rem", textDecoration: "none", color: "inherit" }}>
          <div style={{
            width: 30, height: 30, background: "var(--jade)", borderRadius: 7,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 900, color: "#fff", flexShrink: 0,
          }}>
            漢
          </div>
          <span style={{ fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.02em", color: "var(--text1)" }}>
            KanGen
          </span>
          <span style={{
            fontSize: "0.62rem", padding: "0.12rem 0.45rem",
            background: "var(--jade-dim)", border: "1px solid var(--jade-border)",
            borderRadius: 99, color: "var(--jade)", fontWeight: 600, letterSpacing: "0.04em",
          }}>
            BETA
          </span>
        </Link>

        <nav style={{ display: "flex", gap: "0.25rem" }}>
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                textDecoration: "none",
                fontSize: "0.82rem",
                fontWeight: location.pathname === link.to ? 600 : 400,
                color: location.pathname === link.to ? "var(--text1)" : "var(--text3)",
                padding: "0.35rem 0.75rem",
                borderRadius: 7,
                background: location.pathname === link.to ? "var(--surface2)" : "transparent",
                border: location.pathname === link.to ? "1px solid var(--border)" : "1px solid transparent",
                transition: "all 0.15s",
              }}
              onMouseOver={e => {
                if (location.pathname !== link.to) {
                  e.currentTarget.style.color = "var(--text2)";
                  e.currentTarget.style.background = "var(--surface2)";
                }
              }}
              onMouseOut={e => {
                if (location.pathname !== link.to) {
                  e.currentTarget.style.color = "var(--text3)";
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "0.4rem",
          background: "var(--surface2)", border: "1px solid var(--border)",
          borderRadius: 99, padding: "0.25rem 0.65rem",
        }}>
          <span style={{
            display: "inline-block", width: 6, height: 6, borderRadius: "50%",
            background: s.color,
            animation: apiStatus === "online" ? "pulse 2s ease-in-out infinite" : "none",
            transition: "background 0.3s",
          }} />
          <span style={{ fontSize: "0.7rem", color: "var(--text2)", fontFamily: "var(--font-mono)" }}>
            {s.label}
          </span>
        </div>

        <Link
          to="/login"
          style={{
            textDecoration: "none",
            fontSize: "0.82rem",
            color: "var(--text2)",
            padding: "0.35rem 0.85rem",
            borderRadius: 7,
            border: "1px solid var(--border)",
            background: "var(--surface2)",
            transition: "all 0.15s",
            fontWeight: 500,
          }}
          onMouseOver={e => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.color = "var(--text1)"; }}
          onMouseOut={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text2)"; }}
        >
          Sign in
        </Link>

        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            style={{
              width: 34, height: 34, borderRadius: 8,
              background: "var(--surface2)", border: "1px solid var(--border)",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 15, transition: "all 0.2s", color: "var(--text2)",
            }}
            onMouseOver={e => e.currentTarget.style.borderColor = "var(--border-hover)"}
            onMouseOut={e => e.currentTarget.style.borderColor = "var(--border)"}
          >
            {theme === "dark" ? "☀" : "◑"}
          </button>
        )}
      </div>
    </header>
  );
}