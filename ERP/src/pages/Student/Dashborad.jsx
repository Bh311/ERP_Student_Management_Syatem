import React, { useEffect, useState } from "react";
import axios from "axios";
import Graph from "../../components/CommonComponent/Graph";
import Hero from "../../components/CommonComponent/HeroSection";
import {
  TrendingUp,
  BookOpen,
  CircleDollarSign,
  Hotel
} from "lucide-react";

export default function Dash() {
  const [dashboard, setDashboard] = useState(null);
  const [feePieData, setFeePieData] = useState([]);

  // -------------------------
  // FETCH DASHBOARD
  // -------------------------
  const fetchDashboard = async () => {
    try {
      const res = await axios.get("/api/student/dashboard/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setDashboard(res.data.data);
    } catch (err) {
      console.log("Dashboard error:", err);
    }
  };

  // -------------------------
  // HELPER: GET PAID AMOUNT
  // -------------------------
  const getPaidAmount = (transactions, feeType) => {
    return transactions
      .filter(
        txn => txn.feeType === feeType && txn.status === "Completed"
      )
      .reduce((sum, txn) => sum + txn.amount, 0);
  };

  // -------------------------
  // FETCH FEES → BREAKDOWN PIE
  // -------------------------
  const fetchFeePie = async () => {
    try {
      const res = await axios.get("/api/student/fees/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const { breakdown, transactions } = res.data.data;

const pieData = [
  {
    name: "Tuition",
    value:
      breakdown.tuition === 0
        ? getPaidAmount(transactions, "tuition")
        : breakdown.tuition,
    color: breakdown.tuition === 0 ? "#3B82F6" : "#EF4444", // blue / red
  },
  {
    name: "Hostel",
    value:
      breakdown.hostel === 0
        ? getPaidAmount(transactions, "hostel")
        : breakdown.hostel,
    color: breakdown.hostel === 0 ? "#3B82F6" : "#EF4444", // blue / red
  },
  {
    name: "Library",
    value:
      breakdown.library === 0
        ? getPaidAmount(transactions, "library")
        : breakdown.library,
    color: breakdown.library === 0 ? "#3B82F6" : "#EF4444", // blue / red
  },
].filter(item => item.value > 0);

// ⭐ avoid empty slices

      setFeePieData(pieData);
    } catch (err) {
      console.log("Fee pie error:", err);
    }
  };

  // -------------------------
  // LOAD DATA
  // -------------------------
  useEffect(() => {
    fetchDashboard();
    fetchFeePie();
  }, []);

  if (!dashboard) return null;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">

      {/* HERO CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <Hero
          title="Current CGPA"
          value={dashboard.cgpa}
          status="Excellent Performance"
          icon={<TrendingUp size={20} className="text-green-600" />}
          color="bg-green-100"
        />

        <Hero
          title="Current Semester"
          value={`Sem ${dashboard.currentSemester}`}
          status="Ongoing"
          icon={<BookOpen size={20} className="text-blue-600" />}
          color="bg-blue-100"
        />

   <Hero
  title="Pending Fees"
  value={new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(dashboard.pendingFees)}
  status={dashboard.pendingFees === 0 ? "All Clear!" : "Due"}
  icon={<CircleDollarSign size={20} className="text-green-600" />}
  color="bg-green-100"
/>


        <Hero
          title="Hostel Room"
          value={dashboard.hostel?.roomNumber || "—"}
          status={
            dashboard.hostel
              ? `Hostel ${dashboard.hostel.hostelNumber}`
              : "Not Assigned"
          }
          icon={<Hotel size={20} className="text-blue-600" />}
          color="bg-blue-100"
        />
      </div>

      {/* GRAPHS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

        <Graph
          data={dashboard.cgpaProgress}
          type="line"
          title="SGPA Progress"
        />

        <Graph
          data={feePieData}
          type="pie"
          title="Fee Breakdown Status"
        />

      </div>
    </div>
  );
}
