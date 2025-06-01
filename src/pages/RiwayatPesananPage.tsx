import { useEffect, useState } from 'react';
import { CheckCircleIcon, XCircleIcon, ClockIcon, XIcon } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import Header from '../components/Header'; // import Header
import Footer from '../components/Footer';

// --- API Functions ---
const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

interface PesananItem {
  id: number;
  nama_produk: string;
  jumlah: number;
  harga_satuan: number;
  subtotal: number;
}

export interface Pesanan {
  id: number;
  kode: string;
  tanggal?: string;
  status?: string;
  total?: number;
  ongkos_kirim?: number;
  item_count: number;
  alamat_pengiriman?: string;
  metode_pembayaran?: string;
  bukti_transfer?: string; // New entity
  tanggal_ambil_kirim?: string; // New entity
  tanggal_lunas_pembelian?: string; // New entity
  delivery_method?: string; // New entity
  poin_didapat?: number; // New entity
  poin_potongan?: number; // New entity
  status_bukti_transfer?: string; // New entity
  items?: PesananItem[];
}

export const fetchRiwayatPesanan = async (token: string): Promise<Pesanan[]> => {
  try {
    const response = await api.get('/pesanan', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (response.data.success && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Gagal mengambil data riwayat pesanan');
  } catch (error: any) {
    console.error('Error fetching riwayat pesanan:', error);
    if (error.response) {
      throw new Error(
        error.response.data?.message || error.response.statusText || 'Terjadi kesalahan server',
      );
    } else if (error.request) {
      throw new Error('Tidak ada respon dari server');
    } else {
      throw new Error(error.message || 'Terjadi kesalahan saat memuat data');
    }
  }
};

export const fetchPesananDetail = async (token: string, id: number): Promise<Pesanan> => {
  try {
    const response = await api.get(`/pesanan/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || `Gagal mengambil detail pesanan #${id}`);
  } catch (error: any) {
    console.error(`Error fetching pesanan detail for ID ${id}:`, error);
    if (error.response) {
      throw new Error(
        error.response.data?.message || error.response.statusText || 'Terjadi kesalahan server',
      );
    } else if (error.request) {
      throw new Error('Tidak ada respon dari server');
    } else {
      throw new Error(error.message || 'Terjadi kesalahan saat memuat detail data');
    }
  }
};

// --- PesananDetailModal Component ---
interface PesananDetailModalProps {
  pesananId: number | null;
  onClose: () => void;
}

const PesananDetailModal: React.FC<PesananDetailModalProps> = ({ pesananId, onClose }) => {
  const [pesananDetail, setPesananDetail] = useState<Pesanan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan saat memuat detail pesanan');
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [pesananId]);

  if (pesananId === null) return null;

  // Helper to format dates
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch (e) {
      return dateString; // Return original if invalid date
    }
  };

  const truncateString = (str: string, maxLength: number = 15) => {
    if (!str) return '';
    if (str.length <= maxLength) return str;
    const start = str.substring(0, Math.floor(maxLength / 2));
    const end = str.substring(str.length - Math.floor(maxLength / 2));
    return `${start}...${end}`;
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
            {' '}
            {/* Increased space-y for better separation of sections */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Kode Pesanan:</p>
                <p className="font-semibold text-lg text-[#1E2B32]">#{pesananDetail.kode}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tanggal Pesanan:</p>
                <p className="font-semibold text-lg text-[#1E2B32]">
                  {pesananDetail.tanggal ? formatDate(pesananDetail.tanggal) : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status:</p>
                <p
                  className={`font-semibold text-lg ${
                    getStatusStyle(pesananDetail.status ?? '').color
                  }`}
                >
                  {pesananDetail.status ?? '-'}
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
            {/* Section for Delivery Information */}
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
            {/* Section for Payment Status and Points */}
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
                        {truncateString(pesananDetail.bukti_transfer)}
                      </p>
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
            {pesananDetail.items && pesananDetail.items.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-[#1E2B32] mb-3">Item Pesanan</h3>
                <div className="space-y-3">
                  {pesananDetail.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center bg-gray-50 p-3 rounded-md"
                    >
                      <div>
                        <p className="font-medium text-[#1E2B32]">{item.nama_produk}</p>
                        <p className="text-sm text-gray-600">
                          {item.jumlah} x Rp{' '}
                          {typeof item.harga_satuan === 'number'
                            ? item.harga_satuan.toLocaleString('id-ID')
                            : '-'}
                        </p>
                      </div>
                      <p className="font-semibold text-[#5B8482]">
                        Rp{' '}
                        {typeof item.subtotal === 'number'
                          ? item.subtotal.toLocaleString('id-ID')
                          : '-'}
                      </p>
                    </div>
                  ))}
                </div>
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

// Helper function for status styling (moved outside component for reusability)
const getStatusStyle = (status?: string) => {
  if (!status) {
    return {
      color: 'text-gray-700',
      bg: 'bg-gray-50',
      border: 'border-gray-300',
      icon: null,
    };
  }

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

// --- RiwayatPesananPage Component ---
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
              const style = getStatusStyle(p.status);
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
                      <span className="text-sm font-medium">{p.status}</span>
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

      {/* Pesanan Detail Modal */}
      {showDetailModal && (
        <PesananDetailModal pesananId={selectedPesananId} onClose={handleCloseDetailModal} />
      )}
      <Footer />
    </div>
  );
}
