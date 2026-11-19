// RapidSeva TypeScript Domain Definitions

export type UserRole = 'customer' | 'provider' | 'admin';

export type RequestStatus =
  | 'REQUEST_RECEIVED'       // 1. Request Received
  | 'PROVIDER_NOTIFIED'      // 2. Searching & Provider Notified
  | 'PROVIDER_ACCEPTED'      // 3. Provider Accepted
  | 'PROVIDER_ON_THE_WAY'    // 4. Provider Dispatched / On the Way
  | 'PROVIDER_ARRIVED'       // 5. Provider Arrived at Breakdown Spot
  | 'WORK_IN_PROGRESS'       // 6. Work in Progress
  | 'SERVICE_COMPLETED'      // 7. Service Completed
  | 'PAYMENT_PENDING'        // 8. Payment Pending
  | 'PAYMENT_COMPLETED'      // 9. Payment Completed
  | 'CANCELLED';             // 10. Cancelled

export type ProviderVerificationStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'suspended';

export type ServiceCategoryType =
  | 'car-repair'
  | 'bike-repair'
  | 'battery-jumpstart'
  | 'tyre-puncture'
  | 'fuel-assistance'
  | 'towing-service'
  | 'lockout-assistance'
  | 'other-assistance';

export interface ServiceCategory {
  id: ServiceCategoryType;
  name: string;
  shortDesc: string;
  icon: string;
  basePrice: number;
  estimatedTimeMin: number;
  popularIssues: string[];
  vehicleTypes: ('car' | 'bike' | 'scooter' | 'commercial')[];
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  avatarUrl?: string;
  authProvider?: 'google' | 'phone' | 'email';
  status: 'active' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  customerId: string;
  vehicleType: 'car' | 'bike' | 'scooter' | 'commercial';
  registrationNumber: string;
  brand: string;
  model: string;
  fuelType: 'Petrol' | 'Diesel' | 'EV' | 'CNG' | 'Hybrid';
  year: number;
  color?: string;
  imageUrl?: string;
  isDefault?: boolean;
}

export interface ProviderDocument {
  id: string;
  providerId: string;
  docType: 'aadhaar' | 'driving_license' | 'pan' | 'garage_registration' | 'police_clearance';
  docNumber: string;
  documentUrl: string;
  verified: boolean;
  uploadedAt: string;
}

export interface ServiceProvider {
  id: string;
  userId: string;
  fullName: string;
  businessName: string;
  phone: string;
  email: string;
  avatarUrl?: string;
  serviceCategories: ServiceCategoryType[];
  businessAddress: string;
  serviceAreas: string[];
  workingHours: string;
  yearsOfExperience: number;
  pricingMethod: 'standard_rate' | 'custom_quote' | 'fixed_per_km';
  verificationStatus: ProviderVerificationStatus;
  rejectionReason?: string;
  isOnline: boolean;
  isAvailable: boolean; // false if currently on a job
  currentLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  rating: number;
  reviewCount: number;
  totalJobsCompleted: number;
  bankDetails: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    upiId?: string;
  };
  documents: ProviderDocument[];
  createdAt: string;
  updatedAt: string;
}

export interface AssistanceRequest {
  id: string; // RS-YYYYMMDD-XXXX
  customerId: string;
  customerName: string;
  customerPhone: string;
  isBookingForOther?: boolean;
  beneficiaryDetails?: {
    name: string;
    phone: string;
    relationship?: string;
  };
  serviceCategoryId: ServiceCategoryType;
  serviceCategoryName: string;
  vehicleId: string;
  vehicleDetails: {
    registrationNumber: string;
    brand: string;
    model: string;
    vehicleType: string;
    fuelType: string;
  };
  problemType: string;
  problemDescription: string;
  problemPhotos: string[];
  location: {
    lat: number;
    lng: number;
    address: string;
    landmark?: string;
  };
  status: RequestStatus;
  statusHistory: BookingStatusHistoryItem[];
  
  // Assigned Provider
  assignedProviderId?: string;
  providerName?: string;
  providerPhone?: string;
  providerBusinessName?: string;
  providerRating?: number;
  providerLocation?: {
    lat: number;
    lng: number;
  };

  // Dispatch / Matching info
  dispatchedProviderIds: string[];
  currentOfferedProviderId?: string;
  offeredAt?: string;
  providerResponseTimeoutSeconds: number;

  // Price & ETA
  estimatedPrice: number;
  finalPrice?: number;
  platformCommission?: number;
  providerEarnings?: number;
  estimatedArrivalMinutes?: number;
  confirmedEtaMinutes?: number;
  
  // Payment
  paymentId?: string;
  paymentStatus: 'pending' | 'completed' | 'refunded' | 'failed';
  paymentMethod?: 'UPI' | 'Card' | 'NetBanking' | 'Cash';
  
  // Cancellation
  cancellationReason?: string;
  cancelledBy?: 'customer' | 'provider' | 'admin';
  cancelledAt?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface BookingStatusHistoryItem {
  status: RequestStatus;
  timestamp: string;
  note: string;
  updatedBy: string; // 'system' | 'provider' | 'customer' | 'admin'
}

export interface PaymentRecord {
  id: string;
  bookingId: string;
  customerId: string;
  providerId: string;
  grossAmount: number;
  platformCommission: number;
  providerPayout: number;
  taxAmount: number; // GST 18%
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentGateway: 'Razorpay' | 'UPI_Direct' | 'Cash';
  gatewayTransactionId: string;
  paymentMethod: string;
  paidAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  providerId: string;
  rating: number; // 1 to 5
  feedback: string;
  createdAt: string;
}

export interface Complaint {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  providerId?: string;
  providerName?: string;
  category: 'delayed_service' | 'overcharging' | 'poor_quality' | 'unprofessional_behavior' | 'other';
  description: string;
  status: 'open' | 'under_investigation' | 'resolved' | 'dismissed';
  resolutionNote?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface AppNotification {
  id: string;
  recipientId: string;
  recipientRole: UserRole;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'approval' | 'emergency' | 'system';
  referenceId?: string; // e.g. bookingId
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  targetId?: string;
  targetType?: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface AppSettings {
  id: string;
  platformCommissionPercent: number; // e.g. 15%
  gstPercent: number; // 18%
  providerResponseTimeoutSeconds: number; // e.g. 45
  emergencyPhoneNumbers: {
    nationalEmergency: string; // 112 (Assam ERSS)
    police: string;            // 100 / 0361-2464557 (Guwahati City Police)
    ambulance: string;         // 108 (Mrityunjoy Assam)
    fire: string;              // 101 / 0361-2540222 (Assam Fire & Emergency)
    highwayHelpline: string;   // 1033 (NH-27 Guwahati Bypass)
    trafficHelpline: string;   // 0361-2730989 (Guwahati Traffic Police)
    disasterHelpline: string;  // 1077 (Kamrup Metro DDMA)
    womenHelpline: string;     // 181 (Assam Women Helpline)
  };
  supportPhone: string;
  supportEmail: string;
  razorpayTestKeyId: string;
  googleMapsApiKey: string;
  isDemoMode: boolean;
  region: string;
}
