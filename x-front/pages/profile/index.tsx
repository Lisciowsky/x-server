import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import axiosInstance from '@/lib/axiosInstance';
import { Table, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

interface UserInfo {
  username: string;
  fullname: string | null;
  email: string | null;
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
          console.error('Error fetching user info:', error);
          // Handle error, e.g., by setting an error state or redirecting
        }
      };

      getUserInfo();
    }
  }, [isLoggedIn, username, router]);

  if (!userInfo) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Table>
        <TableBody>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableCell>{userInfo.username}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableCell>{userInfo.fullname || 'N/A'}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableCell>{userInfo.email || 'N/A'}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default Profile;
