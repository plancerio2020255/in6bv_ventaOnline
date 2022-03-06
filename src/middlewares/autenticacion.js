const jwt_simple = require('jwt-simple');
const moment = require('moment');
const secret = 'secretisimo_papa';

exports.Auth = function(req, res, next) {
    if ( !req.headers.authorization ) {
        return res.status(404)
            .send({ mensaje: 'La peticion, no posee la cabecera de Autenticacion' });
    }

    var token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        var payload = jwt_simple.decode(token, secret);
        if(payload.exp <= moment().unix()){
            return res.status(404)
                .send({ mensaje:'El token ya ha expirado' });
        }
    } catch (error) {
        return res.status(500)
            .send({ mensaje: 'El token no es valido'})
    }

    req.user = payload;
    next();
}

exports.ensureAuthAdministrator = (req, res, next) => {
    let payload = req.user;

    if (payload.role != 'Admin') {
        return res.status(404).send({ mensaje: 'No tienes permisos suficientes para entrar a esta ruta' })
    } else {
        return next();
    }
}

exports.ensureAuthCompany = (req, res, next) => {
    let payload = req.user;

    if (payload.role != 'Empresa') {
        return res.status(404).send({ mensaje: 'No tienes permisos suficientes para entrar a esta ruta' })
    } else {
        return next();
    }
}