import React from 'react';
import { Shipment } from '../types/courier';
import { Package, Truck, CheckCircle2, AlertCircle, Printer, ArrowRight, Plus, Shield } from 'lucide-react';
import { FedExLogo } from './FedExLogo';

interface MyShipmentsProps {
  shipments: Shipment[];
  onSelectShipment: (shipment: Shipment) => void;
  onPrintLabel: (shipment: Shipment) => void;
  onCreateNew: () => void;
}

export const MyShipments: React.FC<MyShipmentsProps> = ({
  shipments,
  onSelectShipment,
  onPrintLabel,
  onCreateNew,
}) => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <FedExLogo size="md" />
          <div className="border-l border-slate-200 pl-4">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Recent Shipment Records</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Secure parcel ledger. Tracking credentials remain private and protected under privacy protocols.
            </p>
          </div>
        </div>
        <button
          onClick={onCreateNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white bg-[#FF6200] hover:bg-[#E05600] rounded-xl transition-all cursor-pointer shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Create Shipment
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <th className="py-3.5 px-4">Service & Package</th>
                <th className="py-3.5 px-4">Recipient & Destination</th>
                <th className="py-3.5 px-4">Status & Commitment</th>
                <th className="py-3.5 px-4 text-right">Transportation</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {shipments.map((s, idx) => {
                const isDelivered = s.status === 'DELIVERED';
                const isOut = s.status === 'OUT_FOR_DELIVERY';
                const isCustoms = s.status === 'CUSTOMS_CLEARANCE';
                const isPending = s.status === 'PENDING';
                const isGround = s.service === 'GROUND';

                return (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <FedExLogo variant={isGround ? 'ground' : 'express'} size="sm" />
                        <span className="font-bold text-slate-900 text-xs">
                          {s.serviceName}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-700 font-medium mt-0.5">
                        {s.packageDescription || s.packageDetails.description || s.packageDetails.packaging} ({s.packageDetails.weight} lbs)
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                        <Shield className="w-3 h-3 text-slate-400" />
                        <span>Private Consignment ID</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 text-xs">{s.recipient.name}</div>
                      {s.recipient.company && (
                        <div className="text-xs text-slate-600">{s.recipient.company}</div>
                      )}
                      <div className="text-xs text-slate-500 mt-0.5">
                        {s.recipient.city}, {s.recipient.state} {s.recipient.postalCode}
                      </div>
                      {s.sender?.name && (
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          From: {s.sender.name}
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs font-black px-2.5 py-0.5 rounded ${
                            isDelivered
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : isPending
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : isOut
                              ? 'bg-orange-50 text-orange-800 border border-orange-200'
                              : isCustoms
                              ? 'bg-purple-50 text-[#4D148C] border border-purple-200'
                              : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                          }`}
                        >
                          {s.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-900 mt-1">
                        {s.actualDelivery || s.estimatedDelivery}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right font-mono text-sm font-black text-slate-950 tabular-nums">
                      ${s.shippingCharge.toFixed(2)}
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <span className="text-xs text-slate-500 italic">
                        Authorized Access Only
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
