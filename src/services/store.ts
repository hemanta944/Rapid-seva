import {
  User,
  ServiceProvider,
  Vehicle,
  AssistanceRequest,
  ServiceCategory,
  PaymentRecord,
  Review,
  Complaint,
  AppNotification,
  AuditLog,
  AppSettings,
  RequestStatus,
  ProviderVerificationStatus,
  UserRole
} from '../types';

// Default Service Categories per Master Prompt
export const INITIAL_CATEGORIES: ServiceCategory[] = [
  {
    id: 'car-repair',
    name: 'Car Repair & Breakdown',
    shortDesc: 'Engine stalling, clutch failure, brake issues, strange noise & overheating diagnostics.',
    icon: 'Wrench',
    basePrice: 599,
    estimatedTimeMin: 25,
    popularIssues: ['Engine won\'t start', 'Brake failure / squealing', 'Clutch wire snapped', 'Engine overheating', 'Gear stuck', 'Radiator coolant leak'],
    vehicleTypes: ['car', 'commercial']
  },
  {
    id: 'bike-repair',
    name: 'Bike & Two-Wheeler Repair',
    shortDesc: 'Spark plug, chain slip, cable snap, engine stalling & electrical fixes on-site.',
    icon: 'Bike',
    basePrice: 349,
    estimatedTimeMin: 20,
    popularIssues: ['Bike engine not starting', 'Drive chain loose / snapped', 'Clutch / accelerator cable snap', 'Brake issue', 'Spark plug fouled'],
    vehicleTypes: ['bike', 'scooter']
  },
  {
    id: 'battery-jumpstart',
    name: 'Battery Jump Start',
    shortDesc: 'Heavy-duty jumper cables & portable lithium jump-packs for instant vehicle start.',
    icon: 'Zap',
    basePrice: 399,
    estimatedTimeMin: 20,
    popularIssues: ['Dead battery / clicking noise', 'Headlights left on', 'Weak starter crank', 'Alternator charging issue'],
    vehicleTypes: ['car', 'bike', 'scooter', 'commercial']
  },
  {
    id: 'tyre-puncture',
    name: 'Tyre / Puncture Change',
    shortDesc: 'Tubeless tyre puncture repair or spare wheel stepney replacement at your breakdown spot.',
    icon: 'Disc',
    basePrice: 299,
    estimatedTimeMin: 18,
    popularIssues: ['Flat tyre puncture repair', 'Spare tyre replacement (stepney)', 'Low tyre air pressure', 'Tyre rim / sidewall damage'],
    vehicleTypes: ['car', 'bike', 'scooter', 'commercial']
  },
  {
    id: 'fuel-assistance',
    name: 'Fuel Assistance',
    shortDesc: 'Emergency delivery of 3 to 5 Litres of Petrol or Diesel directly to your stranded location.',
    icon: 'Fuel',
    basePrice: 449,
    estimatedTimeMin: 25,
    popularIssues: ['Ran out of Petrol', 'Ran out of Diesel', 'Wrong fuel filled in tank'],
    vehicleTypes: ['car', 'bike', 'scooter', 'commercial']
  },
  {
    id: 'towing-service',
    name: 'Towing Service',
    shortDesc: 'Flatbed & hydraulic wheel-lift tow trucks for accident recovery or mechanical breakdown.',
    icon: 'Truck',
    basePrice: 1299,
    estimatedTimeMin: 30,
    popularIssues: ['Major engine seizure', 'Accidental damage recovery', 'Transmission lock', 'Long distance garage towing'],
    vehicleTypes: ['car', 'bike', 'commercial']
  },
  {
    id: 'lockout-assistance',
    name: 'Key Lockout Assistance',
    shortDesc: 'Non-destructive vehicle door unlocking when keys are locked inside or lost.',
    icon: 'Key',
    basePrice: 499,
    estimatedTimeMin: 25,
    popularIssues: ['Keys locked inside cabin', 'Boot / trunk locked with key inside', 'Broken key stuck in lock cylinder'],
    vehicleTypes: ['car', 'commercial']
  },
  {
    id: 'other-assistance',
    name: 'Other Roadside Assistance',
    shortDesc: 'Minor electrical inspection, fuse change, fluid top-up or custom on-spot help.',
    icon: 'HelpCircle',
    basePrice: 399,
    estimatedTimeMin: 25,
    popularIssues: ['Blown fuse / light failure', 'Power steering failure', 'AC cut-off with smoke smell', 'Unidentified rattling underbody'],
    vehicleTypes: ['car', 'bike', 'scooter', 'commercial']
  }
];

// Initial App Settings for Guwahati, Assam
export const INITIAL_SETTINGS: AppSettings = {
  id: 'settings_main',
  platformCommissionPercent: 15, // 15% platform fee
  gstPercent: 18,
  providerResponseTimeoutSeconds: 45,
  emergencyPhoneNumbers: {
    nationalEmergency: '112', // Assam State ERSS (All-in-One Helpline)
    police: '0361-2464557',   // Guwahati City Police Control Room (or 100)
    ambulance: '108',         // Mrityunjoy Emergency Medical Ambulance (Assam)
    fire: '0361-2540222',     // Assam State Fire & Emergency Service Panbazar (or 101)
    highwayHelpline: '1033',  // NHAI NH-27 Guwahati Bypass Emergency Help
    trafficHelpline: '0361-2730989', // Guwahati City Traffic Police Control (+91 69012 69012)
    disasterHelpline: '1077', // Kamrup Metropolitan District Disaster Management Authority
    womenHelpline: '181',     // Assam State Women Helpline
  },
  supportPhone: '+91 1800-RAPID-SEVA',
  supportEmail: 'guwahati.support@rapidseva.com',
  razorpayTestKeyId: 'rzp_test_RS2026RapidSevaKey',
  googleMapsApiKey: '',
  isDemoMode: true,
  region: 'Guwahati, Assam',
};

