const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion'); // destructuración

let app = express();

let Producto = require('../models/producto');

//=================================================
// Obtener todos los productos - Paginada
//=================================================
app.get('/producto', verificaToken, (req, res) => {

    let desde = req.query.desde || 0; // si no viene el valor de la query (al ser un GET) entonces ponemos 0

    desde = Number(desde);

    let limite = req.query.limite || 5;

    limite = Number(limite);

    Producto.find({ disponible: true })
        .sort('nombre')
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productosDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productosDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }
                });
            }

            Producto.count({ disponible: true }, (err, conteo) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                return res.json({
                    ok: true,
                    productos: productosDB,
                    Totalproductos: conteo
                });

            });
        });

});

//=================================================
// Obtener producto por ID
//=================================================
app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrada'
                    }
                });
            }

            return res.json({
                ok: true,
                producto: productoDB
            });
        });
});

//=================================================
// Buscar productos
//=================================================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    // i -> insensible a mayusculas y minusculas y hace como un like en SQL
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex, disponible: true })
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productosDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productosDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }
                });
            }

            return res.json({
                ok: true,
                productos: productosDB
            });

        });
});


//=================================================
// Crear nuevo producto
//=================================================
app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;
    let usuarioID = req.usuario._id; // esto viene del middleware verificaToken

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        usuario: usuarioID,
        categoria: body.categoria
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se creo el producto'
                }
            });
        }

        // esto implica mensaje de status 200
        return res.json({
            ok: true,
            producto: productoDB
        });

    });
});

//=================================================
// Actualizar producto
//=================================================
app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let productoUpdated = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria
    };

    Producto.findByIdAndUpdate(id, productoUpdated, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Id no existe'
                }
            });
        }

        return res.json({
            ok: true,
            producto: productoDB
        });

    });

});

//=================================================
// Borrar producto
//=================================================
app.delete('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    let cambiarEstado = { disponible: false };

    Producto.findByIdAndUpdate(id, cambiarEstado, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            producto: productoDB,
            message: 'Producto borrado'
        });

    });

});

module.exports = app;