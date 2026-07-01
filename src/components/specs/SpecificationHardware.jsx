import React from "react";
import { motion } from "framer-motion";

/**
 * Specification tab content for hardware products (Biosensors, Modules, Accessories, etc.).
 */
export default function SpecificationHardware({ product, language, t }) {
  return (
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
              <span className="text-slate-700">
                {product.specs?.model || "Xzense-101"}
              </span>
            </div>
            <div className="grid grid-cols-[140px_1fr] gap-4 items-start">
              <span className="font-bold text-slate-900">
                {t("products.portableDevices")}
              </span>
              <span className="text-slate-700">
                {product.specs?.dimensions || "XXX x XX"}
              </span>
            </div>
            <div className="grid grid-cols-[140px_1fr] gap-4 items-start">
              <span className="font-bold text-slate-900">
                {t("products.weight")}
              </span>
              <span className="text-slate-700">
                {product.specs?.weight || "0.3 kg"}
              </span>
            </div>
            <div className="grid grid-cols-[140px_1fr] gap-4 items-start">
              <span className="font-bold text-slate-900">
                {t("products.minimumBuying")}
              </span>
              <span className="text-slate-700">
                {product.specs?.minOrder
                  ? product.specs.minOrder[language] ||
                    product.specs.minOrder.en
                  : language === "th"
                    ? "1 เครื่อง"
                    : "1 device"}
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
                  />
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
                  ? product.specs.principle[language] ||
                    product.specs.principle.en
                  : language === "th"
                    ? "ปรากฏการณ์เพียโซอิเล็กทริก"
                    : "Piezoelectric effect"}
              </span>
            </div>
            <div className="grid grid-cols-[160px_1fr] gap-4 items-start">
              <span className="font-bold text-slate-900">
                {t("products.sensorType")}
              </span>
              <span className="text-slate-700">
                {product.specs?.sensorType
                  ? product.specs.sensorType[language] ||
                    product.specs.sensorType.en
                  : language === "th"
                    ? "เครื่องตรวจวัดมวลแบบควอตซ์คริสตัล (QCM)"
                    : "Piezoelectric Quartz Crystal Microbalance (QCM)"}
              </span>
            </div>
            <div className="grid grid-cols-[160px_1fr] gap-4 items-start">
              <span className="font-bold text-slate-900">
                {t("products.frequencyRange")}
              </span>
              <span className="text-slate-700">
                {product.specs?.frequencyRange || "1 MHz ถึง 100 MHz"}
              </span>
            </div>
            <div className="grid grid-cols-[160px_1fr] gap-4 items-start">
              <span className="font-bold text-slate-900">
                {t("products.signalMeasurement")}
              </span>
              <span className="text-slate-700">
                {product.specs?.signalMeasurement
                  ? product.specs.signalMeasurement[language] ||
                    product.specs.signalMeasurement.en
                  : language === "th"
                    ? "การตรวจวัดแอมพลิจูดและความถี่แบบเรียลไทม์"
                    : "Amplitude and real-time frequency monitoring"}
              </span>
            </div>
            <div className="grid grid-cols-[160px_1fr] gap-4 items-start">
              <span className="font-bold text-slate-900">
                {t("products.holderDesign")}
              </span>
              <span className="text-slate-700">
                {product.specs?.holderDesign
                  ? product.specs.holderDesign[language] ||
                    product.specs.holderDesign.en
                  : language === "th"
                    ? "แท่นยึดแบบถอดได้เพื่อความสะดวกในการหยดสารละลาย"
                    : "Detachable holder for easy liquid media application"}
              </span>
            </div>
            <div className="grid grid-cols-[160px_1fr] gap-4 items-start">
              <span className="font-bold text-slate-900 whitespace-nowrap">
                {t("products.connectionInterface")}
              </span>
              <span className="text-slate-700">
                {product.specs?.connectionInterface
                  ? product.specs.connectionInterface[language] ||
                    product.specs.connectionInterface.en
                  : language === "th"
                    ? "ขั้วต่อแบบสปริง (Pogo-pin)"
                    : "Pogo-pin connector"}
              </span>
            </div>
            <div className="grid grid-cols-[160px_1fr] gap-4 items-start">
              <span className="font-bold text-slate-900">
                {t("products.powerSupply")}
              </span>
              <span className="text-slate-700">
                {product.specs?.powerSupply
                  ? product.specs.powerSupply[language] ||
                    product.specs.powerSupply.en
                  : language === "th"
                    ? "จ่ายไฟผ่านพอร์ต USB"
                    : "USB-powered"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
