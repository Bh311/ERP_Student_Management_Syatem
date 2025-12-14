import React, { useEffect, useState } from "react";
import axios from "axios";

function BlockCard({ block }) {
  const getOccupancyColor = (occupancy) => {
    if (occupancy >= 90) return "bg-red-500";
    if (occupancy >= 80) return "bg-orange-500";
    return "bg-green-500";
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-gray-800">{block.name}</h3>
      <span className="text-sm text-gray-500">{block.floors} Floors</span>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xl font-bold text-gray-700">
            {block.roomsOccupied}/{block.totalRooms}
          </p>
          <span className="text-sm text-gray-500">Rooms</span>
        </div>

        <div>
          <p className="text-xl font-bold text-gray-700">
            {block.bedsOccupied}/{block.totalBeds}
          </p>
          <span className="text-sm text-gray-500">Beds</span>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm font-semibold text-gray-700 mb-1">
          Occupancy {block.occupancy}%
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${getOccupancyColor(
              block.occupancy
            )}`}
            style={{ width: `${block.occupancy}%` }}
          ></div>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <h4 className="font-semibold">Amenities</h4>
        <p className="mt-1">{block.amenities.join(", ")}</p>
      </div>
    </div>
  );
}

export default function BlockOverview({ search }) {
  const [blocks, setBlocks] = useState([]);

  const fetchBlocks = async () => {
    try {
      const response = await axios.get("/api/admin/hostels/overview", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setBlocks(response.data.blocks);
    } catch (error) {
      console.error("Error fetching block overview:", error);
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  const filteredBlocks = blocks.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.gender.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {filteredBlocks.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          No matching blocks found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlocks.map((block) => (
            <BlockCard key={block.name} block={block} />
          ))}
        </div>
      )}
    </div>
  );
}
