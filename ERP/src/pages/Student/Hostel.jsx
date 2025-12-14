import React, { useState } from 'react';
import TabSwitcher from '../../components/CommonComponent/TabSwitcher';
import HostelDetails from '../../components/StudentComponent/HostelDetails';
import BlockFacilities from '../../components/StudentComponent/BlockFacilities';
import HostelRules from '../../components/StudentComponent/HostelRules';
import Maintenance from '../../components/StudentComponent/Maintenance';

export default function HostelContent() {
    const tabs = ['Block Facilities', 'Hostel Rules', 'Maintenance'];
    const [activeTab, setActiveTab] = useState(tabs[0]);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Block Facilities':
                return <BlockFacilities />;
            case 'Hostel Rules':
                return <HostelRules />;
            case 'Maintenance':
                return <Maintenance />;
            default:
                return <BlockFacilities />;
        }
    };

    return (
        <div className="p-8 bg-gray-100">
            <HostelDetails />
            <div className="m-6 grid grid-cols-2">
                <TabSwitcher tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
            {renderTabContent()}
        </div>
    );
}