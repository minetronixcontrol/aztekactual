const express = require('express'); //requerimiento de express
const router = express.Router();   // invocacion de la funcion router del modulo express
const Descuento = require('../models/Descuentos');

router.get('/', async (req, res) => {
    const descuento = await Descuento.find({activo: 'true'});
    res.json(descuento);
});
router.get('/:id', async (req, res) =>{
    const descuento = await Descuento.findById();
    res.json(descuento);
});
router.get('/:field/:value', async (req, res) =>{
    switch (req.params.field) {
        case 'activo':
            try {
                const descuento = await Descuento.find({activo: req.params.value});
                res.json(descuento);
            } catch (error) {
                console.log(error);
            }
            break;
    
        default:
            break;
    }    
});
router.post('/', async (req, res)=>{
    const {desc,dollarDesc,activo,id_Descuento,tipo} = req.body;
    const descuento= new Descuento({desc,dollarDesc,activo,id_Descuento,tipo});
    await descuento.save();
    res.json({status: 'DESCUENTO GUARDADO!!!!!'});
});
router.put('/:id', async (req, res) => {
    const {desc,dollarDesc,activo,id_Descuento,tipo} = req.body;
    const nuevoDescuento = {desc,dollarDesc,activo,id_Descuento,tipo};
    await Descuento.findByIdAndUpdate(req.params.id, nuevoDescuento);
    res.json({status:'DESCUENTO ACTUALIZADO!!!'});
});

router.put('/:id/:value/:field', async (req, res) => {
    switch (req.params.field) {
        case 'desc': 
            try {
                await Descuento.findOneAndUpdate(
                    { _id: req.params.id },
                    { desc: req.params.value }
                );
                res.json({status:'VIAJE ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
        case 'dollarDesc':
            try {
                await Descuento.findOneAndUpdate(
                    { _id: req.params.id },
                    { dollarDesc: req.params.value }
                );
                res.json({status:'VIAJE ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
        case 'activo':
            try {
                await Descuento.findOneAndUpdate(
                    { _id: req.params.id },
                    { activo: req.params.value }
                );
                res.json({status:'VIAJE ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
        case 'tipo':
            try {
                await Descuento.findOneAndUpdate(
                    { _id: req.params.id },
                    { tipo: req.params.value }
                );
                res.json({status:'VIAJE ACTUALIZADO!!!'});
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
    await Descuento.findByIdAndRemove(req.params.id);
    res.json({status:'DESCUENTO ELIMINADO!!!'});
})
module.exports = router;