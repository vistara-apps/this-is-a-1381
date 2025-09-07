import React, { useState } from 'react'
import { Upload, Link as LinkIcon, Hash, Loader2 } from 'lucide-react'
import diamondService from '../services/diamondService.js'
import openaiService from '../services/openaiService.js'

const UserForm = ({ variant, onSubmit, isProcessing }) => {
  const [formData, setFormData] = useState({
    carat: '',
    cut: '',
    color: '',
    clarity: '',
    measurements: '',
    url: '',
    sku: '',
    file: null
  })
  const [imageAnalyzing, setImageAnalyzing] = useState(false)
  const [imageError, setImageError] = useState(null)

  const cuts = ['Round', 'Princess', 'Cushion', 'Emerald', 'Oval', 'Radiant', 'Asscher', 'Marquise', 'Heart', 'Pear']
  const colors = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']
  const clarities = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2']

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setFormData({ ...formData, file })
    setImageError(null)

    // If it's an image upload variant, try to analyze the image
    if (variant === 'upload' && file.type.startsWith('image/')) {
      setImageAnalyzing(true)
      
      try {
        // Upload image and analyze with AI
        const uploadResult = await diamondService.uploadDiamondImage(file)
        
        if (uploadResult.analysis && typeof uploadResult.analysis === 'object') {
          // Auto-fill form fields from AI analysis
          const analysis = uploadResult.analysis
          setFormData(prev => ({
            ...prev,
            carat: analysis.carat || prev.carat,
            cut: analysis.cut || prev.cut,
            color: analysis.color || prev.color,
            clarity: analysis.clarity || prev.clarity,
            measurements: analysis.measurements || prev.measurements,
            imageUrl: uploadResult.imageUrl,
            ipfsHash: uploadResult.ipfsHash
          }))
        }
      } catch (error) {
        console.error('Image analysis error:', error)
        setImageError('Failed to analyze image. You can still proceed manually.')
      } finally {
        setImageAnalyzing(false)
      }
    }
  }

  const renderIcon = () => {
    switch (variant) {
      case 'upload': return <Upload className="h-6 w-6" />
      case 'link': return <LinkIcon className="h-6 w-6" />
      case 'manual': return <Hash className="h-6 w-6" />
      default: return null
    }
  }

  const getTitle = () => {
    switch (variant) {
      case 'upload': return 'Upload Diamond Image'
      case 'link': return 'Paste Diamond Listing URL'
      case 'manual': return 'Enter Diamond Details'
      default: return 'Diamond Information'
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-effect rounded-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="text-accent">{renderIcon()}</div>
          <h2 className="text-2xl font-semibold text-white">{getTitle()}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {variant === 'upload' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Upload Image or Certificate
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-accent transition-colors">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="text-gray-300 mb-2">
                  Drag and drop your file here, or click to browse
                </div>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Choose File
                </label>
                {formData.file && (
                  <div className="mt-2">
                    <div className="text-accent">{formData.file.name}</div>
                    {imageAnalyzing && (
                      <div className="flex items-center mt-2 text-blue-400">
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing image...
                      </div>
                    )}
                    {imageError && (
                      <div className="mt-2 text-red-400 text-sm">{imageError}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {variant === 'link' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Diamond Listing URL
              </label>
              <input
                type="url"
                placeholder="https://example.com/diamond-listing"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-accent"
                required
              />
            </div>
          )}

          {(variant === 'manual' || variant === 'upload') && (
            <>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Carat Weight
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="1.00"
                    value={formData.carat}
                    onChange={(e) => setFormData({ ...formData, carat: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-accent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cut
                  </label>
                  <select
                    value={formData.cut}
                    onChange={(e) => setFormData({ ...formData, cut: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-accent"
                    required
                  >
                    <option value="">Select Cut</option>
                    {cuts.map(cut => (
                      <option key={cut} value={cut}>{cut}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Color
                  </label>
                  <select
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-accent"
                    required
                  >
                    <option value="">Select Color</option>
                    {colors.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Clarity
                  </label>
                  <select
                    value={formData.clarity}
                    onChange={(e) => setFormData({ ...formData, clarity: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-accent"
                    required
                  >
                    <option value="">Select Clarity</option>
                    {clarities.map(clarity => (
                      <option key={clarity} value={clarity}>{clarity}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Measurements (optional)
                </label>
                <input
                  type="text"
                  placeholder="6.50 x 6.53 x 4.05 mm"
                  value={formData.measurements}
                  onChange={(e) => setFormData({ ...formData, measurements: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-accent"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-accent hover:bg-accent/90 text-white py-4 px-6 rounded-md font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Analyzing Diamond...
              </>
            ) : (
              'Get Valuation Report'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default UserForm
