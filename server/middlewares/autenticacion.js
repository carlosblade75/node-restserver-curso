const jwt = require('jsonwebtoken');

// ================================
// Verificar token
// ================================

let verificaToken = (req, res, next) => {

    // de esta forma obtenemos el header token
    let token = req.get('token');

    // el decoded es el objeto JSON decodificado. Es decir, el payload (la parte que va entre la cabecera y la firma. En nuestro caso es el usuario)
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;

        next();
    });

};

let verificaAdmin_Role = (req, res, next) => {

    var usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {

        next();
    } else {

        return res.status(401).json({
            ok: false,
            err: { message: 'El usuario no es administrador' }
        });
    }
}

module.exports = {
    verificaToken,
    verificaAdmin_Role
};