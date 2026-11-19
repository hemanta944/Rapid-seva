import React, { useState, useEffect } from 'react';
import {
  Bell,
  Clock,
  MapPin,
  Car,
  Wrench,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  IndianRupee,
  Navigation,
} from 'lucide-react';
import { AssistanceRequest, ServiceProvider } from '../../types';
import { matchingController } from '../../services/matchingEngine';

interface IncomingRequestModalProps {
  request: AssistanceRequest;
  provider: ServiceProvider;
  onClose: () => void;
}

export const IncomingRequestModal: React.FC<IncomingRequestModalProps> = ({
  request,
  provider,
  onClose,
}) => {
  const [eta, setEta] = useState<number>(18);
  const [priceQuote, setPriceQuote] = useState<number>(request.estimatedPrice || 399);
  const [countdown, setCountdown] = useState<number>(45);

  useEffect(() => {
    // Sound synthesized roadside alert chime via Web Audio API
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch {
      // Audio autoplay restrictions gracefully handled
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          matchingController.handleProviderDecline(request.id, provider.id);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [request.id, provider.id, onClose]);

  const handleAccept = () => {
    matchingController.handleProviderAcceptance(
      request.id,
      provider.id,
      Number(eta),
      Number(priceQuote)
    );
    onClose();
  };

  const handleDecline = () => {
    matchingController.handleProviderDecline(request.id, provider.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-[#F04416] overflow-hidden flex flex-col animate-scaleUp">
        {/* Urgent Header */}
        <div className="bg-gradient-to-r from-[#F04416] to-[#FF6B35] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-sm animate-bounce">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-orange-100">
                Incoming Roadside Call
              </div>
              <h3 className="text-lg font-black tracking-tight">{request.serviceCategoryName}</h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-black/30 rounded-full font-mono text-xs font-extrabold">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>{countdown}s</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* Booking Meta */}
          <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 font-medium">Booking ID:</span>
              <span className="font-mono font-bold text-gray-900">{request.id}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 font-medium">Vehicle:</span>
              <span className="font-bold text-gray-900">
                {request.vehicleDetails.brand} {request.vehicleDetails.model} ({request.vehicleDetails.registrationNumber})
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 font-medium">Issue:</span>
              <span className="font-bold text-[#F04416]">{request.problemType}</span>
            </div>
            {request.problemDescription && (
              <div className="pt-1 text-xs text-gray-600 bg-white p-2 rounded-xl border border-gray-100 italic">
                "{request.problemDescription}"
              </div>
            )}

            {request.isBookingForOther && request.beneficiaryDetails && (
              <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-950 flex items-center justify-between">
                <div>
                  <span className="font-bold block text-purple-900">On-Spot Recipient to Meet:</span>
                  <span className="font-extrabold">{request.beneficiaryDetails.name}</span>
                  <span className="text-[10px] text-purple-700 ml-1">({request.beneficiaryDetails.relationship || 'Beneficiary'})</span>
                </div>
                <span className="font-mono font-bold text-purple-800 bg-white px-2 py-0.5 rounded border border-purple-200 text-[11px]">
                  {request.beneficiaryDetails.phone}
                </span>
              </div>
            )}
          </div>

          {/* Location & Distance */}
          <div className="p-3.5 bg-orange-50/50 rounded-2xl border border-orange-200/80 space-y-2">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#F04416] shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold uppercase text-gray-500 block">
                  Breakdown Location (~2.4 km away)
                </span>
                <p className="text-xs font-bold text-gray-900 leading-snug">
                  {request.location.address}
                </p>
                {request.location.landmark && (
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Landmark: {request.location.landmark}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Photos if uploaded */}
          {request.problemPhotos && request.problemPhotos.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                Customer Breakdown Photos
              </span>
              <div className="flex gap-2 overflow-x-auto py-1">
                {request.problemPhotos.map((photo, i) => (
                  <img
                    key={i}
                    src={photo}
                    alt="Problem"
                    className="w-20 h-20 rounded-xl object-cover border border-gray-200 shrink-0"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Acceptance Inputs: ETA & Price Quote */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                Your Estimated ETA (Mins)*
              </label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="number"
                  min="5"
                  max="90"
                  value={eta}
                  onChange={(e) => setEta(Number(e.target.value))}
                  className="w-full pl-8 pr-2 py-2 text-xs border border-gray-200 rounded-xl font-bold font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                Total Price Quote (INR)*
              </label>
              <div className="relative">
                <IndianRupee className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="number"
                  min="100"
                  max="15000"
                  value={priceQuote}
                  onChange={(e) => setPriceQuote(Number(e.target.value))}
                  className="w-full pl-8 pr-2 py-2 text-xs border border-gray-200 rounded-xl font-bold font-mono"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 grid grid-cols-2 gap-3">
          <button
            onClick={handleDecline}
            className="py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <XCircle className="w-4 h-4" />
            <span>Decline Call</span>
          </button>

          <button
            onClick={handleAccept}
            className="py-3 bg-[#F04416] hover:bg-[#D8380E] text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-brand flex items-center justify-center gap-1.5 transition-all transform active:scale-98"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>ACCEPT JOB</span>
          </button>
        </div>
      </div>
    </div>
  );
};
