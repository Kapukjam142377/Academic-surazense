import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

/**
 * Breadcrumb navigation for ProductDetail page.
 */
export default function ProductBreadcrumb({
  product,
  language,
  getCategoryTranslation,
  t,
}) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
      <Link to="/products" className="hover:text-blue-600 transition-colors">
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
  );
}
