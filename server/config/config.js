// ==========
// puerto
// ==========
process.env.PORT = process.env.PORT || 3000;

// ==========
// entorno
// ==========
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ==========
// vencimiento de token
// ==========
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


// ==========
// seed de autenticacion
// ==========
process.env.SEED = process.env.SEED || 'palabra-secreta';

// ==========
// db
// ==========
let urlDb;
if(process.env.NODE_ENV === 'dev'){
    urlDb = 'mongodb://localhost:27017/cafe';
}else{
    urlDb = process.env.MONGO_URI;
}

process.env.URLDB = urlDb;