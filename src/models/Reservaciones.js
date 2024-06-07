const mongoose = require('mongoose');
const { Schema} = mongoose;

const ReservacionesSchema = new Schema({
    cliente:      {type:String,required:true},
    tipo:        {type:String,required:true},
    razon:        {type:String,required:true},
    descuento:    {type:String,required:true},
    origen:       {type:String,required:true},
    destino:      {type:String,required:true},
    fecha:        {type:String,required:false},
    anio:        {type:String,required:false},
    diaDelAnio:   {type:Number,required:false},
    horaSalida:   {type:String,required:true},
    numeroAsiento:{type:String,required:false},
    statePagado:  {type:String,required:true},
    statePagadoCliente:  {type:String, required:false}, //Si el cliente ya terminó de pagar todo el boleto
    statePagadoAnticipo: {type:String,required:true}, //Si el usuario vendedor ya pagó el anticipo al administrador
    activo:       {type:String,required:true},
    fechaCancelacion: {type:String,required:false},
    idVenta:      {type:String,required:false},
    tipoCambio:   {type:String,required:true},
    total:        {type:String,required:true}, //Es el total que tiene que pagar el pasajero por su boleto
    vendedor:        {type:String,required:true},
    anticipo:        {type:String,required:true}, //Es la cantidad que deja el pasajero como anticipo de su reservacion
    fechaDeReservacion:        {type:String,required:true},
    fechaDeVenta:  {type:Date,required:false},
    folio:        {type:String,required:true}, 
    viajado:        {type:String,required:true},
    reasignaciones: {type:Number ,required:false}, //Del 0 al 3, total de veces que se ha reasignado esa reservacion
});

module.exports = mongoose.model('Reservaciones', ReservacionesSchema);