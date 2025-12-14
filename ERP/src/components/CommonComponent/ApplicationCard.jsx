import React from 'react';
import { Eye, CheckCircle, XCircle, UserRound } from 'lucide-react';
import axios from 'axios';

// CRITICAL CHANGE: Add onEnrollSuccess to the props list
export default function ApplicationCard({ application, onStatusUpdate, onEnrollSuccess }) { 
  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied': return 'bg-blue-100 text-blue-600';
      case 'Verified': return 'bg-green-100 text-green-600';
      case 'Enrolled': return 'bg-purple-100 text-purple-600';
      case 'Rejected': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const handleView = () => console.log(`Viewing application for ${application.fullname}`);

  const handleStatusChange = async (newStatus) => {
    try {
        let url;
        const appId = application._id;

        if (newStatus === 'Enrolled') {
            url = `/api/admin/admissions/enroll/${appId}`;
        } else if (newStatus === 'Rejected') {
            url = `/api/admin/admissions/reject/${appId}`;
        } else if (newStatus === 'Verified') {
            url = `/api/admin/admissions/verify/${appId}`;
        } else {
            console.error("Invalid status provided:", newStatus);
            return;
        }
        
        const res = await axios.put(url, { status: newStatus }); 

        if (res.data.success) {
            if (newStatus === 'Enrolled') {
                // CRITICAL FIX: Call the parent function to trigger a full dashboard re-fetch.
                onEnrollSuccess(); 
            } else {
                // For Verified/Rejected, update locally for quick feedback
                onStatusUpdate({ ...application, status: newStatus });
            }
            console.log(`Application status updated to ${newStatus}`);
        }
    } catch (err) {
        console.error("Error updating application status:", err.response ? err.response.data.message : err.message);
    }
  };
  
  const handleVerify = () => handleStatusChange('Verified');
  const handleEnroll = () => handleStatusChange('Enrolled');
  const handleReject = () => handleStatusChange('Rejected');
  
  const formattedDate = new Date(application.createdAt).toLocaleDateString();

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow mb-4">
      <div className="flex items-center space-x-4">
        {application.profilePic ? (
          <img src={`${application.profilePic}`} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
        ) : (
          <UserRound size={48} className="text-gray-400" />
        )}
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{application.fullname}</h2>
          <p className="text-sm text-gray-500">{application.email}</p>
          <p className="text-xs text-gray-400 mt-1">{application.studentID} • {application.academics.course}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex flex-col items-end text-right">
          <span className="font-semibold text-gray-800">12th Grade: {application.academics.twelfthPercent}%</span>
          <span className="text-sm text-gray-500">Submitted: {formattedDate}</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
            {application.status}
          </span>

          <button onClick={handleView} className="flex items-center justify-center p-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
            <Eye size={20} /><span className="ml-1">View</span>
          </button>
          
          {/* Applied state: Verify/Reject */}
          {application.status === 'Applied' && (
            <>
              <button onClick={handleVerify} className="flex items-center justify-center p-2 rounded-lg text-green-600 bg-green-100 hover:bg-green-200 transition-colors">
                <CheckCircle size={20} /><span className="ml-1">Verify</span>
              </button>
              <button onClick={handleReject} className="flex items-center justify-center p-2 rounded-lg text-red-600 bg-red-100 hover:bg-red-200 transition-colors">
                <XCircle size={20} /><span className="ml-1">Reject</span>
              </button>
            </>
          )}

          {/* Verified state: Enroll/Reject */}
          {application.status === 'Verified' && (
            <>
              <button onClick={handleEnroll} className="flex items-center justify-center p-2 rounded-lg text-purple-600 bg-purple-100 hover:bg-purple-200 transition-colors">
                <CheckCircle size={20} /><span className="ml-1">Enroll</span>
              </button>
              <button onClick={handleReject} className="flex items-center justify-center p-2 rounded-lg text-red-600 bg-red-100 hover:bg-red-200 transition-colors">
                <XCircle size={20} /><span className="ml-1">Reject</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}