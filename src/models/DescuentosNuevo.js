const mongoose = require('mongoose');
const { Schema} = mongoose;

const DescuentosNuevoSchema = new Schema({
    nombre:             {type:String,required:true}, //Nombre del descuento
    dollarDesc:         {type:String,required:true}, //Descuento en Dollar
    detalle:            {type:String,required:true}, //
    fechaInicio:        {type:String,required:false},
    fechaFinal:         {type:String,required:false},
    activo:             {type:Boolean,required:true}
});

module.exports = mongoose.model('DescuentosNuevo', DescuentosNuevoSchema);