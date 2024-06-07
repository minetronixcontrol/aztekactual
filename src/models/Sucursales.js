const mongoose = require('mongoose');
const { Schema} = mongoose;

const SucursalesSchema = new Schema({
    nombre:      {type:String,required:true},
    direccion:   {type:String,required:true},
    ciudad:      {type:String,required:true},
    estado:      {type:String,required:true},
    pais:        {type:String,required:true},
    telefono_1:  {type:String,required:true},
    telefono_2:  {type:String,required:false},
    tipo:        {type:String,required:true},
    correo:      {type:String,required:true},
    activo:      {type:String,required:false},
});

module.exports = mongoose.model('Sucursales', SucursalesSchema);