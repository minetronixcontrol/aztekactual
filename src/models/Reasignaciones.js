const mongoose = require('mongoose');
const { Schema} = mongoose;

const ReasignacionesSchema = new Schema({
    idVentaReasignacion: {type: String, required: true},
    tipoReasignacion: {type: String, required: true},
    reasignado: {type: Boolean, required: true},
    motivo: {type: String, required: true},
    cantPenalizacion: {type: String, required: true},
    tipoDeCambio: {type: String, required: true},
    vendedor: {type: String, required: true},
    cliente: {type: String, required: true},
    fechaDeVenta: {type: String, required: false}
});

module.exports = mongoose.model('Reasignaciones', ReasignacionesSchema);