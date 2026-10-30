import React, { useState } from 'react';
import {
  Sparkles,
  Save,
  Trash2,
  Plus,
  RefreshCw,
  LogOut,
  Shield,
  Package,
  Truck,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowRight,
  Search,
  Sliders,
  Terminal,
  Activity,
  AlertTriangle,
  Download,
  Filter,
  ArrowLeft,
} from 'lucide-react';
import { Shipment, ServiceCode, ShipmentStatus, TrackingCheckpoint } from '../types/courier';
import { saveShipmentToStorage, deleteStoredShipment } from '../data/mockShipments';
import { FedExLogo } from './FedExLogo';

export interface AdminLogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'DISPATCH' | 'SCAN' | 'AUTH' | 'WARN';
  event: string;
  trackingNumber?: string;
  operator: string;
  details: string;
}

interface AdminPanelProps {
  shipments: Shipment[];
  onRefreshShipments: () => void;
  onLogout: () => void;
  onExitToWebsite: () => void;
  onSelectTracking?: (trackingNum: string) => void;
}

// Initial realistic admin operational logs
const INITIAL_LOGS: AdminLogEntry[] = [
  {
    id: 'log-100',
    timestamp: '2026-10-25 01:28:40',
    level: 'INFO',
    event: 'MANIFEST_PENDING_REGISTERED',
    trackingNumber: '7849 5521 9012',
    operator: 'DISPATCH_OR_01',
    details: 'Pre-advice consignment registered for Daniella Lam (Lam Diagnostics & Bioresearch). Awaiting courier tender.',
  },
  {
    id: 'log-101',
    timestamp: '2026-10-25 01:14:02',
    level: 'AUTH',
    event: 'OPERATOR_AUTHENTICATED',
    operator: 'admin',
    details: 'Successful administrator login via Manage Deliveries gateway.',
  },
  {
    id: 'log-102',
    timestamp: '2026-10-25 01:05:40',
    level: 'DISPATCH',
    event: 'VEHICLE_DISPATCH_CONFIRMED',
    trackingNumber: 'FDX-98214-US',
    operator: 'DISPATCH_ORD_04',
    details: 'Courier van 4082 assigned to route 12-North Chicago. 34 packages loaded.',
  },
  {
    id: 'log-103',
    timestamp: '2026-10-25 00:58:19',
    level: 'SCAN',
    event: 'SORT_SCAN_SUPERHUB',
    trackingNumber: 'FDX-77312-INT',
    operator: 'SCANNER_MEM_A9',
    details: 'Automated 6-sided optical laser verification complete. Manifest validated.',
  },
  {
    id: 'log-104',
    timestamp: '2026-10-25 00:42:11',
    level: 'INFO',
    event: 'CUSTOMS_DOCUMENTATION_FORWARDED',
    trackingNumber: 'FDX-77312-INT',
    operator: 'CUSTOMS_GATEWAY_UK',
    details: 'Commercial invoice & tariff code electronic filing received by HMRC London.',
  },
  {
    id: 'log-105',
    timestamp: '2026-10-24 23:30:00',
    level: 'DISPATCH',
    event: 'FLIGHT_DEPARTURE_MEMPHIS',
    trackingNumber: 'FDX-41092-EXP',
    operator: 'FLIGHT_OPS_MEM',
    details: 'FedEx Boeing 777F #FDX-391 departed runway 18R for Austin (AUS).',
  },
  {
    id: 'log-106',
    timestamp: '2026-10-24 22:15:33',
    level: 'WARN',
    event: 'TEMPERATURE_MONITOR_ALERT_RESOLVED',
    trackingNumber: 'FDX-98214-US',
    operator: 'COLD_CHAIN_OPS',
    details: 'Thermal pouch temperature 4.1°C verified within nominal threshold (2°C - 8°C).',
  },
];

