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

import { useAlert } from '@/context/AlertContext';

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
      selectedUser,
      setSelectedUser,
      totalPages,
      searchUsers,
      loadMoreUsers,
      refreshUserData
    } = useAdminUsers();

    const handleSearchSubmit = async () => {
      try {
        await searchUsers(searchField, searchQuery);
      } catch (error) {
        showAlert(error.message, "", "warning");
      }
    };

    return <>
      <AccordionItem value="item-3">
        <AccordionTrigger>Admin - All Users</AccordionTrigger>
        <AccordionContent>
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
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
              />
              <Button onClick={handleSearchSubmit}>Search</Button>
            </div>
            <AllUsersComponent allUsersInfo={allUsersInfo} onSelectUser={(user) => { setSelectedUser(user); setShowSheet(true); }} />
            {totalPages > 1 && (
              <Button onClick={loadMoreUsers} className="container mx-auto mt-5">Load More</Button>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
      {
        showSheet && selectedUser && (
          <Sheet open={showSheet} onOpenChange={setShowSheet}>
            <SheetTrigger asChild>
              <Button>Edit Role and Password</Button>
            </SheetTrigger>
            <SheetContent>
              <EditRoleComponent user={selectedUser} onCancel={() => setShowSheet(false)} onRoleUpdate={refreshUserData} />
            </SheetContent>
          </Sheet>
        )
      }
    </>
  }

  return (
    <>
      <div className='max-sm:grid-rows-2 max-sm: space-y-10 mt-4 md:flex md:container md:mx-auto md:justify-around'>
        <div className='text-black'>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Your profile data</AccordionTrigger>
              <AccordionContent>
                <ProfileInfoComponent userInfo={userInfo} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Edit your data</AccordionTrigger>
              <AccordionContent>
                <EditAccountComponent userInfo={userInfo} />
              </AccordionContent>
            </AccordionItem>
            {userInfo && userInfo.role === "admin" && (
              <AdminUsersProvider><AdminAllUsers /></AdminUsersProvider>
            )}
          </Accordion>


        </div>
      </div>
    </>
  );
}

export default Profile;
