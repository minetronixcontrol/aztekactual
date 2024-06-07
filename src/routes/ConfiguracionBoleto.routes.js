const express = require('express'); //requerimiento de express
const router = express.Router();   // invocacion de la funcion router del modulo express
const ConfiguracionBoleto = require('../models/ConfiguracionBoleto');

router.get('/', async (req, res) => {
    const configuracionBoleto = await ConfiguracionBoleto.find();
    console.log(configuracionBoleto);
    res.json(configuracionBoleto);
});
router.get('/:id', async (req, res) =>{
    const configuracionBoleto = await ConfiguracionBoleto.findById(req.params.id);
    res.json(configuracionBoleto);
})
router.post('/', async (req, res)=>{
    const {politicas, informacionPermiso, frase, reservacion} = req.body;
    const configuracionBoleto= new ConfiguracionBoleto({politicas, informacionPermiso, frase, reservacion});
    await configuracionBoleto.save();
    res.json({status: 'CONFIGURACION DE BOLETO GUARDADO!!!!!'});
});
router.put('/:id', async (req, res) => {
    const {politicas, informacionPermiso, frase, reservacion} = req.body;
    const nuevoConfiguracionBoleto = {politicas, informacionPermiso, frase, reservacion};
    await ConfiguracionBoleto.findByIdAndUpdate(req.params.id, nuevoConfiguracionBoleto);
    res.json({status:'CONFIGURACION DE BOLETO ACTUALIZADO!!!'});
});
router.put('/:id', async (req, res) => {
    const {politicas, informacionPermiso, frase, reservacion} = req.body;
    const nuevoConfiguracionBoleto = {politicas, informacionPermiso, frase, reservacion};
    await ConfiguracionBoleto.findByIdAndUpdate(req.params.id, nuevoConfiguracionBoleto);
    res.json({status:'CONFIGURACION DE BOLETO ACTUALIZADO!!!'});
});

router.delete('/:id', async (req, res) => {
    await ConfiguracionBoleto.findByIdAndRemove(req.params.id);
    res.json({status:'CONFIGURACION DE BOLETO ELIMINADO!!!'});
})
module.exports = router;