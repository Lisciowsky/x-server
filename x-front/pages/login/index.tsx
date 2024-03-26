import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAlert } from '@/context/AlertContext';

export default function Auth() {
  const { showAlert } = useAlert();
  const { isLoggedIn, login, signup, logout } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedTab, setSelectedTab] = useState('login');

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      router.push('/profile');
    }
  }, [isLoggedIn, router]);

  const handleSubmitLogin = async (event) => {
    event.preventDefault();
    try {
      const success = await login({ username, password });
      if (success) {
        showAlert("Log-in successful", "", "success");
        router.push('/profile');
      }
    } catch (error) {
      showAlert("Login error: " + error.toString(), "", "error");
    }
  };

  const handleSubmitSignup = async (event) => {
    event.preventDefault();
    try {
      const success = await signup({ email, username, password, fullname: fullName });
      if (success) {
        showAlert("Signup successful. Please log in.", "", "success");
        setSelectedTab('login');
      }
    } catch (error) {
      showAlert("Signup error: " + error.toString(), "", "error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-lg max-h-lg w-full space-y-8 p-10 bg-gunmetal rounded-xl shadow-lg z-10">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex flex-col">
          <TabsList aria-label="Login or Signup">
            <TabsTrigger value="login" className='text-xl'>Sign In</TabsTrigger>
            <TabsTrigger value="signup" className='text-xl'>Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleSubmitLogin} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-200">Username</label>
                <input id="username" name="username" type="text" autoComplete="username" required className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-200">Password</label>
                <input id="password" name="password" type="password" autoComplete="current-password" required className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Sign In
              </button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={handleSubmitSignup} className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-200">Full Name</label>
                <input id="fullName" name="fullName" type="text" required className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Full name" value={fullName} onChange={e => setFullName(e.target.value)} />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email address</label>
                <input id="email" name="email" type="email" autoComplete="email" required className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <label htmlFor="usernameSignup" className="block text-sm font-medium text-gray-200">Username</label>
                <input id="usernameSignup" name="usernameSignup" type="text" autoComplete="username" required className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
              </div>
              <div>
                <label htmlFor="passwordSignup" className="block text-sm font-medium text-gray-200">Password</label>
                <input id="passwordSignup" name="passwordSignup" type="password" autoComplete="new-password" required className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Sign Up
              </button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
