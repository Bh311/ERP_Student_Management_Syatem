import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapPin, Users, Calendar } from "lucide-react";

export default function HostelDetails() {
  const [loading, setLoading] = useState(true);
  const [hostel, setHostel] = useState(null);

  const fetchHostelStatus = async () => {
    try {
      const res = await axios.get("/api/student/hostel/status", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setHostel(res.data.data);
    } catch (err) {
      console.error("Error fetching hostel status:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHostelStatus();
  }, []);

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (!hostel) return <p className="text-center text-gray-600">No hostel data found.</p>;

  // ❌ Not applied
  if (hostel.status === "Not Applied") {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Hostel Information</h2>
        <p className="text-gray-500">You have not applied for the hostel yet.</p>
      </div>
    );
  }

  // ⏳ Pending
  if (hostel.status === "Applied") {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Hostel Application Status</h2>
        <span className="bg-yellow-100 text-yellow-700 font-semibold text-xs px-2 py-1 rounded-full">
          Pending Approval
        </span>
        <p className="mt-4 text-gray-500">Your request is being reviewed by the warden.</p>
      </div>
    );
  }

  // ❌ Rejected
  if (hostel.status === "Rejected") {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Hostel Application Status</h2>
        <span className="bg-red-100 text-red-700 font-semibold text-xs px-2 py-1 rounded-full">
          Request Rejected
        </span>
        <p className="mt-4 text-gray-500">Your hostel request has been rejected.</p>
      </div>
    );
  }

  // 🟢 Room Assigned
  const fixedAmenities = ["WiFi", "Fan", "Study Table", "Laundry"];
  const roomNumber = hostel.roomNumber || "Not Assigned";

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Hostel Information</h2>
        <span className="bg-green-100 text-green-700 font-semibold text-xs px-2 py-1 rounded-full">
          Room Assigned
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* LEFT SIDE */}
        <div className="space-y-4">
          {/* ROOM NUMBER */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <MapPin size={24} className="text-blue-500" />
            <div>
              <p className="font-bold text-gray-800">
                Room {roomNumber}
              </p>
              <p className="text-sm text-gray-500">
                Block {hostel.hostelNumber}
              </p>
            </div>
          </div>

          {/* SHARING */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <Users size={24} className="text-blue-500" />
            <div>
              <p className="font-bold text-gray-800">Double Sharing</p>
              <p className="text-sm text-gray-500">2 Occupants</p>
            </div>
          </div>

          {/* RENT */}
          <div className="flex items-center space-x-4 p-4 bg-gray-100 rounded-lg">
            <Calendar size={24} className="text-blue-500" />
            <div>
              <p className="font-bold text-gray-700">Monthly Rent</p>
              <p className="text-sm text-gray-500">₹6000</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-4">

          {/* AMENITIES */}
          <div>
            <h3 className="font-bold text-gray-700 mb-2">Room Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {fixedAmenities.map((item, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
