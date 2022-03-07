const express = require('express');
const controladorEmpresas = require('../controllers/empresas.controller');

const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');

const api = express.Router();

api.post('/agregarEmpresa', [md_autenticacion.Auth, md_roles.verAdmin] ,controladorEmpresas.agregarEmpresa);
api.post('/login', controladorEmpresas.Login);
api.put('/editarEmpresa/:idEmpresa', [md_autenticacion.Auth, md_roles.verAdmin],controladorEmpresas.editarEmpresa);
api.delete('/eliminarEmpresa/:idEmpresa', [md_autenticacion.Auth, md_roles.verAdmin],controladorEmpresas.eliminarEmpresa);

module.exports = api;