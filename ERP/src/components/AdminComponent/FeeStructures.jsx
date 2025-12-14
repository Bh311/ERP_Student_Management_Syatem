import React, { useEffect, useState } from "react";
import axios from "axios";
import { DollarSign, BookOpen, Home, GraduationCap } from "lucide-react";

export default function FeeStructure() {
  // Academic structures
  const [academicFees, setAcademicFees] = useState([]);
  const [editingAcademic, setEditingAcademic] = useState(null);

  // Hostel structures
  const [hostelFees, setHostelFees] = useState([]);
  const [editingHostel, setEditingHostel] = useState(null);

  // Shared form state
  const [formData, setFormData] = useState({
    course: "",
    semester: "",
    academicYear: "",
    tuition: "",
    library: "",
    hostelFee: "",
  });

  // ---------------------- FETCH DATA ----------------------
  useEffect(() => {
    fetchAcademicFees();
    fetchHostelFees();
  }, []);

  const fetchAcademicFees = async () => {
    try {
      const res = await axios.get("/api/admin/fees/structures");
      setAcademicFees(res.data.data || []);
    } catch (err) {
      console.error("Error fetching academic fee structures:", err);
    }
  };

  const fetchHostelFees = async () => {
    try {
      const res = await axios.get("/api/admin/fees/structures/hostel");
      setHostelFees(res.data.data || []);
    } catch (err) {
      console.error("Error fetching hostel fee structures:", err);
    }
  };

  // ---------------------- EDIT HANDLERS ----------------------
  const handleEditAcademic = (fee) => {
    setEditingAcademic(fee);
    setEditingHostel(null);

    setFormData({
      course: fee.course,
      semester: String(fee.semester),
      academicYear: fee.academicYear,
      tuition: String(fee.breakdown.tuition),
      library: String(fee.breakdown.library),
    });
  };

  const handleEditHostel = (fee) => {
    setEditingHostel(fee);
    setEditingAcademic(null);

    setFormData({
      academicYear: fee.academicYear,
      hostelFee: String(fee.hostelFee),
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ---------------------- UPDATE API ----------------------
  const handleUpdate = async () => {
    try {
      if (editingAcademic) {
        const updatedBreakdown = {
          tuition: Number(formData.tuition),
          library: Number(formData.library),
        };

        const totalFee = updatedBreakdown.tuition + updatedBreakdown.library;

        const res = await axios.put(
          `/api/admin/fees/structures/${editingAcademic._id}`,
          {
            course: formData.course,
            semester: Number(formData.semester),
            academicYear: formData.academicYear,
            totalFee,
            breakdown: updatedBreakdown,
          }
        );

        setAcademicFees((prev) =>
          prev.map((item) =>
            item._id === editingAcademic._id ? res.data.data : item
          )
        );

        setEditingAcademic(null);
      }

      if (editingHostel) {
        const res = await axios.put(
          `/api/admin/fees/structures/hostel/${editingHostel._id}`,
          {
            academicYear: formData.academicYear,
            hostelFee: Number(formData.hostelFee),
          }
        );

        setHostelFees((prev) =>
          prev.map((item) =>
            item._id === editingHostel._id ? res.data.data : item
          )
        );

        setEditingHostel(null);
      }
    } catch (err) {
      console.error("Update failed:", err);
      alert("Error updating structure.");
    }
  };

  // ---------------------- DELETE API ----------------------
  const handleDeleteAcademic = async (id) => {
    try {
      await axios.delete(`/api/admin/fees/structures/${id}`);
      setAcademicFees((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      alert("Failed to delete academic fee structure");
    }
  };

  const handleDeleteHostel = async (id) => {
    try {
      await axios.delete(`/api/admin/fees/structures/hostel/${id}`);
      setHostelFees((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      alert("Failed to delete hostel fee structure");
    }
  };

  return (
    <div className="space-y-10">

      {/* ---------------------- ACADEMIC FEE STRUCTURES ---------------------- */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Academic Fee Structures</h2>

        {academicFees.length === 0 ? (
          <p className="text-gray-500">No academic fee structures available.</p>
        ) : (
          academicFees.map((fee) => (
            <div
              key={fee._id}
              className="flex justify-between items-center p-5 bg-white rounded-lg shadow mb-4"
            >
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-blue-200 text-blue-700 font-bold rounded-full flex items-center justify-center">
                  {fee.course[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{fee.course}</h3>
                  <p className="text-gray-500 text-sm">
                    Sem {fee.semester} • {fee.academicYear}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p>Total: ₹{fee.totalFee}</p>
                <p className="text-sm text-gray-600">Tuition: ₹{fee.breakdown.tuition}</p>
                <p className="text-sm text-gray-600">Library: ₹{fee.breakdown.library}</p>
              </div>

              <div className="flex gap-2">
                <button onClick={() => handleEditAcademic(fee)} className="px-3 py-1 bg-blue-100 text-blue-600 rounded">Edit</button>
                <button onClick={() => handleDeleteAcademic(fee._id)} className="px-3 py-1 bg-red-100 text-red-600 rounded">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ---------------------- HOSTEL FEE STRUCTURES ---------------------- */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Hostel Fee Structures</h2>

        {hostelFees.length === 0 ? (
          <p className="text-gray-500">No hostel fee structures available.</p>
        ) : (
          hostelFees.map((fee) => (
            <div
              key={fee._id}
              className="flex justify-between items-center p-5 bg-white rounded-lg shadow mb-4"
            >
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-green-200 text-green-700 font-bold rounded-full flex items-center justify-center">
                  H
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Hostel Fee</h3>
                  <p className="text-gray-500 text-sm">{fee.academicYear}</p>
                </div>
              </div>

              <div className="text-right">
                <p>Fee: ₹{fee.hostelFee}</p>
              </div>

              <div className="flex gap-2">
                <button onClick={() => handleEditHostel(fee)} className="px-3 py-1 bg-blue-100 text-blue-600 rounded">Edit</button>
                <button onClick={() => handleDeleteHostel(fee._id)} className="px-3 py-1 bg-red-100 text-red-600 rounded">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ---------------------- EDIT MODAL ---------------------- */}
      {(editingAcademic || editingHostel) && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-lg">
            <h3 className="font-bold text-xl mb-4">
              {editingAcademic ? "Edit Academic Fee Structure" : "Edit Hostel Fee Structure"}
            </h3>

            {/* Academic Edit Form */}
            {editingAcademic && (
              <>
                <label>Tuition Fee</label>
                <input
                  name="tuition"
                  value={formData.tuition}
                  onChange={handleChange}
                  type="number"
                  className="w-full border p-2 rounded mb-3"
                />

                <label>Library Fee</label>
                <input
                  name="library"
                  value={formData.library}
                  onChange={handleChange}
                  type="number"
                  className="w-full border p-2 rounded mb-3"
                />
              </>
            )}

            {/* Hostel Edit Form */}
            {editingHostel && (
              <>
                <label>Hostel Fee</label>
                <input
                  name="hostelFee"
                  value={formData.hostelFee}
                  onChange={handleChange}
                  type="number"
                  className="w-full border p-2 rounded mb-3"
                />
              </>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => { setEditingAcademic(null); setEditingHostel(null); }}
                className="px-4 py-2 bg-gray-200 rounded">
                Cancel
              </button>

              <button onClick={handleUpdate} className="px-4 py-2 bg-blue-600 text-white rounded">
                Update
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
