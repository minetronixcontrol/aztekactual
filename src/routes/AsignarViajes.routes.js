const express = require('express'); //requerimiento de express
const router = express.Router();   // invocacion de la funcion router del modulo express
const Viaje = require('../models/AsignarViajes');
const Camion = require('../models/Camiones');
const Apartado = require('../models/Apartados');
const Origen = require('../models/OrigenesYdestinos');
const Tripulante = require('../models/Tripulantes');
const Usuario = require('../models/Usuarios');
const Rutas = require('../models/Rutas');
const Venta = require('../models/Ventas');
const Cliente = require('../models/Clientes');

function getGenero(array, asiento) {
    for (let i = 0; i < array.length; i++) {
        if(array[i].asiento == asiento){
            return array[i].genero || null
        }
    }
    return null;
}

function getApartado(array, asiento) {
    for (let i = 0; i < array.length; i++) {
        if(array[i].asiento == asiento){
            return true
        }
    }
    return false;
}

function getRuta(id, array) {
    for (let i = 0; i < array.length; i++) {
        if(array[i]._id == id){
            return array[i];
        }
    }
}

function getOrigenDestino(id, array){
    for (let i = 0; i < array.length; i++) {
        if(array[i]._id == id){
            return array[i];
        }
    }
}

function getTripulante(id, array){
    for (let i = 0; i < array.length; i++) {
        if(array[i]._id == id){
            return array[i];
        }
    }
    return {nombre: '', apellidoPaterno: '', apellidoMaterno: ''};
}

function getVendedor(array, asiento) {
    for (let i = 0; i < array.length; i++) {
        if(array[i].asiento == asiento){
            return array[i].vendedor
        }
    }
    return null;
}

router.get('/', async (req, res) => {
    const viaje = await Viaje.find();
    console.log(viaje);
    res.json(viaje);
});
router.get('/:id', async (req, res) =>{
    const viaje = await Viaje.findById(req.params.id);
    res.json(viaje);    
});

