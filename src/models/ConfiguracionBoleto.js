const mongoose = require('mongoose');
const { Schema} = mongoose;

const ConfiguracionBoletoSchema = new Schema({
    //idImagen:           {type:String,required:true},
    politicas:          {type:String,required:true},
    informacionPermiso: {type:String,required:true},
    frase:              {type:String,required:true},
    reservacion:        {type:String,required:true},
    //activo:             {type:String,required:true},
    //sucursal:           {type:String,required:true}
});

module.exports = mongoose.model('ConfiguracionBoleto', ConfiguracionBoletoSchema);