// Initial Seed Users for Guwahati Region
export const INITIAL_USERS: User[] = [
  {
    id: 'user_cust_bikash',
    name: 'Bikash Baruah',
    phone: '+91 94350 43210',
    email: 'bikash.baruah.ghy@gmail.com',
    role: 'customer',
    authProvider: 'google',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-11-15T14:20:00Z',
  },
  {
    id: 'user_prov_bipul',
    name: 'Bipul Saikia',
    phone: '+91 94351 22334',
    email: 'bipul.brahmaputra@example.com',
    role: 'provider',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: '2026-01-15T09:30:00Z',
    updatedAt: '2026-11-18T16:00:00Z',
  },
  {
    id: 'user_prov_pranjal',
    name: 'Pranjal Barman',
    phone: '+91 98642 33445',
    email: 'pranjal.kamakhya@example.com',
    role: 'provider',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: '2026-02-01T11:00:00Z',
    updatedAt: '2026-11-18T10:00:00Z',
  },
  {
    id: 'user_prov_debojit',
    name: 'Debojit Kalita',
    phone: '+91 97065 55667',
    email: 'debojit.assamvalley@example.com',
    role: 'provider',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: '2026-11-17T08:00:00Z',
    updatedAt: '2026-11-17T08:00:00Z',
  },
  {
    id: 'user_admin_super',
    name: 'Super Administrator (Guwahati Hub)',
    phone: '+91 99999 88888',
    email: 'admin.ghy@rapidseva.com',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-11-19T00:00:00Z',
  }
];

// Initial Vehicles for Customer Bikash (Assam RTO - Kamrup Metro AS-01)
export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh_creta_01',
    customerId: 'user_cust_bikash',
    vehicleType: 'car',
    registrationNumber: 'AS 01 EK 1234',
    brand: 'Hyundai',
    model: 'Creta SX (O)',
    fuelType: 'Petrol',
    year: 2023,
    color: 'Polar White',
    isDefault: true,
  },
  {
    id: 'veh_bullet_02',
    customerId: 'user_cust_bikash',
    vehicleType: 'bike',
    registrationNumber: 'AS 01 FD 5678',
    brand: 'Royal Enfield',
    model: 'Classic 350',
    fuelType: 'Petrol',
    year: 2022,
    color: 'Stealth Black',
    isDefault: false,
  }
];

