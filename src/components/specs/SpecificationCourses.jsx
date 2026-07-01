import React from "react";
import { motion } from "framer-motion";

/**
 * Specification tab content for Courses category.
 */
export default function SpecificationCourses({ product, language, t }) {
  return (
    <motion.div
      key="spec-courses"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full text-slate-800"
    >
      <div className="bg-slate-50 rounded-[2rem] border border-slate-100 p-8 space-y-8 shadow-sm">
        <h3 className="text-xl font-black text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2.5">
          {t("products.specification")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {/* Left column */}
          <div className="space-y-4">
            <div className="grid grid-cols-[140px_1fr] gap-4 items-start border-b border-slate-200/60 pb-2">
              <span className="font-bold text-slate-500 text-sm">
                {t("products.courseSpecs.duration")}
              </span>
              <span className="text-slate-900 text-sm font-bold">
                {product.courseSpecs?.duration[language] ||
                  product.courseSpecs?.duration.en}
              </span>
            </div>
            <div className="grid grid-cols-[140px_1fr] gap-4 items-start border-b border-slate-200/60 pb-2">
              <span className="font-bold text-slate-500 text-sm">
                {t("products.courseSpecs.level")}
              </span>
              <span className="text-purple-700 text-sm font-semibold bg-purple-50 border border-purple-100 px-2.5 py-0.5 rounded-md w-fit">
                {product.courseSpecs?.level[language] ||
                  product.courseSpecs?.level.en}
              </span>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <div className="grid grid-cols-[140px_1fr] gap-4 items-start border-b border-slate-200/60 pb-2">
              <span className="font-bold text-slate-500 text-sm">
                {t("products.courseSpecs.location")}
              </span>
              <span className="text-slate-900 text-sm">
                {(product.courseSpecs?.location &&
                  (product.courseSpecs.location[language] ||
                    product.courseSpecs.location.en)) ||
                  "N/A"}
              </span>
            </div>
            <div className="grid grid-cols-[140px_1fr] gap-4 items-start border-b border-slate-200/60 pb-2">
              <span className="font-bold text-slate-500 text-sm">
                {t("products.courseSpecs.deliveryMode")}
              </span>
              <span className="text-slate-900 text-sm font-medium">
                {(product.courseSpecs?.deliveryMode &&
                  (product.courseSpecs.deliveryMode[language] ||
                    product.courseSpecs.deliveryMode.en)) ||
                  "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Curriculum */}
        {product.courseSpecs?.curriculum && (
          <div className="border-t border-slate-200/60 pt-6">
            <h4 className="font-extrabold text-slate-800 mb-4">
              {t("products.courseSpecs.curriculum")}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(
                product.courseSpecs.curriculum[language] ||
                product.courseSpecs.curriculum.en
              ).map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm"
                >
                  <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-700">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
