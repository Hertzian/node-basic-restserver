// ==========
// puerto
// ==========
process.env.PORT = process.env.PORT || 3000;

// ==========
// entorno
// ==========
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ==========
// db
// ==========
let urlDb;
if(process.env.NODE_ENV === 'dev'){
    urlDb = 'mongodb://localhost:27017/cafe';
}else{
    urlDb = 'mongodb+srv://lalo:CGrYyyRoYqorm5tR@cluster0-qhfig.mongodb.net/cafe';
}

process.env.URLDB = urlDb;