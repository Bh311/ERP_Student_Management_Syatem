import React, { useState } from "react";
import { Download, FileText } from "lucide-react";
import axios from "axios";

export default function ReceiptsContent({ transactions = [] }) {
  const [downloading, setDownloading] = useState(null);

  const receiptsList = transactions.map((txn) => ({
    id: txn.receiptId,
    title: `${txn.feeType.charAt(0).toUpperCase() + txn.feeType.slice(1)} Fee Receipt`,
    date: new Date(txn.date).toLocaleDateString("en-CA"), // yyyy-mm-dd format
    amount: `₹${txn.amount.toLocaleString("en-IN")}`,
  }));

  const handleDownload = async (receiptId) => {
    setDownloading(receiptId);
    try {
      const response = await axios.get(`/api/student/fees/receipt/${receiptId}/download`, {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Receipt_${receiptId}.pdf`;
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download receipt.");
    } finally {
      setDownloading(null);
    }
  };

  if (receiptsList.length === 0) {
    return (
      <div className="p-8 bg-white rounded-xl shadow text-center text-gray-500 mt-6">
        No receipts found. Make a successful payment to view them here.
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 rounded-xl shadow-sm mt-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Receipts</h2>
      <div className="space-y-4">
        {receiptsList.map((receipt) => (
          <div
            key={receipt.id}
            className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
          >
            {/* Left section */}
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 p-3 rounded-xl">
                <FileText className="text-green-500" size={22} />
              </div>
              <div>
                <h3 className="text-gray-900 font-medium">{receipt.title}</h3>
                <p className="text-sm text-gray-500">
                  Paid on {receipt.date}
                </p>
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-6">
              <span className="text-gray-900 font-semibold text-lg">
                {receipt.amount}
              </span>
              <button
                onClick={() => handleDownload(receipt.id)}
                disabled={downloading === receipt.id}
                className="flex items-center space-x-2 px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition disabled:opacity-70"
              >
                {downloading === receipt.id ? (
                  <>
                    <Download className="animate-spin" size={16} />
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    <span>Download</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
