const mongoose = require('mongoose');
const { Schema} = mongoose;

const UsuariosSchema = new Schema({
    id_Usuario:               {type:String,required:true},
    nickname:                 {type:String,required:true},
    password:                 {type:String,required:true},
    nombre:                   {type:String,required:true},
    apellidoMaterno:          {type:String,required:true},
    apellidoPaterno:          {type:String,required:true},
    sucursal:                 {type:String,required:true},
    telefono:                 {type:String,required:true},
    comision:                 {type:String,required:true},
    seguridad:                {type:String,required:true},
    activo:                   {type:String,required:true},
    tipoDescuento:            {type:String,required:true},
    prefijoFolio:             {type:String,required:true},
    noFolio:                  {type:String,required:true},
});

module.exports = mongoose.model('Usuarios', UsuariosSchema);