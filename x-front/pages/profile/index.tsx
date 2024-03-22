import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';

import { Button } from '@/components/ui/button';

import ProfileInfoComponent from '../../components/profile/profile-info';
import EditAccountComponent from '../../components/profile/edit-account';
import EditRoleComponent from '@/components/profile/edit-admin';
import AllUsersComponent from '../../components/profile/all-users';

import { UserInfo } from '@/models/user';
import { AllUsers } from '@/models/user';
import { fetchUserInfo } from '@/lib/auth';
import { fetchAllUsersInfo } from '@/lib/users';

const Profile = () => {
  const { isLoggedIn, username } = useAuth();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [allUsersInfo, setAllUsersInfo] = useState<AllUsers[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isError, setIsError] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);


  const [showSheet, setShowSheet] = useState(false);

  const refreshUserData = async () => {
    try {
      const allUsersData = await fetchAllUsersInfo(page, pageSize);
      setAllUsersInfo(allUsersData.users);
      setTotalUsers(allUsersData.total_users);
      setPage(allUsersData.page);
      setPageSize(allUsersData.page_size);
    } catch (error) {
      console.error('Failed to fetch all users info:', error);
      setIsError(true);
    }
  };

  const onSelectUser = (user: UserInfo) => {
    setSelectedUser(user);
    setShowSheet(true); // Open the Sheet when a user is selected
  };

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    if (username) {
      const getUserInfo = async () => {
        try {
          const fetchedUserInfo = await fetchUserInfo(username);
          if (fetchedUserInfo.role === "admin") {
            try {
              const allUsersData = await fetchAllUsersInfo(page, pageSize);
              setAllUsersInfo(allUsersData.users);
              setTotalUsers(allUsersData.total_users)
              setPage(allUsersData.page)
              setPageSize(allUsersData.page_size)
            } catch (error) {
              console.error('Failed to fetch all users info:', error);
              setIsError(true);
            }
          }
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

  const loadMoreUsers = async () => {
    try {
      const nextPage = page + 1; // Load the next page of users
      const allUsersData = await fetchAllUsersInfo(nextPage, pageSize); // Assuming pageSize remains constant

      setAllUsersInfo(prevUsers => [...prevUsers, ...allUsersData.users]); // Extend the existing users list
      setPage(nextPage); // Update the page state to the next page
      // Optionally, update totalUsers if it changes or is returned by fetchAllUsersInfo
    } catch (error) {
      console.error('Failed to fetch more users info:', error);
      setIsError(true);
    }
  };

  const totalPages = Math.ceil(totalUsers / pageSize);


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
            {userInfo.role === "admin" &&
              <AccordionItem value="item-3">
                <AccordionTrigger>Admin - All Users</AccordionTrigger>
                <AccordionContent>
                  <>
                    <AllUsersComponent allUsersInfo={allUsersInfo} onSelectUser={onSelectUser} />
                    {page < totalPages && (
                      <Button onClick={loadMoreUsers} className="container mx-auto mt-5 ">Load More</Button>
                    )}
                  </>
                </AccordionContent>
              </AccordionItem>
            }
          </Accordion>

          {showSheet && selectedUser && (
            <Sheet open={showSheet} onOpenChange={setShowSheet}>
              <SheetTrigger asChild>
                <Button>Edit Role and Password</Button>
              </SheetTrigger>
              <SheetContent>
                <EditRoleComponent userInfo={selectedUser} onCancel={() => setShowSheet(false)} onRoleUpdate={refreshUserData} />
              </SheetContent>
            </Sheet>

          )}

        </div>
      </div>
    </>
  );
}

export default Profile;
