//swaggerConfig.js
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const port = process.env.EXPRESS_PORT || 3000;
const serverUrl = `process.env.EXPRESS_SERVER_URL:${port}` || `http://localhost:${port}`;


const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'Storybook API',
      version: '1.0.0',
      description: 'API documentation for Storybook application',
    },
    servers: [
      {
        url: serverUrl,
        description: 'Dynamic server URL'
      },
    ],
  };
  
  const options = {
    swaggerDefinition,
    apis: ['./src/routes/*.js'],
  };
  
  const swaggerSpec = swaggerJSDoc(options);

  function serveSwagger(app) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  module.exports = {
    serveSwagger,
    swaggerSpec
  };
  