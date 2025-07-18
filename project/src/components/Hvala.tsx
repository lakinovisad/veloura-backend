import React from 'react';
import { 
  Heart, 
  Sparkles, 
  ArrowLeft,
  Download,
  MessageCircle,
  Star,
  Flower2,
  Gift
} from 'lucide-react';

const Hvala = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-lavender-50 to-pink-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-15 floating-animation"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200 rounded-full opacity-20 floating-delay"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-lavender-200 rounded-full opacity-10 floating-delay-2"></div>
        <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-pink-300 rounded-full opacity-15 pulse-soft"></div>
        <div className="absolute bottom-20 right-1/4 w-20 h-20 bg-purple-300 rounded-full opacity-12 floating-animation"></div>
        <div className="absolute top-1/4 left-1/3 w-12 h-12 bg-lavender-300 rounded-full opacity-18 floating-delay"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Illustration Section */}
        <div className="mb-16">
          {/* Zen/Gratitude Illustration */}
          <div className="relative mx-auto w-96 h-96 mb-12">
            {/* Main circle background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 via-pink-100/20 to-lavender-100/30 rounded-full"></div>
            
            {/* Inner decorative circles */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gradient-to-br from-pink-200/40 to-purple-200/30 rounded-full floating-animation"></div>
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-lavender-200/40 to-pink-200/30 rounded-full floating-delay"></div>
            
            {/* Elegant woman silhouette in gratitude pose */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                width="220"
                height="260"
                viewBox="0 0 220 260"
                className="text-purple-300/50"
                fill="currentColor"
              >
                {/* Woman in peaceful/grateful pose with hands at heart */}
                <path d="M110 45 C95 45, 85 55, 85 70 C85 85, 95 95, 110 95 C125 95, 135 85, 135 70 C135 55, 125 45, 110 45 Z" />
                <path d="M110 90 C100 90, 90 100, 90 115 L90 145 C90 150, 95 155, 100 155 L120 155 C125 155, 130 150, 130 145 L130 115 C130 100, 120 90, 110 90 Z" />
                {/* Arms in prayer/gratitude position */}
                <path d="M85 125 C80 120, 75 125, 75 130 L80 135 C85 140, 95 140, 100 135 L105 130 L100 125 Z" />
                <path d="M135 125 C140 120, 145 125, 145 130 L140 135 C135 140, 125 140, 120 135 L115 130 L120 125 Z" />
                {/* Legs in seated meditation pose */}
                <path d="M95 155 L95 185 C90 190, 85 195, 80 200 C75 205, 75 215, 80 220 C85 225, 95 225, 100 220 L105 215 Z" />
                <path d="M125 155 L125 185 C130 190, 135 195, 140 200 C145 205, 145 215, 140 220 C135 225, 125 225, 120 220 L115 215 Z" />
              </svg>
            </div>

            {/* Floating hearts and sparkles */}
            <div className="absolute top-16 left-16">
              <Heart className="text-pink-300/60 floating-animation" size={24} />
            </div>
            <div className="absolute top-20 right-20">
              <Sparkles className="text-purple-300/50 floating-delay" size={20} />
            </div>
            <div className="absolute bottom-20 left-20">
              <Flower2 className="text-lavender-300/60 floating-delay-2" size={22} />
            </div>
            <div className="absolute bottom-24 right-16">
              <Star className="text-pink-300/50 pulse-soft" size={18} />
            </div>
            
            {/* Additional zen elements */}
            <div className="absolute top-32 left-8">
              <div className="w-6 h-6 bg-gradient-to-br from-lavender-300/40 to-pink-300/30 rounded-full pulse-soft"></div>
            </div>
            <div className="absolute bottom-32 right-8">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-300/30 to-pink-300/40 rounded-full floating-animation"></div>
            </div>
            <div className="absolute top-1/2 left-4">
              <div className="w-4 h-4 bg-gradient-to-br from-pink-300/50 to-lavender-300/40 rounded-full floating-delay"></div>
            </div>
            <div className="absolute top-1/2 right-4">
              <div className="w-5 h-5 bg-gradient-to-br from-purple-300/40 to-pink-300/30 rounded-full floating-delay-2"></div>
            </div>

            {/* Subtle glow effect */}
            <div className="absolute inset-8 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl"></div>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-12">
          {/* Main Message */}
          <div className="space-y-6 fade-in-up">
            <h1 className="text-5xl md:text-7xl font-playfair font-bold text-gray-800 leading-tight">
              Hvala ti na
              <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent">
                poverenju
              </span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light fade-in-up-delay">
              Tvoj sledeći korak ka lepoti upravo je počeo.
            </p>
          </div>

          {/* Gratitude Message */}
          <div className="fade-in-up-delay-2 max-w-2xl mx-auto">
            <p className="text-xl text-gray-500 leading-relaxed italic font-light">
              "Svaki trenutak lepote počinje sa zahvalnošću. 
              <span className="block mt-2">Hvala što si odabrala da budeš deo naše zajednice."</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="fade-in-up-delay-2 flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
            <button className="group bg-gradient-to-r from-purple-500 to-pink-500 text-white px-10 py-5 rounded-full text-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3">
              <Download size={24} />
              Preuzmi aplikaciju
              <Sparkles size={20} className="group-hover:rotate-12 transition-transform duration-300" />
            </button>
            
            <button className="group border-2 border-purple-300 text-purple-700 px-10 py-5 rounded-full text-xl font-semibold hover:bg-purple-50 hover:border-purple-400 hover:scale-105 transition-all duration-300 flex items-center gap-3">
              <ArrowLeft size={24} />
              Vrati se na početnu
            </button>
          </div>

          {/* Additional Benefits/Next Steps */}
          <div className="fade-in-up-delay-2 pt-12">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50 max-w-3xl mx-auto">
              <h3 className="text-2xl font-playfair font-semibold text-gray-800 mb-6">
                Šta te čeka dalje?
              </h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto">
                    <Sparkles className="text-purple-600" size={24} />
                  </div>
                  <h4 className="font-semibold text-gray-800">Otkrivaj salone</h4>
                  <p className="text-sm text-gray-600">Pronađi najbolje salone u tvom gradu</p>
                </div>
                
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-lavender-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto">
                    <Heart className="text-pink-600" size={24} />
                  </div>
                  <h4 className="font-semibold text-gray-800">Zakaži tretmane</h4>
                  <p className="text-sm text-gray-600">Jednostavno zakazivanje u par klikova</p>
                </div>
                
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl flex items-center justify-center mx-auto">
                    <Gift className="text-purple-600" size={24} />
                  </div>
                  <h4 className="font-semibold text-gray-800">Uživaj u benefitima</h4>
                  <p className="text-sm text-gray-600">Ekskluzivni popusti i ponude</p>
                </div>
              </div>
            </div>
          </div>

          {/* Support Message */}
          <div className="fade-in-up-delay-2 pt-8">
            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Ako imaš pitanja, uvek nam se možeš javiti.
              <span className="block mt-2">
                <a 
                  href="#" 
                  className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium transition-colors duration-300"
                >
                  <MessageCircle size={18} />
                  Kontaktiraj podršku
                </a>
              </span>
            </p>
          </div>

          {/* Bottom decorative quote */}
          <div className="pt-16 border-t border-purple-100/50">
            <p className="text-gray-400 italic font-playfair text-xl">
              "Lepota počinje trenutkom kada odlučiš da budeš svoja."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hvala;