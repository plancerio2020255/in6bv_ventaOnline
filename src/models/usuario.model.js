const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    nombreEmpresa: String,
    usuario: String,
    password: String,
    rol: String,
    empleados: [{
        nombre: String,
        puesto: String,
        departamento: String
    }]
});

module.exports = mongoose.model('Usuario', usuarioSchema);