import React from "react";
import { CheckCircle, Clock } from "lucide-react";

export default function PaymentHistoryContent({ transactions = [] }) {
  if (transactions.length === 0) {
    return (
      <div className="p-8 bg-white rounded-xl shadow text-center text-gray-500 mt-6">
        No payment history found.
      </div>
    );
  }

  return (
    <div className="p-6 m-3 bg-white rounded-xl shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Payment History</h2>

      <div className="space-y-4">
        {transactions.map((txn) => (
          <div
            key={txn.id}
            className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all"
          >
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <div
                className={`p-3 rounded-xl ${
                  txn.status === "Completed"
                    ? "bg-green-50 text-green-600"
                    : "bg-orange-50 text-orange-500"
                }`}
              >
                {txn.status === "Paid" ? (
                  <CheckCircle size={22} />
                ) : (
                  <Clock size={22} />
                )}
              </div>

              <div>
                <h3 className="text-gray-900 font-semibold text-lg">
                  {txn.feeType}
                </h3>
                <p className="text-sm text-gray-500">
                  {txn.status === "Completed"
                    ? `Paid on ${new Date(txn.date).toLocaleDateString("en-CA")}`
                    : `Due: ${new Date(txn.dueDate).toLocaleDateString("en-CA")}`}
                </p>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex flex-col items-end space-y-1">
              <span className="text-gray-900 font-bold text-lg">
                ₹{txn.amount.toLocaleString("en-IN")}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  txn.status === "Paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {txn.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
