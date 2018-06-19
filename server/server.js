require('./config/config');

const express = require('express');
const app = express();
const mongoose = require('mongoose');

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded middleware
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//aqui cargamos las rutas
app.use(require('./routes/index'));

// si la bbdd no existe, mooongose la crea
mongoose.connect(process.env.URLDB, (err, res) => {

    if (err) throw err;

    console.log('Base de datos online');
});

app.listen(process.env.PORT, () => {
    console.log(`Puerto ${process.env.PORT} escuchando..`);
});