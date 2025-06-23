import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function PembayaranPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [timer, setTimer] = useState(60);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (timer === 0) {
      alert('Waktu pembayaran habis. Transaksi dibatalkan.');
      const token = localStorage.getItem('token');
      axios
        .post(
          `https://reusemart.site/api/checkout/${orderId}/batal`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        .then(() => {
          navigate('/');
        })
        .catch(() => {
          alert('Gagal membatalkan transaksi.');
        });
      return; // jangan buat interval lagi
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, orderId, navigate]);

  const handleSubmit = async () => {
    if (!file) return alert('Pilih file bukti transfer.');

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('bukti_transfer', file);

      await axios.post(`https://reusemart.site/api/checkout/${orderId}/upload-bukti`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Upload berhasil! Pesanan Anda akan segera diproses.');
      navigate(`/konfirmasi-pesanan/${orderId}`);
    } catch (error) {
      alert('Upload gagal: ' + (error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow mt-20">
      <h2 className="mb-4 font-semibold">Pembayaran</h2>
      <p>
        Nomor Rekening ReuseMart: <strong>1234567890 (Bank ABC)</strong>
      </p>
      <p className="mb-4">Silakan transfer dan upload bukti pembayaran di bawah.</p>
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <button
        disabled={uploading}
        onClick={handleSubmit}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {uploading ? 'Mengupload...' : 'Upload Bukti Pembayaran'}
      </button>
      <p className="mt-4 text-red-600">Waktu tersisa: {timer} detik</p>
    </div>
  );
}
