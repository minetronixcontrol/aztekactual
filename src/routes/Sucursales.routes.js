const express = require('express'); //requerimiento de express
const router = express.Router();   // invocacion de la funcion router del modulo express
const Sucursal = require('../models/Sucursales');

router.get('/', async (req, res) => {
    const sucursal = await Sucursal.find();
    console.log(sucursal);
    res.json(sucursal);
});
router.get('/:id', async (req, res) =>{
    const sucursal = await Sucursal.findById(req.params.id);
    console.log(sucursal);
    res.json(sucursal);
})
router.get('/:id/:tipo', async (req, res) =>{ //id -> pais; tipo ->  matriz o sucursal
    switch (req.params.tipo) {
        case 'activo':
            try {
                const sucursal = await Sucursal.find({activo: req.params.id});
                res.json(sucursal);
            } catch (error) {
                console.log(error);
            }
            break;
    
        default:
            try {
                const sucursal = await Sucursal.find({pais: req.params.id, tipo: req.params.tipo});
                res.json(sucursal);
            } catch (error) {
                console.log(error);
            }
            break;
    }
});

router.get('/:all/:activo/:value', async (req, res) =>{
    const sucursal = await Sucursal.find({activo: req.params.value});
    res.json(sucursal);
});

router.get('/:field/:valueField/:activo/:valueActivo', async (req, res) =>{
    switch (req.params.field) {
        case 'nombre':
            const sucursal = await Sucursal.find({nombre: req.params.valueField, activo: req.params.valueActivo});
            res.json(sucursal);
            break;
    
        default:
            break;
    }    
});

router.post('/', async (req, res)=>{
    const {nombre, direccion, ciudad, estado, pais, telefono_1, telefono_2, tipo, correo, activo} = req.body;
    const sucursal= new Sucursal({nombre, direccion, ciudad, estado, pais, telefono_1, telefono_2, tipo, correo, activo});
    await sucursal.save();
    res.json({status: 'SUCURSAL GUARDADO!!!!!'});
});
router.put('/:id', async (req, res) => {
    const {nombre, direccion, ciudad, estado, pais, telefono_1, telefono_2, tipo, correo, activo} = req.body;
    const nuevoSucursal = {nombre, direccion, ciudad, estado, pais, telefono_1, telefono_2, tipo, correo, activo};
    await Sucursal.findByIdAndUpdate(req.params.id, nuevoSucursal);
    res.json({status:'SUCURSAL ACTUALIZADO!!!'});
});

router.put('/:id/:newValue/:cellName', async (req, res) => {
    switch (req.params.cellName) {
        case 'nombre':
            try {
                await Sucursal.findOneAndUpdate(
                    { _id: req.params.id},
                    { nombre: req.params.newValue }
                );
            } catch (error) {
                console.log(error);
            }
            break;
        case 'direccion':
            try {
                await Sucursal.findOneAndUpdate(
                    { _id: req.params.id},
                    { direccion: req.params.newValue }
                );
            } catch (error) {
                console.log(error);
            }
            break;
        case 'ciudad':
            try {
                await Sucursal.findOneAndUpdate(
                    { _id: req.params.id},
                    { ciudad: req.params.newValue }
                );
            } catch (error) {
                console.log(error);
            }
            break;
        case 'estado':
            try {
                await Sucursal.findOneAndUpdate(
                    { _id: req.params.id},
                    { estado: req.params.newValue }
                );
            } catch (error) {
                console.log(error);
            }
            break;
        case 'pais':
            try {
                await Sucursal.findOneAndUpdate(
                    { _id: req.params.id},
                    { pais: req.params.newValue }
                );
            } catch (error) {
                console.log(error);
            }
            break;
        case 'telefono_1':
            try {
                await Sucursal.findOneAndUpdate(
                    { _id: req.params.id},
                    { telefono_1: req.params.newValue }
                );
            } catch (error) {
                console.log(error);
            }
            break;
        case 'telefono_2':
            try {
                await Sucursal.findOneAndUpdate(
                    { _id: req.params.id},
                    { telefono_2: req.params.newValue }
                );
            } catch (error) {
                console.log(error);
            }
            break;
        case 'tipo':
            try {
                await Sucursal.findOneAndUpdate(
                    { _id: req.params.id},
                    { tipo: req.params.newValue }
                );
            } catch (error) {
                console.log(error);
            }
            break;
        case 'correo':
            try {
                await Sucursal.findOneAndUpdate(
                    { _id: req.params.id},
                    { correo: req.params.newValue }
                );
            } catch (error) {
                console.log(error);
            }
            break;
        case 'activo':
            try {
                await Sucursal.findOneAndUpdate(
                    { _id: req.params.id},
                    { activo: req.params.newValue }
                );
            } catch (error) {
                console.log(error);
            }
            break;
    
        default:
            break;
    }
});

router.delete('/:id', async (req, res) => {
    await Sucursal.findByIdAndRemove(req.params.id);
    res.json({status:'SUCURSAL ELIMINADO!!!'});
})
module.exports = router;