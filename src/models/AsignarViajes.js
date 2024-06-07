const mongoose = require('mongoose');
const { Schema} = mongoose;

const AsignarViajesSchema = new Schema({
    fecha:           {type:String,required:true},
    hora:            {type:String,required:false},
    anio:            {type:Number,required:true},
    diaDelAnio:      {type:Number,required:true},
    chofer_1:        {type:String,required:true},
    chofer_2:        {type:String,required:true},
    id_Viajes:       {type:String,required:true},
    sobrecargo:      {type:String,required:true},
    auxiliar:        {type:String,required:true},
    creadoPor:       {type:String,required:false},
    numeroEconomico: {type:String,required:true},
    ruta:            {type:String,required:true},
    capacidad:       {type:String,required:true},
    activo:          {type:String,required:true},
    asiento_1:       {type:String,required:false},
    asiento_2:       {type:String,required:false},
    asiento_3:       {type:String,required:false},
    asiento_4:       {type:String,required:false},
    asiento_5:       {type:String,required:false},
    asiento_6:       {type:String,required:false},
    asiento_7:       {type:String,required:false},
    asiento_8:       {type:String,required:false},
    asiento_9:       {type:String,required:false},
    asiento_10:       {type:String,required:false},
    asiento_11:       {type:String,required:false},
    asiento_12:       {type:String,required:false},
    asiento_13:       {type:String,required:false},
    asiento_14:       {type:String,required:false},
    asiento_15:       {type:String,required:false},
    asiento_16:       {type:String,required:false},
    asiento_17:       {type:String,required:false},
    asiento_18:       {type:String,required:false},
    asiento_19:       {type:String,required:false},
    asiento_20:       {type:String,required:false},
    asiento_21:       {type:String,required:false},
    asiento_22:       {type:String,required:false},
    asiento_23:       {type:String,required:false},
    asiento_24:       {type:String,required:false},
    asiento_25:       {type:String,required:false},
    asiento_26:       {type:String,required:false},
    asiento_27:       {type:String,required:false},
    asiento_28:       {type:String,required:false},
    asiento_29:       {type:String,required:false},
    asiento_30:       {type:String,required:false},
    asiento_31:       {type:String,required:false},
    asiento_32:       {type:String,required:false},
    asiento_33:       {type:String,required:false},
    asiento_34:       {type:String,required:false},
    asiento_35:       {type:String,required:false},
    asiento_36:       {type:String,required:false},
    asiento_37:       {type:String,required:false},
    asiento_38:       {type:String,required:false},
    asiento_39:       {type:String,required:false},
    asiento_40:       {type:String,required:false},
    asiento_41:       {type:String,required:false},
    asiento_42:       {type:String,required:false},
    asiento_43:       {type:String,required:false},
    asiento_44:       {type:String,required:false},
    asiento_45:       {type:String,required:false},
    asiento_46:       {type:String,required:false},
    asiento_47:       {type:String,required:false},
    asiento_48:       {type:String,required:false}
});
//48 lugares
module.exports = mongoose.model('Viaje', AsignarViajesSchema);