// Pinata IPFS Service for File Storage
class PinataService {
  constructor() {
    this.apiKey = import.meta.env.VITE_PINATA_API_KEY
    this.secretKey = import.meta.env.VITE_PINATA_SECRET_KEY
    this.baseURL = 'https://api.pinata.cloud'
  }

  async uploadFile(file) {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const metadata = JSON.stringify({
        name: `diamond-image-${Date.now()}`,
        keyvalues: {
          uploadedBy: 'DiamondPriceCompass',
          timestamp: new Date().toISOString(),
          fileType: file.type
        }
      })
      formData.append('pinataMetadata', metadata)

      const options = JSON.stringify({
        cidVersion: 0,
      })
      formData.append('pinataOptions', options)

      const response = await fetch(`${this.baseURL}/pinning/pinFileToIPFS`, {
        method: 'POST',
        headers: {
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.secretKey,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      return {
        success: true,
        ipfsHash: result.IpfsHash,
        pinSize: result.PinSize,
        timestamp: result.Timestamp,
        url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
      }
    } catch (error) {
      console.error('Pinata upload error:', error)
      throw new Error('Failed to upload file to IPFS')
    }
  }

  async uploadJSON(jsonData) {
    try {
      const response = await fetch(`${this.baseURL}/pinning/pinJSONToIPFS`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.secretKey,
        },
        body: JSON.stringify({
          pinataContent: jsonData,
          pinataMetadata: {
            name: `diamond-data-${Date.now()}`,
            keyvalues: {
              uploadedBy: 'DiamondPriceCompass',
              timestamp: new Date().toISOString(),
              dataType: 'diamond-specifications'
            }
          }
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      return {
        success: true,
        ipfsHash: result.IpfsHash,
        pinSize: result.PinSize,
        timestamp: result.Timestamp,
        url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
      }
    } catch (error) {
      console.error('Pinata JSON upload error:', error)
      throw new Error('Failed to upload data to IPFS')
    }
  }

  async unpinFile(ipfsHash) {
    try {
      const response = await fetch(`${this.baseURL}/pinning/unpin/${ipfsHash}`, {
        method: 'DELETE',
        headers: {
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.secretKey,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return { success: true, message: 'File unpinned successfully' }
    } catch (error) {
      console.error('Pinata unpin error:', error)
      throw new Error('Failed to unpin file from IPFS')
    }
  }

  async listFiles(options = {}) {
    try {
      const queryParams = new URLSearchParams({
        status: 'pinned',
        pageLimit: options.limit || 10,
        pageOffset: options.offset || 0,
        ...options
      })

      const response = await fetch(`${this.baseURL}/data/pinList?${queryParams}`, {
        method: 'GET',
        headers: {
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.secretKey,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Pinata list files error:', error)
      throw new Error('Failed to list files from IPFS')
    }
  }

  async getFileMetadata(ipfsHash) {
    try {
      const response = await fetch(`${this.baseURL}/data/pinList?hashContains=${ipfsHash}`, {
        method: 'GET',
        headers: {
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.secretKey,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result.rows[0] || null
    } catch (error) {
      console.error('Pinata metadata error:', error)
      throw new Error('Failed to get file metadata from IPFS')
    }
  }

  async testAuthentication() {
    try {
      const response = await fetch(`${this.baseURL}/data/testAuthentication`, {
        method: 'GET',
        headers: {
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.secretKey,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result.message === 'Congratulations! You are communicating with the Pinata API!'
    } catch (error) {
      console.error('Pinata auth test error:', error)
      return false
    }
  }

  // Utility method to get IPFS URL
  getIPFSUrl(hash) {
    return `https://gateway.pinata.cloud/ipfs/${hash}`
  }

  // Mock method for development when API keys are not available
  async mockUploadFile(file) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockHash = 'Qm' + Math.random().toString(36).substring(2, 15)
        resolve({
          success: true,
          ipfsHash: mockHash,
          pinSize: file.size,
          timestamp: new Date().toISOString(),
          url: `https://gateway.pinata.cloud/ipfs/${mockHash}`
        })
      }, 1500)
    })
  }

  async mockUploadJSON(jsonData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockHash = 'Qm' + Math.random().toString(36).substring(2, 15)
        resolve({
          success: true,
          ipfsHash: mockHash,
          pinSize: JSON.stringify(jsonData).length,
          timestamp: new Date().toISOString(),
          url: `https://gateway.pinata.cloud/ipfs/${mockHash}`
        })
      }, 1000)
    })
  }
}

export default new PinataService()
