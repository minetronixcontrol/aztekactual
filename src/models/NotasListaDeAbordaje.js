const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotasListaDeAbordajeSchema = new Schema({
    idViaje:          {type:String,required:true},
    sobres:           {type:String,required:false},
    totalBoletos:          {type:String,required:false}, 
    sobresPorCobrar:          {type:String,required:false} ,
    entregadosPor:          {type:String,required:false},
    Notas:          {type:String,required:false} 
});

module.exports = mongoose.model('NotasListaDeAbordaje', NotasListaDeAbordajeSchema);