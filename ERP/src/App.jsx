import React from "react"; 
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./pages/Main/WelcomePgae";
import Login from "./pages/Main/loginpage";
import StudentDash from "./pages/Main/StudentDashboard";
import AdminDash from "./pages/Main/AdminDashboard";
import setupAxiosInterceptors from './utils/axiosConfig.js'; 
import Cookies from 'js-cookie'; 

// CRITICAL: Activate the Axios interceptor globally
setupAxiosInterceptors();

// WARNING: This is a client-side only check, but stable for navigation.
const ProtectedRoute = ({ element, requiredRole }) => {
    // Check Cookies/localStorage data (the data that was explicitly set on login)
    const userRole = Cookies.get('role') || localStorage.getItem('role');
    const token = Cookies.get('token') || localStorage.getItem('token'); 
    
    // Simplest possible check: Is the token and role present?
    if (token && userRole === requiredRole) {
        return element; // Allow access
    } else {
        return <Navigate to="/login" />; // Redirect if the check fails
    }
};

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/studentdash" element={<ProtectedRoute element={<StudentDash />} requiredRole="student" />} />
                <Route path="/admindash" element={<ProtectedRoute element={<AdminDash />} requiredRole="admin" />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}