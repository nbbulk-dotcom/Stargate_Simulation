import React from 'react'
import MonitoringDashboard from './MonitoringDashboard'
import OperationsControls from './OperationsControls'

interface SimulationData {
  status: string;
  run_id?: string;
  portal1?: any;
  portal2?: any;
  bridge_strength?: number;
  transfer_energy?: number;
  detune?: number;
  status_log?: string[];
}

interface BridgeDisplayProps {
  simulationData: SimulationData;
}

const BridgeDisplay: React.FC<BridgeDisplayProps> = ({ simulationData }) => {
  const { portal1, portal2, bridge_strength, transfer_energy, detune, status_log } = simulationData

  const handleFormBridge = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'
      const response = await fetch(`${backendUrl}/api/form_bridge`, {
        method: 'POST'
      })
      const data = await response.json()
      console.log('Bridge formation:', data)
    } catch (error) {
      console.error('Error forming bridge:', error)
    }
  }

  const handleTransferPayload = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'
      const response = await fetch(`${backendUrl}/api/transfer_payload`, {
        method: 'POST'
      })
      const data = await response.json()
      console.log('Payload transfer:', data)
    } catch (error) {
      console.error('Error transferring payload:', error)
    }
  }

  const handleUpdateEnergy = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'
      const response = await fetch(`${backendUrl}/api/update_energy?dt=1.0`, {
        method: 'POST'
      })
      const data = await response.json()
      console.log('Energy update:', data)
    } catch (error) {
      console.error('Error updating energy:', error)
    }
  }

  if (!portal1 || !portal2) {
    return (
      <div className="text-center text-gray-400 py-8">
        <div className="text-lg font-semibold mb-2">Central System &amp; Bridge Status</div>
        <div>No bridge data available</div>
        <div className="text-sm mt-2">Initialize simulation to begin</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold text-blue-400 mb-4">Central System &amp; Bridge Status</div>
      
      {/* Bridge Metrics */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-300 text-lg">Bridge Strength:</span>
          <div className="flex items-center space-x-2">
            <span className={`font-mono text-lg font-bold ${
              bridge_strength && bridge_strength > 0.5 ? 'text-green-400' : 
              bridge_strength && bridge_strength > 0.1 ? 'text-yellow-400' : 'text-white'
            }`}>
              {bridge_strength?.toFixed(2) || '0.00'}
            </span>
            {bridge_strength && bridge_strength > 0.5 && (
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            )}
          </div>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-300">Transfer Energy:</span>
          <span className="text-white font-mono">{transfer_energy?.toFixed(1) || '0.0'} J</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-white">Detune (delta f):</span>
          <div className="flex items-center space-x-2">
            <span className="text-white font-mono">{detune?.toFixed(4) || '0.0000'} Hz</span>
            {detune && detune !== 0 && (
              <div className="flex items-center space-x-1">
                <span className={`text-xs px-2 py-1 rounded ${
                  detune > 0 ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'
                }`}>
                  {detune > 0 ? '→ Portal 2' : '← Portal 1'}
                </span>
                <span className="text-xs text-yellow-400">
                  {detune > 0 ? 'P1→P2' : 'P2→P1'}
                </span>
              </div>
            )}
            {detune && detune !== 0 && (
              <div className="text-xs text-gray-300">
                Send: {detune > 0 ? `P1 (${portal1.freq?.toFixed(1)}Hz)` : `P2 (${portal2.freq?.toFixed(1)}Hz)`} | 
                Recv: {detune > 0 ? `P2 (${portal2.freq?.toFixed(1)}Hz)` : `P1 (${portal1.freq?.toFixed(1)}Hz)`}
              </div>
            )}
          </div>
        </div>
        
        {/* Payload Direction Indicator */}
        {detune && detune !== 0 && (
          <div className="mt-2 p-2 bg-gray-700 border border-gray-500 rounded">
            <div className="text-xs text-gray-200 mb-1">Payload Transfer Direction:</div>
            <div className="flex items-center justify-between">
              <div className={`px-2 py-1 rounded text-xs font-bold ${
                detune > 0 ? 'bg-orange-600 text-white' : 'bg-gray-600 text-gray-300'
              }`}>
                Portal 1 {detune > 0 ? '(SENDING)' : '(RECEIVING)'}
                <br />
                <span className="text-xs">{portal1.freq?.toFixed(1)}Hz {detune > 0 ? '(HIGH)' : '(LOW)'}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <span className="text-2xl">{detune > 0 ? '→' : '←'}</span>
                <span className="text-xs text-yellow-300">PAYLOAD</span>
                <span className="text-2xl">{detune > 0 ? '→' : '←'}</span>
              </div>
              
              <div className={`px-2 py-1 rounded text-xs font-bold ${
                detune > 0 ? 'bg-gray-600 text-gray-300' : 'bg-orange-600 text-white'
              }`}>
                Portal 2 {detune > 0 ? '(RECEIVING)' : '(SENDING)'}
                <br />
                <span className="text-xs">{portal2.freq?.toFixed(1)}Hz {detune > 0 ? '(LOW)' : '(HIGH)'}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Portal Status Summary */}
      <div className="border-t border-gray-600 pt-4">
        <div className="text-sm text-gray-200 mb-3">Portal Status Summary</div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-white">Portal 1 Freq/Stab:</span>
            <span className="text-white font-mono">
              {portal1.freq?.toFixed(2) || '0.00'} Hz / {portal1.stability?.toFixed(2) || '0.00'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-white">Portal 2 Freq/Stab:</span>
            <span className="text-white font-mono">
              {portal2.freq?.toFixed(2) || '0.00'} Hz / {portal2.stability?.toFixed(2) || '0.00'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-white">Safety Status:</span>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${portal1.safety_status ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`}></div>
                <span className={`font-mono text-sm ${portal1.safety_status ? 'text-green-400' : 'text-red-400'}`}>
                  S1: {portal1.safety_status ? 'OK' : 'FAIL'}
                </span>
              </div>
              <span className="text-gray-500">|</span>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${portal2.safety_status ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`}></div>
                <span className={`font-mono text-sm ${portal2.safety_status ? 'text-green-400' : 'text-red-400'}`}>
                  S2: {portal2.safety_status ? 'OK' : 'FAIL'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Monitoring Dashboard */}
      <div className="border-t border-gray-600 pt-4">
        <MonitoringDashboard 
          data={{
            portal1,
            portal2,
            bridge_strength,
            transfer_energy
          }}
        />
      </div>

      {/* Event Log */}
      <div className="border-t border-gray-600 pt-4">
        <div className="text-sm text-gray-200 mb-3 font-bold">Event Log (Last 5)</div>
        <div className="space-y-1">
          {status_log && status_log.length > 0 ? (
            status_log.slice(-5).map((line, index) => {
              let textColor = 'text-white'
              if (line.includes('SUCCESS')) textColor = 'text-blue-400'
              else if (line.includes('FAIL') || line.includes('ERROR')) textColor = 'text-red-400'
              
              return (
                <div key={index} className={`text-sm font-mono ${textColor}`}>
                  {line}
                </div>
              )
            })
          ) : (
            <div className="text-gray-300 text-sm">No event log available</div>
          )}
        </div>
      </div>

      {/* Bridge Visualization & Controls */}
      <div className="border-t border-gray-600 pt-4">
        <div className="text-sm text-gray-200 mb-3">Bridge Visualization &amp; Controls</div>
        <div className="bg-gray-700 rounded p-4 text-center">
          <div className="text-4xl mb-3">
            {bridge_strength && bridge_strength > 0.5 ? '🌀' : '⭕'}
          </div>
          <div className={`text-sm font-bold ${
            bridge_strength && bridge_strength > 0.5 ? 'text-green-400' : 'text-red-400'
          }`}>
            Bridge Status: {bridge_strength && bridge_strength > 0.5 ? 'ACTIVE' : 'INACTIVE'}
          </div>
          {bridge_strength && bridge_strength > 0.5 && (
            <div className="mt-2">
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-green-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(bridge_strength * 100, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-200 mt-1">
                Strength: {(bridge_strength * 100).toFixed(1)}%
              </div>
            </div>
          )}
        </div>
        
        {/* Control Buttons */}
        <div className="mt-4 space-y-2">
          <button 
            onClick={() => handleFormBridge()}
            className={`w-full px-4 py-2 rounded text-sm font-medium transition-colors ${
              bridge_strength && bridge_strength > 0.5
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={!!(bridge_strength && bridge_strength > 0.5)}
          >
            {bridge_strength && bridge_strength > 0.5 ? 'Bridge Active' : 'Form Bridge'}
          </button>
          <button 
            onClick={() => handleTransferPayload()}
            className={`w-full px-4 py-2 rounded text-sm font-medium transition-colors ${
              bridge_strength && bridge_strength > 0.5 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-gray-600 cursor-not-allowed'
            }`}
            disabled={!bridge_strength || bridge_strength <= 0.5}
          >
            Transfer Payload
          </button>
          <button 
            onClick={() => handleUpdateEnergy()}
            className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded text-sm font-medium transition-colors"
          >
            Update Energy
          </button>
        </div>
      </div>

      {/* Operations Controls */}
      <OperationsControls />

    </div>
  )
}

export default BridgeDisplay
