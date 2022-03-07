const express = require('express');
const empleadosControlador = require('../controllers/empleado.controller');

// MIDDLEWARES
const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');

// REPORTES
const pdf = require('../pdf/pdf.report');


const api = express.Router();

api.put('/:idEmpresa/agregarEmpleado', [md_autenticacion.Auth, md_roles.verEmpresa], empleadosControlador.agregarEmpleado);
api.get('/:idEmpresa/obtenerEmpleados', [md_autenticacion.Auth, md_roles.verEmpresa], empleadosControlador.buscarEmpleados);
api.put(':idEmpresa/editarEmpleado/:idEmpleados', [md_autenticacion.Auth, md_roles.verEmpresa], empleadosControlador.editarEmpleado);
api.put('/:idEmpresa/eliminarEmpleado/:idEmpleado',[md_autenticacion.Auth, md_roles.verEmpresa], empleadosControlador.eliminarEmpleados);
api.get('/:idEmpresa/buscarEmpleado', [md_autenticacion.Auth, md_roles.verEmpresa],empleadosControlador.buscarEmpleados);
api.get('/:idEmpresa/buscarEmpleadoPorID/:idEmpleado', [md_autenticacion.Auth, md_roles.verEmpresa], empleadosControlador.buscarEmpleadosPorID);
api.get('/crearReporteDeEmpleados/:idEmpresa', [md_autenticacion.Auth, md_roles.verEmpresa], pdf.crearReporteDeEmpleados);


module.exports = api;