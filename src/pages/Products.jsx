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
  ArrowRight,
  Clock,
  MapPin,
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
  const [courseFilter, setCourseFilter] = useState("all");
  const [flyingItem, setFlyingItem] = useState(null);
  const { addToCart } = useCart();
  const { t, language } = useLanguage();
  const [productsList, setProductsList] = useState([]);

  useEffect(() => {
    setProductsList([...MOCK_PRODUCTS]);
  }, []);

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
      image:
        "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=600&q=80",
      icon: <Cpu className="w-8 h-8 text-blue-600" />,
      bgIcon: "bg-blue-50 border border-blue-100",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200/80",
      titleKey: "products.categoryGrids.biosensorsTitle",
      descKey: "products.categoryGrids.biosensorsDesc",
    },
    {
      id: "Modules",
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
      icon: <Layers className="w-8 h-8 text-sky-600" />,
      bgIcon: "bg-sky-50 border border-sky-100",
      badgeColor: "bg-sky-50 text-sky-700 border-sky-200/80",
      titleKey: "products.categoryGrids.modulesTitle",
      descKey: "products.categoryGrids.modulesDesc",
    },
    {
      id: "Chemicals",
      image:
        "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80",
      icon: <FlaskConical className="w-8 h-8 text-emerald-600" />,
      bgIcon: "bg-emerald-50 border border-emerald-100",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
      titleKey: "products.categoryGrids.chemicalsTitle",
      descKey: "products.categoryGrids.chemicalsDesc",
    },
    {
      id: "Courses",
      image:
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80",
      icon: <GraduationCap className="w-8 h-8 text-purple-600" />,
      bgIcon: "bg-purple-50 border border-purple-100",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200/80",
      titleKey: "products.categoryGrids.coursesTitle",
      descKey: "products.categoryGrids.coursesDesc",
    },
    {
      id: "Accessories",
      image:
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
      icon: <Wrench className="w-8 h-8 text-slate-600" />,
      bgIcon: "bg-slate-50 border border-slate-100",
      badgeColor: "bg-slate-50 text-slate-700 border-slate-200/80",
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

  const filteredProducts = productsList.filter((product) => {
    const matchesCategory =
      activeCategory === "All" || product.category === activeCategory;
    const matchesCourseFilter =
      activeCategory !== "Courses" ||
      courseFilter === "all" ||
      (courseFilter === "labs" &&
        product.subType === "Hands-on Experimental Laboratories") ||
      (courseFilter === "courses" && product.subType === "Academic Courses");
    const productName = product.name[language] || product.name.en || "";
    const matchesSearch = productName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesCourseFilter && matchesSearch;
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
          className="fixed z-[100] w-[60px] h-[60px] border-2 border-white shadow-2xl overflow-hidden bg-white pointer-events-none flex items-center justify-center"
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
              <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-sky-500 mx-auto mt-4"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryGridItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleCategoryClick(item.id)}
                  className="group cursor-pointer overflow-hidden bg-white border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col justify-between shadow-sm hover:-translate-y-0.5"
                >
                  {/* Image Cover */}
                  <div className="h-48 sm:h-52 relative overflow-hidden bg-slate-100">
                    <img
                      src={item.image}
                      alt={t(item.titleKey)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3.5 left-3.5">
                      <span
                        className={`text-xs px-2.5 py-1 font-bold border backdrop-blur-md shadow-sm ${item.badgeColor}`}
                      >
                        {item.id.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg md:text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-2.5">
                        {t(item.titleKey)}
                      </h3>
                      <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed mb-5">
                        {t(item.descKey)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 text-xs md:text-sm font-bold text-blue-600 group-hover:text-blue-700">
                      <span>{t("products.categoryGrids.exploreMore")}</span>
                      <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </div>
                </div>
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
            <div className="bg-white/80 backdrop-blur-xl p-4 shadow-sm shadow-blue-900/5 border border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Categories */}
              <div className="flex overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar gap-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-5 py-2.5 text-sm font-bold whitespace-nowrap transition-all ${
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
                  className="w-full pl-11 pr-4 py-3 bg-slate-100 border border-transparent text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 transition-all outline-none text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Sub-filters and Descriptions for Academic & Lab Training */}
          {activeCategory === "Courses" && (
            <div className="max-w-7xl mx-auto px-6 mb-8 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setCourseFilter(courseFilter === "labs" ? "all" : "labs")
                  }
                  className={`text-left p-6 rounded-none border transition-all cursor-pointer ${
                    courseFilter === "labs"
                      ? "bg-blue-50/90 border-blue-500 shadow-md shadow-blue-500/10 ring-1 ring-blue-500"
                      : "bg-white border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2.5 py-1 rounded-none">
                      13 Laboratories
                    </span>
                    <span className="text-xs font-bold text-blue-600">
                      {courseFilter === "labs"
                        ? language === "th"
                          ? "✓ กำลังแสดงเฉพาะหมวดนี้"
                          : "✓ Active Filter"
                        : language === "th"
                          ? "คลิกเพื่อกรองเฉพาะแล็บ"
                          : "Click to Filter"}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 mb-2">
                    {language === "th"
                      ? "ห้องปฏิบัติการทดลองภาคปฏิบัติ"
                      : "Hands-on Experimental Laboratories"}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {language === "th"
                      ? "นักเรียนทำงานที่โต๊ะทดลองจริง ด้วยเครื่องมือจริง บนแพลตฟอร์มเซนเซอร์ชุดเดียวกับที่ Surazense ใช้ในงานวิจัยของตนเอง ทุกแล็บจบด้วยข้อมูลที่นักเรียนเก็บเอง"
                      : "Students work at a real bench with real instruments, on the same sensor platforms Surazense uses for its own research. Every lab ends with data the student acquired themselves."}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setCourseFilter(
                      courseFilter === "courses" ? "all" : "courses",
                    )
                  }
                  className={`text-left p-6 rounded-none border transition-all cursor-pointer ${
                    courseFilter === "courses"
                      ? "bg-indigo-50/90 border-indigo-500 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500"
                      : "bg-white border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-100/70 px-2.5 py-1 rounded-none">
                      9 Courses
                    </span>
                    <span className="text-xs font-bold text-indigo-600">
                      {courseFilter === "courses"
                        ? language === "th"
                          ? "✓ กำลังแสดงเฉพาะหมวดนี้"
                          : "✓ Active Filter"
                        : language === "th"
                          ? "คลิกเพื่อกรองเฉพาะวิชาการ"
                          : "Click to Filter"}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 mb-2">
                    {language === "th"
                      ? "รายวิชาวิชาการ"
                      : "Academic Courses"}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {language === "th"
                      ? "สัมมนาและเซสชันบนคอมพิวเตอร์ที่ให้ทฤษฎี บริบทคลินิก และระเบียบวิธีวิจัย ซึ่งผลจากโต๊ะทดลองต้องมีเพื่อกลายเป็นผลงานวิจัย ไม่จำเป็นต้องมีห้องปฏิบัติการ"
                      : "Seminar and computer-based sessions that supply the theory, clinical context and research methodology a bench result needs in order to become a research output. No laboratory facilities required."}
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="max-w-7xl mx-auto px-6">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white border border-slate-100 shadow-sm">
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
                  className="mt-6 px-6 py-2.5 bg-blue-50 text-blue-600 font-bold hover:bg-blue-100 transition-colors"
                >
                  {t("products.clearFilters")}
                </button>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 gap-6"
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
                      className="group relative cursor-pointer overflow-hidden bg-white border border-amber-200/90 hover:border-amber-400/90 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 flex flex-col sm:flex-row hover:-translate-y-0.5"
                    >
                      {/* Clickable Area for Detail Page */}
                      <Link
                        to={`/products/${product.id}`}
                        className="sm:w-72 md:w-80 h-52 sm:h-auto relative overflow-hidden bg-slate-50 shrink-0 block border-b sm:border-b-0 sm:border-r border-amber-200/60"
                      >
                        <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name[language] || product.name.en}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-slate-400 group-hover:scale-105 transition-transform duration-500 p-4">
                              <ImageIcon className="w-10 h-10 mb-2 opacity-50 stroke-[1.5px]" />
                              <span className="text-[10px] font-bold uppercase tracking-widest bg-slate-200/50 px-2.5 py-0.5">
                                Add Image Later
                              </span>
                            </div>
                          )}

                          {/* Status Badge */}
                          <div className="absolute top-3 left-3 z-10">
                            <span
                              className={`px-2.5 py-0.5 text-xs font-bold backdrop-blur-md shadow-sm ${
                                product.status === "In Stock"
                                  ? "bg-green-100/90 text-green-700 border border-green-200/60"
                                  : "bg-orange-100/90 text-orange-700 border border-orange-200/60"
                              }`}
                            >
                              {getStatusTranslation(product.status)}
                            </span>
                          </div>
                        </div>
                      </Link>

                      {/* Content */}
                      <div className="flex-1 p-6 md:p-7 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="mb-2.5 flex flex-wrap gap-2 items-center animate-fade-in">
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                              {getCategoryTranslation(product.category)}
                            </span>
                            {product.category === "Chemicals" &&
                              product.chemicalSpecs?.purity && (
                                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 border border-emerald-100">
                                  {product.chemicalSpecs.purity}
                                </span>
                              )}
                            {product.category === "Courses" &&
                              product.courseSpecs?.level && (
                                <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 border border-purple-100">
                                  {product.courseSpecs.level[language] ||
                                    product.courseSpecs.level.en}
                                </span>
                              )}
                          </div>
                          <Link
                            to={`/products/${product.id}`}
                            className="no-underline group-hover:text-blue-600 transition-colors"
                          >
                            <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                              {product.name[language] || product.name.en}
                            </h3>
                          </Link>

                          {/* Specialized visual metadata */}
                          {product.category === "Chemicals" &&
                            product.chemicalSpecs?.formula && (
                              <div className="mb-2.5 font-mono text-[11px] bg-slate-50 text-slate-600 px-2.5 py-1 border border-slate-200/60 inline-block w-fit">
                                {product.chemicalSpecs.formula}
                              </div>
                            )}
                          {product.category === "Courses" &&
                            product.courseSpecs?.duration && (
                              <div className="mb-2.5 text-[11px] font-semibold text-slate-500 flex items-center gap-2 flex-wrap">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                                  {product.courseSpecs.duration[language] ||
                                    product.courseSpecs.duration.en}
                                </span>
                                {product.courseSpecs.location && (
                                  <>
                                    <span className="text-slate-300">•</span>
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                      {product.courseSpecs.location[language] ||
                                        product.courseSpecs.location.en}
                                    </span>
                                  </>
                                )}
                              </div>
                            )}

                          <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                            {product.description[language] ||
                              product.description.en}
                          </p>
                        </div>

                        {/* Price & Action */}
                        {product.id === 1 ? (
                          <div className="mt-auto bg-amber-50 border border-amber-200/60 p-3 text-[11px] text-amber-800 leading-relaxed flex items-start gap-2 shadow-sm">
                            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <span>
                              Currently under development for research and
                              training purposes only. Not intended for use as a
                              medical device. Please visit respect training
                              website for more details.
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
                            <div className="flex flex-col">
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                {t("products.priceLabel")}
                              </span>
                              <span className="text-xl font-black text-slate-900">
                                ฿
                                {Number(product.price).toLocaleString("th-TH", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </span>
                            </div>
                            <button
                              onClick={(e) => handleAddToCart(product, e)}
                              className="w-12 h-12 bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-600 hover:to-sky-500 hover:border-transparent hover:text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all group/btn"
                              title={t("products.addToCart")}
                            >
                              <ShoppingCart className="w-5 h-5 stroke-[2px] group-hover/btn:scale-110 group-hover/btn:-rotate-6 transition-all duration-300" />
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
