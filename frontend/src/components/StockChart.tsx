'use client'

import { StockHistory } from '@/types/stock'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useTheme } from '@/context/ThemeContext'

interface StockChartProps {
  history: StockHistory
}

export default function StockChart({ history }: StockChartProps) {
  const { theme } = useTheme()
  
  const chartData = history.data.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    price: item.close,
  }))

  const colors = {
    line: theme === 'dark' ? '#fcfcfc' : '#02111b',
    grid: theme === 'dark' ? '#3f4045' : '#5d737e',
    text: theme === 'dark' ? '#fcfcfc' : '#3f4045',
  }

  return (
    <div className="bg-white dark:bg-shadow-grey rounded-2xl shadow-lg p-6 border border-blue-slate/20">
      <h3 className="text-2xl font-bold text-gunmetal dark:text-white mb-6">
        Price History ({history.period})
      </h3>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} opacity={0.3} />
          <XAxis 
            dataKey="date" 
            stroke={colors.text}
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke={colors.text}
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `$${value.toFixed(2)}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: theme === 'dark' ? '#30292f' : '#ffffff',
              border: '1px solid #5d737e',
              borderRadius: '8px',
              color: theme === 'dark' ? '#fcfcfc' : '#3f4045',
            }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
          />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#5d737e" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: '#5d737e' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
