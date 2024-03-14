// components/Header.tsx
import Link from 'next/link';
// import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { Button } from './ui/button';

const Header = () => {
  const router = useRouter();
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    router.push('/login');
  };

  return (
    <header className="bg-gunmetal text-cultured">
      <nav className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" passHref>
          <div className="flex items-center cursor-pointer font-extrabold text-4xl">
            <span className="ml-3 text-2xl font-bold font-serif">X-news</span>
          </div>
        </Link>
        <div className="flex items-center space-x-8 text-xl font-sans">
          <Link href="/about" className="hover:text-sunset-orange">About
          </Link>
          <Link href="/contact" className="hover:text-sunset-orange font-sans">Contact
          </Link>
          {isLoggedIn ? (
            <>
              <Link href="/profile" className="hover:text-gray-300 bg-deep-sky-blue hover:bg-cerulean-blue rounded cursor-pointer px-3 py-2 font-sans">Profile
              </Link>
              <Button onClick={handleLogout} className="bg-sunset-orange hover:bg-red-700 text-white rounded cursor-pointerpx-3 py-2 font-sans">Log Out</Button>
            </>
          ) : (
            <Link href="/login" className="hover:text-sunset-orange">Log In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
