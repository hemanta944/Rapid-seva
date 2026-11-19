import React, { useState } from 'react';
import {
  Bell,
  ShieldAlert,
  UserCheck,
  RotateCcw,
  LogOut,
  ChevronDown,
  Sparkles,
  Smartphone,
  Wrench,
  ShieldCheck,
} from 'lucide-react';
import { Logo } from './Logo';
import { useStore } from '../../hooks/useStore';
import { UserRole } from '../../types';

interface NavbarProps {
  onOpenEmergency: () => void;
  onOpenNotifications: () => void;
  onOpenAuthModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenEmergency,
  onOpenNotifications,
  onOpenAuthModal,
}) => {
  const { store, activeUser, activePortal, notifications } = useStore();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handlePortalSwitch = (role: UserRole) => {
    store.switchPortal(role);
    setProfileDropdownOpen(false);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all RapidSeva demo state and test records back to pristine defaults?')) {
      store.resetToDefaults();
      window.location.reload();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Logo size="md" showTagline={true} />
        </div>

        {/* Unified Portal Switcher for Rapid App Evaluation */}
        <div className="hidden md:flex items-center bg-gray-100 p-1 rounded-2xl border border-gray-200">
          <button
            onClick={() => handlePortalSwitch('customer')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activePortal === 'customer'
                ? 'bg-white text-[#F04416] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Customer App</span>
          </button>

          <button
            onClick={() => handlePortalSwitch('provider')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activePortal === 'provider'
                ? 'bg-white text-[#F04416] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Provider App</span>
          </button>

          <button
            onClick={() => handlePortalSwitch('admin')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activePortal === 'admin'
                ? 'bg-white text-[#111111] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Super Admin</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Emergency Safety Trigger */}
          <button
            onClick={onOpenEmergency}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold transition-all active:scale-95"
            title="Official Emergency Guidance"
          >
            <ShieldAlert className="w-4 h-4 text-red-600 animate-pulse" />
            <span className="hidden sm:inline">Emergency 112</span>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#F04416] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center animate-bounce">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* User Profile / Quick Switcher */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-1.5 pr-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all"
            >
              <img
                src={activeUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={activeUser?.name || 'User'}
                className="w-7 h-7 rounded-lg object-cover border border-gray-200"
              />
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-gray-900 leading-tight flex items-center gap-1">
                  <span>{activeUser?.name || 'Guest User'}</span>
                  {activeUser?.authProvider === 'google' && (
                    <span className="text-[9px] bg-blue-50 text-blue-700 border border-blue-200 px-1 py-0.2 rounded font-bold">
                      Gmail
                    </span>
                  )}
                </div>
                <div className="text-[10px] font-semibold text-[#F04416] uppercase tracking-wider">
                  {activePortal}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </button>

            {/* Profile Dropdown */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-scaleUp">
                <div className="px-4 py-2.5 border-b border-gray-100">
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="text-sm font-bold text-gray-900 truncate">{activeUser?.name}</p>
                  {activeUser?.email && (
                    <p className="text-[11px] font-mono text-gray-600 truncate mt-0.5">{activeUser.email}</p>
                  )}
                  <span className="inline-block px-2 py-0.5 mt-1 bg-orange-100 text-[#F04416] text-[10px] font-bold rounded-md uppercase">
                    Role: {activePortal}
                  </span>
                </div>

                {/* Mobile Portal Switcher items */}
                <div className="md:hidden py-1 border-b border-gray-100">
                  <div className="px-4 py-1 text-[10px] font-bold uppercase text-gray-400">Switch View</div>
                  <button
                    onClick={() => handlePortalSwitch('customer')}
                    className={`w-full text-left px-4 py-2 text-xs font-semibold flex items-center gap-2 ${
                      activePortal === 'customer' ? 'text-[#F04416] bg-orange-50' : 'text-gray-700'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" /> Customer App
                  </button>
                  <button
                    onClick={() => handlePortalSwitch('provider')}
                    className={`w-full text-left px-4 py-2 text-xs font-semibold flex items-center gap-2 ${
                      activePortal === 'provider' ? 'text-[#F04416] bg-orange-50' : 'text-gray-700'
                    }`}
                  >
                    <Wrench className="w-4 h-4" /> Provider App
                  </button>
                  <button
                    onClick={() => handlePortalSwitch('admin')}
                    className={`w-full text-left px-4 py-2 text-xs font-semibold flex items-center gap-2 ${
                      activePortal === 'admin' ? 'text-black bg-gray-100' : 'text-gray-700'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" /> Super Admin
                  </button>
                </div>

                {/* Demo Quick Accounts */}
                <div className="py-1 border-b border-gray-100">
                  <div className="px-4 py-1 text-[10px] font-bold uppercase text-gray-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Quick Demo Accounts
                  </div>
                  <button
                    onClick={() => {
                      store.loginAsDemo('customer');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-gray-400" />
                    Bikash Baruah (Customer - Guwahati)
                  </button>
                  <button
                    onClick={() => {
                      store.loginAsDemo('provider');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-gray-400" />
                    Bipul Saikia (Brahmaputra Auto - GS Rd)
                  </button>
                  <button
                    onClick={() => {
                      store.loginAsDemo('admin');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-gray-400" />
                    Super Admin (Dashboard)
                  </button>
                </div>

                <div className="py-1">
                  <button
                    onClick={handleResetData}
                    className="w-full text-left px-4 py-2 text-xs text-amber-700 hover:bg-amber-50 flex items-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset Demo State
                  </button>

                  <button
                    onClick={() => {
                      if (onOpenAuthModal) onOpenAuthModal();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5 text-gray-400" />
                    Switch User / Login
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
