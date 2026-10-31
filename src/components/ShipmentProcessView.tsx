import React, { useState } from 'react';
import { Shipment, TrackingCheckpoint } from '../types/courier';
import {
  X,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Camera,
  Calendar,
  Shield,
  Copy,
  Check,
  Printer,
  ChevronRight,
  Maximize2,
  Info,
  Sliders,
  Send,
  Building,
  User,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { FedExLogo } from './FedExLogo';
import { FedExProgressBar } from './FedExProgressBar';

interface ShipmentProcessViewProps {
  shipment: Shipment;
  onClose?: () => void;
  onPrintLabel?: () => void;
  onUpdateDeliveryInstructions?: (newInstructions: string) => void;
  isEmbeddedInAdmin?: boolean;
}

export const ShipmentProcessView: React.FC<ShipmentProcessViewProps> = ({
  shipment,
  onClose,
  onPrintLabel,
  onUpdateDeliveryInstructions,
  isEmbeddedInAdmin = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [isPhotoExpanded, setIsPhotoExpanded] = useState(false);
  const [isManageDrawerOpen, setIsManageDrawerOpen] = useState(false);

  // Manage Delivery State
  const [selectedHoldLocation, setSelectedHoldLocation] = useState<string>('');
  const [courierInstructionText, setCourierInstructionText] = useState(
    shipment.deliveryInstructions || 'Leave at front reception desk or commercial dock'
  );
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  const copyTracking = () => {
    navigator.clipboard.writeText(shipment.trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDelivered = shipment.status === 'DELIVERED';
  const heroStatusText = shipment.heroStatus || (isDelivered ? 'DELIVERED' : 'ON TIME');

  const deliveryWindowText =
    shipment.actualDelivery || shipment.estimatedDelivery || 'Tomorrow by 10:30 AM';

  const proofPhoto =
    shipment.proofOfDelivery?.proofPhotoUrl ||
    '/src/assets/images/courier_package_delivery_1792291034807.jpg';

  const handleSaveInstructions = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateDeliveryInstructions) {
      onUpdateDeliveryInstructions(courierInstructionText);
    }
    setSaveSuccessMessage('Courier instructions transmitted successfully to delivery route.');
    setTimeout(() => {
      setSaveSuccessMessage(null);
      setIsManageDrawerOpen(false);
    }, 2500);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden font-sans">
      {/* Top Bar in FedEx Purple */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#4D148C] text-white border-b border-[#3b0f6d]">
        <div className="flex items-center gap-3">
          <FedExLogo variant="white" size="sm" />
          <span className="text-white/40">|</span>
          <div className="flex items-center gap-2 font-mono text-sm font-bold tabular-nums">
            <span>{shipment.trackingNumber}</span>
            <button
              onClick={copyTracking}
              title="Copy tracking number"
              className="text-white/70 hover:text-white transition-colors cursor-pointer p-0.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded bg-white/10 text-white/90">
            {shipment.serviceName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onPrintLabel && (
            <button
              type="button"
              onClick={onPrintLabel}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-white/15 hover:bg-white/25 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Airbill</span>
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-white/70 hover:text-white rounded-lg transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 1. THE HERO STATUS: Large, bold top section showing delivery status ("DELIVERED" or "ON TIME"), delivery window, and horizontal progress bar */}
      <div className="bg-slate-50 border-b border-slate-200 p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          {/* Large Bold Delivery Status */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {heroStatusText === 'DELIVERED' ? (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-black text-sm tracking-wider uppercase shadow-sm">
                  <CheckCircle2 className="w-5 h-5 stroke-[3]" />
                  <span>DELIVERED</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-[#4D148C] text-white font-black text-sm tracking-wider uppercase shadow-sm">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6200] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF6200]"></span>
                  </span>
                  <span>ON TIME</span>
                </div>
              )}

              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {shipment.serviceName}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              {shipment.statusMessage || (isDelivered ? 'Delivered - Direct Signature Verified' : 'In Transit - On Schedule')}
            </h1>

            <p className="text-xs text-slate-600 font-medium">
              Standard FedEx Transit Guarantee · Destination: {shipment.recipient.city}, {shipment.recipient.state}
            </p>
          </div>

          {/* Specific Delivery Date/Time Window Box */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm lg:text-right shrink-0 min-w-[280px]">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              {isDelivered ? 'Verified Delivery Timestamp' : 'Scheduled Delivery Window'}
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
              {deliveryWindowText}
            </div>
            <div className="mt-2 flex items-center lg:justify-end gap-2 text-xs">
              <span className={`inline-flex items-center gap-1 font-bold ${isDelivered ? 'text-emerald-700' : 'text-[#4D148C]'}`}>
                {isDelivered ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Signature on File</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-3.5 h-3.5 text-[#FF6200]" />
                    <span>Priority Morning Commitment</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Horizontal Progress Bar Tracking Package Milestones */}
        <div className="mt-6">
          <FedExProgressBar shipment={shipment} />
        </div>
      </div>

      {/* 2 & 3. HORIZONTALLY DESIGNED MAIN WORKSPACE: Travel History (Left) + Action & Evidence Modules (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 bg-[#FBFBFB]">
        {/* LEFT COLUMN: THE TRAVEL HISTORY (Chronological, detailed list documenting every single scan, timestamp, and facility) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#4D148C]" />
              <h2 className="text-base font-black text-slate-900 uppercase tracking-wide">
                Detailed Travel History
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-500 font-mono">
              {shipment.timeline.length} Checkpoints Logged
            </span>
          </div>

          {/* Chronological Checkpoint Stream */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative">
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {shipment.timeline.map((checkpoint, idx) => {
                const isLatest = idx === 0;
                return (
                  <div key={checkpoint.id || idx} className="relative group">
                    {/* Checkpoint Dot */}
                    <div
                      className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 ${
                        isLatest
                          ? isDelivered
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#FF6200] text-white ring-4 ring-orange-100'
                          : 'bg-slate-300 text-slate-600'
                      }`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center flex-wrap gap-2">
                          <span className={`text-sm font-black ${isLatest ? 'text-slate-900' : 'text-slate-800'}`}>
                            {checkpoint.status}
                          </span>
                          {isLatest && (
                            <span className="px-2 py-0.2 rounded text-[10px] font-black uppercase tracking-wider bg-purple-50 text-[#4D148C] border border-purple-200">
                              Latest Activity
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
                          <MapPin className="w-3.5 h-3.5 text-[#FF6200] shrink-0" />
                          <span>{checkpoint.location}</span>
                          <span className="text-slate-300">·</span>
                          <span className="font-mono text-[11px] text-slate-500">
                            {checkpoint.facilityType}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed pt-0.5">
                          {checkpoint.details}
                        </p>
                      </div>

                      <div className="sm:text-right shrink-0">
                        <span className="font-mono text-xs font-bold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100 tabular-nums inline-block">
                          {checkpoint.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Origin & Destination Route Summary Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <span className="text-[10px] font-black text-[#4D148C] uppercase tracking-wider block mb-1">
                Ship From (Shipper)
              </span>
              <p className="text-xs font-black text-slate-900">{shipment.sender.name}</p>
              {shipment.sender.company && (
                <p className="text-xs text-slate-600">{shipment.sender.company}</p>
              )}
              <p className="text-xs text-slate-500 mt-1">{shipment.sender.address}</p>
              <p className="text-xs text-slate-500">
                {shipment.sender.city}, {shipment.sender.state} {shipment.sender.postalCode}
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <span className="text-[10px] font-black text-[#FF6200] uppercase tracking-wider block mb-1">
                Ship To (Recipient)
              </span>
              <p className="text-xs font-black text-slate-900">{shipment.recipient.name}</p>
              {shipment.recipient.company && (
                <p className="text-xs text-slate-600">{shipment.recipient.company}</p>
              )}
              <p className="text-xs text-slate-500 mt-1">{shipment.recipient.address}</p>
              <p className="text-xs text-slate-500">
                {shipment.recipient.city}, {shipment.recipient.state} {shipment.recipient.postalCode}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTION & EVIDENCE MODULES (Side panels with proof-of-delivery photos and purple Manage Delivery button) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Action Module: Purple "Manage Delivery" Button & Interactive Panel */}
          <div className="bg-white rounded-2xl border border-purple-200 p-5 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#4D148C] text-white rounded-lg">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-[#4D148C] uppercase tracking-wider">
                    FedEx Delivery Manager®
                  </h3>
                  <span className="text-[11px] text-slate-500 block">
                    Active Delivery Controls & Options
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              Need to customize this drop-off? Use the purple button below to leave specific courier instructions, reroute to a retail center, or schedule holds.
            </p>

            {/* THE PURPLE "MANAGE DELIVERY" BUTTON */}
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setIsManageDrawerOpen(!isManageDrawerOpen)}
                className="w-full py-3 px-4 bg-[#4D148C] hover:bg-[#3b0f6d] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#4D148C]"
              >
                <Sliders className="w-4 h-4 text-[#FF6200]" />
                <span>Manage Delivery</span>
                <ChevronRight className={`w-4 h-4 transition-transform ${isManageDrawerOpen ? 'rotate-90' : ''}`} />
              </button>
            </div>

            {/* Interactive Manage Delivery Drawer */}
            {isManageDrawerOpen && (
              <form onSubmit={handleSaveInstructions} className="mt-4 pt-4 border-t border-slate-200 space-y-4 animate-in fade-in duration-150 text-xs">
                {saveSuccessMessage && (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{saveSuccessMessage}</span>
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                    Specific Courier Drop-Off Instructions
                  </label>
                  <textarea
                    rows={2}
                    value={courierInstructionText}
                    onChange={(e) => setCourierInstructionText(e.target.value)}
                    placeholder="e.g. Leave at side porch, ring bell #402, deliver to reception desk..."
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:border-[#4D148C] focus:outline-none"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {['Front Door', 'Side Gate', 'Reception Desk', 'Security Dock'].map((tag) => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => setCourierInstructionText(`Leave at ${tag}`)}
                        className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-[#4D148C] transition-colors cursor-pointer"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                    Hold at Location / Retail Center
                  </label>
                  <select
                    value={selectedHoldLocation}
                    onChange={(e) => setSelectedHoldLocation(e.target.value)}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="">Deliver to original recipient address</option>
                    <option value="walgreens">Hold at Walgreens (151 N State St, 0.6 mi)</option>
                    <option value="office">Hold at FedEx Office Print & Ship (55 E Monroe, 1.2 mi)</option>
                    <option value="center">Hold at FedEx Ship Center (120 S LaSalle St, 0.4 mi)</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setIsManageDrawerOpen(false)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 font-bold text-xs uppercase tracking-wider text-white bg-[#FF6200] hover:bg-[#E05600] rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Save Instructions</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Evidence Module: Proof-of-Delivery Photos & Official Signature */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#FF6200]" />
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Proof of Delivery Photo & Signature
                </h3>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                Verified
              </span>
            </div>

            {/* Proof-of-Delivery Photo Frame */}
            <div className="relative rounded-xl overflow-hidden border border-slate-200 group bg-slate-900">
              <img
                src={proofPhoto}
                alt="FedEx Delivery Evidence Confirmation"
                className="w-full h-48 sm:h-52 object-cover transition-transform duration-300 group-hover:scale-102"
              />

              {/* Courier Scanner HUD Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none p-3 flex flex-col justify-between text-white">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                  <span className="bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
                    CAM: COURIER_OPTIC_04
                  </span>
                  <span className="bg-emerald-600/90 px-2 py-0.5 rounded">
                    GPS LOCKED
                  </span>
                </div>

                <div className="text-[10px] font-mono leading-tight space-y-0.5">
                  <p className="font-bold text-white">
                    LOCATION: {shipment.proofOfDelivery?.locationDescription || 'Front Doorstep / Reception'}
                  </p>
                  <p className="text-white/80">
                    SCAN TIMESTAMP: {shipment.proofOfDelivery?.timestamp || deliveryWindowText}
                  </p>
                </div>
              </div>

              {/* Click to expand button */}
              <button
                type="button"
                onClick={() => setIsPhotoExpanded(true)}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer z-10"
                title="Enlarge Delivery Photo"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Signature Box */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Signed By:</span>
                <span className="font-black text-slate-900 font-mono">
                  {shipment.proofOfDelivery?.signedBy || shipment.recipient.name}
                </span>
              </div>

              <div className="border border-dashed border-slate-300 rounded bg-white h-12 flex items-center justify-center">
                <span className="font-serif italic text-lg text-slate-800 tracking-wider">
                  {shipment.proofOfDelivery?.signedBy || shipment.recipient.name}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 text-center">
                Official courier touch scanner electronic signature capture
              </p>
            </div>
          </div>

          {/* Module: Package Specifications & Cargo Facts */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs">
            <h3 className="font-black text-slate-900 uppercase tracking-wider text-[11px] pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Package Specifications & Cargo</span>
              <span className="font-mono text-[#4D148C] font-bold">${shipment.shippingCharge.toFixed(2)} USD</span>
            </h3>

            {(shipment.packageDescription || shipment.packageDetails.description) && (
              <div className="p-2.5 bg-purple-50/60 rounded-lg border border-purple-100 text-slate-900 font-semibold text-xs">
                📦 {shipment.packageDescription || shipment.packageDetails.description}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-slate-600">
              <div>
                <span className="block text-slate-400 text-[10px]">WEIGHT</span>
                <span className="font-mono font-bold text-slate-800">
                  {shipment.packageDetails.weight} {shipment.packageDetails.weightUnit}
                </span>
              </div>
              <div>
                <span className="block text-slate-400 text-[10px]">DIMENSIONS</span>
                <span className="font-mono font-bold text-slate-800">
                  {shipment.packageDetails.dimensions.length}×{shipment.packageDetails.dimensions.width}×{shipment.packageDetails.dimensions.height} in
                </span>
              </div>
              <div>
                <span className="block text-slate-400 text-[10px]">PACKAGING</span>
                <span className="font-bold text-slate-800">{shipment.packageDetails.packaging}</span>
              </div>
              <div>
                <span className="block text-slate-400 text-[10px]">SIGNATURE</span>
                <span className="font-bold text-slate-800">
                  {shipment.packageDetails.signatureRequired || 'Direct Signature'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Photo Lightbox Modal */}
      {isPhotoExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
          <div className="relative max-w-3xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
            <button
              onClick={() => setIsPhotoExpanded(false)}
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-black/50 rounded-full z-20 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={proofPhoto} alt="Delivery Photo Large" className="w-full h-auto max-h-[75vh] object-contain" />
            <div className="p-4 bg-slate-950 text-white text-xs font-mono flex items-center justify-between">
              <span>TRACKING ID: {shipment.trackingNumber}</span>
              <span>VERIFIED COURIER DELIVERY PROOF</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
