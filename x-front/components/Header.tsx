import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { Button } from './ui/button';
import { useState } from 'react';

const Header = () => {
  const router = useRouter();
  const { isLoggedIn, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async (e: any) => {
    e.preventDefault();
    setIsMenuOpen(!isMenuOpen)
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
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {/* Hamburger Icon */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </button>
        </div>
          <div className={`flex font-light flex-col max-md: items-center md:flex-row md:items-center md:space-x-8 md:text-xl ${isMenuOpen ? 'block' : 'hidden md:block'}`}>
            <Link onClick={() => setIsMenuOpen(!isMenuOpen)} href="/about" className="hover:text-sunset-orange">About</Link>
            <Link onClick={() => setIsMenuOpen(!isMenuOpen)} href="/contact" className="hover:text-sunset-orange">Contact</Link>
            {isLoggedIn ? (
              <>
                <Link onClick={() => setIsMenuOpen(!isMenuOpen)} href="/profile" className="hover:text-sunset-orange">Profile</Link>
                <Button onClick={handleLogout} className="bg-sunset-orange hover:bg-red-700 rounded-xl text-white">Log Out</Button>
              </>
            ) : (
              <Link onClick={() => setIsMenuOpen(!isMenuOpen)} href="/login" className="hover:text-sunset-orange">Log In</Link>
            )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
