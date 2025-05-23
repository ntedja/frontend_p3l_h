import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState } from 'react';

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-[#2D4C41] mb-4">{title}</h3>
        {children}
        <div className="flex justify-end gap-2 mt-6">
          <button
            className="text-sm px-4 py-2 text-gray-600 hover:underline"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            className="bg-[#48635B] text-white px-4 py-2 rounded-md hover:bg-[#469778]"
            onClick={onClose}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const savedAddresses = [
    "Jalan Dirgantara III No.143C, Catur Tunggal, Depok, Sleman, DI Yogyakarta",
    "Jalan Kaliurang Km. 10, Ngaglik, Sleman, DI Yogyakarta",
    "Perumahan Griya Mahkota, Jalan Magelang, Sleman, DI Yogyakarta"
  ];

  const [deliveryMethod, setDeliveryMethod] = useState<'kurir' | 'ambil'>('kurir');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showMethodModal, setShowMethodModal] = useState(false);
  const [address, setAddress] = useState(savedAddresses[0]);

  const pointValue = 100;
  const userPoints = 200;
  const [usedPoints, setUsedPoints] = useState(0);

  const productSubtotal = 12000000;
  const serviceFee = 2500;
  const pointDiscount = usedPoints * pointValue;

  const rawShippingFee = productSubtotal >= 1500000 ? 0 : 100000;
  const shippingFee = deliveryMethod === 'kurir' ? rawShippingFee : 0;

  const totalPayment = Math.max(productSubtotal + shippingFee + serviceFee - pointDiscount, 0);
  const remainingPoints = userPoints - usedPoints;

  return (
    <div className="bg-[#FFF7E2] text-[#1E2B32] min-h-screen">
      <Header />
      <main className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="p-6 space-y-6">
          <h2 className="font-semibold text-[#2D4C41]">Alamat Pengiriman</h2>
          <div className="flex justify-between items-start gap-4 flex-wrap">
            <div className="text-sm text-[#2D4C41]">
              <p className="font-medium">Nicholas Xaverius</p>
              <p>(+62) 812312534545</p>
            </div>
            {deliveryMethod === 'kurir' && (
              <div className="flex-1 text-sm text-[#2D4C41] text-center">
                <p>{address}</p>
              </div>
            )}
            {deliveryMethod === 'kurir' && (
              <div className="text-right">
                <button
                  className="text-sm rounded-md px-3 py-1 border border-[#1E2B32] text-[#1E2B32] hover:bg-[#1E2B32] hover:text-white"
                  onClick={() => setShowAddressModal(true)}
                >
                  Ubah Alamat
                </button>
              </div>
            )}
          </div>

          <div className="h-px bg-[#1E2B32]" />

          <div className="grid grid-cols-4 items-start gap-4 py-6">
            <div className="flex flex-col items-start gap-3">
              <div className="flex items-center gap-2">
                <img src="/avatar.png" alt="Penitip" className="w-8 h-8 rounded-full" />
                <p className="text-base font-semibold text-[#2D4C41]">Xena Putri</p>
              </div>
              <div className="flex items-center gap-3">
                <img src="/macbook.png" alt="MacBook Air" className="w-14 h-14 rounded-md" />
                <p className="text-lg font-semibold text-[#2D4C41]">MacBook Air 11”</p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center">
              <p className="text-base font-semibold">Harga Satuan</p>
              <p className="text-lg font-semibold mt-2">Rp12.000.000</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <p className="text-base font-semibold">Jumlah</p>
              <p className="text-lg font-semibold mt-2">1</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <p className="text-base font-semibold">Subtotal Produk</p>
              <p className="text-lg font-semibold mt-2">Rp12.000.000</p>
            </div>
          </div>

          <div className="h-px bg-[#1E2B32]" />

          <div className="space-y-2">
            <h2 className="text-base font-semibold text-[#2D4C41]">Metode Pengiriman</h2>
            <div className="flex justify-between items-center">
              <div className="text-sm">
                {deliveryMethod === 'kurir'
                  ? 'Pengiriman oleh kurir (Yogyakarta saja)'
                  : 'Ambil langsung ke gudang'}
              </div>
              <button
                className="text-sm rounded-md px-3 py-1 border border-[#1E2B32] text-[#1E2B32] hover:bg-[#1E2B32] hover:text-white"
                onClick={() => setShowMethodModal(true)}
              >
                Ganti Metode
              </button>
            </div>
          </div>

          <div className="h-px bg-[#1E2B32]" />

          <div className="space-y-2">
            <h2 className="text-base font-semibold text-[#2D4C41]">Tukar Poin</h2>
            <div className="space-y-1.5 text-sm text-[#2D4C41]">
              <div className="flex justify-between">
                <span>Poin yang dimiliki</span>
                <span className="font-semibold">{userPoints} poin</span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <label htmlFor="usePoints" className="w-1/2">Poin yang ingin ditukar</label>
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
                  className="w-24 text-right px-3 py-1 border border-[#2D4C41] rounded-md bg-[#FFFDF5] text-[#2D4C41] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#2D4C41]"
                  placeholder="0"
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
          </div>

          <div className="pt-4 text-sm ml-auto w-fit space-y-1">
            {[
              ['Subtotal Unit Produk', `Rp ${productSubtotal.toLocaleString('id-ID')}`],
              ['Subtotal Pengiriman', `Rp ${shippingFee.toLocaleString('id-ID')}`],
              ['Biaya Layanan', `Rp ${serviceFee.toLocaleString('id-ID')}`],
              ['Voucher Poin', `Rp ${pointDiscount.toLocaleString('id-ID')}`],
              ['Total Pembayaran', `Rp ${totalPayment.toLocaleString('id-ID')}`],
            ].map(([label, value], idx) => (
              <div key={idx} className="flex">
                <div className="min-w-[200px] text-left pr-4">{label}</div>
                <div className="text-left">{value}</div>
              </div>
            ))}
          </div>

          <div className="text-right pt-4">
            <button
  className="bg-[#48635B] text-white px-6 py-2 rounded-md hover:bg-[#469778]"
  onClick={() => {
    const orderData = {
      nama: 'Nicholas Xaverius',
      alamat: deliveryMethod === 'kurir' ? address : 'Ambil sendiri ke gudang',
      metodePengiriman: deliveryMethod,
      poinDitukar: usedPoints,
      potonganPoin: pointDiscount,
      subtotalProduk: productSubtotal,
      biayaPengiriman: shippingFee,
      biayaLayanan: serviceFee,
      totalPembayaran: totalPayment,
    };
    console.log('Pesanan dibuat:', orderData);
    alert('Pesanan berhasil dibuat!');
  }}
>
  Buat Pesanan
</button>
          </div>
        </div>
      </main>
      <Footer />

      {showAddressModal && (
        <Modal title="Pilih Alamat Pengiriman" onClose={() => setShowAddressModal(false)}>
          <div className="space-y-2 text-sm text-[#2D4C41]">
            {savedAddresses.map((item, idx) => (
              <label key={idx} className="flex items-start gap-2">
                <input
                  type="radio"
                  name="shippingAddress"
                  value={item}
                  checked={address === item}
                  onChange={() => setAddress(item)}
                  className="mt-1 accent-[#2D4C41]"
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </Modal>
      )}

      {showMethodModal && (
        <Modal title="Pilih Metode Pengiriman" onClose={() => setShowMethodModal(false)}>
          <div className="space-y-2 text-sm text-[#2D4C41]">
            <label className="flex items-start gap-2">
              <input
                type="radio"
                name="metode"
                value="kurir"
                checked={deliveryMethod === 'kurir'}
                onChange={() => setDeliveryMethod('kurir')}
                className="mt-1 accent-[#2D4C41]"
              />
              <span>Kurir (hanya wilayah Yogyakarta)</span>
            </label>
            <label className="flex items-start gap-2">
              <input
                type="radio"
                name="metode"
                value="ambil"
                checked={deliveryMethod === 'ambil'}
                onChange={() => setDeliveryMethod('ambil')}
                className="mt-1 accent-[#2D4C41]"
              />
              <span>Ambil sendiri ke gudang</span>
            </label>
          </div>
        </Modal>
      )}
    </div>
  );
}
