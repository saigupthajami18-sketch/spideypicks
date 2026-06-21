import Link from "next/link";
import { getSimilarMovies, posterUrl, formatRating, formatYear } from "@/lib/tmdb";

export default async function MultiverseVariants({ movieId }: { movieId: number }) {
  const data = await getSimilarMovies(movieId).catch(() => ({ results: [] }));
  const variants = data.results.slice(0, 10);

  if (variants.length === 0) return null;

  // Generate a random "Earth" number for each variant deterministically based on its ID
  const getEarthNumber = (id: number) => {
    return (id % 99999) + 1;
  };

  return (
    <section style={{ marginTop: 60, paddingBottom: 60 }}>
      <h2 className="section-title" style={{ color: "white", marginBottom: 30, display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ color: "var(--accent-cyan)" }}>//</span> MULTIVERSE VARIANTS
        <span style={{ 
          fontSize: 14, 
          fontFamily: "'Space Grotesk', sans-serif", 
          letterSpacing: 1, 
          color: "var(--text-muted)",
          textTransform: "uppercase",
          background: "rgba(0, 212, 255, 0.1)",
          padding: "4px 10px",
          borderRadius: 20,
          border: "1px solid rgba(0, 212, 255, 0.2)"
        }}>
          Detected Anomalies
        </span>
      </h2>

      <div className="scroll-track portal-scroll" style={{ display: "flex", gap: 24, overflowX: "auto", paddingBottom: 30, paddingTop: 10 }}>
        {variants.map((movie) => {
          const earth = getEarthNumber(movie.id);
          return (
            <Link key={movie.id} href={`/movie/${movie.id}`} style={{ textDecoration: "none" }}>
              <div className="variant-card" style={{ width: 160, flexShrink: 0, position: "relative" }}>
                {/* Earth Designation Badge */}
                <div style={{
                  position: "absolute",
                  top: -12,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "linear-gradient(135deg, var(--bg-card), #1a1a1a)",
                  border: "1px solid var(--accent-cyan)",
                  color: "var(--accent-cyan)",
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 700,
                  fontSize: 11,
                  padding: "4px 12px",
                  borderRadius: 12,
                  zIndex: 10,
                  whiteSpace: "nowrap",
                  boxShadow: "0 0 10px rgba(0, 212, 255, 0.3)",
                  letterSpacing: 1
                }}>
                  EARTH-{earth}
                </div>

                <div className="variant-poster-container" style={{ 
                  width: "100%", 
                  height: 240, 
                  background: "#111", 
                  borderRadius: 8, 
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.1)",
                  position: "relative"
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={posterUrl(movie.poster_path, "w200")} 
                    alt={movie.title} 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                  />
                  
                  {/* Glitch Overlay (CSS animated on hover) */}
                  <div className="glitch-overlay" />
                </div>
                
                <div style={{ marginTop: 12 }}>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14, color: "white", lineHeight: 1.2, marginBottom: 4 }}>
                    {movie.title}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "'Rajdhani', sans-serif", fontSize: 13, color: "var(--text-secondary)" }}>
                    <span style={{ color: "var(--accent-gold)", fontWeight: 600 }}>★ {formatRating(movie.vote_average)}</span>
                    <span>•</span>
                    <span>{formatYear(movie.release_date)}</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <style>{`
        .portal-scroll::-webkit-scrollbar {
          height: 6px;
        }
        .portal-scroll::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.02);
          border-radius: 3px;
        }
        .portal-scroll::-webkit-scrollbar-thumb {
          background: rgba(0, 212, 255, 0.3);
          border-radius: 3px;
        }
        
        .variant-card {
          transition: all 0.3s ease;
        }
        .variant-card:hover {
          transform: translateY(-8px);
        }
        .variant-card:hover .variant-poster-container {
          border-color: var(--accent-cyan);
          box-shadow: 0 10px 30px rgba(0, 212, 255, 0.2);
        }
        
        .glitch-overlay {
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0;
          mix-blend-mode: overlay;
          transition: opacity 0.2s;
          pointer-events: none;
        }
        
        .variant-card:hover .glitch-overlay {
          opacity: 0.3;
          animation: noiseGlitch 0.2s steps(2) infinite;
        }
        
        @keyframes noiseGlitch {
          0% { background-position: 0 0; }
          100% { background-position: 10% 10%; }
        }
      `}</style>
    </section>
  );
}
