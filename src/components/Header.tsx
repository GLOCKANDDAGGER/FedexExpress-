import React from 'react';
import { FedExLogo } from './FedExLogo';

export type ActiveTab = 'track' | 'ship' | 'rates' | 'pickup' | 'locations' | 'myshipments';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  shipmentCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  shipmentCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#4D148C] text-white shadow-md border-b border-[#3b0f6d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Single Brand Wordmark */}
        <button
          onClick={() => onSelectTab('track')}
          className="whitespace-nowrap shrink-0 flex items-center cursor-pointer select-none text-left py-1"
          aria-label="FedEx Home"
        >
          <div className="font-black text-3xl tracking-tighter text-white inline-flex items-center">
            <span className="text-white">Fed</span>
            <span className="text-[#FF6200]">Ex</span>
          </div>
        </button>

        {/* Zone 2: 4-5 Clean Nav Links - Pure FedEx Website (Zero Admin Traces) */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-bold text-white/90">
          <button
            onClick={() => onSelectTab('track')}
            className={`whitespace-nowrap shrink-0 transition-all py-1.5 cursor-pointer ${
              activeTab === 'track'
                ? 'text-[#FF6200] border-b-2 border-[#FF6200]'
                : 'hover:text-white hover:opacity-100 opacity-90'
            }`}
          >
            Tracking
          </button>
          <button
            onClick={() => onSelectTab('ship')}
            className={`whitespace-nowrap shrink-0 transition-all py-1.5 cursor-pointer ${
              activeTab === 'ship'
                ? 'text-[#FF6200] border-b-2 border-[#FF6200]'
                : 'hover:text-white hover:opacity-100 opacity-90'
            }`}
          >
            Shipping & Label
          </button>
          <button
            onClick={() => onSelectTab('rates')}
            className={`whitespace-nowrap shrink-0 transition-all py-1.5 cursor-pointer ${
              activeTab === 'rates'
                ? 'text-[#FF6200] border-b-2 border-[#FF6200]'
                : 'hover:text-white hover:opacity-100 opacity-90'
            }`}
          >
            Rates & Transit
          </button>
          <button
            onClick={() => onSelectTab('pickup')}
            className={`whitespace-nowrap shrink-0 transition-all py-1.5 cursor-pointer ${
              activeTab === 'pickup'
                ? 'text-[#FF6200] border-b-2 border-[#FF6200]'
                : 'hover:text-white hover:opacity-100 opacity-90'
            }`}
          >
            Schedule Pickup
          </button>
          <button
            onClick={() => onSelectTab('locations')}
            className={`whitespace-nowrap shrink-0 transition-all py-1.5 cursor-pointer ${
              activeTab === 'locations'
                ? 'text-[#FF6200] border-b-2 border-[#FF6200]'
                : 'hover:text-white hover:opacity-100 opacity-90'
            }`}
          >
            Locations
          </button>
          <button
            onClick={() => onSelectTab('myshipments')}
            className={`whitespace-nowrap shrink-0 transition-all py-1.5 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'myshipments'
                ? 'text-[#FF6200] border-b-2 border-[#FF6200]'
                : 'hover:text-white hover:opacity-100 opacity-90'
            }`}
          >
            My Shipments
            {shipmentCount > 0 && (
              <span className="text-[11px] font-mono font-bold text-[#4D148C] bg-white rounded-full px-2 py-0.2">
                {shipmentCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('ship')}
            className="px-5 py-2.5 text-xs font-black tracking-wider uppercase text-white bg-[#FF6200] hover:bg-[#E05600] rounded-full shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
          >
            Ship Now
          </button>
        </div>
      </div>
    </header>
  );
};
