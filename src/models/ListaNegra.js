const mongoose = require('mongoose');
const { Schema } = mongoose;

const ListaNegraSchema = new Schema({
    idCliente:          {type:String,required:true},
    motivo:           {type:String,required:true}
});

module.exports = mongoose.model('ListaNegra', ListaNegraSchema);