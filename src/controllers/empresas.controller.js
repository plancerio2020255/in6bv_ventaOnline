const bcrypt = require('bcrypt-nodejs');

const jwt = require('../services/jwt');

const Empresas = require('../models/usuario.model');
const Empleados = require('../models/empleados.model');


// Crear unicamente un solo usuario con rol admin

function crearAdminOnlyOne(req, res) {
    var AdminGlobal = new Empresas();
    Empresas.findOne({usuario: 'Admin'}, (err, adminCreado) => {
        if(err) {
            console.log('Error en la petición');
        } else if(adminCreado) {
            console.log('El usuario admin solo puede ser una vez'); 
        }else {
            bcrypt.hash('123456', null,  null, (err, passwordEncriptada)=>{
                if(err) {
                    res.status(500).send({mensaje: 'Error en la peticion'})
                } else if(passwordEncriptada) {

                    AdminGlobal.nombreEmpresa = 'Admin';
                    AdminGlobal.usuario = 'Admin';
                    AdminGlobal.password = passwordEncriptada;
                    AdminGlobal.rol = 'Admin';
                    AdminGlobal.save((err, usuarioGuardado) => {
                        if (err) {
                            return res.status(500)
                        .send({ mensaje: 'Error en la peticion' });
                        } else if(usuarioGuardado) {
                            console.log('Administrador creado');
                        } else {
                            console.log('Error al crearlo')
                        }
                    
                    })
                }
                
                
            })
        }
    })
       

}

// Función login
function Login(req, res) {
    let parametros = req.body;

    if (parametros.usuario && parametros.password) {
        Empresas.findOne({ usuario: parametros.usuario}, (err, usuarioEncontrado) => {
            if (err) {
                res.status(500).send({ mensaje: 'Error en la peticion' })
            } else if (usuarioEncontrado) {
                bcrypt.compare(parametros.password, usuarioEncontrado.password, 
                    (err, verificacionPassword) => {
                    if (err) {
                        res.status(500).send({ mensaje: '' });
                    } else if (verificacionPassword) {
                        if(parametros.obtenerToken === 'true'){
                            return res.status(200)
                                .send({ token: jwt.crearToken(usuarioEncontrado) })
                        } else {
                            usuarioEncontrado.password = undefined;
                            return  res.status(200)
                                .send({ usuario: usuarioEncontrado })
                        }
                    } else {
                        res.status(500).send({ mensaje: 'Las contraseñas no coinciden' })
                    }
                })
            } else {
                res.send({ mensaje: 'El usuario no se encuentra registrado' })
            }
        })
    } else {
        res.status(200).send({ mensaje: 'Ingrese todos los campos necesarios' })
    }
}

//Funcion agregar Empresas

function agregarEmpresa(req,res) {
    const empresa = new Empresas();
    const parametros = req.body;

    if(parametros.nombre && parametros.password) {
        empresa.nombreEmpresa = parametros.nombre;
        empresa.usuario = parametros.usuario;
        empresa.rol = 'Empresa';

        Empresas.find({ usuario: parametros.usuario}, (err, usuarioEncontrado) => {
            if ( usuarioEncontrado.length == 0 ) {

                bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                    empresa.password = passwordEncriptada;

                    empresa.save((err, usuarioGuardado) => {
                        if (err) return res.status(500)
                            .send({ mensaje: 'Error en la peticion' });
                        if(!usuarioGuardado) return res.status(500)
                            .send({ mensaje: 'Error al agregar la empresa'});
                        
                        return res.status(200).send({ usuario: usuarioGuardado });
                    });
                });                    
            } else {
                return res.status(500)
                    .send({ mensaje: 'Este usuario, ya  se encuentra utilizado' });
            }
        })
    }
}

//Función editar empresas

function editarEmpresa(req, res) {
    const usuarioID = req.params.rol;
    const parametros = req.body;

    if (req.user.rol !== 'Admin') return res.status(500)
        .send({ mensaje: 'Solo el admin puede editar' });

    delete parametros.password

    Empresas.findByIdAndUpdate(req.params.idEmpresa, parametros, { new: true },
        (err, empresaActualizada) => {
            if (err) return res.status(500)
                .send({ mensaje: 'Error en la peticion' });
            if (!empresaActualizada) return res.status(500)
                .send({ mensaje: 'Error al editar el Usuario' });

            return res.status(200).send({ empresa: empresaActualizada })
        })
    
}

// Eliminar Empresas

function eliminarEmpresa(req, res) {
    const idEmpresa = req.params.idEmpresa;

    Empresas.findByIdAndDelete(idEmpresa, (err, empresaEliminada)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!empresaEliminada) return res.status(500)
            .send({ mensaje: 'Error al eliminar la empresa' })

        return res.status(200).send({ empresa: empresaEliminada });
    })

}

function encontrarEmpresas(req, res) {
    Empresas.find({}).exec((err, empresas) => {
        if(err) {
            res.status(500).send({mensaje :'Error en la peticion'})
        } else if(empresas) {
            res.send({mensaje: 'Los datos no coinciden con ninguna empresa'})
        } else{
            res.send({mensaje : 'No hay registros'});
        }
    })
}

function encontrarEmpresa(req,res){
    const empresaId = req.params.id;

    Empresas.findById(empresaId).exec((err, empresa) =>{
        if(err) res.status(500).send({mensaje: 'Error en la peticions'});
        if(empresa) {
            res.send({mensaje : 'Empresa encontrada'})
        } else {
            res.send({mensaje: 'Empresa no encontrada'})
        }
    }) 
}




module.exports = {
    crearAdminOnlyOne,
    Login,
    agregarEmpresa,
    editarEmpresa,
    eliminarEmpresa,
    encontrarEmpresa,
    encontrarEmpresas
}
