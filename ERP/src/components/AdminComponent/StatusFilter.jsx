import React, { useState } from 'react';
import { SlidersHorizontal, ChevronDown, Check } from 'lucide-react';

// StatusFilter now receives props from its parent
export default function StatusFilter({ selectedOption, setSelectedOption }) {
  const [isOpen, setIsOpen] = useState(false);
  const options = ['All Status', 'Applied', 'Verified', 'Enrolled'];

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false); // Close the dropdown after selection
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center bg-gray-100 rounded-lg p-2 text-gray-700 hover:bg-gray-200 transition-colors"
      >
        <SlidersHorizontal size={20} className="mr-2" />
        <span>{selectedOption}</span>
        <ChevronDown size={20} className={`ml-2 transform transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 py-2">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className="flex items-center justify-between w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <span>{option}</span>
              {selectedOption === option && <Check size={16} className="text-blue-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}