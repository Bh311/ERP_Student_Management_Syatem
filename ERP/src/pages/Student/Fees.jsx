import React, { useState, useEffect } from "react";
import Hero from "../../components/CommonComponent/HeroSection";
import TabSwitcher from "../../components/CommonComponent/TabSwitcher";
import ReceiptsContent from "../../components/StudentComponent/Receipts";
import PaymentHistoryContent from "../../components/StudentComponent/PaymentHistory";
import { DollarSign, CheckCircle, Clock } from "lucide-react";
import axios from "axios";

/* ---------------- Fee Item ---------------- */
function FeeItem({ fee, onPay }) {
  const displayAmount = `₹${fee.rawAmount.toLocaleString("en-IN")}`;

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm ">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
          <DollarSign size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{fee.title}</h3>
          <p className="text-sm text-gray-500">Due: {fee.dueDate}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <span className="font-semibold">{displayAmount}</span>

        <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-600">
          Pending
        </span>

        <button
          onClick={() => onPay(fee)}
          className="px-4 py-1.5 text-sm bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Pay
        </button>
      </div>
    </div>
  );
}

/* ---------------- Razorpay Loader ---------------- */
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

/* ---------------- Main Component ---------------- */
export default function FeesContent() {
  const tabs = ["Payment History", "Receipts"];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [feeData, setFeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [razorpayReady, setRazorpayReady] = useState(false);

  /* ---------------- Fetch Data ---------------- */
  useEffect(() => {
    const init = async () => {
      await loadRazorpayScript();
      setRazorpayReady(true);

      const res = await axios.get("/api/student/fees/");
      setFeeData(res.data.data);
      setLoading(false);
    };
    init();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  const feesCleared = feeData.balance === 0;

  /* ---------------- Outstanding Fees ---------------- */
  const outstandingFees = [];
  Object.keys(feeData.breakdown || {}).forEach((type) => {
    if (feeData.breakdown[type] > 0) {
      outstandingFees.push({
        id: type,
        title: type.charAt(0).toUpperCase() + type.slice(1) + " Fee",
        rawAmount: feeData.breakdown[type],
        dueDate: new Date(feeData.dueDate).toLocaleDateString("en-IN"),
      });
    }
  });

  /* ---------------- PAY HANDLER ---------------- */
  const handlePayFee = async (fee) => {
    if (!razorpayReady || !window.Razorpay) {
      alert("Payment system not ready");
      return;
    }

    try {
      // Create order
      const res = await axios.post("/api/student/fees/pay", {
        amount: fee.rawAmount,
        feeType: fee.id,
      });

      const options = {
        key: "rzp_test_RIyYm76qOKiBkK",
        amount: res.data.amount,
        currency: "INR",
        name: "University Fee Payment",
        description: fee.title,
        order_id: res.data.orderId,
        handler: async (response) => {
          await axios.post("/api/student/fees/verify", {
            payment_id: response.razorpay_payment_id,
            order_id: res.data.orderId,
            razorpay_signature: response.razorpay_signature,
          });

          alert("Payment successful!");
          window.location.reload();
        },
        theme: { color: "#10B981" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  /* ---------------- Render Tabs ---------------- */
  const renderTabContent = () => {
    if (activeTab === "Payment History")
      return <PaymentHistoryContent transactions={feeData.transactions} />;
    if (activeTab === "Receipts")
      return <ReceiptsContent transactions={feeData.transactions} />;
  };

  return (
    <div className="p-8 bg-gray-100">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-6">Fee Management</h1>

      {/* Hero Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Hero
          title="Total Fees"
          value={`₹${feeData.totalFee.toLocaleString("en-IN")}`}
          icon={<DollarSign className="text-blue-600" />}
          color="bg-blue-100"
        />

        <Hero
          title="Paid Amount"
          value={`₹${feeData.paid.toLocaleString("en-IN")}`}
          icon={<CheckCircle className="text-green-600" />}
          color="bg-green-100"
        />

        <Hero
          title="Outstanding"
          value={`₹${feeData.balance.toLocaleString("en-IN")}`}
          icon={<Clock className="text-orange-600" />}
          color="bg-orange-100"
        />
      </div>

      {/* Outstanding Breakdown */}
      <div className="p-6 bg-white rounded-lg shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Outstanding Fees Breakdown</h2>

        {feesCleared ? (
          <div className="text-green-600 text-center font-medium">
            All fees cleared 🎉
          </div>
        ) : (
          <div className="space-y-4">
            {outstandingFees.map((fee) => (
              <FeeItem key={fee.id} fee={fee} onPay={handlePayFee} />
            ))}
          </div>
        )}

        <div className="flex justify-between mt-6 pt-4 ">
          <span className="font-bold">Total Outstanding:</span>
          <span className="font-bold text-red-600">
            ₹{feeData.balance.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <TabSwitcher
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {renderTabContent()}
    </div>
  );
}
