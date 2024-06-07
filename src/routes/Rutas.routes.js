const express = require('express'); //requerimiento de express
const router = express.Router();   // invocacion de la funcion router del modulo express
const Rutas = require('../models/Rutas');
const Origen = require('../models/OrigenesYdestinos');

router.get('/', async (req, res) => {
    const rutas = await Rutas.find();
    res.json(rutas);
});
router.get('/:id', async (req, res) =>{
    const ruta = await Rutas.findById(req.params.id);
    res.json(ruta);
});
router.get('/:value/:field', async (req, res) =>{
    switch (req.params.field) {
        case 'origen':
            
            break;
        case 'destino':
        
            break;
        case 'transbordos':
        
            break;
        case 'activo':
            try {
                let respuesta = [];
                const ruta = await Rutas.find({activo: true});
                for (let i = 0; i < ruta.length; i++) {
                    let origen = await Origen.findById(ruta[i].origen);
                    
                    let destino = await Origen.findById(ruta[i].destino);
                    
                    let transbordos = [];
                    let transbordosTxt = '';
                    for (let j = 0; j < ruta[i].transbordos.length; j++) {
                        let transbordo = await Origen.findById(ruta[i].transbordos[j]);
                        
                        transbordosTxt += `${transbordo.nombre}, `;
                        
                        transbordos.push({
                            idTransbordo: ruta[i].transbordos[j],
                            transbordo: transbordo.nombre
                        });
                        //res.json(transbordos);
                    }
                    respuesta.push({
                        _id: ruta[i]._id,
                        idOrigen: ruta[i].origen,
                        origen: origen.nombre,
                        origenPais: origen.pais,
                        idDestino: ruta[i].destino,
                        destinoPais: destino.pais,
                        destino: destino.nombre,
                        transbordos : transbordos,
                        transbordosTxt: transbordosTxt
                    });
                }
                res.json(respuesta);
            } catch (error) {
                res.json(error);
            }
            break;
    
        default:
            break;
    }
});
router.post('/', async (req, res)=>{
    const {origen, destino, transbordos, activo}  = req.body;
    const ruta= new Rutas({origen, destino, transbordos, activo});
    await ruta.save();
    res.json({status: 'RUTA GUARDADO!!!!!'});
});
router.put('/:id', async (req, res) => {
    const {origen, destino, transbordos, activo} = req.body;
    const newRuta = {origen, destino, transbordos, activo};
    await Rutas.findByIdAndUpdate(req.params.id, newRuta);
    res.json({status:'RUTA ACTUALIZADO!!!'});
});
router.put('/:id/:value/:field', async (req, res) => {

    switch (req.params.field) {
        case 'activo':
            try {
                await Rutas.findOneAndUpdate(
                    { _id: req.params.id },
                    { activo: req.params.value }
                );
                res.json({status:'Ruta ACTUALIZADO!!!'});
            } catch (error) {
                res.json(error);
            }
            break;
    
        default:
            break;
    }
});

router.delete('/:id', async (req, res) => {
    await Rutas.findByIdAndRemove(req.params.id);
    res.json({status:'RUTA ELIMINADO!!!'});
})
module.exports = router;