import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  FlaskConical,
  GraduationCap,
  Users,
  Clock,
  Beaker,
  BookOpen,
  MapPin,
  Layers,
  Timer,
  Dna,
  Cpu,
  Sparkles,
  Activity,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { KTS_OVERVIEW_STATS } from "../data/ktsProgramme";

const STAT_ICONS = {
  FlaskConical,
  GraduationCap,
  Users,
  Clock,
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

export function KtsOverviewSection() {
  const { language, t } = useLanguage();

  return (
    <section
      id="kts-overview"
      className="max-w-7xl mx-auto px-4 sm:px-6 mb-16 md:mb-24 relative z-10 w-full min-w-0 scroll-mt-24"
    >
      <div className="text-center mb-10 md:mb-12">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-bold text-blue-600 uppercase tracking-[0.2em] mb-3"
        >
          {t("academic.ktsOverviewEyebrow")}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight px-1"
        >
          {t("academic.ktsOverviewTitle")}
        </motion.h2>
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5"
      >
        {KTS_OVERVIEW_STATS.map((stat) => {
          const Icon = STAT_ICONS[stat.icon] || Clock;
          const value =
            language === "th" && stat.valueTh ? stat.valueTh : stat.value;
          const label = language === "th" ? stat.labelTh : stat.labelEn;
          return (
            <motion.article
              key={stat.id}
              variants={fadeUp}
              className="min-w-0 bg-white/90 backdrop-blur-sm border border-slate-100 rounded-2xl md:rounded-[1.5rem] p-4 sm:p-5 md:p-6 shadow-sm shadow-slate-900/5 flex flex-col gap-2 hover:border-blue-200/70 hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <p className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight break-words leading-tight">
                {value}
              </p>
              <p className="text-[11px] sm:text-xs font-semibold text-slate-500 leading-snug">
                {label}
              </p>
            </motion.article>
          );
        })}
      </motion.div>
    </section>
  );
}

export function KtsCompareSection() {
  const { t } = useLanguage();

  const columns = [
    {
      id: "labs",
      accent: "from-sky-500 to-blue-600",
      iconWrap: "bg-sky-50 text-sky-700",
      Icon: Beaker,
      title: t("academic.handsOnLabs"),
      lead: t("academic.ktsHandsOnLead"),
      rows: [
        {
          icon: Layers,
          label: t("academic.ktsFormat"),
          value: t("academic.ktsHandsOnFormat"),
        },
        {
          icon: MapPin,
          label: t("academic.ktsVenue"),
          value: t("academic.ktsHandsOnVenue"),
        },
        {
          icon: BookOpen,
          label: t("academic.ktsTopics"),
          value: t("academic.ktsHandsOnTopics"),
        },
        {
          icon: Timer,
          label: t("academic.ktsLength"),
          value: t("academic.ktsHandsOnLength"),
        },
        {
          icon: Users,
          label: t("academic.ktsGroupSize"),
          value: t("academic.ktsHandsOnGroup"),
        },
      ],
    },
    {
      id: "courses",
      accent: "from-indigo-500 to-violet-600",
      iconWrap: "bg-indigo-50 text-indigo-700",
      Icon: GraduationCap,
      title: t("academic.academicCoursesShort"),
      lead: t("academic.ktsAcademicLead"),
      rows: [
        {
          icon: Layers,
          label: t("academic.ktsFormat"),
          value: t("academic.ktsAcademicFormat"),
        },
        {
          icon: MapPin,
          label: t("academic.ktsVenue"),
          value: t("academic.ktsAcademicVenue"),
        },
        {
          icon: BookOpen,
          label: t("academic.ktsTopics"),
          value: t("academic.ktsAcademicTopics"),
        },
        {
          icon: Timer,
          label: t("academic.ktsLength"),
          value: t("academic.ktsAcademicLength"),
        },
        {
          icon: Users,
          label: t("academic.ktsGroupSize"),
          value: t("academic.ktsAcademicGroup"),
        },
      ],
    },
  ];

  return (
    <section
      id="kts-compare"
      className="max-w-7xl mx-auto px-4 sm:px-6 mb-16 md:mb-24 relative z-10 w-full min-w-0 scroll-mt-24"
    >
      <div className="text-center mb-10 md:mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight px-1"
        >
          {t("academic.ktsHowDiffer")}
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-8">
        {columns.map((col) => (
          <motion.article
            key={col.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="min-w-0 bg-white border border-slate-100 rounded-[1.75rem] md:rounded-[2rem] p-5 sm:p-8 shadow-sm relative overflow-hidden"
          >
            <div
              className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${col.accent}`}
            />
            <div className="flex items-start gap-3 mb-4 min-w-0">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${col.iconWrap}`}
              >
                <col.Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug pt-1 min-w-0">
                {col.title}
              </h3>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              {col.lead}
            </p>
            <dl className="space-y-3">
              {col.rows.map((row) => (
                <div
                  key={row.label}
                  className="flex gap-3 items-start min-w-0 rounded-xl bg-slate-50/80 border border-slate-100 px-3 py-3"
                >
                  <row.icon className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {row.label}
                    </dt>
                    <dd className="text-sm font-semibold text-slate-700 break-words">
                      {row.value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export function KtsHeroOrnaments() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden z-0"
      aria-hidden="true"
    >
      <Dna className="absolute top-16 right-[8%] w-16 h-16 text-sky-300/30 rotate-12 hidden md:block" />
      <Cpu className="absolute bottom-10 left-[10%] w-12 h-12 text-indigo-300/25 hidden md:block" />
      <Sparkles className="absolute top-28 left-[14%] w-8 h-8 text-blue-400/25 hidden lg:block" />
      <Activity className="absolute bottom-20 right-[18%] w-10 h-10 text-sky-400/20 hidden lg:block" />
    </div>
  );
}
