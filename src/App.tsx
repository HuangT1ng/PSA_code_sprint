import React, { useState, useEffect } from 'react';
import {
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
  const [showServiceMonitors, setShowServiceMonitors] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanningActive(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.01] pointer-events-none" />

      <TabPanel 
          agentCollabContent={<AgentCollaboration />}
          dutyOfficerContent={<DutyOfficerDashboard />}
          knowledgeBaseContent={<KnowledgeGraph />}
          detectiveContent={<Detective />}
          pathfinderContent={<Pathfinder />}
          scanningActive={scanningActive}
        >
          <div className="space-y-8">
            {/* Customer Tickets and Monitor side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CustomerTickets />
              
              <EventTimeline 
                showServiceMonitors={showServiceMonitors}
                onToggleServiceMonitors={() => setShowServiceMonitors(!showServiceMonitors)}
              />
            </div>

            {/* Service Monitors Grid - 3 columns x 2 rows */}
            {showServiceMonitors && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            )}
          </div>
        </TabPanel>
    </div>
  );
}

export default App;
