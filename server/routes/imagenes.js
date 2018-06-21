const express = require('express');

const app = express();

const { verificaTokenImg } = require('../middlewares/autenticacion'); // destructuración

// Estos dos paquetes existen en node
const fs = require('fs');
const path = require('path');

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`);
    // esta función es sincrona. La otra usa callbacks
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let noImgPath = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(noImgPath);
    }

});

module.exports = app;