const mongoose = require('mongoose');
const { Schema} = mongoose;

const ImagenesBoletosSchema = new Schema({
    imagen:           {type:String,required:true},
    type:           {type:String,required:true}
});

module.exports = mongoose.model('ImagenesBoletos', ImagenesBoletosSchema);