# Veloura API

Express backend API sa SQLite bazom podataka za Veloura aplikaciju - platformu za povezivanje klijenata i salona lepote.

## 🚀 O projektu

Veloura je platforma koja omogućava klijentima da pronađu i rezervišu termine u salonima lepote, a salonima da upravljaju svojim poslovanjem. API pruža potpunu funkcionalnost za autentifikaciju, upravljanje salonima, uslugama, terminima i ocenama.

## 🛠️ Tehnologije

- **Backend**: Node.js, Express.js
- **Baza podataka**: SQLite
- **Autentifikacija**: JWT (JSON Web Tokens)
- **Hashiranje**: bcrypt
- **CORS**: Cross-Origin Resource Sharing
- **Testiranje**: Jest
- **Deployment**: GitHub Actions

## 📁 Struktura projekta

```
veloura-backend/
├── api/                    # API backend
│   ├── middleware/         # Express middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── tests/             # Test files
│   ├── db.js              # Database initialization
│   ├── mailer.js          # Email functionality
│   └── server.js          # Main server file
├── project/               # Frontend React application
│   ├── src/               # React source code
│   ├── components/        # React components
│   ├── contexts/          # React contexts
│   ├── services/          # API services
│   └── tests/             # Frontend tests
├── scripts/               # PowerShell scripts
├── .github/               # GitHub Actions workflows
├── backups/               # Database backups
└── logs/                  # Application logs
```

## ⚡ Brzo pokretanje

### Preduslovi
- Node.js (v14 ili noviji)
- npm ili yarn

### Instalacija

```bash
# Kloniranje repozitorija
git clone https://github.com/lakinovisad/veloura-backend.git
cd veloura-backend

# Instalacija dependencija
npm install

# Kopiranje environment fajla
cp env.example .env
```

### Pokretanje

#### Development mod
```bash
npm run dev
```

#### Production mod
```bash
npm start
```

Server će biti dostupan na `http://localhost:3001`

## 🔧 Konfiguracija

### Environment varijable

Kreirajte `.env` fajl u root direktorijumu:

```env
PORT=3001
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

### Baza podataka

SQLite baza `veloura.db` se automatski kreira pri prvom pokretanju aplikacije.

## 📚 API Dokumentacija

### Autentifikacija

#### POST /api/auth/register
Registruje novog korisnika.

**Body:**
```json
{
  "name": "Ime Prezime",
  "email": "ime@example.com",
  "password": "lozinka123",
  "role": "klijent",
  "phone": "+381601234567"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Korisnik uspešno registrovan",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Ime Prezime",
      "email": "ime@example.com",
      "role": "klijent",
      "phone": "+381601234567"
    },
    "token": "jwt_token"
  }
}
```

#### POST /api/auth/login
Prijavljuje korisnika.

**Body:**
```json
{
  "email": "ime@example.com",
  "password": "lozinka123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Uspešna prijava",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Ime Prezime",
      "email": "ime@example.com",
      "role": "klijent",
      "phone": "+381601234567"
    },
    "token": "jwt_token"
  }
}
```

#### GET /api/auth/profile
Dohvata profil trenutnog korisnika (zahtevan JWT token).

**Headers:**
```
Authorization: Bearer jwt_token
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "Ime Prezime",
      "email": "ime@example.com",
      "role": "klijent",
      "phone": "+381601234567",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Saloni

#### POST /api/salons
Kreira novi salon (samo za korisnike sa role: "salon").

**Headers:**
```
Authorization: Bearer jwt_token
```

**Body:**
```json
{
  "naziv": "Salon Lepote",
  "lokacija": "Beograd, Knez Mihailova 15",
  "opis": "Profesionalni salon za sve vrste tretmana",
  "radno_vreme": "Pon-Pet: 9-18h, Sub: 9-15h"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Salon uspešno kreiran",
  "data": {
    "salon": {
      "id": "uuid",
      "user_id": "user_uuid",
      "naziv": "Salon Lepote",
      "lokacija": "Beograd, Knez Mihailova 15",
      "opis": "Profesionalni salon za sve vrste tretmana",
      "radno_vreme": "Pon-Pet: 9-18h, Sub: 9-15h"
    }
  }
}
```

#### GET /api/salons
Dohvata sve salone.

**Response:**
```json
{
  "success": true,
  "data": {
    "salons": [
      {
        "id": "uuid",
        "user_id": "user_uuid",
        "naziv": "Salon Lepote",
        "lokacija": "Beograd, Knez Mihailova 15",
        "opis": "Profesionalni salon za sve vrste tretmana",
        "radno_vreme": "Pon-Pet: 9-18h, Sub: 9-15h",
        "created_at": "2024-01-01T00:00:00.000Z",
        "user_name": "Ime Prezime",
        "user_email": "ime@example.com",
        "user_phone": "+381601234567"
      }
    ],
    "count": 1
  }
}
```

