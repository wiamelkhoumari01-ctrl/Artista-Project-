import React, { useEffect } from "react";
import "../../../css/image-lightbox.css";

export default function ImageLightbox({ 
    isOpen, 
    onClose, 
    artworks, 
    currentIndex, 
    setCurrentIndex 
}) {

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % artworks.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + artworks.length) % artworks.length);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Escape") onClose();
        if (e.key === "ArrowRight") handleNext();
        if (e.key === "ArrowLeft") handlePrev();
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleKeyDown);
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const currentArtwork = artworks[currentIndex];

    return (
        <div className="lightbox-overlay" onClick={onClose}>
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                
                {/* Close */}
                <button className="lightbox-close" onClick={onClose}>
                    ✕
                </button>

                {/* Image */}
                <img
                    src={currentArtwork.image_url}
                    alt={currentArtwork.title}
                    className="lightbox-image"
                />

                {/* Title only */}
                <div className="lightbox-title">
                    {currentArtwork.title}
                </div>

                {/* Navigation */}
                {artworks.length > 1 && (
                    <>
                        <button className="lightbox-nav prev" onClick={handlePrev}>
                            ‹
                        </button>
                        <button className="lightbox-nav next" onClick={handleNext}>
                            ›
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}