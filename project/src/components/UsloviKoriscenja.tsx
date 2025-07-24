import React from 'react';
import { 
  ArrowLeft, 
  Shield, 
  FileText, 
  Users, 
  Lock, 
  Mail
} from 'lucide-react';

const UsloviKoriscenja = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <FileText className="text-white" size={28} />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-gray-800 mb-4">
              Uslovi korišćenja
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Molimo vas da pažljivo pročitate uslove korišćenja Veloura aplikacije
            </p>
            
            <div className="mt-6 text-sm text-gray-500">
              Poslednje ažuriranje: 15. decembar 2024.
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          
          {/* Section 1 */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                <FileText className="text-purple-600" size={20} />
              </div>
              <h2 className="text-2xl font-playfair font-semibold text-gray-800 m-0">
                1. Opšte odredbe
              </h2>
            </div>
            
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                Dobrodošli u Veloura aplikaciju. Ovi uslovi korišćenja ("Uslovi") regulišu vaše korišćenje 
                Veloura mobilne aplikacije i web platforme ("Usluga") koju pruža Veloura d.o.o. ("mi", "nas", "naš").
              </p>
              
              <p>
                Korišćenjem naše Usluge, pristajete da budete vezani ovim Uslovima. Ako se ne slažete sa bilo kojim 
                delom ovih uslova, molimo vas da ne koristite našu Uslugu.
              </p>
              
              <p>
                Veloura je platforma koja povezuje korisnike sa salonima lepote, omogućavajući zakazivanje tretmana 
                i upravljanje rezervacijama kroz elegantno i intuitivno korisničko iskustvo.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-lavender-100 to-purple-100 rounded-xl flex items-center justify-center">
                <Users className="text-purple-600" size={20} />
              </div>
              <h2 className="text-2xl font-playfair font-semibold text-gray-800 m-0">
                2. Način korišćenja
              </h2>
            </div>
            
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                <strong>Za korisnike:</strong> Možete pretraživati salone, čitati recenzije, zakazivati tretmane 
                i upravljati svojim rezervacijama. Obavezujete se da ćete pružiti tačne informacije prilikom registracije.
              </p>
              
              <p>
                <strong>Za salone:</strong> Možete kreirati profil salona, dodavati usluge, upravljati kalendarom 
                i primati rezervacije. Odgovorni ste za tačnost informacija o vašem salonu i uslugama.
              </p>
              
              <p>
                Svi korisnici se obavezuju da neće koristiti Uslugu za nezakonite aktivnosti, neće ometati rad 
                platforme i neće kršiti prava drugih korisnika ili salona.
              </p>
              
              <p>
                Zadržavamo pravo da suspendujemo ili ukidamo naloge koji krše ove uslove korišćenja.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl flex items-center justify-center">
                <Shield className="text-purple-600" size={20} />
              </div>
              <h2 className="text-2xl font-playfair font-semibold text-gray-800 m-0">
                3. Prava i obaveze korisnika
              </h2>
            </div>
            
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                <strong>Vaša prava:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Pristup svim funkcionalnostima aplikacije u skladu sa vašim tipom naloga</li>
                <li>Zaštita ličnih podataka u skladu sa našom Politikom privatnosti</li>
                <li>Podrška korisničke službe tokom radnog vremena</li>
                <li>Mogućnost brisanja naloga u bilo kom trenutku</li>
              </ul>
              
              <p>
                <strong>Vaše obaveze:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Pružanje tačnih i ažurnih informacija</li>
                <li>Poštovanje termina rezervacija</li>
                <li>Civilno ponašanje prema drugim korisnicima i salonima</li>
                <li>Čuvanje sigurnosti vašeg naloga i lozinke</li>
                <li>Obaveštavanje o otkazivanju termina u razumnom roku</li>
              </ul>
              
              <p>
                Korisnici su odgovorni za sve aktivnosti koje se dešavaju pod njihovim nalogom.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-lavender-100 rounded-xl flex items-center justify-center">
                <Lock className="text-purple-600" size={20} />
              </div>
              <h2 className="text-2xl font-playfair font-semibold text-gray-800 m-0">
                4. Privatnost i sigurnost
              </h2>
            </div>
            
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                Vaša privatnost je od najveće važnosti za nas. Prikupljamo i obrađujemo vaše lične podatke 
                isključivo u svrhe pružanja i poboljšanja naših usluga.
              </p>
              
              <p>
                <strong>Podaci koje prikupljamo:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Osnovne informacije o nalogu (ime, email, telefon)</li>
                <li>Informacije o rezervacijama i preferencijama</li>
                <li>Podatke o korišćenju aplikacije radi poboljšanja korisničkog iskustva</li>
              </ul>
              
              <p>
                <strong>Kako štitimo vaše podatke:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Korišćenje naprednih sigurnosnih protokola</li>
                <li>Šifrovanje osetljivih informacija</li>
                <li>Redovne sigurnosne provere sistema</li>
                <li>Ograničen pristup podacima samo ovlašćenom osoblju</li>
              </ul>
              
              <p>
                Nikada nećemo prodati vaše lične podatke trećim stranama. Detaljnije informacije možete pronaći 
                u našoj Politici privatnosti.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl flex items-center justify-center">
                <Mail className="text-purple-600" size={20} />
              </div>
              <h2 className="text-2xl font-playfair font-semibold text-gray-800 m-0">
                5. Kontakt
              </h2>
            </div>
            
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                Ako imate pitanja o ovim uslovima korišćenja ili našoj usluzi, molimo vas da nas kontaktirate:
              </p>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="text-purple-600" size={20} />
                  <div>
                    <div className="font-semibold text-gray-800">Email:</div>
                    <div>podrska@veloura.rs</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Users className="text-purple-600" size={20} />
                  <div>
                    <div className="font-semibold text-gray-800">Adresa:</div>
                    <div>Veloura d.o.o.<br />Knez Mihailova 42<br />11000 Beograd, Srbija</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Shield className="text-purple-600" size={20} />
                  <div>
                    <div className="font-semibold text-gray-800">Radno vreme podrške:</div>
                    <div>Ponedeljak - Petak: 09:00 - 18:00<br />Subota: 10:00 - 16:00</div>
                  </div>
                </div>
              </div>
              
              <p>
                Trudićemo se da odgovorimo na vaš upit u roku od 24 sata tokom radnih dana.
              </p>
              
              <p className="text-sm text-gray-500 italic">
                Ovi uslovi korišćenja mogu biti ažurirani povremeno. O svim značajnim promenama ćemo vas 
                obavestiti putem email-a ili obaveštenja u aplikaciji.
              </p>
            </div>
          </section>

        </div>

        {/* Back to Home Button */}
        <div className="text-center pt-12 border-t border-gray-100">
          <button className="group bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto">
            <ArrowLeft size={20} />
            Vrati se na početnu
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsloviKoriscenja;