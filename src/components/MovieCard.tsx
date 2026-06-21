"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Movie, posterUrl, formatRating, formatYear, GENRE_MAP } from "@/lib/tmdb";

interface Props {
  movie: Movie;
  rank?: number;
}

export default function MovieCard({ movie, rank }: Props) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [mounted, setMounted] = useState(false);

  const checkWatchlist = () => {
    const stored = localStorage.getItem("spidey_watchlist");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Movie[];
        setInWatchlist(parsed.some(m => m.id === movie.id));
      } catch (e) {}
    }
  };

  useEffect(() => {
    setMounted(true);
    checkWatchlist();

    const handleUpdate = () => checkWatchlist();
    window.addEventListener("watchlist_updated", handleUpdate);
    return () => window.removeEventListener("watchlist_updated", handleUpdate);
  }, [movie.id]);

  const toggleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to movie details
    const stored = localStorage.getItem("spidey_watchlist");
    let current: Movie[] = [];
    if (stored) {
      try {
        current = JSON.parse(stored);
      } catch (e) {}
    }

    if (inWatchlist) {
      current = current.filter(m => m.id !== movie.id);
    } else {
      current.push(movie);
    }

    localStorage.setItem("spidey_watchlist", JSON.stringify(current));
    setInWatchlist(!inWatchlist);
    window.dispatchEvent(new Event("watchlist_updated"));
  };

  const genres = (movie.genre_ids || [])
    .slice(0, 2)
    .map((id) => GENRE_MAP[id])
    .filter(Boolean);

  const ratingColor =
    movie.vote_average >= 8
      ? "#4ade80"
      : movie.vote_average >= 6
      ? "var(--accent-gold)"
      : "#f87171";

  return (
    <Link href={`/movie/${movie.id}`} style={{ textDecoration: "none", display: "block", flexShrink: 0 }}>
      <div
        id={`movie-${movie.id}`}
        className="movie-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ minWidth: 180, width: 180, height: 270 }}
      >
      {/* Rank badge */}
      {rank && (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 3,
            fontFamily: "'Bebas Neue', cursive",
            fontSize: 42,
            lineHeight: 1,
            color: "rgba(255,255,255,0.12)",
            WebkitTextStroke: "1px rgba(255,255,255,0.15)",
            userSelect: "none",
          }}
        >
          {rank}
        </div>
      )}

      {/* Mini Watchlist Toggle Button */}
      {mounted && (
        <button
          onClick={toggleWatchlist}
          style={{
            position: "absolute",
            top: 10,
            left: rank ? 45 : 10,
            zIndex: 4,
            background: inWatchlist ? "var(--accent-red)" : "rgba(0,0,0,0.6)",
            color: "white",
            border: inWatchlist ? "none" : "1px solid rgba(255,255,255,0.3)",
            borderRadius: "50%",
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            backdropFilter: "blur(4px)",
            transition: "all 0.2s",
            opacity: hovered || inWatchlist ? 1 : 0,
          }}
          title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
        >
          {inWatchlist ? "✓" : "+"}
        </button>
      )}

      {/* Poster */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgError ? "/placeholder-poster.svg" : posterUrl(movie.poster_path, "w300")}
        alt={movie.title}
        onError={() => setImgError(true)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform 0.5s ease",
          transform: hovered ? "scale(1.08)" : "scale(1)",
          display: "block",
        }}
      />

      {/* Rating pill (always visible) */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 3,
          background: "rgba(0,0,0,0.75)",
          border: `1px solid ${ratingColor}40`,
          borderRadius: 6,
          padding: "3px 8px",
          display: "flex",
          alignItems: "center",
          gap: 4,
          backdropFilter: "blur(8px)",
        }}
      >
        <span style={{ color: ratingColor, fontSize: 11, fontWeight: 700 }}>
          ★ {formatRating(movie.vote_average)}
        </span>
      </div>

      {/* Hover overlay */}
      <div className="movie-card-overlay">
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {/* Genres */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {genres.map((g) => (
              <span
                key={g}
                style={{
                  fontSize: 10,
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  padding: "2px 7px",
                  borderRadius: 3,
                  background: "rgba(232,0,60,0.25)",
                  border: "1px solid rgba(232,0,60,0.4)",
                  color: "#ff8099",
                }}
              >
                {g}
              </span>
            ))}
          </div>

          {/* Title */}
          <p
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              lineHeight: 1.3,
              color: "white",
            }}
          >
            {movie.title}
          </p>

          {/* Year & vote count */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: 12,
                color: "rgba(255,255,255,0.5)",
              }}
            >
              {formatYear(movie.release_date)}
            </span>
            <span
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: 11,
                color: "rgba(255,255,255,0.4)",
              }}
            >
              {movie.vote_count.toLocaleString()} votes
            </span>
          </div>
        </div>
      </div>
      </div>
    </Link>
  );
}
