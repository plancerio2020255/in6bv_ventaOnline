const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const empleadosSchema = new Schema( {
    nombre: String,
    puesto: String,
    departamento: String,

});

module.exports = mongoose.model('Empleados', empleadosSchema);