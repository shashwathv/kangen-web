import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../../constants";
import { useAuth } from "../../context/AuthContext";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Tool", to: "/app" },
  { label: "Dashboard", to: "/dashboard" },
];

export default function Header({ theme, onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [apiStatus, setApiStatus] = useState("checking");
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close the mobile menu whenever navigation happens.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

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
    <header className="header-bar" style={{
      position: "sticky", top: 0, zIndex: 50,
      padding: "1.05rem 2rem",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      background: scrolled ? "var(--surface)" : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      transition: "all 0.3s ease",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.65rem", textDecoration: "none", color: "inherit" }}>
          <div style={{
            width: 30, height: 30, background: "var(--seal)", borderRadius: 7,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 15, fontWeight: 700, color: "#F5F0E6", flexShrink: 0,
            fontFamily: "var(--font-display)",
          }}>
            漢
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.12rem", letterSpacing: "-0.01em", color: "var(--text1)" }}>
            KanGen
          </span>
          <span style={{
            fontSize: "0.6rem", padding: "0.12rem 0.45rem",
            background: "var(--jade-dim)", border: "1px solid var(--jade-border)",
            borderRadius: 99, color: "var(--jade)", fontWeight: 600, letterSpacing: "0.06em",
            fontFamily: "var(--font-mono)",
          }}>
            BETA
          </span>
        </Link>

        <nav className="header-nav" style={{ display: "flex", gap: "0.25rem" }}>
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
        <div className="header-status" style={{
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

        {user ? (
          <div className="header-signin" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              title={user.email}
              style={{
                fontSize: "0.78rem", color: "var(--text2)", fontFamily: "var(--font-mono)",
                maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}
            >
              {user.email}
            </span>
            <button
              onClick={handleSignOut}
              style={{
                fontSize: "0.82rem", color: "var(--text2)",
                padding: "0.35rem 0.85rem", borderRadius: 7,
                border: "1px solid var(--border)", background: "var(--surface2)",
                cursor: "pointer", fontWeight: 500, fontFamily: "var(--font-body)",
                transition: "all 0.15s",
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = "var(--flame-border)"; e.currentTarget.style.color = "var(--flame)"; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text2)"; }}
            >
              Sign out
            </button>
          </div>
        ) : (
          <Link
            className="header-signin"
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
        )}

        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
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

        <button
          className="header-menu-btn"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          style={{
            width: 34, height: 34, borderRadius: 8,
            background: menuOpen ? "var(--surface3)" : "var(--surface2)",
            border: "1px solid var(--border)",
            cursor: "pointer", alignItems: "center", justifyContent: "center",
            fontSize: 15, color: "var(--text1)",
          }}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div className="header-mobile-menu" style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          background: "var(--surface)", borderBottom: "1px solid var(--border)",
          boxShadow: "var(--shadow-card)",
          padding: "0.75rem 1.25rem 1.25rem",
          display: "flex", flexDirection: "column", gap: "0.25rem",
          animation: "fadeUp 0.2s ease forwards",
        }}>
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                textDecoration: "none", padding: "0.7rem 0.5rem",
                fontSize: "0.95rem",
                fontWeight: location.pathname === link.to ? 600 : 400,
                color: location.pathname === link.to ? "var(--jade)" : "var(--text1)",
                borderRadius: 8,
                background: location.pathname === link.to ? "var(--jade-dim)" : "transparent",
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ height: 1, background: "var(--border)", margin: "0.4rem 0" }} />
          {user ? (
            <>
              <span style={{ padding: "0.4rem 0.5rem", fontSize: "0.78rem", color: "var(--text3)", fontFamily: "var(--font-mono)" }}>
                {user.email}
              </span>
              <button
                onClick={handleSignOut}
                style={{
                  textAlign: "left", padding: "0.7rem 0.5rem",
                  fontSize: "0.95rem", color: "var(--flame)", borderRadius: 8,
                  background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-body)",
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              style={{
                textDecoration: "none", padding: "0.7rem 0.5rem",
                fontSize: "0.95rem", color: "var(--text2)", borderRadius: 8,
              }}
            >
              Sign in
            </Link>
          )}
        </div>
      )}
    </header>
  );
}