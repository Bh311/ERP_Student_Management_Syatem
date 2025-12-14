import React from "react";

function RequestCard({ request, onAccept, onReject }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-orange-100 text-orange-600";
      case "Approved":
        return "bg-green-100 text-green-600";
      case "Rejected":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="flex items-center justify-between p-5 bg-white rounded-xl shadow mb-4 border border-gray-100">
      
      {/* LEFT SIDE */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-200 text-gray-700 font-bold">
          {request.initials}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800">{request.name}</h2>

          <p className="text-xs text-gray-500">
            {request.id} • {request.program}
          </p>

          <p className="text-xs text-gray-500 mt-1">{request.preferences}</p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center space-x-4">

        <div className="text-right">
          <span className="text-sm text-gray-500 block">Submitted</span>
          <span className="text-sm text-gray-800">{request.submittedDate}</span>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            request.status
          )}`}
        >
          {request.status}
        </span>

        {request.rawStatus === "Applied" && (
          <div className="flex space-x-2">
            <button
              onClick={() => onAccept(request._id)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Accept
            </button>

            <button
              onClick={() => onReject(request._id)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default RequestCard;
