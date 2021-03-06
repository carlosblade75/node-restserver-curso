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
process.env.CADUCIDAD_TOKEN = '48h';

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

// =============================================
// GOOGLE CLIENT ID
// =============================================
// podemos establecer en HEROKU la variable de entorno CLIENT_ID. en caso de que no existe, cogerá la otra
process.env.CLIENT_ID = process.env.CLIENT_ID || '373281651260-ed10nv9gbv15pol2dqui03aeu0886ruq.apps.googleusercontent.com';