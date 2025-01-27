import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API roams loans simulations',
      version: '1.0.0',
      description: 'API for managing loans simulations',
    },
    servers: [
      {
        url: 'http://localhost:' + process.env.PORT,
      },
    ],
  },
  apis: ['./routes/*.js'], 
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

export { swaggerDocs, swaggerUi };
