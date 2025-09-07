import React, { useState, useEffect } from 'react'
import { MessageCircle, Copy, Loader2 } from 'lucide-react'
import openaiService from '../services/openaiService.js'

const NegotiationScript = ({ diamond, results }) => {
  const [script, setScript] = useState('')
  const [checklist, setChecklist] = useState([])
  const [isGenerating, setIsGenerating] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    generateNegotiationContent()
  }, [diamond, results])

  const generateNegotiationContent = async () => {
    setIsGenerating(true)
    setError(null)
    
    try {
      // Use real OpenAI service for script generation
      const [generatedScript, generatedChecklist] = await Promise.all([
        openaiService.generateNegotiationScript(diamond, results),
        openaiService.generateNegotiationChecklist(diamond, results)
      ])

      setScript(generatedScript)
      setChecklist(generatedChecklist)
    } catch (error) {
      console.error('Failed to generate negotiation content:', error)
      setError('Failed to generate negotiation content. Please try again.')
      
      // Fallback to mock data
      const fallbackScript = openaiService.generateMockNegotiationScript(diamond, results)
      const fallbackChecklist = openaiService.generateMockChecklist()
      
      setScript(fallbackScript)
      setChecklist(fallbackChecklist)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyScript = () => {
    navigator.clipboard.writeText(script)
    alert('Negotiation script copied to clipboard!')
  }

  const toggleChecklistItem = (index) => {
    const updatedChecklist = [...checklist]
    updatedChecklist[index].completed = !updatedChecklist[index].completed
    setChecklist(updatedChecklist)
  }

  if (isGenerating) {
    return (
      <div className="glass-effect rounded-lg p-8 text-center">
        <Loader2 className="h-8 w-8 text-accent mx-auto mb-4 animate-spin" />
        <h3 className="text-xl font-semibold text-white mb-2">
          Generating Your Negotiation Strategy
        </h3>
        <p className="text-gray-300">
          Creating personalized negotiation scripts based on your diamond's specifications...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-effect rounded-lg p-8 text-center">
        <div className="text-red-400 mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Generation Error
        </h3>
        <p className="text-gray-300 mb-4">{error}</p>
        <button
          onClick={generateNegotiationContent}
          className="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-md font-medium transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Negotiation Script */}
      <div className="glass-effect rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center">
            <MessageCircle className="h-5 w-5 mr-2 text-accent" />
            Your Negotiation Script
          </h3>
          <button
            onClick={copyScript}
            className="flex items-center space-x-2 text-accent hover:text-accent/80 transition-colors"
          >
            <Copy className="h-4 w-4" />
            <span className="text-sm">Copy</span>
          </button>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4">
          <pre className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
            {script}
          </pre>
        </div>
      </div>

      {/* Negotiation Checklist */}
      <div className="glass-effect rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Pre-Negotiation Checklist</h3>
        
        <div className="space-y-3">
          {checklist.map((item, index) => (
            <label
              key={index}
              className="flex items-start space-x-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleChecklistItem(index)}
                className="mt-1 w-4 h-4 text-accent bg-gray-800 border-gray-600 rounded focus:ring-accent focus:ring-2"
              />
              <span className={`text-sm transition-colors ${
                item.completed 
                  ? 'text-green-400 line-through' 
                  : 'text-gray-300 group-hover:text-white'
              }`}>
                {item.item}
              </span>
            </label>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500 rounded-lg">
          <h4 className="font-semibold text-blue-300 mb-2">Pro Tip</h4>
          <p className="text-blue-200 text-sm">
            Remember to stay confident but respectful. Your research gives you leverage, 
            but maintaining a positive relationship is key to successful negotiation.
          </p>
        </div>
      </div>
    </div>
  )
}

export default NegotiationScript
