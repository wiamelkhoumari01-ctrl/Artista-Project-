import React, { useState } from 'react';
import { Trash2, Image as ImageIcon, Plus, Edit3, X, Check, AlertTriangle } from 'lucide-react';
import { DS } from '../styles/dashboardStyles';
import { FS, FI } from '../ui/FormElements';
import Modal from '../ui/Modal';
import api from '../../../api';

// ─────────────────────────────────────────────────────────────
// Modal de confirmation de suppression — style identique admin
// ─────────────────────────────────────────────────────────────
function DeleteConfirmModal({ artwork, locale, onCancel, onConfirm, deleting }) {
  const title =
    artwork?.title?.[locale] ||
    artwork?.title?.fr ||
    (typeof artwork?.title === 'string' ? artwork.title : 'cette œuvre');

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9100,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(4px)', padding: 20,
      }}
      onClick={e => e.target === e.currentTarget && onCancel()}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 24,
          width: '100%',
          maxWidth: 440,
          boxShadow: '0 30px 80px rgba(0,0,0,0.18)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '22px 24px 0',
          }}
        >
          <h3
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 20, fontWeight: 700, color: '#1a1a1a', margin: 0,
            }}
          >
            Supprimer l'œuvre
          </h3>
          <button
            onClick={onCancel}
            style={{
              background: 'rgba(0,0,0,0.06)', border: 'none',
              borderRadius: '50%', width: 34, height: 34,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={18} color="#666" />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px 8px' }}>

          {/* Icône + aperçu de l'œuvre */}
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              background: 'rgba(229,57,53,0.05)',
              border: '1px solid rgba(229,57,53,0.12)',
              borderRadius: 14,
              padding: '14px 16px',
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'rgba(229,57,53,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <AlertTriangle size={20} color="#e53935" />
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>
                « {title} »
              </p>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: '#aaa' }}>
                ID #{artwork?.id}
              </p>
            </div>
            {artwork?.image_url && (
              <img
                src={artwork.image_url}
                alt={title}
                onError={e => { e.target.style.display = 'none'; }}
                style={{
                  width: 48, height: 48,
                  objectFit: 'cover', borderRadius: 8,
                  marginLeft: 'auto', flexShrink: 0,
                }}
              />
            )}
          </div>

          <p style={{ color: '#666', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
            Confirmer la suppression définitive ? Cette action est <strong>irréversible</strong> et
            supprimera également toutes les images associées à cette œuvre.
          </p>
        </div>

        {/* Footer boutons */}
        <div
          style={{
            display: 'flex', justifyContent: 'flex-end', gap: 10,
            padding: '20px 24px 24px',
          }}
        >
          <button
            onClick={onCancel}
            disabled={deleting}
            style={{
              padding: '11px 22px',
              background: 'transparent',
              border: '1.5px solid rgba(0,0,0,0.12)',
              borderRadius: 12,
              color: '#888', fontWeight: 600, fontSize: 14,
              cursor: 'pointer', fontFamily: 'inherit',
              opacity: deleting ? 0.5 : 1,
            }}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            style={{
              padding: '11px 26px',
              background: deleting
                ? '#f5a5a5'
                : 'linear-gradient(135deg, #e53935, #ef5350)',
              border: 'none',
              borderRadius: 12,
              color: '#fff', fontWeight: 700, fontSize: 14,
              cursor: deleting ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 8,
              transition: 'opacity 0.2s',
            }}
          >
            {deleting ? (
              <>
                <span
                  style={{
                    width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)',
                    borderTopColor: '#fff', borderRadius: '50%',
                    display: 'inline-block', animation: 'spin 0.6s linear infinite',
                  }}
                />
                Suppression...
              </>
            ) : (
              <>
                <Trash2 size={15} />
                Confirmer
              </>
            )}
          </button>
        </div>
      </div>

      {/* Keyframes spinner injectés une seule fois */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Modal d'édition (inchangé)
// ─────────────────────────────────────────────────────────────
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
    title:        getTitle(artwork),
    description:  getDesc(artwork),
    category_id:  artwork?.category_id || '',
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
      setErr(e.response?.data?.message || 'Erreur lors de la modification.');
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
          <Check size={16} /> {saving ? 'Modification...' : 'Sauvegarder'}
        </button>
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────
// Table principale
// ─────────────────────────────────────────────────────────────
export default function ArtworkTable({
  artworks, loading, locale, t, onDelete, onAddClick, categories = [],
}) {
  const [editTarget,   setEditTarget]   = useState(null); // artwork à éditer
  const [deleteTarget, setDeleteTarget] = useState(null); // artwork à supprimer
  const [deleting,     setDeleting]     = useState(false);

  const handleSuccess = () => window.location.reload();

  // Déclenché par le bouton Confirmer du modal custom
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await onDelete(deleteTarget.id); // remonte la suppression au parent
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
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
      {/* Modal édition */}
      {editTarget && (
        <EditArtworkModal
          artwork={editTarget}
          categories={categories}
          locale={locale}
          onClose={() => setEditTarget(null)}
          onSuccess={handleSuccess}
        />
      )}

      {/* Modal suppression custom — remplace window.confirm */}
      {deleteTarget && (
        <DeleteConfirmModal
          artwork={deleteTarget}
          locale={locale}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
          deleting={deleting}
        />
      )}

      <table style={DS.table}>
        <thead>
          <tr>
            {[
              t('dashboard.table_preview'),
              t('dashboard.table_title'),
              t('dashboard.table_date'),
              t('dashboard.table_actions'),
            ].map(h => (
              <th key={h} style={DS.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {artworks.map(art => {
            const title  = art.title?.[locale] || art.title?.fr ||
              (typeof art.title === 'string' ? art.title : 'Sans titre');
            const imgSrc = art.image_url || '/images/default-avatar.png';

            return (
              <tr key={art.id} style={DS.tr}>
                <td style={DS.td}>
                  <img
                    src={imgSrc} alt={title} style={DS.thumb}
                    onError={e => { e.target.src = '/images/default-avatar.png'; }}
                  />
                </td>
                <td style={DS.td}>
                  <span style={DS.artTitle}>{title}</span>
                  <span style={DS.artId}>ID #{art.id}</span>
                </td>
                <td style={DS.td}>
                  <span style={DS.dateText}>
                    {new Date(art.date_creation || art.created_at || Date.now())
                      .toLocaleDateString('fr-FR')}
                  </span>
                </td>
                <td style={{ ...DS.td, textAlign: 'right' }}>
                  <button
                    style={DS.editBtn}
                    onClick={() => setEditTarget(art)}
                    title="Modifier"
                  >
                    <Edit3 size={15} color="#c5a059" />
                  </button>
                  {/* Ouvre le modal custom au lieu de window.confirm */}
                  <button
                    style={DS.deleteBtn}
                    onClick={() => setDeleteTarget(art)}
                    title="Supprimer"
                  >
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
