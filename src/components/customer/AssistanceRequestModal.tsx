import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Wrench,
  Car,
  Bike,
  Disc,
  Zap,
  Fuel,
  Truck,
  Key,
  HelpCircle,
  MapPin,
  Camera,
  UploadCloud,
  Phone,
  ShieldCheck,
  Plus,
  Users,
  User,
  LocateFixed,
  Navigation,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { ServiceCategoryType, Vehicle } from '../../types';
import { matchingController } from '../../services/matchingEngine';
import { InteractiveMap } from '../common/InteractiveMap';

interface AssistanceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: ServiceCategoryType;
  onSuccess: (bookingId: string) => void;
}

const GUWAHATI_PRESETS = [
  {
    name: 'GS Road, Dispur (Secretariat)',
    address: 'GS Road, Dispur, Guwahati, Assam 781005',
    landmark: 'Near Assam Secretariat & Super Market Point',
    lat: 26.1558,
    lng: 91.7766,
  },
  {
    name: 'Jalukbari Chariali (Saraighat)',
    address: 'Jalukbari Chariali, NH-27, Guwahati, Assam 781014',
    landmark: 'Near Dr. Bhupen Hazarika Samadhi Kshetra',
    lat: 26.1450,
    lng: 91.6620,
  },
  {
    name: 'NH-27 Guwahati Bypass (Lokhra)',
    address: 'NH-27 Guwahati Bypass, Lokhra Chariali, Guwahati 781040',
    landmark: 'Near Lokhra Flyover & ISBT Guwahati junction',
    lat: 26.1180,
    lng: 91.7320,
  },
  {
    name: 'Khanapara Flyover (Assam-Meghalaya)',
    address: 'Khanapara Chariali, GS Road / NH-27, Guwahati 781022',
    landmark: 'Near Veterinary College Field & Administrative Staff College',
    lat: 26.1215,
    lng: 91.8210,
  },
  {
    name: 'Paltan Bazaar (Railway Station)',
    address: 'Paltan Bazaar, Station Road, Guwahati 781008',
    landmark: 'Near Guwahati Railway Station Main Gate & ASTC Stand',
    lat: 26.1812,
    lng: 91.7505,
  },
  {
    name: 'Zoo Road / RG Baruah Road',
    address: 'RG Baruah Road, Ganeshguri to Zoo Road Tiniali, Guwahati 781024',
    landmark: 'Opposite Assam State Zoo Main Gate',
    lat: 26.1680,
    lng: 91.7820,
  },
  {
    name: 'Maligaon Chariali (Kamakhya Gate)',
    address: 'Maligaon Chariali, AT Road, Guwahati 781011',
    landmark: 'Near NF Railway Headquarters & Kamakhya Station Road',
    lat: 26.1550,
    lng: 91.7050,
  },
];

