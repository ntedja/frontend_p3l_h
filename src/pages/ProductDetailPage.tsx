// src/pages/ProductDetailPage.tsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';

type Product = {
  id: number;
  name: string;
  price: string;
  category: string;
  image: string;
  images: string[];
  garansi: string;
  berat: string;
  deskripsi: string;
  penitip_id: number;      // ID penitip numeric
  penitip_name: string;    // nama penitip
  penitip_since: string;   // timestamp bergabung
  penitip_rating: number;  // rata‐rata rating untuk *produk ini*
};

interface Diskusi {
  id: number;
  isi: string;
  jawaban?: string | null;
  created_at: string;
  pembeli: { nama: string };
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [showMore, setShowMore] = useState(false);
  const [diskusi, setDiskusi] = useState<Diskusi[]>([]);
  const [newDiskusi, setNewDiskusi] = useState('');
  const [showFormDiskusi, setShowFormDiskusi] = useState(false);
  const [inCart, setInCart] = useState(false);

  // State untuk rata‐rata rating semua produk milik penitip tersebut:
  const [avgPenitipRating, setAvgPenitipRating] = useState<number | null>(null);
  const [loadingAvg, setLoadingAvg] = useState<boolean>(true);
  const [errorAvg, setErrorAvg] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/produk/${id}`);
        // Kalau backend membungkus di data.data, gunakan itu; kalau tidak, pakai data langsung
        const raw = (res.data.data !== undefined ? res.data.data : res.data) as any;

        // Mapping ke tipe Product
        const mapped: Product = {
          id: raw.id,
          name: raw.name,
          price: raw.price,
          category: raw.category,
          image: raw.image,
          images: Array.isArray(raw.images) ? raw.images : [raw.image],
          garansi: raw.garansi ?? '-',
          berat: raw.berat ?? '-',
          deskripsi: raw.deskripsi ?? '',
          penitip_id: raw.penitip_id ?? raw.ID_PENITIP,
          penitip_name: raw.penitip_name ?? raw.PENITIP_NAMA,
          penitip_since: raw.penitip_since ?? raw.PENITIP_CREATED_AT,
          penitip_rating: raw.penitip_rating ?? raw.RATING_BARANG ?? 0,
        };

        setProduct(mapped);
        setSelectedImage(mapped.image);

        // Setelah produk di‐set, panggil hitung rata‐rata untuk penitip tersebut
        await computeAveragePenitip(mapped.penitip_id);
      } catch (err) {
        console.error('Gagal mengambil data produk', err);
      }
    };

    const fetchDiskusi = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/produk/${id}/diskusi`);
        const arr = Array.isArray(res.data) ? res.data : res.data.data;
        const diskusiData: Diskusi[] = arr.map((d: any) => ({
          id: d.ID_DISKUSI,
          isi: d.PERTANYAAN,
          jawaban: d.JAWABAN || null,
          created_at: d.CREATE_AT,
          pembeli: { nama: d.pembeli?.NAMA_PEMBELI || 'Pengguna' },
        }));
        setDiskusi(diskusiData);
      } catch (err) {
        console.error('Gagal mengambil data diskusi', err);
      }
    };

    // Cek cart di localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]') as Product[];
    if (cart.some((item) => item.id.toString() === id)) {
      setInCart(true);
    }

    fetchProduct();
    fetchDiskusi();
  }, [id]);

  // Menghitung rata‐rata semua produk milik penitipId
  const computeAveragePenitip = async (penitipId: number) => {
    try {
      setLoadingAvg(true);

      const resAll = await axios.get(`http://localhost:8000/api/produk`);
      // Bisa jadi data dikembalikan di resAll.data.data
      const rawList: any[] = Array.isArray(resAll.data)
        ? resAll.data
        : Array.isArray(resAll.data.data)
        ? resAll.data.data
        : [];

      // Debug: log supaya kita lihat benar‐benar array produk apa yang diterima
      console.log('>>> rawList semua produk:', rawList);

      // Filter hanya yang punya penitip_id sama
      const owned = rawList.filter((p) =>
        p.penitip_id !== undefined
          ? p.penitip_id === penitipId
          : p.ID_PENITIP === penitipId
      );

      if (owned.length === 0) {
        setAvgPenitipRating(0);
      } else {
        const total = owned.reduce((sum, x) => {
          // Pastikan ambil properti rating yang benar
          const r = typeof x.penitip_rating === 'number'
            ? x.penitip_rating
            : typeof x.RATING_BARANG === 'number'
            ? x.RATING_BARANG
            : 0;
          return sum + r;
        }, 0);
        setAvgPenitipRating(total / owned.length);
      }
    } catch (err) {
      console.error('Gagal menghitung rata‐rata penitip', err);
      setErrorAvg('Gagal menghitung rating penitip');
    } finally {
      setLoadingAvg(false);
    }
  };

  const handleCartToggle = () => {
    const cart: Product[] = JSON.parse(localStorage.getItem('cart') || '[]');
    if (inCart) {
      const updated = cart.filter((item) => item.id.toString() !== id);
      localStorage.setItem('cart', JSON.stringify(updated));
      setInCart(false);
    } else {
      if (product) {
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        setInCart(true);
      }
    }
  };

  const handleSubmitDiskusi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiskusi.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const res = await axios.post(
        `http://localhost:8000/api/produk/${id}/diskusi`,
        {
          PERTANYAAN: newDiskusi,
          ID_PEMBELI: user.ID_PEMBELI,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newItem = res.data.data;
      setDiskusi((prev) => [
        ...prev,
        {
          id: newItem.ID_DISKUSI,
          isi: newItem.PERTANYAAN,
          created_at: newItem.CREATE_AT,
          pembeli: { nama: user.NAMA_PEMBELI },
        },
      ]);
      setNewDiskusi('');
    } catch (err) {
      console.error('Gagal mengirim diskusi', err);
      alert('Gagal mengirim diskusi. Pastikan Anda sudah login.');
    }
  };

  if (!product) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="bg-[#FFF7E2] text-[#1E2B32] min-h-screen">
      <Header />
      <main className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Gambar Produk */}
          <div className="flex flex-col items-center lg:items-start w-full lg:w-1/3">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-[280px] object-contain border border-gray-300 rounded-md bg-[#CFCAB5]"
              />
            ) : (
              <div className="w-full h-[280px] flex items-center justify-center border border-gray-300 rounded-md bg-[#CFCAB5]">
                <span className="text-gray-500 italic">Tidak ada gambar</span>
              </div>
            )}
            <div className="flex gap-2 mt-3">
              {product.images.map((url, idx) =>
                url ? (
                  <img
                    key={idx}
                    src={url}
                    onClick={() => setSelectedImage(url)}
                    className={`w-10 h-10 border rounded cursor-pointer object-contain bg-[#CFCAB5] ${
                      selectedImage === url ? 'ring-2 ring-[#5B8482]' : ''
                    }`}
                  />
                ) : null
              )}
            </div>
          </div>

          {/* Detail Produk */}
          <div className="flex-1 space-y-4 text-sm">
            <h1 className="text-5xl font-bold">{product.name}</h1>
            <p className="text-2xl font-semibold">{product.price}</p>

            <div>
              <p className="font-semibold underline">Detail</p>
              <p>
                Garansi: <span className="italic">{product.garansi}</span>
              </p>
              <p>
                Berat: <span className="italic">{product.berat}</span>
              </p>
              <p>
                Kategori: <span className="italic">{product.category}</span>
              </p>
            </div>

            <hr className="border-[#5DA3A2]" />

            <div className="whitespace-pre-line">
              {showMore
                ? product.deskripsi
                : product.deskripsi.slice(0, 100) +
                  (product.deskripsi.length > 100 ? '...' : '')}
            </div>
            {product.deskripsi.length > 100 && (
              <button
                className="text-[#2D4C41] font-bold text-sm inline-block mt-2"
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? 'Lihat Sedikit' : 'Lihat Selengkapnya'}
              </button>
            )}

            <hr className="border-[#5DA3A2]" />

            {/* Info Penitip */}
            <div className="flex items-center gap-4 pt-4">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  product.penitip_name
                )}`}
                alt={product.penitip_name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">{product.penitip_name}</p>
                {loadingAvg ? (
                  <p className="text-xs text-gray-600">Memuat rating...</p>
                ) : errorAvg ? (
                  <p className="text-xs text-red-600">{errorAvg}</p>
                ) : avgPenitipRating !== null ? (
                  <p className="text-xs text-gray-600 flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill={
                          star <= Math.round(avgPenitipRating)
                            ? 'currentColor'
                            : 'none'
                        }
                        stroke={
                          star <= Math.round(avgPenitipRating) ? '#fbbf24' : '#d1d5db'
                        }
                        className="w-4 h-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 15l-5.878 3.09L5.145 11 0 6.91l6.06-.545L10 1l3.94 5.364L20 6.91 14.855 11l1.023 7.09z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ))}
                    <span> {avgPenitipRating.toFixed(1)} / 5</span>
                    <span className="text-gray-400">&bull;</span>
                    <span>Bergabung sejak {product.penitip_since}</span>
                  </p>
                ) : null}
              </div>
            </div>

            <hr className="border-[#5DA3A2]" />

            {/* Info Pengiriman */}
            <div>
              <p className="font-semibold">Pengiriman</p>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Standard</span>
                <span className="font-medium">Rp. 10.000</span>
              </div>
              <p className="text-sm">Operasional 08.00 – 20.00</p>
              <p className="text-xs text-gray-600">
                Pembelian setelah jam 16.00 dikirim keesokan harinya
              </p>
            </div>
          </div>

          {/* Box Harga & Aksi */}
          <div className="w-full lg:w-[280px] h-[260px] border border-[#72B7B9] rounded-xl p-5 text-sm bg-[#FFF7E2] shadow-sm overflow-y-auto">
            <div className="flex justify-between font-semibold mb-2">
              <span className="text-[#72B7B9]">SubTotal:</span>
              <span className="text-[#1E2B32]">{product.price}</span>
            </div>
            <p className="text-[#2D4C41] font-semibold mb-3">Tersedia</p>

            <button
              className="bg-[#5B8482] text-white w-full py-2 rounded hover:bg-[#48635B] mb-2"
              onClick={() => navigate('/checkout')}
            >
              Beli Sekarang
            </button>
            <button
              className={`w-full py-2 rounded border mb-6 ${
                inCart
                  ? 'bg-[#FEE2E2] text-[#B91C1C] border-[#DC2626]'
                  : 'border-[#48635B] text-[#2D4C41]'
              }`}
              onClick={handleCartToggle}
            >
              {inCart ? 'Hapus dari Keranjang' : 'Tambahkan ke Keranjang'}
            </button>
            <button className="bg-[#4f9897] text-white w-full py-2 rounded border border-[#5B8482]">
              Sukai
            </button>
          </div>
        </div>

        {/* DISKUSI */}
        <div className="mt-12 border-t border-[#D8D8D8] pt-6">
          <h3 className="font-semibold mb-4 text-lg text-[#2D4C41]">Diskusi</h3>

          {diskusi.length === 0 ? (
            <div className="bg-[#FFF7E2] border border-[#8FC5C1] text-sm text-[#2D4C41] px-4 py-3 rounded-lg">
              <div className="flex justify-between items-center">
                <p>Belum ada diskusi mengenai produk ini. Yuk mulai diskusi!</p>
                {!showFormDiskusi && (
                  <button
                    onClick={() => setShowFormDiskusi(true)}
                    className="border border-[#2D4C41] px-4 py-1.5 rounded-md text-[#2D4C41] hover:bg-[#F1EADA]"
                  >
                    Mulai Diskusi
                  </button>
                )}
              </div>
              {showFormDiskusi && (
                <form
                  onSubmit={handleSubmitDiskusi}
                  className="flex flex-col md:flex-row gap-3 mt-4"
                >
                  <input
                    type="text"
                    value={newDiskusi}
                    onChange={(e) => setNewDiskusi(e.target.value)}
                    placeholder="Tulis pertanyaanmu..."
                    className="flex-1 border border-[#8FC5C1] bg-white text-[#1E2B32] placeholder-gray-400 px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8482]"
                  />
                  <button
                    type="submit"
                    className="bg-[#5B8482] text-white px-6 py-2 rounded-md hover:bg-[#48635B]"
                  >
                    Kirim
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="space-y-4 mb-6">
              {diskusi.map((d) => (
                <div
                  key={d.id}
                  className="bg-white shadow-sm border border-[#8FC5C1] rounded-lg px-4 py-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-[#2D4C41]">{d.pembeli.nama}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(d.created_at).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-sm mt-1 text-[#1E2B32]">{d.isi}</p>

                  {d.jawaban && (
                    <div className="mt-3 ml-4 pl-4 border-l-2 border-[#5B8482] text-sm text-[#2D4C41] bg-[#F0F7F7] rounded-md">
                      <p className="font-semibold mb-1">Admin</p>
                      <p>{d.jawaban}</p>
                    </div>
                  )}
                </div>
              ))}

              <form
                onSubmit={handleSubmitDiskusi}
                className="flex flex-col md:flex-row gap-3 mt-4"
              >
                <input
                  type="text"
                  value={newDiskusi}
                  onChange={(e) => setNewDiskusi(e.target.value)}
                  placeholder="Tulis pertanyaanmu..."
                  className="flex-1 border border-[#8FC5C1] bg-white text-[#1E2B32] placeholder-gray-400 px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8482]"
                />
                <button
                  type="submit"
                  className="bg-[#5B8482] text-white px-6 py-2 rounded-md hover:bg-[#48635B]"
                >
                  Kirim
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
