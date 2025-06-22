// chart.js
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Chart = ({ colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#F97316'] }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/chart');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setChartData(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching chart data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  if (loading) {
    return (
      <div className="ml-tracker-card ml-tracker-chart-column">
        <h2 className="ml-tracker-section-title ml-tracker-chart-title">
          Research Trends
        </h2>
        <div className="ml-tracker-chart-container">
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400">Loading chart data...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ml-tracker-card ml-tracker-chart-column">
        <h2 className="ml-tracker-section-title ml-tracker-chart-title">
          Research Trends
        </h2>
        <div className="ml-tracker-chart-container">
          <div className="flex items-center justify-center h-full">
            <div className="text-red-400">Error loading chart: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  // Get all keys except 'date' to create dynamic lines
  const dataKeys = chartData && chartData.length > 0 
    ? Object.keys(chartData[0]).filter(key => key !== 'date')
    : [];

  return (
    <div className="ml-tracker-card ml-tracker-chart-column">
      <h2 className="ml-tracker-section-title ml-tracker-chart-title">
        Research Trends
      </h2>
      <div className="ml-tracker-chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF"
              fontSize={12}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              label={{ value: 'Papers Published', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: 'white'
              }}
            />
            <Legend />
            {dataKeys.map((keyword, index) => (
              <Line 
                key={keyword}
                type="monotone" 
                dataKey={keyword} 
                stroke={colors[index % colors.length]}
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;