import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function KonfirmasiPesananPage() {
  useEffect(() => {
    document.title = 'Reusemart - Konfirmasi Pesanan';
    return () => {
      document.title = 'ReuseMart';
    };
  }, []);
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-md mx-auto mt-20 text-center">
      <div className="mb-4 text-green-600 text-6xl">✓</div>
      <h2 className="text-2xl font-semibold mb-2">Terima kasih telah memesan barang!</h2>
      <p className="mb-6">
        Pesanan Anda dengan nomor <strong>{orderId}</strong> telah berhasil dibuat.
      </p>
      <button
        className="bg-[#48635B] text-white px-6 py-2 rounded mr-4"
        onClick={() => navigate('/')}
      >
        Kembali ke Beranda
      </button>
      <button
        className="border border-[#48635B] text-[#48635B] px-6 py-2 rounded"
        onClick={() => navigate('/riwayat-pesanan')}
      >
        Lihat Riwayat Transaksi
      </button>
    </div>
  );
}
