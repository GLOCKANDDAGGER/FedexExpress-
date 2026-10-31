import React from 'react';
import { ActiveTab } from './Header';
import { FedExLogo } from './FedExLogo';
import { Camera } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: ActiveTab) => void;
  onManageDeliveries?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onManageDeliveries }) => {
  return (
    <footer className="bg-[#2A2A2A] text-slate-300 text-xs border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <FedExLogo variant="white" size="lg" />
            </div>
            <p className="text-slate-400 max-w-sm text-xs leading-relaxed">
              Federal Express Corporation. Global express transportation, supply chain management, and e-commerce solutions connecting people and possibilities across six continents.
            </p>
            <div className="pt-2 text-white font-mono text-xs font-bold">
              CUSTOMER SUPPORT: 1.800.GO.FEDEX (1.800.463.3339)
            </div>
          </div>

          {/* Quick Ship */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Shipping Tools</h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => onSelectTab('ship')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Create a Shipment
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('rates')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Rates & Transit Times
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('pickup')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Schedule a Pickup
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('locations')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Find FedEx Locations
                </button>
              </li>
            </ul>
          </div>

          {/* Tracking Services */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Tracking</h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => onSelectTab('track')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Track by Number
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('track')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Package Status & Milestones
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onManageDeliveries}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  FedEx Delivery Manager®
                </button>
              </li>
              <li>
                <span className="text-slate-400">Signature Proof of Delivery</span>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Our Companies</h4>
            <ul className="space-y-1.5">
              <li>
                <span className="text-slate-300 font-semibold">FedEx Express</span>
              </li>
              <li>
                <span className="text-slate-300 font-semibold">FedEx Ground</span>
              </li>
              <li>
                <span className="text-slate-300 font-semibold">FedEx Freight</span>
              </li>
              <li>
                <span className="text-slate-300 font-semibold">FedEx Office</span>
              </li>
            </ul>
          </div>
        </div>

        {/* FedEx Delivery Manager® Section moved down to bottom of the website */}
        <section className="bg-[#1E1E1E] rounded-2xl border border-slate-700/80 p-5 md:p-6 shadow-inner">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 bg-[#4D148C]/50 text-purple-200 rounded-xl border border-purple-500/30 shrink-0">
                <Camera className="w-5 h-5 text-purple-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-white text-sm block tracking-tight">
                    FedEx Delivery Manager®
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950/70 text-purple-300 border border-purple-800/60 uppercase tracking-wider">
                    Residential Services
                  </span>
                </div>
                <p className="text-slate-400 mt-0.5 text-xs">
                  Customize your home deliveries with picture proof of delivery, holiday vacation holds, and neighbor drops.
                </p>
              </div>
            </div>
            {/* Manage Deliveries action button */}
            <button
              type="button"
              onClick={onManageDeliveries}
              className="px-4 py-2 font-bold text-xs uppercase tracking-wider text-purple-200 hover:text-white bg-purple-950/60 hover:bg-[#4D148C] rounded-lg border border-purple-700/50 transition-colors cursor-pointer shrink-0 shadow-sm"
            >
              Manage Deliveries
            </button>
          </div>
        </section>

        {/* Bottom bar with embedded Admin Panel button like the footer of website */}
        <div className="pt-6 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © FedEx 1995–{new Date().getFullYear()}. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span>Global Privacy Policy</span>
            <span>·</span>
            <span>Terms of Use</span>
            <span>·</span>
            <span>Security & Fraud Awareness</span>
            <span>·</span>
            {/* Admin Panel button embedded like the footer */}
            <button
              type="button"
              onClick={onManageDeliveries}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer underline-offset-2 hover:underline"
              title="FedEx Internal Operations Portal"
            >
              Admin Panel
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
