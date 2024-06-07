const express = require('express'); //requerimiento de express
const router = express.Router();   // invocacion de la funcion router del modulo express
const Cancelaciones = require('../models/Cancelaciones');
const Venta = require('../models/Ventas');
const Reservacion = require('../models/Reservaciones');
const Usuario = require('../models/Usuarios');
const Cliente = require('../models/Clientes');
const Origen = require('../models/OrigenesYdestinos');
const Viaje = require('../models/AsignarViajes');

function getOrigenDestino(id, array){
    for (let i = 0; i < array.length; i++) {
        if(array[i]._id == id){
            return array[i];
        }
    }
}

function getVendedor(id, array){
    for (let i = 0; i < array.length; i++) {
        if(array[i]._id == id){
            return `${array[i].nombre} ${array[i].apellidoPaterno} ${array[i].apellidoMaterno}`;
        }
    }
}

router.get('/', async (req, res) => {
    const cancelaciones = await Cancelaciones.find();
    console.log(cancelaciones);
    res.json(cancelaciones);
});

router.get('/:id', async (req, res) => {
    const cancelaciones = await Cancelaciones.findById(req.params.id);
    console.log(cancelaciones);
    res.json(cancelaciones);
});

router.get('/:value/:field', async (req, res) => {
    switch (req.params.field) {
        case 'fechaViaje':
            try {
                let respuesta = [];
                let ventas = await Venta.find({activo: 'false', fecha: req.params.value});
                for (let i = 0; i < ventas.length; i++) {
                    let vendedor = await Usuario.findById(ventas[i].vendedor, {nombre: 1, apellidoPaterno: 1, apellidoMaterno: 1});
                    let cliente = await Cliente.findById(ventas[i].cliente, {nombre: 1, apellidoPaterno: 1, apellidoMaterno: 1});
                    let origen = await Origen.findById(ventas[i].origen, {nombre: 1});
                    let destino = await Origen.findById(ventas[i].destino, {nombre: 1});
                    let cancelacion = await Cancelaciones.find({idVenta: ventas[i]._id});
                   respuesta.push({
                    _id: ventas[i]._id,
                    folio: cancelacion[0].idCancelacion,
                    vendedorName: `${vendedor.nombre} ${vendedor.apellidoPaterno} ${vendedor.apellidoMaterno}`,
                    fechaCancelacion: ventas[i].fechaCancelacion,
                    clienteName: `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
                    motivo: cancelacion[0].motivo,
                    origen: origen.nombre,
                    destino: destino.nombre,
                    dia: ventas[i].fecha
                   });
                }
                res.json(respuesta);
            } catch (error) {
                res.json(error);
            }
            break;
        case 'fechaViajeReservaciones':
            try {
                let respuesta = [];
                let ventas = await Reservacion.find({activo: 'false', fecha: req.params.value});
                for (let i = 0; i < ventas.length; i++) {
                    let vendedor = await Usuario.findById(ventas[i].vendedor, {nombre: 1, apellidoPaterno: 1, apellidoMaterno: 1});
                    let cliente = await Cliente.findById(ventas[i].cliente, {nombre: 1, apellidoPaterno: 1, apellidoMaterno: 1});
                    let origen = await Origen.findById(ventas[i].origen, {nombre: 1});
                    let destino = await Origen.findById(ventas[i].destino, {nombre: 1});
                    let cancelacion = await Cancelaciones.find({idVenta: ventas[i]._id});
                    respuesta.push({
                        _id: ventas[i]._id,
                        folio: cancelacion[0].idCancelacion,
                        vendedorName: `${vendedor.nombre} ${vendedor.apellidoPaterno} ${vendedor.apellidoMaterno}`,
                        fechaCancelacion: ventas[i].fechaCancelacion,
                        clienteName: `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
                        motivo: cancelacion[0].motivo,
                        origen: origen.nombre,
                        destino: destino.nombre,
                        dia: ventas[i].fecha
                    });
                }
                res.json(respuesta);
            } catch (error) {
                res.json(error);
            }
            break;
        case 'cancelaciones':
            try {
                let respuesta = [];
                let cancelaciones = await Cancelaciones.find();
                for (let i = 0; i < cancelaciones.length; i++) {
                    let venta = await Venta.findById(cancelaciones[i].idVenta);
                    let vendedor = await Usuario.findById(venta.vendedor, {nombre: 1, apellidoPaterno: 1, apellidoMaterno: 1});
                    let cliente = await Cliente.findById(venta.cliente, {nombre: 1, apellidoPaterno: 1, apellidoMaterno: 1});
                    let origen = await Origen.findById(venta.origen, {nombre: 1});
                    let destino = await Origen.findById(venta.destino, {nombre: 1});
                    let viaje = await Viaje.findById(venta.idVenta, {fecha: 1});
                   respuesta.push({
                    _id: cancelaciones[i]._id,
                    folio: cancelaciones[i].idCancelacion,
                    vendedorName: `${vendedor.nombre} ${vendedor.apellidoPaterno} ${vendedor.apellidoMaterno}`,
                    fechaVenta: venta.fecha,
                    fechaCancelacion: venta.fechaCancelacion,
                    clienteName: `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
                    motivo: cancelaciones[i].motivo,
                    origen: origen.nombre,
                    destino: destino.nombre,
                    dia: viaje.fecha
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

router.get('/:value/:field/:no', async (req, res) => { 
    switch (req.params.field) {
        case 'fechaViaje':
            try {
                let respuesta = [];
                let ventas = [];
                let usuario = await Usuario.findById(req.params.no);

                if(usuario.seguridad != 'Admin' && usuario.seguridad != 'Viajes'){
                    ventas = await Venta.find({vendedor: req.params.no, activo: 'false', fecha: req.params.value});
                }else{
                    ventas = await Venta.find({activo: 'false', fecha: req.params.value});
                }
                
                for (let i = 0; i < ventas.length; i++) {
                    let vendedor = await Usuario.findById(ventas[i].vendedor, {nombre: 1, apellidoPaterno: 1, apellidoMaterno: 1});
                    let cliente = await Cliente.findById(ventas[i].cliente, {nombre: 1, apellidoPaterno: 1, apellidoMaterno: 1});
                    let origen = await Origen.findById(ventas[i].origen, {nombre: 1});
                    let destino = await Origen.findById(ventas[i].destino, {nombre: 1});
                    let cancelacion = await Cancelaciones.find({idVenta: ventas[i]._id});
                   respuesta.push({
                    _id: ventas[i]._id,
                    folio: cancelacion[0].idCancelacion,
                    vendedorName: `${vendedor.nombre} ${vendedor.apellidoPaterno} ${vendedor.apellidoMaterno}`,
                    fechaCancelacion: ventas[i].fechaCancelacion,
                    clienteName: `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
                    motivo: cancelacion[0].motivo,
                    origen: origen.nombre,
                    destino: destino.nombre,
                    dia: ventas[i].fecha
                   });
                }
                res.json(respuesta);
            } catch (error) {
                res.json(error);
            }
            break;
        case 'fechaViajeReservaciones':
            try {
                let respuesta = [];

                let ventas = [];

                let usuario = await Usuario.findById(req.params.no); //Boletos es el Id de usuario
                
                if(usuario.seguridad != 'Admin' && usuario.seguridad != 'Viajes'){
                    ventas = await Reservacion.find({vendedor: req.params.no, activo: 'false', fecha: req.params.value});
                }else{
                    ventas = await Reservacion.find({activo: 'false', fecha: req.params.value});
                }

                for (let i = 0; i < ventas.length; i++) {
                    let vendedor = await Usuario.findById(ventas[i].vendedor, {nombre: 1, apellidoPaterno: 1, apellidoMaterno: 1});
                    let cliente = await Cliente.findById(ventas[i].cliente, {nombre: 1, apellidoPaterno: 1, apellidoMaterno: 1});
                    let origen = await Origen.findById(ventas[i].origen, {nombre: 1});
                    let destino = await Origen.findById(ventas[i].destino, {nombre: 1});
                    let cancelacion = await Cancelaciones.find({idVenta: ventas[i]._id});
                    respuesta.push({
                        _id: ventas[i]._id,
                        folio: cancelacion[0].idCancelacion,
                        vendedor: `${vendedor.nombre} ${vendedor.apellidoPaterno} ${vendedor.apellidoMaterno}`,
                        fechaCancelacion: ventas[i].fechaCancelacion,
                        cliente: `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
                        motivo: cancelacion[0].motivo,
                        origen: origen.nombre,
                        destino: destino.nombre,
                        dia: ventas[i].fecha,
                        asiento: ventas[i].numeroAsiento,
                        razon: ventas[i].razon,
                        descuento: ventas[i].descuento
                    });
                }
                res.json(respuesta);
            } catch (error) {
                res.json(error);
            }
            break;
        case 'folio':
            try {
                let respuesta = [];
                let vendedor = await Usuario.find({prefijoFolio: req.params.value, activo: 'true'});
                let idVendedor = vendedor[0]._id;
                let ventas = await Venta.find({activo: 'false', folio: req.params.no, vendedor: idVendedor});
                for (let i = 0; i < ventas.length; i++) {
                    let cliente = await Cliente.findById(ventas[i].cliente, {nombre: 1, apellidoPaterno: 1, apellidoMaterno: 1});
                    let origen = await Origen.findById(ventas[i].origen, {nombre: 1});
                    let destino = await Origen.findById(ventas[i].destino, {nombre: 1});
                    let cancelacion = await Cancelaciones.find({idVenta: ventas[i]._id});
                   respuesta.push({
                    _id: ventas[i]._id,
                    folio: cancelacion[0].idCancelacion,
                    vendedorName: `${vendedor[0].nombre} ${vendedor[0].apellidoPaterno} ${vendedor[0].apellidoMaterno}`,
                    fechaCancelacion: ventas[i].fechaCancelacion,
                    clienteName: `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
                    motivo: cancelacion[0].motivo,
                    origen: origen.nombre,
                    destino: destino.nombre,
                    dia: ventas[i].fecha
                   });
                }
                res.json(respuesta);
            } catch (error) {
                res.json(error);
            }
            break;
    }
});

