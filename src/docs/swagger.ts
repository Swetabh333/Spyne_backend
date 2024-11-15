import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Car Collection API Documentation',
      version: '1.0.0',
      description: 'API documentation for Car Collection application',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken'
        }
      }
    },
    security: [{
      cookieAuth: []
    }]
  },
  apis: ['./routes/*.ts'], // Path to your route files
};

const specs = swaggerJsdoc(options);
export default specs;
