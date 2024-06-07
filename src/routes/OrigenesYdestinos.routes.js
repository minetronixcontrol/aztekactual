const express = require('express'); //requerimiento de express
const router = express.Router();   // invocacion de la funcion router del modulo express
const Origen = require('../models/OrigenesYdestinos');
const Tripulante = require('../models/Tripulantes');
const Usuario = require('../models/Usuarios');
const Rutas = require('../models/Rutas');
const Camion = require('../models/Camiones');

router.get('/', async (req, res) => {
    const origen = await Origen.find();
    console.log(origen);
    res.json(origen);
});
router.get('/:id', async (req, res) =>{
    const origen = await Origen.findById(req.params.id);
    res.json(origen);
})
router.get('/:value/:field', async (req, res) =>{
    switch (req.params.field) {
        case 'nombreCompleto':
            try {
                const origen = await Origen.find({activo: 'true'}, {nombre: 1});
                res.json(origen);
            } catch (error) {
                console.log(error);
            }
            break;
        case 'activo':
            try {
                const origen = await Origen.find({activo: req.params.value});
                res.json(origen);
            } catch (error) {
                console.log(error);
            }          
            break;
        case 'optModal':
            try {
                let respuesta = {
                    rutas: [],
                    tripulantes: [],
                    auxiliares: [],
                    noEconomicos: []
                };
                let rutas = await Rutas.find({activo: true});
                for (let i = 0; i < rutas.length; i++) {
                    let origen = await Origen.findById(rutas[i].origen);
                    let destino = await Origen.findById(rutas[i].destino);
                    respuesta.rutas.push({
                        value: rutas[i]._id,
                        label: `${origen.nombre} - ${destino.nombre}`
                    });
                }
                let tripulantes = await Tripulante.find({activo: 'true'});
                for (let i = 0; i < tripulantes.length; i++) {
                    respuesta.tripulantes.push({
                        value: tripulantes[i]._id,
                        label: `${tripulantes[i].nombre} ${tripulantes[i].apellidoPaterno} ${tripulantes[i].apellidoMaterno}`
                    });                    
                }
                let auxiliares = await Usuario.find({activo: 'true'});
                for (let i = 0; i < auxiliares.length; i++) {
                    respuesta.auxiliares.push({
                        value: auxiliares[i]._id,
                        label: `${auxiliares[i].nombre} ${auxiliares[i].apellidoPaterno} ${auxiliares[i].apellidoMaterno}`
                    });                    
                }
                let camiones = await Camion.find({ activo: 'true' });
                for (let i = 0; i < auxiliares.length; i++) {
                    respuesta.noEconomicos.push({
                        value: camiones[i]._id,
                        label: `${camiones[i].numeroEconomico}`
                    });                    
                }
                res.json(respuesta);
            } catch (error) {
                console.log(error);
            }          
            break;
    
        default:
            break;
    }
    
});
router.post('/', async (req, res)=>{
    const {nombre, municipio, direccion, estado, pais, horaDeCita, horaDeSalida, activo, idOrigenesYdestinos} = req.body;
    const origen= new Origen({nombre, municipio, direccion, estado, pais, horaDeCita, horaDeSalida, activo, idOrigenesYdestinos});
    await origen.save();
    res.json({status: 'ORIGEN GUARDADO!!!!!'});
});

router.put('/:id', async (req, res) => {
    const {nombre, municipio, direccion, estado, pais, horaDeCita, horaDeSalida, activo, idOrigenesYdestinos} = req.body;
    const nuevoOrigen = {nombre, municipio, direccion, estado, pais, horaDeCita, horaDeSalida, activo, idOrigenesYdestinos};
    await Origen.findByIdAndUpdate(req.params.id, nuevoOrigen);
    res.json({status:'ORIGEN ACTUALIZADO!!!'});
});

router.put('/:id/:value', async (req, res) => {
    switch (req.params.value) {
        case 'printOrigenesYdestinos':
            try {
                let respuesta = [];                
                let selectedRowKeys = req.body.selectedRowKeys;
                for (let i = 0; i < selectedRowKeys.length; i++) {
                    let origen = await Origen.findById(selectedRowKeys[i]);
                    respuesta.push(origen);
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

router.put('/:id/:value/:field', async (req, res) => {
    switch (req.params.field) {
        case 'nombre':
            try {
                await Origen.findOneAndUpdate(
                    { _id: req.params.id },
                    { nombre: req.params.value }
                );
                res.json({status:'ORIGEN ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
        case 'municipio':
            try {
                await Origen.findOneAndUpdate(
                    { _id: req.params.id },
                    { municipio: req.params.value }
                );
                res.json({status:'ORIGEN ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
        case 'direccion':
            try {
                await Origen.findOneAndUpdate(
                    { _id: req.params.id },
                    { direccion: req.params.value }
                );
                res.json({status:'ORIGEN ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
        case 'estado':
            try {
                await Origen.findOneAndUpdate(
                    { _id: req.params.id },
                    { estado: req.params.value }
                );
                res.json({status:'ORIGEN ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
        case 'pais':
            try {
                await Origen.findOneAndUpdate(
                    { _id: req.params.id },
                    { pais: req.params.value }
                );
                res.json({status:'ORIGEN ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
        case 'horaDeCita':
            try {
                await Origen.findOneAndUpdate(
                    { _id: req.params.id },
                    { horaDeCita: req.params.value }
                );
                res.json({status:'ORIGEN ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
        case 'horaDeSalida':
            try {
                await Origen.findOneAndUpdate(
                    { _id: req.params.id },
                    { horaDeSalida: req.params.value }
                );
                res.json({status:'ORIGEN ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
        case 'activo':
            try {
                await Origen.findOneAndUpdate(
                    { _id: req.params.id },
                    { activo: req.params.value }
                );
                res.json({status:'ORIGEN ACTUALIZADO!!!'});
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
    await Origen.findByIdAndRemove(req.params.id);
    res.json({status:'ORIGEN ELIMINADO!!!'});
})
module.exports = router;