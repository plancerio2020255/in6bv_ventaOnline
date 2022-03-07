const bcrypt = require('bcrypt-nodejs');

const jwt = require('../services/jwt');

const Empleados = require('../models/empleados.model');

const Empresas = require('../models/usuario.model')

function agregarEmpleado(req,res) {
    const empresaId = req.params.idEmpresa;
    const parametros = req.body;
    const empleado = new Empleados();

    if (empresaId == req.user.sub) {
        Empresas.findById(empresaId, (err, empresaEncontrada) => {
            if (err) {
                res.status(500).send({ mensaje: 'Error en la peticion' });
            } else if (empresaEncontrada) {
                if (parametros.nombre && parametros.puesto && parametros.departamento) {
                    empleado.nombre = parametros.nombre
                    empleado.puesto = parametros.puesto
                    empleado.departamento = parametros.departamento

                    Empresas.findByIdAndUpdate(empresaId, { $push: { empleados: empleado } }, { new: true }, (err, empresaActualizada) => {
                        if (err) {
                            res.status(500).send({ mensaje: 'Error en la peticion' });
                        } else if (empresaActualizada) {
                            res.send({ mensaje: 'Empleado agregado', empresaActualizada })
                        } else {
                            res.status(404).send({ mensaje: 'Error al agregar empleado' });
                        }
                    })
                } else {
                    res.send({ mensaje: 'Debe llenar todos los campos' })
                }
            } else {
                res.send({ mensaje: 'Empresa no encontrada' });
            }
        });
    } else {
        res.send({ mensaje: 'No puede agregar empleados a otras empresas' })
    }
}

function encontrarEmpleados(req,res) {
    const empresaId = req.params.idEmpresa;

    if (empresaId == req.user.sub) {
        Empresas.findOne({ _id: empresaId }).exec((err, empleados) => {
            if (err) res.status(500).send({ mensaje: 'Error en la peticion' });
            if (empleados) {
                res.send({empleados: empleados.empleados })
            } else {
                res.status(404).send({ mensaje: 'Error al encontrar empleados' });
            }
        })
    } else {
        res.send({ mensaje: 'Solo puede ver sus empleados' });
    }

}

function editarEmpleado(req, res) {
    const empresaId = req.params.idEmpresa;
    const empleadosId = req.params.idEmpleados;
    const parametros = req.body;
    
    if (empresaId == req.user.sub) {
        if (parametros.nombre && parametros.puesto && parametros.departamento) {
            Empresas.findOne({ _id: empresaId }, (err, empresaEncontrada) => {
                if (err) {
                    res.status(500).send({ message: 'Error en la peticion' });
                } else if (empresaEncontrada) {
                    Empresas.findOneAndUpdate({ _id: empresaId, 'empleados._id': empleadosId },
                         { new: true }, (err, empleadoEditado) => {
                            if (err) {
                                res.status(500).send({ mensaje: 
                                    'Error al actualizar' });
                            } else if (empleadoEditado) {
                                res.send({ mensaje:
                                     'Empleados editados: ', empleadoEditado });
                            } else {
                                res.status(404).send({ mensaje: 'Error al actualizar' });
                            }
                        })
                } else {
                    res.send({ mensaje: 'Usuario no registrado' });
                }
            })
        } else {
            res.status(200).send({ mensaje: 'Debe completar todos los campos' });
        }
    } else {
        res.status(404).send({ message: 'Solo puede editar empleados de su empresa' });
    }

}

function eliminarEmpleados(req,res) {
    const empresaId = req.params.idEmpresa;
    const empleadoId = req.params.idEmpleado;

    if(empresaId == req.use.sub) {
        Empresas.findOneAndUpdate({_id: empresaId, empleadosID : empleadoId},
            {$pull: {empleados: {_id:empleadoId}} }, {new:true}, (err, empleadoEliminado)=>{
                    if(err) {
                        res.status(500).send({mensaje: 'Error en la peticions'})
                    } else if(empleadoEliminado) {
                        res.send({mensaje: 'Empleado eliminado', empleadoEliminado});
                    } else {
                        res.status(400).send({mensaje: 'Empleado no encontrado'});
                    }
                })
    } else {
        res.status(400).send({mensaje:'No puede editar otras empresas'});
    }

}

function buscarEmpleadosPorID(req,res) {
    const empresaId = req.params.idEmpresa;
    const empleadoId = req.params.idEmpleado;

    if(empresaId == req.use.sub){
        Empresas.findOne({_id: empresaId}, {empleados: {$elemMatch:{_id: empleadoId}}})
        .exec((err, empleados) =>{
            if(err) {
                res.status(500).send({mensaje: 'Error en la peticion'})
            }else if(empleados) {
                res.send({mensaje:'Empleados', empleado: empleados.empleados})
            } else {
                res.status(400).send({mensaje: 'Empleado no encontrado'});
            }
        })
    } else {
        res.send({mensaje: 'No puede buscar empleados que no son suyos'})
    }
}


module.exports = {
    agregarEmpleado,
    encontrarEmpleados,
    editarEmpleado,
    eliminarEmpleados,
    buscarEmpleadosPorID
}