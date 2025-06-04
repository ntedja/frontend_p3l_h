import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

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
  penitip_name: string;
  penitip_since: string;
  penitip_rating: number;
};

type ProfileData = {
  NAMA_PEMBELI: string;
  EMAIL_PEMBELI: string;
  NO_TELP_PEMBELI: string;
  TGL_LAHIR_PEMBELI: string;
  POINT_LOYALITAS_PEMBELI: number;
};

type Address = {
  ID_ALAMAT: number;
  JUDUL: string;
  NAMA_JALAN: string;
  PROVINSI: string;
  KABUPATEN: string;
  KECAMATAN: string;
  DESA_KELURAHAN: string;
};

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-[#2D4C41] mb-4">{title}</h3>
        {children}
        <div className="flex justify-end gap-2 mt-6">
          <button className="text-sm px-4 py-2 text-gray-600 hover:underline" onClick={onClose}>
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();

  const displayToBackend = {
    kurir: 'Di Kirim',
    ambil: 'Ambil Sendiri',
  };

  const { id } = useParams<{ id: string }>();
  const [deliveryMethodUI, setDeliveryMethodUI] = useState<'kurir' | 'ambil'>('kurir');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showMethodModal, setShowMethodModal] = useState(false);

  const [profileData, setProfileData] = useState<ProfileData>({
    NAMA_PEMBELI: '',
    EMAIL_PEMBELI: '',
    NO_TELP_PEMBELI: '',
    TGL_LAHIR_PEMBELI: '',
    POINT_LOYALITAS_PEMBELI: 0,
  });
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAlamatId, setSelectedAlamatId] = useState<number | null>(null);

  const [product, setProduct] = useState<Product | null>(null);
  const [usedPoints, setUsedPoints] = useState(0);

  const pointValue = 10000;

  const handleOrder = async () => {
    if (!product) return;

    if (deliveryMethodUI === 'kurir' && !selectedAlamatId) {
      alert('Silakan pilih alamat pengiriman terlebih dahulu.');
      return;
    }

    try {
      const payload = {
        metode_pengiriman: displayToBackend[deliveryMethodUI],
        id_alamat_pengiriman:
          displayToBackend[deliveryMethodUI] === 'Di Kirim' ? selectedAlamatId : null,
        items: [{ qty: 1 }],
        poin_ditukar: usedPoints,
        id_barang: product.id,
      };

      const token = localStorage.getItem('token');
      if (!token) {
        alert('Anda harus login terlebih dahulu.');
        return;
      }

      const response = await axios.post('http://192.168.155.88:8000/api/checkout', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const orderId = response.data.data?.ID_TRANSAKSI_PEMBELIAN;

      if (!orderId) {
        alert('Gagal mendapatkan ID transaksi. Silakan coba lagi.');
        return;
      }

      navigate(`/pembayaran/${orderId}`, {
        state: { transaksiId: orderId },
      });
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        console.error('Validation errors:', error.response.data.errors);
        alert('Terjadi kesalahan validasi input. Periksa kembali data yang dimasukkan.');
      } else {
        console.error('Error saat membuat pesanan:', error);
        alert('Gagal membuat pesanan. Silakan coba lagi.');
      }
    }
  };

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) throw new Error('Token tidak ditemukan.');

        const [profileRes, productRes, addressRes] = await Promise.all([
          axios.get('http://192.168.155.88:8000/api/pembeli/me', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://192.168.155.88:8000/api/produk/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://192.168.155.88:8000/api/pembeli/me/alamat', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (profileRes.data.success) setProfileData(profileRes.data.data);
        setProduct(productRes.data);
        setAddresses(addressRes.data.data);

        if (addressRes.data.data.length > 0) {
          setSelectedAlamatId(addressRes.data.data[0].ID_ALAMAT);
        }
      } catch (error) {
        console.error('Gagal memuat data:', error);
      }
    };

    fetchData();
  }, [id, token]);

  const userPoints = profileData.POINT_LOYALITAS_PEMBELI;
  const pointDiscount = usedPoints * pointValue;
  const productSubtotal = Number(product?.price?.replace(/[^\d]/g, '')) || 0;
  const rawShippingFee = productSubtotal >= 1500000 ? 0 : 100000;
  const shippingFee = deliveryMethodUI === 'kurir' ? rawShippingFee : 0;
  const totalPayment = Math.max(productSubtotal + shippingFee - pointDiscount, 0);
  const remainingPoints = userPoints - usedPoints;
  const selectedAddress = addresses.find((addr) => addr.ID_ALAMAT === selectedAlamatId);

  return (
    <div className="bg-[#FFF7E2] text-[#1E2B32] min-h-screen">
      <Header />
      <main className="max-w-[1200px] mx-auto px-6 py-8">
        <h2 className="font-semibold text-[#2D4C41] mb-4">Alamat Pengiriman</h2>
        <div className="flex justify-between items-start gap-4 flex-wrap">
          <div className="text-sm">
            <p className="font-medium">{profileData.NAMA_PEMBELI || '-'}</p>
            <p>(+62) {profileData.NO_TELP_PEMBELI || '-'}</p>
          </div>
          {deliveryMethodUI === 'kurir' && selectedAddress && (
            <div className="flex-1 text-sm text-center">
              <p className="font-medium">{selectedAddress.JUDUL || '-'}</p>
              <p>
                {`${selectedAddress.NAMA_JALAN}, ${selectedAddress.DESA_KELURAHAN}, ${selectedAddress.KECAMATAN}, ${selectedAddress.KABUPATEN}, ${selectedAddress.PROVINSI}`}
              </p>
            </div>
          )}
          {deliveryMethodUI === 'kurir' && (
            <button
              className="text-sm rounded-md px-3 py-1 border border-[#1E2B32] text-[#1E2B32]"
              onClick={() => setShowAddressModal(true)}
            >
              Ubah Alamat
            </button>
          )}
        </div>

        <div className="h-px bg-[#1E2B32] my-4" />

        {product && (
          <div className="flex flex-col gap-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    product.penitip_name || '',
                  )}`}
                  alt={product.penitip_name}
                  className="w-8 h-8 rounded-full"
                />
                <p className="font-semibold text-[#2D4C41]">{product.penitip_name || '-'}</p>
              </div>
              <p className="font-semibold text-[#2D4C41]">Subtotal Produk</p>
            </div>

            <div className="flex justify-between items-center gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-14 h-14 rounded-md border border-gray-300 object-cover"
                />
                <p className="font-semibold text-lg text-[#2D4C41]">{product.name}</p>
              </div>
              <div className="text-[#2D4C41] font-semibold">
                Rp {Number(product.price.replace(/[^\d]/g, '')).toLocaleString('id-ID')}
              </div>
            </div>
          </div>
        )}

        <div className="h-px bg-[#2D4C41] my-4" />

        <div className="space-y-2">
          <h2 className="font-semibold">Metode Pengiriman</h2>
          <div className="flex justify-between items-center">
            <div className="text-sm">
              {deliveryMethodUI === 'kurir'
                ? 'Pengiriman oleh kurir (Yogyakarta saja)'
                : 'Ambil langsung ke gudang'}
            </div>
            <button
              className="text-sm rounded-md px-3 py-1 border border-[#1E2B32] text-[#1E2B32]"
              onClick={() => setShowMethodModal(true)}
            >
              Ganti Metode
            </button>
          </div>
        </div>

        <div className="h-px bg-[#1E2B32] my-4" />

        <div className="space-y-2">
          <h2 className="font-semibold">Tukar Poin</h2>
          <div className="flex justify-between">
            <span>Poin yang dimiliki</span>
            <span className="font-semibold">{userPoints} poin</span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <label htmlFor="usePoints" className="w-1/2">
              Poin yang ingin ditukar
            </label>
            <input
              type="number"
              id="usePoints"
              min={0}
              max={userPoints}
              value={usedPoints}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                setUsedPoints(Math.min(val, userPoints));
              }}
              className="w-24 text-right border border-[#2D4C41] rounded-md px-2 text-black bg-[#FFFF]"
            />
          </div>
          <div className="flex justify-between">
            <span>Sisa poin</span>
            <span className="font-medium">{remainingPoints} poin</span>
          </div>
          <div className="flex justify-between">
            <span>Potongan harga</span>
            <span className="font-medium">Rp {pointDiscount.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <div className="mt-4 space-y-1">
          {[
            ['Subtotal Unit Produk', `Rp ${productSubtotal.toLocaleString('id-ID')}`],
            ['Subtotal Pengiriman', `Rp ${shippingFee.toLocaleString('id-ID')}`],
            ['Voucher Poin', `Rp ${pointDiscount.toLocaleString('id-ID')}`],
            ['Total Pembayaran', `Rp ${totalPayment.toLocaleString('id-ID')}`],
          ].map(([label, value], idx) => (
            <div key={idx} className="flex justify-between">
              <span>{label}</span>
              <span>{value}</span>
            </div>
          ))}
        </div>

        <div className="text-right mt-4">
          <button className="bg-[#48635B] text-white px-6 py-2 rounded-md" onClick={handleOrder}>
            Buat Pesanan
          </button>
        </div>
      </main>
      <Footer />

      {showAddressModal && (
        <Modal title="Pilih Alamat Pengiriman" onClose={() => setShowAddressModal(false)}>
          <div className="space-y-2">
            {addresses.map((item) => (
              <label key={item.ID_ALAMAT} className="flex items-start gap-2">
                <input
                  type="radio"
                  name="shippingAddress"
                  value={item.ID_ALAMAT}
                  checked={selectedAlamatId === item.ID_ALAMAT}
                  onChange={() => setSelectedAlamatId(item.ID_ALAMAT)}
                  className="accent-[#2D4C41]"
                />
                <span>{`${item.JUDUL}: ${item.NAMA_JALAN}, ${item.DESA_KELURAHAN}, ${item.KECAMATAN}, ${item.KABUPATEN}, ${item.PROVINSI}`}</span>
              </label>
            ))}
          </div>
        </Modal>
      )}

      {showMethodModal && (
        <Modal title="Pilih Metode Pengiriman" onClose={() => setShowMethodModal(false)}>
          <div className="space-y-2">
            <label className="flex items-start gap-2">
              <input
                type="radio"
                name="metode"
                value="kurir"
                checked={deliveryMethodUI === 'kurir'}
                onChange={() => setDeliveryMethodUI('kurir')}
                className="accent-[#2D4C41]"
              />
              <span>Kurir (Yogyakarta saja)</span>
            </label>
            <label className="flex items-start gap-2">
              <input
                type="radio"
                name="metode"
                value="ambil"
                checked={deliveryMethodUI === 'ambil'}
                onChange={() => setDeliveryMethodUI('ambil')}
                className="accent-[#2D4C41]"
              />
              <span>Ambil sendiri ke gudang</span>
            </label>
          </div>
        </Modal>
      )}
    </div>
  );
}
