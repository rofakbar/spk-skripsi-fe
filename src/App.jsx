import React, { useState, useEffect } from 'react';
import Router from "./router";
import Splash from "./components/Splash"; // <-- Kalo lu naruh file Splash.jsx di folder src/components

function App() {
  // 1. Bikin state untuk mengatur status loading splash screen
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 2. Atur durasi splash screen muncul (2500 milidetik = 2.5 detik)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // 3. Jika masih loading, tampilkan Splash Screen
  if (isLoading) {
    return <Splash />;
  }

  // 4. Jika loading selesai, baru tampilkan Router utama bawaan skripsi lu
  return <Router />;
}

export default App;