import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import {
  Newspaper,
  Pin,
  Calendar,
  Tag,
  Search,
  ArrowRight,
  X,
  Clock,
  Sparkles,
  Megaphone,
  BellRing,
  AlertCircle,
  Eye,
  Share2,
} from "lucide-react";

// Mock Fallback Announcements for offline / initial demo
const MOCK_ANNOUNCEMENTS = [
  {
    id: 1,
    title: "SuraZense Launches Xzense-101 Next-Gen Biosensor System",
    summary:
      "Revolutionary quartz crystal microbalance system offering sub-nanogram resolution for real-time cfDNA and protein binding kinetics.",
    content: `We are thrilled to announce the official launch of Xzense-101, our flagship quartz crystal microbalance (QCM) liquid biosensor analyzer. 

### Key Highlights:
- Sub-nanogram Sensitivity: Detect trace liquid phase mass loading down to 0.1 ng/cm².
- Real-Time Kinetics: Monitor molecular association and dissociation rates dynamically.
- Automated Temperature Control: Integrated Peltier thermal stabilization from 15°C to 45°C.
- Seamless Cloud Analytics: Push frequency shift and dissipation metrics directly to the SuraZense Cloud Suite.

For commercial inquiries or demonstration requests at your research institution, please contact our academic partnerships team.`,
    category: "news",
    image_url:
      "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1000&q=80",
    is_published: true,
    is_pinned: true,
    author_id: 1,
    created_at: "2026-08-01T09:00:00Z",
    updated_at: "2026-08-01T09:00:00Z",
  },
  {
    id: 2,
    title: "SuraZense Wins National MedTech Innovation Award 2026",
    summary:
      "Recognized for groundbreaking contributions to early-stage liquid biopsy diagnostic technology.",
    content: `SuraZense Co., Ltd. has been awarded the prestigious National MedTech Innovation Award 2026 for our advanced QCM surface acoustic biosensor platform.

The award recognizes our interdisciplinary team of biomedical engineers, biochemists, and software architects working together to democratize early cancer detection and point-of-care biomaterial characterization.

Special thanks to our institutional collaborators and clinical research partners across Southeast Asia for their continued support!`,
    category: "news",
    image_url:
      "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1000&q=80",
    is_published: true,
    is_pinned: true,
    author_id: 1,
    created_at: "2026-07-25T14:30:00Z",
    updated_at: "2026-07-25T14:30:00Z",
  },
  {
    id: 3,
    title: "Scheduled System Maintenance & Cloud API Upgrade",
    summary:
      "Cloud platform maintenance scheduled for August 10th, 2026 from 02:00 AM to 04:00 AM UTC.",
    content: `Please be advised that the SuraZense Cloud & Analytics API will undergo scheduled infrastructure upgrades.

- Downtime Window: August 10, 2026 (02:00 - 04:00 UTC)
- Impact: Real-time QCM scan sync will be paused. Offline scanning on local USB/serial connections remains unaffected.
- Improvements: Enhanced WebSocket bandwidth, faster report generation, and automated PDF export pipeline.`,
    category: "system",
    image_url:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80",
    is_published: true,
    is_pinned: false,
    author_id: 2,
    created_at: "2026-07-20T11:15:00Z",
    updated_at: "2026-07-20T11:15:00Z",
  },
  {
    id: 4,
    title:
      "Special Workshop: QCM Surface Functionalization & Biomarker Binding",
    summary:
      "Join our hands-on academic training session on SAM gold coating and antibody immobilisation.",
    content: `We are hosting a 2-day intensive academic workshop on Self-Assembled Monolayer (SAM) Gold Crystal Functionalization.

### Workshop Topics:
1. Gold sensor cleaning & UV-ozone pre-treatment.
2. Thiol/EDC-NHS surface chemistry optimization.
3. Quantifying ligand loading density via Sauerbrey equation.
4. Kinetic modeling using SuraZense Analyzer Software.

*Limited seats available for university researchers and graduate students.*`,
    category: "promotion",
    image_url:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80",
    is_published: true,
    is_pinned: false,
    author_id: 1,
    created_at: "2026-07-15T08:00:00Z",
    updated_at: "2026-07-15T08:00:00Z",
  },
  {
    id: 5,
    title: "Peer-Reviewed Publication in Journal of Bioanalytical Chemistry",
    summary:
      "Our clinical validation report on cell-free DNA sensing using gold-nanoparticle enhancement is now published.",
    content: `Our landmark study titled "Multi-harmonic QCM Analysis of Circulating Tumor DNA in Human Plasma Samples" has been officially published in the Journal of Bioanalytical Chemistry.

This paper details how multi-frequency resonant damping analysis can discriminate target biomarker binding from non-specific matrix fouling in complex patient serum samples.`,
    category: "medical",
    image_url:
      "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1000&q=80",
    is_published: true,
    is_pinned: false,
    author_id: 1,
    created_at: "2026-07-02T16:45:00Z",
    updated_at: "2026-07-02T16:45:00Z",
  },
];

