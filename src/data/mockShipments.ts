import { Shipment, CourierLocation, PickupRequest, RateQuote, ServiceCode } from '../types/courier';

export const INITIAL_SHIPMENTS: Shipment[] = [
  {
    trackingNumber: '7849 5521 9012',
    service: 'PRIORITY_OVERNIGHT',
    serviceName: 'FedEx Priority Overnight®',
    status: 'PENDING',
    statusMessage: 'Shipment Pending - Shipping data transmitted; awaiting package tender from shipper',
    estimatedDelivery: 'Pending tender - Next business day after tender',
    sender: {
      name: 'Daniella Lam',
      company: 'Lam Diagnostics & Bioresearch',
      address: '742 Evergreen Terrace, Suite 400',
      city: 'Springfield',
      state: 'OR',
      postalCode: '97477',
      country: 'United States',
      phone: '(541) 555-0199',
    },
    recipient: {
      name: 'Dr. Marcus Vance',
      company: 'Northwestern Medical Research',
      address: '710 N Lake Shore Drive',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60611',
      country: 'United States',
      phone: '(312) 555-0899',
      isResidential: false,
    },
    packageDetails: {
      weight: 6.8,
      weightUnit: 'lbs',
      dimensions: { length: 14, width: 10, height: 6, unit: 'in' },
      packaging: 'Medium Box',
      declaredValue: 1850,
      signatureRequired: 'Direct Signature Required',
      specialHandling: ['Bio-Specimen Research Materials', 'Pending Courier Tender', 'Temperature Stabilized 2°C - 8°C'],
      description: 'Clinical Diagnostics Assay Kits & Laboratory Reagent Assays',
    },
    packageDescription: 'Clinical Diagnostics Assay Kits & Laboratory Reagent Assays',
    shippingCharge: 2950.00,
    createdAt: 'Today, 09:30 AM',
    deliveryInstructions: 'Deliver to 4th floor receiving laboratory. Direct signature required upon tender & arrival.',
    timeline: [
      {
        id: 'chk-dl-1',
        timestamp: 'Today, 09:30 AM',
        dateStr: 'Today',
        timeStr: '09:30 AM',
        status: 'Shipment Information Created - Pending Tender',
        location: 'Springfield, OR',
        details: 'Shipping documentation and electronic manifest created by Daniella Lam. Package tender pending carrier pickup.',
        facilityType: 'LOCAL_FACILITY',
      },
    ],
  },
  {
    trackingNumber: 'FDX-98214-US',
    service: 'PRIORITY_OVERNIGHT',
    serviceName: 'FedEx Priority Overnight®',
    status: 'OUT_FOR_DELIVERY',
    statusMessage: 'On FedEx vehicle for delivery by 10:30 AM',
    estimatedDelivery: 'Today by 10:30 AM',
    sender: {
      name: 'Elena Rostova',
      company: 'Quantum Diagnostics Corp',
      address: '450 Innovation Parkway, Suite 300',
      city: 'Boston',
      state: 'MA',
      postalCode: '02110',
      country: 'United States',
      phone: '(617) 555-0142',
    },
    recipient: {
      name: 'Dr. Marcus Vance',
      company: 'Northwestern Medical Research',
      address: '710 N Lake Shore Drive',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60611',
      country: 'United States',
      phone: '(312) 555-0899',
      isResidential: false,
    },
    packageDetails: {
      weight: 4.2,
      weightUnit: 'lbs',
      dimensions: { length: 12, width: 9, height: 4, unit: 'in' },
      packaging: 'Small Box',
      declaredValue: 1250,
      signatureRequired: 'Direct Signature Required',
      specialHandling: ['Temperature Protected 2°C - 8°C', 'Priority Airfreight'],
    },
    shippingCharge: 3150.00,
    createdAt: 'Yesterday, 4:15 PM',
    deliveryInstructions: 'Deliver to 4th floor receiving dock. Ring bell #402.',
    timeline: [
      {
        id: 'chk-1',
        timestamp: 'Today, 07:18 AM',
        dateStr: 'Oct 17, 2026',
        timeStr: '07:18 AM',
        status: 'On FedEx Vehicle for Delivery',
        location: 'Chicago, IL (Central Hub)',
        details: 'Package loaded onto FedEx delivery vehicle; driver en route.',
        facilityType: 'VEHICLE',
      },
      {
        id: 'chk-2',
        timestamp: 'Today, 05:42 AM',
        dateStr: 'Oct 17, 2026',
        timeStr: '05:42 AM',
        status: 'At Local FedEx Facility',
        location: 'Chicago, IL',
        details: 'Sorted to local delivery route. Package scanned and verified.',
        facilityType: 'LOCAL_FACILITY',
      },
      {
        id: 'chk-3',
        timestamp: 'Today, 02:15 AM',
        dateStr: 'Oct 17, 2026',
        timeStr: '02:15 AM',
        status: 'Departed FedEx SuperHub',
        location: 'Memphis, TN',
        details: 'Flight FDX-391 departed on time to Chicago O\'Hare (ORD).',
        facilityType: 'AIRPORT_HUB',
      },
      {
        id: 'chk-4',
        timestamp: 'Yesterday, 11:30 PM',
        dateStr: 'Oct 16, 2026',
        timeStr: '11:30 PM',
        status: 'Arrived at FedEx SuperHub',
        location: 'Memphis, TN',
        details: 'Automated laser optical sort scan complete.',
        facilityType: 'SORT_FACILITY',
      },
      {
        id: 'chk-5',
        timestamp: 'Yesterday, 04:15 PM',
        dateStr: 'Oct 16, 2026',
        timeStr: '04:15 PM',
        status: 'Picked Up by FedEx Courier',
        location: 'Boston, MA',
        details: 'Picked up from sender location by FedEx courier.',
        facilityType: 'DOORSTEP',
      },
    ],
  },
  {
    trackingNumber: 'FDX-41092-EXP',
    service: 'FIRST_OVERNIGHT',
    serviceName: 'FedEx First Overnight®',
    status: 'DELIVERED',
    statusMessage: 'Delivered - Signed for by S. JENKINS',
    estimatedDelivery: 'Oct 16, 2026 by 8:30 AM',
    actualDelivery: 'Oct 16, 2026 at 8:14 AM',
    sender: {
      name: 'Venture Capital Partners',
      company: 'Highland Ridge Capital',
      address: '280 Park Avenue, 18th Floor',
      city: 'New York',
      state: 'NY',
      postalCode: '10017',
      country: 'United States',
      phone: '(212) 555-8820',
    },
    recipient: {
      name: 'Sarah Jenkins',
      company: 'HyperScale Systems',
      address: '500 W 2nd Street, Suite 1900',
      city: 'Austin',
      state: 'TX',
      postalCode: '78701',
      country: 'United States',
      phone: '(512) 555-4301',
      isResidential: false,
    },
    packageDetails: {
      weight: 1.1,
      weightUnit: 'lbs',
      dimensions: { length: 12, width: 9, height: 1, unit: 'in' },
      packaging: 'Apex Envelope',
      declaredValue: 500,
      signatureRequired: 'Direct Signature Required',
      specialHandling: ['Legal Closing Binder', 'Early AM Priority'],
    },
    shippingCharge: 3750.00,
    createdAt: 'Oct 15, 2026, 6:00 PM',
    proofOfDelivery: {
      signedBy: 'S. JENKINS',
      timestamp: 'Oct 16, 2026 at 08:14 AM',
      locationDescription: 'Executive Suite Reception Desk, 19th Floor',
    },
    timeline: [
      {
        id: 'chk-d1',
        timestamp: 'Oct 16, 08:14 AM',
        dateStr: 'Oct 16, 2026',
        timeStr: '08:14 AM',
        status: 'Delivered',
        location: 'Austin, TX',
        details: 'Delivered to reception. Signed by S. JENKINS.',
        facilityType: 'DOORSTEP',
      },
      {
        id: 'chk-d2',
        timestamp: 'Oct 16, 06:45 AM',
        dateStr: 'Oct 16, 2026',
        timeStr: '06:45 AM',
        status: 'On FedEx Delivery Vehicle',
        location: 'Austin, TX (Downtown Facility)',
        details: 'First Overnight morning dispatch route.',
        facilityType: 'VEHICLE',
      },
      {
        id: 'chk-d3',
        timestamp: 'Oct 16, 03:10 AM',
        dateStr: 'Oct 16, 2026',
        timeStr: '03:10 AM',
        status: 'Departed FedEx Hub',
        location: 'Memphis SuperHub, TN',
        details: 'In flight to Austin-Bergstrom (AUS).',
        facilityType: 'AIRPORT_HUB',
      },
      {
        id: 'chk-d4',
        timestamp: 'Oct 15, 06:00 PM',
        dateStr: 'Oct 15, 2026',
        timeStr: '06:00 PM',
        status: 'Tendered at FedEx Ship Center',
        location: 'New York, NY',
        details: 'Origin scan completed at Grand Central FedEx Ship Center.',
        facilityType: 'LOCAL_FACILITY',
      },
    ],
  },
  {
    trackingNumber: 'FDX-77312-INT',
    service: 'PRIORITY_OVERNIGHT',
    serviceName: 'FedEx International Priority®',
    status: 'CUSTOMS_CLEARANCE',
    statusMessage: 'Customs clearance in progress at London Heathrow International Hub',
    estimatedDelivery: 'Tomorrow, Oct 18 by 12:00 PM GMT',
    sender: {
      name: 'Calvin Wright',
      company: 'Silicon Photonics Ltd',
      address: '100 Innovation Way',
      city: 'San Jose',
      state: 'CA',
      postalCode: '95134',
      country: 'United States',
      phone: '(408) 555-9182',
    },
    recipient: {
      name: 'Oliver Sterling',
      company: 'Oxford Quantum Laboratories',
      address: 'Begbroke Science Park, Sandy Lane',
      city: 'Oxford',
      state: 'OX5 1PF',
      postalCode: 'OX5 1PF',
      country: 'United Kingdom',
      phone: '+44 1865 550190',
      isResidential: false,
    },
    packageDetails: {
      weight: 8.5,
      weightUnit: 'lbs',
      dimensions: { length: 16, width: 14, height: 10, unit: 'in' },
      packaging: 'Medium Box',
      declaredValue: 4800,
      signatureRequired: 'Adult Signature Required',
      specialHandling: ['Commercial Invoice Attached', 'Export Electronic Documentation'],
    },
    shippingCharge: 3950.00,
    createdAt: 'Oct 16, 2026, 1:20 PM',
    timeline: [
      {
        id: 'chk-i1',
        timestamp: 'Today, 02:40 PM GMT',
        dateStr: 'Oct 17, 2026',
        timeStr: '02:40 PM',
        status: 'Customs Clearance Agency Review',
        location: 'London Heathrow (LHR), UK',
        details: 'Commercial export documents submitted electronically. Awaiting clearance release.',
        facilityType: 'SORT_FACILITY',
      },
      {
        id: 'chk-i2',
        timestamp: 'Today, 10:15 AM GMT',
        dateStr: 'Oct 17, 2026',
        timeStr: '10:15 AM',
        status: 'Arrived at Destination Airport',
        location: 'London Heathrow (LHR), UK',
        details: 'Flight FDX-004 arrived from Memphis Global Hub.',
        facilityType: 'AIRPORT_HUB',
      },
      {
        id: 'chk-i3',
        timestamp: 'Yesterday, 08:30 PM CST',
        dateStr: 'Oct 16, 2026',
        timeStr: '08:30 PM',
        status: 'Departed US International Gateway',
        location: 'Memphis SuperHub, TN',
        details: 'Transatlantic long-haul flight departed.',
        facilityType: 'AIRPORT_HUB',
      },
      {
        id: 'chk-i4',
        timestamp: 'Oct 16, 01:20 PM PST',
        dateStr: 'Oct 16, 2026',
        timeStr: '01:20 PM',
        status: 'Picked Up by FedEx Courier',
        location: 'San Jose, CA',
        details: 'Direct customer warehouse pickup.',
        facilityType: 'DOORSTEP',
      },
    ],
  },
  {
    trackingNumber: 'FDX-65021-GRD',
    service: 'GROUND',
    serviceName: 'FedEx Ground®',
    status: 'IN_TRANSIT',
    statusMessage: 'In transit - Scheduled delivery Monday, Oct 19',
    estimatedDelivery: 'Oct 19, 2026 by End of Day',
    sender: {
      name: 'Warehouse Operations',
      company: 'OmniParts Logistics',
      address: '880 Industrial Parkway',
      city: 'Cleveland',
      state: 'OH',
      postalCode: '44114',
      country: 'United States',
      phone: '(216) 555-7740',
    },
    recipient: {
      name: 'AutoCraft Performance',
      company: 'AutoCraft LLC',
      address: '1420 Peachtree Street NE',
      city: 'Atlanta',
      state: 'GA',
      postalCode: '30309',
      country: 'United States',
      phone: '(404) 555-1212',
    },
    packageDetails: {
      weight: 34.0,
      weightUnit: 'lbs',
      dimensions: { length: 24, width: 18, height: 12, unit: 'in' },
      packaging: 'Large Box',
      declaredValue: 890,
      signatureRequired: 'Direct Signature Required',
    },
    shippingCharge: 685.50,
    createdAt: 'Oct 16, 2026, 11:00 AM',
    timeline: [
      {
        id: 'chk-g1',
        timestamp: 'Today, 04:30 AM',
        dateStr: 'Oct 17, 2026',
        timeStr: '04:30 AM',
        status: 'Departed Regional Sort Hub',
        location: 'Columbus, OH',
        details: 'En route via linehaul trailer to Atlanta Hub.',
        facilityType: 'SORT_FACILITY',
      },
      {
        id: 'chk-g2',
        timestamp: 'Oct 16, 09:15 PM',
        dateStr: 'Oct 16, 2026',
        timeStr: '09:15 PM',
        status: 'Arrived at FedEx Sort Facility',
        location: 'Columbus, OH',
        details: 'Cross-dock sorting completed.',
        facilityType: 'SORT_FACILITY',
      },
      {
        id: 'chk-g3',
        timestamp: 'Oct 16, 11:00 AM',
        dateStr: 'Oct 16, 2026',
        timeStr: '11:00 AM',
        status: 'Picked Up',
        location: 'Cleveland, OH',
        details: 'Origin carrier receipt verified.',
        facilityType: 'DOORSTEP',
      },
    ],
  },
];

