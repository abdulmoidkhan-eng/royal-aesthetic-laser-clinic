import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Lock, ShieldCheck, Sparkles, ShoppingBag, Package, Settings, 
  LogOut, ExternalLink, AlertTriangle, CheckCircle2, User, RefreshCw,
  Megaphone, Image as ImageIcon, Star
} from 'lucide-react';
import { AdminAuthProvider, useAdminAuth } from '../context/AdminAuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { AUTHORIZED_ADMIN_EMAIL } from '../firebase/adminService.js';
import Button from '../components/UI/Button.jsx';
import Card from '../components/UI/Card.jsx';
import Badge from '../components/UI/Badge.jsx';

import ServicesManager from '../components/Admin/ServicesManager.jsx';
import ProductsManager from '../components/Admin/ProductsManager.jsx';
import OrdersManager from '../components/Admin/OrdersManager.jsx';
import SettingsManager from '../components/Admin/SettingsManager.jsx';
import BannerManager from '../components/Admin/BannerManager.jsx';
import GalleryManager from '../components/Admin/GalleryManager.jsx';
import ReviewsManager from '../components/Admin/ReviewsManager.jsx';

const AdminPageContent = () => {
  const { 
    currentUser, loading, authError, isAuthorizedAdmin, 
    loginWithGoogle, logoutAdmin, setAuthError 
  } = useAdminAuth();
  const { isRTL } = useLanguage();

  const [activeTab, setActiveTab] = useState('services'); // 'services', 'products', 'orders', 'banner', 'gallery', 'reviews', 'settings'
  const [loggingIn, setLoggingIn] = useState(false);

  const handleLogin = async () => {
    setLoggingIn(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      // Handled in context
    } finally {
      setLoggingIn(false);
    }
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-[#FBF3F0]/40">
        <div className="w-14 h-14 rounded-2xl bg-[#F4E4DE] text-[#D9A38F] flex items-center justify-center mb-4 shadow-sm animate-pulse">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-xl font-semibold text-[#3A3A3A]">
          Verifying Clinic Admin Credentials...
        </h2>
        <p className="text-xs text-[#6B5B55] mt-1">Connecting to Firebase Authentication</p>
      </div>
    );
  }

  // 2. Unauthenticated State -> Google Sign-In Gate
  if (!currentUser) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4 sm:p-6 bg-[#FBF3F0]/40">
        <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-[#F4E4DE] shadow-lg text-center space-y-6">
          {/* Clinic Brand Crest */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F4E4DE] to-[#D9A38F] text-white flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8 text-[#3A3A3A]" />
          </div>

          <div>
            <span className="text-[11px] font-bold tracking-widest text-[#D9A38F] uppercase block mb-1">
              Private Management Portal
            </span>
            <h1 className="font-serif text-2xl font-bold text-[#3A3A3A]">
              Royal Aesthetic & Laser Clinic
            </h1>
            <p className="text-xs text-[#6B5B55] mt-2 leading-relaxed">
              Administrative access to treatment catalog, skincare inventory, customer orders, and live clinic settings.
            </p>
          </div>

          {/* Authorized Email Notice */}
          <div className="p-3 bg-[#FBF3F0] rounded-2xl border border-[#F4E4DE] text-xs text-[#6B5B55] text-start space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[#3A3A3A]">
              <ShieldCheck className="w-4 h-4 text-[#D9A38F]" />
              <span>Restricted Access Control</span>
            </div>
            <p className="text-[11px]">
              Access is strictly restricted to authorized clinic management:
            </p>
            <p className="font-mono text-xs font-bold text-[#D9A38F]">
              {AUTHORIZED_ADMIN_EMAIL}
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-start gap-2 text-start">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleLogin}
            disabled={loggingIn}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-50 text-sm font-semibold text-zinc-800 shadow-xs transition-all active:scale-[0.99] disabled:opacity-50"
          >
            {loggingIn ? (
              <RefreshCw className="w-5 h-5 text-[#D9A38F] animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Sign in with Google as Clinic Admin</span>
          </button>

          <div className="pt-2">
            <Link
              to="/"
              className="text-xs text-[#6B5B55] hover:text-[#D9A38F] transition-colors"
            >
              ← Return to Public Clinic Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated but Unauthorized Email State
  if (!isAuthorizedAdmin) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4 sm:p-6 bg-[#FBF3F0]/40">
        <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-red-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[11px] font-bold tracking-widest text-red-600 uppercase block mb-1">
              Access Restricted
            </span>
            <h2 className="font-serif text-xl font-bold text-[#3A3A3A]">
              Unauthorized Account
            </h2>
            <p className="text-xs text-[#6B5B55] mt-2 leading-relaxed">
              You are currently signed in as:
            </p>
            <p className="font-mono text-xs font-semibold text-[#3A3A3A] bg-zinc-100 py-1.5 px-3 rounded-lg mt-1 break-all">
              {currentUser.email}
            </p>
          </div>

          <div className="p-3 bg-red-50/70 rounded-2xl border border-red-200 text-xs text-red-800 text-start space-y-1">
            <p className="font-semibold">Security Requirement:</p>
            <p className="text-[11px]">
              Only the verified administrator account ({AUTHORIZED_ADMIN_EMAIL}) is permitted to manage Royal Aesthetic & Laser Clinic.
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button
              variant="primary"
              onClick={logoutAdmin}
              className="w-full justify-center bg-red-600 hover:bg-red-700 text-white"
            >
              Sign Out & Switch Account
            </Button>
            <Link to="/">
              <Button variant="outline" className="w-full justify-center">
                Return to Clinic Website
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authorized Admin Dashboard View
  const tabs = [
    { id: 'services', label: 'Services', labelUr: 'طبی خدمات', icon: Sparkles },
    { id: 'products', label: 'Products', labelUr: 'اسکن کیئر مصنوعات', icon: ShoppingBag },
    { id: 'orders', label: 'Orders & Receipts', labelUr: 'گاہکوں کے آرڈرز', icon: Package },
    { id: 'banner', label: 'Offers Banner', labelUr: 'سیزنل آفر بینر', icon: Megaphone },
    { id: 'gallery', label: 'Before & After', labelUr: 'کلینیکل گیلری', icon: ImageIcon },
    { id: 'reviews', label: 'Reviews', labelUr: 'مریضوں کے تاثرات', icon: Star },
    { id: 'settings', label: 'Site Settings', labelUr: 'کلینک ترتیبات', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#FBF3F0]/30 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Admin Header Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#F4E4DE] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-xs border border-[#F4E4DE] bg-white shrink-0 flex items-center justify-center p-0.5">
              <img 
                src="/assets/aistudio/Golden_Crowned_R_Emblem_44ae7f4a.png" 
                alt="Royal Aesthetic & Laser Clinic Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#3A3A3A]">
                  Royal Aesthetic Clinic
                </h1>
                <Badge variant="blush" className="text-[10px]">Portal</Badge>
              </div>
              <p className="text-xs text-[#6B5B55]">
                Dermatology, Laser, Dispensary & Order Verification
              </p>
            </div>
          </div>

          {/* Admin User Profile & Navigation */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FBF3F0] border border-[#F4E4DE] text-xs text-[#3A3A3A]">
              <div className="w-6 h-6 rounded-full bg-[#D9A38F] text-white flex items-center justify-center font-bold text-[10px]">
                {currentUser.displayName ? currentUser.displayName[0] : 'A'}
              </div>
              <div className="flex flex-col text-start">
                <span className="font-semibold text-[11px] truncate max-w-[140px] sm:max-w-[200px]">
                  {currentUser.email}
                </span>
                <span className="text-[9px] text-emerald-700 font-bold uppercase tracking-wider">
                  Verified Admin
                </span>
              </div>
            </div>

            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-[#F4E4DE] bg-white text-[#3A3A3A] hover:bg-[#FBF3F0] transition-colors"
              title="Open public website in a new tab"
            >
              <span>View Site</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#D9A38F]" />
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={logoutAdmin}
              className="flex items-center gap-1.5 text-xs text-red-600 hover:bg-red-50 border-red-200"
              title="Sign out of admin portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Navigation Tabs (Mobile-friendly horizontal scroll) */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-[#F4E4DE] shadow-xs overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex-1 justify-center ${
                  active
                    ? 'bg-[#3A3A3A] text-white shadow-xs'
                    : 'text-[#6B5B55] hover:text-[#3A3A3A] hover:bg-[#FBF3F0]'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-[#D9A38F]' : 'text-[#6B5B55]'}`} />
                <span>{tab.label}</span>
                {isRTL && (
                  <span className="text-[11px] font-serif opacity-80">
                    ({tab.labelUr})
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="transition-all duration-150">
          {activeTab === 'services' && <ServicesManager />}
          {activeTab === 'products' && <ProductsManager />}
          {activeTab === 'orders' && <OrdersManager />}
          {activeTab === 'banner' && <BannerManager />}
          {activeTab === 'gallery' && <GalleryManager />}
          {activeTab === 'reviews' && <ReviewsManager />}
          {activeTab === 'settings' && <SettingsManager />}
        </div>
      </div>
    </div>
  );
};

export const AdminPage = () => (
  <AdminAuthProvider>
    <AdminPageContent />
  </AdminAuthProvider>
);

export default AdminPage;
