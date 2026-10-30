import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import { PickupRequest } from '../types/courier';
import { getStoredPickups, savePickupToStorage } from '../data/mockShipments';
import { FedExLogo } from './FedExLogo';

export const PickupScheduler: React.FC = () => {
  const [pickups, setPickups] = useState<PickupRequest[]>(() => getStoredPickups());
  const [company, setCompany] = useState('Vance Logistics Ltd');
  const [contactName, setContactName] = useState('Alexander Vance');
  const [address, setAddress] = useState('100 Technology Square');
  const [city, setCity] = useState('Cambridge');
  const [state, setState] = useState('MA');
  const [zip, setZip] = useState('02139');
  const [phone, setPhone] = useState('(617) 555-0199');
  const [pickupDate, setPickupDate] = useState('2026-10-18');
  const [readyTime, setReadyTime] = useState('13:00');
  const [closeTime, setCloseTime] = useState('17:30');
  const [packageCount, setPackageCount] = useState(2);
  const [totalWeight, setTotalWeight] = useState(8.5);
  const [locationAtPremises, setLocationAtPremises] = useState('Front Desk / Reception');
  const [specialInstructions, setSpecialInstructions] = useState('Ring security buzzer for commercial dock elevator');

  const [confirmedPickup, setConfirmedPickup] = useState<PickupRequest | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const confCode = `PKP-${Math.floor(100000 + Math.random() * 900000)}`;

    const newPickup: PickupRequest = {
      id: `pkp-${Date.now()}`,
      confirmationCode: confCode,
      pickupDate,
      readyTime,
      closingTime: closeTime,
      packageCount: Number(packageCount) || 1,
      totalWeight: Number(totalWeight) || 5,
      locationAtPremises,
      specialInstructions,
      status: 'CONFIRMED',
      createdAt: 'Just now',
      sender: {
        name: contactName,
        company,
        address,
        city,
        state,
        postalCode: zip,
        country: 'United States',
        phone,
      },
    };

    savePickupToStorage(newPickup);
    setPickups([newPickup, ...pickups]);
    setConfirmedPickup(newPickup);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 md:p-8 bg-[#4D148C] text-white border-b border-[#3b0f6d]">
          <div className="flex items-center gap-3">
            <FedExLogo variant="white" size="md" />
            <span className="text-xs font-black uppercase tracking-widest text-[#FF6200] bg-white/10 px-2.5 py-1 rounded">
              Courier Dispatch
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight mt-2">Schedule a FedEx Courier Pickup</h2>
          <p className="text-sm text-white/80 mt-1">
            Request an on-demand driver pickup at your office, commercial dock, or residence.
          </p>
        </div>

        {confirmedPickup ? (
          <div className="p-8 text-center space-y-4">
            <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
            <h3 className="text-xl font-black text-slate-900">Pickup Confirmed with FedEx Dispatch</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your courier dispatch request has been logged. Please ensure all packages have an affixed FedEx barcode label before pickup window.
            </p>

            <div className="inline-block bg-slate-50 border border-slate-200 rounded-xl p-4 text-left font-mono text-xs space-y-1.5 mt-2">
              <div className="text-slate-500">
                Confirmation Number: <span className="font-bold text-[#4D148C]">{confirmedPickup.confirmationCode}</span>
              </div>
              <div className="text-slate-500">
                Scheduled Date: <span className="font-bold text-slate-900">{confirmedPickup.pickupDate}</span>
              </div>
              <div className="text-slate-500">
                Ready Window: <span className="font-bold text-slate-900">{confirmedPickup.readyTime} - {confirmedPickup.closingTime}</span>
              </div>
              <div className="text-slate-500">
                Total Packages: <span className="font-bold text-slate-900">{confirmedPickup.packageCount} ({confirmedPickup.totalWeight} lbs)</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setConfirmedPickup(null)}
                className="px-6 py-2.5 text-xs font-bold text-white bg-[#4D148C] hover:bg-[#3b0f6d] rounded-lg transition-colors cursor-pointer"
              >
                Schedule Another Pickup
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pickup Address */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#4D148C] uppercase tracking-wider pb-2 border-b border-slate-200">
                  1. Pickup Location
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Company</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-[#4D148C] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Contact Name *</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-[#4D148C] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-[#4D148C] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-[#4D148C] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">State *</label>
                    <input
                      type="text"
                      required
                      maxLength={2}
                      value={state}
                      onChange={(e) => setState(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg uppercase font-mono focus:border-[#4D148C] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ZIP *</label>
                    <input
                      type="text"
                      required
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono focus:border-[#4D148C] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono focus:border-[#4D148C] focus:outline-none"
                  />
                </div>
              </div>

              {/* Pickup Time & Specs */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#FF6200] uppercase tracking-wider pb-2 border-b border-slate-200">
                  2. Pickup Time & Packages
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pickup Date *</label>
                  <input
                    type="date"
                    required
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-medium focus:border-[#4D148C] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ready At *</label>
                    <input
                      type="time"
                      required
                      value={readyTime}
                      onChange={(e) => setReadyTime(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono focus:border-[#4D148C] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Closes At *</label>
                    <input
                      type="time"
                      required
                      value={closeTime}
                      onChange={(e) => setCloseTime(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono focus:border-[#4D148C] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Number of Packages</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={packageCount}
                      onChange={(e) => setPackageCount(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono focus:border-[#4D148C] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Total Weight (lbs)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      required
                      value={totalWeight}
                      onChange={(e) => setTotalWeight(parseFloat(e.target.value) || 1)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono focus:border-[#4D148C] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Package Location</label>
                  <select
                    value={locationAtPremises}
                    onChange={(e) => setLocationAtPremises(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:border-[#4D148C] focus:outline-none"
                  >
                    <option value="Front Desk / Reception">Front Desk / Reception</option>
                    <option value="Loading Dock / Shipping Bay">Loading Dock / Shipping Bay</option>
                    <option value="Front Porch / Residential Door">Front Porch / Residential Door</option>
                    <option value="Security Station">Security Station</option>
                    <option value="Mailroom">Mailroom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Special Driver Instructions</label>
                  <input
                    type="text"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg text-xs focus:border-[#4D148C] focus:outline-none"
                    placeholder="Gate code, access hours, buzzer"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="submit"
                className="px-8 py-3 bg-[#FF6200] hover:bg-[#E05600] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Schedule Pickup Now
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Recent scheduled pickups */}
      {pickups.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-base font-black text-slate-900 mb-4">Your Scheduled FedEx Pickups</h3>
          <div className="divide-y divide-slate-100">
            {pickups.map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#4D148C]">{p.confirmationCode}</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                      {p.status}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-0.5">
                    {p.sender.address}, {p.sender.city} · {p.packageCount} pkgs ({p.totalWeight} lbs)
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-slate-900 block">{p.pickupDate}</span>
                  <span className="text-slate-500 font-mono">{p.readyTime} - {p.closingTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
