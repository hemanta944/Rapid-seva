import React from 'react';
import {
  MapPin,
  Wrench,
  Bike,
  Zap,
  Disc,
  Fuel,
  Truck,
  Key,
  HelpCircle,
  Plus,
  Car,
  Clock,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  PhoneCall,
  History,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { ServiceCategoryType } from '../../types';

interface CustomerHomeProps {
  onStartRequest: (category?: ServiceCategoryType) => void;
  onOpenVehicles: () => void;
  onOpenBookings: () => void;
  onOpenSupport: () => void;
  onOpenEmergency: () => void;
  onTrackBooking: (bookingId: string) => void;
  onOpenLegal?: (tab: 'terms' | 'privacy' | 'refund' | 'disclaimer') => void;
}

export const CustomerHome: React.FC<CustomerHomeProps> = ({
  onStartRequest,
  onOpenVehicles,
  onOpenBookings,
  onOpenSupport,
  onOpenEmergency,
  onTrackBooking,
  onOpenLegal,
}) => {
  const { categories, vehicles, requests } = useStore();

  // Find active booking if any
  const activeBooking = requests.find(
    (r) =>
      r.status !== 'SERVICE_COMPLETED' &&
      r.status !== 'PAYMENT_COMPLETED' &&
      r.status !== 'CANCELLED'
  );

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wrench': return <Wrench className="w-6 h-6 text-[#F04416]" />;
      case 'Bike': return <Bike className="w-6 h-6 text-[#F04416]" />;
      case 'Zap': return <Zap className="w-6 h-6 text-[#F04416]" />;
      case 'Disc': return <Disc className="w-6 h-6 text-[#F04416]" />;
      case 'Fuel': return <Fuel className="w-6 h-6 text-[#F04416]" />;
      case 'Truck': return <Truck className="w-6 h-6 text-[#F04416]" />;
      case 'Key': return <Key className="w-6 h-6 text-[#F04416]" />;
      default: return <HelpCircle className="w-6 h-6 text-[#F04416]" />;
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Location Bar & Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-50 rounded-xl text-[#F04416] shrink-0">
            <MapPin className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-600">
              Current Breakdown Location
            </div>
            <div className="text-sm font-extrabold text-gray-900 flex items-center gap-1.5">
              <span>GS Road, Dispur, Guwahati, Assam</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                GPS Locked
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenVehicles()}
            className="text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-xl border border-gray-200 flex items-center gap-1.5 transition-all"
          >
            <Car className="w-3.5 h-3.5 text-[#F04416]" />
            <span>Vehicles ({vehicles.length})</span>
          </button>
          <button
            onClick={() => onOpenBookings()}
            className="text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-xl border border-gray-200 flex items-center gap-1.5 transition-all"
          >
            <History className="w-3.5 h-3.5 text-[#F04416]" />
            <span>Bookings</span>
          </button>
        </div>
      </div>

      {/* 2. Active Request Alert Banner (if booking in progress) */}
      {activeBooking && (
        <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-300 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse-subtle">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-3 bg-[#F04416] text-white rounded-2xl shadow-md shrink-0">
              <Clock className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#F04416]">
                  Active Assistance Request
                </span>
                <span className="text-xs font-mono font-bold text-gray-600">
                  {activeBooking.id}
                </span>
              </div>
              <h4 className="text-base font-extrabold text-gray-900">
                {activeBooking.serviceCategoryName} — {activeBooking.status.replace(/_/g, ' ')}
              </h4>
              <p className="text-xs text-gray-600 mt-0.5">
                {activeBooking.providerBusinessName
                  ? `Assigned: ${activeBooking.providerBusinessName} (~${activeBooking.confirmedEtaMinutes || 15} mins)`
                  : 'Dispatch engine contacting nearby certified providers...'}
              </p>
            </div>
          </div>

          <button
            onClick={() => onTrackBooking(activeBooking.id)}
            className="px-5 py-2.5 bg-[#F04416] hover:bg-[#D8380E] text-white text-xs font-extrabold rounded-xl shadow-brand flex items-center justify-center gap-2 transition-all shrink-0"
          >
            <span>Live Tracking & Details</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3. Hero / Main CTA Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#111111] via-[#242424] to-[#111111] text-white p-6 sm:p-10 shadow-elevated border border-gray-800">
        {/* Background decorative road curves */}
        <div className="absolute -right-10 -bottom-10 w-80 h-80 rounded-full bg-[#F04416]/20 blur-3xl pointer-events-none" />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-72 h-72 opacity-35 pointer-events-none hidden md:flex items-center justify-center">
          <img
            src="/logo-transparent.png"
            alt="RapidSeva Brand Logo"
            className="w-full h-full object-contain drop-shadow-[0_10px_30px_rgba(240,68,22,0.5)]"
          />
        </div>

        <div className="relative z-10 max-w-xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-orange-300">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6B35]" />
            <span>Target: Get Assistance Within 30 Mins*</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Vehicle Trouble? <br />
            <span className="text-[#F04416]">A Mechanic Near You.</span>
          </h2>

          <p className="text-sm sm:text-base text-gray-300 font-normal leading-relaxed">
            Instant on-demand roadside assistance for flat tyres, dead batteries, engine stalls, towing, and fuel emergencies across Guwahati, Kamrup Metro & Assam Highways (NH-27 / Saraighat).
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => onStartRequest()}
              className="px-8 py-4 bg-[#F04416] hover:bg-[#D8380E] text-white font-black text-sm tracking-wide uppercase rounded-2xl shadow-brand flex items-center justify-center gap-3 transition-all transform active:scale-98"
            >
              <span>GET ASSISTANCE NOW</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onOpenEmergency}
              className="px-5 py-4 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all"
            >
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>Accident / Safety Guide</span>
            </button>
          </div>

          <p className="text-[11px] text-gray-300 italic pt-1">
            *30-minute arrival is an operational target. Arrival time is confirmed only after an active provider accepts your booking.
          </p>
        </div>
      </div>

      {/* 4. Service Categories Grid (Master Prompt Section 3.C) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-gray-900 tracking-tight">
              Roadside Assistance Services
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              Transparent upfront base prices • Certified mechanics • Fast on-spot dispatch
            </p>
          </div>
          <span className="text-xs font-bold text-[#F04416] hidden sm:inline">
            8 Services Available
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onStartRequest(cat.id)}
              className="group bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/90 hover:border-[#F04416] hover:shadow-card transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-orange-50 group-hover:bg-[#F04416] group-hover:text-white flex items-center justify-center transition-colors mb-3">
                  <div className="group-hover:text-white transition-colors">
                    {getCategoryIcon(cat.icon)}
                  </div>
                </div>

                <h4 className="font-extrabold text-sm sm:text-base text-gray-900 group-hover:text-[#F04416] transition-colors leading-snug">
                  {cat.name}
                </h4>

                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-2">
                  {cat.shortDesc}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Starting At</span>
                  <span className="text-sm font-extrabold text-gray-900">₹{cat.basePrice}</span>
                </div>

                <span className="w-7 h-7 rounded-full bg-gray-100 group-hover:bg-[#F04416] group-hover:text-white flex items-center justify-center transition-all text-gray-600">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Saved Vehicles Quick Deck */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-orange-50 rounded-xl text-[#F04416]">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-gray-900 text-base">Your Registered Vehicles</h4>
              <p className="text-xs text-gray-500">Pick quickly during breakdown requests</p>
            </div>
          </div>

          <button
            onClick={onOpenVehicles}
            className="text-xs font-bold text-[#F04416] hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Vehicle
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className="p-3.5 bg-gray-50 hover:bg-orange-50/40 rounded-2xl border border-gray-200 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-[#111111]">
                  {v.vehicleType === 'bike' ? <Bike className="w-5 h-5" /> : <Car className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-gray-900">{v.brand} {v.model}</span>
                    {v.isDefault && (
                      <span className="text-[9px] bg-orange-100 text-[#F04416] font-bold px-1.5 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-mono text-gray-500 font-semibold">
                    {v.registrationNumber} • {v.fuelType}
                  </div>
                </div>
              </div>

              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
          ))}
        </div>
      </div>

      {/* 6. Statutory Road Safety & Emergency Card */}
      <div className="p-5 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-3 bg-red-600 text-white rounded-2xl shrink-0 shadow-sm">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h5 className="font-extrabold text-red-950 text-sm">
              Safety First: RapidSeva Roadside Assistance Protocol
            </h5>
            <p className="text-xs text-red-900/80 leading-relaxed mt-0.5">
              RapidSeva is a mechanical coordination platform. In case of bodily injury, highway crash, or fire, 
              call official emergency helplines immediately without waiting.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="tel:112"
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call 112 National</span>
          </a>
          <button
            onClick={onOpenEmergency}
            className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 text-xs font-bold rounded-xl transition-all"
          >
            Guidelines
          </button>
        </div>
      </div>

      {/* 7. Platform Transparency, Coverage & Legal Charter */}
      {onOpenLegal && (
        <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Official Platform Charter • Guwahati & Assam Operational Hub
              </span>
            </div>
            <p className="text-xs text-gray-600">
              Clear upfront pricing, certified workshops, and encrypted GPS telematics for your safety.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => onOpenLegal('terms')}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
            >
              Terms of Service
            </button>
            <button
              onClick={() => onOpenLegal('privacy')}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
            >
              Privacy & GPS Policy
            </button>
            <button
              onClick={() => onOpenLegal('refund')}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
            >
              Cancellation & Refund
            </button>
            <button
              onClick={() => onOpenLegal('disclaimer')}
              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl font-semibold transition-colors"
            >
              Emergency Protocol
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
