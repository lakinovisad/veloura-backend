# Veloura API

Express backend API sa SQLite bazom podataka za Veloura aplikaciju.

## Instalacija

```bash
cd api
npm install
```

## Pokretanje

### Development mod
```bash
npm run dev
```

### Production mod
```bash
npm start
```

Server će biti dostupan na `http://localhost:3001`

## Endpoints

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

## Baza podataka

SQLite baza `veloura.db` se automatski kreira pri prvom pokretanju aplikacije.

### Tabela Users
- `id` (TEXT, PRIMARY KEY) - UUID
- `name` (TEXT, NOT NULL) - Ime korisnika
- `email` (TEXT, UNIQUE, NOT NULL) - Email adresa
- `password` (TEXT, NOT NULL) - Hash-ovana lozinka
- `role` (TEXT, NOT NULL) - 'klijent' ili 'salon'
- `phone` (TEXT) - Broj telefona
- `created_at` (DATETIME) - Datum kreiranja

### Tabela Salons
- `id` (TEXT, PRIMARY KEY) - UUID
- `user_id` (TEXT, NOT NULL) - Foreign key na Users.id
- `naziv` (TEXT, NOT NULL) - Naziv salona
- `lokacija` (TEXT, NOT NULL) - Lokacija salona
- `opis` (TEXT) - Opis salona
- `radno_vreme` (TEXT) - Radno vreme (može biti JSON string)
- `created_at` (DATETIME) - Datum kreiranja

## Sigurnost

- Lozinke se hash-uju pomoću bcrypt
- JWT tokeni za autentifikaciju
- CORS omogućen za frontend komunikaciju
- Validacija input-a na svim endpoint-ima

## Environment varijable

- `PORT` - Port na kojem će server raditi (default: 3001)
- `JWT_SECRET` - Secret key za JWT (default: 'veloura-secret-key-2024')

## Testiranje

Možete testirati API pomoću Postman-a ili curl komandi:

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