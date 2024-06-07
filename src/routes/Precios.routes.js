const express = require('express'); //requerimiento de express
const router = express.Router();   // invocacion de la funcion router del modulo express
const Precio = require('../models/Precios');
const Origen = require('../models/OrigenesYdestinos');
const Dollar = require('../models/Dollar');
const Descuento = require('../models/DescuentosNuevo');

router.get('/', async (req, res) => {
    const precio = await Precio.find();
    console.log(precio);
    res.json(precio);
});
router.get('/:id', async (req, res) =>{
    if(req.params.id == 'AllData'){
        let respuesta = [];
        let origen = '';
        let destino = '';
        let dollar = await Dollar.find();
        try {
            let p = await Precio.find();
            if(p.length > 0){
                for (let i = 0; i < p.length; i++) {
                    origen = await Origen.findById(p[i].origen);
                    destino = await Origen.findById(p[i].destino);
                    respuesta[i] = {
                        '_id': p[i]._id,
                        'idOrigen': p[i].origen,
                        'origen': origen.nombre,
                        'municipioOrigen': origen.municipio,
                        'estadoOrigen': origen.estado,
                        'idDestino': p[i].destino,
                        'destino': destino.nombre,
                        'municipioDestino': destino.municipio,
                        'estadoDestino': destino.estado,
                        'precio': p[i].costo,
                        'precioMX': parseInt(p[i].costo)*parseInt(dollar[0].precioDollar),
                        'HoraSalida': origen.horaDeSalida,
                        'direccionSalida': origen.direccion
                    }
                }
                res.json(respuesta);
            }else{
                res.json(respuesta);
            }
        } catch (error) {
            res.json(error);
        }
    }else{
        let precio = await Precio.findById();
        res.json(precio);
    }
})
router.get('/:origen/:destino', async (req, res) =>{ //Aqui tambien vamos a obtener el activo, origen=campo, destino=valor
    switch (req.params.origen) {
        case 'activo':
            try {
                let result = [];
                const precio = await Precio.find({ activo: req.params.destino });
                if(precio.length > 0){
                    for (const i in precio) {
                        let origen = await Origen.findById(precio[i].origen);
                        let destino = await Origen.findById(precio[i].destino);
                        result[i] = {
                            _id: precio[i]._id,
                            origenId: precio[i].origen,
                            origen: origen.nombre,
                            destinoId: precio[i].destino,
                            destino: destino.nombre,
                            costo: precio[i].costo
                        }
                    }
                    res.json(result);
                }else{
                    res.json(precio);
                }                
            } catch (error) {
                res.json(error);
                console.log(error);
            }
            break;
        case 'destinos':
            try {
                let respuesta = [];
                const destinos = await Precio.find({ origen: req.params.destino, activo: 'true' });
                for (let i = 0; i < destinos.length; i++) {
                    let destino = await Origen.findById(destinos[i].destino);
                    respuesta.push({
                        value: destino._id,
                        label: `${destino.nombre} - ${destino.municipio}`, 
                        estado: destino.estado,
                        municipio: destino.municipio,
                        pais: destino.pais,
                        direccion: destino.direccion,
                        hora: destino.horaDeCita
                    });
                }
                res.json(respuesta);
            } catch (error) {
                res.json(error);
            }
            break;
    
        default:
            const precio = await Precio.find({ origen: req.params.origen, destino: req.params.destino, activo: 'true' });
            res.json(precio);
            break;
    }    
})
router.get('/:idaOrigen/:idaDestino/:regresoOrigen/:regresoDestino/:noPasajeros/:exchange', async (req, res) =>{
    try {
        let precioIda = await Precio.find({ origen: req.params.idaOrigen, destino: req.params.idaDestino, activo: 'true' });
        let precioRegreso = await Precio.find({ origen: req.params.regresoOrigen, destino: req.params.regresoDestino, activo: 'true' });
        let descuento = await Descuento.find({nombre: 'Viaje Redondo', activo: 'true'});
        let noPasajeros = req.params.noPasajeros;
        let exchange = req.params.exchange;
        let dollar = await Dollar.find();
        let arrDescuento = [];
        let costoBoletoIda = precioIda[0].costo;
        let costoBoletoRegreso = precioRegreso[0].costo;

        let ventaIda = (exchange == 'US')? 
            parseFloat(precioIda[0].costo)*parseFloat(noPasajeros) 
            : 
            parseFloat(precioIda[0].costo)*parseFloat(noPasajeros)*parseFloat(dollar[0].precioDollar);

        let ventaRegreso = (exchange == 'US')?
            parseFloat(precioRegreso[0].costo)*parseFloat(noPasajeros) 
            : 
            parseFloat(precioRegreso[0].costo)*parseFloat(noPasajeros)*parseFloat(dollar[0].precioDollar);

        let subtotal = ventaIda+ventaRegreso;
        let descuentoNeto = 0;

        for (let i = 0; i < noPasajeros; i++) {
            descuentoNeto+=(exchange == 'US')? parseFloat(descuento[0].dollarDesc) : parseFloat(descuento[0].dollarDesc)*parseFloat(dollar[0].precioDollar);
            arrDescuento[i] = (exchange == 'US')? parseFloat(descuento[0].dollarDesc) : parseFloat(descuento[0].dollarDesc)*parseFloat(dollar[0].precioDollar);
        }

        let total = subtotal-descuentoNeto;

        res.json({ventaIda, ventaRegreso, subtotal, descuentoNeto, total, arrDescuento, costoBoletoIda, costoBoletoRegreso});
    } catch (error) {
        res.json(error);
    }
})
router.post('/', async (req, res)=>{
    const {origen, destino, costo, id_precio, activo} = req.body;
    const precio= new Precio({origen, destino, costo, id_precio, activo});
    await precio.save();
    res.json({status: 'PRECIO GUARDADO!!!!!'});
});
router.put('/:id', async (req, res) => {
    const {origen, destino, costo, id_precio, activo} = req.body;
    const nuevoPrecio = {origen, destino, costo, id_precio, activo};
    await Precio.findByIdAndUpdate(req.params.id, nuevoPrecio);
    res.json({status:'PRECIO ACTUALIZADO!!!'});
});

router.put('/:id/:value/:field', async (req, res) => {
    switch (req.params.field) {
        case 'costo':
            try {
                await Precio.findOneAndUpdate(
                    { _id: req.params.id },
                    { costo: req.params.value }
                );
                res.json({status:'PRECIO ACTUALIZADO!!!'});
            } catch (error) {
                res.json(error);
            }
            break;
        case 'activo':
            try {
                await Precio.findOneAndUpdate(
                    { _id: req.params.id },
                    { activo: req.params.value }
                );
                res.json({status:'PRECIO ACTUALIZADO!!!'});
            } catch (error) {
                res.json(error);
            }
            break;
    
        default:
            break;
    }
});

router.delete('/:id', async (req, res) => {
    await Precio.findByIdAndRemove(req.params.id);
    res.json({status:'PRECIO ELIMINADO!!!'});
})
module.exports = router;