// Initial Providers in Guwahati & Kamrup Metro
export const INITIAL_PROVIDERS: ServiceProvider[] = [
  {
    id: 'prov_brahmaputra_auto',
    userId: 'user_prov_bipul',
    fullName: 'Bipul Saikia',
    businessName: 'Brahmaputra Auto Works & Roadside Assistance',
    phone: '+91 94351 22334',
    email: 'bipul.brahmaputra@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    serviceCategories: ['car-repair', 'battery-jumpstart', 'fuel-assistance', 'lockout-assistance', 'other-assistance'],
    businessAddress: 'Building 24, GS Road, Christian Basti, Guwahati, Assam 781005',
    serviceAreas: ['GS Road', 'Dispur', 'Ganeshguri', 'Christian Basti', 'Bhangagarh', 'Khanapara', 'Beltola', 'Six Mile'],
    workingHours: '24/7 Roadside Emergency',
    yearsOfExperience: 11,
    pricingMethod: 'standard_rate',
    verificationStatus: 'approved',
    isOnline: true,
    isAvailable: true,
    currentLocation: {
      lat: 26.1558,
      lng: 91.7766,
      address: 'GS Road, Near Christian Basti, Guwahati'
    },
    rating: 4.9,
    reviewCount: 58,
    totalJobsCompleted: 142,
    bankDetails: {
      accountHolderName: 'Brahmaputra Auto Works',
      accountNumber: '310492817291',
      ifscCode: 'SBIN0003030',
      bankName: 'State Bank of India (Dispur Branch)',
      upiId: 'brahmaputra.auto@oksbi'
    },
    documents: [
      {
        id: 'doc_bipul_01',
        providerId: 'prov_brahmaputra_auto',
        docType: 'garage_registration',
        docNumber: 'AS-GHY-COMM-2018-8839',
        documentUrl: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=600&auto=format&fit=crop&q=80',
        verified: true,
        uploadedAt: '2026-01-15T09:40:00Z'
      },
      {
        id: 'doc_bipul_02',
        providerId: 'prov_brahmaputra_auto',
        docType: 'driving_license',
        docNumber: 'AS0120120098421',
        documentUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
        verified: true,
        uploadedAt: '2026-01-15T09:45:00Z'
      }
    ],
    createdAt: '2026-01-15T09:30:00Z',
    updatedAt: '2026-11-18T16:00:00Z'
  },
  {
    id: 'prov_kamakhya_tyre',
    userId: 'user_prov_pranjal',
    fullName: 'Pranjal Barman',
    businessName: 'Kamakhya Quick Tyre & Recovery Services',
    phone: '+91 98642 33445',
    email: 'pranjal.kamakhya@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    serviceCategories: ['tyre-puncture', 'battery-jumpstart', 'bike-repair', 'towing-service'],
    businessAddress: 'Plot 8, Jalukbari Chariali, Near Gauhati University Gate, Guwahati 781014',
    serviceAreas: ['Jalukbari', 'Maligaon', 'Bharalumukh', 'Pandu', 'NH-27 Guwahati Bypass', 'Saraighat Bridge'],
    workingHours: '06:00 AM - 11:30 PM',
    yearsOfExperience: 8,
    pricingMethod: 'standard_rate',
    verificationStatus: 'approved',
    isOnline: true,
    isAvailable: true,
    currentLocation: {
      lat: 26.1448,
      lng: 91.6631,
      address: 'Jalukbari Chariali Point, Guwahati'
    },
    rating: 4.8,
    reviewCount: 46,
    totalJobsCompleted: 98,
    bankDetails: {
      accountHolderName: 'Pranjal Barman',
      accountNumber: '409182736451',
      ifscCode: 'HDFC0001824',
      bankName: 'HDFC Bank (Maligaon Branch)',
      upiId: 'kamakhyatyres@okhdfcbank'
    },
    documents: [
      {
        id: 'doc_pranjal_01',
        providerId: 'prov_kamakhya_tyre',
        docType: 'aadhaar',
        docNumber: 'XXXX-XXXX-9842',
        documentUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
        verified: true,
        uploadedAt: '2026-02-01T11:15:00Z'
      }
    ],
    createdAt: '2026-02-01T11:00:00Z',
    updatedAt: '2026-11-18T10:00:00Z'
  },
  {
    id: 'prov_saraighat_towing',
    userId: 'user_prov_nabajit',
    fullName: 'Nabajit Das',
    businessName: 'Saraighat Highway Heavy Towing & Crane Help',
    phone: '+91 99543 44556',
    email: 'nabajit.saraighat@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    serviceCategories: ['towing-service', 'car-repair', 'fuel-assistance'],
    businessAddress: 'NH-27 Bypass, Lokhra Chariali, Guwahati 781034',
    serviceAreas: ['NH-27 Bypass', 'Lokhra', 'Gorchuk', 'ISBT Betkuchi', 'Khanapara', 'Boragaon', 'Sonapur'],
    workingHours: '24/7 Highway Recovery',
    yearsOfExperience: 12,
    pricingMethod: 'standard_rate',
    verificationStatus: 'approved',
    isOnline: true,
    isAvailable: true,
    currentLocation: {
      lat: 26.1189,
      lng: 91.7345,
      address: 'Lokhra Chariali, NH-27 Guwahati'
    },
    rating: 4.9,
    reviewCount: 72,
    totalJobsCompleted: 160,
    bankDetails: {
      accountHolderName: 'Saraighat Crane Services',
      accountNumber: '920194857201',
      ifscCode: 'ICIC0001042',
      bankName: 'ICICI Bank (Lokhra Branch)',
      upiId: 'saraighattow@okicici'
    },
    documents: [
      {
        id: 'doc_nabajit_01',
        providerId: 'prov_saraighat_towing',
        docType: 'garage_registration',
        docNumber: 'AS-KAM-CRANE-2016-102',
        documentUrl: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=600&auto=format&fit=crop&q=80',
        verified: true,
        uploadedAt: '2026-01-10T08:00:00Z'
      }
    ],
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-11-18T12:00:00Z'
  },
  {
    id: 'prov_assam_valley',
    userId: 'user_prov_debojit',
    fullName: 'Debojit Kalita',
    businessName: 'Assam Valley Multi-Brand Workshop & Garage',
    phone: '+91 97065 55667',
    email: 'debojit.assamvalley@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    serviceCategories: ['car-repair', 'towing-service', 'battery-jumpstart'],
    businessAddress: 'RG Baruah Road, Near Zoo Road Tiniali, Guwahati 781024',
    serviceAreas: ['Zoo Road', 'Chandmari', 'Geetanagar', 'Narengi', 'Uzan Bazaar'],
    workingHours: '08:00 AM - 10:00 PM',
    yearsOfExperience: 5,
    pricingMethod: 'standard_rate',
    verificationStatus: 'pending', // Pending verification for Super Admin
    isOnline: false,
    isAvailable: false,
    currentLocation: {
      lat: 26.1685,
      lng: 91.7820,
      address: 'Zoo Road Tiniali, Guwahati'
    },
    rating: 0,
    reviewCount: 0,
    totalJobsCompleted: 0,
    bankDetails: {
      accountHolderName: 'Debojit Kalita',
      accountNumber: '320194857201',
      ifscCode: 'PUNB0024500',
      bankName: 'Punjab National Bank (Zoo Road)',
      upiId: 'debojitkalita@okpnb'
    },
    documents: [
      {
        id: 'doc_debojit_01',
        providerId: 'prov_assam_valley',
        docType: 'garage_registration',
        docNumber: 'AS-GHY-COMM-2024-912',
        documentUrl: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=600&auto=format&fit=crop&q=80',
        verified: false,
        uploadedAt: '2026-11-17T08:15:00Z'
      },
      {
        id: 'doc_debojit_02',
        providerId: 'prov_assam_valley',
        docType: 'pan',
        docNumber: 'ABCDE1234F',
        documentUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
        verified: false,
        uploadedAt: '2026-11-17T08:20:00Z'
      }
    ],
    createdAt: '2026-11-17T08:00:00Z',
    updatedAt: '2026-11-17T08:00:00Z'
  }
];

