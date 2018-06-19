// =============================================
// PUERTO
// =============================================

process.env.PORT = process.env.PORT || 3000;

// =============================================
// ENTORNO
// =============================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =============================================
// BASE DE DATOS
// =============================================

let urlDB;

if (process.env.NODE_ENV === 'dev') {

    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb://cafe-user:abc123@ds261660.mlab.com:61660/moongodb_cafe';
}

process.env.URLDB = urlDB;