const mongoose = require('mongoose');
const { Schema} = mongoose;

const CancelacionesSchema = new Schema({
    idVenta:         {type:String,required:true},
    motivo:          {type:String,required:true},
    idCancelacion:   {type:String,required:true},
});

module.exports = mongoose.model('Cancelaciones', CancelacionesSchema);