import { useEffect, useState } from 'react';
import { CheckCircleIcon, XCircleIcon, ClockIcon, XIcon, StarIcon, UploadIcon } from 'lucide-react';

import Header from '../components/Header';
import Footer from '../components/Footer';

import type { Pesanan, PesananItem } from '../api/apiRiwayatPembelian';
import { submitRatingBarang } from '../api/apiRiwayatPembelian';

// Supaya bisa akses submitRatingBarang di console (opsional)
(window as any).submitRatingBarang = submitRatingBarang;

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Helper style status pesanan
const getStatusStyle = (status_transaksi?: string) => {
  if (!status_transaksi) {
    return {
      color: 'text-gray-700',
      bg: 'bg-gray-50',
      border: 'border-gray-300',
      icon: null,
    };
  }

  switch (status_transaksi.toLowerCase()) {
    case 'selesai':
      return {
        color: 'text-green-700',
        bg: 'bg-green-50',
        border: 'border-green-300',
        icon: <CheckCircleIcon className="w-5 h-5 text-green-600" />,
      };
    case 'dibatalkan':
      return {
        color: 'text-red-700',
        bg: 'bg-red-50',
        border: 'border-red-300',
        icon: <XCircleIcon className="w-5 h-5 text-red-600" />,
      };
    case 'transaksi selesai':
      return {
        color: 'text-green-700',
        bg: 'bg-green-50',
        border: 'border-green-300',
        icon: <CheckCircleIcon className="w-5 h-5 text-green-600" />,
      };
    case 'dibatalkan pembeli':
      return {
        color: 'text-red-700',
        bg: 'bg-red-50',
        border: 'border-red-300',
        icon: <XCircleIcon className="w-5 h-5 text-red-600" />,
      };
    default:
      return {
        color: 'text-yellow-700',
        bg: 'bg-yellow-50',
        border: 'border-yellow-300',
        icon: <ClockIcon className="w-5 h-5 text-yellow-600" />,
      };
  }
};

// --- PesananDetailModal with cancelation handling ---
interface PesananDetailModalProps {
  pesananId: number | null;
  onClose: () => void;
  onStatusChange: (id: number, newStatus: string) => void;
}

