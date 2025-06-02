import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';

type Product = {
  id: number;
  name: string;
  price?: number;
  image?: string;
  penitip_name?: string;
  penitip_avatar?: string;
};

const ITEMS_PER_PAGE = 5;
const MAX_CART_ITEMS = 50;

export default function CartPage() {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Fungsi fetch cart dari backend
  async function fetchCartItems(): Promise<Product[]> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await axios.get('http://192.168.155.88:8000/api/cart-items', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.data.success) throw new Error('Failed to fetch cart');
    // Sesuaikan struktur data sesuai backend
    return response.data.data.map((item: any) => ({
      id: item.ID_BARANG,
      name: item.barang.NAMA_BARANG,
      price: Number(item.barang.HARGA_BARANG),
      penitip_name: item.barang.penitip?.NAMA_PENITIP || 'Tidak Diketahui',
      penitip_avatar: undefined, // Kalau ada avatar, tambahkan mappingnya
      image: item.barang.FOTO_BARANG,
    }));
  }

  // Fungsi remove cart item di backend
  async function removeCartItem(id: number) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    await axios.delete(`http://192.168.155.88:8000/api/cart-items/remove/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  useEffect(() => {
    async function loadCart() {
      try {
        const backendCart = await fetchCartItems();
        // Batasi max 50 item
        let limitedCart = backendCart;
        if (backendCart.length > MAX_CART_ITEMS) {
          limitedCart = backendCart.slice(0, MAX_CART_ITEMS);
        }
        setCartItems(limitedCart);
      } catch (error) {
        console.error('Gagal load cart:', error);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    }
    loadCart();
  }, []);

  const handleRemove = async (id: number) => {
    try {
      await removeCartItem(id);
      const filtered = cartItems.filter((item) => item.id !== id);
      setCartItems(filtered);
      const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
      if (currentPage > totalPages) setCurrentPage(totalPages);
    } catch (error) {
      console.error('Gagal hapus item:', error);
    }
  };

  const formatPrice = (price?: number) => {
    if (price === undefined || price === null) return '-';
    return price.toLocaleString('id-ID');
  };

  if (loading) return <div>Loading cart...</div>;

  if (cartItems.length === 0)
    return (
      <div className="bg-[#FFF7E2] min-h-screen text-[#1E2B32]">
        <Header />
        <main className="max-w-6xl mx-auto px-6 py-8">
          <p className="text-center text-lg font-semibold">Keranjang belanja kosong.</p>
        </main>
        <Footer />
      </div>
    );

  const totalPages = Math.ceil(cartItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = cartItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="bg-[#FFF7E2] min-h-screen text-[#1E2B32]">
      <Header />
      <main
        className="max-w-6xl mx-auto px-6 py-8 bg-white rounded-lg shadow p-6 space-y-6 mt-5"
        style={{ maxWidth: '900px', minWidth: '900px' }}
      >
        {currentItems.map((item) => (
          <div key={item.id} className="flex items-center border-b border-gray-300 pb-4">
            <img
              src={
                item.penitip_avatar
                  ? item.penitip_avatar
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      item.penitip_name || 'User',
                    )}&background=5B8482&color=fff`
              }
              alt={item.penitip_name}
              className="w-12 h-12 rounded-full mr-4 object-cover"
            />

            <div className="flex-grow">
              <p className="text-sm font-semibold text-[#5B8482]">{item.penitip_name}</p>
              <h3 className="font-bold text-lg">{item.name}</h3>
            </div>

            <div className="text-center w-40">
              <p className="text-sm font-semibold">Subtotal Produk</p>
              <p className="font-bold text-lg">{formatPrice(item.price)}</p>
            </div>

            <button
              onClick={() => handleRemove(item.id)}
              className="ml-4 px-4 py-1 border border-[#5B8482] rounded text-sm text-[#5B8482] hover:bg-[#F0F6F5] transition"
            >
              Hapus
            </button>
          </div>
        ))}

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
