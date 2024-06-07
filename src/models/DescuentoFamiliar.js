const mongoose = require('mongoose');
const { Schema} = mongoose;

const DescuentoFamiliarSchema = new Schema({
    familia:          {type:Array,required:true},
    usuario:            {type:String,required:true},
    fechaDeCompra:      {type:String,required:true},
    status:             {type:String,required:true},
    activo:             {type:String,required:true}
});

module.exports = mongoose.model('DescuentoFamiliar', DescuentoFamiliarSchema);