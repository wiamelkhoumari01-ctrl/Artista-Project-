// src/pages/Dashboard/components/AddArtworkModal.jsx
import React, { useState } from 'react';
import api from '../../../api';
import Modal from '../ui/Modal';
import { FI, FS, ArtworkDropzone } from '../ui/FormElements';
import { Check } from 'lucide-react';

export default function AddArtworkModal({ categories, locale, onClose, onSuccess }) {
  const [form, setForm] = useState({ title: '', description: '', category_id: '', date_creation: '' });
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const handleDrop = (file) => {
    if (!file) return;
    setImgFile(file);
    setImgPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.category_id || !imgFile) {
      setErr('Titre, catégorie et image sont requis.');
      return;
    }
    setErr('');
    setSaving(true);
    const fd = new FormData();
    fd.append('images[]', imgFile);
    fd.append('title[fr]', form.title);
    fd.append('title[en]', form.title);
    fd.append('title[ar]', form.title);
    fd.append('description[fr]', form.description);
    fd.append('description[en]', form.description);
    fd.append('description[ar]', form.description);
    fd.append('category_id', form.category_id);
    if (form.date_creation) fd.append('date_creation', form.date_creation);
    try {
      await api.post('/api/artworks/store', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      onSuccess();
      onClose();
    } catch (e) {
      setErr(e.response?.data?.message || "Erreur lors de l'ajout.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Ajouter une œuvre" onClose={onClose}>
      {err && <div style={FS.errorBox}>{err}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <ArtworkDropzone preview={imgPreview} onDrop={handleDrop} />
        {imgPreview && (
          <button style={FS.btnSmall} onClick={() => { setImgFile(null); setImgPreview(null); }}>
            Changer l'image
          </button>
        )}
        <FI label="Titre *">
          <input style={FS.input} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Nom de l'œuvre" />
        </FI>
        <FI label="Description">
          <textarea style={{ ...FS.input, minHeight: 85, resize: 'vertical' }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Décrivez votre œuvre..." />
        </FI>
        <div style={{ display: 'flex', gap: 14 }}>
          <div style={{ flex: 1 }}>
            <FI label="Catégorie *">
              <select style={FS.input} value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}>
                <option value="">-- Sélectionner --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name?.[locale] || cat.name?.fr || (typeof cat.name === 'string' ? cat.name : 'Catégorie')}
                  </option>
                ))}
              </select>
            </FI>
          </div>
          <div style={{ flex: 1 }}>
            <FI label="Date de création">
              <input type="date" style={FS.input} value={form.date_creation} onChange={e => setForm({ ...form, date_creation: e.target.value })} />
            </FI>
          </div>
        </div>
        <button style={saving ? FS.btnDisabled : FS.btnGold} onClick={handleSubmit} disabled={saving}>
          <Check size={16} /> {saving ? 'Ajout en cours...' : "Ajouter l'œuvre"}
        </button>
      </div>
    </Modal>
  );
}