import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import homePageImage from '../assets/homePage.jpeg';
import { getBarangListPublic, createRequest, getOrganisasiRequests } from '../api/barangService';

type Product = {
  id: number;
  name: string;
  price: string;
  category: string;
  image: string;  
  images: string[];
  status: string;
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
  const [requestedProductIds, setRequestedProductIds] = useState<number[]>([]);
  const [penerima, setPenerima] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  // Fungsi pengecekan auth tanpa file terpisah
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const barangList = await getBarangListPublic();
        const availableBarang = barangList.filter((barang: any) => barang.status === 'tersedia');

        const products: Product[] = availableBarang.map((barang: any) => ({
          id: barang.id,
          name: barang.name,
          price: barang.price,
          category: barang.category,
          image: barang.image,
          images: barang.images ?? [barang.image],
          status: barang.status,
        }));

        setAvailableProducts(products);

        if (isAuthenticated()) {
          try {
            const requests = await getOrganisasiRequests();
            const requestedIds = requests
              .filter((req: any) => req.STATUS_REQUEST === 'Menunggu')
              .map((req: any) => req.ID_BARANG);
            setRequestedProductIds(requestedIds);
          } catch (err) {
            console.log('Tidak bisa mengambil data request');
          }
        }
      } catch (err: any) {
        console.error('Gagal fetch data:', err);
        setError(err.message || 'Gagal memuat data barang');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated()) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (!selectedProductId || !penerima) {
      setError('Harap isi semua field yang diperlukan');
      return;
    }

    try {
      await createRequest({
        ID_BARANG: selectedProductId,
        DESKRIPSI_REQUEST: requestDescription,
        STATUS_REQUEST: 'Menunggu',
        PENERIMA: penerima,
      });

      setSuccess('Request berhasil dikirim!');
      setRequestDescription('');
      setPenerima('');
      setIsModalOpen(false);
      setSelectedProductId(null);
      setRequestedProductIds((prev) => [...prev, selectedProductId]);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Gagal membuat request donasi');
      setTimeout(() => setError(null), 3000);
    }
  };

  const productList =
    selectedCategory === 'all'
      ? availableProducts
      : availableProducts.filter((p) => {
          const category = categories.find((c) => c.slug === selectedCategory);
          return category && p.category === category.value;
        });

  const renderRequestButton = (productId: number) => {
    if (!isAuthenticated()) {
      return (
        <button
          onClick={() => navigate('/login', { state: { from: location.pathname } })}
          className="px-4 py-2 bg-[#48635B] text-white rounded hover:bg-[#2D4C41] transition-colors"
        >
          Login untuk Request
        </button>
      );
    }

    if (requestedProductIds.includes(productId)) {
      return (
        <button disabled className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed">
          Request Dikirim
        </button>
      );
    }

    return (
      <button
        onClick={() => {
          setSelectedProductId(productId);
          setIsModalOpen(true);
        }}
        className="px-4 py-2 bg-[#48635B] text-white rounded hover:bg-[#2D4C41] transition-colors"
      >
        Request Barang
      </button>
    );
  };

  return (
    <div className="bg-[#FFF7E2] min-h-screen text-[#1E2B32] w-full">
      <Header />

      <main className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Hero Section */}
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

        {/* Categories */}
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

        {/* Products Section */}
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

          {!isAuthenticated() && (
            <div className="mb-6 p-4 bg-yellow-100 text-yellow-800 rounded-lg">
              Anda perlu login untuk dapat melakukan request barang.
              <Link
                to="/login"
                state={{ from: location.pathname }}
                className="text-[#48635B] font-medium ml-1"
              >
                Login disini
              </Link>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg">{success}</div>
          )}
          {error && <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">{error}</div>}

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#48635B]"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {productList.length > 0 ? (
                  productList.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="h-48 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                        <p className="text-[#48635B] font-medium mb-2">Rp {product.price}</p>
                        <p className="text-sm text-gray-600 mb-4">{product.category}</p>
                        <div className="flex justify-between items-center">
                          <Link
                            to={`/barang/${product.id}`}
                            className="text-[#48635B] hover:underline text-sm"
                          >
                            Detail
                          </Link>
                          {renderRequestButton(product.id)}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    <p className="text-gray-500">Tidak ada barang tersedia dalam kategori ini</p>
                  </div>
                )}
              </div>
            </>
          )}
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
                className="bg-white p-6 rounded-lg max-w-md w-full mx-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <h3 className="text-lg font-semibold mb-4">Buat Request Donasi</h3>
                <form onSubmit={handleRequestSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Penerima Donasi</label>
                    <input
                      type="text"
                      value={penerima}
                      onChange={(e) => setPenerima(e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-[#48635B] focus:border-transparent"
                      placeholder="Nama penerima donasi"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Deskripsi Request</label>
                    <textarea
                      value={requestDescription}
                      onChange={(e) => setRequestDescription(e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-[#48635B] focus:border-transparent"
                      rows={4}
                      maxLength={255}
                      placeholder="Jelaskan kebutuhan dan alasan request ini"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Maksimal 255 karakter</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setRequestDescription('');
                        setPenerima('');
                        setSelectedProductId(null);
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#48635B] text-white rounded hover:bg-[#2D4C41] transition-colors"
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
