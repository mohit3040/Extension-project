import React from 'react';
import GoalSetter from './components/GoalSetter';
import Dashboard from './components/Dashboard';
import TrendChart from './components/TrendChart';

const App = () => {
  return (
    <div className="p-4 w-[400px] h-[600px]">
      <h1 className="text-xl font-bold mb-4">Productivity Tracker</h1>
      <GoalSetter />
      <Dashboard />
      <TrendChart />
    </div>
  );
};

export default App;
