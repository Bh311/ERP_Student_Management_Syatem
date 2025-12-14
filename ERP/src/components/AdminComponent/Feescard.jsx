import React, { useState } from "react";
import axios from "axios";

export default function StudentFeeStatusCard({ student }) {
  const [showModal, setShowModal] = useState(false);
  const [feeDetails, setFeeDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  // Color badge by payment status
  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-600";
      case "Partial":
        return "bg-blue-100 text-blue-600";
      case "Unpaid":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // ✅ Handle View Button Click
  const handleView = async (studentMongoId) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/admin/fees/accounts/${studentMongoId}`);
      setFeeDetails(res.data.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching student account:", error);
      alert("Failed to load student account details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Student Fee Card */}
      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow mb-4 hover:shadow-md transition-all">
        {/* Left: Student Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-200 text-gray-700 font-bold">
            {student.initials}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {student.name}
            </h2>
            <p className="text-xs text-gray-400">
              {student.studentId} • {student.program}
            </p>
          </div>
        </div>

        {/* Center: Fee Info */}
        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-end text-right">
            <span className="font-semibold text-gray-800">
              Total: {student.totalFees}
            </span>
            <span className="text-sm text-gray-500">
              Paid: {student.paidFees}
            </span>
            <span className="text-sm text-red-500">
              Pending: {student.pendingFees}
            </span>
          </div>

          <div className="w-24 bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${
                student.status === "Paid"
                  ? "bg-green-500"
                  : student.status === "Partial"
                  ? "bg-blue-500"
                  : "bg-red-500"
              }`}
              style={{ width: student.progress }}
            ></div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
              student.status
            )}`}
          >
            {student.status}
          </span>
        </div>

        {/* Right: View Button */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleView(student.accountId)}
            className="flex items-center justify-center px-4 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            {loading ? "Loading..." : "View"}
          </button>
        </div>
      </div>

      {/* ✅ Modal (Popup Form) */}
      {showModal && feeDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg relative">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {student.name} — Fee Details
            </h2>

            {/* Fee Details Form */}
          {/* Fee Details Form */}
{/* Replaced grid-cols-2 with grid-cols-3 for a cleaner, balanced layout on larger screens */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
    {/* Tuition Fee */}
    <div className="flex flex-col bg-gray-50 p-3 rounded-lg border border-gray-200">
        <label className="block text-xs font-medium text-gray-500 mb-1">Tuition Fee</label>
        <p className="text-lg font-semibold text-gray-900">
            {/* Format value here, assuming you have a formatCurrency function available */}
            ₹{Number(feeDetails.breakdown.tuition).toLocaleString('en-IN')}
        </p>
    </div>

    {/* Hostel Fee */}
    <div className="flex flex-col bg-gray-50 p-3 rounded-lg border border-gray-200">
        <label className="block text-xs font-medium text-gray-500 mb-1">Hostel Fee</label>
        <p className="text-lg font-semibold text-gray-900">
            ₹{Number(feeDetails.breakdown.hostel).toLocaleString('en-IN')}
        </p>
    </div>

    {/* Library Fee */}
    <div className="flex flex-col bg-gray-50 p-3 rounded-lg border border-gray-200">
        <label className="block text-xs font-medium text-gray-500 mb-1">Library Fee</label>
        <p className="text-lg font-semibold text-gray-900">
            ₹{Number(feeDetails.breakdown.library).toLocaleString('en-IN')}
        </p>
    </div>
</div>

{/* Main Summary Row (Balance, Paid, Total) */}
<div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t pt-4">
    {/* Total Fee */}
    <div className="flex flex-col bg-blue-50 p-3 rounded-lg border border-blue-200">
        <label className="block text-xs font-medium text-blue-800 mb-1">Total Fee</label>
        <p className="text-xl font-extrabold text-blue-600">
            ₹{Number(feeDetails.totalFee).toLocaleString('en-IN')}
        </p>
    </div>

    {/* Paid */}
    <div className="flex flex-col bg-green-50 p-3 rounded-lg border border-green-200">
        <label className="block text-xs font-medium text-green-800 mb-1">Paid</label>
        <p className="text-xl font-extrabold text-green-600">
            ₹{Number(feeDetails.paid).toLocaleString('en-IN')}
        </p>
    </div>

    {/* Balance */}
    <div className="flex flex-col bg-red-50 p-3 rounded-lg border border-red-200">
        <label className="block text-xs font-medium text-red-800 mb-1">Balance Due</label>
        <p className="text-xl font-extrabold text-red-600">
            ₹{Number(feeDetails.balance).toLocaleString('en-IN')}
        </p>
    </div>
</div>

{/* Status and Due Date Row */}
<div className="grid grid-cols-2 gap-4 border-t pt-4">
    {/* Status */}
    <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold inline-block w-fit ${getStatusColor(feeDetails.status)}`}>
            {feeDetails.status}
        </span>
    </div>

    {/* Due Date */}
    <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-600 mb-1">Due Date</label>
        <p className="text-lg font-semibold text-gray-900">
            {new Date(feeDetails.dueDate).toLocaleDateString()}
        </p>
    </div>
</div>

            {/* Close Button */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
