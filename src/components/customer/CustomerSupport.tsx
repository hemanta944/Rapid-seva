import React, { useState } from 'react';
import {
  HelpCircle,
  X,
  PhoneCall,
  Mail,
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileQuestion,
  MessageSquare,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';

interface CustomerSupportProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEmergency: () => void;
  onOpenLegal?: (tab: 'terms' | 'privacy' | 'refund' | 'disclaimer') => void;
}

export const CustomerSupport: React.FC<CustomerSupportProps> = ({
  isOpen,
  onClose,
  onOpenEmergency,
  onOpenLegal,
}) => {
  const { settings, requests, activeUser, store } = useStore();

  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);
  const [complaintBookingId, setComplaintBookingId] = useState<string>('');
  const [complaintCategory, setComplaintCategory] = useState<
    'delayed_service' | 'overcharging' | 'poor_quality' | 'unprofessional_behavior' | 'other'
  >('delayed_service');
  const [complaintDescription, setComplaintDescription] = useState<string>('');
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const faqs = [
    {
      q: 'How does RapidSeva guarantee the 30-minute target arrival?',
      a: 'The 30-minute arrival promise is an operational target and marketing benchmark for urban coverage areas. Actual arrival time depends on real-time traffic, provider proximity, and breakdown location. A reliable ETA is explicitly communicated only after an approved workshop accepts your request.',
    },
    {
      q: 'What should I do if I am in immediate danger or an accident?',
      a: 'RapidSeva is a roadside mechanical coordination platform, not an emergency first responder. For vehicle fire, highway collisions, or bodily injury, dial National Emergency (112), Ambulance (108), or Police (100) immediately. Do not delay life-saving help while searching for roadside mechanics.',
    },
    {
      q: 'What is RapidSeva\'s cancellation policy?',
      a: 'You may cancel an assistance request free of charge before a provider has been dispatched. If a technician has already driven toward your breakdown spot for over 10 minutes, a nominal cancellation fee may apply to reimburse fuel costs.',
    },
    {
      q: 'Are RapidSeva roadside prices transparent and regulated?',
      a: 'Yes. Every service category has a standardized baseline rate displayed before booking. Any supplementary spares (battery replacement, fuel litre charges, new inner tube) must be communicated and confirmed with you prior to installation.',
    },
  ];

  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintDescription) return;

    store.submitComplaint({
      bookingId: complaintBookingId || 'GENERAL_INQUIRY',
      customerId: activeUser?.id || 'user_cust_bikash',
      customerName: activeUser?.name || 'Bikash Baruah',
      customerPhone: activeUser?.phone || '+91 94350 43210',
      category: complaintCategory,
      description: complaintDescription,
    });

    setSubmittedMessage('Your complaint ticket has been filed and routed to Super Admin for immediate investigation.');
    setComplaintDescription('');
    setComplaintBookingId('');
  };

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-orange-50 rounded-xl text-[#F04416]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">Support & Grievance Desk</h3>
              <p className="text-xs text-gray-500">24/7 Roadside Assistance helpline & dispute redressal</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Direct Helplines Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={`tel:${settings.supportPhone}`}
              className="p-4 bg-gray-50 hover:bg-orange-50/50 rounded-2xl border border-gray-200 flex items-center gap-3 transition-all group"
            >
              <div className="p-3 bg-white rounded-xl shadow-xs text-[#F04416] group-hover:bg-[#F04416] group-hover:text-white transition-colors">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-gray-400 block">Toll-Free Helpline</span>
                <span className="text-sm font-black text-gray-900">{settings.supportPhone}</span>
              </div>
            </a>

            <a
              href={`mailto:${settings.supportEmail}`}
              className="p-4 bg-gray-50 hover:bg-orange-50/50 rounded-2xl border border-gray-200 flex items-center gap-3 transition-all group"
            >
              <div className="p-3 bg-white rounded-xl shadow-xs text-[#F04416] group-hover:bg-[#F04416] group-hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-gray-400 block">Email Support</span>
                <span className="text-xs font-bold text-gray-900">{settings.supportEmail}</span>
              </div>
            </a>
          </div>

          {/* Emergency Redirection Card */}
          <div className="p-4 bg-red-50 rounded-2xl border border-red-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-red-950">
                  Critical Emergency or Accident?
                </h4>
                <p className="text-[11px] text-red-900/80">
                  Do not wait for roadside assistance. Call 112 National Helpline immediately.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenEmergency();
              }}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shrink-0"
            >
              Emergency Desk
            </button>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Frequently Asked Questions
            </h4>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
                  <button
                    onClick={() => setFaqOpenIndex(faqOpenIndex === i ? null : i)}
                    className="w-full p-3.5 text-left flex items-center justify-between text-xs font-bold text-gray-800 hover:bg-gray-50"
                  >
                    <span>{faq.q}</span>
                    {faqOpenIndex === i ? <ChevronUp className="w-4 h-4 text-[#F04416]" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </button>
                  {faqOpenIndex === i && (
                    <div className="p-3.5 pt-0 text-xs text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Complaint Registration Form */}
          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#F04416]" />
              <span>Register a Complaint or Dispute</span>
            </h4>

            {submittedMessage ? (
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{submittedMessage}</span>
              </div>
            ) : (
              <form onSubmit={handleComplaintSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                      Related Booking ID (Optional)
                    </label>
                    <select
                      value={complaintBookingId}
                      onChange={(e) => setComplaintBookingId(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-white font-mono"
                    >
                      <option value="">General Support / Inactive</option>
                      {requests.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.id} ({r.serviceCategoryName})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                      Complaint Nature
                    </label>
                    <select
                      value={complaintCategory}
                      onChange={(e) => setComplaintCategory(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-white"
                    >
                      <option value="delayed_service">Delayed Service / ETA Mismatch</option>
                      <option value="overcharging">Overcharging / Billing Discrepancy</option>
                      <option value="poor_quality">Poor Repair Workmanship</option>
                      <option value="unprofessional_behavior">Unprofessional Provider Behavior</option>
                      <option value="other">Other Issue</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                    Describe Incident Details*
                  </label>
                  <textarea
                    rows={3}
                    value={complaintDescription}
                    onChange={(e) => setComplaintDescription(e.target.value)}
                    placeholder="Provide specific details of what occurred so our audit team can review timestamps and GPS telematics..."
                    className="w-full p-3 text-xs border border-gray-200 rounded-xl focus:border-[#F04416] focus:outline-none bg-white"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#111111] hover:bg-black text-white text-xs font-bold rounded-xl transition-colors"
                >
                  File Official Grievance Ticket
                </button>
              </form>
            )}
          </div>

          {/* Legal Compliance Quick Links */}
          {onOpenLegal && (
            <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs text-gray-500 gap-2">
              <span className="font-semibold text-gray-700">Platform Policies:</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onOpenLegal('terms')}
                  className="hover:text-[#F04416] hover:underline"
                >
                  Terms of Service
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => onOpenLegal('privacy')}
                  className="hover:text-[#F04416] hover:underline"
                >
                  Privacy & GPS
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => onOpenLegal('refund')}
                  className="hover:text-[#F04416] hover:underline"
                >
                  Cancellation Policy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
