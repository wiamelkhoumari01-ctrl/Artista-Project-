import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../../../context/LanguageContext";

export default function ArtistesSection() {
  const { t } = useLanguage();
  const [artistes, setArtistes] = useState([]);

  useEffect(() => {
    setArtistes(mockArtistes);
  }, []);

  const display = artistes.slice(0, 6);

  return (
    <section id="bas" className="py-5" style={{ backgroundColor: '#f4ece4' }}>
      <div className="container-fluid px-md-5">
        <div className="mb-5 text-center">
          <p className="text-muted small mb-1">{t('home.artists_badge')}</p>
          <h2 className="texte fw-bold display-6">
            {t('home.artists_title_1')} <br /> {t('home.artists_title_2')}
          </h2>
        </div>

        <div className="row g-4 justify-content-center">
          {display.map((a, index) => (
            <motion.div 
              key={a.id} 
              className="col-12 col-md-6 col-lg-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ 
                duration: 0.7, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
            >
              <Link
                to={`/artistes/${a.slug}`}
                className="art-card d-block position-relative overflow-hidden rounded-4 border-0 shadow-sm"
              >
                <img
                  src={a.photo_url}
                  alt={a.nom_scene}
                  className="w-100 h-100 object-cover"
                  loading="lazy"
                  style={{ objectFit: 'cover', height: '420px' }}
                />
                <div className="card-gradient"></div>
                <div className="card-info p-4">
                  <h3 className="h5 text-white mb-1">{a.nom_scene}</h3>
                  <p className="text-white-50 mb-0">{a.specialite}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-5">
          <Link to="/artistes" className="btn btn-dark rounded-pill px-5 py-3">
            {t('home.view_all_artists')} →
          </Link>
        </div>
      </div>
    </section>
  );
}

const mockArtistes = [
  { id: "1", nom_scene: "Anthony Chambaud", specialite: "Peinture Abstraite", photo_url: "/images/anthony-chambaud-artiste-1.webp", slug: "anthony-chambaud" },
  { id: "2", nom_scene: "Emmanuel Sellier", specialite: "Sculpture Moderne", photo_url: "/images/emmanuel-sellier-artiste-1.webp", slug: "emmanuel-sellier" },
  { id: "3", nom_scene: "Hannah Reyes Morales", specialite: "Photographie Artistique", photo_url: "/images/hannah-reyes-morales-artiste-1.webp", slug: "hannah-reyes-morales" },
  { id: "4", nom_scene: "Mad Dog Jones", specialite: "Art Numérique", photo_url: "/images/mad-dog-jones-artiste-1.webp", slug: "mad-dog-jones" },
  { id: "5", nom_scene: "Karla Ortiz", specialite: "Illustration", photo_url: "/images/karla-ortiz-artiste-1.webp", slug: "karla-ortiz" },
  { id: "6", nom_scene: "Cecily Brown", specialite: "Art Contemporain", photo_url: "/images/cecily-brown-artiste-1.webp", slug: "cecily-brown" }
];