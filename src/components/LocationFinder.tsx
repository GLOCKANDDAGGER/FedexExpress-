import React, { useState } from 'react';
import { MapPin, Clock, Phone, Navigation, Search, CheckCircle2, Filter } from 'lucide-react';
import { MOCK_LOCATIONS } from '../data/mockShipments';
import { CourierLocation } from '../types/courier';
import { FedExLogo } from './FedExLogo';

export const LocationFinder: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('Chicago, IL');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedLoc, setSelectedLoc] = useState<CourierLocation>(MOCK_LOCATIONS[0]);

  const filteredLocations = MOCK_LOCATIONS.filter((loc) => {
    if (filterType === 'all') return true;
    if (filterType === 'center') return loc.type === 'Apex Ship Center';
    if (filterType === 'dropbox') return loc.type === 'Apex 24/7 Drop Box';
    if (filterType === 'office') return loc.type === 'Apex Office & Print';
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header banner in FedEx Purple */}
      <div className="bg-[#4D148C] text-white p-6 md:p-8 rounded-2xl border border-[#3b0f6d] shadow-sm">
        <div className="flex items-center gap-3">
          <FedExLogo variant="white" size="md" />
          <span className="text-xs font-black uppercase tracking-widest text-[#FF6200] bg-white/10 px-2.5 py-1 rounded">
            Location Finder
          </span>
        </div>
        <h2 className="text-2xl font-black tracking-tight mt-2">Find FedEx Locations & Drop Boxes</h2>
        <p className="text-sm text-white/80 mt-1">
          Locate thousands of FedEx Ship Centers, 24/7 Drop Boxes, and retail pickup counters at Walgreens and Dollar General.
        </p>

        {/* Search bar inside header */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-2xl">
          <div className="relative flex-1">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="City, State, or ZIP code (e.g. Chicago, IL or 60603)"
              className="w-full pl-10 pr-4 py-3 bg-white text-slate-900 rounded-xl text-sm font-semibold focus:outline-none"
            />
          </div>
          <button
            type="button"
            className="px-6 py-3 bg-[#FF6200] hover:bg-[#E05600] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer shrink-0"
          >
            Find Locations
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            filterType === 'all'
              ? 'bg-[#4D148C] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          All Locations ({MOCK_LOCATIONS.length})
        </button>
        <button
          onClick={() => setFilterType('center')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            filterType === 'center'
              ? 'bg-[#4D148C] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          FedEx Ship Centers
        </button>
        <button
          onClick={() => setFilterType('dropbox')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            filterType === 'dropbox'
              ? 'bg-[#4D148C] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          FedEx 24/7 Drop Boxes
        </button>
        <button
          onClick={() => setFilterType('office')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            filterType === 'office'
              ? 'bg-[#4D148C] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          FedEx Office
        </button>
      </div>

      {/* Main split: Location list & Interactive Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Location Cards */}
        <div className="lg:col-span-5 space-y-3 max-h-[680px] overflow-y-auto pr-1">
          {filteredLocations.map((loc) => {
            const isSelected = selectedLoc.id === loc.id;
            return (
              <div
                key={loc.id}
                onClick={() => setSelectedLoc(loc)}
                className={`p-5 rounded-xl border-2 transition-all cursor-pointer bg-white text-left ${
                  isSelected
                    ? 'border-[#4D148C] shadow-sm ring-2 ring-purple-100'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#4D148C] block">
                      {loc.name.includes('Office') ? 'FedEx Office' : loc.name.includes('Drop Box') ? '24/7 Drop Box' : 'FedEx Ship Center'}
                    </span>
                    <h3 className="text-sm font-black text-slate-900 mt-0.5">{loc.name}</h3>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded shrink-0">
                    {loc.distanceMiles} mi
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-2">{loc.address}</p>
                <p className="text-xs text-slate-600">
                  {loc.city}, {loc.state} {loc.postalCode}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1 font-semibold text-slate-800">
                    <Clock className="w-3.5 h-3.5 text-[#FF6200]" />
                    <span>Cutoff: {loc.latestExpressDrop}</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#4D148C] hover:underline">
                    View Details →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Interactive Map Canvas + Selected Station Detail */}
        <div className="lg:col-span-7 space-y-4">
          {/* Simulated Geographic Radar Map */}
          <div className="relative h-72 sm:h-80 w-full bg-[#1e0738] rounded-2xl overflow-hidden border border-purple-900 shadow-inner p-4 flex flex-col justify-between">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 opacity-15 pointer-events-none">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Interactive Location Markers */}
            <div className="relative w-full h-full">
              {filteredLocations.map((loc, idx) => {
                const positions = [
                  { top: '35%', left: '42%' },
                  { top: '25%', left: '38%' },
                  { top: '48%', left: '48%' },
                  { top: '15%', left: '20%' },
                  { top: '32%', left: '55%' },
                ];
                const pos = positions[idx % positions.length];
                const isSelected = selectedLoc.id === loc.id;

                return (
                  <button
                    key={loc.id}
                    onClick={() => setSelectedLoc(loc)}
                    style={{ top: pos.top, left: pos.left }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full transition-all cursor-pointer z-10 flex items-center justify-center ${
                      isSelected
                        ? 'bg-[#FF6200] text-white ring-4 ring-orange-500/40 scale-125'
                        : 'bg-white text-[#4D148C] hover:scale-110 shadow-md'
                    }`}
                    title={loc.name}
                  >
                    <MapPin className="w-4 h-4 fill-current" />
                  </button>
                );
              })}

              {/* Map Floating HUD */}
              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[11px] px-3 py-1.5 rounded-lg border border-white/20 backdrop-blur-xs font-mono">
                FEDEX METRO COVERAGE: CHICAGO AREA
              </div>
            </div>
          </div>

          {/* Selected Station Detailed Spec Sheet */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#4D148C]">
                  {selectedLoc.name.includes('Office') ? 'FedEx Office' : 'FedEx Express Facility'}
                </span>
                <h3 className="text-lg font-black text-slate-900">{selectedLoc.name}</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  {selectedLoc.address}, {selectedLoc.city}, {selectedLoc.state} {selectedLoc.postalCode}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    `${selectedLoc.address}, ${selectedLoc.city}, ${selectedLoc.state}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#4D148C] hover:bg-[#3b0f6d] rounded-lg transition-colors cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Directions
                </a>
              </div>
            </div>

            {/* Hours & Cutoffs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block font-bold">Hours of Operation</span>
                <p className="font-bold text-slate-900 mt-1">Mon - Fri: {selectedLoc.hours.weekday}</p>
                <p className="text-slate-600 mt-0.5">Sat: {selectedLoc.hours.saturday}</p>
                <p className="text-slate-600">Sun: {selectedLoc.hours.sunday}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block font-bold">Latest Express Dropoff</span>
                <p className="font-mono text-base font-black text-[#FF6200] mt-1">
                  {selectedLoc.latestExpressDrop}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Dispatches same evening to Memphis SuperHub</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block font-bold">Station Contact</span>
                <p className="font-mono font-bold text-slate-900 mt-1">{selectedLoc.phone}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Toll-free customer assistance</p>
              </div>
            </div>

            {/* Available Services */}
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-2">Available Services</span>
              <div className="flex flex-wrap gap-2">
                {selectedLoc.services.map((svc, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-xs text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{svc}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
