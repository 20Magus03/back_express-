const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const reservasRouter = require('./routes/reservas'); // Ruta correcta del archivo reservas.js
const habitacionesRouter = require('./routes/habitaciones'); // Ruta correcta del archivo habitaciones.js

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
  apis: ['./routes/reservas.js', './routes/habitaciones.js'], // Verifica que todas las rutas sean correctas
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rutas
app.use('/reservas', reservasRouter);
app.use('/habitaciones', habitacionesRouter); 

// Inicializar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
