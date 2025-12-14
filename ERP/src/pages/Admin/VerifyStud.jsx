import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Hero from '../../components/CommonComponent/HeroSection';
import StatusFilter from '../../components/AdminComponent/StatusFilter';
import RecentApplications from '../../components/AdminComponent/RecentApplication';
import axios from 'axios';

export default function VerifyAdmissions() {
  const [applications, setApplications] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [isLoadingApplications, setIsLoadingApplications] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [statsData, setStatsData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0); // <-- NEW STATE TRIGGER
  const itemsPerPage = 10;
  
  // Define fetchStats so it can be called later for a refresh
  const fetchStats = async () => {
      try {
          const url = `/api/admin/admissions/dashboard/stats`;
          const response = await axios.get(url);
          setStatsData(response.data.data);
      } catch (err) {
          console.error("Error fetching stats:", err);
          setError("Failed to fetch dashboard statistics.");
      } finally {
          setIsLoadingStats(false);
      }
  };
  
  // Function for simple, local status updates (Verify, Reject)
  const handleStatusUpdate = (updatedApplication) => {
      setApplications(prevApplications =>
          prevApplications.map(app =>
              app._id === updatedApplication._id ? updatedApplication : app
          )
      );
  };

  // CRITICAL FIX: Function to handle complex updates (Enroll) by forcing a full data refresh
  const handleEnrollSuccess = () => {
      // 1. Increment the key to force the applications useEffect to re-run
      setRefreshKey(prevKey => prevKey + 1); 
      // 2. Also reset the page to 1
      setCurrentPage(1); 
      // 3. Force stats to re-fetch
      fetchStats();
  };

  // useEffect to fetch paginated applications data (runs on search, page, or refreshKey change)
  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoadingApplications(true);
      setError(null);
      try {
        const url = `/api/admin/admissions/dashboard/applications?page=${currentPage}&limit=${itemsPerPage}&name=${searchQuery}`;
        const response = await axios.get(url);
        
        setApplications(response.data.data);
        setTotalDocuments(response.data.totalDocuments);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setApplications([]);
          setTotalDocuments(0);
        } else if (err.response?.status === 401) {
          setError("You are not authorized. Please log in as an admin.");
        } else {
          setError("Failed to fetch applications. Please try again.");
        }
      } finally {
        setIsLoadingApplications(false);
      }
    };
    
    const delayDebounceFn = setTimeout(() => {
      fetchApplications();
    }, 500); 

    // CRITICAL: Add refreshKey to the dependency array
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, currentPage, refreshKey]); 

  // useEffect to fetch statistics data (runs once on mount and is called by handleEnrollSuccess)
  useEffect(() => {
    fetchStats();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };
  
  const filteredApplications = applications.filter(app => {
    if (selectedStatus === 'All Status') {
      return true;
    }
    return app.status === selectedStatus;
  });

  const totalPages = Math.ceil(totalDocuments / itemsPerPage);

  if (isLoadingApplications || isLoadingStats) {
    return <div className="p-8 text-center text-gray-500">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-8 bg-gray-100">
      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Verify Admissions</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-gray-100 rounded-lg p-2">
            <Search size={20} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search applications..."
              className="bg-transparent border-none focus:outline-none ml-2 text-gray-700"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <StatusFilter selectedOption={selectedStatus} setSelectedOption={setSelectedStatus} />
        </div>
      </div>
      
      {statsData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Hero title="Total Applications" value={statsData.total} valueColor="text-blue-600" />
          <Hero title="Verified" value={statsData.verified} valueColor="text-green-600" />
          <Hero title="Enrolled" value={statsData.enrolled} valueColor="text-purple-600" />
          <Hero title="Pending Review" value={statsData.pendingReview} valueColor="text-red-600" />
        </div>
      )}

      {/* Pass both the simple update handler and the full re-fetch handler */}
      <RecentApplications 
          applications={filteredApplications} 
          onStatusUpdate={handleStatusUpdate} 
          onEnrollSuccess={handleEnrollSuccess} // <-- This is now passed!
      />

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}