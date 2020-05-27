const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion:{
        type: String,
        // index: true,
        unique: true,
        required: [true, 'La descripción es obligatoria']
    },

    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        // required:true
    }

});

categoriaSchema.methods.toJSON = function(){
    let user  = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

// categoriaSchema.plugin(uniqueValidator, {
//     message: '{PATH} debe de ser único'
// });

module.exports = mongoose.model('Categoria', categoriaSchema);