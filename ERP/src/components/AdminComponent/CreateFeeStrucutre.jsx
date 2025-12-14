import React, { useState } from 'react';
import CreateHostelFeeStructure from './CreateHostelFee';
import axios from 'axios';
import { PlusCircle, DollarSign, BookOpen, GraduationCap } from 'lucide-react';

export default function CreateFeeStructure() {
  const [formData, setFormData] = useState({
    course: '',
    semester: 1,
    academicYear: '2025-26',
    tuition: '',
    library: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const tuition = Number(formData.tuition || 0);
  const library = Number(formData.library || 0);
  const totalFee = tuition + library;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const payload = {
      course: formData.course,
      semester: Number(formData.semester),
      academicYear: formData.academicYear,
      breakdown: { tuition, library }
    };

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        '/api/admin/fees/structures',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setMessage(res.data.message);
        setFormData({
          course: '',
          semester: 1,
          academicYear: '2025-26',
          tuition: '',
          library: '',
        });
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create fee structure.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">

      {/* ------------------ MAIN FEE STRUCTURE CARD ------------------ */}
      <div className="p-8 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">
          Create Fee Structure
        </h2>

        {message && <p className="text-green-600 mb-3">{message}</p>}
        {error && <p className="text-red-600 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Course + Semester */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">
                <GraduationCap size={16} className="inline mr-1" /> Course
              </label>
              <input
                type="text"
                name="course"
                value={formData.course}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="B.Tech CSE"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Semester</label>
              <input
                type="number"
                name="semester"
                min="1"
                value={formData.semester}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          {/* Academic Year */}
          <div>
            <label className="block text-sm font-medium">Academic Year</label>
            <input
              type="text"
              name="academicYear"
              value={formData.academicYear}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>

          {/* Fee Breakdown */}
          <h3 className="text-lg font-semibold mt-4">Fee Breakdown</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">
                <DollarSign size={16} className="inline mr-1" /> Tuition Fee
              </label>
              <input
                type="number"
                name="tuition"
                min="0"
                value={formData.tuition}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="90000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                <BookOpen size={16} className="inline mr-1" /> Library Fee
              </label>
              <input
                type="number"
                name="library"
                min="0"
                value={formData.library}
                onChange={handleChange} 
                className="w-full p-2 border rounded"
                placeholder="5000"
                required
              />
            </div>
          </div>

          <div className="text-right font-semibold text-gray-700">
            Total Fee : ₹{totalFee.toLocaleString('en-IN')}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 flex justify-center items-center"
          >
            {loading ? "Creating..." : (
              <>
                <PlusCircle size={18} className="mr-2" />
                Create Fee Structure
              </>
            )}
          </button>
        </form>
      </div>

      {/* ------------------ HOSTEL SECTION (Now properly arranged) ------------------ */}
      <div className="mt-14 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Hostel Fee Structure
        </h2>

        {/* Hostel Fee Card with same width alignment */}
        <div className="max-w-xl">
          <CreateHostelFeeStructure />
        </div>
      </div>

    </div>
  );
}
