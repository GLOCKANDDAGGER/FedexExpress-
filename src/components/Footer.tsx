import React from 'react';
import { ActiveTab } from './Header';
import { FedExLogo } from './FedExLogo';

interface FooterProps {
  onSelectTab: (tab: ActiveTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
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
                  onClick={() => onSelectTab('myshipments')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  My Shipment History
                </button>
              </li>
              <li>
                <span className="text-slate-400">FedEx Delivery Manager®</span>
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

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © FedEx 1995–{new Date().getFullYear()}. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Global Privacy Policy</span>
            <span>·</span>
            <span>Terms of Use</span>
            <span>·</span>
            <span>Security & Fraud Awareness</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
