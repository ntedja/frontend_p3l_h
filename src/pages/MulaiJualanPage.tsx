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

      <section className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8 mb-20 border border-[#E1DBC0]">
        <form className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-semibold text-[#3E5B50]">Nama Lengkap</label>
            <input
              type="text"
              className="w-full border border-[#CFCAB5] bg-white text-[#2F3F3A] rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#3E5B50] focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold text-[#3E5B50]">Nomor WhatsApp</label>
            <input
              type="tel"
              className="w-full border border-[#CFCAB5] bg-white text-[#2F3F3A] rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#3E5B50] focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold text-[#3E5B50]">Email (opsional)</label>
            <input
              type="email"
              className="w-full border border-[#CFCAB5] bg-white text-[#2F3F3A] rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#3E5B50] focus:outline-none"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold text-[#3E5B50]">Alamat Lengkap</label>
            <textarea
              className="w-full border border-[#CFCAB5] bg-white text-[#2F3F3A] rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#3E5B50] focus:outline-none"
              rows={3}
              required
            ></textarea>
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold text-[#3E5B50]">Deskripsi Barang Bekas</label>
            <textarea
              className="w-full border border-[#CFCAB5] bg-white text-[#2F3F3A] rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#3E5B50] focus:outline-none"
              rows={4}
              placeholder="Misal: Baju anak bekas pakai 3 stel, masih sangat layak pakai..."
              required
            ></textarea>
          </div>

          <div className="text-center pt-4">
            <button
              type="submit"
              className="bg-[#3E5B50] hover:bg-[#2D4C41] text-white px-8 py-2.5 rounded-full shadow-md transition-all duration-200"
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