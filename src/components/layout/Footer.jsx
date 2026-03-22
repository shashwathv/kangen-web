import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid var(--border)",
      padding: "2rem",
      marginTop: "4rem",
    }}>
      <div style={{
        maxWidth: 900, margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: "1rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: 24, height: 24, background: "var(--jade)", borderRadius: 5,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 900, color: "#fff",
          }}>
            漢
          </div>
          <span style={{ fontWeight: 700, fontSize: "0.88rem", letterSpacing: "-0.02em" }}>
            KanGen
          </span>
          <span style={{ color: "var(--text3)", fontSize: "0.8rem" }}>
            — Free forever, open source
          </span>
        </div>

        <div style={{ display: "flex", gap: "1.5rem" }}>
          {[
            { label: "Tool", to: "/app" },
            { label: "Dashboard", to: "/dashboard" },
            { label: "GitHub", to: "https://github.com/shashwathv/KanGen", external: true },
          ].map(l => (
            l.external
              ? <a key={l.label} href={l.to} target="_blank" rel="noreferrer" style={{ fontSize: "0.8rem", color: "var(--text3)", textDecoration: "none" }}
                  onMouseOver={e => e.currentTarget.style.color = "var(--text1)"}
                  onMouseOut={e => e.currentTarget.style.color = "var(--text3)"}
                >{l.label}</a>
              : <Link key={l.label} to={l.to} style={{ fontSize: "0.8rem", color: "var(--text3)", textDecoration: "none" }}
                  onMouseOver={e => e.currentTarget.style.color = "var(--text1)"}
                  onMouseOut={e => e.currentTarget.style.color = "var(--text3)"}
                >{l.label}</Link>
          ))}
        </div>
      </div>
    </footer>
  );
}