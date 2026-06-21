"use client";
import React from "react";

interface Props {
  movieId: number;
}

export default function LetterboxdButton({ movieId }: Props) {
  return (
    <a 
      href={`https://letterboxd.com/tmdb/${movieId}`} 
      target="_blank" 
      rel="noopener noreferrer"
      className="letterboxd-btn"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 20px",
        background: "rgba(0, 224, 84, 0.1)",
        border: "1px solid rgba(0, 224, 84, 0.3)",
        borderRadius: 8,
        color: "#00E054",
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 600,
        fontSize: 15,
        textDecoration: "none",
        transition: "all 0.2s ease"
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        {/* Simple representation of Letterboxd's 3 dots logo */}
        <circle cx="6" cy="12" r="3" />
        <circle cx="12" cy="12" r="3" />
        <circle cx="18" cy="12" r="3" />
      </svg>
      Log on Letterboxd
      
      <style jsx global>{`
        .letterboxd-btn:hover {
          background: rgba(0, 224, 84, 0.2) !important;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 224, 84, 0.2);
          border-color: rgba(0, 224, 84, 0.6) !important;
        }
        .letterboxd-btn:active {
          transform: translateY(0);
          box-shadow: none;
        }
      `}</style>
    </a>
  );
}
