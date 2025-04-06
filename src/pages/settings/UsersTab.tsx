import { DataTable, Modal, TextField, Select } from '@shopify/polaris';
import { PlusIcon } from '@shopify/polaris-icons';
import { InfoIcon } from '@shopify/polaris-icons';
import { useState } from 'react';

interface NewUser {
    email: string;
    userType: string;
    permission: string;
}

export function UsersTab() {
    const rows = new Array(5).fill(['John Doe', 'john@gmail.com', '8858545858', '25th May 2024']);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newUser, setNewUser] = useState<NewUser>({
        email: '',
        userType: '',
        permission: ''
    });

    const handleChange = (field: keyof NewUser) => (value: string) => {
        setNewUser(prev => ({ ...prev, [field]: value }));
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setNewUser({ email: '', userType: '', permission: '' });
    };

    const handleSendInvite = () => {
        console.log('Sending invite to:', newUser);
        handleModalClose();
    };

    const userTypeOptions = [
        { label: 'Admin', value: 'admin' },
        { label: 'Manager', value: 'manager' },
        { label: 'Designer', value: 'designer' }
    ];

    const permissionOptions = [
        { label: 'Full Access', value: 'full' },
        { label: 'Limited Access', value: 'limited' }
    ];

    return (
        <div className="border border-[#E3E3E3] rounded-xl">
            <div className="flex flex-col gap-4 p-6 max-w-[1000px]">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-[#303030]">
                        Users List
                    </h2>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-3 py-[6px] bg-black text-white rounded-lg text-[13px] font-semibold hover:bg-[#1a1a1a] transition-colors"
                    >
                        <PlusIcon className="w-5 h-5 fill-white" />
                        <span>Add User</span>
                    </button>
                </div>

                <div className="border border-[#E3E3E3] rounded-lg overflow-hidden">
                    <DataTable
                        columnContentTypes={[
                            'text',
                            'text',
                            'text',
                            'text',
                        ]}
                        headings={[
                            'Name',
                            'Email ID',
                            'Phone',
                            'Actions',
                        ]}
                        rows={rows}
                        footerContent={`Showing ${rows.length} of ${rows.length} results`}
                    />
                </div>
            </div>

            <Modal
                open={isModalOpen}
                onClose={handleModalClose}
                title="Add a New User"
                primaryAction={{
                    content: 'Send Invite',
                    onAction: handleSendInvite,
                }}
                secondaryActions={[
                    {
                        content: 'Cancel',
                        onAction: handleModalClose,
                    },
                ]}
            >
                <Modal.Section>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-[#303030]">Email ID</span>
                                <div className="group relative">
                                    <InfoIcon className="w-5 h-5 text-[#616161] fill-[#616161]" />
                                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-[#303030] text-white text-xs rounded-lg z-30">
                                        Enter the email address of the user you want to invite
                                        <div className="absolute -bottom-1 left-2 w-2 h-2 bg-[#303030] rotate-45"></div>
                                    </div>
                                </div>
                            </div>
                            <TextField
                                label=""
                                labelHidden
                                value={newUser.email}
                                onChange={handleChange('email')}
                                type="email"
                                autoComplete="email"
                                placeholder="Enter email address"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-[#303030]">User Type</span>
                                    <div className="group relative">
                                        <InfoIcon className="w-5 h-5 text-[#616161] fill-[#616161]" />
                                        <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-[#303030] text-white text-xs rounded-lg z-30">
                                            Select the role type for the user you are inviting
                                            <div className="absolute -bottom-1 left-2 w-2 h-2 bg-[#303030] rotate-45"></div>
                                        </div>
                                    </div>
                                </div>
                                <Select
                                    label=""
                                    labelHidden
                                    options={userTypeOptions}
                                    onChange={handleChange('userType')}
                                    value={newUser.userType}
                                    placeholder="Select user type"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-[#303030]">Grant Permission</span>
                                    <div className="group relative">
                                        <InfoIcon className="w-5 h-5 text-[#616161] fill-[#616161]" />
                                        <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-[#303030] text-white text-xs rounded-lg z-30">
                                            Choose the access level for this user
                                            <div className="absolute -bottom-1 left-2 w-2 h-2 bg-[#303030] rotate-45"></div>
                                        </div>
                                    </div>
                                </div>
                                <Select
                                    label=""
                                    labelHidden
                                    options={permissionOptions}
                                    onChange={handleChange('permission')}
                                    value={newUser.permission}
                                    placeholder="Select permission level"
                                />
                            </div>
                        </div>
                    </div>
                </Modal.Section>
            </Modal>
        </div>
    );
} 