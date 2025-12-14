import React from 'react';
import ApplicationCard from '../CommonComponent/ApplicationCard'; 

// CRITICAL FIX: The component must receive the onEnrollSuccess prop from the parent (VerifyAdmissions)
export default function RecentApplications({ applications, onStatusUpdate, onEnrollSuccess }) {
  
  // Check if the applications array is empty
  if (applications.length === 0) {
    return (
      <div className="mt-8 p-4 text-center text-gray-500 bg-white rounded-lg shadow">
        No applications found matching your criteria.
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Applications</h2>
      {applications.map((application) => (
        <ApplicationCard 
            key={application._id} 
            application={application} 
            onStatusUpdate={onStatusUpdate}
            // CRITICAL FIX: Pass the new function down to ApplicationCard
            onEnrollSuccess={onEnrollSuccess} 
        />
      ))}
    </div>
  );
}