const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const reservasRouter = require('./routes/reservas'); // Ruta correcta del archivo reservas.js

const app = express();
app.use(express.json());

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Reservas',
      version: '1.0.0',
      description: 'API para manejar reservas (crear, editar, eliminar)',
    },
  },
  apis: ['./routes/reservas.js'], // Verifica que esta ruta sea correcta
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rutas
app.use('/reservas', reservasRouter);

// Inicializar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
