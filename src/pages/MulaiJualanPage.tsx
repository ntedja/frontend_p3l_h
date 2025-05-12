import { useEffect } from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";

const MulaiJualanPage = () => {
  useEffect(() => {
    document.title = "Mulai Jualan - ReuseMart";
  }, []);

  return (
    <main className="bg-[#FFF7E2] text-[#2F3F3A] min-h-screen">
      <Header />

      <section className="text-center py-16 px-6 sm:px-10 lg:px-20">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-5xl font-extrabold mb-4"
        >
          Mulai Jualan di <span className="text-[#3E5B50]">ReuseMart</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-base sm:text-lg max-w-2xl mx-auto text-[#405C53]"
        >
          Isi formulir di bawah ini untuk menitipkan barang bekas berkualitas Anda ke ReuseMart.
          Tim kami akan menghubungi Anda untuk proses selanjutnya.
        </motion.p>
      </section>

      <section className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6 mb-20">
        <form className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium">Nama Lengkap</label>
            <input type="text" className="w-full border border-[#CFCAB5] rounded-md px-4 py-2 text-sm" required />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Nomor WhatsApp</label>
            <input type="tel" className="w-full border border-[#CFCAB5] rounded-md px-4 py-2 text-sm" required />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Email (opsional)</label>
            <input type="email" className="w-full border border-[#CFCAB5] rounded-md px-4 py-2 text-sm" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Alamat Lengkap</label>
            <textarea className="w-full border border-[#CFCAB5] rounded-md px-4 py-2 text-sm" rows={3} required></textarea>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Deskripsi Barang Bekas</label>
            <textarea className="w-full border border-[#CFCAB5] rounded-md px-4 py-2 text-sm" rows={4} placeholder="Misal: Baju anak bekas pakai 3 stel, masih sangat layak pakai..." required></textarea>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-[#3E5B50] hover:bg-[#2D4C41] text-white px-6 py-2 rounded-md shadow"
            >
              Kirim Formulir
            </button>
          </div>
        </form>
      </section>

      <Footer />
    </main>
  );
};

export default MulaiJualanPage;
