import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface Penitip {
  ID_PENITIP: number;
  NAMA_PENITIP: string;
  NO_KTP: string;
  ALAMAT_PENITIP: string;
  TGL_LAHIR_PENITIP: string;
  NO_TELP_PENITIP: string;
  EMAIL_PENITIP: string;
}

interface Diskusi {
  ID_DISKUSI: number;
  ID_BARANG: number;
  ID_PEMBELI: number;
  PERTANYAAN: string;
  JAWABAN: string | null;
  ID_PEGAWAI: number | null;
  CREATE_AT: string;
  pembeli?: {
    NAMA_PEMBELI: string;
  };
}

interface ProductDetail {
  ID_BARANG: number;
  ID_KATEGORI: number;
  NAMA_BARANG: string;
  KODE_BARANG: string;
  HARGA_BARANG: number;
  TGL_MASUK: string;
  TGL_KELUAR: string;
  TGL_AMBIL: string;
  GARANSI: string;
  BERAT: string;
  DESKRIPSI: string;
  RATING: number;
  STATUS_BARANG: string;
  FOTO_BARANG: string;
  foto_barang_url?: string;
  penitip?: Penitip;
  diskusis?: Diskusi[];
}

// ✅ Component
export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/produk/${id}`)
      .then((res) => {
        setProduct(res.data);
        setSelectedImage(res.data.foto_barang_url);
      })
      .catch((err) => {
        console.error('Failed to fetch product', err);
      });
  }, [id]);

  if (!product) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-10">
      <div className="flex flex-col md:flex-row gap-8">
        <div>
          <img
            src={selectedImage}
            alt={product.NAMA_BARANG}
            className="w-80 h-80 object-contain bg-gray-200 rounded"
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold">{product.NAMA_BARANG}</h1>
          <p className="text-xl mt-2 text-green-700">
            Rp{product.HARGA_BARANG.toLocaleString('id-ID')}
          </p>
          <div className="mt-2 text-sm text-gray-600 space-y-1">
            <p>
              <strong>Garansi:</strong> {product.GARANSI}
            </p>
            <p>
              <strong>Berat:</strong> {product.BERAT}
            </p>
            <p>
              <strong>Status:</strong> {product.STATUS_BARANG}
            </p>
            <p>
              <strong>Rating:</strong> {product.RATING}
            </p>
          </div>
          <p className="mt-4">{product.DESKRIPSI}</p>
          <div className="mt-4">
            <strong>Penitip:</strong> {product.penitip?.NAMA_PENITIP ?? 'Tidak diketahui'}
          </div>
        </div>
      </div>

      <div className="mt-10 border-t pt-4">
        <h2 className="text-2xl font-semibold mb-2">Diskusi</h2>
        {product.diskusis?.length ? (
          product.diskusis.map((d) => (
            <div key={d.ID_DISKUSI} className="mb-4 p-3 border rounded bg-white shadow-sm">
              <p>
                <strong>{d.pembeli?.NAMA_PEMBELI ?? 'Anonim'}:</strong> {d.PERTANYAAN}
              </p>
              {d.JAWABAN && <p className="ml-4 text-sm text-gray-600 mt-1">Jawaban: {d.JAWABAN}</p>}
            </div>
          ))
        ) : (
          <p className="text-gray-500">Belum ada diskusi mengenai produk ini.</p>
        )}
      </div>
    </div>
  );
}
