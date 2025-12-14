import React, { useState, useEffect } from 'react';
import { Search, Bed, Users, Clock, Building2 } from 'lucide-react';
import Hero from '../../components/CommonComponent/HeroSection';
import Option from "../../components/CommonComponent/TabSwitcher";

import BlockOverview from '../../components/AdminComponent/BlockOverview';
import RoomRequests from '../../components/AdminComponent/RoomRequests';
import WaitingList from '../../components/AdminComponent/WaitingList';
import axios from "axios";

export default function Hostel() {
    const [activeTab, setActiveTab] = useState('Block Overview');
    const [search, setSearch] = useState("");
    const [stats, setStats] = useState({
        totalCapacity: 0,
        currentOccupancy: 0,
        currentOccupancyPercent: 0,
        availableRooms: 0,
        allotedRooms: 0,
    });

    const tabs = ['Block Overview', 'Room Requests', 'Room Alloted'];

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSearch(""); 
    };

    // ⭐ Redirect to Room Requests
    const goToRoomRequests = () => {
        setActiveTab("Room Requests");
        setSearch("");
    };

    // Fetch Stats
    const fetchStats = async () => {
        try {
            const res = await axios.get("/api/admin/hostels/stats", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setStats(res.data.data);
        } catch (error) {
            console.log("Error loading stats:", error);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const renderContent = () => {
        switch (activeTab) {
            case 'Block Overview':
                return <BlockOverview search={search} />;
            case 'Room Requests':
                return <RoomRequests search={search} />;
            case 'Room Alloted':
                return <WaitingList search={search} />;
            default:
                return <BlockOverview search={search} />;
        }
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">

            {/* HEADER */}
            <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Hostel Management</h1>

                <div className="flex items-center space-x-4">

                    {/* SEARCH */}
                    <div className="flex items-center bg-gray-100 rounded-lg p-2">
                        <Search size={20} className="text-gray-500" />
                        <input
                            type="text"
                            placeholder={
                                activeTab === "Block Overview"
                                    ? "Search H1, H2, Boys, Girls..."
                                    : "Search student name or ID..."
                            }
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-transparent border-none focus:outline-none ml-2 text-gray-700"
                        />
                    </div>

                    {/* ⭐ UPDATED ASSIGN ROOM BUTTON */}
                    <button
                        onClick={goToRoomRequests}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700"
                    >
                        <Users size={16} />
                        <span>Review Requests</span>
                    </button>
                </div>
            </div>

            {/* HERO CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">

                <Hero
                    title="Total Capacity"
                    value={stats.totalCapacity}
                    status="students"
                    icon={<Building2 size={20} className="text-blue-600" />}
                    color="bg-blue-100"
                />

                <Hero
                    title="Current Occupancy"
                    value={`${stats.currentOccupancyPercent}%`}
                    status={`${stats.currentOccupancy} students`}
                    icon={<Users size={20} className="text-green-600" />}
                    color="bg-green-100"
                />

                <Hero
                    title="Available Rooms"
                    value={stats.availableRooms}
                    status="across all blocks"
                    icon={<Bed size={20} className="text-orange-500" />}
                    color="bg-orange-100"
                />

                <Hero
                    title="Alloted Rooms"
                    value={stats.allotedRooms}
                    status="rooms filled"
                    icon={<Clock size={20} className="text-red-600" />}
                    color="bg-red-100"
                />
            </div>

            {/* TABS */}
            <div className="mb-6">
                <Option tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
            </div>

            {/* CONTENT */}
            {renderContent()}
        </div>
    );
}
