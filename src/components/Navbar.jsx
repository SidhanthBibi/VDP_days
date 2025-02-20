"use client"
import React, { useState, useEffect } from 'react';
import { UserCircle, Menu, X, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activePath, setActivePath] = useState('/');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Handle scroll
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Set active path
    setActivePath(window.location.pathname);

    // Check Supabase session and fetch user profile
    const fetchUserProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Fetch additional user profile information from Supabase
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }

        const profile = {
          id: session.user.id,
          name: profileData?.full_name || session.user.user_metadata.full_name,
          email: session.user.email,
          picture: profileData?.avatar_url || session.user.user_metadata.avatar_url
        };

        setUserProfile(profile);
      }
    };
    fetchUserProfile();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUserProfile(null);
      setIsProfileOpen(false);
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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
                <img className='h-[50px]' src="/clubsphereGradient.png" alt="ClubSphere"/>
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
              <div className="relative">
                {userProfile ? (
                  // Profile Button with Dropdown
                  <>
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="rounded-full overflow-hidden hover:ring-2 hover:ring-purple-500/30 transition-all duration-300"
                    >
                      <img
                        src={userProfile.picture}
                        alt={userProfile.name}
                        className="h-8 w-8 object-cover"
                      />
                    </button>

                    {/* Profile Dropdown */}
                    {isProfileOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setIsProfileOpen(false)}
                        />
                        <div className="absolute right-0 top-12 w-72 bg-gray-800/90 backdrop-blur-xl rounded-xl shadow-xl border border-white/10 z-50 p-4">
                          <div className="flex flex-col items-center gap-4">
                            <div className="relative group">
                              <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-white/10">
                                <img
                                  src={userProfile.picture}
                                  alt={userProfile.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                            
                            <div className="text-center">
                              <h3 className="text-lg font-semibold text-white">
                                {userProfile.name}
                              </h3>
                              <p className="text-sm text-gray-400">
                                {userProfile.email}
                              </p>
                            </div>

                            <button
                              onClick={handleSignOut}
                              className="w-full mt-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500/10 to-pink-500/10 hover:from-red-500/20 hover:to-pink-500/20 text-red-400 hover:text-red-300 transition-colors flex items-center justify-center gap-2 group"
                            >
                              <LogOut className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                              Sign Out
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  // Login Button
                  <a href="/login">
                    <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                      <UserCircle className="h-6 w-6 text-gray-300" />
                    </button>
                  </a>
                )}
              </div>

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