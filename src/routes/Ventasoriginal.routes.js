const express = require('express'); //requerimiento de express
const router = express.Router();   // invocacion de la funcion router del modulo express
const Venta = require('../models/Ventas');
const Reservacion = require('../models/Reservaciones');
const Viaje = require('../models/AsignarViajes');
const Usuario = require('../models/Usuarios');
const Sucursal = require('../models/Sucursales');
const Origen = require('../models/OrigenesYdestinos');
const Cliente = require('../models/Clientes');
const ConfiguracionBoleto = require('../models/ConfiguracionBoleto');
const ImagenesBoletos = require('../models/ImagenesBoletos');
const Dollar = require('../models/Dollar');
const Cancelaciones = require('../models/Cancelaciones');
const Apartado = require('../models/Apartados');
const Abordaje = require('../models/ListaDeAbordaje.js');
const ModificacionCorte = require('../models/ModificacionCorte.js');
const Pagos = require('../models/Pagos');

const convertDate = (date) => {
    if(!date) return '';
    let fecha = new Date(date);
    let day = fecha.getDate() < 10 ? `0${fecha.getDate()}` : fecha.getDate();
    let month = fecha.getMonth()+1 < 10 ? `0${fecha.getMonth()+1}` : fecha.getMonth()+1;
    return `${day}-${month}-${fecha.getFullYear()}`
}

function getTipoPasajero(tipo) {
    if(tipo == 'adulto'){
        return 'A';
    }
    if(tipo == 'nino'){
        return 'N';
    }
    if(tipo == 'adultoM'){
        return 'INSEN';
    }
}


function getOrigenDestino(id, array){
    for (let i = 0; i < array.length; i++) {
        if(array[i]._id == id){
            return array[i];
        }
    }
}

function getOyD(id, array){
    for (let i = 0; i < array.length; i++) {
        if(array[i]._id == id){
            return `${array[i].municipio} ${array[i].estado}`;
        }
    }
}

function getUsuario(id, array){
    for (let i = 0; i < array.length; i++) {
        if(array[i]._id == id){
            return `${array[i].nombre} ${array[i].apellidoPaterno}`;
        }
    }
}

function getUsuarioNombre(id, array){
    for (let i = 0; i < array.length; i++) {
        if(array[i]._id == id){
            return array[i].nombre;
        }
    }
}

function getUsuarioFolio(id, array){
    for (let i = 0; i < array.length; i++) {
        if(array[i]._id == id){
            return array[i].prefijoFolio;
        }
    }
}

function getReasignado(viaje, asiento) {
    
}

function getAbordaje(seat, abordaje){
    let returnData = '';
    for (let i = 0; i < abordaje.length; i++) {
      if(seat == abordaje[i].asiento){
        if(abordaje[i].estado == 'null'){
          returnData = '';
        }else{
          returnData = abordaje[i].estado;
        }
      }
    }
    return returnData;
  }

async function resetAsiento (asiento, idViaje) {
    let reset = null;
    switch (asiento) {
        case '1':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_1: 'true' },
                { asiento_1: 'false'}
            );
            break;
        case '2':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_2: 'true' },
                { asiento_2: 'false'}
            );
            break;
        case '3':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_3: 'true' },
                { asiento_3: 'false'}
            );
            break;
        case '4':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_4: 'true' },
                { asiento_4: 'false'}
            );
            break;
        case '5':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_5: 'true' },
                { asiento_5: 'false'}
            );
            break;
        case '6':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_6: 'true' },
                { asiento_6: 'false'}
            );
            break;
        case '7':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_7: 'true' },
                { asiento_7: 'false'}
            );
            break;
        case '8':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_8: 'true' },
                { asiento_8: 'false'}
            );
            break;
        case '9':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_9: 'true' },
                { asiento_9: 'false'}
            );
            break;
        case '10':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_10: 'true' },
                { asiento_10: 'false'}
            );
            break;
        case '11':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_11: 'true' },
                { asiento_11: 'false'}
            );
            break;
        case '12':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_12: 'true' },
                { asiento_12: 'false'}
            );
            break;
        case '13':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_13: 'true' },
                { asiento_13: 'false'}
            );
            break;
        case '14':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_14: 'true' },
                { asiento_14: 'false'}
            );
            break;
        case '15':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_15: 'true' },
                { asiento_15: 'false'}
            );
            break;
        case '16':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_16: 'true' },
                { asiento_16: 'false'}
            );
            break;
        case '17':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_17: 'true' },
                { asiento_17: 'false'}
            );
            break;
        case '18':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_18: 'true' },
                { asiento_18: 'false'}
            );
            break;
        case '19':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_19: 'true' },
                { asiento_19: 'false'}
            );
            break;
        case '20':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_20: 'true' },
                { asiento_20: 'false'}
            );
            break;
        case '21':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_21: 'true' },
                { asiento_21: 'false'}
            );
            break;
        case '22':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_22: 'true' },
                { asiento_22: 'false'}
            );
            break;
        case '23':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_23: 'true' },
                { asiento_23: 'false'}
            );
            break;
        case '24':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_24: 'true' },
                { asiento_24: 'false'}
            );
            break;
        case '25':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_25: 'true' },
                { asiento_25: 'false'}
            );
            break;
        case '26':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_26: 'true' },
                { asiento_26: 'false'}
            );
            break;
        case '27':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_27: 'true' },
                { asiento_27: 'false'}
            );
            break;
        case '28':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_28: 'true' },
                { asiento_28: 'false'}
            );
            break;
        case '29':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_29: 'true' },
                { asiento_29: 'false'}
            );
            break;
        case '30':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_30: 'true' },
                { asiento_30: 'false'}
            );
            break;
        case '31':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_31: 'true' },
                { asiento_31: 'false'}
            );
            break;
        case '32':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_32: 'true' },
                { asiento_32: 'false'}
            );
            break;
        case '33':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_33: 'true' },
                { asiento_33: 'false'}
            );
            break;
        case '34':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_34: 'true' },
                { asiento_34: 'false'}
            );
            break;
        case '35':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_35: 'true' },
                { asiento_35: 'false'}
            );
            break;
        case '36':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_36: 'true' },
                { asiento_36: 'false'}
            );
            break;
        case '37':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_37: 'true' },
                { asiento_37: 'false'}
            );
            break;
        case '38':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_38: 'true' },
                { asiento_38: 'false'}
            );
            break;
        case '39':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_39: 'true' },
                { asiento_39: 'false'}
            );
            break;
        case '40':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_40: 'true' },
                { asiento_40: 'false'}
            );
            break;
        case '41':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_41: 'true' },
                { asiento_41: 'false'}
            );
            break;
        case '42':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_42: 'true' },
                { asiento_42: 'false'}
            );
            break;
        case '43':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_43: 'true' },
                { asiento_43: 'false'}
            );
            break;
        case '44':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_44: 'true' },
                { asiento_44: 'false'}
            );
            break;
        case '45':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_45: 'true' },
                { asiento_45: 'false'}
            );
            break;
        case '46':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_46: 'true' },
                { asiento_46: 'false'}
            );
            break;
        case '47':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_47: 'true' },
                { asiento_47: 'false'}
            );
            break;
        case '48':
            reset = await Viaje.findOneAndUpdate(
                { _id: idViaje, asiento_48: 'true' },
                { asiento_48: 'false'}
            );
            break;
        
        
    }
}

function getValueModificarVentas(array, id){
    for (let i = 0; i < array.length; i++) {
        if(array[i]._id == id){
            return array[i];
        }
    }
}

function getVendedor(id, array){
    for (let i = 0; i < array.length; i++) {
        if(array[i]._id == id){
            return array[i];
        }
    }
}

