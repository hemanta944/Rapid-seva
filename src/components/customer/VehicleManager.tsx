import React, { useState } from 'react';
import { Car, Bike, Plus, Trash2, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { Vehicle } from '../../types';

interface VehicleManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VehicleManager: React.FC<VehicleManagerProps> = ({ isOpen, onClose }) => {
  const { vehicles, activeUser, store } = useStore();

  const [isAdding, setIsAdding] = useState(false);
  const [vehicleType, setVehicleType] = useState<'car' | 'bike' | 'scooter' | 'commercial'>('car');
  const [regNumber, setRegNumber] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [fuelType, setFuelType] = useState<'Petrol' | 'Diesel' | 'EV' | 'CNG' | 'Hybrid'>('Petrol');
  const [year, setYear] = useState<number>(2023);
  const [color, setColor] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  if (!isOpen) return null;

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNumber || !brand || !model) return;

    store.addVehicle({
      customerId: activeUser?.id || 'user_cust_rajesh',
      vehicleType,
      registrationNumber: regNumber.toUpperCase(),
      brand,
      model,
      fuelType,
      year: Number(year),
      color: color || 'Standard',
      isDefault,
    });

    // Reset
    setIsAdding(false);
    setRegNumber('');
    setBrand('');
    setModel('');
    setColor('');
  };

  const handleDelete = (id: string, reg: string) => {
    if (window.confirm(`Remove vehicle ${reg} from your account?`)) {
      store.deleteVehicle(id);
    }
  };

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-orange-50 rounded-xl text-[#F04416]">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">Manage My Vehicles</h3>
              <p className="text-xs text-gray-500">Save cars and two-wheelers for 1-tap roadside help</p>
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
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {!isAdding ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Saved Vehicles ({vehicles.length})
                </span>
                <button
                  onClick={() => setIsAdding(true)}
                  className="px-3.5 py-1.5 bg-[#F04416] hover:bg-[#D8380E] text-white text-xs font-bold rounded-xl shadow-brand flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Vehicle</span>
                </button>
              </div>

              {vehicles.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Car className="w-12 h-12 mx-auto mb-2 text-gray-300 stroke-[1.5]" />
                  <p className="text-sm font-bold text-gray-600">No vehicles saved</p>
                  <p className="text-xs text-gray-400 mt-1">Add your car or motorcycle to request instant breakdown assistance.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {vehicles.map((v) => (
                    <div
                      key={v.id}
                      className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between group hover:border-gray-300 transition-all"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-[#111111] shadow-xs">
                          {v.vehicleType === 'bike' ? (
                            <Bike className="w-6 h-6 text-[#F04416]" />
                          ) : (
                            <Car className="w-6 h-6 text-[#F04416]" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-extrabold text-gray-900">
                              {v.brand} {v.model}
                            </h4>
                            {v.isDefault && (
                              <span className="text-[10px] bg-orange-100 text-[#F04416] font-extrabold px-2 py-0.5 rounded-full">
                                Primary
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-mono font-bold text-gray-600 mt-0.5">
                            {v.registrationNumber} • {v.fuelType} • {v.year}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(v.id, v.registrationNumber)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-xl transition-all"
                          title="Remove vehicle"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  New Vehicle Details
                </h4>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-xs text-gray-500 hover:underline font-semibold"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-500 block mb-1">
                  Vehicle Type
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['car', 'bike', 'scooter', 'commercial'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setVehicleType(t)}
                      className={`py-2 text-xs font-bold rounded-xl border capitalize transition-all ${
                        vehicleType === t
                          ? 'bg-[#111111] text-white border-[#111111]'
                          : 'bg-gray-50 text-gray-700 border-gray-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-500 block mb-1">
                    Registration No.*
                  </label>
                  <input
                    type="text"
                    placeholder="DL 01 AB 1234"
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl uppercase font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-500 block mb-1">
                    Brand (Make)*
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Maruti, Hyundai, Honda"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-500 block mb-1">
                    Model*
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Creta, Swift, Activa"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-500 block mb-1">
                    Fuel Type
                  </label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-white"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="EV">Electric (EV)</option>
                    <option value="CNG">CNG</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-500 block mb-1">
                    Manufacturing Year
                  </label>
                  <input
                    type="number"
                    min="1990"
                    max="2027"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-500 block mb-1">
                    Color
                  </label>
                  <input
                    type="text"
                    placeholder="White, Silver, Black"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="defaultCheck"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="rounded text-[#F04416] focus:ring-[#F04416]"
                />
                <label htmlFor="defaultCheck" className="text-xs text-gray-700 font-medium">
                  Set as my primary breakdown vehicle
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#F04416] hover:bg-[#D8380E] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-brand transition-all"
              >
                Save Vehicle
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
