import React, { useState, useEffect, useRef } from 'react';
import { Ticket, Mail, MessageSquare, Phone, AlertCircle, User } from 'lucide-react';

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
  const [currentIndex, setCurrentIndex] = useState(0);
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
          bg: 'bg-red-950/30', 
          border: 'border-red-800/40',
          badge: 'bg-red-500/20 text-red-400 border-red-500/40'
        };
      case 'high':
        return { 
          color: 'text-orange-400', 
          bg: 'bg-orange-950/30', 
          border: 'border-orange-800/40',
          badge: 'bg-orange-500/20 text-orange-400 border-orange-500/40'
        };
      case 'medium':
        return { 
          color: 'text-yellow-400', 
          bg: 'bg-yellow-950/30', 
          border: 'border-yellow-800/40',
          badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
        };
      default: // low
        return { 
          color: 'text-slate-400', 
          bg: 'bg-slate-800/30', 
          border: 'border-slate-700/40',
          badge: 'bg-slate-500/20 text-slate-400 border-slate-500/40'
        };
    }
  };

  const getModuleBadge = (module: string) => {
    const badges = {
      cntr: { label: 'CNTR', color: 'bg-blue-500/20 text-blue-400 border-blue-500/40' },
      vs: { label: 'VS', color: 'bg-purple-500/20 text-purple-400 border-purple-500/40' },
      ea: { label: 'EA', color: 'bg-green-500/20 text-green-400 border-green-500/40' },
      others: { label: 'OTHER', color: 'bg-slate-500/20 text-slate-400 border-slate-500/40' }
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
    <div className="relative bg-slate-900/50 backdrop-blur-sm border border-cyan-900/30 rounded-xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800/10 to-transparent pointer-events-none" />

      <div className="relative px-6 py-4 border-b border-cyan-900/30 bg-slate-950/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Ticket className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-cyan-400">Customer Tickets</h2>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-950/40 border border-emerald-800/40 rounded-lg">
            <AlertCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-400">{tickets.length} ACTIVE</span>
          </div>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="relative h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700/50 scrollbar-track-transparent px-6 pt-6 pb-2"
      >
        <div className="space-y-3">
          {tickets.map((ticket, index) => {
            const priorityStyle = getPriorityStyle(ticket.priority);
            const moduleBadge = getModuleBadge(ticket.module);
            
            return (
              <div
                key={`${ticket.id}-${index}`}
                className={`relative pl-8 pb-3 ml-2 ${index !== tickets.length - 1 ? 'border-l-2 border-slate-700/30' : ''}`}
                style={{
                  animation: `fadeInUp 0.5s ease-out`,
                  opacity: 0,
                  animationFillMode: 'forwards',
                }}
              >
                <div className={`absolute left-0 top-0 -ml-2.5 w-5 h-5 rounded-full ${priorityStyle.bg} border-2 ${priorityStyle.border} flex items-center justify-center ${priorityStyle.color}`}>
                  <AlertCircle className="w-3 h-3" />
                </div>
                
                <div className={`p-3 rounded-lg border ${priorityStyle.border} ${priorityStyle.bg} hover:border-cyan-600/60 transition-all duration-200`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">{getTypeIcon(ticket.type)}</span>
                      <span className="text-xs font-mono font-semibold text-cyan-400">{ticket.ticketNumber}</span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">{ticket.time}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${priorityStyle.badge}`}>
                      {ticket.priority.toUpperCase()}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${moduleBadge.color}`}>
                      {moduleBadge.label}
                    </span>
                    {ticket.type && (
                      <span className="px-2 py-0.5 text-xs font-semibold rounded border bg-slate-500/20 text-slate-400 border-slate-500/40">
                        {ticket.type.toUpperCase()}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-300">{ticket.customer}</span>
                    {ticket.assignedTo && (
                      <span className="text-xs text-emerald-400">→ {ticket.assignedTo}</span>
                    )}
                  </div>
                  
                  <p className="text-sm text-slate-200">{ticket.subject}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CustomerTickets;

