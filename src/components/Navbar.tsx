"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import SpideySenseButton from "./SpideySenseButton";

const NAV_LINKS = [
  { label: "Trending", href: "#trending" },
  { label: "Now Playing", href: "#now-playing" },
  { label: "Top Rated", href: "#top-rated" },
  { label: "Upcoming", href: "#upcoming" },
  { label: "Explore", href: "#explore" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  return (
    <nav
      id="navbar"
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 1000,
        transition: "all 0.4s ease",
        background: scrolled
          ? "rgba(5,5,5,0.92)"
          : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(232,0,60,0.15)" : "none",
      }}
    >
      <div style={{
        maxWidth: 1400,
        margin: "0 auto",
        padding: "0 24px",
        height: 70,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ position: "relative" }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="17" stroke="#e8003c" strokeWidth="1.5" />
              <circle cx="18" cy="18" r="11" stroke="#e8003c" strokeWidth="1" strokeOpacity="0.4" />
              {/* Web lines */}
              <line x1="18" y1="1" x2="18" y2="35" stroke="#e8003c" strokeWidth="0.8" strokeOpacity="0.5" />
              <line x1="1" y1="18" x2="35" y2="18" stroke="#e8003c" strokeWidth="0.8" strokeOpacity="0.5" />
              <line x1="5" y1="5" x2="31" y2="31" stroke="#e8003c" strokeWidth="0.8" strokeOpacity="0.5" />
              <line x1="31" y1="5" x2="5" y2="31" stroke="#e8003c" strokeWidth="0.8" strokeOpacity="0.5" />
              {/* Spider body */}
              <ellipse cx="18" cy="17" rx="3" ry="4" fill="#e8003c" />
              <ellipse cx="18" cy="22" rx="2.5" ry="3" fill="#e8003c" />
              {/* Eyes */}
              <ellipse cx="16" cy="15.5" rx="1.5" ry="1.2" fill="white" transform="rotate(-15 16 15.5)" />
              <ellipse cx="20" cy="15.5" rx="1.5" ry="1.2" fill="white" transform="rotate(15 20 15.5)" />
              {/* Legs */}
              <line x1="15" y1="17" x2="9" y2="13" stroke="#e8003c" strokeWidth="1.2" />
              <line x1="15" y1="19" x2="8" y2="18" stroke="#e8003c" strokeWidth="1.2" />
              <line x1="15" y1="21" x2="9" y2="25" stroke="#e8003c" strokeWidth="1.2" />
              <line x1="21" y1="17" x2="27" y2="13" stroke="#e8003c" strokeWidth="1.2" />
              <line x1="21" y1="19" x2="28" y2="18" stroke="#e8003c" strokeWidth="1.2" />
              <line x1="21" y1="21" x2="27" y2="25" stroke="#e8003c" strokeWidth="1.2" />
            </svg>
          </div>
          <div>
            <span className="font-bebas" style={{ fontSize: 22, letterSpacing: 3, color: "white" }}>
              SPIDEY
            </span>
            <span className="font-bebas" style={{ fontSize: 22, letterSpacing: 3, color: "var(--accent-red)" }}>
              PICKS
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="hidden-mobile">
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href} className="nav-link">{l.label}</a>
          ))}
        </div>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <SpideySenseButton />
          {/* Search toggle */}
          <button
            id="search-toggle"
            onClick={() => setSearchOpen(!searchOpen)}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              padding: "8px 12px",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.2s",
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            Search
          </button>

          {/* Hamburger */}
          <button
            id="nav-menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              display: "none", flexDirection: "column", gap: 5, padding: 4,
            }}
            className="show-mobile"
          >
            {[0,1,2].map(i => (
              <span key={i} style={{
                display: "block", width: 24, height: 2,
                background: "white", borderRadius: 2,
                transition: "all 0.3s",
              }} />
            ))}
          </button>
        </div>
      </div>

      {/* Search Bar Dropdown */}
      <div style={{
        overflow: "hidden",
        maxHeight: searchOpen ? 80 : 0,
        transition: "max-height 0.4s ease",
        background: "rgba(5,5,5,0.95)",
        borderBottom: searchOpen ? "1px solid rgba(232,0,60,0.2)" : "none",
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "16px 24px" }}>
          <div style={{ position: "relative" }}>
            <svg style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", opacity: 0.4 }}
              width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              ref={searchRef}
              id="movie-search-input"
              type="text"
              placeholder="Search any movie across the multiverse..."
              className="search-input"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const val = (e.target as HTMLInputElement).value.trim();
                  if (val) window.location.href = `/?search=${encodeURIComponent(val)}#explore`;
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          background: "rgba(10,10,10,0.98)",
          borderTop: "1px solid rgba(232,0,60,0.15)",
          padding: "20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}>
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href} className="nav-link"
              style={{ fontSize: 18 }} onClick={() => setMenuOpen(false)}>
              {l.label}
            </a>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
