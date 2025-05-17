import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from 'lucide-react';

interface Pesanan {
  id: number;
  kode: string;
  tanggal: string;
  status: string;
  total: number;
  item_count: number;
}

export default function RiwayatPesananPage() {
  const [pesanan, setPesanan] = useState<Pesanan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const dummyData: Pesanan[] = [
        {
          id: 1,
          kode: 'INV000001',
          tanggal: '2025-05-15',
          status: 'Selesai',
          total: 250000,
          item_count: 3,
        },
        {
          id: 2,
          kode: 'INV000002',
          tanggal: '2025-05-10',
          status: 'Diproses',
          total: 180000,
          item_count: 2,
        },
        {
          id: 3,
          kode: 'INV000003',
          tanggal: '2025-04-25',
          status: 'Dibatalkan',
          total: 320000,
          item_count: 4,
        },
      ];
      setPesanan(dummyData);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'selesai':
        return {
          color: 'text-green-700',
          bg: 'bg-green-50',
          border: 'border-green-300',
          icon: <CheckCircleIcon className="w-5 h-5 text-green-600" />,
        };
      case 'dibatalkan':
        return {
          color: 'text-red-700',
          bg: 'bg-red-50',
          border: 'border-red-300',
          icon: <XCircleIcon className="w-5 h-5 text-red-600" />,
        };
      default:
        return {
          color: 'text-yellow-700',
          bg: 'bg-yellow-50',
          border: 'border-yellow-300',
          icon: <ClockIcon className="w-5 h-5 text-yellow-600" />,
        };
    }
  };

  return (
    <div className="bg-[#FFF7E2] min-h-screen text-[#1E2B32]">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-bold mb-8 text-[#1E2B32]">Riwayat Pesanan</h1>

        {loading ? (
          <div className="text-center text-lg font-medium text-[#2D4C41] py-24">
            Memuat data pesanan...
          </div>
        ) : pesanan.length === 0 ? (
          <div className="bg-yellow-100 text-yellow-700 border border-yellow-400 px-4 py-3 rounded text-center font-medium">
            Belum ada riwayat pesanan.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pesanan.map((p) => {
              const style = getStatusStyle(p.status);
              return (
                <div
                  key={p.id}
                  className={`flex flex-col justify-between bg-white border ${style.border} rounded-xl shadow hover:shadow-lg transition-all duration-300 p-6 space-y-4`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-[#1E2B32] mb-1">
                        Pesanan <span className="text-[#5B8482]">#{p.kode}</span>
                      </h3>
                      <p className="text-sm text-gray-600">
                        Tanggal:{' '}
                        {new Date(p.tanggal).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-sm text-gray-600">Total Item: {p.item_count}</p>
                      <p className="text-sm text-[#1E2B32] font-semibold mt-1">
                        Total Harga: Rp {p.total.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div
                      className={`flex items-center gap-2 px-3 py-1 rounded-full border ${style.bg} ${style.color}`}
                    >
                      {style.icon}
                      <span className="text-sm font-medium">{p.status}</span>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button className="text-sm px-4 py-2 rounded-md border border-[#5B8482] text-[#5B8482] hover:bg-[#E6F0EE] transition">
                      Lihat Detail
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
