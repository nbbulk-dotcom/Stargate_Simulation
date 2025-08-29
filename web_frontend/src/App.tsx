import { useState, useEffect } from 'react'
import './App.css'
import PortalDisplay from './components/PortalDisplay'
import BridgeDisplay from './components/BridgeDisplay'

interface SimulationData {
  status: string;
  run_id?: string;
  portal1?: any;
  portal2?: any;
  bridge_strength?: number;
  transfer_energy?: number;
  detune?: number;
}

function App() {
  const [simulationData, setSimulationData] = useState<SimulationData>({ status: 'disconnected' })
  const [wsConnected, setWsConnected] = useState(false)

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'
    const wsProtocol = backendUrl.startsWith('https://') ? 'wss://' : 'ws://'
    const wsUrl = backendUrl.replace(/^https?:\/\//, wsProtocol) + '/ws'
    
    console.log('Connecting to WebSocket:', wsUrl)
    const ws = new WebSocket(wsUrl)
    
    ws.onopen = () => {
      setWsConnected(true)
      console.log('WebSocket connected')
    }
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        setSimulationData(data)
      } catch (error) {
        console.error('Error parsing WebSocket data:', error)
      }
    }
    
    ws.onclose = () => {
      setWsConnected(false)
      console.log('WebSocket disconnected')
    }
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      setWsConnected(false)
    }

    return () => {
      ws.close()
    }
  }, [])

  const initializeSimulation = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'
      const response = await fetch(`${backendUrl}/api/initialize?payload_volume=0.1&payload_mass=75.0`, {
        method: 'POST'
      })
      const data = await response.json()
      console.log('Simulation initialized:', data)
    } catch (error) {
      console.error('Error initializing simulation:', error)
    }
  }


  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-center text-white">Dual Portal Stargate Simulation System</h1>
        <div className="flex justify-center items-center mt-2 space-x-4">
          <div className={`px-3 py-1 rounded text-sm font-semibold ${wsConnected ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
            WebSocket: {wsConnected ? 'Connected' : 'Disconnected'}
          </div>
          <button 
            onClick={initializeSimulation}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-semibold text-white"
          >
            Initialize Simulation
          </button>
        </div>
      </div>

      {/* Documentation Section - Moved to top */}
      <div className="bg-black border-b-2 border-white p-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-white text-xl font-bold mb-4 text-center">
            STARGATE SYSTEM DOCUMENTATION
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-gray-900 border border-white p-3 rounded">
              <h3 className="text-white font-bold text-base mb-2">Operating Manual</h3>
              <p className="text-white text-xs mb-3">
                Comprehensive guide covering system overview, physics parameters, visual displays, and safety protocols.
              </p>
              <div className="space-y-1">
                <a 
                  href="/STARGATE_OPERATING_MANUAL.md" 
                  download
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-1 px-2 rounded text-xs font-medium transition-colors"
                >
                  📥 Download
                </a>
                <button 
                  onClick={() => window.open('/STARGATE_OPERATING_MANUAL.md', '_blank')}
                  className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-1 px-2 rounded text-xs font-medium transition-colors"
                >
                  📖 Read Online
                </button>
              </div>
            </div>
            
            <div className="bg-gray-900 border border-white p-3 rounded">
              <h3 className="text-white font-bold text-base mb-2">Parameter Guide</h3>
              <p className="text-white text-xs mb-3">
                Detailed explanations of all adjustable parameters including energy, frequency, payload, and optimization settings.
              </p>
              <div className="space-y-1">
                <a 
                  href="/PARAMETER_GUIDE.md" 
                  download
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-1 px-2 rounded text-xs font-medium transition-colors"
                >
                  📥 Download
                </a>
                <button 
                  onClick={() => window.open('/PARAMETER_GUIDE.md', '_blank')}
                  className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-1 px-2 rounded text-xs font-medium transition-colors"
                >
                  📖 Read Online
                </button>
              </div>
            </div>
            
            <div className="bg-gray-900 border border-white p-3 rounded">
              <h3 className="text-white font-bold text-base mb-2">Display Systems</h3>
              <p className="text-white text-xs mb-3">
                Complete guide to all visual displays, 3D viewing screens, monitoring dashboards, and status indicators.
              </p>
              <div className="space-y-1">
                <a 
                  href="/DISPLAY_SYSTEMS_GUIDE.md" 
                  download
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-1 px-2 rounded text-xs font-medium transition-colors"
                >
                  📥 Download
                </a>
                <button 
                  onClick={() => window.open('/DISPLAY_SYSTEMS_GUIDE.md', '_blank')}
                  className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-1 px-2 rounded text-xs font-medium transition-colors"
                >
                  📖 Read Online
                </button>
              </div>
            </div>
            
            <div className="bg-gray-900 border border-white p-3 rounded">
              <h3 className="text-white font-bold text-base mb-2">Central Command</h3>
              <p className="text-white text-xs mb-3">
                Operation guide for central command screen, bridge formation controls, and transfer operations.
              </p>
              <div className="space-y-1">
                <a 
                  href="/CENTRAL_COMMAND_GUIDE.md" 
                  download
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-1 px-2 rounded text-xs font-medium transition-colors"
                >
                  📥 Download
                </a>
                <button 
                  onClick={() => window.open('/CENTRAL_COMMAND_GUIDE.md', '_blank')}
                  className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-1 px-2 rounded text-xs font-medium transition-colors"
                >
                  📖 Read Online
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-3 text-center">
            <p className="text-white text-xs">
              All documentation files are available for download or online reading. 
              These guides provide comprehensive information for operating the Stargate Dual Portal Simulation System.
            </p>
          </div>
        </div>
      </div>

      {/* 3-Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 min-h-[calc(100vh-300px)]">
        {/* Monitor 1: Stargate 1 */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="bg-gray-700 p-3 rounded-t-lg">
            <h2 className="text-lg font-semibold text-center text-white">Monitor 1: Stargate 1</h2>
          </div>
          <div className="p-4">
            <PortalDisplay 
              portal={simulationData.portal1} 
              title="Stargate 1 Panel"
              portalNumber={1}
            />
          </div>
        </div>

        {/* Monitor 2: Stargate 2 */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="bg-gray-700 p-3 rounded-t-lg">
            <h2 className="text-lg font-semibold text-center text-white">Monitor 2: Stargate 2</h2>
          </div>
          <div className="p-4">
            <PortalDisplay 
              portal={simulationData.portal2} 
              title="Stargate 2 Panel"
              portalNumber={2}
            />
          </div>
        </div>

        {/* Monitor 3: Bridge & System */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="bg-gray-700 p-3 rounded-t-lg">
            <h2 className="text-lg font-semibold text-center text-white">Monitor 3: Bridge &amp; System</h2>
          </div>
          <div className="p-4">
            <BridgeDisplay 
              simulationData={simulationData}
            />
          </div>
        </div>

      </div>
    </div>
  )
}

export default App
