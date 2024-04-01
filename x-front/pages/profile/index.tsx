import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAdminUsers, AdminUsersProvider } from '@/context/AdminUsersContext';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProfileInfoComponent from '../../components/profile/profile-info';
import EditAccountComponent from '../../components/profile/edit-account';
import EditRoleComponent from '@/components/profile/edit-admin';
import AllUsersComponent from '../../components/profile/all-users';
import UserStorage from '@/components/profile/user-storage';

import { useAlert } from '@/context/AlertContext';
import { UpdateUserResponse } from '@/models/admin-responses';

const searchFields = [
  { label: "Username", value: "username" },
  { label: "Email", value: "email" },
  { label: "Role", value: "fullname" },
];

const Profile = () => {
  const { showAlert } = useAlert();
  const { userInfo } = useAuth();

  const [showSheet, setShowSheet] = React.useState(false);
  const [searchField, setSearchField] = React.useState(searchFields[0].value);
  const [searchQuery, setSearchQuery] = React.useState("");



  if (!userInfo) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  const AdminAllUsers = () => {
    const {
      allUsersInfo,
      setAllUsersInfo,
      selectedUser,
      setSelectedUser,
      searchUsers,
      loadMoreUsers,
      totalUsers
    } = useAdminUsers();

    const onUpdateRoleHandler = (updatedUserResponse: UpdateUserResponse) => {
      const userIndex = allUsersInfo.findIndex(user => user.username === updatedUserResponse.username);
      if (userIndex !== -1) {
        const updatedUser = {
          ...allUsersInfo[userIndex],
          role: updatedUserResponse.role, // Update the role from the response
        };
    
        const updatedUsersInfo = [
          ...allUsersInfo.slice(0, userIndex),
          updatedUser,
          ...allUsersInfo.slice(userIndex + 1),
        ];
    
        setAllUsersInfo(updatedUsersInfo);
      }
    };
    
    const handleSearchChange = (e) => {
      console.log(e.target.value)
      e.preventDefault()
      setSearchQuery(e.target.value)
    }

    const handleSearchSubmit = async () => {
      try {
        await searchUsers(searchField, searchQuery);
      } catch (error) {
        showAlert(error.message, "", "warning");
      }
    };

    return <>
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex gap-4">
              <select
                className="rounded-md border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
              >
                {searchFields.map((field) => (
                  <option key={field.value} value={field.value}>{field.label}</option>
                ))}
              </select>
              <Input
                className="p-2 border-none"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search..."
              />
              <Button className="shadow-sm" onClick={handleSearchSubmit}>Search</Button>
            </div>
            <AllUsersComponent allUsersInfo={allUsersInfo} onSelectUser={(user) => { setSelectedUser(user); setShowSheet(true); }} />
            {allUsersInfo.length < totalUsers && (
              <Button onClick={loadMoreUsers} className="container mx-auto mt-5">Load More</Button>
            )}
          </div>
      {
        showSheet && selectedUser && (
          <Sheet open={showSheet} onOpenChange={setShowSheet}>
            <SheetTrigger asChild>
              <Button>Edit Role and Password</Button>
            </SheetTrigger>
            <SheetContent>
              <EditRoleComponent user={selectedUser} onCancel={() => setShowSheet(false)} onRoleUpdate={onUpdateRoleHandler} />
            </SheetContent>
          </Sheet>
        )
      }
    </>
  }

  return (
    <>
      <div className='flex flex-col items-center mt-4'>
        <div className='text-black w-full'>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">  
              <AccordionTrigger>Your profile data</AccordionTrigger>
              <AccordionContent>
                <div className='md:flex md:container md:mx-auto md:justify-center'>
                <ProfileInfoComponent userInfo={userInfo} />
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Edit your data</AccordionTrigger>
              <AccordionContent>
              <div className='md:flex md:container md:mx-auto md:justify-center'>
                <EditAccountComponent userInfo={userInfo} />
              </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item3">
              <AccordionTrigger>User Storage</AccordionTrigger>
              <AccordionContent>
                <UserStorage/>
              </AccordionContent>
            </AccordionItem>
            {userInfo && userInfo.role === "admin" && (
            <AdminUsersProvider>
              <AccordionItem value="item-4">
                <AccordionTrigger>Admin - All Users</AccordionTrigger>
                  <AccordionContent>
                    <AdminAllUsers />
                </AccordionContent>
              </AccordionItem>
            </AdminUsersProvider>
            )}
          </Accordion>
        </div>
      </div>
    </>
  );
}

export default Profile;
