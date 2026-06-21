"use client";
import { useState, useEffect } from "react";
import { Movie } from "@/lib/tmdb";

interface Props {
  movie: Movie;
}

export default function WatchlistButton({ movie }: Props) {
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

  const toggleWatchlist = () => {
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

  if (!mounted) return <div style={{ height: 48, width: 200 }} />; // placeholder to prevent layout shift

  return (
    <button
      onClick={toggleWatchlist}
      className={inWatchlist ? "btn-secondary" : "btn-primary"}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "12px 24px",
        fontSize: 16,
        fontFamily: "'Rajdhani', sans-serif",
        fontWeight: 700,
        cursor: "pointer",
        borderRadius: 8,
        border: inWatchlist ? "1px solid rgba(255,255,255,0.2)" : "none",
      }}
    >
      {inWatchlist ? (
        <>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M5 13l4 4L19 7" />
          </svg>
          IN WATCHLIST
        </>
      ) : (
        <>
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          ADD TO WATCHLIST
        </>
      )}
    </button>
  );
}
