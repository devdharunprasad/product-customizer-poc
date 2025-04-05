import { useState } from "react";
import { Navbar } from "../layout/Navbar";
import { SideMenu } from "../layout/SideMenu";
import { InfoIcon, SelectIcon } from '@shopify/polaris-icons';

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

const InputField = ({ label, placeholder, type = "text", value, onChange, hasCountryCode = false }: { label: string, placeholder: string, type: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, hasCountryCode: boolean }) => (
<div className="flex flex-col gap-1">
    <div className="flex items-center gap-2">
    <label className="text-sm font-medium text-black">{label}</label>
    <InfoIcon className="w-5 h-5" />
    </div>
    <div className={`flex ${hasCountryCode ? 'gap-1' : ''}`}>
    {hasCountryCode && (
        <div className="flex items-center gap-1 px-3 py-[6px] w-[68px] bg-[#FDFDFD] border border-[#8A8A8A] rounded-lg">
        <span className="text-[13px] text-[#303030]">+91</span>
        <SelectIcon className="w-4 h-4" />
        </div>
    )}
    <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`px-3 py-[6px] bg-[#FDFDFD] border border-[#8A8A8A] rounded-lg text-xs text-[#616161] placeholder-[#616161] focus:outline-none focus:border-black ${
        hasCountryCode ? 'flex-1' : 'w-[448px]'
        }`}
    />
    </div>
</div>
);

export function Settings() {
    const [activeTab, setActiveTab] = useState('Profile');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        storeName: ''
      });
    
      const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>  ) => {
        setFormData(prev => ({
          ...prev,
          [field]: e.target.value
        }));
      };
    
      const tabs = [
        'Profile',
        'Business and Banking Info',
        'Users',
        'Courier',
        'Notification'
      ];

  return (
    <div>
        <Navbar />
        <div className="flex bg-[#1A1A1A] min-h-[calc(100vh-64px)]">
            <SideMenu activeTab="settings" />

            <div className="flex-1">
                <div className="bg-[#F5F5F5] min-h-[calc(100vh-64px)] p-8">
                    <div className="flex flex-col gap-8">
                    {/* Header */}
                    <div className="flex flex-col gap-5">
                        <h1 className="text-2xl font-bold text-[#121212]">
                        Settings
                        </h1>
                    </div>

                    {/* Main Content */}
                    <div className="bg-white rounded-xl p-6 border border-[#E3E3E3]">
                        {/* Tabs */}
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

                        {/* Form Content */}
                        <div className="flex flex-col gap-8">
                        {/* Account Information Section */}
                        <div className="flex flex-col gap-3">
                            <h2 className="text-base font-semibold text-[#303030]">
                            Account Information
                            </h2>
                            <div className="grid grid-cols-2 gap-5">
                            <InputField
                                label="Full Name"
                                placeholder="Enter your full name"
                                type="text"
                                value={formData.firstName}
                                onChange={handleInputChange('firstName')}
                                hasCountryCode={false}
                            />
                            <InputField
                                label="Last Name"
                                placeholder="Enter your last name here"
                                type="text"
                                value={formData.lastName}
                                onChange={handleInputChange('lastName')}
                                hasCountryCode={false}
                            />
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                            <InputField
                                label="Phone Number"
                                placeholder="Enter your phone number here"
                                type="tel"
                                value={formData.phone}
                                onChange={handleInputChange('phone')}
                                hasCountryCode={true}
                            />
                            <InputField
                                label="Email"
                                placeholder="Enter your email ID here"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange('email')}
                                hasCountryCode={false}
                            />
                            </div>
                        </div>

                        {/* Store Information Section */}
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-3">
                            <h2 className="text-base font-semibold text-[#303030]">
                                Store Information
                            </h2>
                            <p className="text-[13px] text-[#616161]">
                                Your store name will be shown on Ship from field on shipping label
                            </p>
                            </div>
                            <InputField
                                label="Your Store Name"
                                placeholder="Enter your store name here"
                                type="text"
                                value={formData.storeName}
                                onChange={handleInputChange('storeName')}
                                hasCountryCode={false}
                            />
                        </div>

                        {/* Next Step Button */}
                        <div className="flex justify-start mt-4">
                            <button className="px-3 py-[6px] bg-black text-white rounded-lg text-[13px] font-semibold hover:bg-[#1a1a1a] transition-colors">
                            Next Step
                            </button>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}