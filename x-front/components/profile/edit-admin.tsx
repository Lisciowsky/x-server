import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetFooter,
    SheetTitle,
    SheetDescription,
} from '../ui/sheet'; // Adjust the import path as needed

import { UserInfo } from '@/models/user';

interface EditAccountProps {
    userInfo: UserInfo;
    onCancel: () => void;
}

function EditAdminComponent({ userInfo, onCancel }: EditAccountProps) {
    const [role, setRole] = useState(userInfo.role);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setRole(event.target.value);
    };

    const handlePasswordChange = () => {
        console.log(`Changing password for user ${userInfo.username}`);
        // Implement logic for changing password
        // Reset password fields after change
        setCurrentPassword('');
        setNewPassword('');
    };

    const handleSaveChanges = () => {
        console.log(`Saving changes for user ${userInfo.username} with new role: ${role}`);
        // Implement logic for saving role change
        onCancel(); // Optionally close the sheet upon saving
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button>Edit Role and Password</Button>
            </SheetTrigger>
            <SheetContent>
            <div className="space-y-4 p-4 bg-cultured text-rich-black">
                <SheetHeader>
                    <SheetTitle>Edit User</SheetTitle>
                    <SheetDescription>Manage user role and password.</SheetDescription>
                </SheetHeader>
                
                    <div className="space-y-1">
                        <Label htmlFor="role-select">Role</Label>
                        <select
                            id="role-select"
                            value={role}
                            onChange={handleRoleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input 
                            id="current-password" 
                            type="password" 
                            value={currentPassword} 
                            onChange={(e) => setCurrentPassword(e.target.value)} 
                        />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input 
                            id="new-password" 
                            type="password" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)} 
                        />
                    </div>
                <SheetFooter className='grid grid-cols-2 justify-center'>
                    <Button onClick={handlePasswordChange}>Save Password</Button>
                    <Button onClick={handleSaveChanges}>Save Role</Button>
                </SheetFooter>
                <SheetFooter className='justify-center'>
                    <Button onClick={onCancel}>Cancel</Button>
                </SheetFooter>
                </div>

            </SheetContent>
        </Sheet>
    );
}

export default EditAdminComponent;
