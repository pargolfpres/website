import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Menu, X, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEditMode } from '@/contexts/EditModeContext';

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { isEditMode, isAdmin, toggleEditMode } = useEditMode();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('tkr_token');
    if (token) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setUser(data))
        .catch(() => localStorage.removeItem('tkr_token'));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('tkr_token');
    setUser(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      {/* Navigation */}
      <nav
        data-testid="main-navigation"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-lg py-3' : 'bg-white/95 backdrop-blur-md py-4'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0" data-testid="logo-link">
              <img
                src="https://customer-assets.emergentagent.com/job_realestate-pro-35/artifacts/elh4rf6l_walllogoTR2.png"
                alt="TKR Coaching"
                className="h-9 w-9 object-contain flex-shrink-0"
              />
              <div className="flex flex-col leading-none">
                <span className="text-base font-bold whitespace-nowrap" style={{ color: '#6f1d1b' }}>TKR Coaching</span>
                <span className="text-[10px] whitespace-nowrap" style={{ color: '#bb9457' }}>Todd K Roberson</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 ml-4">
              <Link
                to="/courses"
                data-testid="nav-courses-link"
                className="font-medium transition-colors hover:opacity-80"
                style={{ color: '#6f1d1b' }}
              >
                Courses
              </Link>
              <Link
                to="/podcast"
                data-testid="nav-podcast-link"
                className="font-medium transition-colors hover:opacity-80"
                style={{ color: '#6f1d1b' }}
              >
                Podcast
              </Link>
              <Link
                to="/resources"
                data-testid="nav-resources-link"
                className="font-medium transition-colors hover:opacity-80"
                style={{ color: '#6f1d1b' }}
              >
                Resources
              </Link>
              <Link
                to="/community"
                data-testid="nav-community-link"
                className="font-medium transition-colors hover:opacity-80"
                style={{ color: '#6f1d1b' }}
              >
                Community
              </Link>
              <Link
                to="/pricing"
                data-testid="nav-pricing-link"
                className="font-medium transition-colors hover:opacity-80"
                style={{ color: '#6f1d1b' }}
              >
                Pricing
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="ghost" data-testid="nav-dashboard-button" style={{ color: '#6f1d1b' }}>
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    data-testid="nav-logout-button"
                    style={{ borderColor: '#bb9457', color: '#6f1d1b' }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" data-testid="nav-login-button" style={{ color: '#6f1d1b' }}>
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button
                      className="text-white hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: '#6f1d1b' }}
                      data-testid="nav-signup-button"
                    >
                      Get Started Today
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
              data-testid="mobile-menu-button"
              style={{ color: '#6f1d1b' }}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden pt-4 pb-3 space-y-3" data-testid="mobile-menu">
              <Link
                to="/courses"
                className="block py-2 hover:opacity-80"
                style={{ color: '#6f1d1b' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Courses
              </Link>
              <Link
                to="/podcast"
                className="block py-2 hover:opacity-80"
                style={{ color: '#6f1d1b' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Podcast
              </Link>
              <Link
                to="/resources"
                className="block py-2 hover:opacity-80"
                style={{ color: '#6f1d1b' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Resources
              </Link>
              <Link
                to="/community"
                className="block py-2 hover:opacity-80"
                style={{ color: '#6f1d1b' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Community
              </Link>
              <Link
                to="/pricing"
                className="block py-2 hover:opacity-80"
                style={{ color: '#6f1d1b' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <div className="pt-3 space-y-2">
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full" variant="outline">
                        Dashboard
                      </Button>
                    </Link>
                    <Button className="w-full" variant="outline" onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full" variant="outline">
                        Login
                      </Button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full text-white" style={{ backgroundColor: '#6f1d1b' }}>
                        Get Started Today
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="text-white py-12" data-testid="footer" style={{ backgroundColor: '#4a1312' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img
                  src="https://customer-assets.emergentagent.com/job_realestate-pro-35/artifacts/elh4rf6l_walllogoTR2.png"
                  alt="TKR Coaching"
                  className="h-10 w-auto"
                />
                <span className="font-bold" style={{ color: '#ffe6a7' }}>TKR Coaching</span>
              </div>
              <p className="text-sm" style={{ color: '#bb9457' }}>Transform Your Real Estate Career From Your Pocket</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4" style={{ color: '#ffe6a7' }}>Platform</h3>
              <ul className="space-y-2 text-sm" style={{ color: '#bb9457' }}>
                <li>
                  <Link to="/courses" className="hover:opacity-80 transition-opacity">
                    Courses
                  </Link>
                </li>
                <li>
                  <Link to="/podcast" className="hover:opacity-80 transition-opacity">
                    Podcast
                  </Link>
                </li>
                <li>
                  <Link to="/community" className="hover:opacity-80 transition-opacity">
                    Community
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="hover:opacity-80 transition-opacity">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4" style={{ color: '#ffe6a7' }}>Company</h3>
              <ul className="space-y-2 text-sm" style={{ color: '#bb9457' }}>
                <li>
                  <Link to="/about" className="hover:opacity-80 transition-opacity">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:opacity-80 transition-opacity">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="hover:opacity-80 transition-opacity">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms-of-service" className="hover:opacity-80 transition-opacity">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4" style={{ color: '#ffe6a7' }}>Download App</h3>
              <div className="space-y-3">
                <a
                  href="#"
                  className="block rounded-lg px-4 py-2 text-sm transition-opacity hover:opacity-80"
                  style={{ backgroundColor: '#6f1d1b', color: '#ffe6a7' }}
                >
                  Download on iOS
                </a>
                <a
                  href="#"
                  className="block rounded-lg px-4 py-2 text-sm transition-opacity hover:opacity-80"
                  style={{ backgroundColor: '#6f1d1b', color: '#ffe6a7' }}
                >
                  Get it on Android
                </a>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm" style={{ borderColor: '#6f1d1b', color: '#bb9457' }}>
            <p>&copy; 2025 TKR Coaching. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
