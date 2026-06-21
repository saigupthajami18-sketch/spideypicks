"use client";
import { useEffect, useRef } from "react";

const UNIVERSES = [
  {
    id: "earth-616",
    name: "Earth-616",
    label: "Main Marvel Universe",
    desc: "The primary continuity — where it all began. Classic heroes, iconic villains, and the threads that bind every story.",
    color: "#e8003c",
    icon: "⬡",
    genre: "Action & Adventure",
  },
  {
    id: "earth-1610",
    name: "Earth-1610",
    label: "Ultimate Universe",
    desc: "Gritty, modern reimaginings of beloved characters. Darker tones, higher stakes, and no rules.",
    color: "#1a6bff",
    icon: "◈",
    genre: "Drama & Thriller",
  },
  {
    id: "earth-65",
    name: "Earth-65",
    label: "Spider-Gwen Universe",
    desc: "A world turned upside down — where Gwen Stacy became the spider. Fresh perspective, vibrant energy.",
    color: "#a855f7",
    icon: "✦",
    genre: "Sci-Fi & Fantasy",
  },
  {
    id: "earth-928",
    name: "Earth-928",
    label: "Spider-Man 2099",
    desc: "The neon-drenched future of Nueva York. Cyberpunk aesthetics meet superhero mythology.",
    color: "#00d4ff",
    icon: "◉",
    genre: "Cyberpunk & Sci-Fi",
  },
];

export default function MultiverseSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll(".universe-card");
    if (!cards) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = "1";
            (entry.target as HTMLElement).style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.15 }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="multiverse"
      ref={sectionRef}
      style={{
        padding: "80px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background grid */}
      <div
        className="spider-web-bg"
        style={{ position: "absolute", inset: 0, opacity: 0.4 }}
      />

      {/* Radial glow center */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          background:
            "radial-gradient(circle, rgba(232,0,60,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px", position: "relative", zIndex: 2 }}>
        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: 4,
              color: "var(--accent-red)",
              marginBottom: 12,
              textTransform: "uppercase",
            }}
          >
            ◈ Enter the
          </p>
          <h2
            className="font-bebas"
            style={{
              fontSize: "clamp(3rem, 7vw, 5.5rem)",
              letterSpacing: 4,
              lineHeight: 0.95,
              background: "linear-gradient(135deg, #ffffff 0%, #888 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            MULTIVERSE
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #e8003c, #ff6b6b)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              PORTALS
            </span>
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: 16,
              maxWidth: 520,
              margin: "16px auto 0",
              lineHeight: 1.7,
            }}
          >
            Every universe tells a different story. Step through the portal and
            discover films from every dimension of cinema.
          </p>
        </div>

        {/* Portal Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {UNIVERSES.map((u, i) => (
            <div
              key={u.id}
              id={`portal-${u.id}`}
              className="universe-card"
              style={{
                opacity: 0,
                transform: "translateY(40px)",
                transition: `all 0.6s ease ${i * 0.12}s`,
                position: "relative",
                borderRadius: 12,
                padding: 28,
                background: "rgba(255,255,255,0.02)",
                border: `1px solid ${u.color}30`,
                cursor: "pointer",
                overflow: "hidden",
                backdropFilter: "blur(10px)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = `${u.color}0a`;
                el.style.borderColor = `${u.color}60`;
                el.style.transform = "translateY(-6px)";
                el.style.boxShadow = `0 20px 50px rgba(0,0,0,0.4), 0 0 30px ${u.color}20`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = "rgba(255,255,255,0.02)";
                el.style.borderColor = `${u.color}30`;
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "none";
              }}
            >
              {/* Rotating ring decoration */}
              <div
                style={{
                  position: "absolute",
                  top: -40,
                  right: -40,
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  border: `1px solid ${u.color}20`,
                  animation: "rotateSlow 20s linear infinite",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  border: `1px solid ${u.color}15`,
                  animation: "rotateSlow 14s linear infinite reverse",
                }}
              />

              {/* Icon */}
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 10,
                  background: `${u.color}15`,
                  border: `1px solid ${u.color}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  marginBottom: 20,
                  color: u.color,
                }}
              >
                {u.icon}
              </div>

              {/* Universe ID tag */}
              <span
                style={{
                  fontFamily: "'Bebas Neue', cursive",
                  fontSize: 13,
                  letterSpacing: 3,
                  color: u.color,
                  opacity: 0.8,
                }}
              >
                {u.name}
              </span>

              <h3
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 700,
                  fontSize: 20,
                  color: "white",
                  marginTop: 4,
                  marginBottom: 10,
                }}
              >
                {u.label}
              </h3>

              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: 14,
                  lineHeight: 1.65,
                  marginBottom: 20,
                }}
              >
                {u.desc}
              </p>

              {/* Genre tag */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span
                  style={{
                    fontSize: 12,
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: 600,
                    padding: "4px 10px",
                    borderRadius: 4,
                    background: `${u.color}15`,
                    color: u.color,
                    letterSpacing: 0.5,
                  }}
                >
                  {u.genre}
                </span>
                <span style={{ color: u.color, fontSize: 18 }}>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
