const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const salonRoutes = require('./routes/salons');
const serviceRoutes = require('./routes/services');
const appointmentRoutes = require('./routes/appointments');
const reviewRoutes = require('./routes/reviews');

const app = express();
const PORT = process.env.PORT || 3001;

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

// Pokreni server
app.listen(PORT, () => {
  console.log(`🚀 Veloura API server pokrenut na portu ${PORT}`);
  console.log(`📡 API dostupan na: http://localhost:${PORT}`);
  console.log(`🔐 Auth endpoint: http://localhost:${PORT}/api/auth`);
  console.log(`🧪 Registrovane auth rute:`, authRoutes.stack.filter(layer => layer.route).map(layer => layer.route.path));
});

module.exports = app; 