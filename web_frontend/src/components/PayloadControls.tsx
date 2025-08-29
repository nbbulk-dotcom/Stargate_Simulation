import React, { useState } from 'react'
import './SliderStyles.css'

const PayloadControls: React.FC = () => {
  const [parameters, setParameters] = useState({
    payloadVolume: 0.1,
    payloadMass: 75.0,
    payloadType: 'Gold'
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
    setParameters(prev => ({
      ...prev,
      [param]: value
    }))
    
    setPayloadAssignment(prev => ({
      ...prev,
      loadingBay: {
        type: param === 'payloadType' ? value as string : prev.loadingBay?.type || 'Gold',
        volume: param === 'payloadVolume' ? value as number : prev.loadingBay?.volume || 0.1,
        mass: param === 'payloadMass' ? value as number : prev.loadingBay?.mass || 75.0
      }
    }))
  }

  const commitPayloadToGate = async (gateNumber: number) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'
      const response = await fetch(`${backendUrl}/api/load_payload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          portal_id: gateNumber,
          payload_type: parameters.payloadType,
          payload_volume: parameters.payloadVolume,
          payload_mass: parameters.payloadMass
        })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log(`Payload committed to gate ${gateNumber}:`, data)
      
      setPayloadAssignment(prev => ({
        ...prev,
        [`portal${gateNumber}`]: {
          type: parameters.payloadType,
          volume: parameters.payloadVolume,
          mass: parameters.payloadMass
        },
        loadingBay: null
      }))
    } catch (error) {
      console.error(`Error committing payload to gate ${gateNumber}:`, error)
    }
  }

  return (
    <div className="space-y-4 mt-4 border-t border-gray-600 pt-4">
      <div className="text-sm text-gray-200 font-semibold mb-3">Payload Configuration</div>
      
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
    </div>
  )
}

export default PayloadControls
