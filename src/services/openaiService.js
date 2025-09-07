// OpenAI Service for AI-powered features
import OpenAI from 'openai'

class OpenAIService {
  constructor() {
    this.client = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true // Note: In production, API calls should go through backend
    })
  }

  async generateNegotiationScript(diamond, valuationResults) {
    try {
      const prompt = `Generate a professional negotiation script for a diamond purchase with the following details:
      
Diamond Specifications:
- Carat: ${diamond.carat}
- Cut: ${diamond.cut}
- Color: ${diamond.color}
- Clarity: ${diamond.clarity}
- Measurements: ${diamond.measurements || 'Not specified'}

Market Analysis:
- Fair Market Value: $${valuationResults.fairMarketValue}
- Price Range: $${valuationResults.priceRange.min} - $${valuationResults.priceRange.max}
- Is Overpriced: ${valuationResults.isOverpriced ? 'Yes' : 'No'}
- Quality Grade: ${valuationResults.qualityGrade}

Please provide:
1. A professional opening statement
2. 3-4 key negotiation points with specific data
3. A closing strategy
4. Alternative approaches if price negotiation fails

Keep the tone professional but confident, and include specific dollar amounts and percentages where relevant.`

      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert diamond negotiation consultant. Provide professional, data-driven negotiation strategies.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })

      return response.choices[0].message.content
    } catch (error) {
      console.error('OpenAI API error:', error)
      // Fallback to mock data if API fails
      return this.generateMockNegotiationScript(diamond, valuationResults)
    }
  }

  async generateNegotiationChecklist(diamond, valuationResults) {
    try {
      const prompt = `Create a comprehensive pre-negotiation checklist for purchasing a ${diamond.carat}ct ${diamond.cut} diamond. Include 6-8 specific action items that a buyer should complete before negotiating. Focus on verification, research, and preparation steps.`

      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a diamond purchasing expert. Create practical, actionable checklist items.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.5
      })

      // Parse the response into checklist items
      const content = response.choices[0].message.content
      const items = content.split('\n')
        .filter(line => line.trim().length > 0)
        .map(item => ({
          item: item.replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, ''),
          completed: false
        }))

      return items.slice(0, 8) // Limit to 8 items
    } catch (error) {
      console.error('OpenAI API error:', error)
      return this.generateMockChecklist()
    }
  }

  async analyzeImageForSpecs(imageFile) {
    try {
      // Convert image to base64
      const base64Image = await this.fileToBase64(imageFile)
      
      const response = await this.client.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this diamond image or certificate and extract the following specifications if visible: carat weight, cut, color grade, clarity grade, measurements, and any other relevant details. If this is a certificate, read all the technical specifications. Return the data in JSON format.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 500
      })

      const content = response.choices[0].message.content
      try {
        return JSON.parse(content)
      } catch {
        // If not valid JSON, return parsed text
        return { analysis: content }
      }
    } catch (error) {
      console.error('Image analysis error:', error)
      throw new Error('Failed to analyze image. Please try entering details manually.')
    }
  }

  async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const base64 = reader.result.split(',')[1]
        resolve(base64)
      }
      reader.onerror = error => reject(error)
    })
  }

  // Fallback methods for when API is unavailable
  generateMockNegotiationScript(diamond, valuationResults) {
    return `Based on our analysis of your ${diamond.carat}ct ${diamond.cut} diamond, here's your negotiation strategy:

**Opening Statement:**
"I've done extensive research on this diamond and similar ones in the current market. While I'm interested, I have some concerns about the pricing relative to comparable stones."

**Key Negotiation Points:**
1. **Market Comparison**: "Comparable diamonds are currently selling for $${valuationResults.priceRange.min.toLocaleString()} - $${valuationResults.priceRange.max.toLocaleString()}. This listing is ${valuationResults.isOverpriced ? 'above' : 'within'} that range."

2. **Quality Considerations**: "The ${diamond.color} color grade and ${diamond.clarity} clarity, while good, show some characteristics that affect the stone's value."

3. **Closing Strategy**: "I'm prepared to make a decision today if we can work on the pricing. My research shows a fair price would be around $${Math.round(valuationResults.fairMarketValue * 0.9).toLocaleString()}."

**Alternative Approach:**
If they won't negotiate on price, ask for additional services like free setting, extended warranty, or professional cleaning service.`
  }

  generateMockChecklist() {
    return [
      { item: 'Verify all diamond specifications match the listing', completed: false },
      { item: 'Ask for recent comparable sales in their inventory', completed: false },
      { item: 'Request to see the diamond under different lighting conditions', completed: false },
      { item: 'Inquire about their return/exchange policy', completed: false },
      { item: 'Get all agreements in writing before payment', completed: false },
      { item: 'Ask about certification authenticity verification', completed: false },
      { item: 'Research the jeweler\'s reputation and reviews', completed: false },
      { item: 'Prepare your maximum budget and walk-away price', completed: false }
    ]
  }
}

export default new OpenAIService()
