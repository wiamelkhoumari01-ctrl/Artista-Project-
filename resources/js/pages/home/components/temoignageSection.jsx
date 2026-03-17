import React from 'react';

const Temoignage = [
  {
    initials: "MD",
    bgColor: "#f8bbd0",
    name: "Marie Dupont",
    handle: "@marie_art",
    text: "Une plateforme exceptionnelle qui met vraiment en valeur le talent des artistes. J'ai découvert des œuvres magnifiques et pu échanger avec des créateurs passionnés.",
    lang: "fr"
  },
  {
    initials: "PL",
    bgColor: "#bbdefb",
    name: "Pierre Leroy",
    handle: "@pierre_collectionneur",
    text: "Interface élégante et intuitive. La qualité des artistes présentés est remarquable. Un vrai plaisir de naviguer et découvrir de nouveaux talents.",
    lang: "fr"
  },
  {
    initials: "JM",
    bgColor: "#e1bee7",
    name: "Julie Martin",
    handle: "@julie_creative",
    text: "As an artist, this platform allowed me to share my work with a much wider audience. The tools are simple, effective and the community is great!",
    lang: "en"
  },
  {
    initials: "AB",
    bgColor: "#b9f6ca",
    name: "Alexandre Blanc",
    handle: "@alex_photo",
    text: "Superbe initiative pour promouvoir l'art contemporain. La diversité des styles et des médiums est impressionnante.",
    lang: "fr"
  },
  {
    initials: "ي",
    bgColor: "#fff9c4",
    name: "ياسين العمراني",
    handle: "@yassine_art",
    text: "منصة رائعة حقًا تجمع بين الإبداع والاحترافية. لقد ساعدتني كثيراً في الوصول إلى جمهور جديد ومشاركة أعمالي الفنية بكل سهولة.",
    lang: "ar"
  },
  {
    initials: "LR",
    bgColor: "#ffe0b2",
    name: "Lucas Roux",
    handle: "@lucas_art",
    text: "Une communauté artistique dynamique et inspirante. Bravo pour cette belle réalisation !",
    lang: "fr"
  }
];

export default function TemoignageSection(){
  return (
    <section className="temoignage-section">
      <div className="container">
        <span className="temoignage-subtitle">TÉMOIGNAGES</span>
        <h2 className="temoignage-main-title">Ce Que Disent Nos Visiteurs</h2>
        
        <div className="temoignage-grid">
          {Temoignage.map((t, index) => (
            <div key={index} className={`temoignage-card ${t.lang === 'ar' ? 'rtl-card' : ''}`}>
              <div className="temoignage-header">
                <div className="user-avatar" style={{ backgroundColor: t.bgColor }}>
                  {t.initials}
                </div>
                <div className="user-info">
                  <h4 className="user-name">{t.name}</h4>
                  <p className="user-handle">{t.handle}</p>
                </div>
              </div>
              <p className="temoignage-text">"{t.text}"</p>
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="fas fa-star"></i>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

