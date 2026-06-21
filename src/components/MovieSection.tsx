"use client";
import { useRef } from "react";
import { Movie } from "@/lib/tmdb";
import MovieCard from "./MovieCard";

interface Props {
  id: string;
  title: string;
  subtitle?: string;
  movies: Movie[];
  showRank?: boolean;
  accentColor?: string;
}

export default function MovieSection({
  id,
  title,
  subtitle,
  movies,
  showRank = false,
  accentColor = "var(--accent-red)",
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: dir === "left" ? -600 : 600, behavior: "smooth" });
  };

  return (
    <section id={id} style={{ padding: "60px 0" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 28,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <h2
              className="section-title"
              style={{
                color: "white",
              }}
            >
              <span style={{ color: accentColor }}>//</span> {title}
            </h2>
            {subtitle && (
              <p
                style={{
                  color: "var(--text-muted)",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 14,
                  marginTop: 6,
                  letterSpacing: 0.5,
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            {(id === "marvel" || id === "dc") && (
              <button
                className="btn-secondary"
                style={{
                  borderColor: accentColor,
                  color: accentColor,
                  padding: "8px 16px",
                  fontSize: 14,
                  height: 40
                }}
                onClick={() => {
                  alert(
                    id === "marvel"
                      ? "MCU Watch Order:\n1. Captain America: The First Avenger\n2. Captain Marvel\n3. Iron Man\n4. Iron Man 2\n5. The Incredible Hulk\n6. Thor\n7. The Avengers\n8. Thor: The Dark World\n9. Iron Man 3\n10. Captain America: The Winter Soldier\n11. Guardians of the Galaxy\n12. Guardians of the Galaxy Vol. 2\n13. Avengers: Age of Ultron\n14. Ant-Man\n15. Captain America: Civil War\n16. Black Widow\n17. Spider-Man: Homecoming\n18. Black Panther\n19. Doctor Strange\n20. Thor: Ragnarok\n21. Ant-Man and the Wasp\n22. Avengers: Infinity War\n23. Avengers: Endgame\n24. Spider-Man: Far From Home"
                      : "DC Extended Universe Watch Order:\n1. Wonder Woman\n2. Wonder Woman 1984\n3. Man of Steel\n4. Batman v Superman: Dawn of Justice\n5. Suicide Squad\n6. Justice League\n7. Aquaman\n8. Shazam!\n9. Birds of Prey\n10. The Suicide Squad\n11. Peacemaker\n12. Black Adam\n13. Shazam! Fury of the Gods\n14. The Flash\n15. Blue Beetle\n16. Aquaman and the Lost Kingdom"
                  );
                }}
              >
                View Watch Order
              </button>
            )}

            {/* Scroll Arrows */}
            <div style={{ display: "flex", gap: 8 }}>
              <button
                id={`${id}-scroll-left`}
                onClick={() => scroll("left")}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.04)",
                  color: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = accentColor;
                  (e.currentTarget as HTMLButtonElement).style.background = `${accentColor}20`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.12)";
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
                }}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                id={`${id}-scroll-right`}
                onClick={() => scroll("right")}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.04)",
                  color: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = accentColor;
                  (e.currentTarget as HTMLButtonElement).style.background = `${accentColor}20`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.12)";
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
                }}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Track */}
        <div
          ref={trackRef}
          className="scroll-track"
          style={{ paddingBottom: 8 }}
        >
          {movies.map((movie, i) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              rank={showRank ? i + 1 : undefined}
            />
          ))}
        </div>
      </div>

      {/* Accent divider */}
      <div
        style={{
          maxWidth: 1400,
          margin: "40px auto 0",
          padding: "0 32px",
        }}
      >
        <div
          style={{
            height: 1,
            background: `linear-gradient(90deg, ${accentColor}30, transparent)`,
          }}
        />
      </div>
    </section>
  );
}