// Seed Historical Assistance Requests for Guwahati
export const INITIAL_REQUESTS: AssistanceRequest[] = [
  {
    id: 'RS-20261118-7401',
    customerId: 'user_cust_bikash',
    customerName: 'Bikash Baruah',
    customerPhone: '+91 94350 43210',
    serviceCategoryId: 'battery-jumpstart',
    serviceCategoryName: 'Battery Jump Start',
    vehicleId: 'veh_creta_01',
    vehicleDetails: {
      registrationNumber: 'AS 01 EK 1234',
      brand: 'Hyundai',
      model: 'Creta SX (O)',
      vehicleType: 'car',
      fuelType: 'Petrol',
    },
    problemType: 'Dead battery / clicking noise',
    problemDescription: 'Car parked near Dispur Super Market for 4 days. Battery drained, starter only clicking.',
    problemPhotos: ['https://images.unsplash.com/photo-1588614959060-4d144f28b207?w=600&auto=format&fit=crop&q=80'],
    location: {
      lat: 26.1408,
      lng: 91.7907,
      address: 'GS Road, Dispur, Guwahati, Assam',
      landmark: 'Near Assam Secretariat & Super Market'
    },
    status: 'PAYMENT_COMPLETED',
    statusHistory: [
      { status: 'REQUEST_RECEIVED', timestamp: '2026-11-18T10:15:00Z', note: 'Customer submitted jumpstart request at Dispur.', updatedBy: 'customer' },
      { status: 'PROVIDER_NOTIFIED', timestamp: '2026-11-18T10:15:10Z', note: 'Dispatched to Brahmaputra Auto Works (Christian Basti).', updatedBy: 'system' },
      { status: 'PROVIDER_ACCEPTED', timestamp: '2026-11-18T10:16:30Z', note: 'Bipul Saikia accepted with 15m ETA.', updatedBy: 'provider' },
      { status: 'PROVIDER_ON_THE_WAY', timestamp: '2026-11-18T10:18:00Z', note: 'Technician dispatched along GS Road with heavy-duty jump booster pack.', updatedBy: 'provider' },
      { status: 'PROVIDER_ARRIVED', timestamp: '2026-11-18T10:31:00Z', note: 'Technician reached parking spot near Secretariat.', updatedBy: 'provider' },
      { status: 'WORK_IN_PROGRESS', timestamp: '2026-11-18T10:33:00Z', note: 'Checking terminal voltage and jumpstarting engine.', updatedBy: 'provider' },
      { status: 'SERVICE_COMPLETED', timestamp: '2026-11-18T10:46:00Z', note: 'Engine started successfully. Alternator output confirmed.', updatedBy: 'provider' },
      { status: 'PAYMENT_PENDING', timestamp: '2026-11-18T10:47:00Z', note: 'Invoice ₹399 generated.', updatedBy: 'system' },
      { status: 'PAYMENT_COMPLETED', timestamp: '2026-11-18T10:50:30Z', note: 'Payment of ₹399 received via Razorpay UPI.', updatedBy: 'customer' }
    ],
    assignedProviderId: 'prov_brahmaputra_auto',
    providerName: 'Bipul Saikia',
    providerPhone: '+91 94351 22334',
    providerBusinessName: 'Brahmaputra Auto Works',
    providerRating: 4.9,
    dispatchedProviderIds: ['prov_brahmaputra_auto'],
    estimatedPrice: 399,
    finalPrice: 399,
    platformCommission: 59.85, // 15%
    providerEarnings: 339.15,
    estimatedArrivalMinutes: 15,
    confirmedEtaMinutes: 14,
    paymentId: 'pay_rzp_mock_ghy_01',
    paymentStatus: 'completed',
    paymentMethod: 'UPI',
    createdAt: '2026-11-18T10:15:00Z',
    updatedAt: '2026-11-18T10:50:30Z',
    completedAt: '2026-11-18T10:50:30Z',
    providerResponseTimeoutSeconds: 45
  }
];

// Initial Payment Records
export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay_rzp_mock_ghy_01',
    bookingId: 'RS-20261118-7401',
    customerId: 'user_cust_bikash',
    providerId: 'prov_brahmaputra_auto',
    grossAmount: 399,
    platformCommission: 59.85,
    providerPayout: 339.15,
    taxAmount: 60.86,
    currency: 'INR',
    status: 'completed',
    paymentGateway: 'Razorpay',
    gatewayTransactionId: 'pay_rzp_ghy_982461',
    paymentMethod: 'UPI (GPay / bikash@oksbi)',
    paidAt: '2026-11-18T10:50:30Z'
  }
];
// Initial Reviews for Guwahati
export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev_01',
    bookingId: 'RS-20261118-7401',
    customerId: 'user_cust_bikash',
    customerName: 'Bikash Baruah',
    providerId: 'prov_brahmaputra_auto',
    rating: 5,
    feedback: 'Bipul arrived at Dispur Secretariat in under 15 minutes with a heavy-duty booster pack. Super fast and reliable roadside rescue in Guwahati traffic!',
    createdAt: '2026-11-18T11:00:00Z'
  }
];

// Initial Complaints for Admin
export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'comp_01',
    bookingId: 'RS-20261115-3209',
    customerId: 'user_cust_bikash',
    customerName: 'Bikash Baruah',
    customerPhone: '+91 94350 43210',
    providerId: 'prov_kamakhya_tyre',
    providerName: 'Pranjal Barman',
    category: 'delayed_service',
    description: 'Technician delayed by 25 mins reaching Jalukbari flyover due to heavy truck congestion on NH-27 bypass.',
    status: 'resolved',
    resolutionNote: 'Customer contacted, offered ₹100 RapidSeva wallet credit. Traffic contingency protocols briefed to provider.',
    createdAt: '2026-11-15T18:00:00Z',
    resolvedAt: '2026-11-16T11:30:00Z'
  }
];

