const express = require('express'); //requerimiento de express
const router = express.Router();   // invocacion de la funcion router del modulo express
const Usuario = require('../models/Usuarios');
const Venta = require('../models/Ventas');
const Reservacion = require('../models/Reservaciones');
const Apartado = require('../models/Apartados');
const Sucursal = require('../models/Sucursales');
const Descuento = require('../models/DescuentosNuevo');

router.get('/', async (req, res) => {
    const usuario = await Usuario.find({activo: 'true'});
    //console.log(usuario);
    res.json(usuario);
});
router.get('/:username', async (req, res) =>{
    const usuario = await Usuario.find({ nickname: req.params.username });
    res.json(usuario);
});
router.get('/:value/:field', async (req, res) =>{
    switch (req.params.field) {
        case 'id':
            try {
                let usuario = await Usuario.findById(req.params.value);
            res.json(usuario);
            } catch (error) {
                console.log(error);
            }            
            break;
        case 'folio':
            try {
                let usuario = await Usuario.find({ prefijoFolio: req.params.value });
                res.json(usuario);
            } catch (error) {
                console.log(error);
            }
            break;
        case 'nombreCompleto':
            try {
                let usuario = await Usuario.find({ activo: 'true' }, { nombre: 1, apellidoPaterno: 1, apellidoMaterno: 1, prefijoFolio: 1 });
                res.json(usuario);
            } catch (error) {
                
            }
            break;
        case 'ventaAdmin':
            try {
                let usuario = await Usuario.find({ activo: 'true' }, { nombre: 1, apellidoPaterno: 1, apellidoMaterno: 1, nickname: 1, seguridad: 1 });
                res.json(usuario);
            } catch (error) {
                
            }
            break;
        case 'seguridad':
            try {
                let usuario = await Usuario.find({ seguridad: req.params.value, activo: 'true' }, { nombre: 1, apellidoPaterno: 1, apellidoMaterno: 1 });
                res.json(usuario);
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
        case 'actualizaYobtenFolio':
            try {
                let body = req.body;
                res.json(body);
            } catch (error) {
                res.json(error);
            }
            break;
        case 'sucursal':
            try {
                let usuario = await Usuario.find({ nickname: req.params.value });
                let sucursal = await Sucursal.findById(usuario[0].sucursal);
                res.json(sucursal);
            } catch (error) {
                res.json(error);
            }
            break;
        case 'activo':
            try {
                let respuesta = [];
                let complemento = {};
                let usuario = await Usuario.find({ activo: 'true' });
                for (let i = 0; i < usuario.length; i++) {
                    let sucursal = await Sucursal.findById(usuario[i].sucursal);
                    respuesta[i] = {
                        '_id': usuario[i]._id,
                        'nombre': usuario[i].nombre,
                        'apellidoPaterno': usuario[i].apellidoPaterno,
                        'apellidoMaterno': usuario[i].apellidoMaterno,
                        'sucursal': sucursal.nombre,
                        'municipio': `${sucursal.ciudad} ${sucursal.estado}`,
                        'tipoUsuario': usuario[i].seguridad
                    }
                }
                res.json(respuesta);
            } catch (error) {
                res.json(error);
            }
            break;
        case 'descuentos':
            try {
                let respuesta = [];
                let complemento = {};
                let usuario = await Usuario.find({ activo: 'true' });
                for (let i = 0; i < usuario.length; i++) {
                    let sucursal = await Sucursal.findById(usuario[i].sucursal);
                    let descuentosTxt = '';
                    for (let j = 0; j < usuario[i].descuentos.length; j++) {
                        let descuento = await Descuento.findById(usuario[i].descuentos[j]);
                        descuentosTxt += `${descuento.nombre}, `
                    }
                    respuesta[i] = {
                        '_id': usuario[i]._id,
                        'nombre': `${usuario[i].nombre} ${usuario[i].apellidoPaterno} ${usuario[i].apellidoMaterno}`,
                        'nickname': usuario[i].nickname,
                        'descuentos': usuario[i].descuentos,
                        'descuentosTxt': descuentosTxt,
                    }
                }
                res.json(respuesta);
            } catch (error) {
                res.json(error);
            }
            break;
        case 'descuentosVenta':
            try {
                let usuario = await Usuario.find({ nickname: req.params.value });

                let datosUsuario = {
                    id_Usuario: usuario[0]._id,
                    nombre: usuario[0].nombre,
                    apellidoPaterno: usuario[0].apellidoPaterno,
                    apellidoMaterno: usuario[0].apellidoMaterno,
                    sucursal: usuario[0].sucursal,
                    seguridad: usuario[0].seguridad,
                    tipoDescuento: 'x',
                };

                let sucursal = await Sucursal.findById(usuario[0].sucursal);
                
                let datosSucursal = {
                    nombre: sucursal.nombre,
                    direccion: `${sucursal.direccion} ${sucursal.ciudad} ${sucursal.estado} ${sucursal.pais}`,
                    tel: sucursal.telefono_1,
                    tel2: sucursal.telefono_2,
                    correo: sucursal.correo,
                };
                
                let descuentos = [];
                

                descuentos.push({
                    value: '0',
                    label: 'Ninguno',
                    desc: '0'
                });
                for (let i = 0; i < usuario[0].descuentos.length; i++) {
                    let descuento = await Descuento.findById(usuario[0].descuentos[i]);
                    if(descuento.activo == true){
                        if(descuento.nombre =='Promoción General 1' || descuento.nombre =='Promoción General 2'){
                            descuentos.push({
                                value: descuento._id,
                                label: descuento.nombre,
                                desc: descuento.dollarDesc,
                                fechaInicio: descuento.fechaInicio,
                                fechaFinal: descuento.fechaFinal,
                            });
                        }else if(descuento.nombre != 'Viaje Redondo' && descuento.nombre != 'Descuento Familiar' && descuento.nombre != 'Cortesía'){
                            descuentos.push({
                                value: descuento._id,
                                label: descuento.nombre,
                                desc: descuento.dollarDesc
                            });
                        }
                    }
                }

                let respuesta = {
                    usuario: datosUsuario,
                    sucursal: datosSucursal,
                    descuentos: descuentos,
                };

                res.json(respuesta);
            } catch (error) {
                res.json(error);
            }
            break;
        case 'descFamiliar':
            try {
                let usuario = await Usuario.find({ nickname: req.params.value });
               
                let descuentos = usuario[0].descuentos;
                //res.json(descuentos);
                for (let i = 0; i < descuentos.length; i++) {
                    let descuento = await Descuento.findById(descuentos[i]);
                    if(descuento.nombre == 'Descuento Familiar'){
                        res.json({res: true});
                    }
                }
                res.json({res: false});
            } catch (error) {
                res.json(error);
            }
            break;
        case 'descViajeRedondo':
            try {
                let usuario = await Usuario.find({ nickname: req.params.value });
                
                let descuentos = usuario[0].descuentos;

                for (let i = 0; i < descuentos.length; i++) {
                    let descuento = await Descuento.findById(descuentos[i]);
                    if(descuento.nombre == 'Viaje Redondo'){
                        res.json({res: true});
                    }
                }
                res.json({res: false});
            } catch (error) {
                res.json(error);
            }
            break;
        default:
            break;
    }
});
/*router.get('/:id', async (req, res) =>{
    const usuario = await Usuario.findById();
    res.json(usuario);
})*/
router.post('/', async (req, res)=>{
    const {id_Usuario, nickname, password, nombre, apellidoMaterno, apellidoPaterno, sucursal, telefono, comision, seguridad, activo, tipoDescuento, prefijoFolio, noFolio} = req.body;
    const usuario= new Usuario({id_Usuario, nickname, password, nombre, apellidoMaterno, apellidoPaterno, sucursal, telefono, comision, seguridad, activo, tipoDescuento, prefijoFolio, noFolio});
    await usuario.save();
    res.json({status: 'USUARIO GUARDADO!!!!!'});
});
router.put('/:id', async (req, res) => {
    const {id_Usuario, nickname, password, nombre, apellidoMaterno, apellidoPaterno, sucursal, telefono, comision, seguridad, activo, tipoDescuento, prefijoFolio, noFolio} = req.body;
    const nuevoUsuario = {id_Usuario, nickname, password, nombre, apellidoMaterno, apellidoPaterno, sucursal, telefono, comision, seguridad, activo, tipoDescuento, prefijoFolio, noFolio};
    await Usuario.findByIdAndUpdate(req.params.id, nuevoUsuario);
    res.json({status:'USUARIO ACTUALIZADO!!!'});
});

router.put('/:id/:field', async (req, res) => {
    switch (req.params.field) {
        case 'actualizaYobtenFolio':            
            try {
                let body = req.body;
                let newVenta = {};
                let rJson = [];
                for(let i = 0; i < body.generalData.noPasajeros; i++){
                    let usuario = await Usuario.findById(req.params.id);
                    let newFolio = parseInt(usuario.noFolio)+1;
                    await Usuario.findOneAndUpdate(
                        { _id: req.params.id},
                        { noFolio: newFolio }
                    );
                    let desc = (body.generalData.cobro.cortesia == 0)? parseFloat(body.descuentos[i].descuento):parseFloat(body.descuentos[i].descuento)+(parseFloat(body.generalData.cobro.cortesia)/parseFloat(body.generalData.noPasajeros));
                    let tot = (body.generalData.cobro.cortesia == 0)? parseFloat(body.generalData.costoBoleto)-parseFloat(body.descuentos[i].descuento) : parseFloat(body.generalData.costoBoleto)-parseFloat(body.descuentos[i].descuento)-(parseFloat(body.generalData.cobro.cortesia)/parseFloat(body.generalData.noPasajeros));
                    newVenta = {
                        'cliente': `${body.pasajeros[i].idCliente}`,
                        'tipo': `${body.pasajeros[i].tipoDeCliente}`,
                        'razon': `${body.razones[i].razon}`,
                        'descuento': `${desc}`,
                        'origen': `${body.generalData.origen.id}`,
                        'destino': `${body.generalData.destino.id}`,
                        'fecha': `${body.generalData.detalles.dia}`,
                        'anio': `${body.generalData.detalles.anio}`,
                        'diaDelAnio': `${body.generalData.detalles.diaDelAnio}`,
                        'horaSalida': `${body.generalData.detalles.hora}`,
                        'numeroAsiento': `${body.pasajeros[i].asiento}`,
                        'statePagado': 'false', //Se guarda como false, ya que el statePagado es referente a si lo pagó el vendedor
                        'activo': 'true',
                        'viajado': 'false',
                        'fechaDeVenta': body.generalData.fechaHoy,
                        'idVenta': `${body.generalData.detalles.idViaje}`,
                        'total': `${tot}`,
                        'folio': `${newFolio}`,
                        'tipoCambio': `${body.generalData.cambio}`,
                        'vendedor': `${body.generalData.vendedor.id_Usuario}`
                    };
                    let {cliente,tipo,razon,descuento,origen,destino,fecha,anio,diaDelAnio,horaSalida,numeroAsiento,statePagado,activo,idVenta,tipoCambio, total, vendedor, folio, viajado,fechaDeVenta} = newVenta;
                    let venta= new Venta({cliente, tipo, razon,descuento,origen,destino,fecha,anio,diaDelAnio,horaSalida,numeroAsiento,statePagado,activo,idVenta,tipoCambio, total, vendedor, folio, viajado,fechaDeVenta});
                    await venta.save();
                    ///Ahora "Desapartamos" el boleto
                    let apartado = await Apartado.find({idVendedor: req.params.id, idViaje: body.generalData.detalles.idViaje, asiento: body.pasajeros[i].asiento});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                    }
                    rJson.push(`${usuario.prefijoFolio}-${newFolio}`);
                }
                res.json({rJson});
            } catch (error) {
                res.json(error);
            }
            break;
        case 'actualizaYobtenFolioViajeRedondo':            
            try {
                let body = req.body;
                let newVenta = {};
                let rJson = [];
                for(let i = 0; i < body.generalData.noPasajeros; i++){
                    let usuario = await Usuario.findById(req.params.id);
                    let newFolio = parseInt(usuario.noFolio)+1;
                    await Usuario.findOneAndUpdate(
                        { _id: req.params.id},
                        { noFolio: newFolio }
                    );
                    newVenta = {
                        'cliente': `${body.pasajeros[i].idCliente}`,
                        'tipo': `${body.pasajeros[i].tipoDeCliente}`,
                        'razon': `${body.razones[i].razon}`,
                        'descuento': `${body.descuentos[i]}`,
                        'origen': `${body.generalData.origen.id}`,
                        'destino': `${body.generalData.destino.id}`,
                        'fecha': `${body.generalData.detalles.dia}`,
                        'anio': `${body.generalData.detalles.anio}`,
                        'diaDelAnio': `${body.generalData.detalles.diaDelAnio}`,
                        'horaSalida': `${body.generalData.detalles.hora}`,
                        'numeroAsiento': `${body.pasajeros[i].asiento}`,
                        'statePagado': 'false', //Se guarda como false, ya que el statePagado es referente a si lo pagó el vendedor
                        'activo': 'true',
                        'viajado': 'false',
                        'fechaDeVenta': body.generalData.fechaHoy,
                        'idVenta': `${body.generalData.detalles.idViaje}`,
                        'total': `${parseFloat(body.generalData.costoBoleto)-parseFloat(body.descuentos[i])}`,
                        'folio': `${newFolio}`,
                        'tipoCambio': `${body.generalData.cambio}`,
                        'vendedor': `${body.generalData.vendedor.id_Usuario}`
                    };
                    let {cliente,tipo,razon,descuento,origen,destino,fecha,anio,diaDelAnio,horaSalida,numeroAsiento,statePagado,activo,idVenta,tipoCambio, total, vendedor, folio, viajado, fechaDeVenta} = newVenta;
                    let venta= new Venta({cliente, tipo, razon,descuento,origen,destino,fecha,anio,diaDelAnio,horaSalida,numeroAsiento,statePagado,activo,idVenta,tipoCambio, total, vendedor, folio, viajado, fechaDeVenta});
                    await venta.save();
                    ///Ahora "Desapartamos" el boleto
                    let apartado = await Apartado.find({idVendedor: req.params.id, idViaje: body.generalData.detalles.idViaje, asiento: body.pasajeros[i].asiento});
                    if(apartado.length > 0){
                        await Apartado.findByIdAndRemove(apartado[0]._id);
                    }
                    rJson.push(`${usuario.prefijoFolio}-${newFolio}`);
                }
                res.json({rJson});
            } catch (error) {
                res.json(error);
            }
            break;
        case 'actualizaYobtenFolioReservacion':
            try {
                let id = req.params.id;
                let field = req.params.field;
                let body = req.body;
                let newReservacion = {};
                let rJson = [];
                let fechaAbierta = body.generalData.detalles.fechaAbierta;
                let origen = body.generalData.origen.id;
                let destino = body.generalData.destino.id;
                let horaSalida = body.generalData.detalles.hora;
                let statePagado = body.pagado;
                let anticipo = body.generalData.cobro.anticipo;
                let fechaDeReservacion = body.generalData.fechaHoy;
                let costoBoleto = parseFloat(body.generalData.costoBoleto);
                let tipoDeCambio = body.generalData.cambio;
                let vendedor = body.generalData.vendedor.id_Usuario;
                let fecha = body.generalData.detalles.dia;
                let anio = body.generalData.detalles.anio;
                let diaDelAnio = body.generalData.detalles.diaDelAnio;
                let idVenta = body.generalData.detalles.idViaje;
                //res.json({'body': body, 'headers': [id, field]})
                for (let i = 0; i < parseInt(body.generalData.noPasajeros); i++) {
                    let usuario = await Usuario.findById(req.params.id);
                    let newFolio = parseInt(usuario.noFolio)+1;
                    
                    await Usuario.findOneAndUpdate(
                        { _id: req.params.id},
                        { noFolio: newFolio }
                    );
                    if(body.generalData.detalles.fechaAbierta){
                        newReservacion = {
                            'cliente': body.pasajeros[i].idCliente,
                            'tipo': body.pasajeros[i].tipoDeCliente,
                            'razon': body.razones[i].razon,
                            'descuento': body.descuentos[i].descuento,
                            'origen': origen,
                            'destino': destino,
                            'horaSalida': horaSalida,
                            'statePagado': body.pagados[i],
                            'statePagadoAnticipo': 'false',
                            'statePagadoCliente': 'false',
                            'anticipo': body.anticipos[i],
                            'fechaDeReservacion': fechaDeReservacion,
                            'fechaDeVenta': body.generalData.fechaHoyF,
                            'activo': 'true',
                            'viajado': 'false',
                            'total': costoBoleto-parseFloat(body.descuentos[i].descuento),
                            'folio': newFolio,
                            'tipoCambio': tipoDeCambio,
                            'vendedor': vendedor
                        };
                        try {
                            let {anticipo,fechaDeReservacion, fechaDeVenta, cliente,tipo,razon,descuento,origen,destino,horaSalida,statePagado,statePagadoAnticipo,statePagadoCliente,activo,tipoCambio, total, vendedor, folio, viajado} = newReservacion;
                            let reservacion= new Reservacion({anticipo,fechaDeReservacion, fechaDeVenta, cliente,tipo,razon,descuento,origen,destino,horaSalida,statePagado,statePagadoAnticipo,statePagadoCliente,activo,tipoCambio, total, vendedor, folio, viajado});
                            await reservacion.save();
                        } catch (error) {
                            res.json(error);
                        }
                    }else{
                        newReservacion = {
                            'cliente': body.pasajeros[i].idCliente,
                            'tipo': body.pasajeros[i].tipoDeCliente,
                            'razon': body.razones[i].razon,
                            'descuento': body.descuentos[i].descuento,
                            'origen': origen,
                            'destino': destino,
                            'fecha': fecha,
                            'anio': anio,
                            'diaDelAnio': diaDelAnio,
                            'horaSalida': horaSalida,
                            'numeroAsiento': body.pasajeros[i].asiento,
                            'statePagado': body.pagados[i],
                            'statePagadoAnticipo': 'false',
                            'statePagadoCliente': 'false',
                            'anticipo': body.anticipos[i],
                            'fechaDeReservacion': fechaDeReservacion,
                            'fechaDeVenta': body.generalData.fechaHoyF,
                            'activo': 'true',
                            'viajado': 'false',
                            'idVenta': idVenta,
                            'total': costoBoleto-parseFloat(body.descuentos[i].descuento),
                            'folio': newFolio,
                            'tipoCambio': tipoDeCambio,
                            'vendedor': vendedor
                        };
                        try {
                            let {cliente,tipo,razon,descuento,origen,destino,fecha,anio,diaDelAnio,horaSalida,numeroAsiento,statePagado,statePagadoAnticipo,statePagadoCliente,anticipo,fechaDeReservacion,fechaDeVenta,activo,viajado,idVenta,total,folio,tipoCambio,vendedor} = newReservacion;
                            let reservacion= new Reservacion({cliente,tipo,razon,descuento,origen,destino,fecha,anio,diaDelAnio,horaSalida,numeroAsiento,statePagado,statePagadoAnticipo,statePagadoCliente,anticipo,fechaDeReservacion,fechaDeVenta,activo,viajado,idVenta,total,folio,tipoCambio,vendedor});
                            await reservacion.save();
                            let apartado = await Apartado.find({idVendedor: vendedor, idViaje: idVenta, asiento: body.pasajeros[i].asiento});
                            if(apartado.length > 0){
                                await Apartado.findByIdAndRemove(apartado[0]._id);
                            }
                        } catch (error) {
                            res.json(error);
                        }
                    }
                    rJson.push(`${usuario.prefijoFolio}-${newFolio}`);
                }
                res.json({rJson})
            } catch (error) {
                res.json(error);
            }
            break;
        case 'descuentos':
            try {
                let descuentos = req.body;
                await Usuario.findOneAndUpdate(
                    { _id: req.params.id},
                    { descuentos: descuentos}
                );
                res.json({status: 'Usuario Actualizado'});
            } catch (error) {
                
            }
            break;
    
        default:
            break;
    }
});

