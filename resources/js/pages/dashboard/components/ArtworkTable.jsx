import React, { useState } from 'react';
import { Trash2, Image as ImageIcon, Plus, Edit3, X, Check } from 'lucide-react';
import { DS } from '../styles/dashboardStyles';
import { FS, FI } from '../ui/FormElements';
import Modal from '../ui/Modal';
import api from '../../../api';

function EditArtworkModal({ artwork, categories, locale, onClose, onSuccess }) {
  const getTitle = (art) => {
    if (!art?.title) return '';
    if (typeof art.title === 'string') return art.title;
    return art.title[locale] || art.title?.fr || '';
  };
  const getDesc = (art) => {
    if (!art?.description) return '';
    if (typeof art.description === 'string') return art.description;
    return art.description[locale] || art.description?.fr || '';
  };

  const [form, setForm] = useState({
    title:       getTitle(artwork),
    description: getDesc(artwork),
    category_id: artwork?.category_id || '',
    date_creation: artwork?.date_creation
      ? new Date(artwork.date_creation).toISOString().split('T')[0]
      : '',
  });
  const [saving, setSaving] = useState(false);
  const [err,    setErr]    = useState('');

  const handleSubmit = async () => {
    if (!form.title) { setErr('Le titre est requis.'); return; }
    setErr('');
    setSaving(true);
    try {
      await api.put(`/api/artworks/${artwork.id}`, {
        title:         { fr: form.title, en: form.title, ar: form.title },
        description:   { fr: form.description, en: form.description, ar: form.description },
        category_id:   form.category_id,
        date_creation: form.date_creation,
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
    <Modal title="Modifier l'œuvre" onClose={onClose}>
      {err && <div style={FS.errorBox}>{err}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <FI label="Titre *">
          <input style={FS.input} value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })} />
        </FI>
        <FI label="Description">
          <textarea style={{ ...FS.input, minHeight: 90, resize: 'vertical' }}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })} />
        </FI>
        <div style={{ display: 'flex', gap: 14 }}>
          <div style={{ flex: 1 }}>
            <FI label="Catégorie">
              <select style={FS.input} value={form.category_id}
                onChange={e => setForm({ ...form, category_id: e.target.value })}>
                <option value="">-- Sélectionner --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name?.[locale] || cat.name?.fr || cat.name}
                  </option>
                ))}
              </select>
            </FI>
          </div>
          <div style={{ flex: 1 }}>
            <FI label="Date de création">
              <input type="date" style={FS.input} value={form.date_creation}
                onChange={e => setForm({ ...form, date_creation: e.target.value })} />
            </FI>
          </div>
        </div>
        <button style={saving ? FS.btnDisabled : FS.btnGold}
          onClick={handleSubmit} disabled={saving}>
          <Check size={16} /> {saving ? 'Modification...' : "Sauvegarder"}
        </button>
      </div>
    </Modal>
  );
}

export default function ArtworkTable({ artworks, loading, locale, t, onDelete, onAddClick, categories = [] }) {
  const [editTarget, setEditTarget] = useState(null);

  const handleSuccess = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <div className="spinner-border" style={{ color: '#c5a059' }} />
      </div>
    );
  }

  if (artworks.length === 0) {
    return (
      <div style={DS.empty}>
        <ImageIcon size={44} style={{ color: '#ddd', marginBottom: 14 }} />
        <p style={{ color: '#aaa', margin: '0 0 16px' }}>{t('dashboard.empty_gallery')}</p>
        <button style={{ ...FS.btnGold, width: 'auto', padding: '11px 24px' }} onClick={onAddClick}>
          <Plus size={14} /> {t('dashboard.publish_first')}
        </button>
      </div>
    );
  }

  return (
    <>
      {editTarget && (
        <EditArtworkModal
          artwork={editTarget}
          categories={categories}
          locale={locale}
          onClose={() => setEditTarget(null)}
          onSuccess={handleSuccess}
        />
      )}

      <table style={DS.table}>
        <thead>
          <tr>
            {[t('dashboard.table_preview'), t('dashboard.table_title'), t('dashboard.table_date'), t('dashboard.table_actions')].map(h => (
              <th key={h} style={DS.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {artworks.map(art => {
            const title  = art.title?.[locale] || art.title?.fr || (typeof art.title === 'string' ? art.title : 'Sans titre');
            const imgSrc = art.image_url || '/images/default-avatar.png';
            return (
              <tr key={art.id} style={DS.tr}>
                <td style={DS.td}>
                  <img src={imgSrc} alt={title} style={DS.thumb}
                    onError={e => { e.target.src = '/images/default-avatar.png'; }} />
                </td>
                <td style={DS.td}>
                  <span style={DS.artTitle}>{title}</span>
                  <span style={DS.artId}>ID #{art.id}</span>
                </td>
                <td style={DS.td}>
                  <span style={DS.dateText}>
                    {new Date(art.date_creation || art.created_at || Date.now()).toLocaleDateString('fr-FR')}
                  </span>
                </td>
                <td style={{ ...DS.td, textAlign: 'right' }}>
                  <button style={DS.editBtn} onClick={() => setEditTarget(art)} title="Modifier">
                    <Edit3 size={15} color="#c5a059" />
                  </button>
                  <button style={DS.deleteBtn} onClick={() => onDelete(art.id)} title="Supprimer">
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