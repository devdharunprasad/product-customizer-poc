import { TextField, Select } from '@shopify/polaris';
import { Tooltip } from './Tooltip';

interface InputFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    tooltip?: string;
    placeholder?: string;
    options?: { label: string; value: string }[];
    disabled?: boolean;
    type?: 'text' | 'email' | 'number';
    countryCode?: string;
    onCountryCodeChange?: (value: string) => void;
}

export function InputField({ 
    label, 
    value, 
    onChange, 
    tooltip, 
    placeholder,
    options,
    disabled,
    type = 'text',
    countryCode,
    onCountryCodeChange
}: InputFieldProps) {
    const countryOptions = [
        {label: '+91 India', value: '+91'},
        {label: '+1 USA', value: '+1'},
        {label: '+44 UK', value: '+44'}
    ];

    const showCountryCode = countryCode !== undefined && onCountryCodeChange !== undefined;

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#303030]">{label}</span>
                {tooltip && <Tooltip content={tooltip} />}
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
                            autoComplete={type === 'email' ? 'email' : 'off'}
                            type={type}
                            disabled={disabled}
                        />
                    )}
                </div>
            </div>
        </div>
    );
} 