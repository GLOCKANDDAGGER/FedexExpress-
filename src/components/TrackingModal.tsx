import React from 'react';
import { Shipment } from '../types/courier';
import { ShipmentProcessView } from './ShipmentProcessView';
import { saveShipmentToStorage } from '../data/mockShipments';

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
}) => {
  const handleUpdateInstructions = (instructions: string) => {
    const updated = { ...shipment, deliveryInstructions: instructions };
    saveShipmentToStorage(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-5xl my-6 animate-in fade-in zoom-in-95 duration-200">
        <ShipmentProcessView
          shipment={shipment}
          onClose={onClose}
          onPrintLabel={onPrintLabel}
          onUpdateDeliveryInstructions={handleUpdateInstructions}
        />
      </div>
    </div>
  );
};
