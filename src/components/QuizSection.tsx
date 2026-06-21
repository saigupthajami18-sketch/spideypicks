"use client";
import { useState } from "react";
import { getMoviesByGenre, Movie, posterUrl, formatYear } from "@/lib/tmdb";
import Link from "next/link";

const QUESTIONS = [
  {
    question: "1. What's your current multiverse mood?",
    options: [
      { text: "Explosive action & stunts", genre: 28 }, // Action
      { text: "Make me laugh until it hurts", genre: 35 }, // Comedy
      { text: "A dark, gritty puzzle", genre: 9648 }, // Mystery
      { text: "Take me to another planet", genre: 878 }, // Sci-Fi
    ],
  },
  {
    question: "2. Pick a Spider-Man companion:",
    options: [
      { text: "Iron Man (High Tech)", genre: 878 }, // Sci-Fi
      { text: "Daredevil (Street Level Crime)", genre: 80 }, // Crime
      { text: "Doctor Strange (Magic & Realms)", genre: 14 }, // Fantasy
      { text: "Deadpool (Pure Chaos)", genre: 35 }, // Comedy
    ],
  },
  {
    question: "3. Choose an ideal setting for your adventure:",
    options: [
      { text: "A haunted mansion", genre: 27 }, // Horror
      { text: "A historical battlefield", genre: 10752 }, // War
      { text: "A futuristic cyberpunk city", genre: 878 }, // Sci-Fi
      { text: "The Wild West", genre: 37 }, // Western
    ],
  },
  {
    question: "4. How do you want to feel at the end?",
    options: [
      { text: "Mind utterly blown", genre: 53 }, // Thriller
      { text: "Heart warmed and hopeful", genre: 10749 }, // Romance
      { text: "Terrified to turn off the lights", genre: 27 }, // Horror
      { text: "Deeply inspired", genre: 18 }, // Drama
    ],
  },
  {
    question: "5. What's your preferred type of villain?",
    options: [
      { text: "A calculating mastermind", genre: 80 }, // Crime
      { text: "A massive alien threat", genre: 878 }, // Sci-Fi
      { text: "A supernatural entity", genre: 14 }, // Fantasy
      { text: "A hilarious rival", genre: 35 }, // Comedy
    ],
  },
  {
    question: "6. Select a soundtrack vibe:",
    options: [
      { text: "Heavy synthwave", genre: 878 }, // Sci-Fi
      { text: "An epic orchestral score", genre: 12 }, // Adventure
      { text: "Creepy, unsettling strings", genre: 27 }, // Horror
      { text: "Upbeat pop and rock", genre: 35 }, // Comedy
    ],
  },
  {
    question: "7. Who is the main character?",
    options: [
      { text: "A hardened detective", genre: 9648 }, // Mystery
      { text: "A misunderstood monster", genre: 14 }, // Fantasy
      { text: "An ordinary person finding love", genre: 10749 }, // Romance
      { text: "A brave soldier", genre: 10752 }, // War
    ],
  },
  {
    question: "8. Choose a mode of transportation:",
    options: [
      { text: "A sleek spaceship", genre: 878 }, // Sci-Fi
      { text: "Swinging from skyscrapers", genre: 28 }, // Action
      { text: "A horse in the desert", genre: 37 }, // Western
      { text: "A magical portal", genre: 14 }, // Fantasy
    ],
  },
  {
    question: "9. What's at stake in the story?",
    options: [
      { text: "The survival of the universe", genre: 878 }, // Sci-Fi
      { text: "Uncovering a massive conspiracy", genre: 53 }, // Thriller
      { text: "Winning someone's heart", genre: 10749 }, // Romance
      { text: "Finding hidden treasure", genre: 12 }, // Adventure
    ],
  },
  {
    question: "10. Pick an animation style (or lack thereof):",
    options: [
      { text: "Vibrant 3D/Spider-Verse style", genre: 16 }, // Animation
      { text: "Gritty, realistic live-action", genre: 18 }, // Drama
      { text: "Classic 2D animation", genre: 16 }, // Animation
      { text: "Lots of practical effects", genre: 28 }, // Action
    ],
  },
  {
    question: "11. Choose a weapon:",
    options: [
      { text: "A futuristic laser blaster", genre: 878 }, // Sci-Fi
      { text: "A mystical artifact", genre: 14 }, // Fantasy
      { text: "My bare fists", genre: 28 }, // Action
      { text: "A clever mind and clues", genre: 9648 }, // Mystery
    ],
  },
  {
    question: "12. What time period interests you the most?",
    options: [
      { text: "The distant future", genre: 878 }, // Sci-Fi
      { text: "The Middle Ages", genre: 36 }, // History
      { text: "The 1800s Frontier", genre: 37 }, // Western
      { text: "Present day", genre: 18 }, // Drama
    ],
  },
  {
    question: "13. What pacing do you prefer?",
    options: [
      { text: "Non-stop, breathless speed", genre: 28 }, // Action
      { text: "Slow burn with massive payoff", genre: 53 }, // Thriller
      { text: "Light and breezy", genre: 35 }, // Comedy
      { text: "Deep, thoughtful, and emotional", genre: 18 }, // Drama
    ],
  },
  {
    question: "14. Pick a color palette:",
    options: [
      { text: "Neon purples and blues", genre: 878 }, // Sci-Fi
      { text: "Warm, golden hour tones", genre: 10749 }, // Romance
      { text: "Cold, desaturated greys", genre: 80 }, // Crime
      { text: "Vibrant, highly saturated colors", genre: 16 }, // Animation
    ],
  },
  {
    question: "15. Final question: What do you value most in a film?",
    options: [
      { text: "Incredible visual effects", genre: 878 }, // Sci-Fi
      { text: "A compelling emotional core", genre: 18 }, // Drama
      { text: "Twists I didn't see coming", genre: 9648 }, // Mystery
      { text: "Pure, unadulterated fun", genre: 12 }, // Adventure
    ],
  },
];

