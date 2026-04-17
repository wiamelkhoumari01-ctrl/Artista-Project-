// src/pages/Dashboard/ui/Modal.jsx
import React from 'react';
import { X } from 'lucide-react';

const MS = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 9000,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    backdropFilter: 'blur(4px)', padding: 20,
  },
  modal: {
    background: '#fff', borderRadius: 24,
    width: '100%', maxWidth: 580,
    maxHeight: '90vh', overflowY: 'auto',
    boxShadow: '0 30px 80px rgba(0,0,0,0.18)',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '24px 28px 0',
  },
  title: {
    fontFamily: 'Playfair Display, serif',
    fontSize: 22, fontWeight: 700, color: '#1a1a1a', margin: 0,
  },
  closeBtn: {
    background: 'rgba(0,0,0,0.06)', border: 'none',
    borderRadius: '50%', width: 36, height: 36,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
  },
  body: { padding: '24px 28px 32px' },
};

export default function Modal({ title, onClose, children }) {
  return (
    <div style={MS.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={MS.modal}>
        <div style={MS.header}>
          <h3 style={MS.title}>{title}</h3>
          <button style={MS.closeBtn} onClick={onClose}><X size={20} /></button>
        </div>
        <div style={MS.body}>{children}</div>
      </div>
    </div>
  );
}