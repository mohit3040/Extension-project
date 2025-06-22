import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const TrendChart = ({ data }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10); // e.g., '2025-06-14'

    const dailyData = Object.entries(data)
      .filter(([key]) => key.endsWith(today))
      .map(([key, value]) => {
        const domain = key.replace(`_${today}`, '');
        return {
          name: domain,
          minutes: Math.round(value / 60000), // convert ms to minutes
        };
      })
      .filter(entry => entry.minutes > 0)
      .sort((a, b) => b.minutes - a.minutes); // optional: sort by time descending

    setChartData(dailyData);
  }, [data]);

  return (
    <div style={{ width: '100%', height: 300 }}>
      <h2>Productivity Chart (Today)</h2>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey="minutes" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p>No chart data yet</p>
      )}
    </div>
  );
};

export default TrendChart;
