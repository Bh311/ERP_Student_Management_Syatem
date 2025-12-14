import React, { useState } from "react";
import axios from "axios";
import { PlusCircle, Home } from "lucide-react";

export default function CreateHostelFeeStructure() {
  const [formData, setFormData] = useState({
    academicYear: "2025-26",
    hostelFee: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      const payload = {
        academicYear: formData.academicYear,
        hostelFee: Number(formData.hostelFee),
      };

      const res = await axios.post(
        "/api/admin/fees/structures/hostel",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(res.data.message);

      setFormData({
        academicYear: "2025-26",
        hostelFee: "",
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create hostel fee structure.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-white rounded-xl shadow-md max-w-lg mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Home size={22} className="text-blue-600" />
        Create Hostel Fee Structure
      </h2>

      {message && <p className="text-green-600 mb-3">{message}</p>}
      {error && <p className="text-red-600 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Academic Year */}
        <div>
          <label className="block text-sm font-medium mb-1">Academic Year</label>
          <input
            type="text"
            name="academicYear"
            value={formData.academicYear}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        {/* Hostel Fee */}
        <div>
          <label className="block text-sm font-medium mb-1">Hostel Fee (Annual)</label>
          <input
            type="number"
            name="hostelFee"
            value={formData.hostelFee}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="60000"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 flex items-center justify-center"
        >
          {loading ? "Creating..." : <>
            <PlusCircle size={18} className="mr-2" /> Create Hostel Fee Structure
          </>}
        </button>
      </form>
    </div>
  );
}