export const AssistanceRequestModal: React.FC<AssistanceRequestModalProps> = ({
  isOpen,
  onClose,
  initialCategory,
  onSuccess,
}) => {
  const { categories, vehicles, activeUser, store } = useStore();

  const [step, setStep] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategoryType>(
    initialCategory || 'battery-jumpstart'
  );

  // Booking for Myself vs Someone Else
  const [isBookingForOther, setIsBookingForOther] = useState(false);
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [beneficiaryPhone, setBeneficiaryPhone] = useState('');
  const [beneficiaryRelationship, setBeneficiaryRelationship] = useState('Friend');
  const [otherVehicleReg, setOtherVehicleReg] = useState('');

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(
    vehicles[0]?.id || ''
  );
  const [problemType, setProblemType] = useState<string>('');
  const [problemDescription, setProblemDescription] = useState<string>('');

  // Location Telematics & Autofill
  const [address, setAddress] = useState<string>('GS Road, near Christian Basti / Dispur, Guwahati, Assam');
  const [landmark, setLandmark] = useState<string>('Near Assam Secretariat & Super Market Point');
  const [lat, setLat] = useState<number>(26.1558);
  const [lng, setLng] = useState<number>(91.7766);
  const [isGpsAutofilled, setIsGpsAutofilled] = useState(true);
  const [isDetectingGps, setIsDetectingGps] = useState(false);

  const [phone, setPhone] = useState<string>(activeUser?.phone || '+91 94350 43210');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Quick Add Vehicle inside flow if user has none
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [newReg, setNewReg] = useState('');
  const [newBrand, setNewBrand] = useState('Maruti Suzuki');
  const [newModel, setNewModel] = useState('Swift');
  const [newFuel, setNewFuel] = useState<'Petrol' | 'Diesel' | 'EV' | 'CNG'>('Petrol');

  // Automatic GPS Autofill on modal open
  useEffect(() => {
    if (isOpen && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude);
          setLng(pos.coords.longitude);
          setIsGpsAutofilled(true);
        },
        () => {
          // Fallback to Dispur, Guwahati
          setIsGpsAutofilled(true);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory) || categories[0];
  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  const handleDetectLiveGps = () => {
    setIsDetectingGps(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude);
          setLng(pos.coords.longitude);
          setIsGpsAutofilled(true);
          setIsDetectingGps(false);
        },
        () => {
          setLat(26.1558);
          setLng(91.7766);
          setAddress('GS Road, Dispur, Guwahati, Assam');
          setLandmark('Near Assam Secretariat & Super Market Point');
          setIsGpsAutofilled(true);
          setIsDetectingGps(false);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setIsDetectingGps(false);
    }
  };

  const handleSelectPreset = (preset: typeof GUWAHATI_PRESETS[0]) => {
    setAddress(preset.address);
    setLandmark(preset.landmark);
    setLat(preset.lat);
    setLng(preset.lng);
  };

  const handleMapLocationSelect = (newLat: number, newLng: number) => {
    setLat(newLat);
    setLng(newLng);
    setAddress(`Pinned Location (${newLat.toFixed(4)}° N, ${newLng.toFixed(4)}° E), Guwahati Area`);
    setLandmark('Interactive pin selected on map');
  };

  const handleQuickAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReg) return;
    const v = store.addVehicle({
      customerId: activeUser?.id || 'user_cust_bikash',
      vehicleType: 'car',
      registrationNumber: newReg.toUpperCase(),
      brand: newBrand,
      model: newModel,
      fuelType: newFuel,
      year: 2023,
      isDefault: true,
    });
    setSelectedVehicleId(v.id);
    setIsAddingVehicle(false);
    setNewReg('');
  };

  const handleSimulatePhotoUpload = () => {
    const samplePhotos = [
      'https://images.unsplash.com/photo-1588614959060-4d144f28b207?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&auto=format&fit=crop&q=80',
    ];
    setPhotos([...photos, samplePhotos[photos.length % samplePhotos.length]]);
  };

  const handleSubmitRequest = () => {
    setIsSubmitting(true);

    try {
      const newReq = store.createAssistanceRequest({
        customerId: activeUser?.id || 'user_cust_bikash',
        customerName: activeUser?.name || 'Bikash Baruah',
        customerPhone: phone,
        isBookingForOther,
        beneficiaryDetails: isBookingForOther
          ? {
              name: beneficiaryName || 'Beneficiary Contact',
              phone: beneficiaryPhone || phone,
              relationship: beneficiaryRelationship,
            }
          : undefined,
        serviceCategoryId: selectedCategory,
        serviceCategoryName: activeCategoryObj.name,
        vehicleId: selectedVehicle?.id || 'unknown_veh',
        vehicleDetails: {
          registrationNumber: (isBookingForOther && otherVehicleReg) ? otherVehicleReg : (selectedVehicle?.registrationNumber || 'AS 01 EK 1234'),
          brand: selectedVehicle?.brand || 'Car',
          model: selectedVehicle?.model || 'Model',
          vehicleType: selectedVehicle?.vehicleType || 'car',
          fuelType: selectedVehicle?.fuelType || 'Petrol',
        },
        problemType: problemType || activeCategoryObj.popularIssues[0] || 'Roadside Assistance',
        problemDescription,
        problemPhotos: photos,
        location: {
          lat,
          lng,
          address,
          landmark,
        },
        estimatedPrice: activeCategoryObj.basePrice,
        paymentStatus: 'pending',
      });

      // Launch matching engine
      matchingController.startMatching(newReq.id);

      setTimeout(() => {
        setIsSubmitting(false);
        onSuccess(newReq.id);
        onClose();
      }, 600);
    } catch (err) {
      console.error('Error submitting request:', err);
      setIsSubmitting(false);
    }
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wrench': return <Wrench className="w-5 h-5" />;
      case 'Bike': return <Bike className="w-5 h-5" />;
      case 'Zap': return <Zap className="w-5 h-5" />;
      case 'Disc': return <Disc className="w-5 h-5" />;
      case 'Fuel': return <Fuel className="w-5 h-5" />;
      case 'Truck': return <Truck className="w-5 h-5" />;
      case 'Key': return <Key className="w-5 h-5" />;
      default: return <HelpCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[9995] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#F04416]">
                Step {step} of 6 • New Assistance Request
              </span>
              {isBookingForOther && (
                <span className="text-[9px] bg-purple-100 text-purple-800 font-extrabold px-2 py-0.5 rounded-full">
                  Booking for {beneficiaryName || 'Someone Else'}
                </span>
              )}
            </div>
            <h3 className="text-lg font-black text-gray-900 tracking-tight">
              {step === 1 && 'Select Roadside Service & Booking Recipient'}
              {step === 2 && 'Select Vehicle Details'}
              {step === 3 && 'Describe Breakdown Issue'}
              {step === 4 && 'Confirm or Change Breakdown Location'}
              {step === 5 && 'Upload Photos (Optional)'}
              {step === 6 && 'Review & Dispatch Request'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-gray-100 h-1.5">
          <div
            className="h-full bg-[#F04416] transition-all duration-300"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* STEP 1: Select Category & Who is this booking for */}
          {step === 1 && (
            <div className="space-y-4">
              {/* BOOKING FOR MYSELF VS SOMEONE ELSE TOGGLE */}
              <div className="p-4 bg-gradient-to-br from-orange-50/80 to-amber-50/80 rounded-2xl border border-orange-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Who needs roadside assistance?
                  </span>
                  <span className="text-[10px] bg-white text-[#F04416] font-bold px-2 py-0.5 rounded-full border border-orange-200">
                    {isBookingForOther ? 'Booking for Someone Else' : 'Booking for Myself'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBookingForOther(false)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                      !isBookingForOther
                        ? 'bg-[#111111] text-white border-black shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>For Myself</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsBookingForOther(true)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                      isBookingForOther
                        ? 'bg-[#F04416] text-white border-[#F04416] shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>For Someone Else</span>
                  </button>
                </div>

                {/* If booking for someone else, gather their details */}
                {isBookingForOther && (
                  <div className="space-y-3 pt-2 border-t border-orange-200/60 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-gray-600 block mb-1">
                          Beneficiary Full Name*
                        </label>
                        <input
                          type="text"
                          value={beneficiaryName}
                          onChange={(e) => setBeneficiaryName(e.target.value)}
                          placeholder="e.g. Rahul Hazarika"
                          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-white font-semibold"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-gray-600 block mb-1">
                          Beneficiary Mobile Number*
                        </label>
                        <input
                          type="tel"
                          value={beneficiaryPhone}
                          onChange={(e) => setBeneficiaryPhone(e.target.value)}
                          placeholder="+91 98640 12345"
                          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-white font-mono font-bold"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-gray-600 block mb-1">
                          Relationship
                        </label>
                        <select
                          value={beneficiaryRelationship}
                          onChange={(e) => setBeneficiaryRelationship(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-white font-medium"
                        >
                          <option value="Friend">Friend</option>
                          <option value="Family Member">Family Member</option>
                          <option value="Colleague">Colleague</option>
                          <option value="Driver">Driver / Fleet</option>
                          <option value="Customer">Customer</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-gray-600 block mb-1">
                          Beneficiary Vehicle Number (Optional)
                        </label>
                        <input
                          type="text"
                          value={otherVehicleReg}
                          onChange={(e) => setOtherVehicleReg(e.target.value.toUpperCase())}
                          placeholder="e.g. AS 01 FD 9999"
                          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-white font-mono font-bold uppercase"
                        />
                      </div>
                    </div>

                    <p className="text-[11px] text-gray-600 italic">
                      💡 Dispatched mechanics will call {beneficiaryName || 'the recipient'} directly at their breakdown spot. You can change their exact breakdown map location in Step 4.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs text-gray-500 font-medium mb-2.5">
                  Choose the roadside emergency service needed:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <div
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-[#F04416] bg-orange-50/50 shadow-xs'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2.5 rounded-xl ${
                              isSelected ? 'bg-[#F04416] text-white' : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {getCategoryIcon(cat.icon)}
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-gray-900">{cat.name}</h4>
                            <p className="text-[11px] text-gray-500">{cat.shortDesc}</p>
                            <span className="text-xs font-extrabold text-[#F04416] mt-0.5 block">
                              Base: ₹{cat.basePrice}
                            </span>
                          </div>
                        </div>

                        {isSelected && <CheckCircle2 className="w-5 h-5 text-[#F04416]" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Select Vehicle */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500 font-medium">
                  {isBookingForOther ? 'Select or add vehicle profile for this service:' : 'Select which vehicle requires roadside assistance:'}
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddingVehicle(!isAddingVehicle)}
                  className="text-xs font-bold text-[#F04416] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {isAddingVehicle ? 'Cancel' : 'Add New Vehicle'}
                </button>
              </div>

              {isAddingVehicle ? (
                <form onSubmit={handleQuickAddVehicle} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">Plate Reg.*</label>
                      <input
                        type="text"
                        placeholder="AS 01 AB 9999"
                        value={newReg}
                        onChange={(e) => setNewReg(e.target.value.toUpperCase())}
                        className="w-full p-2 text-xs border border-gray-200 rounded-xl font-mono font-bold uppercase"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">Brand*</label>
                      <input
                        type="text"
                        value={newBrand}
                        onChange={(e) => setNewBrand(e.target.value)}
                        className="w-full p-2 text-xs border border-gray-200 rounded-xl font-bold"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">Model*</label>
                      <input
                        type="text"
                        value={newModel}
                        onChange={(e) => setNewModel(e.target.value)}
                        className="w-full p-2 text-xs border border-gray-200 rounded-xl"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">Fuel Type</label>
                      <select
                        value={newFuel}
                        onChange={(e) => setNewFuel(e.target.value as any)}
                        className="w-full p-2 text-xs border border-gray-200 rounded-xl bg-white"
                      >
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="EV">Electric (EV)</option>
                        <option value="CNG">CNG</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-[#F04416] hover:bg-[#D8380E] text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    Save Vehicle & Select
                  </button>
                </form>
              ) : (
                <div className="space-y-2">
                  {vehicles.map((v) => {
                    const isSelected = selectedVehicleId === v.id;
                    return (
                      <div
                        key={v.id}
                        onClick={() => setSelectedVehicleId(v.id)}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-[#F04416] bg-orange-50/50 shadow-xs'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-3 rounded-xl ${
                              isSelected ? 'bg-[#F04416] text-white' : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {v.vehicleType === 'bike' ? <Bike className="w-5 h-5" /> : <Car className="w-5 h-5" />}
                          </div>
                          <div>
                            <h4 className="text-sm font-extrabold text-gray-900">
                              {v.brand} {v.model}
                            </h4>
                            <p className="text-xs font-mono font-bold text-gray-500">
                              {(isBookingForOther && otherVehicleReg) ? otherVehicleReg : v.registrationNumber} • {v.fuelType} ({v.year})
                            </p>
                          </div>
                        </div>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-[#F04416]" />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Describe Issue */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Common Symptoms & Problems for {activeCategoryObj.name}:
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {activeCategoryObj.popularIssues.map((issue) => (
                    <button
                      key={issue}
                      type="button"
                      onClick={() => setProblemType(issue)}
                      className={`text-xs px-3 py-1.5 rounded-xl border font-semibold transition-all ${
                        problemType === issue
                          ? 'bg-[#F04416] text-white border-[#F04416]'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {issue}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Additional Details for the Attending Technician:
                </label>
                <textarea
                  rows={3}
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  placeholder="e.g. Starter makes rapid clicking noise, headlights work but engine won't crank. Vehicle is safely parked off highway."
                  className="w-full p-3 text-xs border border-gray-200 rounded-xl focus:border-[#F04416] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Autofill Map Location & Change Location (for Self or Others) */}
          {step === 4 && (
            <div className="space-y-4">
              {/* GPS Autofill Status Banner & Trigger */}
              <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 text-xs text-emerald-900 font-semibold">
                  <div className="p-2 bg-emerald-600 text-white rounded-xl">
                    <LocateFixed className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <div className="font-bold text-emerald-950">
                      {isBookingForOther ? `Breakdown Location for ${beneficiaryName || 'Beneficiary'}` : 'Live GPS Telematics Active'}
                    </div>
                    <p className="text-[11px] text-emerald-800">
                      Address autofilled from satellite telematics • Tap map to change location
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDetectLiveGps}
                  disabled={isDetectingGps}
                  className="px-3 py-1.5 bg-white hover:bg-emerald-100 text-emerald-900 text-xs font-bold rounded-xl border border-emerald-300 shadow-2xs flex items-center gap-1.5 transition-all shrink-0 self-start sm:self-auto"
                >
                  <Navigation className={`w-3.5 h-3.5 text-emerald-700 ${isDetectingGps ? 'animate-spin' : ''}`} />
                  <span>{isDetectingGps ? 'Detecting...' : 'Detect Live GPS'}</span>
                </button>
              </div>

              {/* Interactive Map with click-to-pin functionality */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-700">Interactive Telematics Map:</span>
                  <span className="text-[11px] text-gray-500 font-mono">
                    {lat.toFixed(4)}° N, {lng.toFixed(4)}° E
                  </span>
                </div>

                <InteractiveMap
                  customerLocation={{ lat, lng, address }}
                  height="220px"
                  isInteractivePicker={true}
                  onLocationSelect={handleMapLocationSelect}
                />
              </div>

              {/* Quick Guwahati Location Presets for Instant 1-Click Changes */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1.5">
                  Guwahati Breakdown Hotspots (Tap to reposition pin for yourself or others):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {GUWAHATI_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`text-[11px] px-2.5 py-1 rounded-xl border font-semibold transition-all ${
                        address === preset.address
                          ? 'bg-[#111111] text-white border-black shadow-xs'
                          : 'bg-gray-50 hover:bg-orange-50 text-gray-700 border-gray-200'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Editable Street Address and Landmark Inputs */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Breakdown Street Address (Autofilled):
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 text-xs border border-gray-200 rounded-xl focus:border-[#F04416] focus:outline-none font-medium"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Prominent Landmark / Gate / Highway Pillar:
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Near Super Market / Flyover Pillar 24"
                  className="w-full p-2.5 text-xs border border-gray-200 rounded-xl focus:border-[#F04416] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 5: Photo Upload */}
          {step === 5 && (
            <div className="space-y-4">
              <p className="text-xs text-gray-500 font-medium">
                Photographs help attending mechanics bring the correct tools, spare fuses, or towing equipment:
              </p>

              <div
                onClick={handleSimulatePhotoUpload}
                className="border-2 border-dashed border-gray-300 hover:border-[#F04416] rounded-2xl p-6 text-center cursor-pointer transition-colors bg-gray-50 hover:bg-orange-50/20"
              >
                <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-gray-800">
                  Tap to capture or upload breakdown photo
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Vehicle dashboard lights, tyre puncture, or engine bay
                </p>
              </div>

              {photos.length > 0 && (
                <div className="flex gap-3 overflow-x-auto py-2">
                  {photos.map((url, idx) => (
                    <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                      <img src={url} alt="Breakdown" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full text-xs"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 6: Review & Dispatch */}
          {step === 6 && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                {isBookingForOther && (
                  <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900 flex items-center justify-between">
                    <span className="font-bold">Booking For Beneficiary:</span>
                    <span className="font-extrabold">{beneficiaryName || 'Beneficiary'} ({beneficiaryPhone || 'Phone Not Set'}) • {beneficiaryRelationship}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <span className="text-xs text-gray-500">Service:</span>
                  <span className="text-xs font-extrabold text-gray-900">{activeCategoryObj.name}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <span className="text-xs text-gray-500">Vehicle:</span>
                  <span className="text-xs font-extrabold text-gray-900">
                    {(isBookingForOther && otherVehicleReg) ? otherVehicleReg : `${selectedVehicle?.brand} ${selectedVehicle?.model} (${selectedVehicle?.registrationNumber})`}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <span className="text-xs text-gray-500">Problem:</span>
                  <span className="text-xs font-extrabold text-gray-900">
                    {problemType || activeCategoryObj.popularIssues[0]}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <span className="text-xs text-gray-500">Breakdown Location:</span>
                  <span className="text-xs font-semibold text-gray-900 text-right max-w-[240px] truncate">
                    {address}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-bold text-gray-700">Estimated Base Price:</span>
                  <span className="text-base font-black text-[#F04416]">₹{activeCategoryObj.basePrice}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  {isBookingForOther ? 'Your Primary Account Phone (Requester):' : 'Contact Phone for Arriving Technician:'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-200 rounded-xl font-bold font-mono"
                    required
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Our dispatch engine will notify certified mechanics nearest to the selected breakdown spot. No payment is charged until service completion.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-200 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 6 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 bg-[#F04416] hover:bg-[#D8380E] text-white text-xs font-extrabold rounded-xl shadow-brand flex items-center gap-2 transition-all active:scale-98"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmitRequest}
              disabled={isSubmitting}
              className="px-8 py-3 bg-[#F04416] hover:bg-[#D8380E] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-brand flex items-center gap-2 transition-all active:scale-98 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Dispatching Telematics...</span>
              ) : (
                <>
                  <span>DISPATCH MECHANIC NOW</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
