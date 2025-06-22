import React, { useState, useEffect } from 'react';

const GoalSetter = () => {
  const [goal, setGoal] = useState('');

  useEffect(() => {
    chrome.storage.local.get(['dailyGoal'], (res) => {
      setGoal(res.dailyGoal || '');
    });
  }, []);

  const saveGoal = () => {
    chrome.storage.local.set({ dailyGoal: goal });
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium">Daily Goal (in minutes)</label>
      <input
        type="number"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        className="border px-2 py-1 rounded w-full mt-1"
      />
      <button
        className="mt-2 bg-blue-600 text-white px-3 py-1 rounded w-full"
        onClick={saveGoal}
      >
        Save Goal
      </button>
    </div>
  );
};

export default GoalSetter;

