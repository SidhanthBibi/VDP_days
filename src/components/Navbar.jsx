"use client"
import React, { useState, useEffect } from 'react';
import { UserCircle, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activePath, setActivePath] = useState('/');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    setActivePath(window.location.pathname);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NavLink = ({ href, children, isMobile }) => {
    const isActive = activePath === href;
    
    return (
      <a 
        href={href} 
        onClick={() => {
          setActivePath(href);
          if (isMobile) setIsMenuOpen(false);
        }}
        className={`
          relative px-3 py-2 rounded-lg text-gray-400 hover:text-white
          transition-all duration-300 hover:bg-white/10
          ${scrolled ? 'text-sm' : 'text-base'}
          ${isActive ? 'text-white bg-white/5' : ''}
          ${isMobile ? 'text-lg w-full text-center' : ''}
          group
        `}
      >
        {children}
        <span 
          className={`
            absolute bottom-0 left-1/2 w-1/2 h-0.5
            bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
            transform -translate-x-1/2 transition-all duration-300
            ${isActive ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}
            group-hover:scale-x-100 group-hover:opacity-100
          `}
        />
      </a>
    );
  };

  return (
    <>
      {/* Fixed height spacer div */}
      <div className="h-16" />
      
      <nav 
        className={`
          fixed top-0 left-0 right-0 z-50 
          transition-all duration-500
          ${scrolled 
            ? 'h-16 bg-[#15134a]/70 backdrop-blur-lg shadow-lg' 
            : 'h-18 bg-gradient-to-r from-[#0b1727] to-[#1d1d4b]'}
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <div className={`
              transition-all duration-500 flex items-center gap-2
              ${scrolled ? 'scale-95' : 'scale-100'}
            `}>
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-0.5">
                <div className="h-full w-full rounded-xl bg-[#0d0a48] flex items-center justify-center">
                  <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                    C
                  </span>
                </div>
              </div>
                <a href="/">
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                  ClubSphere
                </span>
                </a>
            </div>

            {/* Desktop Navigation */}
            <div className={`
              hidden md:flex items-center gap-6 transition-all duration-500
              ${scrolled ? 'scale-95' : 'scale-100'}
            `}>
              <NavLink href="/">Home</NavLink>
              <NavLink href="/events">Events</NavLink>
              <NavLink href="/clubs">Clubs</NavLink>
              <NavLink href="/about">About</NavLink>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              <a href="/login">
                <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <UserCircle className="h-6 w-6 text-gray-300" />
                </button>
              </a>

              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <Menu className="h-6 w-6 text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`
          fixed inset-0 bg-[#0d0a48]/50 backdrop-blur-sm z-40 md:hidden
          transition-opacity duration-300
          ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div 
        className={`
          fixed top-0 right-0 h-full w-64 bg-[#0d0a48] z-50 md:hidden
          transform transition-transform duration-300 ease-in-out
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <button 
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="h-6 w-6 text-gray-300" />
        </button>

        <div className="flex flex-col items-center pt-20 gap-6">
          <NavLink href="/" isMobile>Home</NavLink>
          <NavLink href="/events" isMobile>Events</NavLink>
          <NavLink href="/clubs" isMobile>Clubs</NavLink>
          <NavLink href="/about" isMobile>About</NavLink>
        </div>
      </div>
    </>
  );
};

export default Navbar;