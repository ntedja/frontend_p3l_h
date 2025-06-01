import { useEffect, useState } from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  XIcon,
  StarIcon,
} from 'lucide-react';

import type { Pesanan, PesananItem } from '../api/apiRiwayatPembelian';
import {
  fetchRiwayatPesanan,
  fetchPesananDetail,
  submitRatingBarang,
} from '../api/apiRiwayatPembelian';

// Supaya kita bisa memanggil fetchPesananDetail di console (opsional)
;(window as any).fetchPesananDetail = fetchPesananDetail;

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// === Komponen PesananDetailModal ===
interface PesananDetailModalProps {
  pesananId: number | null;
  onClose: () => void;
}

const PesananDetailModal: React.FC<PesananDetailModalProps> = ({
  pesananId,
  onClose,
}) => {
  const [pesananDetail, setPesananDetail] = useState<Pesanan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // **Tambahkan state untuk menyimpan rating tiap item (item.id → rating)**
  const [ratings, setRatings] = useState<Record<number, number>>({});

  useEffect(() => {
    if (pesananId === null) {
      setPesananDetail(null);
      setLoading(false);
      setError(null);
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
        const data = await fetchPesananDetail(token, pesananId);
        setPesananDetail(data);

        // Inisialisasi ratings kosong untuk setiap item.id
        const initialRatings: Record<number, number> = {};
        data.items.forEach((item) => {
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
  }, [pesananId]);

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

  /**
   * Fungsi untuk merender satu bintang: jika `filled=true` maka beri atribut `fill="currentColor"`
   * sehingga ikon StarIcon akan tampil filled. Jika `filled=false`, tampilkan outline saja.
   */
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

        <h2 className="text-2xl font-bold text-[#1E2B32] mb-6 border-b pb-3">
          Detail Pesanan
        </h2>

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
            {/* --- Informasi Utama Pesanan --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Kode Pesanan:</p>
                <p className="font-semibold text-lg text-[#1E2B32]">
                  #{pesananDetail.kode}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tanggal Pesanan:</p>
                <p className="font-semibold text-lg text-[#1E2B32]">
                  {formatDate(pesananDetail.tanggal)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status:</p>
                <p
                  className={`font-semibold text-lg ${
                    getStatusStyle(pesananDetail.status_transaksi).color
                  }`}
                >
                  {pesananDetail.status_transaksi}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Harga:</p>
                <p className="font-semibold text-lg text-[#5B8482]">
                  Rp {pesananDetail.total.toLocaleString('id-ID')}
                </p>
              </div>
            </div>

            {/* --- Informasi Pengiriman & Pembayaran --- */}
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
                      <p className="font-medium text-[#1E2B32]">
                        {pesananDetail.delivery_method}
                      </p>
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

            {/* --- Status Pembayaran & Poin --- */}
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
                      <p className="font-medium text-[#1E2B32]">
                        {pesananDetail.bukti_transfer}
                      </p>
                    </div>
                  )}
                  {pesananDetail.status_bukti_transfer && (
                    <div>
                      <p className="text-sm text-gray-600">
                        Status Bukti Transfer:
                      </p>
                      <p className="font-medium text-[#1E2B32]">
                        {pesananDetail.status_bukti_transfer}
                      </p>
                    </div>
                  )}
                  {pesananDetail.tanggal_lunas_pembelian && (
                    <div>
                      <p className="text-sm text-gray-600">
                        Tanggal Lunas Pembelian:
                      </p>
                      <p className="font-medium text-[#1E2B32]">
                        {formatDate(pesananDetail.tanggal_lunas_pembelian)}
                      </p>
                    </div>
                  )}
                  {pesananDetail.poin_didapat !== undefined && (
                    <div>
                      <p className="text-sm text-gray-600">Poin Didapat:</p>
                      <p className="font-medium text-[#1E2B32]">
                        {pesananDetail.poin_didapat}
                      </p>
                    </div>
                  )}
                  {pesananDetail.poin_potongan !== undefined && (
                    <div>
                      <p className="text-sm text-gray-600">Poin Potongan:</p>
                      <p className="font-medium text-[#1E2B32]">
                        {pesananDetail.poin_potongan}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* --- Daftar Item Pesanan + Rating --- */}
            {pesananDetail.items.length > 0 ? (
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-[#1E2B32] mb-3">
                  Item Pesanan
                </h3>
                <div className="space-y-4">
                  {pesananDetail.items.map((item: PesananItem) => {
                    // Ambil rating yang sudah disimpan di state (jika belum ada, default = 0)
                    const currentRating = ratings[item.id] || 0;

                    return (
                      <div
                        key={item.id}
                        className="flex justify-between items-start bg-gray-50 p-4 rounded-md"
                      >
                        <div>
                          <p className="font-medium text-[#1E2B32]">
                            {item.nama_produk}
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.jumlah} x Rp{' '}
                            {item.harga_satuan.toLocaleString('id-ID')}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <p className="font-semibold text-[#5B8482]">
                            Rp {item.subtotal.toLocaleString('id-ID')}
                          </p>

                          {/* Tombol bintang untuk rating */}
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => {
                              // Jika star <= currentRating → tampilkan “filled”, else outline
                              const filled = star <= currentRating;
                              return (
                                <button
                                  key={star}
                                  onClick={async () => {
                                    // 1) Submit ke server
                                    await submitRatingBarang(item.id, star);
                                    // 2) Save ke state lokal agar bintang terisi
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
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="border-t pt-4">
                <p className="text-center text-gray-600">
                  Tidak ada barang untuk dinilai.
                </p>
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

/** Style helper untuk status pesanan */
const getStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
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
    default:
      return {
        color: 'text-yellow-700',
        bg: 'bg-yellow-50',
        border: 'border-yellow-300',
        icon: <ClockIcon className="w-5 h-5 text-yellow-600" />,
      };
  }
};

// === Komponen Utama: RiwayatPesananPage ===
export default function RiwayatPesananPage() {
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
        const data = await fetchRiwayatPesanan(token);
        setPesanan(data);
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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-bold mb-8 text-[#1E2B32]">
          Riwayat Pesanan
        </h1>

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
                        {new Date(p.tanggal).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-sm text-gray-600">Total Item: {p.item_count}</p>
                      <p className="text-sm text-[#1E2B32] font-semibold mt-1">
                        Total Harga: Rp {p.total.toLocaleString('id-ID')}
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
        />
      )}
    </div>
  );
}