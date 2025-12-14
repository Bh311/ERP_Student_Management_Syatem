import React, { useState, useEffect } from 'react';
import Hero from '../../components/CommonComponent/HeroSection';
import TabSwitcher from '../../components/CommonComponent/TabSwitcher';
import ReceiptsContent from '../../components/StudentComponent/Receipts';
import PaymentHistoryContent from '../../components/StudentComponent/PaymentHistory';
import MakePaymentContent from '../../components/StudentComponent/MakePayment';
import { DollarSign, CheckCircle, Clock, Loader } from 'lucide-react';
import axios from 'axios';

// FeeItem component (redefined locally for this context)
function FeeItem({ fee }) {
    const displayAmount = `₹${fee.rawAmount.toLocaleString('en-IN')}`;

    return (
        <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200">
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

// Initial state for fee account structure (ensuring numeric defaults)
const initialFeeData = {
    totalFee: 0,
    paid: 0,
    balance: 0,
    breakdown: {},
    status: 'Loading...',
    semester: '1',
    progressBarValue: 0,
    dueDate: new Date().toISOString(),
};

// Function to dynamically load the external Razorpay script
const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export default function FeesContent() {
    const tabs = ['Make Payment', 'Payment History', 'Receipts'];
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [feeData, setFeeData] = useState(initialFeeData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [razorpayReady, setRazorpayReady] = useState(false); // New state for SDK

    // --- Data Fetching & Razorpay Script Loading ---
    useEffect(() => {
        const initData = async () => {
            // Load Razorpay SDK
            const scriptLoaded = await loadRazorpayScript();
            setRazorpayReady(scriptLoaded);

            const url = `/api/student/fees/`; 
            
            try {
                const response = await axios.get(url);
                const data = response.data.data;

                const paidValue = data.paid || 0;
                const totalValue = data.totalFee || 1; 
                const progress = (paidValue / totalValue) * 100;
                
                setFeeData({
                    totalFee: data.totalFee,
                    paid: data.paid,
                    balance: data.balance,
                    status: data.status,
                    transactions: data.transactions,
                    // FIX: Use optional chaining to safely read nested property
                    semester: data.student?.academics?.semester || '1', 
                    progressBarValue: progress,
                    breakdown: data.breakdown,
                    dueDate: data.dueDate,
                });
            } catch (err) {
                // The API is clearly returning a 401 Unauthorized error (from console image)
                setError('Failed to fetch fee data. Please ensure you are logged in.');
                console.error('API Error:', err);
            } finally {
                setLoading(false);
            }
        };

        initData();
    }, []); 

    // --- Data Processing for Outstanding Fees UI ---
    const outstandingFees = [];
    if (feeData.breakdown) {
        Object.keys(feeData.breakdown).forEach(feeType => {
            const amount = feeData.breakdown[feeType];
            if (amount > 0) {
                outstandingFees.push({
                    id: feeType,
                    title: feeType.charAt(0).toUpperCase() + feeType.slice(1) + ' Fee',
                    rawAmount: amount, // Stored in Paise (e.g., 67000)
                    dueDate: new Date(feeData.dueDate).toLocaleDateString('en-IN'),
                    status: 'Pending',
                });
            }
        });
    }
    
    // Display values
    const totalOutstandingDisplay = `₹${(feeData.balance).toLocaleString('en-IN')}`;
    const feesCleared = feeData.balance === 0;


    // Function to conditionally render tab content
    const renderTabContent = () => {
        const dataForPayment = {
            balance: feeData.balance,
            breakdown: feeData.breakdown,
            dueDate: feeData.dueDate,
            outstandingFees: outstandingFees,
            totalOutstandingDisplay: totalOutstandingDisplay,
            feesCleared: feesCleared
        };

        switch (activeTab) {
            case 'Make Payment':
                // Pass the necessary data structure and Razorpay readiness status
                return <MakePaymentContent feeAccountData={dataForPayment} razorpayReady={razorpayReady} />;
            case 'Payment History':
                return <PaymentHistoryContent transactions={feeData.transactions}/>;
            case 'Receipts':
                // Pass the Fee Account ID to fetch receipts associated with this account
                return <ReceiptsContent transactions={feeData.transactions} />; 
            default:
                return <MakePaymentContent feeAccountData={dataForPayment} razorpayReady={razorpayReady} />;
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-600">Fetching fee information...</div>;
    }

    // Display error message from failed API call (Unauthorized/Auth Failure)
    if (error) {
        return <div className="p-8 text-center text-red-600 font-semibold">{error}</div>;
    }

    return (
        <div className="p-8 bg-gray-100">
            {/* Header section */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className='text-2xl font-bold text-gray-800 mb-1'>Fee Management</h1>
                    <p className="text-sm text-gray-500">Manage your fee payments and download receipts</p>
                </div>
            </div>

            {/* Hero cards section */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'> 
                {/* Total Fees */}
                <Hero 
                    title="Total Fees" 
                    value={`₹${(feeData.totalFee).toLocaleString('en-IN')}`}
                    status={`Semester ${feeData.semester}`} 
                    icon={<DollarSign className="text-blue-600" size={20} />} 
                    color="bg-blue-100"
                    valueColor="text-gray-800"
                    statusColor="text-gray-500"
                />
                
                {/* Paid Amount */}
                <Hero 
                    title="Paid Amount" 
                    value={`₹${(feeData.paid).toLocaleString('en-IN')}`}
                    status={feesCleared ? 'Payment up to date' : 'Partial Payment'}
                    icon={<CheckCircle className="text-green-600" size={20} />} 
                    color="bg-green-100"
                    valueColor="text-green-600"
                    statusColor="text-green-600"
                />

                {/* Outstanding */}
                <Hero 
                    title="Outstanding" 
                    value={totalOutstandingDisplay}
                    status={null}
                    icon={<Clock className="text-orange-500" size={20} />}
                    color="bg-orange-100"
                    valueColor="text-orange-500"
                    showProgressBar={true}
                    progressBarValue={feeData.progressBarValue}
                    progressBarColor="bg-gray-800"
                />
            </div>
            
            {/* Permanent Breakdown Section */}
            <div className="p-6 bg-white rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Outstanding Fees Breakdown</h2>
                <div className="space-y-4">
                    {feesCleared ? (<div className="p-4 bg-green-50 rounded-lg text-center text-green-700 font-medium">All fees have been cleared! 🎉</div>) : (outstandingFees.map((fee) => (<FeeItem key={fee.id} fee={fee} />)))}
                </div>
                <div className="flex justify-between items-center mt-6 p-4 border-t border-gray-200">
                    <span className="text-lg font-bold text-gray-800">Total Outstanding:</span>
                    <span className={`text-lg font-bold ${feesCleared ? 'text-green-600' : 'text-red-600'}`}>
                        {totalOutstandingDisplay}
                    </span>
                </div>
            </div>
            
            <div className='mt-6 mb-6'>
                <TabSwitcher tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            {renderTabContent()}
        </div>
    );
}