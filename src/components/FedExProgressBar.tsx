import React from 'react';
import { Shipment } from '../types/courier';
import { Check, Clock, Truck, Package, CheckCircle2, AlertCircle } from 'lucide-react';

interface FedExProgressBarProps {
  shipment: Shipment;
  className?: string;
}

interface MilestoneStep {
  stage: number;
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

const MILESTONES: MilestoneStep[] = [
  { stage: 1, id: 'INITIATED', label: 'Shipment Initiated', shortLabel: 'Initiated', icon: Package },
  { stage: 2, id: 'PICKED_UP', label: 'Picked Up', shortLabel: 'Picked Up', icon: Clock },
  { stage: 3, id: 'IN_TRANSIT', label: 'In Transit', shortLabel: 'In Transit', icon: Truck },
  { stage: 4, id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', shortLabel: 'Out for Deliv.', icon: Truck },
  { stage: 5, id: 'DELIVERED', label: 'Delivered', shortLabel: 'Delivered', icon: CheckCircle2 },
];

export const FedExProgressBar: React.FC<FedExProgressBarProps> = ({ shipment, className = '' }) => {
  const timelineLength = shipment.timeline?.length || 0;

  // Determine stage (1 to 5) based on status and timeline checkpoints
  const calculateStage = (): { currentStage: number; isPending: boolean; isDelivered: boolean } => {
    const status = shipment.status;
    const isPending = status === 'PENDING';
    const isDelivered = status === 'DELIVERED';

    if (isDelivered) {
      return { currentStage: 5, isPending: false, isDelivered: true };
    }
    if (status === 'OUT_FOR_DELIVERY') {
      return { currentStage: 4, isPending: false, isDelivered: false };
    }
    if (status === 'IN_TRANSIT' || status === 'CUSTOMS_CLEARANCE') {
      return { currentStage: 3, isPending: false, isDelivered: false };
    }
    if (status === 'PICKED_UP') {
      return { currentStage: 2, isPending: false, isDelivered: false };
    }
    if (isPending) {
      return { currentStage: 1, isPending: true, isDelivered: false };
    }
    if (status === 'LABEL_CREATED') {
      return { currentStage: 1, isPending: false, isDelivered: false };
    }

    // Secondary timeline length-based mapping
    if (timelineLength >= 7) {
      return { currentStage: 5, isPending: false, isDelivered: true };
    }
    if (timelineLength === 6) {
      return { currentStage: 4, isPending: false, isDelivered: false };
    }
    if (timelineLength >= 3) {
      return { currentStage: 3, isPending: false, isDelivered: false };
    }
    if (timelineLength === 2) {
      return { currentStage: 2, isPending: false, isDelivered: false };
    }
    return { currentStage: 1, isPending: false, isDelivered: false };
  };

  const { currentStage, isPending, isDelivered } = calculateStage();

  // Helper to extract relevant checkpoint scan info for each milestone step
  const getMilestoneDetails = (stage: number): { time?: string; location?: string; statusText?: string } => {
    const checkpoints = shipment.timeline || [];

    switch (stage) {
      case 1: {
        // Earliest checkpoint or creation info
        const earliest = checkpoints[checkpoints.length - 1];
        if (isPending) {
          return {
            time: earliest?.timeStr || shipment.createdAt || 'Pending Tender',
            location: `${shipment.sender.city}, ${shipment.sender.state}`,
            statusText: 'Awaiting Package',
          };
        }
        return {
          time: earliest?.dateStr ? `${earliest.dateStr}` : 'Label Created',
          location: `${shipment.sender.city}, ${shipment.sender.state}`,
          statusText: 'Shipment Created',
        };
      }
      case 2: {
        // Find pickup checkpoint or origin scan
        const pickupChk = checkpoints.find(
          (c) =>
            c.status.toLowerCase().includes('pickup') ||
            c.status.toLowerCase().includes('picked') ||
            c.status.toLowerCase().includes('tender') ||
            c.facilityType === 'LOCAL_FACILITY'
        );
        if (currentStage >= 2 && pickupChk) {
          return {
            time: `${pickupChk.dateStr} · ${pickupChk.timeStr}`,
            location: pickupChk.location,
            statusText: 'FedEx Facility',
          };
        }
        return {
          time: currentStage >= 2 ? 'Completed' : 'Scheduled',
          location: `${shipment.sender.city}, ${shipment.sender.state}`,
          statusText: currentStage >= 2 ? 'Received by FedEx' : 'Pending',
        };
      }
      case 3: {
        // Find transit or hub departure scan
        const transitChk = checkpoints.find(
          (c) =>
            c.status.toLowerCase().includes('departed') ||
            c.status.toLowerCase().includes('transit') ||
            c.status.toLowerCase().includes('arrived at') ||
            c.facilityType === 'SORT_FACILITY' ||
            c.facilityType === 'AIRPORT_HUB'
        );
        if (currentStage >= 3 && transitChk) {
          return {
            time: `${transitChk.dateStr} · ${transitChk.timeStr}`,
            location: transitChk.location,
            statusText: 'En Route',
          };
        }
        return {
          time: currentStage >= 3 ? 'In Progress' : 'Upcoming',
          location: 'FedEx Express Network',
          statusText: currentStage >= 3 ? 'On Schedule' : 'Upcoming',
        };
      }
      case 4: {
        // Find out for delivery scan
        const outChk = checkpoints.find(
          (c) =>
            c.status.toLowerCase().includes('vehicle') ||
            c.status.toLowerCase().includes('delivery') ||
            c.facilityType === 'VEHICLE'
        );
        if (currentStage >= 4 && outChk) {
          return {
            time: `${outChk.dateStr} · ${outChk.timeStr}`,
            location: outChk.location,
            statusText: 'Out for Delivery',
          };
        }
        return {
          time: currentStage >= 4 ? 'Today' : 'Upcoming',
          location: `${shipment.recipient.city}, ${shipment.recipient.state}`,
          statusText: currentStage >= 4 ? 'With Courier' : 'Upcoming',
        };
      }
      case 5: {
        if (isDelivered) {
          return {
            time: shipment.actualDelivery || shipment.proofOfDelivery?.timestamp || 'Delivered',
            location: `${shipment.recipient.city}, ${shipment.recipient.state}`,
            statusText: shipment.proofOfDelivery?.signedBy
              ? `Signed by ${shipment.proofOfDelivery.signedBy}`
              : 'Delivered',
          };
        }
        return {
          time: shipment.estimatedDelivery || 'Scheduled',
          location: `${shipment.recipient.city}, ${shipment.recipient.state}`,
          statusText: 'Pending Arrival',
        };
      }
      default:
        return {};
    }
  };

  return (
    <div className={`bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs ${className}`}>
      {/* Top Header: FedEx Status Badge & Timeline Scan Count */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black tracking-widest text-[#4D148C] uppercase">
            Shipment Progress
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-xs font-semibold text-slate-500">
            {timelineLength} {timelineLength === 1 ? 'Milestone' : 'Milestones'} Recorded
          </span>
        </div>

        {/* FedEx Status Pill */}
        <div>
          {isDelivered ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#008A00]/10 text-[#008A00] border border-[#008A00]/30 tracking-wide uppercase">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              Delivered
            </span>
          ) : isPending ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-900 border border-amber-300/80 tracking-wide uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
              </span>
              Pending Tender
            </span>
          ) : currentStage === 4 ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#FF6200]/10 text-[#FF6200] border border-[#FF6200]/30 tracking-wide uppercase">
              <Truck className="w-3.5 h-3.5 stroke-[2.5]" />
              Out for Delivery
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#4D148C]/10 text-[#4D148C] border border-[#4D148C]/20 tracking-wide uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4D148C] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4D148C]"></span>
              </span>
              In Transit · On Schedule
            </span>
          )}
        </div>
      </div>

      {/* FedEx Signature Segmented Progress Bar */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2.5">
        {MILESTONES.map((step) => {
          const isPassed = currentStage > step.stage;
          const isCurrent = currentStage === step.stage;

          // Compute color of this segmented bar block exactly like FedEx
          let barBgClass = 'bg-slate-200';
          if (isDelivered) {
            barBgClass = 'bg-[#008A00]';
          } else if (isPassed) {
            barBgClass = 'bg-[#4D148C]';
          } else if (isCurrent) {
            if (isPending) {
              barBgClass = 'bg-amber-500';
            } else if (step.stage === 4) {
              barBgClass = 'bg-[#FF6200]';
            } else {
              barBgClass = 'bg-[#4D148C]';
            }
          }

          return (
            <div key={step.id} className="flex flex-col gap-1.5">
              {/* Segmented Capsule Bar */}
              <div
                className={`h-3 sm:h-3.5 rounded-full relative overflow-hidden transition-all duration-300 ${barBgClass}`}
              >
                {/* Active Segment Visual Polish */}
                {isCurrent && !isDelivered && (
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Step Indicators and Detailed Labels */}
      <div className="grid grid-cols-5 gap-1 sm:gap-2 mt-3.5 pt-1">
        {MILESTONES.map((step) => {
          const isPassed = currentStage > step.stage;
          const isCurrent = currentStage === step.stage;
          const details = getMilestoneDetails(step.stage);

          // Milestone icon & badge style
          let iconBg = 'bg-slate-100 border border-slate-200 text-slate-400';
          let textColor = 'text-slate-400 font-semibold';

          if (isDelivered) {
            iconBg = 'bg-[#008A00] text-white shadow-xs';
            textColor = 'text-slate-900 font-bold';
          } else if (isPassed) {
            iconBg = 'bg-[#4D148C] text-white shadow-xs';
            textColor = 'text-slate-900 font-bold';
          } else if (isCurrent) {
            if (isPending) {
              iconBg = 'bg-amber-500 text-white ring-4 ring-amber-100 shadow-sm';
              textColor = 'text-amber-900 font-black';
            } else if (step.stage === 4) {
              iconBg = 'bg-[#FF6200] text-white ring-4 ring-orange-100 shadow-sm';
              textColor = 'text-[#FF6200] font-black';
            } else {
              iconBg = 'bg-[#4D148C] text-white ring-4 ring-purple-100 shadow-sm';
              textColor = 'text-[#4D148C] font-black';
            }
          }

          return (
            <div key={step.id} className="flex flex-col items-center text-center px-0.5">
              {/* Step Circle Indicator */}
              <div
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs transition-transform ${
                  isCurrent ? 'scale-110' : ''
                } ${iconBg}`}
              >
                {isDelivered || isPassed ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : isCurrent ? (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-400">{step.stage}</span>
                )}
              </div>

              {/* Milestone Label */}
              <span
                className={`text-[10px] sm:text-[11.5px] mt-2 leading-tight uppercase tracking-tight block ${textColor}`}
              >
                {step.stage === 1 && isPending ? 'Pending Tender' : step.shortLabel}
              </span>

              {/* Checkpoint Detail / Location */}
              <div className="mt-1 hidden sm:flex flex-col items-center">
                {details.statusText && (
                  <span
                    className={`text-[10px] font-medium leading-none ${
                      isCurrent
                        ? isPending
                          ? 'text-amber-800 font-bold'
                          : 'text-[#4D148C] font-bold'
                        : isPassed || isDelivered
                        ? 'text-slate-700 font-medium'
                        : 'text-slate-400'
                    }`}
                  >
                    {details.statusText}
                  </span>
                )}
                {details.location && (
                  <span className="text-[9.5px] text-slate-500 truncate max-w-[100px] mt-0.5">
                    {details.location}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Stage Detail Note Banner (FedEx Style Callout) */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        {isPending ? (
          <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-amber-50/80 border border-amber-200/70 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-950">
                Awaiting Package Tender from Shipper ({shipment.sender.name})
              </p>
              <p className="text-amber-800 text-[11px] mt-0.5">
                Shipment documentation and tracking number generated. Tracking scans will update automatically as soon as the package is tendered to a FedEx courier or drop box in {shipment.sender.city}, {shipment.sender.state}.
              </p>
            </div>
          </div>
        ) : isDelivered ? (
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/60 text-xs text-emerald-950">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#008A00] shrink-0" />
              <div>
                <span className="font-bold">Shipment successfully delivered</span>
                {shipment.proofOfDelivery?.signedBy && (
                  <span className="text-emerald-800 ml-1">
                    · Signed by <span className="font-bold">{shipment.proofOfDelivery.signedBy}</span>
                  </span>
                )}
              </div>
            </div>
            {shipment.actualDelivery && (
              <span className="text-[11px] font-bold text-emerald-800 shrink-0 hidden sm:inline">
                {shipment.actualDelivery}
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#4D148C] shrink-0" />
              <span className="text-[11px]">
                <strong className="text-slate-900 font-bold">Latest Scan: </strong>
                {shipment.timeline?.[0]?.status || shipment.statusMessage}
                {shipment.timeline?.[0]?.location && ` · ${shipment.timeline[0].location}`}
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#4D148C] shrink-0 hidden sm:inline">
              FedEx Guaranteed Transit
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
