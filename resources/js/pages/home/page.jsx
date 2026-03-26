import React from 'react';
import HeroSection from './components/HeroSection';
import ArtistesSection from './components/ArtistesSection';
import Contact from './components/Contact';
import ArtistBiosSection from './components/ArtistBiosSection';
import TemoignageSection from './components/temoignageSection';
import ScrollReveal from '../ScrollReveal';

export default function HomePage() {
  return (
<main className="content-area">
      <HeroSection />
      
      <ScrollReveal>
        <ArtistesSection />
      </ScrollReveal>

      <ScrollReveal>
        <ArtistBiosSection />
      </ScrollReveal>

      <ScrollReveal>
        <TemoignageSection />
      </ScrollReveal>

      <ScrollReveal>
        <Contact />
      </ScrollReveal>
    </main>
  );
}