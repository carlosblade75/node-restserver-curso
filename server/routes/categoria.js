const express = require('express');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion'); // destructuración

const app = express();

let Categoria = require('../models/categoria');

//=================================================
// Obtener todos las categorias - Paginada
//=================================================
app.get('/categoria', verificaToken, (req, res) => {

    let desde = req.query.desde || 0; // si no viene el valor de la query (al ser un GET) entonces ponemos 0

    desde = Number(desde);

    let limite = req.query.limite || 5;

    limite = Number(limite);

    Categoria.find({})
        .sort('descripcion')
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .exec((err, categoriasDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!categoriasDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Categoria no encontrada'
                    }
                });
            }

            Categoria.count({}, (err, conteo) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                return res.json({
                    ok: true,
                    categorias: categoriasDB,
                    Totalcategorias: conteo
                });

            });
        });

});

//=================================================
// Obtener categoría por ID
//=================================================
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id)
        .populate('usuario', 'nombre email')
        .exec((err, categoriaDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Categoria no encontrada'
                    }
                });
            }

            return res.json({
                ok: true,
                categoria: categoriaDB
            });
        });
});

//=================================================
// Crear nueva categoria
//=================================================
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;
    let usuarioID = req.usuario._id; // esto viene del middleware verificaToken

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: usuarioID
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se creo la categoría'
                }
            });
        }

        // esto implica mensaje de status 200
        return res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});

//=================================================
// Actualizar categoria
//=================================================
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Categoria.findByIdAndUpdate(id, { descripcion: body.descripcion }, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Id no existe'
                }
            });
        }

        return res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

//=================================================
// Borrar categoria
//=================================================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    // solo un administrador puede borrar categorias
    Categoria.findByIdAndRemove(id, (err, categoriaBorradaBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorradaBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoría no encontrado'
                }
            });
        }

        return res.json({
            ok: true,
            message: 'Categoria borrada',
            categoria: categoriaBorradaBD
        });
    });
});

module.exports = app;