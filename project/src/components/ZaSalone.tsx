import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Calendar, 
  TrendingUp, 
  Star, 
  Shield, 
  Users, 
  Sparkles, 
  CheckCircle,
  Clock,
  Award,
  BarChart3,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Phone,
  MessageSquare,
  Heart,
  Target,
  Zap,
  Globe
} from 'lucide-react';

const ZaSalone = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const testimonials = [
    {
      id: 1,
      name: "Ana Marković",
      role: "Vlasnica kozmetičkog salona 'Bella'",
      image: "https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      quote: "Od kada koristim Velouru, moji klijenti sami zakazuju tretmane – meni ostaje više vremena za kvalitetan rad. Broj rezervacija se udvostručio!",
      rating: 5,
      salon: "Salon Bella"
    },
    {
      id: 2,
      name: "Jovana Stefanović",
      role: "Frizerka i vlasnica salona 'Style Studio'",
      image: "https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      quote: "Veloura mi je pomogla da bolje organizujem svoj raspored bez stresa. Klijenti su zadovoljniji, a ja imam bolju kontrolu nad poslom.",
      rating: 5,
      salon: "Style Studio"
    },
    {
      id: 3,
      name: "Milica Popović",
      role: "Vlasnica spa centra 'Relax Zone'",
      image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      quote: "Platforma je elegantna i profesionalna – savršeno predstavlja moj premium spa. Klijenti su oduševljeni jednostavnošću zakazivanja.",
      rating: 5,
      salon: "Relax Zone Spa"
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-lavender-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-20 floating-animation"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200 rounded-full opacity-30 floating-delay"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-lavender-200 rounded-full opacity-15 floating-delay-2"></div>
          <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-pink-300 rounded-full opacity-25 pulse-soft"></div>
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="fade-in-up">
            <h1 className="text-5xl md:text-7xl font-playfair font-bold text-gray-800 mb-6">
              Priključi se platformi
              <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent">
                koja menja industriju lepote
              </span>
            </h1>
          </div>
          
          <div className="fade-in-up-delay">
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed max-w-4xl mx-auto">
              Povećaj broj klijenata, olakšaj zakazivanja i upravljaj salonom sa lakoćom.
              <span className="block mt-2">Veloura je platforma koja spaja eleganciju sa efikasnošću.</span>
            </p>
          </div>

          <div className="fade-in-up-delay-2 flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2">
              <Building2 size={20} />
              Prijavi salon
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            
            <button className="group border-2 border-purple-300 text-purple-700 px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-50 hover:border-purple-400 transition-all duration-300 flex items-center gap-2">
              <Phone size={20} />
              Kontaktiraj nas
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 text-gray-600">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                <TrendingUp className="text-green-600" size={20} />
              </div>
              <div>
                <div className="font-semibold text-gray-800">+150% rezervacija</div>
                <div className="text-sm">Prosečan rast</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-3 text-gray-600">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                <Users size={20} className="text-purple-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-800">1000+ salona</div>
                <div className="text-sm">Već koristi Velouru</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-3 text-gray-600">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                <Star className="text-yellow-500 fill-current" size={20} />
              </div>
              <div>
                <div className="font-semibold text-gray-800">4.8 ocena</div>
                <div className="text-sm">Od partnera</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-gray-800 mb-4">
              Kako funkcioniše?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tri jednostavna koraka do digitalne transformacije tvog salona
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection lines for desktop */}
            <div className="hidden md:block absolute top-24 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-purple-300 to-pink-300"></div>
            
            <div className="group relative text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300">
                <Building2 className="text-white" size={28} />
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <h3 className="text-2xl font-playfair font-semibold text-gray-800 mb-4">
                  1. Registruj svoj salon
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Kreiraj profil salona sa fotografijama, opisom i osnovnim informacijama. Naš tim će te voditi kroz ceo proces registracije.
                </p>
              </div>
            </div>

            <div className="group relative text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-lavender-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="text-white" size={28} />
              </div>
              <div className="bg-gradient-to-br from-lavender-50 to-purple-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <h3 className="text-2xl font-playfair font-semibold text-gray-800 mb-4">
                  2. Dodaj usluge i radno vreme
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Unesi sve tretmane koje nudiš, cene, trajanje i dostupnost. Prilagodi kalendar prema tvom rasporedu rada.
                </p>
              </div>
            </div>

            <div className="group relative text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="text-white" size={28} />
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <h3 className="text-2xl font-playfair font-semibold text-gray-800 mb-4">
                  3. Primi zakazivanja automatski
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Klijenti zakazuju termine direktno kroz aplikaciju. Ti dobijaš notifikacije i upravljaš rasporedom iz jednog mesta.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Veloura Section */}
      <section className="py-20 bg-gradient-to-br from-lavender-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-gray-800 mb-4">
              Zašto Veloura?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Otkrivaj prednosti koje čine Velouru idealnom platformom za tvoj salon
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Phone size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-playfair font-semibold text-gray-800 mb-4">
                Više zakazanih termina
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Bez telefonskih poziva i propuštenih rezervacija. Klijenti zakazuju 24/7, a ti dobijaš više termina automatski.
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-lavender-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-playfair font-semibold text-gray-800 mb-4">
                Uređen kalendar i raspored
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Sve rezervacije na jednom mestu. Jasno vidiš svoj raspored, upravljaš terminima i planiraš radni dan efikasno.
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Star size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-playfair font-semibold text-gray-800 mb-4">
                Recenzije koje grade poverenje
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Zadovoljni klijenti ostavljaju ocene koje privlače nove goste. Gradi reputaciju kroz pozitivna iskustva.
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-lavender-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-playfair font-semibold text-gray-800 mb-4">
                Luksuzna prezentacija salona
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Tvoj salon se predstavlja kroz elegantnu aplikaciju koja odražava kvalitet i profesionalnost tvog rada.
              </p>
            </div>
          </div>

          {/* Additional Benefits */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCircle size={18} className="text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Automatska potvrda</h4>
                <p className="text-gray-600 text-sm">Klijenti odmah znaju da li je termin dostupan i rezervisan</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Target size={18} className="text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Ciljana promocija</h4>
                <p className="text-gray-600 text-sm">Dosegni prave klijente kroz našu platformu</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Zap size={18} className="text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Brza podrška</h4>
                <p className="text-gray-600 text-sm">Naš tim je tu da ti pomogne kad god zatreba</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-gray-800 mb-4">
              Iskustva naših partnera
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Čuj šta kažu vlasnici salona koji su već transformisali svoj posao sa Velourom
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 md:p-12 shadow-xl">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <img
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].name}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover shadow-lg"
                  />
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <div className="flex justify-center md:justify-start text-yellow-400 mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} size={20} fill="currentColor" />
                    ))}
                  </div>
                  
                  <blockquote className="text-xl md:text-2xl text-gray-700 italic leading-relaxed mb-6">
                    "{testimonials[currentTestimonial].quote}"
                  </blockquote>
                  
                  <div>
                    <div className="font-playfair font-semibold text-xl text-gray-800">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-purple-600 font-medium">
                      {testimonials[currentTestimonial].role}
                    </div>
                    <div className="text-gray-500 text-sm mt-1">
                      {testimonials[currentTestimonial].salon}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-purple-600 hover:bg-purple-50 transition-colors duration-300"
            >
              <ChevronLeft size={24} />
            </button>
            
            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-purple-600 hover:bg-purple-50 transition-colors duration-300"
            >
              <ChevronRight size={24} />
            </button>

            {/* Dots indicator */}
            <div className="flex justify-center mt-8 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    index === currentTestimonial
                      ? 'bg-purple-600'
                      : 'bg-purple-200 hover:bg-purple-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-lavender-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-gray-800 mb-4">
              Rezultati koji govore
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Brojevi koji pokazuju zašto su saloni odabrali Velouru
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-4xl md:text-5xl font-playfair font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                +150%
              </div>
              <p className="text-gray-600 font-medium">Povećanje rezervacija</p>
            </div>
            
            <div className="text-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-4xl md:text-5xl font-playfair font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                1000+
              </div>
              <p className="text-gray-600 font-medium">Partnera salona</p>
            </div>
            
            <div className="text-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-4xl md:text-5xl font-playfair font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                4.8
              </div>
              <p className="text-gray-600 font-medium">Ocena partnera</p>
            </div>
            
            <div className="text-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-4xl md:text-5xl font-playfair font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <p className="text-gray-600 font-medium">Podrška i zakazivanje</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-800 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full floating-animation"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-white/15 rounded-full floating-delay"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/20 rounded-full pulse-soft"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-6">
            Pridruži se zajednici najlepših salona
          </h2>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-12 leading-relaxed">
            Transformiši svoj salon sa Velourom i pridruži se hiljadama zadovoljnih partnera.
            <span className="block mt-2">Tvoj uspeh počinje danas.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="group bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-50 hover:scale-105 transition-all duration-300 flex items-center gap-2 shadow-xl">
              <Building2 size={20} />
              Registruj salon
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            
            <button className="group border-2 border-white/50 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 hover:border-white transition-all duration-300 flex items-center gap-2">
              <MessageSquare size={20} />
              Razgovaraj sa nama
            </button>
          </div>

          <div className="mt-12 flex justify-center items-center gap-8 text-sm text-purple-100">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} />
              <span>Besplatna registracija</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={16} />
              <span>Sigurna platforma</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart size={16} />
              <span>Posvećena podrška</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ZaSalone;