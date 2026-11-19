import React, { useState } from 'react';
import { User, Phone, Mail, Shield, Trash2, X, CheckCircle2, Lock } from 'lucide-react';
import { useStore } from '../../hooks/useStore';

interface CustomerProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerProfile: React.FC<CustomerProfileProps> = ({ isOpen, onClose }) => {
  const { activeUser, store } = useStore();

  const [name, setName] = useState(activeUser?.name || 'Rajesh Kumar');
  const [phone, setPhone] = useState(activeUser?.phone || '+91 98765 43210');
  const [email, setEmail] = useState(activeUser?.email || 'rajesh.kumar@example.com');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeUser) {
      store.setActiveUser({
        ...activeUser,
        name,
        phone,
        email,
        updatedAt: new Date().toISOString(),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  const handleDeleteRequest = () => {
    if (window.confirm('Request account deletion and purge of all personal data under DPDP Act / GDPR? This action cannot be reversed.')) {
      store.addAuditLog('ACCOUNT_DELETION_REQUESTED', `Customer ${activeUser?.name} requested full account purge.`, activeUser || { id: 'cust', name: 'cust', role: 'customer' });
      setDeleteConfirmed(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-orange-50 rounded-xl text-[#F04416]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">Customer Profile & Privacy</h3>
              <p className="text-xs text-gray-500">Manage contact information & privacy preferences</p>
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
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Profile details updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold uppercase text-gray-500 block mb-1">
                Full Legal Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-200 rounded-xl font-bold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-gray-500 block mb-1">
                Mobile Number (Used for Driver Dispatch)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-200 rounded-xl font-mono font-bold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-gray-500 block mb-1">
                Email Address (For Tax Invoices & Receipts)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-200 rounded-xl"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#F04416] hover:bg-[#D8380E] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-brand transition-all"
            >
              Update Profile Details
            </button>
          </form>

          {/* Privacy & Statutory Compliance Section */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Data Protection & Privacy Rights</span>
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              RapidSeva minimizes data collection strictly to your active breakdown location, vehicle registration, and telephone number during dispatched requests. GPS coordinates are masked immediately after job completion.
            </p>

            <div className="pt-2 border-t border-gray-200 flex flex-col gap-2">
              {deleteConfirmed ? (
                <div className="p-3 bg-rose-50 text-rose-800 text-xs font-bold rounded-xl border border-rose-200">
                  Account deletion ticket submitted. Your profile will be safely deactivated within 24 hours.
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleDeleteRequest}
                  className="text-left text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Request Full Account & Data Deletion</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
