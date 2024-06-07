const mongoose = require('mongoose');
const { Schema} = mongoose;

const CamionesSchema = new Schema({
    placas:          {type:String,required:true},
    marca:           {type:String,required:true},
    modelo:          {type:String,required:true},
    numeroEconomico: {type:String,required:true},
    capacidad:       {type:String,required:true},
    activo:          {type:String,required:true},
    id_Camion:       {type:String,required:true}
});

module.exports = mongoose.model('Camiones', CamionesSchema);