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
import UserMedia from '@/features/profile/components/user-media';


const Profile = () => {
  const { userInfo } = useAuth();
  const displayedText = useFancyText(userInfo?.username)

  if (!userInfo) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <>
      <div className='container mx-auto text-rich-black text-2xl mt-5 font-serif justify-center grid grid-flow-row'>
        <p className='flex justify-center'>Welcome {displayedText}</p>
      </div>
      <div className='container mt-10 mx-auto gap-4'>
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
              <AccordionItem value="item-3">
                <AccordionTrigger>User Media</AccordionTrigger>
                <AccordionContent>
                  <div className='flex'>
                    <UserMedia userInfo={userInfo} />
                  </div>
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
      </div>
    </>
  );
}

export default Profile;
