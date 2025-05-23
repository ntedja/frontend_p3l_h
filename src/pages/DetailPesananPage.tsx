import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Barang {
  id: number;
  nama: string;
  jumlah: number;
  harga: number;
  rating: number; // dari 1–5
}

export default function DetailPesananPage() {
  const { id } = useParams();
  const [barang, setBarang] = useState<Barang[]>([]);

  useEffect(() => {
    // Dummy data berdasarkan id pesanan
    const dataDummy: Record<string, Barang[]> = {
      '1': [
        { id: 1, nama: 'Sabun Organik', jumlah: 1, harga: 80000, rating: 0 },
        { id: 2, nama: 'Sikat Bambu', jumlah: 2, harga: 85000, rating: 0 },
      ],
      '2': [
        { id: 3, nama: 'Piring Daur Ulang', jumlah: 1, harga: 180000, rating: 0 },
      ],
      '3': [
        { id: 4, nama: 'Botol Stainless', jumlah: 2, harga: 160000, rating: 0 },
      ],
    };

    if (id && dataDummy[id]) {
      setBarang(dataDummy[id]);
    }
  }, [id]);

  const handleRating = (barangId: number, rating: number) => {
    setBarang((prev) =>
      prev.map((item) =>
        item.id === barangId ? { ...item, rating } : item
      )
    );
  };

  return (
    <div className="bg-[#FFF7E2] min-h-screen text-[#1E2B32]">
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-6">Detail Pesanan #{id}</h1>
        {barang.map((item) => (
          <div key={item.id} className="mb-6 p-4 border border-[#5B8482] rounded-lg bg-white shadow-sm">
            <h2 className="text-lg font-semibold">{item.nama}</h2>
            <p className="text-sm text-gray-700">Jumlah: {item.jumlah}</p>
            <p className="text-sm text-gray-700 mb-2">Harga: Rp {item.harga.toLocaleString('id-ID')}</p>
            <div className="flex items-center gap-1">
              <p className="text-sm">Rating:</p>
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  onClick={() => handleRating(item.id, val)}
                  className={`text-lg ${
                    item.rating >= val ? 'text-yellow-500' : 'text-gray-400'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        ))}
      </main>
      <Footer />
    </div>
  );
}
