import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import GridBackground from "../components/landing/GridBackground";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

async function sha256Hex(text) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export default function Login() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Already signed in — nothing to do here.
  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setNotice(null);

    const { error: authError } = mode === "login"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    setSubmitting(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    if (mode === "signup") {
      setNotice("Check your inbox to confirm your email, then sign in.");
      setMode("login");
    } else {
      navigate("/dashboard");
    }
  };

  const googleNonceRef = useRef(null);

  // Google's account chooser shows the domain that initiated the request. Using
  // Identity Services here (client-side ID token) instead of Supabase's OAuth
  // redirect means that domain is ours, not the raw Supabase project URL.
  const handleGoogleCredential = useCallback(async (response) => {
    setError(null);
    const { error: authError } = await supabase.auth.signInWithIdToken({
      provider: "google",
      token: response.credential,
      nonce: googleNonceRef.current,
    });
    if (authError) {
      setError(authError.message);
    } else {
      navigate("/dashboard");
    }
  }, [navigate]);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    let cancelled = false;

    (async function init() {
      const nonce = crypto.randomUUID();
      googleNonceRef.current = nonce;
      const hashedNonce = await sha256Hex(nonce);

      const waitForGis = () => new Promise(resolve => {
        (function poll() {
          if (window.google?.accounts?.id) resolve();
          else requestAnimationFrame(poll);
        })();
      });
      await waitForGis();
      if (cancelled) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCredential,
        nonce: hashedNonce,
      });
      const el = document.getElementById("google-signin-button");
      if (el) {
        window.google.accounts.id.renderButton(el, {
          theme: "filled_black", size: "large", shape: "pill",
          text: "continue_with", width: 360,
        });
      }
    })();

    return () => { cancelled = true; };
  }, [handleGoogleCredential]);

  const inputStyle = {
    width: "100%", padding: "0.75rem 1rem",
    background: "var(--surface2)", border: "1px solid var(--border)",
    borderRadius: 8, color: "var(--text1)",
    fontSize: "0.9rem", fontFamily: "var(--font-body)",
    outline: "none", transition: "border-color 0.15s, box-shadow 0.15s",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", transition: "background 0.3s", position: "relative" }}>
      <GridBackground />
      <div style={{ position: "relative", zIndex: 10 }}>
      <Header theme={theme} onToggleTheme={() => setTheme(t => t === "dark" ? "light" : "dark")} />
      <main className="page-main login-main" style={{
        maxWidth: 420, margin: "0 auto",
        padding: "5rem 1.5rem",
        animation: "fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
      }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: 44, height: 44, background: "var(--seal)", borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, fontWeight: 700, color: "#F5F0E6", fontFamily: "var(--font-display)",
            margin: "0 auto 1rem",
          }}>
            漢
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.7rem", fontWeight: 600, letterSpacing: "-0.01em", marginBottom: "0.4rem" }}>
            {mode === "login" ? "Welcome back" : "Create account"}
          </h1>
          <p style={{ color: "var(--text2)", fontSize: "0.85rem" }}>
            {mode === "login" ? "Sign in to access your decks" : "Free forever, no credit card needed"}
          </p>
        </div>

        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 14, padding: "2rem",
          boxShadow: "var(--shadow-card)",
        }}>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: "0.4rem", marginBottom: "1.75rem",
            background: "var(--surface2)", padding: "0.3rem",
            borderRadius: 8, border: "1px solid var(--border)",
          }}>
            {["login", "signup"].map(m => (
              <button key={m} type="button" onClick={() => { setMode(m); setError(null); setNotice(null); }} style={{
                padding: "0.55rem", borderRadius: 8,
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

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            <div>
              <label style={{ fontSize: "0.78rem", color: "var(--text2)", marginBottom: "0.4rem", display: "block", fontWeight: 500 }}>
                Email
              </label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = "var(--jade-border)"; e.target.style.boxShadow = "0 0 0 3px var(--jade-dim)"; }}
                onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
              />
            </div>
            <div>
              <label style={{ fontSize: "0.78rem", color: "var(--text2)", marginBottom: "0.4rem", display: "block", fontWeight: 500 }}>
                Password
              </label>
              <input
                type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = "var(--jade-border)"; e.target.style.boxShadow = "0 0 0 3px var(--jade-dim)"; }}
                onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
              />
            </div>

            {error && (
              <p style={{ fontSize: "0.8rem", color: "var(--flame)", margin: 0 }}>{error}</p>
            )}
            {notice && (
              <p style={{ fontSize: "0.8rem", color: "var(--jade)", margin: 0 }}>{notice}</p>
            )}

            <button type="submit" disabled={submitting} style={{
              width: "100%", padding: "0.8rem",
              background: "var(--jade)", color: "#0B0A08",
              border: "none", borderRadius: 8,
              fontWeight: 700, fontSize: "0.92rem",
              cursor: submitting ? "not-allowed" : "pointer", fontFamily: "var(--font-body)",
              marginTop: "0.25rem", transition: "opacity 0.15s",
              boxShadow: "0 2px 12px rgba(0,200,150,0.25)",
              opacity: submitting ? 0.7 : 1,
            }}
              onMouseOver={e => e.currentTarget.style.opacity = "0.88"}
              onMouseOut={e => e.currentTarget.style.opacity = submitting ? "0.7" : "1"}
            >
              {submitting ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <div style={{
            display: "flex", alignItems: "center", gap: "0.75rem",
            margin: "1.25rem 0",
          }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ fontSize: "0.72rem", color: "var(--text3)" }}>or continue with</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          <div id="google-signin-button" style={{ display: "flex", justifyContent: "center" }} />

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
    </div>
  );
}