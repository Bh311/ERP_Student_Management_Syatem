import React, { useEffect, useState } from "react";
import axios from "axios";

export default function WaitingList({ search }) {
  const [accepted, setAccepted] = useState([]);

  const fetchAcceptedStudents = async () => {
    try {
      const response = await axios.get("/api/admin/hostels/accepted", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const formatted = response.data.data.map((item, index) => ({
        index: index + 1,
        name: item.fullname,
        id: item.studentID,
        program: `${item.academics.course} • Sem ${item.academics.semester}`,
        hostelNumber: item.hostel.hostelNumber,
        roomNumber: item.hostel.roomNumber,
        acceptedDate: item.hostel.reservationExpiryDate?.split("T")[0],
        initials: item.fullname.split(" ").map((w) => w[0]).join("").toUpperCase(),
      }));

      setAccepted(formatted);
    } catch (error) {
      console.log("Error fetching accepted students:", error);
    }
  };

  useEffect(() => {
    fetchAcceptedStudents();
  }, []);

  const filtered = accepted.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Reserved Room</h2>

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          No matching accepted students found.
        </p>
      ) : (
        filtered.map((w) => (
          <div
            key={w.index}
            className="flex items-center justify-between p-5 bg-white rounded-xl shadow mb-4 border border-gray-100"
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600 font-bold">
                {w.initials}
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-800">{w.name}</h2>
                <p className="text-xs text-gray-500">{w.id} • {w.program}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Hostel: <strong>{w.hostelNumber}</strong> • Room: <strong>{w.roomNumber}</strong>
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-sm text-gray-500 block">Reservation valid till</span>
              <span className="text-sm text-gray-800">
                {w.acceptedDate || "N/A"}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
