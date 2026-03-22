import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import GridBackground from "../components/landing/GridBackground";
import HeroSection from "../components/landing/HeroSection";
import StatsBar from "../components/landing/StatsBar";
import HowItWorks from "../components/landing/HowItWorks";
import FeaturesSection from "../components/landing/FeaturesSection";

export default function Landing() {
  const [theme, setTheme] = useState(() =>
    localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", transition: "background 0.3s" }}>
      <GridBackground />
      <div style={{ position: "relative", zIndex: 10 }}>
        <Header theme={theme} onToggleTheme={() => setTheme(t => t === "dark" ? "light" : "dark")} />
        <main style={{ maxWidth: 900, margin: "0 auto", padding: "3.5rem 1.5rem 2rem" }}>
          <HeroSection />
          <StatsBar />
          <FeaturesSection />
          <HowItWorks />

          <div style={{
            marginTop: "5rem", padding: "3rem 2rem",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            textAlign: "center",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
              width: "60%", height: 1,
              background: "linear-gradient(90deg, transparent, var(--jade), transparent)",
            }} />
            <h2 style={{
              fontSize: "1.75rem", fontWeight: 800,
              letterSpacing: "-0.03em", marginBottom: "0.75rem",
            }}>
              Ready to ditch manual flashcards?
            </h2>
            <p style={{ color: "var(--text2)", fontSize: "0.9rem", marginBottom: "1.75rem" }}>
              Free forever. No account required to get started.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/app" style={{
                background: "var(--jade)", color: "#fff",
                textDecoration: "none", padding: "0.75rem 2rem",
                borderRadius: 10, fontWeight: 700, fontSize: "0.95rem",
                letterSpacing: "-0.01em",
                boxShadow: "0 4px 16px rgba(0,200,150,0.25)",
                transition: "all 0.15s",
              }}
                onMouseOver={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseOut={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                Try it free →
              </Link>
              <a
                href="https://github.com/shashwathv/KanGen"
                target="_blank" rel="noreferrer"
                style={{
                  background: "var(--surface2)", color: "var(--text1)",
                  textDecoration: "none", padding: "0.75rem 2rem",
                  borderRadius: 10, fontWeight: 600, fontSize: "0.95rem",
                  border: "1px solid var(--border)", transition: "all 0.15s",
                }}
                onMouseOver={e => e.currentTarget.style.borderColor = "var(--border-hover)"}
                onMouseOut={e => e.currentTarget.style.borderColor = "var(--border)"}
              >
                View on GitHub
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}