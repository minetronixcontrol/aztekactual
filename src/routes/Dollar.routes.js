const express = require('express'); //requerimiento de express
const router = express.Router();   // invocacion de la funcion router del modulo express
const Dollar = require('../models/Dollar');

router.get('/', async (req, res) => {
    const dollar = await Dollar.find();
    console.log(dollar);
    res.json(dollar);
});
router.get('/:id', async (req, res) =>{
    const dollar = await Dollar.findById();
    res.json(dollar);
})
router.post('/', async (req, res)=>{
    const {precioDollar, fecha}  = req.body;
    const dollar= new Dollar({precioDollar, fecha});
    await dollar.save();
    res.json({status: 'PRECIO GUARDADO!!!!!'});
});
router.put('/:id', async (req, res) => {
    const {precioDollar, fecha} = req.body;
    const nuevoPrecio = {precioDollar, fecha};
    await Dollar.findByIdAndUpdate(req.params.id, nuevoPrecio);
    res.json({status:'PRECIO ACTUALIZADO!!!'});
});

router.delete('/:id', async (req, res) => {
    await Dollar.findByIdAndRemove(req.params.id);
    res.json({status:'PRECIO ELIMINADO!!!'});
})
module.exports = router;