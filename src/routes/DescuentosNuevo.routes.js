const express = require('express'); //requerimiento de express
const router = express.Router();   // invocacion de la funcion router del modulo express
const Descuento = require('../models/DescuentosNuevo');
const Usuario = require('../models/Usuarios');

router.get('/', async (req, res) => {
    const descuento = await Descuento.find();
    res.json(descuento);
});

router.get('/:id', async (req, res) =>{
    const descuento = await Descuento.findById(req.params.id);
    res.json(descuento);
});

router.get('/:value/:field', async (req, res) =>{
    switch (req.params.field) {
        case 'cortesia':
            try {
                let respuesta = false;
                const cortesia = await Descuento.find({nombre: 'Cortesía'}, {_id: 1});
                let idCortesia = cortesia[0]._id;
                let usuarioDescuentos = await Usuario.find({ nickname: req.params.value }, {descuentos: 1});
                let descuentos = usuarioDescuentos[0].descuentos;
                for (let i = 0; i < descuentos.length; i++) {
                    if(descuentos[i] == idCortesia){
                        res.json(true);
                    }
                }
                res.json(false);
            } catch (error) {
                res.json(error);
            }
            break;
        case 'activo':
            try {
                let respuesta = [];
                const descuento = await Descuento.find();
                for (let i = 0; i < descuento.length; i++) {
                    respuesta.push({
                        "_id": descuento[i]._id,
                        "nombre": descuento[i].nombre,
                        "dollarDesc": descuento[i].dollarDesc,
                        "detalle": (descuento[i].nombre == 'Pacoima')? `${descuento[i].detalle}US $${descuento[i].dollarDesc}`: descuento[i].detalle,
                        "activo": descuento[i].activo,
                        "fechaInicio": descuento[i].fechaInicio,
                        "fechaFinal": descuento[i].fechaFinal
                    });                  
                }
                res.json(respuesta);
            } catch (error) {
                console.log(error);
            }
            break;
        case 'viajeRedondo':
            try {
                const descuento = await Descuento.find({nombre: 'Viaje Redondo'});
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
    const {nombre,dollarDesc,detalle,activo} = req.body;
    const descuento= new Descuento({nombre,dollarDesc,detalle,activo});
    await descuento.save();
    res.json({status: 'DESCUENTO GUARDADO!!!!!'});
});
router.put('/:id', async (req, res) => {
    const {nombre,dollarDesc,detalle,activo} = req.body;
    const nuevoDescuento = {nombre,dollarDesc,detalle,activo};
    await Descuento.findByIdAndUpdate(req.params.id, nuevoDescuento);
    res.json({status:'DESCUENTO ACTUALIZADO!!!'});
})

router.put('/:id/:value/:field', async (req, res) => {
    switch (req.params.field) {
        case 'dollarDesc':
            try {
                await Descuento.findOneAndUpdate(
                    { _id: req.params.id },
                    { dollarDesc: req.params.value }
                );
                res.json({status:'DESCUENTO ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
        case 'fechas':
            try {
                let body = req.body;
                let nuevoDesc = {
                    nombre: body.nombreDescuento,
                    dollarDesc:  body.dollarDesc,
                    detalle: body.detalle,
                    fechaInicio: body.fechaInicial,
                    fechaFinal: body.fechaFinal,
                    activo: true
                }
                await Descuento.findByIdAndUpdate(req.params.id, nuevoDesc);
                res.json({status:'DESCUENTO ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
        case 'activo':
            try {                
                let descuento = await Descuento.findById(req.params.id);
                let newEstado = !descuento.activo;
                await Descuento.findOneAndUpdate(
                    { _id: req.params.id },
                    { activo: newEstado }
                );
                res.json({status:'DESCUENTO ACTUALIZADO!!!'});
            } catch (error) {
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
});

module.exports = router;