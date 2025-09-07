import React from 'react'
import { Check, Star } from 'lucide-react'
import { useUser } from '../context/UserContext'

const PricingPage = () => {
  const { user, updateSubscription } = useUser()

  const plans = [
    {
      name: 'Single Report',
      price: 29,
      description: 'Perfect for one-time diamond evaluation',
      features: [
        'Single diamond valuation report',
        'Market price analysis',
        'Quality assessment',
        'Basic negotiation tips',
        'Overpriced listing detection'
      ],
      buttonText: 'Get Report',
      popular: false
    },
    {
      name: 'Unlimited Access',
      price: 99,
      description: 'Best for serious diamond shoppers',
      features: [
        'Unlimited diamond valuations',
        'Advanced market analysis',
        'AI-powered negotiation scripts',
        'Ethical sourcing verification',
        'Priority customer support',
        'Historical price tracking',
        'Custom alerts for deals'
      ],
      buttonText: 'Start Subscription',
      popular: true
    }
  ]

  const handlePurchase = async (plan) => {
    if (plan.name === 'Unlimited Access') {
      // Simulate subscription purchase
      updateSubscription({
        plan: 'unlimited',
        status: 'active',
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      })
      alert('Subscription activated! You now have unlimited access.')
    } else {
      alert('Single report purchased! You can now get one valuation.')
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-white mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-gray-300">
          Save thousands on your diamond purchase with our expert analysis
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan, index) => (
          <div
            key={plan.name}
            className={`relative glass-effect rounded-lg p-8 ${
              plan.popular ? 'ring-2 ring-accent' : ''
            } animate-fade-in`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-accent text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                  <Star className="h-4 w-4 mr-1" />
                  Most Popular
                </div>
              </div>
            )}

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-gray-300 mb-4">{plan.description}</p>
              <div className="flex items-baseline justify-center">
                <span className="text-5xl font-bold text-accent">${plan.price}</span>
                {plan.name === 'Unlimited Access' && (
                  <span className="text-gray-300 ml-2">/month</span>
                )}
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start">
                  <Check className="h-5 w-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handlePurchase(plan)}
              className={`w-full py-4 px-6 rounded-md font-semibold text-lg transition-colors ${
                plan.popular
                  ? 'bg-accent hover:bg-accent/90 text-white'
                  : 'border border-accent text-accent hover:bg-accent hover:text-white'
              }`}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      {/* Value Proposition */}
      <div className="mt-16 text-center">
        <div className="glass-effect rounded-lg p-8 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-4">
            Why invest in diamond valuation?
          </h3>
          <p className="text-gray-300 mb-6">
            Our customers save an average of $2,500 per diamond purchase. 
            With expert analysis and negotiation strategies, you'll never overpay again.
          </p>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-accent mb-1">95%</div>
              <div className="text-sm text-gray-300">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent mb-1">$2.5K</div>
              <div className="text-sm text-gray-300">Avg. Savings</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent mb-1">10K+</div>
              <div className="text-sm text-gray-300">Diamonds Analyzed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PricingPage