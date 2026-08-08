import { useState, useCallback, useEffect, lazy, Suspense } from "react";
import { API_BASE, STEPS, MAX_IMAGES_PER_UPLOAD } from "../constants";
import Header from "../components/layout/Header";
import GridBackground from "../components/landing/GridBackground";
import UploadZone from "../components/tool/UploadZone";
import ReviewView from "../components/tool/ReviewView";
import SuccessView from "../components/tool/SuccessView";
import ErrorView from "../components/tool/ErrorView";
import { useJobPoller } from "../hooks/useJobPoller";
import { supabase } from "../lib/supabase";

// framer-motion (used only by ProcessingView) is a sizeable chunk of JS —
// load it on demand instead of blocking the initial /app bundle, so the
// upload button is interactive as soon as the page paints.
const ProcessingView = lazy(() => import("../components/tool/ProcessingView"));

export default function AppPage() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [state, setState] = useState("idle");
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [jobId, setJobId] = useState(null);
  const [filename, setFilename] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [cards, setCards] = useState([]);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildError, setBuildError] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // "done" here means extraction finished — the extracted cards still need
  // review/build via /v1/build before a deck actually exists.
  const handleExtracted = useCallback((data) => {
    setStepIndex(STEPS.length);
    setCards(data.cards || []);
    setState("review");
  }, []);

  const handleError = useCallback((msg) => {
    setError(msg);
    setState("error");
  }, []);

  useJobPoller({ jobId, state, onDone: handleExtracted, onError: handleError, onStep: setStepIndex });

  const handleAddFiles = useCallback((newFiles) => {
    setFiles(prev => [...prev, ...newFiles].slice(0, MAX_IMAGES_PER_UPLOAD));
  }, []);

  const handleRemoveFile = useCallback((idx) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  }, []);

  const handleSubmitFiles = useCallback(async () => {
    if (files.length === 0) return;
    setFilename(files.length === 1 ? files[0].name : `${files.length} images`);
    setStepIndex(0);
    setState("processing");
    const formData = new FormData();
    files.forEach(f => formData.append("images", f));
    try {
      const res = await fetch(`${API_BASE}/process`, { method: "POST", body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.detail || "Could not connect to the server.");
      setJobId(data.job_id);
    } catch (err) {
      handleError(err.message || "Could not connect to the server.");
    }
  }, [files, handleError]);

  const handleBuild = useCallback(async (editedCards, deckName) => {
    setIsBuilding(true);
    setBuildError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers = { "Content-Type": "application/json" };
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      const res = await fetch(`${API_BASE}/build`, {
        method: "POST",
        headers,
        body: JSON.stringify({ cards: editedCards, job_id: jobId, deck_name: deckName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to generate the deck.");
      setResult(data);
      setState("done");
    } catch (err) {
      setBuildError(err.message || "Failed to generate the deck.");
    } finally {
      setIsBuilding(false);
    }
  }, [jobId]);

  const reset = useCallback(() => {
    setState("idle"); setJobId(null); setFilename(""); setFiles([]);
    setStepIndex(0); setCards([]); setIsBuilding(false); setBuildError(null);
    setResult(null); setError(null);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", transition: "background 0.3s" }}>
      <GridBackground />
      <div style={{ position: "relative", zIndex: 10 }}>
        <Header theme={theme} onToggleTheme={() => setTheme(t => t === "dark" ? "light" : "dark")} />
        <main className="page-main" style={{ maxWidth: state === "review" ? 720 : 600, margin: "0 auto", padding: "3rem 1.5rem 6rem", transition: "max-width 0.3s ease" }}>

          {state === "idle" && (
            <>
              <div style={{
                marginBottom: "2.5rem",
                animation: "fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
              }}>
                <h1 style={{
                  fontFamily: "var(--font-display)", fontSize: "2.3rem", fontWeight: 600,
                  letterSpacing: "-0.01em", marginBottom: "0.5rem",
                }}>
                  Generate your deck
                </h1>
                <p style={{ color: "var(--text2)", fontSize: "0.9rem" }}>
                  Upload up to {MAX_IMAGES_PER_UPLOAD} study sheets and get one Anki deck in under a minute.
                </p>
              </div>
              <UploadZone
                files={files}
                onAddFiles={handleAddFiles}
                onRemoveFile={handleRemoveFile}
                onSubmit={handleSubmitFiles}
                isDragging={isDragging}
                setIsDragging={setIsDragging}
              />
            </>
          )}

          {state === "processing" && (
            <Suspense fallback={
              <div style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: 16, padding: "2.5rem", textAlign: "center",
                color: "var(--text3)", fontSize: "0.82rem", fontFamily: "var(--font-mono)",
              }}>
                Loading…
              </div>
            }>
              <ProcessingView stepIndex={stepIndex} filename={filename} />
            </Suspense>
          )}

          {state === "review" && (
            <ReviewView
              cards={cards}
              onBuild={handleBuild}
              onReset={reset}
              isBuilding={isBuilding}
              buildError={buildError}
            />
          )}

          {state === "done" && result && (
            <SuccessView stats={result.stats} downloadUrl={result.download_url} savedToDashboard={Boolean(result.deck_id)} onReset={reset} />
          )}

          {state === "error" && (
            <ErrorView message={error} onReset={reset} />
          )}
        </main>
      </div>
    </div>
  );
}