import React from 'react';
import HeroSection from './components/HeroSection';
import ArtistesSection from './components/ArtistesSection';
import Contact from './components/Contact';
import ArtistBiosSection from './components/ArtistBiosSection';
import EventEnCours from './components/EventEnCours';
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

      <EventEnCours />

      <ScrollReveal>
        <TemoignageSection />
      </ScrollReveal>

      {/*
        ── CORRECTION DU BUG DE SCROLL ───────────────────────────────────
        Le lien Navbar pointe vers "/#contact" via HashLink.
        L'id="contact" DOIT être posé sur l'élément racine que le navigateur
        va chercher. On l'enveloppe ici avec un <div id="contact"> plutôt
        que de modifier le composant Contact interne, ce qui est plus propre.

        Le scroll-margin-top compense la navbar fixed (hauteur ~80px) pour
        que la section ne se cache pas derrière elle.
      */}
      <div
        id="contact"
        style={{ scrollMarginTop: '80px' }}
      >
        <Contact />
      </div>

    </main>
  );
}
