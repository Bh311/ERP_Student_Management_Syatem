import React, { useEffect, useState } from "react";
import axios from "axios";
import Graph from "../../components/CommonComponent/Graph";
import Hero from "../../components/CommonComponent/HeroSection";
import { TrendingUp, CheckCircle, CircleDollarSign, Hotel } from "lucide-react";

export default function Dash() {
  const [dashboard, setDashboard] = useState(null);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get("/api/student/dashboard", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setDashboard(res.data.data);
    } catch (err) {
      console.log("Dashboard error:", err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (!dashboard) return null;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <Hero
          title="Current CGPA"
          value={dashboard.cgpa}
          status="Excellent Performance"
          icon={<TrendingUp size={20} className="text-green-600" />}
          color="bg-green-100"
        />

        <Hero
          title="Attendance"
          value={`${dashboard.attendance.percentage}%`}
          icon={<CheckCircle size={20} className="text-blue-600" />}
          color="bg-blue-100"
        />

        <Hero
          title="Pending Fees"
          value={`₹${dashboard.pendingFees}`}
          status={dashboard.pendingFees === 0 ? "All Clear!" : "Due"}
          icon={<CircleDollarSign size={20} className="text-green-600" />}
          color="bg-green-100"
        />

        <Hero
          title="Hostel Room"
          value={dashboard.hostel?.roomNumber || "—"}
          status={dashboard.hostel ? dashboard.hostel.hostelNumber : "Not Assigned"}
          icon={<Hotel size={20} className="text-blue-600" />}
          color="bg-blue-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Graph data={dashboard.cgpaProgress} type="line" title="SGPA Progress" />
        <Graph data={dashboard.attendance.monthly} type="bar" title="Monthly Attendance" />
      </div>
    </div>
  );
}
