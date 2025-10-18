import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Brain, FileSearch, Database, BookOpen, Zap, CheckCircle, AlertCircle, TrendingUp, Clock, Sparkles, Activity, Eye } from 'lucide-react';

interface Evidence {
  id: string;
  source: 'logs' | 'kb' | 'cases';
  timestamp: string;
  content: string;
  relevance: number;
}

interface RootCause {
  id: string;
  title: string;
  confidence: number;
  description: string;
  evidence: Evidence[];
  affectedServices: string[];
  impactAnalysis: string;
  technicalDetails: string;
}

interface SearchActivity {
  id: string;
  action: string;
  status: 'searching' | 'found' | 'analyzing';
}

// Sample issues to analyze - moved outside component to prevent recreating
const sampleIssues = [
  { id: 'issue1', name: 'EDI Message Processing Failed - Segment Missing', tag: 'INC-154599' },
  { id: 'issue2', name: 'Duplicate Vessel Name - MV Lion City 07', tag: 'ALR-861631' },
  { id: 'issue3', name: 'Container Snapshot Duplicate - CMAU0000020', tag: 'ALR-861600' },
];

// Mock root causes database - moved outside component to prevent recreating
const mockRootCauses: RootCause[] = [
    {
      id: 'rc1',
      title: 'EDI Message Format Violation - Missing Mandatory LOC Segment',
      confidence: 94,
      description: 'The IFTMIN message from LINE-PSA is missing the mandatory LOC (Location) segment required by the PSA-TOS EDI parser. This is a known recurring issue when the sender\'s EDI generator is not updated to the latest specification.',
      evidence: [
        {
          id: 'e1',
          source: 'logs',
          timestamp: '2025-10-04T12:25:10Z',
          content: 'EDI_ERR_1: Segment missing - Expected LOC segment after NAD',
          relevance: 98
        },
        {
          id: 'e2',
          source: 'kb',
          timestamp: '2024-08-15',
          content: 'KB-2341: EDI IFTMIN messages must contain LOC segment as per SMDG 3.2 specification',
          relevance: 92
        },
        {
          id: 'e3',
          source: 'cases',
          timestamp: '2025-09-10',
          content: 'Case TCK-691242: Same sender had 12 similar failures resolved by updating EDI mapping',
          relevance: 87
        }
      ],
      affectedServices: ['EDI Advice Service', 'Container Service'],
      impactAnalysis: 'HIGH - Blocking 100% of IFTMIN messages from LINE-PSA. Estimated 45-60 messages per day affected. Container loading instructions not reaching TOS system.',
      technicalDetails: 'Parser expects LOC segment (Location Details) after NAD segment (Name and Address). LINE-PSA EDI generator v2.3.1 is not compliant with SMDG 3.2 specification which mandates LOC segment for vessel stowage planning.'
    },
    {
      id: 'rc2',
      title: 'Active Vessel Advice Not Closed Before Creating New Advice',
      confidence: 89,
      description: 'System prevents duplicate vessel names when an active vessel advice exists. The previous vessel advice for "MV Lion City 07" was not properly closed after the vessel departed.',
      evidence: [
        {
          id: 'e4',
          source: 'logs',
          timestamp: '2025-10-08T09:14:12Z',
          content: 'VESSEL_ERR_4: System vessel name already in use by active advice',
          relevance: 95
        },
        {
          id: 'e5',
          source: 'cases',
          timestamp: '2025-09-28',
          content: 'Case ALR-859200: Similar issue resolved by closing stale vessel advice',
          relevance: 88
        },
        {
          id: 'e6',
          source: 'kb',
          timestamp: '2024-11-20',
          content: 'KB-3102: Vessel names must be unique across active advices to prevent scheduling conflicts',
          relevance: 82
        }
      ],
      affectedServices: ['Vessel Advice Service', 'Berth Application'],
      impactAnalysis: 'MEDIUM - Preventing new vessel advice creation for incoming vessel. Manual workaround possible but requires coordination with Port Operations team.',
      technicalDetails: 'Database constraint enforces unique system_vessel_name across records with status != "CLOSED". Previous advice (ID: 1000010950) still has status "ACTIVE" despite vessel departure 8 hours ago. Likely missed departure event or async closure process failure.'
    },
    {
      id: 'rc3',
      title: 'Race Condition in Container Snapshot Creation',
      confidence: 76,
      description: 'Multiple concurrent requests attempting to create snapshots for the same container within a short time window, causing duplicate detection warnings.',
      evidence: [
        {
          id: 'e7',
          source: 'logs',
          timestamp: '2025-10-09T09:20:15Z',
          content: 'Duplicate container snapshot attempt detected for CMAU0000020',
          relevance: 91
        },
        {
          id: 'e8',
          source: 'logs',
          timestamp: '2025-10-09T09:19:58Z',
          content: 'Container snapshot created: CMAU0000020, correlation_id=corr-cont-0012',
          relevance: 85
        },
        {
          id: 'e9',
          source: 'kb',
          timestamp: '2024-10-05',
          content: 'KB-2890: Container service uses optimistic locking to prevent duplicate snapshots',
          relevance: 79
        }
      ],
      affectedServices: ['Container Service', 'API Event Service'],
      impactAnalysis: 'LOW - System design prevented data corruption. No functional impact. Warning logs may cause noise in monitoring systems.',
      technicalDetails: 'Two concurrent API calls (17ms apart) attempted to create snapshot for same container. First succeeded (09:19:58.123Z), second detected existing record via unique constraint on (container_id, created_at) and returned 409 Conflict. Optimistic locking working as designed.'
    }
];

