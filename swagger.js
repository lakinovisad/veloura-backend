const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Veloura API',
      version: '1.0.0',
      description: 'API za aplikaciju Veloura - sistem za upravljanje salonima lepote',
      contact: {
        name: 'Veloura Team',
        email: 'support@veloura.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server'
      },
      {
        url: 'http://localhost:3000',
        description: 'Alternative server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
             schemas: {
         User: {
           type: 'object',
           properties: {
             id: { type: 'integer' },
             ime: { type: 'string', example: 'Ana' },
             email: { type: 'string', example: 'ana@example.com' },
             role: { type: 'string', enum: ['klijent', 'salon', 'admin'] }
           }
         },
         Salon: {
           type: 'object',
           properties: {
             id: { type: 'integer' },
             naziv: { type: 'string' },
             lokacija: { type: 'string' }
           }
         },
         Service: {
           type: 'object',
           properties: {
             id: { type: 'integer' },
             naziv: { type: 'string' },
             cena: { type: 'number' },
             trajanje: { type: 'number' },
             opis: { type: 'string' },
             salon_id: { type: 'integer' }
           }
         },
         Appointment: {
           type: 'object',
           properties: {
             id: { type: 'integer' },
             salon_id: { type: 'integer' },
             service_id: { type: 'integer' },
             korisnik_id: { type: 'integer' },
             datum: { type: 'string', format: 'date' },
             vreme: { type: 'string', format: 'time' },
             status: { type: 'string', enum: ['zakazano', 'otkazano', 'završeno'] }
           }
         },
         Review: {
           type: 'object',
           properties: {
             id: { type: 'integer' },
             salon_id: { type: 'integer' },
             korisnik_id: { type: 'integer' },
             ocena: { type: 'number', minimum: 1, maximum: 5 },
             komentar: { type: 'string' }
           }
         }
       }
    }
  },
  apis: ['./routes/*.js'] // putanja do fajlova sa rutama
};

const specs = swaggerJsdoc(options);

module.exports = specs; 