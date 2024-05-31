import React, { useState } from 'react';
import { Button } from "@/common/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/common/components/ui/card";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/common/components/ui/tabs";

import { UserInfo } from '@/api/models/user';
import { updateUserInfo } from '@/api/users-endpoints';
import { useAlert } from '@/context/alert-context';
import { UpdateUserRequest } from '@/api/models/user-responses';
import { useAuth } from '@/context/auth-context';
interface EditAccountProps {
  userInfo: UserInfo;
}

function EditAccountComponent({ userInfo }: EditAccountProps) {
  const { showAlert } = useAlert();
  const {logout, setUserInfo} = useAuth()
  const [fullname, setFullname] = useState(userInfo.fullname || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleFullNameChange = (e) => {
    setFullname(e.target.value)
  }
  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value)
  }
  const handleCurrentPasswordChange = (e) => {
    setCurrentPassword(e.target.value)
  }

  const handleAccountUpdate = async () => {
    try {
      const updateUserRequest: UpdateUserRequest = {
        fullname: fullname
      }
      const updatedUserInfo = await updateUserInfo(userInfo.username, updateUserRequest);
      setUserInfo(updatedUserInfo)
      showAlert("Fullname changed successfully", "", "success");
    } catch (error) {
      showAlert(error.toString(), "", "warning");
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      const updateUserRequest: UpdateUserRequest = {
        current_password: currentPassword,
        password: newPassword
      }
      await updateUserInfo(userInfo.username, updateUserRequest);
      showAlert("Password changed successfully", "", "success");
      logout()

    } catch (error) {
      showAlert(error.toString(), "", "warning");
    }
  };

  return (
    <Tabs defaultValue="account" className="w-[350px] bg-cultured text-rich-black">
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
              <Input id="fullname" value={fullname} onChange={handleFullNameChange} />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAccountUpdate} className="mr-2">Save changes</Button>
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
              <Input id="current" type="password" value={currentPassword} onChange={handleCurrentPasswordChange} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" value={newPassword} onChange={handleNewPasswordChange} />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handlePasswordUpdate} className="mr-2">Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export default EditAccountComponent;
