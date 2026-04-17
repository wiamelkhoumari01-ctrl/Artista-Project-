import React from "react";
import { useLanguage } from "../../context/LanguageContext";

export default function Timeline({ events }) {
    const { locale } = useLanguage();

    // Fonction sécurisée pour gérer string ou objet traduction
    const getT = (field) => {
        if (typeof field === "string") return field;
        return field?.[locale] || field?.['fr'] || "";
    };

    return (
        <div className="timeline-container py-4">
            <h4 className="mb-4">Prochains Événements & Expos</h4>
            
            <div className="position-relative border-start border-2 border-dark ms-3 ps-4">
                {events && events.length > 0 ? (
                    events.map((event, index) => (
                        <div 
                            key={event.id || index} 
                            className="timeline-item mb-4 position-relative"
                        >
                            <div 
                                className="position-absolute translate-middle-x bg-dark rounded-circle"
                                style={{
                                    width: '15px',
                                    height: '15px',
                                    left: '-33px',
                                    top: '10px'
                                }}
                            ></div>

                            <div className="fw-bold">
                                {getT(event.title)}
                            </div>

                            <div className="text-muted small">
                                {event.start_date} - {getT(event.venue_name)}
                            </div>

                            {event.description && (
                                <p className="small mb-0">
                                    {getT(event.description)}
                                </p>
                            )}

                            {/* Status Badge */}
                            {event.status && (
                                <span className={`badge ${event.status.class} mt-1`}>
                                    {event.status.label}
                                </span>
                            )}

                        </div>
                    ))
                ) : (
                    <p className="text-muted small">
                        Aucun événement prévu pour le moment.
                    </p>
                )}
            </div>
        </div>
    );
}