import React from 'react';
import { Settings } from 'lucide-react';

export default function Sidebar({ menuItems, activeItem, setActiveItem }) {
  const bottomMenuItem = { id: 'settings', label: 'Settings', icon: Settings };

  // Function to determine if a sub-item is active
  const isSubItemActive = (parentId) => {
    return activeItem.startsWith(parentId);
  };

  return (
    <div className="flex flex-col h-screen bg-white shadow-lg w-60">
      <div className="flex-grow pt-8">
        {menuItems.map((item) => (
          <div key={item.id}>
            {/* Primary Menu Item Button */}
            <button
              onClick={() => setActiveItem(item.id)}
              className={`
                flex items-center w-full py-3 px-6 mb-2 text-gray-700
                focus:outline-none transition-all duration-200
                ${isSubItemActive(item.id) || activeItem === item.id 
                  ? 'bg-green-400 text-white rounded-r-full hover:bg-green-400'
                  : 'hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              <item.icon
                className={`mr-3 h-5 w-5 ${isSubItemActive(item.id) || activeItem === item.id ? 'text-white' : 'text-gray-500'}`}
              />
              <span className="font-medium">{item.label}</span>
            </button>

            {/* Conditional Sub-Menu Rendering */}
            {/* Show sub-items if the current item is 'manage-fees' and is active */}
            {item.id === 'manage-fees' && isSubItemActive(item.id) && (
              <div className="pl-12 space-y-1 pb-2">
                {/* Dynamically create the sub-menu item */}
                <button
                  onClick={() => setActiveItem('manage-fees-create')} 
                  className={`
                    w-full py-2 text-sm text-left transition-colors duration-150
                    ${activeItem === 'manage-fees-create' 
                        ? 'text-green-600 font-semibold' // Active sub-item style
                        : 'text-gray-600 hover:text-green-500' // Inactive sub-item style
                    }
                  `}
                >
                  Create Fee Structure
                </button>
                {/* You can add a button for a list view here: */}
                <button
                  onClick={() => setActiveItem('manage-fees')} 
                  className={`
                    w-full py-2 text-sm text-left transition-colors duration-150
                    ${activeItem === 'manage-fees' && !item.subItems // If 'manage-fees' itself is the active item (list view)
                        ? 'text-green-600 font-semibold'
                        : 'text-gray-600 hover:text-green-500'
                    }
                  `}
                >
                  View Structures
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Bottom Menu Item (Settings) - Remains outside the main map */}
      <div className="mt-auto py-4 border-t border-gray-100">
        <button
          onClick={() => setActiveItem(bottomMenuItem.id)}
          className={`
            flex items-center w-full py-3 px-6 text-gray-700
            focus:outline-none transition-all duration-200
            ${activeItem === bottomMenuItem.id 
              ? 'bg-green-400 text-white rounded-r-full hover:bg-green-400'
              : 'hover:bg-gray-100 hover:text-gray-900'}
          `}
        >
          <bottomMenuItem.icon
            className={`mr-3 h-5 w-5 ${activeItem === bottomMenuItem.id ? 'text-white' : 'text-gray-500'}`}
          />
          <span className="font-medium">{bottomMenuItem.label}</span>
        </button>
      </div>
    </div>
  );
}