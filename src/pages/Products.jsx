import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Search,
  Filter,
  Image as ImageIcon,
  Cpu,
  Layers,
  FlaskConical,
  GraduationCap,
  Wrench,
  AlertCircle,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { MOCK_PRODUCTS } from "../data/mockProducts";
import { useLanguage } from "../context/LanguageContext";

const CATEGORIES = [
  "All",
  "Biosensors",
  "Modules",
  "Chemicals",
  "Courses",
  "Accessories",
];

export default function Products() {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [flyingItem, setFlyingItem] = useState(null);
  const { addToCart } = useCart();
  const { t, language } = useLanguage();

  useEffect(() => {
    if (location.state?.category) {
      setActiveCategory(location.state.category);
      setTimeout(() => {
        const element = document.getElementById("product-catalog-section");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    }
  }, [location.state]);

  const categoryGridItems = [
    {
      id: "Biosensors",
      icon: <Cpu className="w-8 h-8 text-blue-600" />,
      bgIcon: "bg-blue-50 border border-blue-100",
      titleKey: "products.categoryGrids.biosensorsTitle",
      descKey: "products.categoryGrids.biosensorsDesc",
    },
    {
      id: "Modules",
      icon: <Layers className="w-8 h-8 text-sky-600" />,
      bgIcon: "bg-sky-50 border border-sky-100",
      titleKey: "products.categoryGrids.modulesTitle",
      descKey: "products.categoryGrids.modulesDesc",
    },
    {
      id: "Chemicals",
      icon: <FlaskConical className="w-8 h-8 text-emerald-600" />,
      bgIcon: "bg-emerald-50 border border-emerald-100",
      titleKey: "products.categoryGrids.chemicalsTitle",
      descKey: "products.categoryGrids.chemicalsDesc",
    },
    {
      id: "Courses",
      icon: <GraduationCap className="w-8 h-8 text-purple-600" />,
      bgIcon: "bg-purple-50 border border-purple-100",
      titleKey: "products.categoryGrids.coursesTitle",
      descKey: "products.categoryGrids.coursesDesc",
    },
    {
      id: "Accessories",
      icon: <Wrench className="w-8 h-8 text-slate-600" />,
      bgIcon: "bg-slate-50 border border-slate-100",
      titleKey: "products.categoryGrids.accessoriesTitle",
      descKey: "products.categoryGrids.accessoriesDesc",
    },
  ];

  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName);
    setTimeout(() => {
      const element = document.getElementById("product-catalog-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const getCategoryTranslation = (cat) => {
    switch (cat) {
      case "All":
        return t("products.categories.all");
      case "Biosensors":
        return t("products.categories.biosensors");
      case "Modules":
        return t("products.categories.modules");
      case "Chemicals":
        return t("products.categories.chemicals");
      case "Courses":
        return t("products.categories.courses");
      case "Accessories":
        return t("products.categories.accessories");
      default:
        return cat;
    }
  };

  const getStatusTranslation = (status) => {
    switch (status) {
      case "In Stock":
        return t("products.statuses.inStock");
      case "Low Stock":
        return t("products.statuses.lowStock");
      default:
        return status;
    }
  };

  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchesCategory =
      activeCategory === "All" || product.category === activeCategory;
    const productName = product.name[language] || product.name.en || "";
    const matchesSearch = productName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product, e) => {
    // Prevent multiple animations at once to avoid glitches
    if (flyingItem) return;

    const buttonRect = e.currentTarget.getBoundingClientRect();
    const cartIcon = document.getElementById("global-cart-icon");

    if (cartIcon) {
      const cartRect = cartIcon.getBoundingClientRect();

      // Calculate coordinates relative to viewport
      setFlyingItem({
        id: Date.now(),
        image: product.image,
        startX: buttonRect.left + buttonRect.width / 2,
        startY: buttonRect.top + buttonRect.height / 2,
        endX: cartRect.left + cartRect.width / 2,
        endY: cartRect.top + cartRect.height / 2,
      });

      // Add to cart immediately so the number updates during the flight
      addToCart(product);

      // Remove the flying element after the animation duration (1000ms)
      setTimeout(() => {
        setFlyingItem(null);
      }, 1000);
    } else {
      // Fallback if cart icon is not found
      addToCart(product);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24 relative">
      {/* Flying Item Animation */}
      {flyingItem && (
        <motion.div
          initial={{
            x: flyingItem.startX - 30, // -30 to center the 60px element
            y: flyingItem.startY - 30,
            scale: 1,
            opacity: 1,
          }}
          animate={{
            x: flyingItem.endX - 30,
            y: flyingItem.endY - 30,
            scale: 0.1,
            opacity: 0.2,
          }}
          transition={{
            duration: 1.0,
            ease: [0.32, 0.72, 0, 1], // Elegant ease-out curve
          }}
          className="fixed z-[100] w-[60px] h-[60px] rounded-full border-2 border-white shadow-2xl overflow-hidden bg-white pointer-events-none flex items-center justify-center"
          style={{ top: 0, left: 0 }}
        >
          {flyingItem.image ? (
            <img
              src={flyingItem.image}
              alt="flying"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-blue-500"></div>
          )}
        </motion.div>
      )}

      {/* Category Grid Section (Like IDT / U2Bio Reference) */}
      <AnimatePresence>
        {activeCategory === "All" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="max-w-7xl mx-auto px-6 pt-16 mb-16 overflow-hidden"
          >
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-snug">
                {t("products.categoryGrids.title")}
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-sky-500 mx-auto mt-4 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {categoryGridItems.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{
                    y: -6,
                    boxShadow:
                      "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                  onClick={() => handleCategoryClick(item.id)}
                  className="bg-white rounded-[2rem] p-8 border border-slate-100 flex flex-col justify-between items-center text-center cursor-pointer transition-all duration-300 group hover:border-blue-200/50 hover:shadow-xl hover:shadow-blue-950/5 relative overflow-hidden"
                >
                  {/* Subtle top indicator bar */}
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-600 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="flex flex-col items-center">
                    {/* Circle Icon Box */}
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${item.bgIcon}`}
                    >
                      {item.icon}
                    </div>

                    <h3 className="text-lg font-black text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                      {t(item.titleKey)}
                    </h3>

                    <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-[200px]">
                      {t(item.descKey)}
                    </p>
                  </div>

                  <button className="mt-6 text-xs font-bold text-blue-600 bg-transparent border-none cursor-pointer flex items-center gap-1 group-hover:text-blue-700 select-none uppercase tracking-widest">
                    {t("products.categoryGrids.exploreMore")}
                    <span className="group-hover:translate-x-0.5 transition-transform">
                      →
                    </span>
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {activeCategory !== "All" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="pt-16"
        >
          {/* Back to Categories Link */}
          <div className="max-w-7xl mx-auto px-6 mb-6">
            <button
              onClick={() => setActiveCategory("All")}
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors bg-transparent border-none cursor-pointer p-0 outline-none group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">
                ←
              </span>
              <span>
                {language === "th"
                  ? "กลับไปหน้าหมวดหมู่หลัก"
                  : "Back to Main Categories"}
              </span>
            </button>
          </div>

          {/* Controls Section (Filters & Search) */}
          <div
            id="product-catalog-section"
            className="max-w-7xl mx-auto px-6 mb-10 sticky top-[80px] z-30"
          >
            <div className="bg-white/80 backdrop-blur-xl p-4 rounded-3xl shadow-sm shadow-blue-900/5 border border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Categories */}
              <div className="flex overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar gap-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                      activeCategory === category
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {getCategoryTranslation(category)}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full md:w-72">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={t("products.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-100 border border-transparent rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 transition-all outline-none text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="max-w-7xl mx-auto px-6">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <Filter className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {t("products.noProducts")}
                </h3>
                <p className="text-slate-500">{t("products.adjustSearch")}</p>
                <button
                  onClick={() => {
                    setActiveCategory("All");
                    setSearchQuery("");
                  }}
                  className="mt-6 px-6 py-2.5 bg-blue-50 text-blue-600 font-bold rounded-full hover:bg-blue-100 transition-colors"
                >
                  {t("products.clearFilters")}
                </button>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      key={product.id}
                      className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden group hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-1 transition-all duration-300 flex flex-col"
                    >
                      {/* Clickable Area for Detail Page */}
                      <Link
                        to={`/products/${product.id}`}
                        className="block overflow-hidden relative"
                      >
                        <div className="aspect-[4/3] bg-slate-50 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name[language] || product.name.en}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-slate-400 group-hover:scale-105 transition-transform duration-500">
                              <ImageIcon className="w-12 h-12 mb-3 opacity-50 stroke-[1.5px]" />
                              <span className="text-[10px] font-bold uppercase tracking-widest bg-slate-200/50 px-3 py-1 rounded-full">
                                Add Image Later
                              </span>
                            </div>
                          )}

                          {/* Status Badge */}
                          <div className="absolute top-4 left-4 z-10">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${
                                product.status === "In Stock"
                                  ? "bg-green-100/80 text-green-700 border border-green-200/50"
                                  : "bg-orange-100/80 text-orange-700 border border-orange-200/50"
                              }`}
                            >
                              {getStatusTranslation(product.status)}
                            </span>
                          </div>
                        </div>
                      </Link>

                      {/* Content */}
                      <div className="p-8 flex flex-col flex-1">
                        <div className="mb-3 flex flex-wrap gap-2 items-center animate-fade-in">
                          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                            {getCategoryTranslation(product.category)}
                          </span>
                          {product.category === "Chemicals" &&
                            product.chemicalSpecs?.purity && (
                              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                                {product.chemicalSpecs.purity}
                              </span>
                            )}
                          {product.category === "Courses" &&
                            product.courseSpecs?.level && (
                              <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                                {product.courseSpecs.level[language] ||
                                  product.courseSpecs.level.en}
                              </span>
                            )}
                        </div>
                        <Link
                          to={`/products/${product.id}`}
                          className="no-underline group-hover:text-blue-600 transition-colors"
                        >
                          <h3 className="text-xl font-extrabold text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                            {product.name[language] || product.name.en}
                          </h3>
                        </Link>

                        {/* Specialized visual metadata */}
                        {product.category === "Chemicals" &&
                          product.chemicalSpecs?.formula && (
                            <div className="mb-3 font-mono text-[11px] bg-slate-50 text-slate-600 px-2.5 py-1 rounded-md border border-slate-200/60 inline-block w-fit">
                              {product.chemicalSpecs.formula}
                            </div>
                          )}
                        {product.category === "Courses" &&
                          product.courseSpecs?.duration && (
                            <div className="mb-3 text-[11px] font-semibold text-slate-500 flex items-center gap-1.5 flex-wrap">
                              <span>
                                ⏱️{" "}
                                {product.courseSpecs.duration[language] ||
                                  product.courseSpecs.duration.en}
                              </span>
                              <span className="text-slate-300">•</span>
                              <span>
                                📍{" "}
                                {product.courseSpecs.location[language] ||
                                  product.courseSpecs.location.en}
                              </span>
                            </div>
                          )}

                        <p className="text-sm text-slate-500 mb-8 line-clamp-2 flex-1 leading-relaxed">
                          {product.description[language] ||
                            product.description.en}
                        </p>

                        {/* Price & Action */}
                        {product.id === 1 ? (
                          <div className="mt-auto bg-amber-50 border border-amber-200/60 rounded-2xl p-4 text-[12px] text-amber-800 leading-relaxed flex items-start gap-2.5 shadow-sm">
                            <AlertCircle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
                            <span>
                              Currently under development for research and
                              training purposes only. Not intended for use as a
                              medical device. Please visit respect training
                              website for more details.
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex flex-col">
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                {t("products.priceLabel")}
                              </span>
                              <span className="text-2xl font-black text-slate-900">
                                ${product.price.toFixed(2)}
                              </span>
                            </div>
                            <button
                              onClick={(e) => handleAddToCart(product, e)}
                              className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-600 hover:to-sky-500 hover:border-transparent hover:text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all group/btn"
                              title={t("products.addToCart")}
                            >
                              <ShoppingCart className="w-6 h-6 stroke-[2px] group-hover/btn:scale-110 group-hover/btn:-rotate-6 transition-all duration-300" />
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
