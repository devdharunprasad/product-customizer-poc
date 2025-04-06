import { TextField, Select } from '@shopify/polaris';
import { InfoIcon } from '@shopify/polaris-icons';
import { useState } from 'react';

interface InputFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    tooltip?: string;
    placeholder?: string;
    countryCode?: string;
    onCountryCodeChange?: (value: string) => void;
    type?: "text" | "email" | "number";
}

function InputField({ 
    label, 
    value, 
    onChange, 
    tooltip, 
    placeholder,
    countryCode,
    onCountryCodeChange,
    type = "text"
}: InputFieldProps) {
    const countryOptions = [
        {label: '+91 India', value: '+91'},
        {label: '+1 USA', value: '+1'},
        {label: '+44 UK', value: '+44'}
    ];

    const showCountryCode = countryCode !== undefined && onCountryCodeChange !== undefined;

    return (
        <div className="flex flex-col gap-1 max-w-[600px]">
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#303030]">{label}</span>
                {tooltip && (
                    <div className="group relative">
                        <InfoIcon className="w-5 h-5 text-[#616161] fill-[#616161]" />
                        <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-[#303030] text-white text-xs rounded-lg z-30">
                            {tooltip}
                            <div className="absolute -bottom-1 left-2 w-2 h-2 bg-[#303030] rotate-45"></div>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex gap-2">
                {showCountryCode && (
                    <div className="w-[120px]">
                        <Select
                            label=""
                            labelHidden
                            options={countryOptions}
                            onChange={onCountryCodeChange}
                            value={countryCode}
                        />
                    </div>
                )}
                <div className={`${showCountryCode ? 'flex-1' : 'w-full'}`}>
                    <TextField
                        label=""
                        labelHidden
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        autoComplete={type === 'email' ? 'email' : 'off'}
                        type={type}
                    />
                </div>
            </div>
        </div>
    );
}

export function ProfileTab() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        countryCode: '+91',
        email: '',
        storeName: ''
    });

    const handleChange = (field: keyof typeof formData) => (value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="p-6 border border-[#E3E3E3] rounded-xl">
            <div className="flex flex-col gap-8">
                {/* Account Information */}
                <div>
                    <h2 className="text-lg font-bold text-[#303030] mb-6">Account Information</h2>
                    <div className="grid grid-cols-2 gap-6">
                        <InputField
                            label="First Name"
                            value={formData.firstName}
                            onChange={handleChange('firstName')}
                            placeholder="Enter your first name"
                            tooltip="Your first name as it appears on official documents"
                        />
                        <InputField
                            label="Last Name"
                            value={formData.lastName}
                            onChange={handleChange('lastName')}
                            placeholder="Enter your last name"
                            tooltip="Your last name as it appears on official documents"
                        />
                        <InputField
                            label="Phone Number"
                            value={formData.phoneNumber}
                            onChange={handleChange('phoneNumber')}
                            placeholder="Enter your phone number"
                            tooltip="Your contact number for account-related communications"
                            countryCode={formData.countryCode}
                            onCountryCodeChange={handleChange('countryCode')}
                            type="number"
                        />
                        <InputField
                            label="Email"
                            value={formData.email}
                            onChange={handleChange('email')}
                            placeholder="Enter your email"
                            tooltip="Your email address for account notifications"
                            type="email"
                        />
                    </div>
                </div>

                {/* Store Information */}
                <div>
                    <div className="flex flex-col gap-2 mb-6">
                        <h2 className="text-lg font-bold text-[#303030]">Store Information</h2>
                        <p className="text-[13px] text-[#616161]">
                            Your store name will be shown on Ship from field on shipping label
                        </p>
                    </div>
                    <InputField
                        label="Store Name"
                        value={formData.storeName}
                        onChange={handleChange('storeName')}
                        placeholder="Enter your store name"
                        tooltip="The name of your store as it appears to customers"
                    />
                </div>

                <div className="flex justify-start">
                    <button className="px-3 py-[6px] bg-black text-white rounded-lg text-[13px] font-semibold hover:bg-[#1a1a1a] transition-colors">
                        Next Step
                    </button>
                </div>
            </div>
        </div>
    );
} 