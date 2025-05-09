import Header from "../components/Header";
import Footer from "../components/Footer";
import macbookImage from "../assets/images.png";
import homePageImage from "../assets/homePage.jpeg";

export default function HomePage() {
  return (
    <div className="bg-[#FFF7E2] min-h-screen text-[#1E2B32]">
      <Header />

      <main className="max-w-[1300px] mx-auto px-6 space-y-0">
        {/* HERO */}
        <section className="py-8">
          <img
            src={homePageImage}
            alt="Hero"
            className="rounded-xl w-full h-[300px] object-cover shadow-sm"
          />
        </section>

        {/* KATEGORI */}
        <section className="py-10">
        <div className="flex flex-wrap justify-between gap-y-6">
            {[
            { label: "Elektronik & Gadget", icon: "bi-phone" },
            { label: "Pakaian & Aksesoris", icon: "bi-bag" },
            { label: "Perabotan Rumah Tangga", icon: "bi-house" },
            { label: "Buku, Alat Tulis, & Peralatan Sekolah", icon: "bi-book" },
            { label: "Hobi, Mainan, & Koleksi", icon: "bi-controller" },
            { label: "Perlengkapan Bayi & Anak", icon: "bi-emoji-smile" }, // diperbarui
            { label: "Otomotif & Aksesoris", icon: "bi-car-front" },
            { label: "Perlengkapan Taman & Outdoor", icon: "bi-flower2" },
            { label: "Peralatan Kantor & Industri", icon: "bi-briefcase" },
            { label: "Kosmetik & Perawatan Diri", icon: "bi-heart" },
            ].map((item, i) => (
            <div
                key={i}
                className="flex flex-col items-center w-[110px] text-center"
            >
                <i className={`text-xl text-[#48635B] ${item.icon} mb-2`}></i>
                <span className="text-[12.5px] font-medium leading-tight">{item.label}</span>
            </div>
            ))}
        </div>
        </section>

        {/* PRODUK */}
        <section className="py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Elektronik & Gadget</h2>
          </div>

          <div className="flex justify-between gap-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex flex-col items-start w-[165px]">
                <img
                  src={macbookImage}
                  alt="Produk"
                  className="h-24 object-contain mb-3 self-center"
                />
                <div className="pl-2">
                  <h3 className="text-sm font-semibold mb-0.5">MacBook Air 11"</h3>
                  <p className="text-sm font-medium mb-0.5">Rp12.000.000</p>
                  <span className="text-xs text-[#48635B]">Elektronik & Gadget</span>
                  <a href="#" className="text-xs text-black font-semibold mt-1 block">
                    Lihat Detail
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
