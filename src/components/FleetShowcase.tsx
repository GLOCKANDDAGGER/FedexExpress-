import React from 'react';
import { Plane, Truck, Zap, Shield, CheckCircle2, Globe2 } from 'lucide-react';
import { FedExLogo } from './FedExLogo';

export const FleetShowcase: React.FC = () => {
  return (
    <section className="py-16 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <FedExLogo size="sm" />
            <span className="text-xs font-black text-[#4D148C] uppercase tracking-widest">
              Global Express Network
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight text-balance">
            Where Now Meets Next: The World on Time
          </h2>
          <p className="text-base text-slate-600 mt-3 leading-relaxed">
            From the Memphis World Hub to 220+ countries and territories, FedEx connects people and possibilities with unmatched overnight speed and precision.
          </p>
        </div>

        {/* Quantified Network Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 sm:p-8 bg-slate-50 rounded-2xl border border-slate-200">
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#4D148C] font-mono tabular-nums">
              99.4%
            </div>
            <div className="text-xs font-bold text-slate-900 mt-1">On-Time Performance</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Across 15M daily express parcels</p>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#FF6200] font-mono tabular-nums">
              680+
            </div>
            <div className="text-xs font-bold text-slate-900 mt-1">Dedicated Cargo Aircraft</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Boeing 777F, 767-300F & MD-11F fleet</p>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#4D148C] font-mono tabular-nums">
              220+
            </div>
            <div className="text-xs font-bold text-slate-900 mt-1">Countries & Territories</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Global customs clearance reach</p>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#008A00] font-mono tabular-nums">
              200k+
            </div>
            <div className="text-xs font-bold text-slate-900 mt-1">Delivery Vehicles</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Including BrightDrop electric vans</p>
          </div>
        </div>

        {/* Bento Grid with Generated Photographic Assets */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Showcase Card: Aviation Hub */}
          <div className="lg:col-span-7 bg-[#1A0B2E] rounded-2xl overflow-hidden border border-purple-900 text-white flex flex-col justify-between shadow-md">
            <div className="relative aspect-16/9 w-full bg-slate-950 overflow-hidden">
              <img
                src="/src/assets/images/hero_courier_fleet_1792291034277.jpg"
                alt="FedEx air cargo fleet and ground apron at Memphis World Hub"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A0B2E] via-[#1A0B2E]/30 to-transparent" />
              <div className="absolute top-4 left-4 bg-[#4D148C]/90 backdrop-blur-xs px-3 py-1 rounded-md text-[11px] font-mono font-bold text-[#FF6200] border border-white/20">
                FEDEX WORLD HUB · MEMPHIS (MEM)
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-3">
              <span className="text-xs font-mono font-bold text-[#FF6200]">01. FEDEX EXPRESS AIR OPERATIONS</span>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                High-Altitude Priority Night Network
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Operating the world's largest all-cargo air fleet, FedEx coordinates hundreds of overnight flights landing simultaneously at the Memphis SuperHub to sort and dispatch millions of packages before dawn.
              </p>
            </div>
          </div>

          {/* Secondary Bento Grid: Sorting & Doorstep Delivery */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {/* Automated Sorting Facility */}
            <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 flex flex-col flex-1 shadow-2xs">
              <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden max-h-48">
                <img
                  src="/src/assets/images/logistics_sorting_hub_1792291034484.jpg"
                  alt="Automated optical laser sorting facility at FedEx distribution hub"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 text-xs font-bold text-white">
                  High-Speed Matrix Sortation (500,000 pkgs/hr)
                </div>
              </div>
              <div className="p-5 space-y-1">
                <span className="text-[11px] font-mono font-bold text-[#4D148C]">02. AUTOMATED SORTATION</span>
                <h4 className="text-base font-bold text-slate-900">Laser Precision Routing</h4>
                <p className="text-xs text-slate-600">
                  Six-sided 3D barcode scanning arrays verify weight, volume, and routing codes in real time with 99.98% scan fidelity.
                </p>
              </div>
            </div>

            {/* Last-Mile Courier Precision */}
            <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 flex flex-col flex-1 shadow-2xs">
              <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden max-h-48">
                <img
                  src="/src/assets/images/courier_package_delivery_1792291034807.jpg"
                  alt="FedEx courier specialist delivering package to customer door"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 text-xs font-bold text-white">
                  Picture Proof of Delivery & Signature
                </div>
              </div>
              <div className="p-5 space-y-1">
                <span className="text-[11px] font-mono font-bold text-[#4D148C]">03. LAST-MILE DELIVERY</span>
                <h4 className="text-base font-bold text-slate-900">FedEx Delivery Specialist</h4>
                <p className="text-xs text-slate-600">
                  Real-time driver location updates, contactless photo confirmations, and electronic recipient signatures.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
