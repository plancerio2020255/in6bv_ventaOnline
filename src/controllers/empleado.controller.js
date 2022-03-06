const bcrypt = require('bcrypt-nodejs');

const jwt = require('../services/jwt');

const Empleados = require('../models/empleados.model');

const Empresas = require('../models/usuario.model')

function agregarEmpleado(req,res) {
    const empresaId = req.params.id;
    const parametros = req.body;
    const empleado = new Empleados();

    if(empresaId == req.use.sub) {
        empresaId.findById(empresaId,(err,empresaEncontrada) => {
            if(err) {
                res.status(500).send({
                    mensaje:'Error en la peticion'
                });
            }else if(empresaEncontrada) {
                if(parametros.nombre && parametros.puesto && parametros.departamento) {
                    empleado.nombre = parametros.nombre;
                    empleado.puesto = parametros.puesto;
                    empleado.departamento = parametros.departamento;
                    Empresas.findByIdAndUpdate(empresaId, { $push : {empleados: empleado}}
                        , {new:true}, (err, empresaActualizada) => {
                            if(err) {
                                res.status(500).send({mensaje: 'Error en la peticion'});
                            } else if(empresaActualizada) {
                                res.send({ mensaje: 'Empleado añadido'})
                            } else {
                                res.status(404).send({mensaje: 'Error al añadir empleado'});

                            }
                        })
                } else {
                    res.send({mensaje: 'Ingrese todos los campos'});
                }
            } else {
                res.send({mensaje:'La empresa ingresada no existe'});
            }
        })
    } else {
        res.send({ mensaje: 'No puede añadir empleados en empresas que no son suyas'});
    }

}

function editarEmpleado(req,res) {
    const empresaId = req.params.idEmpresa;
    const empleadoId = req.params.idEmpleado;
    const parametros = req.body;

    

}

module.exports = {
    agregarEmpleado
}