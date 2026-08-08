import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import GridBackground from "../components/landing/GridBackground";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { API_BASE } from "../constants";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function DeckCard({ deck, onRemove, onDownload, isBusy }) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 10, padding: "1.25rem",
      boxShadow: "var(--shadow-card)", transition: "border-color 0.15s, transform 0.15s",
    }}
      onMouseOver={e => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseOut={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{
        height: 84, position: "relative", background: "var(--surface2)",
        borderRadius: 7, marginBottom: "1rem", overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center",
        border: "1px solid var(--border)",
      }}>
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "var(--border-hover)" }} />
        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "var(--border-hover)" }} />
        <span style={{ position: "relative", fontSize: 26, color: "var(--text2)", letterSpacing: "0.1em" }}>
          漢字
        </span>
      </div>
      <p style={{ fontWeight: 600, fontSize: "0.88rem", marginBottom: "0.3rem", letterSpacing: "-0.01em" }}>
        {deck.name}
      </p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{
          fontSize: "0.72rem", color: "var(--jade)",
          background: "var(--jade-dim)", border: "1px solid var(--jade-border)",
          borderRadius: 99, padding: "0.15rem 0.5rem",
          fontWeight: 600,
        }}>
          {deck.card_count} cards
        </span>
        <span style={{ fontSize: "0.72rem", color: "var(--text3)", fontFamily: "var(--font-mono)" }}>
          {formatDate(deck.created_at)}
        </span>
      </div>
      <div style={{
        marginTop: "0.85rem", paddingTop: "0.85rem",
        borderTop: "1px solid var(--border)",
        display: "flex", gap: "0.5rem",
      }}>
        <button
          onClick={onDownload}
          disabled={isBusy}
          style={{
            flex: 1, padding: "0.45rem",
            background: "var(--jade)", color: "#0B0A08",
            border: "none", borderRadius: 6,
            fontSize: "0.75rem", fontWeight: 600,
            cursor: isBusy ? "not-allowed" : "pointer", fontFamily: "var(--font-body)",
            opacity: isBusy ? 0.6 : 1, transition: "opacity 0.15s",
          }}
        >
          ↓ Download
        </button>
        <button
          onClick={onRemove}
          disabled={isBusy}
          title="Remove this deck"
          style={{
            padding: "0.45rem 0.75rem",
            background: "var(--surface2)", color: "var(--text2)",
            border: "1px solid var(--border)", borderRadius: 6,
            fontSize: "0.75rem", cursor: isBusy ? "not-allowed" : "pointer",
            fontFamily: "var(--font-body)", transition: "all 0.15s",
            opacity: isBusy ? 0.6 : 1,
          }}
          onMouseOver={e => { e.currentTarget.style.borderColor = "var(--flame-border)"; e.currentTarget.style.color = "var(--flame)"; }}
          onMouseOut={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text2)"; }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [decks, setDecks] = useState([]);
  const [decksLoading, setDecksLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState(null);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!user) {
      setDecks([]);
      setDecksLoading(false);
      return;
    }
    setDecksLoading(true);
    supabase
      .from("decks")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (fetchError) setError(fetchError.message);
        else setDecks(data || []);
        setDecksLoading(false);
      });
  }, [user]);

  const authedFetch = useCallback(async (path, options = {}) => {
    const { data: { session } } = await supabase.auth.getSession();
    return fetch(`${API_BASE}${path}`, {
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${session?.access_token}` },
    });
  }, []);

  const handleRemove = useCallback(async (id) => {
    setBusyId(id);
    setError(null);
    try {
      const res = await authedFetch(`/decks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to remove that deck.");
      setDecks(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }, [authedFetch]);

  const handleDownload = useCallback(async (id) => {
    setBusyId(id);
    setError(null);
    try {
      const res = await authedFetch(`/decks/${id}/download`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to generate a download link.");
      window.open(data.download_url, "_blank", "noreferrer");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }, [authedFetch]);

  const totalCards = decks.reduce((sum, d) => sum + d.card_count, 0);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", transition: "background 0.3s", position: "relative" }}>
      <GridBackground />
      <div style={{ position: "relative", zIndex: 10 }}>
      <Header theme={theme} onToggleTheme={() => setTheme(t => t === "dark" ? "light" : "dark")} />
      <main className="page-main" style={{ maxWidth: 900, margin: "0 auto", padding: "3rem 1.5rem" }}>

        <div style={{
          display: "flex", alignItems: "flex-start",
          justifyContent: "space-between", flexWrap: "wrap",
          gap: "1rem", marginBottom: "2.5rem",
          animation: "fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
        }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 600, letterSpacing: "-0.01em", marginBottom: "0.3rem" }}>
              Your decks
            </h1>
            <p style={{ color: "var(--text2)", fontSize: "0.85rem" }}>
              {!user
                ? "Sign in to see decks saved here"
                : decks.length === 0
                  ? "No decks yet — generate your first one"
                  : `${decks.length} deck${decks.length === 1 ? "" : "s"} · ${totalCards} cards total`}
            </p>
          </div>
          <Link to="/app" style={{
            textDecoration: "none",
            background: "var(--jade)", color: "#0B0A08",
            padding: "0.65rem 1.25rem", borderRadius: 8,
            fontWeight: 700, fontSize: "0.88rem",
            boxShadow: "0 2px 12px rgba(0,200,150,0.2)",
            transition: "all 0.15s",
          }}
            onMouseOver={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseOut={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            + New deck
          </Link>
        </div>

        {error && (
          <p style={{
            color: "var(--flame)", fontSize: "0.82rem", marginBottom: "1rem",
            background: "var(--flame-dim)", border: "1px solid var(--flame-border)",
            borderRadius: 8, padding: "0.6rem 0.85rem",
          }}>
            {error}
          </p>
        )}

        {!authLoading && !user ? (
          <div style={{
            padding: "1.25rem 1.5rem",
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 10,
            animation: "fadeUp 0.6s 0.1s cubic-bezier(0.16,1,0.3,1) both",
          }}>
            <p style={{ fontSize: "0.85rem", color: "var(--text2)", lineHeight: 1.7, marginBottom: "1rem" }}>
              Decks you generate while signed in are saved here automatically. You can still use the tool without an account — you just won't see a history of what you've made.
            </p>
            <Link to="/login" style={{
              display: "inline-block", textDecoration: "none",
              background: "var(--jade)", color: "#0B0A08",
              padding: "0.6rem 1.25rem", borderRadius: 8,
              fontWeight: 700, fontSize: "0.85rem",
            }}>
              Sign in
            </Link>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "1rem",
            animation: "fadeUp 0.6s 0.1s cubic-bezier(0.16,1,0.3,1) both",
          }}>
            {decksLoading ? (
              <p style={{ color: "var(--text3)", fontSize: "0.85rem", fontFamily: "var(--font-mono)" }}>Loading…</p>
            ) : (
              decks.map(deck => (
                <DeckCard
                  key={deck.id}
                  deck={deck}
                  isBusy={busyId === deck.id}
                  onRemove={() => handleRemove(deck.id)}
                  onDownload={() => handleDownload(deck.id)}
                />
              ))
            )}

            <Link to="/app" style={{
              textDecoration: "none",
              background: "transparent",
              border: "2px dashed var(--border-hover)",
              borderRadius: 10, padding: "1.25rem",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: "0.5rem", minHeight: 200,
              cursor: "pointer", transition: "all 0.2s",
              color: "var(--text3)",
            }}
              onMouseOver={e => { e.currentTarget.style.borderColor = "var(--jade-border)"; e.currentTarget.style.color = "var(--jade)"; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.color = "var(--text3)"; }}
            >
              <span style={{ fontSize: 28 }}>+</span>
              <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>Generate new deck</span>
            </Link>
          </div>
        )}
      </main>
      <Footer />
      </div>
    </div>
  );
}