const SAMPLE_SENDERS = [
  { name: 'Daniella Lam', company: 'Lam Diagnostics & Bioresearch', address: '742 Evergreen Terrace, Suite 400', city: 'Springfield', state: 'OR', zip: '97477', phone: '(541) 555-0199' },
  { name: 'Dr. Evelyn Carter', company: 'BioGenix Laboratories', address: '450 Cambridge Parkway', city: 'Cambridge', state: 'MA', zip: '02142', phone: '(617) 555-8910' },
  { name: 'Marcus Vance', company: 'Apex Hardware Systems', address: '1200 Tech Valley Drive', city: 'Austin', state: 'TX', zip: '78759', phone: '(512) 555-4022' },
  { name: 'Chloe Davenport', company: 'Vanguard Aerospace LLC', address: '880 Aero Plaza Suite 400', city: 'Seattle', state: 'WA', zip: '98101', phone: '(206) 555-1984' },
  { name: 'Hassan Al-Mansoor', company: 'Sovereign Gemological Corp', address: '580 5th Avenue 12th Floor', city: 'New York', state: 'NY', zip: '10036', phone: '(212) 555-7301' },
];

const SAMPLE_PACKAGE_DESCRIPTIONS = [
  'Clinical Diagnostics Assay Kits & Laboratory Reagent Assays',
  'Precision Laser Optical Sensor Assemblies & Cleanroom Hardware',
  'Temperature-Controlled Biopharmaceutical Research Cell Cultures (2°C - 8°C)',
  'Confidential Legal Arbitration Documents & Corporate Share Certificates',
  'High-Grade Semiconductor Silicon Wafers & Microelectronics Test Board',
  'Precision Calibrated Aircraft Avionics Sensors & Diagnostic Interfaces',
];

const SAMPLE_RECIPIENTS = [
  { name: 'Sophia Sterling', company: 'Northwestern Medical Research', address: '710 N Lake Shore Drive', city: 'Chicago', state: 'IL', zip: '60611', phone: '(312) 555-8490' },
  { name: 'Julian Thorne', company: 'CyberKinetic Robotics', address: '350 Mission Street 20th Fl', city: 'San Francisco', state: 'CA', zip: '94105', phone: '(415) 555-3920' },
  { name: 'Elena Rostova', company: 'St. Jude Clinical Therapeutics', address: '262 Danny Thomas Place', city: 'Memphis', state: 'TN', zip: '38105', phone: '(901) 555-4411' },
  { name: 'Nathaniel Drake', company: 'AeroDynamics Propulsion', address: '1400 Peachtree Street NE', city: 'Atlanta', state: 'GA', zip: '30309', phone: '(404) 555-9128' },
];

const SERVICE_OPTIONS: { code: ServiceCode; name: string }[] = [
  { code: 'PRIORITY_OVERNIGHT', name: 'FedEx Priority Overnight®' },
  { code: 'FIRST_OVERNIGHT', name: 'FedEx First Overnight®' },
  { code: 'STANDARD_OVERNIGHT', name: 'FedEx Standard Overnight®' },
  { code: 'EXPRESS_2DAY', name: 'FedEx 2Day®' },
  { code: 'GROUND', name: 'FedEx Ground®' },
];

