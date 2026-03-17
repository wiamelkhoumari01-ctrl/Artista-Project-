import React from 'react';

export default function Timeline({ events }) {
    return (
        <div className="timeline-container py-4">
            <h4 className="mb-4">Prochains Événements & Expos</h4>
            <div className="position-relative border-start border-2 border-dark ms-3 ps-4">
                {/* Exemple d'un point dans la timeline */}
                <div className="timeline-item mb-4 position-relative">
                    <div className="position-absolute translate-middle-x bg-dark rounded-circle" 
                         style={{width: '15px', height: '15px', left: '-33px', top: '10px'}}></div>
                    <div className="fw-bold">Vernissage - Galerie de l'Art</div>
                    <div className="text-muted small">15 Mai 2026 - Paris</div>
                    <p className="small mb-0">Exposition collective des nouveaux talents.</p>
                </div>

                <div className="timeline-item mb-4 position-relative">
                    <div className="position-absolute translate-middle-x bg-secondary rounded-circle" 
                         style={{width: '15px', height: '15px', left: '-33px', top: '10px'}}></div>
                    <div className="fw-bold">Atelier Ouvert</div>
                    <div className="text-muted small">20 Juin 2026 - Lyon</div>
                    <p className="small mb-0">Venez découvrir les coulisses de la création.</p>
                </div>
            </div>
        </div>
    );
}