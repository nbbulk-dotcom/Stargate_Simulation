import React, { useState } from 'react'
import './SliderStyles.css'

interface EnergyControlsProps {
  portalNumber: number;
}

const EnergyControls: React.FC<EnergyControlsProps> = ({ portalNumber }) => {
  const [parameters, setParameters] = useState({
    energy1: 1000,
    energy2: 1000,
    frequency1: 30.0,
    frequency2: 30.0
  })

  const handleParameterChange = (param: string, value: number) => {
    setParameters(prev => ({
      ...prev,
      [param]: value
    }))
  }

  return (
    <div className="space-y-4 mt-4 border-t border-gray-600 pt-4">
      <div className="text-sm text-gray-200 font-semibold mb-3">Portal {portalNumber} Parameter Controls</div>
      
      {/* Energy Controls */}
      <div className="bg-gray-800 border border-gray-600 rounded p-3">
        <div className="text-xs text-gray-200 mb-3">Energy Parameters</div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-300 mb-1">Portal {portalNumber} Energy (J)</label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="20000"
                step="100"
                value={portalNumber === 1 ? parameters.energy1 : parameters.energy2}
                onChange={(e) => handleParameterChange(portalNumber === 1 ? 'energy1' : 'energy2', Number(e.target.value))}
                className="flex-1 h-3 bg-gradient-to-r from-gray-600 to-gray-500 border border-gray-400 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
              <span className="text-yellow-300 font-mono text-sm w-16 font-bold">
                {portalNumber === 1 ? parameters.energy1 : parameters.energy2}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Frequency Controls */}
      <div className="bg-gray-800 border border-gray-600 rounded p-3">
        <div className="text-xs text-gray-200 mb-3">Frequency Parameters</div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-300 mb-1">Portal {portalNumber} Frequency (Hz)</label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="14"
                max="40"
                step="0.1"
                value={portalNumber === 1 ? parameters.frequency1 : parameters.frequency2}
                onChange={(e) => handleParameterChange(portalNumber === 1 ? 'frequency1' : 'frequency2', Number(e.target.value))}
                className="flex-1 h-3 bg-gradient-to-r from-gray-600 to-gray-500 border border-gray-400 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
              <span className="text-cyan-300 font-mono text-sm w-16 font-bold">
                {(portalNumber === 1 ? parameters.frequency1 : parameters.frequency2).toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnergyControls
