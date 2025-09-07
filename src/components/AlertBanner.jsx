import React from 'react'
import { AlertTriangle, Shield, Info } from 'lucide-react'

const AlertBanner = ({ variant, message }) => {
  const getVariantConfig = () => {
    switch (variant) {
      case 'overpriced':
        return {
          icon: <AlertTriangle className="h-5 w-5" />,
          title: 'Overpriced Listing Detected',
          message: message || 'This diamond is priced 25% above current market value. Consider negotiating or exploring alternatives.',
          bgColor: 'bg-red-500/20',
          borderColor: 'border-red-500',
          textColor: 'text-red-300',
          iconColor: 'text-red-400'
        }
      case 'ethicalAlert':
        return {
          icon: <Shield className="h-5 w-5" />,
          title: 'Ethical Sourcing Verified',
          message: message || 'This diamond has verified ethical sourcing and lab-grown certification.',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-500',
          textColor: 'text-green-300',
          iconColor: 'text-green-400'
        }
      default:
        return {
          icon: <Info className="h-5 w-5" />,
          title: 'Information',
          message: message || 'Additional information about this diamond.',
          bgColor: 'bg-blue-500/20',
          borderColor: 'border-blue-500',
          textColor: 'text-blue-300',
          iconColor: 'text-blue-400'
        }
    }
  }

  const config = getVariantConfig()

  return (
    <div className={`${config.bgColor} border ${config.borderColor} rounded-lg p-4 animate-fade-in`}>
      <div className="flex items-start space-x-3">
        <div className={config.iconColor}>
          {config.icon}
        </div>
        <div>
          <h3 className={`font-semibold ${config.textColor} mb-1`}>
            {config.title}
          </h3>
          <p className={config.textColor}>
            {config.message}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AlertBanner