router.get('/:value/:field', async (req, res) =>{
    switch (req.params.field) {
        case 'fechaDelViaje':
            try{
                let respuesta = [];
                let fecha = req.params.value;
                let arrayFecha = fecha.split("-", 3);
                const viaje = await Viaje.find({activo: 'true', fecha: `${arrayFecha[2]}-${arrayFecha[1]}-${arrayFecha[0]}`});
                const rutas = await Rutas.find();
                const origenes = await Origen.find();
                const choferesYsobrecargos = await Tripulante.find();
                const auxiliares = await Usuario.find();
                for (let i = 0; i < viaje.length; i++) {
                    let idRuta = viaje[i].ruta;
                    let ruta = await getRuta(idRuta, rutas);
                    let origenRuta = await getOrigenDestino(ruta.origen, origenes);
                    let destinoRuta = await getOrigenDestino(ruta.destino, origenes);
                    let chofer_1 = await getTripulante(viaje[i].chofer_1, choferesYsobrecargos);
                    let chofer_2 = await getTripulante(viaje[i].chofer_2, choferesYsobrecargos);
                    let sobrecargo = await getTripulante(viaje[i].sobrecargo, choferesYsobrecargos);
                    let auxiliar = await getTripulante(viaje[i].auxiliar, auxiliares);
                    let creadoPor = await getTripulante(viaje[i].creadoPor, auxiliares);
                    let rutaTxt = '';
            
                    for (let j = 0; j < ruta.transbordos.length; j++) {
                        let r1 = await getOrigenDestino(ruta.transbordos[j], origenes);
                        rutaTxt += `${r1.nombre}, `;
                    }
            
                    respuesta.push({
                        _id: viaje[i]._id,
                        fecha: viaje[i].fecha,
                        idRuta: viaje[i].ruta,
                        ruta: `${origenRuta.nombre} - ${destinoRuta.nombre}`,
                        rutaTxt: rutaTxt,
                        capacidad: viaje[i].capacidad,
                        idOrigen: ruta.origen,
                        origen: origenRuta.nombre,
                        origenPais: origenRuta.pais,
                        idDestino: ruta.destino,
                        destino: destinoRuta.nombre,
                        idChofer1: viaje[i].chofer_1,
                        chofer_1: `${chofer_1.nombre} ${chofer_1.apellidoPaterno} ${chofer_1.apellidoMaterno}`,
                        idChofer2: viaje[i].chofer_2,
                        chofer_2: `${chofer_2.nombre} ${chofer_2.apellidoPaterno} ${chofer_2.apellidoMaterno}`,
                        idSobrecargo: viaje[i].sobrecargo,
                        sobrecargo: `${sobrecargo.nombre} ${sobrecargo.apellidoPaterno} ${sobrecargo.apellidoMaterno}`,
                        idAuxiliar: auxiliar._id,
                        auxiliar: `${auxiliar.nombre} ${auxiliar.apellidoPaterno} ${auxiliar.apellidoMaterno}`,
                        creadoPor: (`${creadoPor.nombre} ${creadoPor.apellidoPaterno} ${creadoPor.apellidoMaterno}`) || '',
                        numeroEconomico: viaje[i].numeroEconomico
                    }); 
                }
                
                res.json(respuesta);
            }catch(error){
                res.json(error);
            }
            break;
        case 'ultimosDiezViajesCreados':
            try{
                let respuesta = [];
                const viaje = await Viaje.find({activo: 'true'}).sort({ $natural: -1 }).limit(10);
                const rutas = await Rutas.find();
                const origenes = await Origen.find();
                const choferesYsobrecargos = await Tripulante.find();
                const auxiliares = await Usuario.find();
                for (let i = 0; i < viaje.length; i++) {
                    let idRuta = viaje[i].ruta;
                    let ruta = await getRuta(idRuta, rutas);
                    let origenRuta = await getOrigenDestino(ruta.origen, origenes);
                    let destinoRuta = await getOrigenDestino(ruta.destino, origenes);
                    let chofer_1 = await getTripulante(viaje[i].chofer_1, choferesYsobrecargos);
                    let chofer_2 = await getTripulante(viaje[i].chofer_2, choferesYsobrecargos);
                    let sobrecargo = await getTripulante(viaje[i].sobrecargo, choferesYsobrecargos);
                    let auxiliar = await getTripulante(viaje[i].auxiliar, auxiliares);
                    let creadoPor = await getTripulante(viaje[i].creadoPor, auxiliares);
                    let rutaTxt = '';
            
                    for (let j = 0; j < ruta.transbordos.length; j++) {
                        let r1 = await getOrigenDestino(ruta.transbordos[j], origenes);
                        rutaTxt += `${r1.nombre}, `;
                    }
            
                    respuesta.push({
                        _id: viaje[i]._id,
                        fecha: viaje[i].fecha,
                        idRuta: viaje[i].ruta,
                        ruta: `${origenRuta.nombre} - ${destinoRuta.nombre}`,
                        rutaTxt: rutaTxt,
                        capacidad: viaje[i].capacidad,
                        idOrigen: ruta.origen,
                        origen: origenRuta.nombre,
                        origenPais: origenRuta.pais,
                        idDestino: ruta.destino,
                        destino: destinoRuta.nombre,
                        idChofer1: viaje[i].chofer_1,
                        chofer_1: `${chofer_1.nombre} ${chofer_1.apellidoPaterno} ${chofer_1.apellidoMaterno}`,
                        idChofer2: viaje[i].chofer_2,
                        chofer_2: `${chofer_2.nombre} ${chofer_2.apellidoPaterno} ${chofer_2.apellidoMaterno}`,
                        idSobrecargo: viaje[i].sobrecargo,
                        sobrecargo: `${sobrecargo.nombre} ${sobrecargo.apellidoPaterno} ${sobrecargo.apellidoMaterno}`,
                        idAuxiliar: auxiliar._id,
                        auxiliar: `${auxiliar.nombre} ${auxiliar.apellidoPaterno} ${auxiliar.apellidoMaterno}`,
                        creadoPor: (`${creadoPor.nombre} ${creadoPor.apellidoPaterno} ${creadoPor.apellidoMaterno}`) || '',
                        numeroEconomico: viaje[i].numeroEconomico
                    }); 
                }
                
                res.json(respuesta);
            }catch(error){
                res.json(error);
            }
            break;
        case 'fecha':
            try {
                const viaje = await Viaje.find({fecha: req.params.value, activo: 'true'});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case 'asientosModificarReservacion':
            let respuesta = [];
            let viaje = await Viaje.findById(req.params.value);
            let apartados = await Apartado.find({idViaje: viaje._id});

            for (let i = 1; i < (parseInt(viaje.capacidad)+1); i++) {
                if(viaje[`asiento_${i}`] == 'false'){
                    respuesta.push({
                        value: i,
                        label: i
                    });
                }
            }

            res.json(respuesta);

            break;
        case 'fechaViajes':
            try {
                let respuesta = [];
                let viajes = await Viaje.find({fecha: req.params.value, activo: 'true'});
                for (let i = 0; i < viajes.length; i++) {
                    let ruta = await Rutas.findById(viajes[i].ruta);
                    let origen = await Origen.findById(ruta.origen);
                    let destino = await Origen.findById(ruta.destino);
                    let chofer_1 = await Tripulante.findById(viajes[i].chofer_1);
                    let chofer_2 = await Tripulante.findById(viajes[i].chofer_2);
                    let sobrecargo = await Tripulante.findById(viajes[i].sobrecargo);
                    let auxiliar = await Usuario.findById(viajes[i].auxiliar);
                    respuesta.push({
                        value: viajes[i]._id,
                        label: `No. Eco ${viajes[i].numeroEconomico} - Ruta: ${origen.nombre} - ${destino.nombre}`,
                        noEco: viajes[i].numeroEconomico,
                        fecha: viajes[i].fecha,
                        idConductor1: chofer_1._id,
                        conductor1: `${chofer_1.nombre} ${chofer_1.apellidoPaterno} ${chofer_1.apellidoMaterno}`,
                        conductor1Nombre: chofer_1.nombre,
                        conductor1ApellidoPaterno: chofer_1.apellidoPaterno,
                        conductor1ApellidoMaterno: chofer_1.apellidoMaterno,
                        idConductor2: chofer_2._id,
                        conductor2: `${chofer_2.nombre} ${chofer_2.apellidoPaterno} ${chofer_2.apellidoMaterno}`,
                        conductor2Nombre: chofer_2.nombre,
                        conductor2ApellidoPaterno: chofer_2.apellidoPaterno,
                        conductor2ApellidoMaterno: chofer_2.apellidoMaterno,
                        idSobrecargo: sobrecargo._id,
                        sobrecargo: `${sobrecargo.nombre} ${sobrecargo.apellidoPaterno} ${sobrecargo.apellidoMaterno}`,
                        sobrecargoNombre: sobrecargo.nombre,
                        sobrecargoApellidoPaterno: sobrecargo.apellidoPaterno,
                        sobrecargoApellidoMaterno: sobrecargo.apellidoMaterno,
                        idAuxiliar: auxiliar._id,
                        auxiliar: `${auxiliar.nombre} ${auxiliar.apellidoPaterno} ${auxiliar.apellidoMaterno}`,
                        auxiliarNombre: auxiliar.nombre,
                        auxiliarApellidoPaterno: auxiliar.apellidoPaterno,
                        auxiliarApellidoMaterno: auxiliar.apellidoMaterno,
                        capacidad: viajes[i].capacidad
                    })
                    
                }
                res.json(respuesta);
            } catch (error) {
                console.log(error);
            }
            break;
        case 'fechamayorque':
            try {
                let viajes = [];
                let anio = new Date();
                let an = anio.getFullYear();
                const viaje = await Viaje.find({ anio: { $gte: an}});
                console.log(viaje);
                for (const v in viaje) {
                    if(viaje[v].anio > an){
                        viajes.push(viaje[v]);
                    }else if(viaje[v].diaDelAnio > req.params.value){
                        viajes.push(viaje[v]);
                    }
                }
                res.json(viajes);
            }catch (error) {
                console.log(error);
            }
            break;
        case 'camiones':
            try {
                let viajes =  await Viaje.find({fecha: req.params.value, activo: 'true'}, {numeroEconomico: 1});

                res.json(viajes);
            } catch (error) {
                res.json(error);
            }
            break;
        case 'capacidadCamion':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {numeroEconomico: 1});
                const camion = await Camion.find({numeroEconomico: viaje[0].numeroEconomico}, {capacidad: 1});
                res.json(camion);
            }catch (error) {
                console.log(error);
            }
            break;
        case 'activo':
            try {
                const viaje = await Viaje.find({activo: req.params.value});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case 'configViajes':
            try {
                let respuesta = [];
                const viaje = await Viaje.find({activo: 'true'});
                const rutas = await Rutas.find();
                const origenes = await Origen.find();
                const choferesYsobrecargos = await Tripulante.find();
                const auxiliares = await Usuario.find();

                //res.json({viaje: viaje, rutas:rutas, origen:origen, destino:destino, chofer_1:chofer_1, chofer_2:chofer_2, sobrecargo:sobrecargo,auxiliar:auxiliar})

                for (let i = 0; i < viaje.length; i++) {
                    let idRuta = viaje[i].ruta;
                    let ruta = await getRuta(idRuta, rutas);
                    let origenRuta = await getOrigenDestino(ruta.origen, origenes);
                    let destinoRuta = await getOrigenDestino(ruta.destino, origenes);
                    let chofer_1 = await getTripulante(viaje[i].chofer_1, choferesYsobrecargos);
                    let chofer_2 = await getTripulante(viaje[i].chofer_2, choferesYsobrecargos);
                    let sobrecargo = await getTripulante(viaje[i].sobrecargo, choferesYsobrecargos);
                    let auxiliar = await getTripulante(viaje[i].auxiliar, auxiliares);
                    let creadoPor = await getTripulante(viaje[i].creadoPor, auxiliares);
                    let rutaTxt = '';

                    for (let j = 0; j < ruta.transbordos.length; j++) {
                        let r1 = await getOrigenDestino(ruta.transbordos[j], origenes);
                        rutaTxt += `${r1.nombre}, `;
                    }

                    respuesta.push({
                        _id: viaje[i]._id,
                        fecha: viaje[i].fecha,
                        idRuta: viaje[i].ruta,
                        ruta: `${origenRuta.nombre} - ${destinoRuta.nombre}`,
                        rutaTxt: rutaTxt,
                        capacidad: viaje[i].capacidad,
                        idOrigen: ruta.origen,
                        origen: origenRuta.nombre,
                        origenPais: origenRuta.pais,
                        idDestino: ruta.destino,
                        destino: destinoRuta.nombre,
                        idChofer1: viaje[i].chofer_1,
                        chofer_1: `${chofer_1.nombre} ${chofer_1.apellidoPaterno} ${chofer_1.apellidoMaterno}`,
                        idChofer2: viaje[i].chofer_2,
                        chofer_2: `${chofer_2.nombre} ${chofer_2.apellidoPaterno} ${chofer_2.apellidoMaterno}`,
                        idSobrecargo: viaje[i].sobrecargo,
                        sobrecargo: `${sobrecargo.nombre} ${sobrecargo.apellidoPaterno} ${sobrecargo.apellidoMaterno}`,
                        idAuxiliar: auxiliar._id,
                        auxiliar: `${auxiliar.nombre} ${auxiliar.apellidoPaterno} ${auxiliar.apellidoMaterno}`,
                        creadoPor: (`${creadoPor.nombre} ${creadoPor.apellidoPaterno} ${creadoPor.apellidoMaterno}`) || '',
                        numeroEconomico: viaje[i].numeroEconomico
                    }); 
                }
                
                res.json(respuesta);
            } catch (error) {
                res.json(error);
            }
            break;
        case 'options':
            try {
                let tripulantes = await Tripulante.find({activo: 'true'});
                let respuestaTripulantes = [];

                for (let i = 0; i < tripulantes.length; i++) {
                    respuestaTripulantes.push({
                        value: tripulantes[i]._id,
                        label: `${tripulantes[i].nombre} ${tripulantes[i].apellidoPaterno} ${tripulantes[i].apellidoMaterno}`
                    });
                }                

                let camiones = await Camion.find({activo: 'true'});
                let respuestaCamiones = [];

                for (let i = 0; i < camiones.length; i++) {
                    respuestaCamiones.push({
                        value: camiones[i].numeroEconomico,
                        label: camiones[i].numeroEconomico
                    });
                }

                let auxiliares = await Usuario.find({activo: 'true'});
                let respuestaAuxiliares = [];

                for (let i = 0; i < auxiliares.length; i++) {
                    respuestaAuxiliares.push({
                        value: auxiliares[i]._id,
                        label: `${auxiliares[i].nombre} ${auxiliares[i].apellidoPaterno} ${auxiliares[i].apellidoMaterno}`
                    });
                }

                let respuestaRutas = [];
                let transbordosTxt = '';                

                const ruta = await Rutas.find({activo: true});
                for (let i = 0; i < ruta.length; i++) {
                    let origen = await Origen.findById(ruta[i].origen);                    
                    let destino = await Origen.findById(ruta[i].destino);
                    let transbordosTxt = '';
                    for (let j = 0; j < ruta[i].transbordos.length; j++) {
                        let transbordo = await Origen.findById(ruta[i].transbordos[j]);
                        transbordosTxt += `${transbordo.nombre}, `;
                    }
                    respuestaRutas.push({
                        value: ruta[i]._id,
                        label: `${origen.nombre} - ${destino.nombre}`,
                        transbordos: transbordosTxt
                    });
                }

                res.json({respuestaTripulantes, respuestaCamiones, respuestaAuxiliares, respuestaRutas});
            } catch (error) {
                
            }
            break;
        case 'asientosVenta':
            try {
                let genero = [];
                let arrApartados = [];
                let viaje = await Viaje.findById(req.params.value);
                let apartados = await Apartado.find({idViaje: viaje._id});

                let ventas = await Venta.find({idVenta: viaje._id, activo: 'true'});
                for (let i = 0; i < ventas.length; i++) {
                    let cliente = await Cliente.findById(ventas[i].cliente);
                    genero.push({asiento: parseInt(ventas[i].numeroAsiento), genero: cliente.genero});
                }

                for (let i = 0; i < apartados.length; i++) {
                    let vendedor = await Usuario.findById(apartados[i].idVendedor);
                    arrApartados.push({
                        asiento: apartados[i].asiento,
                        vendedor: vendedor.nickname
                    })
                }

                let respuesta = {
                    asientos: {
                        asiento_1: {status: viaje.asiento_1, genero: getGenero(genero, 1), apartado: getApartado(arrApartados, 1), vendedor: getVendedor(arrApartados, 1)},
                        asiento_2: {status: viaje.asiento_2, genero: getGenero(genero, 2), apartado: getApartado(arrApartados, 2), vendedor: getVendedor(arrApartados, 2)},
                        asiento_3: {status: viaje.asiento_3, genero: getGenero(genero, 3), apartado: getApartado(arrApartados, 3), vendedor: getVendedor(arrApartados, 3)},
                        asiento_4: {status: viaje.asiento_4, genero: getGenero(genero, 4), apartado: getApartado(arrApartados, 4), vendedor: getVendedor(arrApartados, 4)},
                        asiento_5: {status: viaje.asiento_5, genero: getGenero(genero, 5), apartado: getApartado(arrApartados, 5), vendedor: getVendedor(arrApartados, 5)},
                        asiento_6: {status: viaje.asiento_6, genero: getGenero(genero, 6), apartado: getApartado(arrApartados, 6), vendedor: getVendedor(arrApartados, 6)},
                        asiento_7: {status: viaje.asiento_7, genero: getGenero(genero, 7), apartado: getApartado(arrApartados, 7), vendedor: getVendedor(arrApartados, 7)},
                        asiento_8: {status: viaje.asiento_8, genero: getGenero(genero, 8), apartado: getApartado(arrApartados, 8), vendedor: getVendedor(arrApartados, 8)},
                        asiento_9: {status: viaje.asiento_9, genero: getGenero(genero, 9), apartado: getApartado(arrApartados, 9), vendedor: getVendedor(arrApartados, 9)},
                        asiento_10: {status: viaje.asiento_10, genero: getGenero(genero, 10), apartado: getApartado(arrApartados, 10), vendedor: getVendedor(arrApartados, 10)},
                        asiento_11: {status: viaje.asiento_11, genero: getGenero(genero, 11), apartado: getApartado(arrApartados, 11), vendedor: getVendedor(arrApartados, 11)},
                        asiento_12: {status: viaje.asiento_12, genero: getGenero(genero, 12), apartado: getApartado(arrApartados, 12), vendedor: getVendedor(arrApartados, 12)},
                        asiento_13: {status: viaje.asiento_13, genero: getGenero(genero, 13), apartado: getApartado(arrApartados, 13), vendedor: getVendedor(arrApartados, 13)},
                        asiento_14: {status: viaje.asiento_14, genero: getGenero(genero, 14), apartado: getApartado(arrApartados, 14), vendedor: getVendedor(arrApartados, 14)},
                        asiento_15: {status: viaje.asiento_15, genero: getGenero(genero, 15), apartado: getApartado(arrApartados, 15), vendedor: getVendedor(arrApartados, 15)},
                        asiento_16: {status: viaje.asiento_16, genero: getGenero(genero, 16), apartado: getApartado(arrApartados, 16), vendedor: getVendedor(arrApartados, 16)},
                        asiento_17: {status: viaje.asiento_17, genero: getGenero(genero, 17), apartado: getApartado(arrApartados, 17), vendedor: getVendedor(arrApartados, 17)},
                        asiento_18: {status: viaje.asiento_18, genero: getGenero(genero, 18), apartado: getApartado(arrApartados, 18), vendedor: getVendedor(arrApartados, 18)},
                        asiento_19: {status: viaje.asiento_19, genero: getGenero(genero, 19), apartado: getApartado(arrApartados, 19), vendedor: getVendedor(arrApartados, 19)},
                        asiento_20: {status: viaje.asiento_20, genero: getGenero(genero, 20), apartado: getApartado(arrApartados, 20), vendedor: getVendedor(arrApartados, 20)},
                        asiento_21: {status: viaje.asiento_21, genero: getGenero(genero, 21), apartado: getApartado(arrApartados, 21), vendedor: getVendedor(arrApartados, 21)},
                        asiento_22: {status: viaje.asiento_22, genero: getGenero(genero, 22), apartado: getApartado(arrApartados, 22), vendedor: getVendedor(arrApartados, 22)},
                        asiento_23: {status: viaje.asiento_23, genero: getGenero(genero, 23), apartado: getApartado(arrApartados, 23), vendedor: getVendedor(arrApartados, 23)},
                        asiento_24: {status: viaje.asiento_24, genero: getGenero(genero, 24), apartado: getApartado(arrApartados, 24), vendedor: getVendedor(arrApartados, 24)},
                        asiento_25: {status: viaje.asiento_25, genero: getGenero(genero, 25), apartado: getApartado(arrApartados, 25), vendedor: getVendedor(arrApartados, 25)},
                        asiento_26: {status: viaje.asiento_26, genero: getGenero(genero, 26), apartado: getApartado(arrApartados, 26), vendedor: getVendedor(arrApartados, 26)},
                        asiento_27: {status: viaje.asiento_27, genero: getGenero(genero, 27), apartado: getApartado(arrApartados, 27), vendedor: getVendedor(arrApartados, 27)},
                        asiento_28: {status: viaje.asiento_28, genero: getGenero(genero, 28), apartado: getApartado(arrApartados, 28), vendedor: getVendedor(arrApartados, 28)},
                        asiento_29: {status: viaje.asiento_29, genero: getGenero(genero, 29), apartado: getApartado(arrApartados, 29), vendedor: getVendedor(arrApartados, 29)},
                        asiento_30: {status: viaje.asiento_30, genero: getGenero(genero, 30), apartado: getApartado(arrApartados, 30), vendedor: getVendedor(arrApartados, 30)},
                        asiento_31: {status: viaje.asiento_31, genero: getGenero(genero, 31), apartado: getApartado(arrApartados, 31), vendedor: getVendedor(arrApartados, 31)},
                        asiento_32: {status: viaje.asiento_32, genero: getGenero(genero, 32), apartado: getApartado(arrApartados, 32), vendedor: getVendedor(arrApartados, 32)},
                        asiento_33: {status: viaje.asiento_33, genero: getGenero(genero, 33), apartado: getApartado(arrApartados, 33), vendedor: getVendedor(arrApartados, 33)},
                        asiento_34: {status: viaje.asiento_34, genero: getGenero(genero, 34), apartado: getApartado(arrApartados, 34), vendedor: getVendedor(arrApartados, 34)},
                        asiento_35: {status: viaje.asiento_35, genero: getGenero(genero, 35), apartado: getApartado(arrApartados, 35), vendedor: getVendedor(arrApartados, 35)},
                        asiento_36: {status: viaje.asiento_36, genero: getGenero(genero, 36), apartado: getApartado(arrApartados, 36), vendedor: getVendedor(arrApartados, 36)},
                        asiento_37: {status: viaje.asiento_37, genero: getGenero(genero, 37), apartado: getApartado(arrApartados, 37), vendedor: getVendedor(arrApartados, 37)},
                        asiento_38: {status: viaje.asiento_38, genero: getGenero(genero, 38), apartado: getApartado(arrApartados, 38), vendedor: getVendedor(arrApartados, 38)},
                        asiento_39: {status: viaje.asiento_39, genero: getGenero(genero, 39), apartado: getApartado(arrApartados, 39), vendedor: getVendedor(arrApartados, 39)},
                        asiento_40: {status: viaje.asiento_40, genero: getGenero(genero, 40), apartado: getApartado(arrApartados, 40), vendedor: getVendedor(arrApartados, 40)},
                        asiento_41: {status: viaje.asiento_41, genero: getGenero(genero, 41), apartado: getApartado(arrApartados, 41), vendedor: getVendedor(arrApartados, 41)},
                        asiento_42: {status: viaje.asiento_42, genero: getGenero(genero, 42), apartado: getApartado(arrApartados, 42), vendedor: getVendedor(arrApartados, 42)},
                        asiento_43: {status: viaje.asiento_43, genero: getGenero(genero, 43), apartado: getApartado(arrApartados, 43), vendedor: getVendedor(arrApartados, 43)},
                        asiento_44: {status: viaje.asiento_44, genero: getGenero(genero, 44), apartado: getApartado(arrApartados, 44), vendedor: getVendedor(arrApartados, 44)},
                        asiento_45: {status: viaje.asiento_45, genero: getGenero(genero, 45), apartado: getApartado(arrApartados, 45), vendedor: getVendedor(arrApartados, 45)},
                        asiento_46: {status: viaje.asiento_46, genero: getGenero(genero, 46), apartado: getApartado(arrApartados, 46), vendedor: getVendedor(arrApartados, 46)},
                        asiento_47: {status: viaje.asiento_47, genero: getGenero(genero, 47), apartado: getApartado(arrApartados, 47), vendedor: getVendedor(arrApartados, 47)},
                        asiento_48: {status: viaje.asiento_48, genero: getGenero(genero, 48), apartado: getApartado(arrApartados, 48), vendedor: getVendedor(arrApartados, 48)},
                    },
                    capacidad: viaje.capacidad
                };
                res.json(respuesta);
            } catch (error) {
                res.json(error);
            }
            break;
        case '1':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_1: 1});
                res.json(viaje);
            } catch (error) {
                res.json({error: error});
                console.log(error);
            }
            break;
        case '2':
                try {
                    const viaje = await Viaje.find({_id: req.params.value}, {asiento_2: 1});
                    res.json(viaje);
                } catch (error) {
                    console.log(error);
                }
                break;
        case '3':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_3: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '4':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_4: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '5':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_5: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '6':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_6: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '7':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_7: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '8':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_8: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '9':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_9: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '10':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_10: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '11':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_11: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '12':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_12: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '13':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_13: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '14':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_14: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '15':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_15: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '16':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_16: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '17':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_17: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '18':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_18: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '19':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_19: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '20':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_20: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '21':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_21: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '22':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_22: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '23':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_23: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '24':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_24: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '25':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_25: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '26':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_26: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '27':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_27: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '28':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_28: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '29':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_29: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '30':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_30: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '31':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_31: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '32':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_32: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '33':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_33: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '34':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_34: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '35':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_35: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '36':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_36: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '37':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_37: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '38':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_38: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '39':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_39: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '40':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_40: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '41':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_41: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '42':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_42: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '43':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_43: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '44':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_44: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '45':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_45: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '46':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_46: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '47':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_47: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        case '48':
            try {
                const viaje = await Viaje.find({_id: req.params.value}, {asiento_48: 1});
                res.json(viaje);
            } catch (error) {
                console.log(error);
            }
            break;
        default:
            break;
    }
})

