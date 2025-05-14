import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import homePageImage from "../assets/homePage.jpeg";
import { getAllAvailableProducts } from "../api/apiBarang";
import type { Product } from "../api/apiBarang";

type CategoryKey =
  | "elektronik"
  | "pakaian"
  | "perabotan"
  | "buku"
  | "hobi"
  | "bayi-anak"
  | "otomotif"
  | "taman-outdoor"
  | "kantor-industri"
  | "kosmetik";

const categoryMap: Record<string, CategoryKey> = {
  "Elektronik & Gadget": "elektronik",
  "Pakaian & Aksesoris": "pakaian",
  "Perabotan Rumah Tangga": "perabotan",
  "Buku & Alat Tulis": "buku",
  "Hobi, Mainan, & Koleksi": "hobi",
  "Perlengkapan Bayi & Anak": "bayi-anak",
  "Otomotif & Aksesoris": "otomotif",
  "Perlengkapan Taman & Outdoor": "taman-outdoor",
  "Peralatan Kantor & Industri": "kantor-industri",
  "Kosmetik & Perawatan Diri": "kosmetik",
};

const categories = [
  { label: "Elektronik & Gadget", icon: "bi-phone", slug: "elektronik" },
  { label: "Pakaian & Aksesoris", icon: "bi-bag", slug: "pakaian" },
  { label: "Perabotan Rumah Tangga", icon: "bi-house", slug: "perabotan" },
  { label: "Buku, Alat Tulis, & Peralatan Sekolah", icon: "bi-book", slug: "buku" },
  { label: "Hobi, Mainan, & Koleksi", icon: "bi-controller", slug: "hobi" },
  { label: "Perlengkapan Bayi & Anak", icon: "bi-emoji-smile", slug: "bayi-anak" },
  { label: "Otomotif & Aksesoris", icon: "bi-car-front", slug: "otomotif" },
  { label: "Perlengkapan Taman & Outdoor", icon: "bi-flower2", slug: "taman-outdoor" },
  { label: "Peralatan Kantor & Industri", icon: "bi-briefcase", slug: "kantor-industri" },
  { label: "Kosmetik & Perawatan Diri", icon: "bi-heart", slug: "kosmetik" },
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<"recent" | CategoryKey>("recent");
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [allFetchedProducts, setAllFetchedProducts] = useState<Record<CategoryKey, Product[]>>({
    elektronik: [],
    pakaian: [],
    perabotan: [],
    buku: [],
    hobi: [],
    "bayi-anak": [],
    otomotif: [],
    "taman-outdoor": [],
    "kantor-industri": [],
    kosmetik: [],
  });

  useEffect(() => {
    getAllAvailableProducts().then((res) => {
      const dataByCategory: Record<CategoryKey, Product[]> = {
        elektronik: [],
        pakaian: [],
        perabotan: [],
        buku: [],
        hobi: [],
        "bayi-anak": [],
        otomotif: [],
        "taman-outdoor": [],
        "kantor-industri": [],
        kosmetik: [],
      };

      res.forEach((item) => {
        const slug = categoryMap[item.category];
        if (slug) {
          dataByCategory[slug].push(item);
        }
      });

      setAllFetchedProducts(dataByCategory);
      const allItems = Object.values(dataByCategory).flat();
      const shuffled = [...allItems].sort(() => 0.5 - Math.random());
      setRecentProducts(shuffled.slice(0, 7));
    });
  }, []);

  const productList = selectedCategory === "recent" ? recentProducts : allFetchedProducts[selectedCategory];

  return (
    <div className="bg-[#FFF7E2] min-h-screen text-[#1E2B32] w-full">
      <Header />

      <main className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <motion.section className="py-8" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <img src={homePageImage} alt="Hero" className="rounded-xl w-full h-[220px] sm:h-[300px] md:h-[380px] object-cover shadow-sm" />
        </motion.section>

        <motion.section className="py-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <div className="flex flex-wrap justify-center md:justify-between gap-4">
            {categories.map((item, i) => (
              <motion.div
                key={i}
                onClick={() => setSelectedCategory(item.slug as CategoryKey)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className={`flex flex-col items-center w-[100px] text-center cursor-pointer transition-all ${
                  selectedCategory === item.slug ? "bg-[#F1EADA] rounded-lg shadow-sm p-2" : ""
                } hover:text-[#2D4C41]`}
              >
                <i className={`text-xl text-[#48635B] ${item.icon} mb-2`}></i>
                <span className="text-xs sm:text-[13px] font-medium leading-tight">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section className="py-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2 className="text-xl font-semibold mb-6">
            {selectedCategory === "recent"
              ? "Produk Terkini"
              : categories.find((c) => c.slug === selectedCategory)?.label ?? "Produk"}
          </h2>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
            >
              {productList.map((product, i) => (
                <motion.div
                  key={i}
                  className="flex flex-col items-start w-full"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <img src={product.image} alt={product.name} className="h-24 object-contain mb-2 self-center" />
                  <div className="pl-1 w-full">
                    <h3 className="text-sm font-semibold mb-0.5">{product.name}</h3>
                    <p className="text-sm font-medium mb-0.5">{product.price}</p>
                    <span className="text-xs text-[#48635B]">{product.category}</span>
                    <Link
                      to={`/produk/${product.name.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-xs text-black font-semibold mt-1 inline-block hover:underline"
                    >
                      Lihat Detail
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
