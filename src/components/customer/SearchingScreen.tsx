import React, { useEffect, useState } from 'react';
import { Radar, Clock, ShieldAlert, PhoneCall, XCircle } from 'lucide-react';
import { useStore } from '../../hooks/useStore';

interface SearchingScreenProps {
  requestId: string;
  onCancel: () => void;
  onAccepted: () => void;
}

export const SearchingScreen: React.FC<SearchingScreenProps> = ({
  requestId,
  onCancel,
  onAccepted,
}) => {
  const { requests, store } = useStore();
  const request = requests.find((r) => r.id === requestId);

  const [timeLeft, setTimeLeft] = useState<number>(45);

  useEffect(() => {
    if (!request) return;

    if (request.status === 'PROVIDER_ACCEPTED') {
      onAccepted();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [request, onAccepted]);

  if (!request) return null;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-card text-center max-w-lg mx-auto space-y-6">
      {/* Animated Radar Visual */}
      <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
        {/* Pulsing waves */}
        <div className="absolute inset-0 rounded-full bg-[#F04416]/10 animate-ping-slow" />
        <div className="absolute inset-4 rounded-full bg-[#F04416]/20 animate-pulse" />
        <div className="relative w-20 h-20 rounded-full bg-[#F04416] text-white shadow-brand flex items-center justify-center">
          <Radar className="w-10 h-10 animate-spin" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-[#F04416]">
          <Clock className="w-3.5 h-3.5" />
          <span>Timeout Window: {timeLeft}s</span>
        </div>

        <h3 className="text-2xl font-black text-gray-900 tracking-tight">
          Locating Nearby Roadside Provider...
        </h3>

        <p className="text-xs text-gray-500 font-medium max-w-sm mx-auto leading-relaxed">
          {request.currentOfferedProviderId
            ? `Assistance request offered to nearest approved workshop. Waiting for technician acceptance...`
            : `Scanning verified mechanics within 5 km of ${request.location.address}...`}
        </p>
      </div>

      {/* Booking Badge */}
      <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 text-left space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500 font-medium">Booking ID:</span>
          <span className="font-mono font-bold text-gray-900">{request.id}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500 font-medium">Service:</span>
          <span className="font-bold text-gray-900">{request.serviceCategoryName}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500 font-medium">Estimated Charge:</span>
          <span className="font-extrabold text-[#F04416]">₹{request.estimatedPrice}</span>
        </div>
      </div>

      {/* Safety message */}
      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 text-left flex items-start gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <span>
          Never stand directly on highway lanes while waiting. Stay behind safety barrier on passenger side.
        </span>
      </div>

      {/* Cancel Request button */}
      <div className="pt-2 flex flex-col gap-2">
        <button
          onClick={() => {
            store.cancelRequest(request.id, 'Customer cancelled search manually', 'customer');
            onCancel();
          }}
          className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors"
        >
          <XCircle className="w-4 h-4" />
          <span>Cancel Assistance Request</span>
        </button>

        <a
          href="tel:+91180072743"
          className="text-xs text-gray-500 hover:text-[#F04416] flex items-center justify-center gap-1 font-semibold"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          Need Help? Call RapidSeva Helpline
        </a>
      </div>
    </div>
  );
};
