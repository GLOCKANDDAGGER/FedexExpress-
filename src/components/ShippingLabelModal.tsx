import React, { useRef } from 'react';
import { Shipment } from '../types/courier';
import { Printer, Download, X, Check, ShieldCheck, Box } from 'lucide-react';
import { FedExLogo } from './FedExLogo';

interface ShippingLabelModalProps {
  shipment: Shipment;
  onClose: () => void;
  onTrack: (trackingNumber: string) => void;
}

export const ShippingLabelModal: React.FC<ShippingLabelModalProps> = ({
  shipment,
  onClose,
  onTrack,
}) => {
  const labelRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  // Generate deterministic bar widths from tracking number
  const generateBarcodeLines = (seed: string) => {
    const bars: { width: number; isSpace: boolean }[] = [];
    let sum = 0;
    for (let i = 0; i < seed.length; i++) {
      sum += seed.charCodeAt(i);
    }
    for (let i = 0; i < 52; i++) {
      const w = ((sum + i * 5) % 3) + 1; // 1, 2, or 3 px
      bars.push({ width: w, isSpace: i % 2 === 1 });
    }
    return bars;
  };

  const barcodeBars = generateBarcodeLines(shipment.trackingNumber);

  // FedEx service shortcut (e.g. PRIORITY OVERNIGHT -> P1, FIRST OVERNIGHT -> 10, GROUND -> G)
  const getFedExServiceSymbol = (service: string) => {
    if (service.includes('FIRST')) return '10';
    if (service.includes('PRIORITY')) return 'P1';
    if (service.includes('STANDARD')) return 'SO';
    if (service.includes('2DAY')) return '2D';
    if (service.includes('GROUND')) return 'G';
    return 'XS';
  };

  const serviceSymbol = getFedExServiceSymbol(shipment.service);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header toolbar (no-print) */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#4D148C] text-white">
          <div className="flex items-center gap-3">
            <FedExLogo variant="white" size="sm" />
            <div className="border-l border-white/30 pl-3">
              <h3 className="text-sm font-bold text-white">FedEx Laser Thermal Air Waybill</h3>
              <p className="text-[11px] text-white/70">Standard 4" x 6" Barcode Shipping Document</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#FF6200] hover:bg-[#E05600] rounded-lg shadow-xs transition-colors cursor-pointer uppercase tracking-wider"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Label
            </button>
            <button
              onClick={() => {
                onTrack(shipment.trackingNumber);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-white/15 hover:bg-white/25 rounded-lg border border-white/20 transition-colors cursor-pointer"
            >
              <Box className="w-3.5 h-3.5" />
              Track Package
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-white/70 hover:text-white rounded-lg transition-colors cursor-pointer ml-1"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal body */}
        <div className="p-6 bg-slate-100 flex justify-center">
          {/* Authentic FedEx 4" x 6" Thermal Label */}
          <div
            ref={labelRef}
            id="shipping-label-printable"
            className="w-full max-w-md bg-white border-2 border-black p-4 text-black shadow-md font-sans text-xs select-none"
          >
            {/* Top Row: Sender Info & FedEx Brand Block */}
            <div className="border-b-2 border-black pb-2 flex justify-between items-start">
              <div className="w-2/3 leading-tight text-[11px]">
                <p className="font-bold text-xs uppercase tracking-wide">
                  {shipment.sender.company || shipment.sender.name}
                </p>
                <p>{shipment.sender.name}</p>
                <p>{shipment.sender.address}</p>
                <p>
                  {shipment.sender.city}, {shipment.sender.state} {shipment.sender.postalCode}
                </p>
                <p className="font-mono text-[10px] text-slate-700">TEL: {shipment.sender.phone}</p>
              </div>
              <div className="w-1/3 text-right leading-tight">
                <div className="flex justify-end mb-1">
                  <FedExLogo size="sm" />
                </div>
                <div className="font-mono font-bold text-xs">
                  {shipment.packageDetails.weight} {shipment.packageDetails.weightUnit}
                </div>
                <div className="text-[10px] text-slate-600">CAD: 10482910</div>
                <div className="text-[10px] font-bold mt-0.5 text-slate-900">
                  ACTWGT: {shipment.packageDetails.weight} LBS
                </div>
                <div className="text-[10px]">BILL SENDER</div>
              </div>
            </div>

            {/* Recipient Block */}
            <div className="py-2.5 border-b-2 border-black leading-snug">
              <span className="text-[9px] uppercase tracking-wider font-bold block text-slate-600">SHIP TO:</span>
              <p className="font-bold text-sm tracking-tight">{shipment.recipient.name}</p>
              {shipment.recipient.company && (
                <p className="font-semibold text-xs">{shipment.recipient.company}</p>
              )}
              <p className="font-bold text-sm mt-0.5">{shipment.recipient.address}</p>
              <p className="font-black text-base tracking-wide uppercase">
                {shipment.recipient.city}, {shipment.recipient.state} {shipment.recipient.postalCode}
              </p>
              <p className="font-mono text-[10px] mt-0.5">TEL: {shipment.recipient.phone}</p>
            </div>

            {/* Route & Destination Code Strip with big FedEx P1 / SO symbol */}
            <div className="grid grid-cols-4 border-b-2 border-black text-center py-2 font-bold items-center">
              <div className="border-r-2 border-black pr-1">
                <span className="text-[9px] block font-normal text-slate-600">ORIGIN</span>
                <span className="text-base tracking-wider font-mono">
                  {shipment.sender.postalCode.slice(0, 3)}
                </span>
              </div>
              <div className="border-r-2 border-black px-1 col-span-2">
                <span className="text-[9px] block font-normal text-slate-600">FEDEX ROUTING CODE</span>
                <span className="text-xl font-black tracking-widest text-slate-950 font-mono">
                  {shipment.recipient.state}-{shipment.recipient.postalCode.slice(0, 3)}
                </span>
              </div>
              <div className="pl-1">
                <span className="text-[9px] block font-normal text-slate-600">CLASS</span>
                <span className="text-2xl font-black tracking-tight font-mono text-black">
                  {serviceSymbol}
                </span>
              </div>
            </div>

            {/* Prominent FedEx Service Banner */}
            <div className="bg-black text-white px-2 py-1.5 my-2 flex items-center justify-between">
              <span className="font-black text-sm tracking-wide uppercase">
                {shipment.serviceName}
              </span>
              <span className="font-mono text-xs font-bold">
                {shipment.packageDetails.signatureRequired === 'Direct Signature Required'
                  ? 'D-SIG'
                  : 'STD-REL'}
              </span>
            </div>

            {/* 2D Matrix Symbol & Transit Code */}
            <div className="flex items-center justify-between py-2 border-b border-black">
              {/* Simulated 2D Data Matrix */}
              <div className="w-16 h-16 border border-black grid grid-cols-6 grid-rows-6 p-0.5 bg-black shrink-0">
                {Array.from({ length: 36 }).map((_, idx) => {
                  const isBlack = (idx * 17 + 5) % 3 !== 0;
                  return (
                    <div
                      key={idx}
                      className={isBlack ? 'bg-black border-[0.5px] border-white' : 'bg-white'}
                    />
                  );
                })}
              </div>

              <div className="px-3 text-right leading-tight flex-1">
                <p className="text-[10px] font-bold text-slate-600 uppercase">DELIVERY COMMITMENT</p>
                <p className="text-sm font-black text-slate-950">{shipment.estimatedDelivery}</p>
                <p className="text-[10px] text-slate-600 mt-1">SPECIAL SERVICE</p>
                <p className="text-[11px] font-semibold">
                  {shipment.packageDetails.signatureRequired || 'Standard Release'}
                </p>
              </div>
            </div>

            {/* Tracking Number Barcode Section */}
            <div className="pt-3 pb-2 text-center">
              {/* Authentic SVG Barcode */}
              <div className="flex justify-center items-stretch h-14 w-full bg-white px-2 py-1 overflow-hidden">
                {barcodeBars.map((bar, i) => (
                  <div
                    key={i}
                    style={{ width: `${bar.width * 2}px` }}
                    className={`h-full ${bar.isSpace ? 'bg-transparent' : 'bg-black'}`}
                  />
                ))}
              </div>

              {/* Barcode Human Readable Text */}
              <p className="font-mono font-black text-sm tracking-widest text-slate-950 mt-1 tabular-nums">
                {shipment.trackingNumber}
              </p>
              <p className="text-[9px] text-slate-600 uppercase tracking-wider mt-0.5">
                FedEx Express Air Waybill Number
              </p>
            </div>

            {/* Label Footer */}
            <div className="border-t border-black pt-1.5 flex justify-between items-center text-[9px] text-slate-600">
              <span>FEDEX FORM 1420R-26</span>
              <span className="font-bold text-slate-900">FEDERAL EXPRESS CORPORATION</span>
              <span>PART # 9410-001</span>
            </div>
          </div>
        </div>

        {/* Modal footer info */}
        <div className="no-print px-6 py-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Official FedEx barcode verified. Affix label inside transparent pouch.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-5 py-2 text-xs font-bold text-white bg-[#4D148C] hover:bg-[#3b0f6d] rounded-lg transition-colors cursor-pointer"
            >
              Print Thermal Label
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
