import React from 'react';
import { useAuth } from '@/context/auth-context';
import { AdminUsersProvider } from '@/features/profile/context/admin-users-context';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/common/components/ui/accordion";
import ProfileInfoComponent from '@/features/profile/components/profile-info';
import EditAccountComponent from '@/features/profile/components/edit-account';
import AdminAllUsers from '@/features/profile/components/admin-all-users';
import UserStorage from '@/features/profile/components/user-storage';


const Profile = () => {
  const { userInfo } = useAuth();

  if (!userInfo) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <>
      <div className='mt-4'>
        <div className='text-black w-full bg-cultured p-5 rounded-xl'>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Your profile data</AccordionTrigger>
              <AccordionContent>
                <div className='flex justify-center'>
                  <ProfileInfoComponent userInfo={userInfo} />
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Edit your data</AccordionTrigger>
              <AccordionContent>
                <div className='flex justify-center'>
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
