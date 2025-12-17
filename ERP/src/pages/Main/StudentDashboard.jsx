import React, { useState } from 'react';
import {
  LayoutDashboard,
  UserPlus,
  CreditCard,
  Hotel,
  FileUp, // Corrected: FileUp for Exam icon
} from 'lucide-react';
import Header from "../../components/CommonComponent/DashHead";
import Sidebar from '../../components/CommonComponent/DashBar';
import DashboardContent from '../Student/Dashborad';
import FeesContent from '../Student/Fees';
import HostelContent from '../Student/Hostel';
import ExamContent from '../Student/Exam';

// The 'Register' component is now part of the content mapping.
import Register from '../../components/CommonComponent/Registration'; 

// Define the menu items for the student role
const studentMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'registration', label: 'Registration', icon: UserPlus },
  { id: 'fees', label: 'Fees', icon: CreditCard },
  { id: 'hostel', label: 'Hostel', icon: Hotel },
  // { id: "exam", label: "Exam", icon: FileUp }, // New menu item
];

export default function StudentDash() {
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email");
  const [activeItem, setActiveItem] = useState('dashboard');

  const renderContent = () => {
    switch (activeItem) {
      case 'dashboard':
        return <DashboardContent />;
      case 'registration':
        return <Register />; // Render the Registration page for 'Admissions'
      case 'fees':
        return <FeesContent />;
      case 'hostel':
        return <HostelContent />;
      // case 'exam':
      //   return <ExamContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header role={role} email={email} />
      <div className="flex flex-1">
        {/* The sidebar now lives within a flex container that will fill remaining height */}
        <Sidebar
          menuItems={studentMenuItems}
          activeItem={activeItem}
          setActiveItem={setActiveItem}
        />
        {/* Main content area */}
        <div className="flex-1 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}