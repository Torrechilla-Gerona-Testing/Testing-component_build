
import React from 'react';

interface HeaderProps {
  text: string;
  Image: string;
}

const Header: React.FC<HeaderProps> = ({ text, Image }) => {
    return (
      <header className="sticky top-0 flex items-center justify-between z-10 bg-color1 py-2 px-1 h-12 shadow-md shadow-[8px 8px rgba(0, 0, 0, 0.25)]">
        <div className="flex items-center">
          <img
            src={Image}
            alt="Logo"
            className="mx-3 w-7 h-7"
          />
          <h1 className="lg:text-lg md:text-lg text-xs font-bold text-center text-black">
            {text}
          </h1>
        </div>
      </header>
    );
  };
  
  export default Header;