// Initial Notifications
export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_01',
    recipientId: 'user_cust_bikash',
    recipientRole: 'customer',
    title: 'Payment Confirmed — ₹399',
    message: 'Your payment for Battery Jump Start at Dispur (RS-20261118-7401) was successful. Thank you for using RapidSeva Guwahati!',
    type: 'payment',
    referenceId: 'RS-20261118-7401',
    isRead: false,
    createdAt: '2026-11-18T10:51:35Z'
  },
  {
    id: 'notif_02',
    recipientId: 'user_prov_bipul',
    recipientRole: 'provider',
    title: 'Payout Settlement Credited',
    message: '₹339.15 for Job RS-20261118-7401 has been settled to your SBI Dispur Account.',
    type: 'payment',
    referenceId: 'RS-20261118-7401',
    isRead: true,
    createdAt: '2026-11-18T11:00:00Z'
  },
  {
    id: 'notif_03',
    recipientId: 'user_admin_super',
    recipientRole: 'admin',
    title: 'New Provider Registration Pending Review',
    message: 'Debojit Kalita (Assam Valley Motors, Zoo Road) submitted business registration & documents for verification.',
    type: 'approval',
    referenceId: 'prov_assam_valley',
    isRead: false,
    createdAt: '2026-11-17T08:25:00Z'
  }
];

// Initial Audit Logs
export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit_01',
    action: 'PROVIDER_APPROVED',
    actorId: 'user_admin_super',
    actorName: 'Super Administrator',
    actorRole: 'admin',
    targetId: 'prov_brahmaputra_auto',
    targetType: 'provider',
    details: 'Verified garage registration AS-GHY-COMM-2018-8839 and driving license. Approved for active service in GS Road / Dispur.',
    timestamp: '2026-01-15T10:00:00Z'
  },
  {
    id: 'audit_02',
    action: 'SETTINGS_UPDATED',
    actorId: 'user_admin_super',
    actorName: 'Super Administrator',
    actorRole: 'admin',
    details: 'Configured Guwahati, Assam regional hub with Assam ERSS 112 and Mrityunjoy 108 emergency integrations.',
    timestamp: '2026-01-01T01:00:00Z'
  }
];

// Persistent Reactive State Store Implementation (Guwahati Region)
const STORAGE_PREFIX = 'rapidseva_ghy_v1_';

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

// Pub/Sub Event System for cross-component re-renders
type Listener = () => void;
const listeners: Set<Listener> = new Set();

function emitChange() {
  listeners.forEach((l) => l());
}

