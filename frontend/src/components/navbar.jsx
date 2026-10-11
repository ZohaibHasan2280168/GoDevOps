import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Award, Crown, Menu, X, Search, LogOut } from 'lucide-react';
import { useApp } from '../contexts/app-context';
import SearchModal from './SearchModal';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useApp();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navLinks = [
    { to: "/dashboard", text: "Dashboard" },
    { to: "/labs", text: "Labs" },
    { to: "/rooms", text: "Rooms" },
    { to: "/leaderboard", text: "Leaderboard" },
    { to: "/premium", text: "Premium" },
  ];

  const activeLinkStyle = {
    background: 'linear-gradient(90deg, rgba(var(--primary), 0.1), rgba(var(--accent), 0.1))',
    color: 'rgb(var(--primary))',
    boxShadow: 'inset 0 -2px 0 0 rgb(var(--primary))'
  };

  return (
    <>
    <nav className="navbar sticky top-0 z-50 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold gradient-text">
          CyberVerse
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="text-muted hover:text-text px-3 py-2 rounded-md text-sm font-medium smooth-transition"
              style={({ isActive }) => isActive ? activeLinkStyle : undefined}
            >
              {link.text}
            </NavLink>
          ))}
          {isAuthenticated && (
            <NavLink
              to="/certificates"
              className="text-muted hover:text-text px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 smooth-transition"
              style={({ isActive }) => isActive ? activeLinkStyle : undefined}
            >
              <Award size={16} /> Certificates
            </NavLink>
          )}
        </div>

        {/* Auth Buttons & Profile */}
        <div className="hidden md:flex items-center space-x-5">
          {isAuthenticated ? (
            <>
              <button onClick={() => setIsSearchOpen(true)} className="text-muted hover:text-text smooth-transition">
                <Search size={18} />
              </button>
              <Link to="/profile" className="flex items-center gap-2 text-text font-medium">
                <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name}`} alt="avatar" className="w-8 h-8 rounded-full border-2 border-primary/50" />
                {user?.name}
                {user?.isPremium && <Crown size={16} className="text-amber-400" />}
              </Link>
              <button onClick={logout} className="text-muted hover:text-danger smooth-transition" title="Logout">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost text-sm px-4 py-2 rounded-lg">Log In</Link>
              <Link to="/signup" className="btn-primary text-sm">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-muted hover:text-text">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-panel absolute top-16 left-0 w-full p-4">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className="text-muted hover:text-text block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsOpen(false)}>{link.text}</NavLink>
            ))}
            {isAuthenticated && (
              <NavLink to="/certificates" className="text-muted hover:text-text block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2" onClick={() => setIsOpen(false)}>
                <Award size={16} /> Certificates
              </NavLink>
            )}
            <div className="border-t border-card-border my-2"></div>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="flex items-center gap-3 px-3 py-2 text-text font-medium" onClick={() => setIsOpen(false)}>
                  <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name}`} alt="avatar" className="w-8 h-8 rounded-full border-2 border-primary/50" />
                  {user?.name}
                  {user?.isPremium && <Crown size={16} className="text-amber-400" />}
                </Link>
                <button onClick={() => { logout(); setIsOpen(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2 text-muted hover:text-danger font-medium">
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 pt-2">
                <Link to="/login" className="btn-ghost text-center py-2 rounded-lg">Log In</Link>
                <Link to="/signup" className="btn-primary text-center">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
    <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;