import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Diamond, Menu, X, User } from 'lucide-react'
import { useUser } from '../context/UserContext'

const AppShell = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const location = useLocation()
  const { user, logout } = useUser()

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Get Valuation', href: '/valuation' },
    { name: 'Pricing', href: '/pricing' },
  ]

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Diamond className="h-8 w-8 text-accent" />
              <span className="text-xl font-bold text-white">DiamondPrice Compass</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-base font-medium transition-colors ${
                    location.pathname === item.href
                      ? 'text-accent'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-white text-sm">Hi, {user.email}</span>
                  <button
                    onClick={logout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors">
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white p-2"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 glass-effect">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 text-base font-medium transition-colors ${
                    location.pathname === item.href
                      ? 'text-accent'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="relative z-10">
        {children}
      </main>
    </div>
  )
}

export default AppShell