export const MOCK_LOCATIONS: CourierLocation[] = [
  {
    id: 'loc-1',
    name: 'FedEx Ship Center Downtown',
    type: 'Apex Ship Center',
    address: '120 S LaSalle Street, Ground Concourse',
    city: 'Chicago',
    state: 'IL',
    postalCode: '60603',
    distanceMiles: 0.4,
    phone: '(312) 555-4000',
    hours: {
      weekday: '7:30 AM - 8:00 PM',
      saturday: '9:00 AM - 5:00 PM',
      sunday: '10:00 AM - 3:00 PM',
    },
    latestExpressDrop: '7:30 PM',
    latestGroundDrop: '6:00 PM',
    services: [
      'Packaging Supplies & Boxes',
      'Direct Dangerous Goods / Dry Ice',
      'Hold at Location',
      'Custom Crating & LTL',
      'Direct Account Drop-off',
    ],
    lat: 41.8796,
    lng: -87.6324,
  },
  {
    id: 'loc-2',
    name: 'FedEx 24/7 Drop Box - Wacker Pavilion',
    type: 'Apex 24/7 Drop Box',
    address: '333 W Wacker Drive, Exterior Plaza',
    city: 'Chicago',
    state: 'IL',
    postalCode: '60606',
    distanceMiles: 0.9,
    phone: '1-800-463-3339',
    hours: {
      weekday: '24 Hours Open',
      saturday: '24 Hours Open',
      sunday: '24 Hours Open',
    },
    latestExpressDrop: '6:30 PM Mon-Fri',
    latestGroundDrop: '5:00 PM Mon-Fri',
    services: [
      '24/7 Contactless Drop',
      'FedEx Envelopes & Paks Provided',
      'Automated Scan Sensor Receipt',
    ],
    lat: 41.8864,
    lng: -87.6366,
  },
  {
    id: 'loc-3',
    name: 'FedEx Office Print & Ship Center',
    type: 'Apex Office & Print',
    address: '55 E Monroe Street, Suite 105',
    city: 'Chicago',
    state: 'IL',
    postalCode: '60603',
    distanceMiles: 1.2,
    phone: '(312) 555-8120',
    hours: {
      weekday: '8:00 AM - 7:00 PM',
      saturday: '10:00 AM - 4:00 PM',
      sunday: 'Closed',
    },
    latestExpressDrop: '7:00 PM',
    latestGroundDrop: '5:30 PM',
    services: [
      'Self-Service Label Kiosks',
      'Full Color Printing & Binding',
      'FedEx Return QR Code Mobile Drop',
      'Hold at Location',
    ],
    lat: 41.8809,
    lng: -87.6258,
  },
  {
    id: 'loc-4',
    name: 'FedEx Express Station O\'Hare International',
    type: 'Apex Ship Center',
    address: '10600 W Higgins Road',
    city: 'Rosemont',
    state: 'IL',
    postalCode: '60018',
    distanceMiles: 14.8,
    phone: '(847) 555-9300',
    hours: {
      weekday: '6:00 AM - 10:00 PM',
      saturday: '7:00 AM - 8:00 PM',
      sunday: '8:00 AM - 6:00 PM',
    },
    latestExpressDrop: '9:30 PM',
    latestGroundDrop: '8:00 PM',
    services: [
      'Late Aircraft Dispatch Drop-off',
      'Cold Chain Packaging',
      'Freight & Pallet Acceptance',
      'Customs Brokerage Liaison',
    ],
    lat: 41.9868,
    lng: -87.8767,
  },
  {
    id: 'loc-5',
    name: 'Walgreens (FedEx Authorized Drop & Hold)',
    type: 'Authorized Ship Center',
    address: '151 N State Street',
    city: 'Chicago',
    state: 'IL',
    postalCode: '60601',
    distanceMiles: 0.6,
    phone: '(312) 555-2244',
    hours: {
      weekday: '8:00 AM - 9:00 PM',
      saturday: '9:00 AM - 8:00 PM',
      sunday: '10:00 AM - 6:00 PM',
    },
    latestExpressDrop: '5:00 PM',
    latestGroundDrop: '4:00 PM',
    services: [
      'Pre-labeled Package Drop-off',
      'Hold for Pickup (Secure 7 Days)',
      'QR Code Mobile Return Drop',
    ],
    lat: 41.8847,
    lng: -87.6278,
  },
];

