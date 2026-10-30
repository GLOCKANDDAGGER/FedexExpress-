export type ShipmentStatus =
  | 'PENDING'
  | 'LABEL_CREATED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CUSTOMS_CLEARANCE';

export type ServiceCode =
  | 'FIRST_OVERNIGHT'
  | 'PRIORITY_OVERNIGHT'
  | 'STANDARD_OVERNIGHT'
  | 'EXPRESS_2DAY'
  | 'EXPRESS_SAVER'
  | 'GROUND'
  | 'FREIGHT_PRIORITY';

export interface ServiceMeta {
  code: ServiceCode;
  name: string;
  tagline: string;
  transitDays: number;
  deliveryTimeFormatted: string;
  badgeColor: string;
}

export interface TrackingCheckpoint {
  id: string;
  timestamp: string;
  dateStr: string;
  timeStr: string;
  status: string;
  location: string;
  details: string;
  facilityType: 'AIRPORT_HUB' | 'LOCAL_FACILITY' | 'SORT_FACILITY' | 'VEHICLE' | 'DOORSTEP';
}

export interface PackageDetails {
  weight: number;
  weightUnit: 'lbs' | 'kg';
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: 'in' | 'cm';
  };
  packaging: 'Apex Envelope' | 'Apex Pak' | 'Small Box' | 'Medium Box' | 'Large Box' | 'Your Packaging';
  declaredValue?: number;
  signatureRequired?: 'No Signature Required' | 'Direct Signature Required' | 'Adult Signature Required';
  specialHandling?: string[];
  description?: string;
}

export interface ShipmentParty {
  name: string;
  company?: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isResidential?: boolean;
}

export interface ProofOfDelivery {
  signedBy: string;
  timestamp: string;
  locationDescription: string;
  signatureSvgDataUrl?: string;
}

export interface Shipment {
  trackingNumber: string;
  service: ServiceCode;
  serviceName: string;
  status: ShipmentStatus;
  statusMessage: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  sender: ShipmentParty;
  recipient: ShipmentParty;
  packageDetails: PackageDetails;
  timeline: TrackingCheckpoint[];
  createdAt: string;
  proofOfDelivery?: ProofOfDelivery;
  shippingCharge: number;
  deliveryInstructions?: string;
  packageDescription?: string;
}

export interface RateQuote {
  service: ServiceCode;
  name: string;
  description: string;
  deliveryDate: string;
  deliveryTime: string;
  baseRate: number;
  fuelSurcharge: number;
  taxes: number;
  totalRate: number;
  guaranteed: boolean;
}

export interface PickupRequest {
  id: string;
  confirmationCode: string;
  pickupDate: string;
  readyTime: string;
  closingTime: string;
  sender: ShipmentParty;
  packageCount: number;
  totalWeight: number;
  locationAtPremises: string;
  specialInstructions?: string;
  status: 'CONFIRMED' | 'DISPATCHED' | 'COMPLETED';
  createdAt: string;
}

export interface CourierLocation {
  id: string;
  name: string;
  type: 'Apex Ship Center' | 'Apex 24/7 Drop Box' | 'Apex Office & Print' | 'Authorized Ship Center';
  address: string;
  city: string;
  state: string;
  postalCode: string;
  distanceMiles: number;
  phone: string;
  hours: {
    weekday: string;
    saturday: string;
    sunday: string;
  };
  latestExpressDrop: string;
  latestGroundDrop: string;
  services: string[];
  lat: number;
  lng: number;
}
