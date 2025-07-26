import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Plus, Menu, X, LogOut, MessageCircle } from 'lucide-react';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import Auth from './Auth';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        fetchUnreadMessages(user.uid);
      } else {
        setUnreadMessages(0);
      }
    });
    return unsubscribe;
  }, []);

  const fetchUnreadMessages = (userId) => {
    const q = query(
      collection(db, 'messages'),
      where('toUserId', '==', userId),
      where('read', '==', false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUnreadMessages(snapshot.docs.length);
    });

    return unsubscribe;
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Barnearbeid</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/services" className="text-gray-600 hover:text-gray-900 transition-colors">
              Finn jobber
            </Link>
            {!user && (
              <Link to="/create-service" className="text-gray-600 hover:text-gray-900 transition-colors">
                Tilby tjeneste
              </Link>
            )}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Søk etter jobber..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/create-service" className="btn-secondary flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Post jobb</span>
                </Link>
                <Link to="/profile" className="p-2 text-gray-600 hover:text-gray-900 transition-colors relative">
                  <User className="w-5 h-5" />
                  {unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadMessages > 9 ? '9+' : unreadMessages}
                    </span>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  title="Logg ut"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="btn-primary"
              >
                Logg inn
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-4">
              <Link
                to="/services"
                className="block text-gray-600 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                Finn jobber
              </Link>
              {user ? (
                <>
                  <Link
                    to="/create-service"
                    className="block text-gray-600 hover:text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Post jobb
                  </Link>
                  <Link
                    to="/profile"
                    className="block text-gray-600 hover:text-gray-900 flex items-center justify-between"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>Profil</span>
                    {unreadMessages > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadMessages > 9 ? '9+' : unreadMessages}
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left text-gray-600 hover:text-gray-900"
                  >
                    Logg ut
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/create-service"
                    className="block text-gray-600 hover:text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Tilby tjeneste
                  </Link>
                  <button
                    onClick={() => {
                      setShowAuth(true);
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left text-gray-600 hover:text-gray-900"
                  >
                    Logg inn
                  </button>
                </>
              )}
              <div className="pt-4">
                <input
                  type="text"
                  placeholder="Søk etter jobber..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Auth Modal */}
      {showAuth && <Auth onClose={() => setShowAuth(false)} />}
    </nav>
  );
};

export default Navbar; 