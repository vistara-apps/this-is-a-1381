import React from 'react'
import { Diamond, AlertTriangle, CheckCircle } from 'lucide-react'

const DiamondCard = ({ diamond, variant = 'default' }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'highlighted':
        return 'ring-2 ring-accent bg-accent/10'
      default:
        return 'glass-effect'
    }
  }

  return (
    <div className={`rounded-lg p-6 ${getVariantStyles()} animate-fade-in`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Diamond className="h-8 w-8 text-accent" />
          <div>
            <h3 className="text-xl font-semibold text-white">
              {diamond.carat}ct {diamond.cut} Diamond
            </h3>
            <p className="text-gray-300">
              {diamond.color} • {diamond.clarity}
            </p>
          </div>
        </div>
        
        {diamond.isOverpriced && (
          <AlertTriangle className="h-6 w-6 text-red-400" />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-400">Carat Weight</div>
          <div className="text-white font-medium">{diamond.carat}ct</div>
        </div>
        <div>
          <div className="text-sm text-gray-400">Cut Grade</div>
          <div className="text-white font-medium">{diamond.cut}</div>
        </div>
        <div>
          <div className="text-sm text-gray-400">Color</div>
          <div className="text-white font-medium">{diamond.color}</div>
        </div>
        <div>
          <div className="text-sm text-gray-400">Clarity</div>
          <div className="text-white font-medium">{diamond.clarity}</div>
        </div>
      </div>

      {diamond.measurements && (
        <div className="mb-4">
          <div className="text-sm text-gray-400">Measurements</div>
          <div className="text-white font-medium">{diamond.measurements}</div>
        </div>
      )}

      {diamond.ethicalSourcing && (
        <div className="flex items-center space-x-2 text-green-400">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm">Ethically Sourced</span>
        </div>
      )}
    </div>
  )
}

export default DiamondCard