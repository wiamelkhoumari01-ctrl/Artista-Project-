import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../api';

const CATEGORIES = [
  { id_key: 'peinture', fr: 'Peinture Abstraite', en: 'Abstract Painting', ar: 'لوحة تجريدية' },
  { id_key: 'sculpture', fr: 'Sculpture Moderne', en: 'Modern Sculpture', ar: 'نحت حديث' },
  { id_key: 'photo', fr: 'Photographie Artistique', en: 'Artistic Photography', ar: 'تصوير فني' },
  { id_key: 'numerique', fr: 'Art Numérique', en: 'Digital Art', ar: 'فن رقمي' },
  { id_key: 'illustration', fr: 'Illustration', en: 'Illustration', ar: 'توضيح' },
  { id_key: 'contemporain', fr: 'Art Contemporain', en: 'Contemporary Art', ar: 'الفن المعاصر' },
];

const LANGUAGES = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ar', label: 'العربية', flag: '🇲🇦' },
];

export default function OnboardingModal({ onClose }) {
  const { user, setUser } = useAuth();
  const { changeLanguage, locale } = useLanguage();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);

  // Step 1 — infos profil
  const [form, setForm] = useState({
    stage_name: user?.first_name + ' ' + user?.last_name || '',
    bio: '',
    phone: '',
    city: '',
    country: '',
    category_id: '',
  });

  // Step 2 — photo profil
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Step 3 — langue
  const [selectedLang, setSelectedLang] = useState(locale || 'fr');

  // Fetch categories au montage
  React.useEffect(() => {
    api.get('/api/categories').then(res => setCategories(res.data)).catch(() => {});
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1,
  });

  const handleStep1Submit = async () => {
    if (!form.stage_name || !form.city || !form.country) {
      setError('Veuillez remplir les champs obligatoires.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await api.post('/api/artist/update', {
        stage_name: { fr: form.stage_name, en: form.stage_name, ar: form.stage_name },
        bio: { fr: form.bio, en: form.bio, ar: form.bio },
        phone: form.phone,
        city: form.city,
        country: form.country,
        category_id: form.category_id || null,
      });
      setStep(2);
    } catch (e) {
      setError("Erreur lors de la sauvegarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async () => {
    setLoading(true);
    if (photoFile) {
      const fd = new FormData();
      fd.append('photo', photoFile);
      try {
        await api.post('/api/artist/upload-photo', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } catch (e) {
        // Non bloquant
      }
    }
    setLoading(false);
    setStep(3);
  };

  const handleFinish = async () => {
    changeLanguage(selectedLang);
    try {
      await api.post('/api/artist/set-locale', { locale: selectedLang });
    } catch (e) {}
    navigate('/artist/dashboard');
    onClose();
  };

  const progress = (step / 3) * 100;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logoRow}>
            <img src="/images/logo_art.png" alt="logo" style={{ width: 36, height: 36 }} />
            <span style={styles.logoText}>ARTISTA.</span>
          </div>
          <p style={styles.stepLabel}>Étape {step} sur 3</p>
        </div>

        {/* Progress bar */}
        <div style={styles.progressBg}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
        </div>

        {/* Contenu */}
        <div style={styles.body}>

          {/* ===== STEP 1 — Infos profil ===== */}
          {step === 1 && (
            <>
              <h2 style={styles.title}>Complétez votre profil</h2>
              <p style={styles.subtitle}>Ces informations seront visibles sur votre page artiste.</p>

              {error && <div style={styles.errorBox}>{error}</div>}

              <div style={styles.formGrid}>
                <div style={styles.fieldFull}>
                  <label style={styles.label}>Nom de scène *</label>
                  <input
                    style={styles.input}
                    value={form.stage_name}
                    onChange={e => setForm({ ...form, stage_name: e.target.value })}
                    placeholder="Votre nom d'artiste"
                  />
                </div>

                <div style={styles.fieldFull}>
                  <label style={styles.label}>Biographie</label>
                  <textarea
                    style={{ ...styles.input, minHeight: 100, resize: 'vertical' }}
                    value={form.bio}
                    onChange={e => setForm({ ...form, bio: e.target.value })}
                    placeholder="Parlez de votre parcours artistique..."
                    maxLength={600}
                  />
                  <span style={styles.charCount}>{form.bio.length}/600</span>
                </div>

                <div style={styles.fieldHalf}>
                  <label style={styles.label}>Téléphone</label>
                  <input
                    style={styles.input}
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="+212 6 00 00 00 00"
                  />
                </div>

                <div style={styles.fieldHalf}>
                  <label style={styles.label}>Ville *</label>
                  <input
                    style={styles.input}
                    value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                    placeholder="Casablanca"
                  />
                </div>

                <div style={styles.fieldHalf}>
                  <label style={styles.label}>Pays *</label>
                  <input
                    style={styles.input}
                    value={form.country}
                    onChange={e => setForm({ ...form, country: e.target.value })}
                    placeholder="Maroc"
                  />
                </div>

                <div style={styles.fieldHalf}>
                  <label style={styles.label}>Spécialité</label>
                  <select
                    style={styles.input}
                    value={form.category_id}
                    onChange={e => setForm({ ...form, category_id: e.target.value })}
                  >
                    <option value="">Sélectionner...</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name?.fr || cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                style={loading ? styles.btnDisabled : styles.btn}
                onClick={handleStep1Submit}
                disabled={loading}
              >
                {loading ? 'Enregistrement...' : 'Suivant →'}
              </button>
            </>
          )}

          {/* ===== STEP 2 — Photo de profil ===== */}
          {step === 2 && (
            <>
              <h2 style={styles.title}>Photo de profil</h2>
              <p style={styles.subtitle}>Une belle photo renforce votre identité artistique.</p>

              <div
                {...getRootProps()}
                style={{
                  ...styles.dropzone,
                  borderColor: isDragActive ? '#c5a059' : 'rgba(197,160,89,0.4)',
                  background: isDragActive ? 'rgba(197,160,89,0.07)' : '#fdfaf6',
                }}
              >
                <input {...getInputProps()} />
                {photoPreview ? (
                  <img src={photoPreview} alt="preview" style={styles.photoPreview} />
                ) : (
                  <div style={styles.dropzoneInner}>
                    <div style={styles.dropzoneIcon}>📷</div>
                    <p style={{ color: '#888', marginBottom: 4 }}>
                      {isDragActive ? 'Déposez ici...' : 'Glissez votre photo ici'}
                    </p>
                    <span style={styles.dropzoneHint}>ou cliquez pour sélectionner</span>
                  </div>
                )}
              </div>

              {photoPreview && (
                <button
                  style={styles.btnOutline}
                  onClick={() => { setPhotoFile(null); setPhotoPreview(null); }}
                >
                  Changer la photo
                </button>
              )}

              <div style={styles.btnRow}>
                <button style={styles.btnGhost} onClick={() => setStep(3)}>
                  Passer cette étape
                </button>
                <button
                  style={loading ? styles.btnDisabled : styles.btn}
                  onClick={handleStep2Submit}
                  disabled={loading}
                >
                  {loading ? 'Upload...' : 'Suivant →'}
                </button>
              </div>
            </>
          )}

          {/* ===== STEP 3 — Langue préférée ===== */}
          {step === 3 && (
            <>
              <h2 style={styles.title}>Langue préférée</h2>
              <p style={styles.subtitle}>Le site s'affichera dans la langue que vous choisissez.</p>

              <div style={styles.langGrid}>
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    style={{
                      ...styles.langCard,
                      borderColor: selectedLang === lang.code ? '#c5a059' : 'rgba(0,0,0,0.1)',
                      background: selectedLang === lang.code ? 'rgba(197,160,89,0.1)' : '#fff',
                    }}
                    onClick={() => setSelectedLang(lang.code)}
                  >
                    <span style={{ fontSize: 32 }}>{lang.flag}</span>
                    <span style={styles.langLabel}>{lang.label}</span>
                    {selectedLang === lang.code && (
                      <span style={styles.langCheck}>✓</span>
                    )}
                  </button>
                ))}
              </div>

              <button style={styles.btn} onClick={handleFinish}>
                Terminer et accéder au tableau de bord ✓
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 9999,
    background: 'rgba(0,0,0,0.55)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    padding: '20px',
  },
  modal: {
    background: '#fff',
    borderRadius: 24,
    width: '100%',
    maxWidth: 560,
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 30px 80px rgba(0,0,0,0.2)',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '24px 32px 0',
  },
  logoRow: { display: 'flex', alignItems: 'center', gap: 10 },
  logoText: { fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 18, color: '#1a1a1a' },
  stepLabel: { fontSize: 13, color: '#c5a059', fontWeight: 600, margin: 0 },
  progressBg: {
    height: 4, background: '#f0e8dc', margin: '20px 32px 0',
    borderRadius: 99,
  },
  progressFill: {
    height: '100%', background: 'linear-gradient(90deg, #c5a059, #e8c97a)',
    borderRadius: 99, transition: 'width 0.5s ease',
  },
  body: { padding: '28px 32px 36px' },
  title: {
    fontFamily: 'Playfair Display, serif',
    fontSize: 26, fontWeight: 700,
    color: '#1a1a1a', marginBottom: 8,
  },
  subtitle: { fontSize: 14, color: '#888', marginBottom: 28 },
  errorBox: {
    background: '#fff0f0', border: '1px solid #ffcdd2',
    borderRadius: 12, padding: '12px 16px',
    color: '#c62828', fontSize: 13, marginBottom: 20,
  },
  formGrid: { display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 28 },
  fieldFull: { width: '100%' },
  fieldHalf: { width: 'calc(50% - 8px)' },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 },
  input: {
    width: '100%', padding: '12px 16px',
    border: '1.5px solid rgba(0,0,0,0.12)',
    borderRadius: 12, fontSize: 14,
    outline: 'none', fontFamily: 'inherit',
    transition: 'border-color 0.2s',
    background: '#fdfaf6',
    boxSizing: 'border-box',
  },
  charCount: { fontSize: 11, color: '#aaa', float: 'right', marginTop: 4 },
  btn: {
    width: '100%', padding: '15px',
    background: 'linear-gradient(135deg, #c5a059, #e8c97a)',
    border: 'none', borderRadius: 14,
    color: '#fff', fontWeight: 700, fontSize: 15,
    cursor: 'pointer', marginTop: 8,
    fontFamily: 'inherit',
    transition: 'opacity 0.2s',
  },
  btnDisabled: {
    width: '100%', padding: '15px',
    background: '#ddd', border: 'none',
    borderRadius: 14, color: '#999',
    fontWeight: 700, fontSize: 15,
    cursor: 'not-allowed', marginTop: 8,
    fontFamily: 'inherit',
  },
  btnOutline: {
    display: 'block', margin: '12px auto 0',
    padding: '8px 20px',
    background: 'transparent',
    border: '1.5px solid #c5a059',
    borderRadius: 99, color: '#c5a059',
    fontWeight: 600, fontSize: 13,
    cursor: 'pointer', fontFamily: 'inherit',
  },
  btnGhost: {
    padding: '13px 20px',
    background: 'transparent', border: '1.5px solid rgba(0,0,0,0.12)',
    borderRadius: 14, color: '#999',
    fontWeight: 600, fontSize: 14,
    cursor: 'pointer', fontFamily: 'inherit',
    flex: 1,
  },
  btnRow: { display: 'flex', gap: 12, marginTop: 8 },
  dropzone: {
    border: '2px dashed',
    borderRadius: 20,
    padding: 40,
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginBottom: 16,
    minHeight: 200,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  dropzoneInner: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 },
  dropzoneIcon: { fontSize: 48, marginBottom: 8 },
  dropzoneHint: { fontSize: 12, color: '#bbb' },
  photoPreview: {
    width: 160, height: 160,
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid #c5a059',
  },
  langGrid: { display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' },
  langCard: {
    flex: 1, minWidth: 130,
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
    padding: '24px 16px',
    border: '2px solid',
    borderRadius: 18, cursor: 'pointer',
    transition: 'all 0.2s',
    background: '#fff', position: 'relative',
    fontFamily: 'inherit',
  },
  langLabel: { fontSize: 15, fontWeight: 600, color: '#333' },
  langCheck: {
    position: 'absolute', top: 10, right: 14,
    color: '#c5a059', fontWeight: 700, fontSize: 16,
  },
};