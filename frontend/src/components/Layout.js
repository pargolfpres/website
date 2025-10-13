import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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
    <div className="min-h-screen flex flex-col">
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
            <Link to="/" className="flex items-center space-x-2" data-testid="logo-link">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-800 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">TKR</span>
              </div>
              <span className="text-xl font-bold text-gray-900">TKR Coaching</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/courses"
                data-testid="nav-courses-link"
                className="text-gray-700 hover:text-blue-800 font-medium transition-colors"
              >
                Courses
              </Link>
              <Link
                to="/podcast"
                data-testid="nav-podcast-link"
                className="text-gray-700 hover:text-blue-800 font-medium transition-colors"
              >
                Podcast
              </Link>
              <Link
                to="/resources"
                data-testid="nav-resources-link"
                className="text-gray-700 hover:text-blue-800 font-medium transition-colors"
              >
                Resources
              </Link>
              <Link
                to="/community"
                data-testid="nav-community-link"
                className="text-gray-700 hover:text-blue-800 font-medium transition-colors"
              >
                Community
              </Link>
              <Link
                to="/pricing"
                data-testid="nav-pricing-link"
                className="text-gray-700 hover:text-blue-800 font-medium transition-colors"
              >
                Pricing
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="ghost" data-testid="nav-dashboard-button">
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    data-testid="nav-logout-button"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" data-testid="nav-login-button">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button
                      className="bg-blue-800 hover:bg-blue-900 text-white"
                      data-testid="nav-signup-button"
                    >
                      Get Started Free
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
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden pt-4 pb-3 space-y-3" data-testid="mobile-menu">
              <Link
                to="/courses"
                className="block text-gray-700 hover:text-blue-800 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Courses
              </Link>
              <Link
                to="/podcast"
                className="block text-gray-700 hover:text-blue-800 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Podcast
              </Link>
              <Link
                to="/resources"
                className="block text-gray-700 hover:text-blue-800 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Resources
              </Link>
              <Link
                to="/community"
                className="block text-gray-700 hover:text-blue-800 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Community
              </Link>
              <Link
                to="/pricing"
                className="block text-gray-700 hover:text-blue-800 py-2"
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
                      <Button className="w-full bg-blue-800 hover:bg-blue-900 text-white">
                        Get Started Free
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
      <footer className="bg-gray-900 text-gray-300 py-12" data-testid="footer">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-800 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">TKR</span>
                </div>
                <span className="text-white font-bold">TKR Coaching</span>
              </div>
              <p className="text-sm">Transform Your Real Estate Career From Your Pocket</p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/courses" className="hover:text-white transition-colors">
                    Courses
                  </Link>
                </li>
                <li>
                  <Link to="/podcast" className="hover:text-white transition-colors">
                    Podcast
                  </Link>
                </li>
                <li>
                  <Link to="/community" className="hover:text-white transition-colors">
                    Community
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Download App</h3>
              <div className="space-y-3">
                <a
                  href="#"
                  className="block bg-gray-800 hover:bg-gray-700 rounded-lg px-4 py-2 text-sm transition-colors"
                >
                  📱 Download on iOS
                </a>
                <a
                  href="#"
                  className="block bg-gray-800 hover:bg-gray-700 rounded-lg px-4 py-2 text-sm transition-colors"
                >
                  🤖 Get it on Android
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2025 TKR Coaching. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
