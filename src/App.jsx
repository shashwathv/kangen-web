import { useState, useCallback, useEffect } from "react";
import { API_URL, STEPS } from "./constants";
import Header from "./components/Header";
import GridBackground from "./components/GridBackground";
import HeroSection from "./components/HeroSection";
import StatsBar from "./components/StatsBar";
import HowItWorks from "./components/HowItWorks";
import UploadZone from "./components/UploadZone";
import ProcessingView from "./components/ProcessingView";
import SuccessView from "./components/SuccessView";
import ErrorView from "./components/ErrorView";
import { useJobPoller } from "./hooks/useJobPoller";

export default function App() {
  const [theme, setTheme] = useState("dark");
  const [state, setState] = useState("idle");
  const [isDragging, setIsDragging] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [filename, setFilename] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(t => t === "dark" ? "light" : "dark");
  }, []);

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
    <div style={{ minHeight: "100vh", background: "var(--bg)", transition: "background 0.3s ease" }}>
      <GridBackground />
      <div style={{ position: "relative", zIndex: 10 }}>
        <Header theme={theme} onToggleTheme={toggleTheme} />

        <main style={{ maxWidth: 640, margin: "0 auto", padding: "3rem 1.5rem 6rem" }}>

          {state === "idle" && (
            <>
              <HeroSection />
              <UploadZone onFile={handleFile} isDragging={isDragging} setIsDragging={setIsDragging} />
              <StatsBar />
              <HowItWorks />
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