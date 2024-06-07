const express = require('express'); //requerimiento de express
const router = express.Router();   // invocacion de la funcion router del modulo express
const Pago = require('../models/Pagos.js');


router.get('/', async (req, res) => {
    const pago = await Pago.find();
    res.json(pago);
});

router.get('/:id', async (req, res) =>{
    const pago = await Pago.findById(req.params.id);
    res.json(pago);
});

router.get('/:value/:field', async (req, res) =>{
    switch (req.params.field) {
        case 'id_Reservacion':
            try {
                const pago = await Pago.find({id_Reservacion: req.params.value});
                res.json(pago);
            } catch (error) {
                console.log(error);
            }
            break;
    
        default:
            break;
    }
});

router.post('/', async (req, res)=>{
    const {id_Reservacion, cantidad, fecha, statePagado, fechaPago, vendedor} = req.body;
    const pago= new Pago({id_Reservacion, cantidad, fecha, statePagado, fechaPago, vendedor});
    await pago.save();
    res.json({status: 'PAGO GUARDADO!!!!!'});
});

router.put('/:id', async (req, res) => {
    const {id_Reservacion, cantidad, fecha, statePagado, fechaPago, vendedor} = req.body;
    const nuevoPago = {id_Reservacion, cantidad, fecha, statePagado, fechaPago, vendedor};
    await Pago.findByIdAndUpdate(req.params.id, nuevoPago);
    res.json({status:'PAGO ACTUALIZADO!!!'});
});
router.delete('/:id', async (req, res) => {
    await Pago.findByIdAndRemove(req.params.id);
    res.json({status:'PAGO ELIMINADO!!!'});
});
module.exports = router;