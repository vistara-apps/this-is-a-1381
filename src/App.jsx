import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import AppShell from './components/AppShell'
import HomePage from './pages/HomePage'
import ValuationPage from './pages/ValuationPage'
import PricingPage from './pages/PricingPage'
import { UserProvider } from './context/UserContext'

function App() {
  return (
    <UserProvider>
      <div className="min-h-screen gradient-bg">
        <AppShell>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/valuation" element={<ValuationPage />} />
            <Route path="/pricing" element={<PricingPage />} />
          </Routes>
        </AppShell>
      </div>
    </UserProvider>
  )
}

export default App