// IMPORTACIONES 
const express = require('express');
const cors = require('cors');
var app = express();

//Importaciones de rutas
const EmpresaRutas = require('./src/routes/empresas.routes');
const EmpleadoRutas = require('./src/routes/empleados.routes')

//Middlewares
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//Cabeceras
app.use(cors());

//Carga de rutas
app.use('/api', EmpresaRutas, EmpleadoRutas);

module.exports = app;