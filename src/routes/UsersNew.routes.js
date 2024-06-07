const express = require('express'); //requerimiento de express
const router = express.Router();   // invocacion de la funcion router del modulo express
const UsersNew= require('../models/UsersNew');
const Venta = require('../models/Ventas');
const Reservacion = require('../models/Reservaciones');
const Apartado = require('../models/Apartados');
const Sucursal = require('../models/Sucursales');
const Descuento = require('../models/DescuentosNuevo');

router.get('/', async (req, res) => {
    const usuario = await UsersNew.find({activo: 'true'});
    //console.log(usuario);
    res.json(usuario);
});
router.get('/:username', async (req, res) =>{
    const usuario = await UsersNew.find({ nickname: req.params.username });
    res.json(usuario);
});
router.post('/', async (req, res)=>{
    let array = req.body;
    for (let i = 0; i < array.length; i++) {
        try {
            let {_id, id_Usuario, nickname, password, nombre, apellidoMaterno, apellidoPaterno, sucursal, telefono, comision, seguridad, activo, tipoDescuento, descuentos, prefijoFolio, noFolio} = array[i];
            let usuario = new UsersNew({_id, id_Usuario, nickname, password, nombre, apellidoMaterno, apellidoPaterno, sucursal, telefono, comision, seguridad, activo, tipoDescuento, descuentos, prefijoFolio, noFolio});
            await usuario.save();
        } catch (error) {
            res.json(error);
        }
    }
    res.json({status: 'USUARIOS GUARDADOS!!!!!'});
    /*const {id_Usuario, nickname, password, nombre, apellidoMaterno, apellidoPaterno, sucursal, telefono, comision, seguridad, activo, tipoDescuento, prefijoFolio, noFolio} = req.body;
    const usuario= new Usuario({id_Usuario, nickname, password, nombre, apellidoMaterno, apellidoPaterno, sucursal, telefono, comision, seguridad, activo, tipoDescuento, prefijoFolio, noFolio});
    await usuario.save();
    res.json({status: 'USUARIO GUARDADO!!!!!'});*/
});
router.put('/:id', async (req, res) => {
    const {id_Usuario, nickname, password, nombre, apellidoMaterno, apellidoPaterno, sucursal, telefono, comision, seguridad, activo, tipoDescuento, prefijoFolio, noFolio} = req.body;
    const nuevoUsuario = {id_Usuario, nickname, password, nombre, apellidoMaterno, apellidoPaterno, sucursal, telefono, comision, seguridad, activo, tipoDescuento, prefijoFolio, noFolio};
    await Usuario.findByIdAndUpdate(req.params.id, nuevoUsuario);
    res.json({status:'USUARIO ACTUALIZADO!!!'});
});

router.delete('/', async (req, res) => {
    await UsersNew.remove();
    res.json({status:'USUARIOS ELIMINADOS!!!'});
});

router.delete('/:id', async (req, res) => {
    await Usuario.findByIdAndRemove(req.params.id);
    res.json({status:'USUARIO ELIMINADO!!!'});
})

module.exports = router;