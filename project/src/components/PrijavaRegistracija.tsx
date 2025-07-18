import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  Building2, 
  Eye, 
  EyeOff,
  ArrowLeft,
  Heart,
  Sparkles,
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const PrijavaRegistracija = () => {
  const { login, register, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'korisnici' | 'saloni'>('korisnici');
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [formData, setFormData] = useState({
    ime: '',
    email: '',
    lozinka: '',
    potvrdiLozinku: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        // Login
        await login({
          email: formData.email,
          password: formData.lozinka
        });
        setSuccess('Uspešna prijava!');
        // Redirect will be handled by AuthContext
      } else {
        // Register
        if (formData.lozinka !== formData.potvrdiLozinku) {
          setError('Lozinke se ne poklapaju');
          return;
        }
        
        await register({
          name: formData.ime,
          email: formData.email,
          password: formData.lozinka,
          role: activeTab === 'korisnici' ? 'klijent' : 'salon'
        });
        setSuccess('Uspešna registracija!');
        // Redirect will be handled by AuthContext
      }
    } catch (error: any) {
      setError(error.message || 'Greška pri obradi zahteva');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-lavender-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-20 floating-animation"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200 rounded-full opacity-30 floating-delay"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-lavender-200 rounded-full opacity-15 floating-delay-2"></div>
        <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-pink-300 rounded-full opacity-25 pulse-soft"></div>
      </div>

      <div className="relative z-10 max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Heart className="text-white" size={28} />
            </div>
          </div>
          
          <h1 className="text-4xl font-playfair font-bold text-gray-800 mb-2">
            {isLogin ? 'Dobrodošli nazad u Velouru' : 'Pridružite se Veloura zajednici'}
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            {isLogin ? 'Prijavite se i nastavite svoju lepotu putovanje' : 'Kreirajte nalog i otkrijte svet lepote'}
          </p>

          {/* Tab Selection */}
          <div className="flex bg-white rounded-full p-1 shadow-lg mb-8 max-w-sm mx-auto">
            <button
              onClick={() => setActiveTab('korisnici')}
              className={`flex-1 py-3 px-4 rounded-full text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === 'korisnici'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              <User size={16} />
              Za korisnike
            </button>
            <button
              onClick={() => setActiveTab('saloni')}
              className={`flex-1 py-3 px-4 rounded-full text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === 'saloni'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              <Building2 size={16} />
              Za salone
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/50">
          {/* Login/Register Toggle */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setIsLogin(true)}
                className={`py-2 px-6 rounded-full text-sm font-semibold transition-all duration-300 ${
                  isLogin
                    ? 'bg-white text-purple-600 shadow-md'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                Prijava
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`py-2 px-6 rounded-full text-sm font-semibold transition-all duration-300 ${
                  !isLogin
                    ? 'bg-white text-purple-600 shadow-md'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                Registracija
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-green-700 text-sm">{success}</span>
              </div>
            )}

            {/* Name/Salon Name Field (only for registration) */}
            {!isLogin && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  {activeTab === 'korisnici' ? (
                    <User className="h-5 w-5 text-purple-400" />
                  ) : (
                    <Building2 className="h-5 w-5 text-purple-400" />
                  )}
                </div>
                <input
                  type="text"
                  name="ime"
                  value={formData.ime}
                  onChange={handleInputChange}
                  placeholder={activeTab === 'korisnici' ? 'Ime i prezime' : 'Naziv salona'}
                  className="w-full pl-12 pr-4 py-4 border border-purple-200 rounded-2xl focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm placeholder-gray-500"
                  required
                />
              </div>
            )}

            {/* Email Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-purple-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email adresa"
                className="w-full pl-12 pr-4 py-4 border border-purple-200 rounded-2xl focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm placeholder-gray-500"
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-purple-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="lozinka"
                value={formData.lozinka}
                onChange={handleInputChange}
                placeholder="Lozinka"
                className="w-full pl-12 pr-12 py-4 border border-purple-200 rounded-2xl focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm placeholder-gray-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-purple-400 hover:text-purple-600 transition-colors duration-300"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirm Password Field (only for registration) */}
            {!isLogin && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-purple-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="potvrdiLozinku"
                  value={formData.potvrdiLozinku}
                  onChange={handleInputChange}
                  placeholder="Potvrdi lozinku"
                  className="w-full pl-12 pr-12 py-4 border border-purple-200 rounded-2xl focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm placeholder-gray-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-purple-400 hover:text-purple-600 transition-colors duration-300"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  {isLogin ? 'Prijavljam se...' : 'Registrujem se...'}
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  {isLogin ? 'Prijavi se' : 'Registruj se'}
                </>
              )}
            </button>

            {/* Additional Options */}
            <div className="text-center space-y-4">
              {isLogin && (
                <a
                  href="#"
                  className="text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors duration-300"
                >
                  Zaboravili ste lozinku?
                </a>
              )}

              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Shield size={16} className="text-green-500" />
                <span>Vaši podaci su sigurni i zaštićeni</span>
              </div>
            </div>
          </form>

          {/* Benefits Section (only for registration) */}
          {!isLogin && (
            <div className="mt-8 pt-6 border-t border-purple-100">
              <h3 className="text-lg font-playfair font-semibold text-gray-800 mb-4 text-center">
                {activeTab === 'korisnici' ? 'Zašto se pridružiti Veloura?' : 'Prednosti za vaš salon:'}
              </h3>
              
              <div className="space-y-3">
                {activeTab === 'korisnici' ? (
                  <>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                      <span>Pristup najboljih salonima u gradu</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                      <span>Zakazivanje termina 24/7</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                      <span>Ekskluzivni popusti i ponude</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                      <span>Povećanje broja klijenata do 150%</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                      <span>Automatsko upravljanje terminima</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                      <span>Profesionalna prezentacija salona</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Back to Home Link */}
        <div className="text-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium transition-colors duration-300"
          >
            <ArrowLeft size={16} />
            Vrati se na početnu
          </a>
        </div>
      </div>
    </div>
  );
};

export default PrijavaRegistracija;