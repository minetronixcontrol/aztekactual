const mongoose = require('mongoose');
const { Schema} = mongoose;

const DollarSchema = new Schema({
    precioDollar:           {type:String,required:true},
    fecha:                  {type:String,required:true}
});

module.exports = mongoose.model('Dollar', DollarSchema);