import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

type Product = {
  id: number;
  name: string;
  price: number; // asumsi harga numerik
  image: string;
  penitip_name: string;
  penitip_avatar?: string;
};

const ITEMS_PER_PAGE = 5;
const MAX_CART_ITEMS = 50;

export default function CartPage() {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Load cart data dari localStorage saat mount
  useEffect(() => {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      try {
        let parsed: Product[] = JSON.parse(cartData);

        // Batasi max 50 item
        if (parsed.length > MAX_CART_ITEMS) {
          parsed = parsed.slice(0, MAX_CART_ITEMS);
          localStorage.setItem('cart', JSON.stringify(parsed));
        }

        setCartItems(parsed);
      } catch {
        setCartItems([]);
      }
    }
  }, []);

  // Hapus item dari cart
  const handleRemoveItem = (id: number) => {
    const filtered = cartItems.filter((item) => item.id !== id);
    setCartItems(filtered);
    localStorage.setItem('cart', JSON.stringify(filtered));

    // Jika hapus item dan halaman kosong, pindah ke halaman sebelumnya
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  };

  // Format harga ke Rp
  const formatPrice = (price: number) => {
    return `${price.toLocaleString('id-ID')}`;
  };

  // Pagination logic: ambil item untuk halaman sekarang
  const totalPages = Math.ceil(cartItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = cartItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (cartItems.length === 0) {
    return (
      <div className="bg-[#FFF7E2] min-h-screen text-[#1E2B32]">
        <Header />
        <main className="max-w-6xl mx-auto px-6 py-8">
          <p className="text-center text-lg font-semibold">Keranjang belanja kosong.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#FFF7E2] min-h-screen text-[#1E2B32]">
      <Header />
      <main
        className="max-w-6xl mx-auto px-6 py-8 bg-white rounded-lg shadow p-6 space-y-6 mt-5"
        style={{ maxWidth: '900px', minWidth: '900px' }} // Lebar fix 900px (bisa disesuaikan)
      >
        {currentItems.map((item) => (
          <div key={item.id} className="flex items-center border-b border-gray-300 pb-4">
            {/* Avatar Penitip */}
            <img
              src={
                item.penitip_avatar
                  ? item.penitip_avatar
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      item.penitip_name,
                    )}&background=5B8482&color=fff`
              }
              alt={item.penitip_name}
              className="w-12 h-12 rounded-full mr-4 object-cover"
            />

            {/* Nama Penitip dan Produk */}
            <div className="flex-grow">
              <p className="text-sm font-semibold text-[#5B8482]">{item.penitip_name}</p>
              <h3 className="font-bold text-lg">{item.name}</h3>
            </div>

            {/* Subtotal Produk */}
            <div className="text-center w-40">
              <p className="text-sm font-semibold">Subtotal Produk</p>
              <p className="font-bold text-lg">{formatPrice(item.price)}</p>
            </div>

            {/* Tombol Hapus */}
            <button
              onClick={() => handleRemoveItem(item.id)}
              className="ml-4 px-4 py-1 border border-[#5B8482] rounded text-sm text-[#5B8482] hover:bg-[#F0F6F5] transition"
            >
              Hapus
            </button>
          </div>
        ))}

        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded border ${
              currentPage === 1
                ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                : 'border-[#5B8482] text-[#5B8482] hover:bg-[#F0F6F5]'
            }`}
          >
            Prev
          </button>
          <span>
            Halaman {currentPage} dari {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded border ${
              currentPage === totalPages
                ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                : 'border-[#5B8482] text-[#5B8482] hover:bg-[#F0F6F5]'
            }`}
          >
            Next
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
