import React, { useState } from 'react'
import './SliderStyles.css'

interface ParameterControlsProps {
  onParameterUpdate: (params: any) => void;
}

const ParameterControls: React.FC<ParameterControlsProps> = ({ onParameterUpdate }) => {
  const [parameters, setParameters] = useState({
    energy1: 1000,
    energy2: 1000,
    frequency1: 30.0,
    frequency2: 30.0,
    payloadVolume: 0.1,
    payloadMass: 75.0,
    payloadType: 'Gold',
    sweepRange: 10.0
  })

  const [sweepResults, setSweepResults] = useState<any[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [scanResults, setScanResults] = useState<any>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [transportReady, setTransportReady] = useState(false)
  const [stargateStatus, setStargateStatus] = useState({
    portal1: 'IDLE',
    portal2: 'IDLE'
  })
  
  const [payloadAssignment, setPayloadAssignment] = useState<{
    portal1: { type: string; volume: number; mass: number } | null;
    portal2: { type: string; volume: number; mass: number } | null;
    loadingBay: { type: string; volume: number; mass: number } | null;
  }>({
    portal1: null,
    portal2: null,
    loadingBay: {
      type: parameters.payloadType,
      volume: parameters.payloadVolume,
      mass: parameters.payloadMass
    }
  })

  const payloadTypes = [
    { value: 'Gold', density: 19.3, description: 'Precious metal - High density' },
    { value: 'Wood', density: 0.6, description: 'Organic material - Low density' },
    { value: 'Aluminum', density: 2.7, description: 'Light metal - Medium density' },
    { value: 'Biological', density: 1.0, description: 'Living tissue - Variable density' }
  ]

  const handleParameterChange = (param: string, value: number | string) => {
    const newParams = { ...parameters, [param]: value }
    setParameters(newParams)
    onParameterUpdate(newParams)
    
    if (param === 'payloadType') {
      const selectedType = payloadTypes.find(t => t.value === value)
      if (selectedType) {
        const calculatedMass = parameters.payloadVolume * selectedType.density * 1000
        const massParams = { ...newParams, payloadMass: calculatedMass }
        setParameters(massParams)
        onParameterUpdate(massParams)
      }
    }
  }

  const runParameterSweep = async () => {
    setIsRunning(true)
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'
      const response = await fetch(`${backendUrl}/api/parameter_sweep?base_freq=${parameters.frequency1}&sweep_range=${parameters.sweepRange}&steps=10`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.status === 'success') {
        setSweepResults(data.results || [])
        console.log('Parameter sweep results:', data)
      } else {
        console.error('Parameter sweep failed:', data.message)
        alert(`Parameter sweep failed: ${data.message}`)
      }
    } catch (error) {
      console.error('Error running parameter sweep:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Error running parameter sweep: ${errorMessage}`)
    } finally {
      setIsRunning(false)
    }
  }

  const applyOptimalParameters = async () => {
    if (sweepResults.length > 0) {
      try {
        const optimal = sweepResults.reduce((best, current) => 
          current.bridge_strength > best.bridge_strength ? current : best
        )
        
        handleParameterChange('energy1', optimal.energy1)
        handleParameterChange('energy2', optimal.energy2)
        
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'
        const response = await fetch(`${backendUrl}/api/set_parameters?frequency1=${optimal.freq1}&frequency2=${optimal.freq2}`, {
          method: 'POST'
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (data.status === 'success') {
          console.log('Applied optimal parameters:', data)
          alert(`Applied optimal parameters: Energy1=${optimal.energy1.toFixed(0)}J, Energy2=${optimal.energy2.toFixed(0)}J`)
        } else {
          console.error('Failed to apply parameters:', data.message)
          alert(`Failed to apply parameters: ${data.message}`)
        }
      } catch (error) {
        console.error('Error applying optimal parameters:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        alert(`Error applying optimal parameters: ${errorMessage}`)
      }
    }
  }

  const scanStargateContents = async (portalNumber: number) => {
    setIsScanning(true)
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'
      const response = await fetch(`${backendUrl}/api/scan_portal?portal=${portalNumber}`, {
        method: 'POST'
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setScanResults(data)
      
      if (data.status === 'success') {
        console.log('Scan results:', data)
        alert(`Portal ${portalNumber} scan complete: ${data.contents || 'Empty'}`)
      } else {
        console.error('Scan failed:', data.message)
        alert(`Scan failed: ${data.message}`)
      }
    } catch (error) {
      console.error('Error scanning portal:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Error scanning portal: ${errorMessage}`)
    } finally {
      setIsScanning(false)
    }
  }

  const commitPayloadToGate = async (portal: number) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'
      const response = await fetch(`${backendUrl}/api/load_payload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          portal: portal,
          payload_type: parameters.payloadType,
          payload_volume: parameters.payloadVolume,
          payload_mass: parameters.payloadMass
        })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.status === 'success') {
        setPayloadAssignment(prev => ({
          ...prev,
          [`portal${portal}`]: {
            type: parameters.payloadType,
            volume: parameters.payloadVolume,
            mass: parameters.payloadMass
          },
          loadingBay: null
        }))
        
        console.log(`Payload committed to Portal ${portal}:`, data)
        alert(`Payload successfully loaded into Portal ${portal}`)
      } else {
        console.error(`Failed to load payload to portal ${portal}:`, data.message)
        alert(`Failed to load payload to portal ${portal}: ${data.message}`)
      }
    } catch (error) {
      console.error(`Error loading payload to portal ${portal}:`, error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Error loading payload to portal ${portal}: ${errorMessage}`)
    }
  }

  const lockStargateForTransport = async (portalNumber: number) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'
      const response = await fetch(`${backendUrl}/api/lock_portal?portal=${portalNumber}`, {
        method: 'POST'
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.status === 'success') {
        setStargateStatus(prev => ({
          ...prev,
          [`portal${portalNumber}`]: 'LOCKED'
        }))
        
        if (stargateStatus.portal1 === 'LOCKED' || stargateStatus.portal2 === 'LOCKED') {
          setTransportReady(true)
        }
        
        console.log(`Portal ${portalNumber} locked for transport`)
        alert(`Portal ${portalNumber} LOCKED - Ready for transport`)
      } else {
        console.error('Lock failed:', data.message)
        alert(`Lock failed: ${data.message}`)
      }
    } catch (error) {
      console.error('Error locking portal:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Error locking portal: ${errorMessage}`)
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-200 font-semibold mb-3">Parameter Control Interface</div>
      
      {/* Energy Controls */}
      <div className="bg-gray-800 border border-gray-600 rounded p-3">
        <div className="text-xs text-gray-200 mb-3">Energy Parameters</div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-300 mb-1">Portal 1 Energy (J)</label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="20000"
                step="100"
                value={parameters.energy1}
                onChange={(e) => handleParameterChange('energy1', Number(e.target.value))}
                className="flex-1 h-3 bg-gradient-to-r from-gray-600 to-gray-500 border border-gray-400 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
              <span className="text-yellow-300 font-mono text-sm w-16 font-bold">{parameters.energy1}</span>
            </div>
          </div>
          
          <div>
            <label className="block text-xs text-gray-300 mb-1">Portal 2 Energy (J)</label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="20000"
                step="100"
                value={parameters.energy2}
                onChange={(e) => handleParameterChange('energy2', Number(e.target.value))}
                className="flex-1 h-3 bg-gradient-to-r from-gray-600 to-gray-500 border border-gray-400 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
              <span className="text-yellow-300 font-mono text-sm w-16 font-bold">{parameters.energy2}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Frequency Controls */}
      <div className="bg-gray-800 border border-gray-600 rounded p-3">
        <div className="text-xs text-gray-200 mb-3">Frequency Parameters</div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-300 mb-1">Portal 1 Frequency (Hz)</label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="14"
                max="40"
                step="0.1"
                value={parameters.frequency1}
                onChange={(e) => handleParameterChange('frequency1', Number(e.target.value))}
                className="flex-1 h-3 bg-gradient-to-r from-gray-600 to-gray-500 border border-gray-400 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
              <span className="text-cyan-300 font-mono text-sm w-16 font-bold">{parameters.frequency1.toFixed(1)}</span>
            </div>
          </div>
          
          <div>
            <label className="block text-xs text-gray-300 mb-1">Portal 2 Frequency (Hz)</label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="14"
                max="40"
                step="0.1"
                value={parameters.frequency2}
                onChange={(e) => handleParameterChange('frequency2', Number(e.target.value))}
                className="flex-1 h-3 bg-gradient-to-r from-gray-600 to-gray-500 border border-gray-400 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
              <span className="text-cyan-300 font-mono text-sm w-16 font-bold">{parameters.frequency2.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payload Controls */}
      <div className="bg-gray-800 border border-gray-600 rounded p-3">
        <div className="text-xs text-gray-200 mb-3">Payload Configuration</div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-300 mb-1">Payload Type</label>
            <select
              value={parameters.payloadType}
              onChange={(e) => handleParameterChange('payloadType', e.target.value)}
              className="w-full px-3 py-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-400 focus:outline-none"
            >
              {payloadTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.value} - {type.description}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs text-gray-300 mb-1">Payload Volume (m³)</label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0.01"
                max="1.0"
                step="0.01"
                value={parameters.payloadVolume}
                onChange={(e) => handleParameterChange('payloadVolume', Number(e.target.value))}
                className="flex-1 h-3 bg-gradient-to-r from-gray-600 to-gray-500 border border-gray-400 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
              <span className="text-green-300 font-mono text-sm w-16 font-bold">{parameters.payloadVolume.toFixed(2)}</span>
            </div>
          </div>
          
          <div>
            <label className="block text-xs text-white mb-1 font-semibold">Calculated Mass (kg)</label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-700 border border-gray-500 rounded px-3 py-2">
                <span className="text-green-300 font-mono text-sm font-bold">
                  {(parameters.payloadVolume * (payloadTypes.find(t => t.value === parameters.payloadType)?.density || 1) * 1000).toFixed(1)}
                </span>
              </div>
              <span className="text-xs text-gray-300 w-16">Auto-calc</span>
            </div>
          </div>
          
          <div>
            <label className="block text-xs text-white mb-1 font-semibold">Manual Weight Override (kg)</label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="1"
                max="500"
                step="1"
                value={parameters.payloadMass}
                onChange={(e) => handleParameterChange('payloadMass', Number(e.target.value))}
                className="flex-1 h-3 bg-gradient-to-r from-gray-600 to-gray-500 border border-gray-400 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
              <span className="text-green-300 font-mono text-sm w-16 font-bold">{parameters.payloadMass}</span>
            </div>
          </div>
          
          {/* Payload Loading Controls */}
          <div className="border-t border-gray-600 pt-3">
            <div className="text-xs text-white mb-2 font-bold">Payload Assignment</div>
            
            {/* Loading Bay Status */}
            <div className="bg-gray-700 border border-gray-500 rounded p-2 mb-3">
              <div className="text-xs text-yellow-200 mb-1 font-semibold">Loading Bay:</div>
              <div className="text-sm text-yellow-100 font-mono font-bold">
                {parameters.payloadType} - {parameters.payloadVolume.toFixed(2)}m³ - {parameters.payloadMass}kg
              </div>
              <div className="text-xs text-gray-300">Ready for portal assignment</div>
            </div>
            
            {/* Portal Assignment Status */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className={`px-3 py-2 rounded text-center text-sm ${
                payloadAssignment.portal1 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-200'
              }`}>
                <div className="font-medium">Portal 1</div>
                <div className="text-xs">
                  {payloadAssignment.portal1 
                    ? `${payloadAssignment.portal1.type} (${payloadAssignment.portal1.mass}kg)`
                    : 'Empty'
                  }
                </div>
              </div>
              
              <div className={`px-3 py-2 rounded text-center text-sm ${
                payloadAssignment.portal2 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-200'
              }`}>
                <div className="font-medium">Portal 2</div>
                <div className="text-xs">
                  {payloadAssignment.portal2 
                    ? `${payloadAssignment.portal2.type} (${payloadAssignment.portal2.mass}kg)`
                    : 'Empty'
                  }
                </div>
              </div>
            </div>
            
            {/* Commit Payload Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => commitPayloadToGate(1)}
                disabled={!!payloadAssignment.portal1}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  payloadAssignment.portal1
                    ? 'bg-gray-800 cursor-not-allowed text-gray-400'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {payloadAssignment.portal1 ? 'Portal 1 Loaded' : 'Commit to Gate 1'}
              </button>
              
              <button
                onClick={() => commitPayloadToGate(2)}
                disabled={!!payloadAssignment.portal2}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  payloadAssignment.portal2
                    ? 'bg-gray-800 cursor-not-allowed text-gray-400'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {payloadAssignment.portal2 ? 'Portal 2 Loaded' : 'Commit to Gate 2'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Parameter Sweep Controls */}
      <div className="bg-gray-800 border border-gray-600 rounded p-3">
        <div className="text-xs text-gray-200 mb-3">Parameter Optimization</div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-300 mb-1">Sweep Range (±J)</label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="100"
                max="5000"
                step="100"
                value={parameters.sweepRange}
                onChange={(e) => handleParameterChange('sweepRange', Number(e.target.value))}
                className="flex-1 h-3 bg-gradient-to-r from-gray-600 to-gray-500 border border-gray-400 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
              <span className="text-purple-300 font-mono text-sm w-16 font-bold">±{parameters.sweepRange}</span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={runParameterSweep}
              disabled={isRunning}
              className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                isRunning 
                  ? 'bg-gray-800 cursor-not-allowed text-gray-400' 
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {isRunning ? 'Running...' : 'Run Parameter Sweep'}
            </button>
            
            <button
              onClick={applyOptimalParameters}
              disabled={sweepResults.length === 0}
              className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                sweepResults.length === 0
                  ? 'bg-gray-800 cursor-not-allowed text-gray-400'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              Apply Optimal
            </button>
          </div>
        </div>
      </div>

      {/* Stargate Scanning & Transport Controls */}
      <div className="bg-gray-800 border border-gray-600 rounded p-3">
        <div className="text-xs text-gray-200 mb-3">Stargate Operations</div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => scanStargateContents(1)}
              disabled={isScanning}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                isScanning 
                  ? 'bg-gray-800 cursor-not-allowed text-gray-400' 
                  : 'bg-cyan-600 hover:bg-cyan-700 text-white'
              }`}
            >
              {isScanning ? 'Scanning...' : 'Scan Portal 1'}
            </button>
            
            <button
              onClick={() => scanStargateContents(2)}
              disabled={isScanning}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                isScanning 
                  ? 'bg-gray-800 cursor-not-allowed text-gray-400' 
                  : 'bg-cyan-600 hover:bg-cyan-700 text-white'
              }`}
            >
              {isScanning ? 'Scanning...' : 'Scan Portal 2'}
            </button>
          </div>
          
          {scanResults && (
            <div className="bg-gray-700 border border-gray-400 rounded p-2">
              <div className="text-xs text-white mb-1 font-semibold">Last Scan Results:</div>
              <div className="text-sm text-cyan-100 font-mono font-bold">
                {scanResults.contents || 'Portal Empty'}
              </div>
              {scanResults.required_params && (
                <div className="text-xs text-yellow-200 mt-1 font-semibold">
                  Required: {scanResults.required_params}
                </div>
              )}
            </div>
          )}
          
          <div className="border-t border-gray-600 pt-3">
            <div className="text-xs text-white mb-2 font-semibold">Transport Lock Status</div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className={`px-3 py-2 rounded text-center text-sm font-bold ${
                stargateStatus.portal1 === 'LOCKED' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-700 text-white border border-gray-400'
              }`}>
                Portal 1: {stargateStatus.portal1}
              </div>
              
              <div className={`px-3 py-2 rounded text-center text-sm font-bold ${
                stargateStatus.portal2 === 'LOCKED' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-700 text-white border border-gray-400'
              }`}>
                Portal 2: {stargateStatus.portal2}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => lockStargateForTransport(1)}
                disabled={stargateStatus.portal1 === 'LOCKED'}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  stargateStatus.portal1 === 'LOCKED'
                    ? 'bg-gray-800 cursor-not-allowed text-gray-400'
                    : 'bg-orange-600 hover:bg-orange-700 text-white'
                }`}
              >
                Lock Portal 1
              </button>
              
              <button
                onClick={() => lockStargateForTransport(2)}
                disabled={stargateStatus.portal2 === 'LOCKED'}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  stargateStatus.portal2 === 'LOCKED'
                    ? 'bg-gray-800 cursor-not-allowed text-gray-400'
                    : 'bg-orange-600 hover:bg-orange-700 text-white'
                }`}
              >
                Lock Portal 2
              </button>
            </div>
            
            {transportReady && (
              <div className="mt-3 p-2 bg-green-600 rounded text-center">
                <div className="text-white font-bold text-sm">🔒 READY FOR TRANSPORT</div>
                <div className="text-xs text-green-100">Bridge formation can now be activated</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sweep Results Visualization */}
      {sweepResults.length > 0 && (
        <div className="bg-gray-800 border border-gray-600 rounded p-3">
          <div className="text-xs text-white mb-3 font-bold">Optimization Results</div>
          <div className="space-y-2">
            <div className="text-xs text-white font-semibold">
              Best Bridge Strength: {Math.max(...sweepResults.map(r => r.bridge_strength)).toFixed(3)}
            </div>
            <div className="grid grid-cols-5 gap-1">
              {sweepResults.slice(0, 10).map((result, index) => (
                <div
                  key={index}
                  className="bg-gray-700 border border-gray-400 rounded p-1 text-center"
                  style={{
                    backgroundColor: `rgba(34, 197, 94, ${result.bridge_strength})`
                  }}
                >
                  <div className="text-xs text-white font-mono">
                    {result.bridge_strength.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ParameterControls
