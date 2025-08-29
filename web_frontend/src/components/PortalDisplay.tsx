import React from 'react'
import Portal3D from './Portal3D'
import EnergyControls from './EnergyControls'
import PayloadControls from './PayloadControls'

interface PortalData {
  freq?: number;
  stability?: number;
  power?: number;
  energy?: number;
  floor_temp?: number;
  floor_contact?: boolean;
  safety_status?: boolean;
  payload_volume?: number;
  payload_mass?: number;
  status_log?: string[];
}

interface PortalDisplayProps {
  portal?: PortalData;
  title: string;
  portalNumber: number;
}

const PortalDisplay: React.FC<PortalDisplayProps> = ({ portal, title, portalNumber }) => {
  if (!portal) {
    return (
      <div className="text-center text-gray-400 py-8">
        <div className="text-lg font-semibold mb-2">{title}</div>
        <div>No portal data available</div>
        <div className="text-sm mt-2">Initialize simulation to begin</div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="text-lg font-semibold text-blue-400 mb-4">{title}</div>
      
      {/* 3D Portal Visualization */}
      <Portal3D 
        portalData={{
          freq: portal.freq,
          stability: portal.stability,
          power: portal.power,
          energy: portal.energy,
          safety_status: portal.safety_status
        }}
        title="3D Portal Geometry"
      />
      
      {/* Portal Metrics */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-300">Frequency:</span>
          <div className="flex items-center space-x-2">
            <span className={`font-mono ${portal.freq && portal.freq > 30 ? 'text-blue-400' : 'text-white'}`}>
              {portal.freq?.toFixed(2) || '0.00'} Hz
            </span>
            {portal.freq && portal.freq > 30 && (
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            )}
          </div>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-300">Stability:</span>
          <span className="text-white font-mono">{portal.stability?.toFixed(2) || '0.00'}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-300">Power:</span>
          <span className="text-white font-mono">{portal.power?.toFixed(1) || '0.0'} W</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-300">Energy Delivered:</span>
          <div className="flex items-center space-x-2">
            <span className={`font-mono ${portal.energy && portal.energy > 0 ? 'text-yellow-400' : 'text-white'}`}>
              {portal.energy?.toFixed(1) || '0.0'} J
            </span>
            {portal.energy && portal.energy > 0 && (
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            )}
          </div>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-300">Floor Temp:</span>
          <span className="text-white font-mono">{portal.floor_temp?.toFixed(1) || '0.0'} °C</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-300">Floor Contact:</span>
          <span className={`font-mono ${portal.floor_contact ? 'text-green-400' : 'text-red-400'}`}>
            {portal.floor_contact ? 'TRUE' : 'FALSE'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-300">Safety Status:</span>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${portal.safety_status ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`}></div>
            <span className={`font-mono font-bold ${portal.safety_status ? 'text-green-400' : 'text-red-400'}`}>
              {portal.safety_status ? 'OK' : 'FAIL'}
            </span>
          </div>
        </div>
      </div>

      {/* Payload Information */}
      <div className="border-t border-gray-600 pt-3 mt-4">
        <div className="text-sm text-gray-400 mb-2">Payload Information</div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-300">Volume:</span>
            <span className="text-white font-mono">{portal.payload_volume?.toFixed(2) || '0.00'} m³</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Mass:</span>
            <span className="text-white font-mono">{portal.payload_mass?.toFixed(1) || '0.0'} kg</span>
          </div>
        </div>
      </div>

      {/* Status Log */}
      <div className="border-t border-gray-600 pt-3 mt-4">
        <div className="text-sm text-gray-400 mb-2">Status Log (Last 5)</div>
        <div className="space-y-1 text-xs max-h-24 overflow-y-auto">
          {portal.status_log && portal.status_log.length > 0 ? (
            portal.status_log.slice(-5).map((msg, index) => {
              let textColor = 'text-gray-500'
              if (msg.includes('OK') || msg.includes('SUCCESS')) textColor = 'text-green-400'
              else if (msg.includes('FAIL') || msg.includes('ERROR') || msg.includes('WARNING')) textColor = 'text-red-400'
              else if (msg.includes('ACTIVE') || msg.includes('READY')) textColor = 'text-blue-400'
              
              return (
                <div key={index} className={`font-mono ${textColor}`}>
                  {msg}
                </div>
              )
            })
          ) : (
            <div className="text-gray-500">No status messages</div>
          )}
        </div>
      </div>
      
      {/* Portal-specific controls */}
      {portalNumber === 1 && <EnergyControls portalNumber={1} />}
      {portalNumber === 2 && <PayloadControls />}
    </div>
  )
}

export default PortalDisplay
