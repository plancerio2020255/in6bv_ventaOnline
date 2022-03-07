const ejs = require('ejs');
const pdf = require('html-pdf');
const path = require('path');
const Empresa = require('../models/usuario.model');

const file = './pdf/';
const extension = '.pdf';
const date = require('./fecha');
const EJS_Empleados = '../templates/empleados.report.template.ejs';

const opciones = {
    'height': '11.25in',
    'width': '8.5in',
    'header': {
        'height': '20mm'
    },
    'footer': {
        'height': '20mm',
    },
};

function crearReporteDeEmpleados(req,res) {
    const empresaId = req.params.idEmpresa;

    if (empresaId == req.user.sub) {
        Empresa.findOne({ _id: empresaId }).exec((err, empleados) => {
            if (err) {
                res.status(500).send({ mensaje: 'Error en la peticion' });
            } else if (empleados) {
                ejs.renderFile(path.join(EJS_Empleados), { empleados: empleados.empleados }, (err, informacion) => {
                    if (err) {
                        res.status(500).send({ mensaje: 'Error en la peticion' });
                    } else {
                        const nombre = file + empleados.nombre + '-empleados-' + date.obtenerFecha + extension
                        pdf.create(informacion, opciones).toFile(nombre, (err, informacion) => {
                            if (err) {
                                res.status(500).send({ mensaje: 'Error al crear pdf' });
                            } else if (informacion) {
                                res.send({ mensaje: 'PDF Creado en: ' + date.obtenerFechaEnOtroFormato() })
                            }
                        });
                    }
                });
            } else {
                res.status(404).send({ mensaje: 'Empleados no añadidos' });
            }
        })
    } else {
        res.send({ mensaje: 'No puedes ver esto, estos no son tus empleados' });
    }

}

module.exports = {
    crearReporteDeEmpleados
}