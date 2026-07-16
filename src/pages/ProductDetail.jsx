import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShoppingCart, AlertCircle } from "lucide-react";
import { MOCK_PRODUCTS } from "../data/mockProducts";
import { useLanguage } from "../context/LanguageContext";
import { useAddToCart } from "../hooks/useAddToCart";
import ProductBreadcrumb from "../components/ProductBreadcrumb";
import ProductImagePanel from "../components/ProductImagePanel";
import SpecificationChemicals from "../components/specs/SpecificationChemicals";
import SpecificationCourses from "../components/specs/SpecificationCourses";
import SpecificationHardware from "../components/specs/SpecificationHardware";

const TABS = ["Product Information", "Specification", "Assay Documents"];

const getCategoryTranslation = (cat, t) => {
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

const getTabLabel = (tab, t) => {
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

export default function ProductDetail() {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState("Product Information");

  const product = MOCK_PRODUCTS.find((p) => p.id === parseInt(id));
  const { flyingItem, handleAddToCart } = useAddToCart(product);

  // Scroll to top on mount / id change
  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => window.scrollTo(0, 0), 50);
    return () => clearTimeout(timer);
  }, [id]);

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
            <div className="w-full h-full bg-blue-500" />
          )}
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumbs */}
        <ProductBreadcrumb
          product={product}
          language={language}
          getCategoryTranslation={(cat) => getCategoryTranslation(cat, t)}
          t={t}
        />

        {/* Title and Tabs */}
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
                  {getTabLabel(tab, t)}
                </button>
                {idx < TABS.length - 1 && (
                  <div className="w-[2px] h-6 bg-blue-700 mx-2" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left: Image */}
          <ProductImagePanel product={product} language={language} />

          {/* Right: Tab Content */}
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

              {activeTab === "Specification" &&
                product.category === "Chemicals" && (
                  <SpecificationChemicals
                    product={product}
                    language={language}
                    t={t}
                  />
                )}

              {activeTab === "Specification" &&
                product.category === "Courses" && (
                  <SpecificationCourses
                    product={product}
                    language={language}
                    t={t}
                  />
                )}

              {activeTab === "Specification" &&
                product.category !== "Chemicals" &&
                product.category !== "Courses" && (
                  <SpecificationHardware
                    product={product}
                    language={language}
                    t={t}
                  />
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

            {/* Price and Add to Cart */}
            {product.id === 1 ? (
              <div className="mt-16 pt-8 border-t border-slate-100">
                <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-5 text-[13px] md:text-sm text-amber-800 leading-relaxed flex items-start gap-3.5 shadow-sm">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Currently under development for research and training purposes only. Not intended for use as a medical device. Please visit respect training website for more details.
                  </span>
                </div>
              </div>
            ) : (
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
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
