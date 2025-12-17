import React, { useState } from "react";
import { BarChart2, UserPlus, CreditCard, Hotel, FileUp, } from "lucide-react";
import axios from 'axios';
import Header from "../../components/CommonComponent/DashHead";
import Sidebar from "../../components/CommonComponent/DashBar";
import Analytics from "../Admin/Analytics";
import VerifyAdmissions from "../Admin/VerifyStud";
import CreateFeeStructure from "../../components/AdminComponent/CreateFeeStrucutre";
import ManageFees from "../Admin/FeeManage";
import HostelManagement from "../Admin/HostelManage";
import ExamUploads from "../Admin/ExamUploads";

const adminMenuItems = [
    { id: "analytics", label: "Analytics", icon: BarChart2 },
    { id: "verify-admissions", label: "Verify Admissions", icon: UserPlus },
    { id: "manage-fees", label: "Manage Fees", icon: CreditCard },
    { id: "hostel-management", label: "Hostel Management", icon: Hotel },
    // { id: "exam-uploads", label: "Exam Uploads", icon: FileUp },
];

export default function AdminDash() {
    // This code now relies entirely on the data saved in localStorage
    const role = localStorage.getItem("role");
    const email = localStorage.getItem("email");
    const [activeItem, setActiveItem] = useState("analytics");
    const token = localStorage.getItem("token"); // Get the token from localStorage

    // Now, you must configure axios to send this token with every request.
    // A good place for this is in a separate config file or at the top level.
    // Example: axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const renderContent = () => {
        // The check is now based on whether the role exists in localStorage
        if (!role || !token) {
            // This is a client-side check, which can be bypassed
            return <div>Unauthorized. Please log in.</div>;
        }

        switch (activeItem) {
            case "analytics":
                return <Analytics />;
            case "verify-admissions":
                return <VerifyAdmissions />;
             case "manage-fees":
                return <ManageFees />;
            case "manage-fees-create": // <-- New case for the sub-menu item
                return <CreateFeeStructure />; // <-- Renders the new form
            case "hostel-management":
                return <HostelManagement />;
            // case "exam-uploads":
            //     return <ExamUploads />;
            default:
                return <Analytics />;
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <Header role={role} email={email} />
            <div className="flex flex-1">
                <Sidebar
                    menuItems={adminMenuItems}
                    activeItem={activeItem}
                    setActiveItem={setActiveItem}
                />
                <div className="flex-1 h-screen overflow-auto">{renderContent()}</div>
            </div>
        </div>
    );
}