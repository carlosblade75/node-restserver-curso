const express = require('express');

const bcrypt = require('bcrypt');
// el underscore es una extension de javascript añadiendo mucho funcionalidad
const _ = require('underscore'); // el standard de uso hace que pongamos un guion como nombre

const Usuario = require('../models/usuario');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion'); // destructuración

const app = express();

//=================================================
// Obtener todos los usuarios - Paginado
//=================================================
// el middleware verificaToken se ejecutara cada vez que se haga un get
app.get('/usuario', verificaToken, (req, res) => {

    let desde = req.query.desde || 0; // si no viene el valor de la query (al ser un GET) entonces ponemos 0

    desde = Number(desde);

    let limite = req.query.limite || 5;

    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google  img') // {} este objeto son las condiciones del find; con el otro campo decimos que campos deseamos regresar
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                return res.json({
                    ok: true,
                    usuarios,
                    Totalusuarios: conteo
                });

            });
        });

});

//=================================================
// Crear nuevo usuario
//=================================================
app.post('/usuario', [verificaToken, verificaAdmin_Role], (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), // genera un hash sincrono con 10 vueltas
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // hacemos esto  para que no regrese la contraseña encriptada
        // usuarioDB.password = null;

        // esto implica mensaje de status 200
        return res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

});

//=================================================
// Actualizar usuario
//=================================================
app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    // underscore con pick decimos los campos que necesitemos  
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    // Usuario.findById( id, (err, usuarioDB) => {}); una forma de hacer la actualización

    // enviando en options el campo new a true, nos devuelve el nuevo objeto
    // con runvalidator hacemos que ejecute las validaciones del scheme
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

});

//=================================================
// Borrar usuario
//=================================================
app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;

    let cambiarEstado = { estado: false };

    Usuario.findByIdAndUpdate(id, cambiarEstado, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

    // borrado fisico del registro
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     if (!usuarioBorrado) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         });
    //     }

    //     return res.json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     });
    // });

});

module.exports = app;