export function subscribeToStore(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Store Singleton State
class RapidSevaStore {
  private categories: ServiceCategory[];
  private settings: AppSettings;
  private users: User[];
  private vehicles: Vehicle[];
  private providers: ServiceProvider[];
  private requests: AssistanceRequest[];
  private payments: PaymentRecord[];
  private reviews: Review[];
  private complaints: Complaint[];
  private notifications: AppNotification[];
  private auditLogs: AuditLog[];
  
  // Auth state
  private activeUser: User | null;
  private activePortal: UserRole;

  constructor() {
    this.categories = loadFromStorage('categories', INITIAL_CATEGORIES);
    this.settings = loadFromStorage('settings', INITIAL_SETTINGS);
    this.users = loadFromStorage('users', INITIAL_USERS);
    this.vehicles = loadFromStorage('vehicles', INITIAL_VEHICLES);
    this.providers = loadFromStorage('providers', INITIAL_PROVIDERS);
    this.requests = loadFromStorage('requests', INITIAL_REQUESTS);
    this.payments = loadFromStorage('payments', INITIAL_PAYMENTS);
    this.reviews = loadFromStorage('reviews', INITIAL_REVIEWS);
    this.complaints = loadFromStorage('complaints', INITIAL_COMPLAINTS);
    this.notifications = loadFromStorage('notifications', INITIAL_NOTIFICATIONS);
    this.auditLogs = loadFromStorage('auditLogs', INITIAL_AUDIT_LOGS);

    // Initial portal: customer, initial active user: Rajesh Kumar
    const savedPortal = loadFromStorage<UserRole>('activePortal', 'customer');
    this.activePortal = savedPortal;
    this.activeUser = this.getUserForRole(savedPortal);
  }

  private getUserForRole(role: UserRole): User {
    if (role === 'customer') {
      return this.users.find(u => u.id === 'user_cust_bikash') || this.users.find(u => u.id === 'user_cust_rajesh') || this.users[0];
    } else if (role === 'provider') {
      return this.users.find(u => u.id === 'user_prov_bipul') || this.users.find(u => u.id === 'user_prov_amit') || this.users[1];
    } else {
      return this.users.find(u => u.id === 'user_admin_super') || this.users[4];
    }
  }

  // --- Getters ---
  getCategories(): ServiceCategory[] { return [...this.categories]; }
  getSettings(): AppSettings { return { ...this.settings }; }
  getUsers(): User[] { return [...this.users]; }
  getVehicles(customerId?: string): Vehicle[] {
    if (customerId) return this.vehicles.filter(v => v.customerId === customerId);
    return [...this.vehicles];
  }
  getProviders(): ServiceProvider[] { return [...this.providers]; }
  getApprovedProviders(): ServiceProvider[] {
    return this.providers.filter(p => p.verificationStatus === 'approved');
  }
  getPendingProviders(): ServiceProvider[] {
    return this.providers.filter(p => p.verificationStatus === 'pending');
  }
  getRequests(): AssistanceRequest[] { return [...this.requests]; }
  getPayments(): PaymentRecord[] { return [...this.payments]; }
  getReviews(providerId?: string): Review[] {
    if (providerId) return this.reviews.filter(r => r.providerId === providerId);
    return [...this.reviews];
  }
  getComplaints(): Complaint[] { return [...this.complaints]; }
  getNotifications(recipientId?: string): AppNotification[] {
    if (recipientId) return this.notifications.filter(n => n.recipientId === recipientId);
    return [...this.notifications];
  }
  getAuditLogs(): AuditLog[] { return [...this.auditLogs]; }
  getActiveUser(): User | null { return this.activeUser ? { ...this.activeUser } : null; }
  getActivePortal(): UserRole { return this.activePortal; }

  // --- Portal & Auth actions ---
  switchPortal(role: UserRole) {
    this.activePortal = role;
    this.activeUser = this.getUserForRole(role);
    saveToStorage('activePortal', role);
    emitChange();
  }

  setActiveUser(user: User | null) {
    this.activeUser = user;
    if (user) {
      this.activePortal = user.role;
      saveToStorage('activePortal', user.role);
    }
    emitChange();
  }

  loginAsDemo(role: UserRole) {
    const user = this.getUserForRole(role);
    this.setActiveUser(user);
    this.addAuditLog('DEMO_LOGIN', `Logged in via Demo quick-access as ${user.name} (${role})`, user);
  }

  loginWithGoogle(email: string = 'bikash.baruah.ghy@gmail.com', name: string = 'Bikash Baruah', role: UserRole = 'customer'): User {
    let user = this.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
    if (!user) {
      user = {
        id: 'user_g_' + Date.now().toString(36),
        name,
        email,
        phone: '+91 94350 43210',
        role,
        authProvider: 'google',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.users.push(user);
      saveToStorage('users', this.users);
    } else {
      user = { ...user, authProvider: 'google', role };
    }

    this.setActiveUser(user);
    saveToStorage('has_authenticated_google', 'true');
    this.addAuditLog('USER_AUTHENTICATED_GOOGLE', `Signed in via Gmail / Google Account (${email})`, user);
    emitChange();
    return user;
  }

  logout() {
    this.activeUser = null;
    emitChange();
  }

  // --- Customer Vehicle Management ---
  addVehicle(vehicleData: Omit<Vehicle, 'id'>): Vehicle {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: 'veh_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
    };
    if (newVehicle.isDefault) {
      this.vehicles = this.vehicles.map(v => v.customerId === newVehicle.customerId ? { ...v, isDefault: false } : v);
    }
    this.vehicles.push(newVehicle);
    saveToStorage('vehicles', this.vehicles);
    emitChange();
    return newVehicle;
  }

  deleteVehicle(vehicleId: string) {
    this.vehicles = this.vehicles.filter(v => v.id !== vehicleId);
    saveToStorage('vehicles', this.vehicles);
    emitChange();
  }

  // --- Booking & Request Lifecycle ---
  createAssistanceRequest(data: Omit<AssistanceRequest, 'id' | 'status' | 'statusHistory' | 'createdAt' | 'updatedAt' | 'dispatchedProviderIds' | 'providerResponseTimeoutSeconds'>): AssistanceRequest {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomHex = Math.floor(1000 + Math.random() * 9000).toString();
    const newId = `RS-${dateStr}-${randomHex}`;

    const newRequest: AssistanceRequest = {
      ...data,
      id: newId,
      status: 'REQUEST_RECEIVED',
      statusHistory: [
        {
          status: 'REQUEST_RECEIVED',
          timestamp: new Date().toISOString(),
          note: 'Assistance request initiated by customer.',
          updatedBy: 'customer',
        }
      ],
      dispatchedProviderIds: [],
      providerResponseTimeoutSeconds: this.settings.providerResponseTimeoutSeconds,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.requests.unshift(newRequest);
    saveToStorage('requests', this.requests);

    // Notify Admins
    this.addNotification({
      recipientId: 'user_admin_super',
      recipientRole: 'admin',
      title: `New Assistance Request: ${newRequest.id}`,
      message: `${newRequest.customerName} requested ${newRequest.serviceCategoryName} at ${newRequest.location.address}`,
      type: 'booking',
      referenceId: newRequest.id
    });

    emitChange();
    return newRequest;
  }

  updateRequestStatus(
    requestId: string,
    newStatus: RequestStatus,
    note: string,
    updatedBy: 'system' | 'provider' | 'customer' | 'admin',
    extraUpdates?: Partial<AssistanceRequest>
  ) {
    const req = this.requests.find(r => r.id === requestId);
    if (!req) return;

    req.status = newStatus;
    req.updatedAt = new Date().toISOString();
    if (newStatus === 'SERVICE_COMPLETED' || newStatus === 'PAYMENT_COMPLETED') {
      req.completedAt = new Date().toISOString();
    }

    req.statusHistory.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      note,
      updatedBy,
    });

    if (extraUpdates) {
      Object.assign(req, extraUpdates);
    }

    saveToStorage('requests', this.requests);

    // Send notifications according to workflow step
    if (newStatus === 'PROVIDER_ACCEPTED') {
      this.addNotification({
        recipientId: req.customerId,
        recipientRole: 'customer',
        title: 'Provider Accepted Your Request!',
        message: `${req.providerName || 'Provider'} has accepted and confirmed arrival within ~${req.confirmedEtaMinutes || 20} minutes.`,
        type: 'booking',
        referenceId: req.id
      });
    } else if (newStatus === 'PROVIDER_ON_THE_WAY') {
      this.addNotification({
        recipientId: req.customerId,
        recipientRole: 'customer',
        title: 'Provider Dispatched & On The Way',
        message: `${req.providerName} is en route to your vehicle breakdown location.`,
        type: 'booking',
        referenceId: req.id
      });
    } else if (newStatus === 'PROVIDER_ARRIVED') {
      this.addNotification({
        recipientId: req.customerId,
        recipientRole: 'customer',
        title: 'Provider Arrived at Spot',
        message: `${req.providerName} has arrived at your breakdown location.`,
        type: 'booking',
        referenceId: req.id
      });
    } else if (newStatus === 'SERVICE_COMPLETED') {
      this.addNotification({
        recipientId: req.customerId,
        recipientRole: 'customer',
        title: 'Service Completed — Ready for Payment',
        message: `Work finished on your vehicle. Total amount: ₹${req.finalPrice || req.estimatedPrice}.`,
        type: 'payment',
        referenceId: req.id
      });
    } else if (newStatus === 'CANCELLED') {
      this.addNotification({
        recipientId: req.customerId,
        recipientRole: 'customer',
        title: 'Booking Cancelled',
        message: note,
        type: 'booking',
        referenceId: req.id
      });
    }

    this.addAuditLog(
      'STATUS_CHANGE',
      `Booking ${requestId} status updated to ${newStatus} by ${updatedBy}. Note: ${note}`,
      this.activeUser || { id: updatedBy, name: updatedBy, role: updatedBy as UserRole }
    );

    emitChange();
  }

  cancelRequest(requestId: string, reason: string, cancelledBy: 'customer' | 'provider' | 'admin') {
    this.updateRequestStatus(requestId, 'CANCELLED', `Cancelled: ${reason}`, cancelledBy, {
      cancellationReason: reason,
      cancelledBy,
      cancelledAt: new Date().toISOString()
    });
  }

  // --- Provider Operations ---
  registerProvider(providerData: Omit<ServiceProvider, 'id' | 'rating' | 'reviewCount' | 'totalJobsCompleted' | 'createdAt' | 'updatedAt' | 'verificationStatus'>): ServiceProvider {
    const newId = 'prov_' + Date.now().toString(36);
    const newProv: ServiceProvider = {
      ...providerData,
      id: newId,
      rating: 0,
      reviewCount: 0,
      totalJobsCompleted: 0,
      verificationStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.providers.push(newProv);
    saveToStorage('providers', this.providers);

    this.addNotification({
      recipientId: 'user_admin_super',
      recipientRole: 'admin',
      title: 'New Provider Application',
      message: `${newProv.fullName} (${newProv.businessName}) registered. Verification pending.`,
      type: 'approval',
      referenceId: newProv.id
    });

    this.addAuditLog('PROVIDER_REGISTERED', `Provider ${newProv.fullName} registered business ${newProv.businessName}`, this.activeUser || this.users[0]);
    emitChange();
    return newProv;
  }

  updateProviderVerification(providerId: string, status: ProviderVerificationStatus, reason?: string) {
    const prov = this.providers.find(p => p.id === providerId);
    if (!prov) return;

    prov.verificationStatus = status;
    prov.rejectionReason = reason;
    prov.updatedAt = new Date().toISOString();

    saveToStorage('providers', this.providers);

    this.addNotification({
      recipientId: prov.userId,
      recipientRole: 'provider',
      title: `Registration Status: ${status.toUpperCase()}`,
      message: status === 'approved'
        ? 'Congratulations! Your RapidSeva provider account is approved. You can now go online to receive breakdown jobs.'
        : `Your registration was updated to ${status}. ${reason ? 'Reason: ' + reason : ''}`,
      type: 'approval',
      referenceId: prov.id
    });

    this.addAuditLog('PROVIDER_VERIFICATION_UPDATE', `Provider ${prov.businessName} status changed to ${status}`, this.activeUser || this.users[4]);
    emitChange();
  }

  toggleProviderOnline(providerId: string, isOnline: boolean) {
    const prov = this.providers.find(p => p.id === providerId);
    if (!prov) return;
    prov.isOnline = isOnline;
    prov.updatedAt = new Date().toISOString();
    saveToStorage('providers', this.providers);
    emitChange();
  }

  // --- Payment Processing (Sandbox / Razorpay) ---
  processPayment(requestId: string, paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Cash'): PaymentRecord {
    const req = this.requests.find(r => r.id === requestId);
    if (!req) throw new Error('Request not found');

    const grossAmount = req.finalPrice || req.estimatedPrice;
    const commissionPercent = this.settings.platformCommissionPercent;
    const platformCommission = Math.round((grossAmount * (commissionPercent / 100)) * 100) / 100;
    const providerPayout = Math.round((grossAmount - platformCommission) * 100) / 100;
    const taxAmount = Math.round((platformCommission * (this.settings.gstPercent / 100)) * 100) / 100;

    const paymentId = 'pay_rzp_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const newPayment: PaymentRecord = {
      id: paymentId,
      bookingId: req.id,
      customerId: req.customerId,
      providerId: req.assignedProviderId || 'unknown',
      grossAmount,
      platformCommission,
      providerPayout,
      taxAmount,
      currency: 'INR',
      status: 'completed',
      paymentGateway: 'Razorpay',
      gatewayTransactionId: 'txn_' + Date.now(),
      paymentMethod,
      paidAt: new Date().toISOString()
    };

    this.payments.push(newPayment);
    saveToStorage('payments', this.payments);

    // Update request
    this.updateRequestStatus(
      requestId,
      'PAYMENT_COMPLETED',
      `Payment of ₹${grossAmount} confirmed via ${paymentMethod} (${paymentId}).`,
      'customer',
      {
        paymentId,
        paymentStatus: 'completed',
        paymentMethod,
        platformCommission,
        providerEarnings: providerPayout,
        finalPrice: grossAmount
      }
    );

    // Update provider total stats
    if (req.assignedProviderId) {
      const prov = this.providers.find(p => p.id === req.assignedProviderId);
      if (prov) {
        prov.totalJobsCompleted += 1;
        prov.isAvailable = true;
        saveToStorage('providers', this.providers);
      }
    }

    emitChange();
    return newPayment;
  }

  // --- Reviews ---
  addReview(bookingId: string, rating: number, feedback: string): Review {
    const req = this.requests.find(r => r.id === bookingId);
    const newRev: Review = {
      id: 'rev_' + Date.now().toString(36),
      bookingId,
      customerId: req ? req.customerId : (this.activeUser?.id || 'unknown'),
      customerName: req ? req.customerName : (this.activeUser?.name || 'Customer'),
      providerId: req?.assignedProviderId || '',
      rating,
      feedback,
      createdAt: new Date().toISOString()
    };

    this.reviews.push(newRev);
    saveToStorage('reviews', this.reviews);

    // Recompute provider average rating
    if (req?.assignedProviderId) {
      const prov = this.providers.find(p => p.id === req.assignedProviderId);
      if (prov) {
        const provRevs = this.reviews.filter(r => r.providerId === prov.id);
        const avg = provRevs.reduce((acc, r) => acc + r.rating, 0) / provRevs.length;
        prov.rating = Math.round(avg * 10) / 10;
        prov.reviewCount = provRevs.length;
        saveToStorage('providers', this.providers);
      }
    }

    emitChange();
    return newRev;
  }

  // --- Complaints ---
  submitComplaint(data: Omit<Complaint, 'id' | 'status' | 'createdAt'>): Complaint {
    const newComp: Complaint = {
      ...data,
      id: 'comp_' + Date.now().toString(36),
      status: 'open',
      createdAt: new Date().toISOString()
    };

    this.complaints.push(newComp);
    saveToStorage('complaints', this.complaints);

    this.addNotification({
      recipientId: 'user_admin_super',
      recipientRole: 'admin',
      title: 'Customer Complaint Registered',
      message: `${newComp.customerName} filed a complaint for Booking ${newComp.bookingId}: ${newComp.category}`,
      type: 'emergency',
      referenceId: newComp.id
    });

    emitChange();
    return newComp;
  }

  resolveComplaint(complaintId: string, note: string) {
    const comp = this.complaints.find(c => c.id === complaintId);
    if (!comp) return;

    comp.status = 'resolved';
    comp.resolutionNote = note;
    comp.resolvedAt = new Date().toISOString();
    saveToStorage('complaints', this.complaints);
    this.addAuditLog('COMPLAINT_RESOLVED', `Complaint ${complaintId} resolved: ${note}`, this.activeUser || this.users[4]);
    emitChange();
  }

  // --- Notifications & Audit ---
  addNotification(notif: Omit<AppNotification, 'id' | 'isRead' | 'createdAt'>): AppNotification {
    const n: AppNotification = {
      ...notif,
      id: 'notif_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 4),
      isRead: false,
      createdAt: new Date().toISOString()
    };
    this.notifications.unshift(n);
    saveToStorage('notifications', this.notifications);
    emitChange();
    return n;
  }

  markNotificationRead(id: string) {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) {
      notif.isRead = true;
      saveToStorage('notifications', this.notifications);
      emitChange();
    }
  }

  markAllNotificationsRead(recipientId: string) {
    this.notifications = this.notifications.map(n => n.recipientId === recipientId ? { ...n, isRead: true } : n);
    saveToStorage('notifications', this.notifications);
    emitChange();
  }

  addAuditLog(action: string, details: string, actor: { id: string; name: string; role: UserRole }) {
    const log: AuditLog = {
      id: 'audit_' + Date.now().toString(36),
      action,
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      details,
      timestamp: new Date().toISOString()
    };
    this.auditLogs.unshift(log);
    saveToStorage('auditLogs', this.auditLogs);
    emitChange();
  }

  // --- Admin Configuration ---
  updateSettings(updates: Partial<AppSettings>) {
    this.settings = { ...this.settings, ...updates };
    saveToStorage('settings', this.settings);
    this.addAuditLog('SETTINGS_MODIFIED', `Updated settings: ${JSON.stringify(updates)}`, this.activeUser || this.users[4]);
    emitChange();
  }

  updateCategory(categoryId: string, updates: Partial<ServiceCategory>) {
    this.categories = this.categories.map(c => c.id === categoryId ? { ...c, ...updates } : c);
    saveToStorage('categories', this.categories);
    this.addAuditLog('CATEGORY_PRICE_MODIFIED', `Updated pricing for category ${categoryId}`, this.activeUser || this.users[4]);
    emitChange();
  }

  // Reset to initial clean state
  resetToDefaults() {
    localStorage.clear();
    this.categories = INITIAL_CATEGORIES;
    this.settings = INITIAL_SETTINGS;
    this.users = INITIAL_USERS;
    this.vehicles = INITIAL_VEHICLES;
    this.providers = INITIAL_PROVIDERS;
    this.requests = INITIAL_REQUESTS;
    this.payments = INITIAL_PAYMENTS;
    this.reviews = INITIAL_REVIEWS;
    this.complaints = INITIAL_COMPLAINTS;
    this.notifications = INITIAL_NOTIFICATIONS;
    this.auditLogs = INITIAL_AUDIT_LOGS;
    this.activePortal = 'customer';
    this.activeUser = this.getUserForRole('customer');
    emitChange();
  }
}

// Global Singleton Export
export const store = new RapidSevaStore();
