import React from 'react'
import { Link } from 'react-router-dom'
import { Diamond, Shield, TrendingUp, Users } from 'lucide-react'
import MarketChart from '../components/MarketChart'

const HomePage = () => {
  const features = [
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Instant Valuation Report",
      description: "Get real-time market valuations for any lab-grown diamond with comprehensive quality assessments."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Overpriced Listing Alerts",
      description: "Automatically detect overpriced diamonds and get alerts when listings exceed fair market value."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Negotiation Scripts",
      description: "AI-powered negotiation strategies and checklists tailored to specific diamonds and market conditions."
    },
    {
      icon: <Diamond className="h-8 w-8" />,
      title: "Ethical Sourcing Verification",
      description: "Verify the ethical origin and traceability of diamonds with comprehensive sourcing records."
    }
  ]

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl font-bold text-white tracking-tight">
              Navigate the diamond market with confidence
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Get instant, transparent pricing and valuation for lab-grown diamonds. 
              Make informed decisions and never overpay again.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/valuation"
                className="bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-md font-semibold text-lg transition-colors text-center"
              >
                Start Free Valuation
              </Link>
              <Link
                to="/pricing"
                className="border border-white/20 text-white hover:bg-white/10 px-8 py-4 rounded-md font-semibold text-lg transition-colors text-center"
              >
                View Pricing
              </Link>
            </div>
          </div>
          
          <div className="lg:pl-12">
            <MarketChart />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Everything you need to buy diamonds smart
          </h2>
          <p className="text-xl text-gray-300">
            Comprehensive tools to evaluate, negotiate, and purchase lab-grown diamonds
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-effect rounded-lg p-6 hover:bg-white/20 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-accent mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="glass-effect rounded-lg p-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-accent mb-2">$2,500</div>
              <div className="text-gray-300">Average savings per purchase</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">95%</div>
              <div className="text-gray-300">Accuracy in valuations</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">10,000+</div>
              <div className="text-gray-300">Diamonds analyzed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage