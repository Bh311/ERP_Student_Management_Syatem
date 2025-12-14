import React, { useState } from 'react';
import Hero from '../../components/CommonComponent/HeroSection';
import TabSwitcher from '../../components/CommonComponent/TabSwitcher';
import ExamList from '../../components/StudentComponent/ExamList';
import ExamResults from '../../components/StudentComponent/ExamResults';
import ExamCalendar from '../../components/StudentComponent/ExamCalendar';
import { GraduationCap, TrendingUp, CheckCircle } from 'lucide-react'; // Import the new icons

export default function ExamContent() {
    const [activeTab, setActiveTab] = useState('Exams');
    const tabs = ['Exams', 'Results', 'Calendar'];

    const renderContent = () => {
        switch (activeTab) {
            case 'Exams':
                return <ExamList />;
            case 'Results':
                return <ExamResults />;
            case 'Calendar':
                return <ExamCalendar />;
            default:
                return <ExamList />;
        }
    };

    return (
        <div className="p-8 bg-gray-100">
            {/* Header section with title and stats */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Exam Records</h1>
                    <p className="text-sm text-gray-500">Your academic performance and exam schedules</p>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="bg-green-100 text-green-700 font-semibold text-xs px-2 py-1 rounded-full">CGPA: 8.7</span>
                    <span className="bg-blue-100 text-blue-600 font-semibold text-xs px-2 py-1 rounded-full">SGPA: 9</span>
                </div>
            </div>

            {/* Hero cards section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/* Current CGPA */}
                <Hero
                    title="Current CGPA"
                    value="8.7"
                    status="+0.1 from last sem"
                    icon={<GraduationCap className="text-green-600" size={20} />}
                    color="bg-green-100"
                    valueColor="text-gray-800"
                    statusColor="text-green-600"
                />

                {/* Current SGPA */}
                <Hero
                    title="Current SGPA"
                    value="9"
                    status="Semester 6"
                    icon={<TrendingUp className="text-blue-600" size={20} />}
                    color="bg-blue-100"
                    valueColor="text-gray-800"
                    statusColor="text-gray-500"
                />

                {/* Overall Attendance */}
                <Hero
                    title="Overall Attendance"
                    value="93%"
                    status={null}
                    icon={<CheckCircle className="text-purple-600" size={20} />}
                    color="bg-purple-100"
                    valueColor="text-gray-800"
                    showProgressBar={true}
                    progressBarValue={93}
                />

                {/* Rank in Class */}
                <Hero
                    title="Rank in Class"
                    value="3rd"
                    status="Out of 45 students"
                    icon={<TrendingUp className="text-orange-500" size={20} />}
                    color="bg-orange-100"
                    valueColor="text-red-600"
                    statusColor="text-gray-500"
                />
            </div>

            {/* Tab switcher */}
            <div className="grid grid-cols-2 mb-6">
                <TabSwitcher tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            {/* The dynamically rendered content */}
            {renderContent()}
        </div>
    );
}