import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spidey Picks — Your Multiverse Movie Guide",
  description:
    "Discover movies across every universe. Spidey Picks is your Spider-Man themed cinematic recommendation engine powered by real-time TMDB data.",
  keywords: ["movies", "spider-man", "multiverse", "film recommendations", "TMDB"],
  openGraph: {
    title: "Spidey Picks",
    description: "Your Multiverse Movie Guide",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
