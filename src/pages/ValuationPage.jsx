import React, { useState } from 'react'
import { Upload, Link as LinkIcon, Hash, AlertTriangle, CheckCircle } from 'lucide-react'
import DiamondCard from '../components/DiamondCard'
import UserForm from '../components/UserForm'
import AlertBanner from '../components/AlertBanner'
import ValuationResults from '../components/ValuationResults'

const ValuationPage = () => {
  const [step, setStep] = useState(1)
  const [inputMethod, setInputMethod] = useState('')
  const [diamondData, setDiamondData] = useState(null)
  const [valuationResults, setValuationResults] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleInputMethodSelect = (method) => {
    setInputMethod(method)
    setStep(2)
  }

  const handleDiamondSubmit = async (data) => {
    setIsProcessing(true)
    setDiamondData(data)
    
    // Simulate API call for valuation
    setTimeout(() => {
      const mockResults = {
        fairMarketValue: Math.round(data.carat * 1500 + Math.random() * 500),
        qualityGrade: 'Excellent',
        isOverpriced: Math.random() > 0.7,
        priceRange: {
          min: Math.round(data.carat * 1200),
          max: Math.round(data.carat * 1800)
        },
        marketComparison: 'Below market average',
        negotiationPoints: [
          'Color grade is slightly lower than premium tier',
          'Inclusion pattern affects brilliance by 5%',
          'Cut quality exceeds industry standards'
        ],
        ethicalSourcing: {
          verified: true,
          origin: 'Certified Lab-Grown',
          certificate: 'IGI-12345678'
        }
      }
      
      setValuationResults(mockResults)
      setIsProcessing(false)
      setStep(3)
    }, 3000)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Get Your Diamond Valuation
        </h1>
        <p className="text-xl text-gray-300">
          Upload your diamond details and get instant market analysis
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center space-x-4">
          {[1, 2, 3].map((num) => (
            <React.Fragment key={num}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= num ? 'bg-accent text-white' : 'bg-gray-600 text-gray-300'
              }`}>
                {step > num ? <CheckCircle className="h-6 w-6" /> : num}
              </div>
              {num < 3 && (
                <div className={`w-16 h-1 ${
                  step > num ? 'bg-accent' : 'bg-gray-600'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step 1: Input Method Selection */}
      {step === 1 && (
        <div className="space-y-8 animate-fade-in">
          <h2 className="text-2xl font-semibold text-white text-center mb-8">
            How would you like to provide diamond details?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <button
              onClick={() => handleInputMethodSelect('upload')}
              className="glass-effect rounded-lg p-8 hover:bg-white/20 transition-all group text-center"
            >
              <Upload className="h-12 w-12 text-accent mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-white mb-2">Upload Image</h3>
              <p className="text-gray-300">Upload a photo of your diamond or certificate</p>
            </button>

            <button
              onClick={() => handleInputMethodSelect('link')}
              className="glass-effect rounded-lg p-8 hover:bg-white/20 transition-all group text-center"
            >
              <LinkIcon className="h-12 w-12 text-accent mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-white mb-2">Paste URL</h3>
              <p className="text-gray-300">Provide a link to the diamond listing</p>
            </button>

            <button
              onClick={() => handleInputMethodSelect('manual')}
              className="glass-effect rounded-lg p-8 hover:bg-white/20 transition-all group text-center"
            >
              <Hash className="h-12 w-12 text-accent mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-white mb-2">Enter Details</h3>
              <p className="text-gray-300">Manually input diamond specifications</p>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Data Input */}
      {step === 2 && (
        <div className="animate-slide-up">
          <UserForm
            variant={inputMethod}
            onSubmit={handleDiamondSubmit}
            isProcessing={isProcessing}
          />
        </div>
      )}

      {/* Step 3: Results */}
      {step === 3 && valuationResults && (
        <div className="space-y-8 animate-fade-in">
          {valuationResults.isOverpriced && (
            <AlertBanner variant="overpriced" />
          )}
          
          <ValuationResults 
            diamond={diamondData}
            results={valuationResults}
          />
        </div>
      )}
    </div>
  )
}

export default ValuationPage