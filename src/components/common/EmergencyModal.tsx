import React from 'react';
import { AlertTriangle, PhoneCall, ShieldAlert, X, HeartPulse, Shield, Flame } from 'lucide-react';
import { useStore } from '../../hooks/useStore';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  const { settings } = useStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-red-500 animate-scaleUp">
        {/* Urgent Header Banner */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <ShieldAlert className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg tracking-tight">Emergency Assistance & Safety</h3>
              <p className="text-xs text-red-100 font-medium">Prioritize Life & Personal Safety First</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Mandatory Safety Notice Alert */}
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex gap-3 text-amber-900 text-xs sm:text-sm leading-relaxed">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-950 mb-1">
                RapidSeva is a roadside assistance coordination platform, NOT an emergency response service.
              </p>
              <p>
                If there is personal injury, vehicle fire, collision damage, highway obstruction, or immediate danger, 
                <span className="font-bold underline ml-1">contact official state emergency services immediately.</span> 
                Do not wait for or delay official help while coordinating roadside mechanical assistance.
              </p>
            </div>
          </div>

          {/* Direct Emergency Dials - Guwahati & Assam */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Assam State Official Emergency Helplines
              </h4>
              <span className="text-[10px] bg-red-100 text-red-800 font-extrabold px-2 py-0.5 rounded-full">
                Guwahati / Kamrup Metro
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {/* 112 Assam ERSS */}
              <a
                href={`tel:${settings.emergencyPhoneNumbers.nationalEmergency}`}
                className="flex items-center gap-3 p-3 bg-red-50 hover:bg-red-100 rounded-2xl border border-red-200 transition-all group"
              >
                <div className="p-2.5 bg-red-600 text-white rounded-xl group-hover:scale-105 transition-transform">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-gray-500 font-medium">Assam ERSS Desk</div>
                  <div className="text-base font-extrabold text-red-700">112 Helpline</div>
                </div>
              </a>

              {/* 108 Mrityunjoy Ambulance */}
              <a
                href={`tel:${settings.emergencyPhoneNumbers.ambulance}`}
                className="flex items-center gap-3 p-3 bg-rose-50 hover:bg-rose-100 rounded-2xl border border-rose-200 transition-all group"
              >
                <div className="p-2.5 bg-rose-600 text-white rounded-xl group-hover:scale-105 transition-transform">
                  <HeartPulse className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-gray-500 font-medium">Mrityunjoy Medical</div>
                  <div className="text-base font-extrabold text-rose-700">108 Ambulance</div>
                </div>
              </a>

              {/* Guwahati City Police */}
              <a
                href={`tel:${settings.emergencyPhoneNumbers.police}`}
                className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-2xl border border-blue-200 transition-all group"
              >
                <div className="p-2.5 bg-blue-600 text-white rounded-xl group-hover:scale-105 transition-transform">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-gray-500 font-medium">Guwahati City Police</div>
                  <div className="text-sm font-extrabold text-blue-700">0361-2464557</div>
                </div>
              </a>

              {/* NH-27 Guwahati Bypass NHAI */}
              <a
                href={`tel:${settings.emergencyPhoneNumbers.highwayHelpline}`}
                className="flex items-center gap-3 p-3 bg-orange-50 hover:bg-orange-100 rounded-2xl border border-orange-200 transition-all group"
              >
                <div className="p-2.5 bg-[#F04416] text-white rounded-xl group-hover:scale-105 transition-transform">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-gray-500 font-medium">NH-27 Bypass Helpline</div>
                  <div className="text-base font-extrabold text-[#F04416]">1033 NHAI</div>
                </div>
              </a>

              {/* Assam Fire Panbazar */}
              <a
                href={`tel:${settings.emergencyPhoneNumbers.fire}`}
                className="flex items-center gap-3 p-3 bg-amber-50 hover:bg-amber-100 rounded-2xl border border-amber-200 transition-all group"
              >
                <div className="p-2.5 bg-amber-600 text-white rounded-xl group-hover:scale-105 transition-transform">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-gray-500 font-medium">Assam Fire Panbazar</div>
                  <div className="text-sm font-extrabold text-amber-800">0361-2540222</div>
                </div>
              </a>

              {/* Guwahati Traffic Police */}
              <a
                href={`tel:${settings.emergencyPhoneNumbers.trafficHelpline}`}
                className="flex items-center gap-3 p-3 bg-emerald-50 hover:bg-emerald-100 rounded-2xl border border-emerald-200 transition-all group"
              >
                <div className="p-2.5 bg-emerald-600 text-white rounded-xl group-hover:scale-105 transition-transform">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-gray-500 font-medium">Guwahati Traffic Control</div>
                  <div className="text-sm font-extrabold text-emerald-800">0361-2730989</div>
                </div>
              </a>
            </div>
          </div>

          {/* Immediate Roadside Safety Protocols - Assam Region */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
            <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2">
              Critical Breakdown Safety Rules (Guwahati & Assam Highways)
            </h5>
            <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
              <li>Turn on your vehicle hazard warning flashers immediately, especially in fog or rain.</li>
              <li>On NH-27 Guwahati Bypass or flyovers (Jalukbari, Khanapara, Maligaon), steer off the main carriageway.</li>
              <li>Exit vehicle from passenger side away from traffic and wait behind the safety railing.</li>
              <li>Deploy reflective warning triangle at least 50 metres behind vehicle on NH-27.</li>
            </ul>
          </div>

          {/* RapidSeva 24/7 Helpline */}
          <div className="pt-2 flex items-center justify-between border-t border-gray-100 text-xs">
            <span className="text-gray-500">RapidSeva Technical Helpline:</span>
            <a
              href={`tel:${settings.supportPhone}`}
              className="font-bold text-[#F04416] hover:underline flex items-center gap-1"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              {settings.supportPhone}
            </a>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-[#111111] hover:bg-black text-white font-bold rounded-2xl transition-all shadow-md text-sm"
          >
            I Understand — Proceed with Roadside Service
          </button>
        </div>
      </div>
    </div>
  );
};
