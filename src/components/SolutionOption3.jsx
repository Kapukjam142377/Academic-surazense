import React from "react";
import { motion } from "framer-motion";

const SolutionOption3 = ({ steps }) => {
  return (
    <div className="w-full relative py-12 md:py-24 mb-12 flex flex-col items-center overflow-hidden">
      {/* Background Decor */}
      <div
        className="absolute inset-0 bg-transparent opacity-[0.03] z-0"
        style={{
          backgroundImage: "radial-gradient(#185FA5 2px, transparent 2px)",
          backgroundSize: "40px 40px",
        }}
      ></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-blue-100 z-0 opacity-50"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-blue-200 z-0 opacity-50 border-dashed"></div>

      {/* Central Hub (Result) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
        className="w-[280px] h-[280px] md:w-[320px] md:h-[320px] bg-gradient-to-br from-[#0C447C] to-blue-900 rounded-full flex flex-col items-center justify-center p-8 text-center text-white relative z-20 shadow-[0_0_80px_rgba(12,68,124,0.3)] border-8 border-white group"
      >
        {/* Glow */}
        <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-[30px] group-hover:bg-blue-400/40 transition-colors duration-700"></div>
        <div className="relative z-10 w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm border border-white/20">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
            <polyline points="5 10 9 5 13 9 19 3" />
          </svg>
        </div>
        <div className="flex items-center gap-1.5 mb-2 bg-white/20 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
          </span>
          <span className="text-[10px] uppercase font-bold text-white tracking-wider">
            Live Result
          </span>
        </div>
        <h4 className="text-[18px] font-extrabold mb-1 relative z-10 leading-tight">
          Cancer Signal
        </h4>
        <h4 className="text-[18px] font-extrabold relative z-10 text-blue-200">
          Detection
        </h4>
      </motion.div>

      {/* Orbiting Steps */}
      <div className="absolute inset-0 pointer-events-none z-10 hidden md:block">
        {/* Step 1: Top Left */}
        <motion.div
          initial={{ opacity: 0, x: -50, y: -50 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: false }}
          transition={{
            delay: 0.6,
            duration: 1.2,
            type: "spring",
            bounce: 0.3,
          }}
          className="absolute top-[10%] left-[15%] w-[240px] bg-white p-5 rounded-2xl shadow-lg border border-slate-100 pointer-events-auto"
        >
          <div className="flex items-center gap-4 mb-3 border-b border-slate-50 pb-3">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {steps[0].icon}
              </svg>
            </div>
            <div>
              <div className="text-[10px] font-black uppercase text-slate-400">
                Step 1
              </div>
              <div className="font-bold text-[#0C447C] leading-tight">
                {steps[0].title}
              </div>
            </div>
          </div>
          <p className="text-[13px] text-slate-500 leading-relaxed">
            {steps[0].desc}
          </p>
        </motion.div>

        {/* Step 2: Top Right */}
        <motion.div
          initial={{ opacity: 0, x: 50, y: -50 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: false }}
          transition={{
            delay: 1.0,
            duration: 1.2,
            type: "spring",
            bounce: 0.3,
          }}
          className="absolute top-[10%] right-[15%] w-[240px] bg-white p-5 rounded-2xl shadow-lg border border-slate-100 pointer-events-auto"
        >
          <div className="flex items-center gap-4 mb-3 border-b border-slate-50 pb-3">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {steps[1].icon}
              </svg>
            </div>
            <div>
              <div className="text-[10px] font-black uppercase text-slate-400">
                Step 2
              </div>
              <div className="font-bold text-[#0C447C] leading-tight">
                {steps[1].title}
              </div>
            </div>
          </div>
          <p className="text-[13px] text-slate-500 leading-relaxed">
            {steps[1].desc}
          </p>
        </motion.div>

        {/* Step 3: Bottom Right */}
        <motion.div
          initial={{ opacity: 0, x: 50, y: 50 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: false }}
          transition={{
            delay: 1.4,
            duration: 1.2,
            type: "spring",
            bounce: 0.3,
          }}
          className="absolute bottom-[10%] right-[15%] w-[240px] bg-white p-5 rounded-2xl shadow-lg border border-slate-100 pointer-events-auto"
        >
          <div className="flex items-center gap-4 mb-3 border-b border-slate-50 pb-3">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {steps[2].icon}
              </svg>
            </div>
            <div>
              <div className="text-[10px] font-black uppercase text-slate-400">
                Step 3
              </div>
              <div className="font-bold text-[#0C447C] leading-tight">
                {steps[2].title}
              </div>
            </div>
          </div>
          <p className="text-[13px] text-slate-500 leading-relaxed">
            {steps[2].desc}
          </p>
        </motion.div>

        {/* Step 4: Bottom Left */}
        <motion.div
          initial={{ opacity: 0, x: -50, y: 50 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: false }}
          transition={{
            delay: 1.8,
            duration: 1.2,
            type: "spring",
            bounce: 0.3,
          }}
          className="absolute bottom-[10%] left-[15%] w-[240px] bg-white p-5 rounded-2xl shadow-lg border border-slate-100 pointer-events-auto"
        >
          <div className="flex items-center gap-4 mb-3 border-b border-slate-50 pb-3">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {steps[3].icon}
              </svg>
            </div>
            <div>
              <div className="text-[10px] font-black uppercase text-slate-400">
                Step 4
              </div>
              <div className="font-bold text-[#0C447C] leading-tight">
                {steps[3].title}
              </div>
            </div>
          </div>
          <p className="text-[13px] text-slate-500 leading-relaxed">
            {steps[3].desc}
          </p>
        </motion.div>
      </div>

      {/* Mobile fallback for Circular (Just stack them) */}
      <div className="w-full flex flex-col md:hidden gap-4 px-6 mt-8 relative z-30">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-2xl shadow border border-slate-100 flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {step.icon}
              </svg>
            </div>
            <div>
              <div className="text-[10px] font-black uppercase text-blue-500">
                Step {step.num}
              </div>
              <div className="font-bold text-[#0C447C]">{step.title}</div>
              <div className="text-[12px] text-slate-500 mt-1 line-clamp-1">
                {step.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SolutionOption3;
