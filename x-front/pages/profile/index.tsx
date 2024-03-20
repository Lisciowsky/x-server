import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import axiosInstance from '@/lib/axiosInstance';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


import ProfileInfoComponent from '../../components/profile/profile-info';
import EditAccountComponent from '../../components/profile/edit-account';

interface UserInfo {
  username: string;
  fullname: string | null;
  email: string | null;
  role: string | null;
}


const fetchUserInfo = async (username: string): Promise<UserInfo> => {
  try {
    const response = await axiosInstance.get(`/users/${username}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user info:', error);
    throw error;
  }
};

const Profile = () => {
  const { isLoggedIn, username } = useAuth();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    if (username) {
      const getUserInfo = async () => {
        try {
          const fetchedUserInfo = await fetchUserInfo(username);
          setUserInfo(fetchedUserInfo);
        } catch (error) {
          setIsError(true);
        }
      };

      getUserInfo();
    }
  }, [isLoggedIn, username, router]);

  if (!userInfo) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  if (isError) {
    return <div>
      <h1>Backend Error</h1>
    </div>;
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
                <AccordionTrigger>Edit profile data</AccordionTrigger>
                <AccordionContent>
                  <EditAccountComponent userInfo={userInfo} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </>
    );
  };


  export default Profile;
