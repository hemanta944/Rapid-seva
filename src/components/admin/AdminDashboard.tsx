import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Wrench,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  AlertTriangle,
  FileSpreadsheet,
  Settings,
  Shield,
  FileText,
  Search,
  Eye,
  Check,
  Ban,
  RotateCw,
  Plus,
  Trash2,
  Download,
  BellRing,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import {
  exportBookingsToExcel,
  exportProvidersToExcel,
  exportRevenueToExcel,
  exportComplaintsToExcel,
} from '../../services/exportService';
import { generateInvoicePdf } from '../../services/pdfService';
import { ProviderVerificationStatus, RequestStatus, ServiceCategoryType } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    users,
    providers,
    requests,
    payments,
    complaints,
    categories,
    settings,
    auditLogs,
    store,
    activeUser,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'providers' | 'bookings' | 'customers' | 'pricing' | 'reports' | 'audit' | 'content'
  >('overview');

  // Search & filter states
  const [providerSearch, setProviderSearch] = useState('');
  const [providerFilter, setProviderFilter] = useState<'all' | ProviderVerificationStatus>('all');
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingFilter, setBookingFilter] = useState<'all' | RequestStatus>('all');
  const [customerSearch, setCustomerSearch] = useState('');

  // Document verification modal state
  const [inspectDocProvider, setInspectDocProvider] = useState<any | null>(null);

  // Pricing configuration state
  const [commissionRate, setCommissionRate] = useState<number>(settings.platformCommissionPercent || 15);
  const [timeoutSec, setTimeoutSec] = useState<number>(settings.providerResponseTimeoutSeconds || 45);
  const [gstRate, setGstRate] = useState<number>(settings.gstPercent || 18);
  const [pricingSuccess, setPricingSuccess] = useState(false);

  // Emergency contacts configuration state (Master Prompt 5.G)
  const [emergencyPhoneNumbers, setEmergencyPhoneNumbers] = useState(settings.emergencyPhoneNumbers);
  const [supportPhone, setSupportPhone] = useState(settings.supportPhone);
  const [emergencySuccess, setEmergencySuccess] = useState(false);

  // Broadcast notification state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState<'all' | 'customer' | 'provider'>('all');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // --- Real Metric Computations (Master Prompt 5.A) ---
  const totalCustomers = users.filter((u) => u.role === 'customer').length;
  const totalProviders = providers.length;
  const pendingApprovals = providers.filter((p) => p.verificationStatus === 'pending').length;
  const activeRequests = requests.filter(
    (r) =>
      r.status !== 'SERVICE_COMPLETED' &&
      r.status !== 'PAYMENT_COMPLETED' &&
      r.status !== 'CANCELLED'
  ).length;
  const completedBookings = requests.filter(
    (r) => r.status === 'SERVICE_COMPLETED' || r.status === 'PAYMENT_COMPLETED'
  ).length;
  const cancelledBookings = requests.filter((r) => r.status === 'CANCELLED').length;
  
  const grossTransactionValue = requests.reduce(
    (acc, r) => acc + (r.paymentStatus === 'completed' ? (r.finalPrice || r.estimatedPrice || 0) : 0),
    0
  );
  const platformCommissionValue = Math.round(
    grossTransactionValue * (settings.platformCommissionPercent / 100) * 100
  ) / 100;
  const openComplaintsCount = complaints.filter((c) => c.status === 'open').length;

  const handleUpdateSettings = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateSettings({
      platformCommissionPercent: Number(commissionRate),
      providerResponseTimeoutSeconds: Number(timeoutSec),
      gstPercent: Number(gstRate),
    });
    setPricingSuccess(true);
    setTimeout(() => setPricingSuccess(false), 2500);
  };

  const handleUpdateEmergencyContacts = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateSettings({
      emergencyPhoneNumbers,
      supportPhone,
    });
    setEmergencySuccess(true);
    setTimeout(() => setEmergencySuccess(false), 2500);
  };

  const handleBroadcastNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMsg) return;

    store.addNotification({
      recipientId: broadcastTarget === 'all' ? 'broadcast_all' : `broadcast_${broadcastTarget}`,
      recipientRole: broadcastTarget === 'all' ? 'customer' : (broadcastTarget as any),
      title: broadcastTitle,
      message: broadcastMsg,
      type: 'system',
    });

    store.addAuditLog(
      'NOTIFICATION_BROADCAST',
      `Broadcast notification sent to [${broadcastTarget}]: "${broadcastTitle}"`,
      activeUser || { id: 'admin', name: 'Super Admin', role: 'admin' }
    );

    setBroadcastSuccess(true);
    setBroadcastTitle('');
    setBroadcastMsg('');
    setTimeout(() => setBroadcastSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Super Admin Top Header */}
      <div className="bg-[#111111] text-white rounded-3xl p-6 shadow-elevated border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-orange-400">
              Super Admin Control Plane
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight mt-1">
            RapidSeva Platform Operations
          </h2>
          <p className="text-xs text-gray-400">
            Authenticated as: {activeUser?.name || 'Administrator'} • Real Database Synchronized
          </p>
        </div>

        {/* Global Action Quick Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => exportBookingsToExcel(requests)}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 flex items-center gap-1.5 transition-all"
            title="Download Full Excel Report"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export Bookings</span>
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className="px-3.5 py-2 bg-[#F04416] hover:bg-[#D8380E] text-white text-xs font-bold rounded-xl shadow-brand flex items-center gap-1.5 transition-all"
          >
            <Settings className="w-4 h-4" />
            <span>Pricing & Commission</span>
          </button>
        </div>
      </div>

      {/* Admin Tab Navigation Bar */}
      <div className="flex gap-2 overflow-x-auto pb-1 border-b border-gray-200">
        {[
          { id: 'overview', label: 'Overview Metrics', icon: TrendingUp },
          { id: 'providers', label: `Providers & Approvals (${pendingApprovals})`, icon: Wrench, alert: pendingApprovals > 0 },
          { id: 'bookings', label: `Bookings (${requests.length})`, icon: Clock },
          { id: 'customers', label: `Customers (${totalCustomers})`, icon: Users },
          { id: 'pricing', label: 'Pricing & Commission', icon: Settings },
          { id: 'reports', label: 'Excel Reports', icon: FileSpreadsheet },
          { id: 'content', label: 'CMS & Broadcasts', icon: BellRing },
          { id: 'audit', label: 'Audit Trail', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 shrink-0 transition-all ${
                isActive
                  ? 'bg-[#111111] text-white shadow-sm'
                  : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#F04416]' : 'text-gray-500'}`} />
              <span>{tab.label}</span>
              {tab.alert && (
                <span className="w-2 h-2 rounded-full bg-[#F04416] animate-ping" />
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. OVERVIEW METRICS TAB (Master Prompt 5.A) */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top 8 Real Database KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Total Customers */}
            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                Total Customers
              </span>
              <div className="text-3xl font-black text-gray-900 mt-1">{totalCustomers}</div>
              <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-blue-500" />
                Verified registered
              </div>
            </div>

            {/* Total Providers */}
            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                Registered Providers
              </span>
              <div className="text-3xl font-black text-gray-900 mt-1">{totalProviders}</div>
              <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                <Wrench className="w-3.5 h-3.5 text-[#F04416]" />
                Mechanics & garages
              </div>
            </div>

            {/* Pending Approvals */}
            <div className={`p-5 rounded-3xl border-2 shadow-sm ${pendingApprovals > 0 ? 'bg-amber-50/70 border-amber-300' : 'bg-white border-gray-200'}`}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                Pending Approvals
              </span>
              <div className="text-3xl font-black text-amber-700 mt-1">{pendingApprovals}</div>
              <div className="text-[11px] text-amber-800 font-bold mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Document verification
              </div>
            </div>

            {/* Active Requests */}
            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                Active Telematics Jobs
              </span>
              <div className="text-3xl font-black text-blue-600 mt-1">{activeRequests}</div>
              <div className="text-[11px] text-blue-800 font-bold mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                In-transit or working
              </div>
            </div>

            {/* Completed Bookings */}
            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                Completed Bookings
              </span>
              <div className="text-3xl font-black text-emerald-600 mt-1">{completedBookings}</div>
              <div className="text-[11px] text-emerald-800 font-bold mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Successfully resolved
              </div>
            </div>

            {/* Cancelled Bookings */}
            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                Cancelled Bookings
              </span>
              <div className="text-3xl font-black text-rose-600 mt-1">{cancelledBookings}</div>
              <div className="text-[11px] text-rose-800 font-bold mt-1 flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" />
                No provider / cancelled
              </div>
            </div>

            {/* Gross Transaction Value */}
            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                Gross Transaction Value
              </span>
              <div className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
                ₹{grossTransactionValue}
              </div>
              <div className="text-[11px] text-gray-500 mt-1">
                Total services rendered
              </div>
            </div>

            {/* Platform Commission (15%) */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-5 rounded-3xl border-2 border-[#F04416] shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F04416] block">
                Platform Commission ({settings.platformCommissionPercent}%)
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#F04416] mt-1">
                ₹{platformCommissionValue}
              </div>
              <div className="text-[11px] text-orange-800 font-bold mt-1">
                RapidSeva net revenue
              </div>
            </div>
          </div>

          {/* Pending Approvals Alert Banner */}
          {pendingApprovals > 0 && (
            <div className="p-4 bg-amber-50 border border-amber-300 rounded-3xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-amber-950">
                    Action Required: {pendingApprovals} Provider Registration(s) Awaiting Review
                  </h4>
                  <p className="text-xs text-amber-900/80">
                    Unapproved providers are blocked from receiving roadside assistance calls until approved.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('providers')}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shrink-0"
              >
                Review Applications
              </button>
            </div>
          )}

          {/* Recent Live Activity Table */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-gray-900">
              Recent Assistance Bookings & Live Dispatches
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold border-y border-gray-100">
                  <tr>
                    <th className="py-2.5 px-3">Booking ID</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Service</th>
                    <th className="py-2.5 px-3">Provider</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {requests.slice(0, 5).map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50">
                      <td className="py-3 px-3 font-mono font-bold text-gray-900">{req.id}</td>
                      <td className="py-3 px-3">{req.customerName}</td>
                      <td className="py-3 px-3 text-gray-600">{req.serviceCategoryName}</td>
                      <td className="py-3 px-3 font-bold text-gray-800">
                        {req.providerBusinessName || req.providerName || 'Scanning...'}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-[#F04416]">
                          {req.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-gray-900">
                        ₹{req.finalPrice || req.estimatedPrice}
                      </td>
                      <td className="py-3 px-3 text-gray-400 font-mono">
                        {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. PROVIDERS & APPROVALS TAB (Master Prompt 5.C) */}
      {/* ========================================================================= */}
      {activeTab === 'providers' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                Provider Registrations & Trade Verifications
              </h3>
              <p className="text-xs text-gray-500">
                Review licenses, garage registrations & manage account statuses
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search provider / shop..."
                value={providerSearch}
                onChange={(e) => setProviderSearch(e.target.value)}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded-xl"
              />
              <select
                value={providerFilter}
                onChange={(e) => setProviderFilter(e.target.value as any)}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded-xl bg-white font-semibold"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending Only ({pendingApprovals})</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold border-y border-gray-100">
                <tr>
                  <th className="py-2.5 px-3">Workshop & Owner</th>
                  <th className="py-2.5 px-3">Categories</th>
                  <th className="py-2.5 px-3">Service Areas</th>
                  <th className="py-2.5 px-3">Verification</th>
                  <th className="py-2.5 px-3">Documents</th>
                  <th className="py-2.5 px-3">Rating / Jobs</th>
                  <th className="py-2.5 px-3 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {providers
                  .filter((p) => {
                    const matchSearch =
                      p.fullName.toLowerCase().includes(providerSearch.toLowerCase()) ||
                      p.businessName.toLowerCase().includes(providerSearch.toLowerCase());
                    const matchFilter = providerFilter === 'all' || p.verificationStatus === providerFilter;
                    return matchSearch && matchFilter;
                  })
                  .map((prov) => (
                    <tr key={prov.id} className="hover:bg-gray-50">
                      <td className="py-3 px-3">
                        <div className="font-extrabold text-gray-900">{prov.businessName}</div>
                        <div className="text-[11px] text-gray-500">{prov.fullName} • {prov.phone}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1">
                          {prov.serviceCategories.slice(0, 2).map((c) => (
                            <span key={c} className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">
                              {c}
                            </span>
                          ))}
                          {prov.serviceCategories.length > 2 && (
                            <span className="text-[10px] text-gray-400">+{prov.serviceCategories.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-gray-600 text-[11px] max-w-xs truncate">
                        {prov.serviceAreas.join(', ')}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            prov.verificationStatus === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : prov.verificationStatus === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {prov.verificationStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => setInspectDocProvider(prov)}
                          className="text-xs text-[#F04416] font-bold hover:underline flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View ({prov.documents.length})
                        </button>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-gray-900">★ {prov.rating || 'New'}</span>
                        <span className="text-gray-400 ml-1">({prov.totalJobsCompleted} jobs)</span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {prov.verificationStatus !== 'approved' && (
                            <button
                              onClick={() => store.updateProviderVerification(prov.id, 'approved')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                              title="Approve for service"
                            >
                              Approve
                            </button>
                          )}
                          {prov.verificationStatus !== 'rejected' && prov.verificationStatus === 'pending' && (
                            <button
                              onClick={() => store.updateProviderVerification(prov.id, 'rejected', 'Missing trade license')}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors"
                              title="Reject registration"
                            >
                              Reject
                            </button>
                          )}
                          {prov.verificationStatus === 'approved' && (
                            <button
                              onClick={() => store.updateProviderVerification(prov.id, 'suspended', 'Administrative hold')}
                              className="px-2.5 py-1 bg-gray-700 hover:bg-black text-white rounded-lg text-xs font-bold transition-colors"
                              title="Suspend account"
                            >
                              Suspend
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. BOOKINGS MANAGEMENT TAB (Master Prompt 5.D) */}
      {/* ========================================================================= */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                All Assistance Bookings & Live Status Audit
              </h3>
              <p className="text-xs text-gray-500">
                Full lifecycle logs, emergency cancellations & invoice download
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search Booking ID / customer..."
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded-xl font-mono"
              />
              <button
                onClick={() => exportBookingsToExcel(requests)}
                className="px-3 py-1.5 bg-[#111111] hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold border-y border-gray-100">
                <tr>
                  <th className="py-2.5 px-3">Booking ID</th>
                  <th className="py-2.5 px-3">Customer & Vehicle</th>
                  <th className="py-2.5 px-3">Service & Issue</th>
                  <th className="py-2.5 px-3">Assigned Provider</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {requests
                  .filter((r) =>
                    r.id.toLowerCase().includes(bookingSearch.toLowerCase()) ||
                    r.customerName.toLowerCase().includes(bookingSearch.toLowerCase())
                  )
                  .map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50">
                      <td className="py-3 px-3 font-mono font-bold text-gray-900">{req.id}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-gray-900">{req.customerName}</div>
                        <div className="text-[11px] text-gray-500 font-mono">
                          {req.vehicleDetails.brand} {req.vehicleDetails.model} ({req.vehicleDetails.registrationNumber})
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-[#F04416]">{req.serviceCategoryName}</div>
                        <div className="text-[11px] text-gray-500 truncate max-w-xs">{req.problemType}</div>
                      </td>
                      <td className="py-3 px-3">
                        {req.providerBusinessName ? (
                          <div className="font-bold text-gray-800">{req.providerBusinessName}</div>
                        ) : (
                          <span className="text-gray-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-800">
                          {req.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-extrabold text-gray-900">
                        ₹{req.finalPrice || req.estimatedPrice}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {req.status === 'PAYMENT_COMPLETED' && (
                            <button
                              onClick={() => generateInvoicePdf(req)}
                              className="p-1.5 text-gray-600 hover:text-[#F04416] rounded"
                              title="Download Tax Invoice"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          )}
                          {req.status !== 'CANCELLED' && req.status !== 'PAYMENT_COMPLETED' && (
                            <button
                              onClick={() => store.cancelRequest(req.id, 'Admin intervention cancellation', 'admin')}
                              className="px-2 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded text-[10px] font-bold"
                            >
                              Cancel Call
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. CUSTOMERS MANAGEMENT TAB (Master Prompt 5.B) */}
      {/* ========================================================================= */}
      {activeTab === 'customers' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                Registered Customers & Vehicles
              </h3>
              <p className="text-xs text-gray-500">
                View customer profiles, registration timestamps & suspend accounts
              </p>
            </div>
            <input
              type="text"
              placeholder="Search customer name / phone..."
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              className="px-3 py-1.5 text-xs border border-gray-200 rounded-xl"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold border-y border-gray-100">
                <tr>
                  <th className="py-2.5 px-3">Customer Name</th>
                  <th className="py-2.5 px-3">Contact Details</th>
                  <th className="py-2.5 px-3">Registered Vehicles</th>
                  <th className="py-2.5 px-3">Total Requests</th>
                  <th className="py-2.5 px-3">Account Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {users
                  .filter((u) => u.role === 'customer')
                  .filter(
                    (u) =>
                      u.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
                      u.phone.includes(customerSearch)
                  )
                  .map((cust) => {
                    const custVehs = store.getVehicles(cust.id);
                    const custReqs = requests.filter((r) => r.customerId === cust.id);
                    return (
                      <tr key={cust.id} className="hover:bg-gray-50">
                        <td className="py-3 px-3">
                          <div className="font-bold text-gray-900">{cust.name}</div>
                          <div className="text-[10px] text-gray-400 font-mono">{cust.id}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-mono text-gray-800">{cust.phone}</div>
                          <div className="text-[11px] text-gray-500">{cust.email}</div>
                        </td>
                        <td className="py-3 px-3">
                          {custVehs.map((v) => (
                            <span key={v.id} className="inline-block mr-1 text-[10px] bg-gray-100 px-1.5 py-0.5 rounded font-mono">
                              {v.brand} {v.model} ({v.registrationNumber})
                            </span>
                          ))}
                        </td>
                        <td className="py-3 px-3 font-bold text-gray-900">
                          {custReqs.length} Bookings
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                            {cust.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => alert(`Customer ${cust.name} account details verified.`)}
                            className="text-xs text-[#F04416] font-bold hover:underline"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. PRICING & COMMISSION CONFIGURATION TAB (Master Prompt 5.E) */}
      {/* ========================================================================= */}
      {activeTab === 'pricing' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-5">
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                Platform Commission & Timeout Governance
              </h3>
              <p className="text-xs text-gray-500">
                Changes take effect across the dispatch engine immediately and are recorded in the immutable audit log.
              </p>
            </div>

            {pricingSuccess && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Platform settings updated & logged to system audit trail!</span>
              </div>
            )}

            <form onSubmit={handleUpdateSettings} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                  RapidSeva Platform Commission (%)*
                </label>
                <input
                  type="number"
                  min="5"
                  max="40"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl font-bold font-mono"
                  required
                />
                <span className="text-[10px] text-gray-400 mt-0.5 block">Standard platform fee on completed jobs</span>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                  Provider Dispatch Timeout (Seconds)*
                </label>
                <input
                  type="number"
                  min="15"
                  max="120"
                  value={timeoutSec}
                  onChange={(e) => setTimeoutSec(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl font-bold font-mono"
                  required
                />
                <span className="text-[10px] text-gray-400 mt-0.5 block">Wait window before cascading to next mechanic</span>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                  GST Applicable Rate (%)*
                </label>
                <input
                  type="number"
                  min="0"
                  max="28"
                  value={gstRate}
                  onChange={(e) => setGstRate(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl font-bold font-mono"
                  required
                />
                <span className="text-[10px] text-gray-400 mt-0.5 block">SAC 998714 Tax Invoice rate</span>
              </div>

              <div className="sm:col-span-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#F04416] hover:bg-[#D8380E] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-brand transition-all"
                >
                  Save & Log Pricing Changes
                </button>
              </div>
            </form>
          </div>

          {/* Service Category Base Rates */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-gray-900">
              Service Category Base Rates (INR)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {categories.map((cat) => (
                <div key={cat.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                  <div className="font-extrabold text-xs text-gray-900">{cat.name}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Base Price:</span>
                    <input
                      type="number"
                      value={cat.basePrice}
                      onChange={(e) => store.updateCategory(cat.id, { basePrice: Number(e.target.value) })}
                      className="w-24 px-2 py-1 text-xs border border-gray-300 rounded font-mono font-bold text-right"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. REPORTS & EXPORTS TAB (Master Prompt 5.F) */}
      {/* ========================================================================= */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-gray-900">
              Download Official Regulatory & Audited Excel Reports
            </h3>
            <p className="text-xs text-gray-500">
              Generate full data dumps in Microsoft Excel (.xlsx) / CSV format for accounting, taxation & audit.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-gray-50 rounded-3xl border border-gray-200 space-y-3">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <h4 className="font-extrabold text-sm text-gray-900">Bookings & Dispatch Dump</h4>
              </div>
              <p className="text-xs text-gray-500">
                Contains complete records of all assistance calls, customer details, vehicles, attending providers, timestamps, and fees.
              </p>
              <button
                onClick={() => exportBookingsToExcel(requests)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Bookings ({requests.length} records)</span>
              </button>
            </div>

            <div className="p-5 bg-gray-50 rounded-3xl border border-gray-200 space-y-3">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                <h4 className="font-extrabold text-sm text-gray-900">Provider Roster & Status</h4>
              </div>
              <p className="text-xs text-gray-500">
                All registered mechanics, workshops, verification statuses, bank details, ratings, and lifetime completed job counts.
              </p>
              <button
                onClick={() => exportProvidersToExcel(providers)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Providers ({providers.length} records)</span>
              </button>
            </div>

            <div className="p-5 bg-gray-50 rounded-3xl border border-gray-200 space-y-3">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-5 h-5 text-[#F04416]" />
                <h4 className="font-extrabold text-sm text-gray-900">Revenue & GST Commission Ledger</h4>
              </div>
              <p className="text-xs text-gray-500">
                Gross transaction value, platform 15% fee, SAC 998714 GST breakdown, and provider net bank settlement ledgers.
              </p>
              <button
                onClick={() => exportRevenueToExcel(payments)}
                className="w-full py-2.5 bg-[#F04416] hover:bg-[#D8380E] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Revenue Ledger ({payments.length} transactions)</span>
              </button>
            </div>

            <div className="p-5 bg-gray-50 rounded-3xl border border-gray-200 space-y-3">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-5 h-5 text-amber-600" />
                <h4 className="font-extrabold text-sm text-gray-900">Grievances & Complaints Report</h4>
              </div>
              <p className="text-xs text-gray-500">
                Full dispute log filed by customers with resolution statuses, delay audits, and customer support notes.
              </p>
              <button
                onClick={() => exportComplaintsToExcel(complaints)}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Grievance Log ({complaints.length} tickets)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. CMS & BROADCAST TAB (Master Prompt 5.G) */}
      {/* ========================================================================= */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          {/* Emergency Helplines Configuration (Master Prompt 5.G & Section 1) */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-extrabold text-gray-900">
                  Assam State Emergency Helplines & Safety Telematics
                </h3>
                <p className="text-xs text-gray-500">
                  Configure real-time government and regional emergency numbers displayed to customers during breakdowns.
                </p>
              </div>
              <span className="text-[11px] font-bold bg-red-100 text-red-800 px-3 py-1 rounded-full self-start sm:self-auto">
                Guwahati / Kamrup Metro
              </span>
            </div>

            {emergencySuccess && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Emergency helplines successfully updated across customer applications!</span>
              </div>
            )}

            <form onSubmit={handleUpdateEmergencyContacts} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                    National Emergency / Assam ERSS*
                  </label>
                  <input
                    type="text"
                    value={emergencyPhoneNumbers.nationalEmergency}
                    onChange={(e) =>
                      setEmergencyPhoneNumbers({ ...emergencyPhoneNumbers, nationalEmergency: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl font-mono font-bold"
                    required
                  />
                  <span className="text-[10px] text-gray-400">Assam Integrated Police & Emergency</span>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                    Mrityunjoy Ambulance Helpline*
                  </label>
                  <input
                    type="text"
                    value={emergencyPhoneNumbers.ambulance}
                    onChange={(e) =>
                      setEmergencyPhoneNumbers({ ...emergencyPhoneNumbers, ambulance: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl font-mono font-bold"
                    required
                  />
                  <span className="text-[10px] text-gray-400">GVK EMRI Medical Emergency</span>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                    Guwahati City Police Control*
                  </label>
                  <input
                    type="text"
                    value={emergencyPhoneNumbers.police}
                    onChange={(e) =>
                      setEmergencyPhoneNumbers({ ...emergencyPhoneNumbers, police: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl font-mono font-bold"
                    required
                  />
                  <span className="text-[10px] text-gray-400">Kamrup Metro Police Control Room</span>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                    NH-27 Guwahati Bypass (NHAI)*
                  </label>
                  <input
                    type="text"
                    value={emergencyPhoneNumbers.highwayHelpline}
                    onChange={(e) =>
                      setEmergencyPhoneNumbers({ ...emergencyPhoneNumbers, highwayHelpline: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl font-mono font-bold"
                    required
                  />
                  <span className="text-[10px] text-gray-400">National Highway Patrol & Towing</span>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                    Assam Fire & Emergency (Panbazar)*
                  </label>
                  <input
                    type="text"
                    value={emergencyPhoneNumbers.fire}
                    onChange={(e) =>
                      setEmergencyPhoneNumbers({ ...emergencyPhoneNumbers, fire: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl font-mono font-bold"
                    required
                  />
                  <span className="text-[10px] text-gray-400">Guwahati Fire Headquarters</span>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                    Guwahati Traffic Control Room*
                  </label>
                  <input
                    type="text"
                    value={emergencyPhoneNumbers.trafficHelpline}
                    onChange={(e) =>
                      setEmergencyPhoneNumbers({ ...emergencyPhoneNumbers, trafficHelpline: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl font-mono font-bold"
                    required
                  />
                  <span className="text-[10px] text-gray-400">Flyover & Highway Obstruction Clearance</span>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                    RapidSeva 24/7 Support Hotline*
                  </label>
                  <input
                    type="text"
                    value={supportPhone}
                    onChange={(e) => setSupportPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl font-mono font-bold text-[#F04416]"
                    required
                  />
                  <span className="text-[10px] text-gray-400">Platform Non-Emergency Helpdesk</span>
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#111111] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm"
              >
                Save Emergency Settings
              </button>
            </form>
          </div>

          {/* Platform Broadcasts (Master Prompt 5.G) */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                Platform Broadcasts & Announcements
              </h3>
              <p className="text-xs text-gray-500">
                Send instant high-priority in-app notifications to customers, providers, or platform-wide.
              </p>
            </div>

            {broadcastSuccess && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Broadcast dispatched successfully!</span>
              </div>
            )}

            <form onSubmit={handleBroadcastNotification} className="space-y-4 max-w-xl">
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                  Recipient Audience*
                </label>
                <select
                  value={broadcastTarget}
                  onChange={(e) => setBroadcastTarget(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-white"
                >
                  <option value="all">Everyone (All Customers & Providers)</option>
                  <option value="customer">Customers Only</option>
                  <option value="provider">Service Providers Only</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                  Notification Headline*
                </label>
                <input
                  type="text"
                  placeholder="e.g. Heavy Rain Alert: Extended ETA on NH-27"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                  Notification Message*
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter alert details visible to users in their notification drawer..."
                  value={broadcastMsg}
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                  className="w-full p-3 text-xs border border-gray-200 rounded-xl"
                  required
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#F04416] hover:bg-[#D8380E] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-brand flex items-center gap-1.5 transition-all"
              >
                <BellRing className="w-4 h-4" />
                <span>Broadcast Push Notification</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. AUDIT LOGS TAB (Master Prompt 9) */}
      {/* ========================================================================= */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-gray-900">
              System Audit Trail & Security Ledger
            </h3>
            <p className="text-xs text-gray-500">
              Immutable chronological record of administrative actions, status transitions, and pricing edits
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold border-y border-gray-100">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Actor</th>
                  <th className="py-2.5 px-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-mono text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="py-2.5 px-3 text-gray-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-[#F04416]">{log.action}</td>
                    <td className="py-2.5 px-3 text-gray-800">{log.actorName} ({log.actorRole})</td>
                    <td className="py-2.5 px-3 text-gray-600 font-sans">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Document Inspector Modal */}
      {inspectDocProvider && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h4 className="font-extrabold text-sm text-gray-900">
                Verify Documents: {inspectDocProvider.businessName}
              </h4>
              <button
                onClick={() => setInspectDocProvider(null)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {inspectDocProvider.documents.map((doc: any) => (
                <div key={doc.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs uppercase text-gray-700">{doc.docType.replace(/_/g, ' ')}</span>
                    <span className="text-[10px] font-mono text-gray-500">{doc.docNumber}</span>
                  </div>
                  <img
                    src={doc.documentUrl}
                    alt="Document"
                    className="w-full h-44 object-cover rounded-xl border border-gray-200"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => {
                  store.updateProviderVerification(inspectDocProvider.id, 'rejected', 'Document illegible or expired');
                  setInspectDocProvider(null);
                }}
                className="px-4 py-2 bg-rose-50 text-rose-700 font-bold text-xs rounded-xl"
              >
                Reject Application
              </button>
              <button
                onClick={() => {
                  store.updateProviderVerification(inspectDocProvider.id, 'approved');
                  setInspectDocProvider(null);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
              >
                Approve & Activate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
