import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext'; // Adjust the import path as necessary
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'; // Adjust the import path
import { isLoggedIn } from '@/lib/auth';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState('error'); // New state to track feedback type

  const [selectedTab, setSelectedTab] = useState('login'); // State to track the active tab
  const { login, signup } = useAuth(); // Destructure login and signup functions from context
  const router = useRouter();

  useEffect(() => {
    const isLogged = isLoggedIn();
    console.log("isLoggedIn", isLoggedIn);
    if (isLogged) {
      router.push("/");
    }
  }, []);

  const handleSubmitLogin = async (event) => {
    event.preventDefault();
    try {
      const success = await login({ username, password });
      if (success) {
        console.log("successful log in");
        setFeedbackType("success")
        setFeedbackMessage('Login successful. Redirecting...'); // Optionally provide feedback
        router.push('/profile'); // Redirect to profile page or another page upon successful login
      } else {
        setFeedbackMessage('Authentication failed. Please try again.');
      }
    } catch (error) {
      console.error("Log in error:", error);
      setFeedbackMessage(`Error: ${error.toString()}`);
    }
  };

  const handleSubmitSignup = async (event) => {
    event.preventDefault();
    try {
      const success = await signup({ email, username, password, fullname: fullName });
      if (success) {
        console.log("successfully signup");
        setSelectedTab('login'); // Switch to the login tab
        setFeedbackMessage('Signup successful. Please log in.'); // Optionally provide feedback
        setFeedbackType("success")
      } else {
        setFeedbackMessage('SignUp Failed. Please try again.');
      }
    } catch (error) {
      console.error("SignUp Error:", error);
      setFeedbackMessage(`Error: ${error.toString()}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg z-10">
        {/* Controlled Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex flex-col">
          <TabsList aria-label="Login or Signup">
            <TabsTrigger value="login" className="w-full data-[state=active]:text-sunset-orange data-[state=inactive]:text-rich-black">Sign In</TabsTrigger>
            <TabsTrigger value="signup" className="w-full data-[state=active]:text-sunset-orange data-[state=inactive]:text-rich-black">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleSubmitLogin} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                <input id="username" name="username" type="text" autoComplete="username" required className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
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
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input id="fullName" name="fullName" type="text" required className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Full name" value={fullName} onChange={e => setFullName(e.target.value)} />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                <input id="email" name="email" type="email" autoComplete="email" required className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <label htmlFor="usernameSignup" className="block text-sm font-medium text-gray-700">Username</label>
                <input id="usernameSignup" name="usernameSignup" type="text" autoComplete="username" required className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
              </div>
              <div>
                <label htmlFor="passwordSignup" className="block text-sm font-medium text-gray-700">Password</label>
                <input id="passwordSignup" name="passwordSignup" type="password" autoComplete="new-password" required className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Sign Up
              </button>
            </form>
          </TabsContent>
        </Tabs>
        {feedbackMessage && (
          <p className={`mt-4 text-center ${feedbackType === 'success' ? 'text-green-500' : 'text-red-500'}`}>
            {feedbackMessage}
          </p>
        )}</div>
    </div>
  );
}
