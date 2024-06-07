const express = require('express'); //requerimiento de express
const router = express.Router();   // invocacion de la funcion router del modulo express
const Tripulante = require('../models/Tripulantes');

router.get('/', async (req, res) => {
    const tripulante = await Tripulante.find();
    res.json(tripulante);
});
router.get('/:id', async (req, res) =>{
    const tripulante = await Tripulante.findById(req.params.id);
    res.json(tripulante);
})
router.get('/:value/:field', async (req, res) =>{
    switch (req.params.field) {
        case 'activo':
            try {
                const tripulante = await Tripulante.find({activo: req.params.value});
                res.json(tripulante);
            } catch (error) {
                console.log(error);
            }
            break;
    
        default:
            break;
    }    
});

router.put('/:id/:value', async (req, res) => {
    switch (req.params.value) {
        case 'printTripulantes':
            try {
                let respuesta = [];                
                let selectedRowKeys = req.body.selectedRowKeys;
                for (let i = 0; i < selectedRowKeys.length; i++) {
                    let tripulante = await Tripulante.findById(selectedRowKeys[i]);
                    respuesta.push(tripulante);
                }
                res.json(respuesta);
            } catch (error) {
                res.json(error);
            }
            break;
    
        default:
            break;
    }
});

router.get('/:id/:value/:field', async (req, res) =>{
    switch (req.params.field) {
        case 'activo':
            try {
                const tripulante = await Tripulante.find(req.params.id);
                res.json(tripulante);
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
    
        default:
            break;
    }
})
router.post('/', async (req, res)=>{
    const {nombre, apellidoMaterno, apellidoPaterno, telefono, telefono2, tipo, activo, id_tripulante} = req.body;
    const tripulante= new Tripulante({nombre, apellidoMaterno, apellidoPaterno, telefono, telefono2, tipo, activo, id_tripulante});
    await tripulante.save();
    res.json({status: 'TRIPULANTE GUARDADO!!!!!'});
});
router.put('/:id', async (req, res) => {
    const {nombre, apellidoMaterno, apellidoPaterno, telefono, telefono2, tipo, activo, id_tripulante} = req.body;
    const nuevoTripulante = {nombre, apellidoMaterno, apellidoPaterno, telefono, telefono2, tipo, activo, id_tripulante};
    await Tripulante.findByIdAndUpdate(req.params.id, nuevoTripulante);
    res.json({status:'TRIPULANTE ACTUALIZADO!!!'});
});

router.put('/:id/:value/:field', async (req, res) => {
    switch (req.params.field) {
        case 'nombre':
            try {
                await Tripulante.findOneAndUpdate(
                    { _id: req.params.id },
                    { nombre: req.params.value }
                );
                res.json({status:'TRIPULANTE ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
        case 'apellidoPaterno':
            try {
                await Tripulante.findOneAndUpdate(
                    { _id: req.params.id },
                    { apellidoPaterno: req.params.value }
                );
                res.json({status:'TRIPULANTE ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
        case 'apellidoMaterno':
            try {
                await Tripulante.findOneAndUpdate(
                    { _id: req.params.id },
                    { apellidoMaterno: req.params.value }
                );
                res.json({status:'TRIPULANTE ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
        case 'telefono':
            try {
                await Tripulante.findOneAndUpdate(
                    { _id: req.params.id },
                    { telefono: req.params.value }
                );
                res.json({status:'TRIPULANTE ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
        case 'telefono2':
            try {
                await Tripulante.findOneAndUpdate(
                    { _id: req.params.id },
                    { telefono2: req.params.value }
                );
                res.json({status:'TRIPULANTE ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
        case 'tipo':
            try {
                await Tripulante.findOneAndUpdate(
                    { _id: req.params.id },
                    { tipo: req.params.value }
                );
                res.json({status:'TRIPULANTE ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
        case 'activo':
            try {
                await Tripulante.findOneAndUpdate(
                    { _id: req.params.id },
                    { activo: req.params.value }
                );
                res.json({status:'TRIPULANTE ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
    
        default:
            break;
    }
});

router.delete('/:id', async (req, res) => {
    await Tripulante.findByIdAndRemove(req.params.id);
    res.json({status:'TRIPULANTE ELIMINADO!!!'});
})
module.exports = router;

