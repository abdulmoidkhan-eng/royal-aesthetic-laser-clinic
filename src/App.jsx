import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import FloatingWhatsApp from './components/FloatingWhatsApp.jsx';
import OffersBanner from './components/OffersBanner.jsx';
import RouteSEO from './components/RouteSEO.jsx';

// Pages - Immediate load for homepage, code-split lazy load for subpages
import HomePage from './pages/HomePage.jsx';
const ServicesPage = lazy(() => import('./pages/ServicesPage.jsx'));
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage.jsx'));
const ShopPage = lazy(() => import('./pages/ShopPage.jsx'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage.jsx'));
const CartPage = lazy(() => import('./pages/CartPage.jsx'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage.jsx'));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage.jsx'));
const ReviewsPage = lazy(() => import('./pages/ReviewsPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const AdminPage = lazy(() => import('./pages/AdminPage.jsx'));

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <LanguageProvider>
      <CartProvider>
          <BrowserRouter>
            <ScrollToTop />
            <RouteSEO />
            <div className="flex flex-col min-h-screen overflow-x-hidden selection:bg-[#F3EEE5] selection:text-[#262626]">
              <OffersBanner />
              <Header />
              <main className="flex-1">
                <Suspense
                  fallback={
                    <div className="min-h-[50vh] flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full border-2 border-[#C5A46D] border-t-transparent animate-spin" />
                    </div>
                  }
                >
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/services/:id" element={<ServiceDetailPage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                    <Route path="/gallery" element={<Navigate to="/services" replace />} />
                    <Route path="/reviews" element={<ReviewsPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="*" element={<HomePage />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
              <FloatingWhatsApp />
            </div>
          </BrowserRouter>
        </CartProvider>
    </LanguageProvider>
  );
}