router.get('/:idOrigen/:idDestino/:fecha/', async (req, res) =>{
    try {
        let respuesta = [];
        let origen = await Origen.findById(req.params.idOrigen);
        let destino = await Origen.findById(req.params.idDestino);
        let corridas = await Viaje.find({fecha: req.params.fecha, activo: 'true'});
        for (let i = 0; i < corridas.length; i++) {
            let ruta = await Rutas.findById(corridas[i].ruta);
            let origenRuta = await Origen.findById(ruta.origen);
            let destinoRuta = await Origen.findById(ruta.destino);
            //Primero checamos los paises de origen y de destino, si son iguales, proseguimos con las evaluaciones
            if(origen.pais == origenRuta.pais){
                let transbordos = ruta.transbordos;
                let includesOrigen = false;
                let includesDestino = false;

                if(transbordos.includes(req.params.idOrigen) || (req.params.idOrigen == origenRuta._id)){
                    includesOrigen = true;
                }

                if(transbordos.includes(req.params.idDestino) || (req.params.idDestino == destinoRuta._id)){
                    includesDestino = true;
                }
                
                if(includesOrigen && includesDestino){
                    respuesta.push({
                        value: corridas[i]._id,
                        label: `No. Eco. ${corridas[i].numeroEconomico} Ruta: ${origenRuta.nombre} - ${destinoRuta.nombre}`,
                        dia: corridas[i].fecha,
                        numeroEconomico: corridas[i].numeroEconomico,
                        anio: corridas[i].anio,
                        diaDelAnio: corridas[i].diaDelAnio,
                    });
                }
            }
        }
        res.json(respuesta);
        //res.json({idOrigen: req.params.idOrigen, idDestino: req.params.idDestino, fecha: req.params.fecha});
    } catch (error) {
        res.json(error);
    }
});

