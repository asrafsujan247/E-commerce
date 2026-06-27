import { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";

import { useSetting } from "@stores/useSettingStore";
import { useAuth } from "@stores/useAuthStore";
import Providers from "./Providers";
import { SettingProvider } from "@stores/useSettingStore";
import {
  getGlobalSetting,
  getStoreSetting,
  getStoreCustomizationSetting,
} from "@services/SettingServices";
import type {
  GlobalSetting,
  StoreSetting,
  StoreCustomizationSetting,
} from "@appTypes/index";

// Lazy-loaded layout components
const Navbar = lazy(() => import("@layout/navbar/Navbar"));
const Footer = lazy(() => import("@layout/footer/Footer"));
const FooterTop = lazy(() => import("@layout/footer/FooterTop"));
const FeatureCard = lazy(() => import("@components/feature-card/FeatureCard"));

// Lazy-loaded pages
const HomePage = lazy(() => import("@pages/Home"));
const ProductPage = lazy(() => import("@pages/Product"));
const SearchPage = lazy(() => import("@pages/Search"));
const CheckoutPage = lazy(() => import("@pages/Checkout"));
const CheckoutCartPage = lazy(() => import("@pages/CheckoutCart"));
const LoginPage = lazy(() => import("@pages/auth/Login"));
const SignupPage = lazy(() => import("@pages/auth/Signup"));
const ForgetPasswordPage = lazy(() => import("@pages/auth/ForgetPassword"));
const LoginAltPage = lazy(() => import("@pages/auth/LoginAlt"));
const RegisterAltPage = lazy(() => import("@pages/auth/RegisterAlt"));
const OrderPage = lazy(() => import("@pages/Order"));
const OrderConfirmationPage = lazy(() => import("@pages/OrderConfirmation"));
const TrackPage = lazy(() => import("@pages/Track"));
const TrackingPage = lazy(() => import("@pages/Tracking"));
const OffersPage = lazy(() => import("@pages/Offers"));
const FlashSalePage = lazy(() => import("@pages/FlashSale"));
const AboutUsPage = lazy(() => import("@pages/AboutUs"));
const ContactUsPage = lazy(() => import("@pages/ContactUs"));
const PrivacyPolicyPage = lazy(() => import("@pages/PrivacyPolicy"));
const TermsPage = lazy(() => import("@pages/Terms"));
const NotFoundPage = lazy(() => import("@pages/NotFound"));
const RfqPage = lazy(() => import("@pages/Rfq"));
const InquiryPage = lazy(() => import("@pages/Inquiry"));

// User dashboard pages
const UserLayout = lazy(() => import("@pages/user/UserLayout"));
const DashboardPage = lazy(() => import("@pages/user/Dashboard"));
const MyAccountPage = lazy(() => import("@pages/user/MyAccount"));
const MyOrdersPage = lazy(() => import("@pages/user/MyOrders"));
const MyReviewsPage = lazy(() => import("@pages/user/MyReviews"));
const NotificationsPage = lazy(() => import("@pages/user/Notifications"));
const UpdateProfilePage = lazy(() => import("@pages/user/UpdateProfile"));
const ChangePasswordPage = lazy(() => import("@pages/user/ChangePassword"));
const ShippingAddressPage = lazy(() => import("@pages/user/ShippingAddress"));
const AddShippingAddressPage = lazy(
  () => import("@pages/user/AddShippingAddress"),
);
const ForgetPasswordTokenPage = lazy(
  () => import("@pages/user/ForgetPasswordToken"),
);

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Protected route wrapper
function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/auth/login?redirectUrl=/user/dashboard" replace />;
  }
  return <Outlet />;
}

