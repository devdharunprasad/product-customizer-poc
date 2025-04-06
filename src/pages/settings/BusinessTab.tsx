import { useState, useEffect } from 'react';
import { Select, TextField } from '@shopify/polaris';
import { InfoIcon } from '@shopify/polaris-icons';
import { Country, State, City, ICountry, IState, ICity } from 'country-state-city';

interface BusinessInfo {
    companyName: string;
    storeName: string;
    country: string;
    state: string;
    city: string;
    pincode: string;
    addressLine1: string;
    addressLine2: string;
    gstin: string;
    bankHolderName: string;
    accountNumber: string;
    ifscCode: string;
}

interface LocationData {
    country: string;
    state: string;
    city: string;
}

interface InputFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    tooltip?: string;
    placeholder?: string;
    options?: { label: string; value: string }[];
    disabled?: boolean;
    type?: 'text' | 'number';
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, tooltip, placeholder, options, disabled, type = 'text' }) => {
    return (
        <div className="flex flex-col gap-2">
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
            {options ? (
                <Select
                    label=""
                    labelHidden
                    options={options}
                    onChange={onChange}
                    value={value}
                    placeholder={placeholder}
                    disabled={disabled}
                />
            ) : (
                <TextField
                    label=""
                    labelHidden
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    type={type}
                    disabled={disabled}
                    autoComplete="off"
                />
            )}
        </div>
    );
};

export function BusinessTab() {
    const [info, setInfo] = useState<BusinessInfo>({
        companyName: '',
        storeName: '',
        country: '',
        state: '',
        city: '',
        pincode: '',
        addressLine1: '',
        addressLine2: '',
        gstin: '',
        bankHolderName: '',
        accountNumber: '',
        ifscCode: ''
    });

    const [locationData, setLocationData] = useState<LocationData>({
        country: '',
        state: '',
        city: ''
    });

    const [options, setOptions] = useState({
        countries: [] as Array<{label: string; value: string}>,
        states: [] as Array<{label: string; value: string}>,
        cities: [] as Array<{label: string; value: string}>
    });

    // Load countries on component mount
    useEffect(() => {
        const countries = Country.getAllCountries().map((country: ICountry) => ({
            label: country.name,
            value: country.isoCode
        }));
        setOptions(prev => ({ ...prev, countries }));
    }, []);

    // Load states when country changes
    useEffect(() => {
        if (locationData.country) {
            const states = State.getStatesOfCountry(locationData.country).map((state: IState) => ({
                label: state.name,
                value: state.isoCode
            }));
            setOptions(prev => ({ ...prev, states, cities: [] }));
            setLocationData(prev => ({ ...prev, state: '', city: '', pincode: '' }));
        }
    }, [locationData.country]);

    // Load cities when state changes
    useEffect(() => {
        if (locationData.country && locationData.state) {
            const cities = City.getCitiesOfState(locationData.country, locationData.state).map((city: ICity) => ({
                label: city.name,
                value: city.name
            }));
            setOptions(prev => ({ ...prev, cities }));
            setLocationData(prev => ({ ...prev, city: '', pincode: '' }));
        }
    }, [locationData.country, locationData.state]);

    // Auto-fill pincode when city is selected (this would need to be integrated with a pincode API)
    useEffect(() => {
        if (locationData.city) {
            // This is a placeholder. You would need to integrate with a pincode API
            // For now, we'll just clear the pincode to let user enter it manually
            setLocationData(prev => ({ ...prev, pincode: '' }));
        }
    }, [locationData.city]);

    const handleChange = (field: keyof BusinessInfo) => (value: string) => {
        setInfo(prev => ({ ...prev, [field]: value }));
    };

    const handleLocationChange = (field: keyof LocationData) => (value: string) => {
        setLocationData(prev => ({ ...prev, [field]: value }));
        // Update the main form data as well
        setInfo(prev => ({ ...prev, [field]: value }));
    };

    const businessFields = [
        { key: 'companyName', label: 'Company Name', tooltip: 'Legal name of your company', placeholder: 'Enter your company name', isLocation: false, type: 'text' as const },
        { key: 'storeName', label: 'Store Name', tooltip: 'Name of your online store', placeholder: 'Enter your store name', isLocation: false, type: 'text' as const },
        { key: 'country', label: 'Country', isLocation: true, tooltip: 'Country where your business is registered', placeholder: 'Select your country', type: 'text' as const },
        { key: 'state', label: 'State', isLocation: true, tooltip: 'State where your business is located', placeholder: 'Select your state', type: 'text' as const },
        { key: 'city', label: 'City', isLocation: true, tooltip: 'City where your business is located', placeholder: 'Enter your city', type: 'text' as const },
        { key: 'pincode', label: 'Pincode', tooltip: 'Postal code of your business location', placeholder: 'Enter pincode', isLocation: false, type: 'number' as const },
        { key: 'addressLine1', label: 'Address Line 1', tooltip: 'Primary address of your business', placeholder: 'Enter address line 1', isLocation: false, type: 'text' as const },
        { key: 'addressLine2', label: 'Address Line 2', tooltip: 'Additional address details (optional)', placeholder: 'Enter address line 2', isLocation: false, type: 'text' as const },
        { key: 'gstin', label: 'GSTIN', tooltip: 'Your GST Identification Number', placeholder: 'Enter GSTIN', isLocation: false, type: 'text' as const }
    ] as const;

    const bankFields = [
        { key: 'bankHolderName', label: 'Bank Holder Name', tooltip: 'Name as it appears on your bank account', placeholder: 'Enter bank holder name', type: 'text' as const },
        { key: 'accountNumber', label: 'Account Number', tooltip: 'Your bank account number', placeholder: 'Enter account number', type: 'number' as const },
        { key: 'ifscCode', label: 'IFSC Code', tooltip: 'IFSC code of your bank branch', placeholder: 'Enter IFSC code', type: 'text' as const }
    ] as const;

    return (
        <div className="p-6 border border-[#E3E3E3] rounded-xl">
            <div className="flex flex-col gap-8">
                <div className="flex flex-col">
                    <h4 className="text-base font-semibold text-[#303030] pb-3">Business Information</h4>
                    <div className="grid grid-cols-2 gap-6">
                        {businessFields.map(field => (
                            <InputField
                                key={field.key}
                                label={field.label}
                                value={field.isLocation ? locationData[field.key] : info[field.key]}
                                onChange={field.isLocation ? handleLocationChange(field.key) : handleChange(field.key)}
                                options={field.key === 'country' ? options.countries : 
                                        field.key === 'state' ? options.states :
                                        field.key === 'city' ? options.cities : undefined}
                                disabled={field.key === 'state' ? !locationData.country :
                                         field.key === 'city' ? !locationData.state : false}
                                tooltip={field.tooltip}
                                placeholder={field.placeholder}
                                type={field.type}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex flex-col">
                    <h4 className="text-base font-semibold text-[#303030] pb-3">Bank Details</h4>
                    <div className="grid grid-cols-2 gap-6">
                        {bankFields.map(field => (
                            <InputField
                                key={field.key}
                                label={field.label}
                                value={info[field.key]}
                                onChange={handleChange(field.key)}
                                tooltip={field.tooltip}
                                placeholder={field.placeholder}
                                type={field.type}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex justify-start">
                    <button className="px-3 py-[6px] bg-black text-white rounded-lg text-[13px] font-semibold hover:bg-[#1a1a1a] transition-colors">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
} 