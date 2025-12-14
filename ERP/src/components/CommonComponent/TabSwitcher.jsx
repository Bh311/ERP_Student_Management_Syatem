import React from 'react';

// The component now receives the active tab and a function to update it from the parent
export default function TabSwitcher({ tabs, activeTab, onTabChange }) {
  return (
    <div className="flex bg-gray-200 rounded-full p-1 w-full max-w-lg mx-auto">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`
            flex-1 px-4 py-2 text-sm font-semibold rounded-full
            transition-colors duration-200
            ${activeTab === tab ? 'bg-white shadow text-gray-800' : 'text-gray-600'}
          `}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}