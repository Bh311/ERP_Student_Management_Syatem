import React, { useEffect, useState } from 'react';
import axios from "axios";
import {
  Users,
  CircleDollarSign,
  Hotel,
  FileText,
} from 'lucide-react';

import Hero from '../../components/CommonComponent/HeroSection';
import Graph from '../../components/CommonComponent/Graph';

export default function Ana() {

  // -------------------------
  // STATE VARIABLES
  // -------------------------
  const [pendingAdmissions, setPendingAdmissions] = useState(0);
  const [feesCollected, setFeesCollected] = useState(0);
  const [hostelOccupancy, setHostelOccupancy] = useState(0); // ⭐ NEW STATE

  const [admissionStats, setAdmissionStats] = useState({
    applied: 0,
    verified: 0,
    enrolled: 0,
    rejected: 0
  });

  // -------------------------
  // FETCH COMBINED Dashboard Stats
  // -------------------------
  const fetchDashboardData = async () => {
    try {
      const response = await axios.get("/api/admin/dashboard/combined-stats", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      const data = response.data.data;

      setPendingAdmissions(data.pendingReview);
      setFeesCollected(data.totalCollected);

    } catch (error) {
      console.log("Error fetching dashboard stats", error);
    }
  };

  // -------------------------
  // FETCH HOSTEL OCCUPANCY
  // -------------------------
  const fetchHostelStats = async () => {
    try {
      const res = await axios.get("/api/admin/hostels/stats", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      const percent = res.data.data.currentOccupancyPercent;
      setHostelOccupancy(percent);

    } catch (error) {
      console.log("Error fetching hostel stats", error);
    }
  };

  // -------------------------
  // FETCH ADMISSION PIE CHART DATA
  // -------------------------
  const fetchAdmissionStats = async () => {
    try {
      const response = await axios.get("/api/admin/admissions/dashboard/stats", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      const stats = response.data.data;

      setAdmissionStats({
        applied: stats.applied,
        verified: stats.verified,
        enrolled: stats.enrolled,
        rejected: stats.rejected
      });

    } catch (error) {
      console.log("Error fetching admission stats", error);
    }
  };

  // -------------------------
  // USE EFFECT
  // -------------------------
  useEffect(() => {
    fetchDashboardData();
    fetchAdmissionStats();
    fetchHostelStats(); // ⭐ DIRECT HOSTEL API CALL
  }, []);

  // -------------------------
  // GRAPH DATA
  // -------------------------
  const monthlyFeeData = [
    { name: 'Jan', value: 850000 },
    { name: 'Feb', value: 950000 },
    { name: 'Mar', value: 1050000 },
    { name: 'Apr', value: 1100000 },
    { name: 'May', value: 1200000 },
  ];

  const admissionStatusData = [
    { name: 'Applied', value: admissionStats.applied, color: '#3B82F6' },
    { name: 'Verified', value: admissionStats.verified, color: '#22C55E' },
    { name: 'Enrolled', value: admissionStats.enrolled, color: '#6B46C1' },
    { name: 'Rejected', value: admissionStats.rejected, color: '#EF4444' },
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
        <div className="flex items-center space-x-2 text-green-600 font-semibold text-sm">
          <span className="h-2 w-2 rounded-full bg-green-500"></span>
          <span>Live Data</span>
        </div>
      </div>

      {/* HERO CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">

        <Hero
          title="Pending Admissions"
          value={pendingAdmissions}
          status="+12% from yesterday"
          icon={<Users size={20} className="text-blue-600" />}
          color="bg-blue-100"
          statusColor="text-green-600"
        />

        <Hero
          title="Fees Collected"
          value={`₹${feesCollected.toLocaleString()}`}
          status="+8% from yesterday"
          icon={<CircleDollarSign size={20} className="text-green-600" />}
          color="bg-green-100"
          statusColor="text-green-600"
        />

        {/* ⭐ HOSTEL OCCUPANCY LIVE */}
        <Hero
          title="Hostel Occupancy"
          value={`${hostelOccupancy}%`}
          status="Live occupancy"
          icon={<Hotel size={20} className="text-orange-500" />}
          color="bg-orange-100"
        />

        <Hero
          title="Exam Uploads"
          value="42"
          status="3 pending review"
          icon={<FileText size={20} className="text-purple-600" />}
          color="bg-purple-100"
          statusColor="text-blue-500"
        />
      </div>

      {/* GRAPHS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Graph data={monthlyFeeData} type="line" title="Monthly Fee Collection" />
        <Graph data={admissionStatusData} type="pie" title="Admission Status Distribution" />
      </div>
    </div>
  );
}
