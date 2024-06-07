const mongoose = require('mongoose');
const { Schema } = mongoose;

const ModificacionCorteSchema = new Schema({
    idVenta:          {type:String,required:true},
    idUsuario:        {type:String,required:true},
    //fecha:            {type:String,required:true}
});

module.exports = mongoose.model('ModificacionCorte', ModificacionCorteSchema);