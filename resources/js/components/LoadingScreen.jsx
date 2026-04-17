import React from 'react';

export default function LoadingScreen(){
  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 9999
    }}>
      <img 
        src="/images/logo_art.png" 
        alt="Loading..." 
        style={{ 
          width: '80px', 
          animation: 'pulse 1.5s infinite ease-in-out' 
        }} 
      />
      <h2 style={{ 
        marginTop: '20px', 
        fontFamily: 'Playfair Display, serif', 
        color: '#c5a059',
        letterSpacing: '3px'
      }}>
        ARTISTA.
      </h2>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.7; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

