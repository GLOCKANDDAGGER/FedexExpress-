import React, { useState } from 'react';
import { Shipment, TrackingCheckpoint } from '../types/courier';
import {
  X,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  AlertTriangle,
  Printer,
  ChevronRight,
  Shield,
  Copy,
  Check,
  Camera,
} from 'lucide-react';
import { FedExLogo } from './FedExLogo';
import { FedExProgressBar } from './FedExProgressBar';

interface TrackingModalProps {
  shipment: Shipment;
  onClose: () => void;
  onPrintLabel?: () => void;
  onOpenAdmin?: () => void;
}

export const TrackingModal: React.FC<TrackingModalProps> = ({
  shipment,
  onClose,
  onPrintLabel,
  onOpenAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'facts' | 'proof'>('timeline');
  const [copied, setCopied] = useState(false);
  const [holdRequested, setHoldRequested] = useState(false);

  const copyTracking = () => {
    navigator.clipboard.writeText(shipment.trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Top bar in FedEx Purple */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3b0f6d] bg-[#4D148C] text-white">
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
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/70 hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Close tracking view"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Delivery Status Banner */}
        <div className="p-6 bg-slate-50 border-b border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-black text-[#4D148C] uppercase tracking-wide">
                  {shipment.serviceName}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs font-semibold text-slate-500">Standard Transit Guarantee</span>
              </div>
              <h2 className="text-2xl font-black text-slate-950 tracking-tight">
                {shipment.status === 'DELIVERED'
                  ? 'Delivered'
                  : shipment.status === 'OUT_FOR_DELIVERY'
                  ? 'On FedEx Delivery Vehicle'
                  : shipment.status === 'CUSTOMS_CLEARANCE'
                  ? 'Customs Clearance in Progress'
                  : shipment.status === 'IN_TRANSIT'
                  ? 'In Transit'
                  : shipment.status === 'PENDING'
                  ? 'Shipment Pending'
                  : 'Shipment Created'}
              </h2>
              <p className="text-sm text-slate-600 mt-1 font-medium">{shipment.statusMessage}</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs md:text-right shrink-0">
              <span className="text-xs font-bold text-slate-500 block">
                {shipment.status === 'DELIVERED' ? 'Actual Delivery Time' : 'Scheduled Delivery'}
              </span>
              <span className="text-lg font-black text-slate-950 block tracking-tight">
                {shipment.actualDelivery || shipment.estimatedDelivery}
              </span>
              <span className={`text-xs font-bold block mt-0.5 ${shipment.status === 'PENDING' ? 'text-amber-700' : 'text-emerald-700'}`}>
                {shipment.status === 'DELIVERED' ? 'Delivery Verified' : shipment.status === 'PENDING' ? 'Awaiting Package Tender' : 'On Schedule'}
              </span>
            </div>
          </div>

          {/* FedEx Visual Progress Bar Component */}
          <FedExProgressBar shipment={shipment} className="mt-6" />
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 px-6 pt-3 bg-white">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`pb-3 px-3 text-xs font-black transition-colors cursor-pointer border-b-2 uppercase tracking-wider ${
              activeTab === 'timeline'
                ? 'border-[#FF6200] text-[#FF6200]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Travel History ({shipment.timeline.length} Scans)
          </button>
          <button
            onClick={() => setActiveTab('facts')}
            className={`pb-3 px-3 text-xs font-black transition-colors cursor-pointer border-b-2 uppercase tracking-wider ${
              activeTab === 'facts'
                ? 'border-[#FF6200] text-[#FF6200]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Shipment Facts
          </button>
          {shipment.proofOfDelivery && (
            <button
              onClick={() => setActiveTab('proof')}
              className={`pb-3 px-3 text-xs font-black transition-colors cursor-pointer border-b-2 uppercase tracking-wider ${
                activeTab === 'proof'
                  ? 'border-[#FF6200] text-[#FF6200]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Proof of Delivery
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[460px] overflow-y-auto">
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              {/* FedEx Delivery Manager Banner */}
              {shipment.status !== 'DELIVERED' && (
                <div className="p-4 rounded-xl bg-[#4D148C]/5 border border-[#4D148C]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <p className="font-black text-[#4D148C] text-sm">FedEx Delivery Manager®</p>
                    <p className="text-slate-700 mt-0.5">
                      Need to redirect package, request vacation hold, or manage delivery authorization?
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setHoldRequested(!holdRequested)}
                      className="px-3 py-1.5 font-bold text-[#4D148C] bg-white border border-[#4D148C]/30 hover:bg-[#4D148C] hover:text-white rounded-lg shrink-0 transition-colors cursor-pointer"
                    >
                      {holdRequested ? 'Hold Requested ✓' : 'Hold at Location'}
                    </button>
                    {onOpenAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenAdmin();
                        }}
                        className="px-3.5 py-1.5 font-bold text-white bg-[#4D148C] hover:bg-[#3b0f6d] rounded-lg shrink-0 transition-colors cursor-pointer"
                      >
                        Manage Deliveries &rarr;
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Scan checkpoint list */}
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {shipment.timeline.map((scan, idx) => (
                  <div key={scan.id || idx} className="relative group">
                    <div
                      className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center shadow-xs ${
                        idx === 0
                          ? 'bg-[#FF6200] text-white'
                          : 'bg-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{scan.status}</span>
                          <span className="text-xs text-slate-400">·</span>
                          <span className="text-xs font-semibold text-slate-600">{scan.location}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{scan.details}</p>
                      </div>
                      <div className="sm:text-right shrink-0">
                        <span className="font-mono text-xs font-semibold text-slate-500 tabular-nums">
                          {scan.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'facts' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#4D148C] mb-3">
                    Shipper / Origin
                  </h4>
                  <p className="text-sm font-bold text-slate-900">
                    {shipment.sender.company || shipment.sender.name}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">{shipment.sender.address}</p>
                  <p className="text-xs text-slate-600">
                    {shipment.sender.city}, {shipment.sender.state} {shipment.sender.postalCode}
                  </p>
                  <p className="text-xs text-slate-600">{shipment.sender.country}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#4D148C] mb-3">
                    Recipient / Destination
                  </h4>
                  <p className="text-sm font-bold text-slate-900">{shipment.recipient.name}</p>
                  {shipment.recipient.company && (
                    <p className="text-xs text-slate-700 font-medium">{shipment.recipient.company}</p>
                  )}
                  <p className="text-xs text-slate-600 mt-1">{shipment.recipient.address}</p>
                  <p className="text-xs text-slate-600">
                    {shipment.recipient.city}, {shipment.recipient.state} {shipment.recipient.postalCode}
                  </p>
                  <p className="text-xs text-slate-600">{shipment.recipient.country}</p>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#4D148C] mb-3">
                  FedEx Shipment Facts
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block">Service</span>
                    <span className="font-bold text-slate-900 block mt-0.5">
                      {shipment.serviceName}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Weight</span>
                    <span className="font-bold text-slate-900 font-mono block mt-0.5 tabular-nums">
                      {shipment.packageDetails.weight} {shipment.packageDetails.weightUnit}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Dimensions</span>
                    <span className="font-bold text-slate-900 font-mono block mt-0.5 tabular-nums">
                      {shipment.packageDetails.dimensions.length} × {shipment.packageDetails.dimensions.width} × {shipment.packageDetails.dimensions.height} {shipment.packageDetails.dimensions.unit}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Packaging</span>
                    <span className="font-bold text-slate-900 block mt-0.5">
                      {shipment.packageDetails.packaging}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Special Handling</span>
                    <span className="font-bold text-slate-900 block mt-0.5">
                      {shipment.packageDetails.signatureRequired || 'Direct Signature'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Declared Value</span>
                    <span className="font-bold text-slate-900 font-mono block mt-0.5 tabular-nums">
                      ${shipment.packageDetails.declaredValue || 100} USD
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Standard Transit</span>
                    <span className="font-bold text-slate-900 font-mono block mt-0.5 tabular-nums">
                      ${shipment.shippingCharge.toFixed(2)} USD
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Total Pieces</span>
                    <span className="font-bold text-slate-900 block mt-0.5">1 Package</span>
                  </div>
                </div>

                {(shipment.packageDescription || shipment.packageDetails.description) && (
                  <div className="mt-4 pt-3 border-t border-slate-200">
                    <span className="text-[#4D148C] font-bold block text-xs uppercase tracking-wider">
                      Package Description & Commodity Details
                    </span>
                    <p className="text-xs text-slate-900 font-semibold mt-1 p-2.5 bg-purple-50/60 rounded-lg border border-purple-100">
                      {shipment.packageDescription || shipment.packageDetails.description}
                    </p>
                  </div>
                )}

                {shipment.deliveryInstructions && (
                  <div className="mt-4 pt-3 border-t border-slate-200">
                    <span className="text-slate-500 block text-xs">Delivery Instructions</span>
                    <p className="text-xs text-slate-800 font-medium mt-0.5">
                      {shipment.deliveryInstructions}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'proof' && shipment.proofOfDelivery && (
            <div className="space-y-4">
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                <h4 className="text-lg font-black text-slate-900">FedEx Signature Proof of Delivery</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Official Electronic Delivery Confirmation Verification
                </p>

                <div className="max-w-md mx-auto mt-6 bg-white p-5 rounded-lg border border-slate-200 text-left space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Delivered To:</span>
                    <span className="font-bold text-slate-900">{shipment.proofOfDelivery.signedBy}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Delivery Timestamp:</span>
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      {shipment.proofOfDelivery.timestamp}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Location:</span>
                    <span className="font-medium text-slate-900">
                      {shipment.proofOfDelivery.locationDescription}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Status:</span>
                    <span className="font-mono text-emerald-700 font-bold">SIGNED ON COURIER SCANNER</span>
                  </div>

                  {/* Visual Signature box */}
                  <div className="pt-2">
                    <span className="text-slate-400 block text-[10px] uppercase">
                      Courier Scanner Signature Capture
                    </span>
                    <div className="h-16 mt-1 border border-dashed border-slate-300 rounded bg-slate-50 flex items-center justify-center">
                      <span className="font-serif italic text-2xl text-slate-800 tracking-wider">
                        {shipment.proofOfDelivery.signedBy}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {onPrintLabel && (
              <button
                onClick={onPrintLabel}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                View & Print Airbill
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 text-xs font-bold text-white bg-[#4D148C] hover:bg-[#3b0f6d] rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
