const mongoose = require('mongoose');
const { Schema } = mongoose;

const ListaDeAbordajeSchema = new Schema({
    idViaje:          {type:String,required:true},
    asiento:           {type:String,required:true},
    estado:          {type:String,required:true} 
    //Estados posibles: foraneo-azul, locales-amarillo, rosa-porabordar, gris -> No suben*
});

module.exports = mongoose.model('ListaDeAbordaje', ListaDeAbordajeSchema);