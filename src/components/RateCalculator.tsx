import React, { useState } from 'react';
import { Clock, Calculator, ArrowRight, ShieldCheck, Check, Info } from 'lucide-react';
import { calculateEstimatedRates } from '../data/mockShipments';
import { RateQuote, ServiceCode } from '../types/courier';
import { FedExLogo } from './FedExLogo';

interface RateCalculatorProps {
  onSelectServiceToShip?: (service: ServiceCode) => void;
}

export const RateCalculator: React.FC<RateCalculatorProps> = ({ onSelectServiceToShip }) => {
  const [originZip, setOriginZip] = useState('10001'); // New York
  const [destZip, setDestZip] = useState('90210'); // Beverly Hills
  const [weightLbs, setWeightLbs] = useState(5.0);
  const [packaging, setPackaging] = useState('FedEx Small Box');
  const [declaredVal, setDeclaredVal] = useState(250);

  const rates: RateQuote[] = calculateEstimatedRates({
    originZip,
    destZip,
    weightLbs,
    packaging,
    declaredVal,
  });

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 md:p-8 bg-[#4D148C] text-white border-b border-[#3b0f6d]">
        <div className="flex items-center gap-3">
          <FedExLogo variant="white" size="md" />
          <span className="text-xs font-black uppercase tracking-widest text-[#FF6200] bg-white/10 px-2.5 py-1 rounded">
            Rate Finder
          </span>
        </div>
        <h2 className="text-2xl font-black tracking-tight mt-2">Calculate FedEx Rates & Transit Times</h2>
        <p className="text-sm text-white/80 mt-1">
          Compare express air and ground delivery commitments with real-time fuel and surcharge transparency.
        </p>
      </div>

      <div className="p-6 md:p-8 space-y-8">
        {/* Input Parameters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-5 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">From (Origin ZIP)</label>
            <input
              type="text"
              value={originZip}
              onChange={(e) => setOriginZip(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white font-mono font-bold focus:border-[#4D148C] focus:outline-none"
              placeholder="e.g. 10001"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">To (Destination ZIP)</label>
            <input
              type="text"
              value={destZip}
              onChange={(e) => setDestZip(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white font-mono font-bold focus:border-[#4D148C] focus:outline-none"
              placeholder="e.g. 90210"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Package Weight (lbs)</label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              max="150"
              value={weightLbs}
              onChange={(e) => setWeightLbs(parseFloat(e.target.value) || 1)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white font-mono font-bold focus:border-[#4D148C] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Packaging</label>
            <select
              value={packaging}
              onChange={(e) => setPackaging(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white font-medium focus:border-[#4D148C] focus:outline-none"
            >
              <option value="FedEx Envelope">FedEx Envelope</option>
              <option value="FedEx Small Box">FedEx Small Box</option>
              <option value="FedEx Medium Box">FedEx Medium Box</option>
              <option value="FedEx Large Box">FedEx Large Box</option>
              <option value="Customer Packaging">Your Box</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Declared Value ($)</label>
            <input
              type="number"
              min="0"
              value={declaredVal}
              onChange={(e) => setDeclaredVal(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white font-mono font-bold focus:border-[#4D148C] focus:outline-none"
            />
          </div>
        </div>

        {/* Results Comparison Matrix */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-black text-slate-900">
              FedEx Delivery Services & Guaranteed Commitments
            </h3>
            <span className="text-xs font-semibold text-slate-500">Commercial & Residential Standard Rates</span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/90 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Service Tier</th>
                  <th className="py-3.5 px-4">Delivery Commitment</th>
                  <th className="py-3.5 px-4 text-right">Base Fare</th>
                  <th className="py-3.5 px-4 text-right">Fuel & Surcharges</th>
                  <th className="py-3.5 px-4 text-right">Total Fare</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {rates.map((rate, idx) => {
                  const isGround = rate.service === 'GROUND';
                  return (
                    <tr
                      key={rate.service}
                      className={`hover:bg-slate-50 transition-colors ${
                        idx === 0 ? 'bg-purple-50/20' : ''
                      }`}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <FedExLogo variant={isGround ? 'ground' : 'express'} size="sm" />
                          <span className="font-bold text-slate-900 text-sm">{rate.name}</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1 line-clamp-1">{rate.description}</div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900">{rate.deliveryDate}</div>
                        <div className="text-xs font-mono font-bold text-[#4D148C] mt-0.5">
                          by {rate.deliveryTime}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-slate-600 tabular-nums whitespace-nowrap">
                        ${rate.baseRate.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-slate-500 text-xs tabular-nums whitespace-nowrap">
                        ${(rate.fuelSurcharge + rate.taxes).toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <span className="font-mono text-base font-black text-slate-950 tabular-nums">
                          ${rate.totalRate.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-normal">USD</span>
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => onSelectServiceToShip && onSelectServiceToShip(rate.service)}
                          className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#4D148C] hover:bg-[#3b0f6d] rounded-lg transition-colors cursor-pointer"
                        >
                          Ship Now
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Money-Back Guarantee Note */}
        <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 flex items-start gap-3 text-xs text-slate-700">
          <ShieldCheck className="w-5 h-5 text-[#4D148C] shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-[#4D148C]">The FedEx Money-Back Guarantee</p>
            <p className="mt-0.5">
              We offer a money-back guarantee for every US express shipment. If your shipment does not arrive by the published commitment time, you may request a full transportation charge credit or refund.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
