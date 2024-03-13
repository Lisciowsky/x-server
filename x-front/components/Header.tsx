// components/Header.tsx
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const router = useRouter();
  const { isLoggedIn, username, logout } = useAuth();

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    router.push('/login');
  };

  return (
    <header className="bg-gray-800 text-white">
      <nav className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" passHref>
          <div className="flex items-center cursor-pointer">
            <Image src="/next.svg" alt="Logo" width={40} height={40} />
            <span className="ml-3 text-xl font-bold">X-news</span>
          </div>
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/about">About</Link>
          <Link href="/services">Services</Link>
          <Link href="/contact">Contact</Link>
          {isLoggedIn ? (
            <>
              <Link href="/profile"
                 className="hover:text-gray-300 bg-green-600 hover:bg-green-700 rounded cursor-pointer px-3 py-2  "> {'MyProfile' || 'Profile'}
              </Link>
              <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded cursor-pointer">Log Out</button>
            </>
          ) : (
            <Link href="/login">Log In</Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
