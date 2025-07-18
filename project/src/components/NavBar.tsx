import React from 'react';
import { Home, Users, Building2, LogIn, Heart } from 'lucide-react';

interface NavBarProps {
  currentPage: 'home' | 'korisnici' | 'saloni' | 'prijava' | '404' | 'uslovi' | 'hvala';
  setCurrentPage: (page: 'home' | 'korisnici' | 'saloni' | 'prijava' | '404' | 'uslovi' | 'hvala') => void;
}

const NavBar: React.FC<NavBarProps> = ({ currentPage, setCurrentPage }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg z-50 border-b border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 text-2xl font-playfair font-bold text-gray-800 hover:text-purple-600 transition-colors duration-300 group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Heart className="text-white" size={18} />
            </div>
            Veloura
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage('home')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                currentPage === 'home'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              <Home size={18} />
              Početna
            </button>
            
            <button
              onClick={() => setCurrentPage('korisnici')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                currentPage === 'korisnici'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              <Users size={18} />
              Za korisnike
            </button>
            
            <button
              onClick={() => setCurrentPage('saloni')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                currentPage === 'saloni'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              <Building2 size={18} />
              Za salone
            </button>
            
            <button
              onClick={() => setCurrentPage('prijava')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ml-2 ${
                currentPage === 'prijava'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'border-2 border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400'
              }`}
            >
              <LogIn size={18} />
              Prijava
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setCurrentPage('prijava')}
              className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400 font-medium transition-all duration-300"
            >
              <LogIn size={18} />
              Prijava
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className="md:hidden pb-4">
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => setCurrentPage('home')}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                currentPage === 'home'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              <Home size={18} />
              Početna
            </button>
            
            <button
              onClick={() => setCurrentPage('korisnici')}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                currentPage === 'korisnici'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              <Users size={18} />
              Za korisnike
            </button>
            
            <button
              onClick={() => setCurrentPage('saloni')}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                currentPage === 'saloni'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              <Building2 size={18} />
              Za salone
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;