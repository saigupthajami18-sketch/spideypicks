"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getPopular } from "@/lib/tmdb";

export default function SpideySenseButton() {
  const [isSensing, setIsSensing] = useState(false);
  const router = useRouter();

  const triggerSpideySense = async () => {
    if (isSensing) return;
    setIsSensing(true);

    try {
      // Fetch a random page of popular movies (TMDB supports pages 1-500)
      const randomPage = Math.floor(Math.random() * 10) + 1;
      const data = await getPopular(randomPage.toString());
      
      if (data && data.results && data.results.length > 0) {
        // Pick a random movie from the page
        const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];
        
        // Vibrate device if supported (mobile delight)
        if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
          window.navigator.vibrate([100, 50, 100]);
        }

        // Navigate after a short dramatic pause
        setTimeout(() => {
          router.push(`/movie/${randomMovie.id}`);
          setIsSensing(false);
        }, 600);
      } else {
        setIsSensing(false);
      }
    } catch (error) {
      console.error("Spidey sense failed:", error);
      setIsSensing(false);
    }
  };

  return (
    <button
      onClick={triggerSpideySense}
      style={{
        background: isSensing ? "rgba(232,0,60,0.2)" : "rgba(255,255,255,0.06)",
        border: `1px solid ${isSensing ? "var(--accent-red)" : "rgba(255,255,255,0.1)"}`,
        borderRadius: 8,
        padding: "8px 12px",
        color: isSensing ? "var(--accent-red)" : "white",
        cursor: isSensing ? "wait" : "pointer",
        display: "flex",
        alignItems: "center",
        gap: 8,
        transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        fontFamily: "'Rajdhani', sans-serif",
        fontSize: 14,
        fontWeight: 600,
        boxShadow: isSensing ? "0 0 15px rgba(232,0,60,0.4)" : "none",
        transform: isSensing ? "scale(0.95)" : "scale(1)",
      }}
      title="Can't decide? Let your Spidey-Sense choose!"
    >
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        style={{
          animation: isSensing ? "spiderPulse 0.5s infinite" : "none"
        }}
      >
        <path d="M2 12a10 10 0 0 1 10-10 10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12Z" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20Z" />
        <path d="M2 12h20" />
      </svg>
      {isSensing ? "TINGLING..." : "SPIDEY-SENSE"}
    </button>
  );
}
