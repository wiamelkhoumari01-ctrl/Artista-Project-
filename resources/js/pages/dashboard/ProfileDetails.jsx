import React, { useState, useEffect } from 'react';
import { Edit3, Save, X } from 'lucide-react';
import api from '../../api';

export default function ProfileDetails({ artistData, categories, fetchProfile, flash, locale, t, styles }) {
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving]     = useState(false);

  const [form, setForm] = useState({
    stage_name: '', bio: '', phone: '',
    city: '', country: '', website: '', category_id: '',
  });

  // Sync form quand artistData change
  useEffect(() => {
    if (artistData) {
      setForm({
        stage_name:  artistData.stage_name?.[locale] || artistData.stage_name?.fr || '',
        bio:         artistData.bio?.[locale]        || artistData.bio?.fr        || '',
        phone:       artistData.phone    || '',
        city:        artistData.city     || '',
        country:     artistData.country  || '',
        website:     artistData.website  || '',
        category_id: artistData.category_id || '',
      });
    }
  }, [artistData, locale]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post('/api/artist/update', {
        stage_name:  { fr: form.stage_name, en: form.stage_name, ar: form.stage_name },
        bio:         { fr: form.bio, en: form.bio, ar: form.bio },
        phone:       form.phone,
        city:        form.city,
        country:     form.country,
        website:     form.website,
        category_id: form.category_id || null,
      });
      await fetchProfile();
      setEditMode(false);
      flash('Profil mis à jour avec succès !');
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  // Valeurs affichées en mode lecture
  const displayBio = artistData?.bio?.[locale] || artistData?.bio?.fr || '';

  return (
    <div className={styles.card}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h4 className={styles.name} style={{ textAlign: 'left', margin: 0 }}>
          {t('profile.about_me')}
        </h4>

        {!editMode ? (
          <button className={styles.btnGold} onClick={() => setEditMode(true)}>
            <Edit3 size={14} /> Modifier
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <button className={styles.btnGold} onClick={handleSave} disabled={saving}>
              <Save size={14} /> {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
            <button className={styles.btnCancel} onClick={() => setEditMode(false)}>
              <X size={14} /> Annuler
            </button>
          </div>
        )}
      </div>

      {/* ── Mode lecture ── */}
      {!editMode ? (
        <>
          <p style={{ color: '#555', lineHeight: 1.8, fontSize: 15, marginBottom: 0 }}>
            {displayBio || <em style={{ color: '#bbb' }}>{t('profile.no_bio')}</em>}
          </p>
          <hr style={{ borderColor: 'rgba(0,0,0,0.07)', margin: '20px 0' }} />
          <div className="row g-3">
            {[
              { label: t('profile.city'),    value: artistData?.city     },
              { label: 'Pays',               value: artistData?.country   },
              { label: 'Téléphone',          value: artistData?.phone     },
              { label: t('profile.website'), value: artistData?.website   },
            ].map(({ label, value }) => (
              <div key={label} className="col-6">
                <span className={styles.label}>{label}</span>
                <span style={{ display: 'block', fontSize: 15, color: '#333', fontWeight: 500 }}>
                  {value || '—'}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* ── Mode édition ── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div>
            <label className={styles.label}>Nom de scène</label>
            <input
              className={styles.inputField}
              value={form.stage_name}
              onChange={e => setForm({ ...form, stage_name: e.target.value })}
              placeholder="Votre nom d'artiste"
            />
          </div>

          <div>
            <label className={styles.label}>Biographie</label>
            <textarea
              className={styles.inputField}
              style={{ minHeight: 110, resize: 'vertical' }}
              value={form.bio}
              maxLength={600}
              onChange={e => setForm({ ...form, bio: e.target.value })}
              placeholder="Parlez de votre parcours artistique..."
            />
            <span style={{ fontSize: 11, color: '#bbb', float: 'right', marginTop: 3 }}>
              {form.bio.length}/600
            </span>
          </div>

          <div className="row g-3">
            <div className="col-6">
              <label className={styles.label}>Ville</label>
              <input
                className={styles.inputField}
                value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })}
                placeholder="Casablanca"
              />
            </div>
            <div className="col-6">
              <label className={styles.label}>Pays</label>
              <input
                className={styles.inputField}
                value={form.country}
                onChange={e => setForm({ ...form, country: e.target.value })}
                placeholder="Maroc"
              />
            </div>
            <div className="col-6">
              <label className={styles.label}>Téléphone</label>
              <input
                className={styles.inputField}
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="+212 6 00 00 00 00"
              />
            </div>
            <div className="col-6">
              <label className={styles.label}>Site web</label>
              <input
                className={styles.inputField}
                value={form.website}
                onChange={e => setForm({ ...form, website: e.target.value })}
                placeholder="https://monsite.com"
              />
            </div>
            <div className="col-12">
              <label className={styles.label}>Spécialité</label>
              <select
                className={styles.inputField}
                value={form.category_id}
                onChange={e => setForm({ ...form, category_id: e.target.value })}
              >
                <option value="">Sélectionner une spécialité...</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name?.[locale] || cat.name?.fr || (typeof cat.name === 'string' ? cat.name : 'Catégorie')}
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}