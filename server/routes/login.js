const express = require('express');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/usuario');

const app = express();


app.post('/login', (req, res) => {

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

// Configuraciones de Google
let verify = async(token) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async(req, res) => {

    let token = req.body.idtoken;

    let googleuser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: {
                    e,
                    mensaje: 'Token no válido'
                }
            });
        });

    Usuario.findOne({ email: googleuser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (usuarioDB) { // comprobamos si se ha autenticado por google. En caso de que no, no debemos darle login.

            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Deber de usar su autenticación normal'
                    }
                });
            } else {
                // le damos entonces un token ya que el usuario te autentico con google
                let token = jwt.sign({
                    usuario: usuarioDB // Este es el PAYLOAD
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }); // estas variables de entorno son creadas en HEROKU

                return res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        } else {

            // al no existir el usuario lo creamos  en la bbdd. tenemos que crearle un token
            let usuario = new Usuario();

            usuario.nombre = googleuser.nombre;
            usuario.email = googleuser.email;
            usuario.img = googleuser.img;
            usuario.google = true;
            usuario.password = ':)'; // tenemos que poner algo pq el password es obligatorio

            usuario.save((err, usuarioDB) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                // Creamos el token
                let token = jwt.sign({
                    usuario: usuarioDB // Este es el PAYLOAD
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }); // estas variables de entorno son creadas en HEROKU


                // esto implica mensaje de status 200
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });

            });
        }

    });

});

module.exports = app;