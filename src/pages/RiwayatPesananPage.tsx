import { useState, useEffect } from 'react';
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
    case 'hangus':
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

// --- PesananDetailModal dengan fetch lokal ---
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

  // Fungsi untuk menghitung waktu tersisa
  const calculateRemainingTime = (createdAt: string): number => {
    const createdTime = new Date(createdAt).getTime();
    const now = new Date().getTime();
    const elapsedSeconds = Math.floor((now - createdTime) / 1000);
    return Math.max(60 - elapsedSeconds, 0);
  };

  // Fungsi untuk memeriksa apakah pesanan sudah hangus
  const checkIfExpired = (createdAt: string): boolean => {
    return calculateRemainingTime(createdAt) <= 0;
  };

  // Fungsi untuk mengupload bukti pembayaran
  const handleUploadBukti = async () => {
    if (!file || !pesananDetail) return;

    setUploading(true);
    try {
      const token = getToken();
      if (!token) {
        setError('Anda belum login. Silakan login untuk mengupload bukti pembayaran.');
        return;
      }

      const formData = new FormData();
      formData.append('bukti_transfer', file);

      const response = await fetch(
        `https://reusemart.site/api/checkout/${pesananDetail.id}/upload-bukti`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const json = await response.json();

      // First check if the response is successful
      if (!response.ok) {
        throw new Error(json.message || 'Gagal mengupload bukti pembayaran');
      }

      // Update status pesanan - handle different response structures
      const updatedPesanan = {
        ...pesananDetail,
        status_bukti_transfer: 'Menunggu Verifikasi',
        bukti_transfer: json.bukti_transfer || json.data?.bukti_transfer || 'Bukti terupload',
      };

      setPesananDetail(updatedPesanan);
      alert('Bukti pembayaran berhasil diupload!');
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mengupload bukti pembayaran');
    } finally {
      setUploading(false);
    }
  };

  // Fetch pesanan detail secara lokal (kode kedua)
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

        const response = await fetch(`https://reusemart.site/api/pesanan/${pesananId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        const json = await response.json();
        if (!json.success) throw new Error(json.message || 'Gagal mengambil detail pesanan');
        const raw = json.data;

        // Mapping data sesuai kode lokal
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
          // tanggal_ambil_kirim: raw.tgl_ambil_kirim ?? undefined,
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

        // Set timer jika status masih menunggu pembayaran
        if (
          mappedPesanan.status_transaksi?.toLowerCase() === 'menunggu pembayaran' &&
          raw.tanggal_pesan
        ) {
          const remaining = calculateRemainingTime(raw.tanggal_pesan);
          setRemainingTime(remaining);

          // Jika waktu sudah habis, update status
          if (remaining <= 0) {
            await updateStatusToExpired(mappedPesanan.id);
          } else {
            // Mulai timer
            const interval = setInterval(async () => {
              setRemainingTime((prev) => {
                if (prev === null) return null;
                const newTime = prev - 1;

                // Jika waktu habis, update status
                if (newTime <= 0) {
                  updateStatusToExpired(mappedPesanan.id);
                  clearInterval(interval);
                  return 0;
                }

                return newTime;
              });
            }, 1000);

            setTimerInterval(interval);
          }
        }
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan saat memuat detail pesanan');
      } finally {
        setLoading(false);
      }
    };

    const updateStatusToExpired = async (id: number) => {
      try {
        const token = getToken();
        if (!token) return;

        const response = await fetch(`https://reusemart.site/api/checkout/${id}/batal`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const json = await response.json();
        if (json.success) {
          setPesananDetail((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              status_transaksi: 'Hangus',
            };
          });
          onStatusChange(id, 'Hangus');
        }
      } catch (err) {
        console.error('Gagal mengupdate status pesanan:', err);
      }
    };

    loadDetail();

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [pesananId, onStatusChange]);

  if (pesananId === null) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const truncateString = (str: string, maxLength = 15) => {
    if (!str) return '';
    if (str.length <= maxLength) return str;
    const start = str.substring(0, Math.floor(maxLength / 2));
    const end = str.substring(str.length - Math.floor(maxLength / 2));
    return `${start}...${end}`;
  };

  const renderStar = (filled: boolean) => {
    return filled ? (
      <StarIcon className="w-5 h-5 text-yellow-500" fill="currentColor" />
    ) : (
      <StarIcon className="w-5 h-5 text-gray-300" />
    );
  };

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
                  {formatDate(pesananDetail.tanggal)} {formatTime(pesananDetail.tanggal)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status:</p>
                <p
                  className={`font-semibold text-lg ${
                    getStatusStyle(pesananDetail.status_transaksi ?? '').color
                  }`}
                >
                  {pesananDetail.status_transaksi ?? '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Harga:</p>
                <p className="font-semibold text-lg text-[#5B8482]">
                  Rp{' '}
                  {typeof pesananDetail.total === 'number' && !isNaN(pesananDetail.total)
                    ? pesananDetail.total.toLocaleString('id-ID')
                    : '-'}
                </p>
              </div>
            </div>

            {/* Timer untuk pesanan yang belum dibayar */}
            {pesananDetail.status_transaksi?.toLowerCase() === 'menunggu pembayaran' && (
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
                <div className="flex items-center justify-between">
                  <p className="text-yellow-800 font-medium">
                    Sisa waktu untuk upload bukti pembayaran:
                  </p>
                  <p className="text-red-600 font-bold">
                    {remainingTime !== null ? `${remainingTime} detik` : 'Menghitung...'}
                  </p>
                </div>
                {remainingTime !== null && remainingTime <= 30 && (
                  <p className="text-red-600 text-sm mt-1">
                    Segera upload bukti pembayaran sebelum waktu habis!
                  </p>
                )}
              </div>
            )}

            {/* Form upload bukti pembayaran */}
            {pesananDetail.status_transaksi?.toLowerCase() === 'menunggu pembayaran' && (
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-[#1E2B32] mb-3">
                  Upload Bukti Pembayaran
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Nomor Rekening:</p>
                    <p className="font-medium">1234567890 (Bank ABC - ReuseMart)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pilih File Bukti Transfer
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-[#5B8482] file:text-white
                        hover:file:bg-[#48635B]"
                    />
                    {file && (
                      <p className="mt-1 text-sm text-gray-600">File terpilih: {file.name}</p>
                    )}
                  </div>

                  <button
                    onClick={handleUploadBukti}
                    disabled={!file || uploading}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white ${
                      !file || uploading ? 'bg-gray-400' : 'bg-[#5B8482] hover:bg-[#48635B]'
                    } transition-colors`}
                  >
                    <UploadIcon className="w-5 h-5" />
                    {uploading ? 'Mengupload...' : 'Upload Bukti Pembayaran'}
                  </button>
                </div>
              </div>
            )}

            {/* Pengiriman & Pembayaran */}
            {(pesananDetail.alamat_pengiriman ||
              pesananDetail.metode_pembayaran ||
              pesananDetail.delivery_method ||
              pesananDetail.tanggal_ambil_kirim) && (
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-[#1E2B32] mb-3">
                  Informasi Pengiriman & Pembayaran
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pesananDetail.alamat_pengiriman && (
                    <div>
                      <p className="text-sm text-gray-600">Alamat Pengiriman:</p>
                      <p className="font-medium text-[#1E2B32]">
                        {pesananDetail.alamat_pengiriman}
                      </p>
                    </div>
                  )}
                  {pesananDetail.metode_pembayaran && (
                    <div>
                      <p className="text-sm text-gray-600">Metode Pembayaran:</p>
                      <p className="font-medium text-[#1E2B32]">
                        {pesananDetail.metode_pembayaran}
                      </p>
                    </div>
                  )}
                  {pesananDetail.delivery_method && (
                    <div>
                      <p className="text-sm text-gray-600">Metode Pengiriman:</p>
                      <p className="font-medium text-[#1E2B32]">{pesananDetail.delivery_method}</p>
                    </div>
                  )}
                  {pesananDetail.tanggal_ambil_kirim && (
                    <div>
                      <p className="text-sm text-gray-600">Tanggal Ambil/Kirim:</p>
                      <p className="font-medium text-[#1E2B32]">
                        {formatDate(pesananDetail.tanggal_ambil_kirim)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Status Pembayaran & Poin */}
            {(pesananDetail.bukti_transfer ||
              pesananDetail.status_bukti_transfer ||
              pesananDetail.tanggal_lunas_pembelian ||
              pesananDetail.poin_didapat !== undefined ||
              pesananDetail.poin_potongan !== undefined) && (
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-[#1E2B32] mb-3">
                  Status Pembayaran & Poin
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pesananDetail.bukti_transfer && (
                    <div>
                      <p className="text-sm text-gray-600">Bukti Transfer:</p>
                      {pesananDetail.bukti_transfer.startsWith('http') ? (
                        <a
                          href={pesananDetail.bukti_transfer}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Lihat Bukti Transfer
                        </a>
                      ) : (
                        <p className="font-medium text-[#1E2B32]">
                          {truncateString(pesananDetail.bukti_transfer)}
                        </p>
                      )}
                    </div>
                  )}
                  {pesananDetail.status_bukti_transfer && (
                    <div>
                      <p className="text-sm text-gray-600">Status Bukti Transfer:</p>
                      <p className="font-medium text-[#1E2B32]">
                        {pesananDetail.status_bukti_transfer}
                      </p>
                    </div>
                  )}
                  {pesananDetail.tanggal_lunas_pembelian && (
                    <div>
                      <p className="text-sm text-gray-600">Tanggal Lunas Pembelian:</p>
                      <p className="font-medium text-[#1E2B32]">
                        {formatDate(pesananDetail.tanggal_lunas_pembelian)}
                      </p>
                    </div>
                  )}
                  {pesananDetail.poin_didapat !== undefined && (
                    <div>
                      <p className="text-sm text-gray-600">Poin Didapat:</p>
                      <p className="font-medium text-[#1E2B32]">{pesananDetail.poin_didapat}</p>
                    </div>
                  )}
                  {pesananDetail.poin_potongan !== undefined && (
                    <div>
                      <p className="text-sm text-gray-600">Poin Potongan:</p>
                      <p className="font-medium text-[#1E2B32]">{pesananDetail.poin_potongan}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Daftar Item + Rating */}
            {pesananDetail.items && pesananDetail.items.length > 0 ? (
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-[#1E2B32] mb-3">Item Pesanan</h3>
                <div className="space-y-4">
                  {pesananDetail.items.map((item: PesananItem) => {
                    const currentRating = ratings[item.id] || 0;

                    return (
                      <div
                        key={item.id}
                        className="flex justify-between items-start bg-gray-50 p-4 rounded-md"
                      >
                        <div>
                          <p className="font-medium text-[#1E2B32]">{item.nama_produk}</p>
                          <p className="text-sm text-gray-600">
                            {item.jumlah} x Rp {item.harga_satuan.toLocaleString('id-ID')}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <p className="font-semibold text-[#5B8482]">
                            Rp {item.subtotal.toLocaleString('id-ID')}
                          </p>

                          {/* Tombol rating bintang */}
                          {pesananDetail.status_transaksi?.toLowerCase() === 'selesai' && (
                            <div className="flex items-center space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => {
                                const filled = star <= currentRating;
                                return (
                                  <button
                                    key={star}
                                    onClick={async () => {
                                      await submitRatingBarang(item.id, star);
                                      setRatings((prev) => ({
                                        ...prev,
                                        [item.id]: star,
                                      }));
                                    }}
                                    className="focus:outline-none"
                                    title={`Beri ${star} bintang`}
                                  >
                                    {renderStar(filled)}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="border-t pt-4">
                <p className="text-center text-gray-600">Tidak ada barang untuk dinilai.</p>
              </div>
            )}
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

// --- Komponen Utama: RiwayatPesananPage ---
export default function RiwayatPesananPage() {
  useEffect(() => {
    document.title = 'Reusemart - Riwayat Pesanan';
    return () => {
      document.title = 'ReuseMart';
    };
  }, []);
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
        // Fetch riwayat pesanan secara lokal
        const response = await fetch(`https://reusemart.site/api/pesanan`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        const json = await response.json();
        if (!json.success) throw new Error(json.message || 'Gagal mengambil data riwayat pesanan');

        // Periksa apakah ada pesanan yang sudah melebihi waktu pembayaran
        const now = new Date();
        const updatedPesanan = json.data.map((p: any) => {
          if (p.status_transaksi === 'Menunggu Pembayaran' && p.tanggal_pesan) {
            const createdTime = new Date(p.tanggal_pesan).getTime();
            const elapsedSeconds = Math.floor((now.getTime() - createdTime) / 1000);
            if (elapsedSeconds > 60) {
              // Jika lebih dari 1 menit, update status menjadi Hangus
              return { ...p, status_transaksi: 'Hangus' };
            }
          }
          return p;
        });

        setPesanan(updatedPesanan);
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

  const handleStatusChange = (id: number, newStatus: string) => {
    setPesanan((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status_transaksi: newStatus } : p)),
    );
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
          onStatusChange={handleStatusChange}
        />
      )}
      <Footer />
    </div>
  );
}
