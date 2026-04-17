import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, X } from 'lucide-react';
import api from '../../api';

export default function ProfileCard({ artistData, setArtistData, flash, locale, styles }) {
  const [photoPreview, setPhotoPreview]     = useState(null);
  const [photoFile, setPhotoFile]           = useState(null);
  const [photoUploading, setPhotoUploading] = useState(false);

  const onDrop = useCallback((accepted) => {
    const file = accepted[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
  });

  const handleUploadPhoto = async () => {
    if (!photoFile) return;
    setPhotoUploading(true);
    const fd = new FormData();
    fd.append('photo', photoFile);
    try {
      const res = await api.post('/api/artist/upload-photo', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // L'API retourne l'URL complète déjà résolue
      setArtistData(prev => ({ ...prev, image_url: res.data.image_url }));
      setPhotoFile(null);
      setPhotoPreview(null);
      flash('Photo de profil mise à jour !');
    } catch (e) {
      console.error(e);
    } finally {
      setPhotoUploading(false);
    }
  };

  // image_url est déjà résolue par l'API (URL complète ou /images/...)
  const imageUrl    = artistData?.image_url || '/images/default-avatar.png';
  const displayName = artistData?.stage_name?.[locale] || artistData?.stage_name?.fr || '';
  const catName     = artistData?.category?.name?.[locale] || artistData?.category?.name?.fr || null;

  return (
    <div className={styles.card}>

      {/* Avatar + Dropzone */}
      <div className={styles.avatarWrap}>
        <img
          src={photoPreview || imageUrl}
          alt="Profil"
          className={styles.avatar}
          onError={e => { e.target.src = '/images/default-avatar.png'; }}
        />
        <div
          {...getRootProps()}
          className={styles.cameraBtn}
          style={{ background: isDragActive ? '#a07c3a' : '#c5a059' }}
          title="Changer la photo"
        >
          <input {...getInputProps()} />
          <Camera size={15} color="#fff" />
        </div>
      </div>

      {/* Confirmation upload */}
      {photoFile && (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12 }}>
          <button
            className={styles.btnGold}
            onClick={handleUploadPhoto}
            disabled={photoUploading}
          >
            {photoUploading ? '...' : '✓ Confirmer'}
          </button>
          <button
            className={styles.btnCancel}
            onClick={() => { setPhotoFile(null); setPhotoPreview(null); }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      <h3 className={styles.name}>{displayName}</h3>
      <p className={styles.location}>
        {[artistData?.city, artistData?.country].filter(Boolean).join(', ') || '—'}
      </p>

      {catName && (
        <span className={styles.badge}>{catName}</span>
      )}

      {/* Infos contact */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
        {artistData?.phone && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#555' }}>
            <span>📞</span>
            <span>{artistData.phone}</span>
          </div>
        )}
        {artistData?.website && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <span>🌐</span>
            
             <a href={artistData.website.startsWith('http') ? artistData.website : `https://${artistData.website}`}
              target="_blank"
              rel="noreferrer"
              style={{ color: '#c5a059', textDecoration: 'none' }}
            >
              {artistData.website}
            </a>
          </div>
        )}
      </div>

    </div>
  );
}