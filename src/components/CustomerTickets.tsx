import React, { useState, useEffect, useRef } from 'react';
import { Ticket, Mail, MessageSquare, Phone, AlertCircle, User, X } from 'lucide-react';

interface TicketRequest {
  id: string;
  ticketNumber: string;
  timestamp: string;
  time: string;
  customer: string;
  module: 'cntr' | 'vs' | 'ea' | 'others';
  subject: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'assigned' | 'in_progress';
  type: 'Email' | 'SMS' | 'Call';
  assignedTo?: string;
}

const ALL_TICKETS: TicketRequest[] = [
  {
    id: '1',
    ticketNumber: 'ALR-861600',
    timestamp: '2025-10-09T09:15:23Z',
    time: 'Oct 9, 09:15',
    customer: 'Kenny (L1 Support)',
    module: 'cntr',
    subject: 'CMAU0000020 - Duplicate Container information received',
    priority: 'high',
    status: 'new',
    type: 'Email',
    assignedTo: 'Jen'
  },
  {
    id: '2',
    ticketNumber: 'ALR-861631',
    timestamp: '2025-10-09T09:22:45Z',
    time: 'Oct 9, 09:22',
    customer: 'Jia Xuan (L1 Support)',
    module: 'vs',
    subject: 'VESSEL_ERR_4 - System Vessel Name used by other vessel advice (MV Lion City 07)',
    priority: 'high',
    status: 'new',
    type: 'Email',
    assignedTo: 'Vedu'
  },
  {
    id: '3',
    ticketNumber: 'INC-154599',
    timestamp: '2025-10-09T09:30:12Z',
    time: 'Oct 9, 09:30',
    customer: 'Alert System',
    module: 'ea',
    subject: 'EDI message REF-IFT-0007 stuck in ERROR status (No acknowledgment sent)',
    priority: 'critical',
    status: 'new',
    type: 'SMS'
  },
  {
    id: '4',
    ticketNumber: 'TCK-742311',
    timestamp: '2025-10-09T09:35:56Z',
    time: 'Oct 9, 09:35',
    customer: 'L1 Support (Call)',
    module: 'vs',
    subject: 'MV PACIFIC DAWN/07E - BAPLIE inconsistency at Pasir Panjang Terminal 4',
    priority: 'critical',
    status: 'new',
    type: 'Call'
  },
];

