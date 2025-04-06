import { useState } from 'react';
import { Checkbox, TextField } from '@shopify/polaris';

interface NotificationSettings {
    creditLimit: number;
    orederCreatedEmail: boolean;
    creditTransactionsEmail: boolean;
    orderReturnedEmail: boolean;
    orderTrackingEmail: boolean;
    orderTrackingSMS: boolean;
}

type ColumnDef = {
    key: keyof NotificationSettings;
    header: string;
};

export function NotificationTab() {
    const [settings, setSettings] = useState<NotificationSettings>({
        creditLimit: 0,
        orederCreatedEmail: true,
        creditTransactionsEmail: true,
        orderReturnedEmail: false,
        orderTrackingEmail: false,
        orderTrackingSMS: false
    });

    const columns: ColumnDef[] = [
        { key: 'orederCreatedEmail', header: 'Order Created' },
        { key: 'creditTransactionsEmail', header: 'Credit Transactions' },
        { key: 'orderReturnedEmail', header: 'Order Returned' },
        { key: 'creditLimit', header: 'When credit goes below (0 to disable)' }
    ];

    const handleCheckboxChange = (key: keyof NotificationSettings) => {
        return (newChecked: boolean) => {
            setSettings(prev => ({ ...prev, [key]: newChecked }));
        };
    };

    const handleNumberChange = (value: string) => {
        setSettings(prev => ({ ...prev, creditLimit: parseInt(value) || 0 }));
    };

    return (
        <div className="p-6 border border-[#E3E3E3] rounded-xl">
            <h2 className="text-lg font-bold text-[#303030] mb-6">
                Notification Preferences
            </h2>
            <div className="flex flex-col gap-8">
                <div className="flex flex-col">
                    <h4 className="text-base font-semibold text-[#303030] pb-3">Notify Merchant</h4>
                    <table className="max-w-xl">
                        <thead>
                            <tr>
                                {columns.map(col => (
                                    <th key={col.key} className="pr-6 text-left text-sm font-medium text-[#303030] whitespace-nowrap">
                                        {col.header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {columns.map(col => (
                                    <td key={col.key} className="pr-6">
                                        {col.key === 'creditLimit' ? (
                                            <div className="w-32">
                                                <TextField
                                                    label=""
                                                    value={settings[col.key].toString()}
                                                    onChange={handleNumberChange}
                                                    autoComplete="off"
                                                    type="number"
                                                />
                                            </div>
                                        ) : (
                                            <Checkbox
                                                label="Email"
                                                checked={settings[col.key]}
                                                onChange={handleCheckboxChange(col.key)}
                                            />
                                        )}
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col">
                    <h4 className="text-base font-semibold text-[#303030] pb-3">Notify Customer</h4>
                    <h5 className="pr-6 text-left text-sm font-medium text-[#303030] whitespace-nowrap">Order Tracking</h5>
                    <Checkbox
                        label="Email"
                        checked={settings.orderTrackingEmail}
                        onChange={handleCheckboxChange('orderTrackingEmail')}
                    />
                    <Checkbox
                        label="SMS"
                        checked={settings.orderTrackingSMS}
                        onChange={handleCheckboxChange('orderTrackingSMS')}
                    />
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