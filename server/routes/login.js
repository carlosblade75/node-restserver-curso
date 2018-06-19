const express = require('express');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');


const Usuario = require('../models/usuario');

const app = express();


app.post('/login', function(req, res) {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: '(Usuario)  o (password) incorrectos'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario)  o (password) incorrectos'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB // Este es el PAYLOAD
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }); // estas variables de entorno son creadas en HEROKU
        // NOTA:
        // el password no saldrá en el token porque en el modelo hemos quitado ese campo al pasarlo como JSON
        return res.json({
            ok: true,
            usuario: usuarioDB,
            token // es lo mismo que poner token: token
        });

    });

});

module.exports = app;