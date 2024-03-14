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
          <div className="flex items-center cursor-pointer">
            <img src="/next.svg" alt="Logo" width={40} height={40} />
            <span className="ml-3 text-xl font-bold">X-news</span>
          </div>
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/about" className="hover:text-sunset-orange">About
          </Link>
          <Link href="/contact" className="hover:text-sunset-orange">Contact
          </Link>
          {isLoggedIn ? (
            <>
              <Link href="/profile" className="hover:text-gray-300 bg-deep-sky-blue hover:bg-cerulean-blue rounded cursor-pointer px-3 py-2">Profile
              </Link>
              <Button onClick={handleLogout} className="bg-sunset-orange hover:bg-red-700 text-white px-3 py-2 rounded cursor-pointer">Log Out</Button>
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