router.put('/:id/:value/:field', async (req, res) => {
    switch (req.params.field) {        
        case 'nickname':
            await Usuario.findOneAndUpdate(
                { _id: req.params.id},
                { nickname: req.params.value }
            );
            break;
        case 'password':
            await Usuario.findOneAndUpdate(
                { _id: req.params.id},
                { password: req.params.value }
            );
            break;
        case 'nombre':
            await Usuario.findOneAndUpdate(
                { _id: req.params.id},
                { nombre: req.params.value }
            );
            break;
        case 'apellidoPaterno':
            await Usuario.findOneAndUpdate(
                { _id: req.params.id},
                { apellidoPaterno: req.params.value }
            );
            break;
        case 'apellidoMaterno':
                await Usuario.findOneAndUpdate(
                    { _id: req.params.id},
                    { apellidoMaterno: req.params.value }
                );
            break;
        case 'sucursal':
            await Usuario.findOneAndUpdate(
                { _id: req.params.id},
                { sucursal: req.params.value }
            );
            break;
        case 'telefono':
            await Usuario.findOneAndUpdate(
                { _id: req.params.id},
                { telefono: req.params.value }
            );
            break;
        case 'comision':
            await Usuario.findOneAndUpdate(
                { _id: req.params.id},
                { comision: req.params.value }
            );
            break;
        case 'seguridad':
                await Usuario.findOneAndUpdate(
                    { _id: req.params.id},
                    { seguridad: req.params.value }
                );
                break;
        case 'activo':
            await Usuario.findOneAndUpdate(
                { _id: req.params.id},
                { activo: req.params.value }
            );
            break;
        case 'tipoDescuento':
            await Usuario.findOneAndUpdate(
                { _id: req.params.id},
                { tipoDescuento: req.params.value }
            );
            break;
        case 'prefijoFolio':
            await Usuario.findOneAndUpdate(
                { _id: req.params.id},
                { prefijoFolio: req.params.value }
            );
            break;
        case 'noFolio':
            await Usuario.findOneAndUpdate(
                { _id: req.params.id},
                { noFolio: req.params.value }
            );
            break;    
        default:
            break;
    }
});

router.delete('/:id', async (req, res) => {
    await Usuario.findByIdAndRemove(req.params.id);
    res.json({status:'USUARIO ELIMINADO!!!'});
})
module.exports = router;