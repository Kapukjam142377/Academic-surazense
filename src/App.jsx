import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useParams,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AcademicTraining from "./pages/AcademicTraining";
import Checkout from "./pages/Checkout";
import Services from "./pages/Services";
import News from "./pages/News";
import Contacts from "./pages/Contacts";
import Admin from "./pages/Admin";
import OrderHistory from "./pages/OrderHistory";
import Profile from "./pages/Profile";
import { CartProvider } from "./context/CartContext";
import { LanguageProvider } from "./context/LanguageContext";
import { UserProvider } from "./context/UserContext";

const COMPANY_WEB_URL =
  import.meta.env.VITE_COMPANY_WEB_URL || "http://localhost:5173";

// Scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);
    return () => clearTimeout(timer);
  }, [pathname]);
  return null;
}

// Redirect helper to route user to Company Web
function ExternalRedirect({ pathPattern }) {
  const params = useParams();
  useEffect(() => {
    let targetPath = pathPattern;
    Object.keys(params).forEach((key) => {
      targetPath = targetPath.replace(`:${key}`, params[key]);
    });
    window.location.replace(`${COMPANY_WEB_URL}${targetPath}`);
  }, [pathPattern, params]);
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mb-4"></div>
      <p>Redirecting to Company Web...</p>
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <LanguageProvider>
        <CartProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Layout>
              <Routes>
                {/* Make root path route to AcademicTraining */}
                <Route path="/" element={<AcademicTraining />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route
                  path="/academic-training"
                  element={<AcademicTraining />}
                />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/services" element={<Services />} />
                <Route path="/news" element={<News />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/profile" element={<Profile />} />

                {/* Redirect main corporate website pages externally */}
                <Route
                  path="/about"
                  element={<ExternalRedirect pathPattern="/about" />}
                />
                <Route
                  path="/technology"
                  element={<ExternalRedirect pathPattern="/technology" />}
                />
                <Route
                  path="/collaboration"
                  element={<ExternalRedirect pathPattern="/collaboration" />}
                />
                <Route
                  path="/cancer-report"
                  element={<ExternalRedirect pathPattern="/cancer-report" />}
                />
              </Routes>
            </Layout>
          </BrowserRouter>
        </CartProvider>
      </LanguageProvider>
    </UserProvider>
  );
}

export default App;
