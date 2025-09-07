import React, { useState } from 'react'
import { TrendingUp, Shield, MessageCircle, Download, Share2 } from 'lucide-react'
import DiamondCard from './DiamondCard'
import AlertBanner from './AlertBanner'
import NegotiationScript from './NegotiationScript'

const ValuationResults = ({ diamond, results }) => {
  const [activeTab, setActiveTab] = useState('valuation')

  const tabs = [
    { id: 'valuation', label: 'Valuation', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'negotiation', label: 'Negotiation', icon: <MessageCircle className="h-4 w-4" /> },
    { id: 'sourcing', label: 'Ethical Sourcing', icon: <Shield className="h-4 w-4" /> }
  ]

  return (
    <div className="space-y-8">
      {/* Diamond Overview */}
      <DiamondCard diamond={diamond} variant="highlighted" />

      {/* Tab Navigation */}
      <div className="glass-effect rounded-lg p-1">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-accent text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {activeTab === 'valuation' && (
          <div className="space-y-6">
            {/* Market Value Summary */}
            <div className="glass-effect rounded-lg p-6">
              <h3 className="text-2xl font-bold text-white mb-6">Market Valuation</h3>
              
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-2">
                    ${results.fairMarketValue.toLocaleString()}
                  </div>
                  <div className="text-gray-300">Fair Market Value</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {results.qualityGrade}
                  </div>
                  <div className="text-gray-300">Quality Grade</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    ${results.priceRange.min.toLocaleString()} - ${results.priceRange.max.toLocaleString()}
                  </div>
                  <div className="text-gray-300">Price Range</div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">Market Analysis</h4>
                <p className="text-gray-300">{results.marketComparison}</p>
              </div>
            </div>

            {/* Quality Assessment */}
            <div className="glass-effect rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Quality Assessment</h3>
              <div className="space-y-3">
                {results.negotiationPoints.map((point, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'negotiation' && (
          <NegotiationScript diamond={diamond} results={results} />
        )}

        {activeTab === 'sourcing' && (
          <div className="space-y-6">
            <AlertBanner variant="ethicalAlert" />
            
            <div className="glass-effect rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Ethical Sourcing Verification</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Origin</div>
                  <div className="text-white font-medium">{results.ethicalSourcing.origin}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Certificate</div>
                  <div className="text-white font-medium">{results.ethicalSourcing.certificate}</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-500/20 border border-green-500 rounded-lg">
                <div className="flex items-center space-x-2 text-green-400 mb-2">
                  <Shield className="h-5 w-5" />
                  <span className="font-semibold">Verified Ethical Source</span>
                </div>
                <p className="text-green-300">
                  This diamond has been verified as ethically sourced through our comprehensive verification process.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button className="flex-1 bg-accent hover:bg-accent/90 text-white py-3 px-6 rounded-md font-semibold transition-colors flex items-center justify-center">
          <Download className="h-5 w-5 mr-2" />
          Download Report
        </button>
        <button className="flex-1 border border-accent text-accent hover:bg-accent hover:text-white py-3 px-6 rounded-md font-semibold transition-colors flex items-center justify-center">
          <Share2 className="h-5 w-5 mr-2" />
          Share Results
        </button>
      </div>
    </div>
  )
}

export default ValuationResults