router.get('/', async (req, res) => {
    const venta = await Venta.find();
    console.log(venta);
    res.json(venta);
});
router.get('/:id', async (req, res) =>{
    const venta = await Venta.findById(req.params.id);
    res.json(venta);
});
router.get('/:value/:field', async (req, res) =>{
    switch (req.params.field) {
        case 'fechaViaje':
            try {
                let respuesta = [];
                let ventas = await Venta.find({fecha: req.params.value, activo: 'true'});
                let vendedores = await Usuario.find();
                let clientes = await Cliente.find();
                let origenesYdestinos = await Origen.find();
                for (let i = 0; i < ventas.length; i++) {
                    let vendedor = await getValueModificarVentas(vendedores, ventas[i].vendedor);
                    let cliente = await getValueModificarVentas(clientes, ventas[i].cliente);
                    let origen = await getValueModificarVentas(origenesYdestinos, ventas[i].origen);
                    let destino = await getValueModificarVentas(origenesYdestinos, ventas[i].destino);
                    let reasignacion = '';
                    if(ventas[i].idVentasReasignacion){
                        reasignacion = 'Reasignación';
                    }
                    respuesta.push({
                        _id: ventas[i]._id,
                        folio: `${vendedor.prefijoFolio}-${ventas[i].folio} ${reasignacion}`,
                        cliente: `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
                        razon: ventas[i].razon,
                        descuento: ventas[i].descuento,
                        tipoDeCambio: ventas[i].tipoCambio,
                        origen: origen.nombre,
                        destino: destino.nombre,
                        idViaje: ventas[i].idVenta,
                        dia: ventas[i].fecha,
                        fechaDeVenta: ventas[i].fechaDeVenta ? convertDate(ventas[i].fechaDeVenta) : '',
                        numeroAsiento: ventas[i].numeroAsiento,
                        status: ventas[i].viajado
                    });
                }
                res.json(respuesta);
            } catch (error) {
                res.json(error);
            }
            break;
        case 'ListaAbordaje':
            try {
                let selected = [];
                let respuesta = [];
                let respuestaAux = [];
                let origenesYdestinos = await Origen.find({activo: 'true'});
                let usuarios = await Usuario.find();
                let viaje = await Viaje.findById(req.params.value);
                let abordaje = await Abordaje.find({idViaje: req.params.value});
                let venta = await Venta.find({idVenta: req.params.value, activo: 'true'});
                let reservaciones = await Reservacion.find({idVenta: req.params.value, activo: 'true', statePagadoCliente:'true'});
                
                let auxApartados = await Apartado.find({idViaje: req.params.value});
                let reservacionesSinPagar = await Reservacion.find({idVenta: req.params.value, activo: 'true', statePagadoCliente:'false'});
            
                for(let i = 0; i < reservacionesSinPagar.length; i++){
                    respuestaAux.push({
                        _id: reservacionesSinPagar[i]._id,
                        cliente: reservacionesSinPagar[i].cliente,
                        tipo: getTipoPasajero(reservacionesSinPagar[i].tipo),
                        origen: reservacionesSinPagar[i].origen,
                        destino: reservacionesSinPagar[i].destino,
                        numeroAsiento: reservacionesSinPagar[i].numeroAsiento || '',
                        statePagado: reservacionesSinPagar[i].statePagado,
                        tipoCambio: reservacionesSinPagar[i].tipoCambio,
                        total: reservacionesSinPagar[i].total,
                        vendedor: reservacionesSinPagar[i].vendedor,
                        folio: reservacionesSinPagar[i].folio,
                        tipoAsignacion: 'reservacionSinPagar',
                        fechaCancelacion: ''
                    });
                }

                /////////////////////////////////////////////////

                for(let i = 0; i < venta.length; i++){
                    let fc = venta[i].fechaCancelacion;
                    if(typeof(fc) == "undefined"){
                        respuestaAux.push({
                            _id: venta[i]._id,
                            cliente: venta[i].cliente,
                            tipo: getTipoPasajero(venta[i].tipo),
                            origen: venta[i].origen,
                            destino: venta[i].destino,
                            numeroAsiento: venta[i].numeroAsiento,
                            statePagado: venta[i].statePagado,
                            tipoCambio: venta[i].tipoCambio,
                            total: venta[i].total,
                            vendedor: venta[i].vendedor,
                            folio: venta[i].folio,
                            tipoAsignacion: 'venta',
                            fechaCancelacion: ''
                        });
                    }
                }

                ///////////////////////////////////////////////////////

                for(let i = 0; i < reservaciones.length; i++){
                    respuestaAux.push({
                        _id: reservaciones[i]._id,
                        cliente: reservaciones[i].cliente,
                        tipo: getTipoPasajero(reservaciones[i].tipo),
                        origen: reservaciones[i].origen,
                        destino: reservaciones[i].destino,
                        numeroAsiento: reservaciones[i].numeroAsiento,
                        statePagado: reservaciones[i].statePagado,
                        tipoCambio: reservaciones[i].tipoCambio,
                        total: reservaciones[i].total,
                        vendedor: reservaciones[i].vendedor,
                        folio: reservaciones[i].folio,
                        tipoAsignacion: 'reservacion'
                    });
                }

                for(let i = 0; i < auxApartados.length; i++){
                    respuestaAux.push({
                        idVendedor: auxApartados[i].idVendedor,
                        numeroAsiento: auxApartados[i].asiento,
                        tipoAsignacion: 'apartado'
                    });
                }

                let valid = true;

                for (let i = 1; i < (parseInt(viaje.capacidad)+1); i++) {
                    valid = true;
                    for (let j = 0; j < parseInt(respuestaAux.length); j++){
                        if(parseInt(respuestaAux[j].numeroAsiento) == i){
                            if(respuestaAux[j].tipoAsignacion == 'venta' || respuestaAux[j].tipoAsignacion == 'reservacion'){
                                valid = false;
                                let pasajero = await Cliente.findById(respuestaAux[j].cliente);
                                let lf = getAbordaje(respuestaAux[j].numeroAsiento, abordaje);
                                let reasignacion = false;
                                respuesta.push({
                                    foliofake: i,
                                    pagado: respuestaAux[j].statePagado,
                                    reasignacion: reasignacion,
                                    folio: `${getUsuarioFolio(respuestaAux[j].vendedor, usuarios)}-${respuestaAux[j].folio}`,
                                    nombrePasajero: `${pasajero.nombre} ${pasajero.apellidoPaterno} ${pasajero.apellidoMaterno}`,
                                    origen: `${getOyD(respuestaAux[j].origen, origenesYdestinos)}`,
                                    destino: `${getOyD(respuestaAux[j].destino, origenesYdestinos)}`,
                                    tipo: respuestaAux[j].tipo,
                                    asiento: respuestaAux[j].numeroAsiento,
                                    vendedor: `${getUsuarioNombre(respuestaAux[j].vendedor, usuarios)}`,
                                    precio: respuestaAux[j].total,
                                    tipoCambio: respuestaAux[j].tipoCambio,
                                    lf: lf,
                                    asignacion: respuestaAux[j].tipoAsignacion,
                                    id: respuestaAux[j]._id
                                });
                                
                                if(lf != ''){
                                    selected.push(i);
                                }
                            }else if(respuestaAux[j].tipoAsignacion == 'apartado'){
                                valid = false;
                                let lf = getAbordaje(respuestaAux[j].numeroAsiento, abordaje);
                                respuesta.push({
                                    foliofake: i,
                                    pagado: '',
                                    reasignacion: '',
                                    folio: '',
                                    nombrePasajero: 'venta o reservación no concluida',
                                    origen: '',
                                    destino: '',
                                    tipo: '',
                                    asiento: respuestaAux[j].numeroAsiento,
                                    vendedor: `${getUsuarioNombre(respuestaAux[j].idVendedor, usuarios)}`,
                                    precio: '',
                                    tipoCambio: '',
                                    lf: '',
                                    id: respuestaAux[j]._id
                                });
                                if(lf != ''){
                                    selected.push(i);
                                }
                            }else if(respuestaAux[j].tipoAsignacion == 'reservacionSinPagar'){
                                valid = false;
                                let pasajero = await Cliente.findById(respuestaAux[j].cliente);
                                let lf = getAbordaje(respuestaAux[j].numeroAsiento, abordaje);
                                respuesta.push({
                                    foliofake: i,
                                    pagado: '',
                                    reasignacion: '',
                                    folio: `${getUsuarioFolio(respuestaAux[j].vendedor, usuarios)}-${respuestaAux[j].folio}`,
                                    nombrePasajero: `Reservación sin liquidar - ${pasajero.nombre} ${pasajero.apellidoPaterno} ${pasajero.apellidoMaterno}`,
                                    origen: `${getOyD(respuestaAux[j].origen, origenesYdestinos)}`,
                                    destino: `${getOyD(respuestaAux[j].destino, origenesYdestinos)}`,
                                    tipo: respuestaAux[j].tipo,
                                    asiento: respuestaAux[j].numeroAsiento,
                                    vendedor: `${getUsuarioNombre(respuestaAux[j].vendedor, usuarios)}`,
                                    precio: respuestaAux[j].total,
                                    tipoCambio: respuestaAux[j].tipoCambio,
                                    lf: lf,
                                    id: respuestaAux[j]._id
                                });
                                if(lf != ''){
                                    selected.push(i);
                                }
                            }
                        }
                    }
                    if(valid){
                        respuesta.push({
                            foliofake: i,
                            folio: '',
                            nombre_pasajero: '',
                            origen: '',    
                            destino: '', 
                            tipo: '',
                            asiento: i,
                            vendedor: '',
                            precio: '',
                            tipoCambio: '',
                            lf: '',
                        });
                    }
                }

                res.json({respuesta, selected});

            } catch (error) {
                res.json(error);
            }
            break;
        case 'idVenta':
            try { //Busca todas las ventas que se han hecho para la corrida dada (id/value)
                let venta = await Venta.find({idVenta: req.params.value, activo: 'true'});
                let reservaciones = await Reservacion.find({idVenta: req.params.value, activo: 'true', statePagadoCliente:'true'});
                let respuesta = venta.concat(reservaciones);
                let auxApartados = await Apartado.find({idViaje: req.params.value});
                let reservacionesSinPagar = await Reservacion.find({idVenta: req.params.value, activo: 'true', statePagadoCliente:'false'});
                for (let i = 0; i < auxApartados.length; i++) {
                    respuesta.push({
                        _id: auxApartados[i]._id,
                        cliente: null,
                        tipo: null,
                        origen: null,
                        destino: null,
                        numeroAsiento: auxApartados[i].asiento,
                        vendedor: auxApartados[i].idVendedor,
                        total: null,
                        tipoCambio: null,
                        folio: '000',
                    });
                }
                res.json(respuesta);
            } catch (error) {
                console.log(error);
            }
            break;
        case 'viajado':
            try {
                const venta = await Venta.find({viajado: req.params.value, activo: 'true'});
                res.json(venta);
            } catch (error) {
                console.log(error);
            }
            break;
        case 'vendedorcliente':
            try {
                let ventaResp = null;
                let resp = true;
                let venta = await Venta.findById(req.params.value);
                if(venta.idVentasReasignacion){//Si es una reasignacion, buscamos la venta original
                    let id = venta.idVentasReasignacion;
                    let ventaOriginal = await Venta.findById(id);
                    ventaResp = ventaOriginal;
                    //res.json(ventaOriginal);
                    if(ventaOriginal.reasignaciones == 3){
                        resp = false;
                    }
                }else{//Validamos que no tenga 3 ventas
                    ventaResp = venta;
                    if(venta.reasignaciones >= 3){
                        resp = false;
                    }
                }
                res.json({ventaResp, resp});
            } catch (error) {
                console.log(error);
            }
            break;
        case 'fechaMayorHoy':
            try {
                
            } catch (error) {
                console.log(error);
            }
            break;
        case 'activo':
            try {
                const venta = await Venta.find({activo: req.params.value});
                res.json(venta);
            } catch (error) {
                console.log(error);
            }
            break;
        case 'reimpresion':
            try {
                let respuesta = {
                    correoSucursal: '',//            
                    descuento: '', //
                    destino: '', //
                    dirSucursal: '',//
                    direccionMatriz: '',//
                    direccionMatrizEU: '',//
                    fecha: '', //
                    folio: '', //
                    frase: '', //
                    hora: '', //
                    imagenPublicidad: '',
                    noAsiento: '', //
                    origen: '',//
                    pasajero: '', //
                    permiso: '',//
                    politicas: '',//
                    subtotal: '', //
                    sucursal: '',//
                    tel2Sucursal: '',//
                    telSucursal: '',//
                    telefonoMatriz: '',//
                    telefonoMatrizEU: '',//
                    tipo: '', //
                    tipoDeCambio: '', //
                    total: '', //
                    vendedor: '', ///
                };
                let venta = await Venta.findById(req.params.value);
                let vendedor = await Usuario.findById(venta.vendedor);
                let sucursal = await Sucursal.findById(vendedor.sucursal);
                let origen = await Origen.findById(venta.origen);
                let destino = await Origen.findById(venta.destino);
                let cliente = await Cliente.findById(venta.cliente);
                let sucursalMX = await Sucursal.find({pais: 'MX', tipo: 'matriz'});
                let sucursalUS = await Sucursal.find({pais: 'US', tipo: 'matriz'});
                let configuracion = await ConfiguracionBoleto.find();
                let imagenBoleto =  await ImagenesBoletos.find({type: 'Boleto'});

                //folio
                respuesta.folio = vendedor.prefijoFolio+'-'+venta.folio;
                respuesta.vendedor = vendedor.nombre+' '+vendedor.apellidoPaterno+' '+vendedor.apellidoMaterno;
                respuesta.descuento = venta.descuento;
                respuesta.fecha = venta.fecha;
                respuesta.hora = venta.horaSalida;
                respuesta.noAsiento = venta.numeroAsiento;
                respuesta.tipoDeCambio = venta.tipoCambio;
                respuesta.total = venta.total;
                respuesta.subtotal = parseFloat(venta.total)+parseFloat(venta.descuento);
                respuesta.tipo = venta.tipo;
                respuesta.correoSucursal = sucursal.correo;
                respuesta.destino = destino.direccion+' '+destino.municipio+' '+destino.estado+' '+destino.pais;
                respuesta.dirSucursal = sucursal.direccion;
                respuesta.origen = origen.direccion+' '+origen.municipio+' '+origen.estado+' '+origen.pais;
                respuesta.sucursal = sucursal.nombre;
                respuesta.tel2Sucursal = sucursal.telefono_2;
                respuesta.telSucursal = sucursal.telefono_1;
                respuesta.pasajero = cliente.nombre+' '+cliente.apellidoPaterno+' '+cliente.apellidoMaterno;
                respuesta.direccionMatriz = sucursalMX[0].direccion+' '+sucursalMX[0].ciudad+', '+sucursalMX[0].estado+', '+sucursalMX[0].pais;
                respuesta.direccionMatrizEU = sucursalUS[0].direccion+' '+sucursalUS[0].ciudad+', '+sucursalUS[0].estado+', '+sucursalUS[0].pais;
                respuesta.telefonoMatriz = sucursalMX[0].telefono_1+'\n'+sucursalMX[0].telefono_2;
                respuesta.telefonoMatrizEU = sucursalUS[0].telefono_1+'\n'+sucursalUS[0].telefono_2;
                respuesta.frase = configuracion[0].frase;
                respuesta.permiso = configuracion[0].informacionPermiso;
                respuesta.politicas = configuracion[0].politicas;
                respuesta.imagenPublicidad = imagenBoleto[0].imagen;

                res.json(respuesta);
            } catch (error) {
                res.json(error);
            }
            break;
        case 'datosVenta':
            try {
                let id = req.params.value;
                let venta = await Venta.findById(id);
                let cliente = await Cliente.findById(venta.cliente);              
                 
                let fecha = venta.fecha;
                 
                let origen = await Origen.findById(venta.origen);
                
                let destino = await Origen.findById(venta.destino);

                let response = {
                    idViaje: id,
                    fecha: fecha,
                    nameCliente: `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
                    origen: `${origen.nombre}`,
                    destino: `${destino.nombre}`,
                    idViaje: venta.idVenta,
                    asiento: venta.numeroAsiento
                };

                res.json(response);
                              
            } catch (error) {
                res.json(error);
            }
            break;
        case 'modificarVentas':
            try {
                let respuesta = [];
                let ventas = await Venta.find({activo: 'true'});
                let vendedores = await Usuario.find();
                let clientes = await Cliente.find();
                let origenesYdestinos = await Origen.find();
                for (let i = 0; i < ventas.length; i++) {
                    let vendedor = await getValueModificarVentas(vendedores, ventas[i].vendedor);
                    let cliente = await getValueModificarVentas(clientes, ventas[i].cliente);
                    let origen = await getValueModificarVentas(origenesYdestinos, ventas[i].origen);
                    let destino = await getValueModificarVentas(origenesYdestinos, ventas[i].destino);
                    respuesta.push({
                        _id: ventas[i]._id,
                        folio: `${vendedor.prefijoFolio}-${ventas[i].folio}`,
                        cliente: `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
                        razon: ventas[i].razon,
                        descuento: ventas[i].descuento,
                        tipoDeCambio: ventas[i].tipoCambio,
                        origen: origen.nombre,
                        destino: destino.nombre,
                        idViaje: ventas[i].idVenta,
                        dia: ventas[i].fecha,
                        fechaDeVenta: ventas[i].fechaDeVenta ? convertDate(ventas[i].fechaDeVenta) : '',
                        numeroAsiento: ventas[i].numeroAsiento,
                        status: ventas[i].viajado
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
    /*const venta = await Venta.findById(req.params.id);
    res.json(venta);*/
});

router.get('/:idUsuario/:opc/:Boletos', async (req, res) =>{ //Obtiene los boletos para el corte
    switch (req.params.opc) {
        case 'folio':
            try {
                let respuesta = [];
                let vendedores = await Usuario.find({prefijoFolio: req.params.idUsuario, activo: 'true'});
                if(vendedores.length > 0){
                    let idVendedor = vendedores[0]._id;
                    let ventas = await Venta.find({folio: req.params.Boletos, vendedor: idVendedor, activo: 'true'});
                    let origenesYdestinos = await Origen.find();
                    if(ventas.length > 0){
                        for (let i = 0; i < ventas.length; i++) {
                            let clientes = await Cliente.findById(ventas[i].cliente);
                            let origen = await getValueModificarVentas(origenesYdestinos, ventas[i].origen);
                            let destino = await getValueModificarVentas(origenesYdestinos, ventas[i].destino);
                            let reasignacion = '';
                            if(ventas[i].idVentasReasignacion){
                                reasignacion = 'Reasignación';
                            }
                            respuesta.push({
                                _id: ventas[i]._id,
                                folio: `${vendedores[0].prefijoFolio}-${ventas[i].folio} ${reasignacion}`,
                                cliente: `${clientes.nombre} ${clientes.apellidoPaterno} ${clientes.apellidoMaterno}`,
                                razon: ventas[i].razon,
                                descuento: ventas[i].descuento,
                                tipoDeCambio: ventas[i].tipoCambio,
                                origen: origen.nombre,
                                destino: destino.nombre,
                                idViaje: ventas[i].idVenta,
                                dia: ventas[i].fecha,
                                fechaDeVenta: ventas[i].fechaDeVenta ? convertDate(ventas[i].fechaDeVenta) : '',
                                numeroAsiento: ventas[i].numeroAsiento,
                                status: ventas[i].viajado
                            });
                        }
                    }
                    
                    res.json(respuesta);
                }else{
                    res.json(respuesta);
                }
                
            } catch (error) {
                res.json(error);
            }
            break;
        case 'folioViajados':
            
            break;
        case 'fechaViaje':
            try {
                let respuesta = [];
                let ventas = {};
                //Primero sacamos si el usuario es admin
                let usuario = await Usuario.findById(req.params.Boletos); //Boletos es el Id de usuario
                
                if(usuario.seguridad != 'Admin' && usuario.seguridad != 'Viajes'){
                    ventas = await Venta.find({fecha: req.params.idUsuario, activo: 'true', vendedor: req.params.Boletos, viajado: 'true'});//idUsuario es la fecha
                }else{
                    ventas = await Venta.find({fecha: req.params.idUsuario, activo: 'true', viajado: 'true'});//idUsuario es la fecha
                }

                let vendedores = await Usuario.find();
                let clientes = await Cliente.find();
                let origenesYdestinos = await Origen.find();
                for (let i = 0; i < ventas.length; i++) {
                    let vendedor = await getValueModificarVentas(vendedores, ventas[i].vendedor);
                    let cliente = await getValueModificarVentas(clientes, ventas[i].cliente);
                    let origen = await getValueModificarVentas(origenesYdestinos, ventas[i].origen);
                    let destino = await getValueModificarVentas(origenesYdestinos, ventas[i].destino);
                    respuesta.push({
                        _id: ventas[i]._id,
                        folio: `${vendedor.prefijoFolio}-${ventas[i].folio}`,
                        cliente: `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
                        clienteName: `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
                        vendedorName: `${vendedor.nombre} ${vendedor.apellidoPaterno} ${vendedor.apellidoMaterno}`,
                        razon: ventas[i].razon,
                        descuento: ventas[i].descuento,
                        tipoDeCambio: ventas[i].tipoCambio,
                        origen: origen.nombre,
                        destino: destino.nombre,
                        idViaje: ventas[i].idVenta,
                        dia: ventas[i].fecha,
                        fechaDeVenta: ventas[i].fechaDeVenta ? convertDate(ventas[i].fechaDeVenta) : '',
                        numeroAsiento: ventas[i].numeroAsiento,
                        asiento: ventas[i].numeroAsiento,
                        status: ventas[i].viajado
                    });
                }
                res.json(respuesta);
            } catch (error) {
                res.json(error);
            }
            break;
        case 'Pagados':
            try {
                let respuesta = [];
                let totales = {
                    subtotalMXN: 0,
                    subtotalUS: 0,
                    comisionesMXN: 0,
                    comisionesUS: 0,
                    totalMXN: 0,
                    totalUS: 0
                };
                const venta = await Venta.find({vendedor: req.params.idUsuario, statePagado: 'true', activo: 'true'});
                let usuario = await Usuario.findById(req.params.idUsuario);
                let comisionDollares = parseFloat(usuario.comision);
                let dollar = await Dollar.find();
                let precioDollar = parseFloat(dollar[0].precioDollar);
                let comisionMXN = comisionDollares*precioDollar;
                let origenes = await Origen.find();
                let origen = null;
                let destino = null;

                //Obtener los usuarios
                let usuarios = await Usuario.find();

                //let modificacionCorte = await ModificacionCorte.find({idVenta: '5ed07fbe880cda26ac2159a0'});
                let modificacion = '';
                for (let i = 0; i < venta.length; i++) {
                    let cliente = await Cliente.findById(venta[i].cliente);
                    //Obtener el id del clinte que hizo modificacion
                    let modificacionCorte = await ModificacionCorte.find({idVenta: venta[i]._id});
                    if(modificacionCorte.length == 0){
                        modificacion = ''
                    }else{
                        modificacion = await getUsuario(modificacionCorte[0].idUsuario, usuarios);
                    }
                    let montoMXN = '0.00';
                    let montoUS = '0.00';
                    let tipo = '';
                    if(venta[i].tipoCambio == 'MX'){
                        montoMXN = venta[i].total;
                        totales.subtotalMXN += parseFloat(venta[i].total);
                        totales.comisionesMXN += comisionMXN;
                    }else{
                        montoUS = venta[i].total;
                        totales.subtotalUS += parseFloat(venta[i].total);
                        totales.comisionesUS += comisionDollares;
                    }
                    if(venta[i].tipo == 'Adulto'){
                        tipo = 'A';
                    }else if(venta[i].tipo == 'Niño'){
                        tipo = 'N'
                    }else{
                        tipo = 'I'
                    }
                    origen = await getOrigenDestino(venta[i].origen, origenes);
                    destino = await getOrigenDestino(venta[i].destino, origenes);
                    respuesta[i] = {
                        '_id': venta[i]._id,
                        'cliente': `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
                        'folio': `${usuario.prefijoFolio}-${venta[i].folio}`,
                        'origen':`${origen.municipio} ${origen.estado} ${origen.pais}`,
                        'destino': `${destino.municipio} ${destino.estado} ${destino.pais}`,
                        'fecha': venta[i].fecha,
                        'estado': 'pagado',
                        'montoMXN': montoMXN,
                        'montoUS': montoUS,
                        'tipo': tipo,
                        'usuario': modificacion,
                        'type': 'Ventas',
                        'pago': ''
                    };
                }
                totales.totalMXN = parseFloat(totales.subtotalMXN)-parseFloat(totales.comisionesMXN);
                totales.totalUS = parseFloat(totales.subtotalUS)-parseFloat(totales.comisionesUS);
                res.json({respuesta, totales});
            } catch (error) {
                res.json(error);
            }
            break;
        case 'NoPagados':
            try {
                let respuesta = [];
                let totales = {
                    subtotalMXN: 0,
                    subtotalUS: 0,
                    comisionesMXN: 0,
                    comisionesUS: 0,
                    totalMXN: 0,
                    totalUS: 0
                };
                const venta = await Venta.find({vendedor: req.params.idUsuario, statePagado: 'false', activo: 'true'});
                let usuario = await Usuario.findById(req.params.idUsuario);
                let comisionDollares = parseFloat(usuario.comision);
                let dollar = await Dollar.find();
                let origenes = await Origen.find();
                let precioDollar = parseFloat(dollar[0].precioDollar);
                let comisionMXN = comisionDollares*precioDollar;
                //res.json({'comisionDollares': comisionDollares, 'comisionMXN': comisionMXN});
                let origen = null;
                let destino = null;
                let usuarios = await Usuario.find();
                let modificacion = '';
                for (let i = 0; i < venta.length; i++) {
                    origen = await getOrigenDestino(venta[i].origen, origenes);
                    destino = await getOrigenDestino(venta[i].destino, origenes);
                    let cliente = await Cliente.findById(venta[i].cliente);
                    let montoMXN = '0.00';
                    let montoUS = '0.00';
                    let tipo = '';
                    let modificacionCorte = await ModificacionCorte.find({idVenta: venta[i]._id});
                    if(modificacionCorte.length == 0){
                        modificacion = ''
                    }else{
                        modificacion = await getUsuario(modificacionCorte[0].idUsuario, usuarios);
                    }
                    if(venta[i].tipoCambio == 'MX'){
                        montoMXN = venta[i].total;
                        totales.subtotalMXN += parseFloat(venta[i].total);
                        totales.comisionesMXN += parseFloat(comisionMXN);
                    }else{
                        montoUS = venta[i].total;
                        totales.subtotalUS += parseFloat(venta[i].total);
                        totales.comisionesUS += parseFloat(comisionDollares);
                    }
                    if(venta[i].tipo == 'Adulto'){
                        tipo = 'A';
                    }else if(venta[i].tipo == 'Niño'){
                        tipo = 'N'
                    }else{
                        tipo = 'I'
                    }
                    respuesta[i] = {
                        '_id': venta[i]._id,
                        'cliente': `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
                        'folio': `${usuario.prefijoFolio}-${venta[i].folio}`,
                        'origen':`${origen.municipio} ${origen.estado} ${origen.pais}`,
                        'destino': `${destino.municipio} ${destino.estado} ${destino.pais}`,
                        'fecha': venta[i].fecha,
                        'estado': 'no pagado',
                        'montoMXN': montoMXN,
                        'montoUS': montoUS,
                        'tipo': tipo,
                        'usuario': modificacion,
                        'type': 'Ventas',
                        'pago': ''
                    };
                }

                respuesta.sort((a, b) => {
                    const folioA = parseInt(a.folio.split('-')[1]);
                    const folioB = parseInt(b.folio.split('-')[1]);
                    return folioA - folioB
                });
                totales.totalMXN = parseFloat(totales.subtotalMXN)-parseFloat(totales.comisionesMXN);
                totales.totalUS = parseFloat(totales.subtotalUS)-parseFloat(totales.comisionesUS);
                res.json({respuesta, totales});
            } catch (error) {
                res.json(error);
            }
            break;
        case 'Todo':
            try {
                let respuesta = [];
                let totales = {
                    subtotalMXN: 0,
                    subtotalUS: 0,
                    comisionesMXN: 0,
                    comisionesUS: 0,
                    totalMXN: 0,
                    totalUS: 0
                };
                const venta = await Venta.find({vendedor: req.params.idUsuario, activo: 'true'});
                let usuario = await Usuario.findById(req.params.idUsuario);
                let comisionDollares = parseFloat(usuario.comision);
                let dollar = await Dollar.find();
                let origenes = await Origen.find();
                let precioDollar = parseFloat(dollar[0].precioDollar);
                let comisionMXN = comisionDollares*precioDollar;
                let usuarios = await Usuario.find();
                //res.json({'comisionDollares': comisionDollares, 'comisionMXN': comisionMXN});
                let origen = null;
                let destino = null;
                let modificacion = '';
                
                for (let i = 0; i < venta.length; i++) {
                    origen = await getOrigenDestino(venta[i].origen, origenes);
                    destino = await getOrigenDestino(venta[i].destino, origenes);
                    let cliente = await Cliente.findById(venta[i].cliente);
                    let montoMXN = '0.00';
                    let montoUS = '0.00';
                    let tipo = '';
                    let estado = '';
                    let modificacionCorte = await ModificacionCorte.find({idVenta: venta[i]._id});
                    if(modificacionCorte.length == 0){
                        modificacion = ''
                    }else{
                        modificacion = await getUsuario(modificacionCorte[0].idUsuario, usuarios);
                    }
                    if(venta[i].tipoCambio == 'MX'){
                        montoMXN = venta[i].total;
                        totales.subtotalMXN += parseFloat(venta[i].total);
                        totales.comisionesMXN += comisionMXN;
                    }else{
                        montoUS = venta[i].total;
                        totales.subtotalUS += parseFloat(venta[i].total);
                        totales.comisionesUS += comisionDollares;
                    }
    
                    if(venta[i].tipo == 'Adulto'){
                        tipo = 'A';
                    }else if(venta[i].tipo == 'Niño'){
                        tipo = 'N'
                    }else{
                        tipo = 'I'
                    }
    
                    if(venta[i].statePagado == 'true'){
                        estado = 'pagado';
                    }else{
                        estado = 'no pagado';
                    }
    
                    respuesta[i] = {
                        '_id': venta[i]._id,
                        'cliente': `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
                        'folio': `${usuario.prefijoFolio}-${venta[i].folio}`,
                        'origen':`${origen.municipio} ${origen.estado} ${origen.pais}`,
                        'destino': `${destino.municipio} ${destino.estado} ${destino.pais}`,
                        'fecha': venta[i].fecha,
                        'estado': estado,
                        'montoMXN': montoMXN,
                        'montoUS': montoUS,
                        'tipo': tipo,
                        'usuario': modificacion,
                        'type': 'Ventas',
                        'pago': ''
                    };
                }
                totales.totalMXN = parseFloat(totales.subtotalMXN)-parseFloat(totales.comisionesMXN);
                totales.totalUS = parseFloat(totales.subtotalUS)-parseFloat(totales.comisionesUS);
                res.json({respuesta, totales});
            } catch (error) {
                res.json(error);
            }
            break;
        default:
            ////// NUEVO CORTE *DEVOLVEMOS TODOS LOS BOLETOS Y RESERVACIONES EN UN RANGO DE FECHA
            ////// REQ.PARAMS.OPC => FECHA INICIAL
            ////// REQ.PARAMS.BOLETOS => FECHA FINAL
            ////// REQ.PARAMS.idUsuario => Id del usuario
            
    }
});

router.get('/:seguridad/:idUsuario/:opc/:value', async (req, res) =>{ //Para mostrar ventas concluidas según el usuario
    switch (req.params.idUsuario) {
        case 'clienteModificarVenta':
            try {
                let respuesta = [];
                let clientes = [];

                let rNombre = req.params.seguridad;
                let rApaterno = req.params.opc;
                let rAmaterno = req.params.value;

                if(req.params.seguridad != 'null' && req.params.opc != 'null' && req.params.value != 'null'){
                    clientes = await Cliente.find({nombre: rNombre, apellidoPaterno: rApaterno, apellidoMaterno: rAmaterno});
                }

                if(req.params.seguridad != 'null' && req.params.opc != 'null' && req.params.value == 'null'){
                    clientes = await Cliente.find({nombre: rNombre, apellidoPaterno: rApaterno});
                }

                if(req.params.seguridad != 'null' && req.params.opc == 'null' && req.params.value != 'null'){
                    clientes = await Cliente.find({nombre: rNombre, apellidoMaterno: rAmaterno});
                }

                if(req.params.seguridad != 'null' && req.params.opc == 'null' && req.params.value == 'null'){
                    clientes = await Cliente.find({ nombre: rNombre });
                }

                if(req.params.seguridad == 'null' && req.params.opc != 'null' && req.params.value != 'null'){
                    clientes = await Cliente.find({apellidoPaterno: rApaterno, apellidoMaterno: rAmaterno});
                }

                if(req.params.seguridad == 'null' && req.params.opc != 'null' && req.params.value == 'null'){
                    clientes = await Cliente.find({ apellidoPaterno: rApaterno });
                }

                if(req.params.seguridad == 'null' && req.params.opc == 'null' && req.params.value != 'null'){
                    clientes = await Cliente.find({ apellidoMaterno: rAmaterno });
                }

                let origenes = await Origen.find();
                let vendedores = await Usuario.find();

                if(clientes.length > 0){
                    //res.json(clientes);
                    for (let i = 0; i < clientes.length; i++) {
                        let ventas = await Venta.find({activo: 'true',  cliente: clientes[i]._id});
                        //res.json(ventas);
                        for (let j = 0; j < ventas.length; j++) {
                            let origen = await getOrigenDestino(ventas[j].origen, origenes);
                            let destino = await getOrigenDestino(ventas[j].destino, origenes);
                            let vendedor = await getVendedor(ventas[j].vendedor, vendedores);
                            let reasignacion = '';
                            if(ventas[j].idVentasReasignacion){
                                reasignacion = 'Reasignación';
                            }
                            respuesta.push({
                                _id: ventas[j]._id,
                                folio: `${vendedor.prefijoFolio}-${ventas[j].folio} ${reasignacion}`,
                                razon: ventas[j].razon,
                                descuento: ventas[j].descuento,
                                cliente: `${clientes[i].nombre} ${clientes[i].apellidoPaterno} ${clientes[i].apellidoMaterno}`,
                                origen: origen.nombre,
                                destino: destino.nombre,
                                dia: ventas[j].fecha,
                                fechaDeVenta: ventas[j].fechaDeVenta ? convertDate(ventas[j].fechaDeVenta) : '',
                                numeroAsiento: ventas[j].numeroAsiento,
                                tipoDeCambio: ventas[j].tipoCambio
                            });
                        }
                    }
                }
                
                res.json(respuesta);
            } catch (error) {
                res.json(error);
            }
            break;
        case 'clienteVentasConcluidas':
            try {
                let respuesta = [];
                let clientes = [];

                let rNombre = req.params.seguridad;
                let rApaterno = req.params.opc;
                let rAmaterno = req.params.value;

                if(req.params.seguridad != 'null' && req.params.opc != 'null' && req.params.value != 'null'){
                    clientes = await Cliente.find({nombre: rNombre, apellidoPaterno: rApaterno, apellidoMaterno: rAmaterno});
                }

                if(req.params.seguridad != 'null' && req.params.opc != 'null' && req.params.value == 'null'){
                    clientes = await Cliente.find({nombre: rNombre, apellidoPaterno: rApaterno});
                }

                if(req.params.seguridad != 'null' && req.params.opc == 'null' && req.params.value != 'null'){
                    clientes = await Cliente.find({nombre: rNombre, apellidoMaterno: rAmaterno});
                }

                if(req.params.seguridad != 'null' && req.params.opc == 'null' && req.params.value == 'null'){
                    clientes = await Cliente.find({ nombre: rNombre });
                }

                if(req.params.seguridad == 'null' && req.params.opc != 'null' && req.params.value != 'null'){
                    clientes = await Cliente.find({apellidoPaterno: rApaterno, apellidoMaterno: rAmaterno});
                }

                if(req.params.seguridad == 'null' && req.params.opc != 'null' && req.params.value == 'null'){
                    clientes = await Cliente.find({ apellidoPaterno: rApaterno });
                }

                if(req.params.seguridad == 'null' && req.params.opc == 'null' && req.params.value != 'null'){
                    clientes = await Cliente.find({ apellidoMaterno: rAmaterno });
                }

                let origenes = await Origen.find();
                let vendedores = await Usuario.find();

                if(clientes.length > 0){
                    //res.json(clientes);
                    for (let i = 0; i < clientes.length; i++) {
                        let ventas = await Venta.find({activo: 'true',  cliente: clientes[i]._id, viajado: 'true'});
                        //res.json(ventas);
                        for (let j = 0; j < ventas.length; j++) {
                            let origen = await getOrigenDestino(ventas[j].origen, origenes);
                            let destino = await getOrigenDestino(ventas[j].destino, origenes);
                            let vendedor = await getVendedor(ventas[j].vendedor, vendedores);
                            respuesta.push({
                                _id: ventas[j]._id,
                                folio: `${vendedor.prefijoFolio}-${ventas[j].folio}`,
                                razon: ventas[j].razon,
                                descuento: ventas[j].descuento,
                                cliente: `${clientes[i].nombre} ${clientes[i].apellidoPaterno} ${clientes[i].apellidoMaterno}`,
                                clienteName: `${clientes[i].nombre} ${clientes[i].apellidoPaterno} ${clientes[i].apellidoMaterno}`,
                                vendedorName: `${vendedor.nombre} ${vendedor.apellidoPaterno} ${vendedor.apellidoMaterno}`,
                                origen: origen.nombre,
                                destino: destino.nombre,
                                dia: ventas[j].fecha,
                                fechaDeVenta: ventas[j].fechaDeVenta ? convertDate(ventas[j].fechaDeVenta) : '',
                                numeroAsiento: ventas[j].numeroAsiento,
                                tipoDeCambio: ventas[j].tipoCambio,
                                idViaje: ventas[j].idVenta,
                                asiento: ventas[j].numeroAsiento,
                                status: ventas[j].viajado
                            });
                        }
                    }
                }
                res.json(respuesta);
            } catch (error) {
                res.json(error);
            }
            break;
        case 'folioViajados':
            try {
                let respuesta = [];
                let vendedores = {};
                let usuario = await Usuario.findById(req.params.value);
                
                if(usuario.seguridad != 'Admin' && usuario.seguridad != 'Viajes'){
                    vendedores = await Usuario.find({_id: usuario._id, prefijoFolio: req.params.seguridad, activo: 'true'});
                }else{
                    vendedores = await Usuario.find({prefijoFolio: req.params.seguridad, activo: 'true'});
                }
                
                let idVendedor = vendedores[0]._id;

                //res.json(vendedores);
                let ventas = await Venta.find({folio: req.params.opc, vendedor: idVendedor, activo: 'true',  viajado: 'true'});
                let origenesYdestinos = await Origen.find();
                for (let i = 0; i < ventas.length; i++) {
                    let clientes = await Cliente.findById(ventas[i].cliente);
                    let origen = await getValueModificarVentas(origenesYdestinos, ventas[i].origen);
                    let destino = await getValueModificarVentas(origenesYdestinos, ventas[i].destino);
                    respuesta.push({
                        _id: ventas[i]._id,
                        folio: `${vendedores[0].prefijoFolio}-${ventas[i].folio}`,
                        cliente: `${clientes.nombre} ${clientes.apellidoPaterno} ${clientes.apellidoMaterno}`,
                        clienteName: `${clientes.nombre} ${clientes.apellidoPaterno} ${clientes.apellidoMaterno}`,
                        vendedorName: `${vendedores[0].nombre} ${vendedores[0].apellidoPaterno} ${vendedores[0].apellidoMaterno}`,
                        razon: ventas[i].razon,
                        descuento: ventas[i].descuento,
                        tipoDeCambio: ventas[i].tipoCambio,
                        origen: origen.nombre,
                        destino: destino.nombre,
                        idViaje: ventas[i].idVenta,
                        dia: ventas[i].fecha,
                        fechaDeVenta: ventas[i].fechaDeVenta ? convertDate(ventas[i].fechaDeVenta) : '',
                        numeroAsiento: ventas[i].numeroAsiento,
                        asiento: ventas[i].numeroAsiento,
                        status: ventas[i].viajado
                    });
                }
                res.json(respuesta);
            } catch (error) {
                res.json(error);
            }
            break;
    
        default:
            if(req.params.seguridad != 'Admin' && req.params.seguridad != 'Viajes'){
                try {
                    let respuesta = [];
                    let ventas = await Venta.find({viajado: 'true', activo: 'true', vendedor: req.params.idUsuario}).sort({ $natural: -1 }).limit(10);;
                    let usuario = await Usuario.findById(req.params.idUsuario);
                    for (let i = 0; i < ventas.length; i++) {
                        let cliente = await Cliente.findById(ventas[i].cliente);
                        let origen = await Origen.findById(ventas[i].origen);
                        let destino = await Origen.findById(ventas[i].destino);
                        respuesta.push({
                            '_id': ventas[i]._id,
                            'folio': `${usuario.prefijoFolio}-${ventas[i].folio}`,
                            'vendedorName': `${usuario.nombre} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno}`,
                            'clienteName': `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
                            'razon': ventas[i].razon,
                            'descuento': ventas[i].descuento,
                            'origen': `${origen.nombre} ${origen.municipio} ${origen.estado}`,
                            'destino': `${destino.nombre} ${destino.municipio} ${destino.estado}`,
                            'dia': ventas[i].fecha,
                            'fechaDeVenta': ventas[i].fechaDeVenta ? convertDate(ventas[i].fechaDeVenta) : '',
                            'asiento': ventas[i].numeroAsiento
                        });
                    }
                    res.json(respuesta);
                } catch (error) {
                    res.json(error);
                }
            }else{
                try {
                    let respuesta = [];
                    let ventas = await Venta.find({viajado: 'true', activo: 'true'}).sort({ $natural: -1 }).limit(10);;
                    for (let i = 0; i < ventas.length; i++) {
                        let cliente = await Cliente.findById(ventas[i].cliente);
                        let origen = await Origen.findById(ventas[i].origen);
                        let destino = await Origen.findById(ventas[i].destino);
                        let usuario = await Usuario.findById(ventas[i].vendedor);
                        respuesta.push({
                            '_id': ventas[i]._id,
                            'folio': `${usuario.prefijoFolio}-${ventas[i].folio}`,
                            'vendedorName': `${usuario.nombre} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno}`,
                            'clienteName': `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
                            'razon': ventas[i].razon,
                            'descuento': ventas[i].descuento,
                            'origen': `${origen.nombre} ${origen.municipio} ${origen.estado}`,
                            'destino': `${destino.nombre} ${destino.municipio} ${destino.estado}`,
                            'dia': ventas[i].fecha,
                            'fechaDeVenta': ventas[i].fechaDeVenta ? convertDate(ventas[i].fechaDeVenta) : '',
                            'asiento': ventas[i].numeroAsiento
                        });
                    }
                    res.json(respuesta);
                } catch (error) {
                    res.json(error);
                }
            }
            break;
    }
});

// idVendedor / fecha inicial aaaa-mm-dd / fecha final aaaa-mm-dd / pagado (true/false) / opcion (Corte Ventas || corteReservacion)
router.get('/:idUsuario/:fi/:ff/:pagado/:opc', async (req, res) => {
    switch (req.params.opc) {
        case 'corteVentas':
            try {
                //let usuario = await Usuario.findById(req.params.Boletos);
                let respuesta = [];
                let totales = {
                    subtotalMXN: 0,
                    subtotalUS: 0,
                    comisionesMXN: 0,
                    comisionesUS: 0,
                    totalMXN: 0,
                    totalUS: 0
                };
                let idUsuario = req.params.idUsuario;
                let fi = `${req.params.fi}T00:00:00.000Z`;
                let ff = `${req.params.ff}T23:59:59.999Z`;
                let pagado = req.params.pagado;

                let usuario = await Usuario.findById(idUsuario);
                let comisionDollares = parseFloat(usuario.comision);
                let dollar = await Dollar.find();
                let precioDollar = parseFloat(dollar[0].precioDollar);
                let comisionMXN = comisionDollares*precioDollar;
                let origenes = await Origen.find();
                let origen = '';
                let destino = '';
                let cliente = ''; 
                let spagado = '';
                let modificacion = '';
                let tipo = '';

                let ven = await Venta.find({
                    $and: [
                        {statePagado: pagado},
                        {activo: "true"},
                        {vendedor: idUsuario}, 
                        {fechaDeVenta: {$gte: new Date(fi), $lt: new Date(ff)} } 
                    ]
                });

                if(pagado == 'true'){
                    spagado = 'pagado';
                }else{
                    spagado = 'no pagado';
                }

                for (let i = 0; i < ven.length; i++) {
                    origen = await getOrigenDestino(ven[i].origen, origenes);
                    destino = await getOrigenDestino(ven[i].destino, origenes);
                    cliente = await Cliente.findById(ven[i].cliente);
                    if(ven[i].tipoCambio == 'MX'){
                        totales.subtotalMXN += parseFloat(ven[i].total);
                        totales.comisionesMXN += parseFloat(comisionMXN);
                    }else{
                        totales.subtotalUS += parseFloat(ven[i].total);
                        totales.comisionesUS += parseFloat(comisionDollares);
                    }
                    
                    let modificacionCorte = await ModificacionCorte.find({idVenta: ven[i]._id});
                    
                    if(modificacionCorte.length == 0){
                        modificacion = ''
                    }else{
                        let usuarios = await Usuario.find();
                        modificacion = await getUsuario(modificacionCorte[0].idUsuario, usuarios);
                    }

                    if(ven[i].tipo == 'adulto' || ven[i].tipo == 'Adulto'){
                        tipo = 'A';
                    }else if(ven[i].tipo == 'nino' || ven[i].tipo == 'Niño'){
                        tipo = 'N'
                    }else{
                        tipo = 'I'
                    }

                    respuesta.push({
                        _id: ven[i]._id,
                        type: tipo,
                        pago: '',
                        folio: `${usuario.prefijoFolio}-${ven[i].folio}`,
                        cliente: `${cliente.nombre} ${cliente.apellidoPaterno}`,
                        origen: `${origen.municipio} ${origen.estado} ${origen.pais}`,
                        destino: `${destino.municipio} ${destino.estado} ${destino.pais}`,
                        fecha: ven[i].fecha,
                        fechaDeVenta: ven[i].fechaDeVenta ? convertDate(ven[i].fechaDeVenta) : '',
                        montoMXN: (ven[i].tipoCambio == 'MXN'? (`${ven[i].total}`) : 0 ),
                        //montoMXN: (ven[i].tipoCambio == 'MXN'? (`${ven[i].total}`) : `${parseFloat(ven[i].total)*precioDollar}` ),
                        montoUS: (ven[i].tipoCambio == 'US'? (`${ven[i].total}`) : 0 ),
                        estado: spagado,
                        usuario: modificacion,
                    });
                }

                // Ordenando el array por folio
                respuesta.sort((a, b) => {
                    const folioA = a.folio;
                    const folioB = b.folio
                    if (folioA < folioB) {
                      return -1;
                    }
                    if (folioA > folioB) {
                      return 1;
                    }
                    return 0;
                });

                totales.totalMXN = parseFloat(totales.subtotalMXN)-parseFloat(totales.comisionesMXN);
                totales.totalUS = parseFloat(totales.subtotalUS)-parseFloat(totales.comisionesUS);

                res.json({respuesta, totales}); 
                
            } catch (error) {
                res.json(error);
            }
            break;
        case 'corteReservacion':
            try {
                //Aqui voy
                //let usuario = await Usuario.findById(req.params.Boletos);
                let respuesta = [];
                let totales = {
                    subtotalMXN: 0,
                    subtotalUS: 0,
                    comisionesMXN: 0,
                    comisionesUS: 0,
                    totalMXN: 0,
                    totalUS: 0
                };
                let idUsuario = req.params.idUsuario;
                let fi = `${req.params.fi}T00:00:00.000Z`;
                let ff = `${req.params.ff}T23:59:59.999Z`;
                let pagado = req.params.pagado;

                let usuario = await Usuario.findById(idUsuario);
                let comisionDollares = parseFloat(usuario.comision);
                let dollar = await Dollar.find();
                let precioDollar = parseFloat(dollar[0].precioDollar);
                let comisionMXN = comisionDollares*precioDollar;
                let origenes = await Origen.find();
                let origen = '';
                let destino = '';
                let cliente = ''; 
                let spagado = '';
                let modificacion = '';
                let tipo = '';

                //Sacamos los anticipos sin pagar/ ya pagados

                let ven = await Reservacion.find({
                    $and: [
                        //{statePagado: pagado},
                        {statePagadoAnticipo: pagado},
                        {activo: "true"}, 
                        {vendedor: idUsuario}, 
                        {fechaDeVenta: {$gte: new Date(fi), $lt: new Date(ff)} } 
                    ]
                });

                //res.json(ven);

                if(pagado == 'true'){
                    spagado = 'pagado';
                }else{
                    spagado = 'no pagado';
                }

                for (let i = 0; i < ven.length; i++) {
                    origen = await getOrigenDestino(ven[i].origen, origenes);
                    destino = await getOrigenDestino(ven[i].destino, origenes);
                    cliente = await Cliente.findById(ven[i].cliente);
                    if(ven[i].tipoCambio == 'MX'){
                        totales.subtotalMXN += parseFloat(ven[i].anticipo);
                        totales.comisionesMXN += parseFloat(comisionMXN);
                    }else{
                        totales.subtotalUS += parseFloat(ven[i].anticipo);
                        totales.comisionesUS += parseFloat(comisionDollares);
                    }
                    
                    let modificacionCorte = await ModificacionCorte.find({idVenta: ven[i]._id});
                    
                    if(modificacionCorte.length == 0){
                        modificacion = ''
                    }else{
                        let usuarios = await Usuario.find();
                        modificacion = await getUsuario(modificacionCorte[0].idUsuario, usuarios);
                    }

                    if(ven[i].tipo == 'adulto' || ven[i].tipo == 'Adulto'){
                        tipo = 'A';
                    }else if(ven[i].tipo == 'nino' || ven[i].tipo == 'Niño'){
                        tipo = 'N'
                    }else{
                        tipo = 'I'
                    }

                    respuesta.push({
                        _id: ven[i]._id,
                        type: 'Reservaciones',
                        pago: 'anticipo',
                        folio: `${usuario.prefijoFolio}-${ven[i].folio}`,
                        cliente: `${cliente.nombre} ${cliente.apellidoPaterno}`,
                        origen: `${origen.municipio} ${origen.estado} ${origen.pais}`,
                        destino: `${destino.municipio} ${destino.estado} ${destino.pais}`,
                        fecha: ven[i].fecha,
                        fechaDeVenta: ven[i].fechaDeVenta ? convertDate(ven[i].fechaDeVenta) : '',
                        montoMXN: (ven[i].tipoCambio == 'MXN'? (`${ven[i].anticipo}`) : 0 ),
                        //montoMXN: (ven[i].tipoCambio == 'MXN'? (`${ven[i].total}`) : `${parseFloat(ven[i].total)*precioDollar}` ),
                        montoUS: (ven[i].tipoCambio == 'US'? (`${ven[i].anticipo}`) : 0 ),
                        estado: spagado,
                        usuario: modificacion,
                    });
                }

                //Ahora sacamos los pagos sin pagar/ ya pagados
                
                let reservacionesSinPagar = await Reservacion.find({
                    $and: [
                        //{statePagado: pagado},
                        {activo: "true"}, 
                        {vendedor: idUsuario}, 
                        {fechaDeVenta: {$gte: new Date(fi), $lt: new Date(ff)} } 
                    ]
                });

                
                for (let i = 0; i < reservacionesSinPagar.length; i++) {
                    let pagos = await Pagos.find({id_Reservacion: reservacionesSinPagar[i]._id, statePagado: pagado});
                    let cliente = await Cliente.findById(reservacionesSinPagar[i].cliente);
                    let origen = await Origen.findById(reservacionesSinPagar[i].origen); 
                    let destino = await Origen.findById(reservacionesSinPagar[i].destino);
                    for (let j = 0; j < pagos.length; j++) {
                        let montoMXN = 0.0;
                        let montoUS = 0.0
                        let tipo = '';
                        if(reservacionesSinPagar[i].tipoCambio == 'MX'){
                            montoMXN = pagos[j].cantidad;
                            totales.subtotalMXN += parseFloat(pagos[j].cantidad);
                            //totales.comisionesMXN += parseFloat(comisionMXN);
                        }else{
                            montoUS = pagos[j].cantidad;
                            totales.subtotalUS += parseFloat(pagos[j].cantidad);
                            //totales.comisionesUS += parseFloat(comisionDollares);
                        }

                        if(reservacionesSinPagar[i].tipo == 'Adulto' || reservacionesSinPagar[i].tipo == 'adulto'){
                            tipo = 'A';
                        }else if(reservacionesSinPagar[i].tipo == 'Niño' || reservacionesSinPagar[i].tipo == 'nino'){
                            tipo = 'N'
                        }else{
                            tipo = 'I'
                        }
                        respuesta.push(
                            {
                                '_id': pagos[j]._id,
                                'cliente': `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
                                'folio': `${usuario.prefijoFolio}-${reservacionesSinPagar[i].folio} (Pago)`,
                                'origen': `${origen.municipio} ${origen.estado} ${origen.pais}`,
                                'destino': `${destino.municipio} ${destino.estado} ${destino.pais}`,
                                'fecha': reservacionesSinPagar[i].fecha,
                                'estado': spagado,
                                'montoMXN': montoMXN,
                                'montoUS': montoUS,
                                'tipo': tipo,
                                'type': 'Reservaciones',
                                'pago': 'abono'
                            }
                        );
                    }
                }

                totales.totalMXN = parseFloat(totales.subtotalMXN)-parseFloat(totales.comisionesMXN);
                totales.totalUS = parseFloat(totales.subtotalUS)-parseFloat(totales.comisionesUS);

                res.json({respuesta, totales}); 
                
            } catch (error) {
                res.json(error);
            }
            break;
    
        default:
            break;
    }
})


router.post('/', async (req, res)=>{
    const {cliente,tipo,razon,descuento,origen,destino,fecha,anio,diaDelAnio,horaSalida,numeroAsiento,statePagado,activo,idVenta,tipoCambio, total, vendedor, folio, viajado} = req.body;
    const venta= new Venta({cliente, tipo, razon,descuento,origen,destino,fecha,anio,diaDelAnio,horaSalida,numeroAsiento,statePagado,activo,idVenta,tipoCambio, total, vendedor, folio, viajado});
    await venta.save();
    res.json({status: 'VENTA GUARDADO!!!!!'});
});
router.put('/:value/:field', async (req, res) => {
    switch (req.params.field) {
        case 'cancelarVenta':
            try {
                let id = req.params.value;
                
                let venta = await Venta.findById(id);
                
                let origen = await Origen.findById(venta.origen);

                let destino = await Origen.findById(venta.destino);
                
                let idViaje = venta.idVenta;

                let viaje = await Viaje.findById(idViaje);
                
                let asiento = venta.numeroAsiento;

                let vendedor = await Usuario.findById(venta.vendedor);

                let cliente = await Cliente.findById(venta.cliente);
                
                let idCancelacion = `ca-${vendedor.prefijoFolio}-${venta.folio}`;
                
                //Primero procedemos a cambiar el status activo a false y completar el campo de fechaCancelacion
                let hoy = new Date();
                let dia = hoy.getDate();
                let mes = (hoy.getMonth()+1);
                let anio = hoy.getFullYear();
                mes = (mes<10)? '0'+mes : mes;
                let fecha = dia+'-'+mes+'-'+anio;
                
                await Venta.findOneAndUpdate(
                    { _id: id },
                    { activo : 'false', fechaCancelacion: fecha }
                );
                
                //Ahora procedemos a cambiar el asiento seleccionado en la venta a false
                switch (asiento) {
                    case '1':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_1 : 'false' }
                        );
                        break;
                    case '2':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_2 : 'false' }
                        );
                        break;
                    case '3':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_3 : 'false' }
                        );
                        break;
                    case '4':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_4 : 'false' }
                        );
                        break;
                    case '5':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_5 : 'false' }
                        );
                        break;
                    case '6':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_6 : 'false' }
                        );
                        break;
                    case '7':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_7 : 'false' }
                        );
                        break;
                    case '8':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_8 : 'false' }
                        );
                        break;
                    case '9':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_9 : 'false' }
                        );
                        break;
                    case '10':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_10 : 'false' }
                        );
                        break;
                    case '11':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_11 : 'false' }
                        );
                        break;
                    case '12':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_12 : 'false' }
                        );
                        break;
                    case '13':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_13 : 'false' }
                        );
                        break;
                    case '14':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_14 : 'false' }
                        );
                        break;
                    case '15':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_15 : 'false' }
                        );
                        break;
                    case '16':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_16 : 'false' }
                        );
                        break;
                    case '17':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_17 : 'false' }
                        );
                        break;
                    case '18':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_18 : 'false' }
                        );
                        break;
                    case '19':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_19 : 'false' }
                        );
                        break;
                    case '20':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_20 : 'false' }
                        );
                        break;
                    case '21':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_21 : 'false' }
                        );
                        break;
                    case '22':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_22 : 'false' }
                        );
                        break;
                    case '23':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_23 : 'false' }
                        );
                        break;
                    case '24':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_24 : 'false' }
                        );
                        break;
                    case '25':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_25 : 'false' }
                        );
                        break;
                    case '26':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_26 : 'false' }
                        );
                        break;
                    case '27':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_27 : 'false' }
                        );
                        break;
                    case '28':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_28 : 'false' }
                        );
                        break;
                    case '29':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_29 : 'false' }
                        );
                        break;
                    case '30':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_30 : 'false' }
                        );
                        break;
                    case '31':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_31 : 'false' }
                        );
                        break;
                    case '32':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_32 : 'false' }
                        );
                        break;
                    case '33':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_33 : 'false' }
                        );
                        break;
                    case '34':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_34 : 'false' }
                        );
                        break;
                    case '35':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_35 : 'false' }
                        );
                        break;
                    case '36':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_36 : 'false' }
                        );
                        break;
                    case '37':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_37 : 'false' }
                        );
                        break;
                    case '38':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_38 : 'false' }
                        );
                        break;
                    case '39':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_39 : 'false' }
                        );
                        break;
                    case '40':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_40 : 'false' }
                        );
                        break;
                    case '41':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_41 : 'false' }
                        );
                        break;
                    case '42':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_42 : 'false' }
                        );
                        break;
                    case '43':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_43 : 'false' }
                        );
                        break;
                    case '44':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_44 : 'false' }
                        );
                        break;
                    case '45':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_45 : 'false' }
                        );
                        break;
                    case '46':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_46 : 'false' }
                        );
                        break;
                    case '47':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_47 : 'false' }
                        );
                        break;
                    case '48':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_48 : 'false' }
                        );
                        break;                
                    default:
                        break;
                }

                //Procedemos a crear el folio de cancelación y guardar el motivo
                
                let motivo = req.body.motivo;

                let idVenta = id;
                
                let cancelacion = new Cancelaciones({idVenta, motivo, idCancelacion});
                await cancelacion.save();
                res.json({
                    folio: idCancelacion, 
                    vendedor: `${vendedor.nombre} ${vendedor.apellidoPaterno} ${vendedor.apellidoMaterno}`,
                    fechadecompra: venta.fecha,
                    fechadecancelacion: venta.fechaCancelacion,
                    cliente: `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
                    motivo: motivo,
                    origen: origen.nombre,
                    destino: destino.nombre,
                    fechadeviaje: viaje.fecha
                });
                
            } catch (error) {
                res.json(error);
            }
            break;
        case 'printVentasConcluidas':
            try{
                let respuesta = [];                
                let selectedRowKeys = req.body.selectedRowKeys;
                for (let i = 0; i < selectedRowKeys.length; i++) {
                    let venta = await Venta.findById(selectedRowKeys[i]);
                    let origen = await Origen.findById(venta.origen);
                    let destino = await Origen.findById(venta.destino);
                    let vendedor = await Usuario.findById(venta.vendedor);
                    let cliente = await Cliente.findById(venta.cliente);
                    respuesta.push({
                        folio: `${vendedor.prefijoFolio}-${venta.folio}`,
                        vendedorName: `${vendedor.nombre} ${vendedor.apellidoPaterno} ${vendedor.apellidoMaterno}`,
                        clienteName: `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
                        razon: venta.razon,
                        descuento: venta.descuento,
                        origen: origen.nombre,
                        destino: destino.nombre,
                        dia: venta.dia,
                        fechaDeVenta: venta.fechaDeVenta ? convertDate(venta.fechaDeVenta) : '',
                        asiento: venta.numeroAsiento
                    });
                }
                res.json(respuesta);
            }catch (error){
                res.json(error);
            }
            break;
                
        default:
            break;
    }
});
router.put('/:id/:value/:field', async (req, res) => {
    switch (req.params.field) {        
        case 'razon':
            await Venta.findOneAndUpdate(
                { _id: req.params.id },
                { razon : req.params.value }
            );
            res.json({status:'VENTA ACTUALIZADO!!!'});
            break;
        case 'activo':
            try {
                let hoy = new Date();
                let dia = hoy.getDate();
                let mes = (hoy.getMonth()+1);
                let anio = hoy.getFullYear();
                mes = (mes<10)? '0'+mes : mes;
                let fecha = dia+'-'+mes+'-'+anio;
                await Venta.findOneAndUpdate(
                    { _id: req.params.id },
                    { activo : req.params.value, fechaCancelacion: fecha }
                );
                res.json({status:'VENTA ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
            }
            break;
        case 'viajado':
            try {
                await Venta.findOneAndUpdate(
                    { _id: req.params.id },
                    { viajado : req.params.value }
                );
                res.json({status:'VENTA ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
            }
            break;
        case 'estado': //Pagado o no pagado
            try {
                await Venta.findOneAndUpdate(
                    { _id: req.params.id },
                    { statePagado : req.params.value }
                );
                res.json({status:'VENTA ACTUALIZADO!!!'});
            } catch (error) {
                res.json(error);
            }
            break;
        case 'cancelarVenta':
            try {
                let id = req.params.id;
                
                let venta = await Venta.findById(id);
                
                let origen = await Origen.findById(venta.origen);

                let destino = await Origen.findById(venta.destino);
                
                let idViaje = venta.idVenta;

                let viaje = await Viaje.findById(idViaje);
                
                let asiento = venta.numeroAsiento;                

                let vendedor = await Usuario.findById(venta.vendedor);

                let cliente = await Cliente.findById(venta.cliente);
                
                let idCancelacion = `ca-${vendedor.prefijoFolio}-${venta.folio}`;
                
                //Primero procedemos a cambiar el status activo a false y completar el campo de fechaCancelacion
                let hoy = new Date();

                let dia = hoy.getDate();
                let mes = (hoy.getMonth()+1);
                let anio = hoy.getFullYear();
                mes = (mes<10)? '0'+mes : mes;
                let fecha = dia+'-'+mes+'-'+anio;                
                
                await Venta.findOneAndUpdate(
                    { _id: id },
                    { activo : 'false', fechaCancelacion: fecha }
                );
                
                //Ahora procedemos a cambiar el asiento seleccionado en la venta a false
                switch (asiento) {
                    case '1':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_1 : 'false' }
                        );
                        break;
                    case '2':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_2 : 'false' }
                        );
                        break;
                    case '3':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_3 : 'false' }
                        );
                        break;
                    case '4':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_4 : 'false' }
                        );
                        break;
                    case '5':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_5 : 'false' }
                        );
                        break;
                    case '6':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_6 : 'false' }
                        );
                        break;
                    case '7':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_7 : 'false' }
                        );
                        break;
                    case '8':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_8 : 'false' }
                        );
                        break;
                    case '9':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_9 : 'false' }
                        );
                        break;
                    case '10':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_10 : 'false' }
                        );
                        break;
                    case '11':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_11 : 'false' }
                        );
                        break;
                    case '12':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_12 : 'false' }
                        );
                        break;
                    case '13':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_13 : 'false' }
                        );
                        break;
                    case '14':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_14 : 'false' }
                        );
                        break;
                    case '15':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_15 : 'false' }
                        );
                        break;
                    case '16':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_16 : 'false' }
                        );
                        break;
                    case '17':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_17 : 'false' }
                        );
                        break;
                    case '18':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_18 : 'false' }
                        );
                        break;
                    case '19':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_19 : 'false' }
                        );
                        break;
                    case '20':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_20 : 'false' }
                        );
                        break;
                    case '21':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_21 : 'false' }
                        );
                        break;
                    case '22':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_22 : 'false' }
                        );
                        break;
                    case '23':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_23 : 'false' }
                        );
                        break;
                    case '24':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_24 : 'false' }
                        );
                        break;
                    case '25':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_25 : 'false' }
                        );
                        break;
                    case '26':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_26 : 'false' }
                        );
                        break;
                    case '27':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_27 : 'false' }
                        );
                        break;
                    case '28':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_28 : 'false' }
                        );
                        break;
                    case '29':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_29 : 'false' }
                        );
                        break;
                    case '30':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_30 : 'false' }
                        );
                        break;
                    case '31':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_31 : 'false' }
                        );
                        break;
                    case '32':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_32 : 'false' }
                        );
                        break;
                    case '33':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_33 : 'false' }
                        );
                        break;
                    case '34':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_34 : 'false' }
                        );
                        break;
                    case '35':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_35 : 'false' }
                        );
                        break;
                    case '36':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_36 : 'false' }
                        );
                        break;
                    case '37':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_37 : 'false' }
                        );
                        break;
                    case '38':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_38 : 'false' }
                        );
                        break;
                    case '39':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_39 : 'false' }
                        );
                        break;
                    case '40':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_40 : 'false' }
                        );
                        break;
                    case '41':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_41 : 'false' }
                        );
                        break;
                    case '42':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_42 : 'false' }
                        );
                        break;
                    case '43':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_43 : 'false' }
                        );
                        break;
                    case '44':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_44 : 'false' }
                        );
                        break;
                    case '45':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_45 : 'false' }
                        );
                        break;
                    case '46':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_46 : 'false' }
                        );
                        break;
                    case '47':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_47 : 'false' }
                        );
                        break;
                    case '48':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_48 : 'false' }
                        );
                        break;                
                    default:
                        break;
                }

                //Procedemos a crear el folio de cancelación y guardar el motivo
                
                let motivo = req.params.value;

                let idVenta = id;
                
                let cancelacion = new Cancelaciones({idVenta, motivo, idCancelacion});
                await cancelacion.save();
                res.json({
                    folio: idCancelacion, 
                    vendedor: `${vendedor.nombre} ${vendedor.apellidoPaterno} ${vendedor.apellidoMaterno}`,
                    fechadecompra: venta.fecha,
                    fechadecancelacion: fecha,
                    cliente: `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
                    motivo: motivo,
                    origen: origen.nombre,
                    destino: destino.nombre,
                    fechadeviaje: viaje.fecha,
                    asiento: asiento
                });
                
            } catch (error) {
                res.json(error);
            }
            break;
        case 'cancelarReservacion':
            try {
                let id = req.params.id;
                
                let venta = await Reservacion.findById(id);
                
                let origen = await Origen.findById(venta.origen);

                let destino = await Origen.findById(venta.destino);
                
                let idViaje = venta.idVenta;

                let viaje = await Viaje.findById(idViaje);
                
                let asiento = venta.numeroAsiento;                

                let vendedor = await Usuario.findById(venta.vendedor);

                let cliente = await Cliente.findById(venta.cliente);
                
                let idCancelacion = `ca-${vendedor.prefijoFolio}-${venta.folio}`;
                
                //Primero procedemos a cambiar el status activo a false y completar el campo de fechaCancelacion
                let hoy = new Date();

                let dia = hoy.getDate();
                let mes = (hoy.getMonth()+1);
                let anio = hoy.getFullYear();
                mes = (mes<10)? '0'+mes : mes;
                let fecha = dia+'-'+mes+'-'+anio;                
                
                await Reservacion.findOneAndUpdate(
                    { _id: id },
                    { activo : 'false', fechaCancelacion: fecha }
                );
                
                //Ahora procedemos a cambiar el asiento seleccionado en la venta a false
                switch (asiento) {
                    case '1':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_1 : 'false' }
                        );
                        break;
                    case '2':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_2 : 'false' }
                        );
                        break;
                    case '3':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_3 : 'false' }
                        );
                        break;
                    case '4':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_4 : 'false' }
                        );
                        break;
                    case '5':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_5 : 'false' }
                        );
                        break;
                    case '6':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_6 : 'false' }
                        );
                        break;
                    case '7':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_7 : 'false' }
                        );
                        break;
                    case '8':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_8 : 'false' }
                        );
                        break;
                    case '9':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_9 : 'false' }
                        );
                        break;
                    case '10':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_10 : 'false' }
                        );
                        break;
                    case '11':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_11 : 'false' }
                        );
                        break;
                    case '12':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_12 : 'false' }
                        );
                        break;
                    case '13':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_13 : 'false' }
                        );
                        break;
                    case '14':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_14 : 'false' }
                        );
                        break;
                    case '15':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_15 : 'false' }
                        );
                        break;
                    case '16':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_16 : 'false' }
                        );
                        break;
                    case '17':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_17 : 'false' }
                        );
                        break;
                    case '18':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_18 : 'false' }
                        );
                        break;
                    case '19':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_19 : 'false' }
                        );
                        break;
                    case '20':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_20 : 'false' }
                        );
                        break;
                    case '21':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_21 : 'false' }
                        );
                        break;
                    case '22':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_22 : 'false' }
                        );
                        break;
                    case '23':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_23 : 'false' }
                        );
                        break;
                    case '24':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_24 : 'false' }
                        );
                        break;
                    case '25':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_25 : 'false' }
                        );
                        break;
                    case '26':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_26 : 'false' }
                        );
                        break;
                    case '27':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_27 : 'false' }
                        );
                        break;
                    case '28':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_28 : 'false' }
                        );
                        break;
                    case '29':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_29 : 'false' }
                        );
                        break;
                    case '30':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_30 : 'false' }
                        );
                        break;
                    case '31':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_31 : 'false' }
                        );
                        break;
                    case '32':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_32 : 'false' }
                        );
                        break;
                    case '33':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_33 : 'false' }
                        );
                        break;
                    case '34':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_34 : 'false' }
                        );
                        break;
                    case '35':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_35 : 'false' }
                        );
                        break;
                    case '36':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_36 : 'false' }
                        );
                        break;
                    case '37':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_37 : 'false' }
                        );
                        break;
                    case '38':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_38 : 'false' }
                        );
                        break;
                    case '39':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_39 : 'false' }
                        );
                        break;
                    case '40':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_40 : 'false' }
                        );
                        break;
                    case '41':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_41 : 'false' }
                        );
                        break;
                    case '42':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_42 : 'false' }
                        );
                        break;
                    case '43':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_43 : 'false' }
                        );
                        break;
                    case '44':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_44 : 'false' }
                        );
                        break;
                    case '45':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_45 : 'false' }
                        );
                        break;
                    case '46':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_46 : 'false' }
                        );
                        break;
                    case '47':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_47 : 'false' }
                        );
                        break;
                    case '48':
                        await Viaje.findOneAndUpdate(
                            { _id: idViaje },
                            { asiento_48 : 'false' }
                        );
                        break;                
                    default:
                        break;
                }

                //Procedemos a crear el folio de cancelación y guardar el motivo
                
                let motivo = req.params.value;

                let idVenta = id;
                
                let cancelacion = new Cancelaciones({idVenta, motivo, idCancelacion});
                await cancelacion.save();
                res.json({
                    folio: idCancelacion, 
                    vendedor: `${vendedor.nombre} ${vendedor.apellidoPaterno} ${vendedor.apellidoMaterno}`,
                    fechadecompra: venta.fecha,
                    fechadecancelacion: fecha,
                    cliente: `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
                    motivo: motivo,
                    origen: origen.nombre,
                    destino: destino.nombre,
                    fechadeviaje: viaje.fecha,
                    asiento: asiento
                });
                
            } catch (error) {
                res.json(error);
            }
            break;
        case 'asiento':

            break;
        default:
            break;
    }
});
//
router.put('/:idVenta/:idViaje/:noAsientoNew/:field', async (req, res) => { //idVenta => Es el id de la venta //idViaje => es el id del viaje
    //Primero verificamos que el usuario no haya escogido algún lugar que no esté liberado
    let idVenta, idViaje, noAsientoNew, field;
    idVenta = req.params.idVenta;
    idViaje = req.params.idViaje;
    noAsientoNew = req.params.noAsientoNew;
    field = req.params.field;
    //res.json({idVenta, idViaje, noAsientoNew, field});
    let capacidad = await Viaje.findById(req.params.idViaje);
    let verificar = null;
    noAsientoNew = parseInt(noAsientoNew);
    capacidad = parseInt(capacidad.capacidad);
    if(noAsientoNew > capacidad){
        res.json({status: `La capacidad del camión es ${capacidad} por favor selecciona otro asiento`, res: false});
    }else{
        //Segundo cambiamos el estado de los asientos en Asignar Asientos
        switch (req.params.noAsientoNew) {
            case '1':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_1: 'false' },
                    { asiento_1: 'true'}
                );
                break;
            case '2':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_2: 'false' },
                    { asiento_2: 'true'}
                );
                break;
            case '3':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_3: 'false' },
                    { asiento_3: 'true'}
                );
                break;
            case '4':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_4: 'false' },
                    { asiento_4: 'true'}
                );
                break;
            case '5':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_5: 'false' },
                    { asiento_5: 'true'}
                );
                break;
            case '6':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_6: 'false' },
                    { asiento_6: 'true'}
                );
                break;
            case '7':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_7: 'false' },
                    { asiento_7: 'true'}
                );
                break;
            case '8':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_8: 'false' },
                    { asiento_8: 'true'}
                );
                break;
            case '9':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_9: 'false' },
                    { asiento_9: 'true'}
                );
                    break;
            case '10':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_10: 'false' },
                    { asiento_10: 'true'}
                );
                break;
            case '11':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_11: 'false' },
                    { asiento_11: 'true'}
                );
                break;
            case '12':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_12: 'false' },
                    { asiento_12: 'true'}
                );
                break;
            case '13':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_13: 'false' },
                    { asiento_13: 'true'}
                );
                break;
            case '14':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_14: 'false' },
                    { asiento_14: 'true'}
                );
                break;
            case '15':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_15: 'false' },
                    { asiento_15: 'true'}
                );
                break;
            case '16':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_16: 'false' },
                    { asiento_16: 'true'}
                );
                break;
            case '17':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_17: 'false' },
                    { asiento_17: 'true'}
                );
                break;
            case '18':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_18: 'false' },
                    { asiento_18: 'true'}
                );
                break;
            case '19':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_19: 'false' },
                    { asiento_19: 'true'}
                );
                break;
            case '20':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_20: 'false' },
                    { asiento_20: 'true'}
                );
                break;
            case '21':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_21: 'false' },
                    { asiento_21: 'true'}
                );
                break;
            case '22':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_22: 'false' },
                    { asiento_22: 'true'}
                );
                break;
            case '23':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_23: 'false' },
                    { asiento_23: 'true'}
                );
                break;
            case '24':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_24: 'false' },
                    { asiento_24: 'true'}
                );
                break;
            case '25':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_25: 'false' },
                    { asiento_25: 'true'}
                );
                break;
            case '26':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_26: 'false' },
                    { asiento_26: 'true'}
                );
                break;
            case '27':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_27: 'false' },
                    { asiento_27: 'true'}
                );
                break;
            case '28':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_28: 'false' },
                    { asiento_28: 'true'}
                );
                break;
            case '29':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_29: 'false' },
                    { asiento_29: 'true'}
                );
                break;
            case '30':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_30: 'false' },
                    { asiento_30: 'true'}
                );
                break;
            case '31':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_31: 'false' },
                    { asiento_31: 'true'}
                );
                break;
            case '32':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_32: 'false' },
                    { asiento_32: 'true'}
                );
                break;
            case '33':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_33: 'false' },
                    { asiento_33: 'true'}
                );
                break;
            case '34':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_34: 'false' },
                    { asiento_34: 'true'}
                );
                break;
            case '35':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_35: 'false' },
                    { asiento_35: 'true'}
                );
                break;
            case '36':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_36: 'false' },
                    { asiento_36: 'true'}
                );
                break;
            case '37':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_37: 'false' },
                    { asiento_37: 'true'}
                );
                break;
            case '38':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_38: 'false' },
                    { asiento_38: 'true'}
                );
                break;
            case '39':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_39: 'false' },
                    { asiento_39: 'true'}
                );
                break;
            case '40':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_40: 'false' },
                    { asiento_40: 'true'}
                );
                break;
            case '41':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_41: 'false' },
                    { asiento_41: 'true'}
                );
                break;
            case '42':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_42: 'false' },
                    { asiento_42: 'true'}
                );
                break;
            case '43':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_43: 'false' },
                    { asiento_43: 'true'}
                );
                break;
            case '44':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_44: 'false' },
                    { asiento_44: 'true'}
                );
                break;
            case '45':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_45: 'false' },
                    { asiento_45: 'true'}
                );
                break;
            case '46':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_46: 'false' },
                    { asiento_46: 'true'}
                );
                break;
            case '47':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_47: 'false' },
                    { asiento_47: 'true'}
                );
                break;
            case '48':
                verificar = await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_48: 'false' },
                    { asiento_48: 'true'}
                );
                break;
            default:
                break;
        }
        if(verificar != null){ //Si verificar nos regresa null, significa que el asiento que tratamos de seleccionar no está disponible
            let asientoAnt = await Venta.findOneAndUpdate(
                { _id: req.params.idVenta },
                { numeroAsiento: req.params.noAsientoNew}
            );
            resetAsiento(asientoAnt.numeroAsiento, req.params.idViaje);
            res.json({status: 'El asiento esta disponible', res: true});
        }else{
            res.json({status: 'El asiento no esta disponible', res: false});
        }
    }
});
/////////////////////
router.put('/:id/:value/:field/:idUsuario/:hola', async (req, res) => {
    switch (req.params.field) {  
        case 'estado': //Pagado o no pagado
            try {
                await Venta.findOneAndUpdate(
                    { _id: req.params.id },
                    { statePagado : req.params.value }
                );
                let modificacion = await ModificacionCorte.find({idVenta: req.params.id});
                if(modificacion.length == 0){//Si no ha sido creada, procedemos a crearla
                    let idVenta = req.params.id;
                    let idUsuario = req.params.idUsuario;
                    const mcorte= new ModificacionCorte({idVenta,idUsuario});
                    await mcorte.save();
                }else{//En caso contrario lo modificamos
                    await ModificacionCorte.findOneAndUpdate(
                        { idVenta: req.params.id },
                        { idUsuario : req.params.idUsuario }
                    );
                }
                //res.json(modificacion);
                res.json({status:'VENTA ACTUALIZADO!!!'});
            } catch (error) {
                res.json(error);
            }
            break;
    }
});
/** PARA MODIFICAR LAS FECHAS Y ASIENTOS EN VENTA Y ASIGNAR VIAJES*/
router.put('/:id/:fecha/:anio/:diaDelAnio/:idVenta/:noAsiento', async (req, res) => {
    await Venta.findOneAndUpdate(
        { _id: req.params.id },
        { idVenta: req.params.idVenta, fecha: req.params.fecha,  anio: req.params.anio, diaDelAnio: req.params.diaDelAnio, numeroAsiento: 'null'}
    );
    
});



router.put('/:id', async (req, res) => {
    const {cliente, tipo, razon,descuento,origen,destino,fecha,anio,diaDelAnio,horaSalida,numeroAsiento,statePagado,activo,idVenta,tipoCambio, total, vendedor, folio, viajado} = req.body;
    const nuevoVenta = {cliente, tipo, razon,descuento,origen,destino,fecha,anio,diaDelAnio,horaSalida,numeroAsiento,statePagado,activo,idVenta,tipoCambio,total, vendedor, folio, viajado};
    await Venta.findByIdAndUpdate(req.params.id, nuevoVenta);
    res.json({status:' VENTA ACTUALIZADO!!!'});
});
router.delete('/:id', async (req, res) => {
    await Venta.findByIdAndRemove(req.params.id);
    res.json({status:' VENTA ELIMINADO!!!'});
})
module.exports = router;