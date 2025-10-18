import React, { useState, useEffect } from 'react';
import {
  Shield,
  Package,
  Anchor,
  FileText,
  Database,
  Ship,
  Map
} from 'lucide-react';
import EventTimeline from './components/RealTimeMonitor';
import CustomerTickets from './components/CustomerTickets';
import ServiceMonitor from './components/ServiceMonitor';
import KnowledgeGraph from './components/KnowledgeGraph';
import TabPanel from './components/TabPanel';
import DutyOfficerDashboard from './components/DutyOfficerDashboard';
import AgentCollaboration from './components/AgentCollaboration';
import Detective from './components/Detective';
import Pathfinder from './components/Pathfinder';

// Import log files as raw text
import apiEventLog from '../Problem Statement 3 - Redefining Level 2 Product Ops/Application Logs/api_event_service.log?raw';
import berthApplicationLog from '../Problem Statement 3 - Redefining Level 2 Product Ops/Application Logs/berth_application_service.log?raw';
import containerServiceLog from '../Problem Statement 3 - Redefining Level 2 Product Ops/Application Logs/container_service.log?raw';
import ediAdviceLog from '../Problem Statement 3 - Redefining Level 2 Product Ops/Application Logs/edi_adivce_service.log?raw';
import vesselAdviceLog from '../Problem Statement 3 - Redefining Level 2 Product Ops/Application Logs/vessel_advice_service.log?raw';
import vesselRegistryLog from '../Problem Statement 3 - Redefining Level 2 Product Ops/Application Logs/vessel_registry_service.log?raw';

function App() {
  const [scanningActive, setScanningActive] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanningActive(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-950/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

      <header className="relative border-b border-cyan-900/30 bg-slate-950/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Shield className="w-10 h-10 text-cyan-400" />
                <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${scanningActive ? 'bg-cyan-400' : 'bg-cyan-600'} transition-colors duration-300`}>
                  <div className={`absolute inset-0 rounded-full ${scanningActive ? 'animate-ping bg-cyan-400' : ''}`} />
                </div>
              </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Sentinel
              </h1>
              <p className="text-sm text-slate-400">AI-Powered Event Detection System</p>
            </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6 space-y-6">
        <TabPanel 
          agentCollabContent={<AgentCollaboration />}
          dutyOfficerContent={<DutyOfficerDashboard />}
          knowledgeBaseContent={<KnowledgeGraph />}
          detectiveContent={<Detective />}
          pathfinderContent={<Pathfinder />}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <EventTimeline />
              <CustomerTickets />
            </div>

            {/* Service Monitors Grid - 3 columns x 2 rows */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <ServiceMonitor
                serviceName="EDI Advice Service"
                logData={ediAdviceLog}
                icon={<Database className="w-4 h-4" />}
                color="text-orange-400"
              />
              <ServiceMonitor
                serviceName="API Event Service"
                logData={apiEventLog}
                icon={<FileText className="w-4 h-4" />}
                color="text-cyan-400"
              />
              <ServiceMonitor
                serviceName="Berth Application"
                logData={berthApplicationLog}
                icon={<Map className="w-4 h-4" />}
                color="text-purple-400"
              />
              <ServiceMonitor
                serviceName="Container Service"
                logData={containerServiceLog}
                icon={<Package className="w-4 h-4" />}
                color="text-green-400"
              />
              <ServiceMonitor
                serviceName="Vessel Advice"
                logData={vesselAdviceLog}
                icon={<Ship className="w-4 h-4" />}
                color="text-blue-400"
              />
              <ServiceMonitor
                serviceName="Vessel Registry"
                logData={vesselRegistryLog}
                icon={<Anchor className="w-4 h-4" />}
                color="text-pink-400"
              />
            </div>
          </div>
        </TabPanel>
      </div>
    </div>
  );
}

export default App;
