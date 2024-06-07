const mongoose = require('mongoose');
const { Schema} = mongoose;

const PreciosSchema = new Schema({
    origen:          {type:String,required:true},
    destino:         {type:String,required:true},
    costo:           {type:String,required:true},
    id_precio:       {type:String,required:true},
    activo:          {type:String,required:true}
});

module.exports = mongoose.model('Precios', PreciosSchema);