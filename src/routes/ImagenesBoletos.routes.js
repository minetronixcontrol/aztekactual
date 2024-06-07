const express = require('express'); //requerimiento de express
const router = express.Router();   // invocacion de la funcion router del modulo express
const ImagenesBoletos = require('../models/ImagenesBoletos');

router.get('/', async (req, res) => {
    const imagenBoleto = await ImagenesBoletos.find();
    console.log(imagenBoleto);
    res.json(imagenBoleto);
});
router.get('/:id', async (req, res) =>{
    const imagenBoleto = await ImagenesBoletos.find({type: req.params.id});
    res.json(imagenBoleto);
});
router.post('/', async (req, res)=>{
    const {imagen, type} = req.body;
    const imagenBoleto= new ImagenesBoletos({imagen, type});
    await imagenBoleto.save();
    res.json({status: 'IMAGEN GUARDADO!!!!!'});
});
router.put('/:id', async (req, res) => {
    const {imagen, type} = req.body;
    const imagenBoleto = {imagen, type};
    await ImagenesBoletos.findByIdAndUpdate(req.params.id, imagenBoleto);
    res.json({status:'ImagenesBoletos ACTUALIZADO!!!'});
});

router.put('/:type/:value/:field', async (req, res) => {
    switch (req.params.field) {
        case 'type':
            try {
                await ImagenesBoletos.findOneAndUpdate(
                    { type: req.params.type },
                    { imagen: req.params.value }
                );
                res.json({status:'IMAGEN ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
    }
});

router.delete('/:id', async (req, res) => {
    await ImagenesBoletos.findByIdAndRemove(req.params.id);
    res.json({status:'ImagenesBoletos ELIMINADO!!!'});
})
module.exports = router;
