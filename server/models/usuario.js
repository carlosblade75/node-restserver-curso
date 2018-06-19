const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let roles_validos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
};

let Scheme = mongoose.Schema;

let usuarioScheme = new Scheme({
    nombre: {
        type: String,
        required: [true, 'El nombre necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: { type: String, required: false },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: roles_validos
    },
    estado: { type: Boolean, default: true },
    google: { type: Boolean, default: false }
});

// con esto podemos cambiar el  JSON del objeto. En este caso para quitar el campo password
// usamos una function en vez de una funcion de fech/lambda porque necesitamos el this
usuarioScheme.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}


usuarioScheme.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('Usuario', usuarioScheme);