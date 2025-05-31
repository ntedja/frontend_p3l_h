import React from 'react';
import { useNavigate } from 'react-router-dom';

const KonfirmasiPesananPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFF7E2] text-[#2D4C41]">
      <div className="text-6xl mb-4">✅</div>
      <h1 className="text-2xl font-semibold mb-2">Terima kasih telah memesan barang!</h1>
      <p className="mb-6">Pesanan Anda telah berhasil dibuat.</p>
      <div className="flex gap-4">
        <button
          className="bg-[#48635B] text-white px-4 py-2 rounded-md"
          onClick={() => navigate('/')}
        >
          Kembali ke Beranda
        </button>
        <button
          className="bg-[#48635B] text-white px-4 py-2 rounded-md"
          onClick={() => navigate('/riwayat-transaksi')}
        >
          Lihat Riwayat Transaksi
        </button>
      </div>
    </div>
  );
};

export default KonfirmasiPesananPage;