// Layout wrapper with Navbar + Footer
function AppLayout() {
  const { globalSetting, storeCustomization } = useSetting();
  const navProps = {
    globalSetting,
    storeCustomization,
    storeLayout: "default",
  };
  const footerProps = {
    storeCustomizationSetting: storeCustomization,
    globalSetting,
  };

  return (
    <div className="bg-background text-foreground antialiased">
      <Suspense fallback={null}>
        <Navbar {...navProps} />
      </Suspense>
      <main className="bg-background z-10">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <div className="w-full">
        <Suspense fallback={null}>
          <FooterTop storeCustomizationSetting={storeCustomization} />
        </Suspense>
        <div className="hidden relative lg:block mx-auto max-w-screen-2xl py-6 px-3 sm:px-10">
          <Suspense fallback={null}>
            <FeatureCard storeCustomizationSetting={storeCustomization} />
          </Suspense>
        </div>
        <div className="border-t border-border w-full">
          <Suspense fallback={null}>
            <Footer {...footerProps} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

// Auth layout (no navbar/footer)
function AuthLayout() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  );
}

// Root app with settings initialization
function AppWithSettings() {
  const [globalSetting, setGlobalSetting] = useState<GlobalSetting | null>(
    null,
  );
  const [storeSetting, setStoreSetting] = useState<StoreSetting | null>(null);
  const [storeCustomizationSetting, setStoreCustomizationSetting] =
    useState<StoreCustomizationSetting | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const [globalRes, storeRes, customRes] = await Promise.all([
          getGlobalSetting(),
          getStoreSetting(),
          getStoreCustomizationSetting(),
        ]);
        setGlobalSetting(globalRes.globalSetting ?? null);
        setStoreSetting(storeRes.storeSetting ?? null);
        setStoreCustomizationSetting(
          customRes.storeCustomizationSetting ?? null,
        );
      } catch {
        // Proceed with nulls if settings fail to load
      } finally {
        setLoading(false);
      }
    };
    void init();
  }, []);

  if (loading) return <PageLoader />;

  return (
    <SettingProvider
      initialGlobalSetting={globalSetting}
      initialStoreSetting={storeSetting}
      initialCustomizationSetting={storeCustomizationSetting}
    >
      <Providers storeSetting={storeSetting}>
        <ScrollToTop />
        <Routes>
          {/* Auth routes (no navbar/footer) */}
          <Route element={<AuthLayout />}>
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/signup" element={<SignupPage />} />
            <Route
              path="/auth/forget-password"
              element={<ForgetPasswordPage />}
            />
            <Route path="/login" element={<LoginAltPage />} />
            <Route path="/register" element={<RegisterAltPage />} />
          </Route>

          {/* Main layout routes */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/checkout-cart" element={<CheckoutCartPage />} />
            <Route
              path="/order/confirmation"
              element={<OrderConfirmationPage />}
            />
            <Route path="/order/:id" element={<OrderPage />} />
            <Route path="/track" element={<TrackPage />} />
            <Route path="/track/:trackingId" element={<TrackingPage />} />
            <Route path="/offers" element={<OffersPage />} />
            <Route path="/flash-sale" element={<FlashSalePage />} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/contact-us" element={<ContactUsPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-and-conditions" element={<TermsPage />} />
            <Route path="/rfq" element={<RfqPage />} />
            <Route path="/inquiry" element={<InquiryPage />} />

            {/* Protected user dashboard routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<UserLayout />}>
                <Route path="/user/dashboard" element={<DashboardPage />} />
                <Route path="/user/my-account" element={<MyAccountPage />} />
                <Route path="/user/my-orders" element={<MyOrdersPage />} />
                <Route path="/user/my-reviews" element={<MyReviewsPage />} />
                <Route
                  path="/user/notifications"
                  element={<NotificationsPage />}
                />
                <Route
                  path="/user/update-profile"
                  element={<UpdateProfilePage />}
                />
                <Route
                  path="/user/change-password"
                  element={<ChangePasswordPage />}
                />
                <Route
                  path="/user/shipping-address"
                  element={<ShippingAddressPage />}
                />
                <Route
                  path="/user/add-shipping-address"
                  element={<AddShippingAddressPage />}
                />
                <Route
                  path="/user/forget-password/:token"
                  element={<ForgetPasswordTokenPage />}
                />
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Providers>
    </SettingProvider>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <AppWithSettings />
    </Suspense>
  );
}
