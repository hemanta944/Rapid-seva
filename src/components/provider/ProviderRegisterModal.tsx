import React, { useState } from 'react';
import { Wrench, X, UploadCloud, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { ServiceCategoryType } from '../../types';

interface ProviderRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ProviderRegisterModal: React.FC<ProviderRegisterModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { categories, store } = useStore();

  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [serviceAreas, setServiceAreas] = useState('GS Road, Dispur, Jalukbari, Khanapara, Guwahati');
  const [workingHours, setWorkingHours] = useState('24/7 Roadside Assistance');
  const [experience, setExperience] = useState<number>(5);
  const [selectedCategories, setSelectedCategories] = useState<ServiceCategoryType[]>([
    'car-repair',
    'battery-jumpstart',
  ]);
  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [bankName, setBankName] = useState('State Bank of India');
  const [upiId, setUpiId] = useState('');
  const [docUploaded, setDocUploaded] = useState(false);

  if (!isOpen) return null;

  const toggleCategory = (catId: ServiceCategoryType) => {
    if (selectedCategories.includes(catId)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter((c) => c !== catId));
      }
    } else {
      setSelectedCategories([...selectedCategories, catId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !businessName || !phone) return;

    store.registerProvider({
      userId: 'user_prov_' + Date.now().toString(36),
      fullName,
      businessName,
      phone,
      email: email || `${phone}@rapidseva-assam.in`,
      serviceCategories: selectedCategories,
      businessAddress,
      serviceAreas: serviceAreas.split(',').map((s) => s.trim()),
      workingHours,
      yearsOfExperience: Number(experience),
      pricingMethod: 'standard_rate',
      isOnline: false,
      isAvailable: false,
      currentLocation: {
        lat: 26.1558,
        lng: 91.7766,
        address: businessAddress || 'Guwahati, Assam',
      },
      bankDetails: {
        accountHolderName: accountHolder || businessName,
        accountNumber: accountNumber || '987654321012',
        ifscCode: ifsc || 'SBIN0003030',
        bankName: bankName || 'State Bank of India',
        upiId: upiId || `${phone}@upi`,
      },
      documents: [
        {
          id: 'doc_' + Date.now(),
          providerId: '',
          docType: 'garage_registration',
          docNumber: 'AS-GHY-REG-2026-' + Math.floor(1000 + Math.random() * 9000),
          documentUrl: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=600&auto=format&fit=crop&q=80',
          verified: false,
          uploadedAt: new Date().toISOString(),
        },
      ],
    });

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-orange-50 rounded-xl text-[#F04416]">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">Partner Onboarding & Registration</h3>
              <p className="text-xs text-gray-500">Join RapidSeva's verified network of roadside mechanics & garages</p>
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Admin Verification Mandatory:</span> All registrations undergo document & background verification by the Super Admin before your account can go online to receive roadside requests.
            </div>
          </div>

          {/* Personal & Workshop details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600">
              1. Business & Contact Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                  Technician / Owner Full Name*
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Verma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                  Workshop / Business Name*
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apex Roadside Motors"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                  Primary Mobile Number (Dispatch OTP)*
                </label>
                <input
                  type="tel"
                  placeholder="+91 98XXX XXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="contact@workshop.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                Workshop Physical Address*
              </label>
              <input
                type="text"
                placeholder="Shop number, street, landmark, city"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                required
              />
            </div>
          </div>

          {/* Service Capabilities */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600">
              2. Service Categories You Provide
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((cat) => {
                const isSelected = selectedCategories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                      isSelected
                        ? 'border-[#F04416] bg-orange-50/50 text-[#F04416] font-bold'
                        : 'border-gray-200 bg-white text-gray-700'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Document Verification Upload */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600">
              3. Verification Documents (Trade License / Aadhaar / Driving License)
            </h4>
            <div
              onClick={() => setDocUploaded(true)}
              className="p-4 border-2 border-dashed border-gray-300 hover:border-[#F04416] rounded-2xl text-center cursor-pointer bg-gray-50 transition-all"
            >
              {docUploaded ? (
                <div className="text-emerald-700 font-bold text-xs flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Workshop_Registration_Certificate.pdf Uploaded Successfully</span>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-7 h-7 text-gray-400 mx-auto mb-1.5" />
                  <p className="text-xs font-bold text-gray-800">
                    Click to attach Garage License or Driving License
                  </p>
                  <p className="text-[10px] text-gray-400">PDF, JPG, or PNG under 5MB</p>
                </>
              )}
            </div>
          </div>

          {/* Bank Details for Direct Payouts */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600">
              4. Payout Settlement Account (Net 85% after 15% Platform Fee)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                  Bank Account Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 501004928172"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                  IFSC Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. HDFC0001234"
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl font-mono uppercase"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                UPI ID (Instant Settlement)
              </label>
              <input
                type="text"
                placeholder="e.g. workshop@okhdfcbank"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#F04416] hover:bg-[#D8380E] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-brand transition-all"
          >
            Submit Application for Verification
          </button>
        </form>
      </div>
    </div>
  );
};
