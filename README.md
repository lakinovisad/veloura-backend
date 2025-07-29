# 💇‍♀️ Veloura Backend API

![CI](https://github.com/lakinovisad/veloura-backend/actions/workflows/ci.yml/badge.svg)

Node.js + Express + SQLite backend za aplikaciju za salone, korisnike i zakazivanje termina.

## 📦 O projektu

Veloura API je RESTful backend servis koji omogućava:
- 🔐 **Autentifikaciju korisnika** (klijenti i saloni)
- 🏢 **Upravljanje salonima** (CRUD operacije)
- 💇‍♀️ **Upravljanje uslugama** (tretmani, cene)
- 📅 **Rezervacije termina** (appointments)
- ⭐ **Sistem ocena** (reviews)
- 🔒 **JWT autentifikacija** sa role-based pristupom

### 🛠️ Tehnologije
- **Node.js** + **Express.js**
- **SQLite** baza podataka
- **JWT** autentifikacija
- **bcrypt** hashiranje lozinki
- **CORS** podrška
- **express-validator** validacija

## 🚀 Pokretanje projekta

1. Instalacija zavisnosti:

```bash
npm install
```

2. Pokretanje servera:

```bash
# Development mod
npm run dev

# Ili direktno
node server.js

# Production mod
npm start
```

3. Pristup aplikaciji:

- **API Base URL:** `http://localhost:3001` (ili sledeći slobodan port)
- **Health Check:** `http://localhost:3001/api/health`
- **API Dokumentacija:** `http://localhost:3001/`

---

## 📊 Baza podataka

### 🗄️ Struktura
API koristi **SQLite** bazu podataka sa sledećim tabelama:

| Tabela | Opis |
|--------|------|
| `Users` | Korisnici (klijenti i saloni) |
| `Salons` | Informacije o salonima |
| `Services` | Usluge/tretmani |
| `Appointments` | Rezervacije termina |
| `Reviews` | Ocene i komentari |

### 🔄 Automatska inicijalizacija
Baza se automatski kreira pri pokretanju servera:
```bash
🗄️ Inicijalizujem bazu podataka...
✅ Baza podataka uspešno inicijalizovana
```

## 🔐 Autentifikacija

### 👥 Tipovi korisnika
- **`klijent`** - Korisnici koji rezervišu termine
- **`salon`** - Vlasnici salona koji upravljaju uslugama

### 🔑 JWT Token
Svi zaštićeni endpointi zahtevaju JWT token u header-u:
```
Authorization: Bearer <jwt_token>
```

### ⏰ Token validnost
- **Trajanje:** 7 dana
- **Format:** JWT sa user ID i role informacijama

## 📡 API rute

### 🔐 Autentifikacija (`/api/auth`)

#### `POST /api/auth/register`
Registruje novog korisnika
```json
{
  "name": "Ime Prezime",
  "email": "ime@example.com", 
  "password": "lozinka123",
  "role": "klijent",
  "phone": "+381601234567"
}
```

#### `POST /api/auth/login`
Prijavljuje korisnika
```json
{
  "email": "ime@example.com",
  "password": "lozinka123"
}
```

#### `GET /api/auth/me`
Dohvata profil trenutnog korisnika *(zaštićen)*

#### `GET /api/auth/profile`
Alternativni endpoint za profil *(zaštićen)*

#### `GET /api/auth/test`
Test endpoint za proveru dostupnosti

### 🏢 Saloni (`/api/salons`)

#### `GET /api/salons`
Dohvata sve salone

#### `GET /api/salons/:id`
Dohvata salon po ID-u

#### `POST /api/salons`
Kreira novi salon *(zaštićen, role: salon)*

#### `PUT /api/salons/:id`
Ažurira salon *(zaštićen, vlasnik)*

#### `DELETE /api/salons/:id`
Briše salon *(zaštićen, vlasnik)*

#### `GET /api/salons/my/salon`
Dohvata salon trenutnog korisnika *(zaštićen, role: salon)*

### 💇‍♀️ Usluge (`/api/services`)

#### `GET /api/services`
Dohvata sve usluge

#### `GET /api/services/salon/:salon_id`
Dohvata usluge za određeni salon

#### `POST /api/services`
Kreira novu uslugu *(zaštićen, role: salon)*

#### `PUT /api/services/:id`
Ažurira uslugu *(zaštićen, vlasnik)*

#### `DELETE /api/services/:id`
Briše uslugu *(zaštićen, vlasnik)*

### 📅 Termini (`/api/appointments`)

#### `GET /api/appointments`
Dohvata sve termine *(zaštićen)*

#### `GET /api/appointments/salon/:salon_id`
Dohvata termine za salon *(zaštićen)*

#### `POST /api/appointments`
Kreira novi termin *(zaštićen)*

#### `PATCH /api/appointments/:id/status`
Ažurira status termina *(zaštićen, admin/vlasnik)*

#### `DELETE /api/appointments/:id`
Briše termin *(zaštićen, vlasnik)*

### ⭐ Ocene (`/api/reviews`)

#### `GET /api/reviews`
Dohvata sve ocene

#### `GET /api/reviews/salon/:salon_id`
Dohvata ocene za salon

#### `POST /api/reviews`
Kreira novu ocenu *(zaštićen)*

#### `PUT /api/reviews/:id`
Ažurira ocenu *(zaštićen, autor)*

#### `DELETE /api/reviews/:id`
Briše ocenu *(zaštićen, autor)*

## 🔄 Seed skripta

### 🌱 Pokretanje seed-a
```bash
# Pokreni seed skriptu za test podatke
node seed.js
```

### 📋 Seed podaci
Skripta kreira:
- **2 test korisnika** (admin i client)
- **1 test salon**
- **3 test usluge**
- **2 test termina**
- **1 test ocenu**

### 🔑 Test kredencijali
```bash
# Admin korisnik
Email: admin@veloura.com
Password: admin123
Role: salon

# Client korisnik  
Email: client@veloura.com
Password: client123
Role: klijent
```

## ⚠️ Napomene

### 🔒 Sigurnost
- Lozinke se hashiraju sa bcrypt
- JWT tokeni imaju 7-dnevnu validnost
- CORS je konfigurisan za sve domene (`*`)
- Role-based pristup za sve endpoint-e

### 🚨 Važno
- Server automatski pronalazi slobodan port (3001-3010)
- Baza se automatski kreira pri pokretanju
- Sve rute su validirane sa express-validator
- Error handling je implementiran za sve endpoint-e

### 🔧 Development
- Koristi `nodemon` za development
- Logovi su detaljni sa emoji indikatorima
- CORS je omogućen za frontend integraciju

### 📝 Status kodovi
- `200` - Uspešan zahtev
- `201` - Kreiran resurs
- `400` - Greška validacije
- `401` - Neautorizovan pristup
- `404` - Resurs nije pronađen
- `409` - Konflikt (npr. email već postoji)
- `500` - Greška servera

---

## 🧪 Testiranje

### Pokretanje testova
```bash
# Pokreni sve testove
npm test

# Pokreni testove u watch modu
npm run test:watch

# Pokreni testove sa coverage izveštajem
npm run test:coverage

# Ili koristi PowerShell skripte
.\run-tests.ps1
# Ili automatski sa logovanjem
.\run-all-tests.ps1
# Ili višestruko testiranje sa pauzom
.\auto-test.ps1
# Ili koristi batch fajl (Windows)
run-auto-test.bat
```

### Test struktura
- **`tests/auth.test.js`** - Pojednostavljeni testovi za autentifikaciju (7 testova)
- **`tests/salon.test.js`** - Pojednostavljeni testovi za salon funkcionalnost (7 testova)
- **`tests/services.test.js`** - Pojednostavljeni testovi za usluge funkcionalnost (7 testova)
- **`tests/appointments.test.js`** - Pojednostavljeni testovi za termine funkcionalnost (12 testova)
- **`tests/helpers.js`** - Helper funkcije za testove
- **`tests/setup.js`** - Test konfiguracija
- **`jest.config.js`** - Jest konfiguracija
- **`run-all-tests.ps1`** - PowerShell skripta sa automatskim logovanjem
- **`auto-test.ps1`** - Višestruko testiranje sa pauzom (10 krugova, 60s pauza)
- **`run-auto-test.bat`** - Batch fajl za pokretanje auto-test.ps1 (Windows)

### Test pokrivenost
Testovi pokrivaju sve glavne funkcionalnosti:

**🔐 Autentifikacija (7 testova):**
- ✅ Registracija klijenta i salona
- ✅ Prijava korisnika
- ✅ Validacija podataka (nedostajuća polja, neispravne role)
- ✅ Error handling (pogrešne lozinke, nepostojeći korisnici)

**🏢 Salon funkcionalnost (7 testova):**
- ✅ Kreiranje salona (samo salon korisnici)
- ✅ Ažuriranje salona (samo vlasnik)
- ✅ Brisanje salona (samo vlasnik)
- ✅ Pregled salona (javno dostupno)
- ✅ Pregled pojedinačnog salona
- ✅ Autentifikacija i autorizacija
- ✅ Error handling

**💇‍♀️ Usluge funkcionalnost (7 testova):**
- ✅ Kreiranje usluga (samo salon korisnici)
- ✅ Ažuriranje usluga (samo vlasnik)
- ✅ Brisanje usluga (samo vlasnik)
- ✅ Pregled usluga za salon (javno dostupno)
- ✅ Autentifikacija i autorizacija
- ✅ Error handling

**📅 Termini funkcionalnost (12 testova):**
- ✅ Kreiranje termina (samo klijenti)
- ✅ Pregled termina korisnika (samo vlasnik termina)
- ✅ Pregled termina salona (samo vlasnik salona)
- ✅ Ažuriranje statusa termina (samo vlasnik salona)
- ✅ Autentifikacija i autorizacija
- ✅ Error handling

### 📝 Logovanje testova
- **`run-all-tests.ps1`** - Automatski pokreće testove i loguje rezultate
- **`auto-test.ps1`** - Višestruko testiranje (10 krugova, 60s pauza) sa UTF-8 encoding
- **`run-auto-test.bat`** - Batch fajl za jednostavno pokretanje (Windows)
- **Log fajl:** `logs/test-log.txt` sa vremenskim oznakama
- **Detaljni izlaz** - Kompletan rezultat testova sa greškama
- **Status indikatori** - Jasni pokazatelji uspeha/neuspeha
- **UTF-8 podrška** - Pravilno prikazivanje srpskih karaktera

---

**🎯 API je spreman za produkciju i frontend integraciju!** 