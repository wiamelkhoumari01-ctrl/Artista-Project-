import React from 'react';

export default function Timeline({ events }) {
    return (
        <div className="timeline-container py-4">
            <h4 className="mb-4">Prochains Événements & Expos</h4>
            <div className="position-relative border-start border-2 border-dark ms-3 ps-4">
                {events && events.length > 0 ? (
                    events.map((event, index) => (
                        <div key={event.id || index} className="timeline-item mb-4 position-relative">
                            <div className="position-absolute translate-middle-x bg-dark rounded-circle" 
                                 style={{width: '15px', height: '15px', left: '-33px', top: '10px'}}></div>
                            <div className="fw-bold">{event.title}</div>
                            <div className="text-muted small">
                                {event.start_date} {event.venue_name && `- ${event.venue_name}`}
                            </div>
                            {event.description && <p className="small mb-0">{event.description}</p>}
                        </div>
                    ))
                ) : (
                    <p className="text-muted small">Aucun événement prévu pour le moment.</p>
                )}
            </div>
        </div>
    );
}