const PesananDetailModal: React.FC<PesananDetailModalProps> = ({
  pesananId,
  onClose,
  onStatusChange,
}) => {
  const [pesananDetail, setPesananDetail] = useState<Pesanan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [ratings, setRatings] = useState<Record<number, number>>({});

  useEffect(() => {
    console.log('Detail Pesanan:', pesananDetail);
    console.log('Status:', pesananDetail?.status_transaksi);
  }, [pesananDetail]);

  const calculateRemainingTime = (createdAt: string): number => {
    const createdTime = new Date(createdAt).getTime();
    const now = new Date().getTime();
    const elapsedSeconds = Math.floor((now - createdTime) / 1000);
    return Math.max(60 - elapsedSeconds, 0);
  };

  const handleCancelPesanan = async (pesananId: number, totalTransaksi: number) => {
    const poin = Math.floor(totalTransaksi / 10000); // Convert to reward points
    const confirmed = window.confirm(
      `Apakah Anda yakin akan membatalkan transaksi ini, dengan total transaksi Rp.${totalTransaksi} dan dikonversi menjadi poin reward sebanyak ${poin} poin?`,
    );

    if (confirmed) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/checkout/${pesananId}/batal`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          alert('Transaksi berhasil dibatalkan!');
          // Update the status locally
          setPesananDetail((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              status_transaksi: 'dibatalkan pembeli',
            };
          });
        } else {
          alert('Gagal membatalkan transaksi.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  useEffect(() => {
    if (pesananId === null) {
      setPesananDetail(null);
      setLoading(false);
      setError(null);
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
      return;
    }

    const loadDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getToken();
        if (!token) {
          setError('Anda belum login. Silakan login untuk melihat detail pesanan.');
          setLoading(false);
          return;
        }

        const response = await fetch(`http://127.0.0.1:8000/api/pesanan/${pesananId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        const json = await response.json();
        if (!json.success) throw new Error(json.message || 'Gagal mengambil detail pesanan');
        const raw = json.data;

        let items: PesananItem[] = [];
        if (Array.isArray(raw.detail_transaksi) && raw.detail_transaksi.length > 0) {
          items = raw.detail_transaksi.map((detail: any) => ({
            id: detail.ID_BARANG,
            nama_produk: detail.barang?.NAMA_BARANG || '-',
            jumlah: detail.JUMLAH,
            harga_satuan: detail.HARGA_SATUAN,
            subtotal: detail.JUMLAH * detail.HARGA_SATUAN,
          }));
        } else if (raw.barang) {
          items = [
            {
              id: raw.barang.id,
              nama_produk: raw.barang.nama,
              jumlah: 1,
              harga_satuan: raw.barang.harga,
              subtotal: raw.barang.harga,
            },
          ];
        }

        const mappedPesanan: Pesanan = {
          id: raw.id,
          kode: raw.kode,
          tanggal: raw.tgl_pesan_pembelian,
          status_transaksi: raw.status_transaksi,
          total: raw.total_bayar,
          item_count: items.length,
          alamat_pengiriman: raw.alamat_pengiriman ?? undefined,
          metode_pembayaran: raw.metode_pembayaran ?? undefined,
          bukti_transfer: raw.bukti_transfer ?? undefined,
          tanggal_lunas_pembelian: raw.tgl_lunas ?? undefined,
          delivery_method: raw.delivery_method ?? undefined,
          poin_didapat: raw.poin_didapat ?? undefined,
          poin_potongan: raw.poin_potongan ?? undefined,
          status_bukti_transfer: raw.status_bukti_transfer ?? undefined,
          items,
        };

        setPesananDetail(mappedPesanan);

        const initialRatings: Record<number, number> = {};
        items.forEach((item) => {
          initialRatings[item.id] = 0;
        });
        setRatings(initialRatings);
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan saat memuat detail pesanan');
      } finally {
        setLoading(false);
      }
    };

    loadDetail();

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [pesananId]);

  if (pesananId === null) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
          aria-label="Close"
        >
          <XIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-[#1E2B32] mb-6 border-b pb-3">Detail Pesanan</h2>

        {loading ? (
          <div className="text-center text-lg font-medium text-[#2D4C41] py-12">
            Memuat detail pesanan...
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded text-center font-medium">
            {error}
          </div>
        ) : pesananDetail ? (
          <div className="space-y-6">
            {/* Informasi Utama */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Kode Pesanan:</p>
                <p className="font-semibold text-lg text-[#1E2B32]">#{pesananDetail.kode}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tanggal Pesanan:</p>
                <p className="font-semibold text-lg text-[#1E2B32]">
                  {new Date(pesananDetail.tanggal).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status:</p>
                <p
                  className={`font-semibold text-lg ${
                    getStatusStyle(pesananDetail.status_transaksi).color
                  }`}
                >
                  {pesananDetail.status_transaksi ?? '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Harga:</p>
                <p className="font-semibold text-lg text-[#5B8482]">
                  Rp {pesananDetail.total.toLocaleString('id-ID')}
                </p>
              </div>
            </div>

            {/* Cancel Button for "disiapkan" */}
            {pesananDetail.status_transaksi === 'Diproses' && (
              <button
                onClick={() => handleCancelPesanan(pesananDetail.id, pesananDetail.total)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              >
                Batalkan Pesanan
              </button>
            )}

            {/* Other Details and Item List */}
            {/* Add the rest of your content, similar to what was previously done */}
          </div>
        ) : (
          <div className="bg-yellow-100 text-yellow-700 border border-yellow-400 px-4 py-3 rounded text-center font-medium">
            Detail pesanan tidak ditemukan.
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main Component: RiwayatPesananPageResponsi ---
// Display only orders with status "diproses"
export default function RiwayatPesananPageResponsi() {
  const [pesanan, setPesanan] = useState<Pesanan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedPesananId, setSelectedPesananId] = useState<number | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = getToken();
        if (!token) {
          setError('Anda belum login. Silakan login untuk melihat riwayat pesanan.');
          setLoading(false);
          return;
        }
        const response = await fetch(`http://127.0.0.1:8000/api/pesanan`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        const json = await response.json();
        if (!json.success) throw new Error(json.message || 'Gagal mengambil data riwayat pesanan');

        // Filter to show only "diproses" orders
        const filteredPesanan = json.data.filter(
          (order: any) =>
            order.status_transaksi === 'Diproses' || order.status_transaksi === 'Dibatalkan Pembeli',
        );

        setPesanan(filteredPesanan);
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan saat memuat data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLihatDetail = (id: number) => {
    setSelectedPesananId(id);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setSelectedPesananId(null);
    setShowDetailModal(false);
  };

  return (
    <div className="bg-[#FFF7E2] min-h-screen text-[#1E2B32] font-sans">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-bold mb-8 text-[#1E2B32]">Riwayat Pesanan</h1>

        {loading ? (
          <div className="text-center text-lg font-medium text-[#2D4C41] py-24">
            Memuat data pesanan...
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded text-center font-medium">
            {error}
          </div>
        ) : pesanan.length === 0 ? (
          <div className="bg-yellow-100 text-yellow-700 border border-yellow-400 px-4 py-3 rounded text-center font-medium">
            Belum ada riwayat pesanan.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pesanan.map((p) => {
              const style = getStatusStyle(p.status_transaksi);
              return (
                <div
                  key={p.id}
                  className={`flex flex-col justify-between bg-white border ${style.border} rounded-xl shadow hover:shadow-lg transition-all duration-300 p-6 space-y-4`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-[#1E2B32] mb-1">
                        Pesanan <span className="text-[#5B8482]">#{p.kode}</span>
                      </h3>
                      <p className="text-sm text-gray-600">
                        Tanggal:{' '}
                        {p.tanggal
                          ? new Date(p.tanggal).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })
                          : '-'}
                      </p>
                      <p className="text-sm text-gray-600">Total Item: {p.item_count}</p>
                      <p className="text-sm text-[#1E2B32] font-semibold mt-1">
                        Total Harga:{' '}
                        {typeof p.total === 'number'
                          ? `Rp ${p.total.toLocaleString('id-ID')}`
                          : '-'}
                      </p>
                    </div>
                    <div
                      className={`flex items-center gap-2 px-3 py-1 rounded-full border ${style.bg} ${style.color}`}
                    >
                      {style.icon}
                      <span className="text-sm font-medium">{p.status_transaksi}</span>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleLihatDetail(p.id)}
                      className="text-sm px-4 py-2 rounded-md border border-[#5B8482] text-[#5B8482] hover:bg-[#E6F0EE] transition"
                    >
                      Lihat Detail
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {showDetailModal && (
        <PesananDetailModal
          pesananId={selectedPesananId}
          onClose={handleCloseDetailModal}
          onStatusChange={(id, newStatus) => {
            setPesanan(
              pesanan.map((p) => (p.id === id ? { ...p, status_transaksi: newStatus } : p)),
            );
          }}
        />
      )}
      <Footer />
    </div>
  );
}