export const STORAGE_KEY_SHIPMENTS = 'fedex_shipments_v3';
export const STORAGE_KEY_PICKUPS = 'fedex_pickups_v3';

export function getStoredShipments(): Shipment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SHIPMENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_SHIPMENTS, JSON.stringify(INITIAL_SHIPMENTS));
      return INITIAL_SHIPMENTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY_SHIPMENTS, JSON.stringify(INITIAL_SHIPMENTS));
      return INITIAL_SHIPMENTS;
    }
    // Ensure Daniella Lam test shipment is present
    const hasDaniella = parsed.some(
      (s: Shipment) =>
        s.sender?.name?.toLowerCase().includes('daniella') ||
        s.trackingNumber?.replace(/\s/g, '').includes('784955219012')
    );
    if (!hasDaniella) {
      const merged = [INITIAL_SHIPMENTS[0], ...parsed];
      localStorage.setItem(STORAGE_KEY_SHIPMENTS, JSON.stringify(merged));
      return merged;
    }
    return parsed;
  } catch {
    return INITIAL_SHIPMENTS;
  }
}

export function saveShipmentToStorage(shipment: Shipment): void {
  try {
    const current = getStoredShipments();
    const existingIndex = current.findIndex(
      (s) => s.trackingNumber.toUpperCase().replace(/[\s-]/g, '') === shipment.trackingNumber.toUpperCase().replace(/[\s-]/g, '')
    );
    let updated: Shipment[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = shipment;
    } else {
      updated = [shipment, ...current];
    }
    localStorage.setItem(STORAGE_KEY_SHIPMENTS, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save shipment to localStorage', err);
  }
}

export function deleteStoredShipment(trackingNum: string): void {
  try {
    const list = getStoredShipments();
    const clean = trackingNum.toUpperCase().replace(/[\s-]/g, '');
    const filtered = list.filter((s) => s.trackingNumber.toUpperCase().replace(/[\s-]/g, '') !== clean);
    localStorage.setItem(STORAGE_KEY_SHIPMENTS, JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to delete shipment from localStorage', err);
  }
}

export function findShipmentByNumber(trackingNum: string): Shipment | null {
  const query = trackingNum.trim().toLowerCase();
  const clean = trackingNum.trim().toUpperCase().replace(/[\s-]/g, '');
  const list = getStoredShipments();
  // Check exact, clean tracking number, or sender name for testing flexibility
  const match = list.find((s) => {
    const sClean = s.trackingNumber.toUpperCase().replace(/[\s-]/g, '');
    if (sClean === clean || sClean.includes(clean) || (clean.length >= 4 && clean.includes(sClean))) return true;
    if (query.length >= 3) {
      if (s.sender?.name?.toLowerCase().includes(query)) return true;
      if (s.recipient?.name?.toLowerCase().includes(query)) return true;
      if (s.sender?.company?.toLowerCase().includes(query)) return true;
    }
    return false;
  });
  return match || null;
}

export function getStoredPickups(): PickupRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PICKUPS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function savePickupToStorage(pickup: PickupRequest): void {
  try {
    const current = getStoredPickups();
    localStorage.setItem(STORAGE_KEY_PICKUPS, JSON.stringify([pickup, ...current]));
  } catch (err) {
    console.error('Failed to save pickup to localStorage', err);
  }
}

export function calculateEstimatedRates(params: {
  originZip: string;
  destZip: string;
  weightLbs: number;
  packaging: string;
  declaredVal?: number;
}): RateQuote[] {
  const weight = Math.max(1, params.weightLbs || 1);
  const isEnv = params.packaging.toLowerCase().includes('envelope');
  const multiplier = isEnv ? 0.85 : 1.0;

  const groundBase = Number(Math.min(750, 550.0 + weight * 3.5 * multiplier).toFixed(2));
  const groundFuel = 36.0;
  const groundTax = 14.0;

  const saverBase = Number(Math.min(1200, 880.0 + weight * 5.0 * multiplier).toFixed(2));
  const saverFuel = 58.0;
  const saverTax = 22.0;

  const day2Base = Number(Math.min(1850, 1450.0 + weight * 7.5 * multiplier).toFixed(2));
  const day2Fuel = 94.0;
  const day2Tax = 36.0;

  const stdBase = Number(Math.min(2600, 2150.0 + weight * 10.0 * multiplier).toFixed(2));
  const stdFuel = 142.0;
  const stdTax = 58.0;

  const prioBase = Number(Math.min(3300, 2850.0 + weight * 12.0 * multiplier).toFixed(2));
  const prioFuel = 185.0;
  const prioTax = 75.0;

  const firstBase = Number(Math.min(3690, 3450.0 + weight * 14.0 * multiplier).toFixed(2));
  const firstFuel = 220.0;
  const firstTax = 90.0;

  return [
    {
      service: 'FIRST_OVERNIGHT',
      name: 'FedEx First Overnight®',
      description: 'Next business day delivery by 8:00 or 8:30 AM to major US metropolitan areas.',
      deliveryDate: 'Tomorrow, Oct 18, 2026',
      deliveryTime: '08:00 AM',
      baseRate: firstBase,
      fuelSurcharge: firstFuel,
      taxes: firstTax,
      totalRate: Number(Math.min(4000, firstBase + firstFuel + firstTax).toFixed(2)),
      guaranteed: true,
    },
    {
      service: 'PRIORITY_OVERNIGHT',
      name: 'FedEx Priority Overnight®',
      description: 'Next business day delivery by 10:30 AM to most businesses, by noon to residences.',
      deliveryDate: 'Tomorrow, Oct 18, 2026',
      deliveryTime: '10:30 AM',
      baseRate: prioBase,
      fuelSurcharge: prioFuel,
      taxes: prioTax,
      totalRate: Number(Math.min(3650, prioBase + prioFuel + prioTax).toFixed(2)),
      guaranteed: true,
    },
    {
      service: 'STANDARD_OVERNIGHT',
      name: 'FedEx Standard Overnight®',
      description: 'Next business day afternoon delivery by 4:30 PM to businesses, 8:00 PM to residences.',
      deliveryDate: 'Tomorrow, Oct 18, 2026',
      deliveryTime: '04:30 PM',
      baseRate: stdBase,
      fuelSurcharge: stdFuel,
      taxes: stdTax,
      totalRate: Number(Math.min(2950, stdBase + stdFuel + stdTax).toFixed(2)),
      guaranteed: true,
    },
    {
      service: 'EXPRESS_2DAY',
      name: 'FedEx 2Day®',
      description: 'Second business day delivery by 4:30 PM to businesses, 8:00 PM to residences.',
      deliveryDate: 'Monday, Oct 19, 2026',
      deliveryTime: '04:30 PM',
      baseRate: day2Base,
      fuelSurcharge: day2Fuel,
      taxes: day2Tax,
      totalRate: Number(Math.min(2100, day2Base + day2Fuel + day2Tax).toFixed(2)),
      guaranteed: true,
    },
    {
      service: 'EXPRESS_SAVER',
      name: 'FedEx Express Saver®',
      description: 'Third business day delivery by 4:30 PM to businesses, 8:00 PM to residences.',
      deliveryDate: 'Tuesday, Oct 20, 2026',
      deliveryTime: '04:30 PM',
      baseRate: saverBase,
      fuelSurcharge: saverFuel,
      taxes: saverTax,
      totalRate: Number(Math.min(1350, saverBase + saverFuel + saverTax).toFixed(2)),
      guaranteed: true,
    },
    {
      service: 'GROUND',
      name: 'FedEx Ground®',
      description: 'Day-definite delivery in 1-5 business days across 100% of US businesses.',
      deliveryDate: 'Wed, Oct 21, 2026',
      deliveryTime: 'End of Day',
      baseRate: groundBase,
      fuelSurcharge: groundFuel,
      taxes: groundTax,
      totalRate: Number(Math.min(850, groundBase + groundFuel + groundTax).toFixed(2)),
      guaranteed: false,
    },
  ];
}
