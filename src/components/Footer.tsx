"use client";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(232,0,60,0.12)",
        padding: "48px 32px 32px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 400,
          height: 200,
          background: "radial-gradient(ellipse, rgba(232,0,60,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 40,
            marginBottom: 48,
          }}
          className="footer-grid"
        >
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="17" stroke="#e8003c" strokeWidth="1.5" />
                <ellipse cx="18" cy="17" rx="3" ry="4" fill="#e8003c" />
                <ellipse cx="18" cy="22" rx="2.5" ry="3" fill="#e8003c" />
                <ellipse cx="16" cy="15.5" rx="1.5" ry="1.2" fill="white" transform="rotate(-15 16 15.5)" />
                <ellipse cx="20" cy="15.5" rx="1.5" ry="1.2" fill="white" transform="rotate(15 20 15.5)" />
              </svg>
              <span className="font-bebas" style={{ fontSize: 22, letterSpacing: 3 }}>
                SPIDEY<span style={{ color: "var(--accent-red)" }}>PICKS</span>
              </span>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.7, maxWidth: 280 }}>
              Your multiverse cinematic guide. Powered by TMDB. Inspired by every Spider-Man that ever swung through a universe.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              {["Twitter", "GitHub", "Discord"].map((s) => (
                <a
                  key={s}
                  href="#"
                  style={{
                    fontSize: 12,
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: 600,
                    letterSpacing: 1,
                    color: "var(--text-muted)",
                    textDecoration: "none",
                    padding: "6px 12px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 4,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent-red)";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(232,0,60,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.08)";
                  }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            {
              title: "Discover",
              links: ["Trending", "Now Playing", "Top Rated", "Upcoming"],
            },
            {
              title: "Genres",
              links: ["Action", "Sci-Fi", "Drama", "Horror", "Comedy"],
            },
            {
              title: "About",
              links: ["How it works", "TMDB Data", "Privacy", "Contact"],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4
                style={{
                  fontFamily: "'Bebas Neue', cursive",
                  letterSpacing: 2,
                  fontSize: 16,
                  color: "var(--accent-red)",
                  marginBottom: 16,
                }}
              >
                {col.title}
              </h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      style={{
                        color: "var(--text-muted)",
                        fontFamily: "'Rajdhani', sans-serif",
                        fontWeight: 500,
                        fontSize: 14,
                        textDecoration: "none",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "white"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)"; }}
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.05)",
            paddingTop: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p style={{ color: "var(--text-muted)", fontSize: 13, fontFamily: "'Rajdhani', sans-serif" }}>
            © 2026 SpideyPicks. Made by Guptha. Data by{" "}
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--accent-red)", textDecoration: "none" }}
            >
              TMDB
            </a>
            . Not affiliated with Marvel Studios.
          </p>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: 12,
              fontFamily: "'Rajdhani', sans-serif",
              letterSpacing: 1,
            }}
          >
            WITH ♥ ACROSS EVERY UNIVERSE
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
