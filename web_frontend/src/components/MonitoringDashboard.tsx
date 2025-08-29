import React from 'react'

interface MonitoringData {
  portal1?: {
    freq?: number;
    stability?: number;
    power?: number;
    energy?: number;
    floor_temp?: number;
    safety_status?: boolean;
  };
  portal2?: {
    freq?: number;
    stability?: number;
    power?: number;
    energy?: number;
    floor_temp?: number;
    safety_status?: boolean;
  };
  bridge_strength?: number;
  transfer_energy?: number;
}

interface MonitoringDashboardProps {
  data: MonitoringData;
}

const MonitoringDashboard: React.FC<MonitoringDashboardProps> = ({ data }) => {
  const { portal1, portal2, bridge_strength, transfer_energy } = data

  const getTemperatureColor = (temp: number) => {
    if (temp > 100) return 'text-red-400'
    if (temp > 50) return 'text-yellow-400'
    return 'text-blue-400'
  }

  const getEnergyBarWidth = (energy: number) => {
    return Math.min((energy / 20000) * 100, 100)
  }

  const getPowerLevel = (power: number) => {
    if (power > 1000) return { color: 'text-red-400', level: 'HIGH' }
    if (power > 500) return { color: 'text-yellow-400', level: 'MEDIUM' }
    return { color: 'text-green-400', level: 'LOW' }
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-400 font-semibold mb-3">Real-Time Monitoring Dashboard</div>
      
      {/* Temperature Monitoring */}
      <div className="bg-gray-700 rounded p-3">
        <div className="text-xs text-gray-400 mb-2">Temperature Monitoring</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <div className="text-xs text-gray-500">Portal 1</div>
            <div className={`text-lg font-mono font-bold ${getTemperatureColor(portal1?.floor_temp || 0)}`}>
              {portal1?.floor_temp?.toFixed(1) || '0.0'}°C
            </div>
            <div className="w-full bg-gray-600 rounded-full h-1 mt-1">
              <div 
                className={`h-1 rounded-full transition-all duration-500 ${
                  (portal1?.floor_temp || 0) > 50 ? 'bg-red-400' : 'bg-blue-400'
                }`}
                style={{ width: `${Math.min((portal1?.floor_temp || 0) / 150 * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">Portal 2</div>
            <div className={`text-lg font-mono font-bold ${getTemperatureColor(portal2?.floor_temp || 0)}`}>
              {portal2?.floor_temp?.toFixed(1) || '0.0'}°C
            </div>
            <div className="w-full bg-gray-600 rounded-full h-1 mt-1">
              <div 
                className={`h-1 rounded-full transition-all duration-500 ${
                  (portal2?.floor_temp || 0) > 50 ? 'bg-red-400' : 'bg-blue-400'
                }`}
                style={{ width: `${Math.min((portal2?.floor_temp || 0) / 150 * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Energy Level Visualization */}
      <div className="bg-gray-700 rounded p-3">
        <div className="text-xs text-gray-400 mb-2">Energy Level Visualization</div>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Portal 1 Energy</span>
              <span className="text-white font-mono">{portal1?.energy?.toFixed(0) || '0'} J</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getEnergyBarWidth(portal1?.energy || 0)}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Portal 2 Energy</span>
              <span className="text-white font-mono">{portal2?.energy?.toFixed(0) || '0'} J</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getEnergyBarWidth(portal2?.energy || 0)}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Transfer Energy</span>
              <span className="text-white font-mono">{transfer_energy?.toFixed(0) || '0'} J</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-yellow-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getEnergyBarWidth(transfer_energy || 0)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Power Level Status */}
      <div className="bg-gray-700 rounded p-3">
        <div className="text-xs text-gray-400 mb-2">Power Level Status</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <div className="text-xs text-gray-500">Portal 1</div>
            <div className={`text-sm font-bold ${getPowerLevel(portal1?.power || 0).color}`}>
              {getPowerLevel(portal1?.power || 0).level}
            </div>
            <div className="text-xs font-mono text-gray-300">
              {portal1?.power?.toFixed(1) || '0.0'} W
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">Portal 2</div>
            <div className={`text-sm font-bold ${getPowerLevel(portal2?.power || 0).color}`}>
              {getPowerLevel(portal2?.power || 0).level}
            </div>
            <div className="text-xs font-mono text-gray-300">
              {portal2?.power?.toFixed(1) || '0.0'} W
            </div>
          </div>
        </div>
      </div>

      {/* Safety System Status Panel */}
      <div className="bg-gray-700 rounded p-3">
        <div className="text-xs text-gray-400 mb-2">Safety System Status</div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className={`p-2 rounded text-xs font-bold ${
            portal1?.safety_status ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}>
            P1: {portal1?.safety_status ? 'OK' : 'FAIL'}
          </div>
          <div className={`p-2 rounded text-xs font-bold ${
            portal2?.safety_status ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}>
            P2: {portal2?.safety_status ? 'OK' : 'FAIL'}
          </div>
          <div className={`p-2 rounded text-xs font-bold ${
            bridge_strength && bridge_strength > 0.5 ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}>
            BR: {bridge_strength && bridge_strength > 0.5 ? 'ACTIVE' : 'INACTIVE'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MonitoringDashboard
