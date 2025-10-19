import React, { useState } from 'react';
import { Users, LayoutDashboard, Activity, BookOpen, Search, Navigation, Shield } from 'lucide-react';

interface TabPanelProps {
  children?: React.ReactNode;
  agentCollabContent?: React.ReactNode;
  dutyOfficerContent?: React.ReactNode;
  knowledgeBaseContent?: React.ReactNode;
  detectiveContent?: React.ReactNode;
  pathfinderContent?: React.ReactNode;
  scanningActive?: boolean;
  onTabChange?: (tab: 'main' | 'knowledge' | 'detective' | 'pathfinder' | 'collab' | 'dashboard') => void;
}

const TabPanel: React.FC<TabPanelProps> = ({ 
  children, 
  agentCollabContent,
  dutyOfficerContent,
  knowledgeBaseContent,
  detectiveContent,
  pathfinderContent,
  scanningActive = false,
  onTabChange
}) => {
  const [activeTab, setActiveTab] = useState<'main' | 'knowledge' | 'detective' | 'pathfinder' | 'collab' | 'dashboard'>('main');

  const handleTabChange = (tab: 'main' | 'knowledge' | 'detective' | 'pathfinder' | 'collab' | 'dashboard') => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#6b5d4f]/20 backdrop-blur-sm border-b border-white/10 overflow-hidden shadow-sm flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />

      {/* Tab Headers */}
      <div className="relative border-b border-white/10">
        <div className="flex items-center gap-6 px-8 py-4">
          {/* Sentinel Logo */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Shield className="w-8 h-8 text-white" />
              <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${scanningActive ? 'bg-white' : 'bg-white/60'} transition-colors duration-300`}>
                <div className={`absolute inset-0 rounded-full ${scanningActive ? 'animate-ping bg-white' : ''}`} />
              </div>
            </div>
            <h1 className="text-2xl font-medium text-white tracking-tight">
              Sentinel
            </h1>
          </div>
          
          {/* Tab Buttons */}
          <div className="flex items-center gap-2">
          <button
            onClick={() => handleTabChange('main')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-transparent text-white/60 hover:text-white transition-all duration-300"
          >
            <Activity className="w-4 h-4" />
            <span className="text-sm font-medium">Sentinel</span>
          </button>

          <button
            onClick={() => handleTabChange('knowledge')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-transparent text-white/60 hover:text-white transition-all duration-300"
          >
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-medium">Knowledge Base</span>
          </button>

          <button
            onClick={() => handleTabChange('detective')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-transparent text-white/60 hover:text-white transition-all duration-300"
          >
            <Search className="w-4 h-4" />
            <span className="text-sm font-medium">Detective</span>
          </button>

          <button
            onClick={() => handleTabChange('pathfinder')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-transparent text-white/60 hover:text-white transition-all duration-300"
          >
            <Navigation className="w-4 h-4" />
            <span className="text-sm font-medium">PathFinder</span>
          </button>

          <button
            onClick={() => handleTabChange('collab')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-transparent text-white/60 hover:text-white transition-all duration-300"
          >
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">Agent Collaboration</span>
          </button>

          <button
            onClick={() => handleTabChange('dashboard')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-transparent text-white/60 hover:text-white transition-all duration-300"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-sm font-medium">Duty Officer Dashboard</span>
          </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="relative flex-1">
        {activeTab === 'main' ? (
          <div className="container mx-auto px-8 py-8 min-h-full">{children}</div>
        ) : activeTab === 'knowledge' ? (
          knowledgeBaseContent ? <div className="container mx-auto px-8 py-8 min-h-full">{knowledgeBaseContent}</div> : (
            <div className="container mx-auto px-8 py-8">
              <h3 className="text-lg font-medium text-white">Knowledge Base</h3>
              <p className="text-white/60 mt-2">Knowledge base content will be displayed here.</p>
            </div>
          )
        ) : activeTab === 'detective' ? (
          detectiveContent ? <div className="container mx-auto px-8 py-8 min-h-full">{React.isValidElement(detectiveContent) ? React.cloneElement(detectiveContent, { onNavigateToPathfinder: () => handleTabChange('pathfinder') } as any) : detectiveContent}</div> : (
            <div className="container mx-auto px-8 py-8 min-h-full">
              <div className="flex items-center gap-3 mb-4">
                <Search className="w-6 h-6 text-white" />
                <h3 className="text-lg font-medium text-white">Detective</h3>
              </div>
              <p className="text-white/60 mb-6">AI-powered investigation and root cause analysis tool.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                  <h4 className="text-sm font-medium text-white mb-2">Pattern Detection</h4>
                  <p className="text-xs text-white/60">Automatically identify recurring issues and anomalies across services.</p>
                </div>
                    <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                  <h4 className="text-sm font-medium text-white mb-2">Root Cause Analysis</h4>
                  <p className="text-xs text-white/60">Trace issues back to their source with intelligent correlation.</p>
                </div>
                    <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                  <h4 className="text-sm font-medium text-white mb-2">Impact Assessment</h4>
                  <p className="text-xs text-white/60">Understand the downstream effects of incidents.</p>
                </div>
                    <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                  <h4 className="text-sm font-medium text-white mb-2">Historical Analysis</h4>
                  <p className="text-xs text-white/60">Compare current issues with historical patterns.</p>
                </div>
              </div>
            </div>
          )
        ) : activeTab === 'pathfinder' ? (
          pathfinderContent ? <div className="container mx-auto px-8 py-8 min-h-full">{pathfinderContent}</div> : (
            <div className="container mx-auto px-8 py-8 min-h-full">
              <div className="flex items-center gap-3 mb-4">
                <Navigation className="w-6 h-6 text-white" />
                <h3 className="text-lg font-medium text-white">PathFinder</h3>
              </div>
              <p className="text-white/60 mb-6">Navigate complex system dependencies and trace event flows.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                  <h4 className="text-sm font-medium text-white mb-2">Dependency Mapping</h4>
                  <p className="text-xs text-white/60">Visualize service dependencies and interconnections.</p>
                </div>
                    <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                  <h4 className="text-sm font-medium text-white mb-2">Event Tracing</h4>
                  <p className="text-xs text-white/60">Follow event chains across multiple services.</p>
                </div>
                    <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                  <h4 className="text-sm font-medium text-white mb-2">Flow Analysis</h4>
                  <p className="text-xs text-white/60">Understand data flow patterns and bottlenecks.</p>
                </div>
                    <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                  <h4 className="text-sm font-medium text-white mb-2">Route Optimization</h4>
                  <p className="text-xs text-white/60">Identify optimal paths for issue resolution.</p>
                </div>
              </div>
            </div>
          )
        ) : activeTab === 'collab' ? (
          agentCollabContent ? <div className="container mx-auto px-8 py-8 min-h-full">{agentCollabContent}</div> : (
          <div className="container mx-auto px-8 py-8 min-h-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">Agent Collaboration</h3>
              <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs font-medium text-emerald-400">
                3 ACTIVE AGENTS
              </span>
            </div>

            {/* Agent Collaboration Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Agent 1 */}
              <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
                    J
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Jen</p>
                    <p className="text-xs text-white/60">L2 Support</p>
                  </div>
                  <div className="ml-auto">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-white/60">Working on:</div>
                  <div className="text-xs font-mono text-white">ALR-861600</div>
                  <div className="text-xs text-white/90">Duplicate Container CMAU0000020</div>
                  <div className="mt-2 text-xs text-white/50">Last active: 2m ago</div>
                </div>
              </div>

              {/* Agent 2 */}
              <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    V
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Vedu</p>
                    <p className="text-xs text-white/60">L2 Support</p>
                  </div>
                  <div className="ml-auto">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-white/60">Working on:</div>
                  <div className="text-xs font-mono text-white">ALR-861631</div>
                  <div className="text-xs text-white/90">Vessel Error MV Lion City 07</div>
                  <div className="mt-2 text-xs text-white/50">Last active: 5m ago</div>
                </div>
              </div>

              {/* Agent 3 */}
              <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">
                    D
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Duty Officer</p>
                    <p className="text-xs text-white/60">L2 Support</p>
                  </div>
                  <div className="ml-auto">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-white/60">Working on:</div>
                  <div className="text-xs font-mono text-white">INC-154599</div>
                  <div className="text-xs text-white/90">EDI Message ERROR Status</div>
                  <div className="mt-2 text-xs text-white/50">Last active: 1m ago</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-white/90 mb-3">Recent Activity</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-xs text-white/60 bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-2">
                  <span className="text-white">Jen</span>
                  <span>assigned to</span>
                  <span className="font-mono text-white/90">ALR-861600</span>
                  <span className="ml-auto text-white/50">3m ago</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/60 bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-2">
                  <span className="text-purple-400">Vedu</span>
                  <span>updated</span>
                  <span className="font-mono text-white/90">ALR-861631</span>
                  <span className="ml-auto text-white/50">7m ago</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/60 bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-2">
                  <span className="text-orange-400">Duty Officer</span>
                  <span>investigating</span>
                  <span className="font-mono text-white/90">INC-154599</span>
                  <span className="ml-auto text-white/50">10m ago</span>
                </div>
              </div>
            </div>
          </div>
          )
        ) : activeTab === 'dashboard' ? (
          dutyOfficerContent ? <div className="container mx-auto px-8 py-8 min-h-full">{dutyOfficerContent}</div> : (
          <div className="container mx-auto px-8 py-8 min-h-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">Duty Officer Dashboard</h3>
              <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/40 rounded-xl text-xs font-medium text-white">
                SHIFT: DAY
              </span>
            </div>

            {/* Duty Officer Dashboard Content */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Metric Cards */}
              <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <div className="text-xs text-white/60 mb-1">Active Tickets</div>
                <div className="text-2xl font-bold text-white">4</div>
                <div className="text-xs text-emerald-400 mt-1">+2 from last hour</div>
              </div>

              <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <div className="text-xs text-white/60 mb-1">Critical Issues</div>
                <div className="text-2xl font-bold text-red-400">2</div>
                <div className="text-xs text-white/60 mt-1">Requires attention</div>
              </div>

              <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <div className="text-xs text-white/60 mb-1">Avg Response Time</div>
                <div className="text-2xl font-bold text-emerald-400">3.5m</div>
                <div className="text-xs text-emerald-400 mt-1">-1.2m improvement</div>
              </div>

              <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <div className="text-xs text-white/60 mb-1">System Health</div>
                <div className="text-2xl font-bold text-emerald-400">98%</div>
                <div className="text-xs text-white/60 mt-1">All services nominal</div>
              </div>
            </div>

            {/* Current Shift Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <h4 className="text-sm font-medium text-white/90 mb-3">Shift Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Duty Officer:</span>
                    <span className="text-white">On Duty</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Shift Start:</span>
                    <span className="text-white">08:00 AM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Shift End:</span>
                    <span className="text-white">08:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Time Remaining:</span>
                    <span className="text-white">9h 25m</span>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <h4 className="text-sm font-medium text-white/90 mb-3">Priority Queue</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <span className="font-mono text-red-400">INC-154599</span>
                    <span className="text-white/60">- EDI Error</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <span className="font-mono text-red-400">TCK-742311</span>
                    <span className="text-white/60">- BAPLIE Issue</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                    <span className="font-mono text-orange-400">ALR-861600</span>
                    <span className="text-white/60">- Duplicate Container</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                    <span className="font-mono text-orange-400">ALR-861631</span>
                    <span className="text-white/60">- Vessel Error</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Escalation History */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-white/90 mb-3">Recent Escalations</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <span className="font-mono text-white/90">TCK-742311</span>
                    <span className="text-white/60">Escalated to Product Team</span>
                  </div>
                  <span className="text-white/50">15m ago</span>
                </div>
                <div className="flex items-center justify-between text-xs bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                    <span className="font-mono text-white/90">ALR-861200</span>
                    <span className="text-white/60">Resolved - Container sync fixed</span>
                  </div>
                  <span className="text-white/50">1h ago</span>
                </div>
              </div>
            </div>
          </div>
          )
        ) : null}
      </div>
    </div>
  );
};

export default TabPanel;

