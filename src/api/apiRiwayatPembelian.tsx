// src/api/apiRiwayatPembelian.tsx

import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Jika token sudah ada di localStorage, attach ke header Authorization
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

/**
 * Struktur satu item barang di dalam pesanan (hasil mapping).
 */
export interface PesananItem {
  id: number; // ID_BARANG
  nama_produk: string; // NAMA_BARANG
  jumlah: number; // JUMLAH (default 1 apabila kita pakai dari `barang`)
  harga_satuan: number; // HARGA_SATUAN (dari raw.barang.harga)
  subtotal: number; // JUMLAH * HARGA_SATUAN
}

/**
 * Struktur Pesanan (setelah di‐map dari response backend).
 */
export interface Pesanan {
  id: number;
  kode: string;
  tanggal: string; // raw.tanggal (list) atau raw.tanggal_pesan (detail)
  status_transaksi: string; // raw.status_transaksi
  total: number; // raw.total (list) atau raw.total_bayar (detail)
  item_count: number; // panjang array items
  alamat_pengiriman?: string;
  metode_pembayaran?: string;
  bukti_transfer?: string;
  tanggal_ambil_kirim?: string; // raw.tgl_ambil_kirim
  tanggal_lunas_pembelian?: string; // raw.tgl_lunas
  delivery_method?: string;
  poin_didapat?: number;
  poin_potongan?: number;
  status_bukti_transfer?: string;
  items: PesananItem[]; // hasil mapping raw.detail_transaksi (atau raw.barang jika detail kosong)
}

/**
 * API: Ambil semua riwayat pesanan user (list view).
 * Meng‐map setiap entry dari API menjadi objek Pesanan (tanpa isi `items`).
 */
export const fetchRiwayatPesanan = async (token: string): Promise<Pesanan[]> => {
  try {
    const response = await api.get('/pesanan', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (response.data.success && Array.isArray(response.data.data)) {
      const rawList = response.data.data as any[];

      return rawList.map((raw) => ({
        id: raw.id,
        kode: raw.kode,
        tanggal: raw.tanggal, // di API list memang fieldnya `tanggal`
        status_transaksi: raw.status_transaksi,
        total: raw.total ?? 0,
        item_count: raw.item_count ?? 0,
        alamat_pengiriman: raw.alamat_pengiriman ?? undefined,
        metode_pembayaran: raw.metode_pembayaran ?? undefined,
        bukti_transfer: raw.bukti_transfer ?? undefined,
        tanggal_ambil_kirim: raw.tgl_ambil_kirim ?? undefined,
        tanggal_lunas_pembelian: raw.tgl_lunas ?? undefined,
        delivery_method: raw.delivery_method ?? undefined,
        poin_didapat: raw.poin_didapat ?? undefined,
        poin_potongan: raw.poin_potongan ?? undefined,
        status_bukti_transfer: raw.status_bukti_transfer ?? undefined,
        items: [], // di list view, kita kosongkan; nanti akan di‐fill saat 'detail' dipanggil
      }));
    }

    throw new Error(response.data.message || 'Gagal mengambil data riwayat pesanan');
  } catch (error: any) {
    console.error('Error fetchRiwayatPesanan:', error);
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

/**
 * API: Ambil detail satu pesanan berdasarkan ID, lalu mapping ke objek Pesanan (termasuk array items).
 * Khususnya: apabila raw.detail_transaksi kosong, tetapi ada raw.barang, kita buat 1 item dari raw.barang.
 */
export const fetchPesananDetail = async (token: string, id: number): Promise<Pesanan> => {
  try {
    const response = await api.get(`/pesanan/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (response.data.success && response.data.data) {
      const raw = response.data.data as any;

      // 1. Mapping raw.detail_transaksi → items[]
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
        // Jika detail_transaksi kosong, fallback: isi 1 item dari raw.barang
        // Kita anggap JUMLAH = 1 apabila memang API hanya mengirimkan 1 barang secara langsung.
        items = [
          {
            id: raw.barang.id,
            nama_produk: raw.barang.nama,
            jumlah: 1,
            harga_satuan: raw.barang.harga,
            subtotal: raw.barang.harga * 1,
          },
        ];
      }

      return {
        id: raw.id,
        kode: raw.kode,
        tanggal: raw.tanggal_pesan,
        status_transaksi: raw.status_transaksi,
        total: raw.total_bayar,
        item_count: items.length,
        alamat_pengiriman: raw.alamat_pengiriman ?? undefined,
        metode_pembayaran: raw.metode_pembayaran ?? undefined,
        bukti_transfer: raw.bukti_transfer ?? undefined,
        tanggal_ambil_kirim: raw.tgl_ambil_kirim ?? undefined,
        tanggal_lunas_pembelian: raw.tgl_lunas ?? undefined,
        delivery_method: raw.delivery_method ?? undefined,
        poin_didapat: raw.poin_didapat ?? undefined,
        poin_potongan: raw.poin_potongan ?? undefined,
        status_bukti_transfer: raw.status_bukti_transfer ?? undefined,
        items,
      };
    }

    throw new Error(response.data.message || `Gagal mengambil detail pesanan #${id}`);
  } catch (error: any) {
    console.error(`Error fetchPesananDetail (${id}):`, error);
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

/**
 * Kirim rating untuk satu barang (per‐barang).
 * Endpoint: POST /api/barang/{id}/rating  (middleware auth:sanctum)
 */
export const submitRatingBarang = async (barangId: number, rating: number) => {
  try {
    const tokenLocal = localStorage.getItem('token');
    if (!tokenLocal) {
      alert('Anda belum login. Silakan login untuk memberi rating.');
      return;
    }
    await api.post(
      `/barang/${barangId}/rating`,
      { rating },
      {
        headers: { Authorization: `Bearer ${tokenLocal}` },
      },
    );
    alert(`Rating ${rating} bintang untuk barang ID ${barangId} berhasil dikirim!`);
  } catch (err) {
    console.error('Gagal kirim rating barang:', err);
    alert('Gagal mengirim rating.');
  }
};

/**
 * API: Ambil rating rata‐rata dari seorang penitip (pemilik barang)
 * Contoh endpoint: GET /penitip/:penitipId/average-rating
 * Response yang diharapkan:
 * {
 *   "success": true,
 *   "data": { "average": 4.2 }
 * }
 */
export const fetchAverageRatingPenitip = async (penitipId: number): Promise<number> => {
  try {
    const response = await api.get(`/penitip/${penitipId}/average-rating`);
    if (response.data.success && response.data.data) {
      return response.data.data.average as number;
    }
    throw new Error('Gagal mengambil rata‐rata rating penitip');
  } catch (error: any) {
    console.error('Error fetchAverageRatingPenitip:', error);
    if (error.response) {
      throw new Error(
        error.response.data?.message || error.response.statusText || 'Terjadi kesalahan server',
      );
    } else if (error.request) {
      throw new Error('Tidak ada respon dari server');
    } else {
      throw new Error(error.message || 'Terjadi kesalahan tak terduga');
    }
  }
};
