import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

export default function ExamCalendar() {
    return (
        <div className="p-6 bg-white rounded-lg shadow-md flex flex-col items-center justify-center h-96">
            <CalendarIcon size={64} className="text-gray-400 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Exam Calendar</h2>
            <p className="text-gray-600">Your exam schedule will be displayed here.</p>
        </div>
    );
}