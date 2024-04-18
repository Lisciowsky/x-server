import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/common/components/ui/button';
import { useState, useRef, useEffect } from 'react';
import CustomLink from './custom-link';

const Header = () => {
  const router = useRouter();
  const { isLoggedIn, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isMenuOpen]);

  const handleLogout = async (e) => {
    e.preventDefault();
    setIsMenuOpen(false);
    await logout();
    router.push('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
  };

  const RenderMenuItems = () => {
    return <>
      <CustomLink href="/about">
        <span onClick={handleMenuItemClick}>About</span>
      </CustomLink>
      <CustomLink href="/contact">
        <span onClick={handleMenuItemClick}>Contact</span>
      </CustomLink>
      {isLoggedIn ? (
        <>
          <CustomLink href="/profile">
            <span onClick={handleMenuItemClick}>Profile</span>
          </CustomLink>
          <span className="text-red-500 cursor-pointer font-bold" onClick={handleLogout}>Log Out</span>
        </>
      ) : (
        <CustomLink href="/login">
          <span onClick={handleMenuItemClick} className="hover:text-sunset-orange hover:text-2xl  cursor-pointer">Log In</span>
        </CustomLink>
      )}
    </>
  }


  return (
    <header className="bg-gunmetal text-cultured">
      <nav className="container mx-auto flex justify-between items-center p-4 relative">
        <CustomLink href="/">
          <span className="ml-3 text-2xl font-bold font-serif">X-news</span>
        </CustomLink>
        <div className="md:hidden">
          <Button onClick={toggleMenu} className="focus:outline-none">
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            )}
          </Button>
        </div>
        <div ref={menuRef} onClick={handleMenuItemClick} className={`text-2xl font-bold flex flex-col items-center justify-center fixed inset-0 z-20 p-5 bg-black opacity-90 text-white rounded-lg shadow-lg space-y-12 ${isMenuOpen ? 'flex' : 'hidden'}`}>
          <RenderMenuItems />
        </div>
        <div className='hidden md:flex md:flex-row md:items-center md:space-x-8 text-xl'>
          <RenderMenuItems />
        </div>
      </nav>
    </header>
  );
};

export default Header;
