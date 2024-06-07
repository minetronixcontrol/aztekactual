const mongoose = require('mongoose');
const { Schema} = mongoose;

const OrigenesYdestinosSchema = new Schema({
    nombre:              {type:String,required:true},
    municipio:           {type:String,required:true},
    direccion:           {type:String,required:true},
    estado:              {type:String,required:true},
    pais:                {type:String,required:true},
    horaDeCita:          {type:String,required:true},
    horaDeSalida:        {type:String,required:true},
    activo:              {type:String,required:true},
    especial:            {type:String,required:false},
    idOrigenesYdestinos:{type:String,required:true}
});

module.exports = mongoose.model('OrigenesYdestinos', OrigenesYdestinosSchema);