#### GET /api/salons/:id
Dohvata salon po ID-u.

**Response:**
```json
{
  "success": true,
  "data": {
    "salon": {
      "id": "uuid",
      "user_id": "user_uuid",
      "naziv": "Salon Lepote",
      "lokacija": "Beograd, Knez Mihailova 15",
      "opis": "Profesionalni salon za sve vrste tretmana",
      "radno_vreme": "Pon-Pet: 9-18h, Sub: 9-15h",
      "created_at": "2024-01-01T00:00:00.000Z",
      "user_name": "Ime Prezime",
      "user_email": "ime@example.com",
      "user_phone": "+381601234567"
    }
  }
}
```

#### PUT /api/salons/:id
Ažurira salon (samo vlasnik salona).

**Headers:**
```
Authorization: Bearer jwt_token
```

**Body:**
```json
{
  "naziv": "Novi Naziv Salona",
  "lokacija": "Beograd, Novi Sad 20",
  "opis": "Ažuriran opis salona",
  "radno_vreme": "Pon-Sub: 8-20h"
}
```

#### DELETE /api/salons/:id
Briše salon (samo vlasnik salona).

**Headers:**
```
Authorization: Bearer jwt_token
```

#### GET /api/salons/my/salon
Dohvata salon trenutnog korisnika (samo za role: "salon").

**Headers:**
```
Authorization: Bearer jwt_token
```

### Ostali endpoints

#### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "success": true,
  "message": "Veloura API je aktivan",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🧪 Testiranje

### Pokretanje testova

```bash
# Pokretanje svih testova
npm test

# Pokretanje testova sa coverage
npm run test:coverage

# Pokretanje specifičnih testova
npm test -- --testNamePattern="auth"
```

### Testiranje sa curl

```bash
# Registracija
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","role":"klijent"}'

# Prijava
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Registracija salona
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Salon Owner","email":"salon@example.com","password":"password123","role":"salon"}'

# Prijava salona
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"salon@example.com","password":"password123"}'

# Kreiranje salona (koristite token iz prijave)
curl -X POST http://localhost:3001/api/salons \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"naziv":"Salon Lepote","lokacija":"Beograd, Knez Mihailova 15","opis":"Profesionalni salon","radno_vreme":"Pon-Pet: 9-18h"}'

# Dohvatanje svih salona
curl -X GET http://localhost:3001/api/salons
```

## 🚀 Deployment

### Lokalni deployment

```bash
# Build aplikacije
npm run build

# Pokretanje u production modu
npm start
```

### Server deployment

Projekat uključuje PowerShell skripte za lakše upravljanje serverom:

```powershell
# Pokretanje servera
.\start-server.ps1

# Zaustavljanje servera
.\stop-server.ps1

# Restart servera
.\restart-server.ps1

# Backup baze podataka
.\backup.ps1
```

### GitHub Actions

Projekat koristi GitHub Actions za:
- Automatsko testiranje na push/PR
- Deployment na server
- Backup baze podataka

## 🔒 Sigurnost

- **Lozinke**: Hash-ovane pomoću bcrypt
- **Autentifikacija**: JWT tokeni
- **CORS**: Omogućen za frontend komunikaciju
- **Validacija**: Input validacija na svim endpoint-ima
- **Rate limiting**: Zaštita od DDoS napada
- **SQL Injection**: Sprečeno kroz parametrizovane upite

## 🤝 Doprinosi

Dobrodošli su svi doprinosi! Molimo vas da:

1. Fork repozitorija
2. Kreirajte feature branch (`git checkout -b feature/amazing-feature`)
3. Commit vaših izmena (`git commit -m 'Add amazing feature'`)
4. Push na branch (`git push origin feature/amazing-feature`)
5. Otvorite Pull Request

### Guidelines za kod

- Koristite emoji u console.log porukama za bolju čitljivost 🚀
- Pratite ESLint pravila
- Pišite testove za nove funkcionalnosti
- Dokumentujte API promene

## 📝 License

Ovaj projekat je licenciran pod MIT licencom - pogledajte [LICENSE](LICENSE) fajl za detalje.

## 📞 Kontakt

- **Autor**: Veloura Team
- **Email**: support@veloura.com
- **GitHub**: [@lakinovisad](https://github.com/lakinovisad)

## 🙏 Zahvalnice

- Express.js tim za odličan framework
- SQLite tim za jednostavnu i efikasnu bazu podataka
- React tim za frontend framework
- Svi kontributori koji su doprineli projektu

---

⭐ Ako vam se sviđa ovaj projekat, molimo vas da ga označite zvezdicom na GitHub-u! 