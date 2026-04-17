// src/pages/Dashboard/components/AddEventModal.jsx
import React, { useState } from 'react';
import api from '../../../api';
import Modal from '../ui/Modal';
import { FI, FS } from '../ui/FormElements';
import { Check } from 'lucide-react';

const EVENT_TYPES = ['Exposition', 'Atelier', 'Concert', 'Festival'];

export default function AddEventModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    type: 'Exposition', title: '', description: '',
    venue_name: '', start_date: '', end_date: '', location_url: '',
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const handleSubmit = async () => {
    if (!form.title || !form.venue_name || !form.start_date || !form.end_date) {
      setErr('Titre, lieu et dates sont obligatoires.');
      return;
    }
    setErr('');
    setSaving(true);
    try {
      await api.post('/api/artist/events/store', {
        type: form.type,
        title: { fr: form.title, en: form.title, ar: form.title },
        description: { fr: form.description, en: form.description, ar: form.description },
        venue_name: form.venue_name,
        start_date: form.start_date,
        end_date: form.end_date,
        location_url: form.location_url,
      });
      onSuccess();
      onClose();
    } catch (e) {
      setErr(e.response?.data?.message || "Erreur lors de l'ajout.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Créer un événement" onClose={onClose}>
      {err && <div style={FS.errorBox}>{err}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <FI label="Type de tournée *">
          <select style={FS.input} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </FI>
        <FI label="Titre *">
          <input style={FS.input} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Nom de l'événement" />
        </FI>
        <FI label="Description">
          <textarea style={{ ...FS.input, minHeight: 80, resize: 'vertical' }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Décrivez votre événement..." />
        </FI>
        <FI label="Lieu *">
          <input style={FS.input} value={form.venue_name} onChange={e => setForm({ ...form, venue_name: e.target.value })} placeholder="Galerie Nationale, Paris" />
        </FI>
        <div style={{ display: 'flex', gap: 14 }}>
          <div style={{ flex: 1 }}>
            <FI label="Date début *">
              <input type="date" style={FS.input} value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} />
            </FI>
          </div>
          <div style={{ flex: 1 }}>
            <FI label="Date fin *">
              <input type="date" style={FS.input} value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} />
            </FI>
          </div>
        </div>
        <FI label="Lien Google Maps">
          <input style={FS.input} value={form.location_url} onChange={e => setForm({ ...form, location_url: e.target.value })} placeholder="http://maps.google.com/..." />
        </FI>
        <button style={saving ? FS.btnDisabled : FS.btnGold} onClick={handleSubmit} disabled={saving}>
          <Check size={16} /> {saving ? 'Création...' : "Créer l'événement"}
        </button>
      </div>
    </Modal>
  );
}