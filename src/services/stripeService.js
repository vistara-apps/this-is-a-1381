// Stripe Service for Payment Processing
class StripeService {
  constructor() {
    this.publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    this.stripe = null
    this.initStripe()
  }

  async initStripe() {
    if (typeof window !== 'undefined' && window.Stripe) {
      this.stripe = window.Stripe(this.publishableKey)
    } else {
      // Dynamically load Stripe.js
      const script = document.createElement('script')
      script.src = 'https://js.stripe.com/v3/'
      script.onload = () => {
        this.stripe = window.Stripe(this.publishableKey)
      }
      document.head.appendChild(script)
    }
  }

  async createCheckoutSession(priceData) {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(priceData),
      })

      const session = await response.json()
      
      if (session.error) {
        throw new Error(session.error)
      }

      return session
    } catch (error) {
      console.error('Error creating checkout session:', error)
      throw error
    }
  }

  async redirectToCheckout(sessionId) {
    if (!this.stripe) {
      await this.waitForStripe()
    }

    const { error } = await this.stripe.redirectToCheckout({
      sessionId: sessionId,
    })

    if (error) {
      console.error('Stripe checkout error:', error)
      throw error
    }
  }

  async createSubscription(planType) {
    try {
      const priceData = {
        planType,
        mode: 'subscription',
        successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/pricing`,
      }

      const session = await this.createCheckoutSession(priceData)
      await this.redirectToCheckout(session.id)
    } catch (error) {
      console.error('Subscription creation error:', error)
      throw error
    }
  }

  async purchaseSingleReport() {
    try {
      const priceData = {
        planType: 'single_report',
        mode: 'payment',
        amount: 2900, // $29.00 in cents
        successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/pricing`,
      }

      const session = await this.createCheckoutSession(priceData)
      await this.redirectToCheckout(session.id)
    } catch (error) {
      console.error('Single report purchase error:', error)
      throw error
    }
  }

  async verifySession(sessionId) {
    try {
      const response = await fetch(`/api/verify-session/${sessionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const sessionData = await response.json()
      
      if (sessionData.error) {
        throw new Error(sessionData.error)
      }

      return sessionData
    } catch (error) {
      console.error('Session verification error:', error)
      throw error
    }
  }

  async cancelSubscription(subscriptionId) {
    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId }),
      })

      const result = await response.json()
      
      if (result.error) {
        throw new Error(result.error)
      }

      return result
    } catch (error) {
      console.error('Subscription cancellation error:', error)
      throw error
    }
  }

  async getSubscriptionStatus(customerId) {
    try {
      const response = await fetch(`/api/subscription-status/${customerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const status = await response.json()
      
      if (status.error) {
        throw new Error(status.error)
      }

      return status
    } catch (error) {
      console.error('Subscription status error:', error)
      throw error
    }
  }

  waitForStripe() {
    return new Promise((resolve) => {
      const checkStripe = () => {
        if (this.stripe) {
          resolve()
        } else {
          setTimeout(checkStripe, 100)
        }
      }
      checkStripe()
    })
  }

  // Mock methods for development/testing
  async mockPurchaseSingleReport() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          sessionId: 'mock_session_' + Date.now(),
          planType: 'single_report',
          amount: 2900
        })
      }, 1000)
    })
  }

  async mockCreateSubscription(planType) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          sessionId: 'mock_session_' + Date.now(),
          planType,
          subscriptionId: 'mock_sub_' + Date.now()
        })
      }, 1000)
    })
  }
}

export default new StripeService()
