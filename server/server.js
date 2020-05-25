require('./config/config');

const express = require('express');
//  Using Node.js `require()`
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/usuario'));
 

mongoose.connect(
    process.env.URLDB,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex:true
    },
    (err, res) => {
        if(err){
            throw err;
        }

    console.log('Base de datos online');
});
 
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});


// usr:
// lalo
// pass:
// CGrYyyRoYqorm5tR

// atlas
// mongodb+srv://lalo:CGrYyyRoYqorm5tR@cluster0-qhfig.mongodb.net/cafe