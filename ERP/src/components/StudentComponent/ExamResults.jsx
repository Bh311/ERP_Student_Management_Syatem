import React from 'react';

export default function ExamResults() {
    const resultsData = [
        { id: 'CS301', title: 'Computer Science', grade: 'A', score: '92/100', status: 'Passed' },
        { id: 'MATH201', title: 'Mathematics', grade: 'B+', score: '88/100', status: 'Passed' },
        { id: 'PHYS101', title: 'Physics', grade: 'C', score: '70/100', status: 'Passed' },
    ];

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Exam Results</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {resultsData.map((result) => (
                            <tr key={result.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.grade}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.score}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">{result.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}