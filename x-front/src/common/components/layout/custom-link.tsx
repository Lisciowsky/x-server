import React from 'react';
import Link from 'next/link';

type CustomLinkProps = {
  href: string;
  children: React.ReactNode;
  onClick?: () => void; // Optional onClick event handler
}

const CustomLink: React.FC<CustomLinkProps> = ({ href, children, onClick }) => {
  return (
    <Link href={href} passHref>
      <span onClick={onClick} className="hover:text-sunset-orange cursor-pointer">
        {children}
      </span>
    </Link>
  );
};

export default CustomLink;
