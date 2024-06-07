const express = require('express'); //requerimiento de express
const router = express.Router();   // invocacion de la funcion router del modulo express
const NotasListaDeAbordaje = require('../models/NotasListaDeAbordaje.js');

router.get('/', async (req, res) => {
    const notas = await NotasListaDeAbordaje.find();
    res.json(notas);
});
router.get('/:id', async (req, res) =>{
    const notas = await NotasListaDeAbordaje.findById(req.params.id);
    res.json(notas);
});
router.get('/:field/:value', async (req, res) =>{
    switch (req.params.field) {
        case 'idViaje':
            try {
                let notas = await NotasListaDeAbordaje.find({idViaje: req.params.value});
                res.json(notas);
            } catch (error) {
                res.json(error);
            }
            break;
    
        default:
            break;
    }
    const notas = await NotasListaDeAbordaje.findById(req.params.id);
    res.json(notas);
});
router.post('/', async (req, res)=>{
    const {idViaje, sobres, totalBoletos, sobresPorCobrar, entregadosPor, Notas}  = req.body;
    const notas= new NotasListaDeAbordaje({idViaje, sobres, totalBoletos, sobresPorCobrar, entregadosPor, Notas});
    await notas.save();
    res.json({status: 'NOTAS GUARDADO!!!!!'});
});
router.put('/:id', async (req, res) => {
    let notas;
    let id = req.params.id;
    const {idViaje, sobres, totalBoletos, sobresPorCobrar, entregadosPor, Notas}  = req.body;
    let notasViaje = await NotasListaDeAbordaje.find({idViaje: id});
    if(notasViaje.length > 0){ // guardamos
        await NotasListaDeAbordaje.findByIdAndUpdate(notasViaje[0]._id, {idViaje, sobres, totalBoletos, sobresPorCobrar, entregadosPor, Notas});
        res.json({status:'NOTAS ACTUALIZADO!!!'});
    }else{ // actualizamos
        notas= new NotasListaDeAbordaje({idViaje, sobres, totalBoletos, sobresPorCobrar, entregadosPor, Notas});
        await notas.save();
        res.json({status: 'NOTAS GUARDADO!!!!!'});
    }
});

router.delete('/:id', async (req, res) => {
    await NotasListaDeAbordaje.findByIdAndRemove(req.params.id);
    res.json({status:'NOTAS ELIMINADO!!!'});
})
module.exports = router;