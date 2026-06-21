"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function VideoTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const spideyRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    const spidey = spideyRef.current;

    if (!video || !container || !spidey) return;

    const initScrollTrigger = () => {
      const duration = video.duration || 5;

      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "+=2500", // Much longer scroll distance for the swing
        pin: true,
        scrub: 1, // Smooth scrub
        onUpdate: (self) => {
          if (video.readyState >= 2) {
            video.currentTime = self.progress * duration;
          }
          // Animate Spider-Man swinging back and forth across the screen
          const swingAngle = Math.sin(self.progress * Math.PI * 4) * 30; // -30 to +30 deg
          const xPos = (Math.cos(self.progress * Math.PI * 2) * -50) + 50; // 0 to 100%
          
          gsap.set(spidey, {
            rotation: swingAngle,
            left: `${xPos}%`,
            top: `${(Math.sin(self.progress * Math.PI * 6) * 10) + 30}%`,
            scale: 1 + Math.sin(self.progress * Math.PI) * 0.5,
          });
        },
      });
    };

    // Always initialize ScrollTrigger so the section pins and Spidey swings,
    // even if the background video fails to load or takes too long.
    initScrollTrigger();

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={containerRef} style={{ width: "100%", height: "100vh", position: "relative", overflow: "hidden", background: "#050505" }}>
      {/* 
        High-quality night city fly-through to simulate swinging
      */}
      <video
        ref={videoRef}
        src="https://assets.mixkit.co/videos/preview/mixkit-flying-through-a-city-at-night-3004-large.mp4"
        preload="auto"
        muted
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.8,
          filter: "contrast(1.2) saturate(1.5) hue-rotate(-10deg)", // Make it look a bit more cinematic/blue-red
        }}
      />
      
      {/* Overlay gradient */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent, rgba(5,5,5,0.8))", pointerEvents: "none" }} />

      {/* Spider-Man swinging element */}
      <img
        ref={spideyRef}
        src="https://upload.wikimedia.org/wikipedia/commons/e/ea/Spiderman_Silhouette.png" // Public domain style silhouette
        alt="Swinging Spider"
        style={{
          position: "absolute",
          width: 150,
          top: "40%",
          left: "50%",
          transformOrigin: "top center",
          transform: "translate(-50%, 0)",
          pointerEvents: "none",
          filter: "drop-shadow(0px 10px 20px rgba(232,0,60,0.8)) brightness(0.2) sepia(1) hue-rotate(300deg) saturate(5)",
        }}
      />
      
      {/* Dynamic Web Line */}
      <div 
        style={{
          position: "absolute",
          top: -200,
          left: "50%",
          width: 2,
          height: "100%",
          background: "linear-gradient(to bottom, rgba(255,255,255,0.8), transparent)",
          transformOrigin: "top center",
          pointerEvents: "none",
        }}
        ref={(el) => {
          if (el) {
            ScrollTrigger.create({
              trigger: containerRef.current,
              start: "top top",
              end: "+=2500",
              scrub: 1,
              onUpdate: (self) => {
                const swingAngle = Math.sin(self.progress * Math.PI * 4) * 30;
                const xPos = (Math.cos(self.progress * Math.PI * 2) * -50) + 50;
                gsap.set(el, {
                  left: `${xPos}%`,
                  rotation: swingAngle,
                });
              }
            });
          }
        }}
      />

      {/* Overlay text */}
      <div style={{
        position: "absolute",
        bottom: "15%",
        left: "50%",
        transform: "translateX(-50%)",
        textAlign: "center",
        pointerEvents: "none"
      }}>
        <h2 className="font-bebas" style={{ 
          fontSize: "clamp(4rem, 8vw, 8rem)", 
          lineHeight: 0.9,
          letterSpacing: 4, 
          color: "white",
          textShadow: "0 0 40px rgba(232,0,60,1)"
        }}>
          SCROLL TO <br/><span style={{ color: "var(--accent-red)" }}>SWING</span>
        </h2>
        <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 24, color: "var(--text-secondary)", fontWeight: 600, letterSpacing: 2, marginTop: 10 }}>
          TRAVERSE THE CINEMATIC UNIVERSE
        </p>
      </div>
    </section>
  );
}
