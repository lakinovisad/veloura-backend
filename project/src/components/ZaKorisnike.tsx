import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Calendar, 
  Heart, 
  Star, 
  Shield, 
  Users, 
  Sparkles, 
  Download,
  CheckCircle,
  Clock,
  Award,
  Smartphone,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const ZaKorisnike = () => {
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
      name: "Marina Petrović",
      role: "Redovan korisnik",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      quote: "Konačno aplikacija koja izgleda lepo i funkcioniše savršeno. Zakazivanje je postalo užitak, a ne obaveza!",
      rating: 5
    },
    {
      id: 2,
      name: "Ivana Nikolić",
      role: "Beauty entuzijasta",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      quote: "Sve u jednoj aplikaciji – frizer, nokti, masaža... Savršeno! Štedi mi toliko vremena i uvek znam da ću dobiti kvalitetan tretman.",
      rating: 5
    },
    {
      id: 3,
      name: "Milica Jovanović",
      role: "Zaposlena mama",
      image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      quote: "Kao zaposlena mama, Veloura mi je omogućila da konačno nađem vreme za sebe. Zakazujem tretmane kada mi odgovara, bez stresa.",
      rating: 5
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
              Tvoja lepota.
              <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent">
                Tvoj trenutak.
              </span>
            </h1>
          </div>
          
          <div className="fade-in-up-delay">
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed max-w-4xl mx-auto">
              Veloura ti omogućava da pronađeš i zakažeš svoj omiljeni tretman brzo, lako i sa poverenjem.
              <span className="block mt-2">Tvoj savršen trenutak opuštanja je na dohvat ruke.</span>
            </p>
          </div>

          <div className="fade-in-up-delay-2 flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2">
              <Download size={20} />
              Preuzmi aplikaciju
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            
            <button className="group border-2 border-purple-300 text-purple-700 px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-50 hover:border-purple-400 transition-all duration-300 flex items-center gap-2">
              <Smartphone size={20} />
              Pogledaj demo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 text-gray-600">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                <Star className="text-yellow-500 fill-current" size={20} />
              </div>
              <div>
                <div className="font-semibold text-gray-800">4.9 ocena</div>
                <div className="text-sm">50k+ korisnika</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-3 text-gray-600">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                <Users size={20} className="text-purple-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-800">1000+ salona</div>
                <div className="text-sm">Proverenih partnera</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-3 text-gray-600">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                <Shield size={20} className="text-green-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-800">100% sigurno</div>
                <div className="text-sm">Garantovani termini</div>
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
              Tri jednostavna koraka do tvog savršenog tretmana lepote
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection lines for desktop */}
            <div className="hidden md:block absolute top-24 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-purple-300 to-pink-300"></div>
            
            <div className="group relative text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300">
                <Search className="text-white" size={28} />
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <h3 className="text-2xl font-playfair font-semibold text-gray-800 mb-4">
                  1. Pretraži salone i tretmane
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Pronađi najbolje salone u tvom gradu. Filtriraj po lokaciji, ceni, ocenama i dostupnim tretmanima. Sve informacije su na jednom mestu.
                </p>
              </div>
            </div>

            <div className="group relative text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-lavender-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="text-white" size={28} />
              </div>
              <div className="bg-gradient-to-br from-lavender-50 to-purple-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <h3 className="text-2xl font-playfair font-semibold text-gray-800 mb-4">
                  2. Zakaži u par klikova
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Odaberi datum, vreme i tretman koji želiš. Potvrdi rezervaciju jednim klikom. Bez poziva, bez čekanja - samo ti i tvoj savršen termin.
                </p>
              </div>
            </div>

            <div className="group relative text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300">
                <Heart className="text-white" size={28} />
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <h3 className="text-2xl font-playfair font-semibold text-gray-800 mb-4">
                  3. Uživaj u svom terminu
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Dođi na vreme i prepusti se profesionalcima. Tvoj trenutak opuštanja počinje. Posle tretmana, podeli svoje iskustvo sa drugim korisnicima.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Users Love Veloura */}
      <section className="py-20 bg-gradient-to-br from-lavender-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-gray-800 mb-4">
              Zašto korisnici vole Velouru?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Otkrivaj razloge zašto je Veloura postala omiljna aplikacija za zakazivanje tretmana lepote
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-playfair font-semibold text-gray-800 mb-4">
                Veliki izbor proverenih salona
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Pristup ekskluzivnoj mreži najboljih salona lepote. Svaki salon je pažljivo odabran i proveravan od strane našeg tima.
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-lavender-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-playfair font-semibold text-gray-800 mb-4">
                Premium dizajn i jednostavnost
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Intuitivni dizajn koji čini zakazivanje tretmana užitkom. Elegantno, brzo i bez komplikacija - baš kako treba da bude.
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Star size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-playfair font-semibold text-gray-800 mb-4">
                Ocene i recenzije korisnika
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Čitaj iskustva drugih korisnika i donosi informisane odluke. Svaki salon ima detaljne ocene i iskrene komentare.
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-lavender-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-playfair font-semibold text-gray-800 mb-4">
                Sigurnost i tačnost termina
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Garantujemo tačnost termina i sigurnost podataka. Tvoje informacije su zaštićene, a termini uvek potvrđeni.
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
                <h4 className="font-semibold text-gray-800 mb-2">Instant potvrda</h4>
                <p className="text-gray-600 text-sm">Odmah znaš da li je termin dostupan i rezervisan</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Clock size={18} className="text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">24/7 dostupnost</h4>
                <p className="text-gray-600 text-sm">Zakazuj tretmane kad god ti odgovara, bilo kada</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Award size={18} className="text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Loyalty program</h4>
                <p className="text-gray-600 text-sm">Sakupljaj poene i osvajaj popuste na tretmane</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-gray-800 mb-4">
              Iskustva naših korisnica
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pročitaj šta kažu žene koje su već otkrile čaroliju Veloura aplikacije
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
            Spremna za sledeći tretman?
          </h2>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-12 leading-relaxed">
            Pridruži se hiljadama zadovoljnih korisnica koje su već otkrile čaroliju Veloura aplikacije.
            <span className="block mt-2">Tvoj savršen tretman lepote je na dohvat ruke.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="group bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-50 hover:scale-105 transition-all duration-300 flex items-center gap-2 shadow-xl">
              <Download size={20} />
              Preuzmi aplikaciju
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            
            <button className="group border-2 border-white/50 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 hover:border-white transition-all duration-300 flex items-center gap-2">
              <Smartphone size={20} />
              Pogledaj demo
            </button>
          </div>

          <div className="mt-12 flex justify-center items-center gap-8 text-sm text-purple-100">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} />
              <span>Besplatno preuzimanje</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={16} />
              <span>100% sigurno</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="fill-current" size={16} />
              <span>4.9 ocena</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ZaKorisnike;