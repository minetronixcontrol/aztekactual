const mongoose = require('mongoose');
const { Schema} = mongoose;

const DescuentosSchema = new Schema({
    desc:                  {type:String,required:true}, //Nombre del descuento
    dollarDesc:            {type:String,required:true}, //Descuento en Dollar
    activo:                {type:String,required:true},
    id_Descuento:          {type:String,required:true},
    tipo:                  {type:String,required:true} //Si es public o private
});

module.exports = mongoose.model('Descuentos', DescuentosSchema);