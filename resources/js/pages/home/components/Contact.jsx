import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  useEffect(() => {
    if (window.location.hash === "#contact") {
      const timer = setTimeout(() => {
        const element = document.getElementById("contact");
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "message" && value.length > 500) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });

    try {
      const res = await axios.post('/api/contact', formData);
      if (res.data.success) {
        setStatus({ type: 'success', msg: 'Votre message a été envoyé avec succès !' });
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      setStatus({ type: 'danger', msg: "Erreur lors de l'envoi. Vérifiez votre connexion." });
    } finally {
      setLoading(false);
    }
  };
  return (
    <section id="contact" className="contact-section py-5">
      <div className="container">
        <div className="row align-items-center">
          
          {/* Côté texte et infos */}
          <div className="col-lg-6 contact-text-side pe-lg-5">
            <h1 className="contact-title display-5 fw-bold mb-4">Contactez-Nous</h1>
            <p className="contact-subtitle mb-5">
              Vous avez une question ou souhaitez en savoir plus sur nos artistes ? 
              N'hésitez pas à nous contacter. Notre équipe vous répondra dans les plus brefs délais.
            </p>

            <div className="contact-details">
              <div className="detail-item d-flex align-items-center mb-4">
                <div className="icon-box me-3">
                  <i className="fas fa-envelope"></i>
                </div>
                <span className="fw-medium">contact@artista.fr</span>
              </div>
              <div className="detail-item d-flex align-items-center mb-4">
                <div className="icon-box me-3">
                  <i className="fas fa-phone-alt"></i>
                </div>
                <span className="fw-medium">+212 7 75 48 42 64</span>
              </div>
              <div className="detail-item d-flex align-items-center mb-4">
                <div className="icon-box me-3">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <span className="fw-medium">123 Rue de l'Art, Casablanca, Maroc</span>
              </div>
            </div>
          </div>

          <div className="col-lg-5 offset-lg-1">
            <div className="contact-form-card p-4 p-md-5 shadow border-0 rounded-4 bg-white">
              {status.msg && <div className={`alert alert-${status.type}`}>{status.msg}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <input name="name" className="form-control custom-input" placeholder="Votre nom" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="mb-4">
                  <input name="email" type="email" className="form-control custom-input" placeholder="Votre email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="mb-4">
                  <textarea name="message" className="form-control custom-input" rows="4" placeholder="Votre message" value={formData.message} onChange={handleChange} required></textarea>
                  <small className="text-muted d-block text-end mt-1">{formData.message.length}/500</small>
                </div>
                <button type="submit" className="btn-send w-100 py-3 fw-bold" disabled={loading}>
                  {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
