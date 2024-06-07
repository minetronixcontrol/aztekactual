const mongoose = require('mongoose');
const { Schema} = mongoose;

const RutasSchema = new Schema({
    origen:          {type:String,required:true},
    destino:         {type:String,required:true},
    transbordos:     {type:Array,required:true},
    activo:          {type:Boolean,required:true}
});

module.exports = mongoose.model('Rutas', RutasSchema);