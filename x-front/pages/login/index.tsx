import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext'; // Adjust the import path as necessary

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const { login, signup } = useAuth(); // Destructure login and signup functions from context
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      router.push("/profile")
    }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault();
    let success = false;

    try {
      if (isLogin) {
        // Call login function with username and password
        success = await login({ username, password });
        if (success) {
          console.log("successful log in")
          router.push('/'); // Redirect to home page or another page upon successful login/signup
          return
        } else {
          console.log("unsuccessful log in")
          setFeedbackMessage('Authentication failed. Please try again.');
          return
        }
      }
    } catch (error) {
      console.error("Log in error:", error);
      setFeedbackMessage(`Error: ${error.toString()}`);
    }

    try {
      success = await signup({ email, username, password, fullname: fullName });
      if (success) {
        console.log("successfully singup")
        setIsLogin(true)
        router.push("/login")
      } else {
        console.log("unsuccessfully singup")
        setFeedbackMessage('SingUp Failed. Please try again.');
        return
      }

    } catch (error) {
      console.error("Sing Up Error:", error);
      setFeedbackMessage(`Error: ${error.toString()}`);
    }


  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg z-10">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Sign up for a new account'}
          </h2>
          {feedbackMessage && <p className="mt-4 text-red-500">{feedbackMessage}</p>}
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input id="fullName" name="fullName" type="text" required className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Full name" value={fullName} onChange={e => setFullName(e.target.value)} />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                <input id="email" name="email" type="email" autoComplete="email" required className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </>
          )}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input id="username" name="username" type="text" autoComplete="username" required className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div>
            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </form>
        <div className="text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-indigo-600 hover:text-indigo-500">
            {isLogin ? 'No account? Sign up' : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
