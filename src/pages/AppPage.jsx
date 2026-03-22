import { useState, useCallback, useEffect } from "react";
import { API_URL, STEPS } from "../constants";
import Header from "../components/layout/Header";
import GridBackground from "../components/landing/GridBackground";
import UploadZone from "../components/tool/UploadZone";
import ProcessingView from "../components/tool/ProcessingView";
import SuccessView from "../components/tool/SuccessView";
import ErrorView from "../components/tool/ErrorView";
import { useJobPoller } from "../hooks/useJobPoller";

export default function AppPage() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [state, setState] = useState("idle");
  const [isDragging, setIsDragging] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [filename, setFilename] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleDone = useCallback((data) => {
    setStepIndex(STEPS.length);
    setResult(data);
    setState("done");
  }, []);

  const handleError = useCallback((msg) => {
    setError(msg);
    setState("error");
  }, []);

  useJobPoller({ jobId, state, onDone: handleDone, onError: handleError, onStep: setStepIndex });

  const handleFile = useCallback(async (file) => {
    setFilename(file.name);
    setStepIndex(0);
    setState("processing");
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch(`${API_URL}/process`, { method: "POST", body: formData });
      const data = await res.json();
      setJobId(data.job_id);
    } catch {
      handleError("Could not connect to the server.");
    }
  }, [handleError]);

  const reset = useCallback(() => {
    setState("idle"); setJobId(null); setFilename("");
    setStepIndex(0); setResult(null); setError(null);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", transition: "background 0.3s" }}>
      <GridBackground />
      <div style={{ position: "relative", zIndex: 10 }}>
        <Header theme={theme} onToggleTheme={() => setTheme(t => t === "dark" ? "light" : "dark")} />
        <main style={{ maxWidth: 600, margin: "0 auto", padding: "3rem 1.5rem 6rem" }}>

          {state === "idle" && (
            <>
              <div style={{
                marginBottom: "2.5rem",
                animation: "fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
              }}>
                <h1 style={{
                  fontSize: "2rem", fontWeight: 800,
                  letterSpacing: "-0.04em", marginBottom: "0.5rem",
                }}>
                  Generate your deck
                </h1>
                <p style={{ color: "var(--text2)", fontSize: "0.9rem" }}>
                  Upload a kanji study sheet and get an Anki deck in under a minute.
                </p>
              </div>
              <UploadZone onFile={handleFile} isDragging={isDragging} setIsDragging={setIsDragging} />
            </>
          )}

          {state === "processing" && (
            <ProcessingView stepIndex={stepIndex} filename={filename} />
          )}

          {state === "done" && result && (
            <SuccessView stats={result.stats} downloadUrl={result.download_url} onReset={reset} />
          )}

          {state === "error" && (
            <ErrorView message={error} onReset={reset} />
          )}
        </main>
      </div>
    </div>
  );
}