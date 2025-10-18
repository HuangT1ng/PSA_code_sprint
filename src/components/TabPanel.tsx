import React, { useState } from 'react';
import { Users, LayoutDashboard, Activity, BookOpen, Search, Navigation } from 'lucide-react';

interface TabPanelProps {
  children?: React.ReactNode;
  agentCollabContent?: React.ReactNode;
  dutyOfficerContent?: React.ReactNode;
  knowledgeBaseContent?: React.ReactNode;
  detectiveContent?: React.ReactNode;
  pathfinderContent?: React.ReactNode;
}

const TabPanel: React.FC<TabPanelProps> = ({ 
  children, 
  agentCollabContent,
  dutyOfficerContent,
  knowledgeBaseContent,
  detectiveContent,
  pathfinderContent
}) => {
  const [activeTab, setActiveTab] = useState<'main' | 'knowledge' | 'detective' | 'pathfinder' | 'collab' | 'dashboard'>('main');

  return (
    <div className="relative bg-slate-900/50 backdrop-blur-sm border border-cyan-900/30 rounded-xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800/10 to-transparent pointer-events-none" />

      {/* Tab Headers */}
      <div className="relative border-b border-cyan-900/30 bg-slate-950/50">
        <div className="flex items-center gap-2 px-6 py-3">
          <button
            onClick={() => setActiveTab('main')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
              activeTab === 'main'
                ? 'bg-cyan-950/40 border-cyan-800/60 text-cyan-400 shadow-lg shadow-cyan-900/30'
                : 'bg-slate-800/30 border-slate-700/40 text-slate-400 hover:border-slate-600 hover:text-slate-300'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span className="text-sm font-medium">Sentinel</span>
          </button>

          <button
            onClick={() => setActiveTab('knowledge')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
              activeTab === 'knowledge'
                ? 'bg-cyan-950/40 border-cyan-800/60 text-cyan-400 shadow-lg shadow-cyan-900/30'
                : 'bg-slate-800/30 border-slate-700/40 text-slate-400 hover:border-slate-600 hover:text-slate-300'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-medium">Knowledge Base</span>
          </button>

          <button
            onClick={() => setActiveTab('detective')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
              activeTab === 'detective'
                ? 'bg-cyan-950/40 border-cyan-800/60 text-cyan-400 shadow-lg shadow-cyan-900/30'
                : 'bg-slate-800/30 border-slate-700/40 text-slate-400 hover:border-slate-600 hover:text-slate-300'
            }`}
          >
            <Search className="w-4 h-4" />
            <span className="text-sm font-medium">Detective</span>
          </button>

          <button
            onClick={() => setActiveTab('pathfinder')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
              activeTab === 'pathfinder'
                ? 'bg-cyan-950/40 border-cyan-800/60 text-cyan-400 shadow-lg shadow-cyan-900/30'
                : 'bg-slate-800/30 border-slate-700/40 text-slate-400 hover:border-slate-600 hover:text-slate-300'
            }`}
          >
            <Navigation className="w-4 h-4" />
            <span className="text-sm font-medium">PathFinder</span>
          </button>

          <button
            onClick={() => setActiveTab('collab')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
              activeTab === 'collab'
                ? 'bg-cyan-950/40 border-cyan-800/60 text-cyan-400 shadow-lg shadow-cyan-900/30'
                : 'bg-slate-800/30 border-slate-700/40 text-slate-400 hover:border-slate-600 hover:text-slate-300'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">Agent Collaboration</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
              activeTab === 'dashboard'
                ? 'bg-cyan-950/40 border-cyan-800/60 text-cyan-400 shadow-lg shadow-cyan-900/30'
                : 'bg-slate-800/30 border-slate-700/40 text-slate-400 hover:border-slate-600 hover:text-slate-300'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-sm font-medium">Duty Officer Dashboard</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="relative">
        {activeTab === 'main' ? (
          <div className="p-6">{children}</div>
        ) : activeTab === 'knowledge' ? (
          knowledgeBaseContent ? <div>{knowledgeBaseContent}</div> : (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-200">Knowledge Base</h3>
              <p className="text-slate-400 mt-2">Knowledge base content will be displayed here.</p>
            </div>
          )
        ) : activeTab === 'detective' ? (
          detectiveContent ? <div>{detectiveContent}</div> : (
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Search className="w-6 h-6 text-cyan-400" />
                <h3 className="text-lg font-semibold text-slate-200">Detective</h3>
              </div>
              <p className="text-slate-400 mb-4">AI-powered investigation and root cause analysis tool.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/50 border border-slate-700/40 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-cyan-400 mb-2">Pattern Detection</h4>
                  <p className="text-xs text-slate-400">Automatically identify recurring issues and anomalies across services.</p>
                </div>
                <div className="bg-slate-950/50 border border-slate-700/40 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-cyan-400 mb-2">Root Cause Analysis</h4>
                  <p className="text-xs text-slate-400">Trace issues back to their source with intelligent correlation.</p>
                </div>
                <div className="bg-slate-950/50 border border-slate-700/40 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-cyan-400 mb-2">Impact Assessment</h4>
                  <p className="text-xs text-slate-400">Understand the downstream effects of incidents.</p>
                </div>
                <div className="bg-slate-950/50 border border-slate-700/40 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-cyan-400 mb-2">Historical Analysis</h4>
                  <p className="text-xs text-slate-400">Compare current issues with historical patterns.</p>
                </div>
              </div>
            </div>
          )
        ) : activeTab === 'pathfinder' ? (
          pathfinderContent ? <div>{pathfinderContent}</div> : (
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Navigation className="w-6 h-6 text-cyan-400" />
                <h3 className="text-lg font-semibold text-slate-200">PathFinder</h3>
              </div>
              <p className="text-slate-400 mb-4">Navigate complex system dependencies and trace event flows.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/50 border border-slate-700/40 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-cyan-400 mb-2">Dependency Mapping</h4>
                  <p className="text-xs text-slate-400">Visualize service dependencies and interconnections.</p>
                </div>
                <div className="bg-slate-950/50 border border-slate-700/40 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-cyan-400 mb-2">Event Tracing</h4>
                  <p className="text-xs text-slate-400">Follow event chains across multiple services.</p>
                </div>
                <div className="bg-slate-950/50 border border-slate-700/40 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-cyan-400 mb-2">Flow Analysis</h4>
                  <p className="text-xs text-slate-400">Understand data flow patterns and bottlenecks.</p>
                </div>
                <div className="bg-slate-950/50 border border-slate-700/40 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-cyan-400 mb-2">Route Optimization</h4>
                  <p className="text-xs text-slate-400">Identify optimal paths for issue resolution.</p>
                </div>
              </div>
            </div>
          )
        ) : activeTab === 'collab' ? (
          agentCollabContent ? <div>{agentCollabContent}</div> : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-200">Agent Collaboration</h3>
              <span className="px-3 py-1 bg-emerald-950/40 border border-emerald-800/40 rounded-lg text-xs font-medium text-emerald-400">
                3 ACTIVE AGENTS
              </span>
            </div>

            {/* Agent Collaboration Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Agent 1 */}
              <div className="bg-slate-950/50 border border-slate-700/40 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
                    J
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Jen</p>
                    <p className="text-xs text-slate-400">L2 Support</p>
                  </div>
                  <div className="ml-auto">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-slate-400">Working on:</div>
                  <div className="text-xs font-mono text-cyan-400">ALR-861600</div>
                  <div className="text-xs text-slate-300">Duplicate Container CMAU0000020</div>
                  <div className="mt-2 text-xs text-slate-500">Last active: 2m ago</div>
                </div>
              </div>

              {/* Agent 2 */}
              <div className="bg-slate-950/50 border border-slate-700/40 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    V
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Vedu</p>
                    <p className="text-xs text-slate-400">L2 Support</p>
                  </div>
                  <div className="ml-auto">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-slate-400">Working on:</div>
                  <div className="text-xs font-mono text-cyan-400">ALR-861631</div>
                  <div className="text-xs text-slate-300">Vessel Error MV Lion City 07</div>
                  <div className="mt-2 text-xs text-slate-500">Last active: 5m ago</div>
                </div>
              </div>

              {/* Agent 3 */}
              <div className="bg-slate-950/50 border border-slate-700/40 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">
                    D
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Duty Officer</p>
                    <p className="text-xs text-slate-400">L2 Support</p>
                  </div>
                  <div className="ml-auto">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-slate-400">Working on:</div>
                  <div className="text-xs font-mono text-cyan-400">INC-154599</div>
                  <div className="text-xs text-slate-300">EDI Message ERROR Status</div>
                  <div className="mt-2 text-xs text-slate-500">Last active: 1m ago</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-slate-300 mb-3">Recent Activity</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-xs text-slate-400 bg-slate-950/30 border border-slate-700/30 rounded-lg p-2">
                  <span className="text-cyan-400">Jen</span>
                  <span>assigned to</span>
                  <span className="font-mono text-slate-300">ALR-861600</span>
                  <span className="ml-auto text-slate-500">3m ago</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 bg-slate-950/30 border border-slate-700/30 rounded-lg p-2">
                  <span className="text-purple-400">Vedu</span>
                  <span>updated</span>
                  <span className="font-mono text-slate-300">ALR-861631</span>
                  <span className="ml-auto text-slate-500">7m ago</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 bg-slate-950/30 border border-slate-700/30 rounded-lg p-2">
                  <span className="text-orange-400">Duty Officer</span>
                  <span>investigating</span>
                  <span className="font-mono text-slate-300">INC-154599</span>
                  <span className="ml-auto text-slate-500">10m ago</span>
                </div>
              </div>
            </div>
          </div>
          )
        ) : activeTab === 'dashboard' ? (
          dutyOfficerContent ? <div>{dutyOfficerContent}</div> : (
          <div className="space-y-4 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-200">Duty Officer Dashboard</h3>
              <span className="px-3 py-1 bg-cyan-950/40 border border-cyan-800/40 rounded-lg text-xs font-medium text-cyan-400">
                SHIFT: DAY
              </span>
            </div>

            {/* Duty Officer Dashboard Content */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Metric Cards */}
              <div className="bg-slate-950/50 border border-slate-700/40 rounded-lg p-4">
                <div className="text-xs text-slate-400 mb-1">Active Tickets</div>
                <div className="text-2xl font-bold text-cyan-400">4</div>
                <div className="text-xs text-emerald-400 mt-1">+2 from last hour</div>
              </div>

              <div className="bg-slate-950/50 border border-slate-700/40 rounded-lg p-4">
                <div className="text-xs text-slate-400 mb-1">Critical Issues</div>
                <div className="text-2xl font-bold text-red-400">2</div>
                <div className="text-xs text-slate-400 mt-1">Requires attention</div>
              </div>

              <div className="bg-slate-950/50 border border-slate-700/40 rounded-lg p-4">
                <div className="text-xs text-slate-400 mb-1">Avg Response Time</div>
                <div className="text-2xl font-bold text-emerald-400">3.5m</div>
                <div className="text-xs text-emerald-400 mt-1">-1.2m improvement</div>
              </div>

              <div className="bg-slate-950/50 border border-slate-700/40 rounded-lg p-4">
                <div className="text-xs text-slate-400 mb-1">System Health</div>
                <div className="text-2xl font-bold text-emerald-400">98%</div>
                <div className="text-xs text-slate-400 mt-1">All services nominal</div>
              </div>
            </div>

            {/* Current Shift Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-950/50 border border-slate-700/40 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-slate-300 mb-3">Shift Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Duty Officer:</span>
                    <span className="text-slate-200">On Duty</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Shift Start:</span>
                    <span className="text-slate-200">08:00 AM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Shift End:</span>
                    <span className="text-slate-200">08:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Time Remaining:</span>
                    <span className="text-cyan-400">9h 25m</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/50 border border-slate-700/40 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-slate-300 mb-3">Priority Queue</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <span className="font-mono text-red-400">INC-154599</span>
                    <span className="text-slate-400">- EDI Error</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <span className="font-mono text-red-400">TCK-742311</span>
                    <span className="text-slate-400">- BAPLIE Issue</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                    <span className="font-mono text-orange-400">ALR-861600</span>
                    <span className="text-slate-400">- Duplicate Container</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                    <span className="font-mono text-orange-400">ALR-861631</span>
                    <span className="text-slate-400">- Vessel Error</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Escalation History */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-slate-300 mb-3">Recent Escalations</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs bg-slate-950/30 border border-slate-700/30 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <span className="font-mono text-slate-300">TCK-742311</span>
                    <span className="text-slate-400">Escalated to Product Team</span>
                  </div>
                  <span className="text-slate-500">15m ago</span>
                </div>
                <div className="flex items-center justify-between text-xs bg-slate-950/30 border border-slate-700/30 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                    <span className="font-mono text-slate-300">ALR-861200</span>
                    <span className="text-slate-400">Resolved - Container sync fixed</span>
                  </div>
                  <span className="text-slate-500">1h ago</span>
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