export const AdminPanel: React.FC<AdminPanelProps> = ({
  shipments,
  onRefreshShipments,
  onLogout,
  onExitToWebsite,
  onSelectTracking,
}) => {
  const [adminTab, setAdminTab] = useState<'logs' | 'generator' | 'registry'>('logs');
  const [logs, setLogs] = useState<AdminLogEntry[]>(INITIAL_LOGS);
  const [logFilter, setLogFilter] = useState<string>('ALL');
  const [logSearchQuery, setLogSearchQuery] = useState('');

  // 12-digit format tracking generator
  const generate12DigitTracking = () => {
    const part1 = Math.floor(1000 + Math.random() * 9000);
    const part2 = Math.floor(1000 + Math.random() * 9000);
    const part3 = Math.floor(1000 + Math.random() * 9000);
    return `${part1} ${part2} ${part3}`;
  };

  // Draft Shipment State
  const [trackingNumber, setTrackingNumber] = useState(() => generate12DigitTracking());
  const [serviceCode, setServiceCode] = useState<ServiceCode>('PRIORITY_OVERNIGHT');
  const [status, setStatus] = useState<ShipmentStatus>('IN_TRANSIT');
  const [statusMessage, setStatusMessage] = useState('In transit - Sorted at Memphis World Hub');
  const [estimatedDelivery, setEstimatedDelivery] = useState('Tomorrow by 10:30 AM');

  // Sender
  const [senderName, setSenderName] = useState(SAMPLE_SENDERS[0].name);
  const [senderCompany, setSenderCompany] = useState(SAMPLE_SENDERS[0].company);
  const [senderAddress, setSenderAddress] = useState(SAMPLE_SENDERS[0].address);
  const [senderCity, setSenderCity] = useState(SAMPLE_SENDERS[0].city);
  const [senderState, setSenderState] = useState(SAMPLE_SENDERS[0].state);
  const [senderZip, setSenderZip] = useState(SAMPLE_SENDERS[0].zip);
  const [senderPhone, setSenderPhone] = useState(SAMPLE_SENDERS[0].phone);

  // Recipient
  const [recipientName, setRecipientName] = useState(SAMPLE_RECIPIENTS[0].name);
  const [recipientCompany, setRecipientCompany] = useState(SAMPLE_RECIPIENTS[0].company);
  const [recipientAddress, setRecipientAddress] = useState(SAMPLE_RECIPIENTS[0].address);
  const [recipientCity, setRecipientCity] = useState(SAMPLE_RECIPIENTS[0].city);
  const [recipientState, setRecipientState] = useState(SAMPLE_RECIPIENTS[0].state);
  const [recipientZip, setRecipientZip] = useState(SAMPLE_RECIPIENTS[0].zip);
  const [recipientPhone, setRecipientPhone] = useState(SAMPLE_RECIPIENTS[0].phone);
  const [isResidential, setIsResidential] = useState(false);

  // Package Metadata
  const [packageDescription, setPackageDescription] = useState('Clinical Diagnostics Assay Kits & Laboratory Reagent Assays');
  const [weight, setWeight] = useState(5.4);
  const [length, setLength] = useState(12);
  const [width, setWidth] = useState(10);
  const [height, setHeight] = useState(6);
  const [packaging, setPackaging] = useState<'Apex Envelope' | 'Apex Pak' | 'Small Box' | 'Medium Box' | 'Large Box' | 'Your Packaging'>('Medium Box');
  const [declaredValue, setDeclaredValue] = useState(750);
  const [signatureRequired, setSignatureRequired] = useState<'No Signature Required' | 'Direct Signature Required' | 'Adult Signature Required'>('Direct Signature Required');
  const [deliveryInstructions, setDeliveryInstructions] = useState('Deliver to front desk or security dock');

  // Notification Banner
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showFeedback = (message: string, type: 'success' | 'info' = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const addLog = (level: AdminLogEntry['level'], event: string, details: string, trackingNum?: string) => {
    const newEntry: AdminLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      level,
      event,
      operator: 'admin',
      details,
      trackingNumber: trackingNum,
    };
    setLogs((prev) => [newEntry, ...prev]);
  };

  // Main Action: Generate New Draft Shipment
  const handleGenerateDraft = () => {
    const randomSender = SAMPLE_SENDERS[Math.floor(Math.random() * SAMPLE_SENDERS.length)];
    const randomRecipient = SAMPLE_RECIPIENTS[Math.floor(Math.random() * SAMPLE_RECIPIENTS.length)];
    const randomService = SERVICE_OPTIONS[Math.floor(Math.random() * SERVICE_OPTIONS.length)];
    const randomDesc = SAMPLE_PACKAGE_DESCRIPTIONS[Math.floor(Math.random() * SAMPLE_PACKAGE_DESCRIPTIONS.length)];
    const randomWeight = parseFloat((1.0 + Math.random() * 18).toFixed(1));
    const randomDim = [
      Math.floor(8 + Math.random() * 10),
      Math.floor(6 + Math.random() * 8),
      Math.floor(4 + Math.random() * 8),
    ];
    const newTracking = generate12DigitTracking();

    setTrackingNumber(newTracking);
    setServiceCode(randomService.code);
    setStatus('IN_TRANSIT');
    setStatusMessage(`In transit - Package scanned at FedEx Regional Sort Facility in ${randomSender.city}`);
    setEstimatedDelivery('Tomorrow by 10:30 AM');

    setSenderName(randomSender.name);
    setSenderCompany(randomSender.company);
    setSenderAddress(randomSender.address);
    setSenderCity(randomSender.city);
    setSenderState(randomSender.state);
    setSenderZip(randomSender.zip);
    setSenderPhone(randomSender.phone);

    setRecipientName(randomRecipient.name);
    setRecipientCompany(randomRecipient.company);
    setRecipientAddress(randomRecipient.address);
    setRecipientCity(randomRecipient.city);
    setRecipientState(randomRecipient.state);
    setRecipientZip(randomRecipient.zip);
    setRecipientPhone(randomRecipient.phone);

    setPackageDescription(randomDesc);
    setWeight(randomWeight);
    setLength(randomDim[0]);
    setWidth(randomDim[1]);
    setHeight(randomDim[2]);
    setPackaging('Medium Box');
    setDeclaredValue(Math.floor(200 + Math.random() * 2000));
    setSignatureRequired('Direct Signature Required');
    setDeliveryInstructions('Deliver to reception desk or loading dock');

    addLog('INFO', 'DRAFT_SHIPMENT_GENERATED', `Generated draft shipment ${newTracking} for ${randomRecipient.name}`, newTracking);
    showFeedback(`Generated new random draft shipment: ${newTracking}`);
  };

  // Save / Publish Draft to live system
  const handleSaveAndPublish = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedServiceName = SERVICE_OPTIONS.find((s) => s.code === serviceCode)?.name || 'FedEx Priority Overnight®';
    const cleanTracking = trackingNumber.trim();
    let tierBase = 2850;
    if (serviceCode === 'FIRST_OVERNIGHT') tierBase = 3650;
    else if (serviceCode === 'PRIORITY_OVERNIGHT') tierBase = 3050;
    else if (serviceCode === 'STANDARD_OVERNIGHT') tierBase = 2300;
    else if (serviceCode === 'EXPRESS_2DAY') tierBase = 1550;
    else if (serviceCode === 'EXPRESS_SAVER') tierBase = 950;
    else if (serviceCode === 'GROUND') tierBase = 550;
    else if (serviceCode === 'FREIGHT_PRIORITY') tierBase = 3850;
    const computedCharge = parseFloat(Math.min(4000, Math.max(550, tierBase + (Number(weight) || 1) * 8.5)).toFixed(2));

    const newShipment: Shipment = {
      trackingNumber: cleanTracking,
      service: serviceCode,
      serviceName: selectedServiceName,
      status,
      statusMessage,
      estimatedDelivery,
      shippingCharge: computedCharge,
      createdAt: 'Just now',
      deliveryInstructions,
      packageDescription: packageDescription.trim(),
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
          length: Number(length) || 12,
          width: Number(width) || 10,
          height: Number(height) || 6,
          unit: 'in',
        },
        packaging,
        declaredValue: Number(declaredValue) || 100,
        signatureRequired,
        description: packageDescription.trim(),
      },
      timeline: status === 'PENDING'
        ? [
            {
              id: `scan-${Date.now()}-1`,
              timestamp: 'Just now',
              dateStr: 'Today',
              timeStr: 'Just now',
              status: 'Shipment Information Created - Pending Tender',
              location: `${senderCity}, ${senderState}`,
              details: `Electronic shipment pre-advice received from ${senderName}. Package tender pending carrier pickup.`,
              facilityType: 'LOCAL_FACILITY',
            },
          ]
        : [
            {
              id: `scan-${Date.now()}-1`,
              timestamp: 'Just now',
              dateStr: 'Today',
              timeStr: 'Just now',
              status: 'In Transit - Hub Departure',
              location: `${senderCity}, ${senderState}`,
              details: 'Package scanned and en route to destination facility.',
              facilityType: 'SORT_FACILITY',
            },
            {
              id: `scan-${Date.now()}-2`,
              timestamp: 'Earlier today',
              dateStr: 'Today',
              timeStr: 'Earlier',
              status: 'Picked Up by FedEx',
              location: `${senderCity}, ${senderState}`,
              details: 'Package picked up from origin facility.',
              facilityType: 'DOORSTEP',
            },
          ],
    };

    saveShipmentToStorage(newShipment);
    onRefreshShipments();
    addLog('DISPATCH', 'SHIPMENT_PUBLISHED_LIVE', `Published shipment ${cleanTracking} to live tracking system.`, cleanTracking);
    showFeedback(`Shipment ${cleanTracking} successfully published to live FedEx tracking!`);
  };

  const handleDeleteShipment = (trackingNum: string) => {
    try {
      deleteStoredShipment(trackingNum);
      onRefreshShipments();
      addLog('WARN', 'SHIPMENT_DELETED', `Deleted shipment record ${trackingNum} from database.`, trackingNum);
      showFeedback(`Removed shipment ${trackingNum} from system.`);
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered Logs
  const filteredLogs = logs.filter((l) => {
    if (logFilter !== 'ALL' && l.level !== logFilter) return false;
    if (logSearchQuery.trim()) {
      const q = logSearchQuery.toLowerCase();
      return (
        l.event.toLowerCase().includes(q) ||
        l.details.toLowerCase().includes(q) ||
        (l.trackingNumber && l.trackingNumber.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Top Hidden Header with Return / Exit Controls */}
      <div className="bg-[#4D148C] text-white p-6 sm:p-7 rounded-2xl shadow-md border border-[#3b0f6d] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <FedExLogo variant="white" size="lg" />
          <div className="border-l border-white/30 pl-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#FF6200] bg-white/10 px-2 py-0.5 rounded">
                Confidential Admin Deck
              </span>
              <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Authenticated Operator (admin)
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight mt-1">Admin Panel Logs & Dispatch Engine</h2>
            <p className="text-xs text-white/80 mt-0.5">
              Restricted console: Operational event logs, draft airbill generation, and shipment overrides.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onExitToWebsite}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-white/15 hover:bg-white/25 rounded-xl border border-white/20 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Website</span>
          </button>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#FF6200] hover:bg-[#E05600] rounded-xl transition-all cursor-pointer shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs font-bold border flex items-center justify-between gap-3 animate-in fade-in duration-200 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-purple-50 border-purple-200 text-[#4D148C]'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{feedback.message}</span>
          </div>
        </div>
      )}

      {/* Internal Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setAdminTab('logs')}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            adminTab === 'logs'
              ? 'bg-[#4D148C] text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Terminal className="w-4 h-4 text-[#FF6200]" />
          <span>Admin Panel Logs ({logs.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('generator')}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            adminTab === 'generator'
              ? 'bg-[#4D148C] text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#FF6200]" />
          <span>Draft Shipment Generator</span>
        </button>

        <button
          onClick={() => setAdminTab('registry')}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            adminTab === 'registry'
              ? 'bg-[#4D148C] text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Package className="w-4 h-4 text-[#FF6200]" />
          <span>Database Registry ({shipments.length})</span>
        </button>
      </div>

      {/* TAB 1: ADMIN PANEL LOGS */}
      {adminTab === 'logs' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Logs Toolbar */}
          <div className="p-5 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 text-[#4D148C] rounded-lg">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Operational System & Audit Logs</h3>
                <p className="text-xs text-slate-500">
                  Live chronological record of dispatch runs, flight departures, scans, and operator sessions.
                </p>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {(['ALL', 'DISPATCH', 'SCAN', 'AUTH', 'WARN'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLogFilter(lvl)}
                  className={`px-3 py-1 font-bold rounded-lg cursor-pointer transition-colors ${
                    logFilter === lvl
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar for logs */}
          <div className="p-4 border-b border-slate-100 bg-white">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={logSearchQuery}
                onChange={(e) => setLogSearchQuery(e.target.value)}
                placeholder="Filter logs by tracking #, event, or keyword..."
                className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#4D148C]"
              />
            </div>
          </div>

          {/* Logs Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-4">Tracking ID</th>
                  <th className="py-3 px-4">Operator</th>
                  <th className="py-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredLogs.map((log) => {
                  const isWarn = log.level === 'WARN';
                  const isAuth = log.level === 'AUTH';
                  const isDispatch = log.level === 'DISPATCH';
                  const isScan = log.level === 'SCAN';

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap tabular-nums">
                        {log.timestamp}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isWarn
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : isAuth
                              ? 'bg-purple-50 text-[#4D148C] border border-purple-200'
                              : isDispatch
                              ? 'bg-orange-50 text-orange-700 border border-orange-200'
                              : isScan
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {log.level}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                        {log.event}
                      </td>
                      <td className="py-3 px-4 text-[#4D148C] font-bold whitespace-nowrap">
                        {log.trackingNumber || '—'}
                      </td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap font-medium">
                        {log.operator}
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-700 text-xs">
                        {log.details}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: DRAFT SHIPMENT GENERATOR (No visible tracking label) */}
      {adminTab === 'generator' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF6200]" />
                <h3 className="text-base font-black text-slate-900 uppercase tracking-wide">
                  Draft Shipment Generator
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Generates authentic 12-digit format tracking numbers with full address & cargo metadata.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGenerateDraft}
              className="px-5 py-2.5 bg-[#FF6200] hover:bg-[#E05600] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Generate New Draft Shipment</span>
            </button>
          </div>

          <form onSubmit={handleSaveAndPublish} className="p-6 sm:p-8 space-y-8">
            {/* Top row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-purple-50/50 rounded-xl border border-purple-100">
              <div>
                <label className="block text-xs font-black text-[#4D148C] uppercase tracking-wider mb-1">
                  12-Digit Tracking Number
                </label>
                <input
                  type="text"
                  required
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="7849 3210 9854"
                  className="w-full px-3.5 py-2.5 text-sm font-mono font-bold bg-white border border-slate-300 rounded-lg focus:border-[#4D148C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#4D148C] uppercase tracking-wider mb-1">
                  Service Level
                </label>
                <select
                  value={serviceCode}
                  onChange={(e) => setServiceCode(e.target.value as ServiceCode)}
                  className="w-full px-3.5 py-2.5 text-sm font-semibold bg-white border border-slate-300 rounded-lg focus:border-[#4D148C] focus:outline-none"
                >
                  {SERVICE_OPTIONS.map((opt) => (
                    <option key={opt.code} value={opt.code}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-[#4D148C] uppercase tracking-wider mb-1">
                  Initial Status
                </label>
                <select
                  value={status}
                  onChange={(e) => {
                    const newStatus = e.target.value as ShipmentStatus;
                    setStatus(newStatus);
                    if (newStatus === 'PENDING') {
                      setStatusMessage('Shipment Pending - Shipping data transmitted; awaiting package tender from shipper');
                      setEstimatedDelivery('Pending tender - Next business day after tender');
                    } else if (newStatus === 'LABEL_CREATED') {
                      setStatusMessage('Shipment information sent to FedEx. Awaiting carrier package tender.');
                    } else if (newStatus === 'IN_TRANSIT') {
                      setStatusMessage(`In transit - Package scanned at FedEx Regional Sort Facility in ${senderCity}`);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 text-sm font-semibold bg-white border border-slate-300 rounded-lg focus:border-[#4D148C] focus:outline-none"
                >
                  <option value="PENDING">Pending (Awaiting Tender)</option>
                  <option value="LABEL_CREATED">Label Created</option>
                  <option value="PICKED_UP">Picked Up</option>
                  <option value="IN_TRANSIT">In Transit</option>
                  <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CUSTOMS_CLEARANCE">Customs Clearance</option>
                </select>
              </div>
            </div>

            {/* Addresses Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Sender */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <MapPin className="w-4 h-4 text-[#4D148C]" />
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#4D148C]">
                    Sender Information
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Sender Name</label>
                    <input
                      type="text"
                      required
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Company</label>
                    <input
                      type="text"
                      value={senderCompany}
                      onChange={(e) => setSenderCompany(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={senderAddress}
                    onChange={(e) => setSenderAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={senderCity}
                      onChange={(e) => setSenderCity(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">State</label>
                    <input
                      type="text"
                      required
                      maxLength={2}
                      value={senderState}
                      onChange={(e) => setSenderState(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg uppercase font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">ZIP</label>
                    <input
                      type="text"
                      required
                      value={senderZip}
                      onChange={(e) => setSenderZip(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Phone</label>
                  <input
                    type="text"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              {/* Recipient */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <MapPin className="w-4 h-4 text-[#FF6200]" />
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#FF6200]">
                    Recipient Information
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Recipient Name</label>
                    <input
                      type="text"
                      required
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Company</label>
                    <input
                      type="text"
                      value={recipientCompany}
                      onChange={(e) => setRecipientCompany(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={recipientCity}
                      onChange={(e) => setRecipientCity(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">State</label>
                    <input
                      type="text"
                      required
                      maxLength={2}
                      value={recipientState}
                      onChange={(e) => setRecipientState(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg uppercase font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">ZIP</label>
                    <input
                      type="text"
                      required
                      value={recipientZip}
                      onChange={(e) => setRecipientZip(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Phone</label>
                  <input
                    type="text"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Package Description / Commodity Content */}
            <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-200">
              <label className="block text-xs font-black text-[#4D148C] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Package Description & Commodity Contents</span>
                <span className="text-[10px] text-[#4D148C]/70 font-semibold">Editable Cargo Details</span>
              </label>
              <textarea
                rows={2}
                required
                value={packageDescription}
                onChange={(e) => setPackageDescription(e.target.value)}
                placeholder="e.g. Clinical Diagnostics Assay Kits, Semiconductor components, Legal contracts..."
                className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg focus:border-[#4D148C] focus:outline-none"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Enter precise commodity or cargo descriptions for transport documentation, security manifest, and customs inspection.
              </p>
            </div>

            {/* Package Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Weight (lbs)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  required
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Dimensions (L x W x H)</label>
                <div className="grid grid-cols-3 gap-1">
                  <input
                    type="number"
                    value={length}
                    onChange={(e) => setLength(parseInt(e.target.value) || 1)}
                    className="px-2 py-2 bg-white border border-slate-300 rounded text-center font-mono"
                    placeholder="L"
                  />
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(parseInt(e.target.value) || 1)}
                    className="px-2 py-2 bg-white border border-slate-300 rounded text-center font-mono"
                    placeholder="W"
                  />
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value) || 1)}
                    className="px-2 py-2 bg-white border border-slate-300 rounded text-center font-mono"
                    placeholder="H"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Packaging</label>
                <select
                  value={packaging}
                  onChange={(e) => setPackaging(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                >
                  <option value="Apex Envelope">FedEx Envelope</option>
                  <option value="Small Box">FedEx Small Box</option>
                  <option value="Medium Box">FedEx Medium Box</option>
                  <option value="Large Box">FedEx Large Box</option>
                  <option value="Your Packaging">Custom Packaging</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Declared Value ($)</label>
                <input
                  type="number"
                  value={declaredValue}
                  onChange={(e) => setDeclaredValue(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono"
                />
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="submit"
                className="px-8 py-3 bg-[#4D148C] hover:bg-[#3b0f6d] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save & Publish Shipment to System</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: DATABASE REGISTRY */}
      {adminTab === 'registry' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Live Shipments Registry ({shipments.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Active parcel records stored in the operational tracking database.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Tracking ID</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">From &rarr; To</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {shipments.map((s) => (
                  <tr key={s.trackingNumber} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-black text-slate-900">{s.trackingNumber}</div>
                      {s.sender?.name && (
                        <div className="text-[10px] text-slate-500 font-sans mt-0.5">
                          Shipper: <span className="font-semibold text-slate-800">{s.sender.name}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      <div>{s.serviceName}</div>
                      {(s.packageDescription || s.packageDetails.description) && (
                        <div className="text-[11px] text-[#4D148C] font-semibold mt-0.5 line-clamp-1">
                          📦 {s.packageDescription || s.packageDetails.description}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <span>{s.sender.city}, {s.sender.state}</span>
                      <span className="mx-1 text-slate-400">&rarr;</span>
                      <span className="font-semibold text-slate-900">{s.recipient.city}, {s.recipient.state}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          s.status === 'PENDING'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : s.status === 'DELIVERED'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-purple-50 text-[#4D148C] border border-purple-200'
                        }`}
                      >
                        {s.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {onSelectTracking && (
                          <button
                            type="button"
                            onClick={() => onSelectTracking(s.trackingNumber)}
                            className="px-2.5 py-1 text-[11px] font-bold text-[#4D148C] hover:bg-purple-50 rounded transition-colors cursor-pointer"
                          >
                            Track
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteShipment(s.trackingNumber)}
                          title="Delete shipment"
                          className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
