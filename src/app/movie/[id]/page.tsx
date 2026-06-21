import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WatchlistButton from "@/components/WatchlistButton";
import MultiverseVariants from "@/components/MultiverseVariants";
import Image from "next/image";
import { getMovieDetails, backdropUrl, posterUrl, formatYear, formatRating, IMG_BASE } from "@/lib/tmdb";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function MovieDetailsPage({ params }: Props) {
  const resolvedParams = await params;
  let movie: any = null;
  let errorMsg: string | null = null;

  try {
    movie = await getMovieDetails(Number(resolvedParams.id));
  } catch (error) {
    console.error("Failed to fetch movie details:", error);
    errorMsg = "We couldn't connect to the multiverse database right now. Please try again later.";
  }

  if (errorMsg || !movie) {
    return (
      <div style={{ background: "var(--bg-primary)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
          <div>
            <h1 className="font-bebas" style={{ fontSize: "clamp(3rem, 6vw, 5rem)", color: "var(--accent-red)", letterSpacing: 2, marginBottom: 16 }}>
              CONNECTION LOST
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 18, fontFamily: "'Rajdhani', sans-serif" }}>
              {errorMsg || "Movie not found across any universe."}
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const bg = backdropUrl(movie.backdrop_path, "original");
  const poster = posterUrl(movie.poster_path, "w500");

  const cast = movie.credits?.cast?.slice(0, 10) || [];
  const crew = movie.credits?.crew?.filter((c: any) => c.job === "Director" || c.job === "Screenplay") || [];

  // Extract US providers for simplicity, fallback to IN (India) if needed
  const providers = movie["watch/providers"]?.results?.US || movie["watch/providers"]?.results?.IN;
  const streamProviders = providers?.flatrate || [];
  const rentProviders = providers?.rent || [];
  const buyProviders = providers?.buy || [];

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero Backdrop */}
      <div style={{ position: "relative", width: "100%", height: "60vh", minHeight: 400, overflow: "hidden" }}>
        <div
          style={{
            position: "absolute", inset: 0,
            backgroundImage: bg ? `url(${bg})` : "none",
            backgroundSize: "cover", backgroundPosition: "center 20%",
          }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, var(--bg-primary) 0%, rgba(5,5,5,0.7) 40%, rgba(5,5,5,0.2) 100%)",
        }} />
      </div>

      <div style={{ maxWidth: 1200, margin: "-180px auto 0", padding: "0 32px", position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", gap: 40, flexWrap: "wrap", alignItems: "flex-start" }} className="details-layout">

          {/* Poster */}
          <div style={{
            flexShrink: 0,
            width: 300,
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(232,0,60,0.15)",
            border: "1px solid rgba(255,255,255,0.1)"
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={poster} alt={movie.title} style={{ width: "100%", display: "block" }} />
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 300, paddingTop: 20 }}>
            <h1 className="font-bebas" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", lineHeight: 1, letterSpacing: 2, marginBottom: 8, textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}>
              {movie.title}
            </h1>

            {movie.tagline && (
              <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 18, color: "var(--accent-red)", fontStyle: "italic", marginBottom: 20 }}>
                "{movie.tagline}"
              </p>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
              <span className="rating-badge" style={{ fontSize: 16, padding: "4px 10px" }}>★ {formatRating(movie.vote_average)}</span>
              <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 16, color: "var(--text-secondary)" }}>{formatYear(movie.release_date)}</span>
              {movie.runtime && <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 16, color: "var(--text-secondary)" }}>{movie.runtime} min</span>}
              <div style={{ display: "flex", gap: 8 }}>
                {movie.genres?.map((g: any) => (
                  <span key={g.id} className="genre-tag">{g.name}</span>
                ))}
              </div>
            </div>

            <h3 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 24, letterSpacing: 1, color: "white", marginBottom: 10 }}>OVERVIEW</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 16, lineHeight: 1.8, marginBottom: 24 }}>
              {movie.overview}
            </p>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 40 }}>
              <WatchlistButton movie={movie} />
            </div>

            {/* OTT Providers */}
            {(streamProviders.length > 0 || rentProviders.length > 0) && (
              <div style={{ marginBottom: 40, padding: 20, background: "rgba(255,255,255,0.03)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)" }}>
                <h3 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 20, letterSpacing: 1, color: "var(--accent-cyan)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path d="M10 8l6 4-6 4V8z" /></svg>
                  WHERE TO WATCH
                </h3>

                {streamProviders.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 14, color: "var(--text-muted)", marginBottom: 8 }}>Stream:</p>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                      {streamProviders.map((p: any) => (
                        <div key={p.provider_id} title={p.provider_name} style={{ width: 44, height: 44, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={`${IMG_BASE}/original${p.logo_path}`} alt={p.provider_name} style={{ width: "100%" }} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(rentProviders.length > 0 || buyProviders.length > 0) && (
                  <div>
                    <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 14, color: "var(--text-muted)", marginBottom: 8 }}>Rent / Buy:</p>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                      {[...rentProviders, ...buyProviders].filter((v: any, i, a) => a.findIndex((t: any) => t.provider_id === v.provider_id) === i).map((p: any) => (
                        <div key={p.provider_id} title={p.provider_name} style={{ width: 40, height: 40, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", opacity: 0.8 }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={`${IMG_BASE}/original${p.logo_path}`} alt={p.provider_name} style={{ width: "100%" }} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Cast & Crew Section */}
        <div style={{ marginTop: 60, paddingBottom: 60 }}>
          <h2 className="section-title" style={{ color: "white", marginBottom: 30 }}>
            <span style={{ color: "var(--accent-gold)" }}>//</span> CAST & CREW
          </h2>

          <div className="scroll-track" style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 20 }}>
            {cast.map((person: any) => (
              <div key={person.id} style={{ width: 140, flexShrink: 0, background: "rgba(255,255,255,0.02)", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ width: "100%", height: 180, background: "#111" }}>
                  {person.profile_path ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={`${IMG_BASE}/w200${person.profile_path}`} alt={person.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#333", fontSize: 40 }}>?</div>
                  )}
                </div>
                <div style={{ padding: 12 }}>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14, color: "white", lineHeight: 1.2, marginBottom: 4 }}>{person.name}</p>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: "var(--accent-red)", lineHeight: 1.2 }}>{person.character}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Watch Order (Trilogy / Collection) */}
        {movie.belongs_to_collection && (
          <div style={{ marginTop: 20, paddingBottom: 80 }}>
            <h2 className="section-title" style={{ color: "white", marginBottom: 30 }}>
              <span style={{ color: "var(--accent-blue)" }}>//</span> {movie.belongs_to_collection.name.toUpperCase()} WATCH ORDER
            </h2>
            <div style={{ padding: 20, background: "rgba(26,107,255,0.05)", borderRadius: 12, border: "1px solid rgba(26,107,255,0.2)" }}>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", color: "var(--text-secondary)", marginBottom: 16 }}>
                This movie is part of a larger universe. Here is the recommended viewing order:
              </p>
              <CollectionWatchOrder collectionId={movie.belongs_to_collection.id} currentMovieId={movie.id} />
            </div>
          </div>
        )}

        {/* Multiverse Variants (Similar Movies) */}
        <MultiverseVariants movieId={movie.id} />

      </div>

      <Footer />
      <style>{`
        @media (max-width: 768px) {
          .details-layout { flex-direction: column; align-items: center; text-align: center; }
        }
      `}</style>
    </div>
  );
}

import { getCollection } from "@/lib/tmdb";
import Link from "next/link";

async function CollectionWatchOrder({ collectionId, currentMovieId }: { collectionId: number, currentMovieId: number }) {
  let collection: any = null;
  try {
    collection = await getCollection(collectionId);
  } catch {
    return <p style={{ color: "var(--accent-red)" }}>Unable to load collection watch order.</p>;
  }

  if (!collection || !collection.parts || collection.parts.length === 0) return null;

  // Sort by release date ascending to form the watch order
  const sortedParts = [...collection.parts].sort((a, b) => 
    new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {sortedParts.map((part: any, index: number) => {
        const isCurrent = part.id === currentMovieId;
        return (
          <Link key={part.id} href={`/movie/${part.id}`} style={{ textDecoration: "none" }}>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 16, 
              padding: "12px 16px", 
              borderRadius: 8, 
              background: isCurrent ? "rgba(26,107,255,0.2)" : "rgba(255,255,255,0.03)",
              border: isCurrent ? "1px solid rgba(26,107,255,0.5)" : "1px solid transparent",
              transition: "background 0.2s"
            }}
            onMouseEnter={(e) => { if (!isCurrent) e.currentTarget.style.background = "rgba(255,255,255,0.08)" }}
            onMouseLeave={(e) => { if (!isCurrent) e.currentTarget.style.background = "rgba(255,255,255,0.03)" }}
            >
              <span className="font-bebas" style={{ fontSize: 24, color: isCurrent ? "var(--text-primary)" : "var(--text-muted)", width: 24 }}>
                {index + 1}.
              </span>
              <div style={{ width: 40, height: 60, flexShrink: 0, borderRadius: 4, overflow: "hidden", background: "#111" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={posterUrl(part.poster_path, "w200")} alt={part.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16, color: isCurrent ? "var(--accent-blue)" : "white", marginBottom: 4 }}>
                  {part.title} {isCurrent && "(You are here)"}
                </p>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: "var(--text-secondary)" }}>
                  {formatYear(part.release_date)} • ★ {formatRating(part.vote_average)}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
