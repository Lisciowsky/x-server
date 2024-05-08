import React from 'react';
import { useAuth } from '@/context/auth-context';
import { AdminUsersProvider } from '@/features/profile/context/admin-users-context';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/common/components/ui/accordion";
import useFancyText from '@/common/hooks/use-fancy-text';
import ProfileInfoComponent from '@/features/profile/components/profile-info';
import EditAccountComponent from '@/features/profile/components/edit-account';
import AdminAllUsers from '@/features/profile/components/admin-all-users';
import UserStorage from '@/features/profile/components/user-storage';
import MediaManagement from '@/features/profile/components/media-management';


const Profile = () => {
  const { userInfo } = useAuth();

  if (!userInfo) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  const displayedText = useFancyText(userInfo.username)

  return (
    <>
      <div className='mx-auto container text-rich-black text-2xl font-extralight mt-10 flex justify-center'>
        Welcome {displayedText}
      </div>
      <div className='container mt-10 lg:mt-20 mx-auto gap-4'>
        <div className='col-span-6'>
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
              <AccordionItem value="item4">
                <AccordionTrigger>Media Management</AccordionTrigger>
                <AccordionContent>
                  <MediaManagement userInfo={userInfo} />
                </AccordionContent>
              </AccordionItem>
              {userInfo && userInfo.role === "admin" && (
                <AdminUsersProvider>
                  <AccordionItem value="item-5">
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
      </div>
    </>
  );
}

export default Profile;
