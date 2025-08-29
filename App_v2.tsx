import { useState, useEffect } from 'react'
import './App.css'
import PortalDisplay from './components/PortalDisplay'
import BridgeDisplay from './components/BridgeDisplay'

interface SimulationData {
  status: string;
  run_id?: string;
  portal1?: any;
  portal2?: any;
  bridge?: any;
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
      console.log('WebSocket connected')
      setWsConnected(true)
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
      console.log('WebSocket disconnected')
      setWsConnected(false)
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
      const result = await response.json()
      console.log('Simulation initialized:', result)
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

      {/* Documentation Section */}
      <div className="bg-black text-white p-4 border-b border-gray-700">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-3 text-white">📚 STARGATE OPERATION DOCUMENTATION</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="/STARGATE_OPERATING_MANUAL.md" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-white text-white rounded text-sm font-semibold transition-colors"
            >
              📖 Operating Manual
            </a>
            <a 
              href="/PARAMETER_GUIDE.md" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-white text-white rounded text-sm font-semibold transition-colors"
            >
              ⚙️ Parameter Guide
            </a>
            <a 
              href="/DISPLAY_SYSTEMS_GUIDE.md" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-white text-white rounded text-sm font-semibold transition-colors"
            >
              📺 Display Systems
            </a>
            <a 
              href="/CENTRAL_COMMAND_GUIDE.md" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-white text-white rounded text-sm font-semibold transition-colors"
            >
              🎛️ Central Command
            </a>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Click any guide to download or read in a new window
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

        {/* Monitor 3: Bridge & System Status */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="bg-gray-700 p-3 rounded-t-lg">
            <h2 className="text-lg font-semibold text-center text-white">Monitor 3: Bridge & System</h2>
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
