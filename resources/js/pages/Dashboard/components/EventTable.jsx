import React, { useState } from 'react';
import { Trash2, Calendar, Plus, Edit3, Check } from 'lucide-react';
import { DS, typeBadgeColor } from '../styles/dashboardStyles';
import { FS, FI } from '../ui/FormElements';
import Modal from '../ui/Modal';
import api from '../../../api';

const EVENT_TYPES = ['Exposition', 'Atelier', 'Concert', 'Festival'];

function EditEventModal({ event, onClose, onSuccess }) {
  const getField = (field) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    if (typeof field === 'object') return field.fr || field.en || '';
    return '';
  };

  const formatDate = (d) => {
    if (!d) return '';
    try { return new Date(d).toISOString().split('T')[0]; }
    catch { return ''; }
  };

  const [form, setForm] = useState({
    type:         event?.type        || 'Exposition',
    title:        getField(event?.title),
    description:  getField(event?.description),
    venue_name:   event?.venue_name  || '',
    start_date:   formatDate(event?.start_date),
    end_date:     formatDate(event?.end_date),
    location_url: event?.location_url || '',
  });
  const [saving, setSaving] = useState(false);
  const [err,    setErr]    = useState('');

  const handleSubmit = async () => {
    if (!form.title || !form.venue_name || !form.start_date || !form.end_date) {
      setErr('Titre, lieu et dates sont requis.');
      return;
    }
    setErr('');
    setSaving(true);
    try {
      await api.put(`/api/artist/events/${event.id}`, {
        type:         form.type,
        title:        { fr: form.title, en: form.title, ar: form.title },
        description:  { fr: form.description, en: form.description, ar: form.description },
        venue_name:   form.venue_name,
        start_date:   form.start_date,
        end_date:     form.end_date,
        location_url: form.location_url,
      });
      onSuccess();
      onClose();
    } catch (e) {
      setErr(e.response?.data?.message || "Erreur lors de la modification.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Modifier l'événement" onClose={onClose}>
      {err && <div style={FS.errorBox}>{err}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <FI label="Type *">
          <select style={FS.input} value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value })}>
            {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </FI>
        <FI label="Titre *">
          <input style={FS.input} value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })} />
        </FI>
        <FI label="Description">
          <textarea style={{ ...FS.input, minHeight: 80, resize: 'vertical' }}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })} />
        </FI>
        <FI label="Lieu *">
          <input style={FS.input} value={form.venue_name}
            onChange={e => setForm({ ...form, venue_name: e.target.value })} />
        </FI>
        <div style={{ display: 'flex', gap: 14 }}>
          <div style={{ flex: 1 }}>
            <FI label="Date début *">
              <input type="date" style={FS.input} value={form.start_date}
                onChange={e => setForm({ ...form, start_date: e.target.value })} />
            </FI>
          </div>
          <div style={{ flex: 1 }}>
            <FI label="Date fin *">
              <input type="date" style={FS.input} value={form.end_date}
                onChange={e => setForm({ ...form, end_date: e.target.value })} />
            </FI>
          </div>
        </div>
        <FI label="Lien Google Maps">
          <input style={FS.input} value={form.location_url}
            onChange={e => setForm({ ...form, location_url: e.target.value })}
            placeholder="https://maps.google.com/..." />
        </FI>
        <button style={saving ? FS.btnDisabled : FS.btnGold}
          onClick={handleSubmit} disabled={saving}>
          <Check size={16} /> {saving ? 'Modification...' : "Sauvegarder"}
        </button>
      </div>
    </Modal>
  );
}

export default function EventTable({ events, locale, onDelete, onAddClick, onRefresh }) {
  const [editTarget, setEditTarget] = useState(null);

  if (events.length === 0) {
    return (
      <div style={DS.empty}>
        <Calendar size={44} style={{ color: '#ddd', marginBottom: 14 }} />
        <p style={{ color: '#aaa', margin: '0 0 16px' }}>Aucun événement créé.</p>
        <button style={{ ...FS.btnGold, width: 'auto', padding: '11px 24px' }} onClick={onAddClick}>
          <Plus size={14} /> Créer un événement
        </button>
      </div>
    );
  }

  return (
    <>
      {editTarget && (
        <EditEventModal
          event={editTarget}
          onClose={() => setEditTarget(null)}
          onSuccess={() => { setEditTarget(null); onRefresh?.(); }}
        />
      )}

      <table style={DS.table}>
        <thead>
          <tr>
            {['Type', 'Titre', 'Lieu', 'Dates', 'Actions'].map(h => (
              <th key={h} style={DS.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {events.map(ev => {
            const title = ev.title?.[locale] || ev.title?.fr
              || (typeof ev.title === 'string' ? ev.title : 'Événement');
            return (
              <tr key={ev.id} style={DS.tr}>
                <td style={DS.td}>
                  <span style={{ ...DS.typeBadge, ...typeBadgeColor(ev.type) }}>
                    {ev.type}
                  </span>
                </td>
                <td style={DS.td}>
                  <span style={DS.artTitle}>{title}</span>
                </td>
                <td style={DS.td}>
                  <span style={DS.dateText}>{ev.venue_name}</span>
                </td>
                <td style={DS.td}>
                  <span style={DS.dateText}>
                    {ev.start_date ? new Date(ev.start_date).toLocaleDateString('fr-FR') : '—'}
                    {' → '}
                    {ev.end_date   ? new Date(ev.end_date).toLocaleDateString('fr-FR')   : '—'}
                  </span>
                </td>
                <td style={{ ...DS.td, textAlign: 'right' }}>
                  <button style={DS.editBtn} onClick={() => setEditTarget(ev)} title="Modifier">
                    <Edit3 size={15} color="#c5a059" />
                  </button>
                  <button style={DS.deleteBtn} onClick={() => onDelete(ev.id)} title="Supprimer">
                    <Trash2 size={15} color="#e53935" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}