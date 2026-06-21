"use client";
import { useEffect, useRef, useState } from "react";
import { Movie, backdropUrl, posterUrl, formatRating, formatYear, GENRE_MAP } from "@/lib/tmdb";

interface Props { movies: Movie[] }

export default function HeroSection({ movies }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [fading, setFading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const featured = movies.slice(0, 5);
  const movie = featured[activeIdx];

  /* ── Three.js-style web particle canvas ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type Pt = { x: number; y: number; vx: number; vy: number; r: number; opacity: number };
    const pts: Pt[] = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      /* Connect close nodes — spider-web effect */
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(232,0,60,${0.12 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      /* Nodes */
      pts.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,0,60,${p.opacity})`;
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  /* ── Auto-cycle ── */
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setActiveIdx((i) => (i + 1) % featured.length);
        setFading(false);
      }, 400);
    }, 6000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [featured.length]);

  const goTo = (idx: number) => {
    if (idx === activeIdx) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setFading(true);
    setTimeout(() => { setActiveIdx(idx); setFading(false); }, 400);
  };

  if (!movie) return null;
  const bg = backdropUrl(movie.backdrop_path, "original");
  const genres = (movie.genre_ids || []).slice(0, 3).map((id) => GENRE_MAP[id]).filter(Boolean);

  return (
    <section id="hero" style={{ position: "relative", height: "100vh", minHeight: 600, overflow: "hidden" }}>
      {/* Backdrop */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: bg ? `url(${bg})` : "none",
        backgroundSize: "cover", backgroundPosition: "center top",
        transition: "opacity 0.6s ease",
        opacity: fading ? 0 : 1,
      }} />

      {/* Gradient overlays */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to right, rgba(5,5,5,0.95) 35%, rgba(5,5,5,0.5) 65%, rgba(5,5,5,0.1) 100%)",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(5,5,5,1) 0%, transparent 50%)",
      }} />

      {/* Particle Canvas */}
      <canvas ref={canvasRef} id="hero-canvas" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 10,
        height: "100%", display: "flex", alignItems: "center",
        maxWidth: 1400, margin: "0 auto", padding: "0 40px",
      }}>
        <div style={{
          maxWidth: 640,
          opacity: fading ? 0 : 1,
          transform: fading ? "translateY(20px)" : "translateY(0)",
          transition: "all 0.5s ease",
        }}>
          {/* Badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <span style={{
              padding: "4px 14px",
              background: "linear-gradient(135deg, #e8003c, #ff4d6d)",
              borderRadius: 3,
              fontFamily: "'Bebas Neue', cursive",
              letterSpacing: 2,
              fontSize: 13,
            }}>
              ◈ FEATURED
            </span>
            <span style={{ color: "var(--text-muted)", fontFamily: "'Rajdhani', sans-serif", fontSize: 13 }}>
              #{activeIdx + 1} of {featured.length}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-bebas" style={{
            fontSize: "clamp(3rem, 7vw, 6rem)",
            lineHeight: 0.95,
            letterSpacing: 2,
            marginBottom: 16,
            textShadow: "0 4px 40px rgba(0,0,0,0.8)",
          }}>
            {movie.title}
          </h1>

          {/* Meta row */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18, flexWrap: "wrap" }}>
            <span className="rating-badge">
              ★ {formatRating(movie.vote_average)}
            </span>
            <span style={{ color: "var(--text-muted)", fontFamily: "'Rajdhani', sans-serif", fontSize: 14 }}>
              {formatYear(movie.release_date)}
            </span>
            <span style={{ color: "var(--text-muted)" }}>•</span>
            {genres.map((g) => (
              <span key={g} className="genre-tag">{g}</span>
            ))}
          </div>

          {/* Overview */}
          <p style={{
            color: "var(--text-secondary)",
            fontSize: 15,
            lineHeight: 1.7,
            marginBottom: 32,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {movie.overview}
          </p>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <a href={`#movie-${movie.id}`} className="btn-primary" id={`hero-cta-${movie.id}`}>
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Watch Now
            </a>
            <a href="#trending" className="btn-secondary">
              Explore More
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Poster thumbnail (right side) */}
        <div style={{
          position: "absolute", right: 40, top: "50%",
          transform: "translateY(-50%)",
          display: "flex", gap: 12, alignItems: "center",
        }} className="hero-thumbs">
          {featured.map((m, i) => (
            <button
              key={m.id}
              id={`hero-thumb-${i}`}
              onClick={() => goTo(i)}
              style={{
                border: i === activeIdx ? "2px solid var(--accent-red)" : "2px solid rgba(255,255,255,0.15)",
                borderRadius: 6,
                overflow: "hidden",
                cursor: "pointer",
                background: "none",
                padding: 0,
                width: i === activeIdx ? 68 : 52,
                height: i === activeIdx ? 102 : 78,
                transition: "all 0.4s ease",
                boxShadow: i === activeIdx ? "0 0 20px rgba(232,0,60,0.5)" : "none",
                opacity: i === activeIdx ? 1 : 0.5,
                flexShrink: 0,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={posterUrl(m.poster_path, "w200")}
                alt={m.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Progress dots */}
      <div style={{
        position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
        display: "flex", gap: 8, zIndex: 10,
      }}>
        {featured.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === activeIdx ? 32 : 8,
              height: 8,
              borderRadius: 4,
              background: i === activeIdx ? "var(--accent-red)" : "rgba(255,255,255,0.25)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.4s ease",
              padding: 0,
            }}
          />
        ))}
      </div>

      <style>{`
        @media (max-width: 900px) { .hero-thumbs { display: none !important; } }
      `}</style>
    </section>
  );
}
