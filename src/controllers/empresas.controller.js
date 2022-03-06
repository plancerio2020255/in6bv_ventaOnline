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
                AdminGlobal.nombreEmpresa = 'Admin';
                AdminGlobal.usuario = 'Admin';
                AdminGlobal.password = passwordEncriptada;
                AdminGlobal.rol = 'Admin';
                AdminGlobal.save((err, usuarioGuardado) => {
                    if (err) return res.status(500)
                    .send({ mensaje: 'Error en la peticion' });
                if(!usuarioGuardado) return res.status(500)
                    .send({ mensaje: 'Error al agregar el Usuario'});
                
                return res.status(200).send({ usuario: usuarioGuardado });
                })
            })
        }
    })
       

}

// Función login
function Login(req, res) {
    let parametros = req.body;

    if (parametros.username && parametros.password) {
        Company.findOne({ usuario: parametros.usuario}, (err, usuarioEncontrado) => {
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
                    usuarioModel.password = passwordEncriptada;

                    usuarioModel.save((err, usuarioGuardado) => {
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
    const editar = req.body;

    if(usuarioID !== 'Admin') {
        return res.status(500)
        .send({ mensaje: 'No tienes permisos suficientes, contactate con un administrador'});
    }else{
        Empresas.findByIdAndUpdate(req.user.sub, editar, {new:true}, 
            (err, empresaActualizada) =>{
                if(err) return res.status(500)
                .send({mensaje: 'Error en la peticion'});
                if(!empresaActualizada) return res.status(500)
                .send({mensaje: 'Error al editar empresa'});

                return res.status(200).send({empresa: empresaActualizada})
        })
    }
    
}

// Eliminar Empresas

function eliminarEmpresa(req, res) {
    const usuarioID = req.params.idEmpresa;

    Empresas.findByIdAndDelete(usuarioID, (err, empresaEliminada)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!empresaEliminada) return res.status(500)
            .send({ mensaje: 'Error al eliminar la empresa' })

        return res.status(200).send({ empresa: empresaEliminada });
    })

}


module.exports = {
    crearAdminOnlyOne,
    Login,
    agregarEmpresa,
    editarEmpresa,
    eliminarEmpresa
}
