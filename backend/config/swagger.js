const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pet Adoption Management System API',
      version: '1.0.0',
      description: 'REST API for managing pet adoptions',
    },
    servers: [{ url: `http://localhost:${process.env.PORT || 5000}` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Pet: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            species: { type: 'string', enum: ['dog', 'cat', 'bird', 'rabbit', 'hamster', 'fish', 'reptile', 'other'] },
            breed: { type: 'string' },
            age: { type: 'number' },
            ageUnit: { type: 'string', enum: ['months', 'years'] },
            gender: { type: 'string', enum: ['male', 'female', 'unknown'] },
            size: { type: 'string', enum: ['small', 'medium', 'large', 'extra-large'] },
            status: { type: 'string', enum: ['available', 'pending', 'adopted'] },
            photoUrl: { type: 'string' },
            description: { type: 'string' },
          },
        },
        Application: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            petId: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            status: { type: 'string', enum: ['pending', 'approved', 'rejected'] },
            message: { type: 'string' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['visitor', 'user', 'admin'] },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

module.exports = swaggerJsdoc(options);
