import React from 'react';
import { Eye, FileText } from 'lucide-react';

function ExamCard({ exam }) {
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
                        Total Marks: {exam.totalMarks}
                    </span>
                    <span className="text-sm text-gray-500">
                        Duration: {exam.duration}
                    </span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600`}>
                    {exam.status}
                </span>
            </div>

            {/* Right side: Action Button */}
            <div className="flex items-center space-x-2">
                <button className="flex items-center justify-center p-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                    <Eye size={20} />
                    <span className="ml-1">View</span>
                </button>
            </div>
        </div>
    );
}

export default function ExamList() {
    const examData = [
        {
            id: 'CS301',
            title: 'Computer Science',
            type: 'Final Exam',
            date: '2024-05-15',
            totalMarks: 100,
            duration: '3 hours',
            status: 'Upcoming',
        },
        {
            id: 'MATH201',
            title: 'Mathematics',
            type: 'Midterm',
            date: '2024-03-15',
            totalMarks: 50,
            duration: '2 hours',
            status: 'Completed',
        },
    ];

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming Exams</h2>
            {examData.map((exam) => (
                <ExamCard key={exam.id} exam={exam} />
            ))}
        </div>
    );
}