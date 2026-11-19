import React, { useState } from 'react';
import { X, Shield, FileText, Lock, AlertTriangle, CheckCircle, Scale } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'terms' | 'privacy' | 'refund' | 'disclaimer';
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'terms',
}) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'refund' | 'disclaimer'>(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp">
        {/* Header */}
        <div className="bg-[#111111] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#F04416] text-white rounded-xl">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#F04416]">
                Legal, Compliance & User Trust
              </div>
              <h3 className="text-lg font-black tracking-tight">RapidSeva Legal Agreements</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50 px-6 pt-2 gap-2 overflow-x-auto">
          {[
            { id: 'terms', label: 'Terms of Service', icon: FileText },
            { id: 'privacy', label: 'Privacy & Telematics', icon: Lock },
            { id: 'refund', label: 'Cancellation & Refund', icon: CheckCircle },
            { id: 'disclaimer', label: 'Emergency Disclaimer', icon: AlertTriangle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'border-[#F04416] text-[#F04416] bg-white rounded-t-xl'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed max-h-[60vh]">
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <h4 className="font-extrabold text-gray-900 text-base">RapidSeva Platform Terms of Service</h4>
              <p className="text-xs text-gray-500">Effective Date: November 2026 • Version 1.4 (Pan-India & Assam State)</p>

              <div className="space-y-2">
                <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider">1. Nature of the Platform</h5>
                <p>
                  RapidSeva provides a technology platform connecting vehicle owners facing non-life-threatening roadside breakdowns with independent certified mechanics, towing operators, and tyre repair specialists. RapidSeva does not directly employ the technicians unless explicitly specified.
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider">2. 30-Minute Target Arrival Disclaimer</h5>
                <p>
                  The phrase "Get Assistance Within 30 Minutes" serves strictly as an operational marketing target and efficiency benchmark. Actual arrival durations depend on highway conditions, weather, traffic congestion, and geographic terrain. RapidSeva will never guarantee a 30-minute arrival unless an approved provider has accepted the request and confirmed a live telematics ETA.
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider">3. Customer Obligations</h5>
                <p>
                  Customers must ensure their vehicle is parked safely off the active carriageway with hazard flashers illuminated. Customers must provide accurate breakdown descriptions and valid vehicle registration documents when requested by the dispatched technician.
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider">4. Transparent Pricing & Spares</h5>
                <p>
                  Baseline service call-out charges are standardized. Any additional parts, replacement batteries, fuel quantities, or extensive mechanical labour must be quoted by the technician and authorized by the customer before replacement.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h4 className="font-extrabold text-gray-900 text-base">Privacy Policy & Telematics Handling</h4>
              <p className="text-xs text-gray-500">Compliance with Digital Personal Data Protection (DPDP) Act, 2023</p>

              <div className="space-y-2">
                <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider">1. Real-Time Geolocation Telematics</h5>
                <p>
                  RapidSeva collects GPS coordinates of customers exclusively during an active assistance request to match the nearest qualified workshop and provide live navigation routing. Location tracking ceases automatically upon service completion.
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider">2. Service Provider Telematics</h5>
                <p>
                  Technician GPS is transmitted to the customer only after the technician explicitly accepts the booking dispatch and commences the trip, ensuring mutual safety and accurate ETA calculation.
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider">3. Document Security</h5>
                <p>
                  All provider onboarding documents (Aadhaar, Trade Licences, Commercial Driving Licences) are encrypted in transit and at rest in Cloud Firestore and Firebase Storage, accessible only by verified Super Admins.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'refund' && (
            <div className="space-y-4">
              <h4 className="font-extrabold text-gray-900 text-base">Cancellation, Billing & Refund Guarantee</h4>
              <p className="text-xs text-gray-500">Fair Play Policy for Customers and Service Partners</p>

              <div className="space-y-2">
                <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider">1. Free Cancellation Window</h5>
                <p>
                  Customers may cancel any assistance request free of cost while the platform is searching for providers or within 3 minutes of provider acceptance.
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider">2. Dispatched Provider Protection</h5>
                <p>
                  If a customer cancels after the technician has traveled towards the breakdown site for more than 10 minutes, a nominal dispatch fee (₹100 - ₹200 depending on vehicle class) may be charged to reimburse the partner's fuel and time.
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider">3. Instant Refund Settlement</h5>
                <p>
                  Any overpayments or cancelled bookings settled via Razorpay/UPI are refunded to the original payment source within 24–48 hours.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'disclaimer' && (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-2xl border-2 border-red-300 flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h5 className="font-bold text-red-950 text-sm">Critical Statutory Disclaimer</h5>
                  <p className="text-xs text-red-900 leading-relaxed">
                    RapidSeva is a roadside mechanical coordination platform, NOT an official emergency rescue or first responder service.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider">When to Dial Emergency First:</h5>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-gray-700">
                  <li><strong>Bodily Injury:</strong> Dial 112 (Assam ERSS) or 108 (Mrityunjoy Ambulance) immediately.</li>
                  <li><strong>Vehicle Fire:</strong> Evacuate at least 100 meters away and dial 101 or Assam Fire Control (0361-2540222).</li>
                  <li><strong>Highway Collision Obstruction:</strong> Dial NHAI 1033 or Guwahati Police Control (0361-2464557).</li>
                </ul>
                <p className="mt-2 text-xs text-gray-600">
                  Never delay calling government first responders while waiting for a roadside mechanic or towing truck.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <div className="text-[11px] text-gray-500 font-medium">
            RapidSeva Platform • Reg. Office: Dispur, Guwahati, Assam
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#111111] hover:bg-black text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