const CATEGORIES = [
  {
    id: "all",
    label_en: "All News",
    label_th: "ข่าวสารทั้งหมด",
    icon: Megaphone,
  },
  { id: "general", label_en: "General", label_th: "ทั่วไป", icon: Newspaper },
  {
    id: "news",
    label_en: "News & Releases",
    label_th: "ข่าวประชาสัมพันธ์",
    icon: Sparkles,
  },
  {
    id: "promotion",
    label_en: "Events & Workshops",
    label_th: "อบรม & สัมมนา",
    icon: BellRing,
  },
  {
    id: "system",
    label_en: "System Updates",
    label_th: "อัปเดตระบบ",
    icon: AlertCircle,
  },
  {
    id: "medical",
    label_en: "Research & Medical",
    label_th: "วิจัย & การแพทย์",
    icon: Tag,
  },
];

export default function News() {
  const { language } = useLanguage();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Detail Modal State
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const API_URL = import.meta.env.PROD
    ? ""
    : import.meta.env.VITE_API_URL || "http://34.87.78.35:8000";

  // Fetch Announcements from GET /api/announcements
  const fetchAnnouncements = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${API_URL}/api/announcements?is_published=true`;
      if (selectedCategory !== "all") {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
      }

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const data = await res.json();
      setAnnouncements(data && data.length > 0 ? data : MOCK_ANNOUNCEMENTS);
    } catch (err) {
      console.warn(
        "Backend announcements API offline, using fallback mock data:",
        err.message,
      );
      // Filter local mock data if offline
      let mockFiltered = MOCK_ANNOUNCEMENTS.filter((a) => a.is_published);
      if (selectedCategory !== "all") {
        mockFiltered = mockFiltered.filter(
          (a) => a.category === selectedCategory,
        );
      }
      setAnnouncements(mockFiltered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [selectedCategory]);

  // Fetch Single Announcement Detail GET /api/announcements/{id}
  const handleOpenDetail = async (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowDetailModal(true);
    setLoadingDetail(true);

    try {
      const res = await fetch(
        `${API_URL}/api/announcements/${announcement.id}`,
      );
      if (res.ok) {
        const fullData = await res.json();
        setSelectedAnnouncement(fullData);
      }
    } catch (err) {
      console.warn("Could not fetch full announcement detail from API:", err);
    } finally {
      setLoadingDetail(false);
    }
  };

  // Filter announcements by search query
  const filteredAnnouncements = announcements.filter((item) => {
    const term = searchQuery.toLowerCase().trim();
    if (!term) return true;
    return (
      item.title?.toLowerCase().includes(term) ||
      item.summary?.toLowerCase().includes(term) ||
      item.content?.toLowerCase().includes(term) ||
      item.category?.toLowerCase().includes(term)
    );
  });

  const pinnedItems = filteredAnnouncements.filter((a) => a.is_pinned);
  const regularItems = filteredAnnouncements.filter((a) => !a.is_pinned);

  // Date Formatter
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(language === "th" ? "th-TH" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case "news":
        return "bg-sky-500/10 text-sky-400 border-sky-500/20";
      case "promotion":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "system":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "medical":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      default:
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    }
  };

  return (
    <div className="min-h-screen pb-20 pt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-900/40 via-purple-900/30 to-slate-900/80 border border-slate-700/50 p-8 sm:p-12 mb-12 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles className="w-4 h-4 animate-pulse" />
            {language === "th"
              ? "ข่าวสาร & ประกาศสถาบัน"
              : "Official News & Announcements"}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            {language === "th"
              ? "ข่าวสาร อัปเดต และงานวิจัย SuraZense"
              : "SuraZense News & Insights"}
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8">
            {language === "th"
              ? "ติดตามข่าวสารการพัฒนาเทคโนโลยีไบโอเซนเซอร์ งานวิจัยตีพิมพ์ รางวัลนวัตกรรม และการอัปเดตระบบวิเคราะห์ QCM"
              : "Discover our latest achievements, research publications, product releases, and platform system announcements."}
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === "th"
                  ? "ค้นหาข่าวสาร เช่น Xzense-101, งานวิจัย, รางวัล..."
                  : "Search news by keyword..."
              }
              className="w-full pl-12 pr-10 py-3.5 bg-slate-900/80 text-white placeholder-slate-400 border border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap border ${
                isActive
                  ? "bg-sky-500 text-white border-sky-400 shadow-lg shadow-sky-500/20 scale-[1.02]"
                  : "bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {language === "th" ? cat.label_th : cat.label_en}
            </button>
          );
        })}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-80 rounded-2xl bg-slate-800/40 border border-slate-700/40 animate-pulse p-6 flex flex-col justify-between"
            >
              <div>
                <div className="h-6 w-24 bg-slate-700/50 rounded-lg mb-4" />
                <div className="h-6 w-full bg-slate-700/50 rounded-lg mb-2" />
                <div className="h-4 w-3/4 bg-slate-700/30 rounded-lg mb-4" />
              </div>
              <div className="h-4 w-1/3 bg-slate-700/40 rounded-lg" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredAnnouncements.length === 0 && (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 p-8">
          <Newspaper className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            {language === "th"
              ? "ไม่พบข่าวสารที่ค้นหา"
              : "No announcements found"}
          </h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
            {language === "th"
              ? "ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่นเพื่อดูประกาศเพิ่มเติม"
              : "Try adjusting your search criteria or selecting a different category."}
          </p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-sm font-medium transition"
          >
            {language === "th" ? "รีเซ็ตการค้นหา" : "Clear filters"}
          </button>
        </div>
      )}

      {/* Pinned Announcements Section */}
      {!loading && pinnedItems.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Pin className="w-5 h-5 text-amber-400 fill-amber-400/20" />
            <h2 className="text-xl font-bold text-white tracking-wide">
              {language === "th"
                ? "ประกาศสำคัญปักหมุด"
                : "Featured & Pinned Announcements"}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pinnedItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleOpenDetail(item)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl bg-slate-800/80 border border-amber-500/30 hover:border-amber-400/60 transition-all duration-300 shadow-xl hover:shadow-amber-500/10 flex flex-col sm:flex-row"
              >
                {/* Banner / Cover */}
                <div className="sm:w-2/5 h-48 sm:h-auto relative overflow-hidden bg-slate-900">
                  <img
                    src={
                      item.image_url ||
                      "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=600&q=80"
                    }
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-amber-500/90 text-slate-950 font-bold text-[11px] px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <Pin className="w-3 h-3 fill-slate-950" />
                    {language === "th" ? "ปักหมุด" : "Pinned"}
                  </div>
                </div>

                {/* Content */}
                <div className="sm:w-3/5 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${getCategoryColor(
                          item.category,
                        )}`}
                      >
                        {item.category?.toUpperCase() || "GENERAL"}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(item.created_at)}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-sky-400 transition-colors line-clamp-2 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-300 text-sm line-clamp-3 leading-relaxed mb-4">
                      {item.summary || item.content?.substring(0, 120)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-700/50 text-xs font-semibold text-sky-400 group-hover:text-sky-300">
                    <span>
                      {language === "th" ? "อ่านรายละเอียด" : "Read Full Story"}
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regular News Grid */}
      {!loading && regularItems.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide mb-6">
            {language === "th"
              ? "รายการข่าวสารทั้งหมด"
              : "All Articles & Updates"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleOpenDetail(item)}
                className="group cursor-pointer overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-800/80 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-sky-500/10"
              >
                {/* Image Cover */}
                <div className="h-44 relative overflow-hidden bg-slate-950">
                  <img
                    src={
                      item.image_url ||
                      "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80"
                    }
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold border backdrop-blur-md ${getCategoryColor(
                        item.category,
                      )}`}
                    >
                      {item.category?.toUpperCase() || "GENERAL"}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatDate(item.created_at)}</span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-sky-400 transition-colors line-clamp-2 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed mb-4">
                      {item.summary || item.content?.substring(0, 100)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs font-semibold text-sky-400 group-hover:text-sky-300">
                    <span>
                      {language === "th" ? "รายละเอียด" : "Read details"}
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Announcement Detail Modal */}
      {showDetailModal && selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header Image */}
            <div className="relative h-56 sm:h-72 w-full bg-slate-950 flex-shrink-0">
              <img
                src={
                  selectedAnnouncement.image_url ||
                  "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=80"
                }
                alt={selectedAnnouncement.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

              {/* Close Button */}
              <button
                onClick={() => setShowDetailModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60 transition shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold uppercase border ${getCategoryColor(
                      selectedAnnouncement.category,
                    )}`}
                  >
                    {selectedAnnouncement.category}
                  </span>
                  {selectedAnnouncement.is_pinned && (
                    <span className="bg-amber-500 text-slate-950 font-bold text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Pin className="w-3 h-3 fill-slate-950" />
                      {language === "th" ? "ปักหมุด" : "Pinned"}
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                  {selectedAnnouncement.title}
                </h2>
              </div>
            </div>

            {/* Modal Meta & Content */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-sky-400" />
                    {formatDate(selectedAnnouncement.created_at)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-purple-400" />
                    {language === "th"
                      ? "ประกาศอย่างเป็นทางการ"
                      : "Official Notice"}
                  </span>
                </div>
              </div>

              {/* Summary Callout */}
              {selectedAnnouncement.summary && (
                <div className="p-4 rounded-xl bg-sky-950/40 border border-sky-800/40 text-sky-200 text-sm leading-relaxed italic">
                  "{selectedAnnouncement.summary}"
                </div>
              )}

              {/* Main Content Body */}
              <div className="text-slate-300 text-base leading-relaxed whitespace-pre-line font-sans space-y-4">
                {selectedAnnouncement.content}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                SuraZense News System • ID #{selectedAnnouncement.id}
              </span>
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition"
              >
                {language === "th" ? "ปิดหน้าต่าง" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
