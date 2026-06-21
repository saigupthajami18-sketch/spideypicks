import { getTrending, getNowPlaying, getTopRated, getUpcoming, getPopular, getTollywoodMovies, getMarvelMovies, getDCMovies } from "@/lib/tmdb";
import Navbar from "@/components/Navbar";
import ScrollSequence from "@/components/ScrollSequence";
import HeroSection from "@/components/HeroSection";
import MovieSection from "@/components/MovieSection";
import MultiverseSection from "@/components/MultiverseSection";
import ExploreSection from "@/components/ExploreSection";
import QuizSection from "@/components/QuizSection";
import WatchlistSection from "@/components/WatchlistSection";
import Footer from "@/components/Footer";

export const revalidate = 3600; // re-fetch every hour

export default async function Home() {
  const [trending, nowPlaying, topRated, upcoming, popular, tollywood, marvel, dc] = await Promise.all([
    getTrending("week").catch(() => ({ results: [] })),
    getNowPlaying().catch(() => ({ results: [] })),
    getTopRated().catch(() => ({ results: [] })),
    getUpcoming().catch(() => ({ results: [] })),
    getPopular().catch(() => ({ results: [] })),
    getTollywoodMovies().catch(() => ({ results: [] })),
    getMarvelMovies().catch(() => ({ results: [] })),
    getDCMovies().catch(() => ({ results: [] })),
  ]);

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar />

      <ScrollSequence />

      {/* ── Hero ── */}
      <HeroSection movies={trending.results.slice(0, 5)} />

      {/* ── Stats strip ── */}
      <div
        style={{
          background: "rgba(255,255,255,0.02)",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          padding: "20px 32px",
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          {[
            { label: "Movies Tracked", value: "500K+", color: "var(--accent-red)" },
            { label: "Universes Covered", value: "∞", color: "var(--accent-blue)" },
            { label: "Live TMDB Data", value: "Real-time", color: "var(--accent-gold)" },
            { label: "Genres Available", value: "19", color: "var(--accent-purple)" },
            { label: "Languages", value: "50+", color: "var(--accent-cyan)" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <p
                className="font-bebas"
                style={{ fontSize: 32, letterSpacing: 2, color: s.color, lineHeight: 1 }}
              >
                {s.value}
              </p>
              <p
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 12,
                  letterSpacing: 1.5,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  marginTop: 4,
                }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* ── Watchlist ── */}
      <WatchlistSection />

      {/* ── Marvel Section ── */}
      <MovieSection
        id="marvel"
        title="MARVEL CINEMATIC UNIVERSE"
        subtitle="Earth's mightiest heroes"
        movies={marvel.results}
        accentColor="var(--accent-red)"
      />

      {/* ── DC Section ── */}
      <MovieSection
        id="dc"
        title="DC UNIVERSE"
        subtitle="Legends of the Justice League"
        movies={dc.results}
        accentColor="var(--accent-blue)"
      />

      {/* ── Trending ── */}
      <MovieSection
        id="trending"
        title="TRENDING THIS WEEK"
        subtitle="What the multiverse is watching right now"
        movies={trending.results}
        accentColor="var(--accent-gold)"
      />

      {/* ── Tollywood Section ── */}
      <MovieSection
        id="tollywood"
        title="TOLLYWOOD BLOCKBUSTERS"
        subtitle="High-octane action from the Telugu cinema universe"
        movies={tollywood.results}
        accentColor="var(--accent-purple)"
      />

      {/* ── Multiverse Section ── */}
      <MultiverseSection />

      {/* ── Now Playing ── */}
      <MovieSection
        id="now-playing"
        title="NOW PLAYING"
        subtitle="In cinemas across every universe"
        movies={nowPlaying.results}
        accentColor="var(--accent-cyan)"
      />

      {/* ── Top Rated ── */}
      <MovieSection
        id="top-rated"
        title="TOP RATED"
        subtitle="The greatest films of all dimensions"
        movies={topRated.results}
        showRank={true}
        accentColor="var(--accent-gold)"
      />

      {/* ── Upcoming ── */}
      <MovieSection
        id="upcoming"
        title="COMING SOON"
        subtitle="Next up from the multiverse pipeline"
        movies={upcoming.results}
        accentColor="var(--accent-purple)"
      />

      {/* ── Spider-Man spotlight ── */}
      <section
        style={{
          padding: "60px 32px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(232,0,60,0.04) 0%, transparent 60%)",
          }}
        />
        <div
          className="spider-web-bg"
          style={{ position: "absolute", inset: 0, opacity: 0.3 }}
        />

        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            position: "relative",
            zIndex: 2,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 60,
            alignItems: "center",
          }}
          className="spotlight-grid"
        >
          <div>
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
              ◈ WHY SPIDEY PICKS?
            </p>
            <h2
              className="font-bebas"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                letterSpacing: 2,
                lineHeight: 1,
                marginBottom: 20,
              }}
            >
              YOUR FRIENDLY
              <br />
              <span className="text-gradient-red">NEIGHBORHOOD</span>
              <br />
              MOVIE GUIDE
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: 15,
                lineHeight: 1.8,
                marginBottom: 24,
              }}
            >
              Spidey Picks harnesses real-time data from The Movie Database to bring
              you the freshest, most accurate movie recommendations — spanning every
              genre, era, and dimension of filmmaking.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { icon: "⚡", text: "Live data from TMDB — always up to date" },
                { icon: "🎯", text: "Genre-based discovery across 19+ categories" },
                { icon: "🌐", text: "Multiverse-themed browsing experience" },
                { icon: "🔍", text: "Instant search with real-time results" },
              ].map((f) => (
                <div key={f.text} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: "rgba(232,0,60,0.1)",
                      border: "1px solid rgba(232,0,60,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      flexShrink: 0,
                    }}
                  >
                    {f.icon}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 500,
                      color: "var(--text-secondary)",
                      fontSize: 15,
                    }}
                  >
                    {f.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mini card grid preview */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              maxHeight: 420,
              overflow: "hidden",
            }}
          >
            {popular.results.slice(0, 4).map((m) => (
              <div
                key={m.id}
                style={{
                  borderRadius: 8,
                  overflow: "hidden",
                  position: "relative",
                  aspectRatio: "2/3",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
                  alt={m.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)",
                  }}
                />
                <p
                  style={{
                    position: "absolute",
                    bottom: 8,
                    left: 8,
                    right: 8,
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: 700,
                    fontSize: 12,
                    color: "white",
                  }}
                >
                  {m.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) { .spotlight-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </section>

      {/* ── Quiz Oracle ── */}
      <QuizSection />

      {/* ── Explore (Search + Genre) ── */}
      <ExploreSection initialMovies={popular.results} />

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}
