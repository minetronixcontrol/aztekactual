const mongoose = require('mongoose');
const { Schema} = mongoose;

const ClientesSchema = new Schema({
    nombre:                     {type:String,required:true},
    apellidoMaterno:            {type:String,required:false},
    apellidoPaterno:            {type:String,required:true},
    fechaNacimiento:            {type:String,required:true},
    correo:                     {type:String,required:false},
    curp:                       {type:String,required:false},
    genero:                     {type:String,required:false},
    telefono:                   {type:String,required:false},
    nombreEmergencia:           {type:String,required:false},
    apellidoMaternoEmergencia:  {type:String,required:false},
    apellidoPaternoEmergencia:  {type:String,required:false},
    parentesco:                 {type:String,required:false},
    telefonoEmergencia:         {type:String,required:false},
    activo:                     {type:String,required:true},
    id_Cliente:                 {type:String,required:true},
    listaNegra:                 {type:String,required:true},
    usuario:                    {type:String,required:false}
});

module.exports = mongoose.model('Clientes', ClientesSchema);

//{nombre, apellidoMaterno, apellidoPaterno, fechaNacimiento, correo, curp, telefono, nombreEmergencia, apellidoMaternoEmergencia, apellidoPaternoEmergencia, parentesco, telefonoEmergencia, activo, id_Cliente, listaNegra}                    