// =============================================
// PUERTO
// =============================================

process.env.PORT = process.env.PORT || 3000;

// =============================================
// ENTORNO
// =============================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =============================================
// VENCIMIENTO DEL TOKEN
// =============================================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30; // segundos*minutos+horas*dias-- 30 días de duración

// =============================================
// SEED DE AUTENTICACIÓN
// =============================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// =============================================
// BASE DE DATOS
// =============================================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI; // esta variable la hemos puesto nosotros desde la termial --> heroku config:set MONGO_URI ="valor"
}

process.env.URLDB = urlDB;