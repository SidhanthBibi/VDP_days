import React, { useState, useEffect } from 'react';
import { UserCircle } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('Events');

  // Navigation items
  const navItems = ['Events', 'Clubs','About'];

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.4, 0, 0.2, 1)]
        ${scrolled ? 'py-2 bg-gray-900 backdrop-blur-lg' : 'py-4 bg-gray-900'}
        md:relative h-auto`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Logo */}
        <div className="md:hidden flex justify-between items-center mb-2">
          <div className={`transition-all duration-500 ease-[cubic-bezier(0.4, 0, 0.2, 1)]
              ${scrolled ? 'scale-90' : 'scale-100'}`}>
            <button className="p-1 rounded-full hover:bg-gray-800 transition-colors">
              <a href="/login"><UserCircle className="w-8 h-8 text-gray-300" /></a>
            </button>
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 cursor-pointer">
            <a href="/">UniClub</a>
          </span>
          <div className="w-8"></div> {/* Spacer for centering */}
        </div>

        <div className="flex items-center justify-between">
          {/* Desktop Logo */}
          <div className={`hidden md:block transition-all duration-500 ease-[cubic-bezier(0.4, 0, 0.2, 1)]
            ${scrolled ? 'scale-90' : 'scale-100'}`}>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              <a href="/">UniClub</a>
            </span>
          </div>


          {/* Navigation Links */}
          <div className={`flex items-center justify-around w-full md:w-auto md:gap-8 transition-all duration-500
            ${scrolled ? 'scale-95' : 'scale-100'}`}>
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`relative px-2 py-1 text-sm font-medium transition-colors
                  ${activeTab === item ? 'text-white' : 'text-gray-400 hover:text-white'}
                  ${scrolled ? 'text-sm' : 'text-base'}`}
              >
                {item}
                {activeTab === item && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Desktop User Profile */}
          <div className={`hidden md:block transition-all duration-500 ease-[cubic-bezier(0.4, 0, 0.2, 1)]
            ${scrolled ? 'scale-90' : 'scale-100'}`}>
            <button className="p-1 rounded-full hover:bg-gray-800 transition-colors">
              <a href="/login"><UserCircle className="w-8 h-8 text-gray-300" /></a>
            </button>
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;