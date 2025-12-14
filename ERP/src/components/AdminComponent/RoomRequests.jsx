import React, { useEffect, useState } from "react";
import axios from "axios";
import RequestCard from "./Requestcard";

export default function RoomRequests({ search }) {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const response = await axios.get("/api/admin/hostels/requests", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const formatted = response.data.data.map((item) => ({
        _id: item._id,

        initials: item.fullname
          .split(" ")
          .map((w) => w[0])
          .join("")
          .toUpperCase(),

        name: item.fullname,
        id: item.studentID,
        program: `${item.academics.course} • Sem ${item.academics.semester}`,
        preferences: "Prefers Hostel • Auto-Assigned",
        submittedDate: item.createdAt.split("T")[0],

        rawStatus: item.hostel.status,

        status:
          item.hostel.status === "Applied"
            ? "Pending"
            : item.hostel.status === "Accepted"
            ? "Approved"
            : "Rejected",
      }));

      setRequests(formatted);
    } catch (error) {
      console.log("Error fetching hostel requests:", error);
    }
  };

  const acceptRequest = async (id) => {
    try {
      await axios.put(
        `/api/admin/hostels/accept/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Hostel request accepted!");
      fetchRequests();
    } catch (error) {
      alert(error.response?.data?.message || "Error accepting request");
    }
  };

  const rejectRequest = async (id) => {
    try {
      await axios.put(
        `/api/admin/hostels/reject/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Hostel request rejected!");
      fetchRequests();
    } catch (error) {
      alert(error.response?.data?.message || "Error rejecting request");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // 🔥 Search filter
  const filtered = requests.filter((req) =>
    req.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Room Assignment Requests
      </h2>

      {filtered.map((request) => (
        <RequestCard
          key={request._id}
          request={request}
          onAccept={acceptRequest}
          onReject={rejectRequest}
        />
      ))}
    </div>
  );
}
