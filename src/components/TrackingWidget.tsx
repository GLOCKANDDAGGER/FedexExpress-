import React, { useState } from 'react';
import { Search, ArrowRight, AlertCircle } from 'lucide-react';
import { Shipment } from '../types/courier';

interface TrackingWidgetProps {
  onSearch: (trackingNumber: string) => void;
  recentShipments: Shipment[];
}

export const TrackingWidget: React.FC<TrackingWidgetProps> = ({ onSearch }) => {
  const [inputVal, setInputVal] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) {
      setErrorMsg('Please enter a valid tracking number or reference ID.');
      return;
    }
    setErrorMsg('');
    onSearch(inputVal.trim());
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex flex-col sm:flex-row items-stretch gap-2 bg-white p-2 rounded-xl shadow-md border border-slate-200">
          <div className="relative flex-1 flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="TRACKING ID"
              className="w-full pl-12 pr-4 py-3.5 text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="px-8 py-3.5 bg-[#FF6200] hover:bg-[#E05600] text-white font-black text-sm uppercase tracking-wider rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-[#FF6200]"
          >
            <span>TRACK</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </form>
      <div className="mt-3 flex items-center justify-between text-xs text-white/80">
        <span>Need assistance? Track by reference ID, door tag, or FedEx Office order.</span>
      </div>
    </div>
  );
};
