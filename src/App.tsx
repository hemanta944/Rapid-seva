import React, { useState, useEffect } from 'react';
import { useStore } from './hooks/useStore';
import { Navbar } from './components/common/Navbar';
import { SplashScreen } from './components/customer/SplashScreen';
import { CustomerHome } from './components/customer/CustomerHome';
import { AssistanceRequestModal } from './components/customer/AssistanceRequestModal';
import { SearchingScreen } from './components/customer/SearchingScreen';
import { LiveTrackingModal } from './components/customer/LiveTrackingModal';
import { VehicleManager } from './components/customer/VehicleManager';
import { BookingHistory } from './components/customer/BookingHistory';
import { CustomerSupport } from './components/customer/CustomerSupport';
import { CustomerProfile } from './components/customer/CustomerProfile';
import { ProviderDashboard } from './components/provider/ProviderDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { RazorpayModal } from './components/payment/RazorpayModal';
import { EmergencyModal } from './components/common/EmergencyModal';
import { LegalModal } from './components/common/LegalModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { AuthModal } from './components/auth/AuthModal';
import { ServiceCategoryType } from './types';
import { ShieldCheck, Heart, Car, Wrench, Shield, PhoneCall } from 'lucide-react';

export function App() {
  const { activePortal, activeUser, requests, store } = useStore();

  // App Level Modal States
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    // Check if session splash already seen
    return sessionStorage.getItem('rapidseva_splash_seen') !== 'true';
  });

  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [legalOpen, setLegalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<'terms' | 'privacy' | 'refund' | 'disclaimer'>('terms');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState<boolean>(() => {
    return sessionStorage.getItem('rapidseva_gmail_prompted') !== 'true';
  });

  // Customer Modals
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [selectedCategoryForRequest, setSelectedCategoryForRequest] = useState<ServiceCategoryType | undefined>();
  const [activeSearchingRequestId, setActiveSearchingRequestId] = useState<string | null>(null);
  const [trackingBookingId, setTrackingBookingId] = useState<string | null>(null);
  const [vehiclesModalOpen, setVehiclesModalOpen] = useState(false);
  const [bookingsModalOpen, setBookingsModalOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Payment Modal
  const [paymentBookingId, setPaymentBookingId] = useState<string | null>(null);

  const handleDismissSplash = () => {
    setShowSplash(false);
    sessionStorage.setItem('rapidseva_splash_seen', 'true');
    if (sessionStorage.getItem('rapidseva_gmail_prompted') !== 'true') {
      setAuthOpen(true);
    }
  };

  const handleCloseAuth = () => {
    setAuthOpen(false);
    sessionStorage.setItem('rapidseva_gmail_prompted', 'true');
  };

  const handleStartRequest = (category?: ServiceCategoryType) => {
    setSelectedCategoryForRequest(category);
    setRequestModalOpen(true);
  };

  const handleRequestCreated = (bookingId: string) => {
    setActiveSearchingRequestId(bookingId);
  };

  const handleTrackBooking = (bookingId: string) => {
    setTrackingBookingId(bookingId);
  };

  const handleOpenPayment = (bookingId: string) => {
    setPaymentBookingId(bookingId);
  };

  const handleOpenLegal = (tab: 'terms' | 'privacy' | 'refund' | 'disclaimer' = 'terms') => {
    setLegalTab(tab);
    setLegalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111111] flex flex-col selection:bg-[#F04416] selection:text-white">
      {/* 1. Splash Screen on first launch */}
      {showSplash && <SplashScreen onDismiss={handleDismissSplash} />}

      {/* 2. Top Navigation Bar */}
      <Navbar
        onOpenEmergency={() => setEmergencyOpen(true)}
        onOpenNotifications={() => setNotificationsOpen(true)}
        onOpenAuthModal={() => setAuthOpen(true)}
      />

      {/* 3. Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Customer Portal */}
        {activePortal === 'customer' && (
          <CustomerHome
            onStartRequest={handleStartRequest}
            onOpenVehicles={() => setVehiclesModalOpen(true)}
            onOpenBookings={() => setBookingsModalOpen(true)}
            onOpenSupport={() => setSupportModalOpen(true)}
            onOpenEmergency={() => setEmergencyOpen(true)}
            onTrackBooking={handleTrackBooking}
            onOpenLegal={handleOpenLegal}
          />
        )}

        {/* Provider Portal */}
        {activePortal === 'provider' && <ProviderDashboard />}

        {/* Super Admin Dashboard */}
        {activePortal === 'admin' && <AdminDashboard />}
      </main>

      {/* 4. Global Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-gray-900">RapidSeva</span>
            <span>•</span>
            <span>Help on Road. With You Soon.</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={() => setEmergencyOpen(true)}
              className="text-red-600 font-bold hover:underline flex items-center gap-1"
            >
              Emergency 112
            </button>
            <span>•</span>
            <button
              onClick={() => handleOpenLegal('terms')}
              className="hover:text-gray-900 hover:underline"
            >
              Terms of Service
            </button>
            <span>•</span>
            <button
              onClick={() => handleOpenLegal('privacy')}
              className="hover:text-gray-900 hover:underline"
            >
              Privacy & DPDP
            </button>
            <span>•</span>
            <button
              onClick={() => handleOpenLegal('refund')}
              className="hover:text-gray-900 hover:underline"
            >
              Refund Policy
            </button>
            <span>•</span>
            <button
              onClick={() => setSupportModalOpen(true)}
              className="hover:text-gray-900 hover:underline"
            >
              Grievance Desk
            </button>
          </div>

          <div className="text-gray-400 font-mono text-[11px]">
            © 2026 RapidSeva Technologies Pvt Ltd. All rights reserved.
          </div>
        </div>
      </footer>

      {/* --- MODALS & DIALOGS --- */}

      {/* Emergency Guidance Modal */}
      <EmergencyModal
        isOpen={emergencyOpen}
        onClose={() => setEmergencyOpen(false)}
      />

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        onSelectBooking={(bId) => handleTrackBooking(bId)}
      />

      {/* Auth / Demo Login Modal */}
      <AuthModal
        isOpen={authOpen}
        onClose={handleCloseAuth}
        defaultRole={activePortal}
        onOpenLegal={handleOpenLegal}
        isAutoPrompt={true}
      />

      {/* Customer: 7-Step Assistance Request Modal */}
      <AssistanceRequestModal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        initialCategory={selectedCategoryForRequest}
        onSuccess={handleRequestCreated}
      />

      {/* Customer: Searching Radar Modal */}
      {activeSearchingRequestId && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <SearchingScreen
            requestId={activeSearchingRequestId}
            onCancel={() => setActiveSearchingRequestId(null)}
            onAccepted={() => {
              const bId = activeSearchingRequestId;
              setActiveSearchingRequestId(null);
              setTrackingBookingId(bId);
            }}
          />
        </div>
      )}

      {/* Customer: Live Tracking & Booking Details Modal */}
      {trackingBookingId && (
        <LiveTrackingModal
          bookingId={trackingBookingId}
          isOpen={Boolean(trackingBookingId)}
          onClose={() => setTrackingBookingId(null)}
          onOpenPayment={(bId) => {
            setTrackingBookingId(null);
            setPaymentBookingId(bId);
          }}
        />
      )}

      {/* Customer: Vehicle Management Modal */}
      <VehicleManager
        isOpen={vehiclesModalOpen}
        onClose={() => setVehiclesModalOpen(false)}
      />

      {/* Customer: Booking History Modal */}
      <BookingHistory
        isOpen={bookingsModalOpen}
        onClose={() => setBookingsModalOpen(false)}
        onSelectBooking={handleTrackBooking}
      />

      {/* Customer: Support & Complaints Desk */}
      <CustomerSupport
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
        onOpenEmergency={() => setEmergencyOpen(true)}
        onOpenLegal={handleOpenLegal}
      />

      {/* Customer: Profile & Privacy Modal */}
      <CustomerProfile
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      {/* Platform Legal & Terms Modal */}
      <LegalModal
        isOpen={legalOpen}
        onClose={() => setLegalOpen(false)}
        defaultTab={legalTab}
      />

      {/* Payment: Razorpay Sandbox Checkout Modal */}
      {paymentBookingId && (
        <RazorpayModal
          bookingId={paymentBookingId}
          isOpen={Boolean(paymentBookingId)}
          onClose={() => setPaymentBookingId(null)}
          onPaymentSuccess={() => {}}
        />
      )}
    </div>
  );
}

export default App;
