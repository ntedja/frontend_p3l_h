import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import macbookImage from "../assets/images.png";

const productImages = [
  macbookImage,
  "https://dummyimage.com/300x300/000/fff&text=Image+2",
  "https://dummyimage.com/300x300/000/fff&text=Image+3",
];

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(productImages[0]);
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="bg-[#FFF7E2] text-[#1E2B32] min-h-screen">
      <Header />

      <main className="max-w-[1200px] mx-auto px-6 py-8">
        {/* PRODUK UTAMA */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Gambar */}
          <div className="flex flex-col items-center lg:items-start w-full lg:w-1/3">
            <img
              src={selectedImage}
              alt="Produk Utama"
              className="w-full h-[280px] object-contain border border-gray-300 rounded-md bg-[#CFCAB5]"
            />
            <div className="flex gap-2 mt-3">
              {productImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setSelectedImage(img)}
                  className={`w-10 h-10 border rounded cursor-pointer object-contain bg-[#CFCAB5] ${
                    selectedImage === img ? "ring-2 ring-[#5B8482]" : ""
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Detail Produk */}
          <div className="flex-1 space-y-4 text-sm">
            <h1 className="text-5xl font-bold">MacBook Air 11”</h1>
            <p className="text-2xl font-semibold">Rp12.000.000</p>

            <div>
              <p className="font-semibold underline">Detail</p>
              <p>
                Garansi: <span className="italic">2025-07-10</span>
              </p>
              <p>
                Berat: <span className="italic">2kg</span>
              </p>
            </div>

            <hr className="border-[#5DA3A2]" />

            <p>
              Macbook Air (11-inch, 2015) Type MJVM2.
              <br />
              Semua Fungsi WORK 100% dan Original.
            </p>

            {/* Spesifikasi Toggle */}
            <div>
              <p className="font-semibold">Spesifikasi:</p>
              <ol className="list-decimal pl-5">
                <li>Prosesor Core i5 1.6 GHz ~ Turbo Boost up to 3.6 GHz</li>
                <li>Storage Apple SSD 128 GB</li>
                <li>RAM DDR3 4 GB 1600 MHz</li>
                {showMore && (
                  <>
                    <li>Backlight keyboard</li>
                    <li>
                      Intel HD Graphics 6000 1.5 GB (VGA TERTINGGI, Sama Seperti
                      MacBook Air 2017)
                    </li>
                    <li>Kamera Jernih Banget</li>
                    <li>Battery masih awet 5-7 jam pemakaian normal</li>
                    <li>Status Battery: NORMAL</li>
                    <li>
                      LCD Original Bawaan (No Whitespot, No Deadpixel, No Blur,
                      NORMAL 100%)
                    </li>
                  </>
                )}
              </ol>

              {showMore && (
                <>
                  <div className="mt-2">
                    <p className="font-semibold">Kelengkapan:</p>
                    <ul className="list-disc pl-5">
                      <li>MacBook Air 11 Inch [2015]</li>
                      <li>Magsafe 2 Original</li>
                      <li>AC Plugin</li>
                    </ul>
                  </div>

                  <div className="mt-2">
                    <p className="text-sm text-[#2D4C41]">
                      <strong>#LIKE NEW</strong> = Kemulusan Diatas 98%, Like
                      New. Perfect Condition.
                      <br />
                      <strong>#Mulus Pemakaian</strong> = Kemulusan Body 91 -
                      96%, Mulus Pemakaian Wajar.
                    </p>
                  </div>
                </>
              )}

              <button
                className="text-[#2D4C41] font-bold text-sm inline-block mt-2"
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? "Lihat Sedikit" : "Lihat Selengkapnya"}
              </button>
            </div>

            <hr className="border-[#5DA3A2]" />

            {/* Penjual */}
            <div className="flex items-center gap-4 pt-4">
              <img
                src="https://ui-avatars.com/api/?name=Xena+Putri"
                alt="Xena Putri"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">Xena Putri</p>
                <p className="text-xs text-gray-600 flex items-center gap-2">
                  <i className="bi bi-star-fill text-yellow-500"></i>
                  4.6 (10)
                  <span className="text-gray-400">&bull;</span>
                  Bergabung sejak 2021-01-02
                </p>
              </div>
            </div>

            <hr className="border-[#5DA3A2]" />

            {/* Pengiriman */}
            <div>
              <p className="font-semibold">Pengiriman</p>
              <p className="text-sm">Standard</p>
              <p className="text-sm">Operasional 08.00 - 20.00</p>
              <p className="text-sm mt-1 font-medium text-right">Rp. 10.000</p>
              <p className="text-xs text-gray-600">
                Pembelian lebih dari 16.00 akan dikirim keesokan harinya
              </p>
            </div>
          </div>

          {/* Box Harga */}
          <div className="w-full lg:w-[280px] h-[260px] border border-[#72B7B9] rounded-xl p-5 text-sm bg-[#FFF7E2] shadow-sm overflow-y-auto">
            <div className="flex justify-between font-semibold mb-2">
              <span className="text-[#72B7B9]">SubTotal:</span>
              <span className="text-[#1E2B32]">Rp12.000.000</span>
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
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#2D4C41"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 8h10M7 12h4m-9 8v-6a9 9 0 1118 0v6a1 1 0 01-1.447.894L15 18.118a2 2 0 00-1.106-.303H10.106a2 2 0 00-1.106.303l-4.553 2.776A1 1 0 013 20z"
                />
              </svg>
              <p>Belum ada diskusi mengenai produk ini. Langsung saja chat penjual yuk!</p>
            </div>
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
