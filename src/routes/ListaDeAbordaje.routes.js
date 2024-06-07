const express = require('express'); //requerimiento de express
const router = express.Router();   // invocacion de la funcion router del modulo express

const Abordaje = require('../models/ListaDeAbordaje.js');
const Venta = require('../models/Ventas');
const Reservacion = require('../models/Reservaciones');


router.get('/', async (req, res) => {
    const abordaje = await Abordaje.find();
    res.json(abordaje);
});

router.get('/:id', async (req, res) =>{
    const abordaje = await Abordaje.findById(req.params.id);
    res.json(abordaje);
});

router.get('/:value/:field', async (req, res) =>{
    switch (req.params.field) {
        case 'idViaje':
            try {
                const abordaje = await Abordaje.find({idViaje: req.params.value});
                res.json(abordaje);
            } catch (error) {
                console.log(error);
            }
            break;
    
        default:
            break;
    }
});

router.post('/', async (req, res)=>{
    const {idViaje, asiento, estado} = req.body;
    const abordaje= new Abordaje({idViaje, asiento, estado});
    await abordaje.save();
    res.json({status: 'abordaje GUARDADO!!!!!'});
});

router.put('/:id', async (req, res) => {
    const {idViaje, asiento, estado} = req.body;
    const nuevoAbordaje = {idViaje, asiento, estado};
    await Abordaje.findByIdAndUpdate(req.params.id, nuevoAbordaje);
    res.json({status:'abordaje ACTUALIZADO!!!'});
});


// id de viaje // no de asiento // (PorAbordar|Foraneo|Local) // (venta|reservacion) // id de venta
router.put('/:idViaje/:asiento/:value/:asignacion/:id', async (req, res) => {
    let idViaje = req.params.idViaje;
    let asiento = req.params.asiento;
    let value = req.params.value;
    let asignacion = req.params.asignacion;
    let id = req.params.id;

    //res.json({idViaje, asiento, value, asignacion, id});

    try {
        let abordaje = await Abordaje.find({idViaje: idViaje, asiento: asiento});
        if(abordaje.length > 0){ //Si ya existe, procedemos a cambiar el value del estado
            await Abordaje.findOneAndUpdate(
                { _id: abordaje[0]._id },
                { estado : value }
            );
            if(value != 'null'){
                if (asignacion == 'reservacion') {
                    await Reservacion.findOneAndUpdate(
                        { _id: id},
                        { viajado : 'true' }
                    );
                }else{
                    await Venta.findOneAndUpdate(
                        { _id: id},
                        { viajado : 'true' }
                    );
                }                
            }else{
                if(asignacion == 'reservacion') {
                    await Reservacion.findOneAndUpdate(
                        { _id: id},
                        { viajado : 'false' }
                    );
                }else{
                    await Venta.findOneAndUpdate(
                        { _id: id},
                        { viajado : 'false' }
                    );   
                }                
            }
        }else{// Si no existe, lo creamos
            const {idViaje, asiento, estado} = req.body;
            const newAbordaje = new Abordaje({idViaje, asiento, estado});
            await newAbordaje.save();
            if (asignacion == 'reservacion') {
                await Reservacion.findOneAndUpdate(
                    { _id: id },
                    { viajado : 'true' }
                );
            }else{
                await Venta.findOneAndUpdate(
                    { _id: id },
                    { viajado : 'true' }
                );
            }
            res.json({status: 'guardado'});
        }
    } catch (error) {
        res.json(error);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Abordaje.findByIdAndRemove(req.params.id);
        let updateViajado = await Venta.findOneAndUpdate(
            { _id: abordaje[0]._id },
            { viajado : 'false' }
        );
        updateViajado = await Reservacion.findOneAndUpdate(
            { _id: abordaje[0]._id },
            { viajado : 'false' }
        );
        res.json({status:'abordaje ELIMINADO!!!'});
    } catch (error) {
        res.json(error);
    }
});
module.exports = router;