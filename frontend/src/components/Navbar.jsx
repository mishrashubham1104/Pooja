import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, UserCircle, LogOut, User, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    checkAuth();
    window.addEventListener('authChange', checkAuth);
    return () => window.removeEventListener('authChange', checkAuth);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setShowNavbar(false);
        setShowProfileDropdown(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setShowProfileDropdown(false);
    window.dispatchEvent(new Event('authChange'));
    navigate('/');
  };

  return (
    <>
      <nav className={`bg-white/80 backdrop-blur-lg text-gray-800 shadow-sm sticky top-0 z-[40] transition-transform duration-300 border-b border-saffron-100 ${showNavbar ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link to="/" className="text-2xl font-bold flex items-center gap-2 text-saffron-600 hover:text-saffron-700 transition-colors">
              <span className="text-3xl" role="img" aria-label="Om">🕉️</span>
              <span className="hidden sm:inline">Pooja Connect</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6 text-[15px] font-medium">
              <Link to="/" className="text-gray-700 hover:text-saffron-600 transition-colors">Home</Link>
              {(!user || user.role !== 'pandit') && (
                <>
                  <div className="relative group">
                    <button className="text-gray-700 hover:text-saffron-600 transition-colors flex items-center gap-1 py-4">
                      Poojas <ChevronDown className="w-4 h-4" />
                    </button>
                    <div className="absolute top-full left-0 w-48 bg-white rounded-xl shadow-xl border border-saffron-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="py-2">
                        <Link to="/services" className="block px-4 py-2 font-bold text-saffron-600 hover:bg-saffron-50">All Poojas A-Z</Link>
                        <div className="h-px bg-gray-100 my-1"></div>
                        <Link to="/pooja/Kaal Sarp Dosh Puja" className="block px-4 py-2 text-gray-600 hover:bg-saffron-50 hover:text-saffron-600 text-sm">Kaal Sarp Dosh</Link>
                        <Link to="/pooja/Narayan Bali Puja" className="block px-4 py-2 text-gray-600 hover:bg-saffron-50 hover:text-saffron-600 text-sm">Narayan Bali</Link>
                        <Link to="/pooja/Rudrabhishek Puja" className="block px-4 py-2 text-gray-600 hover:bg-saffron-50 hover:text-saffron-600 text-sm">Rudrabhishek</Link>
                        <Link to="/pooja/Griha Pravesh" className="block px-4 py-2 text-gray-600 hover:bg-saffron-50 hover:text-saffron-600 text-sm">Griha Pravesh</Link>
                      </div>
                    </div>
                  </div>

                  <div className="relative group">
                    <button className="text-gray-700 hover:text-saffron-600 transition-colors flex items-center gap-1 py-4">
                      Destinations <ChevronDown className="w-4 h-4" />
                    </button>
                    <div className="absolute top-full left-0 w-48 bg-white rounded-xl shadow-xl border border-saffron-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="py-2">
                        <Link to="/pandits?city=Varanasi" className="block px-4 py-2 text-gray-600 hover:bg-saffron-50 hover:text-saffron-600 text-sm">Varanasi</Link>
                        <Link to="/pandits?city=Haridwar" className="block px-4 py-2 text-gray-600 hover:bg-saffron-50 hover:text-saffron-600 text-sm">Haridwar</Link>
                        <Link to="/pandits?city=Ujjain" className="block px-4 py-2 text-gray-600 hover:bg-saffron-50 hover:text-saffron-600 text-sm">Ujjain</Link>
                        <Link to="/pandits?city=Pushkar" className="block px-4 py-2 text-gray-600 hover:bg-saffron-50 hover:text-saffron-600 text-sm">Pushkar</Link>
                        <Link to="/pandits?city=Nashik" className="block px-4 py-2 text-gray-600 hover:bg-saffron-50 hover:text-saffron-600 text-sm">Nashik</Link>
                        <div className="h-px bg-gray-100 my-1"></div>
                        <Link to="/pandits" className="block px-4 py-2 font-bold text-saffron-600 hover:bg-saffron-50 text-sm">All Pandits</Link>
                      </div>
                    </div>
                  </div>
                  
                  <Link to="/pandits" className="px-5 py-2 bg-gradient-to-r from-[#DA6626] to-[#c05c29] text-white rounded-full hover:opacity-90 transition-opacity shadow-md font-bold text-sm ml-2">Book Now</Link>
                </>
              )}

              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center gap-2 group cursor-pointer"
                  >
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}&backgroundColor=fce8db&textColor=854d0e`}
                      alt={user.name}
                      className="w-9 h-9 rounded-full border-2 border-saffron-200 group-hover:border-saffron-500 transition-colors"
                    />
                    <span className="font-semibold text-gray-800 group-hover:text-saffron-600 transition-colors max-w-[120px] truncate">{user.name}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showProfileDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown */}
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-bold text-gray-800 truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                      </div>
                      <Link
                        to="/dashboard/customer"
                        onClick={() => setShowProfileDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-saffron-50 hover:text-saffron-700 transition-colors"
                      >
                        <User className="w-4 h-4" /> My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="text-gray-700 hover:text-saffron-600 transition-colors font-semibold">Login</Link>
              )}
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden flex items-center gap-3">
              {user && (
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}&backgroundColor=fce8db&textColor=854d0e`}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border-2 border-saffron-200"
                />
              )}
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle Menu" className="focus:outline-none">
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 z-[60] md:hidden transition-opacity" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Mobile Nav Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-72 bg-[#1E293B] text-white z-[70] transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        <div className="flex justify-end p-4 border-b border-gray-700/50">
          <button onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-6 h-6 text-gray-400 hover:text-white" />
          </button>
        </div>

        {user ? (
          <div className="p-6 border-b border-gray-700/50 text-center">
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}&backgroundColor=fce8db&textColor=854d0e`}
              alt={user.name}
              className="w-20 h-20 rounded-full border-2 border-saffron-500 mx-auto mb-3 bg-saffron-50"
            />
            <h3 className="font-bold text-xl">{user.name}</h3>
            <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/30 inline-block mt-2 capitalize">
              {user.role}
            </span>
          </div>
        ) : (
          <div className="p-6 border-b border-gray-700/50 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-700 border-2 border-gray-600 mx-auto mb-3 flex items-center justify-center">
              <UserCircle className="w-10 h-10 text-gray-400" />
            </div>
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="inline-block bg-saffron-500 text-white px-6 py-2 rounded-full font-bold mt-2 hover:bg-saffron-600 transition-colors">Login / Sign up</Link>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors">
            🏠 Home
          </Link>
          {(!user || user.role !== 'pandit') && (
            <>
              <Link to="/services" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors">
                🕉️ All Poojas
              </Link>
              <Link to="/pandits?city=Varanasi" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors">
                📍 Destinations
              </Link>
              <Link to="/pandits" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors">
                👥 Find Pandits
              </Link>
              <Link to="/pandits" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-[#DA6626] to-[#c05c29] rounded-lg shadow mt-2">
                📅 Book Now
              </Link>
            </>
          )}

          {user && (
            <>
              <hr className="border-gray-700 my-3" />
              <Link to="/dashboard/customer" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-saffron-500 hover:text-white transition-colors">
                <User className="w-5 h-5" /> My Profile
              </Link>
            </>
          )}
        </nav>

        {user && (
          <div className="p-4 border-t border-gray-700/50 mt-auto">
            <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500 hover:text-white transition-colors">
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
