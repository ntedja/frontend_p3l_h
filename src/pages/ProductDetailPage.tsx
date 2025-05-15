import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";

type Product = {
  id: number;
  name: string;
  price: string;
  category: string;
  image: string;
  garansi: string;
  berat: string;
  deskripsi: string;
  penitip_name: string;
  penitip_since: string;
  penitip_rating: number;
};

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/produk/${id}`);
        setProduct(res.data);
        setSelectedImage(res.data.image);
      } catch (err) {
        console.error("Gagal mengambil data produk", err);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="bg-[#FFF7E2] text-[#1E2B32] min-h-screen">
      <Header />

      <main className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Gambar */}
          <div className="flex flex-col items-center lg:items-start w-full lg:w-1/3">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-[280px] object-contain border border-gray-300 rounded-md bg-[#CFCAB5]"
            />
            <div className="flex gap-2 mt-3">
              <img
                src={product.image}
                onClick={() => setSelectedImage(product.image)}
                className={`w-10 h-10 border rounded cursor-pointer object-contain bg-[#CFCAB5] ${
                  selectedImage === product.image ? "ring-2 ring-[#5B8482]" : ""
                }`}
              />
            </div>
          </div>

          {/* Detail Produk */}
          <div className="flex-1 space-y-4 text-sm">
            <h1 className="text-5xl font-bold">{product.name}</h1>
            <p className="text-2xl font-semibold">{product.price}</p>

            <div>
              <p className="font-semibold underline">Detail</p>
              <p>Garansi: <span className="italic">{product.garansi}</span></p>
              <p>Berat: <span className="italic">{product.berat}</span></p>
              <p>Kategori: <span className="italic">{product.category}</span></p>
            </div>

            <hr className="border-[#5DA3A2]" />

            {/* Deskripsi lengkap */}
            <div className="whitespace-pre-line">
              {showMore
                ? product.deskripsi
                : product.deskripsi.slice(0, 100) +
                  (product.deskripsi.length > 100 ? "..." : "")}
            </div>

            {product.deskripsi.length > 100 && (
              <button
                className="text-[#2D4C41] font-bold text-sm inline-block mt-2"
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? "Lihat Sedikit" : "Lihat Selengkapnya"}
              </button>
            )}

            <hr className="border-[#5DA3A2]" />

            {/* Penjual */}
            <div className="flex items-center gap-4 pt-4">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(product.penitip_name)}`}
                alt={product.penitip_name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">{product.penitip_name}</p>
                <p className="text-xs text-gray-600 flex items-center gap-2">
                  <i className="bi bi-star-fill text-yellow-500"></i>
                  {product.penitip_rating.toFixed(1)} / 5
                  <span className="text-gray-400">&bull;</span>
                  Bergabung sejak {product.penitip_since}
                </p>
              </div>
            </div>

            <hr className="border-[#5DA3A2]" />

            {/* Pengiriman */}
            <div>
              <p className="font-semibold">Pengiriman</p>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Standard</span>
                <span className="font-medium">Rp. 10.000</span>
              </div>
              <p className="text-sm">Operasional 08.00 - 20.00</p>
              <p className="text-xs text-gray-600">
                Pembelian setelah jam 16.00 dikirim keesokan harinya
              </p>
            </div>
          </div>

          {/* Box Harga */}
          <div className="w-full lg:w-[280px] h-[260px] border border-[#72B7B9] rounded-xl p-5 text-sm bg-[#FFF7E2] shadow-sm overflow-y-auto">
            <div className="flex justify-between font-semibold mb-2">
              <span className="text-[#72B7B9]">SubTotal:</span>
              <span className="text-[#1E2B32]">{product.price}</span>
            </div>
            <p className="text-[#2D4C41] font-semibold mb-3">Tersedia</p>
            <button className="bg-[#5B8482] text-white w-full py-2 rounded hover:bg-[#48635B] mb-2">
              Tambahkan ke Keranjang
            </button>
            <button className="w-full py-2 rounded border border-[#48635B] text-[#2D4C41] mb-6">
              Tambahkan ke Keranjang
            </button>
            <button className="bg-[#A8D0CF] text-white w-full py-2 rounded border border-[#5B8482]">
              Sukai
            </button>
          </div>
        </div>

        {/* DISKUSI */}
        <div className="mt-12 border-t border-[#D8D8D8] pt-6">
          <h3 className="font-semibold mb-4 text-lg text-[#2D4C41]">Diskusi</h3>
          <div className="bg-[#FFF7E2] border border-[#8FC5C1] text-sm text-[#2D4C41] px-4 py-3 rounded-lg flex justify-between items-center">
            <p>Belum ada diskusi mengenai produk ini. Langsung saja chat penjual yuk!</p>
            <button className="border border-[#2D4C41] px-4 py-1.5 rounded-md text-[#2D4C41] hover:bg-[#F1EADA]">
              Chat Penjual
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
