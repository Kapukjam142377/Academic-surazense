import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShoppingCart, ChevronRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { MOCK_PRODUCTS } from "../data/mockProducts";
import { useLanguage } from "../context/LanguageContext";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState("Product Information");
  const [flyingItem, setFlyingItem] = useState(null);
  const { t, language } = useLanguage();

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

  const getTabLabel = (tab) => {
    switch (tab) {
      case "Product Information":
        return t("products.productInfo");
      case "Specification":
        return t("products.specification");
      case "Assay Documents":
        return t("products.assayDocuments");
      default:
        return tab;
    }
  };

  // Find the product
  const product = MOCK_PRODUCTS.find((p) => p.id === parseInt(id));

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!product) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex flex-col items-center justify-center bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          {t("products.productNotFound")}
        </h2>
        <Link
          to="/products"
          className="text-blue-600 hover:underline flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> {t("products.backToStore")}
        </Link>
      </div>
    );
  }

  const TABS = ["Product Information", "Specification", "Assay Documents"];

  // Animation handler
  const handleAddToCart = (e) => {
    if (flyingItem) return;

    const buttonRect = e.currentTarget.getBoundingClientRect();
    const cartIcon = document.getElementById("global-cart-icon");

    if (cartIcon) {
      const cartRect = cartIcon.getBoundingClientRect();

      setFlyingItem({
        id: Date.now(),
        image: product.image,
        startX: buttonRect.left + buttonRect.width / 2,
        startY: buttonRect.top + buttonRect.height / 2,
        endX: cartRect.left + cartRect.width / 2,
        endY: cartRect.top + cartRect.height / 2,
      });

      addToCart(product);

      setTimeout(() => {
        setFlyingItem(null);
      }, 1000);
    } else {
      addToCart(product);
    }
  };

  return (
    <div className="bg-white min-h-screen pt-28 pb-24 relative overflow-hidden">
      {/* Flying Item Animation */}
      {flyingItem && (
        <motion.div
          initial={{
            x: flyingItem.startX - 30,
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
          transition={{ duration: 1.0, ease: [0.32, 0.72, 0, 1] }}
          className="fixed z-[100] w-[60px] h-[60px] rounded-full border-2 border-slate-200 shadow-2xl overflow-hidden bg-white pointer-events-none flex items-center justify-center"
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

      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link
            to="/products"
            className="hover:text-blue-600 transition-colors"
          >
            {t("nav.products")}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-800 font-medium">
            {getCategoryTranslation(product.category)}
          </span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-800 font-medium">
            {product.name[language] || product.name.en}
          </span>
        </div>

        {/* Title and Tabs Header */}
        <div className="mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl text-blue-700 italic mb-6 tracking-tight font-medium"
            style={{
              fontFamily: "'Inter', sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            {(product.name[language] || product.name.en).toUpperCase()}
          </motion.h1>

          <div className="flex flex-wrap items-center gap-4 text-lg md:text-xl border-b border-slate-200 pb-2">
            {TABS.map((tab, idx) => (
              <React.Fragment key={tab}>
                <button
                  onClick={() => setActiveTab(tab)}
                  className={`font-semibold transition-colors bg-transparent border-none p-0 cursor-pointer ${
                    activeTab === tab
                      ? "text-slate-900"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {getTabLabel(tab)}
                </button>
                {idx < TABS.length - 1 && (
                  <div className="w-[2px] h-6 bg-blue-700 mx-2"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left Column: Image and Carousel Indicators */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col items-center"
          >
            <div className="w-full aspect-[4/3] relative flex items-center justify-center mb-8">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name[language] || product.name.en}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-slate-50 flex items-center justify-center rounded-2xl text-slate-400">
                  {language === "th"
                    ? "ไม่มีรูปภาพสินค้า"
                    : "No Image Available"}
                </div>
              )}
            </div>

            {/* Carousel Indicators (Mock) */}
            <div className="flex items-center justify-center gap-4">
              {[0, 1, 2, 3, 4].map((idx) => (
                <div
                  key={idx}
                  className={`h-2.5 transition-colors cursor-pointer ${idx === 0 ? "w-12 bg-slate-400" : "w-12 bg-slate-300 hover:bg-slate-400"}`}
                ></div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Description */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col h-full"
          >
            <AnimatePresence mode="wait">
              {activeTab === "Product Information" && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-slate-900">
                    {t("products.productInfo")}
                  </h2>
                  <p className="text-slate-700 leading-relaxed text-lg text-justify">
                    {product.description[language] || product.description.en}
                  </p>
                </motion.div>
              )}

              {activeTab === "Specification" && product.category === "Chemicals" && (
                <motion.div
                  key="spec-chemicals"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full text-slate-800"
                >
                  <div className="bg-slate-50 rounded-[2rem] border border-slate-100 p-8 space-y-6 shadow-sm">
                    <h3 className="text-xl font-black text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2.5">
                      <span className="text-emerald-500">🧪</span> {t("products.specification")}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-[140px_1fr] gap-4 items-start border-b border-slate-200/60 pb-2">
                          <span className="font-bold text-slate-500 text-sm">{t("products.chemicalSpecs.formula")}</span>
                          <span className="text-slate-900 font-mono text-sm">{product.chemicalSpecs?.formula || "N/A"}</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] gap-4 items-start border-b border-slate-200/60 pb-2">
                          <span className="font-bold text-slate-500 text-sm">{t("products.chemicalSpecs.purity")}</span>
                          <span className="text-emerald-700 text-sm font-bold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md w-fit">{product.chemicalSpecs?.purity || "N/A"}</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] gap-4 items-start border-b border-slate-200/60 pb-2">
                          <span className="font-bold text-slate-500 text-sm">{t("products.chemicalSpecs.mw")}</span>
                          <span className="text-slate-900 text-sm">{product.chemicalSpecs?.mw || "N/A"}</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-[140px_1fr] gap-4 items-start border-b border-slate-200/60 pb-2">
                          <span className="font-bold text-slate-500 text-sm">{t("products.chemicalSpecs.appearance")}</span>
                          <span className="text-slate-900 text-sm">{(product.chemicalSpecs?.appearance && (product.chemicalSpecs.appearance[language] || product.chemicalSpecs.appearance.en)) || "N/A"}</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] gap-4 items-start border-b border-slate-200/60 pb-2">
                          <span className="font-bold text-slate-500 text-sm">{t("products.chemicalSpecs.storage")}</span>
                          <span className="text-blue-700 text-sm font-semibold bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-md w-fit">
                            {(product.chemicalSpecs?.storage && (product.chemicalSpecs.storage[language] || product.chemicalSpecs.storage.en)) || "N/A"}
                          </span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] gap-4 items-start border-b border-slate-200/60 pb-2">
                          <span className="font-bold text-slate-500 text-sm">{t("products.chemicalSpecs.volumeWeight")}</span>
                          <span className="text-slate-900 text-sm">{(product.chemicalSpecs?.volumeWeight && (product.chemicalSpecs.volumeWeight[language] || product.chemicalSpecs.volumeWeight.en)) || product.chemicalSpecs?.volumeWeight || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "Specification" && product.category === "Courses" && (
                <motion.div
                  key="spec-courses"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full text-slate-800"
                >
                  <div className="bg-slate-50 rounded-[2rem] border border-slate-100 p-8 space-y-8 shadow-sm">
                    <h3 className="text-xl font-black text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2.5">
                      <span className="text-purple-500">🎓</span> {t("products.specification")}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-[140px_1fr] gap-4 items-start border-b border-slate-200/60 pb-2">
                          <span className="font-bold text-slate-500 text-sm">{t("products.courseSpecs.duration")}</span>
                          <span className="text-slate-900 text-sm font-bold">{product.courseSpecs?.duration[language] || product.courseSpecs?.duration.en}</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] gap-4 items-start border-b border-slate-200/60 pb-2">
                          <span className="font-bold text-slate-500 text-sm">{t("products.courseSpecs.level")}</span>
                          <span className="text-purple-700 text-sm font-semibold bg-purple-50 border border-purple-100 px-2.5 py-0.5 rounded-md w-fit">
                            {product.courseSpecs?.level[language] || product.courseSpecs?.level.en}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-[140px_1fr] gap-4 items-start border-b border-slate-200/60 pb-2">
                          <span className="font-bold text-slate-500 text-sm">{t("products.courseSpecs.location")}</span>
                          <span className="text-slate-900 text-sm">{(product.courseSpecs?.location && (product.courseSpecs.location[language] || product.courseSpecs.location.en)) || "N/A"}</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] gap-4 items-start border-b border-slate-200/60 pb-2">
                          <span className="font-bold text-slate-500 text-sm">{t("products.courseSpecs.deliveryMode")}</span>
                          <span className="text-slate-900 text-sm font-medium">{(product.courseSpecs?.deliveryMode && (product.courseSpecs.deliveryMode[language] || product.courseSpecs.deliveryMode.en)) || "N/A"}</span>
                        </div>
                      </div>
                    </div>

                    {product.courseSpecs?.curriculum && (
                      <div className="border-t border-slate-200/60 pt-6">
                        <h4 className="font-extrabold text-slate-800 mb-4">{t("products.courseSpecs.curriculum")}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {(product.courseSpecs.curriculum[language] || product.courseSpecs.curriculum.en).map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                              <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
                                {idx + 1}
                              </span>
                              <span className="text-xs font-semibold text-slate-700">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "Specification" && product.category !== "Chemicals" && product.category !== "Courses" && (
                <motion.div
                  key="spec-hardware"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full text-slate-800"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                    {/* Left Column: Model */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-slate-900">
                        {t("products.model")}
                      </h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-[140px_1fr] gap-4 items-start">
                          <span className="font-bold text-slate-900">
                            {t("products.model")}
                          </span>
                          <span className="text-slate-700">{product.specs?.model || "Xzense-101"}</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] gap-4 items-start">
                          <span className="font-bold text-slate-900">
                            {t("products.portableDevices")}
                          </span>
                          <span className="text-slate-700">{product.specs?.dimensions || "XXX x XX"}</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] gap-4 items-start">
                          <span className="font-bold text-slate-900">
                            {t("products.weight")}
                          </span>
                          <span className="text-slate-700">{product.specs?.weight || "0.3 kg"}</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] gap-4 items-start">
                          <span className="font-bold text-slate-900">
                            {t("products.minimumBuying")}
                          </span>
                          <span className="text-slate-700">
                            {product.specs?.minOrder
                              ? (product.specs.minOrder[language] || product.specs.minOrder.en)
                              : (language === "th" ? "1 เครื่อง" : "1 device")}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Selector */}
                      <div className="pt-8 flex items-center gap-4">
                        <span className="font-bold text-slate-900 text-lg">
                          {t("products.quantity")}
                        </span>
                        <div className="relative">
                          <select className="appearance-none border-2 border-slate-900 rounded-md py-1.5 pl-3 pr-10 font-medium text-slate-900 bg-white focus:outline-none w-28 text-center cursor-pointer">
                            {[1, 2, 3, 4, 5, 10].map((num) => (
                              <option key={num} value={num}>
                                {num}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none bg-slate-900 border-l-2 border-slate-900 rounded-r-md">
                            <svg
                              className="w-5 h-5 fill-current text-white"
                              viewBox="0 0 20 20"
                            >
                              <path
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                                fillRule="evenodd"
                              ></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Specification */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-slate-900">
                        {t("products.specification")}
                      </h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-[160px_1fr] gap-4 items-start">
                          <span className="font-bold text-slate-900">
                            {t("products.principle")}
                          </span>
                          <span className="text-slate-700">
                            {product.specs?.principle
                              ? (product.specs.principle[language] || product.specs.principle.en)
                              : (language === "th" ? "ปรากฏการณ์เพียโซอิเล็กทริก" : "Piezoelectric effect")}
                          </span>
                        </div>
                        <div className="grid grid-cols-[160px_1fr] gap-4 items-start">
                          <span className="font-bold text-slate-900">
                            {t("products.sensorType")}
                          </span>
                          <span className="text-slate-700">
                            {product.specs?.sensorType
                              ? (product.specs.sensorType[language] || product.specs.sensorType.en)
                              : (language === "th" ? "เครื่องตรวจวัดมวลแบบควอตซ์คริสตัล (QCM)" : "Piezoelectric Quartz Crystal Microbalance (QCM)")}
                          </span>
                        </div>
                        <div className="grid grid-cols-[160px_1fr] gap-4 items-start">
                          <span className="font-bold text-slate-900">
                            {t("products.frequencyRange")}
                          </span>
                          <span className="text-slate-700">{product.specs?.frequencyRange || "1 MHz ถึง 100 MHz"}</span>
                        </div>
                        <div className="grid grid-cols-[160px_1fr] gap-4 items-start">
                          <span className="font-bold text-slate-900">
                            {t("products.signalMeasurement")}
                          </span>
                          <span className="text-slate-700">
                            {product.specs?.signalMeasurement
                              ? (product.specs.signalMeasurement[language] || product.specs.signalMeasurement.en)
                              : (language === "th" ? "การตรวจวัดแอมพลิจูดและความถี่แบบเรียลไทม์" : "Amplitude and real-time frequency monitoring")}
                          </span>
                        </div>
                        <div className="grid grid-cols-[160px_1fr] gap-4 items-start">
                          <span className="font-bold text-slate-900">
                            {t("products.holderDesign")}
                          </span>
                          <span className="text-slate-700">
                            {product.specs?.holderDesign
                              ? (product.specs.holderDesign[language] || product.specs.holderDesign.en)
                              : (language === "th" ? "แท่นยึดแบบถอดได้เพื่อความสะดวกในการหยดสารละลาย" : "Detachable holder for easy liquid media application")}
                          </span>
                        </div>
                        <div className="grid grid-cols-[160px_1fr] gap-4 items-start">
                          <span className="font-bold text-slate-900 whitespace-nowrap">
                            {t("products.connectionInterface")}
                          </span>
                          <span className="text-slate-700">
                            {product.specs?.connectionInterface
                              ? (product.specs.connectionInterface[language] || product.specs.connectionInterface.en)
                              : (language === "th" ? "ขั้วต่อแบบสปริง (Pogo-pin)" : "Pogo-pin connector")}
                          </span>
                        </div>
                        <div className="grid grid-cols-[160px_1fr] gap-4 items-start">
                          <span className="font-bold text-slate-900">
                            {t("products.powerSupply")}
                          </span>
                          <span className="text-slate-700">
                            {product.specs?.powerSupply
                              ? (product.specs.powerSupply[language] || product.specs.powerSupply.en)
                              : (language === "th" ? "จ่ายไฟผ่านพอร์ต USB" : "USB-powered")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "Assay Documents" && (
                <motion.div
                  key="assay"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-slate-900">
                    {t("products.assayDocuments")}
                  </h2>
                  <p className="text-slate-500 italic text-lg">
                    {t("products.assayDesc")}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Price and Add to Cart Section */}
            <div className="mt-16 pt-8 border-t border-slate-100 flex items-end justify-between">
              <div>
                <span className="block text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">
                  {t("products.priceLabel")}
                </span>
                <span className="text-4xl font-black text-slate-900">
                  ${product.price.toFixed(2)}
                </span>
              </div>
              <button
                onClick={handleAddToCart}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 transition-all flex items-center gap-3 cursor-pointer border-none outline-none"
              >
                <ShoppingCart className="w-5 h-5" />
                {t("products.addToCart")}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