const Detective: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<'idle' | 'scanning' | 'analyzing' | 'complete'>('idle');
  const [searchedLogs, setSearchedLogs] = useState(0);
  const [searchedKB, setSearchedKB] = useState(0);
  const [searchedCases, setSearchedCases] = useState(0);
  const [rootCauses, setRootCauses] = useState<RootCause[]>([]);
  const [selectedCause, setSelectedCause] = useState<RootCause | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<string>('');
  const [searchActivities, setSearchActivities] = useState<SearchActivity[]>([]);
  const [currentActivity, setCurrentActivity] = useState<string>('');
  const [currentIssueIndex, setCurrentIssueIndex] = useState(0);
  const activityLogRef = useRef<HTMLDivElement>(null);
  const cycleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activityIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll activity log when new activities are added
  useEffect(() => {
    if (activityLogRef.current) {
      activityLogRef.current.scrollTop = activityLogRef.current.scrollHeight;
    }
  }, [searchActivities]);

  const startAnalysis = useCallback((issueIndex: number) => {
    // Clear any existing intervals first
    if (activityIntervalRef.current) {
      clearInterval(activityIntervalRef.current);
      activityIntervalRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    
    const issueId = sampleIssues[issueIndex].id;
    setSelectedIssue(issueId);
    setCurrentIssueIndex(issueIndex);
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setCurrentPhase('scanning');
    setSearchedLogs(0);
    setSearchedKB(0);
    setSearchedCases(0);
    setRootCauses([]);
    setSelectedCause(null);
    setSearchActivities([]);
    setCurrentActivity('');

    // Search activity messages
    const activities = [
      'Indexing error patterns from application logs...',
      'Cross-referencing with EDI service logs...',
      'Querying knowledge base for similar issues...',
      'Analyzing past incident reports...',
      'Searching for error code EDI_ERR_1...',
      'Scanning vessel advice service patterns...',
      'Correlating container service events...',
      'Matching symptoms with known cases...',
      'Extracting relevant technical details...',
      'Computing confidence scores...',
      'Building evidence chain...',
      'Identifying affected service dependencies...'
    ];

    let activityIndex = 0;
    activityIntervalRef.current = setInterval(() => {
      if (activityIndex < activities.length) {
        setCurrentActivity(activities[activityIndex]);
        setSearchActivities(prev => [...prev, {
          id: `act-${activityIndex}`,
          action: activities[activityIndex],
          status: 'found'
        }]);
        activityIndex++;
      }
    }, 1000);

    // Simulate AI analysis process (slower for more realistic feel)
    progressIntervalRef.current = setInterval(() => {
      setAnalysisProgress((prev) => {
        const next = Math.min(prev + 1, 100);
        
        // Update phase based on progress - extended durations
        // Real counts: 79 log entries, 24 KB nodes, 18 past cases
        if (next < 45) {
          setCurrentPhase('scanning');
          setSearchedLogs(Math.ceil((next / 45) * 79));
          setSearchedKB(Math.ceil((next / 45) * 24));
          setSearchedCases(Math.ceil((next / 45) * 18));
        } else if (next < 92) {
          setCurrentPhase('analyzing');
          // Keep final counts displayed during analyzing phase
          setSearchedLogs(79);
          setSearchedKB(24);
          setSearchedCases(18);
        } else if (next === 100) {
          setCurrentPhase('complete');
          setIsAnalyzing(false);
          if (activityIntervalRef.current) {
            clearInterval(activityIntervalRef.current);
            activityIntervalRef.current = null;
          }
          
          // Ensure final counts are displayed
          setSearchedLogs(79);
          setSearchedKB(24);
          setSearchedCases(18);
          
          // Show results based on selected issue
          setRootCauses([mockRootCauses[issueIndex]]);
          setSelectedCause(mockRootCauses[issueIndex]);
          
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }
          
          // Schedule next issue after 15 seconds (gives time to review results)
          cycleTimeoutRef.current = setTimeout(() => {
            const nextIndex = (issueIndex + 1) % sampleIssues.length;
            startAnalysis(nextIndex);
          }, 15000);
        }
        
        return next;
      });
    }, 80);
  }, []);

  // Auto-start analysis cycle
  useEffect(() => {
    // Start the first analysis after a brief delay
    const startTimeout = setTimeout(() => {
      startAnalysis(0);
    }, 1000);

    return () => {
      clearTimeout(startTimeout);
      if (cycleTimeoutRef.current) {
        clearTimeout(cycleTimeoutRef.current);
      }
      if (activityIntervalRef.current) {
        clearInterval(activityIntervalRef.current);
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [startAnalysis]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Brain className="w-8 h-8 text-purple-400" />
            {isAnalyzing && (
              <div className="absolute -top-1 -right-1">
                <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-200">Detective</h2>
            <p className="text-sm text-slate-400">AI-Powered Root Cause Finder</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-purple-950/40 border border-purple-800/40 rounded-lg">
          <Zap className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-purple-400">
            {isAnalyzing ? 'ANALYZING...' : currentPhase === 'complete' ? 'COMPLETE' : 'READY'}
          </span>
        </div>
      </div>

      {/* Current Issue Being Investigated */}
      <div className="bg-slate-900/50 border border-cyan-900/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">Currently Investigating</h3>
        <div className="bg-purple-950/40 border-2 border-purple-600/60 rounded-lg p-4 shadow-lg shadow-purple-900/30">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-xs font-mono text-purple-400">
              {sampleIssues[currentIssueIndex].tag}
            </span>
            {isAnalyzing && (
              <span className="ml-auto flex items-center gap-1 text-xs text-purple-300">
                <Activity className="w-3 h-3 animate-pulse" />
                Active
              </span>
            )}
          </div>
          <p className="text-sm text-slate-200">{sampleIssues[currentIssueIndex].name}</p>
        </div>
      </div>

      {/* Analysis Progress */}
      {(isAnalyzing || currentPhase === 'complete') && (
        <div className="bg-slate-900/50 border border-cyan-900/30 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-slate-200">Analysis Progress</h3>
            
            {/* Phase Indicator - Centered */}
            <div className="flex items-center gap-3 flex-1 justify-center mx-8">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                currentPhase === 'scanning' ? 'bg-purple-900/40 text-purple-300' : 'text-slate-500'
              }`}>
                <Search className="w-4 h-4" />
                <span className="text-xs font-medium">Scanning</span>
              </div>
              <div className="w-6 h-0.5 bg-slate-700" />
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                currentPhase === 'analyzing' ? 'bg-purple-900/40 text-purple-300' : 'text-slate-500'
              }`}>
                <Brain className="w-4 h-4" />
                <span className="text-xs font-medium">Analyzing</span>
              </div>
              <div className="w-6 h-0.5 bg-slate-700" />
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                currentPhase === 'complete' ? 'bg-emerald-900/40 text-emerald-300' : 'text-slate-500'
              }`}>
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs font-medium">Complete</span>
              </div>
            </div>
            
            <span className="text-2xl font-bold text-purple-400 w-20 text-right">{analysisProgress}%</span>
          </div>

          {/* Progress Bar */}
          <div className="relative h-3 bg-slate-800/50 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 rounded-full"
              style={{ width: `${analysisProgress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          </div>

          {/* AI Search Activity Log */}
          {isAnalyzing && searchActivities.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-purple-400 animate-pulse" />
                <h4 className="text-sm font-semibold text-slate-200">AI Agent Activity</h4>
              </div>
              <div 
                ref={activityLogRef}
                className="bg-slate-950/50 border border-slate-700/30 rounded-lg p-4 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700/50"
              >
                <div className="space-y-2 font-mono text-xs">
                  {searchActivities.map((activity, idx) => (
                    <div 
                      key={activity.id}
                      className="flex items-start gap-2 text-slate-300 animate-fadeIn"
                      style={{
                        animation: 'fadeInUp 0.3s ease-out',
                        animationFillMode: 'both',
                        animationDelay: `${idx * 0.05}s`
                      }}
                    >
                      <Eye className="w-3 h-3 text-purple-400 flex-shrink-0 mt-0.5" />
                      <span className="text-purple-300">›</span>
                      <span>{activity.action}</span>
                    </div>
                  ))}
                  {currentActivity && (
                    <div className="flex items-start gap-2 text-cyan-400 animate-pulse">
                      <Activity className="w-3 h-3 flex-shrink-0 mt-0.5" />
                      <span className="text-purple-300">›</span>
                      <span>{currentActivity}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Current Phase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {/* Scanning Logs */}
            <div className={`p-4 rounded-lg border transition-all duration-300 ${
              currentPhase === 'scanning' 
                ? 'bg-purple-950/40 border-purple-600/60' 
                : 'bg-slate-800/30 border-slate-700/40'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <FileSearch className={`w-5 h-5 ${currentPhase === 'scanning' ? 'text-purple-400 animate-pulse' : 'text-slate-400'}`} />
                <span className="text-sm font-semibold text-slate-200">Scanning Logs</span>
              </div>
              <div className="text-2xl font-bold text-purple-400">{searchedLogs.toLocaleString()}</div>
              <div className="text-xs text-slate-400 mt-1">entries analyzed</div>
            </div>

            {/* Searching Knowledge Base */}
            <div className={`p-4 rounded-lg border transition-all duration-300 ${
              currentPhase === 'scanning' 
                ? 'bg-purple-950/40 border-purple-600/60' 
                : 'bg-slate-800/30 border-slate-700/40'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className={`w-5 h-5 ${currentPhase === 'scanning' ? 'text-purple-400 animate-pulse' : 'text-slate-400'}`} />
                <span className="text-sm font-semibold text-slate-200">Knowledge Base</span>
              </div>
              <div className="text-2xl font-bold text-purple-400">{searchedKB}</div>
              <div className="text-xs text-slate-400 mt-1">nodes reviewed</div>
            </div>

            {/* Checking Past Cases */}
            <div className={`p-4 rounded-lg border transition-all duration-300 ${
              currentPhase === 'scanning' 
                ? 'bg-purple-950/40 border-purple-600/60' 
                : 'bg-slate-800/30 border-slate-700/40'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <Database className={`w-5 h-5 ${currentPhase === 'scanning' ? 'text-purple-400 animate-pulse' : 'text-slate-400'}`} />
                <span className="text-sm font-semibold text-slate-200">Past Cases</span>
              </div>
              <div className="text-2xl font-bold text-purple-400">{searchedCases}</div>
              <div className="text-xs text-slate-400 mt-1">similar issues found</div>
            </div>
          </div>
        </div>
      )}

      {/* Root Cause Results */}
      {selectedCause && currentPhase === 'complete' && (
        <div className="bg-slate-900/50 border border-cyan-900/30 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-200">Root Cause Analysis</h3>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-950/40 border border-emerald-800/40 rounded-lg">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-400">{selectedCause.confidence}% Confidence</span>
            </div>
          </div>

          {/* Main Root Cause */}
          <div className="bg-gradient-to-br from-purple-950/40 to-pink-950/20 border-2 border-purple-600/60 rounded-xl p-6 shadow-lg shadow-purple-900/20">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-slate-200 mb-2">{selectedCause.title}</h4>
                <p className="text-slate-300 leading-relaxed">{selectedCause.description}</p>
                
                {/* Affected Services */}
                <div className="flex items-center gap-2 mt-4 flex-wrap">
                  <span className="text-xs text-slate-400">Affected Services:</span>
                  {selectedCause.affectedServices.map((service, idx) => (
                    <span key={idx} className="px-2 py-1 bg-slate-800/50 border border-slate-700/40 rounded text-xs text-cyan-400">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Supporting Evidence */}
          <div>
            <h4 className="text-md font-semibold text-slate-200 mb-3 flex items-center gap-2">
              <FileSearch className="w-5 h-5 text-purple-400" />
              Supporting Evidence
            </h4>
            <div className="space-y-3">
              {selectedCause.evidence.map((evidence) => {
                const sourceConfig = {
                  logs: { icon: FileSearch, color: 'text-cyan-400', bg: 'bg-cyan-950/30', border: 'border-cyan-800/40' },
                  kb: { icon: BookOpen, color: 'text-amber-400', bg: 'bg-amber-950/30', border: 'border-amber-800/40' },
                  cases: { icon: Database, color: 'text-green-400', bg: 'bg-green-950/30', border: 'border-green-800/40' }
                };
                const config = sourceConfig[evidence.source];
                const Icon = config.icon;

                return (
                  <div key={evidence.id} className={`p-4 rounded-lg border ${config.border} ${config.bg}`}>
                    <div className="flex items-start gap-3">
                      <Icon className={`w-5 h-5 ${config.color} flex-shrink-0 mt-0.5`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-xs font-semibold uppercase ${config.color}`}>
                            {evidence.source === 'kb' ? 'Knowledge Base' : evidence.source === 'logs' ? 'Application Logs' : 'Past Cases'}
                          </span>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span className="text-xs text-slate-400">{evidence.timestamp}</span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-200 font-mono">{evidence.content}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Technical Details */}
          <div className="bg-gradient-to-br from-slate-950/80 to-slate-900/40 border-2 border-slate-600/60 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Brain className="w-6 h-6 text-slate-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-lg font-bold text-slate-300 mb-2">Technical Details</h4>
                <p className="text-slate-300 leading-relaxed font-mono text-sm">{selectedCause.technicalDetails}</p>
              </div>
            </div>
          </div>

          {/* Analysis Complete Banner */}
          <div className="bg-gradient-to-r from-purple-950/40 to-pink-950/40 border border-purple-600/40 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-semibold text-slate-200">Root Cause Analysis Complete</span>
              </div>
              <span className="text-xs text-slate-400">Ready for escalation or resolution planning</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Detective;

