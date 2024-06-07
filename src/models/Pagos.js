const mongoose = require('mongoose');
const { Schema} = mongoose;

const PagosSchema = new Schema({
    id_Reservacion:      {type:String,required:true}, 
    cantidad:            {type:String,required:true}, 
    fecha:               {type:String,required:true}, //Fecha de pago
    statePagado:         {type:String,required:true}, //Si el usuario vendedor ya se lo pago al administrador
    fechaPago:           {type:Date,required:false},
    vendedor:            {type:String,required:false}
});

module.exports = mongoose.model('Pagos', PagosSchema);