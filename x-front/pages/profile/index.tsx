import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import axiosInstance from '@/lib/axiosInstance';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { TableBody, TableCell, TableHead, TableRow, Table } from '@/components/ui/table';

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
      <div className='container flex mt-10 mb-10 justify-center'>
        <Tabs defaultValue="account" className="w-[400px] bg-cultured text-rich-black">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                  Make changes to your account here. Click save when you're done.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="fullname">Fullname</Label>
                  <Input id="fullname" defaultValue={userInfo.fullname} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue={userInfo.username} />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you'll be logged out.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="current">Current password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new">New password</Label>
                  <Input id="new" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        {/* <div className='text-rich-black bg-cultured'>
          <Table>
            <TableBody>
              <TableRow>
                <TableHead >Username</TableHead>
                <TableCell>{userInfo.username}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead >Full Name</TableHead>
                <TableCell>{userInfo.fullname || 'N/A'}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableCell>{userInfo.email || 'N/A'}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableCell>{userInfo.role || 'N/A'}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div> */}
      </div>
    </>
  );
};

export default Profile;
