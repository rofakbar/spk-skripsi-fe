import React from 'react';

const Splash = () => {
  return (
    <div style={styles.container}>
      {/* Inject CSS untuk animasi berputar */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      {/* Logo Lingkaran */}
      <div style={styles.logoContainer}>
        {/* Lu bisa ganti emoji ini pakai <img src="logo.png" /> */}
        <span style={{ fontSize: '60px' }}>🎓</span> 
      </div>

      {/* Teks Judul */}
      <h1 style={styles.title}>SPK SKRIPSI</h1>
      <p style={styles.subtitle}>Metode WASPAS</p>

      {/* Indikator Loading */}
      <div style={styles.loader}></div>
    </div>
  );
};

// Styling disamakan dengan warna palet Figma/Flutter lu
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // Penuhi layar
    backgroundColor: '#0D5C4D', // Hijau utama SKRIPSIAN
    color: 'white',
    fontFamily: 'sans-serif',
  },
  logoContainer: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '50%',
    boxShadow: '0 8px 15px rgba(0,0,0,0.15)',
    marginBottom: '32px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100px',
    height: '100px',
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    letterSpacing: '2px',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '18px',
    opacity: 0.8,
    letterSpacing: '1.5px',
    margin: '0 0 48px 0',
  },
  loader: {
    border: '4px solid rgba(255, 255, 255, 0.3)',
    borderTop: '4px solid white',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
  }
};

export default Splash;