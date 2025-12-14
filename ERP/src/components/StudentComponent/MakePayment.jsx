import React, { useState } from 'react';
import { DollarSign, Loader } from 'lucide-react';
import axios from 'axios';

// FeeItem component (kept for display structure)
function FeeItem({ fee }) {
    // Show raw amount without conversion (Paise)
    const displayAmount = `₹${fee.rawAmount.toLocaleString('en-IN')}`;

    return (
        <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <DollarSign size={20} />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-800">{fee.title}</h3>
                    <p className="text-sm text-gray-500">Due: {fee.dueDate}</p>
                </div>
            </div>
            <div className="flex items-center space-x-3">
                <span className="font-semibold text-gray-800">{displayAmount}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium text-orange-500 bg-orange-100`}>
                    {fee.status}
                </span>
            </div>
        </div>
    );
}

export default function MakePaymentContent({ feeAccountData }) {
    // Calculate initial amount based on fetched balance (in Paise)
    const initialAmountPaise = feeAccountData.balance.toFixed(0).toString();
    
    // State management
    const [paymentAmount, setPaymentAmount] = useState(initialAmountPaise);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);

    // Filter outstanding fees for validation
    const outstandingFees = [];
    if (feeAccountData?.breakdown) {
        Object.keys(feeAccountData.breakdown).forEach(feeType => {
            const amount = feeAccountData.breakdown[feeType];
            if (amount > 0) {
                outstandingFees.push({ id: feeType, rawAmount: amount });
            }
        });
    }
    const feesCleared = feeAccountData.balance === 0;
    const currentDisplayAmount = parseFloat(paymentAmount).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });


    // --- Payment Verification API Call ---
    const verifyPayment = async (response, orderId) => {
        setLoading(true);
        try {
            const verificationUrl = '/api/student/fees/verify';
            
            // Sends the security parameters to your backend
            const verifyResponse = await axios.post(verificationUrl, {
                payment_id: response.razorpay_payment_id,
                order_id: orderId,
                razorpay_signature: response.razorpay_signature,
            });

            if (verifyResponse.data.success) {
                alert("Payment Confirmed and Account Updated!");
                // Trigger a data refetch in the parent component to update UI
                window.location.reload(); 
            } else {
                alert("Verification Failed: " + verifyResponse.data.message);
            }
        } catch (error) {
            console.error("Verification failed:", error);
            alert("Verification failed due to a server error.");
        } finally {
            setLoading(false);
        }
    };


    // --- Razorpay Handler ---
    const displayRazorpay = (orderId, amount) => {
        // Ensure Razorpay SDK is loaded
        if (typeof window.Razorpay === 'undefined') {
            setApiError('Razorpay SDK is not loaded. Cannot proceed.');
            setLoading(false);
            return;
        }
        
        const options = {
            key: "rzp_test_RIyYm76qOKiBkK", // IMPORTANT: Use your actual test key ID here
            amount: amount, // Amount in paise/cents (passed from backend)
            currency: "INR",
            name: "University Fee Payment",
            description: "Outstanding Fee Balance",
            order_id: orderId,
            handler: function (response) {
                // SUCCESS HANDLER: Send verification data to your backend
                verifyPayment(response, orderId);
            },
            prefill: {
                name: feeAccountData.student?.fullname || "Student Name", 
                email: feeAccountData.student?.email || "email@example.com",
            },
            theme: {
                color: "#10B981" // Green color
            }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.on('payment.failed', function (response) {
            alert("Payment failed: " + response.error.description);
            setLoading(false);
        });
        paymentObject.open();
        setLoading(false); // Set loading to false once modal opens
    };


    // --- Payment Initiation: POST /api/student/fees/pay (Create Order) ---
    const handleCreateOrder = async (e) => {
        e.preventDefault(); // Prevents default form submission/page reload
        setApiError(null);

        if (typeof window.Razorpay === 'undefined') {
            setApiError("Payment system is not ready. Please wait a moment.");
            return;
        }

        const amountInPaise = Math.round(parseFloat(paymentAmount));
        
        if (amountInPaise <= 0 || isNaN(amountInPaise)) {
            setApiError('Please enter a valid amount greater than zero.');
            return;
        }

        let feeTypeEntry = outstandingFees.find(item => item.rawAmount === amountInPaise);

        // Check if amount matches total outstanding
        if (!feeTypeEntry && amountInPaise === feeAccountData.balance) {
            feeTypeEntry = { id: 'total_outstanding', rawAmount: feeAccountData.balance };
        }
        
        if (!feeTypeEntry) {
            setApiError(`Amount entered must exactly match one of the outstanding fee types (or the total).`);
            return;
        }

        setLoading(true);
        try {
            // Step 1: Call Backend to Create Order ID
            const response = await axios.post(`/api/student/fees/pay`, {
                amount: amountInPaise, 
                feeType: feeTypeEntry.id, // Will be 'total_outstanding', 'tuition', etc.
            });

            if (response.data.success && response.data.orderId) {
                // Step 2: Launch Razorpay Modal with the received order ID
                displayRazorpay(response.data.orderId, response.data.amount);
            } else {
                setApiError(response.data.message || 'Failed to create payment order.');
                setLoading(false);
            }
        } catch (err) {
            setApiError(err.response?.data?.message || 'Payment server connection failed.');
            setLoading(false);
        }
    };
    
    return (
        <div className="p-6 bg-white rounded-lg ">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Make Payment</h2>
            {apiError && <p className="text-sm text-red-500 mb-4">{apiError}</p>}
            
            <form className="space-y-6" onSubmit={handleCreateOrder}>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Amount (in Paise/Cents)
                    </label>
                    <input
                        type="text"
                        name="amount"
                        id="amount"
                        className="block w-full rounded-md border-gray-300 shadow-sm px-4 py-2"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                        disabled={feesCleared}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || feesCleared || parseFloat(paymentAmount) <= 0 || typeof window.Razorpay === 'undefined'}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <Loader size={20} className="animate-spin mr-2" /> Processing...
                        </>
                    ) : (
                        `Pay ₹${currentDisplayAmount}`
                    )}
                </button>
            </form>
        </div>
    );
}