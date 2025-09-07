import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const MarketChart = () => {
  // Mock market data for demonstration
  const data = [
    { month: 'Jan', price: 1200, volume: 120 },
    { month: 'Feb', price: 1180, volume: 135 },
    { month: 'Mar', price: 1220, volume: 142 },
    { month: 'Apr', price: 1195, volume: 158 },
    { month: 'May', price: 1240, volume: 167 },
    { month: 'Jun', price: 1225, volume: 174 },
    { month: 'Jul', price: 1260, volume: 189 },
    { month: 'Aug', price: 1245, volume: 195 },
    { month: 'Sep', price: 1280, volume: 201 },
    { month: 'Oct', price: 1295, volume: 218 },
    { month: 'Nov', price: 1310, volume: 225 },
    { month: 'Dec', price: 1325, volume: 234 }
  ]

  return (
    <div className="glass-effect rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">
          Lab-Grown Diamond Market Trends
        </h3>
        <p className="text-gray-300 text-sm">
          Average price per carat over the last 12 months
        </p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="month" 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              domain={['dataMin - 50', 'dataMax + 50']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
              formatter={(value, name) => [
                `$${value}`,
                name === 'price' ? 'Price per Carat' : 'Trading Volume'
              ]}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#06B6D4"
              strokeWidth={3}
              dot={{ fill: '#06B6D4', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#06B6D4', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-600">
        <div className="text-center">
          <div className="text-lg font-bold text-accent">+8.2%</div>
          <div className="text-xs text-gray-400">YoY Growth</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-accent">$1,325</div>
          <div className="text-xs text-gray-400">Current Avg.</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-accent">234</div>
          <div className="text-xs text-gray-400">Monthly Volume</div>
        </div>
      </div>
    </div>
  )
}

export default MarketChart