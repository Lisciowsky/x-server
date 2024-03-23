import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
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
import { useAlert } from '@/context/AlertContext';

import { updateUserRole } from '@/lib/auth';

interface EditAccountProps {
    userInfo: UserInfo;
    onCancel: () => void;
    onRoleUpdate: () => Promise<void>;
}



function EditRoleComponent({ userInfo, onCancel, onRoleUpdate }: EditAccountProps) {
    const [role, setRole] = useState(userInfo.role); // Ensure role is initialized from userInfo
    const { showAlert } = useAlert();

    const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setRole(event.target.value);
    };

    const handleSaveChanges = async () => {
        try {
            await updateUserRole(userInfo.username, role);
            showAlert("Role changed successfully", "", "success");
            await onRoleUpdate();
            onCancel();
        } catch (error) {
            onCancel();
            showAlert(error.message, "", "warning");
        }
    };
    

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button>Edit Role</Button>
            </SheetTrigger>
            <SheetContent>
                <div className="space-y-4 p-4">
                    <SheetHeader>
                        <SheetTitle>Edit User: {userInfo.username}</SheetTitle>
                        <SheetDescription>Manage user role.</SheetDescription>
                    </SheetHeader>

                    <div className="space-y-1">
                        <select
                            id="role-select"
                            value={role}
                            onChange={handleRoleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-black focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value="user" className='text-center'>User</option>
                            <option value="admin" className='text-center'>Admin</option>
                        </select>
                    </div>

                    <SheetFooter className='flex container mx-auto justify-center space-y-2'>
                        <div className="md: grid grid-cols-2 gap-4">
                            <Button onClick={handleSaveChanges}>Save Role</Button>
                            <Button onClick={onCancel}>Cancel</Button>
                        </div>
                    </SheetFooter>
                </div>
            </SheetContent>
        </Sheet>
    );
}

export default EditRoleComponent;
