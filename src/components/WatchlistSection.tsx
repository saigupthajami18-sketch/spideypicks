"use client";
import { useState, useEffect } from "react";
import { Movie } from "@/lib/tmdb";
import MovieCard from "./MovieCard";

export default function WatchlistSection() {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("spidey_watchlist");
    if (stored) {
      try {
        setWatchlist(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  if (!mounted) return null; // Prevent hydration mismatch

  if (watchlist.length === 0) {
    return null; // Don't show the section if it's empty
  }

  return (
    <section id="watchlist" style={{ padding: "60px 0" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
        <h2 className="section-title" style={{ color: "white", marginBottom: 28 }}>
          <span style={{ color: "var(--accent-red)" }}>//</span> YOUR WATCHLIST
        </h2>
        
        <div className="scroll-track" style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 20 }}>
          {watchlist.map((movie) => (
            <div key={movie.id} style={{ position: "relative" }}>
              <MovieCard movie={movie} />
              <button 
                onClick={() => {
                  const updated = watchlist.filter(m => m.id !== movie.id);
                  setWatchlist(updated);
                  localStorage.setItem("spidey_watchlist", JSON.stringify(updated));
                  // Dispatch a custom event so other components know (like the details page)
                  window.dispatchEvent(new Event("watchlist_updated"));
                }}
                style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  zIndex: 10,
                  background: "var(--accent-red)",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: 30,
                  height: 30,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.5)"
                }}
                title="Remove from Watchlist"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
