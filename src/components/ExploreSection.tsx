"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Movie, searchMovies, getMoviesByGenre, GENRE_MAP } from "@/lib/tmdb";
import MovieCard from "./MovieCard";

const GENRES = Object.entries(GENRE_MAP).map(([id, name]) => ({ id: Number(id), name }));

interface Props {
  initialMovies: Movie[];
}

function ExploreContent({ initialMovies }: Props) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get("search") || "";
  
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [query, setQuery] = useState(initialQuery);
  const [activeGenre, setActiveGenre] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const doSearch = useCallback(async (q: string, genre: number | null, pg: number) => {
    setLoading(true);
    try {
      let res;
      if (q.trim()) {
        res = await searchMovies(q, String(pg));
      } else if (genre) {
        res = await getMoviesByGenre(genre, String(pg));
      } else {
        setMovies(initialMovies);
        setLoading(false);
        return;
      }
      setMovies(pg === 1 ? res.results : (prev) => [...prev, ...res.results]);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [initialMovies]);

  /* Debounce search */
  useEffect(() => {
    const t = setTimeout(() => { doSearch(query, activeGenre, 1); setPage(1); }, 500);
    return () => clearTimeout(t);
  }, [query, activeGenre, doSearch]);

  return (
    <section id="explore" style={{ padding: "60px 0 80px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h2 className="section-title" style={{ color: "white", marginBottom: 20 }}>
            <span style={{ color: "var(--accent-cyan)" }}>//</span> EXPLORE
          </h2>

          {/* Search Bar */}
          <div style={{ position: "relative", maxWidth: 600, marginBottom: 20 }}>
            <svg
              style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", opacity: 0.4 }}
              width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              id="explore-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies, titles, stories..."
              className="search-input"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                style={{
                  position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer",
                  fontSize: 18, lineHeight: 1,
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Genre Pills */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              id="genre-all"
              className={`genre-tag ${activeGenre === null ? "active" : ""}`}
              onClick={() => setActiveGenre(null)}
            >
              All
            </button>
            {GENRES.map((g) => (
              <button
                key={g.id}
                id={`genre-${g.id}`}
                className={`genre-tag ${activeGenre === g.id ? "active" : ""}`}
                onClick={() => setActiveGenre(activeGenre === g.id ? null : g.id)}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>

        {/* Loading bar */}
        {loading && <div className="loader-bar" style={{ marginBottom: 20 }} />}

        {/* Results grid */}
        {movies.length > 0 ? (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: 16,
              }}
            >
              {movies.map((m) => (
                <div key={m.id} style={{ height: 240 }}>
                  <MovieCard movie={m} />
                </div>
              ))}
            </div>

            {/* Load More */}
            {(query || activeGenre) && movies.length >= 20 && (
              <div style={{ textAlign: "center", marginTop: 40 }}>
                <button
                  id="load-more-btn"
                  className="btn-secondary"
                  onClick={() => { const next = page + 1; setPage(next); doSearch(query, activeGenre, next); }}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        ) : !loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
            <p style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 32, letterSpacing: 2, marginBottom: 8 }}>
              NO RESULTS FOUND
            </p>
            <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 15 }}>
              Try a different search or genre.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default function ExploreSection({ initialMovies }: Props) {
  return (
    <Suspense fallback={<div className="loader-bar" />}>
      <ExploreContent initialMovies={initialMovies} />
    </Suspense>
  );
}
