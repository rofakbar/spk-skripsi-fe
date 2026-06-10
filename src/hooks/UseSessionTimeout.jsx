// Lokasi: src/hooks/useSessionTimeout.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useSessionTimeout = (timeoutMinutes = 5) => {
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId;

    // Fungsi "Tendang User" kalau kelamaan diem
    const handleLogout = () => {
      console.log("Sesi habis! Mengalihkan ke login...");
      
      // Hapus semua token dan sesi di Local Storage
      // (Sesuaikan key ini dengan yang lu pake pas nyimpen token login)
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('last_active');
      
      // Arahkan ke halaman login
      navigate('/login');
    };

    // Fungsi reset waktu ke 0 setiap kali user gerak
    const resetTimer = () => {
      clearTimeout(timeoutId);
      // Set ulang alarm (menit * 60 detik * 1000 milidetik)
      timeoutId = setTimeout(handleLogout, timeoutMinutes * 60 * 1000);
      
      // Catat waktu terakhir user gerak
      localStorage.setItem('last_active', Date.now().toString());
    };

    // Fungsi untuk ngecek waktu saat user baru buka/refresh tab
    const checkOnLoad = () => {
      const lastActive = localStorage.getItem('last_active');
      if (lastActive) {
        const timeDiff = Date.now() - parseInt(lastActive, 10);
        // Kalau pas refresh ternyata udah lewat batas waktu, langsung tendang
        if (timeDiff > timeoutMinutes * 60 * 1000) {
          handleLogout();
        }
      }
    };

    // Jalankan pengecekan pertama kali
    checkOnLoad();
    resetTimer();

    // Daftar sensor pergerakan user
    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];

    // Pasang sensor ke seluruh jendela browser
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Cleanup: Matikan sensor kalau komponen dibongkar
    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [navigate, timeoutMinutes]);
};

export default useSessionTimeout;