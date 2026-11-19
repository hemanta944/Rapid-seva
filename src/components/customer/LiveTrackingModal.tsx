import React, { useState } from 'react';
import {
  X,
  Phone,
  MessageSquare,
  ShieldCheck,
  Star,
  Clock,
  MapPin,
  CheckCircle2,
  FileText,
  CreditCard,
  AlertTriangle,
  ChevronRight,
  Car,
  Download,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { InteractiveMap } from '../common/InteractiveMap';
import { generateInvoicePdf } from '../../services/pdfService';
import { RequestStatus } from '../../types';

interface LiveTrackingModalProps {
  bookingId: string;
  isOpen: boolean;
  onClose: () => void;
  onOpenPayment: (bookingId: string) => void;
}

const STATUS_STEPS: { status: RequestStatus; label: string; stepNumber: number }[] = [
  { status: 'REQUEST_RECEIVED', label: 'Request Received', stepNumber: 1 },
  { status: 'PROVIDER_NOTIFIED', label: 'Provider Dispatched', stepNumber: 2 },
  { status: 'PROVIDER_ACCEPTED', label: 'Provider Confirmed', stepNumber: 3 },
  { status: 'PROVIDER_ON_THE_WAY', label: 'On The Way', stepNumber: 4 },
  { status: 'PROVIDER_ARRIVED', label: 'Arrived at Spot', stepNumber: 5 },
  { status: 'WORK_IN_PROGRESS', label: 'Work in Progress', stepNumber: 6 },
  { status: 'SERVICE_COMPLETED', label: 'Service Completed', stepNumber: 7 },
  { status: 'PAYMENT_PENDING', label: 'Payment Pending', stepNumber: 8 },
  { status: 'PAYMENT_COMPLETED', label: 'Payment Completed', stepNumber: 9 },
];

export const LiveTrackingModal: React.FC<LiveTrackingModalProps> = ({
  bookingId,
  isOpen,
  onClose,
  onOpenPayment,
}) => {
  const { requests, store } = useStore();
  const request = requests.find((r) => r.id === bookingId);

  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState<string>('');
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  if (!isOpen || !request) return null;

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.status === request.status);
  const isCancelled = request.status === 'CANCELLED';

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    store.addReview(request.id, rating, feedback || 'Excellent timely service!');
    setReviewSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[94vh] animate-scaleUp">
        {/* Top Header */}
        <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#F04416]">
                Live Roadside Telematics
              </span>
              <span className="text-xs font-mono font-bold text-gray-500">
                {request.id}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
              {request.serviceCategoryName} — {request.vehicleDetails.brand} {request.vehicleDetails.model}
            </h3>
            {request.isBookingForOther && request.beneficiaryDetails && (
              <div className="flex items-center gap-1.5 mt-1 text-xs text-purple-700 font-bold bg-purple-50 px-2.5 py-0.5 rounded-lg border border-purple-200 inline-flex">
                <span>👤 Booked for: {request.beneficiaryDetails.name} ({request.beneficiaryDetails.phone})</span>
                <span className="text-[10px] text-purple-500 font-normal">[{request.beneficiaryDetails.relationship || 'Recipient'}]</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {request.status === 'PAYMENT_COMPLETED' && (
              <button
                onClick={() => generateInvoicePdf(request)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                title="Download Tax Invoice"
              >
                <Download className="w-3.5 h-3.5 text-[#F04416]" />
                <span className="hidden sm:inline">Tax Invoice</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* 1. Live Interactive Map */}
          <div className="relative">
            <InteractiveMap
              customerLocation={request.location}
              providerLocation={
                request.providerLocation
                  ? {
                      lat: request.providerLocation.lat,
                      lng: request.providerLocation.lng,
                      businessName: request.providerBusinessName,
                    }
                  : undefined
              }
              isSearching={request.status === 'REQUEST_RECEIVED' || request.status === 'PROVIDER_NOTIFIED'}
              etaMinutes={request.confirmedEtaMinutes || request.estimatedArrivalMinutes}
              height="280px"
            />
          </div>

          {/* 2. Provider Profile Card (Only shown if assigned) */}
          {request.assignedProviderId ? (
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#111111] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  🛠️
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-extrabold text-gray-900">
                      {request.providerBusinessName || request.providerName}
                    </h4>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {request.providerRating || 4.8}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">
                    Technician: {request.providerName} • Verified Provider
                  </p>
                  <p className="text-[11px] text-[#F04416] font-semibold mt-0.5">
                    Confirmed ETA: ~{request.confirmedEtaMinutes || 15} minutes
                  </p>
                </div>
              </div>

              {/* Contact Actions */}
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${request.providerPhone || '+919811122334'}`}
                  className="px-4 py-2.5 bg-[#F04416] hover:bg-[#D8380E] text-white text-xs font-bold rounded-xl shadow-brand flex items-center gap-1.5 transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Mechanic</span>
                </a>
                <a
                  href={`https://wa.me/919811122334?text=Hi%20RapidSeva%20Booking%20${request.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-200 flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#F04416] animate-spin" />
              <div className="text-xs text-gray-700">
                <span className="font-bold text-gray-900 block">Searching for Available Providers</span>
                Dispatch engine is pinging certified workshops across Guwahati / Kamrup Metropolitan, Assam.
              </div>
            </div>
          )}

          {/* 3. 10-Step Workflow Timeline */}
          <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-600 flex items-center justify-between">
              <span>Standard 10-Step Service Lifecycle</span>
              <span className="text-[10px] font-bold text-[#F04416]">
                Current: {request.status.replace(/_/g, ' ')}
              </span>
            </h4>

            {isCancelled ? (
              <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-800">
                <div className="font-bold">Booking Cancelled</div>
                <div className="text-[11px] mt-0.5">{request.cancellationReason || 'No nearby providers accepted or customer cancelled.'}</div>
              </div>
            ) : (
              <div className="relative pl-6 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                {request.statusHistory.map((item, idx) => (
                  <div key={idx} className="relative group">
                    <span className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-[#F04416] border-2 border-white shadow-xs flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900">
                        {item.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] font-mono text-gray-400">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{item.note}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. Payment Trigger Box if Completed or Payment Pending */}
          {(request.status === 'SERVICE_COMPLETED' || request.status === 'PAYMENT_PENDING') && (
            <div className="p-5 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border-2 border-[#F04416] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#F04416] uppercase tracking-wider block">
                  Service Finished by Mechanic
                </span>
                <h4 className="text-lg font-black text-gray-900">
                  Total Billable Amount: ₹{request.finalPrice || request.estimatedPrice}
                </h4>
                <p className="text-xs text-gray-500">
                  Includes on-spot assistance, technician dispatch fee & GST.
                </p>
              </div>

              <button
                onClick={() => onOpenPayment(request.id)}
                className="px-6 py-3 bg-[#F04416] hover:bg-[#D8380E] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-brand flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay via Razorpay / UPI</span>
              </button>
            </div>
          )}

          {/* 5. Rating & Review Box if Payment Completed */}
          {request.status === 'PAYMENT_COMPLETED' && (
            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-700">
                Rate Your Experience with {request.providerName || 'Technician'}
              </h4>

              {reviewSubmitted ? (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Thank you for your valuable feedback! Rating recorded.</span>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-gray-700 ml-2">
                      {rating} Star{rating > 1 ? 's' : ''}
                    </span>
                  </div>

                  <input
                    type="text"
                    placeholder="Tell us what you liked (punctuality, quick resolution, polite)..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:border-[#F04416] focus:outline-none bg-white"
                  />

                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#111111] hover:bg-black text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    Submit Review
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
