import React from 'react';
import HeroSection from './components/HeroSection';
import ArtistesSection from './components/ArtistesSection';
import Contact from './components/Contact';
import ArtistBiosSection from './components/ArtistBiosSection';
import TemoignageSection from './components/temoignageSection';

export default function HomePage() {
  return (
<main className="content-area">
      {/* 1. Hero : Image toute largeur */}
      <HeroSection />
      
      {/* 2. Section Artistes : Gère son propre fond beige et son container-fluid */}
      <ArtistesSection />
      <ArtistBiosSection />
      <TemoignageSection/>
      {/* 3. Section Contact */}
      <Contact />
    </main>
  );
}