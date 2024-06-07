const mongoose = require('mongoose');
const { Schema} = mongoose;

const VentasSchema = new Schema({
    cliente:      {type:String,required:true},
    tipo:         {type:String,required:true}, // Si es Niño, Adulto o Tercera Edad
    razon:        {type:String,required:true},
    descuento:    {type:String,required:true},
    origen:       {type:String,required:true},
    destino:      {type:String,required:true},
    fecha:        {type:String,required:true},
    anio:         {type:Number,required:true},
    diaDelAnio:   {type:Number,required:true},
    horaSalida:   {type:String,required:true},
    numeroAsiento:{type:String,required:true},
    statePagado:  {type:String,required:false}, //Si se ha pagado en el corte
    activo:       {type:String,required:true},
    fechaCancelacion: {type:String,required:false},
    idVenta:      {type:String,required:true}, //Id del viaje
    tipoCambio:   {type:String,required:true},
    total:        {type:String,required:true},
    vendedor:     {type:String,required:true},
    folio:        {type:Number ,required:true},
    viajado:      {type:String,required:true},
    fechaDeVenta: {type:Date,required:false},
    reasignaciones: {type:Number ,required:false}, //Del 0 al 3, total de veces que se ha reasignado esa venta
    idVentasReasignacion: {type:String ,required:false}, //ID enlazado de la venta principal de la cual se reasigno
    tipoReasignacion: {type:String ,required:false}, //Si es una venta de reasignacion (Si viene de venta o de reservacion)
});

module.exports = mongoose.model('Ventas', VentasSchema);