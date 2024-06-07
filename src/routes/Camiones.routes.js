const express = require('express'); //requerimiento de express
const router = express.Router();   // invocacion de la funcion router del modulo express
const Camion = require('../models/Camiones');

router.get('/', async (req, res) => {
    const camion = await Camion.find();
    console.log(camion);
    res.json(camion);
});
router.get('/:id', async (req, res) =>{
    const camion = await Camion.find({ id_Camion: req.params.id });
    res.json(camion);
});
router.get('/:value/:field', async (req, res) =>{
    switch (req.params.field) {
        case 'no':
            try {
                const camion = await Camion.find({ numeroEconomico: req.params.value });
                res.json(camion);
            } catch (error) {
                console.log(error);
            }
            break;
        case 'activo':
            try {
                const camion = await Camion.find({ activo: req.params.value });
                res.json(camion);
            } catch (error) {
                console.log(error);
            }
            break;
    
        default:
            break;
    }
});
router.post('/', async (req, res)=>{
    const {placas,marca,modelo,numeroEconomico,capacidad,activo,id_Camion} = req.body;
    const camion= new Camion({placas,marca,modelo,numeroEconomico,capacidad,activo,id_Camion});
    await camion.save();
    res.json({status: 'CAMION GUARDADO!!!!!'});
});
router.put('/:id', async (req, res) => {
    const {placas,marca,modelo,numeroEconomico,capacidad,activo,id_Camion} = req.body;
    const nuevoCamion = {placas,marca,modelo,numeroEconomico,capacidad,activo,id_Camion};
    await Camion.findByIdAndUpdate(req.params.id, nuevoCamion);
    res.json({status:'CAMION ACTUALIZADO!!!'});
});

router.put('/:id/:value', async (req, res) => {
    switch (req.params.value) {
        case 'printCamiones':
            try {
                let respuesta = [];                
                let selectedRowKeys = req.body.selectedRowKeys;
                for (let i = 0; i < selectedRowKeys.length; i++) {
                    let camion = await Camion.findById(selectedRowKeys[i]);
                    respuesta.push(camion);
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

router.put('/:id/:value/:field', async (req, res) => {
    switch (req.params.field) {
        case 'placas':
            try {
                await Camion.findOneAndUpdate(
                    { _id: req.params.id },
                    { placas: req.params.value }
                );
                res.json({status:'CAMION ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
        case 'marca':
            try {
                await Camion.findOneAndUpdate(
                    { _id: req.params.id },
                    { marca: req.params.value }
                );
                res.json({status:'CAMION ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
        case 'modelo':
            try {
                await Camion.findOneAndUpdate(
                    { _id: req.params.id },
                    { modelo: req.params.value }
                );
                res.json({status:'CAMION ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
        case 'numeroEconomico':
            try {
                await Camion.findOneAndUpdate(
                    { _id: req.params.id },
                    { numeroEconomico: req.params.value }
                );
                res.json({status:'CAMION ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
        case 'capacidad':
            try {
                await Camion.findOneAndUpdate(
                    { _id: req.params.id },
                    { capacidad: req.params.value }
                );
                res.json({status:'CAMION ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
        case 'activo':
            try {
                await Camion.findOneAndUpdate(
                    { _id: req.params.id },
                    { activo: req.params.value }
                );
                res.json({status:'CAMION ACTUALIZADO!!!'});
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
    await Camion.findByIdAndRemove(req.params.id);
    res.json({status:'CAMION ELIMINADO!!!'});
})
module.exports = router;