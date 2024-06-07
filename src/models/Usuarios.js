const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema} = mongoose;

const UsuariosSchema = new Schema({
    id_Usuario:               {type:String,required:true},
    nickname:                 {type:String,required:true},
    password:                 {type:String,required:true},
    nombre:                   {type:String,required:true},
    apellidoMaterno:          {type:String,required:false},
    apellidoPaterno:          {type:String,required:true},
    sucursal:                 {type:String,required:true},
    telefono:                 {type:String,required:true},
    comision:                 {type:String,required:true},
    seguridad:                {type:String,required:true},
    activo:                   {type:String,required:true},
    tipoDescuento:            {type:String,required:true},
    descuentos:               {type:Array,required:false},
    prefijoFolio:             {type:String,required:true},
    noFolio:                  {type:String,required:true},
});
/* UsuariosSchema.pre('save',function(next){
    bcrypt.genSalt(10).then(salts => {
        bcrypt.hash(this.password,salts).then(hash => {
            this.password = hash;
            next();
        }).catch(error => next(error));
    }).catch(error => next(error));
}); */
module.exports = mongoose.model('Usuarios', UsuariosSchema);