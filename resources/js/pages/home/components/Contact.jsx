import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLanguage } from '../../../context/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading,  setLoading]  = useState(false);
  const [status,   setStatus]   = useState({ type: '', msg: '' });

  useEffect(() => {
    if (!window.location.hash.includes('contact')) return;

    // Attend 1200ms — temps suffisant pour :
    // 1. Le render initial de la page (300ms)
    // 2. Les appels axios de EventEnCours/EventsTimeline (300-600ms)
    // 3. Les animations framer-motion ScrollReveal (900ms duration)
    const timer = setTimeout(() => {
      const el = document.getElementById('contact');
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 85;
      window.scrollTo({ top, behavior: 'smooth' });
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'message' && value.length > 500) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });
    try {
      const res = await axios.post('/api/contact', formData);
      if (res.data.success) {
        setStatus({ type: 'success', msg: t('contact.success_msg') });
        setFormData({ name: '', email: '', message: '' });
      }
    } catch {
      setStatus({ type: 'danger', msg: "Erreur lors de l'envoi. Vérifiez votre connexion." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="contact-section py-5" style={{ scrollMarginTop: '85px' }}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 contact-text-side pe-lg-5">
            <h1 className="contact-title display-5 fw-bold mb-4">{t('contact.title')}</h1>
            <p className="contact-subtitle mb-5">{t('contact.subtitle')}</p>
            <div className="contact-details">
              <div className="detail-item d-flex align-items-center mb-4">
                <div className="icon-box me-3"><i className="fas fa-envelope" /></div>
                <span className="fw-medium">contact@artista.fr</span>
              </div>
              <div className="detail-item d-flex align-items-center mb-4">
                <div className="icon-box me-3"><i className="fas fa-phone-alt" /></div>
                <span className="fw-medium">+212 7 75 48 42 64</span>
              </div>
              <div className="detail-item d-flex align-items-center mb-4">
                <div className="icon-box me-3"><i className="fas fa-map-marker-alt" /></div>
                <span className="fw-medium">{t('contact.address')}</span>
              </div>
            </div>
          </div>
          <div className="col-lg-5 offset-lg-1">
            <div className="contact-form-card p-4 p-md-5 shadow border-0 rounded-4 bg-white">
              {status.msg && (
                <div className={`alert alert-${status.type}`}>{status.msg}</div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <input name="name" className="form-control custom-input"
                    placeholder={t('contact.placeholder_name')}
                    value={formData.name} onChange={handleChange} required />
                </div>
                <div className="mb-4">
                  <input name="email" type="email" className="form-control custom-input"
                    placeholder={t('contact.placeholder_email')}
                    value={formData.email} onChange={handleChange} required />
                </div>
                <div className="mb-4">
                  <textarea name="message" className="form-control custom-input" rows="4"
                    placeholder={t('contact.placeholder_message')}
                    value={formData.message} onChange={handleChange} required />
                  <small className="text-muted d-block text-end mt-1">
                    {formData.message.length}/500
                  </small>
                </div>
                <button type="submit" className="btn-send w-100 py-3 fw-bold" disabled={loading}>
                  {loading ? '...' : t('contact.btn_send')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}