// src/pages/Dashboard/ui/FormElements.jsx
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

export const FS = {
  input: {
    width: '100%', padding: '11px 14px',
    border: '1.5px solid rgba(0,0,0,0.1)',
    borderRadius: 10, fontSize: 14, fontFamily: 'inherit',
    outline: 'none', background: '#fdfaf6',
    boxSizing: 'border-box', display: 'block',
  },
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 6 },
  errorBox: {
    background: '#fff0f0', border: '1px solid #ffcdd2',
    borderRadius: 10, padding: '10px 14px',
    color: '#c62828', fontSize: 13, marginBottom: 12,
  },
  btnGold: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    width: '100%', padding: '13px',
    background: 'linear-gradient(135deg, #c5a059, #e8c97a)',
    border: 'none', borderRadius: 12,
    color: '#fff', fontWeight: 700, fontSize: 14,
    cursor: 'pointer', fontFamily: 'inherit',
  },
  btnDisabled: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    width: '100%', padding: '13px',
    background: '#e0e0e0', border: 'none', borderRadius: 12,
    color: '#999', fontWeight: 700, fontSize: 14,
    cursor: 'not-allowed', fontFamily: 'inherit',
  },
  btnSmall: {
    display: 'block', margin: '8px auto 0',
    padding: '6px 16px', background: 'transparent',
    border: '1.5px solid rgba(197,160,89,0.4)',
    borderRadius: 99, color: '#c5a059',
    fontWeight: 600, fontSize: 12,
    cursor: 'pointer', fontFamily: 'inherit',
  },
};

export function FI({ label, children }) {
  return (
    <div>
      <label style={FS.label}>{label}</label>
      {children}
    </div>
  );
}

export function ArtworkDropzone({ preview, onDrop }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: useCallback(files => onDrop(files[0]), [onDrop]),
    accept: { 'image/*': [] }, maxFiles: 1,
  });
  return (
    <div {...getRootProps()} style={{
      border: `2px dashed ${isDragActive ? '#c5a059' : 'rgba(197,160,89,0.4)'}`,
      borderRadius: 14, padding: preview ? 8 : 36,
      textAlign: 'center', cursor: 'pointer',
      background: isDragActive ? 'rgba(197,160,89,0.06)' : '#fdfaf6',
      transition: 'all 0.2s',
    }}>
      <input {...getInputProps()} />
      {preview ? (
        <img src={preview} alt="preview" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 10 }} />
      ) : (
        <div>
          <Upload size={28} style={{ color: '#c5a059', marginBottom: 10 }} />
          <p style={{ color: '#888', margin: 0, fontSize: 14 }}>
            {isDragActive ? 'Déposez ici...' : 'Glissez ou cliquez pour uploader'}
          </p>
          <span style={{ fontSize: 12, color: '#bbb' }}>JPG, PNG, WEBP — max 5 Mo</span>
        </div>
      )}
    </div>
  );
}