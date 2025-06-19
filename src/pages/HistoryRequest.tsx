import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  fetchTransaksiDonasi,
  updateTransaksiDonasi,
  deleteTransaksiDonasi,
} from '../api/apiRequestDonasi';
import type { TransaksiDonasi } from '../api/apiRequestDonasi';

export default function HistoryRequest() {
  const user = useState(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  })[0];

  const [transaksis, setTransaksis] = useState<TransaksiDonasi[]>([]);
  const [filteredTransaksis, setFilteredTransaksis] = useState<TransaksiDonasi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    DESKRIPSI_REQUEST: '',
    PENERIMA: '',
  });
  const [editingTransaksi, setEditingTransaksi] = useState<TransaksiDonasi | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const loadTransaksis = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(''); // Bersihkan error sebelumnya

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token tidak ditemukan. Silakan login kembali.');
      }

      // Pastikan user adalah organisasi dan memiliki ID_ORGANISASI
      // Asumsi user object dari localStorage memiliki ID_ORGANISASI jika rolenya organisasi
      if (!user || typeof user.ID_ORGANISASI === 'undefined') {
        setTransaksis([]);
        setFilteredTransaksis([]);
        throw new Error('Informasi organisasi tidak valid atau Anda tidak login sebagai organisasi.');
      }
      const loggedInOrgId = user.ID_ORGANISASI;

      const allTransactions = await fetchTransaksiDonasi(token);
      
      // Filter transaksi untuk organisasi yang sedang login
      const orgTransactions = allTransactions.filter(
        (transaksi) => transaksi.ID_ORGANISASI === loggedInOrgId
      );

      setTransaksis(orgTransactions);
      setFilteredTransaksis(orgTransactions); // Juga perbarui basis untuk filter pencarian
    } catch (error: any) {
      setTransaksis([]); // Kosongkan data jika terjadi error
      setFilteredTransaksis([]);
      setErrorMessage(error.message || 'Gagal memuat riwayat transaksi.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadTransaksis();
    }
  }, [user]);

  // Add this useEffect to filter transactions based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredTransaksis(transaksis);
    } else {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const filtered = transaksis.filter(
        (transaksi) =>
          transaksi.request?.barang?.NAMA_BARANG.toLowerCase().includes(lowercasedSearchTerm) ||
          formatDate(transaksi.TGL_DONASI).toLowerCase().includes(lowercasedSearchTerm) ||
          (transaksi.request?.DESKRIPSI_REQUEST || '').toLowerCase().includes(lowercasedSearchTerm) ||
          (transaksi.PENERIMA || '').toLowerCase().includes(lowercasedSearchTerm)
      );
      setFilteredTransaksis(filtered);
    }
  }, [searchTerm, transaksis]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token || !editingTransaksi) throw new Error('Data tidak valid');

      await updateTransaksiDonasi(
        editingTransaksi.ID_TRANSAKSI,
        {
          DESKRIPSI_REQUEST: formData.DESKRIPSI_REQUEST,
          PENERIMA: formData.PENERIMA,
        },
        token,
      );

      setIsModalOpen(false);
      setFormData({ DESKRIPSI_REQUEST: '', PENERIMA: '' });
      setEditingTransaksi(null);
      loadTransaksis();
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  const handleEdit = (transaksi: TransaksiDonasi) => {
    if (!transaksi.ID_TRANSAKSI) {
      setErrorMessage('Data transaksi tidak valid');
      return;
    }

    setEditingTransaksi(transaksi);
    setFormData({
      DESKRIPSI_REQUEST: transaksi.request?.DESKRIPSI_REQUEST || '',
      PENERIMA: transaksi.PENERIMA || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!id) {
      setErrorMessage('ID transaksi tidak valid');
      return;
    }

    if (window.confirm('Apakah Anda yakin ingin menghapus transaksi donasi ini?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token tidak ditemukan');

        await deleteTransaksiDonasi(id, token);
        loadTransaksis();
      } catch (error: any) {
        setErrorMessage(error.message);
      }
    }
  };

  const isPegawai = user?.JABATAN === 'Pegawai';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF7E2]">
        <Header />
        <div className="container mx-auto py-12 px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#48635B]"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-[#FFF7E2]">
        <Header />
        <div className="container mx-auto py-12 px-4">
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#FFF7E2] min-h-screen text-[#1E2B32]">
      <Header />
      <main className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8">
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h1 className="text-2xl font-bold">Riwayat Transaksi Donasi</h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Cari transaksi..."
                className="w-full border border-[#CFCAB5] bg-white text-[#2F3F3A] rounded-lg px-4 py-2.5 text-sm pl-10 focus:ring-2 focus:ring-[#48635B] focus:outline-none"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {filteredTransaksis.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-600">
                {searchTerm.trim() === ''
                  ? 'Belum ada riwayat transaksi donasi'
                  : `Tidak ditemukan transaksi yang cocok dengan "${searchTerm}"`}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-[#48635B]">
                    <tr>
                      {isPegawai && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          ID Transaksi
                        </th>
                      )}
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Nama Organisasi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Nama Barang
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Tanggal Donasi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Deskripsi Request
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Penerima
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTransaksis.map((transaksi) => {
                      const barang = transaksi.request?.barang || {
                        NAMA_BARANG: 'Barang tidak tersedia',
                        KATEGORI_BARANG: 'Tidak diketahui',
                        GAMBAR_BARANG: '/images/default.jpg',
                      };

                      return (
                        <motion.tr
                          key={transaksi.ID_TRANSAKSI}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="hover:bg-gray-50"
                        >
                          {isPegawai && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {transaksi.ID_TRANSAKSI}
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaksi.organisasi?.NAMA_ORGANISASI || 'Tidak diketahui'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900">
                                {barang.NAMA_BARANG}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(transaksi.TGL_DONASI)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {transaksi.request?.DESKRIPSI_REQUEST || 'Tidak diketahui'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaksi.PENERIMA || '-'}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.section>

        {/* Modal for Edit */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#FFF7E2] text-gray-900 rounded-lg p-6 w-full max-w-md shadow-lg">
              <h2 className="text-xl font-bold mb-4">Edit Transaksi Donasi</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Deskripsi Request
                  </label>
                  <textarea
                    name="DESKRIPSI_REQUEST"
                    value={formData.DESKRIPSI_REQUEST}
                    onChange={handleInputChange}
                    disabled={isPegawai}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                    maxLength={255}
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Penerima</label>
                  <input
                    type="text"
                    name="PENERIMA"
                    value={formData.PENERIMA}
                    onChange={handleInputChange}
                    className="py-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                    maxLength={255}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="mr-2 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-[#48635B] text-white px-4 py-2 rounded hover:bg-[#3a4f47]"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
