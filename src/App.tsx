import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { TrackingWidget } from './components/TrackingWidget';
import { TrackingModal } from './components/TrackingModal';
import { TrackingPageView } from './components/TrackingPageView';
import { ShippingForm } from './components/ShippingForm';
import { ShippingLabelModal } from './components/ShippingLabelModal';
import { RateCalculator } from './components/RateCalculator';
import { PickupScheduler } from './components/PickupScheduler';
import { LocationFinder } from './components/LocationFinder';
import { FleetShowcase } from './components/FleetShowcase';
import { Footer } from './components/Footer';
import { FedExLogo } from './components/FedExLogo';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminPanel } from './components/AdminPanel';
import {
  Shipment,
  ServiceCode,
} from './types/courier';
import {
  getStoredShipments,
  findShipmentByNumber,
  saveShipmentToStorage,
} from './data/mockShipments';
import {
  Search,
  Box,
  Truck,
  Calculator,
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  Check,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Layers,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('track');
  const [shipments, setShipments] = useState<Shipment[]>(() => getStoredShipments());
  const [trackedShipment, setTrackedShipment] = useState<Shipment>(() => {
    const list = getStoredShipments();
    return list[0];
  });
  const [selectedTrackingShipment, setSelectedTrackingShipment] = useState<Shipment | null>(null);
  const [selectedLabelShipment, setSelectedLabelShipment] = useState<Shipment | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Hidden Admin State & Session Management (Completely invisible on the public site)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('fedex_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [isAdminViewActive, setIsAdminViewActive] = useState<boolean>(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  useEffect(() => {
    setShipments(getStoredShipments());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 4000);
  };

  // Triggered discreetly by "Manage Deliveries" button
  const handleManageDeliveriesClick = () => {
    if (isAdminAuthenticated) {
      setIsAdminViewActive(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsAdminLoginModalOpen(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    try {
      sessionStorage.setItem('fedex_admin_auth', 'true');
    } catch (err) {
      console.error(err);
    }
    setIsAdminLoginModalOpen(false);
    setIsAdminViewActive(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Admin authenticated. Loading operational logs & dispatch.');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setIsAdminViewActive(false);
    try {
      sessionStorage.removeItem('fedex_admin_auth');
    } catch (err) {
      console.error(err);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Logged out. Returned safely to public website.');
  };

  const refreshShipments = () => {
    setShipments(getStoredShipments());
  };

  const handleTrackSearch = (trackingNum: string) => {
    const found = findShipmentByNumber(trackingNum);
    if (found) {
      setTrackedShipment(found);
      setSelectedTrackingShipment(found);
      setActiveTab('track');
      showToast(`Found tracking details for ${found.trackingNumber}`);
    } else {
      const cleanNum = trackingNum.trim().toUpperCase();
      const syntheticShipment: Shipment = {
        trackingNumber: cleanNum.startsWith('FDX-') ? cleanNum : `FDX-${cleanNum}`,
        service: 'PRIORITY_OVERNIGHT',
        serviceName: 'FedEx Priority Overnight®',
        status: 'IN_TRANSIT',
        statusMessage: 'In transit - Package scanned at FedEx Regional Sort Facility',
        estimatedDelivery: 'Tomorrow by 10:30 AM',
        shippingCharge: 54.8,
        createdAt: 'Today, 08:30 AM',
        sender: {
          name: 'FedEx Logistics Fulfillment',
          company: 'Distribution Center 04',
          address: '400 Global Way',
          city: 'Indianapolis',
          state: 'IN',
          postalCode: '46241',
          country: 'United States',
          phone: '(317) 555-8800',
        },
        recipient: {
          name: 'Authorized Consignee',
          address: '1200 Commercial Boulevard',
          city: 'Denver',
          state: 'CO',
          postalCode: '80202',
          country: 'United States',
          phone: '(303) 555-4921',
        },
        packageDetails: {
          weight: 6.2,
          weightUnit: 'lbs',
          dimensions: { length: 14, width: 10, height: 6, unit: 'in' },
          packaging: 'FedEx Medium Box' as any,
          declaredValue: 350,
          signatureRequired: 'Direct Signature Required',
        },
        timeline: [
          {
            id: `scan-syn-1`,
            timestamp: 'Today, 10:14 AM',
            dateStr: 'Oct 17, 2026',
            timeStr: '10:14 AM',
            status: 'Departed FedEx Sort Facility',
            location: 'Indianapolis, IN (IND Hub)',
            details: 'Linehaul air cargo transfer completed.',
            facilityType: 'AIRPORT_HUB',
          },
          {
            id: `scan-syn-2`,
            timestamp: 'Today, 04:30 AM',
            dateStr: 'Oct 17, 2026',
            timeStr: '04:30 AM',
            status: 'Arrived at FedEx Sort Hub',
            location: 'Indianapolis, IN',
            details: 'Optical sort scanned and containerized.',
            facilityType: 'SORT_FACILITY',
          },
          {
            id: `scan-syn-3`,
            timestamp: 'Yesterday, 06:00 PM',
            dateStr: 'Oct 16, 2026',
            timeStr: '06:00 PM',
            status: 'Picked Up by FedEx Courier',
            location: 'Indianapolis, IN',
            details: 'Package received from commercial dock.',
            facilityType: 'DOORSTEP',
          },
        ],
      };

      saveShipmentToStorage(syntheticShipment);
      setShipments(getStoredShipments());
      setTrackedShipment(syntheticShipment);
      setSelectedTrackingShipment(syntheticShipment);
      setActiveTab('track');
      showToast(`Loaded tracking history for ${syntheticShipment.trackingNumber}`);
    }
  };

  const handleShipmentCreated = (newShipment: Shipment) => {
    setShipments(getStoredShipments());
    showToast(`Shipment successfully booked and registered.`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F7] font-sans selection:bg-[#FF6200] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2A2A2A] text-white px-5 py-3.5 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF6200]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Header in FedEx Purple - 100% Public Clean, Zero Admin Indicators */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setIsAdminViewActive(false);
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        shipmentCount={shipments.length}
      />

      {/* If Admin view is active, render only the Admin Panel & Logs console */}
      {isAdminViewActive ? (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
          <AdminPanel
            shipments={shipments}
            onRefreshShipments={refreshShipments}
            onLogout={handleAdminLogout}
            onExitToWebsite={() => setIsAdminViewActive(false)}
            onSelectTracking={(trackingNum) => {
              setIsAdminViewActive(false);
              handleTrackSearch(trackingNum);
            }}
            onPrintLabel={(s) => setSelectedLabelShipment(s)}
          />
        </main>
      ) : (
        /* Regular Public FedEx Website View (Zero Admin Traces) */
        <>
          {/* Iconic FedEx Hero Section with Signature Purple Backdrop & Floating Search Card */}
          <section className="relative bg-[#4D148C] text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-[#FF6200] blur-3xl" />
              <div className="absolute -left-20 -bottom-20 w-96 h-96 rounded-full bg-white blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto space-y-8">
              <div className="text-center max-w-3xl mx-auto space-y-2">
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white text-balance">
                  Where now meets next.
                </h1>
                <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto font-medium">
                  Track packages, create shipping labels, find drop-off locations, and get quotes with FedEx.
                </p>
              </div>

              {/* FedEx Signature Floating Multi-Tab Console Card */}
              <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900">
                <div className="grid grid-cols-2 sm:grid-cols-5 border-b border-slate-200 bg-slate-50">
                  <button
                    onClick={() => setActiveTab('track')}
                    className={`py-3.5 px-4 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border-b-3 ${
                      activeTab === 'track'
                        ? 'border-[#FF6200] text-[#4D148C] bg-white'
                        : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Search className="w-4 h-4 text-[#FF6200]" />
                    <span>TRACK</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('ship')}
                    className={`py-3.5 px-4 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border-b-3 ${
                      activeTab === 'ship'
                        ? 'border-[#FF6200] text-[#4D148C] bg-white'
                        : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Box className="w-4 h-4 text-[#FF6200]" />
                    <span>SHIP</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('rates')}
                    className={`py-3.5 px-4 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border-b-3 ${
                      activeTab === 'rates'
                        ? 'border-[#FF6200] text-[#4D148C] bg-white'
                        : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Calculator className="w-4 h-4 text-[#FF6200]" />
                    <span>RATE & TRANSIT</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('locations')}
                    className={`py-3.5 px-4 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border-b-3 ${
                      activeTab === 'locations'
                        ? 'border-[#FF6200] text-[#4D148C] bg-white'
                        : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-[#FF6200]" />
                    <span>LOCATIONS</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('pickup')}
                    className={`col-span-2 sm:col-span-1 py-3.5 px-4 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border-b-3 ${
                      activeTab === 'pickup'
                        ? 'border-[#FF6200] text-[#4D148C] bg-white'
                        : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-[#FF6200]" />
                    <span>PICKUP</span>
                  </button>
                </div>

                {/* In-Hero Widget Container when 'track' is active */}
                {activeTab === 'track' && (
                  <div className="p-6 bg-white space-y-4">
                    <TrackingWidget
                      onSearch={handleTrackSearch}
                      recentShipments={shipments}
                    />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Main Workspace Body */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {activeTab === 'track' && (
              <div className="space-y-12">
                {/* Dedicated Tracking Page: Hero Status + Travel History + Action & Evidence Modules */}
                <TrackingPageView
                  shipment={trackedShipment || shipments[0]}
                  onSearch={handleTrackSearch}
                  onPrintLabel={() => setSelectedLabelShipment(trackedShipment || shipments[0])}
                  onOpenAdmin={handleManageDeliveriesClick}
                  onUpdateDeliveryInstructions={(instr) => {
                    const current = trackedShipment || shipments[0];
                    if (current) {
                      current.deliveryInstructions = instr;
                      saveShipmentToStorage(current);
                      setShipments(getStoredShipments());
                      showToast('Courier delivery instructions recorded and saved.');
                    }
                  }}
                />

                {/* 4 Iconic FedEx Service Pillars with their Brand Colors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* FedEx Express */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <FedExLogo variant="express" size="sm" />
                      </div>
                      <h3 className="font-bold text-sm text-slate-900">FedEx Express®</h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Time-definite express air shipping across the US and 220+ countries, with morning delivery commitments.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#FF6200]">Next-Day 8:00 AM & 10:30 AM</span>
                      <button
                        onClick={() => setActiveTab('ship')}
                        className="text-xs font-bold text-[#4D148C] hover:underline cursor-pointer"
                      >
                        Ship &rarr;
                      </button>
                    </div>
                  </div>

                  {/* FedEx Ground */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <FedExLogo variant="ground" size="sm" />
                      </div>
                      <h3 className="font-bold text-sm text-slate-900">FedEx Ground®</h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Cost-effective, day-definite ground shipping to 100% of continental US businesses and residences.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#008A00]">1-5 Business Days</span>
                      <button
                        onClick={() => setActiveTab('rates')}
                        className="text-xs font-bold text-[#4D148C] hover:underline cursor-pointer"
                      >
                        Rates &rarr;
                      </button>
                    </div>
                  </div>

                  {/* FedEx Freight */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <FedExLogo variant="freight" size="sm" />
                      </div>
                      <h3 className="font-bold text-sm text-slate-900">FedEx Freight®</h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Less-than-truckload (LTL) freight shipping for palletized cargo and heavy industrial machinery.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#DD1E25]">Priority & Economy LTL</span>
                      <button
                        onClick={() => setActiveTab('rates')}
                        className="text-xs font-bold text-[#4D148C] hover:underline cursor-pointer"
                      >
                        Quote &rarr;
                      </button>
                    </div>
                  </div>

                  {/* FedEx Office */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <FedExLogo variant="office" size="sm" />
                      </div>
                      <h3 className="font-bold text-sm text-slate-900">FedEx Office®</h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Packing services, printing and binding, mobile QR label-free returns, and passport photo capture.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#00A3E0]">2,000+ US Locations</span>
                      <button
                        onClick={() => setActiveTab('locations')}
                        className="text-xs font-bold text-[#4D148C] hover:underline cursor-pointer"
                      >
                        Find &rarr;
                      </button>
                    </div>
                  </div>
                </div>

                {/* Enterprise Shipping Solutions (Clean Corporate, Zero Tracking Numbers Exposed) */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                    <div>
                      <h2 className="text-xl font-black text-slate-900 tracking-tight">
                        FedEx Enterprise Solutions & Global Commerce
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Integrated transportation, customs clearance, and return fulfillment built for modern enterprise scale.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#4D148C] block">
                        CROSS-BORDER TRADE
                      </span>
                      <h4 className="text-base font-black text-slate-900">Customs Brokerage</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Electronic tariff clearance, automated duty classification, and regulatory compliance covering 220+ global jurisdictions.
                      </p>
                    </div>

                    <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#FF6200] block">
                        TEMPERATURE MONITORED
                      </span>
                      <h4 className="text-base font-black text-slate-900">Life Sciences & Clinical</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Active dry ice replenishment, thermal logging, and high-priority tarmac handling for pharmaceutical shipments.
                      </p>
                    </div>

                    <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#008A00] block">
                        REVERSE LOGISTICS
                      </span>
                      <h4 className="text-base font-black text-slate-900">Label-Free Returns</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Provide buyers with instant mobile return codes. Packages are inspected, packed, and processed at thousands of retail centers.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fleet Showcase Section */}
                <FleetShowcase />
              </div>
            )}

            {activeTab === 'ship' && (
              <div className="space-y-6">
                <ShippingForm onShipmentCreated={handleShipmentCreated} />
              </div>
            )}

            {activeTab === 'rates' && (
              <div className="space-y-6">
                <RateCalculator
                  onSelectServiceToShip={(service) => {
                    setActiveTab('ship');
                  }}
                />
              </div>
            )}

            {activeTab === 'pickup' && (
              <div className="space-y-6">
                <PickupScheduler />
              </div>
            )}

            {activeTab === 'locations' && (
              <div className="space-y-6">
                <LocationFinder />
              </div>
            )}
          </main>
        </>
      )}

      {/* Admin Login Modal (Triggered solely by 'Manage Deliveries') */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Tracking Modal */}
      {selectedTrackingShipment && (
        <TrackingModal
          shipment={selectedTrackingShipment}
          onClose={() => setSelectedTrackingShipment(null)}
          onPrintLabel={() => setSelectedLabelShipment(selectedTrackingShipment)}
          onOpenAdmin={handleManageDeliveriesClick}
        />
      )}

      {/* Thermal Shipping Label Modal */}
      {selectedLabelShipment && (
        <ShippingLabelModal
          shipment={selectedLabelShipment}
          onClose={() => setSelectedLabelShipment(null)}
          onTrack={(trk) => {
            handleTrackSearch(trk);
          }}
        />
      )}

      {/* Footer */}
      <Footer
        onSelectTab={(tab) => {
          setIsAdminViewActive(false);
          setActiveTab(tab);
        }}
        onManageDeliveries={handleManageDeliveriesClick}
      />
    </div>
  );
}
