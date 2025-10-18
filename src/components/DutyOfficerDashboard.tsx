import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Play, 
  Pause, 
  RotateCcw,
  Users,
  Zap,
  Shield,
  FileText,
  Activity,
  TrendingUp,
  Target,
  MessageSquare,
  Send
} from 'lucide-react';

interface Incident {
  id: string;
  type: string;
  service: string;
  detectedBy: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'approved' | 'rejected' | 'in-progress' | 'resolved';
  problem: string;
  operationalImpact: string[];
  systemBehavior: string[];
  keyConsiderations: Array<{
    type: 'pro' | 'warning' | 'timing';
    text: string;
  }>;
  nextStep: string;
  proposedSolution?: {
    title: string;
    description: string;
    estimatedTime: string;
    riskLevel: 'low' | 'medium' | 'high';
    blastRadius: string;
    confidence: number;
  };
  timestamp: string;
}

const DutyOfficerDashboard: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: 'INC-001',
      type: 'Schedule Drift',
      service: 'Vessel / Berth Planning',
      detectedBy: 'Real-Time Sentinel',
      severity: 'high',
      status: 'pending',
      problem: 'ETA/ETB for VESSEL_ID is out of sync by 90 minutes between Berth Plan and TOS. Partner portal shows outdated ETA → pilotage request delayed. Crane allocation already done based on wrong time window.',
      operationalImpact: [
        'Wrong berth window = misaligned crane work orders',
        'Possible TOS and resource allocation conflict downstream',
        'SLA breach if not corrected before vessel arrival'
      ],
      systemBehavior: [
        'Automatic refresh will happen in 2 hours, but crane plan already locked',
        'Downstream services (pilotage + portal) depend on ETA alignment',
        'Multiple past incidents of similar nature caused > 2h delays'
      ],
      keyConsiderations: [
        { type: 'pro', text: 'Synchronizing ETA manually requires pilotage confirmation' },
        { type: 'warning', text: 'Forcing an immediate sync can disrupt crane shifts mid-operation' },
        { type: 'timing', text: 'Waiting for auto-correction risks knock-on delays and penalties' }
      ],
      nextStep: 'Choose reconciliation timing & method. Confirm pilotage alignment before recalculating berth window. Trigger downstream notifications after confirmation.',
      proposedSolution: {
        title: 'Immediate ETA Synchronization with Crane Reallocation',
        description: 'Execute immediate ETA sync with pilotage confirmation, then trigger crane work order recalculation to prevent downstream conflicts.',
        estimatedTime: '15-20 minutes',
        riskLevel: 'medium',
        blastRadius: 'Berth Planning, Crane Ops, Pilotage Services',
        confidence: 87
      },
      timestamp: '14:23 UTC'
    },
    {
      id: 'INC-002',
      type: 'Inbound Data Failure',
      service: 'EDI Translator',
      detectedBy: 'Ticket-Based Sentinel',
      severity: 'medium',
      status: 'pending',
      problem: 'EDI message REF-IFT-0007 failed to process due to missing segment (EDI_ERR_1). Translator stuck in error state for > 10 minutes. Affected container events are not updated in the timeline.',
      operationalImpact: [
        'Containers associated with REF-IFT-0007 will not progress',
        'Timeline gaps can affect truck scheduling and yard operations',
        'Delay may propagate to downstream visibility platforms'
      ],
      systemBehavior: [
        'Validator logs confirm a missing segment at parsing stage',
        'The system will not retry automatically',
        'Partners typically resend after 2 hours if no acknowledgment is received'
      ],
      keyConsiderations: [
        { type: 'pro', text: 'Issue can be recovered by validating and reprocessing message internally' },
        { type: 'warning', text: 'Manual fix is possible but slow' },
        { type: 'timing', text: 'Waiting for partner resend breaches SLA and visibility timelines' }
      ],
      nextStep: 'Decide whether to recover internally or wait for external resend. Acknowledge partner once timeline consistency is restored.',
      proposedSolution: {
        title: 'Internal Message Recovery with Segment Validation',
        description: 'Manually validate and reprocess the EDI message internally, then send acknowledgment to partner to maintain SLA compliance.',
        estimatedTime: '8-12 minutes',
        riskLevel: 'low',
        blastRadius: 'EDI Translator, Container Timeline',
        confidence: 94
      },
      timestamp: '14:18 UTC'
    },
    {
      id: 'INC-003',
      type: 'Authentication Failure',
      service: 'API Gateway / OAuth',
      detectedBy: 'Real-Time Sentinel',
      severity: 'critical',
      status: 'pending',
      problem: 'Sudden spike in 401/403 rejections for `/auth/token`. Root cause: clock skew across multiple nodes. Several external subscribers missed webhook pushes.',
      operationalImpact: [
        'Real-time data feeds to partners are broken or delayed',
        'Token rejections cause session expiry for active subscribers',
        'Partner SLAs at risk if sustained > 30 minutes'
      ],
      systemBehavior: [
        'Leeway set to ±30s, insufficient for current skew levels',
        'Token rotation scheduled for tonight, but error is happening now',
        'Caches show inconsistent key timestamps'
      ],
      keyConsiderations: [
        { type: 'pro', text: 'Scaling cache nodes and warming them before key rotation stabilizes token refresh' },
        { type: 'warning', text: 'Forcing rotation now without pre-warming can cause secondary spike' },
        { type: 'timing', text: 'No intervention means partners experience continued downtime' }
      ],
      nextStep: 'Decide whether to rotate immediately or prepare mitigation first. Communicate downtime to affected subscribers if needed.',
      proposedSolution: {
        title: 'Emergency Token Rotation with Cache Pre-warming',
        description: 'Execute immediate cache node scaling and pre-warming, then perform emergency token rotation to restore partner connectivity.',
        estimatedTime: '25-35 minutes',
        riskLevel: 'high',
        blastRadius: 'API Gateway, OAuth Service, All Partner Integrations',
        confidence: 76
      },
      timestamp: '14:15 UTC'
    }
  ]);

  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [decisionNotes, setDecisionNotes] = useState<{[key: string]: string}>({});
  const [customSolutions, setCustomSolutions] = useState<{[key: string]: string}>({});
  const [showCustomSolution, setShowCustomSolution] = useState<{[key: string]: boolean}>({});

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-950/30 border-red-800/40';
      case 'high': return 'text-orange-400 bg-orange-950/30 border-orange-800/40';
      case 'medium': return 'text-amber-400 bg-amber-950/30 border-amber-800/40';
      default: return 'text-blue-400 bg-blue-950/30 border-blue-800/40';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'text-emerald-400 bg-emerald-950/30 border-emerald-800/40';
      case 'in-progress': return 'text-blue-400 bg-blue-950/30 border-blue-800/40';
      case 'approved': return 'text-cyan-400 bg-cyan-950/30 border-cyan-800/40';
      case 'rejected': return 'text-red-400 bg-red-950/30 border-red-800/40';
      default: return 'text-slate-400 bg-slate-800/30 border-slate-700/40';
    }
  };

  const getConsiderationIcon = (type: string) => {
    switch (type) {
      case 'pro': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'timing': return <Clock className="w-4 h-4 text-blue-400" />;
      default: return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleDecision = (incidentId: string, decision: 'approved' | 'rejected') => {
    setIncidents(prev => prev.map(incident => 
      incident.id === incidentId 
        ? { ...incident, status: decision }
        : incident
    ));
  };

  const toggleCustomSolution = (incidentId: string) => {
    setShowCustomSolution(prev => ({
      ...prev,
      [incidentId]: !prev[incidentId]
    }));
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-amber-400';
      default: return 'text-emerald-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-950/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

      {/* Header */}
      <header className="relative border-b border-cyan-900/30 bg-slate-950/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Users className="w-10 h-10 text-cyan-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400">
                  <div className="absolute inset-0 rounded-full animate-ping bg-cyan-400" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Duty Officer Command Center
                </h1>
                <p className="text-sm text-slate-400">Incident Response & Decision Management</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-cyan-950/30 border border-cyan-800/40 rounded-lg">
                <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="text-sm font-medium text-cyan-400">3 ACTIVE INCIDENTS</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-slate-300">System Operational</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-cyan-900/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-400" />
              <div>
                <div className="text-2xl font-bold text-red-400">1</div>
                <div className="text-sm text-slate-400">Critical</div>
              </div>
            </div>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-sm border border-cyan-900/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-orange-400" />
              <div>
                <div className="text-2xl font-bold text-orange-400">1</div>
                <div className="text-sm text-slate-400">High Priority</div>
              </div>
            </div>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-sm border border-cyan-900/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-amber-400" />
              <div>
                <div className="text-2xl font-bold text-amber-400">1</div>
                <div className="text-sm text-slate-400">Medium</div>
              </div>
            </div>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-sm border border-cyan-900/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-blue-400">3</div>
                <div className="text-sm text-slate-400">Pending Review</div>
              </div>
            </div>
          </div>
        </div>

        {/* Incidents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
          {incidents.map((incident) => (
            <div
              key={incident.id}
              className={`relative bg-slate-900/50 backdrop-blur-sm border rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer flex flex-col h-full ${
                selectedIncident === incident.id 
                  ? 'border-cyan-500 ring-2 ring-cyan-500/50' 
                  : 'border-cyan-900/30'
              }`}
              onClick={() => setSelectedIncident(selectedIncident === incident.id ? null : incident.id)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/10 to-transparent pointer-events-none" />

              {/* Header */}
              <div className="relative px-6 py-4 border-b border-cyan-900/30 bg-slate-950/50 flex-shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-cyan-400" />
                    <span className="text-lg font-bold text-cyan-400">{incident.id}</span>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(incident.severity)}`}>
                    {incident.severity.toUpperCase()}
                  </div>
                </div>
                <div className="text-sm text-slate-300 font-medium">{incident.type}</div>
                <div className="text-xs text-slate-400 min-h-[1.25rem]">{incident.service}</div>
              </div>

              {/* Content */}
              <div className="relative p-6 space-y-4 flex-1 flex flex-col">
                {/* Problem Summary - Full Text */}
                <div className="flex-shrink-0">
                  <h4 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Problem Summary
                  </h4>
                  <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-3 min-h-[4.5rem]">
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {incident.problem}
                    </p>
                  </div>
                </div>

                {/* Proposed Solution */}
                {incident.proposedSolution && (
                  <div className="bg-slate-800/30 border border-slate-700/40 rounded-lg p-4 flex-shrink-0 min-h-[8rem]">
                    <h4 className="text-sm font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      AI Proposed Solution
                    </h4>
                    <div className="text-sm text-slate-300 font-medium mb-2">
                      {incident.proposedSolution.title}
                    </div>
                    <div className="text-xs text-slate-400 mb-3">
                      {incident.proposedSolution.description}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Time:</span>
                        <span className="text-slate-300">{incident.proposedSolution.estimatedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Risk:</span>
                        <span className={getRiskColor(incident.proposedSolution.riskLevel)}>
                          {incident.proposedSolution.riskLevel.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Confidence:</span>
                        <span className="text-cyan-400">{incident.proposedSolution.confidence}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Blast Radius:</span>
                        <span className="text-slate-300 text-right">
                          {incident.proposedSolution.blastRadius.split(', ').length} services
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Custom Solution Input */}
                {incident.status === 'pending' && (
                  <div className="space-y-3 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCustomSolution(incident.id);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-800/30 border border-slate-700/40 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-slate-300 transition-colors text-sm"
                    >
                      <MessageSquare className="w-4 h-4" />
                      {showCustomSolution[incident.id] ? 'Hide Custom Solution' : 'Provide Custom Solution'}
                    </button>

                    {showCustomSolution[incident.id] && (
                      <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-amber-400 mb-2 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Duty Officer Solution
                        </h4>
                        <textarea
                          value={customSolutions[incident.id] || ''}
                          onChange={(e) => {
                            e.stopPropagation();
                            setCustomSolutions(prev => ({ ...prev, [incident.id]: e.target.value }));
                          }}
                          placeholder="Describe your alternative solution approach..."
                          className="w-full h-20 bg-slate-900/50 border border-slate-600/40 rounded-lg p-3 text-slate-300 placeholder-slate-500 resize-none focus:outline-none focus:border-amber-500 text-sm"
                        />
                        <div className="mt-2 text-xs text-slate-500">
                          This will override the AI-proposed solution when you approve.
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Status and Actions - Bottom Section */}
                <div className="mt-auto space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(incident.status)}`}>
                      {incident.status.toUpperCase()}
                    </div>
                    <div className="text-xs text-slate-500">{incident.timestamp}</div>
                  </div>

                  {/* Action Buttons */}
                  {incident.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDecision(incident.id, 'approved');
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-emerald-950/30 border border-emerald-800/40 rounded-lg text-emerald-400 hover:bg-emerald-950/50 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDecision(incident.id, 'rejected');
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-950/30 border border-red-800/40 rounded-lg text-red-400 hover:bg-red-950/50 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed View Modal */}
        {selectedIncident && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-cyan-900/30 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {(() => {
                const incident = incidents.find(i => i.id === selectedIncident);
                if (!incident) return null;

                return (
                  <>
                    {/* Modal Header */}
                    <div className="sticky top-0 bg-slate-950/95 backdrop-blur-sm border-b border-cyan-900/30 px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <AlertTriangle className="w-8 h-8 text-cyan-400" />
                          <div>
                            <h2 className="text-2xl font-bold text-cyan-400">{incident.id}</h2>
                            <p className="text-slate-400">{incident.type} • {incident.service}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedIncident(null)}
                          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <XCircle className="w-6 h-6 text-slate-400" />
                        </button>
                      </div>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6 space-y-6">
                      {/* Problem Details */}
                      <div>
                        <h3 className="text-lg font-semibold text-slate-200 mb-3">🚨 INCIDENT BRIEFING</h3>
                        <div className="bg-slate-800/30 border border-slate-700/40 rounded-lg p-4">
                          <p className="text-slate-300 leading-relaxed">{incident.problem}</p>
                        </div>
                      </div>

                      {/* Operational Impact */}
                      <div>
                        <h4 className="text-md font-semibold text-slate-200 mb-3">Operational Impact:</h4>
                        <ul className="space-y-2">
                          {incident.operationalImpact.map((impact, index) => (
                            <li key={index} className="flex items-start gap-2 text-slate-300">
                              <span className="text-red-400 mt-1">•</span>
                              <span>{impact}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* System Behavior */}
                      <div>
                        <h4 className="text-md font-semibold text-slate-200 mb-3">System Behavior:</h4>
                        <ul className="space-y-2">
                          {incident.systemBehavior.map((behavior, index) => (
                            <li key={index} className="flex items-start gap-2 text-slate-300">
                              <span className="text-blue-400 mt-1">•</span>
                              <span>{behavior}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Key Considerations */}
                      <div>
                        <h4 className="text-md font-semibold text-slate-200 mb-3">Key Considerations for Duty Officer:</h4>
                        <div className="space-y-3">
                          {incident.keyConsiderations.map((consideration, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-slate-800/30 border border-slate-700/40 rounded-lg">
                              {getConsiderationIcon(consideration.type)}
                              <span className="text-slate-300">{consideration.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Proposed Solution */}
                      {incident.proposedSolution && (
                        <div>
                          <h4 className="text-md font-semibold text-emerald-400 mb-3">🎯 Proposed Solution</h4>
                          <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-lg p-4">
                            <h5 className="text-lg font-semibold text-emerald-400 mb-2">
                              {incident.proposedSolution.title}
                            </h5>
                            <p className="text-slate-300 mb-4">{incident.proposedSolution.description}</p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-cyan-400">{incident.proposedSolution.estimatedTime}</div>
                                <div className="text-xs text-slate-500">Estimated Time</div>
                              </div>
                              <div className="text-center">
                                <div className={`text-2xl font-bold ${getRiskColor(incident.proposedSolution.riskLevel)}`}>
                                  {incident.proposedSolution.riskLevel.toUpperCase()}
                                </div>
                                <div className="text-xs text-slate-500">Risk Level</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-emerald-400">{incident.proposedSolution.confidence}%</div>
                                <div className="text-xs text-slate-500">Confidence</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-amber-400">
                                  {incident.proposedSolution.blastRadius.split(', ').length}
                                </div>
                                <div className="text-xs text-slate-500">Affected Services</div>
                              </div>
                            </div>

                            <div className="mb-4">
                              <div className="text-sm text-slate-500 mb-1">Blast Radius:</div>
                              <div className="text-sm text-slate-300">{incident.proposedSolution.blastRadius}</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Next Steps */}
                      <div>
                        <h4 className="text-md font-semibold text-slate-200 mb-3">Next Step:</h4>
                        <div className="bg-slate-800/30 border border-slate-700/40 rounded-lg p-4">
                          <p className="text-slate-300">{incident.nextStep}</p>
                        </div>
                      </div>

                      {/* Custom Solution Input */}
                      {incident.status === 'pending' && (
                        <div>
                          <h4 className="text-md font-semibold text-amber-400 mb-3 flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Custom Solution (Optional)
                          </h4>
                          <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-4">
                            <textarea
                              value={customSolutions[incident.id] || ''}
                              onChange={(e) => setCustomSolutions(prev => ({ ...prev, [incident.id]: e.target.value }))}
                              placeholder="If the AI-proposed solution is incorrect, describe your alternative approach here..."
                              className="w-full h-32 bg-slate-900/50 border border-slate-600/40 rounded-lg p-3 text-slate-300 placeholder-slate-500 resize-none focus:outline-none focus:border-amber-500"
                            />
                            <div className="mt-2 text-sm text-slate-500">
                              💡 This custom solution will override the AI proposal when you approve the incident.
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Decision Notes */}
                      <div>
                        <h4 className="text-md font-semibold text-slate-200 mb-3">Decision Notes:</h4>
                        <textarea
                          value={decisionNotes[incident.id] || ''}
                          onChange={(e) => setDecisionNotes(prev => ({ ...prev, [incident.id]: e.target.value }))}
                          placeholder="Add your decision rationale and notes here..."
                          className="w-full h-24 bg-slate-800/30 border border-slate-700/40 rounded-lg p-3 text-slate-300 placeholder-slate-500 resize-none focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      {/* Action Buttons */}
                      {incident.status === 'pending' && (
                        <div className="space-y-4 pt-4 border-t border-slate-700/40">
                          {/* Solution Preview */}
                          {customSolutions[incident.id] && (
                            <div className="bg-amber-950/20 border border-amber-800/40 rounded-lg p-3">
                              <div className="text-sm text-amber-400 font-medium mb-1">
                                ⚠️ Custom Solution Will Be Used
                              </div>
                              <div className="text-xs text-slate-300">
                                Your custom solution will override the AI proposal when approved.
                              </div>
                            </div>
                          )}
                          
                          <div className="flex gap-4">
                            <button
                              onClick={() => {
                                handleDecision(incident.id, 'approved');
                                setSelectedIncident(null);
                              }}
                              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-950/30 border border-emerald-800/40 rounded-lg text-emerald-400 hover:bg-emerald-950/50 transition-colors font-medium"
                            >
                              <CheckCircle className="w-5 h-5" />
                              {customSolutions[incident.id] ? 'Approve Custom Solution' : 'Approve AI Solution'}
                            </button>
                            <button
                              onClick={() => {
                                handleDecision(incident.id, 'rejected');
                                setSelectedIncident(null);
                              }}
                              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-950/30 border border-red-800/40 rounded-lg text-red-400 hover:bg-red-950/50 transition-colors font-medium"
                            >
                              <XCircle className="w-5 h-5" />
                              Reject Solution
                            </button>
                            <button
                              onClick={() => setSelectedIncident(null)}
                              className="px-6 py-3 bg-slate-800/30 border border-slate-700/40 rounded-lg text-slate-300 hover:bg-slate-800/50 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DutyOfficerDashboard;
