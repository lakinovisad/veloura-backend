import React from 'react';
import { 
  ArrowLeft, 
  Heart, 
  Sparkles,
  Home
} from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-lavender-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-20 floating-animation"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200 rounded-full opacity-30 floating-delay"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-lavender-200 rounded-full opacity-15 floating-delay-2"></div>
        <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-pink-300 rounded-full opacity-25 pulse-soft"></div>
        <div className="absolute bottom-20 right-1/4 w-20 h-20 bg-purple-300 rounded-full opacity-20 floating-animation"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Illustration Section */}
        <div className="mb-12">
          {/* Spa Woman Silhouette Illustration */}
          <div className="relative mx-auto w-80 h-80 mb-8">
            {/* Spa background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full opacity-30"></div>
            
            {/* Lotus/Spa elements */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full opacity-40 floating-animation"></div>
            </div>
            
            {/* Woman silhouette */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                width="200"
                height="240"
                viewBox="0 0 200 240"
                className="text-purple-300 opacity-60"
                fill="currentColor"
              >
                {/* Simple elegant woman silhouette in spa pose */}
                <path d="M100 40 C85 40, 75 50, 75 65 C75 80, 85 90, 100 90 C115 90, 125 80, 125 65 C125 50, 115 40, 100 40 Z" />
                <path d="M100 85 C90 85, 80 95, 80 110 L80 140 C80 145, 85 150, 90 150 L110 150 C115 150, 120 145, 120 140 L120 110 C120 95, 110 85, 100 85 Z" />
                <path d="M70 120 C65 115, 55 115, 50 120 C45 125, 45 135, 50 140 C55 145, 65 145, 70 140 L75 135 L75 125 Z" />
                <path d="M130 120 C135 115, 145 115, 150 120 C155 125, 155 135, 150 140 C145 145, 135 145, 130 140 L125 135 L125 125 Z" />
                <path d="M85 150 L85 200 C85 205, 80 210, 75 210 C70 210, 65 205, 65 200 L65 180 C65 175, 70 170, 75 170 C80 170, 85 175, 85 180 Z" />
                <path d="M115 150 L115 200 C115 205, 120 210, 125 210 C130 210, 135 205, 135 200 L135 180 C135 175, 130 170, 125 170 C120 170, 115 175, 115 180 Z" />
              </svg>
            </div>

            {/* Decorative spa elements */}
            <div className="absolute bottom-4 left-8">
              <div className="w-8 h-8 bg-gradient-to-br from-lavender-300 to-pink-300 rounded-full opacity-50 pulse-soft"></div>
            </div>
            <div className="absolute bottom-8 right-12">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full opacity-40 floating-delay"></div>
            </div>
            <div className="absolute top-16 right-8">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-300 to-lavender-300 rounded-full opacity-30 floating-delay-2"></div>
            </div>

            {/* Sparkle effects */}
            <div className="absolute top-12 left-12">
              <Sparkles className="text-purple-300 opacity-40" size={20} />
            </div>
            <div className="absolute bottom-16 right-16">
              <Sparkles className="text-pink-300 opacity-50" size={16} />
            </div>
            <div className="absolute top-20 right-20">
              <Heart className="text-lavender-300 opacity-40" size={18} />
            </div>
          </div>

          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-8xl md:text-9xl font-playfair font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-lavender-400 bg-clip-text text-transparent opacity-80">
              404
            </h1>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-8">
          {/* Main Message */}
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-gray-800">
              Ups! Stranica koju tražiš ne postoji.
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Možda je stranica promenila adresu ili je privremeno nedostupna.
              <span className="block mt-2 text-lg text-purple-600">
                Ne brini, tvoja lepota putovanja te čeka na početnoj strani.
              </span>
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-8">
            <button className="group bg-gradient-to-r from-purple-500 to-pink-500 text-white px-10 py-5 rounded-full text-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto">
              <Home size={24} />
              Vrati se na početnu
              <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform duration-300" />
            </button>
          </div>

          {/* Additional Help */}
          <div className="pt-8 space-y-4">
            <p className="text-gray-500 text-lg">
              Ili možeš da:
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="#"
                className="text-purple-600 hover:text-purple-800 font-medium transition-colors duration-300 flex items-center gap-2"
              >
                <Sparkles size={16} />
                Pogledaj naše usluge
              </a>
              
              <span className="hidden sm:block text-gray-300">•</span>
              
              <a
                href="#"
                className="text-purple-600 hover:text-purple-800 font-medium transition-colors duration-300 flex items-center gap-2"
              >
                <Heart size={16} />
                Kontaktiraj podršku
              </a>
            </div>
          </div>
        </div>

        {/* Bottom decorative quote */}
        <div className="mt-16 pt-8 border-t border-purple-100">
          <p className="text-gray-400 italic font-playfair text-lg">
            "Svaki trenutak je prilika za novi početak lepote."
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;