// KatalogRequest.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import homePageImage from '../assets/homePage.jpeg';
import { getBarangList, createRequest } from '../api/barangService';

type Product = {
  id: number;
  name: string;
  price: string;
  category: string;
  image: string;
};

type CategoryKey =
  | 'elektronik'
  | 'pakaian'
  | 'perabotan'
  | 'buku'
  | 'hobi'
  | 'bayi-anak'
  | 'otomotif'
  | 'taman-outdoor'
  | 'kantor-industri'
  | 'kosmetik';

const categories = [
  { label: 'Elektronik & Gadget', value: 'Elektronik', icon: 'bi-phone', slug: 'elektronik' },
  { label: 'Pakaian & Aksesoris', value: 'Pakaian', icon: 'bi-bag', slug: 'pakaian' },
  { label: 'Perabotan Rumah Tangga', value: 'Perabotan', icon: 'bi-house', slug: 'perabotan' },
  { label: 'Buku, Alat Tulis, & Peralatan Sekolah', value: 'Buku', icon: 'bi-book', slug: 'buku' },
  { label: 'Hobi, Mainan, & Koleksi', value: 'Hobi', icon: 'bi-controller', slug: 'hobi' },
  {
    label: 'Perlengkapan Bayi & Anak',
    value: 'Bayi & Anak',
    icon: 'bi-emoji-smile',
    slug: 'bayi-anak',
  },
  { label: 'Otomotif & Aksesoris', value: 'Otomotif', icon: 'bi-car-front', slug: 'otomotif' },
  {
    label: 'Perlengkapan Taman & Outdoor',
    value: 'Taman & Outdoor',
    icon: 'bi-flower2',
    slug: 'taman-outdoor',
  },
  {
    label: 'Peralatan Kantor & Industri',
    value: 'Kantor & Industri',
    icon: 'bi-briefcase',
    slug: 'kantor-industri',
  },
  { label: 'Kosmetik & Perawatan Diri', value: 'Kosmetik', icon: 'bi-heart', slug: 'kosmetik' },
];

export default function KatalogRequest() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | CategoryKey>('all');
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [requestDescription, setRequestDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getBarangList();
        setAvailableProducts(products);
      } catch (err) {
        console.error('Gagal fetch produk tersedia:', err);
      }
    };
    fetchProducts();
  }, []);

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;

    try {
      const response = await createRequest({
        ID_BARANG: selectedProductId,
        DESKRIPSI_REQUEST: requestDescription,
        STATUS_REQUEST: 'Menunggu',
      });
      setSuccess(response.message);
      setRequestDescription('');
      setIsModalOpen(false);
      setSelectedProductId(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Gagal membuat request');
      setTimeout(() => setError(null), 3000);
    }
  };

  const productList =
    selectedCategory === 'all'
      ? availableProducts
      : availableProducts.filter((p) => {
          const category = categories.find((c) => c.slug === selectedCategory);
          return category && p.category === category.label;
        });

  return (
    <div className="bg-[#FFF7E2] min-h-screen text-[#1E2B32] w-full">
      <Header />

      <main className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Hero */}
        <motion.section
          className="py-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={homePageImage}
            alt="Hero"
            className="rounded-xl w-full h-[220px] sm:h-[300px] md:h-[380px] object-cover shadow-sm"
          />
        </motion.section>

        {/* Kategori */}
        <motion.section
          className="py-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-wrap justify-center md:justify-between gap-4">
            <motion.div
              onClick={() => setSelectedCategory('all')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className={`flex flex-col items-center w-[100px] text-center cursor-pointer transition-all ${
                selectedCategory === 'all' ? 'bg-[#F1EADA] rounded-lg shadow-sm p-2' : ''
              } hover:text-[#2D4C41]`}
            >
              <i className="text-xl text-[#48635B] bi-list-ul mb-2"></i>
              <span className="text-xs sm:text-[13px] font-medium leading-tight">
                Semua Kategori
              </span>
            </motion.div>
            {categories.map((item, i) => (
              <motion.div
                key={i}
                onClick={() => setSelectedCategory(item.slug as CategoryKey)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className={`flex flex-col items-center w-[100px] text-center cursor-pointer transition-all ${
                  selectedCategory === item.slug ? 'bg-[#F1EADA] rounded-lg shadow-sm p-2' : ''
                } hover:text-[#2D4C41]`}
              >
                <i className={`text-xl text-[#48635B] ${item.icon} mb-2`}></i>
                <span className="text-xs sm:text-[13px] font-medium leading-tight">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Produk Tersedia */}
        <motion.section
          className="py-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xl font-semibold mb-6">
            {selectedCategory === 'all'
              ? 'Semua Barang Tersedia'
              : categories.find((c) => c.slug === selectedCategory)?.label ?? 'Barang Tersedia'}
          </h2>

          {success && (
            <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg">{success}</div>
          )}
          {error && <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">{error}</div>}

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
            >
              {productList.length > 0 ? (
                productList.map((product, i) => (
                  <motion.div
                    key={i}
                    className="flex flex-col items-start w-full"
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={(e) => (e.currentTarget.src = '/images/default.jpg')}
                      className="h-24 object-contain mb-2 self-center"
                    />
                    <div className="pl-1 w-full">
                      <h3 className="text-sm font-semibold mb-0.5">{product.name}</h3>
                      <p className="text-sm font-medium mb-0.5">{product.price}</p>
                      <span className="text-xs text-[#48635B]">{product.category}</span>
                      <div className="mt-2 flex gap-2">
                        <Link
                          to={`/produk/${product.id}`}
                          className="text-xs text-black font-semibold inline-block hover:underline"
                        >
                          Lihat Detail
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedProductId(product.id);
                            setIsModalOpen(true);
                          }}
                          className="text-xs text-white bg-[#48635B] px-2 py-1 rounded hover:bg-[#2D4C41]"
                        >
                          Request
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-sm text-[#48635B] col-span-full text-center">
                  Tidak ada barang tersedia di kategori ini.
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.section>

        {/* Request Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white p-6 rounded-lg max-w-md w-full"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <h3 className="text-lg font-semibold mb-4">Buat Request Barang</h3>
                <form onSubmit={handleRequestSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Deskripsi Request</label>
                    <textarea
                      value={requestDescription}
                      onChange={(e) => setRequestDescription(e.target.value)}
                      className="w-full p-2 border rounded"
                      rows={4}
                      maxLength={255}
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setRequestDescription('');
                        setSelectedProductId(null);
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#48635B] text-white rounded hover:bg-[#2D4C41]"
                    >
                      Kirim Request
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
