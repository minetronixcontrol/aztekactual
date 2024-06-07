const mongoose = require('mongoose');
const { Schema} = mongoose;

const ApartadosSchema = new Schema({
    idVendedor:          {type:String,required:true},
    idViaje:           {type:String,required:true},
    asiento:          {type:String,required:true},
    fechaCreacion: {type:String,required:true}
});

module.exports = mongoose.model('Apartados', ApartadosSchema);