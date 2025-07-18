import React from 'react';
import { 
  Home, 
  Users, 
  Building2, 
  FileText, 
  LogIn, 
  Mail,
  Heart,
  Instagram,
  Facebook
} from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: 'home' | 'korisnici' | 'saloni' | 'prijava' | '404' | 'uslovi' | 'hvala') => void;
}

const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  return (
    <footer className="bg-gradient-to-br from-lavender-50 via-purple-50 to-pink-50 border-t border-lavender-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Heart className="text-white" size={20} />
              </div>
              <h3 className="text-2xl font-playfair font-bold text-gray-800">
                Veloura
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed mb-6 font-light">
              Tvoja svakodnevna doza lepote. Platforma koja spaja eleganciju sa jednostavnošću zakazivanja tretmana.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center text-purple-600 hover:bg-purple-100 hover:scale-110 transition-all duration-300 shadow-sm"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center text-purple-600 hover:bg-purple-100 hover:scale-110 transition-all duration-300 shadow-sm"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center text-purple-600 hover:bg-purple-100 hover:scale-110 transition-all duration-300 shadow-sm"
                aria-label="TikTok"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold text-gray-800 mb-6 font-playfair">
              Navigacija
            </h4>
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => setCurrentPage('home')}
                  className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors duration-300 font-light group"
                >
                  <Home size={16} className="group-hover:scale-110 transition-transform duration-300" />
                  Početna
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('korisnici')}
                  className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors duration-300 font-light group"
                >
                  <Users size={16} className="group-hover:scale-110 transition-transform duration-300" />
                  Za korisnike
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('saloni')}
                  className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors duration-300 font-light group"
                >
                  <Building2 size={16} className="group-hover:scale-110 transition-transform duration-300" />
                  Za salone
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('prijava')}
                  className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors duration-300 font-light group"
                >
                  <LogIn size={16} className="group-hover:scale-110 transition-transform duration-300" />
                  Prijava
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold text-gray-800 mb-6 font-playfair">
              Podrška
            </h4>
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => setCurrentPage('uslovi')}
                  className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors duration-300 font-light group"
                >
                  <FileText size={16} className="group-hover:scale-110 transition-transform duration-300" />
                  Uslovi korišćenja
                </button>
              </li>
              <li>
                <a
                  href="mailto:podrska@veloura.rs"
                  className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors duration-300 font-light group"
                >
                  <Mail size={16} className="group-hover:scale-110 transition-transform duration-300" />
                  Kontakt
                </a>
              </li>
              <li>
                <a
                  href="tel:+381112345678"
                  className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors duration-300 font-light group"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform duration-300">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  +381 11 234 5678
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter/CTA */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold text-gray-800 mb-6 font-playfair">
              Ostani u toku
            </h4>
            <p className="text-gray-600 mb-4 font-light leading-relaxed">
              Budi prva koja će saznati o novim salonima i ekskluzivnim ponudama.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Tvoja email adresa"
                className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 placeholder-gray-500 font-light"
              />
              <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300">
                Pretplati se
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-lavender-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-500 text-sm font-light">
              © 2025 Veloura. Sva prava zadržana.
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-purple-600 transition-colors duration-300 font-light">
                Politika privatnosti
              </a>
              <a href="#" className="hover:text-purple-600 transition-colors duration-300 font-light">
                Kolačići
              </a>
              <a href="#" className="hover:text-purple-600 transition-colors duration-300 font-light">
                Mapa sajta
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-lavender-200/20 to-purple-200/20 rounded-full blur-2xl"></div>
    </footer>
  );
};

export default Footer;