import React, { useState, useEffect } from 'react';
import axios from "axios";

function RequestCard({ request }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'In Progress':
                return 'bg-blue-100 text-blue-600';
            case 'Resolved':
                return 'bg-green-100 text-green-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <div>
                <p className="font-semibold text-gray-800">{request.issueType}</p>
                <p className="text-sm text-gray-500">Submitted on {new Date(request.createdAt).toDateString()}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                {request.status}
            </span>
        </div>
    );
}

export default function Maintenance() {
    const [issueType, setIssueType] = useState('');
    const [priority, setPriority] = useState('');
    const [description, setDescription] = useState('');
    const [recentRequests, setRecentRequests] = useState([]);

    // -------------------------------
    // 🔥 Load student maintenance logs
    // -------------------------------
    const fetchRequests = async () => {
        try {
            const res = await axios.get("/api/student/maintenance/list", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setRecentRequests(res.data.data);
        } catch (err) {
            console.log("Error loading requests:", err);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    // -------------------------------
    // 🔥 Submit Maintenance Request
    // -------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!issueType || !priority || !description) {
            alert("Please fill all fields!");
            return;
        }

        try {
            await axios.post(
                "/api/student/maintenance/request",
                { issueType, priority, description },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            alert("Maintenance Request Submitted!");
            
            setIssueType("");
            setPriority("");
            setDescription("");

            fetchRequests(); // reload list

        } catch (err) {
            console.log("Error submitting request:", err);
            alert("Error submitting request");
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Maintenance Requests</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Issue Type</label>
                        <select 
                            value={issueType} 
                            onChange={(e) => setIssueType(e.target.value)}
                            className="mt-1 block w-full rounded-md bg-gray-100 shadow-sm"
                        >
                            <option value="">Select issue type</option>
                            <option>Plumbing</option>
                            <option>Electrical</option>
                            <option>Carpentry</option>
                            <option>Pest Control</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Priority</label>
                        <select 
                            value={priority} 
                            onChange={(e) => setPriority(e.target.value)}
                            className="mt-1 block w-full rounded-md bg-gray-100 shadow-sm"
                        >
                            <option value="">Select priority</option>
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="3"
                        className="mt-1 block w-full rounded-md bg-gray-100 shadow-sm"
                        placeholder="Describe the issue in detail..."
                    ></textarea>
                </div>

                <button 
                    type="submit" 
                    className="px-4 py-2 bg-green-400 text-white font-semibold rounded-lg hover:bg-green-500"
                >
                    Submit Request
                </button>
            </form>

            <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Requests</h3>
                <div className="space-y-4">
                    {recentRequests.length === 0 ? (
                        <p className="text-gray-500 text-sm">No maintenance requests submitted yet.</p>
                    ) : (
                        recentRequests.map((req) => <RequestCard key={req._id} request={req} />)
                    )}
                </div>
            </div>
        </div>
    );
}
