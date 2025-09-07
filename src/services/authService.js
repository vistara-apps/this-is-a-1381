// Authentication Service
import apiService from './api.js'

class AuthService {
  constructor() {
    this.currentUser = null
    this.token = localStorage.getItem('authToken')
    this.refreshToken = localStorage.getItem('refreshToken')
  }

  async login(email, password) {
    try {
      const response = await apiService.post('/auth/login', {
        email,
        password
      })

      if (response.success) {
        this.setAuthData(response.user, response.token, response.refreshToken)
        return { success: true, user: response.user }
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      throw new Error('Invalid email or password')
    }
  }

  async register(userData) {
    try {
      const response = await apiService.post('/auth/register', {
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName
      })

      if (response.success) {
        this.setAuthData(response.user, response.token, response.refreshToken)
        return { success: true, user: response.user }
      } else {
        throw new Error(response.message || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
      throw new Error('Registration failed. Please try again.')
    }
  }

  async logout() {
    try {
      if (this.token) {
        await apiService.post('/auth/logout', {
          refreshToken: this.refreshToken
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      this.clearAuthData()
    }
  }

  async refreshAuthToken() {
    try {
      if (!this.refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await apiService.post('/auth/refresh', {
        refreshToken: this.refreshToken
      })

      if (response.success) {
        this.setAuthData(response.user, response.token, response.refreshToken)
        return response.token
      } else {
        throw new Error('Token refresh failed')
      }
    } catch (error) {
      console.error('Token refresh error:', error)
      this.clearAuthData()
      throw error
    }
  }

  async getCurrentUser() {
    try {
      if (!this.token) {
        return null
      }

      const response = await apiService.get('/auth/me')
      
      if (response.success) {
        this.currentUser = response.user
        return response.user
      } else {
        throw new Error('Failed to get current user')
      }
    } catch (error) {
      console.error('Get current user error:', error)
      this.clearAuthData()
      return null
    }
  }

  async updateProfile(userData) {
    try {
      const response = await apiService.put('/auth/profile', userData)
      
      if (response.success) {
        this.currentUser = { ...this.currentUser, ...response.user }
        return { success: true, user: this.currentUser }
      } else {
        throw new Error(response.message || 'Profile update failed')
      }
    } catch (error) {
      console.error('Profile update error:', error)
      throw new Error('Failed to update profile')
    }
  }

  async changePassword(currentPassword, newPassword) {
    try {
      const response = await apiService.post('/auth/change-password', {
        currentPassword,
        newPassword
      })

      if (response.success) {
        return { success: true, message: 'Password changed successfully' }
      } else {
        throw new Error(response.message || 'Password change failed')
      }
    } catch (error) {
      console.error('Password change error:', error)
      throw new Error('Failed to change password')
    }
  }

  async requestPasswordReset(email) {
    try {
      const response = await apiService.post('/auth/forgot-password', {
        email
      })

      if (response.success) {
        return { success: true, message: 'Password reset email sent' }
      } else {
        throw new Error(response.message || 'Password reset request failed')
      }
    } catch (error) {
      console.error('Password reset request error:', error)
      throw new Error('Failed to send password reset email')
    }
  }

  async resetPassword(token, newPassword) {
    try {
      const response = await apiService.post('/auth/reset-password', {
        token,
        newPassword
      })

      if (response.success) {
        return { success: true, message: 'Password reset successfully' }
      } else {
        throw new Error(response.message || 'Password reset failed')
      }
    } catch (error) {
      console.error('Password reset error:', error)
      throw new Error('Failed to reset password')
    }
  }

  async verifyEmail(token) {
    try {
      const response = await apiService.post('/auth/verify-email', {
        token
      })

      if (response.success) {
        if (this.currentUser) {
          this.currentUser.emailVerified = true
        }
        return { success: true, message: 'Email verified successfully' }
      } else {
        throw new Error(response.message || 'Email verification failed')
      }
    } catch (error) {
      console.error('Email verification error:', error)
      throw new Error('Failed to verify email')
    }
  }

  setAuthData(user, token, refreshToken) {
    this.currentUser = user
    this.token = token
    this.refreshToken = refreshToken

    localStorage.setItem('authToken', token)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('userId', user.id)
    localStorage.setItem('userEmail', user.email)
  }

  clearAuthData() {
    this.currentUser = null
    this.token = null
    this.refreshToken = null

    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userId')
    localStorage.removeItem('userEmail')
  }

  isAuthenticated() {
    return !!this.token && !!this.currentUser
  }

  getToken() {
    return this.token
  }

  getUser() {
    return this.currentUser
  }

  // Mock methods for development/testing
  async mockLogin(email, password) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = {
          id: 'mock_user_' + Date.now(),
          email,
          firstName: 'John',
          lastName: 'Doe',
          emailVerified: true,
          subscriptionStatus: 'free',
          createdAt: new Date().toISOString()
        }

        const mockToken = 'mock_token_' + Date.now()
        const mockRefreshToken = 'mock_refresh_' + Date.now()

        this.setAuthData(mockUser, mockToken, mockRefreshToken)
        resolve({ success: true, user: mockUser })
      }, 1000)
    })
  }

  async mockRegister(userData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = {
          id: 'mock_user_' + Date.now(),
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          emailVerified: false,
          subscriptionStatus: 'free',
          createdAt: new Date().toISOString()
        }

        const mockToken = 'mock_token_' + Date.now()
        const mockRefreshToken = 'mock_refresh_' + Date.now()

        this.setAuthData(mockUser, mockToken, mockRefreshToken)
        resolve({ success: true, user: mockUser })
      }, 1000)
    })
  }
}

export default new AuthService()
