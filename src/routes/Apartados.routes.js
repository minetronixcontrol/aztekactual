const express = require('express'); //requerimiento de express
const router = express.Router();   // invocacion de la funcion router del modulo express
const Apartado = require('../models/Apartados');

router.get('/', async (req, res) => {
    const apartado = await Apartado.find();
    console.log(apartado);
    res.json(apartado);
});

router.get('/:id', async (req, res) =>{
    const apartado = await Apartado.findById(req.params.id);
    res.json(apartado);
});

router.get('/:idVendedor/:idViaje', async (req, res) =>{
    const apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.idViaje});
    res.json(apartado);
});

router.get('/:idVendedor/:idViaje/:asiento', async (req, res) =>{
    const apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.idViaje, asiento: req.params.asiento});
    res.json(apartado);
});

router.post('/', async (req, res)=>{
    const {idVendedor,idViaje,asientos,fechaCreacion} = req.body;
    const apartado= new Apartado({idVendedor,idViaje,asientos,fechaCreacion});
    await apartado.save();
    res.json({status: 'ASIENTO APARTADO!!!!!'});
});

router.put('/:id', async (req, res) => {
    const {idVendedor,idViaje,asientos,fechaCreacion} = req.body;
    const apartado = {idVendedor,idViaje,asientos,fechaCreacion};
    await Apartado.findByIdAndUpdate(req.params.id, apartado);
    res.json({status:'ASIENTO ACTUALIZADO!!!'});
});

router.delete('/:id', async (req, res) => {
    await Apartado.findByIdAndRemove(req.params.id);
    res.json({status:'ASIENTO DESAPARTADO!!!'});
})
module.exports = router;