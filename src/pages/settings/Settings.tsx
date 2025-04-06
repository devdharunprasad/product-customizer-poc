import { useState } from "react";
import { Navbar } from "../../layout/Navbar";
import { SideMenu } from "../../layout/SideMenu";
import { ProfileTab } from "./ProfileTab";
import { UsersTab } from "./UsersTab";
import { NotificationTab } from "./NotificationTab";
import { BusinessTab } from "./BusinessTab";
import { CourierTab } from "./CourierTab";

const TabButton = ({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`px-3 py-2 rounded-[6.5px] text-sm font-semibold transition-colors ${
        isActive ? 'bg-[#F0F0F0] text-[#272727]' : 'text-[#616161] hover:bg-[#F5F5F5]'
        }`}
    >
        {label}
    </button>
);

export function Settings() {
    const [activeTab, setActiveTab] = useState('Profile');

    const tabs = [
        'Profile',
        'Business and Banking Info',
        'Users',
        'Courier',
        'Notification'
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Profile':
                return <ProfileTab/>;
            case 'Business and Banking Info':
                return <BusinessTab />;
            case 'Users':
                return <UsersTab />;
            case 'Courier':
                return <CourierTab />;
            case 'Notification':
                return <NotificationTab />;
            default:
                return null;
        }
    };

    return (
        <div>
            <Navbar />
            <div className="flex bg-[#1A1A1A] min-h-[calc(100vh-64px)]">
                <SideMenu activeTab="settings" />

                <div className="flex-1">
                    <div className="bg-[#F5F5F5] min-h-[calc(100vh-64px)] p-8">
                        <div className="flex flex-col gap-8">
                            <div className="flex flex-col gap-5">
                                <h1 className="text-2xl font-bold text-[#121212]">
                                    Settings
                                </h1>
                            </div>

                            <div className="bg-white rounded-xl p-6 border border-[#E3E3E3]  max-w-[75vw]">
                                <div className="flex gap-1 mb-4">
                                    {tabs.map(tab => (
                                        <TabButton
                                            key={tab}
                                            label={tab}
                                            isActive={activeTab === tab}
                                            onClick={() => setActiveTab(tab)}
                                        />
                                    ))}
                                </div>

                                {renderTabContent()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}