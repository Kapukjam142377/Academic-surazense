import React from "react";
import { motion } from "framer-motion";

/**
 * Specification tab content for Chemicals category.
 */
export default function SpecificationChemicals({ product, language, t }) {
  return (
    <motion.div
      key="spec-chemicals"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full text-slate-800"
    >
      <div className="bg-slate-50 rounded-[2rem] border border-slate-100 p-8 space-y-6 shadow-sm">
        <h3 className="text-xl font-black text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2.5">
          <span className="text-emerald-500">🧪</span>{" "}
          {t("products.specification")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {/* Left column */}
          <div className="space-y-4">
            <div className="grid grid-cols-[140px_1fr] gap-4 items-start border-b border-slate-200/60 pb-2">
              <span className="font-bold text-slate-500 text-sm">
                {t("products.chemicalSpecs.formula")}
              </span>
              <span className="text-slate-900 font-mono text-sm">
                {product.chemicalSpecs?.formula || "N/A"}
              </span>
            </div>
            <div className="grid grid-cols-[140px_1fr] gap-4 items-start border-b border-slate-200/60 pb-2">
              <span className="font-bold text-slate-500 text-sm">
                {t("products.chemicalSpecs.purity")}
              </span>
              <span className="text-emerald-700 text-sm font-bold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md w-fit">
                {product.chemicalSpecs?.purity || "N/A"}
              </span>
            </div>
            <div className="grid grid-cols-[140px_1fr] gap-4 items-start border-b border-slate-200/60 pb-2">
              <span className="font-bold text-slate-500 text-sm">
                {t("products.chemicalSpecs.mw")}
              </span>
              <span className="text-slate-900 text-sm">
                {product.chemicalSpecs?.mw || "N/A"}
              </span>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <div className="grid grid-cols-[140px_1fr] gap-4 items-start border-b border-slate-200/60 pb-2">
              <span className="font-bold text-slate-500 text-sm">
                {t("products.chemicalSpecs.appearance")}
              </span>
              <span className="text-slate-900 text-sm">
                {(product.chemicalSpecs?.appearance &&
                  (product.chemicalSpecs.appearance[language] ||
                    product.chemicalSpecs.appearance.en)) ||
                  "N/A"}
              </span>
            </div>
            <div className="grid grid-cols-[140px_1fr] gap-4 items-start border-b border-slate-200/60 pb-2">
              <span className="font-bold text-slate-500 text-sm">
                {t("products.chemicalSpecs.storage")}
              </span>
              <span className="text-blue-700 text-sm font-semibold bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-md w-fit">
                {(product.chemicalSpecs?.storage &&
                  (product.chemicalSpecs.storage[language] ||
                    product.chemicalSpecs.storage.en)) ||
                  "N/A"}
              </span>
            </div>
            <div className="grid grid-cols-[140px_1fr] gap-4 items-start border-b border-slate-200/60 pb-2">
              <span className="font-bold text-slate-500 text-sm">
                {t("products.chemicalSpecs.volumeWeight")}
              </span>
              <span className="text-slate-900 text-sm">
                {(product.chemicalSpecs?.volumeWeight &&
                  (product.chemicalSpecs.volumeWeight[language] ||
                    product.chemicalSpecs.volumeWeight.en)) ||
                  product.chemicalSpecs?.volumeWeight ||
                  "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