router.post('/', async (req, res)=>{
    const {fecha,hora,anio,diaDelAnio,chofer_1,chofer_2,id_Viajes,sobrecargo, auxiliar, creadoPor, numeroEconomico, ruta, capacidad, activo,asiento_1,asiento_2,asiento_3,asiento_4,asiento_5,asiento_6,asiento_7,asiento_8,asiento_9,asiento_10,asiento_11,asiento_12,asiento_13,asiento_14,asiento_15,asiento_16,asiento_17,asiento_18,asiento_19,asiento_20,asiento_21,asiento_22,asiento_23,asiento_24,asiento_25,asiento_26,asiento_27,asiento_28,asiento_29,asiento_30,asiento_31,asiento_32,asiento_33,asiento_34,asiento_35,asiento_36,asiento_37,asiento_38,asiento_39,asiento_40,asiento_41,asiento_42,asiento_43,asiento_44,asiento_45,asiento_46,asiento_47,asiento_48} = req.body;
    const viaje= new Viaje({fecha,hora,anio,diaDelAnio,chofer_1,chofer_2,id_Viajes,sobrecargo, auxiliar, creadoPor, numeroEconomico, ruta, capacidad, activo,asiento_1,asiento_2,asiento_3,asiento_4,asiento_5,asiento_6,asiento_7,asiento_8,asiento_9,asiento_10,asiento_11,asiento_12,asiento_13,asiento_14,asiento_15,asiento_16,asiento_17,asiento_18,asiento_19,asiento_20,asiento_21,asiento_22,asiento_23,asiento_24,asiento_25,asiento_26,asiento_27,asiento_28,asiento_29,asiento_30,asiento_31,asiento_32,asiento_33,asiento_34,asiento_35,asiento_36,asiento_37,asiento_38,asiento_39,asiento_40,asiento_41,asiento_42,asiento_43,asiento_44,asiento_45,asiento_46,asiento_47,asiento_48});
    await viaje.save();
    res.json({status: 'VIAJE GUARDADO!!!!!'});
});
router.put('/:id/:asiento/:idUsuario/:otracosa', async (req, res) => { 
    switch (req.params.asiento) {
        case '1':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_1: 'false' },
                    { asiento_1 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }
            break;
        case '2':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_2: 'false' },
                    { asiento_2 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }
            break;
        case '3':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_3: 'false' },
                    { asiento_3 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }
        break;
        case '4':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_4: 'false' },
                    { asiento_4 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }
        break;
        case '5':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_5: 'false' },
                    { asiento_5 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }
            break;
        case '6':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_6: 'false' },
                    { asiento_6 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }
            break;
        case '7':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_7: 'false' },
                    { asiento_7 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }
            break;
        case '8':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_8: 'false' },
                    { asiento_8 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }  
            break;
        case '9':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_9: 'false' },
                    { asiento_9 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }  
            break;
        case '10':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_10: 'false' },
                    { asiento_10 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }  
            break;
        case '11':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_11: 'false' },
                    { asiento_11 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            } 
            break;
        case '12':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_12: 'false' },
                    { asiento_12 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }    
            break;
        case '13':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_13: 'false' },
                    { asiento_13 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }    
            break;
        case '14':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_14: 'false' },
                    { asiento_14 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }   
            break;
        case '15':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_15: 'false' },
                    { asiento_15 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }  
            break;
        case '16':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_16: 'false' },
                    { asiento_16 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }  
            break;
        case '17':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_17: 'false' },
                    { asiento_17 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }   
            break;
        case '18':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_18: 'false' },
                    { asiento_18 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            } 
            break;
        case '19':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_19: 'false' },
                    { asiento_19 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }   
            break;
        case '20':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_20: 'false' },
                    { asiento_20 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }    
            break;
        case '21':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_21: 'false' },
                    { asiento_21 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }   
            break;
        case '22':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_22: 'false' },
                    { asiento_22 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }   
            break;
        case '23':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_23: 'false' },
                    { asiento_23 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }    
            break;
        case '24':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_24: 'false' },
                    { asiento_24 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }   
            break;
        case '25':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_25: 'false' },
                    { asiento_25 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }   
            break;
        case '26':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_26: 'false' },
                    { asiento_26 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }    
                break;
        case '27':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_27: 'false' },
                    { asiento_27 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }    
            break;
        case '28':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_28: 'false' },
                    { asiento_28 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }    
            break;
        case '29':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_29: 'false' },
                    { asiento_29 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }   
            break;
        case '30':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_30: 'false' },
                    { asiento_30 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }   
            break;
        case '31':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_31: 'false' },
                    { asiento_31 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }   
            break;
        case '32':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_32: 'false' },
                    { asiento_32 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }    
            break;
        case '33':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_33: 'false' },
                    { asiento_33 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }    
            break;
        case '34':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_34: 'false' },
                    { asiento_34 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }   
            break;
        case '35':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_35: 'false' },
                    { asiento_35 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }   
            break;
        case '36':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_36: 'false' },
                    { asiento_36 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }  
            break;
        case '37':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_37: 'false' },
                    { asiento_37 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }   
            break;
        case '38':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_38: 'false' },
                    { asiento_38 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }   
            break;
        case '39':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_39: 'false' },
                    { asiento_39 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }   
            break;
        case '40':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_40: 'false' },
                    { asiento_40 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }    
            break;
        case '41':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_41: 'false' },
                    { asiento_41 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }  
            break;
        case '42':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_42: 'false' },
                    { asiento_42 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }   
            break;
        case '43':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_43: 'false' },
                    { asiento_43 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }   
            break;
        case '44':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_44: 'false' },
                    { asiento_44 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }   
            break;
        case '45':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_45: 'false' },
                    { asiento_45 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }   
            break;
        case '46':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_46: 'false' },
                    { asiento_46 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }   
            break;
        case '47':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_47: 'false' },
                    { asiento_47 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }   
            break;
        case '48':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_48: 'false' },
                    { asiento_48 : 'true' }
                );
                //res.json({status: update});
                if(update != null){
                    try {
                        const {idVendedor,idViaje,asiento,fechaCreacion} = req.body;
                        const apartado= new Apartado({idVendedor,idViaje,asiento,fechaCreacion});
                        await apartado.save();
                        res.json({status: 'ASIENTO APARTADO!!!!!', update});
                    } catch (error) {
                        res.json(error);
                    }
                }else{
                    res.json({status:'VIAJE ACTUALIZADO!!!', update});
                }
                //res.json({status:'VIAJE ACTUALIZADO!!!', update});
            } catch (error) {
                res.json(error);
            }   
            break;
        default:
            break;
    }    
});
router.put('/:id/:value/:field', async (req, res) => { //ASIENTO puede ser field
    switch (req.params.field) {
        case 'BorrarViaje':
            try {

                let ventas = await Venta.find({ idVenta: req.params.id, activo: 'true' });

                if(ventas.length > 0){
                    res.json({respuesta: false});
                }else{
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id },
                        { activo : 'false' }
                    );
                    res.json({respuesta: true});
                }

            } catch (error) {
                res.json(error);
            }
            break;
        case 'activo':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id },
                    { activo : req.params.value }
                );
                res.json({status:'VIAJE ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
            }
            break;
        case 'fecha':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id },
                    { fecha : req.params.value }
                );
                res.json({status:'VIAJE ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
            }
            break;
        case 'hora':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id },
                    { hora : req.params.value }
                );
                res.json({status:'VIAJE ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
            }
            break;
        case 'ruta':
            try {
                let ventas = await Venta.find({ idVenta: req.params.id, activo: 'true' });

                if(ventas.length > 0){
                    res.json({respuesta: false});
                }else{
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id },
                        { ruta : req.params.value }
                    );
                    res.json({respuesta: true});
                }
            } catch (error) {
                //console.log(error);
                res.json(error);
            }
            break;
        case 'capacidad':
            try {

                let viaje = await Viaje.findById(req.params.id, { capacidad: 1 });

                let capacidadActual = viaje.capacidad;
                
                if(req.params.value < capacidadActual){
                    let ventas = await Venta.find({idVenta: req.params.id});
                    for (let i = 0; i < ventas.length; i++) {
                        if(parseInt(ventas[i].numeroAsiento) > parseInt(req.params.value)){
                            res.json({respuesta: false});
                        }
                    }
                }
                
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id },
                    { capacidad : req.params.value }
                );
                res.json({respuesta: true});

            } catch (error) {
                console.log(error);
            }
            break;
        case 'chofer_1':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id },
                    { chofer_1 : req.params.value }
                );
                res.json({status:'VIAJE ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
            }
            break;
        case 'chofer_2':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id },
                    { chofer_2 : req.params.value }
                );
                res.json({status:'VIAJE ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
            }
            break;
        case 'sobrecargo':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id },
                    { sobrecargo : req.params.value }
                );
                res.json({status:'VIAJE ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
            }
            break;
        case 'auxiliar':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id },
                    { auxiliar : req.params.value }
                );
                res.json({status:'VIAJE ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
            }
            break;
        case 'numeroEconomico':
            try {
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id },
                    { numeroEconomico : req.params.value }
                );
                res.json({status:'VIAJE ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
            }
            break;
        case '1':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_1: 'false' },
                        { asiento_1 : 'true' }
                    );
                    const apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: req.params.field});
                    res.json({status: apartado});
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_1: 'true' },
                        { asiento_1 : 'false' }
                    );
                    res.json({status: update});
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '2':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_2: 'false' },
                    { asiento_2 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_2: 'true' },
                    { asiento_2 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '3':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_3: 'false' },
                    { asiento_3 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_3: 'true' },
                    { asiento_3 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '4':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_4: 'false' },
                    { asiento_4 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_4: 'true' },
                    { asiento_4 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '5':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_5: 'false' },
                    { asiento_5 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_5: 'true' },
                    { asiento_5 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '6':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_6: 'false' },
                    { asiento_6 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_6: 'true' },
                    { asiento_6 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '7':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_7: 'false' },
                    { asiento_7 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_7: 'true' },
                    { asiento_7 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '8':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_8: 'false' },
                    { asiento_8 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_8: 'true' },
                    { asiento_8 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '9':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_9: 'false' },
                    { asiento_9 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_9: 'true' },
                    { asiento_9 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '10':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_10: 'false' },
                    { asiento_10 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_10: 'true' },
                    { asiento_10 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '11':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_11: 'false' },
                    { asiento_11 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_11: 'true' },
                    { asiento_11 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '12':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_12: 'false' },
                    { asiento_12 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_12: 'true' },
                    { asiento_12 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '13':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_13: 'false' },
                    { asiento_13 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_13: 'true' },
                    { asiento_13 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '14':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_14: 'false' },
                    { asiento_14 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_14: 'true' },
                    { asiento_14 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '15':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_15: 'false' },
                    { asiento_15 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_15: 'true' },
                    { asiento_15 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '16':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_16: 'false' },
                    { asiento_16 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_16: 'true' },
                    { asiento_16 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '17':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_17: 'false' },
                    { asiento_17 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_17: 'true' },
                    { asiento_17 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '18':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_18: 'false' },
                    { asiento_18 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_18: 'true' },
                    { asiento_18 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '19':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_19: 'false' },
                    { asiento_19 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_19: 'true' },
                    { asiento_19 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '20':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_20: 'false' },
                    { asiento_20 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_20: 'true' },
                    { asiento_20 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '21':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_21: 'false' },
                    { asiento_21 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_21: 'true' },
                    { asiento_21 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '22':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_22: 'false' },
                    { asiento_22 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_22: 'true' },
                    { asiento_22 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '23':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_23: 'false' },
                    { asiento_23 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_23: 'true' },
                    { asiento_23 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '24':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_24: 'false' },
                    { asiento_24 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_24: 'true' },
                    { asiento_24 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '25':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_25: 'false' },
                    { asiento_25 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_25: 'true' },
                    { asiento_25 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '26':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_26: 'false' },
                    { asiento_26 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_26: 'true' },
                    { asiento_26 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '27':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_27: 'false' },
                    { asiento_27 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_27: 'true' },
                    { asiento_27 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '28':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_28: 'false' },
                    { asiento_28 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_28: 'true' },
                    { asiento_28 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '29':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_29: 'false' },
                    { asiento_29 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_29: 'true' },
                    { asiento_29 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '30':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_30: 'false' },
                    { asiento_30 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_30: 'true' },
                    { asiento_30 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '31':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_31: 'false' },
                    { asiento_31 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_31: 'true' },
                    { asiento_31 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '32':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_32: 'false' },
                    { asiento_32 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_32: 'true' },
                    { asiento_32 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '33':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_33: 'false' },
                    { asiento_33 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_33: 'true' },
                    { asiento_33 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '34':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_34: 'false' },
                    { asiento_34 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_34: 'true' },
                    { asiento_34 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '35':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_35: 'false' },
                    { asiento_35 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_35: 'true' },
                    { asiento_35 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '36':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_36: 'false' },
                    { asiento_36 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_36: 'true' },
                    { asiento_36 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '37':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_37: 'false' },
                    { asiento_37 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_37: 'true' },
                    { asiento_37 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '38':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_38: 'false' },
                    { asiento_38 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_38: 'true' },
                    { asiento_38 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '39':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_39: 'false' },
                    { asiento_39 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_39: 'true' },
                    { asiento_39 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '40':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_40: 'false' },
                    { asiento_40 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_40: 'true' },
                    { asiento_40 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '41':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_41: 'false' },
                    { asiento_41 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_41: 'true' },
                    { asiento_41 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '42':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_42: 'false' },
                    { asiento_42 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_42: 'true' },
                    { asiento_42 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '43':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_43: 'false' },
                    { asiento_43 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_43: 'true' },
                    { asiento_43 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '44':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_44: 'false' },
                    { asiento_44 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_44: 'true' },
                    { asiento_44 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '45':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_45: 'false' },
                    { asiento_45 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_45: 'true' },
                    { asiento_45 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '46':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_46: 'false' },
                    { asiento_46 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_46: 'true' },
                    { asiento_46 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '47':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_47: 'false' },
                    { asiento_47 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_47: 'true' },
                    { asiento_47 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        case '48':
            if(req.params.value == 'true'){
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_48: 'false' },
                    { asiento_48 : 'true' }
                );
                res.json({status: update});
            }else{
                let update = await Viaje.findOneAndUpdate(
                    { _id: req.params.id, asiento_48: 'true' },
                    { asiento_48 : 'false' }
                );
                res.json({status: update});
            }            
            break;
        

        default:
            break;
    }    
});
router.put('/:id/:value/:field/:idVendedor/:otracosa', async (req, res) => { //ASIENTO puede ser field
    switch (req.params.field) {
        case '1':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_1: 'false' },
                        { asiento_1 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "1"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_1: 'true' },
                        { asiento_1 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "1"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '2':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_2: 'false' },
                        { asiento_2 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "2"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_2: 'true' },
                        { asiento_2 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "2"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '3':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_3: 'false' },
                        { asiento_3 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "3"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_3: 'true' },
                        { asiento_3 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "3"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '4':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_4: 'false' },
                        { asiento_4 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "4"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_4: 'true' },
                        { asiento_4 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "4"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '5':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_5: 'false' },
                        { asiento_5 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "5"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_5: 'true' },
                        { asiento_5 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "5"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '6':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_6: 'false' },
                        { asiento_6 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "6"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_6: 'true' },
                        { asiento_6 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "6"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '7':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_7: 'false' },
                        { asiento_7 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "7"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_7: 'true' },
                        { asiento_7 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "7"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '8':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_8: 'false' },
                        { asiento_8 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "8"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_8: 'true' },
                        { asiento_8 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "8"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '9':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_9: 'false' },
                        { asiento_9 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "9"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_9: 'true' },
                        { asiento_9 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "9"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '10':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_10: 'false' },
                        { asiento_10 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "10"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_10: 'true' },
                        { asiento_10 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "10"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '11':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_11: 'false' },
                        { asiento_11 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "11"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_11: 'true' },
                        { asiento_11 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "11"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '12':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_12: 'false' },
                        { asiento_12 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "12"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_12: 'true' },
                        { asiento_12 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "12"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '13':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_13: 'false' },
                        { asiento_13 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "13"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_13: 'true' },
                        { asiento_13 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "13"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '14':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_14: 'false' },
                        { asiento_14 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "14"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_14: 'true' },
                        { asiento_14 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "14"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '15':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_15: 'false' },
                        { asiento_15 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "15"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_15: 'true' },
                        { asiento_15 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "15"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '16':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_16: 'false' },
                        { asiento_16 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "16"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_16: 'true' },
                        { asiento_16 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "16"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '17':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_17: 'false' },
                        { asiento_17 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "17"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_17: 'true' },
                        { asiento_17 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "17"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '18':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_18: 'false' },
                        { asiento_18 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "18"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_18: 'true' },
                        { asiento_18 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "18"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '19':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_19: 'false' },
                        { asiento_19 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "19"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_19: 'true' },
                        { asiento_19 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "19"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '20':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_20: 'false' },
                        { asiento_20 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "20"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_20: 'true' },
                        { asiento_20 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "20"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '21':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_21: 'false' },
                        { asiento_21 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "21"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_21: 'true' },
                        { asiento_21 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "21"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '22':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_22: 'false' },
                        { asiento_22 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "22"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_22: 'true' },
                        { asiento_22 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "22"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '23':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_23: 'false' },
                        { asiento_23 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "23"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_23: 'true' },
                        { asiento_23 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "23"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '24':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_24: 'false' },
                        { asiento_24 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "24"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_24: 'true' },
                        { asiento_24 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "24"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '25':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_25: 'false' },
                        { asiento_25 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "25"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_25: 'true' },
                        { asiento_25 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "25"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '26':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_26: 'false' },
                        { asiento_26 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "26"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_26: 'true' },
                        { asiento_26 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "26"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '27':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_27: 'false' },
                        { asiento_27 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "27"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_27: 'true' },
                        { asiento_27 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "27"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '28':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_28: 'false' },
                        { asiento_28 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "28"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_28: 'true' },
                        { asiento_28 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "28"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '29':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_29: 'false' },
                        { asiento_29 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "29"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_29: 'true' },
                        { asiento_29 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "29"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '30':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_30: 'false' },
                        { asiento_30 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "30"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_30: 'true' },
                        { asiento_30 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "30"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '31':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_31: 'false' },
                        { asiento_31 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "31"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_31: 'true' },
                        { asiento_31 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "31"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '32':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_32: 'false' },
                        { asiento_32 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "32"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_32: 'true' },
                        { asiento_32 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "32"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '33':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_33: 'false' },
                        { asiento_33 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "33"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_33: 'true' },
                        { asiento_33 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "33"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '34':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_34: 'false' },
                        { asiento_34 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "34"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_34: 'true' },
                        { asiento_34 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "34"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '35':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_35: 'false' },
                        { asiento_35 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "35"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_35: 'true' },
                        { asiento_35 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "35"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '36':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_36: 'false' },
                        { asiento_36 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "36"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_36: 'true' },
                        { asiento_36 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "36"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '37':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_37: 'false' },
                        { asiento_37 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "37"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_37: 'true' },
                        { asiento_37 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "37"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '38':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_38: 'false' },
                        { asiento_38 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "38"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_38: 'true' },
                        { asiento_38 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "38"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '39':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_39: 'false' },
                        { asiento_39 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "39"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_39: 'true' },
                        { asiento_39 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "39"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '40':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_40: 'false' },
                        { asiento_40 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "40"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_40: 'true' },
                        { asiento_40 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "40"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '41':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_41: 'false' },
                        { asiento_41 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "41"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_41: 'true' },
                        { asiento_41 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "41"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '42':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_42: 'false' },
                        { asiento_42 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "42"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_42: 'true' },
                        { asiento_42 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "42"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '43':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_43: 'false' },
                        { asiento_43 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "43"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_43: 'true' },
                        { asiento_43 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "43"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '44':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_44: 'false' },
                        { asiento_44 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "44"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_44: 'true' },
                        { asiento_44 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "44"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '45':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_45: 'false' },
                        { asiento_45 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "45"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_45: 'true' },
                        { asiento_45 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "45"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '46':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_46: 'false' },
                        { asiento_46 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "46"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_46: 'true' },
                        { asiento_46 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "46"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '47':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_47: 'false' },
                        { asiento_47 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "47"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_47: 'true' },
                        { asiento_47 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "47"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
        case '48':
            if(req.params.value == 'true'){
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_48: 'false' },
                        { asiento_48 : 'true' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "48"});
                    
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let update = await Viaje.findOneAndUpdate(
                        { _id: req.params.id, asiento_48: 'true' },
                        { asiento_48 : 'false' }
                    );
                    let apartado = await Apartado.find({idVendedor: req.params.idVendedor, idViaje: req.params.id, asiento: "48"});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                        res.json({status:'ASIENTO DESAPARTADO!!!'});
                    }
                    res.json(apartado);
                } catch (error) {
                    res.json(error);
                }
            }            
            break;
    
        default:
            break;
    }
});
router.put('/:id', async (req, res) => {
    const {fecha,hora,anio,diaDelAnio,chofer_1,chofer_2,id_Viajes,sobrecargo, auxiliar, numeroEconomico, ruta, capacidad, activo,asiento_1,asiento_2,asiento_3,asiento_4,asiento_5,asiento_6,asiento_7,asiento_8,asiento_9,asiento_10,asiento_11,asiento_12,asiento_13,asiento_14,asiento_15,asiento_16,asiento_17,asiento_18,asiento_19,asiento_20,asiento_21,asiento_22,asiento_23,asiento_24,asiento_25,asiento_26,asiento_27,asiento_28,asiento_29,asiento_30,asiento_31,asiento_32,asiento_33,asiento_34,asiento_35,asiento_36,asiento_37,asiento_38,asiento_39,asiento_40,asiento_41,asiento_42,asiento_43,asiento_44,asiento_45,asiento_46,asiento_47,asiento_48} = req.body;
    const nuevoViaje = {fecha,hora,anio,diaDelAnio,chofer_1,chofer_2,id_Viajes,sobrecargo, auxiliar, numeroEconomico, ruta, capacidad, activo,asiento_1,asiento_2,asiento_3,asiento_4,asiento_5,asiento_6,asiento_7,asiento_8,asiento_9,asiento_10,asiento_11,asiento_12,asiento_13,asiento_14,asiento_15,asiento_16,asiento_17,asiento_18,asiento_19,asiento_20,asiento_21,asiento_22,asiento_23,asiento_24,asiento_25,asiento_26,asiento_27,asiento_28,asiento_29,asiento_30,asiento_31,asiento_32,asiento_33,asiento_34,asiento_35,asiento_36,asiento_37,asiento_38,asiento_39,asiento_40,asiento_41,asiento_42,asiento_43,asiento_44,asiento_45,asiento_46,asiento_47,asiento_48};
    await Viaje.findByIdAndUpdate(req.params.id, nuevoViaje);
    res.json({status:'VIAJE ACTUALIZADO!!!'});
});

router.delete('/:id', async (req, res) => {
    await Viaje.findByIdAndRemove(req.params.id);
    res.json({status:'VIAJE ELIMINADO!!!'});
})
module.exports = router;