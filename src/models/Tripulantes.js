const mongoose = require('mongoose');
const { Schema} = mongoose;

const TripulantesSchema = new Schema({
    nombre:                     {type:String,required:true},
    apellidoMaterno:            {type:String,required:false},
    apellidoPaterno:            {type:String,required:true},
    telefono:                   {type:String,required:true},
    telefono2:                  {type:String,required:false},
    tipo:                       {type:String,required:true},
    activo:                     {type:String,required:true},
    id_tripulante:              {type:String,required:true}
    });

module.exports = mongoose.model('Tripulantes', TripulantesSchema);