const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./db');
const authRoutes = require('./routes/auth');
const salonRoutes = require('./routes/salons');
const serviceRoutes = require('./routes/services');
const appointmentRoutes = require('./routes/appointments');
const reviewRoutes = require('./routes/reviews');

const app = express();
const START_PORT = process.env.PORT || 3001;
const MAX_PORT = 3010;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rute
app.use('/api/auth', authRoutes);
console.log("✅ Auth rute registrovane");
console.log(
  "🧪 Registrovane auth rute:",
  authRoutes.stack
    .filter(layer => layer.route)
    .map(layer => layer.route.path)
);
app.use('/api/salons', salonRoutes);
console.log("✅ Salon rute registrovane");
app.use('/api/services', serviceRoutes);
console.log("✅ Service rute registrovane");
app.use('/api/appointments', appointmentRoutes);
console.log("✅ Appointment rute registrovane");
app.use('/api/reviews', reviewRoutes);
console.log("✅ Review rute registrovane");

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Veloura API je aktivan',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Dobrodošli u Veloura API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      salons: '/api/salons',
      services: '/api/services',
      appointments: '/api/appointments',
      reviews: '/api/reviews',
      health: '/api/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Greška na serveru'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint nije pronađen'
  });
});

// Funkcija za pokretanje servera na određenom portu
const startServerOnPort = (port) => {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      console.log(`🚀 Veloura API server pokrenut na portu ${port}`);
      console.log(`📡 API dostupan na: http://localhost:${port}`);
      console.log(`🔐 Auth endpoint: http://localhost:${port}/api/auth`);
      console.log(`🧪 Registrovane auth rute:`, authRoutes.stack.filter(layer => layer.route).map(layer => layer.route.path));
      resolve(server);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.log(`⚠️ Port ${port} je zauzet, pokušavam sledeći...`);
        reject(error);
      } else {
        console.error(`❌ Greška pri pokretanju servera na portu ${port}:`, error);
        reject(error);
      }
    });
  });
};

// Funkcija za pokretanje servera sa automatskim pronalaženjem slobodnog porta
const startServer = async () => {
  try {
    console.log('🗄️ Inicijalizujem bazu podataka...');
    await initDatabase();
    console.log('✅ Baza podataka uspešno inicijalizovana');
    
    // Pokušaj da pokreneš server na različitim portovima
    for (let port = START_PORT; port <= MAX_PORT; port++) {
      try {
        console.log(`🔍 Pokušavam da pokrenem server na portu ${port}...`);
        await startServerOnPort(port);
        console.log(`✅ Server uspešno pokrenut na portu ${port}!`);
        return; // Uspesno pokrenut, izađi iz funkcije
      } catch (error) {
        if (error.code === 'EADDRINUSE' && port < MAX_PORT) {
          continue; // Pokušaj sledeći port
        } else if (port === MAX_PORT) {
          // Dostigli smo maksimalni port
          console.error(`❌ Nije moguće pokrenuti server na portovima ${START_PORT}-${MAX_PORT}`);
          console.error('🛑 Svi portovi su zauzeti. Zaustavljam server.');
          process.exit(1);
        } else {
          // Nešto drugo je pošlo naopako
          throw error;
        }
      }
    }
  } catch (error) {
    console.error('❌ Greška pri inicijalizaciji baze podataka:', error);
    console.error('🛑 Server se neće pokrenuti zbog greške u bazi podataka');
    process.exit(1);
  }
};

// Pokreni server
startServer();

module.exports = app; 