export default function QuizSection() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<Movie | null>(null);

  const handleAnswer = async (genreId: number) => {
    const newAnswers = [...answers, genreId];
    setAnswers(newAnswers);

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      // Calculate most selected genre
      setLoading(true);
      try {
        const counts = newAnswers.reduce((acc, val) => {
          acc[val] = (acc[val] || 0) + 1;
          return acc;
        }, {} as Record<number, number>);
        
        const topGenre = Object.keys(counts).reduce((a, b) => counts[Number(a)] > counts[Number(b)] ? a : b);
        
        const res = await getMoviesByGenre(Number(topGenre), "1");
        // Pick a random top movie
        const randomMovie = res.results[Math.floor(Math.random() * Math.min(10, res.results.length))];
        setRecommendation(randomMovie);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers([]);
    setRecommendation(null);
  };

  return (
    <section id="quiz" style={{ padding: "80px 0", position: "relative", background: "rgba(232,0,60,0.02)" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 32px", textAlign: "center" }}>
        
        <h2 className="section-title" style={{ color: "white", marginBottom: 16 }}>
          <span style={{ color: "var(--accent-red)" }}>//</span> MULTIVERSE ORACLE
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 16, marginBottom: 40, fontFamily: "'Rajdhani', sans-serif" }}>
          Answer a few questions, and the web will guide you to your perfect cinematic experience.
        </p>

        <div style={{ 
          background: "rgba(255,255,255,0.03)", 
          border: "1px solid rgba(232,0,60,0.2)", 
          borderRadius: 16, 
          padding: 40,
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Progress Bar */}
          {!recommendation && (
            <div style={{ position: "absolute", top: 0, left: 0, height: 4, background: "rgba(255,255,255,0.1)", width: "100%" }}>
              <div style={{ height: "100%", background: "var(--accent-red)", width: `${(step / QUESTIONS.length) * 100}%`, transition: "width 0.4s ease" }} />
            </div>
          )}

          {loading ? (
            <div style={{ padding: "40px 0" }}>
              <div className="loader-bar" style={{ width: 100, margin: "0 auto 20px" }} />
              <p style={{ color: "var(--accent-red)", fontFamily: "'Bebas Neue', cursive", fontSize: 24, letterSpacing: 2 }}>
                CONSULTING THE WEB...
              </p>
            </div>
          ) : recommendation ? (
            <div className="animate-fadeInUp">
              <h3 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 32, letterSpacing: 2, color: "var(--accent-gold)", marginBottom: 20 }}>
                YOUR DESTINED MOVIE
              </h3>
              
              <Link href={`/movie/${recommendation.id}`} style={{ textDecoration: "none" }}>
                <div style={{ display: "inline-block", textAlign: "left", background: "rgba(0,0,0,0.5)", borderRadius: 12, padding: 20, border: "1px solid rgba(255,255,255,0.1)", transition: "transform 0.3s ease" }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                    <div style={{ width: 100, borderRadius: 8, overflow: "hidden" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={posterUrl(recommendation.poster_path, "w200")} alt={recommendation.title} style={{ width: "100%", display: "block" }} />
                    </div>
                    <div>
                      <h4 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 24, fontWeight: 700, color: "white", marginBottom: 8 }}>{recommendation.title}</h4>
                      <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 12 }}>{formatYear(recommendation.release_date)} • ★ {recommendation.vote_average.toFixed(1)}</p>
                      <span className="btn-primary" style={{ padding: "8px 16px", fontSize: 14 }}>View Details</span>
                    </div>
                  </div>
                </div>
              </Link>
              
              <div style={{ marginTop: 30 }}>
                <button onClick={reset} className="btn-secondary">Take Quiz Again</button>
              </div>
            </div>
          ) : (
            <div className="animate-slideInLeft" key={step}>
              <h3 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 28, letterSpacing: 1, color: "white", marginBottom: 30 }}>
                {QUESTIONS[step].question}
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {QUESTIONS[step].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt.genre)}
                    style={{
                      padding: "16px 24px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 8,
                      color: "white",
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: 18,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "rgba(232,0,60,0.15)";
                      e.currentTarget.style.borderColor = "var(--accent-red)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    }}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
