import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import ReactECharts from "echarts-for-react";
import {
  Users,
  Activity,
  X,
  Server,
  TrendingUp,
  BookOpen,
  Settings,
  Database,
  Trash2,
  Check,
  Search,
  LogOut,
  LayoutDashboard,
  UserCheck,
  FileSpreadsheet,
  ArrowLeft,
  Shield,
  KeyRound,
  Menu,
  Clock,
  ClipboardList,
  Package,
  FlaskConical,
  GraduationCap,
  Megaphone,
  Pin,
  Plus,
  Edit3,
  Newspaper,
  Sparkles,
  Eye,
  Tag,
  Bell,
  Send,
  CheckCheck,
} from "lucide-react";

import { MOCK_PRODUCTS, saveProducts } from "../data/mockProducts";

export default function Admin() {
  const { user, login, logout } = useUser();
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();

  // Admin access passcode state
  const [passcode, setPasscode] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(
    sessionStorage.getItem("admin_authorized") === "true",
  );
  const [passcodeError, setPasscodeError] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);

  // Active Tab state
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Filter & Search states
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [enrollmentSearch, setEnrollmentSearch] = useState("");
  const [enrollmentFilter, setEnrollmentFilter] = useState("all");
  const [orderTypeFilter, setOrderTypeFilter] = useState("all"); // all | shipping | chemicals | courses
  const [qcmSearch, setQcmSearch] = useState("");

  // Settings passcode change state
  const [newPasscode, setNewPasscode] = useState("");
  const [confirmNewPasscode, setConfirmNewPasscode] = useState("");
  const [passcodeSuccess, setPasscodeSuccess] = useState("");
  const [passcodeUpdateError, setPasscodeUpdateError] = useState("");

  // Settings session timeout state
  const [timeoutEnabled, setTimeoutEnabled] = useState(
    localStorage.getItem("surazense_timeout_enabled") !== "false",
  );
  const [timeoutDuration, setTimeoutDuration] = useState(
    localStorage.getItem("surazense_timeout_duration") || "15",
  );
  const [settingsSuccess, setSettingsSuccess] = useState("");

  // Login Modal states for user sessions
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Product Management states
  const [productList, setProductList] = useState([]);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdNameEn, setNewProdNameEn] = useState("");
  const [newProdNameTh, setNewProdNameTh] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("Biosensors");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdDescEn, setNewProdDescEn] = useState("");
  const [newProdDescTh, setNewProdDescTh] = useState("");
  const [newProdImage, setNewProdImage] = useState("");
  const [newProdStatus, setNewProdStatus] = useState("In Stock");

  // Announcement Management states
  const [announcementsList, setAnnouncementsList] = useState([]);
  const [announcementSearch, setAnnouncementSearch] = useState("");
  const [announcementCategoryFilter, setAnnouncementCategoryFilter] =
    useState("all");
  const [announcementPublishFilter, setAnnouncementPublishFilter] =
    useState("all");
  const [showCreateAnnouncementModal, setShowCreateAnnouncementModal] =
    useState(false);
  const [showEditAnnouncementModal, setShowEditAnnouncementModal] =
    useState(null);

  // Announcement Form states
  const [annTitle, setAnnTitle] = useState("");
  const [annContent, setAnnContent] = useState("");
  const [annSummary, setAnnSummary] = useState("");
  const [annCategory, setAnnCategory] = useState("general");
  const [annImageUrl, setAnnImageUrl] = useState("");
  const [annIsPublished, setAnnIsPublished] = useState(true);
  const [annIsPinned, setAnnIsPinned] = useState(false);

  // Notifications Management states
  const [notificationsList, setNotificationsList] = useState([]);
  const [notifSearch, setNotifSearch] = useState("");
  const [notifTypeFilter, setNotifTypeFilter] = useState("all");
  const [showCreateNotifModal, setShowCreateNotifModal] = useState(false);

  // Notification Form states
  const [createNotifTitle, setCreateNotifTitle] = useState("");
  const [createNotifMessage, setCreateNotifMessage] = useState("");
  const [createNotifType, setCreateNotifType] = useState("system");
  const [createNotifTargetUserId, setCreateNotifTargetUserId] =
    useState("broadcast"); // 'broadcast' or user_id
  const [createNotifRefId, setCreateNotifRefId] = useState("");

  const handleAdminLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);
    const res = await login(loginEmail, loginPassword);
    if (res.success) {
      setIsLoginModalOpen(false);
      setLoginEmail("");
      setLoginPassword("");
    } else {
      setLoginError(res.message);
    }
    setIsLoggingIn(false);
  };

  // State for database connection status
  const [isApiOnline, setIsApiOnline] = useState(false);
  const [checkingApi, setCheckingApi] = useState(true);

  // DB Data States
  const [usersList, setUsersList] = useState([]);
  const [registrationsList, setRegistrationsList] = useState([]);
  const [runsList, setRunsList] = useState([]);

  const API_URL = import.meta.env.PROD
    ? ""
    : import.meta.env.VITE_API_URL || "http://34.87.78.35:8000";

  // Check API health on mount
  useEffect(() => {
    const checkApiHealth = async () => {
      setCheckingApi(true);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout
        const res = await fetch(`${API_URL}/`, {
          method: "GET",
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        setIsApiOnline(true);
      } catch (e) {
        console.warn(
          "Backend API offline, running in Demo Mode (Local Storage).",
        );
        setIsApiOnline(false);
      } finally {
        setCheckingApi(false);
      }
    };
    checkApiHealth();
  }, [API_URL]);

  const fetchDataFromApi = async () => {
    try {
      // 1. Fetch users
      const usersRes = await fetch(`${API_URL}/api/users`);
      if (!usersRes.ok) throw new Error("Failed to fetch users");
      const usersData = await usersRes.json();
      setUsersList(usersData);

      // 2. Fetch orders
      const ordersRes = await fetch(`${API_URL}/api/orders`);
      if (!ordersRes.ok) throw new Error("Failed to fetch orders");
      const ordersData = await ordersRes.json();

      // 3. Fetch registrations
      const regsRes = await fetch(`${API_URL}/api/registrations`);
      if (!regsRes.ok) throw new Error("Failed to fetch registrations");
      const regsData = await regsRes.json();

      // 4. Fetch QCM analyses
      const analysesRes = await fetch(`${API_URL}/api/analyses`);
      if (!analysesRes.ok) throw new Error("Failed to fetch analyses");
      const analysesData = await analysesRes.json();

      // Map registrations/orders together
      const mappedOrders = ordersData.map((o) => ({
        id: `order-${o.id}`,
        db_id: o.id,
        db_type: "order",
        user_id: o.user_id,
        user_email: o.customer_email,
        user_name: o.customer_name,
        customer_phone: o.customer_phone,
        item_type: "product",
        item_id: o.items && o.items.length > 0 ? o.items[0].product_id : "N/A",
        item_title:
          o.items && o.items.length > 0
            ? o.items
                .map((item) => `${item.product_name} (x${item.quantity})`)
                .join(", ")
            : "Products",
        amount: o.total_amount,
        currency: "THB",
        payment_method: o.payment_method,
        payment_status: o.payment_status,
        paid_at: o.payment_status === "paid" ? o.updated_at : null,
        created_at: o.created_at,
        shipping_address: o.shipping_address,
      }));

      const mappedRegs = regsData.map((r) => {
        const user = usersData.find((u) => u.id === r.user_id);
        return {
          id: `reg-${r.id}`,
          db_id: r.id,
          db_type: "registration",
          user_id: r.user_id,
          user_email: user ? user.email : `user-${r.user_id}`,
          user_name: user
            ? `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
              user.username ||
              `User ${r.user_id}`
            : `User ${r.user_id}`,
          customer_phone: user ? user.phone : "",
          item_type: "course",
          item_id: r.course_id,
          item_title:
            {
              "lab-qcm": "Lab 1: QCM Sensor Calibration",
              "lab-biomarker": "Lab 2: Biomarker Binding Kinetics",
              "lab-signal": "Lab 3: Quantitative Biosignal Analysis",
              "course-intro": "Introduction to Biosensors & Surface Science",
              "course-instrument": "QCM Instrumentation & Fluidics",
              "course-data": "Biosignal Processing & Kinetics Data Analysis",
            }[r.course_id] || r.course_id,
          amount:
            {
              "lab-qcm": 1500,
              "lab-biomarker": 1500,
              "lab-signal": 1500,
              "course-intro": 990,
              "course-instrument": 1200,
              "course-data": 1490,
            }[r.course_id] || 0,
          currency: "THB",
          payment_method: "bank_transfer",
          payment_status:
            r.status === "confirmed"
              ? "paid"
              : r.status === "completed"
                ? "paid"
                : "pending",
          paid_at:
            r.status === "confirmed" || r.status === "completed"
              ? r.updated_at
              : null,
          created_at: r.registration_date,
          shipping_address: null,
        };
      });

      setRegistrationsList([...mappedOrders, ...mappedRegs]);

      // Map runs
      const mappedRuns = analysesData.map((r) => {
        const user = usersData.find((u) => u.id === r.user_id);
        return {
          id: r.id,
          user_id: r.user_id,
          user_email: user ? user.email : `user-${r.user_id}`,
          title: r.title,
          measurement_type: r.measurement_type,
          delta_f: r.delta_f,
          created_at: r.created_at,
          file1_name: r.file1_name,
        };
      });
      setRunsList(mappedRuns);

      // 5. Fetch Announcements
      try {
        const annRes = await fetch(`${API_URL}/api/announcements`);
        if (annRes.ok) {
          const annData = await annRes.json();
          setAnnouncementsList(annData);
        }
      } catch (annErr) {
        console.warn("Could not fetch announcements from API:", annErr);
      }

      // 6. Fetch Notifications
      try {
        const notifRes = await fetch(`${API_URL}/api/notifications`);
        if (notifRes.ok) {
          const notifData = await notifRes.json();
          setNotificationsList(notifData);
        }
      } catch (notifErr) {
        console.warn("Could not fetch notifications from API:", notifErr);
      }
    } catch (err) {
      console.error("Error fetching admin data:", err);
    }
  };

  useEffect(() => {
    if (isApiOnline) {
      fetchDataFromApi();
    }
  }, [isApiOnline]);

  // Load and pre-populate mock data in LocalStorage if not exists
  useEffect(() => {
    // 1. Load/Mock Users
    const localUsers = localStorage.getItem("surazense_mock_users");
    let initialUsers = [];
    if (localUsers) {
      initialUsers = JSON.parse(localUsers);
    } else {
      initialUsers = [
        {
          id: "mock-admin-1",
          email: "admin@surazense.com",
          username: "admin",
          first_name: "System",
          last_name: "Administrator",
          phone: "081-234-5678",
          role: "admin",
          created_at: new Date(
            Date.now() - 30 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: "mock-user-2",
          email: "thita.d@surazense.com",
          username: "thita_director",
          first_name: "Dr. Thita",
          last_name: "Siriphan",
          phone: "089-111-2222",
          role: "staff",
          created_at: new Date(
            Date.now() - 25 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: "mock-user-3",
          email: "adisak.e@surazense.com",
          username: "adisak_eng",
          first_name: "Adisak",
          last_name: "Wong",
          phone: "082-333-4444",
          role: "staff",
          created_at: new Date(
            Date.now() - 20 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: "mock-user-4",
          email: "somchai.k@gmail.com",
          username: "somchai_k",
          first_name: "Somchai",
          last_name: "Korn",
          phone: "085-555-6666",
          role: "customer",
          qcm_balance: 8,
          qcm_quota: 10,
          created_at: new Date(
            Date.now() - 15 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: "mock-user-5",
          email: "natthaporn.s@gmail.com",
          username: "nattha_s",
          first_name: "Natthaporn",
          last_name: "Suk",
          phone: "086-777-8888",
          role: "customer",
          qcm_balance: 3,
          qcm_quota: 10,
          created_at: new Date(
            Date.now() - 10 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: "mock-user-6",
          email: "jane.doe@example.com",
          username: "janedoe",
          first_name: "Jane",
          last_name: "Smith",
          phone: "084-999-0000",
          role: "customer",
          qcm_balance: 0,
          qcm_quota: 5,
          created_at: new Date(
            Date.now() - 5 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      ];
      localStorage.setItem(
        "surazense_mock_users",
        JSON.stringify(initialUsers),
      );
    }
    setUsersList(initialUsers);

    // 2. Load/Mock Orders & Payments
    // Reset to reload mock data with new shipping_address fields
    localStorage.removeItem("surazense_mock_registrations");
    const localRegs = localStorage.getItem("surazense_mock_registrations");
    let initialRegs = [];
    if (localRegs) {
      initialRegs = JSON.parse(localRegs);
    } else {
      initialRegs = [
        {
          id: "mock-ord-1",
          user_id: "mock-user-4",
          user_email: "somchai.k@gmail.com",
          user_name: "Somchai Korn",
          customer_phone: "085-555-6666",
          item_type: "course",
          item_id: "lab-qcm",
          item_title: "Lab 1: QCM Sensor Calibration",
          amount: 1500,
          currency: "THB",
          payment_method: "promptpay",
          payment_status: "paid",
          paid_at: new Date(
            Date.now() - 12 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          created_at: new Date(
            Date.now() - 12 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: "mock-ord-2",
          user_id: "mock-user-5",
          user_email: "natthaporn.s@gmail.com",
          user_name: "Natthaporn Suk",
          customer_phone: "086-777-8888",
          item_type: "course",
          item_id: "lab-biomarker",
          item_title: "Lab 2: Biomarker Binding Kinetics",
          amount: 1500,
          currency: "THB",
          payment_method: "bank_transfer",
          payment_status: "paid",
          paid_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(
            Date.now() - 8 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: "mock-ord-3",
          user_id: "mock-user-6",
          user_email: "jane.doe@example.com",
          user_name: "Jane Smith",
          customer_phone: "084-999-0000",
          item_type: "course",
          item_id: "course-intro",
          item_title: "Introduction to Biosensors & Surface Science",
          amount: 990,
          currency: "THB",
          payment_method: "credit_card",
          payment_status: "paid",
          paid_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(
            Date.now() - 3 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: "mock-ord-4",
          user_id: "mock-user-4",
          user_email: "somchai.k@gmail.com",
          user_name: "Somchai Korn",
          customer_phone: "085-555-6666",
          shipping_address:
            "123 ถ.พหลโยธิน แขวงจตุจักร เขตจตุจักร กรุงเทพมหานคร 10900",
          item_type: "product",
          item_id: "prod-qcm-chip",
          item_title: "QCM Gold Sensor Chip (10 pcs)",
          amount: 3200,
          currency: "THB",
          payment_method: "promptpay",
          payment_status: "paid",
          paid_at: new Date(
            Date.now() - 14 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          created_at: new Date(
            Date.now() - 14 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: "mock-ord-5",
          user_id: "mock-user-5",
          user_email: "natthaporn.s@gmail.com",
          user_name: "Natthaporn Suk",
          customer_phone: "086-777-8888",
          shipping_address:
            "456 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110",
          item_type: "product",
          item_id: "prod-buffer-kit",
          item_title: "PBS Buffer Solution Kit (500 mL)",
          amount: 850,
          currency: "THB",
          payment_method: "credit_card",
          payment_status: "paid",
          paid_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(
            Date.now() - 6 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: "mock-ord-6",
          user_id: "mock-user-6",
          user_email: "jane.doe@example.com",
          user_name: "Jane Smith",
          customer_phone: "084-999-0000",
          shipping_address:
            "789 ถ.รัชดาภิเษก แขวงลาดยาว เขตจตุจักร กรุงเทพมหานคร 10900",
          item_type: "product",
          item_id: "prod-cleaning-kit",
          item_title: "Electrode Cleaning & Polishing Kit",
          amount: 650,
          currency: "THB",
          payment_method: "bank_transfer",
          payment_status: "refunded",
          paid_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(
            Date.now() - 1 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      ];
      localStorage.setItem(
        "surazense_mock_registrations",
        JSON.stringify(initialRegs),
      );
    }
    setRegistrationsList(initialRegs);

    // 3. Load/Mock QCM runs & diagnostic reports
    const localRuns = localStorage.getItem("surazense_mock_runs");
    let initialRuns = [];
    if (localRuns) {
      initialRuns = JSON.parse(localRuns);
    } else {
      initialRuns = [
        {
          id: "mock-run-1",
          user_email: "somchai.k@gmail.com",
          title: "Lung Cancer Marker EGFR Run 1",
          measurement_type: "measurement",
          delta_f: 145,
          created_at: new Date(
            Date.now() - 11 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          file1_name: "somchai_run1_EGFR.json",
        },
        {
          id: "mock-run-2",
          user_email: "natthaporn.s@gmail.com",
          title: "Breast Cancer HER2 Run A",
          measurement_type: "measurement",
          delta_f: 8,
          created_at: new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          file1_name: "nattha_runA_HER2.json",
        },
        {
          id: "mock-run-3",
          user_email: "thita.d@surazense.com",
          title: "ESP32 Sweep Sweep QCM-101",
          measurement_type: "single",
          delta_f: null,
          created_at: new Date(
            Date.now() - 19 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          file1_name: "director_sweep_calibration.json",
        },
        {
          id: "mock-run-4",
          user_email: "jane.doe@example.com",
          title: "Diagnostic Report #3829",
          measurement_type: "report",
          delta_f: 28,
          created_at: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          file1_name: "jane_diagnostic_report.pdf",
        },
      ];
      localStorage.setItem("surazense_mock_runs", JSON.stringify(initialRuns));
    }
    setRunsList(initialRuns);

    // Load Products
    const localProds = localStorage.getItem("surazense_products");
    if (localProds) {
      try {
        setProductList(JSON.parse(localProds));
      } catch (err) {
        console.error("Failed to parse local products:", err);
        setProductList(MOCK_PRODUCTS);
      }
    } else {
      setProductList(MOCK_PRODUCTS);
    }

    // Load Announcements (Mock Local Storage)
    const localAnn = localStorage.getItem("surazense_mock_announcements");
    if (localAnn) {
      try {
        setAnnouncementsList(JSON.parse(localAnn));
      } catch (err) {
        console.error("Failed to parse mock announcements:", err);
      }
    } else {
      const initialAnn = [
        {
          id: 1,
          title: "SuraZense Launches Xzense-101 Next-Gen Biosensor System",
          summary: "Revolutionary QCM system offering sub-nanogram resolution.",
          content:
            "We are thrilled to announce the official launch of Xzense-101...",
          category: "news",
          image_url:
            "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1000&q=80",
          is_published: true,
          is_pinned: true,
          author_id: 1,
          created_at: new Date(
            Date.now() - 5 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          updated_at: new Date(
            Date.now() - 5 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: 2,
          title: "SuraZense Wins National MedTech Innovation Award 2026",
          summary:
            "Recognized for groundbreaking contributions to liquid biopsy diagnostics.",
          content:
            "SuraZense Co., Ltd. has been awarded the National MedTech Award...",
          category: "news",
          image_url:
            "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1000&q=80",
          is_published: true,
          is_pinned: true,
          author_id: 1,
          created_at: new Date(
            Date.now() - 10 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          updated_at: new Date(
            Date.now() - 10 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      ];
      setAnnouncementsList(initialAnn);
      localStorage.setItem(
        "surazense_mock_announcements",
        JSON.stringify(initialAnn),
      );
    }

    // Load Notifications (Mock Local Storage)
    const localNotif = localStorage.getItem("surazense_mock_notifications");
    if (localNotif) {
      try {
        setNotificationsList(JSON.parse(localNotif));
      } catch (err) {
        console.error("Failed to parse mock notifications:", err);
      }
    } else {
      const initialNotif = [
        {
          id: 1,
          user_id: null,
          title: "System Update: SuraZense V2 API Released",
          message:
            "All endpoints have been updated to support high-throughput streaming.",
          type: "system",
          reference_id: null,
          is_read: false,
          created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
        },
        {
          id: 2,
          user_id: 1,
          title: "Order Processed #ORD-9821",
          message: "Payment confirmed for QCM Gold Sensor Crystal.",
          type: "order",
          reference_id: 9821,
          is_read: true,
          created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
        },
      ];
      setNotificationsList(initialNotif);
      localStorage.setItem(
        "surazense_mock_notifications",
        JSON.stringify(initialNotif),
      );
    }
  }, []);

  const handleVerifyPasscode = (e) => {
    e.preventDefault();
    const storedPasscode =
      localStorage.getItem("admin_passcode_custom") || "admin123";
    if (passcode === storedPasscode) {
      sessionStorage.setItem("admin_authorized", "true");
      setIsAuthorized(true);
      setPasscodeError("");
      setPasscode("");
    } else {
      setPasscodeError(
        language === "th"
          ? "รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง"
          : "Incorrect passcode. Please try again.",
      );
    }
  };

  // User list actions
  const handleChangeUserRole = async (userId, newRole) => {
    if (isApiOnline) {
      try {
        const res = await fetch(`${API_URL}/api/users/${userId}/role`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: newRole }),
        });
        if (!res.ok) throw new Error("Failed to update user role");
        fetchDataFromApi();
      } catch (err) {
        alert("Failed to update user role in database: " + err.message);
      }
    } else {
      const updated = usersList.map((u) =>
        u.id === userId
          ? {
              ...u,
              role: newRole,
              qcm_balance: newRole === "customer" ? 10 : undefined,
              qcm_quota: newRole === "customer" ? 10 : undefined,
            }
          : u,
      );
      setUsersList(updated);
      localStorage.setItem("surazense_mock_users", JSON.stringify(updated));
    }
  };

  const handleUpdateQcmBalance = (userId, newBalance) => {
    const updated = usersList.map((u) =>
      u.id === userId ? { ...u, qcm_balance: newBalance } : u,
    );
    setUsersList(updated);
    localStorage.setItem("surazense_mock_users", JSON.stringify(updated));
  };

  const handleDeleteUser = async (userId) => {
    const check = window.confirm(
      language === "th"
        ? "คุณแน่ใจหรือไม่ที่จะลบผู้ใช้นี้?"
        : "Are you sure you want to delete this user?",
    );
    if (!check) return;

    if (isApiOnline) {
      try {
        const res = await fetch(`${API_URL}/api/users/${userId}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete user");
        fetchDataFromApi();
      } catch (err) {
        alert("Failed to delete user from database: " + err.message);
      }
    } else {
      const updated = usersList.filter((u) => u.id !== userId);
      setUsersList(updated);
      localStorage.setItem("surazense_mock_users", JSON.stringify(updated));
    }
  };

  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (!newProdNameEn || !newProdPrice) return;

    const nextId =
      productList.length > 0
        ? Math.max(...productList.map((p) => p.id)) + 1
        : 1;
    const newProduct = {
      id: nextId,
      name: {
        en: newProdNameEn,
        th: newProdNameTh || newProdNameEn,
      },
      category: newProdCategory,
      price: parseFloat(newProdPrice),
      description: {
        en: newProdDescEn,
        th: newProdDescTh || newProdDescEn,
      },
      image: newProdImage || null,
      status: newProdStatus,
      specs: {},
    };

    const updatedList = [...productList, newProduct];
    setProductList(updatedList);
    saveProducts(updatedList);

    // Reset fields
    setNewProdNameEn("");
    setNewProdNameTh("");
    setNewProdCategory("Biosensors");
    setNewProdPrice("");
    setNewProdDescEn("");
    setNewProdDescTh("");
    setNewProdImage("");
    setNewProdStatus("In Stock");
    setShowAddProductModal(false);
  };

  const handleDeleteProduct = (productId) => {
    const confirmDelete = window.confirm(
      language === "th"
        ? "คุณแน่ใจหรือไม่ว่าต้องการลบสินค้าชิ้นนี้?"
        : "Are you sure you want to delete this product?",
    );
    if (!confirmDelete) return;

    const updatedList = productList.filter((p) => p.id !== productId);
    setProductList(updatedList);
    saveProducts(updatedList);
  };

  // Order / Payment actions
  const handleDeleteEnrollment = async (orderId) => {
    const check = window.confirm(
      language === "th"
        ? "คุณแน่ใจหรือไม่ที่จะลบคำสั่งซื้อนี้?"
        : "Are you sure you want to delete this order?",
    );
    if (!check) return;

    const item = registrationsList.find((r) => r.id === orderId);
    if (!item) return;

    if (isApiOnline) {
      try {
        const url =
          item.db_type === "order"
            ? `${API_URL}/api/orders/${item.db_id}`
            : `${API_URL}/api/registrations/${item.db_id}`;
        const res = await fetch(url, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete record");
        fetchDataFromApi();
      } catch (err) {
        alert("Failed to delete record from database: " + err.message);
      }
    } else {
      const updated = registrationsList.filter((r) => r.id !== orderId);
      setRegistrationsList(updated);
      localStorage.setItem(
        "surazense_mock_registrations",
        JSON.stringify(updated),
      );
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const item = registrationsList.find((r) => r.id === orderId);
    if (!item) return;

    if (isApiOnline) {
      try {
        let res;
        if (item.db_type === "order") {
          const payload = {};
          if (["paid", "refunded", "pending"].includes(newStatus)) {
            payload.payment_status = newStatus;
          } else {
            payload.order_status = newStatus;
          }
          res = await fetch(`${API_URL}/api/orders/${item.db_id}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        } else {
          const statusMap = {
            paid: "confirmed",
            pending: "pending",
            confirmed: "confirmed",
            completed: "completed",
            cancelled: "cancelled",
            refunded: "cancelled",
          };
          const backendStatus = statusMap[newStatus] || newStatus;
          res = await fetch(
            `${API_URL}/api/registrations/${item.db_id}/status`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: backendStatus }),
            },
          );
        }
        if (!res.ok) throw new Error("Failed to update status");
        fetchDataFromApi();
      } catch (err) {
        alert("Failed to update status in database: " + err.message);
      }
    } else {
      const updated = registrationsList.map((r) =>
        r.id === orderId ? { ...r, payment_status: newStatus } : r,
      );
      setRegistrationsList(updated);
      localStorage.setItem(
        "surazense_mock_registrations",
        JSON.stringify(updated),
      );
    }
  };

  // QCM run actions
  const handleDeleteRun = async (runId) => {
    const check = window.confirm(
      language === "th"
        ? "คุณแน่ใจหรือไม่ที่จะลบข้อมูลสแกนนี้?"
        : "Are you sure you want to delete this scan record?",
    );
    if (!check) return;

    if (isApiOnline) {
      try {
        const res = await fetch(`${API_URL}/api/analyses/${runId}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete scan record");
        fetchDataFromApi();
      } catch (err) {
        alert("Failed to delete scan record from database: " + err.message);
      }
    } else {
      const updated = runsList.filter((r) => r.id !== runId);
      setRunsList(updated);
      localStorage.setItem("surazense_mock_runs", JSON.stringify(updated));
    }
  };

  // Announcement Handlers & CRUD
  const resetAnnForm = () => {
    setAnnTitle("");
    setAnnContent("");
    setAnnSummary("");
    setAnnCategory("general");
    setAnnImageUrl("");
    setAnnIsPublished(true);
    setAnnIsPinned(false);
  };

  const handleCreateAnnouncementSubmit = async (e) => {
    e.preventDefault();
    if (!annTitle || !annContent) {
      alert(
        language === "th"
          ? "กรุณากรอกหัวข้อและเนื้อหาประกาศ"
          : "Title and content are required.",
      );
      return;
    }
    const payload = {
      title: annTitle,
      content: annContent,
      summary: annSummary || null,
      category: annCategory,
      image_url: annImageUrl || null,
      is_published: annIsPublished,
      is_pinned: annIsPinned,
      author_id: user?.id || 1,
    };

    if (isApiOnline) {
      try {
        const res = await fetch(`${API_URL}/api/announcements`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create announcement");
        fetchDataFromApi();
      } catch (err) {
        alert("Error: " + err.message);
      }
    } else {
      const newAnn = {
        id: Date.now(),
        ...payload,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const updated = [newAnn, ...announcementsList];
      setAnnouncementsList(updated);
      localStorage.setItem(
        "surazense_mock_announcements",
        JSON.stringify(updated),
      );
    }
    setShowCreateAnnouncementModal(false);
    resetAnnForm();
  };

  const handleOpenEditAnnouncement = (ann) => {
    setShowEditAnnouncementModal(ann);
    setAnnTitle(ann.title || "");
    setAnnContent(ann.content || "");
    setAnnSummary(ann.summary || "");
    setAnnCategory(ann.category || "general");
    setAnnImageUrl(ann.image_url || "");
    setAnnIsPublished(ann.is_published ?? true);
    setAnnIsPinned(ann.is_pinned ?? false);
  };

  const handleUpdateAnnouncementSubmit = async (e) => {
    e.preventDefault();
    if (!showEditAnnouncementModal) return;

    const payload = {
      title: annTitle,
      content: annContent,
      summary: annSummary || null,
      category: annCategory,
      image_url: annImageUrl || null,
      is_published: annIsPublished,
      is_pinned: annIsPinned,
    };

    if (isApiOnline) {
      try {
        const res = await fetch(
          `${API_URL}/api/announcements/${showEditAnnouncementModal.id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        );
        if (!res.ok) throw new Error("Failed to update announcement");
        fetchDataFromApi();
      } catch (err) {
        alert("Error: " + err.message);
      }
    } else {
      const updated = announcementsList.map((a) =>
        a.id === showEditAnnouncementModal.id
          ? { ...a, ...payload, updated_at: new Date().toISOString() }
          : a,
      );
      setAnnouncementsList(updated);
      localStorage.setItem(
        "surazense_mock_announcements",
        JSON.stringify(updated),
      );
    }
    setShowEditAnnouncementModal(null);
    resetAnnForm();
  };

  const handleTogglePublishAnnouncement = async (ann) => {
    const newStatus = !ann.is_published;
    if (isApiOnline) {
      try {
        const res = await fetch(`${API_URL}/api/announcements/${ann.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_published: newStatus }),
        });
        if (!res.ok) throw new Error("Failed to toggle status");
        fetchDataFromApi();
      } catch (err) {
        alert("Error: " + err.message);
      }
    } else {
      const updated = announcementsList.map((a) =>
        a.id === ann.id ? { ...a, is_published: newStatus } : a,
      );
      setAnnouncementsList(updated);
      localStorage.setItem(
        "surazense_mock_announcements",
        JSON.stringify(updated),
      );
    }
  };

  const handleTogglePinAnnouncement = async (ann) => {
    const newPin = !ann.is_pinned;
    if (isApiOnline) {
      try {
        const res = await fetch(`${API_URL}/api/announcements/${ann.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_pinned: newPin }),
        });
        if (!res.ok) throw new Error("Failed to toggle pin");
        fetchDataFromApi();
      } catch (err) {
        alert("Error: " + err.message);
      }
    } else {
      const updated = announcementsList.map((a) =>
        a.id === ann.id ? { ...a, is_pinned: newPin } : a,
      );
      setAnnouncementsList(updated);
      localStorage.setItem(
        "surazense_mock_announcements",
        JSON.stringify(updated),
      );
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    const check = window.confirm(
      language === "th"
        ? "คุณแน่ใจหรือไม่ที่จะลบประกาศข่าวสารนี้?"
        : "Are you sure you want to delete this announcement?",
    );
    if (!check) return;

    if (isApiOnline) {
      try {
        const res = await fetch(`${API_URL}/api/announcements/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete announcement");
        fetchDataFromApi();
      } catch (err) {
        alert("Error deleting announcement: " + err.message);
      }
    } else {
      const updated = announcementsList.filter((a) => a.id !== id);
      setAnnouncementsList(updated);
      localStorage.setItem(
        "surazense_mock_announcements",
        JSON.stringify(updated),
      );
    }
  };

  // Filtered Announcements
  const filteredAnnouncementsList = announcementsList.filter((a) => {
    const term = announcementSearch.toLowerCase();
    const matchSearch =
      (a.title || "").toLowerCase().includes(term) ||
      (a.summary || "").toLowerCase().includes(term) ||
      (a.content || "").toLowerCase().includes(term);
    const matchCategory =
      announcementCategoryFilter === "all" ||
      a.category === announcementCategoryFilter;
    const matchPublish =
      announcementPublishFilter === "all"
        ? true
        : announcementPublishFilter === "published"
          ? a.is_published
          : !a.is_published;
    return matchSearch && matchCategory && matchPublish;
  });

  // Notifications Handlers & CRUD
  const resetNotifForm = () => {
    setCreateNotifTitle("");
    setCreateNotifMessage("");
    setCreateNotifType("system");
    setCreateNotifTargetUserId("broadcast");
    setCreateNotifRefId("");
  };

  const handleCreateNotificationSubmit = async (e) => {
    e.preventDefault();
    if (!createNotifTitle || !createNotifMessage) {
      alert(
        language === "th"
          ? "กรุณากรอกหัวข้อและข้อความการแจ้งเตือน"
          : "Title and message are required.",
      );
      return;
    }

    const targetId =
      createNotifTargetUserId === "broadcast"
        ? null
        : parseInt(createNotifTargetUserId);
    const refId = createNotifRefId ? parseInt(createNotifRefId) : null;

    const payload = {
      user_id: targetId,
      title: createNotifTitle,
      message: createNotifMessage,
      type: createNotifType,
      reference_id: refId,
      is_read: false,
    };

    if (isApiOnline) {
      try {
        const res = await fetch(`${API_URL}/api/notifications`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create notification");
        fetchDataFromApi();
      } catch (err) {
        alert("Error creating notification: " + err.message);
      }
    } else {
      const newNotif = {
        id: Date.now(),
        ...payload,
        created_at: new Date().toISOString(),
      };
      const updated = [newNotif, ...notificationsList];
      setNotificationsList(updated);
      localStorage.setItem(
        "surazense_mock_notifications",
        JSON.stringify(updated),
      );
    }
    setShowCreateNotifModal(false);
    resetNotifForm();
  };

  const handleDeleteNotification = async (id) => {
    const check = window.confirm(
      language === "th"
        ? "คุณแน่ใจหรือไม่ที่จะลบการแจ้งเตือนนี้?"
        : "Are you sure you want to delete this notification?",
    );
    if (!check) return;

    if (isApiOnline) {
      try {
        const res = await fetch(`${API_URL}/api/notifications/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete notification");
        fetchDataFromApi();
      } catch (err) {
        alert("Error deleting notification: " + err.message);
      }
    } else {
      const updated = notificationsList.filter((n) => n.id !== id);
      setNotificationsList(updated);
      localStorage.setItem(
        "surazense_mock_notifications",
        JSON.stringify(updated),
      );
    }
  };

  // Filtered Notifications List
  const filteredNotificationsList = notificationsList.filter((n) => {
    const term = notifSearch.toLowerCase();
    const matchSearch =
      (n.title || "").toLowerCase().includes(term) ||
      (n.message || "").toLowerCase().includes(term);
    const matchType = notifTypeFilter === "all" || n.type === notifTypeFilter;
    return matchSearch && matchType;
  });

  // Change Admin passcode
  const handleUpdatePasscode = (e) => {
    e.preventDefault();
    setPasscodeUpdateError("");
    setPasscodeSuccess("");

    if (newPasscode !== confirmNewPasscode) {
      setPasscodeUpdateError(
        language === "th" ? "รหัสผ่านใหม่ไม่ตรงกัน" : "Passwords do not match.",
      );
      return;
    }
    if (newPasscode.length < 4) {
      setPasscodeUpdateError(
        language === "th"
          ? "รหัสผ่านต้องมีความยาวอย่างน้อย 4 ตัวอักษร"
          : "Passcode must be at least 4 characters long.",
      );
      return;
    }

    localStorage.setItem("admin_passcode_custom", newPasscode);
    setPasscodeSuccess(
      language === "th"
        ? "เปลี่ยนรหัสผ่านผู้ดูแลระบบสำเร็จแล้ว!"
        : "Admin passcode updated successfully!",
    );
    setNewPasscode("");
    setConfirmNewPasscode("");
  };

  // Change Session Timeout Settings
  const handleSaveTimeoutSettings = (e) => {
    e.preventDefault();
    setSettingsSuccess("");
    localStorage.setItem(
      "surazense_timeout_enabled",
      timeoutEnabled ? "true" : "false",
    );
    localStorage.setItem(
      "surazense_timeout_duration",
      timeoutDuration.toString(),
    );
    setSettingsSuccess(
      language === "th"
        ? "บันทึกการตั้งค่าเซสชันเรียบร้อยแล้ว!"
        : "Session timeout settings saved successfully!",
    );
    // Clear success message after 3 seconds
    setTimeout(() => setSettingsSuccess(""), 3000);
  };

  // Filtered Users List
  const filteredUsers = usersList.filter((u) => {
    const term = userSearch.toLowerCase();
    const matchSearch =
      u.email.toLowerCase().includes(term) ||
      u.username.toLowerCase().includes(term) ||
      `${u.first_name} ${u.last_name}`.toLowerCase().includes(term);
    const matchRole = userRoleFilter === "all" || u.role === userRoleFilter;
    return matchSearch && matchRole;
  });

  // Category → type map for admin order filter
  const ORDER_TYPE_ITEMS = {
    shipping: ["product", "biosensor", "module", "accessory"],
    chemicals: ["chemical"],
    courses: ["course"],
  };

  // Filtered Orders List
  const filteredEnrollments = registrationsList.filter((r) => {
    const term = enrollmentSearch.toLowerCase();
    const matchSearch =
      r.user_email.toLowerCase().includes(term) ||
      r.user_name.toLowerCase().includes(term) ||
      (r.item_title || "").toLowerCase().includes(term);
    const matchPayStatus =
      enrollmentFilter === "all" || r.payment_status === enrollmentFilter;
    const matchType = (() => {
      if (orderTypeFilter === "all") return true;
      const t = (r.item_type || "").toLowerCase();
      return ORDER_TYPE_ITEMS[orderTypeFilter]?.includes(t) ?? false;
    })();
    return matchSearch && matchPayStatus && matchType;
  });

  // Filtered QCM Scans
  const filteredRuns = runsList.filter((r) => {
    const term = qcmSearch.toLowerCase();
    return (
      r.title.toLowerCase().includes(term) ||
      r.user_email.toLowerCase().includes(term) ||
      (r.file1_name && r.file1_name.toLowerCase().includes(term))
    );
  });

  // Dynamically computed Recent Activities — MUST be before any early return (Rules of Hooks)
  const recentActivities = React.useMemo(() => {
    const list = [];

    // User registrations
    usersList.forEach((u) => {
      const displayName =
        [u.first_name, u.last_name].filter(Boolean).join(" ").trim() ||
        u.username ||
        u.email;
      list.push({
        id: `user-${u.id}-${u.created_at}`,
        type: "user",
        timestamp: new Date(u.created_at),
        title_th: `บัญชีผู้ใช้งานใหม่: ${displayName}`,
        title_en: `New user registration: ${displayName}`,
        description_th: `ผู้ใช้ @${u.username || "User"} (${u.email}) เข้าร่วมระบบในฐานะ ${u.role}`,
        description_en: `User @${u.username || "User"} (${u.email}) joined as a ${u.role}`,
        color: "bg-sky-50 text-accent",
        icon: Users,
      });
    });

    // Order / payment history
    registrationsList.forEach((r) => {
      const isPaid = r.payment_status === "paid";
      const color = isPaid
        ? "bg-emerald-50 text-emerald-600"
        : "bg-rose-50 text-rose-600";
      const typeLabel = r.item_type === "course" ? "คอร์ส" : "สินค้า";
      list.push({
        id: `ord-${r.id}-${r.created_at}`,
        type: "order",
        timestamp: new Date(r.paid_at || r.created_at),
        title_th: `คำสั่งซื้อ${typeLabel}: ${r.item_title || ""}`,
        title_en: `Order (${r.item_type}): ${r.item_title || ""}`,
        description_th: `${r.user_name} ชำระ ฿${(r.amount || 0).toLocaleString()} — ${isPaid ? "ชำระแล้ว" : "คืนเงิน"}`,
        description_en: `${r.user_name} paid ฿${(r.amount || 0).toLocaleString()} — ${r.payment_status}`,
        color,
        icon: BookOpen,
      });
    });

    // QCM scan sweeps
    runsList.forEach((run) => {
      list.push({
        id: `run-${run.id}-${run.created_at}`,
        type: "run",
        timestamp: new Date(run.created_at),
        title_th: `บันทึกสัญญาณเครื่อง QCM: ${run.title}`,
        title_en: `QCM Sensor run logged: ${run.title}`,
        description_th: `วัดค่า ${run.file1_name} โดย ${run.user_email} (Delta-F: ${run.delta_f || 0} Hz)`,
        description_en: `Signal sweep ${run.file1_name} by ${run.user_email} (Delta-F: ${run.delta_f || 0} Hz)`,
        color: "bg-violet-50 text-violet-600",
        icon: Activity,
      });
    });

    return list.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
  }, [usersList, registrationsList, runsList]);

  // If passcode authorization is not complete, show passcode gate
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-6 py-12 bg-slate-50">
        <div className="max-w-md w-full bg-white border border-slate-200/80 rounded-[2.5rem] p-10 shadow-2xl shadow-slate-900/5 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-3xl bg-sky-50 border border-sky-100 flex items-center justify-center text-accent mb-6 animate-pulse">
            <Shield className="w-8 h-8 stroke-[2.2]" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-3">
            {language === "th"
              ? "กรอกรหัสผ่านผู้ดูแลระบบ"
              : "Admin Passcode Required"}
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-sm">
            {language === "th"
              ? "จำกัดการเข้าถึงเฉพาะผู้ดูแลระบบเท่านั้น กรุณากรอกรหัสผ่านเพื่อเข้าใช้งานหน้าคอนโซลควบคุม"
              : "Access restricted to administrators. Please enter the passcode to unlock the management console."}
          </p>

          <form
            onSubmit={handleVerifyPasscode}
            className="w-full flex flex-col gap-4"
          >
            <div className="relative text-left">
              <input
                type={showPasscode ? "text" : "password"}
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder={
                  language === "th"
                    ? "รหัสผ่านผู้ดูแลระบบ (admin123)"
                    : "Admin Passcode (admin123)"
                }
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-accent transition-all text-center text-sm font-semibold tracking-wide"
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-accent hover:text-accent-hover font-bold bg-transparent border-none cursor-pointer"
              >
                {showPasscode ? "HIDE" : "SHOW"}
              </button>
            </div>

            {passcodeError && (
              <p className="text-xs font-semibold text-rose-500 bg-rose-50 border border-rose-100/50 py-2.5 px-4 rounded-xl">
                {passcodeError}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-4 rounded-2xl transition-all shadow-md shadow-sky-200 cursor-pointer text-sm border-none"
            >
              {language === "th" ? "ปลดล็อคระบบ" : "Unlock Console"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-2xl transition-all cursor-pointer text-sm border-none"
            >
              {language === "th" ? "กลับไปหน้าหลัก" : "Return Home"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- CHART OPTIONS (ECharts) ---
  const courseCounts = registrationsList.reduce((acc, reg) => {
    acc[reg.course_id] = (acc[reg.course_id] || 0) + 1;
    return acc;
  }, {});

  const coursePieOption = {
    title: {
      text:
        language === "th"
          ? "การลงทะเบียนตามรายวิชา"
          : "Course Registration Split",
      left: "center",
      textStyle: {
        fontFamily: "Plus Jakarta Sans",
        fontSize: 14,
        color: "#1e293b",
      },
    },
    tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
    series: [
      {
        name: "Registrations",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 6, borderColor: "#fff", borderWidth: 2 },
        label: { show: true, position: "outside", formatter: "{b}" },
        data: [
          { value: courseCounts["lab-qcm"] || 0, name: "Lab 1 (QCM)" },
          {
            value: courseCounts["lab-biomarker"] || 0,
            name: "Lab 2 (Biomarker)",
          },
          { value: courseCounts["lab-signal"] || 0, name: "Lab 3 (Signal)" },
          {
            value: courseCounts["course-intro"] || 0,
            name: "Intro Biosensors",
          },
        ],
      },
    ],
    color: ["#38bdf8", "#0284c7", "#818cf8", "#f43f5e"],
  };

  const qcmRuns = runsList.filter((r) => r.measurement_type === "measurement");
  const barChartOption = {
    title: {
      text:
        language === "th"
          ? "ค่าความถี่ลดลงในการทดสอบ (Delta F)"
          : "QCM Run delta-F (Hz)",
      left: "center",
      textStyle: {
        fontFamily: "Plus Jakarta Sans",
        fontSize: 14,
        color: "#1e293b",
      },
    },
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: {
      type: "category",
      data: qcmRuns.map((r, i) => `Run ${i + 1}`),
      axisLine: { lineStyle: { color: "#94a3b8" } },
    },
    yAxis: {
      type: "value",
      name: "Delta-F (Hz)",
      axisLine: { lineStyle: { color: "#94a3b8" } },
    },
    series: [
      {
        name: "Delta-F (Hz)",
        type: "bar",
        barWidth: "40%",
        data: qcmRuns.map((r) => r.delta_f),
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#0284c7" },
              { offset: 1, color: "#38bdf8" },
            ],
          },
          borderRadius: [4, 4, 0, 0],
        },
      },
    ],
  };

  return (
    <div
      className="flex min-h-screen bg-slate-50 text-slate-800 w-full relative"
      style={{
        fontFamily: '"Plus Jakarta Sans", "Noto Sans Thai", sans-serif',
      }}
    >
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/10 backdrop-blur-xs z-25 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR NAVIGATION (Light Theme matching Main Web) */}
      <aside
        className={`bg-white text-slate-800 flex flex-col border-r border-slate-200 shrink-0 fixed md:sticky top-0 h-screen z-30 transition-all duration-300 ease-in-out ${
          isSidebarOpen
            ? "w-72 translate-x-0 opacity-100"
            : "w-0 -translate-x-full md:translate-x-0 md:w-0 overflow-hidden opacity-0 border-r-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-base font-black tracking-tight text-slate-800 leading-none">
                Surazense
              </h2>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 block">
                {language === "th" ? "แผงควบคุมระบบ" : "Admin Panel"}
              </span>
            </div>
          </div>
          {/* Hamburger button inside sidebar */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 hover:bg-slate-100 active:scale-95 rounded-lg text-slate-500 hover:text-slate-800 transition-all border border-slate-200 bg-white cursor-pointer flex items-center justify-center"
            title="Collapse Sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>

        {/* Sidebar Navigation Tabs */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all border-none cursor-pointer outline-none ${
              activeTab === "overview"
                ? "bg-sky-50 text-accent font-bold shadow-sm shadow-sky-500/5"
                : "text-slate-650 hover:bg-slate-50 hover:text-accent"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>
              {language === "th" ? "ภาพรวมระบบ" : "Dashboard Overview"}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all border-none cursor-pointer outline-none ${
              activeTab === "users"
                ? "bg-sky-50 text-accent font-bold shadow-sm shadow-sky-500/5"
                : "text-slate-650 hover:bg-slate-50 hover:text-accent"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>
              {language === "th" ? "จัดการผู้ใช้งาน" : "User Management"}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("enrollments")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all border-none cursor-pointer outline-none ${
              activeTab === "enrollments"
                ? "bg-sky-50 text-accent font-bold shadow-sm shadow-sky-500/5"
                : "text-slate-655 hover:bg-slate-50 hover:text-accent"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>
              {language === "th" ? "ประวัติคำสั่งซื้อ" : "Orders & Payments"}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("qcm")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all border-none cursor-pointer outline-none ${
              activeTab === "qcm"
                ? "bg-sky-50 text-accent font-bold shadow-sm shadow-sky-500/5"
                : "text-slate-650 hover:bg-slate-50 hover:text-accent"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>
              {language === "th" ? "ประวัติสแกน QCM" : "QCM Scan Logs"}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all border-none cursor-pointer outline-none ${
              activeTab === "products"
                ? "bg-sky-50 text-accent font-bold shadow-sm shadow-sky-500/5"
                : "text-slate-655 hover:bg-slate-50 hover:text-accent"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>
              {language === "th" ? "จัดการสินค้า" : "Product Management"}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("announcements")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all border-none cursor-pointer outline-none ${
              activeTab === "announcements"
                ? "bg-sky-50 text-accent font-bold shadow-sm shadow-sky-500/5"
                : "text-slate-655 hover:bg-slate-50 hover:text-accent"
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>
              {language === "th"
                ? "จัดการข่าวสาร & ประกาศ"
                : "News & Announcements"}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("notifications")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all border-none cursor-pointer outline-none ${
              activeTab === "notifications"
                ? "bg-sky-50 text-accent font-bold shadow-sm shadow-sky-500/5"
                : "text-slate-655 hover:bg-slate-50 hover:text-accent"
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>
              {language === "th" ? "ระบบแจ้งเตือน" : "Notifications Center"}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all border-none cursor-pointer outline-none ${
              activeTab === "settings"
                ? "bg-sky-50 text-accent font-bold shadow-sm shadow-sky-500/5"
                : "text-slate-650 hover:bg-slate-50 hover:text-accent"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>{language === "th" ? "ตั้งค่าระบบ" : "System Settings"}</span>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          {user && (
            <div className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold uppercase shrink-0">
                {user.email[0]}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold truncate text-slate-700">
                  {user.username || user.email.split("@")[0]}
                </p>
                <p className="text-[10px] text-slate-400 font-mono truncate">
                  {user.email}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer bg-transparent transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>
              {language === "th" ? "กลับไปหน้าหลัก" : "Return to Web"}
            </span>
          </button>

          <button
            onClick={() => {
              logout();
              sessionStorage.removeItem("admin_authorized");
              setIsAuthorized(false);
              navigate("/");
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 cursor-pointer transition-colors shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{language === "th" ? "ออกจากระบบ" : "Logout Admin"}</span>
          </button>
        </div>
      </aside>

      {/* MAIN MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Right Header Navigation Panel */}
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-slate-100 active:scale-95 rounded-xl text-slate-650 transition-all border border-slate-200 bg-white cursor-pointer flex items-center justify-center mr-2 animate-fadeIn"
                title="Expand Sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <div>
              <h1 className="text-lg font-black text-slate-800 tracking-tight uppercase flex items-center gap-2 leading-none">
                {activeTab === "overview" &&
                  (language === "th"
                    ? "ภาพรวมระบบ & การทดสอบ"
                    : "Dashboard Overview")}
                {activeTab === "users" &&
                  (language === "th"
                    ? "การจัดการข้อมูลผู้ใช้งาน"
                    : "User Management Console")}
                {activeTab === "enrollments" &&
                  (language === "th"
                    ? "ประวัติคำสั่งซื้อ & การชำระเงิน"
                    : "Orders & Payment History")}
                {activeTab === "qcm" &&
                  (language === "th"
                    ? "ประวัติการวัดผลด้วยเครื่อง QCM"
                    : "QCM Run Scans & Logs")}
                {activeTab === "settings" &&
                  (language === "th"
                    ? "การตั้งค่าระบบผู้ดูแลระบบ"
                    : "Admin & Server Settings")}
                {activeTab === "products" &&
                  (language === "th"
                    ? "การจัดการข้อมูลรายการสินค้า"
                    : "Catalog & Product Management")}
                {activeTab === "announcements" &&
                  (language === "th"
                    ? "การจัดการข่าวสารและประกาศ"
                    : "News & Announcements Management")}
                {activeTab === "notifications" &&
                  (language === "th"
                    ? "ระบบจัดการการแจ้งเตือน"
                    : "System Notifications Management")}
              </h1>
              <p className="text-xs text-slate-400 font-bold mt-1.5 leading-none">
                {activeTab === "users" &&
                  (language === "th"
                    ? "จัดการรายชื่อผู้ใช้ ค้นหา เปลี่ยนบทบาทหน้าที่ และลบบัญชีผู้ใช้งาน"
                    : "Search, manage roles, and delete user profiles.")}
                {activeTab === "enrollments" &&
                  (language === "th"
                    ? "รายการชำระเงินค่าคอร์สเรียนและสินค้าของลูกค้าทั้งหมด"
                    : "All customer payments for courses and products.")}
                {activeTab === "qcm" &&
                  (language === "th"
                    ? "รายการบันทึกผลการทำงาน ค่าดริฟท์ของความถี่ และไฟล์บันทึกสัญญาณดิบ"
                    : "History of all QCM measurement sweep cycles logged.")}
                {activeTab === "settings" &&
                  (language === "th"
                    ? "เปลี่ยนรหัสผ่านเข้าคอนโซล ตรวจสอบการเชื่อมต่อ API Server"
                    : "Manage local credentials and check connectivity.")}
                {activeTab === "products" &&
                  (language === "th"
                    ? "เพิ่ม ลบ หรือแก้ไขข้อมูลรายการสินค้าบนหน้าแคตตาล็อกหลัก"
                    : "Create, view, and remove items from the store directory.")}
                {activeTab === "announcements" &&
                  (language === "th"
                    ? "สร้าง แก้ไข ปักหมุด และเผยแพร่ข่าวสารประชาสัมพันธ์"
                    : "Create, edit, pin, publish, and delete official announcements.")}
                {activeTab === "notifications" &&
                  (language === "th"
                    ? "ส่งข้อความแจ้งเตือนถึงผู้ใช้รายบุคคล หรือประกาศแจ้งเตือนทั้งระบบ"
                    : "Broadcast system alerts or send targeted notifications to users.")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="text-[13px] tracking-wider uppercase transition-colors duration-200 text-slate-700 hover:text-accent cursor-pointer active:scale-95 transition-transform bg-transparent border-none p-0 flex items-center gap-1"
              title="Change Language / เปลี่ยนภาษา"
            >
              <span
                className={
                  language === "en" ? "text-accent font-bold" : "text-slate-400"
                }
              >
                EN
              </span>
              <span className="text-slate-300">/</span>
              <span
                className={
                  language === "th" ? "text-accent font-bold" : "text-slate-400"
                }
              >
                TH
              </span>
            </button>

            {/* DB Health badge in header */}
            <div
              className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 border text-[11px] font-bold ${
                isApiOnline
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                  : "bg-amber-50 text-amber-600 border-amber-100"
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>
                {checkingApi
                  ? "Checking database..."
                  : isApiOnline
                    ? "API Connect: Online"
                    : "Database: Offline (Local Mock Mode)"}
              </span>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT PANEL */}
        <main className="flex-1 p-8 overflow-y-auto max-w-[1500px] w-full mx-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Stats Counters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div
                  onClick={() => setActiveTab("users")}
                  className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm flex items-center gap-5 hover:scale-[1.02] hover:border-accent/40 active:scale-98 transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center text-accent shrink-0">
                    <Users className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {language === "th" ? "ผู้ใช้ทั้งหมด" : "Total Users"}
                    </p>
                    <h3 className="text-2xl font-black text-slate-800 mt-1">
                      {usersList.length}
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-1 font-semibold">
                      {usersList.filter((u) => u.role === "admin").length}{" "}
                      Admins •{" "}
                      {usersList.filter((u) => u.role === "staff").length} Staff
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab("enrollments")}
                  className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm flex items-center gap-5 hover:scale-[1.02] hover:border-accent/40 active:scale-98 transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
                    <BookOpen className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {language === "th" ? "ลงทะเบียนเรียน" : "Enrollments"}
                    </p>
                    <h3 className="text-2xl font-black text-slate-800 mt-1">
                      {registrationsList.length}
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-1 font-semibold">
                      {
                        registrationsList.filter((r) => r.status === "pending")
                          .length
                      }{" "}
                      Pending approval
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab("qcm")}
                  className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm flex items-center gap-5 hover:scale-[1.02] hover:border-accent/40 active:scale-98 transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                    <Activity className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {language === "th"
                        ? "ประวัติการรัน QCM"
                        : "QCM Run Scans"}
                    </p>
                    <h3 className="text-2xl font-black text-slate-800 mt-1">
                      {runsList.length}
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-1 font-semibold">
                      {
                        runsList.filter(
                          (r) => r.measurement_type === "measurement",
                        ).length
                      }{" "}
                      measurements logged
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab("qcm")}
                  className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm flex items-center gap-5 hover:scale-[1.02] hover:border-accent/40 active:scale-98 transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 shrink-0">
                    <TrendingUp className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {language === "th" ? "ค่าแล็บเฉลี่ย" : "Avg Delta-F"}
                    </p>
                    <h3 className="text-2xl font-black text-slate-800 mt-1">
                      {Math.round(
                        runsList
                          .filter((r) => r.delta_f)
                          .reduce((acc, r) => acc + r.delta_f, 0) /
                          (runsList.filter((r) => r.delta_f).length || 1),
                      )}{" "}
                      Hz
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-1 font-semibold">
                      Across biological sweeps
                    </p>
                  </div>
                </div>
              </div>

              {/* Graphical Visualizations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm">
                  <ReactECharts
                    option={coursePieOption}
                    style={{ height: "350px" }}
                  />
                </div>
                <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm">
                  <ReactECharts
                    option={barChartOption}
                    style={{ height: "350px" }}
                  />
                </div>
              </div>

              {/* Recent Activity List */}
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-2 tracking-tight uppercase">
                  <Clock className="w-4 h-4 text-accent" />
                  {language === "th"
                    ? "กิจกรรมล่าสุดในระบบ"
                    : "Recent System Activity"}
                </h3>
                <div className="flow-root">
                  <ul className="-mb-8">
                    {recentActivities.map((act, actIdx) => {
                      const IconComponent = act.icon;
                      return (
                        <li key={act.id}>
                          <div className="relative pb-8">
                            {actIdx !== recentActivities.length - 1 ? (
                              <span
                                className="absolute top-4 left-6 -ml-px h-full w-0.5 bg-slate-100"
                                aria-hidden="true"
                              />
                            ) : null}
                            <div className="relative flex space-x-3 items-start">
                              <div>
                                <span
                                  className={`h-12 w-12 rounded-xl flex items-center justify-center ring-8 ring-white shrink-0 ${act.color}`}
                                >
                                  <IconComponent className="w-5 h-5" />
                                </span>
                              </div>
                              <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                                <div>
                                  <p className="text-xs font-bold text-slate-800">
                                    {language === "th"
                                      ? act.title_th
                                      : act.title_en}
                                  </p>
                                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                                    {language === "th"
                                      ? act.description_th
                                      : act.description_en}
                                  </p>
                                </div>
                                <div className="text-right text-[10px] whitespace-nowrap text-slate-400 font-mono">
                                  <time dateTime={act.timestamp.toISOString()}>
                                    {act.timestamp.toLocaleTimeString(
                                      language === "th" ? "th-TH" : "en-US",
                                      {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      },
                                    )}{" "}
                                    (
                                    {act.timestamp.toLocaleDateString(
                                      language === "th" ? "th-TH" : "en-US",
                                      {
                                        month: "short",
                                        day: "numeric",
                                      },
                                    )}
                                    )
                                  </time>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USER MANAGEMENT */}
          {activeTab === "users" && (
            <div className="space-y-6">
              {/* Filter controls */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm">
                <div className="relative w-full sm:max-w-md">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder={
                      language === "th"
                        ? "ค้นหาผู้ใช้จาก อีเมล, ชื่อผู้ใช้งาน หรือชื่อ-นามสกุล..."
                        : "Search by email, username, or name..."
                    }
                    className="w-full pl-11 pr-5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-accent text-sm transition-all"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                  <span className="text-xs font-bold text-slate-400 uppercase mr-2">
                    {language === "th" ? "บทบาท:" : "Role:"}
                  </span>
                  {["all", "customer", "staff", "admin"].map((role) => (
                    <button
                      key={role}
                      onClick={() => setUserRoleFilter(role)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase border transition-all cursor-pointer ${
                        userRoleFilter === role
                          ? "bg-accent text-white border-accent shadow-sm"
                          : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                  <div className="w-[1px] h-4 bg-slate-200 mx-2 hidden sm:block"></div>
                  <div className="text-xs text-slate-400 font-semibold shrink-0">
                    {language === "th"
                      ? `พบผู้ใช้ทั้งหมด ${filteredUsers.length} รายการ`
                      : `Found ${filteredUsers.length} users`}
                  </div>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200/60 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <th className="py-4 px-6">
                          {language === "th" ? "ชื่อ-นามสกุล" : "Name"}
                        </th>
                        <th className="py-4 px-6">
                          {language === "th"
                            ? "อีเมล / ชื่อผู้ใช้งาน"
                            : "Email / Username"}
                        </th>
                        <th className="py-4 px-6">
                          {language === "th" ? "บทบาท" : "Role"}
                        </th>
                        <th className="py-4 px-6">
                          {language === "th"
                            ? "สิทธิ์การรัน QCM"
                            : "QCM Run Quota"}
                        </th>
                        <th className="py-4 px-6">
                          {language === "th" ? "เบอร์โทรศัพท์" : "Phone"}
                        </th>
                        <th className="py-4 px-6">
                          {language === "th" ? "วันที่เข้าร่วม" : "Joined Date"}
                        </th>
                        <th className="py-4 px-6 text-center">
                          {language === "th" ? "จัดการ" : "Actions"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td
                            colSpan="7"
                            className="text-center py-10 text-slate-400 font-semibold"
                          >
                            {language === "th"
                              ? "ไม่พบผู้ใช้ที่ค้นหา"
                              : "No users matched your query."}
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((userObj) => (
                          <tr
                            key={userObj.id}
                            className="hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="py-4 px-6">
                              <div className="font-bold text-slate-800">
                                {userObj.first_name} {userObj.last_name}
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                                {userObj.id}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="font-medium text-slate-700">
                                {userObj.email}
                              </div>
                              <span className="text-xs text-slate-400">
                                @{userObj.username}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide inline-block ${
                                  userObj.role === "admin"
                                    ? "bg-rose-50 text-rose-600 border border-rose-100"
                                    : userObj.role === "staff"
                                      ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
                                      : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                }`}
                              >
                                {userObj.role}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              {userObj.role === "customer" ? (
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="number"
                                    min="0"
                                    max="999"
                                    value={
                                      userObj.qcm_balance !== undefined
                                        ? userObj.qcm_balance
                                        : 10
                                    }
                                    onChange={(e) =>
                                      handleUpdateQcmBalance(
                                        userObj.id,
                                        parseInt(e.target.value) || 0,
                                      )
                                    }
                                    className="w-14 text-center bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-100"
                                  />
                                  <span className="text-[10px] text-slate-400 font-bold">
                                    / {userObj.qcm_quota || 10}{" "}
                                    {language === "th" ? "ครั้ง" : "runs"}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-slate-400 font-medium italic text-xs">
                                  {language === "th" ? "ไม่จำกัด" : "Unlimited"}
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-6 font-mono text-xs text-slate-600">
                              {userObj.phone}
                            </td>
                            <td className="py-4 px-6 text-slate-500 text-xs">
                              {new Date(userObj.created_at).toLocaleDateString(
                                language === "th" ? "th-TH" : "en-US",
                                { dateStyle: "medium" },
                              )}
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center justify-center gap-2">
                                <select
                                  value={userObj.role}
                                  onChange={(e) =>
                                    handleChangeUserRole(
                                      userObj.id,
                                      e.target.value,
                                    )
                                  }
                                  className="text-xs bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-100"
                                >
                                  <option value="customer">customer</option>
                                  <option value="staff">staff</option>
                                  <option value="admin">admin</option>
                                </select>

                                <button
                                  onClick={() => handleDeleteUser(userObj.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border-none bg-transparent cursor-pointer flex items-center justify-center"
                                  title="Delete User"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS & PAYMENTS */}
          {activeTab === "enrollments" && (
            <div className="space-y-6">
              {/* Summary Stat Cards */}
              {(() => {
                const totalRevenue = registrationsList
                  .filter((o) => o.payment_status === "paid")
                  .reduce((s, o) => s + (o.amount || 0), 0);
                const totalOrders = registrationsList.length;
                const courseOrders = registrationsList.filter(
                  (o) => o.item_type === "course",
                ).length;
                const productOrders = registrationsList.filter(
                  (o) => o.item_type === "product",
                ).length;
                return (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      {
                        label:
                          language === "th"
                            ? "คำสั่งซื้อทั้งหมด"
                            : "Total Orders",
                        value: totalOrders,
                        suffix: language === "th" ? "รายการ" : "orders",
                        color: "sky",
                      },
                      {
                        label:
                          language === "th"
                            ? "รายได้รวม (ชำระแล้ว)"
                            : "Total Revenue (Paid)",
                        value: `฿${totalRevenue.toLocaleString()}`,
                        suffix: "",
                        color: "emerald",
                      },
                      {
                        label:
                          language === "th"
                            ? "คอร์สเรียนที่ซื้อ"
                            : "Course Purchases",
                        value: courseOrders,
                        suffix: language === "th" ? "คอร์ส" : "courses",
                        color: "violet",
                      },
                      {
                        label:
                          language === "th"
                            ? "สินค้าที่สั่งซื้อ"
                            : "Product Orders",
                        value: productOrders,
                        suffix: language === "th" ? "รายการ" : "items",
                        color: "amber",
                      },
                    ].map((card) => (
                      <div
                        key={card.label}
                        className={`bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm flex flex-col gap-1 border-l-4 border-l-${card.color}-400`}
                      >
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          {card.label}
                        </p>
                        <p
                          className={`text-2xl font-black text-${card.color}-600 leading-tight`}
                        >
                          {card.value}
                          {card.suffix && (
                            <span className="text-sm font-semibold text-slate-400 ml-1.5">
                              {card.suffix}
                            </span>
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* Category Type Tabs (matching customer Order History) */}
              <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 pb-0">
                {[
                  {
                    key: "all",
                    Icon: ClipboardList,
                    label: { th: "ทั้งหมด", en: "All Orders" },
                  },
                  {
                    key: "shipping",
                    Icon: Package,
                    label: { th: "จัดส่ง", en: "Shipping" },
                  },
                  {
                    key: "chemicals",
                    Icon: FlaskConical,
                    label: { th: "สารเคมี", en: "Chemicals" },
                  },
                  {
                    key: "courses",
                    Icon: GraduationCap,
                    label: { th: "คอร์สอบรม", en: "Courses" },
                  },
                ].map((tab, idx, arr) => (
                  <React.Fragment key={tab.key}>
                    <button
                      onClick={() => setOrderTypeFilter(tab.key)}
                      className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all border-b-2 -mb-px bg-transparent border-x-0 border-t-0 cursor-pointer outline-none ${
                        orderTypeFilter === tab.key
                          ? "border-b-accent text-slate-900"
                          : "border-b-transparent text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      <tab.Icon className="w-4 h-4" />
                      {tab.label[language]}
                    </button>
                    {idx < arr.length - 1 && (
                      <div className="w-[1.5px] h-5 bg-blue-700 mx-1 mb-px" />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Search + Status Filter */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-4 flex flex-col lg:flex-row gap-4 items-center justify-between shadow-sm">
                <div className="relative w-full lg:max-w-md">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={enrollmentSearch}
                    onChange={(e) => setEnrollmentSearch(e.target.value)}
                    placeholder={
                      language === "th"
                        ? "ค้นหาด้วย อีเมล, ชื่อ หรือชื่อสินค้า/คอร์ส..."
                        : "Search by email, customer name, or item title..."
                    }
                    className="w-full pl-11 pr-5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-accent text-sm transition-all"
                  />
                </div>

                <div className="flex items-center gap-2 w-full lg:w-auto shrink-0 justify-end flex-wrap">
                  <span className="text-xs font-bold text-slate-400 uppercase mr-1">
                    {language === "th" ? "สถานะ:" : "Status:"}
                  </span>
                  {[
                    { key: "all", label: { th: "ทั้งหมด", en: "All" } },
                    {
                      key: "pending",
                      label: { th: "รอดำเนิน", en: "Pending" },
                    },
                    { key: "paid", label: { th: "ชำระแล้ว", en: "Paid" } },
                    {
                      key: "refunded",
                      label: { th: "คืนเงิน", en: "Refunded" },
                    },
                  ].map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setEnrollmentFilter(f.key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                        enrollmentFilter === f.key
                          ? "bg-accent text-white border-accent shadow-sm"
                          : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {f.label[language]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200/60 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <th className="py-4 px-6">
                          {language === "th" ? "ลูกค้า" : "Customer"}
                        </th>
                        <th className="py-4 px-6">
                          {language === "th" ? "ประเภท" : "Type"}
                        </th>
                        <th className="py-4 px-6">
                          {language === "th"
                            ? "รายการที่ซื้อ"
                            : "Item Purchased"}
                        </th>
                        <th className="py-4 px-6">
                          {language === "th"
                            ? "ที่อยู่จัดส่ง / โทร"
                            : "Ship Address / Phone"}
                        </th>
                        <th className="py-4 px-6">
                          {language === "th" ? "ยอดชำระ" : "Amount"}
                        </th>
                        <th className="py-4 px-6">
                          {language === "th" ? "ช่องทางชำระ" : "Payment Method"}
                        </th>
                        <th className="py-4 px-6">
                          {language === "th" ? "วันที่ชำระ" : "Paid At"}
                        </th>
                        <th className="py-4 px-6">
                          {language === "th" ? "สถานะ" : "Status"}
                        </th>
                        <th className="py-4 px-6 text-center">
                          {language === "th" ? "จัดการ" : "Actions"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredEnrollments.length === 0 ? (
                        <tr>
                          <td
                            colSpan="9"
                            className="text-center py-10 text-slate-400 font-semibold"
                          >
                            {language === "th"
                              ? "ไม่พบข้อมูลคำสั่งซื้อที่ค้นหา"
                              : "No orders matched your query."}
                          </td>
                        </tr>
                      ) : (
                        filteredEnrollments.map((ord) => {
                          const payMethodLabel =
                            {
                              promptpay:
                                language === "th" ? "พร้อมเพย์" : "PromptPay",
                              bank_transfer:
                                language === "th" ? "โอนเงิน" : "Bank Transfer",
                              credit_card:
                                language === "th"
                                  ? "บัตรเครดิต"
                                  : "Credit Card",
                            }[ord.payment_method] || ord.payment_method;
                          return (
                            <tr
                              key={ord.id}
                              className="hover:bg-slate-50/50 transition-colors"
                            >
                              <td className="py-4 px-6">
                                <div className="font-bold text-slate-800">
                                  {ord.user_name}
                                </div>
                                <span className="text-xs text-slate-400">
                                  {ord.user_email}
                                </span>
                                {ord.customer_phone && (
                                  <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                                    {ord.customer_phone}
                                  </div>
                                )}
                              </td>
                              <td className="py-4 px-6">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide inline-block border ${
                                    ord.item_type === "course"
                                      ? "bg-violet-50 text-violet-600 border-violet-100"
                                      : "bg-amber-50 text-amber-600 border-amber-100"
                                  }`}
                                >
                                  {ord.item_type === "course"
                                    ? language === "th"
                                      ? "คอร์ส"
                                      : "Course"
                                    : language === "th"
                                      ? "สินค้า"
                                      : "Product"}
                                </span>
                              </td>
                              <td className="py-4 px-6">
                                <div className="font-semibold text-slate-700 max-w-[200px] leading-snug">
                                  {ord.item_title}
                                </div>
                                <span className="text-[10px] text-slate-400 font-mono bg-slate-100 rounded px-1.5 py-0.5 mt-1 inline-block">
                                  {ord.item_id}
                                </span>
                              </td>
                              <td className="py-4 px-6">
                                <span className="font-black text-slate-800">
                                  ฿{(ord.amount || 0).toLocaleString()}
                                </span>
                              </td>
                              {/* Shipping Address column */}
                              <td className="py-4 px-6">
                                {ord.shipping_address ? (
                                  <div className="max-w-[200px]">
                                    <p className="text-xs text-slate-700 leading-snug">
                                      {ord.shipping_address}
                                    </p>
                                  </div>
                                ) : (
                                  <span className="text-xs text-slate-300 italic">
                                    {language === "th" ? "ไม่มีที่อยู่" : "—"}
                                  </span>
                                )}
                              </td>
                              <td className="py-4 px-6 text-slate-500 text-xs font-medium">
                                {payMethodLabel}
                              </td>
                              <td className="py-4 px-6 text-slate-500 text-xs">
                                {ord.paid_at
                                  ? new Date(ord.paid_at).toLocaleDateString(
                                      language === "th" ? "th-TH" : "en-US",
                                      { dateStyle: "medium" },
                                    )
                                  : "-"}
                              </td>
                              <td className="py-4 px-6">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide inline-block border ${
                                    ord.payment_status === "paid"
                                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                      : ord.payment_status === "refunded"
                                        ? "bg-rose-50 text-rose-500 border-rose-100"
                                        : "bg-amber-50 text-amber-600 border-amber-100"
                                  }`}
                                >
                                  {ord.payment_status === "paid"
                                    ? language === "th"
                                      ? "ชำระแล้ว"
                                      : "Paid"
                                    : ord.payment_status === "refunded"
                                      ? language === "th"
                                        ? "คืนเงิน"
                                        : "Refunded"
                                      : ord.payment_status}
                                </span>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-center justify-center gap-2">
                                  <select
                                    value={ord.payment_status || "pending"}
                                    onChange={(e) =>
                                      handleUpdateOrderStatus(
                                        ord.id,
                                        e.target.value,
                                      )
                                    }
                                    className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-100 cursor-pointer"
                                  >
                                    <option value="pending">
                                      {language === "th"
                                        ? "รอดำเนิน"
                                        : "Pending"}
                                    </option>
                                    <option value="confirmed">
                                      {language === "th"
                                        ? "ยืนยัน"
                                        : "Confirmed"}
                                    </option>
                                    <option value="shipped">
                                      {language === "th" ? "จัดส่ง" : "Shipped"}
                                    </option>
                                    <option value="paid">
                                      {language === "th" ? "ชำระแล้ว" : "Paid"}
                                    </option>
                                    <option value="delivered">
                                      {language === "th"
                                        ? "ส่งแล้ว"
                                        : "Delivered"}
                                    </option>
                                    <option value="refunded">
                                      {language === "th"
                                        ? "คืนเงิน"
                                        : "Refunded"}
                                    </option>
                                  </select>
                                  <button
                                    onClick={() =>
                                      handleDeleteEnrollment(ord.id)
                                    }
                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border-none bg-transparent cursor-pointer flex items-center justify-center"
                                    title={
                                      language === "th"
                                        ? "ลบคำสั่งซื้อ"
                                        : "Delete Order"
                                    }
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: QCM SCAN LOGS */}
          {activeTab === "qcm" && (
            <div className="space-y-6">
              {/* Filter controls */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm">
                <div className="relative w-full sm:max-w-md">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={qcmSearch}
                    onChange={(e) => setQcmSearch(e.target.value)}
                    placeholder={
                      language === "th"
                        ? "ค้นหาไฟล์ รายงานผลการสแกน หรืออีเมลผู้ตรวจ..."
                        : "Search by title, owner email, file name..."
                    }
                    className="w-full pl-11 pr-5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-accent text-sm transition-all"
                  />
                </div>
                <div className="text-xs text-slate-400 font-semibold shrink-0">
                  {language === "th"
                    ? `ประวัติการรันแล็บทั้งหมด ${filteredRuns.length} รายการ`
                    : `Total QCM sweeps: ${filteredRuns.length}`}
                </div>
              </div>

              {/* Scans Table */}
              <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200/60 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <th className="py-4 px-6">
                          {language === "th"
                            ? "หัวข้อสแกน / ไอดี"
                            : "Scan Title / ID"}
                        </th>
                        <th className="py-4 px-6">
                          {language === "th" ? "ผู้บันทึกข้อมูล" : "Logged By"}
                        </th>
                        <th className="py-4 px-6">
                          {language === "th" ? "ประเภทข้อมูล" : "Data Type"}
                        </th>
                        <th className="py-4 px-6">
                          {language === "th"
                            ? "ค่าดริฟท์ (Delta-F)"
                            : "Drift (Delta-F)"}
                        </th>
                        <th className="py-4 px-6">
                          {language === "th"
                            ? "ไฟล์สัญญาณที่แนบ"
                            : "Attached Signals"}
                        </th>
                        <th className="py-4 px-6">
                          {language === "th"
                            ? "วันที่ทำการทดสอบ"
                            : "Execution Date"}
                        </th>
                        <th className="py-4 px-6 text-center">
                          {language === "th" ? "จัดการ" : "Actions"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredRuns.length === 0 ? (
                        <tr>
                          <td
                            colSpan="7"
                            className="text-center py-10 text-slate-400 font-semibold"
                          >
                            {language === "th"
                              ? "ไม่พบข้อมูลสแกน QCM"
                              : "No QCM scans matched your query."}
                          </td>
                        </tr>
                      ) : (
                        filteredRuns.map((run) => (
                          <tr
                            key={run.id}
                            className="hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="py-4 px-6">
                              <div className="font-bold text-slate-800">
                                {run.title}
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                                {run.id}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-slate-600 font-medium text-xs">
                              {run.user_email}
                            </td>
                            <td className="py-4 px-6">
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[10px] uppercase font-extrabold">
                                {language === "th"
                                  ? run.measurement_type === "measurement"
                                    ? "ผลการวัดค่า"
                                    : run.measurement_type === "single"
                                      ? "สแกนความถี่เดี่ยว"
                                      : "รายงานผลแล็บ"
                                  : run.measurement_type}
                              </span>
                            </td>
                            <td className="py-4 px-6 font-mono text-slate-700 text-xs font-bold">
                              {run.delta_f !== null
                                ? `${run.delta_f} Hz`
                                : "N/A"}
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-1.5 text-xs text-accent font-semibold">
                                <FileSpreadsheet className="w-3.5 h-3.5" />
                                <span
                                  className="truncate max-w-[150px]"
                                  title={run.file1_name}
                                >
                                  {run.file1_name}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-slate-500 text-xs">
                              {new Date(run.created_at).toLocaleDateString(
                                language === "th" ? "th-TH" : "en-US",
                                { dateStyle: "medium" },
                              )}
                            </td>
                            <td className="py-4 px-6 text-center">
                              <button
                                onClick={() => handleDeleteRun(run.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border-none bg-transparent cursor-pointer flex items-center justify-center"
                                title="Delete Scan Record"
                              >
                                <Trash2 className="w-4.5 h-4.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PRODUCT MANAGEMENT */}
          {activeTab === "products" && (
            <div className="space-y-6">
              {/* Header card with Search and Add Product Button */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-6 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm">
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    {language === "th"
                      ? "จัดการรายการสินค้า"
                      : "Catalog Management"}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {language === "th"
                      ? "เพิ่ม ลบ หรือแก้ไขข้อมูลสินค้าที่แสดงอยู่บนหน้าเว็บไซต์หลัก"
                      : "Add or delete products displayed on the main corporate catalog."}
                  </p>
                </div>
                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="bg-accent hover:bg-accent-hover text-white font-bold px-5 py-3 rounded-xl transition-all cursor-pointer border-none shadow-md shadow-sky-200 text-xs flex items-center gap-2"
                >
                  <span>+</span>
                  {language === "th" ? "เพิ่มสินค้าใหม่" : "Add New Product"}
                </button>
              </div>

              {/* Products Catalog Table / Grid */}
              <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200/60 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <th className="py-4 px-6 w-24">
                          {language === "th" ? "รูปภาพ" : "Image"}
                        </th>
                        <th className="py-4 px-6">
                          {language === "th" ? "ชื่อสินค้า" : "Product Name"}
                        </th>
                        <th className="py-4 px-6">
                          {language === "th" ? "หมวดหมู่" : "Category"}
                        </th>
                        <th className="py-4 px-6">
                          {language === "th" ? "ราคา" : "Price"}
                        </th>
                        <th className="py-4 px-6">
                          {language === "th" ? "สถานะ" : "Status"}
                        </th>
                        <th className="py-4 px-6 text-center">
                          {language === "th" ? "จัดการ" : "Actions"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {productList.length === 0 ? (
                        <tr>
                          <td
                            colSpan="6"
                            className="text-center py-10 text-slate-400 font-semibold"
                          >
                            {language === "th"
                              ? "ไม่พบสินค้าในระบบ"
                              : "No products in the catalog."}
                          </td>
                        </tr>
                      ) : (
                        productList.map((product) => (
                          <tr
                            key={product.id}
                            className="hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="py-4 px-6">
                              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-150 flex items-center justify-center overflow-hidden">
                                {product.image ? (
                                  <img
                                    src={product.image}
                                    alt={
                                      product.name[language] || product.name.en
                                    }
                                    className="w-full h-full object-contain"
                                  />
                                ) : (
                                  <div className="text-[10px] font-bold text-slate-400 uppercase">
                                    No Image
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="font-bold text-slate-800">
                                {product.name[language] || product.name.en}
                              </div>
                              <div className="text-[10px] text-slate-400 mt-1 max-w-sm truncate">
                                {product.description[language] ||
                                  product.description.en}
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[10px] uppercase font-extrabold">
                                {product.category}
                              </span>
                            </td>
                            <td className="py-4 px-6 font-semibold text-slate-800">
                              ฿
                              {Number(product.price).toLocaleString("th-TH", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </td>
                            <td className="py-4 px-6">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                                  product.status === "In Stock"
                                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                    : "bg-rose-50 text-rose-600 border border-rose-100"
                                }`}
                              >
                                {language === "th"
                                  ? product.status === "In Stock"
                                    ? "พร้อมจำหน่าย"
                                    : "สินค้าหมด"
                                  : product.status}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border-none bg-transparent cursor-pointer flex items-center justify-center mx-auto"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4.5 h-4.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add Product Modal */}
              {showAddProductModal && (
                <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-white rounded-[2.5rem] border border-slate-200/80 shadow-2xl p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-black text-slate-800 tracking-tight">
                        {language === "th"
                          ? "เพิ่มสินค้าชิ้นใหม่"
                          : "Add New Product"}
                      </h2>
                      <button
                        onClick={() => setShowAddProductModal(false)}
                        className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors bg-transparent border-none cursor-pointer outline-none"
                      >
                        <X className="w-5 h-5 stroke-[2.5]" />
                      </button>
                    </div>

                    <form
                      onSubmit={handleAddProductSubmit}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Product Name (EN) *
                          </label>
                          <input
                            type="text"
                            required
                            value={newProdNameEn}
                            onChange={(e) => setNewProdNameEn(e.target.value)}
                            placeholder="e.g. X-ZENSE 102"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            ชื่อสินค้า (ภาษาไทย)
                          </label>
                          <input
                            type="text"
                            value={newProdNameTh}
                            onChange={(e) => setNewProdNameTh(e.target.value)}
                            placeholder="เช่น X-ZENSE 102"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Category *
                          </label>
                          <select
                            value={newProdCategory}
                            onChange={(e) => setNewProdCategory(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent text-sm bg-white"
                          >
                            <option value="Biosensors">Biosensors</option>
                            <option value="Modules">Modules</option>
                            <option value="Chemicals">Chemicals</option>
                            <option value="Courses">Courses</option>
                            <option value="Accessories">Accessories</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            {language === "th"
                              ? "ราคา (บาท / THB) *"
                              : "Price (฿ THB) *"}
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            required
                            value={newProdPrice}
                            onChange={(e) => setNewProdPrice(e.target.value)}
                            placeholder="e.g. 5250.00"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                          Description (EN)
                        </label>
                        <textarea
                          rows="3"
                          value={newProdDescEn}
                          onChange={(e) => setNewProdDescEn(e.target.value)}
                          placeholder="Product description in English..."
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent text-sm resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                          คำอธิบายสินค้า (ภาษาไทย)
                        </label>
                        <textarea
                          rows="3"
                          value={newProdDescTh}
                          onChange={(e) => setNewProdDescTh(e.target.value)}
                          placeholder="คำอธิบายสินค้าภาษาไทย..."
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent text-sm resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Image Path (e.g. /qcmgroupe.jpg)
                          </label>
                          <input
                            type="text"
                            value={newProdImage}
                            onChange={(e) => setNewProdImage(e.target.value)}
                            placeholder="e.g. /product-drawing-2.jpg"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Status *
                          </label>
                          <select
                            value={newProdStatus}
                            onChange={(e) => setNewProdStatus(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent text-sm bg-white"
                          >
                            <option value="In Stock">In Stock</option>
                            <option value="Out of Stock">Out of Stock</option>
                          </select>
                        </div>
                      </div>

                      <div className="pt-4 flex gap-3">
                        <button
                          type="submit"
                          className="flex-1 bg-accent hover:bg-accent-hover text-white font-bold py-3 rounded-xl transition-all cursor-pointer border-none shadow-sm"
                        >
                          {language === "th" ? "บันทึก" : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddProductModal(false)}
                          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-all cursor-pointer border-none"
                        >
                          {language === "th" ? "ยกเลิก" : "Cancel"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: ANNOUNCEMENTS MANAGEMENT */}
          {activeTab === "announcements" && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm flex items-center gap-5">
                  <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center text-accent shrink-0">
                    <Megaphone className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {language === "th"
                        ? "ประกาศทั้งหมด"
                        : "Total Announcements"}
                    </p>
                    <h3 className="text-2xl font-black text-slate-800 mt-1">
                      {announcementsList.length}
                    </h3>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm flex items-center gap-5">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                    <Sparkles className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {language === "th" ? "เผยแพร่แล้ว" : "Published"}
                    </p>
                    <h3 className="text-2xl font-black text-slate-800 mt-1">
                      {announcementsList.filter((a) => a.is_published).length}
                    </h3>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm flex items-center gap-5">
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 shrink-0">
                    <Pin className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {language === "th" ? "ปักหมุด" : "Pinned"}
                    </p>
                    <h3 className="text-2xl font-black text-slate-800 mt-1">
                      {announcementsList.filter((a) => a.is_pinned).length}
                    </h3>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm flex items-center gap-5">
                  <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 shrink-0">
                    <Newspaper className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {language === "th" ? "ฉบับร่าง" : "Drafts"}
                    </p>
                    <h3 className="text-2xl font-black text-slate-800 mt-1">
                      {announcementsList.filter((a) => !a.is_published).length}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Action Bar (Search & Filter + Add Announcement) */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={announcementSearch}
                      onChange={(e) => setAnnouncementSearch(e.target.value)}
                      placeholder={
                        language === "th"
                          ? "ค้นหาประกาศ..."
                          : "Search announcements..."
                      }
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-accent bg-slate-50"
                    />
                  </div>

                  <select
                    value={announcementCategoryFilter}
                    onChange={(e) =>
                      setAnnouncementCategoryFilter(e.target.value)
                    }
                    className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 font-medium focus:outline-none focus:border-accent"
                  >
                    <option value="all">
                      {language === "th" ? "ทุกหมวดหมู่" : "All Categories"}
                    </option>
                    <option value="general">General (ทั่วไป)</option>
                    <option value="news">News (ข่าวสาร)</option>
                    <option value="promotion">Promotion (อบรม)</option>
                    <option value="system">System (ระบบ)</option>
                    <option value="medical">Medical (วิจัย/แพทย์)</option>
                  </select>

                  <select
                    value={announcementPublishFilter}
                    onChange={(e) =>
                      setAnnouncementPublishFilter(e.target.value)
                    }
                    className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 font-medium focus:outline-none focus:border-accent"
                  >
                    <option value="all">
                      {language === "th" ? "สถานะทั้งหมด" : "All Status"}
                    </option>
                    <option value="published">
                      {language === "th" ? "เผยแพร่แล้ว" : "Published"}
                    </option>
                    <option value="draft">
                      {language === "th" ? "ฉบับร่าง" : "Draft"}
                    </option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    resetAnnForm();
                    setShowCreateAnnouncementModal(true);
                  }}
                  className="w-full md:w-auto flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm text-xs cursor-pointer border-none"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {language === "th"
                      ? "สร้างประกาศใหม่"
                      : "Create Announcement"}
                  </span>
                </button>
              </div>

              {/* Table List of Announcements */}
              <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-400 uppercase font-extrabold tracking-wider">
                        <th className="py-4 px-6">ID</th>
                        <th className="py-4 px-6">
                          {language === "th" ? "ประกาศ" : "Announcement"}
                        </th>
                        <th className="py-4 px-6">
                          {language === "th" ? "หมวดหมู่" : "Category"}
                        </th>
                        <th className="py-4 px-6 text-center">
                          {language === "th" ? "ปักหมุด" : "Pinned"}
                        </th>
                        <th className="py-4 px-6 text-center">
                          {language === "th" ? "สถานะ" : "Status"}
                        </th>
                        <th className="py-4 px-6">
                          {language === "th" ? "วันที่สร้าง" : "Created At"}
                        </th>
                        <th className="py-4 px-6 text-center">
                          {language === "th" ? "จัดการ" : "Actions"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredAnnouncementsList.length === 0 ? (
                        <tr>
                          <td
                            colSpan="7"
                            className="py-12 text-center text-slate-400 font-semibold"
                          >
                            {language === "th"
                              ? "ไม่พบรายการประกาศ"
                              : "No announcements found."}
                          </td>
                        </tr>
                      ) : (
                        filteredAnnouncementsList.map((ann) => (
                          <tr
                            key={ann.id}
                            className="hover:bg-slate-50/80 transition-colors"
                          >
                            <td className="py-4 px-6 font-mono font-bold text-slate-400">
                              #{ann.id}
                            </td>
                            <td className="py-4 px-6 max-w-xs">
                              <div className="flex items-center gap-3">
                                {ann.image_url ? (
                                  <img
                                    src={ann.image_url}
                                    alt=""
                                    className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                                    <Newspaper className="w-5 h-5" />
                                  </div>
                                )}
                                <div>
                                  <h4 className="font-bold text-slate-800 text-xs line-clamp-1">
                                    {ann.title}
                                  </h4>
                                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                                    {ann.summary || ann.content}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                                {ann.category}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <button
                                onClick={() => handleTogglePinAnnouncement(ann)}
                                className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                                  ann.is_pinned
                                    ? "bg-amber-50 text-amber-600 border-amber-200 font-bold"
                                    : "bg-slate-50 text-slate-400 border-slate-200 hover:text-amber-500"
                                }`}
                                title={
                                  ann.is_pinned
                                    ? "Unpin Announcement"
                                    : "Pin Announcement"
                                }
                              >
                                <Pin
                                  className={`w-3.5 h-3.5 ${ann.is_pinned ? "fill-amber-500" : ""}`}
                                />
                              </button>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <button
                                onClick={() =>
                                  handleTogglePublishAnnouncement(ann)
                                }
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                                  ann.is_published
                                    ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                    : "bg-slate-100 text-slate-500 border-slate-200"
                                }`}
                              >
                                {ann.is_published
                                  ? language === "th"
                                    ? "เผยแพร่แล้ว"
                                    : "Published"
                                  : language === "th"
                                    ? "ฉบับร่าง"
                                    : "Draft"}
                              </button>
                            </td>
                            <td className="py-4 px-6 text-slate-400 text-[11px]">
                              {ann.created_at
                                ? new Date(ann.created_at).toLocaleDateString()
                                : "-"}
                            </td>
                            <td className="py-4 px-6 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() =>
                                    handleOpenEditAnnouncement(ann)
                                  }
                                  className="p-1.5 text-slate-500 hover:text-accent hover:bg-sky-50 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
                                  title="Edit Announcement"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteAnnouncement(ann.id)
                                  }
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
                                  title="Delete Announcement"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Create Announcement Modal */}
              {showCreateAnnouncementModal && (
                <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-white rounded-[2.5rem] border border-slate-200/80 shadow-2xl p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-black text-slate-800 tracking-tight">
                        {language === "th"
                          ? "สร้างประกาศข่าวสารใหม่"
                          : "Create New Announcement"}
                      </h2>
                      <button
                        onClick={() => setShowCreateAnnouncementModal(false)}
                        className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors bg-transparent border-none cursor-pointer outline-none"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form
                      onSubmit={handleCreateAnnouncementSubmit}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                          Title (หัวข้อประกาศ) *
                        </label>
                        <input
                          type="text"
                          required
                          value={annTitle}
                          onChange={(e) => setAnnTitle(e.target.value)}
                          placeholder="e.g. SuraZense Announces Xzense-101 Release"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Category (หมวดหมู่) *
                          </label>
                          <select
                            value={annCategory}
                            onChange={(e) => setAnnCategory(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent text-sm bg-white"
                          >
                            <option value="general">General (ทั่วไป)</option>
                            <option value="news">News (ข่าวสาร)</option>
                            <option value="promotion">Promotion (อบรม)</option>
                            <option value="system">System (ระบบ)</option>
                            <option value="medical">
                              Medical (วิจัย/แพทย์)
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Cover Image URL (รูปภาพปก)
                          </label>
                          <input
                            type="text"
                            value={annImageUrl}
                            onChange={(e) => setAnnImageUrl(e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                          Short Summary (สรุปสั้นๆ สำหรับแสดงการ์ด)
                        </label>
                        <input
                          type="text"
                          value={annSummary}
                          onChange={(e) => setAnnSummary(e.target.value)}
                          placeholder="Brief snippet for preview cards..."
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                          Content Body (รายละเอียดประกาศ) *
                        </label>
                        <textarea
                          required
                          rows="6"
                          value={annContent}
                          onChange={(e) => setAnnContent(e.target.value)}
                          placeholder="Write the complete announcement content here..."
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent text-sm resize-none"
                        />
                      </div>

                      <div className="flex items-center gap-6 pt-2">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={annIsPublished}
                            onChange={(e) =>
                              setAnnIsPublished(e.target.checked)
                            }
                            className="w-4 h-4 rounded text-accent"
                          />
                          <span>
                            {language === "th"
                              ? "เผยแพร่ทันที (Publish)"
                              : "Publish immediately"}
                          </span>
                        </label>

                        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={annIsPinned}
                            onChange={(e) => setAnnIsPinned(e.target.checked)}
                            className="w-4 h-4 rounded text-amber-500"
                          />
                          <span>
                            {language === "th"
                              ? "ปักหมุดข่าวสำคัญ (Pin)"
                              : "Pin as Featured"}
                          </span>
                        </label>
                      </div>

                      <div className="pt-4 flex gap-3">
                        <button
                          type="submit"
                          className="flex-1 bg-accent hover:bg-accent-hover text-white font-bold py-3 rounded-xl transition-all cursor-pointer border-none shadow-sm text-xs"
                        >
                          {language === "th"
                            ? "บันทึกสร้างประกาศ"
                            : "Create Announcement"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowCreateAnnouncementModal(false)}
                          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-all cursor-pointer border-none text-xs"
                        >
                          {language === "th" ? "ยกเลิก" : "Cancel"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Edit Announcement Modal */}
              {showEditAnnouncementModal && (
                <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-white rounded-[2.5rem] border border-slate-200/80 shadow-2xl p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-black text-slate-800 tracking-tight">
                        {language === "th"
                          ? "แก้ไขประกาศข่าวสาร"
                          : "Edit Announcement"}{" "}
                        #{showEditAnnouncementModal.id}
                      </h2>
                      <button
                        onClick={() => setShowEditAnnouncementModal(null)}
                        className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors bg-transparent border-none cursor-pointer outline-none"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form
                      onSubmit={handleUpdateAnnouncementSubmit}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                          Title (หัวข้อประกาศ) *
                        </label>
                        <input
                          type="text"
                          required
                          value={annTitle}
                          onChange={(e) => setAnnTitle(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Category (หมวดหมู่) *
                          </label>
                          <select
                            value={annCategory}
                            onChange={(e) => setAnnCategory(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent text-sm bg-white"
                          >
                            <option value="general">General (ทั่วไป)</option>
                            <option value="news">News (ข่าวสาร)</option>
                            <option value="promotion">Promotion (อบรม)</option>
                            <option value="system">System (ระบบ)</option>
                            <option value="medical">
                              Medical (วิจัย/แพทย์)
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Cover Image URL (รูปภาพปก)
                          </label>
                          <input
                            type="text"
                            value={annImageUrl}
                            onChange={(e) => setAnnImageUrl(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                          Short Summary (สรุปสั้นๆ)
                        </label>
                        <input
                          type="text"
                          value={annSummary}
                          onChange={(e) => setAnnSummary(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                          Content Body (รายละเอียดประกาศ) *
                        </label>
                        <textarea
                          required
                          rows="6"
                          value={annContent}
                          onChange={(e) => setAnnContent(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent text-sm resize-none"
                        />
                      </div>

                      <div className="flex items-center gap-6 pt-2">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={annIsPublished}
                            onChange={(e) =>
                              setAnnIsPublished(e.target.checked)
                            }
                            className="w-4 h-4 rounded text-accent"
                          />
                          <span>
                            {language === "th"
                              ? "เผยแพร่ (Published)"
                              : "Is Published"}
                          </span>
                        </label>

                        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={annIsPinned}
                            onChange={(e) => setAnnIsPinned(e.target.checked)}
                            className="w-4 h-4 rounded text-amber-500"
                          />
                          <span>
                            {language === "th"
                              ? "ปักหมุดข่าว (Pinned)"
                              : "Is Pinned"}
                          </span>
                        </label>
                      </div>

                      <div className="pt-4 flex gap-3">
                        <button
                          type="submit"
                          className="flex-1 bg-accent hover:bg-accent-hover text-white font-bold py-3 rounded-xl transition-all cursor-pointer border-none shadow-sm text-xs"
                        >
                          {language === "th"
                            ? "บันทึกการแก้ไข"
                            : "Save Changes"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowEditAnnouncementModal(null)}
                          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-all cursor-pointer border-none text-xs"
                        >
                          {language === "th" ? "ยกเลิก" : "Cancel"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: NOTIFICATIONS MANAGEMENT */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm flex items-center gap-5">
                  <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center text-accent shrink-0">
                    <Bell className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {language === "th"
                        ? "การแจ้งเตือนทั้งหมด"
                        : "Total Notifications"}
                    </p>
                    <h3 className="text-2xl font-black text-slate-800 mt-1">
                      {notificationsList.length}
                    </h3>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm flex items-center gap-5">
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 shrink-0">
                    <AlertCircle className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {language === "th" ? "ยังไม่อ่าน" : "Unread"}
                    </p>
                    <h3 className="text-2xl font-black text-slate-800 mt-1">
                      {notificationsList.filter((n) => !n.is_read).length}
                    </h3>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm flex items-center gap-5">
                  <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 shrink-0">
                    <Megaphone className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {language === "th"
                        ? "ประกาศทั้งระบบ (Broadcast)"
                        : "Broadcast Alerts"}
                    </p>
                    <h3 className="text-2xl font-black text-slate-800 mt-1">
                      {
                        notificationsList.filter((n) => n.user_id === null)
                          .length
                      }
                    </h3>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm flex items-center gap-5">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                    <Users className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {language === "th"
                        ? "ระบุรายบุคคล (Direct)"
                        : "Targeted User Alerts"}
                    </p>
                    <h3 className="text-2xl font-black text-slate-800 mt-1">
                      {
                        notificationsList.filter((n) => n.user_id !== null)
                          .length
                      }
                    </h3>
                  </div>
                </div>
              </div>

              {/* Action Bar (Search & Filter + Add Notification) */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={notifSearch}
                      onChange={(e) => setNotifSearch(e.target.value)}
                      placeholder={
                        language === "th"
                          ? "ค้นหาการแจ้งเตือน..."
                          : "Search notifications..."
                      }
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-accent bg-slate-50"
                    />
                  </div>

                  <select
                    value={notifTypeFilter}
                    onChange={(e) => setNotifTypeFilter(e.target.value)}
                    className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 font-medium focus:outline-none focus:border-accent"
                  >
                    <option value="all">
                      {language === "th" ? "ทุกประเภท" : "All Types"}
                    </option>
                    <option value="system">System (ระบบ)</option>
                    <option value="order">Order (คำสั่งซื้อ)</option>
                    <option value="announcement">Announcement (ประกาศ)</option>
                    <option value="report">Report (รายงาน)</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    resetNotifForm();
                    setShowCreateNotifModal(true);
                  }}
                  className="w-full md:w-auto flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm text-xs cursor-pointer border-none"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {language === "th"
                      ? "ส่งการแจ้งเตือนใหม่"
                      : "Create Notification"}
                  </span>
                </button>
              </div>

              {/* Table List of Notifications */}
              <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-400 uppercase font-extrabold tracking-wider">
                        <th className="py-4 px-6">ID</th>
                        <th className="py-4 px-6">
                          {language === "th" ? "ผู้รับ" : "Target User"}
                        </th>
                        <th className="py-4 px-6">
                          {language === "th"
                            ? "หัวข้อ & ข้อความ"
                            : "Title & Message"}
                        </th>
                        <th className="py-4 px-6 text-center">
                          {language === "th" ? "ประเภท" : "Type"}
                        </th>
                        <th className="py-4 px-6 text-center">
                          {language === "th" ? "อ่านแล้ว" : "Status"}
                        </th>
                        <th className="py-4 px-6">
                          {language === "th" ? "วันที่สร้าง" : "Created At"}
                        </th>
                        <th className="py-4 px-6 text-center">
                          {language === "th" ? "จัดการ" : "Actions"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredNotificationsList.length === 0 ? (
                        <tr>
                          <td
                            colSpan="7"
                            className="py-12 text-center text-slate-400 font-semibold"
                          >
                            {language === "th"
                              ? "ไม่พบรายการแจ้งเตือน"
                              : "No notifications found."}
                          </td>
                        </tr>
                      ) : (
                        filteredNotificationsList.map((n) => (
                          <tr
                            key={n.id}
                            className="hover:bg-slate-50/80 transition-colors"
                          >
                            <td className="py-4 px-6 font-mono font-bold text-slate-400">
                              #{n.id}
                            </td>
                            <td className="py-4 px-6">
                              {n.user_id === null ? (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-purple-50 text-purple-600 border border-purple-100">
                                  Broadcast (All Users)
                                </span>
                              ) : (
                                <span className="font-mono font-semibold text-slate-700">
                                  User #{n.user_id}
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-6 max-w-sm">
                              <h4 className="font-bold text-slate-800 text-xs line-clamp-1">
                                {n.title}
                              </h4>
                              <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                                {n.message}
                              </p>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-600 border border-slate-200">
                                {n.type}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                                  n.is_read
                                    ? "bg-slate-100 text-slate-500 border-slate-200"
                                    : "bg-amber-50 text-amber-600 border-amber-200"
                                }`}
                              >
                                {n.is_read
                                  ? language === "th"
                                    ? "อ่านแล้ว"
                                    : "Read"
                                  : language === "th"
                                    ? "ยังไม่อ่าน"
                                    : "Unread"}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-slate-400 text-[11px]">
                              {n.created_at
                                ? new Date(n.created_at).toLocaleString()
                                : "-"}
                            </td>
                            <td className="py-4 px-6 text-center">
                              <button
                                onClick={() => handleDeleteNotification(n.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
                                title="Delete Notification"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Create Notification Modal */}
              {showCreateNotifModal && (
                <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-white rounded-[2.5rem] border border-slate-200/80 shadow-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-black text-slate-800 tracking-tight">
                        {language === "th"
                          ? "สร้างการแจ้งเตือนใหม่"
                          : "Send New Notification"}
                      </h2>
                      <button
                        onClick={() => setShowCreateNotifModal(false)}
                        className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors bg-transparent border-none cursor-pointer outline-none"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form
                      onSubmit={handleCreateNotificationSubmit}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                          Target Recipient (ผู้รับการแจ้งเตือน) *
                        </label>
                        <select
                          value={createNotifTargetUserId}
                          onChange={(e) =>
                            setCreateNotifTargetUserId(e.target.value)
                          }
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent text-sm bg-white"
                        >
                          <option value="broadcast">
                            📢 All Users (Broadcast ถึงผู้ใช้งานทุกคน)
                          </option>
                          {usersList.map((u) => (
                            <option key={u.id} value={u.id}>
                              👤 User #{u.id} - {u.email} (
                              {u.first_name || u.username || "User"})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                          Title (หัวข้อการแจ้งเตือน) *
                        </label>
                        <input
                          type="text"
                          required
                          value={createNotifTitle}
                          onChange={(e) => setCreateNotifTitle(e.target.value)}
                          placeholder="e.g. Order Status Update / System Announcement"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Type (ประเภท) *
                          </label>
                          <select
                            value={createNotifType}
                            onChange={(e) => setCreateNotifType(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent text-sm bg-white"
                          >
                            <option value="system">System (ระบบ)</option>
                            <option value="order">Order (คำสั่งซื้อ)</option>
                            <option value="announcement">
                              Announcement (ข่าวสาร)
                            </option>
                            <option value="report">Report (รายงาน)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Reference ID (ID อ้างอิง เช่น ID คำสั่งซื้อ)
                          </label>
                          <input
                            type="number"
                            value={createNotifRefId}
                            onChange={(e) =>
                              setCreateNotifRefId(e.target.value)
                            }
                            placeholder="Optional ID"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                          Message Body (ข้อความการแจ้งเตือน) *
                        </label>
                        <textarea
                          required
                          rows="4"
                          value={createNotifMessage}
                          onChange={(e) =>
                            setCreateNotifMessage(e.target.value)
                          }
                          placeholder="Write the notification message details..."
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent text-sm resize-none"
                        />
                      </div>

                      <div className="pt-4 flex gap-3">
                        <button
                          type="submit"
                          className="flex-1 bg-accent hover:bg-accent-hover text-white font-bold py-3 rounded-xl transition-all cursor-pointer border-none shadow-sm text-xs flex items-center justify-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          <span>
                            {language === "th"
                              ? "ส่งการแจ้งเตือน"
                              : "Send Notification"}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowCreateNotifModal(false)}
                          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-all cursor-pointer border-none text-xs"
                        >
                          {language === "th" ? "ยกเลิก" : "Cancel"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SYSTEM SETTINGS */}
          {activeTab === "settings" && (
            <div className="max-w-2xl space-y-8">
              {/* Change Passcode Card */}
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-accent">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800">
                      {language === "th"
                        ? "เปลี่ยนรหัสผ่านผู้ดูแลระบบ (Passcode)"
                        : "Update Admin Passcode"}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {language === "th"
                        ? "รหัสผ่านที่ใช้ในการปลดล็อคหน้าควบคุมของ Admin"
                        : "Change the unlock code used to access this console page."}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleUpdatePasscode} className="space-y-4">
                  {passcodeSuccess && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-emerald-600 text-xs font-semibold">
                      {passcodeSuccess}
                    </div>
                  )}
                  {passcodeUpdateError && (
                    <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 text-rose-600 text-xs font-semibold">
                      {passcodeUpdateError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                        {language === "th" ? "รหัสผ่านใหม่" : "New Passcode"}
                      </label>
                      <input
                        type="password"
                        required
                        value={newPasscode}
                        onChange={(e) => setNewPasscode(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-accent text-sm text-slate-850 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                        {language === "th"
                          ? "ยืนยันรหัสผ่านใหม่"
                          : "Confirm New Passcode"}
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmNewPasscode}
                        onChange={(e) => setConfirmNewPasscode(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-accent text-sm text-slate-850 bg-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-accent hover:bg-accent-hover text-white font-bold px-5 py-3 rounded-xl transition-all cursor-pointer border-none shadow-sm text-xs"
                  >
                    {language === "th" ? "อัพเดทรหัสผ่าน" : "Update Passcode"}
                  </button>
                </form>
              </div>

              {/* Session Inactivity Timeout Card */}
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800">
                      {language === "th"
                        ? "ระบบหมดเวลาเซสชันเมื่อไม่มีการใช้งาน (Website Inactivity Timeout)"
                        : "Website Session Inactivity Timeout"}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {language === "th"
                        ? "ออกจากระบบอัตโนมัติบนหน้าเว็บหลักเมื่อผู้ใช้ไม่มีการเคลื่อนไหว (ไม่มีผลกับหน้าควบคุม Admin นี้)"
                        : "Automatically log out inactive users on the main website (does not apply to this Admin console)."}
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={handleSaveTimeoutSettings}
                  className="space-y-4"
                >
                  {settingsSuccess && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-emerald-600 text-xs font-semibold">
                      {settingsSuccess}
                    </div>
                  )}

                  <div className="flex items-center justify-between py-2 border-b border-slate-100 pb-4">
                    <span className="text-xs font-bold text-slate-500">
                      {language === "th"
                        ? "เปิดใช้งานระบบตัดเซสชัน"
                        : "Enable Inactivity Timeout"}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={timeoutEnabled}
                        onChange={(e) => setTimeoutEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                    </label>
                  </div>

                  {timeoutEnabled && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                          {language === "th"
                            ? "ระยะเวลาหมดเวลา (นาที)"
                            : "Timeout Duration (Minutes)"}
                        </label>
                        <select
                          value={timeoutDuration}
                          onChange={(e) => setTimeoutDuration(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-accent text-sm text-slate-850 bg-white font-semibold"
                        >
                          <option value="5">
                            5 {language === "th" ? "นาที" : "minutes"}
                          </option>
                          <option value="10">
                            10 {language === "th" ? "นาที" : "minutes"}
                          </option>
                          <option value="15">
                            15 {language === "th" ? "นาที" : "minutes"}
                          </option>
                          <option value="30">
                            30 {language === "th" ? "นาที" : "minutes"}
                          </option>
                          <option value="60">
                            60 {language === "th" ? "นาที" : "minutes"}
                          </option>
                        </select>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="bg-accent hover:bg-accent-hover text-white font-bold px-5 py-3 rounded-xl transition-all cursor-pointer border-none shadow-sm text-xs"
                  >
                    {language === "th"
                      ? "บันทึกการตั้งค่าเซสชัน"
                      : "Save Session Settings"}
                  </button>
                </form>
              </div>

              {/* API and server diagnostics card */}
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800">
                      {language === "th"
                        ? "ข้อมูลและเซิร์ฟเวอร์แบ็คเอนด์"
                        : "Server Connectivity Details"}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {language === "th"
                        ? "ตรวจสอบสภาพแวดล้อมระบบและการตั้งค่า API"
                        : "Inspect system settings and environment variables."}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-500">
                      API Endpoint URL
                    </span>
                    <span className="text-xs font-mono text-slate-700 bg-slate-55 border border-slate-200 px-2 py-1 rounded">
                      {API_URL}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-500">
                      {language === "th"
                        ? "สิทธิ์การเข้าถึงคอนโซล"
                        : "Authorization Key Status"}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <UserCheck className="w-4 h-4" />
                      <span>
                        {language === "th"
                          ? "สิทธิ์การควบคุมระดับสูง"
                          : "Elevated Session Activated"}
                      </span>
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-xs font-bold text-slate-500">
                      {language === "th"
                        ? "สถานะการเก็บข้อมูล"
                        : "Database Persistence Layer"}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        isApiOnline
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : "bg-amber-50 text-amber-600 border border-amber-100"
                      }`}
                    >
                      {isApiOnline
                        ? "Live Server (Database)"
                        : "Mock Sandbox (Local Storage)"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Login Modal for User Account Session */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] border border-slate-200/80 shadow-2xl p-8 w-full max-w-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">
                {language === "th" ? "เข้าสู่ระบบสมาชิก" : "Account Sign In"}
              </h2>
              <button
                onClick={() => {
                  setIsLoginModalOpen(false);
                  setLoginError("");
                }}
                className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors bg-transparent border-none cursor-pointer outline-none"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 text-rose-600 text-xs font-semibold">
                  {loginError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent text-sm"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="flex-1 bg-accent hover:bg-accent-hover text-white font-bold py-3 rounded-xl transition-all cursor-pointer border-none shadow-sm disabled:opacity-50"
                >
                  {isLoggingIn
                    ? language === "th"
                      ? "กำลังดำเนินการ..."
                      : "Processing..."
                    : language === "th"
                      ? "เข้าสู่ระบบ"
                      : "Sign In"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginModalOpen(false);
                    setLoginError("");
                  }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-all cursor-pointer border-none"
                >
                  {language === "th" ? "ยกเลิก" : "Cancel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
