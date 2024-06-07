const express = require('express'); //requerimiento de express
const router = express.Router();   // invocacion de la funcion router del modulo express
const ModificacionCorte = require('../models/ModificacionCorte.js');

router.get('/', async (req, res) => {
    const mcorte = await ModificacionCorte.find();
    res.json(mcorte);
});

router.get('/:id', async (req, res) =>{
    const mcorte = await ModificacionCorte.findById(req.params.id);
    res.json(mcorte);
});

router.get('/:idVendedor/:idViaje', async (req, res) =>{
    const mcorte = await ModificacionCorte.find({idVendedor: req.params.idVendedor, idViaje: req.params.idViaje});
    res.json(mcorte);
});

router.get('/:idVendedor/:idViaje/:asiento', async (req, res) =>{
    const mcorte = await ModificacionCorte.find({idVendedor: req.params.idVendedor, idViaje: req.params.idViaje, asiento: req.params.asiento});
    res.json(mcorte);
});

router.post('/', async (req, res)=>{
    const {idVenta,idUsuario} = req.body;
    const mcorte= new ModificacionCorte({idVenta,idUsuario});
    await mcorte.save();
    res.json({status: 'MODIFICACION DE CORTE ACTUALIZADA!!!!!'});
});

router.put('/:id', async (req, res) => {
    const {idVenta,idUsuario} = req.body;
    const mcorte = {idVenta,idUsuario};
    await ModificacionCorte.findByIdAndUpdate(req.params.id, mcorte);
    res.json({status:'ASIENTO ACTUALIZADO!!!'});
});

router.delete('/:id', async (req, res) => {
    await ModificacionCorte.findByIdAndRemove(req.params.id);
    res.json({status:'ASIENTO DESAPARTADO!!!'});
})
module.exports = router;