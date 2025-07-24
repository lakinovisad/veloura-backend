import React, { useState } from 'react';
import ZaKorisnike from './components/ZaKorisnike';
import ZaSalone from './components/ZaSalone';
import PrijavaRegistracija from './components/PrijavaRegistracija';
import NotFound from './components/NotFound';
import UsloviKoriscenja from './components/UsloviKoriscenja';
import Hvala from './components/Hvala';
import NavBar from './components/NavBar';
import Footer from './components/Footer';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'korisnici' | 'saloni' | 'prijava' | '404' | 'uslovi' | 'hvala'>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'korisnici':
        return <ZaKorisnike />;
      case 'saloni':
        return <ZaSalone />;
      case 'prijava':
        return <PrijavaRegistracija />;
      case '404':
        return <NotFound />;
      case 'uslovi':
        return <UsloviKoriscenja />;
      case 'hvala':
        return <Hvala />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-lavender-50 flex items-center justify-center pt-20">
            <div className="text-center">
              <h1 className="text-6xl font-playfair font-bold text-gray-800 mb-8">
                Veloura
              </h1>
              <p className="text-xl text-gray-600 mb-12">
                Tvoja svakodnevna doza lepote
              </p>
              <div className="space-x-4 mb-8">
                <button
                  onClick={() => setCurrentPage('korisnici')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  Za korisnike
                </button>
                <button
                  onClick={() => setCurrentPage('saloni')}
                  className="bg-gradient-to-r from-lavender-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  Za salone
                </button>
                <button
                  onClick={() => setCurrentPage('prijava')}
                  className="border-2 border-purple-300 text-purple-700 px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-50 hover:border-purple-400 transition-all duration-300"
                >
                  Prijava
                </button>
              </div>
              <div className="mt-8 space-x-4">
                <button
                  onClick={() => setCurrentPage('404')}
                  className="text-gray-500 hover:text-purple-600 text-sm underline transition-colors duration-300"
                >
                  Pogledaj 404 stranicu
                </button>
                <button
                  onClick={() => setCurrentPage('uslovi')}
                  className="text-gray-500 hover:text-purple-600 text-sm underline transition-colors duration-300"
                >
                  Uslovi korišćenja
                </button>
                <button
                  onClick={() => setCurrentPage('hvala')}
                  className="text-gray-500 hover:text-purple-600 text-sm underline transition-colors duration-300"
                >
                  Hvala stranica
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="App">
      <NavBar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="pt-16">
        {renderPage()}
      </div>
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}

export default App;