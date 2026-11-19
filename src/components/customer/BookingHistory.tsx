import React, { useState } from 'react';
import {
  History,
  X,
  Clock,
  Download,
  Star,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  Car,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { generateInvoicePdf } from '../../services/pdfService';
import { AssistanceRequest } from '../../types';

interface BookingHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBooking: (bookingId: string) => void;
}

export const BookingHistory: React.FC<BookingHistoryProps> = ({
  isOpen,
  onClose,
  onSelectBooking,
}) => {
  const { requests, activeUser } = useStore();
  const [tab, setTab] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');

  if (!isOpen) return null;

  // Filter requests for current customer
  const userRequests = requests.filter(
    (r) => !activeUser || r.customerId === activeUser.id || r.customerId === 'user_cust_rajesh'
  );

  const filtered = userRequests.filter((r) => {
    if (tab === 'active') {
      return r.status !== 'SERVICE_COMPLETED' && r.status !== 'PAYMENT_COMPLETED' && r.status !== 'CANCELLED';
    }
    if (tab === 'completed') {
      return r.status === 'SERVICE_COMPLETED' || r.status === 'PAYMENT_COMPLETED';
    }
    if (tab === 'cancelled') {
      return r.status === 'CANCELLED';
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAYMENT_COMPLETED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">Completed & Paid</span>;
      case 'SERVICE_COMPLETED':
      case 'PAYMENT_PENDING':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">Payment Pending</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800">Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-100 text-[#F04416] animate-pulse">In Progress</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-orange-50 rounded-xl text-[#F04416]">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">Your Booking History</h3>
              <p className="text-xs text-gray-500">Track current breakdown calls & past service receipts</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="px-6 py-2.5 bg-gray-50 border-b border-gray-100 flex gap-2">
          {(['all', 'active', 'completed', 'cancelled'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                tab === t
                  ? 'bg-white text-[#F04416] shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <History className="w-12 h-12 mx-auto mb-2 text-gray-300 stroke-[1.5]" />
              <p className="text-sm font-bold text-gray-600">No bookings in this category</p>
              <p className="text-xs text-gray-400 mt-1">Your roadside assistance history will be documented here with full audit logs.</p>
            </div>
          ) : (
            filtered.map((req) => (
              <div
                key={req.id}
                className="p-4 bg-white hover:bg-gray-50/80 rounded-2xl border border-gray-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-gray-800">{req.id}</span>
                    {getStatusBadge(req.status)}
                  </div>
                  <h4 className="text-sm font-extrabold text-gray-900">
                    {req.serviceCategoryName}
                  </h4>
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <span>{req.vehicleDetails.brand} {req.vehicleDetails.model}</span>
                    <span>•</span>
                    <span>{new Date(req.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </p>
                  <p className="text-[11px] text-gray-500 truncate max-w-sm">
                    📍 {req.location.address}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Amount</span>
                    <span className="text-sm font-black text-gray-900">
                      ₹{req.finalPrice || req.estimatedPrice}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {req.status === 'PAYMENT_COMPLETED' && (
                      <button
                        onClick={() => generateInvoicePdf(req)}
                        className="p-2 text-gray-600 hover:text-[#F04416] hover:bg-orange-50 rounded-xl transition-all"
                        title="Download GST Tax Invoice"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        onSelectBooking(req.id);
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-[#111111] hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-1 transition-all"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
