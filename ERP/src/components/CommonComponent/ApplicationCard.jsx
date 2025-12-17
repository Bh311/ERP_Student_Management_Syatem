import React, { useState } from 'react';
import { Eye, CheckCircle, XCircle, UserRound } from 'lucide-react';
import axios from 'axios';

export default function ApplicationCard({
  application,
  onStatusUpdate,
  onEnrollSuccess
}) {

  const [viewData, setViewData] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied': return 'bg-blue-100 text-blue-600';
      case 'Verified': return 'bg-green-100 text-green-600';
      case 'Enrolled': return 'bg-purple-100 text-purple-600';
      case 'Rejected': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // ----------------------------
  // VIEW APPLICATION
  // ----------------------------
  const handleView = async () => {
    try {
      const res = await axios.get(
        `/api/admin/admissions/dashboard/applications/${application._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        // toggle view (click again hides)
        setViewData(prev =>
          prev ? null : res.data.data
        );
      }
    } catch (err) {
      console.error(
        "Error fetching application:",
        err.response?.data?.message || err.message
      );
    }
  };

  // ----------------------------
  // STATUS CHANGE
  // ----------------------------
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
      } else return;

      const res = await axios.put(
        url,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        if (newStatus === 'Enrolled') {
          onEnrollSuccess();
        } else {
          onStatusUpdate({ ...application, status: newStatus });
        }
      }
    } catch (err) {
      console.error(
        "Error updating status:",
        err.response?.data?.message || err.message
      );
    }
  };

  const formattedDate = new Date(application.createdAt).toLocaleDateString();

  return (
    <>
      {/* APPLICATION CARD */}
      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow mb-2">

        {/* LEFT */}
        <div className="flex items-center space-x-4">
      {application.profilePic?.url ? (
  <img
    src={application.profilePic.url}
    alt="Profile"
    className="w-12 h-12 rounded-full object-cover"
  />
) : (
  <UserRound size={48} className="text-gray-400" />
)}


          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {application.fullname}
            </h2>
            <p className="text-sm text-gray-500">{application.email}</p>
            <p className="text-xs text-gray-400 mt-1">
              {application.studentID} • {application.academics.course}
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-end">
            <span className="font-semibold text-gray-800">
              12th Grade: {application.academics.twelfthPercent}%
            </span>
            <span className="text-sm text-gray-500">
              Submitted: {formattedDate}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
              {application.status}
            </span>

            {/* VIEW */}
            <button
              onClick={handleView}
              className="flex items-center justify-center p-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200"
            >
              <Eye size={20} />
              <span className="ml-1">View</span>
            </button>

            {/* Applied */}
            {application.status === 'Applied' && (
              <>
                <button
                  onClick={() => handleStatusChange('Verified')}
                  className="flex items-center justify-center p-2 rounded-lg text-green-600 bg-green-100 hover:bg-green-200"
                >
                  <CheckCircle size={20} /><span className="ml-1">Verify</span>
                </button>

                <button
                  onClick={() => handleStatusChange('Rejected')}
                  className="flex items-center justify-center p-2 rounded-lg text-red-600 bg-red-100 hover:bg-red-200"
                >
                  <XCircle size={20} /><span className="ml-1">Reject</span>
                </button>
              </>
            )}

            {/* Verified */}
            {application.status === 'Verified' && (
              <>
                <button
                  onClick={() => handleStatusChange('Enrolled')}
                  className="flex items-center justify-center p-2 rounded-lg text-purple-600 bg-purple-100 hover:bg-purple-200"
                >
                  <CheckCircle size={20} /><span className="ml-1">Enroll</span>
                </button>

                <button
                  onClick={() => handleStatusChange('Rejected')}
                  className="flex items-center justify-center p-2 rounded-lg text-red-600 bg-red-100 hover:bg-red-200"
                >
                  <XCircle size={20} /><span className="ml-1">Reject</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 🔽 VIEW DETAILS UI (NEW, SIMPLE) */}
      {viewData && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border text-sm">
          <div className="grid grid-cols-2 gap-3">
            <p><b>Name:</b> {viewData.fullname}</p>
            <p><b>Email:</b> {viewData.email}</p>
            <p><b>Phone:</b> {viewData.phone}</p>
            <p><b>Gender:</b> {viewData.gender}</p>
            <p><b>Course:</b> {viewData.academics.course}</p>
            <p><b>Semester:</b> {viewData.academics.semester}</p>
            <p><b>Status:</b> {viewData.status}</p>
            <p><b>Hostel:</b> {viewData.hostel?.status || "Not Applied"}</p>
          </div>
        </div>
      )}
    </>
  );
}
