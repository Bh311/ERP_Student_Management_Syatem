import React from 'react';
import {
  Search,
  Upload,
  FileText,
  CheckCircle,
  Clock,
  TrendingUp,
  Eye,
} from 'lucide-react';
import Hero from '../../components/CommonComponent/HeroSection';

function ExamCard({ exam }) {
  const getProgressColor = (percent) => {
    if (percent >= 100) return 'bg-green-500';
    if (percent > 0) return 'bg-orange-500';
    return 'bg-gray-200';
  };

  const getStatusText = (percent) => {
    if (percent >= 100) return 'Completed';
    if (percent > 0) return 'In Progress';
    return 'Not Started';
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow mb-4">
      {/* Left side: Exam details */}
      <div className="flex items-center space-x-4">
        <FileText size={48} className="text-gray-400" />
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{exam.title}</h2>
          <p className="text-xs text-gray-400 mt-1">
            {exam.id} • {exam.type} • {exam.date}
          </p>
        </div>
      </div>

      {/* Middle: Progress and Status */}
      <div className="flex items-center space-x-4">
        <div className="flex flex-col text-right">
          <span className="font-semibold text-gray-800">
            Enrolled: {exam.enrolled}
          </span>
          <span className="text-sm text-gray-500">
            Evaluated: {exam.evaluated}
          </span>
        </div>
        <div className="w-24 bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${getProgressColor(exam.completion)}`}
            style={{ width: `${exam.completion}%` }}
          ></div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            exam.completion >= 100
              ? 'bg-green-100 text-green-600'
              : 'bg-orange-100 text-orange-600'
          }`}
        >
          {getStatusText(exam.completion)}
        </span>
      </div>

      {/* Right side: Action Buttons */}
      <div className="flex items-center space-x-2">
        <button className="flex items-center justify-center p-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
          <Eye size={20} />
          <span className="ml-1">View</span>
        </button>
        <button className="flex items-center justify-center p-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
          <Upload size={20} />
          <span className="ml-1">Upload</span>
        </button>
      </div>
    </div>
  );
}

export default function Exam() {
  // Data for the Hero sections
  const heroData = {
    activeExams: {
      value: 12,
      status: 'This semester',
    },
    evaluated: {
      value: 847,
      status: '84% completed',
    },
    pending: {
      value: 156,
      status: '16% remaining',
    },
    averageScore: {
      value: '82.5%',
      status: '',
    },
  };

  // Data for the current exams list
  const examData = [
    {
      id: 'CS301',
      title: 'Computer Science',
      type: 'Final',
      date: '2024-03-20',
      enrolled: 45,
      evaluated: 32,
      completion: (32 / 45) * 100,
    },
    {
      id: 'MATH201',
      title: 'Mathematics',
      type: 'Midterm',
      date: '2024-03-15',
      enrolled: 52,
      evaluated: 52,
      completion: (52 / 52) * 100,
    },
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Header with Title and Upload Button */}
      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Exam Management</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-gray-100 rounded-lg p-2">
            <Search size={20} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search exams..."
              className="bg-transparent border-none focus:outline-none ml-2 text-gray-700"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors">
            <Upload size={16} />
            <span>Upload Results</span>
          </button>
        </div>
      </div>

      {/* Hero Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Hero
          title="Active Exams"
          value={heroData.activeExams.value}
          status={heroData.activeExams.status}
          icon={<FileText size={20} className="text-blue-600" />}
          color="bg-blue-100"
        />
        <Hero
          title="Papers Evaluated"
          value={heroData.evaluated.value}
          status={heroData.evaluated.status}
          icon={<CheckCircle size={20} className="text-green-600" />}
          color="bg-green-100"
        />
        <Hero
          title="Pending Evaluation"
          value={heroData.pending.value}
          status={heroData.pending.status}
          icon={<Clock size={20} className="text-orange-500" />}
          color="bg-orange-100"
        />
        <Hero
          title="Average Score"
          value={heroData.averageScore.value}
          status={null}
          icon={<TrendingUp size={20} className="text-purple-600" />}
          color="bg-purple-100"
        />
      </div>

      {/* Current Exams Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Current Exams</h2>
        {examData.map((exam) => (
          <ExamCard key={exam.id} exam={exam} />
        ))}
      </div>
    </div>
  );
}