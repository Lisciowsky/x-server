import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";


import { UserInfo } from '@/models/user';

import axiosInstance from '@/lib/axiosInstance';
import { clearAuthTokens } from '@/lib/auth';
import { updateUserInfo, updateUserPassword } from '@/lib/users'; // Adjust the import path as needed

import { useAlert } from '@/context/AlertContext';

import { useRouter } from 'next/router';

interface EditAccountProps {
  userInfo: UserInfo;
}

function EditAccountComponent({ userInfo }: EditAccountProps) {
  const router = useRouter()

  const { showAlert } = useAlert();

  const [fullname, setFullname] = useState(userInfo.fullname || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userInfo.fullname === fullname) {
      showAlert("The new fullname must be different from the current one", "", "warning");
      return;
    }
    try {
      await updateUserInfo(userInfo.username, fullname);
      showAlert("Fullname changed successfully", "", "success");
      router.push("/profile");
    } catch (error) {
      showAlert(error.message, "", "warning");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserPassword(userInfo.username, newPassword, currentPassword);
      showAlert("Password changed successfully", "", "success");
      clearAuthTokens();
      router.push("/login");
    } catch (error) {
      showAlert(error.message, "", "warning");
    }
  };


  return (
    <Tabs defaultValue="account" className="w-[350px] bg-cultured text-rich-black">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>

      <TabsContent value="account">
        <form onSubmit={handleAccountSubmit}>
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
                <Input id="fullname" value={fullname} onChange={(e) => setFullname(e.target.value)} />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="mr-2">Save changes</Button>
            </CardFooter>
          </Card>
        </form>
      </TabsContent>

      <TabsContent value="password">
        <form onSubmit={handlePasswordSubmit}>
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
                <Input id="current" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">New password</Label>
                <Input id="new" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="mr-2">Save password</Button>
            </CardFooter>
          </Card>
        </form>
      </TabsContent>
    </Tabs>
  );
}

export default EditAccountComponent;
