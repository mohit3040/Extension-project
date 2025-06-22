import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadData = () => {
      chrome.storage.local.get(null, (items) => {
        const entries = Object.entries(items)
          .filter(([key]) => key !== 'dailyGoal')
          .map(([domain, time]) => ({
            domain,
            minutes: Math.round(time / 60000),
          }));
        setData(entries);
      });
    };

    loadData(); // Load initially
    const interval = setInterval(loadData, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval); // Clean up interval
  }, []);

  return (
    <div className="mb-4">
      <h2 className="font-semibold mb-2">Today's Usage</h2>
      {data.length > 0 ? (
        data.map((entry) => (
          <div key={entry.domain} className="flex justify-between text-sm">
            <span>{entry.domain}</span>
            <span>{entry.minutes} min</span>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">No data yet</p>
      )}
    </div>
  );
};

export default Dashboard;
