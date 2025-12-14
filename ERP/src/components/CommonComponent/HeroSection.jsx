// Components/HeroSection.jsx
import React from "react";

export default function Hero({ title, value, status, icon, color, statusColor }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 flex justify-between items-center">
      {/* Left text content */}
      <div>
        <h3 className="text-sm text-gray-500">{title}</h3>
        <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        {status && (
          <p className={`text-sm mt-1 ${statusColor || "text-green-600"}`}>
            {status}
          </p>
        )}
      </div>

      {/* Right icon */}
      <div className={`p-3 rounded-xl ${color}`}>
        {icon}
      </div>
    </div>
  );
}
