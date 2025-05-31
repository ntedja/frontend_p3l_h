import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PembayaranPage = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(60); // 60 detik

  useEffect(() => {
    if (timeLeft === 0) {
      // Navigasi ke halaman konfirmasi pesanan setelah waktu habis
      navigate('/konfirmasi-pesanan');
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  const handleUpload = (e) => {
    e.preventDefault();
    // Logika untuk mengunggah bukti transfer
    // Setelah berhasil, navigasi ke halaman konfirmasi pesanan
    navigate('/konfirmasi-pesanan');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFF7E2] text-[#2D4C41]">
      <h1 className="text-2xl font-semibold mb-4">Pembayaran</h1>
      <p className="mb-2">Silakan transfer ke rekening berikut:</p>
      <p className="mb-4 font-semibold">Bank ABC - 1234567890 a.n. Reusemart</p>
      <p className="mb-4">Waktu tersisa: {timeLeft} detik</p>
      <form onSubmit={handleUpload} className="flex flex-col items-center">
        <input type="file" accept="image/*" required className="mb-4" />
        <button type="submit" className="bg-[#48635B] text-white px-4 py-2 rounded-md">
          Upload Bukti Transfer
        </button>
      </form>
    </div>
  );
};

export default PembayaranPage;
