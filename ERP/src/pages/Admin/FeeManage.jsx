import React, { useState, useEffect } from "react";
import { Search, RotateCw, CircleDollarSign } from "lucide-react";
import Hero from "../../components/CommonComponent/HeroSection";
import StudentFeeStatusCard from "../../components/AdminComponent/Feescard";
import FeeStructure from "../../components/AdminComponent/FeeStructures";

import axios from "axios";

export default function ManageFees() {
  const [heroData, setHeroData] = useState({
    totalCollected: "₹0",
    pendingAmount: "₹0",
    collectionRate: "0%",
    overdue: "0",
  });

  const [studentFeeData, setStudentFeeData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats
        const statsRes = await axios.get(`/api/admin/fees/stats`);
        const stats = statsRes.data.data;

        const formatCurrency = (amount) =>
          `₹${Number(amount).toLocaleString("en-IN")}`;

        setHeroData({
          totalCollected: formatCurrency(stats.totalCollected || 0),
          pendingAmount: formatCurrency(stats.totalPending || 0),
          collectionRate: `${stats.collectionRate || 0}%`,
          overdue: stats.overdue?.toString() || "0",
        });

        // Fetch student fee accounts
        const accountsRes = await axios.get(`/api/admin/fees/accounts`);
        const students = accountsRes.data.data;

        const formattedData = students
          .filter((s) => s.student)
          .map((s) => {
            const initials = s.student.fullname
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase();

            const formatCurrency = (amount) =>
              `₹${Number(amount).toLocaleString("en-IN")}`;

            const progress =
              s.totalFee > 0
                ? ((s.paid / s.totalFee) * 100).toFixed(0) + "%"
                : "0%";

            return {
              accountId: s.student._id,
              studentId: s.student.studentID,
              initials,
              name: s.student.fullname,
              program: s.student.academics.course,
              totalFees: formatCurrency(s.totalFee),
              paidFees: formatCurrency(s.paid),
              pendingFees: formatCurrency(s.balance),
              progress,
              status: s.status,
              image: s.student.profilePic?.url || "",
            };
          });

        setStudentFeeData(formattedData);
      } catch (error) {
        console.error("Error fetching fee data:", error);
      }
    };

    fetchData();
  }, []);

  const filteredStudents = studentFeeData.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Fee Management</h1>

        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-gray-100 rounded-lg p-2">
            <Search size={20} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none ml-2 text-gray-700 focus:outline-none"
            />
          </div>

          <button
            onClick={() => window.location.reload()}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700"
          >
            <RotateCw size={16} />
            <span>Sync Payments</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Hero
          title="Total Collected"
          value={heroData.totalCollected}
          status="+8% from last month"
          icon={<CircleDollarSign size={20} className="text-green-600" />}
          color="bg-green-100"
          statusColor="text-green-600"
        />

        <Hero
          title="Pending Amount"
          value={heroData.pendingAmount}
          status="Students with pending dues"
          icon={<CircleDollarSign size={20} className="text-orange-500" />}
          color="bg-orange-100"
          statusColor="text-gray-500"
        />

        <Hero
          title="Collection Rate"
          value={heroData.collectionRate}
          icon={<CircleDollarSign size={20} className="text-blue-600" />}
          color="bg-blue-100"
        />

        <Hero
          title="Overdue"
          value={heroData.overdue}
          status="Students unpaid"
          icon={<CircleDollarSign size={20} className="text-red-600" />}
          color="bg-red-100"
        />
      </div>

      {/* Student Fee Status Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Student Fee Status
        </h2>

        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <StudentFeeStatusCard key={student.accountId} student={student} />
          ))
        ) : (
          <p className="text-gray-600">No students found.</p>
        )}
      </div>

  
   {/* Fee Structures (Course Fees) */}
<div className="mt-10">
  <h2 className="text-xl font-bold text-gray-800 mb-4">Academic Fee Structures</h2>
  <FeeStructure />
</div>


    </div>
  );
}
