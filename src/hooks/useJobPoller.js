import { useEffect, useRef, useCallback } from "react";
import { API_URL, STEPS } from "../constants";

export function useJobPoller({ jobId, state, onDone, onError, onStep }) {
  const pollRef = useRef(null);

  const advanceStep = useCallback(() => {
    onStep(prev => Math.min(prev + 1, STEPS.length - 1));
  }, [onStep]);

  useEffect(() => {
    if (state !== "processing" || !jobId) return;

    const stepTimer = setInterval(advanceStep, 8000);

    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/jobs/${jobId}`);
        const data = await res.json();

        if (data.status === "done") {
          clearInterval(pollRef.current);
          clearInterval(stepTimer);
          onDone(data);
        } else if (data.status === "failed") {
          clearInterval(pollRef.current);
          clearInterval(stepTimer);
          onError(data.error || "Processing failed");
        }
      } catch {
        clearInterval(pollRef.current);
        clearInterval(stepTimer);
        onError("Could not reach the server. Check your connection.");
      }
    }, 3000);

    return () => {
      clearInterval(pollRef.current);
      clearInterval(stepTimer);
    };
  }, [state, jobId, advanceStep, onDone, onError]);

  return pollRef;
}
