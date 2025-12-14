import React from 'react';
import { Box, Wrench, UserRound, Mail, Phone, Clock } from 'lucide-react';

export default function BlockFacilities() {
    const facilities = [
        { name: 'Common Room', details: 'Ground Floor • 24/7 Access', icon: <Box className="text-blue-500" /> },
        { name: 'Laundry Room', details: 'Basement • 6 AM - 10 PM', icon: <Wrench className="text-green-500" /> },
        { name: 'Study Hall', details: '1st Floor • Silent Zone', icon: <UserRound className="text-purple-500" /> },
    ];
    const contactInfo = {
        warden: '+91 98765 43210',
        email: 'hostel.blocka@university.edu',
        emergency: 'Security Office',
    };
    const operatingHours = {
        entryExit: '6:00 AM - 11:00 PM',
        visitor: '10:00 AM - 8:00 PM',
        nightEntry: 'Special Permission Required',
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Block A Facilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Facilities List */}
                <div className="space-y-4">
                    {facilities.map((facility, index) => (
                        <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gray-100">
                                {facility.icon}
                            </div>
                            <div>
                                <p className="font-bold text-gray-800">{facility.name}</p>
                                <p className="text-sm text-gray-500">{facility.details}</p>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Right Column: Contact & Operating Hours */}
                <div className="space-y-6">
                    <div>
                        <h3 className="font-bold text-gray-700 mb-2">Contact Information</h3>
                        <div className="space-y-2 text-gray-600">
                            <div className="flex items-center space-x-2">
                                <Phone size={16} />
                                <span>Warden: {contactInfo.warden}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Mail size={16} />
                                <span>{contactInfo.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <UserRound size={16} />
                                <span>Emergency: {contactInfo.emergency}</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-700 mb-2">Operating Hours</h3>
                        <div className="space-y-2 text-gray-600">
                            <p>Entry/Exit: {operatingHours.entryExit}</p>
                            <p>Visitor Hours: {operatingHours.visitor}</p>
                            <p>Night Entry: {operatingHours.nightEntry}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}