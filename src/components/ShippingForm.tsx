import React, { useState } from 'react';
import {
  Package,
  Truck,
  MapPin,
  Shield,
  CreditCard,
  FileCheck,
  Calendar,
  AlertCircle,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import { Shipment, ServiceCode, ShipmentParty, PackageDetails } from '../types/courier';
import { saveShipmentToStorage } from '../data/mockShipments';
import { FedExLogo } from './FedExLogo';

interface ShippingFormProps {
  onShipmentCreated: (newShipment: Shipment) => void;
}

export const ShippingForm: React.FC<ShippingFormProps> = ({ onShipmentCreated }) => {
  // Sender State
  const [senderName, setSenderName] = useState('Alexander Vance');
  const [senderCompany, setSenderCompany] = useState('Vance Logistics Ltd');
  const [senderAddress, setSenderAddress] = useState('100 Technology Square');
  const [senderCity, setSenderCity] = useState('Cambridge');
  const [senderState, setSenderState] = useState('MA');
  const [senderZip, setSenderZip] = useState('02139');
  const [senderPhone, setSenderPhone] = useState('(617) 555-0199');

  // Recipient State
  const [recipientName, setRecipientName] = useState('Sophia Rodriguez');
  const [recipientCompany, setRecipientCompany] = useState('NextGen Robotics Inc.');
  const [recipientAddress, setRecipientAddress] = useState('742 Market Street, Suite 500');
  const [recipientCity, setRecipientCity] = useState('San Francisco');
  const [recipientState, setRecipientState] = useState('CA');
  const [recipientZip, setRecipientZip] = useState('94102');
  const [recipientPhone, setRecipientPhone] = useState('(415) 555-8321');
  const [isResidential, setIsResidential] = useState(false);

  // Package State
  const [packaging, setPackaging] = useState<PackageDetails['packaging']>('Small Box');
  const [weight, setWeight] = useState<number>(3.5);
  const [length, setLength] = useState<number>(10);
  const [width, setWidth] = useState<number>(8);
  const [height, setHeight] = useState<number>(5);
  const [declaredValue, setDeclaredValue] = useState<number>(250);
  const [signatureReq, setSignatureReq] = useState<
    'No Signature Required' | 'Direct Signature Required' | 'Adult Signature Required'
  >('Direct Signature Required');
  const [specialInstructions, setSpecialInstructions] = useState('Leave at front desk or loading bay');

  // Service Selection
  const [selectedService, setSelectedService] = useState<ServiceCode>('PRIORITY_OVERNIGHT');

  const services: {
    code: ServiceCode;
    name: string;
    subtext: string;
    deliveryTime: string;
    price: number;
    colorVariant: 'express' | 'ground' | 'freight';
  }[] = [
    {
      code: 'FIRST_OVERNIGHT',
      name: 'FedEx First Overnight®',
      subtext: 'Next business day by 8:00 or 8:30 AM',
      deliveryTime: 'Tomorrow 8:00 AM',
      price: Math.min(4000, 3650 + (weight || 1) * 12.0),
      colorVariant: 'express',
    },
    {
      code: 'PRIORITY_OVERNIGHT',
      name: 'FedEx Priority Overnight®',
      subtext: 'Next business day by 10:30 AM to businesses',
      deliveryTime: 'Tomorrow 10:30 AM',
      price: Math.min(3500, 3050 + (weight || 1) * 10.0),
      colorVariant: 'express',
    },
    {
      code: 'STANDARD_OVERNIGHT',
      name: 'FedEx Standard Overnight®',
      subtext: 'Next business day by 4:30 PM to businesses',
      deliveryTime: 'Tomorrow 4:30 PM',
      price: Math.min(2800, 2300 + (weight || 1) * 8.0),
      colorVariant: 'express',
    },
    {
      code: 'EXPRESS_2DAY',
      name: 'FedEx 2Day®',
      subtext: 'Second business day by 4:30 PM',
      deliveryTime: '2 Business Days',
      price: Math.min(2000, 1550 + (weight || 1) * 6.0),
      colorVariant: 'express',
    },
    {
      code: 'GROUND',
      name: 'FedEx Ground®',
      subtext: 'Day-definite delivery in 1-4 business days',
      deliveryTime: '1-4 Business Days',
      price: Math.min(850, 550 + (weight || 1) * 4.5),
      colorVariant: 'ground',
    },
  ];

  const currentServiceMeta = services.find((s) => s.code === selectedService) || services[1];
  const calculatedTotal = currentServiceMeta.price + (signatureReq !== 'No Signature Required' ? 45.0 : 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate authentic FedEx tracking number format
    const randomBlock1 = Math.floor(1000 + Math.random() * 9000);
    const randomBlock2 = Math.floor(1000 + Math.random() * 9000);
    const randomBlock3 = Math.floor(1000 + Math.random() * 9000);
    const trackingNumber = `FDX-${randomBlock1}${randomBlock2}-US`;

    const newShipment: Shipment = {
      trackingNumber,
      service: selectedService,
      serviceName: currentServiceMeta.name,
      status: 'LABEL_CREATED',
      statusMessage: 'Shipment information sent to FedEx. Awaiting carrier package tender.',
      estimatedDelivery: currentServiceMeta.deliveryTime,
      shippingCharge: Number(calculatedTotal.toFixed(2)),
      createdAt: 'Just now',
      deliveryInstructions: specialInstructions,
      sender: {
        name: senderName,
        company: senderCompany,
        address: senderAddress,
        city: senderCity,
        state: senderState,
        postalCode: senderZip,
        country: 'United States',
        phone: senderPhone,
      },
      recipient: {
        name: recipientName,
        company: recipientCompany,
        address: recipientAddress,
        city: recipientCity,
        state: recipientState,
        postalCode: recipientZip,
        country: 'United States',
        phone: recipientPhone,
        isResidential,
      },
      packageDetails: {
        weight: Number(weight) || 1,
        weightUnit: 'lbs',
        dimensions: {
          length: Number(length) || 10,
          width: Number(width) || 8,
          height: Number(height) || 4,
          unit: 'in',
        },
        packaging,
        declaredValue: Number(declaredValue) || 100,
        signatureRequired: signatureReq,
      },
      timeline: [
        {
          id: `scan-${Date.now()}`,
          timestamp: 'Just now',
          dateStr: 'Oct 17, 2026',
          timeStr: 'Just now',
          status: 'Shipment Information Sent to FedEx',
          location: `${senderCity}, ${senderState}`,
          details: 'Airbill created and FedEx bar code assigned.',
          facilityType: 'LOCAL_FACILITY',
        },
      ],
    };

    saveShipmentToStorage(newShipment);
    onShipmentCreated(newShipment);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 md:p-8 border-b border-[#3b0f6d] bg-[#4D148C] text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <FedExLogo variant="white" size="md" />
              <span className="text-xs font-black uppercase tracking-widest text-[#FF6200] bg-white/10 px-2.5 py-1 rounded">
                Ship Manager
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight mt-2">Create a Shipment</h2>
            <p className="text-sm text-white/80 mt-1">
              Prepare labels, calculate exact postage, and schedule pickup with FedEx Express or FedEx Ground.
            </p>
          </div>
          <div className="text-xs text-white/90 bg-black/25 px-4 py-3 rounded-xl border border-white/15">
            <span className="font-bold text-white block">Official FedEx Laser Airbill</span>
            <p className="text-white/70 mt-0.5">Prints standard 4" x 6" thermal barcode for seamless tender</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
        {/* Addresses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FROM */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <MapPin className="w-4 h-4 text-[#4D148C]" />
              <h3 className="font-black text-sm text-[#4D148C] uppercase tracking-wider">
                1. From (Shipper)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Name *</label>
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-[#4D148C] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company (Optional)</label>
                <input
                  type="text"
                  value={senderCompany}
                  onChange={(e) => setSenderCompany(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-[#4D148C] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Street Address *</label>
              <input
                type="text"
                required
                value={senderAddress}
                onChange={(e) => setSenderAddress(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-[#4D148C] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={senderCity}
                  onChange={(e) => setSenderCity(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-[#4D148C] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">State *</label>
                <input
                  type="text"
                  required
                  maxLength={2}
                  value={senderState}
                  onChange={(e) => setSenderState(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-[#4D148C] focus:outline-none uppercase font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ZIP Code *</label>
                <input
                  type="text"
                  required
                  value={senderZip}
                  onChange={(e) => setSenderZip(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-[#4D148C] focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
              <input
                type="text"
                required
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-[#4D148C] focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* TO */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <MapPin className="w-4 h-4 text-[#FF6200]" />
              <h3 className="font-black text-sm text-[#FF6200] uppercase tracking-wider">
                2. Ship To (Recipient)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Recipient Name *</label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-[#4D148C] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company (Optional)</label>
                <input
                  type="text"
                  value={recipientCompany}
                  onChange={(e) => setRecipientCompany(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-[#4D148C] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Street Address *</label>
              <input
                type="text"
                required
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-[#4D148C] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={recipientCity}
                  onChange={(e) => setRecipientCity(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-[#4D148C] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">State *</label>
                <input
                  type="text"
                  required
                  maxLength={2}
                  value={recipientState}
                  onChange={(e) => setRecipientState(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-[#4D148C] focus:outline-none uppercase font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ZIP Code *</label>
                <input
                  type="text"
                  required
                  value={recipientZip}
                  onChange={(e) => setRecipientZip(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-[#4D148C] focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-700 mb-1">Recipient Phone *</label>
                <input
                  type="text"
                  required
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-[#4D148C] focus:outline-none font-mono"
                />
              </div>
              <div className="pt-5">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={isResidential}
                    onChange={(e) => setIsResidential(e.target.checked)}
                    className="w-4 h-4 text-[#4D148C] rounded border-slate-300 focus:ring-[#4D148C]"
                  />
                  <span>Residential Address</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Package Specifications */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <Package className="w-4 h-4 text-[#4D148C]" />
            <h3 className="font-black text-sm text-[#4D148C] uppercase tracking-wider">
              3. Packaging & Dimensions
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Packaging Type</label>
              <select
                value={packaging}
                onChange={(e) => setPackaging(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-[#4D148C] focus:outline-none bg-white font-medium"
              >
                <option value="Apex Envelope">FedEx Envelope (up to 1 lb)</option>
                <option value="Apex Pak">FedEx Pak (up to 5.5 lbs)</option>
                <option value="Small Box">FedEx Small Box (up to 20 lbs)</option>
                <option value="Medium Box">FedEx Medium Box (up to 20 lbs)</option>
                <option value="Large Box">FedEx Large Box (up to 30 lbs)</option>
                <option value="Your Packaging">Customer Packaging</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Weight (lbs) *</label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="150"
                required
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 1)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-[#4D148C] focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Dimensions (L × W × H in)</label>
              <div className="grid grid-cols-3 gap-1">
                <input
                  type="number"
                  min="1"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value) || 1)}
                  className="px-2 py-2 text-xs border border-slate-300 rounded-lg text-center font-mono"
                  placeholder="L"
                />
                <input
                  type="number"
                  min="1"
                  value={width}
                  onChange={(e) => setWidth(parseInt(e.target.value) || 1)}
                  className="px-2 py-2 text-xs border border-slate-300 rounded-lg text-center font-mono"
                  placeholder="W"
                />
                <input
                  type="number"
                  min="1"
                  value={height}
                  onChange={(e) => setHeight(parseInt(e.target.value) || 1)}
                  className="px-2 py-2 text-xs border border-slate-300 rounded-lg text-center font-mono"
                  placeholder="H"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Declared Value (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-slate-400 font-mono">$</span>
                <input
                  type="number"
                  min="0"
                  value={declaredValue}
                  onChange={(e) => setDeclaredValue(parseInt(e.target.value) || 0)}
                  className="w-full pl-6 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-[#4D148C] focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Special Handling / Signature</label>
              <select
                value={signatureReq}
                onChange={(e) => setSignatureReq(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-[#4D148C] focus:outline-none bg-white font-medium"
              >
                <option value="No Signature Required">No Signature Required</option>
                <option value="Direct Signature Required">FedEx Direct Signature Required (+ $5.50)</option>
                <option value="Adult Signature Required">FedEx Adult Signature Required (+ $7.50)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Driver Delivery Instructions</label>
              <input
                type="text"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Leave at front porch, dock door #2"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-[#4D148C] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Speed & Service Selection */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#4D148C]" />
              <h3 className="font-black text-sm text-[#4D148C] uppercase tracking-wider">
                4. Select FedEx Service
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-500">Guaranteed delivery commitments</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {services.map((svc) => {
              const isSelected = selectedService === svc.code;
              return (
                <div
                  key={svc.code}
                  onClick={() => setSelectedService(svc.code)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-left relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#4D148C] bg-purple-50/40 shadow-sm ring-1 ring-[#4D148C]/30'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-1.5">
                        <FedExLogo variant={svc.colorVariant} size="sm" />
                      </div>
                      <span className="font-mono text-base font-black text-slate-950 tabular-nums">
                        ${svc.price.toFixed(2)}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 mt-1">{svc.name}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">{svc.subtext}</p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold">
                    <span className="text-[#4D148C]">{svc.deliveryTime}</span>
                    <span className={`text-[11px] ${isSelected ? 'text-[#FF6200]' : 'text-slate-400'}`}>
                      {isSelected ? 'SELECTED ✓' : 'SELECT'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Checkout & Submit Bar */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 -mx-6 md:-mx-8 -mb-6 md:-mb-8 p-6 md:p-8">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Total Transportation:</span>
              <span className="font-mono text-2xl font-black text-slate-950 tabular-nums">
                ${calculatedTotal.toFixed(2)} USD
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Includes fuel surcharge and signature protection</p>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#FF6200] hover:bg-[#E05600] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#FF6200]"
          >
            <FileCheck className="w-4 h-4" />
            <span>Generate FedEx Label & Book</span>
          </button>
        </div>
      </form>
    </div>
  );
};
