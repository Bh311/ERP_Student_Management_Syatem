import React from 'react';

export default function HostelRules() {
    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Hostel Rules & Regulations</h2>
            
            <div className="space-y-6">
                <div>
                    <h3 className="font-bold text-orange-500 mb-2">General Rules</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                        <li>Maintain cleanliness in your room and common areas</li>
                        <li>No loud music or noise after 10:00 PM</li>
                        <li>Visitors must register at the reception</li>
                        <li>No smoking or alcohol consumption in the premises</li>
                        <li>Mess timings must be strictly followed</li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-orange-500 mb-2">Safety Guidelines</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                        <li>Always lock your room when leaving</li>
                        <li>Don't share room keys with unauthorized persons</li>
                        <li>Report any suspicious activity immediately</li>
                        <li>Follow fire safety protocols</li>
                        <li>Keep emergency contact numbers handy</li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-orange-500 mb-2">Violations & Penalties</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                        <li>First violation: Written warning</li>
                        <li>Second violation: Fine of ₹500</li>
                        <li>Repeated violations: Room cancellation</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}