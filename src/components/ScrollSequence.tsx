"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const frameCount = 150;
const frameStep = 31;
const currentFrame = (index: number) => {
  const frameNum = Math.min(4655, index * frameStep + 1);
  return `/spidey408/${frameNum.toString().padStart(5, "0")}.jpg`;
};

export default function ScrollSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const text3Ref = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const renderImage = (image: HTMLImageElement) => {
      // Calculate layout directly in pixel space to avoid expensive scale/restore operations per frame
      const cw = canvas.width;
      const ch = canvas.height;
      
      const hRatio = cw / image.width;
      const vRatio = ch / image.height;
      const ratio = Math.max(hRatio, vRatio);
      
      const drawWidth = image.width * ratio;
      const drawHeight = image.height * ratio;
      const cx = (cw - drawWidth) / 2;
      const cy = (ch - drawHeight) / 2;
      
      requestAnimationFrame(() => {
        // Fast clear and draw without state pushing/popping
        context.clearRect(0, 0, cw, ch);
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
        context.drawImage(image, cx, cy, drawWidth, drawHeight);
      });
    };

    const images: HTMLImageElement[] = [];

    // Preload first image to set dimensions immediately
    const firstImg = new Image();
    firstImg.src = currentFrame(0);
    firstImg.onload = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      renderImage(firstImg);
      setLoaded(true);
    };
    images[0] = firstImg;

    let currIdx = 0;
    const state = { frame: 0 };

    // Efficiently load nearby images to prevent network throttling
    const loadImages = (idx: number) => {
      // Pre-load a small window to avoid crashing the browser's network queue
      const start = Math.max(0, idx - 2);
      const end = Math.min(frameCount - 1, idx + 8);
      for (let i = start; i <= end; i++) {
        if (!images[i]) {
          const img = new Image();
          img.src = currentFrame(i);
          images[i] = img;
        }
      }
    };

    // The sequence animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${frameCount * 5}`, // Adjusted scroll distance
        scrub: 1.2, // Smoother scrub
        pin: true,
      }
    });

    // Animate frame precisely across the entire timeline
    tl.to(state, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      duration: 1, // Full duration of the timeline
      onUpdate: () => {
        const frame = Math.round(state.frame);
        if (frame !== currIdx) {
          currIdx = frame;
          loadImages(frame);
          if (images[frame] && images[frame].complete) {
            renderImage(images[frame]);
          } else if (images[frame]) {
            images[frame].onload = () => {
              if (currIdx === frame) renderImage(images[frame]);
            };
          }
        }
      },
    }, 0);

    // Text Animations
    // Text 1: "Created by Guptha" (from 5% to 25%)
    tl.fromTo(text1Ref.current, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.1 }, 
      0.05
    ).to(text1Ref.current, 
      { opacity: 0, y: -30, duration: 0.1 }, 
      0.25
    );

    // Text 2: "Explore the Multiverse" (from 35% to 60%)
    tl.fromTo(text2Ref.current, 
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.1 }, 
      0.35
    ).to(text2Ref.current, 
      { opacity: 0, scale: 1.1, duration: 0.1 }, 
      0.60
    );

    // Text 3: "Discover Watch Orders" (from 75% to 95%)
    tl.fromTo(text3Ref.current, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.1 }, 
      0.75
    ).to(text3Ref.current, 
      { opacity: 0, y: -30, duration: 0.05 }, 
      0.95
    );

    const onResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      if (images[currIdx] && images[currIdx].complete) {
        renderImage(images[currIdx]);
      }
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: "relative", height: "100vh", backgroundColor: "#000", overflow: "hidden" }}>
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100vh",
          display: "block",
          opacity: loaded ? 1 : 0,
          transition: "opacity 1s ease",
          filter: "contrast(1.1) saturate(1.05) brightness(1.05)", 
          imageRendering: "auto"
        }}
      />



      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.6) 100%)", zIndex: 2 }} />

      {/* Text overlays */}
      <div 
        ref={text1Ref} 
        style={{ 
          position: "absolute", 
          top: "40%", 
          left: "0", 
          width: "100%", 
          textAlign: "center", 
          opacity: 0,
          zIndex: 10
        }}
      >
        <h2 className="font-bebas" style={{ fontSize: "clamp(3rem, 6vw, 6rem)", color: "white", textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}>
          CREATED BY <span className="text-gradient-red">GUPTHA</span>
        </h2>
        <p className="font-rajdhani" style={{ color: "var(--text-secondary)", fontSize: "1.5rem", letterSpacing: "2px" }}>
          THE ULTIMATE MOVIE EXPERIENCE
        </p>
      </div>

      <div 
        ref={text2Ref} 
        style={{ 
          position: "absolute", 
          top: "40%", 
          left: "0", 
          width: "100%", 
          textAlign: "center", 
          opacity: 0,
          zIndex: 10
        }}
      >
        <h2 className="font-bebas" style={{ fontSize: "clamp(3rem, 6vw, 6rem)", color: "white", textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}>
          EXPLORE THE <span className="text-gradient-blue">MULTIVERSE</span>
        </h2>
        <p className="font-rajdhani" style={{ color: "var(--text-secondary)", fontSize: "1.5rem", letterSpacing: "2px" }}>
          LIVE TMDB DATA • 500K+ MOVIES
        </p>
      </div>

      <div 
        ref={text3Ref} 
        style={{ 
          position: "absolute", 
          top: "40%", 
          left: "0", 
          width: "100%", 
          textAlign: "center", 
          opacity: 0,
          zIndex: 10
        }}
      >
        <h2 className="font-bebas" style={{ fontSize: "clamp(3rem, 6vw, 6rem)", color: "white", textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}>
          DISCOVER <span className="text-gradient-gold">WATCH ORDERS</span>
        </h2>
        <p className="font-rajdhani" style={{ color: "var(--text-secondary)", fontSize: "1.5rem", letterSpacing: "2px" }}>
          MARVEL • DC • SPIDER-VERSE
        </p>
      </div>
    </div>
  );
}
