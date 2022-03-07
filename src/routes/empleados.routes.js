const express = require('express');
const empleadosControlador = require('../controllers/empleado.controller');

// MIDDLEWARES
const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');


const api = express.Router();

api.put('/:idEmpresa/agregarEmpleado', [md_autenticacion.Auth, md_roles.verEmpresa], empleadosControlador.agregarEmpleado);
api.get('/:idEmpresa/obtenerEmpleados', [md_autenticacion.Auth, md_roles.verEmpresa], empleadosControlador.encontrarEmpleados);
api.put(':idEmpresa/editarEmpleado/:idEmpleados', [md_autenticacion.Auth, md_roles.verEmpresa], empleadosControlador.editarEmpleado);

module.exports = api;