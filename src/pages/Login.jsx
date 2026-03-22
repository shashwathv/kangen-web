import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";

export default function Login() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const inputStyle = {
    width: "100%", padding: "0.75rem 1rem",
    background: "var(--surface2)", border: "1px solid var(--border)",
    borderRadius: 10, color: "var(--text1)",
    fontSize: "0.9rem", fontFamily: "var(--font-body)",
    outline: "none", transition: "border-color 0.15s",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", transition: "background 0.3s" }}>
      <Header theme={theme} onToggleTheme={() => setTheme(t => t === "dark" ? "light" : "dark")} />
      <main style={{
        maxWidth: 420, margin: "0 auto",
        padding: "5rem 1.5rem",
        animation: "fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
      }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: 44, height: 44, background: "var(--jade)", borderRadius: 11,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, fontWeight: 900, color: "#fff",
            margin: "0 auto 1rem",
          }}>
            漢
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "0.35rem" }}>
            {mode === "login" ? "Welcome back" : "Create account"}
          </h1>
          <p style={{ color: "var(--text2)", fontSize: "0.85rem" }}>
            {mode === "login" ? "Sign in to access your decks" : "Free forever, no credit card needed"}
          </p>
        </div>

        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 16, padding: "2rem",
          boxShadow: "var(--shadow-card)",
        }}>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: "0.4rem", marginBottom: "1.75rem",
            background: "var(--surface2)", padding: "0.3rem",
            borderRadius: 10, border: "1px solid var(--border)",
          }}>
            {["login", "signup"].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                padding: "0.55rem", borderRadius: 8, border: "none",
                background: mode === m ? "var(--surface)" : "transparent",
                color: mode === m ? "var(--text1)" : "var(--text3)",
                fontWeight: mode === m ? 600 : 400,
                fontSize: "0.85rem", cursor: "pointer",
                boxShadow: mode === m ? "var(--shadow-card)" : "none",
                transition: "all 0.15s", fontFamily: "var(--font-body)",
                border: mode === m ? "1px solid var(--border)" : "1px solid transparent",
              }}>
                {m === "login" ? "Sign in" : "Sign up"}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            <div>
              <label style={{ fontSize: "0.78rem", color: "var(--text2)", marginBottom: "0.4rem", display: "block", fontWeight: 500 }}>
                Email
              </label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "var(--jade-border)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
            </div>
            <div>
              <label style={{ fontSize: "0.78rem", color: "var(--text2)", marginBottom: "0.4rem", display: "block", fontWeight: 500 }}>
                Password
              </label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "var(--jade-border)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
            </div>

            <button style={{
              width: "100%", padding: "0.8rem",
              background: "var(--jade)", color: "#fff",
              border: "none", borderRadius: 10,
              fontWeight: 700, fontSize: "0.92rem",
              cursor: "pointer", fontFamily: "var(--font-body)",
              marginTop: "0.25rem", transition: "opacity 0.15s",
              boxShadow: "0 2px 12px rgba(0,200,150,0.25)",
            }}
              onMouseOver={e => e.currentTarget.style.opacity = "0.88"}
              onMouseOut={e => e.currentTarget.style.opacity = "1"}
            >
              {mode === "login" ? "Sign in" : "Create account"}
            </button>
          </div>

          <div style={{
            display: "flex", alignItems: "center", gap: "0.75rem",
            margin: "1.25rem 0",
          }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ fontSize: "0.72rem", color: "var(--text3)" }}>or continue with</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          <button style={{
            width: "100%", padding: "0.75rem",
            background: "var(--surface2)", color: "var(--text1)",
            border: "1px solid var(--border)", borderRadius: 10,
            fontWeight: 500, fontSize: "0.88rem",
            cursor: "pointer", fontFamily: "var(--font-body)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
            transition: "border-color 0.15s",
          }}
            onMouseOver={e => e.currentTarget.style.borderColor = "var(--border-hover)"}
            onMouseOut={e => e.currentTarget.style.borderColor = "var(--border)"}
          >
            <span style={{ fontSize: 16 }}>G</span>
            Continue with Google
          </button>

          <p style={{
            marginTop: "1.25rem", textAlign: "center",
            fontSize: "0.75rem", color: "var(--text3)",
          }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setMode(mode === "login" ? "signup" : "login")} style={{
              background: "none", border: "none", color: "var(--jade)",
              cursor: "pointer", fontSize: "0.75rem", fontFamily: "var(--font-body)",
              fontWeight: 600, padding: 0,
            }}>
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.75rem", color: "var(--text3)" }}>
          <Link to="/app" style={{ color: "var(--text3)", textDecoration: "none" }}
            onMouseOver={e => e.currentTarget.style.color = "var(--text2)"}
            onMouseOut={e => e.currentTarget.style.color = "var(--text3)"}
          >
            Continue without account →
          </Link>
        </p>
      </main>
    </div>
  );
}