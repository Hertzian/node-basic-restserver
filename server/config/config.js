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
process.env.CADUCIDAD_TOKEN = '30d';


// ==========
// seed de autenticacion
// ==========
process.env.SEED = process.env.SEED || 'seed-secreto-desarrollo';

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