router.get('/:folio/:field/:no/:idUsuario', async (req, res) => { 
    switch (req.params.field) {
        case 'pasajero':
            try {
                //Buscamos clientes que coincidan con lo que introdujo el usuario vendedor
                let respuesta = [];
                let clientes = [];

                let rNombre = req.params.folio;
                let rApaterno = regApaterno = req.params.no;
                let rAmaterno = regAmaterno = req.params.idUsuario;

                if(req.params.folio != 'null' && req.params.no != 'null' && req.params.idUsuario != 'null'){
                    clientes = await Cliente.find({nombre: rNombre, apellidoPaterno: rApaterno, apellidoMaterno: rAmaterno});
                }

                if(req.params.folio != 'null' && req.params.no != 'null' && req.params.idUsuario == 'null'){
                    clientes = await Cliente.find({nombre: rNombre, apellidoPaterno: rApaterno});
                }

                if(req.params.folio != 'null' && req.params.no == 'null' && req.params.idUsuario != 'null'){
                    clientes = await Cliente.find({nombre: rNombre, apellidoMaterno: rAmaterno});
                }

                if(req.params.folio != 'null' && req.params.no == 'null' && req.params.idUsuario == 'null'){
                    clientes = await Cliente.find({ nombre: rNombre });
                }

                if(req.params.folio == 'null' && req.params.no != 'null' && req.params.idUsuario != 'null'){
                    clientes = await Cliente.find({apellidoPaterno: rApaterno, apellidoMaterno: rAmaterno});
                }

                if(req.params.folio == 'null' && req.params.no != 'null' && req.params.idUsuario == 'null'){
                    clientes = await Cliente.find({ apellidoPaterno: rApaterno });
                }

                if(req.params.folio == 'null' && req.params.no == 'null' && req.params.idUsuario != 'null'){
                    clientes = await Cliente.find({ apellidoMaterno: rAmaterno });
                }

                let origenes = await Origen.find();
                let vendedores = await Usuario.find();

                //Si hay alguna coincidencia de nombre, procedemos a buscar los viajes
                if(clientes.length > 0){
                    //res.json(clientes);
                    for (let i = 0; i < clientes.length; i++) {
                        let ventas = await Venta.find({activo: 'false', cliente: clientes[i]._id});
                        //res.json(ventas);
                        for (let j = 0; j < ventas.length; j++) {
                            let origen = await getOrigenDestino(ventas[j].origen, origenes);
                            let destino = await getOrigenDestino(ventas[j].destino, origenes);
                            let cancelacion = await Cancelaciones.find({idVenta: ventas[j]._id});
                            let vendedor = await getVendedor(ventas[j].vendedor, vendedores);
                            respuesta.push({
                                _id: ventas[j]._id,
                                folio: cancelacion[0].idCancelacion,
                                razon: ventas[j].razon,
                                descuento: ventas[j].descuento,
                                vendedorName: vendedor,
                                fechaCancelacion: ventas[j].fechaCancelacion,
                                clienteName: `${clientes[i].nombre} ${clientes[i].apellidoPaterno} ${clientes[i].apellidoMaterno}`,
                                motivo: cancelacion[0].motivo,
                                origen: origen.nombre,
                                destino: destino.nombre,
                                dia: ventas[j].fecha,
                                asiento: ventas[j].numeroAsiento
                            });
                        }
                    }
                }
                
                res.json(respuesta);
            } catch (error) {
                
            }
            break;
        case 'pasajeroReservaciones':
            try {
                //Buscamos clientes que coincidan con lo que introdujo el usuario vendedor
                let respuesta = [];
                let clientes = [];

                let rNombre = req.params.folio;
                let rApaterno = req.params.no;
                let rAmaterno = req.params.idUsuario;

                if(req.params.folio != 'null' && req.params.no != 'null' && req.params.idUsuario != 'null'){
                    clientes = await Cliente.find({nombre: rNombre, apellidoPaterno: rApaterno, apellidoMaterno: rAmaterno});
                }

                if(req.params.folio != 'null' && req.params.no != 'null' && req.params.idUsuario == 'null'){
                    clientes = await Cliente.find({nombre: rNombre, apellidoPaterno: rApaterno});
                }

                if(req.params.folio != 'null' && req.params.no == 'null' && req.params.idUsuario != 'null'){
                    clientes = await Cliente.find({nombre: rNombre, apellidoMaterno: rAmaterno});
                }

                if(req.params.folio != 'null' && req.params.no == 'null' && req.params.idUsuario == 'null'){
                    clientes = await Cliente.find({ nombre: rNombre });
                }

                if(req.params.folio == 'null' && req.params.no != 'null' && req.params.idUsuario != 'null'){
                    clientes = await Cliente.find({apellidoPaterno: rApaterno, apellidoMaterno: rAmaterno});
                }

                if(req.params.folio == 'null' && req.params.no != 'null' && req.params.idUsuario == 'null'){
                    clientes = await Cliente.find({ apellidoPaterno: rApaterno });
                }

                if(req.params.folio == 'null' && req.params.no == 'null' && req.params.idUsuario != 'null'){
                    clientes = await Cliente.find({ apellidoMaterno: rAmaterno });
                }

                let origenes = await Origen.find();
                let vendedores = await Usuario.find();

                //Si hay alguna coincidencia de nombre, procedemos a buscar los viajes
                if(clientes.length > 0){
                    //res.json(clientes);
                    for (let i = 0; i < clientes.length; i++) {
                        let ventas = await Reservacion.find({activo: 'false', cliente: clientes[i]._id});
                        //res.json(ventas);
                        for (let j = 0; j < ventas.length; j++) {
                            let origen = await getOrigenDestino(ventas[j].origen, origenes);
                            let destino = await getOrigenDestino(ventas[j].destino, origenes);
                            let cancelacion = await Cancelaciones.find({idVenta: ventas[j]._id});
                            let vendedor = await getVendedor(ventas[j].vendedor, vendedores);
                            respuesta.push({
                                _id: ventas[j]._id,
                                folio: cancelacion[0].idCancelacion,
                                razon: ventas[j].razon,
                                descuento: ventas[j].descuento,
                                vendedor: vendedor,
                                fechaCancelacion: ventas[j].fechaCancelacion,
                                cliente: `${clientes[i].nombre} ${clientes[i].apellidoPaterno} ${clientes[i].apellidoMaterno}`,
                                motivo: cancelacion[0].motivo,
                                origen: origen.nombre,
                                destino: destino.nombre,
                                dia: ventas[j].fecha,
                                asiento: ventas[j].numeroAsiento
                            });
                        }
                    }
                }
                
                res.json(respuesta);
            } catch (error) {
                
            }
            break;
        case 'folioReservaciones':
            try {
                let respuesta = [];
                let vendedor = {};

                let usuario = await Usuario.findById(req.params.idUsuario); //Boletos es el Id de usuario              
                
                if(usuario.seguridad != 'Admin' && usuario.seguridad != 'Viajes'){
                    vendedor = await Usuario.find({_id: req.params.idUsuario, prefijoFolio: req.params.folio, activo: 'true'});
                }else{
                    vendedor = await Usuario.find({prefijoFolio: req.params.folio, activo: 'true'});
                }

                let idVendedor = vendedor[0]._id;
                let ventas = await Reservacion.find({activo: 'false', folio: req.params.no, vendedor: idVendedor});
                for (let i = 0; i < ventas.length; i++) {
                    let cliente = await Cliente.findById(ventas[i].cliente, {nombre: 1, apellidoPaterno: 1, apellidoMaterno: 1});
                    let origen = await Origen.findById(ventas[i].origen, {nombre: 1});
                    let destino = await Origen.findById(ventas[i].destino, {nombre: 1});
                    let cancelacion = await Cancelaciones.find({idVenta: ventas[i]._id});
                   respuesta.push({
                    _id: ventas[i]._id,
                    folio: cancelacion[0].idCancelacion,
                    razon: ventas[i].razon,
                    descuento: ventas[i].descuento,
                    vendedor: `${vendedor[0].nombre} ${vendedor[0].apellidoPaterno} ${vendedor[0].apellidoMaterno}`,
                    fechaCancelacion: ventas[i].fechaCancelacion,
                    cliente: `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
                    motivo: cancelacion[0].motivo,
                    origen: origen.nombre,
                    destino: destino.nombre,
                    dia: ventas[i].fecha,
                    asiento: ventas[i].numeroAsiento
                   });
                }
                res.json(respuesta);
            } catch (error) {
                res.json(error);
            }
            break;
        case 'folio':
            try {
                let respuesta = [];
                let vendedor = [];

                let usuario = await Usuario.findById(req.params.idUsuario); //Boletos es el Id de usuario
                
                if(usuario.seguridad != 'Admin' && usuario.seguridad != 'Viajes'){
                    
                    vendedor = await Usuario.find({_id: req.params.idUsuario, prefijoFolio: req.params.folio, activo: 'true'});
                    
                }else{
                    vendedor = await Usuario.find({prefijoFolio: req.params.folio, activo: 'true'});
                }

                let idVendedor = vendedor[0]._id;
                let ventas = await Venta.find({activo: 'false', folio: req.params.no, vendedor: idVendedor});
                for (let i = 0; i < ventas.length; i++) {
                    let cliente = await Cliente.findById(ventas[i].cliente, {nombre: 1, apellidoPaterno: 1, apellidoMaterno: 1});
                    let origen = await Origen.findById(ventas[i].origen, {nombre: 1});
                    let destino = await Origen.findById(ventas[i].destino, {nombre: 1});
                    let cancelacion = await Cancelaciones.find({idVenta: ventas[i]._id});
                   respuesta.push({
                        _id: ventas[i]._id,
                        folio: cancelacion[0].idCancelacion,
                        razon: ventas[i].razon,
                        descuento: ventas[i].descuento,
                        vendedorName: `${vendedor[0].nombre} ${vendedor[0].apellidoPaterno} ${vendedor[0].apellidoMaterno}`,
                        fechaCancelacion: ventas[i].fechaCancelacion,
                        clienteName: `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
                        motivo: cancelacion[0].motivo,
                        origen: origen.nombre,
                        destino: destino.nombre,
                        dia: ventas[i].fecha,
                        asiento: ventas[i].numeroAsiento
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

});

router.put('/:value/:field', async (req, res) => {
    switch (req.params.field) {
        case 'imprimirCancelaciones':
            try {
                let respuesta = [];                
                let selectedRowKeys = req.body.selectedRowKeys;
                for (let i = 0; i < selectedRowKeys.length; i++) {
                    let cancelacion = await Cancelaciones.findById(selectedRowKeys[i]);
                    
                    let venta = await Venta.findById(cancelacion.idVenta);
                    
                    let vendedor = await Usuario.findById(venta.vendedor, {nombre: 1, apellidoPaterno: 1, apellidoMaterno: 1});
                    
                    let cliente = await Cliente.findById(venta.cliente, {nombre: 1, apellidoPaterno: 1, apellidoMaterno: 1});
                    
                    let origen = await Origen.findById(venta.origen, {nombre: 1});
                    
                    let destino = await Origen.findById(venta.destino, {nombre: 1});
                    
                    let viaje = await Viaje.findById(venta.idVenta, {fecha: 1});
                    
                    respuesta.push({
                        _id: cancelacion._id,
                        folio: cancelacion.idCancelacion,
                        vendedorName: `${vendedor.nombre} ${vendedor.apellidoPaterno} ${vendedor.apellidoMaterno}`,
                        fechaVenta: venta.fecha,
                        fechaCancelacion: venta.fechaCancelacion,
                        clienteName: `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
                        motivo: cancelacion.motivo,
                        origen: origen.nombre,
                        destino: destino.nombre,
                        dia: viaje.fecha
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

router.delete('/:id', async (req, res) => {
    await Cancelaciones.findByIdAndRemove(req.params.id);
    res.json({status:' CANCELACION ELIMINADA!!!'});
});

module.exports = router;