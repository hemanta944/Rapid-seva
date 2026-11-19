import React, { useState } from 'react';
import {
  Wrench,
  Power,
  ShieldCheck,
  ShieldAlert,
  Star,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  FileText,
  DollarSign,
  ChevronRight,
  UserPlus,
  Play,
  Navigation,
  Car,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { IncomingRequestModal } from './IncomingRequestModal';
import { ProviderRegisterModal } from './ProviderRegisterModal';
import { RequestStatus, ServiceProvider } from '../../types';

export const ProviderDashboard: React.FC = () => {
  const { providers, requests, payments, activeUser, store } = useStore();

  const [registerOpen, setRegisterOpen] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState<string>(
    providers[0]?.id || 'prov_brahmaputra_auto'
  );

  const currentProvider = providers.find((p) => p.id === selectedProviderId) || providers[0];
  const isApproved = currentProvider?.verificationStatus === 'approved';

  // Check if there is an incoming request offered to this provider
  const incomingRequest = requests.find(
    (r) =>
      r.status === 'PROVIDER_NOTIFIED' &&
      r.currentOfferedProviderId === currentProvider?.id
  );

  // Active job currently assigned to this provider
  const activeJob = requests.find(
    (r) =>
      r.assignedProviderId === currentProvider?.id &&
      r.status !== 'SERVICE_COMPLETED' &&
      r.status !== 'PAYMENT_COMPLETED' &&
      r.status !== 'CANCELLED'
  );

  // Completed jobs for this provider
  const completedJobs = requests.filter(
    (r) =>
      r.assignedProviderId === currentProvider?.id &&
      (r.status === 'SERVICE_COMPLETED' || r.status === 'PAYMENT_COMPLETED')
  );

  // Payout ledger
  const providerPayments = payments.filter((p) => p.providerId === currentProvider?.id);
  const totalGrossEarnings = completedJobs.reduce(
    (acc, r) => acc + (r.finalPrice || r.estimatedPrice || 0),
    0
  );
  const commissionPercent = store.getSettings().platformCommissionPercent || 15;
  const platformCommissionTotal = Math.round((totalGrossEarnings * (commissionPercent / 100)) * 100) / 100;
  const netEarningsTotal = Math.round((totalGrossEarnings - platformCommissionTotal) * 100) / 100;

  const handleToggleOnline = () => {
    if (!isApproved) {
      alert('Your account is currently PENDING VERIFICATION. Unapproved providers cannot go online to receive roadside jobs.');
      return;
    }
    store.toggleProviderOnline(currentProvider.id, !currentProvider.isOnline);
  };

  const handleUpdateJobStatus = (newStatus: RequestStatus, note: string) => {
    if (!activeJob) return;
    store.updateRequestStatus(activeJob.id, newStatus, note, 'provider');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Provider Selector & Onboarding Pill */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#111111] text-white flex items-center justify-center font-bold text-lg shadow-sm">
            🛠️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-gray-900">
                {currentProvider?.businessName}
              </h2>
              {isApproved ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Verified Partner
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <ShieldAlert className="w-3 h-3 text-amber-600" />
                  Pending Approval
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Tech: {currentProvider?.fullName} • {currentProvider?.phone} • {currentProvider?.serviceAreas?.join(', ')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Switch Provider Profile for Evaluation */}
          <select
            value={selectedProviderId}
            onChange={(e) => setSelectedProviderId(e.target.value)}
            className="text-xs border border-gray-200 rounded-xl px-2.5 py-2 font-semibold bg-gray-50 text-gray-700"
          >
            {providers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.fullName} ({p.verificationStatus.toUpperCase()})
              </option>
            ))}
          </select>

          <button
            onClick={() => setRegisterOpen(true)}
            className="px-3 py-2 bg-[#F04416] hover:bg-[#D8380E] text-white text-xs font-bold rounded-xl shadow-brand flex items-center gap-1 transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Register New Partner</span>
          </button>
        </div>
      </div>

      {/* Verification Status Warning if Pending */}
      {!isApproved && (
        <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 flex items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-amber-950">
                Partner Account Pending Administrator Verification
              </h4>
              <p className="text-xs text-amber-900/80 mt-0.5">
                Our verification team is auditing your trade certificate & driving license. Switch to the <b>Super Admin Dashboard</b> in the top navbar to approve this profile with 1 click!
              </p>
            </div>
          </div>
          <button
            onClick={() => store.switchPortal('admin')}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shrink-0 transition-colors"
          >
            Review in Admin
          </button>
        </div>
      )}

      {/* Online/Offline Status Control & Today's Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Toggle Online/Offline Card */}
        <div
          onClick={handleToggleOnline}
          className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between shadow-sm ${
            currentProvider?.isOnline
              ? 'bg-emerald-50/70 border-emerald-400'
              : 'bg-gray-100/80 border-gray-300 opacity-90'
          }`}
        >
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Telematics Status
            </div>
            <div className={`text-xl font-black ${currentProvider?.isOnline ? 'text-emerald-700' : 'text-gray-700'}`}>
              {currentProvider?.isOnline ? 'ONLINE & READY' : 'OFFLINE'}
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              {currentProvider?.isOnline ? 'Receiving incoming breakdown alerts' : 'Tap to switch online'}
            </p>
          </div>

          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              currentProvider?.isOnline
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-gray-300 text-gray-600'
            }`}
          >
            <Power className="w-6 h-6" />
          </div>
        </div>

        {/* Rating Card */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Customer Rating
            </div>
            <div className="text-2xl font-black text-gray-900 flex items-center gap-1.5 mt-0.5">
              <span>{currentProvider?.rating || 4.8}</span>
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              Based on {currentProvider?.reviewCount || 42} verified jobs
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Star className="w-6 h-6 fill-amber-500" />
          </div>
        </div>

        {/* Completed Jobs */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Total Roadside Jobs
            </div>
            <div className="text-2xl font-black text-gray-900 mt-0.5">
              {completedJobs.length}
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              {activeJob ? '1 job currently in progress' : 'Ready for next dispatch'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Net Earnings */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Net Provider Earnings
            </div>
            <div className="text-2xl font-black text-[#F04416] mt-0.5">
              ₹{netEarningsTotal}
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              Gross: ₹{totalGrossEarnings} (-15% fee)
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#F04416] flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Active Roadside Job (Step Controller) */}
      {activeJob && (
        <div className="p-6 bg-gradient-to-br from-white to-orange-50/40 rounded-3xl border-2 border-[#F04416] shadow-card space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-orange-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-xs font-mono font-extrabold text-[#F04416]">
                  ACTIVE DISPATCH #{activeJob.id}
                </span>
                <span className="text-xs font-bold text-gray-600">
                  ({activeJob.serviceCategoryName})
                </span>
              </div>
              <h3 className="text-lg font-black text-gray-900 mt-1">
                Vehicle: {activeJob.vehicleDetails.brand} {activeJob.vehicleDetails.model} ({activeJob.vehicleDetails.registrationNumber})
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${activeJob.customerPhone}`}
                className="px-4 py-2 bg-[#F04416] hover:bg-[#D8380E] text-white text-xs font-bold rounded-xl shadow-brand flex items-center gap-1.5 transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Customer ({activeJob.customerPhone})</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-white rounded-2xl border border-gray-200 space-y-1.5">
              <span className="font-bold text-gray-500 uppercase text-[10px] block">Customer Location</span>
              <p className="font-bold text-gray-900">📍 {activeJob.location.address}</p>
              {activeJob.location.landmark && (
                <p className="text-gray-500">Landmark: {activeJob.location.landmark}</p>
              )}
            </div>

            <div className="p-3 bg-white rounded-2xl border border-gray-200 space-y-1.5">
              <span className="font-bold text-gray-500 uppercase text-[10px] block">Reported Breakdown Problem</span>
              <p className="font-bold text-[#F04416]">{activeJob.problemType}</p>
              {activeJob.problemDescription && (
                <p className="text-gray-600 italic">"{activeJob.problemDescription}"</p>
              )}
            </div>
          </div>

          {/* 10-Step Workflow Advancement Buttons */}
          <div className="pt-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Advance Job Lifecycle Step:
            </h4>

            <div className="flex flex-wrap gap-2.5">
              {activeJob.status === 'PROVIDER_ACCEPTED' && (
                <button
                  onClick={() => handleUpdateJobStatus('PROVIDER_ON_THE_WAY', 'Technician left workshop with service vehicle and toolkit.')}
                  className="px-5 py-2.5 bg-[#F04416] hover:bg-[#D8380E] text-white font-extrabold text-xs rounded-xl shadow-brand flex items-center gap-2 transition-all"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Mark "On The Way"</span>
                </button>
              )}

              {activeJob.status === 'PROVIDER_ON_THE_WAY' && (
                <button
                  onClick={() => handleUpdateJobStatus('PROVIDER_ARRIVED', 'Technician has reached breakdown spot and met customer.')}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Mark "Arrived at Spot"</span>
                </button>
              )}

              {activeJob.status === 'PROVIDER_ARRIVED' && (
                <button
                  onClick={() => handleUpdateJobStatus('WORK_IN_PROGRESS', 'Diagnosing issue and beginning repair / battery jump / tyre change.')}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
                >
                  <Wrench className="w-4 h-4" />
                  <span>Mark "Work in Progress"</span>
                </button>
              )}

              {activeJob.status === 'WORK_IN_PROGRESS' && (
                <button
                  onClick={() => handleUpdateJobStatus('SERVICE_COMPLETED', 'Vehicle fixed & verified. Ready for payment settlement.')}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark "Service Completed"</span>
                </button>
              )}

              {(activeJob.status === 'SERVICE_COMPLETED' || activeJob.status === 'PAYMENT_PENDING') && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Service Completed! Customer can now settle payment via UPI / Razorpay.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Completed Jobs Table & Financial Settlement Breakdown */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-gray-900">
              Recent Completed Jobs & Payout Ledger
            </h3>
            <p className="text-xs text-gray-500">
              Settled directly to {currentProvider?.bankDetails?.bankName} ({currentProvider?.bankDetails?.accountNumber})
            </p>
          </div>
          <span className="text-xs font-bold text-[#F04416]">
            {completedJobs.length} Completed
          </span>
        </div>

        {completedJobs.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-gray-300 stroke-[1.5]" />
            <p className="text-sm font-bold text-gray-600">No completed jobs yet</p>
            <p className="text-xs text-gray-400 mt-1">Accept breakdown requests to earn money and build customer ratings.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] border-y border-gray-100">
                <tr>
                  <th className="py-2.5 px-3">Booking ID</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Service</th>
                  <th className="py-2.5 px-3">Gross Charge</th>
                  <th className="py-2.5 px-3">Platform Fee (15%)</th>
                  <th className="py-2.5 px-3">Your Net Earning</th>
                  <th className="py-2.5 px-3">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {completedJobs.map((job) => {
                  const gross = job.finalPrice || job.estimatedPrice;
                  const fee = Math.round(gross * 0.15 * 100) / 100;
                  const net = Math.round((gross - fee) * 100) / 100;
                  return (
                    <tr key={job.id} className="hover:bg-gray-50/60">
                      <td className="py-3 px-3 font-mono font-bold text-gray-900">{job.id}</td>
                      <td className="py-3 px-3 text-gray-800">{job.customerName}</td>
                      <td className="py-3 px-3 text-gray-600">{job.serviceCategoryName}</td>
                      <td className="py-3 px-3 font-bold text-gray-900">₹{gross}</td>
                      <td className="py-3 px-3 text-rose-600 font-semibold">-₹{fee}</td>
                      <td className="py-3 px-3 font-black text-emerald-700">₹{net}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {job.paymentStatus.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Incoming Request Modal Trigger if matched */}
      {incomingRequest && (
        <IncomingRequestModal
          request={incomingRequest}
          provider={currentProvider}
          onClose={() => {}}
        />
      )}

      {/* Registration Modal */}
      <ProviderRegisterModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSuccess={() => {
          alert('Application submitted! It will appear in Super Admin for approval.');
        }}
      />
    </div>
  );
};
