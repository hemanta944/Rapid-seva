// RapidSeva Export Service (CSV & Excel)
import * as XLSX from 'xlsx';
import { AssistanceRequest, ServiceProvider, PaymentRecord, Complaint } from '../types';

export function exportBookingsToExcel(requests: AssistanceRequest[]) {
  const data = requests.map((r) => ({
    'Booking ID': r.id,
    'Date & Time': new Date(r.createdAt).toLocaleString('en-IN'),
    'Customer Name': r.customerName,
    'Customer Phone': r.customerPhone,
    'Service Category': r.serviceCategoryName,
    'Vehicle': `${r.vehicleDetails.brand} ${r.vehicleDetails.model} (${r.vehicleDetails.registrationNumber})`,
    'Problem': r.problemType,
    'Location': r.location.address,
    'Provider': r.providerBusinessName || r.providerName || 'Unassigned',
    'Status': r.status,
    'Price (INR)': r.finalPrice || r.estimatedPrice,
    'Platform Commission (INR)': r.platformCommission || 0,
    'Provider Earnings (INR)': r.providerEarnings || 0,
    'Payment Status': r.paymentStatus,
    'Payment Method': r.paymentMethod || 'N/A',
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Bookings');
  XLSX.writeFile(workbook, `RapidSeva-Bookings-Report-${Date.now()}.xlsx`);
}

export function exportProvidersToExcel(providers: ServiceProvider[]) {
  const data = providers.map((p) => ({
    'Provider ID': p.id,
    'Business Name': p.businessName,
    'Technician Name': p.fullName,
    'Phone': p.phone,
    'Email': p.email,
    'Categories': p.serviceCategories.join(', '),
    'Service Areas': p.serviceAreas.join(', '),
    'Verification Status': p.verificationStatus.toUpperCase(),
    'Online Status': p.isOnline ? 'Online' : 'Offline',
    'Experience (Years)': p.yearsOfExperience,
    'Rating': p.rating || 'No ratings',
    'Total Jobs Completed': p.totalJobsCompleted,
    'Bank Account': `${p.bankDetails.bankName} - ${p.bankDetails.accountNumber}`,
    'UPI ID': p.bankDetails.upiId || 'N/A',
    'Registered Date': new Date(p.createdAt).toLocaleDateString('en-IN'),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Providers');
  XLSX.writeFile(workbook, `RapidSeva-Providers-Report-${Date.now()}.xlsx`);
}

export function exportRevenueToExcel(payments: PaymentRecord[]) {
  const data = payments.map((p) => ({
    'Transaction ID': p.id,
    'Booking ID': p.bookingId,
    'Gross Amount (INR)': p.grossAmount,
    'Platform Commission (INR)': p.platformCommission,
    'Provider Payout (INR)': p.providerPayout,
    'GST Tax (INR)': p.taxAmount,
    'Gateway': p.paymentGateway,
    'Method': p.paymentMethod,
    'Status': p.status.toUpperCase(),
    'Paid At': new Date(p.paidAt).toLocaleString('en-IN'),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Revenue');
  XLSX.writeFile(workbook, `RapidSeva-Revenue-Ledger-${Date.now()}.xlsx`);
}

export function exportComplaintsToExcel(complaints: Complaint[]) {
  const data = complaints.map((c) => ({
    'Complaint ID': c.id,
    'Booking ID': c.bookingId,
    'Customer Name': c.customerName,
    'Customer Phone': c.customerPhone,
    'Provider Name': c.providerName || 'N/A',
    'Category': c.category,
    'Description': c.description,
    'Status': c.status.toUpperCase(),
    'Resolution': c.resolutionNote || 'Pending resolution',
    'Date Logged': new Date(c.createdAt).toLocaleString('en-IN'),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Complaints');
  XLSX.writeFile(workbook, `RapidSeva-Complaints-Report-${Date.now()}.xlsx`);
}
