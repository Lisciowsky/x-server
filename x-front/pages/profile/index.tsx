import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { AdminUsersProvider } from '@/context/AdminUsersContext';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


import ProfileInfoComponent from '../../components/profile/profile-info';
import EditAccountComponent from '../../components/profile/edit-account';
import AdminAllUsers from '../../components/profile/admin-all-users';
import UserStorage from '@/components/profile/user-storage';




const Profile = () => {
  const { userInfo } = useAuth();

  if (!userInfo) return <div className="flex justify-center items-center h-screen">Loading...</div>;

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
                <UserStorage />
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