const CustomerTickets: React.FC = () => {
  const [tickets, setTickets] = useState<TicketRequest[]>([ALL_TICKETS[0]]);
  const [_currentIndex, setCurrentIndex] = useState(0);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % ALL_TICKETS.length;
        
        if (nextIndex === 0) {
          setTickets([ALL_TICKETS[0]]);
        } else {
          setTickets((prev) => [...prev, ALL_TICKETS[nextIndex]]);
        }
        
        return nextIndex;
      });
    }, 3000); // Add new ticket every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom when new ticket arrives
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [tickets]);

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'critical':
        return { 
          color: 'text-red-400', 
          bg: 'bg-black/40 backdrop-blur-sm', 
          border: 'border-white/10',
          badge: 'bg-red-500 text-white',
          dotBg: 'bg-red-500'
        };
      case 'high':
        return { 
          color: 'text-orange-400', 
          bg: 'bg-black/40 backdrop-blur-sm', 
          border: 'border-white/10',
          badge: 'bg-orange-500 text-white',
          dotBg: 'bg-orange-500'
        };
      case 'medium':
        return { 
          color: 'text-yellow-400', 
          bg: 'bg-black/40 backdrop-blur-sm', 
          border: 'border-white/10',
          badge: 'bg-yellow-500/20 text-yellow-400',
          dotBg: 'bg-white/20'
        };
      default: // low
        return { 
          color: 'text-slate-400', 
          bg: 'bg-black/40 backdrop-blur-sm', 
          border: 'border-white/10',
          badge: 'bg-slate-500/20 text-slate-400',
          dotBg: 'bg-white/20'
        };
    }
  };

  const getModuleBadge = (module: string) => {
    const badges = {
      cntr: { label: 'CNTR', color: 'bg-blue-500/20 text-blue-400' },
      vs: { label: 'VS', color: 'bg-purple-500/20 text-purple-400' },
      ea: { label: 'EA', color: 'bg-emerald-500/20 text-emerald-400' },
      others: { label: 'OTHER', color: 'bg-slate-500/20 text-slate-400' }
    };
    return badges[module as keyof typeof badges] || badges.others;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Email':
        return <Mail className="w-3 h-3" />;
      case 'SMS':
        return <MessageSquare className="w-3 h-3" />;
      case 'Call':
        return <Phone className="w-3 h-3" />;
      default:
        return <Ticket className="w-3 h-3" />;
    }
  };

  return (
    <>
      <div className="relative bg-[#6b5d4f]/20 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />

        <div className="relative px-8 py-5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Ticket className="w-5 h-5 text-white" />
              <h2 className="text-2xl font-medium text-white tracking-tight">Customer Tickets</h2>
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/20 border border-emerald-500/40 rounded-full">
              <AlertCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-medium text-emerald-400 tracking-wider">{tickets.length} ACTIVE</span>
            </div>
          </div>
        </div>

      <div 
        ref={scrollRef}
        className="relative h-[600px] overflow-y-auto px-8 pt-6 pb-4"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.3) transparent'
        }}
      >
        <div className="space-y-4">
          {tickets.map((ticket, index) => {
            const priorityStyle = getPriorityStyle(ticket.priority);
            const moduleBadge = getModuleBadge(ticket.module);
            
            return (
              <div
                key={`${ticket.id}-${index}`}
                className={`relative pl-10 pb-4 ml-2 ${index !== tickets.length - 1 ? 'border-l border-white/10' : ''}`}
                style={{
                  animation: `fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)`,
                  opacity: 0,
                  animationFillMode: 'forwards',
                }}
              >
                <div className={`absolute left-0 top-0 -ml-[5px] w-[10px] h-[10px] rounded-full ${priorityStyle.dotBg} border ${priorityStyle.border}`} />
                
          <div 
            className={`group p-4 rounded-xl border ${priorityStyle.border} ${priorityStyle.bg} hover:shadow-xl transition-all duration-300 hover:scale-[1.01] ${ticket.id === '1' ? 'cursor-pointer' : ''}`}
            onClick={() => {
              if (ticket.id === '1') {
                setShowEmailModal(true);
              }
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-white/60">{getTypeIcon(ticket.type)}</span>
                <span className="text-xs font-mono font-semibold text-white">{ticket.ticketNumber}</span>
              </div>
              <span className="text-xs font-mono text-white/60 tracking-tight">{ticket.time}</span>
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2 py-0.5 text-[10px] font-mono font-semibold rounded uppercase tracking-wider ${priorityStyle.badge}`}>
                {ticket.priority}
              </span>
              <span className={`px-2 py-0.5 text-[10px] font-mono font-semibold rounded uppercase tracking-wider ${moduleBadge.color}`}>
                {moduleBadge.label}
              </span>
              {ticket.type && (
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded uppercase tracking-wider bg-slate-500/20 text-slate-400">
                  {ticket.type}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <User className="w-3 h-3 text-white/60" />
              <span className="text-xs text-white/80">{ticket.customer}</span>
              {ticket.assignedTo && (
                <span className="text-xs text-emerald-400">→ {ticket.assignedTo}</span>
              )}
            </div>
            
            <p className="text-sm text-white/80 leading-relaxed">{ticket.subject}</p>
          </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>

      {/* Email Detail Modal - Rendered outside container as full-screen overlay */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
          <div className="bg-[#6b5d4f]/30 backdrop-blur-xl border border-white/20 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-white" />
                <h3 className="text-lg font-semibold text-white">Email Details</h3>
              </div>
              <button
                onClick={() => setShowEmailModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white/60 hover:text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* Email Header */}
              <div className="space-y-3 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/50">Subject:</span>
                  <span className="text-sm font-semibold text-white">RE: Email ALR-861600 | CMAU0000020 - Duplicate Container information received</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/50">To:</span>
                  <span className="text-sm text-white">Ops Team Duty; Jen</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/50">Cc:</span>
                  <span className="text-sm text-white">Customer Service</span>
                </div>
              </div>

              {/* Email Body */}
              <div className="space-y-4">
                <p className="text-sm text-white/80">Hi Jen,</p>
                <p className="text-sm text-white/80">
                  Please assist in checking container <span className="font-mono font-semibold text-cyan-400">CMAU0000020</span>. Customer on PORTNET is seeing 2 identical containers information.
                </p>
                <p className="text-sm text-white/80">Thanks.</p>
                <div className="pt-2">
                  <p className="text-sm text-white/80">Regards,</p>
                  <p className="text-sm font-semibold text-white">Kenny</p>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-4 border-t border-white/10">
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="px-6 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerTickets;

