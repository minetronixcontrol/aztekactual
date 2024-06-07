const express = require('express'); //requerimiento de express
const router = express.Router();   // invocacion de la funcion router del modulo express

const Camion = require('../models/Camiones');
const Cliente = require('../models/Clientes');
const Descuento = require('../models/Descuentos');
const Dollar = require('../models/Dollar');
const Origen = require('../models/OrigenesYdestinos');
const Pagos = require('../models/Pagos');
const Usuario = require('../models/Usuarios');
const Reservacion = require('../models/Reservaciones');
const Viaje = require('../models/AsignarViajes');
const ImagenesBoletos = require('../models/ImagenesBoletos');
const ConfiguracionBoleto = require('../models/ConfiguracionBoleto');
const Sucursal = require('../models/Sucursales');
const ModificacionCorte = require('../models/ModificacionCorte.js');

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
            return array[i];
        }
    }
}

function getValueModificarVentas(array, id){
    for (let i = 0; i < array.length; i++) {
        if(array[i]._id == id){
            return array[i];
        }
    }
}

router.get('/', async (req, res) => {
    const reservacion = await Reservacion.find();
    console.log(reservacion);
    res.json(reservacion);
});
router.get('/:id', async (req, res) =>{
    switch (req.params.id) {
        case 'getReservaciones':
            try {
                let r = [];
                const reservacion = await Reservacion.find({activo: 'true'});
                if(reservacion.length > 0){
                    for (const i in reservacion) {
                        let cliente = await Cliente.findById(reservacion[i].cliente);
                        ///let descuento = (reservacion[i].descuento == 'null')? {desc: 'null'}: await Descuento.findById(reservacion[i].descuento);
                        let descuento = reservacion[i].descuento;
                        let origen = await Origen.findById(reservacion[i].origen);
                        let destino = await Origen.findById(reservacion[i].destino);
                        let vendedor = await Usuario.findById(reservacion[i].vendedor);
                        ///////////////////////////Calculo del pago pendiente 
                        let pagos = await Pagos.find({id_Reservacion: reservacion[i]._id});
                        let sumPagos = 0;
                        let pagoPendiente = 0;
                        let anticipo = (reservacion[i].anticipo != null)? parseFloat(reservacion[i].anticipo) : 0;
                        if(pagos.length > 0){
                            for (const i in pagos) {
                                sumPagos += parseFloat(pagos[i].cantidad);
                            }
                        }  
                        pagoPendiente = parseFloat(reservacion[i].total)-parseFloat(anticipo)-sumPagos;
                        /////////////////////////////////////////////////////
                        r[i] = {
                            _id: reservacion[i]._id,
                            idCliente: reservacion[i].cliente,
                            folio: `${vendedor.prefijoFolio}-${reservacion[i].folio}`,
                            cliente: `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
                            razon: reservacion[i].razon,
                            descuento: descuento.desc,
                            idOrigen: reservacion[i].origen,
                            origen: origen.nombre,
                            idDestino: reservacion[i].destino,
                            destino: destino.nombre,
                            dia: reservacion[i].fecha,
                            asiento: reservacion[i].numeroAsiento,
                            pagoPendiente: pagoPendiente,
                            tipoCambio: reservacion[i].tipoCambio,
                            idViaje: reservacion[i].idReservacion
                        };
                    }
                    res.json(r);
                }else{
                    res.json(reservacion);
                }
            } catch (error) {
                res.json(error);
            }
            break;
        case 'getReservacionesConcluidas':
            try {
                let r = [];
                const reservacion = await Reservacion.find({viajado: 'true'});
                console.log(reservacion);
                if(reservacion.length > 0){
                    for (const i in reservacion) {
                        let cliente = await Cliente.findById(reservacion[i].cliente);
                        let descuento = (reservacion[i].descuento == 'null')? {desc: 'null'}: await Descuento.findById(reservacion[i].descuento);
                        let origen = await Origen.findById(reservacion[i].origen);
                        let destino = await Origen.findById(reservacion[i].destino);
                        let vendedor = await Usuario.findById(reservacion[i].vendedor);
                        ///////////////////////////Calculo del pago pendiente 
                        let pagos = await Pagos.find({id_Reservacion: reservacion[i]._id});
                        let sumPagos = 0;
                        let pagoPendiente = 0;
                        let anticipo = (reservacion[i].anticipo != null)? parseFloat(reservacion[i].anticipo) : 0;
                        if(pagos.length > 0){
                            for (const i in pagos) {
                                sumPagos += parseFloat(pagos[i].cantidad);
                            }
                        }  
                        pagoPendiente = parseFloat(reservacion[i].total)-parseFloat(anticipo)-sumPagos;
                        /////////////////////////////////////////////////////
                        r[i] = {
                            _id: reservacion[i]._id,
                            idCliente: reservacion[i].cliente,
                            folio: `${vendedor.prefijoFolio}-${reservacion[i].folio}`,
                            cliente: `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
                            razon: reservacion[i].razon,
                            descuento: descuento.desc,
                            idOrigen: reservacion[i].origen,
                            origen: origen.nombre,
                            idDestino: reservacion[i].destino,
                            destino: destino.nombre,
                            dia: reservacion[i].fecha,
                            asiento: reservacion[i].numeroAsiento,
                            pagoPendiente: pagoPendiente,
                            tipoCambio: reservacion[i].tipoCambio,
                            idViaje: reservacion[i].idReservacion
                        };
                    }
                    res.json(r);
                }else{
                    res.json(reservacion);
                }
            } catch (error) {
                
            }
            break;
        case 'getReservacionesCanceladas':
            try {
                let r = [];
                const reservacion = await Reservacion.find({activo: 'false'});
                console.log(reservacion);
                if(reservacion.length > 0){
                    for (const i in reservacion) {
                        let cliente = await Cliente.findById(reservacion[i].cliente);
                        let descuento = (reservacion[i].descuento == 'null')? {desc: 'null'}: await Descuento.findById(reservacion[i].descuento);
                        let origen = await Origen.findById(reservacion[i].origen);
                        let destino = await Origen.findById(reservacion[i].destino);
                        let vendedor = await Usuario.findById(reservacion[i].vendedor);
                        ///////////////////////////Calculo del pago pendiente 
                        let pagos = await Pagos.find({id_Reservacion: reservacion[i]._id});
                        let sumPagos = 0;
                        let pagoPendiente = 0;
                        let anticipo = (reservacion[i].anticipo != null)? parseFloat(reservacion[i].anticipo) : 0;
                        if(pagos.length > 0){
                            for (const i in pagos) {
                                sumPagos += parseFloat(pagos[i].cantidad);
                            }
                        }  
                        pagoPendiente = parseFloat(reservacion[i].total)-parseFloat(anticipo)-sumPagos;
                        /////////////////////////////////////////////////////
                        r[i] = {
                            _id: reservacion[i]._id,
                            idCliente: reservacion[i].cliente,
                            folio: `${vendedor.prefijoFolio}-${reservacion[i].folio}`,
                            cliente: `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
                            vendedorName: `${vendedor.nombre} ${vendedor.apellidoPaterno} ${vendedor.apellidoMaterno}`,
                            fechaCancelacion: reservacion[i].fechaCancelacion,
                            razon: reservacion[i].razon,
                            descuento: descuento.desc,
                            idOrigen: reservacion[i].origen,
                            origen: origen.nombre,
                            idDestino: reservacion[i].destino,
                            destino: destino.nombre,
                            dia: reservacion[i].fecha,
                            asiento: reservacion[i].numeroAsiento,
                            pagoPendiente: pagoPendiente,
                            tipoCambio: reservacion[i].tipoCambio,
                            idViaje: reservacion[i].idReservacion
                        };
                    }
                    res.json(r);
                }else{
                    res.json(reservacion);
                }
            } catch (error) {
                
            }
            break;
    
        default:
            const reservacion = await Reservacion.findById(req.params.id);
            res.json(reservacion);
            break;
    }
});

router.get('/:id/:field', async (req, res) =>{
    switch (req.params.field) {
        case 'vendedor':
            let reservacion = await Reservacion.findById(req.params.id);
            let vendedor = reservacion.vendedor;
            res.json(vendedor);
            break;
        case 'datosReservacion':
            try {
                let id = req.params.id;
                let reservacion = await Reservacion.findById(id);
                let vendedor = await Usuario.findById(reservacion.vendedor);
                let cliente = await Cliente.findById(reservacion.cliente);              
                 
                let fecha = reservacion.fecha;
                 
                let origen = await Origen.findById(reservacion.origen);
                
                let destino = await Origen.findById(reservacion.destino);

                let response = {
                    idViaje: id,
                    fecha: fecha,
                    folio: `${vendedor.prefijoFolio}-${reservacion.folio}`,
                    nameCliente: `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
                    origen: `${origen.nombre}`,
                    origenID: origen._id,
                    destino: `${destino.nombre}`,
                    destinoID: destino._id,
                    idViaje: reservacion.idVenta,
                    asiento: reservacion.numeroAsiento,
                    pagado: reservacion.statePagadoCliente
                };

                res.json(response);
                              
            } catch (error) {
                res.json(error);
            }
            break;
        case 'fechaViaje':
            try{
                let respuesta = []
                let r = [];
                let reservacion = await Reservacion.find({fecha: req.params.id, activo: 'true'});
                if(reservacion.length > 0){
                    for (const i in reservacion) {
                        let cliente = await Cliente.findById(reservacion[i].cliente);
                        ///let descuento = (reservacion[i].descuento == 'null')? {desc: 'null'}: await Descuento.findById(reservacion[i].descuento);
                        let descuento = reservacion[i].descuento;
                        let origen = await Origen.findById(reservacion[i].origen);
                        let destino = await Origen.findById(reservacion[i].destino);
                        let vendedor = await Usuario.findById(reservacion[i].vendedor);
                        ///////////////////////////Calculo del pago pendiente 
                        let pagos = await Pagos.find({id_Reservacion: reservacion[i]._id});
                        let sumPagos = 0;
                        let pagoPendiente = 0;
                        let anticipo = (reservacion[i].anticipo != null)? parseFloat(reservacion[i].anticipo) : 0;
                        if(pagos.length > 0){
                            for (const i in pagos) {
                                sumPagos += parseFloat(pagos[i].cantidad);
                            }
                        }  
                        pagoPendiente = parseFloat(reservacion[i].total)-parseFloat(anticipo)-sumPagos;
                        /////////////////////////////////////////////////////
                        r[i] = {
                            _id: reservacion[i]._id,
                            idCliente: reservacion[i].cliente,
                            folio: `${vendedor.prefijoFolio}-${reservacion[i].folio}`,
                            cliente: `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
                            razon: reservacion[i].razon,
                            descuento: descuento.desc,
                            idOrigen: reservacion[i].origen,
                            origen: origen.nombre,
                            idDestino: reservacion[i].destino,
                            destino: destino.nombre,
                            dia: reservacion[i].fecha,
                            asiento: reservacion[i].numeroAsiento,
                            pagoPendiente: pagoPendiente,
                            tipoCambio: reservacion[i].tipoCambio,
                            idViaje: reservacion[i].idReservacion
                        };
                    }
                    res.json(r);
                }else{
                    res.json(reservacion);
                }
            } catch (error) {
                res.json(error);
            }
            break;
        case 'getHistorialDePago':
            let historial = [
                {
                    general: {
                        nombreCliente: null,
                        folioDeReservacion: null,
                        totalPagar: null,
                        tipoDeCambio: null,
                        montoTotalPagos: null,
                        pagoPendiente: null,
                    },
                    anticipo: {
                        cantidad: null,
                        fecha: null,
                    },
                    pagos: []
                }
            ];
            try {
                const reservacion = await Reservacion.findById(req.params.id);
                const vendedor = await Usuario.findById(reservacion.vendedor);
                const cliente = await Cliente.findById(reservacion.cliente);
                const pagos = await Pagos.find({id_Reservacion: reservacion._id});
                historial[0].general.nombreCliente = `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`;
                historial[0].general.folioDeReservacion = `${vendedor.prefijoFolio}-${reservacion.folio}`;
                historial[0].general.totalPagar = reservacion.total;
                historial[0].general.tipoDeCambio = reservacion.tipoCambio;
                historial[0].anticipo.cantidad = reservacion.anticipo;
                historial[0].anticipo.fecha = reservacion.fechaDeReservacion;
                let anticipo = (reservacion.anticipo != null)? parseFloat(reservacion.anticipo) : 0;
                ///////////Aqui tambien sumaremos el total de pagos, para saber el monto total de los pagos y el restante a pagar
                if (pagos.length > 0) {
                    let sumPagos = 0;                    
                    for (const i in pagos) {
                        sumPagos += parseFloat(pagos[i].cantidad);
                        historial[0].pagos[i] = {
                            cantidad: pagos[i].cantidad,
                            fecha: pagos[i].fecha
                        }
                    }
                    historial[0].general.montoTotalPagos = anticipo+sumPagos;
                    historial[0].general.pagoPendiente = parseFloat(reservacion.total)-parseFloat(anticipo)-sumPagos;
                }else{
                    historial[0].general.montoTotalPagos = anticipo;
                    historial[0].general.pagoPendiente = parseFloat(reservacion.total)-parseFloat(anticipo);
                }
                res.json(historial);
            } catch (error) {
                console.log(error);
            }
            break;
            
        case 'reimpresion':
            try {
                let respuesta = {
                    idioma: 'espanol',//
                    imagenPublicidad: '',//
                    folioVendedor: '',//
                    nombreCliente: '',//
                    clienteTipo: '', //
                    origen: {
                        ciudad: '',//
                        estado: '',
                        pais: '',
                        direccion: '',
                    },
                    destino: {
                        ciudad: '',
                        estado: '',
                        pais: '',
                        direccion: '',
                    },
                    detalles:{
                        dia: '',                         
                    },
                    cambio: '',
                    cobro: {
                        subtotal: '',
                        descuento: '',
                        total: '',
                        anticipo: '',
                    },
                    configuracion: {
                        informacionPermiso: '',
                        politicas: '',
                        reservacion: ''
                    },
                    sucursales: {
                        direccionMatriz: '',
                        telefonoMatriz: '',
                        direccionMatrizEU: '',
                        telefonoMatrizEU: ''
                    }
                }

                let resBoleto = {
                    correoSucursal: '',
                    descuento: '',
                    destino: '',
                    dirSucursal: '',
                    direccionMatriz: '',
                    direccionMatrizEU: '',
                    fecha: '',
                    folio: '',
                    frase: '',
                    hora: '',
                    idioma: '',
                    imagenPublicidad: '',
                    noAsiento: '',
                    origen: '',
                    pasajero: '',
                    permiso: '',
                    politicas: '',
                    subtotal: '',
                    sucursal: '',
                    tel2Sucursal: '',
                    telSucursal: '',
                    telefonoMatriz: '',
                    telefonoMatrizEU: '',
                    tipo: '',
                    tipoDeCambio: '',
                    total: 0,
                    vendedor: ''
                };

                let reservacion = await Reservacion.findById(req.params.id);
                //res.json(reservacion);

                let vendedor = await Usuario.findById(reservacion.vendedor);
                let cliente = await Cliente.findById(reservacion.cliente);
                let origen = await Origen.findById(reservacion.origen);
                let destino = await Origen.findById(reservacion.destino);
                let sucursal = await Sucursal.findById(vendedor.sucursal);
                
                let configuracion = await ConfiguracionBoleto.find();
                let sucursalMX = await Sucursal.find({pais: 'MX', tipo: 'matriz'});
                let sucursalUS = await Sucursal.find({pais: 'US', tipo: 'matriz'});

                if(reservacion.statePagadoCliente == 'true'){
                    let imagenBoleto =  await ImagenesBoletos.find({type: 'Boleto'});
                    resBoleto.correoSucursal = sucursal.correo;
                    resBoleto.descuento = reservacion.descuento;
                    resBoleto.destino = destino.direccion+' '+destino.municipio+' '+destino.estado+' '+destino.pais;
                    resBoleto.dirSucursal = sucursal.direccion;
                    resBoleto.direccionMatriz = sucursalMX[0].direccion+' '+sucursalMX[0].ciudad+', '+sucursalMX[0].estado+', '+sucursalMX[0].pais;
                    resBoleto.direccionMatrizEU = sucursalUS[0].direccion+' '+sucursalUS[0].ciudad+', '+sucursalUS[0].estado+', '+sucursalUS[0].pais;;
                    resBoleto.fecha = reservacion.fecha;
                    resBoleto.folio = vendedor.prefijoFolio+'-'+reservacion.folio;
                    resBoleto.frase = configuracion[0].frase;
                    resBoleto.hora = reservacion.horaSalida;
                    resBoleto.idioma = 'espanol';
                    resBoleto.imagenPublicidad = imagenBoleto[0].imagen;
                    resBoleto.noAsiento = reservacion.numeroAsiento;
                    resBoleto.origen = origen.direccion+' '+origen.municipio+''+origen.estado+' '+origen.pais;
                    resBoleto.pasajero = cliente.nombre+' '+cliente.apellidoPaterno+' '+cliente.apellidoMaterno;
                    resBoleto.permiso = configuracion[0].informacionPermiso;
                    resBoleto.politicas = configuracion[0].politicas;
                    resBoleto.subtotal = parseFloat(reservacion.total)+parseFloat(reservacion.descuento);
                    resBoleto.sucursal = sucursal.nombre;
                    resBoleto.tel2Sucursal = sucursal.telefono_2;
                    resBoleto.telSucursal = sucursal.telefono_1;
                    resBoleto.telefonoMatriz = sucursalMX[0].telefono_1+'\n'+sucursalMX[0].telefono_2;
                    resBoleto.telefonoMatrizEU = sucursalUS[0].telefono_1+'\n'+sucursalUS[0].telefono_2;
                    resBoleto.tipo = reservacion.tipo;
                    resBoleto.tipoDeCambio = reservacion.tipoCambio;
                    resBoleto.total = reservacion.total;
                    resBoleto.vendedor = vendedor.nombre+' '+vendedor.apellidoPaterno+' '+vendedor.apellidoMaterno;

                    res.json({resBoleto, type: 'boleto'});
                }else{
                    let imagenReservacion =  await ImagenesBoletos.find({type: 'Publicidad'});
                    respuesta.imagenPublicidad = imagenReservacion[0].imagen;
                    respuesta.folioVendedor = vendedor.prefijoFolio+'-'+reservacion.folio;
                    respuesta.nombreCliente = cliente.nombre+' '+cliente.apellidoPaterno+' '+cliente.apellidoMaterno;
                    respuesta.clienteTipo = reservacion.tipo;
                    respuesta.origen.ciudad = origen.municipio;
                    respuesta.origen.estado = origen.estado;
                    respuesta.origen.pais = origen.pais;
                    respuesta.origen.direccion = origen.direccion;
                    respuesta.destino.ciudad = destino.municipio;
                    respuesta.destino.estado = destino.estado;
                    respuesta.destino.pais = destino.pais;
                    respuesta.destino.direccion = destino.direccion; 
                    respuesta.detalles.dia = reservacion.fecha;
                    respuesta.cambio = reservacion.tipoCambio;
                    respuesta.cobro.subtotal = parseFloat(reservacion.total)+parseFloat(reservacion.descuento);
                    respuesta.cobro.descuento = reservacion.descuento;
                    respuesta.cobro.total = reservacion.total;
                    respuesta.cobro.anticipo = reservacion.anticipo;
                    respuesta.configuracion.informacionPermiso = configuracion[0].informacionPermiso;
                    respuesta.configuracion.politicas = configuracion[0].politicas;
                    respuesta.configuracion.reservacion = configuracion[0].reservacion;
                    respuesta.sucursales.direccionMatriz = sucursalMX[0].direccion+' '+sucursalMX[0].ciudad+', '+sucursalMX[0].estado+', '+sucursalMX[0].pais;
                    respuesta.sucursales.telefonoMatriz = sucursalMX[0].telefono_1+'\n'+sucursalMX[0].telefono_2;
                    respuesta.sucursales.direccionMatrizEU = sucursalUS[0].direccion+' '+sucursalUS[0].ciudad+', '+sucursalUS[0].estado+', '+sucursalUS[0].pais;
                    respuesta.sucursales.telefonoMatrizEU = sucursalUS[0].telefono_1+'\n'+sucursalUS[0].telefono_2;

                    res.json({respuesta, type: 'reservacion'});
                }

                
                
                
                /*
                

                */
                
                
            } catch (error) {
                res.json(error);
            }
            break;
        
        default:
            break;
    }
});

router.get('/:idUsuario/:opc/:Reservaciones', async (req, res) =>{
    switch (req.params.opc) {
        case 'fechaViajeConcluidas':
            try {
                let respuesta = [];

                let reservaciones = [];

                let usuario = await Usuario.findById(req.params.Reservaciones); //Boletos es el Id de usuario
                
                if(usuario.seguridad != 'Admin' && usuario.seguridad != 'Viajes'){
                    reservaciones = await Reservacion.find({vendedor: req.params.Reservaciones, fecha: req.params.idUsuario, activo: 'true', viajado: 'true'});;//idUsuario es la fecha
                }else{
                    reservaciones = await Reservacion.find({fecha: req.params.idUsuario, activo: 'true', viajado: 'true'});;//idUsuario es la fecha
                }

                let vendedores = await Usuario.find();
                let clientes = await Cliente.find();
                let origenesYdestinos = await Origen.find();
                for (let i = 0; i < reservaciones.length; i++) {
                    let vendedor = await getValueModificarVentas(vendedores, reservaciones[i].vendedor);
                    let cliente = await getValueModificarVentas(clientes, reservaciones[i].cliente);
                    let origen = await getValueModificarVentas(origenesYdestinos, reservaciones[i].origen);
                    let destino = await getValueModificarVentas(origenesYdestinos, reservaciones[i].destino);
                    respuesta.push({
                        _id: reservaciones[i]._id,
                        folio: `${vendedor.prefijoFolio}-${reservaciones[i].folio}`,
                        cliente: `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
                        vendedor: `${vendedor.nombre} ${vendedor.apellidoPaterno} ${vendedor.apellidoMaterno}`,
                        razon: reservaciones[i].razon,
                        descuento: reservaciones[i].descuento,
                        tipoDeCambio: reservaciones[i].tipoCambio,
                        origen: origen.nombre,
                        destino: destino.nombre,
                        idViaje: reservaciones[i].idVenta,
                        dia: reservaciones[i].fecha,
                        asiento: reservaciones[i].numeroAsiento,
                        status: reservaciones[i].viajado
                    });
                }
                res.json(respuesta);
            } catch (error) {
                res.json(error);
            }
            break;
        case 'folio':
            try{
                //revisar donde se utiliza para poder ver si hay error en la busqueda solo por
                let r = [];
                let vendedores = await Usuario.find({prefijoFolio: req.params.idUsuario, activo: 'true'});
                let idVendedor = vendedores[0]._id;
                let reservacion = await Reservacion.find({vendedor: idVendedor, folio: req.params.Reservaciones, activo: 'true'});
                if(reservacion.length > 0){
                    for (const i in reservacion) {
                        let cliente = await Cliente.findById(reservacion[i].cliente);
                        ///let descuento = (reservacion[i].descuento == 'null')? {desc: 'null'}: await Descuento.findById(reservacion[i].descuento);
                        let descuento = reservacion[i].descuento;
                        let origen = await Origen.findById(reservacion[i].origen);
                        let destino = await Origen.findById(reservacion[i].destino);
                        let vendedor = await Usuario.findById(reservacion[i].vendedor);
                        ///////////////////////////Calculo del pago pendiente 
                        let pagos = await Pagos.find({id_Reservacion: reservacion[i]._id});
                        let sumPagos = 0;
                        let pagoPendiente = 0;
                        let anticipo = (reservacion[i].anticipo != null)? parseFloat(reservacion[i].anticipo) : 0;
                        if(pagos.length > 0){
                            for (const i in pagos) {
                                sumPagos += parseFloat(pagos[i].cantidad);
                            }
                        }  
                        pagoPendiente = parseFloat(reservacion[i].total)-parseFloat(anticipo)-sumPagos;
                        /////////////////////////////////////////////////////
                        r[i] = {
                            _id: reservacion[i]._id,
                            idCliente: reservacion[i].cliente,
                            folio: `${vendedor.prefijoFolio}-${reservacion[i].folio}`,
                            cliente: `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
                            razon: reservacion[i].razon,
                            descuento: descuento.desc,
                            idOrigen: reservacion[i].origen,
                            origen: origen.nombre,
                            idDestino: reservacion[i].destino,
                            destino: destino.nombre,
                            dia: reservacion[i].fecha,
                            asiento: reservacion[i].numeroAsiento,
                            pagoPendiente: pagoPendiente,
                            tipoCambio: reservacion[i].tipoCambio,
                            idViaje: reservacion[i].idReservacion
                        };
                    }
                    res.json(r);
                }else{
                    res.json(reservacion);
                }
            } catch (error) {
                res.json(error);
            }
            break;
        case 'Pagados':
            
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
                const reservacion = await Reservacion.find({vendedor: req.params.idUsuario, statePagado: 'false', statePagadoAnticipo: 'false', activo: 'true'});
                
                let usuario = await Usuario.findById(req.params.idUsuario);
                

                let comisionDollares = parseFloat(usuario.comision);
                let dollar = await Dollar.find();
                let precioDollar = parseFloat(dollar[0].precioDollar);
                let comisionMXN = comisionDollares*precioDollar;

                for (let i = 0; i < reservacion.length; i++) {
                    let destino = await Origen.findById(reservacion[i].destino);
                    let origen = await Origen.findById(reservacion[i].origen); 
                    let cliente = await Cliente.findById(reservacion[i].cliente);
                    let montoMXN = '0.00';
                    let montoUS = '0.00';
                    let tipo = '';
                    if(reservacion[i].tipoCambio == 'MX'){
                        montoMXN = reservacion[i].anticipo;
                        totales.subtotalMXN += parseFloat(reservacion[i].total);
                        //totales.comisionesMXN += parseFloat(comisionMXN);
                    }else{
                        montoUS = reservacion[i].anticipo;
                        totales.subtotalUS += parseFloat(reservacion[i].total);
                        //totales.comisionesUS += parseFloat(comisionDollares);
                    }
                    
                    if(reservacion[i].tipo == 'Adulto'){
                        tipo = 'A';
                    }else if(reservacion[i].tipo == 'Niño'){
                        tipo = 'N'
                    }else{
                        tipo = 'I'
                    }
                    respuesta[i] = {
                        '_id': reservacion[i]._id,
                        'cliente': `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
                        'folio': `${usuario.prefijoFolio}-${reservacion[i].folio} (Anticipo)`,
                        'origen': `${origen.municipio} ${origen.estado} ${origen.pais}`,
                        'destino': `${destino.municipio} ${destino.estado} ${destino.pais}`,
                        'fecha': reservacion[i].fecha,
                        'estado': 'no pagado',
                        'montoMXN': montoMXN,
                        'montoUS': montoUS,
                        'tipo': tipo,
                        'type': 'Reservaciones',
                        'pago': 'anticipo'
                    };
                    
                }

                const reservacionSinPagar = await Reservacion.find({vendedor: req.params.idUsuario, statePagado: 'false', activo: 'true'});
        
                let pagosSinPagar = [];
                
                for (let i = 0; i < reservacionSinPagar.length; i++) {
                    let pagos = await Pagos.find({id_Reservacion: reservacionSinPagar[i]._id, statePagado: 'false'});
                    let cliente = await Cliente.findById(reservacionSinPagar[i].cliente);
                    let origen = await Origen.findById(reservacionSinPagar[i].origen); 
                    let destino = await Origen.findById(reservacionSinPagar[i].destino); 
                    for (let j = 0; j < pagos.length; j++) {
                        let montoMXN = 0.0;
                        let montoUS = 0.0
                        let tipo = '';
                        if(reservacionSinPagar[i].tipoCambio == 'MX'){
                            montoMXN = pagos[j].cantidad;
                            totales.subtotalMXN += parseFloat(reservacionSinPagar[i].total);
                            //totales.comisionesMXN += parseFloat(comisionMXN);
                        }else{
                            montoUS = pagos[j].cantidad;
                            totales.subtotalUS += parseFloat(reservacionSinPagar[i].total);
                            //totales.comisionesUS += parseFloat(comisionDollares);
                        }
                        if(reservacionSinPagar[i].tipo == 'Adulto'){
                            tipo = 'A';
                        }else if(reservacionSinPagar[i].tipo == 'Niño'){
                            tipo = 'N'
                        }else{
                            tipo = 'I'
                        }
                        respuesta.push(
                            {
                                '_id': pagos[j]._id,
                                'cliente': `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
                                'folio': `${usuario.prefijoFolio}-${reservacionSinPagar[i].folio} (Pago)`,
                                'origen': `${origen.municipio} ${origen.estado} ${origen.pais}`,
                                'destino': `${destino.municipio} ${destino.estado} ${destino.pais}`,
                                'fecha': reservacionSinPagar[i].fecha,
                                'estado': 'no pagado',
                                'montoMXN': montoMXN,
                                'montoUS': montoUS,
                                'tipo': tipo,
                                'type': 'Reservaciones',
                                'pago': 'abono'
                            }
                        );
                    }
                }

               // res.json(pagosSinPagar);

                totales.totalMXN = parseFloat(totales.subtotalMXN)-parseFloat(totales.comisionesMXN);
                totales.totalUS = parseFloat(totales.subtotalUS)-parseFloat(totales.comisionesUS);
                res.json({respuesta, totales});
            } catch (error) {
                res.json(error);
            }
            break;
        case 'Todo':

            break;
    
        default:
            break;
    }
});

router.get('/:seguridad/:idUsuario/:opc/:value', async (req, res) =>{ //Para mostrar ventas concluidas según el usuario
    switch (req.params.idUsuario) {
        case 'pasajeroReservaciones':
            try{
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

                //res.json(clientes);

                if(clientes.length > 0){
                    //res.json(clientes);
                    let origenes = await Origen.find();
                    let vendedores = await Usuario.find();
                    for (let i = 0; i < clientes.length; i++) {
                        let reservaciones = await Reservacion.find({activo: 'true',  cliente: clientes[i]._id, viajado: 'false'});
                        //res.json(reservaciones);

                        if(reservaciones.length > 0){
                            for (const j in reservaciones) {
                                let descuento = reservaciones[j].descuento;
                                let origen = await getOrigenDestino(reservaciones[j].origen, origenes);
                                let destino = await getOrigenDestino(reservaciones[j].destino, origenes);
                                let vendedor = await getVendedor(reservaciones[j].vendedor, vendedores); //Aqui voy
                                ///////////////////////////Calculo del pago pendiente 
                                let pagos = await Pagos.find({id_Reservacion: reservaciones[j]._id});
                                let sumPagos = 0;
                                let pagoPendiente = 0;
                                let anticipo = (reservaciones[j].anticipo != null)? parseFloat(reservaciones[j].anticipo) : 0;
                                if(pagos.length > 0){
                                    for (const k in pagos) {
                                        sumPagos += parseFloat(pagos[k].cantidad);
                                    }
                                }  
                                pagoPendiente = parseFloat(reservaciones[j].total)-parseFloat(anticipo)-sumPagos;
                                /////////////////////////////////////////////////////
                                respuesta.push({
                                    _id: reservaciones[j]._id,
                                    folio: `${vendedor.prefijoFolio}-${reservaciones[j].folio}`,
                                    razon: reservaciones[j].razon,
                                    descuento: reservaciones[j].descuento,
                                    cliente: `${clientes[i].nombre} ${clientes[i].apellidoPaterno} ${clientes[i].apellidoMaterno}`,
                                    clienteName: `${clientes[i].nombre} ${clientes[i].apellidoPaterno} ${clientes[i].apellidoMaterno}`,
                                    vendedorName: `${vendedor.nombre} ${vendedor.apellidoPaterno} ${vendedor.apellidoMaterno}`,
                                    origen: origen.nombre,
                                    destino: destino.nombre,
                                    dia: reservaciones[j].fecha,
                                    asiento: reservaciones[j].numeroAsiento,
                                    tipoDeCambio: reservaciones[j].tipoCambio,
                                    idViaje: reservaciones[j].idVenta,
                                    asiento: reservaciones[j].numeroAsiento,
                                    pagoPendiente: pagoPendiente
                                });
                            }
                            res.json(respuesta);
                        }else{
                            res.json(respuesta);
                        }
                    }
                }
                res.json(respuesta);
            } catch (error) {
                res.json(error);
            }
            break;
        case 'pasajeroReservacionesConcluidas':
            try{
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

                //res.json(clientes);

                if(clientes.length > 0){
                    //res.json(clientes);
                    let origenes = await Origen.find();
                    let vendedores = await Usuario.find();
                    for (let i = 0; i < clientes.length; i++) {
                        let reservaciones = await Reservacion.find({activo: 'true',  cliente: clientes[i]._id, viajado: 'true'});
                        //res.json(reservaciones);

                        if(reservaciones.length > 0){
                            for (const j in reservaciones) {
                                let descuento = reservaciones[j].descuento;
                                let origen = await getOrigenDestino(reservaciones[j].origen, origenes);
                                let destino = await getOrigenDestino(reservaciones[j].destino, origenes);
                                let vendedor = await getVendedor(reservaciones[j].vendedor, vendedores); //Aqui voy
                                ///////////////////////////Calculo del pago pendiente 
                                let pagos = await Pagos.find({id_Reservacion: reservaciones[j]._id});
                                let sumPagos = 0;
                                let pagoPendiente = 0;
                                let anticipo = (reservaciones[j].anticipo != null)? parseFloat(reservaciones[j].anticipo) : 0;
                                if(pagos.length > 0){
                                    for (const k in pagos) {
                                        sumPagos += parseFloat(pagos[k].cantidad);
                                    }
                                }  
                                pagoPendiente = parseFloat(reservaciones[j].total)-parseFloat(anticipo)-sumPagos;
                                /////////////////////////////////////////////////////
                                respuesta.push({
                                    _id: reservaciones[j]._id,
                                    folio: `${vendedor.prefijoFolio}-${reservaciones[j].folio}`,
                                    razon: reservaciones[j].razon,
                                    descuento: reservaciones[j].descuento,
                                    cliente: `${clientes[i].nombre} ${clientes[i].apellidoPaterno} ${clientes[i].apellidoMaterno}`,
                                    clienteName: `${clientes[i].nombre} ${clientes[i].apellidoPaterno} ${clientes[i].apellidoMaterno}`,
                                    vendedorName: `${vendedor.nombre} ${vendedor.apellidoPaterno} ${vendedor.apellidoMaterno}`,
                                    vendedor: `${vendedor.nombre} ${vendedor.apellidoPaterno} ${vendedor.apellidoMaterno}`,
                                    origen: origen.nombre,
                                    destino: destino.nombre,
                                    dia: reservaciones[j].fecha,
                                    asiento: reservaciones[j].numeroAsiento,
                                    tipoDeCambio: reservaciones[j].tipoCambio,
                                    idViaje: reservaciones[j].idVenta,
                                    asiento: reservaciones[j].numeroAsiento,
                                    pagoPendiente: pagoPendiente
                                });
                            }
                            res.json(respuesta);
                        }else{
                            res.json(respuesta);
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
                let reservaciones = await Reservacion.find({folio: req.params.opc, vendedor: idVendedor, activo: 'true',  viajado: 'true'});
                let origenesYdestinos = await Origen.find();
                for (let i = 0; i < reservaciones.length; i++) {
                    let clientes = await Cliente.findById(reservaciones[i].cliente);
                    let origen = await getValueModificarVentas(origenesYdestinos, reservaciones[i].origen);
                    let destino = await getValueModificarVentas(origenesYdestinos, reservaciones[i].destino);
                    respuesta.push({
                        _id: reservaciones[i]._id,
                        folio: `${vendedores[0].prefijoFolio}-${reservaciones[i].folio}`,
                        cliente: `${clientes.nombre} ${clientes.apellidoPaterno} ${clientes.apellidoMaterno}`,
                        vendedor: `${vendedores[0].nombre} ${vendedores[0].apellidoPaterno} ${vendedores[0].apellidoMaterno}`,
                        razon: reservaciones[i].razon,
                        descuento: reservaciones[i].descuento,
                        tipoDeCambio: reservaciones[i].tipoCambio,
                        origen: origen.nombre,
                        destino: destino.nombre,
                        idViaje: reservaciones[i].idVenta,
                        dia: reservaciones[i].fecha,
                        numeroAsiento: reservaciones[i].numeroAsiento,
                        asiento: reservaciones[i].numeroAsiento,
                        status: reservaciones[i].viajado
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
                    let ventas = await Reservacion.find({viajado: 'true', activo: 'true', vendedor: req.params.idUsuario});
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
                    let ventas = await Venta.find({viajado: 'true', activo: 'true'});
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

router.post('/', async (req, res)=>{
    const {cliente, tipo, razon, descuento, origen, destino, fecha, horaSalida, numeroAsiento, statePagado, statePagadoAnticipo, activo, fechaCancelacion, idReservacion, tipoCambio, total, vendedor, anticipo, fechaDeReservacion, fechaDeVenta, folio, viajado} = req.body;
    const reservacion= new Reservacion({cliente, tipo, razon, descuento, origen, destino, fecha, horaSalida, numeroAsiento, statePagado, statePagadoAnticipo, activo, fechaCancelacion, idReservacion, tipoCambio, total, vendedor, anticipo, fechaDeReservacion, fechaDeVenta, folio, viajado});
    await reservacion.save();
    res.json({status: 'RESERVACION GUARDADO!!!!!'});
});
router.put('/:id', async (req, res) => {
    const {cliente, tipo, razon, descuento, origen, destino, fecha, horaSalida, numeroAsiento, statePagado, statePagadoAnticipo, statePagadoCliente, activo, fechaCancelacion, idReservacion, tipoCambio, total, vendedor, anticipo, fechaDeReservacion, fechaDeVenta, folio, viajado} = req.body;
    const nuevoReservacion = {cliente, tipo, razon, descuento, origen, destino, fecha, horaSalida, numeroAsiento, statePagado, statePagadoAnticipo, statePagadoCliente, activo, fechaCancelacion, idReservacion, tipoCambio, total, vendedor, anticipo, fechaDeReservacion, fechaDeVenta, folio, viajado};
    await Reservacion.findByIdAndUpdate(req.params.id, nuevoReservacion);
    res.json({status:'RESERVACION ACTUALIZADO!!!'});
});

router.put('/:id/:value/', async (req, res) => {
    switch (req.params.value) {
        case 'printReservacionesConcluidas':
            try {
                let respuesta = [];                
                let selectedRowKeys = req.body.selectedRowKeys;
                for (let i = 0; i < selectedRowKeys.length; i++) {
                    let reservacion = await Reservacion.findById(selectedRowKeys[i]);
                    let origen = await Origen.findById(reservacion.origen);
                    let destino = await Origen.findById(reservacion.destino);
                    let vendedor = await Usuario.findById(reservacion.vendedor);
                    let cliente = await Cliente.findById(reservacion.cliente);
                    respuesta.push({
                        folio: `${vendedor.prefijoFolio}-${reservacion.folio}`,
                        vendedorName: `${vendedor.nombre} ${vendedor.apellidoPaterno} ${vendedor.apellidoMaterno}`,
                        clienteName: `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
                        razon: reservacion.razon,
                        descuento: reservacion.descuento,
                        origen: origen.nombre,
                        destino: destino.nombre,
                        fecha: reservacion.fecha,
                        asiento: reservacion.numeroAsiento
                    });
                }
                res.json(respuesta);
            } catch (error) {
                res.json(error);
            }
            break;
        case 'printReservacionesCanceladas':
            try {
                let respuesta = [];                
                let selectedRowKeys = req.body.selectedRowKeys;
                for (let i = 0; i < selectedRowKeys.length; i++) {
                    let reservacion = await Reservacion.findById(selectedRowKeys[i]);
                    let origen = await Origen.findById(reservacion.origen);
                    let destino = await Origen.findById(reservacion.destino);
                    let vendedor = await Usuario.findById(reservacion.vendedor);
                    let cliente = await Cliente.findById(reservacion.cliente);
                    respuesta.push({
                        folio: `${vendedor.prefijoFolio}-${reservacion.folio}`,
                        vendedorName: `${vendedor.nombre} ${vendedor.apellidoPaterno} ${vendedor.apellidoMaterno}`,
                        clienteName: `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
                        razon: reservacion.razon,
                        descuento: reservacion.descuento,
                        origen: origen.nombre,
                        destino: destino.nombre,
                        fecha: reservacion.fecha,
                        asiento: reservacion.numeroAsiento
                    });
                }
                res.json(respuesta);
            } catch (error) {
                res.json(error);
            }
            break;

        case 'actualizarReservacion':
            try {
                const viaje = await Viaje.findById(req.body.idViaje);
                let noAsientoNew = req.body.asientoModificacion;
                let disponible = viaje[`asiento_${noAsientoNew}`];
                if(disponible == "true"){ //Si se encuentra en true, significa que ya esta ocupado el asiento
                    res.json({'disponible': false});
                }else{
                    switch (noAsientoNew) {
                        case 1:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_1: 'false' },
                                { asiento_1 : 'true' }
                            );
                            break;
                        case 2:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_2: 'false' },
                                { asiento_2 : 'true' }
                            );
                            break;
                        case 3:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_3: 'false' },
                                { asiento_3 : 'true' }
                            );
                            break;
                        case 4:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_4: 'false' },
                                { asiento_4 : 'true' }
                            );
                            break;
                        case 5:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_5: 'false' },
                                { asiento_5 : 'true' }
                            );
                            break;
                        case 6:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_6: 'false' },
                                { asiento_6 : 'true' }
                            );
                            break;
                        case 7:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_7: 'false' },
                                { asiento_7 : 'true' }
                            );
                            break;
                        case 8:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_8: 'false' },
                                { asiento_8 : 'true' }
                            );
                            break;
                        case 9:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_9: 'false' },
                                { asiento_9 : 'true' }
                            );
                            break;
                        case 10:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_10: "false" },
                                { asiento_10 : "true" }
                            );
                            break;
                        case 11:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_11: "false" },
                                { asiento_11 : "true" }
                            );
                            break;
                        case 12:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_12: "false" },
                                { asiento_12 : "true" }
                            );
                            break;
                        case 13:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_13: "false" },
                                { asiento_13 : "true" }
                            );
                            break;
                        case 14:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_14: "false" },
                                { asiento_14 : "true" }
                            );
                            break;
                        case 15:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_15: "false" },
                                { asiento_15 : "true" }
                            );
                            break;
                        case 16:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_16: "false" },
                                { asiento_16 : "true" }
                            );
                            break;
                        case 17:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_17: "false" },
                                { asiento_17 : "true" }
                            );
                            break;
                        case 18:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_18: "false" },
                                { asiento_18 : "true" }
                            );
                            break;
                        case 19:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_19: "false" },
                                { asiento_19 : "true" }
                            );
                            break;
                        case 20:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_20: "false" },
                                { asiento_20 : "true" }
                            );
                            break;
                        case 21:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_21: "false" },
                                { asiento_21 : "true" }
                            );
                            break;
                        case 22:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_22: "false" },
                                { asiento_22 : "true" }
                            );
                            break;
                        case 23:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_23: "false" },
                                { asiento_23 : "true" }
                            );
                            break;
                        case 24:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_24: "false" },
                                { asiento_24 : "true" }
                            );
                            break;
                        case 25:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_25: "false" },
                                { asiento_25 : "true" }
                            );
                            break;
                        case 26:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_26: "false" },
                                { asiento_26 : "true" }
                            );
                            break;
                        case 27:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_27: "false" },
                                { asiento_27 : "true" }
                            );
                            break;
                        case 28:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_28: "false" },
                                { asiento_28 : "true" }
                            );
                            break;
                        case 29:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_29: "false" },
                                { asiento_29 : "true" }
                            );
                            break;
                        case 30:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_30: "false" },
                                { asiento_30 : "true" }
                            );
                            break;
                        case 31:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_31: "false" },
                                { asiento_31 : "true" }
                            );
                            break;
                        case 32:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_32: "false" },
                                { asiento_32 : "true" }
                            );
                            break;
                        case 33:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_33: "false" },
                                { asiento_33 : "true" }
                            );
                            break;
                        case 34:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_34: "false" },
                                { asiento_34 : "true" }
                            );
                            break;
                        case 35:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_35: "false" },
                                { asiento_35 : "true" }
                            );
                            break;
                        case 36:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_36: "false" },
                                { asiento_36 : "true" }
                            );
                            break;
                        case 37:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_37: "false" },
                                { asiento_37 : "true" }
                            );
                            break;
                        case 38:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_38: "false" },
                                { asiento_38 : "true" }
                            );
                            break;
                        case 39:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_39: "false" },
                                { asiento_39 : "true" }
                            );
                            break;
                        case 40:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_40: "false" },
                                { asiento_40 : "true" }
                            );
                            break;
                        case 41:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_41: "false" },
                                { asiento_41 : "true" }
                            );
                            break;
                        case 42:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_42: "false" },
                                { asiento_42 : "true" }
                            );
                            break;
                        case 43:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_43: "false" },
                                { asiento_43 : "true" }
                            );
                            break;
                        case 44:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_44: "false" },
                                { asiento_44 : "true" }
                            );
                            break;
                        case 45:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_45: "false" },
                                { asiento_45 : "true" }
                            );
                            break;
                        case 46:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_46: "false" },
                                { asiento_46 : "true" }
                            );
                            break;
                        case 47:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_47: "false" },
                                { asiento_47 : "true" }
                            );
                            break;
                        case 48:
                            await Viaje.findOneAndUpdate(
                                { _id: req.body.idViaje, asiento_48: "false" },
                                { asiento_48 : "true" }
                            );
                            break;
                    
                        default:
                            break;
                    }
                    
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.body.idVentaModificar },
                        {   
                            fecha : req.body.dia, anio: req.body.anio, 
                            diaDelAnio: req.body.diaDelAnio, 
                            numeroAsiento: req.body.asientoModificacion, 
                            idVenta: req.body.idViaje
                        }
                    );

                    res.json({'disponible': true});

                }
            } catch (error) {
                res.json({'disponible': false});
            }
            break;
    
        default:
            break;
    }
});

router.put('/:id/:value/:field', async (req, res) => {
    switch (req.params.field) {
        case 'activo':
            try {
                await Reservacion.findOneAndUpdate(
                    { _id: req.params.id },
                    { activo: req.params.value }
                );
                res.json({status:'RESERVACION ACTUALIZADO!!!'});
            } catch (error) {
                res.json(error);
                console.log(error);
            }
            break;
        case 'statePagado':
            try {
                await Reservacion.findOneAndUpdate(
                    { _id: req.params.id },
                    { statePagadoCliente: req.params.value }
                );
                res.json({status:'RESERVACION ACTUALIZADO!!!'});
            } catch (error) {
                res.json(error);
                console.log(error);
            }
            break;
        case 'fecha':
            try {
                //Primero comprobamos que exista la fecha
                let validarAsientoDisponible = false;
                const viaje = await Viaje.find({fecha: req.params.value});
                if(viaje.length > 0){
                    //Ahora comprobamos que haya algún asiento disponible
                    //Para ello procedemos a obtener el numero de asientos del camion
                    const camion = await Camion.find({numeroEconomico: viaje[0].numeroEconomico}, {capacidad: 1});
                    for (let i = 0; i < camion[0].capacidad; i++) {
                        if(viaje[0][`asiento_${(i+1)}`] == 'false'){
                            validarAsientoDisponible = true;
                        }
                    }
                    if(validarAsientoDisponible){
                        await Reservacion.findOneAndUpdate(
                            { _id: req.params.id },
                            { fecha: req.params.value, anio: viaje[0].anio, diaDelAnio: viaje[0].diaDelAnio, idReservacion: viaje[0]._id});
                        res.json({message: 'Fecha actualizada'});
                    }else{
                        res.json({message: 'Fecha no disponible'});
                    }                    
                }else{
                    res.json({message: 'Fecha no disponible'});
                }                
            } catch (error) {
                res.json(error);
                console.log(error);
            }
            break;
        case 'numeroAsiento':
            try {
                //Comprobamos que se guarde primero el asiento en 
            } catch (error) {
                res.json(error);
                console.log(error);
            }
            break;
    
        default:
            break;
    }
});

router.put('/:idReservacion/:idViaje/:noAsientoNew/:field', async (req, res) => { //idReservacion => Es el id de la Reservacion //idViaje => es el id del viaje
    //res.json({'idViaje': req.params.idViaje, 'idReservacion': req.params.idReservacion, 'noAsientoNew': req.params.noAsientoNew});
    let viaje = await Viaje.findById(req.params.idViaje); //Primero verificamos que el asiento este disponible,
    let noAsientoNew = req.params.noAsientoNew;
    let disponible = viaje[`asiento_${noAsientoNew}`];
    if(disponible == "true"){ //Si se encuentra en true, significa que ya esta ocupado el asiento
        res.json({'disponible': false});
    }else{
        //res.json({'disponible': true});
        let resetAsiento = null;
        switch (req.params.noAsientoNew) {
            case '1':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_1: 'false' },
                        { asiento_1 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '2':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_2: 'true' },
                                { asiento_2 : 'false' }
                            );
                            break;
                        case '3':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_3: 'true' },
                                { asiento_3 : 'false' }
                            );
                            break;
                        case '4':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_4: 'true' },
                                { asiento_4 : 'false' }
                            );
                            break;
                        case '5':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_5: 'true' },
                                { asiento_5 : 'false' }
                            );
                            break;
                        case '6':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_6: 'true' },
                                { asiento_6 : 'false' }
                            );
                            break;
                        case '7':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_7: 'true' },
                                { asiento_7 : 'false' }
                            );
                            break;
                        case '8':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_8: 'true' },
                                { asiento_8 : 'false' }
                            );
                            break;
                        case '9':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_9: 'true' },
                                { asiento_9 : 'false' }
                            );
                            break;
                        case '10':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_10: 'true' },
                                { asiento_10 : 'false' }
                            );
                            break;
                        case '11':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_11: 'true' },
                                { asiento_11 : 'false' }
                            );
                            break;
                        case '12':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_12: 'true' },
                                { asiento_12 : 'false' }
                            );
                            break;
                        case '13':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_13: 'true' },
                                { asiento_13 : 'false' }
                            );
                            break;
                        case '14':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_14: 'true' },
                                { asiento_14 : 'false' }
                            );
                            break;
                        case '15':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_15: 'true' },
                                { asiento_15 : 'false' }
                            );
                            break;
                        case '16':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_16: 'true' },
                                { asiento_16 : 'false' }
                            );
                            break;
                        case '17':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_17: 'true' },
                                { asiento_17 : 'false' }
                            );
                            break;
                        case '18':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_18: 'true' },
                                { asiento_18 : 'false' }
                            );
                            break;
                        case '19':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_19: 'true' },
                                { asiento_19 : 'false' }
                            );
                            break;
                        case '20':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_20: 'true' },
                                { asiento_20 : 'false' }
                            );
                            break;
                        case '21':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_21: 'true' },
                                { asiento_21 : 'false' }
                            );
                            break;
                        case '22':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_22: 'true' },
                                { asiento_22 : 'false' }
                            );
                            break;
                        case '23':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_23: 'true' },
                                { asiento_23 : 'false' }
                            );
                            break;
                        case '24':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_24: 'true' },
                                { asiento_24 : 'false' }
                            );
                            break;
                        case '25':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_25: 'true' },
                                { asiento_25 : 'false' }
                            );
                            break;
                        case '26':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_26: 'true' },
                                { asiento_26 : 'false' }
                            );
                            break;
                        case '27':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_27: 'true' },
                                { asiento_27 : 'false' }
                            );
                            break;
                        case '28':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_28: 'true' },
                                { asiento_28 : 'false' }
                            );
                            break;
                        case '29':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_29: 'true' },
                                { asiento_29 : 'false' }
                            );
                            break;
                        case '30':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_30: 'true' },
                                { asiento_30 : 'false' }
                            );
                            break;
                        case '31':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_31: 'true' },
                                { asiento_31 : 'false' }
                            );
                            break;
                        case '32':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_32: 'true' },
                                { asiento_32 : 'false' }
                            );
                            break;
                        case '33':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_33: 'true' },
                                { asiento_33 : 'false' }
                            );
                            break;
                        case '34':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_34: 'true' },
                                { asiento_34 : 'false' }
                            );
                            break;
                        case '35':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_35: 'true' },
                                { asiento_35 : 'false' }
                            );
                            break;
                        case '36':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_36: 'true' },
                                { asiento_36 : 'false' }
                            );
                            break;
                        case '37':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_37: 'true' },
                                { asiento_37 : 'false' }
                            );
                            break;
                        case '38':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_38: 'true' },
                                { asiento_38 : 'false' }
                            );
                            break;
                        case '39':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_39: 'true' },
                                { asiento_39 : 'false' }
                            );
                            break;
                        case '40':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_40: 'true' },
                                { asiento_40 : 'false' }
                            );
                            break;
                        case '41':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_41: 'true' },
                                { asiento_41 : 'false' }
                            );
                            break;
                        case '42':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_42: 'true' },
                                { asiento_42 : 'false' }
                            );
                            break;
                        default:
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
            case '2':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_2: 'false' },
                        { asiento_2 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '1':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_1: 'true' },
                                { asiento_1 : 'false' }
                            );
                            break;
                        case '3':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_3: 'true' },
                                { asiento_3 : 'false' }
                            );
                            break;
                        case '4':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_4: 'true' },
                                { asiento_4 : 'false' }
                            );
                            break;
                        case '5':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_5: 'true' },
                                { asiento_5 : 'false' }
                            );
                            break;
                        case '6':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_6: 'true' },
                                { asiento_6 : 'false' }
                            );
                            break;
                        case '7':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_7: 'true' },
                                { asiento_7 : 'false' }
                            );
                            break;
                        case '8':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_8: 'true' },
                                { asiento_8 : 'false' }
                            );
                            break;
                        case '9':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_9: 'true' },
                                { asiento_9 : 'false' }
                            );
                            break;
                        case '10':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_10: 'true' },
                                { asiento_10 : 'false' }
                            );
                            break;
                        case '11':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_11: 'true' },
                                { asiento_11 : 'false' }
                            );
                            break;
                        case '12':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_12: 'true' },
                                { asiento_12 : 'false' }
                            );
                            break;
                        case '13':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_13: 'true' },
                                { asiento_13 : 'false' }
                            );
                            break;
                        case '14':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_14: 'true' },
                                { asiento_14 : 'false' }
                            );
                            break;
                        case '15':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_15: 'true' },
                                { asiento_15 : 'false' }
                            );
                            break;
                        case '16':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_16: 'true' },
                                { asiento_16 : 'false' }
                            );
                            break;
                        case '17':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_17: 'true' },
                                { asiento_17 : 'false' }
                            );
                            break;
                        case '18':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_18: 'true' },
                                { asiento_18 : 'false' }
                            );
                            break;
                        case '19':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_19: 'true' },
                                { asiento_19 : 'false' }
                            );
                            break;
                        case '20':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_20: 'true' },
                                { asiento_20 : 'false' }
                            );
                            break;
                        case '21':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_21: 'true' },
                                { asiento_21 : 'false' }
                            );
                            break;
                        case '22':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_22: 'true' },
                                { asiento_22 : 'false' }
                            );
                            break;
                        case '23':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_23: 'true' },
                                { asiento_23 : 'false' }
                            );
                            break;
                        case '24':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_24: 'true' },
                                { asiento_24 : 'false' }
                            );
                            break;
                        case '25':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_25: 'true' },
                                { asiento_25 : 'false' }
                            );
                            break;
                        case '26':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_26: 'true' },
                                { asiento_26 : 'false' }
                            );
                            break;
                        case '27':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_27: 'true' },
                                { asiento_27 : 'false' }
                            );
                            break;
                        case '28':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_28: 'true' },
                                { asiento_28 : 'false' }
                            );
                            break;
                        case '29':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_29: 'true' },
                                { asiento_29 : 'false' }
                            );
                            break;
                        case '30':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_30: 'true' },
                                { asiento_30 : 'false' }
                            );
                            break;
                        case '31':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_31: 'true' },
                                { asiento_31 : 'false' }
                            );
                            break;
                        case '32':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_32: 'true' },
                                { asiento_32 : 'false' }
                            );
                            break;
                        case '33':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_33: 'true' },
                                { asiento_33 : 'false' }
                            );
                            break;
                        case '34':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_34: 'true' },
                                { asiento_34 : 'false' }
                            );
                            break;
                        case '35':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_35: 'true' },
                                { asiento_35 : 'false' }
                            );
                            break;
                        case '36':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_36: 'true' },
                                { asiento_36 : 'false' }
                            );
                            break;
                        case '37':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_37: 'true' },
                                { asiento_37 : 'false' }
                            );
                            break;
                        case '38':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_38: 'true' },
                                { asiento_38 : 'false' }
                            );
                            break;
                        case '39':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_39: 'true' },
                                { asiento_39 : 'false' }
                            );
                            break;
                        case '40':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_40: 'true' },
                                { asiento_40 : 'false' }
                            );
                            break;
                        case '41':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_41: 'true' },
                                { asiento_41 : 'false' }
                            );
                            break;
                        case '42':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_42: 'true' },
                                { asiento_42 : 'false' }
                            );
                            break;
                        default:
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
            case '3':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_3: 'false' },
                        { asiento_3 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '1':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_1: 'true' },
                                { asiento_1 : 'false' }
                            );
                            break;
                        case '2':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_2: 'true' },
                                { asiento_2 : 'false' }
                            );
                            break;
                        case '4':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_4: 'true' },
                                { asiento_4 : 'false' }
                            );
                            break;
                        case '5':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_5: 'true' },
                                { asiento_5 : 'false' }
                            );
                            break;
                        case '6':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_6: 'true' },
                                { asiento_6 : 'false' }
                            );
                            break;
                        case '7':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_7: 'true' },
                                { asiento_7 : 'false' }
                            );
                            break;
                        case '8':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_8: 'true' },
                                { asiento_8 : 'false' }
                            );
                            break;
                        case '9':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_9: 'true' },
                                { asiento_9 : 'false' }
                            );
                            break;
                        case '10':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_10: 'true' },
                                { asiento_10 : 'false' }
                            );
                            break;
                        case '11':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_11: 'true' },
                                { asiento_11 : 'false' }
                            );
                            break;
                        case '12':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_12: 'true' },
                                { asiento_12 : 'false' }
                            );
                            break;
                        case '13':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_13: 'true' },
                                { asiento_13 : 'false' }
                            );
                            break;
                        case '14':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_14: 'true' },
                                { asiento_14 : 'false' }
                            );
                            break;
                        case '15':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_15: 'true' },
                                { asiento_15 : 'false' }
                            );
                            break;
                        case '16':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_16: 'true' },
                                { asiento_16 : 'false' }
                            );
                            break;
                        case '17':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_17: 'true' },
                                { asiento_17 : 'false' }
                            );
                            break;
                        case '18':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_18: 'true' },
                                { asiento_18 : 'false' }
                            );
                            break;
                        case '19':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_19: 'true' },
                                { asiento_19 : 'false' }
                            );
                            break;
                        case '20':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_20: 'true' },
                                { asiento_20 : 'false' }
                            );
                            break;
                        case '21':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_21: 'true' },
                                { asiento_21 : 'false' }
                            );
                            break;
                        case '22':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_22: 'true' },
                                { asiento_22 : 'false' }
                            );
                            break;
                        case '23':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_23: 'true' },
                                { asiento_23 : 'false' }
                            );
                            break;
                        case '24':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_24: 'true' },
                                { asiento_24 : 'false' }
                            );
                            break;
                        case '25':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_25: 'true' },
                                { asiento_25 : 'false' }
                            );
                            break;
                        case '26':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_26: 'true' },
                                { asiento_26 : 'false' }
                            );
                            break;
                        case '27':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_27: 'true' },
                                { asiento_27 : 'false' }
                            );
                            break;
                        case '28':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_28: 'true' },
                                { asiento_28 : 'false' }
                            );
                            break;
                        case '29':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_29: 'true' },
                                { asiento_29 : 'false' }
                            );
                            break;
                        case '30':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_30: 'true' },
                                { asiento_30 : 'false' }
                            );
                            break;
                        case '31':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_31: 'true' },
                                { asiento_31 : 'false' }
                            );
                            break;
                        case '32':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_32: 'true' },
                                { asiento_32 : 'false' }
                            );
                            break;
                        case '33':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_33: 'true' },
                                { asiento_33 : 'false' }
                            );
                            break;
                        case '34':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_34: 'true' },
                                { asiento_34 : 'false' }
                            );
                            break;
                        case '35':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_35: 'true' },
                                { asiento_35 : 'false' }
                            );
                            break;
                        case '36':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_36: 'true' },
                                { asiento_36 : 'false' }
                            );
                            break;
                        case '37':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_37: 'true' },
                                { asiento_37 : 'false' }
                            );
                            break;
                        case '38':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_38: 'true' },
                                { asiento_38 : 'false' }
                            );
                            break;
                        case '39':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_39: 'true' },
                                { asiento_39 : 'false' }
                            );
                            break;
                        case '40':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_40: 'true' },
                                { asiento_40 : 'false' }
                            );
                            break;
                        case '41':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_41: 'true' },
                                { asiento_41 : 'false' }
                            );
                            break;
                        case '42':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_42: 'true' },
                                { asiento_42 : 'false' }
                            );
                            break;
                        default:
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
            case '4':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_4: 'false' },
                        { asiento_4 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '1':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_1: 'true' },
                                { asiento_1 : 'false' }
                            );
                            break;
                        case '2':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_2: 'true' },
                                { asiento_2 : 'false' }
                            );
                            break;
                        case '3':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_3: 'true' },
                                { asiento_3 : 'false' }
                            );
                            break;
                        case '5':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_5: 'true' },
                                { asiento_5 : 'false' }
                            );
                            break;
                        case '6':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_6: 'true' },
                                { asiento_6 : 'false' }
                            );
                            break;
                        case '7':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_7: 'true' },
                                { asiento_7 : 'false' }
                            );
                            break;
                        case '8':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_8: 'true' },
                                { asiento_8 : 'false' }
                            );
                            break;
                        case '9':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_9: 'true' },
                                { asiento_9 : 'false' }
                            );
                            break;
                        case '10':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_10: 'true' },
                                { asiento_10 : 'false' }
                            );
                            break;
                        case '11':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_11: 'true' },
                                { asiento_11 : 'false' }
                            );
                            break;
                        case '12':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_12: 'true' },
                                { asiento_12 : 'false' }
                            );
                            break;
                        case '13':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_13: 'true' },
                                { asiento_13 : 'false' }
                            );
                            break;
                        case '14':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_14: 'true' },
                                { asiento_14 : 'false' }
                            );
                            break;
                        case '15':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_15: 'true' },
                                { asiento_15 : 'false' }
                            );
                            break;
                        case '16':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_16: 'true' },
                                { asiento_16 : 'false' }
                            );
                            break;
                        case '17':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_17: 'true' },
                                { asiento_17 : 'false' }
                            );
                            break;
                        case '18':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_18: 'true' },
                                { asiento_18 : 'false' }
                            );
                            break;
                        case '19':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_19: 'true' },
                                { asiento_19 : 'false' }
                            );
                            break;
                        case '20':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_20: 'true' },
                                { asiento_20 : 'false' }
                            );
                            break;
                        case '21':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_21: 'true' },
                                { asiento_21 : 'false' }
                            );
                            break;
                        case '22':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_22: 'true' },
                                { asiento_22 : 'false' }
                            );
                            break;
                        case '23':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_23: 'true' },
                                { asiento_23 : 'false' }
                            );
                            break;
                        case '24':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_24: 'true' },
                                { asiento_24 : 'false' }
                            );
                            break;
                        case '25':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_25: 'true' },
                                { asiento_25 : 'false' }
                            );
                            break;
                        case '26':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_26: 'true' },
                                { asiento_26 : 'false' }
                            );
                            break;
                        case '27':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_27: 'true' },
                                { asiento_27 : 'false' }
                            );
                            break;
                        case '28':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_28: 'true' },
                                { asiento_28 : 'false' }
                            );
                            break;
                        case '29':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_29: 'true' },
                                { asiento_29 : 'false' }
                            );
                            break;
                        case '30':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_30: 'true' },
                                { asiento_30 : 'false' }
                            );
                            break;
                        case '31':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_31: 'true' },
                                { asiento_31 : 'false' }
                            );
                            break;
                        case '32':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_32: 'true' },
                                { asiento_32 : 'false' }
                            );
                            break;
                        case '33':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_33: 'true' },
                                { asiento_33 : 'false' }
                            );
                            break;
                        case '34':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_34: 'true' },
                                { asiento_34 : 'false' }
                            );
                            break;
                        case '35':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_35: 'true' },
                                { asiento_35 : 'false' }
                            );
                            break;
                        case '36':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_36: 'true' },
                                { asiento_36 : 'false' }
                            );
                            break;
                        case '37':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_37: 'true' },
                                { asiento_37 : 'false' }
                            );
                            break;
                        case '38':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_38: 'true' },
                                { asiento_38 : 'false' }
                            );
                            break;
                        case '39':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_39: 'true' },
                                { asiento_39 : 'false' }
                            );
                            break;
                        case '40':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_40: 'true' },
                                { asiento_40 : 'false' }
                            );
                            break;
                        case '41':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_41: 'true' },
                                { asiento_41 : 'false' }
                            );
                            break;
                        case '42':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_42: 'true' },
                                { asiento_42 : 'false' }
                            );
                            break;
                        default:
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
            case '5':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_5: 'false' },
                        { asiento_5 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '1':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_1: 'true' },
                                { asiento_1 : 'false' }
                            );
                            break;
                        case '2':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_2: 'true' },
                                { asiento_2 : 'false' }
                            );
                            break;
                        case '3':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_3: 'true' },
                                { asiento_3 : 'false' }
                            );
                            break;
                        case '4':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_4: 'true' },
                                { asiento_4 : 'false' }
                            );
                            break;
                        case '6':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_6: 'true' },
                                { asiento_6 : 'false' }
                            );
                            break;
                        case '7':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_7: 'true' },
                                { asiento_7 : 'false' }
                            );
                            break;
                        case '8':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_8: 'true' },
                                { asiento_8 : 'false' }
                            );
                            break;
                        case '9':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_9: 'true' },
                                { asiento_9 : 'false' }
                            );
                            break;
                        case '10':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_10: 'true' },
                                { asiento_10 : 'false' }
                            );
                            break;
                        case '11':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_11: 'true' },
                                { asiento_11 : 'false' }
                            );
                            break;
                        case '12':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_12: 'true' },
                                { asiento_12 : 'false' }
                            );
                            break;
                        case '13':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_13: 'true' },
                                { asiento_13 : 'false' }
                            );
                            break;
                        case '14':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_14: 'true' },
                                { asiento_14 : 'false' }
                            );
                            break;
                        case '15':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_15: 'true' },
                                { asiento_15 : 'false' }
                            );
                            break;
                        case '16':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_16: 'true' },
                                { asiento_16 : 'false' }
                            );
                            break;
                        case '17':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_17: 'true' },
                                { asiento_17 : 'false' }
                            );
                            break;
                        case '18':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_18: 'true' },
                                { asiento_18 : 'false' }
                            );
                            break;
                        case '19':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_19: 'true' },
                                { asiento_19 : 'false' }
                            );
                            break;
                        case '20':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_20: 'true' },
                                { asiento_20 : 'false' }
                            );
                            break;
                        case '21':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_21: 'true' },
                                { asiento_21 : 'false' }
                            );
                            break;
                        case '22':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_22: 'true' },
                                { asiento_22 : 'false' }
                            );
                            break;
                        case '23':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_23: 'true' },
                                { asiento_23 : 'false' }
                            );
                            break;
                        case '24':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_24: 'true' },
                                { asiento_24 : 'false' }
                            );
                            break;
                        case '25':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_25: 'true' },
                                { asiento_25 : 'false' }
                            );
                            break;
                        case '26':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_26: 'true' },
                                { asiento_26 : 'false' }
                            );
                            break;
                        case '27':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_27: 'true' },
                                { asiento_27 : 'false' }
                            );
                            break;
                        case '28':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_28: 'true' },
                                { asiento_28 : 'false' }
                            );
                            break;
                        case '29':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_29: 'true' },
                                { asiento_29 : 'false' }
                            );
                            break;
                        case '30':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_30: 'true' },
                                { asiento_30 : 'false' }
                            );
                            break;
                        case '31':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_31: 'true' },
                                { asiento_31 : 'false' }
                            );
                            break;
                        case '32':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_32: 'true' },
                                { asiento_32 : 'false' }
                            );
                            break;
                        case '33':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_33: 'true' },
                                { asiento_33 : 'false' }
                            );
                            break;
                        case '34':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_34: 'true' },
                                { asiento_34 : 'false' }
                            );
                            break;
                        case '35':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_35: 'true' },
                                { asiento_35 : 'false' }
                            );
                            break;
                        case '36':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_36: 'true' },
                                { asiento_36 : 'false' }
                            );
                            break;
                        case '37':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_37: 'true' },
                                { asiento_37 : 'false' }
                            );
                            break;
                        case '38':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_38: 'true' },
                                { asiento_38 : 'false' }
                            );
                            break;
                        case '39':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_39: 'true' },
                                { asiento_39 : 'false' }
                            );
                            break;
                        case '40':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_40: 'true' },
                                { asiento_40 : 'false' }
                            );
                            break;
                        case '41':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_41: 'true' },
                                { asiento_41 : 'false' }
                            );
                            break;
                        case '42':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_42: 'true' },
                                { asiento_42 : 'false' }
                            );
                            break;
                        default:
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
            case '6':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_6: 'false' },
                        { asiento_6 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '1':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_1: 'true' },
                                { asiento_1 : 'false' }
                            );
                            break;
                        case '2':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_2: 'true' },
                                { asiento_2 : 'false' }
                            );
                            break;
                        case '3':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_3: 'true' },
                                { asiento_3 : 'false' }
                            );
                            break;
                        case '4':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_4: 'true' },
                                { asiento_4 : 'false' }
                            );
                            break;
                        case '5':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_5: 'true' },
                                { asiento_5 : 'false' }
                            );
                            break;
                        case '7':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_7: 'true' },
                                { asiento_7 : 'false' }
                            );
                            break;
                        case '8':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_8: 'true' },
                                { asiento_8 : 'false' }
                            );
                            break;
                        case '9':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_9: 'true' },
                                { asiento_9 : 'false' }
                            );
                            break;
                        case '10':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_10: 'true' },
                                { asiento_10 : 'false' }
                            );
                            break;
                        case '11':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_11: 'true' },
                                { asiento_11 : 'false' }
                            );
                            break;
                        case '12':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_12: 'true' },
                                { asiento_12 : 'false' }
                            );
                            break;
                        case '13':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_13: 'true' },
                                { asiento_13 : 'false' }
                            );
                            break;
                        case '14':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_14: 'true' },
                                { asiento_14 : 'false' }
                            );
                            break;
                        case '15':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_15: 'true' },
                                { asiento_15 : 'false' }
                            );
                            break;
                        case '16':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_16: 'true' },
                                { asiento_16 : 'false' }
                            );
                            break;
                        case '17':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_17: 'true' },
                                { asiento_17 : 'false' }
                            );
                            break;
                        case '18':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_18: 'true' },
                                { asiento_18 : 'false' }
                            );
                            break;
                        case '19':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_19: 'true' },
                                { asiento_19 : 'false' }
                            );
                            break;
                        case '20':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_20: 'true' },
                                { asiento_20 : 'false' }
                            );
                            break;
                        case '21':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_21: 'true' },
                                { asiento_21 : 'false' }
                            );
                            break;
                        case '22':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_22: 'true' },
                                { asiento_22 : 'false' }
                            );
                            break;
                        case '23':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_23: 'true' },
                                { asiento_23 : 'false' }
                            );
                            break;
                        case '24':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_24: 'true' },
                                { asiento_24 : 'false' }
                            );
                            break;
                        case '25':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_25: 'true' },
                                { asiento_25 : 'false' }
                            );
                            break;
                        case '26':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_26: 'true' },
                                { asiento_26 : 'false' }
                            );
                            break;
                        case '27':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_27: 'true' },
                                { asiento_27 : 'false' }
                            );
                            break;
                        case '28':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_28: 'true' },
                                { asiento_28 : 'false' }
                            );
                            break;
                        case '29':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_29: 'true' },
                                { asiento_29 : 'false' }
                            );
                            break;
                        case '30':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_30: 'true' },
                                { asiento_30 : 'false' }
                            );
                            break;
                        case '31':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_31: 'true' },
                                { asiento_31 : 'false' }
                            );
                            break;
                        case '32':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_32: 'true' },
                                { asiento_32 : 'false' }
                            );
                            break;
                        case '33':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_33: 'true' },
                                { asiento_33 : 'false' }
                            );
                            break;
                        case '34':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_34: 'true' },
                                { asiento_34 : 'false' }
                            );
                            break;
                        case '35':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_35: 'true' },
                                { asiento_35 : 'false' }
                            );
                            break;
                        case '36':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_36: 'true' },
                                { asiento_36 : 'false' }
                            );
                            break;
                        case '37':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_37: 'true' },
                                { asiento_37 : 'false' }
                            );
                            break;
                        case '38':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_38: 'true' },
                                { asiento_38 : 'false' }
                            );
                            break;
                        case '39':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_39: 'true' },
                                { asiento_39 : 'false' }
                            );
                            break;
                        case '40':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_40: 'true' },
                                { asiento_40 : 'false' }
                            );
                            break;
                        case '41':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_41: 'true' },
                                { asiento_41 : 'false' }
                            );
                            break;
                        case '42':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_42: 'true' },
                                { asiento_42 : 'false' }
                            );
                            break;
                        default:
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
            case '7':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_7: 'false' },
                        { asiento_7 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '1':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_1: 'true' },
                                { asiento_1 : 'false' }
                            );
                            break;
                        case '2':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_2: 'true' },
                                { asiento_2 : 'false' }
                            );
                            break;
                        case '3':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_3: 'true' },
                                { asiento_3 : 'false' }
                            );
                            break;
                        case '4':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_4: 'true' },
                                { asiento_4 : 'false' }
                            );
                            break;
                        case '5':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_5: 'true' },
                                { asiento_5 : 'false' }
                            );
                            break;
                        case '6':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_6: 'true' },
                                { asiento_6 : 'false' }
                            );
                            break;
                        case '8':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_8: 'true' },
                                { asiento_8 : 'false' }
                            );
                            break;
                        case '9':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_9: 'true' },
                                { asiento_9 : 'false' }
                            );
                            break;
                        case '10':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_10: 'true' },
                                { asiento_10 : 'false' }
                            );
                            break;
                        case '11':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_11: 'true' },
                                { asiento_11 : 'false' }
                            );
                            break;
                        case '12':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_12: 'true' },
                                { asiento_12 : 'false' }
                            );
                            break;
                        case '13':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_13: 'true' },
                                { asiento_13 : 'false' }
                            );
                            break;
                        case '14':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_14: 'true' },
                                { asiento_14 : 'false' }
                            );
                            break;
                        case '15':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_15: 'true' },
                                { asiento_15 : 'false' }
                            );
                            break;
                        case '16':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_16: 'true' },
                                { asiento_16 : 'false' }
                            );
                            break;
                        case '17':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_17: 'true' },
                                { asiento_17 : 'false' }
                            );
                            break;
                        case '18':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_18: 'true' },
                                { asiento_18 : 'false' }
                            );
                            break;
                        case '19':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_19: 'true' },
                                { asiento_19 : 'false' }
                            );
                            break;
                        case '20':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_20: 'true' },
                                { asiento_20 : 'false' }
                            );
                            break;
                        case '21':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_21: 'true' },
                                { asiento_21 : 'false' }
                            );
                            break;
                        case '22':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_22: 'true' },
                                { asiento_22 : 'false' }
                            );
                            break;
                        case '23':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_23: 'true' },
                                { asiento_23 : 'false' }
                            );
                            break;
                        case '24':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_24: 'true' },
                                { asiento_24 : 'false' }
                            );
                            break;
                        case '25':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_25: 'true' },
                                { asiento_25 : 'false' }
                            );
                            break;
                        case '26':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_26: 'true' },
                                { asiento_26 : 'false' }
                            );
                            break;
                        case '27':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_27: 'true' },
                                { asiento_27 : 'false' }
                            );
                            break;
                        case '28':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_28: 'true' },
                                { asiento_28 : 'false' }
                            );
                            break;
                        case '29':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_29: 'true' },
                                { asiento_29 : 'false' }
                            );
                            break;
                        case '30':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_30: 'true' },
                                { asiento_30 : 'false' }
                            );
                            break;
                        case '31':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_31: 'true' },
                                { asiento_31 : 'false' }
                            );
                            break;
                        case '32':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_32: 'true' },
                                { asiento_32 : 'false' }
                            );
                            break;
                        case '33':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_33: 'true' },
                                { asiento_33 : 'false' }
                            );
                            break;
                        case '34':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_34: 'true' },
                                { asiento_34 : 'false' }
                            );
                            break;
                        case '35':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_35: 'true' },
                                { asiento_35 : 'false' }
                            );
                            break;
                        case '36':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_36: 'true' },
                                { asiento_36 : 'false' }
                            );
                            break;
                        case '37':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_37: 'true' },
                                { asiento_37 : 'false' }
                            );
                            break;
                        case '38':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_38: 'true' },
                                { asiento_38 : 'false' }
                            );
                            break;
                        case '39':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_39: 'true' },
                                { asiento_39 : 'false' }
                            );
                            break;
                        case '40':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_40: 'true' },
                                { asiento_40 : 'false' }
                            );
                            break;
                        case '41':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_41: 'true' },
                                { asiento_41 : 'false' }
                            );
                            break;
                        case '42':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_42: 'true' },
                                { asiento_42 : 'false' }
                            );
                            break;
                        default:
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
            case '8':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_8: 'false' },
                        { asiento_8 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '1':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_1: 'true' },
                                { asiento_1 : 'false' }
                            );
                            break;
                        case '2':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_2: 'true' },
                                { asiento_2 : 'false' }
                            );
                            break;
                        case '3':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_3: 'true' },
                                { asiento_3 : 'false' }
                            );
                            break;
                        case '4':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_4: 'true' },
                                { asiento_4 : 'false' }
                            );
                            break;
                        case '5':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_5: 'true' },
                                { asiento_5 : 'false' }
                            );
                            break;
                        case '6':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_6: 'true' },
                                { asiento_6 : 'false' }
                            );
                            break;
                        case '7':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_7: 'true' },
                                { asiento_7 : 'false' }
                            );
                            break;
                        case '9':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_9: 'true' },
                                { asiento_9 : 'false' }
                            );
                            break;
                        case '10':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_10: 'true' },
                                { asiento_10 : 'false' }
                            );
                            break;
                        case '11':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_11: 'true' },
                                { asiento_11 : 'false' }
                            );
                            break;
                        case '12':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_12: 'true' },
                                { asiento_12 : 'false' }
                            );
                            break;
                        case '13':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_13: 'true' },
                                { asiento_13 : 'false' }
                            );
                            break;
                        case '14':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_14: 'true' },
                                { asiento_14 : 'false' }
                            );
                            break;
                        case '15':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_15: 'true' },
                                { asiento_15 : 'false' }
                            );
                            break;
                        case '16':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_16: 'true' },
                                { asiento_16 : 'false' }
                            );
                            break;
                        case '17':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_17: 'true' },
                                { asiento_17 : 'false' }
                            );
                            break;
                        case '18':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_18: 'true' },
                                { asiento_18 : 'false' }
                            );
                            break;
                        case '19':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_19: 'true' },
                                { asiento_19 : 'false' }
                            );
                            break;
                        case '20':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_20: 'true' },
                                { asiento_20 : 'false' }
                            );
                            break;
                        case '21':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_21: 'true' },
                                { asiento_21 : 'false' }
                            );
                            break;
                        case '22':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_22: 'true' },
                                { asiento_22 : 'false' }
                            );
                            break;
                        case '23':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_23: 'true' },
                                { asiento_23 : 'false' }
                            );
                            break;
                        case '24':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_24: 'true' },
                                { asiento_24 : 'false' }
                            );
                            break;
                        case '25':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_25: 'true' },
                                { asiento_25 : 'false' }
                            );
                            break;
                        case '26':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_26: 'true' },
                                { asiento_26 : 'false' }
                            );
                            break;
                        case '27':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_27: 'true' },
                                { asiento_27 : 'false' }
                            );
                            break;
                        case '28':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_28: 'true' },
                                { asiento_28 : 'false' }
                            );
                            break;
                        case '29':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_29: 'true' },
                                { asiento_29 : 'false' }
                            );
                            break;
                        case '30':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_30: 'true' },
                                { asiento_30 : 'false' }
                            );
                            break;
                        case '31':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_31: 'true' },
                                { asiento_31 : 'false' }
                            );
                            break;
                        case '32':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_32: 'true' },
                                { asiento_32 : 'false' }
                            );
                            break;
                        case '33':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_33: 'true' },
                                { asiento_33 : 'false' }
                            );
                            break;
                        case '34':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_34: 'true' },
                                { asiento_34 : 'false' }
                            );
                            break;
                        case '35':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_35: 'true' },
                                { asiento_35 : 'false' }
                            );
                            break;
                        case '36':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_36: 'true' },
                                { asiento_36 : 'false' }
                            );
                            break;
                        case '37':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_37: 'true' },
                                { asiento_37 : 'false' }
                            );
                            break;
                        case '38':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_38: 'true' },
                                { asiento_38 : 'false' }
                            );
                            break;
                        case '39':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_39: 'true' },
                                { asiento_39 : 'false' }
                            );
                            break;
                        case '40':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_40: 'true' },
                                { asiento_40 : 'false' }
                            );
                            break;
                        case '41':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_41: 'true' },
                                { asiento_41 : 'false' }
                            );
                            break;
                        case '42':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_42: 'true' },
                                { asiento_42 : 'false' }
                            );
                            break;
                        default:
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
            case '9':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_9: 'false' },
                        { asiento_9 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '1':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_1: 'true' },
                                { asiento_1 : 'false' }
                            );
                            break;
                        case '2':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_2: 'true' },
                                { asiento_2 : 'false' }
                            );
                            break;
                        case '3':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_3: 'true' },
                                { asiento_3 : 'false' }
                            );
                            break;
                        case '4':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_4: 'true' },
                                { asiento_4 : 'false' }
                            );
                            break;
                        case '5':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_5: 'true' },
                                { asiento_5 : 'false' }
                            );
                            break;
                        case '6':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_6: 'true' },
                                { asiento_6 : 'false' }
                            );
                            break;
                        case '7':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_7: 'true' },
                                { asiento_7 : 'false' }
                            );
                            break;
                        case '8':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_8: 'true' },
                                { asiento_8 : 'false' }
                            );
                            break;
                        case '10':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_10: 'true' },
                                { asiento_10 : 'false' }
                            );
                            break;
                        case '11':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_11: 'true' },
                                { asiento_11 : 'false' }
                            );
                            break;
                        case '12':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_12: 'true' },
                                { asiento_12 : 'false' }
                            );
                            break;
                        case '13':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_13: 'true' },
                                { asiento_13 : 'false' }
                            );
                            break;
                        case '14':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_14: 'true' },
                                { asiento_14 : 'false' }
                            );
                            break;
                        case '15':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_15: 'true' },
                                { asiento_15 : 'false' }
                            );
                            break;
                        case '16':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_16: 'true' },
                                { asiento_16 : 'false' }
                            );
                            break;
                        case '17':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_17: 'true' },
                                { asiento_17 : 'false' }
                            );
                            break;
                        case '18':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_18: 'true' },
                                { asiento_18 : 'false' }
                            );
                            break;
                        case '19':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_19: 'true' },
                                { asiento_19 : 'false' }
                            );
                            break;
                        case '20':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_20: 'true' },
                                { asiento_20 : 'false' }
                            );
                            break;
                        case '21':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_21: 'true' },
                                { asiento_21 : 'false' }
                            );
                            break;
                        case '22':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_22: 'true' },
                                { asiento_22 : 'false' }
                            );
                            break;
                        case '23':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_23: 'true' },
                                { asiento_23 : 'false' }
                            );
                            break;
                        case '24':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_24: 'true' },
                                { asiento_24 : 'false' }
                            );
                            break;
                        case '25':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_25: 'true' },
                                { asiento_25 : 'false' }
                            );
                            break;
                        case '26':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_26: 'true' },
                                { asiento_26 : 'false' }
                            );
                            break;
                        case '27':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_27: 'true' },
                                { asiento_27 : 'false' }
                            );
                            break;
                        case '28':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_28: 'true' },
                                { asiento_28 : 'false' }
                            );
                            break;
                        case '29':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_29: 'true' },
                                { asiento_29 : 'false' }
                            );
                            break;
                        case '30':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_30: 'true' },
                                { asiento_30 : 'false' }
                            );
                            break;
                        case '31':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_31: 'true' },
                                { asiento_31 : 'false' }
                            );
                            break;
                        case '32':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_32: 'true' },
                                { asiento_32 : 'false' }
                            );
                            break;
                        case '33':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_33: 'true' },
                                { asiento_33 : 'false' }
                            );
                            break;
                        case '34':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_34: 'true' },
                                { asiento_34 : 'false' }
                            );
                            break;
                        case '35':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_35: 'true' },
                                { asiento_35 : 'false' }
                            );
                            break;
                        case '36':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_36: 'true' },
                                { asiento_36 : 'false' }
                            );
                            break;
                        case '37':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_37: 'true' },
                                { asiento_37 : 'false' }
                            );
                            break;
                        case '38':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_38: 'true' },
                                { asiento_38 : 'false' }
                            );
                            break;
                        case '39':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_39: 'true' },
                                { asiento_39 : 'false' }
                            );
                            break;
                        case '40':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_40: 'true' },
                                { asiento_40 : 'false' }
                            );
                            break;
                        case '41':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_41: 'true' },
                                { asiento_41 : 'false' }
                            );
                            break;
                        case '42':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_42: 'true' },
                                { asiento_42 : 'false' }
                            );
                            break;
                        default:
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
            case '10':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_10: 'false' },
                        { asiento_10 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '1':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_1: 'true' },
                                { asiento_1 : 'false' }
                            );
                            break;
                        case '2':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_2: 'true' },
                                { asiento_2 : 'false' }
                            );
                            break;
                        case '3':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_3: 'true' },
                                { asiento_3 : 'false' }
                            );
                            break;
                        case '4':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_4: 'true' },
                                { asiento_4 : 'false' }
                            );
                            break;
                        case '5':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_5: 'true' },
                                { asiento_5 : 'false' }
                            );
                            break;
                        case '6':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_6: 'true' },
                                { asiento_6 : 'false' }
                            );
                            break;
                        case '7':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_7: 'true' },
                                { asiento_7 : 'false' }
                            );
                            break;
                        case '8':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_8: 'true' },
                                { asiento_8 : 'false' }
                            );
                            break;
                        case '9':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_9: 'true' },
                                { asiento_9 : 'false' }
                            );
                            break;
                        case '11':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_11: 'true' },
                                { asiento_11 : 'false' }
                            );
                            break;
                        case '12':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_12: 'true' },
                                { asiento_12 : 'false' }
                            );
                            break;
                        case '13':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_13: 'true' },
                                { asiento_13 : 'false' }
                            );
                            break;
                        case '14':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_14: 'true' },
                                { asiento_14 : 'false' }
                            );
                            break;
                        case '15':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_15: 'true' },
                                { asiento_15 : 'false' }
                            );
                            break;
                        case '16':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_16: 'true' },
                                { asiento_16 : 'false' }
                            );
                            break;
                        case '17':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_17: 'true' },
                                { asiento_17 : 'false' }
                            );
                            break;
                        case '18':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_18: 'true' },
                                { asiento_18 : 'false' }
                            );
                            break;
                        case '19':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_19: 'true' },
                                { asiento_19 : 'false' }
                            );
                            break;
                        case '20':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_20: 'true' },
                                { asiento_20 : 'false' }
                            );
                            break;
                        case '21':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_21: 'true' },
                                { asiento_21 : 'false' }
                            );
                            break;
                        case '22':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_22: 'true' },
                                { asiento_22 : 'false' }
                            );
                            break;
                        case '23':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_23: 'true' },
                                { asiento_23 : 'false' }
                            );
                            break;
                        case '24':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_24: 'true' },
                                { asiento_24 : 'false' }
                            );
                            break;
                        case '25':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_25: 'true' },
                                { asiento_25 : 'false' }
                            );
                            break;
                        case '26':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_26: 'true' },
                                { asiento_26 : 'false' }
                            );
                            break;
                        case '27':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_27: 'true' },
                                { asiento_27 : 'false' }
                            );
                            break;
                        case '28':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_28: 'true' },
                                { asiento_28 : 'false' }
                            );
                            break;
                        case '29':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_29: 'true' },
                                { asiento_29 : 'false' }
                            );
                            break;
                        case '30':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_30: 'true' },
                                { asiento_30 : 'false' }
                            );
                            break;
                        case '31':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_31: 'true' },
                                { asiento_31 : 'false' }
                            );
                            break;
                        case '32':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_32: 'true' },
                                { asiento_32 : 'false' }
                            );
                            break;
                        case '33':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_33: 'true' },
                                { asiento_33 : 'false' }
                            );
                            break;
                        case '34':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_34: 'true' },
                                { asiento_34 : 'false' }
                            );
                            break;
                        case '35':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_35: 'true' },
                                { asiento_35 : 'false' }
                            );
                            break;
                        case '36':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_36: 'true' },
                                { asiento_36 : 'false' }
                            );
                            break;
                        case '37':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_37: 'true' },
                                { asiento_37 : 'false' }
                            );
                            break;
                        case '38':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_38: 'true' },
                                { asiento_38 : 'false' }
                            );
                            break;
                        case '39':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_39: 'true' },
                                { asiento_39 : 'false' }
                            );
                            break;
                        case '40':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_40: 'true' },
                                { asiento_40 : 'false' }
                            );
                            break;
                        case '41':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_41: 'true' },
                                { asiento_41 : 'false' }
                            );
                            break;
                        case '42':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_42: 'true' },
                                { asiento_42 : 'false' }
                            );
                            break;
                        default:
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
            case '11':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_11: 'false' },
                        { asiento_11 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '1':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_1: 'true' },
                                { asiento_1 : 'false' }
                            );
                            break;
                        case '2':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_2: 'true' },
                                { asiento_2 : 'false' }
                            );
                            break;
                        case '3':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_3: 'true' },
                                { asiento_3 : 'false' }
                            );
                            break;
                        case '4':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_4: 'true' },
                                { asiento_4 : 'false' }
                            );
                            break;
                        case '5':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_5: 'true' },
                                { asiento_5 : 'false' }
                            );
                            break;
                        case '6':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_6: 'true' },
                                { asiento_6 : 'false' }
                            );
                            break;
                        case '7':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_7: 'true' },
                                { asiento_7 : 'false' }
                            );
                            break;
                        case '8':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_8: 'true' },
                                { asiento_8 : 'false' }
                            );
                            break;
                        case '9':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_9: 'true' },
                                { asiento_9 : 'false' }
                            );
                            break;
                        case '10':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_10: 'true' },
                                { asiento_10 : 'false' }
                            );
                            break;
                        case '12':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_12: 'true' },
                                { asiento_12 : 'false' }
                            );
                            break;
                        case '13':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_13: 'true' },
                                { asiento_13 : 'false' }
                            );
                            break;
                        case '14':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_14: 'true' },
                                { asiento_14 : 'false' }
                            );
                            break;
                        case '15':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_15: 'true' },
                                { asiento_15 : 'false' }
                            );
                            break;
                        case '16':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_16: 'true' },
                                { asiento_16 : 'false' }
                            );
                            break;
                        case '17':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_17: 'true' },
                                { asiento_17 : 'false' }
                            );
                            break;
                        case '18':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_18: 'true' },
                                { asiento_18 : 'false' }
                            );
                            break;
                        case '19':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_19: 'true' },
                                { asiento_19 : 'false' }
                            );
                            break;
                        case '20':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_20: 'true' },
                                { asiento_20 : 'false' }
                            );
                            break;
                        case '21':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_21: 'true' },
                                { asiento_21 : 'false' }
                            );
                            break;
                        case '22':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_22: 'true' },
                                { asiento_22 : 'false' }
                            );
                            break;
                        case '23':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_23: 'true' },
                                { asiento_23 : 'false' }
                            );
                            break;
                        case '24':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_24: 'true' },
                                { asiento_24 : 'false' }
                            );
                            break;
                        case '25':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_25: 'true' },
                                { asiento_25 : 'false' }
                            );
                            break;
                        case '26':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_26: 'true' },
                                { asiento_26 : 'false' }
                            );
                            break;
                        case '27':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_27: 'true' },
                                { asiento_27 : 'false' }
                            );
                            break;
                        case '28':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_28: 'true' },
                                { asiento_28 : 'false' }
                            );
                            break;
                        case '29':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_29: 'true' },
                                { asiento_29 : 'false' }
                            );
                            break;
                        case '30':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_30: 'true' },
                                { asiento_30 : 'false' }
                            );
                            break;
                        case '31':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_31: 'true' },
                                { asiento_31 : 'false' }
                            );
                            break;
                        case '32':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_32: 'true' },
                                { asiento_32 : 'false' }
                            );
                            break;
                        case '33':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_33: 'true' },
                                { asiento_33 : 'false' }
                            );
                            break;
                        case '34':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_34: 'true' },
                                { asiento_34 : 'false' }
                            );
                            break;
                        case '35':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_35: 'true' },
                                { asiento_35 : 'false' }
                            );
                            break;
                        case '36':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_36: 'true' },
                                { asiento_36 : 'false' }
                            );
                            break;
                        case '37':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_37: 'true' },
                                { asiento_37 : 'false' }
                            );
                            break;
                        case '38':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_38: 'true' },
                                { asiento_38 : 'false' }
                            );
                            break;
                        case '39':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_39: 'true' },
                                { asiento_39 : 'false' }
                            );
                            break;
                        case '40':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_40: 'true' },
                                { asiento_40 : 'false' }
                            );
                            break;
                        case '41':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_41: 'true' },
                                { asiento_41 : 'false' }
                            );
                            break;
                        case '42':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_42: 'true' },
                                { asiento_42 : 'false' }
                            );
                            break;
                        default:
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
            case '12':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_12: 'false' },
                        { asiento_12 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '1':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_1: 'true' },
                                { asiento_1 : 'false' }
                            );
                            break;
                        case '2':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_2: 'true' },
                                { asiento_2 : 'false' }
                            );
                            break;
                        case '3':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_3: 'true' },
                                { asiento_3 : 'false' }
                            );
                            break;
                        case '4':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_4: 'true' },
                                { asiento_4 : 'false' }
                            );
                            break;
                        case '5':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_5: 'true' },
                                { asiento_5 : 'false' }
                            );
                            break;
                        case '6':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_6: 'true' },
                                { asiento_6 : 'false' }
                            );
                            break;
                        case '7':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_7: 'true' },
                                { asiento_7 : 'false' }
                            );
                            break;
                        case '8':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_8: 'true' },
                                { asiento_8 : 'false' }
                            );
                            break;
                        case '9':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_9: 'true' },
                                { asiento_9 : 'false' }
                            );
                            break;
                        case '10':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_10: 'true' },
                                { asiento_10 : 'false' }
                            );
                            break;
                        case '11':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_11: 'true' },
                                { asiento_11 : 'false' }
                            );
                            break;
                        case '13':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_13: 'true' },
                                { asiento_13 : 'false' }
                            );
                            break;
                        case '14':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_14: 'true' },
                                { asiento_14 : 'false' }
                            );
                            break;
                        case '15':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_15: 'true' },
                                { asiento_15 : 'false' }
                            );
                            break;
                        case '16':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_16: 'true' },
                                { asiento_16 : 'false' }
                            );
                            break;
                        case '17':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_17: 'true' },
                                { asiento_17 : 'false' }
                            );
                            break;
                        case '18':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_18: 'true' },
                                { asiento_18 : 'false' }
                            );
                            break;
                        case '19':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_19: 'true' },
                                { asiento_19 : 'false' }
                            );
                            break;
                        case '20':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_20: 'true' },
                                { asiento_20 : 'false' }
                            );
                            break;
                        case '21':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_21: 'true' },
                                { asiento_21 : 'false' }
                            );
                            break;
                        case '22':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_22: 'true' },
                                { asiento_22 : 'false' }
                            );
                            break;
                        case '23':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_23: 'true' },
                                { asiento_23 : 'false' }
                            );
                            break;
                        case '24':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_24: 'true' },
                                { asiento_24 : 'false' }
                            );
                            break;
                        case '25':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_25: 'true' },
                                { asiento_25 : 'false' }
                            );
                            break;
                        case '26':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_26: 'true' },
                                { asiento_26 : 'false' }
                            );
                            break;
                        case '27':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_27: 'true' },
                                { asiento_27 : 'false' }
                            );
                            break;
                        case '28':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_28: 'true' },
                                { asiento_28 : 'false' }
                            );
                            break;
                        case '29':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_29: 'true' },
                                { asiento_29 : 'false' }
                            );
                            break;
                        case '30':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_30: 'true' },
                                { asiento_30 : 'false' }
                            );
                            break;
                        case '31':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_31: 'true' },
                                { asiento_31 : 'false' }
                            );
                            break;
                        case '32':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_32: 'true' },
                                { asiento_32 : 'false' }
                            );
                            break;
                        case '33':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_33: 'true' },
                                { asiento_33 : 'false' }
                            );
                            break;
                        case '34':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_34: 'true' },
                                { asiento_34 : 'false' }
                            );
                            break;
                        case '35':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_35: 'true' },
                                { asiento_35 : 'false' }
                            );
                            break;
                        case '36':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_36: 'true' },
                                { asiento_36 : 'false' }
                            );
                            break;
                        case '37':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_37: 'true' },
                                { asiento_37 : 'false' }
                            );
                            break;
                        case '38':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_38: 'true' },
                                { asiento_38 : 'false' }
                            );
                            break;
                        case '39':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_39: 'true' },
                                { asiento_39 : 'false' }
                            );
                            break;
                        case '40':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_40: 'true' },
                                { asiento_40 : 'false' }
                            );
                            break;
                        case '41':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_41: 'true' },
                                { asiento_41 : 'false' }
                            );
                            break;
                        case '42':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_42: 'true' },
                                { asiento_42 : 'false' }
                            );
                            break;
                        default:
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
            case '13':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_13: 'false' },
                        { asiento_13 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '1':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_1: 'true' },
                                { asiento_1 : 'false' }
                            );
                            break;
                        case '2':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_2: 'true' },
                                { asiento_2 : 'false' }
                            );
                            break;
                        case '3':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_3: 'true' },
                                { asiento_3 : 'false' }
                            );
                            break;
                        case '4':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_4: 'true' },
                                { asiento_4 : 'false' }
                            );
                            break;
                        case '5':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_5: 'true' },
                                { asiento_5 : 'false' }
                            );
                            break;
                        case '6':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_6: 'true' },
                                { asiento_6 : 'false' }
                            );
                            break;
                        case '7':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_7: 'true' },
                                { asiento_7 : 'false' }
                            );
                            break;
                        case '8':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_8: 'true' },
                                { asiento_8 : 'false' }
                            );
                            break;
                        case '9':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_9: 'true' },
                                { asiento_9 : 'false' }
                            );
                            break;
                        case '10':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_10: 'true' },
                                { asiento_10 : 'false' }
                            );
                            break;
                        case '11':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_11: 'true' },
                                { asiento_11 : 'false' }
                            );
                            break;
                        case '12':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_12: 'true' },
                                { asiento_12 : 'false' }
                            );
                            break;
                        case '14':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_14: 'true' },
                                { asiento_14 : 'false' }
                            );
                            break;
                        case '15':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_15: 'true' },
                                { asiento_15 : 'false' }
                            );
                            break;
                        case '16':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_16: 'true' },
                                { asiento_16 : 'false' }
                            );
                            break;
                        case '17':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_17: 'true' },
                                { asiento_17 : 'false' }
                            );
                            break;
                        case '18':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_18: 'true' },
                                { asiento_18 : 'false' }
                            );
                            break;
                        case '19':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_19: 'true' },
                                { asiento_19 : 'false' }
                            );
                            break;
                        case '20':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_20: 'true' },
                                { asiento_20 : 'false' }
                            );
                            break;
                        case '21':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_21: 'true' },
                                { asiento_21 : 'false' }
                            );
                            break;
                        case '22':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_22: 'true' },
                                { asiento_22 : 'false' }
                            );
                            break;
                        case '23':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_23: 'true' },
                                { asiento_23 : 'false' }
                            );
                            break;
                        case '24':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_24: 'true' },
                                { asiento_24 : 'false' }
                            );
                            break;
                        case '25':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_25: 'true' },
                                { asiento_25 : 'false' }
                            );
                            break;
                        case '26':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_26: 'true' },
                                { asiento_26 : 'false' }
                            );
                            break;
                        case '27':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_27: 'true' },
                                { asiento_27 : 'false' }
                            );
                            break;
                        case '28':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_28: 'true' },
                                { asiento_28 : 'false' }
                            );
                            break;
                        case '29':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_29: 'true' },
                                { asiento_29 : 'false' }
                            );
                            break;
                        case '30':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_30: 'true' },
                                { asiento_30 : 'false' }
                            );
                            break;
                        case '31':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_31: 'true' },
                                { asiento_31 : 'false' }
                            );
                            break;
                        case '32':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_32: 'true' },
                                { asiento_32 : 'false' }
                            );
                            break;
                        case '33':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_33: 'true' },
                                { asiento_33 : 'false' }
                            );
                            break;
                        case '34':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_34: 'true' },
                                { asiento_34 : 'false' }
                            );
                            break;
                        case '35':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_35: 'true' },
                                { asiento_35 : 'false' }
                            );
                            break;
                        case '36':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_36: 'true' },
                                { asiento_36 : 'false' }
                            );
                            break;
                        case '37':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_37: 'true' },
                                { asiento_37 : 'false' }
                            );
                            break;
                        case '38':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_38: 'true' },
                                { asiento_38 : 'false' }
                            );
                            break;
                        case '39':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_39: 'true' },
                                { asiento_39 : 'false' }
                            );
                            break;
                        case '40':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_40: 'true' },
                                { asiento_40 : 'false' }
                            );
                            break;
                        case '41':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_41: 'true' },
                                { asiento_41 : 'false' }
                            );
                            break;
                        case '42':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_42: 'true' },
                                { asiento_42 : 'false' }
                            );
                            break;
                        default:
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
            case '14':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_14: 'false' },
                        { asiento_14 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '1':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_1: 'true' },
                                { asiento_1 : 'false' }
                            );
                            break;
                        case '2':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_2: 'true' },
                                { asiento_2 : 'false' }
                            );
                            break;
                        case '3':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_3: 'true' },
                                { asiento_3 : 'false' }
                            );
                            break;
                        case '4':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_4: 'true' },
                                { asiento_4 : 'false' }
                            );
                            break;
                        case '5':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_5: 'true' },
                                { asiento_5 : 'false' }
                            );
                            break;
                        case '6':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_6: 'true' },
                                { asiento_6 : 'false' }
                            );
                            break;
                        case '7':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_7: 'true' },
                                { asiento_7 : 'false' }
                            );
                            break;
                        case '8':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_8: 'true' },
                                { asiento_8 : 'false' }
                            );
                            break;
                        case '9':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_9: 'true' },
                                { asiento_9 : 'false' }
                            );
                            break;
                        case '10':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_10: 'true' },
                                { asiento_10 : 'false' }
                            );
                            break;
                        case '11':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_11: 'true' },
                                { asiento_11 : 'false' }
                            );
                            break;
                        case '12':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_12: 'true' },
                                { asiento_12 : 'false' }
                            );
                            break;
                        case '13':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_13: 'true' },
                                { asiento_13 : 'false' }
                            );
                            break;
                        case '15':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_15: 'true' },
                                { asiento_15 : 'false' }
                            );
                            break;
                        case '16':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_16: 'true' },
                                { asiento_16 : 'false' }
                            );
                            break;
                        case '17':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_17: 'true' },
                                { asiento_17 : 'false' }
                            );
                            break;
                        case '18':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_18: 'true' },
                                { asiento_18 : 'false' }
                            );
                            break;
                        case '19':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_19: 'true' },
                                { asiento_19 : 'false' }
                            );
                            break;
                        case '20':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_20: 'true' },
                                { asiento_20 : 'false' }
                            );
                            break;
                        case '21':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_21: 'true' },
                                { asiento_21 : 'false' }
                            );
                            break;
                        case '22':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_22: 'true' },
                                { asiento_22 : 'false' }
                            );
                            break;
                        case '23':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_23: 'true' },
                                { asiento_23 : 'false' }
                            );
                            break;
                        case '24':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_24: 'true' },
                                { asiento_24 : 'false' }
                            );
                            break;
                        case '25':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_25: 'true' },
                                { asiento_25 : 'false' }
                            );
                            break;
                        case '26':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_26: 'true' },
                                { asiento_26 : 'false' }
                            );
                            break;
                        case '27':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_27: 'true' },
                                { asiento_27 : 'false' }
                            );
                            break;
                        case '28':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_28: 'true' },
                                { asiento_28 : 'false' }
                            );
                            break;
                        case '29':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_29: 'true' },
                                { asiento_29 : 'false' }
                            );
                            break;
                        case '30':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_30: 'true' },
                                { asiento_30 : 'false' }
                            );
                            break;
                        case '31':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_31: 'true' },
                                { asiento_31 : 'false' }
                            );
                            break;
                        case '32':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_32: 'true' },
                                { asiento_32 : 'false' }
                            );
                            break;
                        case '33':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_33: 'true' },
                                { asiento_33 : 'false' }
                            );
                            break;
                        case '34':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_34: 'true' },
                                { asiento_34 : 'false' }
                            );
                            break;
                        case '35':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_35: 'true' },
                                { asiento_35 : 'false' }
                            );
                            break;
                        case '36':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_36: 'true' },
                                { asiento_36 : 'false' }
                            );
                            break;
                        case '37':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_37: 'true' },
                                { asiento_37 : 'false' }
                            );
                            break;
                        case '38':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_38: 'true' },
                                { asiento_38 : 'false' }
                            );
                            break;
                        case '39':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_39: 'true' },
                                { asiento_39 : 'false' }
                            );
                            break;
                        case '40':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_40: 'true' },
                                { asiento_40 : 'false' }
                            );
                            break;
                        case '41':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_41: 'true' },
                                { asiento_41 : 'false' }
                            );
                            break;
                        case '42':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_42: 'true' },
                                { asiento_42 : 'false' }
                            );
                            break;
                        default:
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
            case '15':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_15: 'false' },
                        { asiento_15 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '1':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_1: 'true' },
                                { asiento_1 : 'false' }
                            );
                            break;
                        case '2':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_2: 'true' },
                                { asiento_2 : 'false' }
                            );
                            break;
                        case '3':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_3: 'true' },
                                { asiento_3 : 'false' }
                            );
                            break;
                        case '4':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_4: 'true' },
                                { asiento_4 : 'false' }
                            );
                            break;
                        case '5':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_5: 'true' },
                                { asiento_5 : 'false' }
                            );
                            break;
                        case '6':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_6: 'true' },
                                { asiento_6 : 'false' }
                            );
                            break;
                        case '7':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_7: 'true' },
                                { asiento_7 : 'false' }
                            );
                            break;
                        case '8':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_8: 'true' },
                                { asiento_8 : 'false' }
                            );
                            break;
                        case '9':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_9: 'true' },
                                { asiento_9 : 'false' }
                            );
                            break;
                        case '10':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_10: 'true' },
                                { asiento_10 : 'false' }
                            );
                            break;
                        case '11':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_11: 'true' },
                                { asiento_11 : 'false' }
                            );
                            break;
                        case '12':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_12: 'true' },
                                { asiento_12 : 'false' }
                            );
                            break;
                        case '13':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_13: 'true' },
                                { asiento_13 : 'false' }
                            );
                            break;
                        case '14':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_14: 'true' },
                                { asiento_14 : 'false' }
                            );
                            break;
                        case '16':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_16: 'true' },
                                { asiento_16 : 'false' }
                            );
                            break;
                        case '17':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_17: 'true' },
                                { asiento_17 : 'false' }
                            );
                            break;
                        case '18':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_18: 'true' },
                                { asiento_18 : 'false' }
                            );
                            break;
                        case '19':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_19: 'true' },
                                { asiento_19 : 'false' }
                            );
                            break;
                        case '20':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_20: 'true' },
                                { asiento_20 : 'false' }
                            );
                            break;
                        case '21':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_21: 'true' },
                                { asiento_21 : 'false' }
                            );
                            break;
                        case '22':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_22: 'true' },
                                { asiento_22 : 'false' }
                            );
                            break;
                        case '23':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_23: 'true' },
                                { asiento_23 : 'false' }
                            );
                            break;
                        case '24':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_24: 'true' },
                                { asiento_24 : 'false' }
                            );
                            break;
                        case '25':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_25: 'true' },
                                { asiento_25 : 'false' }
                            );
                            break;
                        case '26':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_26: 'true' },
                                { asiento_26 : 'false' }
                            );
                            break;
                        case '27':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_27: 'true' },
                                { asiento_27 : 'false' }
                            );
                            break;
                        case '28':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_28: 'true' },
                                { asiento_28 : 'false' }
                            );
                            break;
                        case '29':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_29: 'true' },
                                { asiento_29 : 'false' }
                            );
                            break;
                        case '30':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_30: 'true' },
                                { asiento_30 : 'false' }
                            );
                            break;
                        case '31':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_31: 'true' },
                                { asiento_31 : 'false' }
                            );
                            break;
                        case '32':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_32: 'true' },
                                { asiento_32 : 'false' }
                            );
                            break;
                        case '33':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_33: 'true' },
                                { asiento_33 : 'false' }
                            );
                            break;
                        case '34':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_34: 'true' },
                                { asiento_34 : 'false' }
                            );
                            break;
                        case '35':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_35: 'true' },
                                { asiento_35 : 'false' }
                            );
                            break;
                        case '36':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_36: 'true' },
                                { asiento_36 : 'false' }
                            );
                            break;
                        case '37':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_37: 'true' },
                                { asiento_37 : 'false' }
                            );
                            break;
                        case '38':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_38: 'true' },
                                { asiento_38 : 'false' }
                            );
                            break;
                        case '39':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_39: 'true' },
                                { asiento_39 : 'false' }
                            );
                            break;
                        case '40':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_40: 'true' },
                                { asiento_40 : 'false' }
                            );
                            break;
                        case '41':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_41: 'true' },
                                { asiento_41 : 'false' }
                            );
                            break;
                        case '42':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_42: 'true' },
                                { asiento_42 : 'false' }
                            );
                            break;
                        default:
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
            case '16':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_16: 'false' },
                        { asiento_16 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '1':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_1: 'true' },
                                { asiento_1 : 'false' }
                            );
                            break;
                        case '2':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_2: 'true' },
                                { asiento_2 : 'false' }
                            );
                            break;
                        case '3':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_3: 'true' },
                                { asiento_3 : 'false' }
                            );
                            break;
                        case '4':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_4: 'true' },
                                { asiento_4 : 'false' }
                            );
                            break;
                        case '5':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_5: 'true' },
                                { asiento_5 : 'false' }
                            );
                            break;
                        case '6':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_6: 'true' },
                                { asiento_6 : 'false' }
                            );
                            break;
                        case '7':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_7: 'true' },
                                { asiento_7 : 'false' }
                            );
                            break;
                        case '8':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_8: 'true' },
                                { asiento_8 : 'false' }
                            );
                            break;
                        case '9':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_9: 'true' },
                                { asiento_9 : 'false' }
                            );
                            break;
                        case '10':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_10: 'true' },
                                { asiento_10 : 'false' }
                            );
                            break;
                        case '11':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_11: 'true' },
                                { asiento_11 : 'false' }
                            );
                            break;
                        case '12':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_12: 'true' },
                                { asiento_12 : 'false' }
                            );
                            break;
                        case '13':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_13: 'true' },
                                { asiento_13 : 'false' }
                            );
                            break;
                        case '14':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_14: 'true' },
                                { asiento_14 : 'false' }
                            );
                            break;
                        case '15':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_15: 'true' },
                                { asiento_15 : 'false' }
                            );
                            break;
                        case '17':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_17: 'true' },
                                { asiento_17 : 'false' }
                            );
                            break;
                        case '18':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_18: 'true' },
                                { asiento_18 : 'false' }
                            );
                            break;
                        case '19':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_19: 'true' },
                                { asiento_19 : 'false' }
                            );
                            break;
                        case '20':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_20: 'true' },
                                { asiento_20 : 'false' }
                            );
                            break;
                        case '21':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_21: 'true' },
                                { asiento_21 : 'false' }
                            );
                            break;
                        case '22':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_22: 'true' },
                                { asiento_22 : 'false' }
                            );
                            break;
                        case '23':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_23: 'true' },
                                { asiento_23 : 'false' }
                            );
                            break;
                        case '24':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_24: 'true' },
                                { asiento_24 : 'false' }
                            );
                            break;
                        case '25':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_25: 'true' },
                                { asiento_25 : 'false' }
                            );
                            break;
                        case '26':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_26: 'true' },
                                { asiento_26 : 'false' }
                            );
                            break;
                        case '27':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_27: 'true' },
                                { asiento_27 : 'false' }
                            );
                            break;
                        case '28':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_28: 'true' },
                                { asiento_28 : 'false' }
                            );
                            break;
                        case '29':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_29: 'true' },
                                { asiento_29 : 'false' }
                            );
                            break;
                        case '30':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_30: 'true' },
                                { asiento_30 : 'false' }
                            );
                            break;
                        case '31':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_31: 'true' },
                                { asiento_31 : 'false' }
                            );
                            break;
                        case '32':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_32: 'true' },
                                { asiento_32 : 'false' }
                            );
                            break;
                        case '33':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_33: 'true' },
                                { asiento_33 : 'false' }
                            );
                            break;
                        case '34':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_34: 'true' },
                                { asiento_34 : 'false' }
                            );
                            break;
                        case '35':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_35: 'true' },
                                { asiento_35 : 'false' }
                            );
                            break;
                        case '36':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_36: 'true' },
                                { asiento_36 : 'false' }
                            );
                            break;
                        case '37':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_37: 'true' },
                                { asiento_37 : 'false' }
                            );
                            break;
                        case '38':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_38: 'true' },
                                { asiento_38 : 'false' }
                            );
                            break;
                        case '39':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_39: 'true' },
                                { asiento_39 : 'false' }
                            );
                            break;
                        case '40':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_40: 'true' },
                                { asiento_40 : 'false' }
                            );
                            break;
                        case '41':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_41: 'true' },
                                { asiento_41 : 'false' }
                            );
                            break;
                        case '42':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_42: 'true' },
                                { asiento_42 : 'false' }
                            );
                            break;
                        default:
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
            case '17':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_17: 'false' },
                        { asiento_17 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '1':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_1: 'true' },
                                { asiento_1 : 'false' }
                            );
                            break;
                        case '2':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_2: 'true' },
                                { asiento_2 : 'false' }
                            );
                            break;
                        case '3':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_3: 'true' },
                                { asiento_3 : 'false' }
                            );
                            break;
                        case '4':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_4: 'true' },
                                { asiento_4 : 'false' }
                            );
                            break;
                        case '5':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_5: 'true' },
                                { asiento_5 : 'false' }
                            );
                            break;
                        case '6':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_6: 'true' },
                                { asiento_6 : 'false' }
                            );
                            break;
                        case '7':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_7: 'true' },
                                { asiento_7 : 'false' }
                            );
                            break;
                        case '8':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_8: 'true' },
                                { asiento_8 : 'false' }
                            );
                            break;
                        case '9':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_9: 'true' },
                                { asiento_9 : 'false' }
                            );
                            break;
                        case '10':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_10: 'true' },
                                { asiento_10 : 'false' }
                            );
                            break;
                        case '11':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_11: 'true' },
                                { asiento_11 : 'false' }
                            );
                            break;
                        case '12':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_12: 'true' },
                                { asiento_12 : 'false' }
                            );
                            break;
                        case '13':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_13: 'true' },
                                { asiento_13 : 'false' }
                            );
                            break;
                        case '14':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_14: 'true' },
                                { asiento_14 : 'false' }
                            );
                            break;
                        case '15':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_15: 'true' },
                                { asiento_15 : 'false' }
                            );
                            break;
                        case '16':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_16: 'true' },
                                { asiento_16 : 'false' }
                            );
                            break;
                        case '18':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_18: 'true' },
                                { asiento_18 : 'false' }
                            );
                            break;
                        case '19':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_19: 'true' },
                                { asiento_19 : 'false' }
                            );
                            break;
                        case '20':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_20: 'true' },
                                { asiento_20 : 'false' }
                            );
                            break;
                        case '21':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_21: 'true' },
                                { asiento_21 : 'false' }
                            );
                            break;
                        case '22':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_22: 'true' },
                                { asiento_22 : 'false' }
                            );
                            break;
                        case '23':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_23: 'true' },
                                { asiento_23 : 'false' }
                            );
                            break;
                        case '24':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_24: 'true' },
                                { asiento_24 : 'false' }
                            );
                            break;
                        case '25':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_25: 'true' },
                                { asiento_25 : 'false' }
                            );
                            break;
                        case '26':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_26: 'true' },
                                { asiento_26 : 'false' }
                            );
                            break;
                        case '27':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_27: 'true' },
                                { asiento_27 : 'false' }
                            );
                            break;
                        case '28':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_28: 'true' },
                                { asiento_28 : 'false' }
                            );
                            break;
                        case '29':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_29: 'true' },
                                { asiento_29 : 'false' }
                            );
                            break;
                        case '30':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_30: 'true' },
                                { asiento_30 : 'false' }
                            );
                            break;
                        case '31':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_31: 'true' },
                                { asiento_31 : 'false' }
                            );
                            break;
                        case '32':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_32: 'true' },
                                { asiento_32 : 'false' }
                            );
                            break;
                        case '33':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_33: 'true' },
                                { asiento_33 : 'false' }
                            );
                            break;
                        case '34':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_34: 'true' },
                                { asiento_34 : 'false' }
                            );
                            break;
                        case '35':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_35: 'true' },
                                { asiento_35 : 'false' }
                            );
                            break;
                        case '36':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_36: 'true' },
                                { asiento_36 : 'false' }
                            );
                            break;
                        case '37':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_37: 'true' },
                                { asiento_37 : 'false' }
                            );
                            break;
                        case '38':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_38: 'true' },
                                { asiento_38 : 'false' }
                            );
                            break;
                        case '39':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_39: 'true' },
                                { asiento_39 : 'false' }
                            );
                            break;
                        case '40':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_40: 'true' },
                                { asiento_40 : 'false' }
                            );
                            break;
                        case '41':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_41: 'true' },
                                { asiento_41 : 'false' }
                            );
                            break;
                        case '42':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_42: 'true' },
                                { asiento_42 : 'false' }
                            );
                            break;
                        default:
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
            case '18':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_18: 'false' },
                        { asiento_18 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '1':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_1: 'true' },
                                { asiento_1 : 'false' }
                            );
                            break;
                        case '2':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_2: 'true' },
                                { asiento_2 : 'false' }
                            );
                            break;
                        case '3':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_3: 'true' },
                                { asiento_3 : 'false' }
                            );
                            break;
                        case '4':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_4: 'true' },
                                { asiento_4 : 'false' }
                            );
                            break;
                        case '5':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_5: 'true' },
                                { asiento_5 : 'false' }
                            );
                            break;
                        case '6':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_6: 'true' },
                                { asiento_6 : 'false' }
                            );
                            break;
                        case '7':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_7: 'true' },
                                { asiento_7 : 'false' }
                            );
                            break;
                        case '8':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_8: 'true' },
                                { asiento_8 : 'false' }
                            );
                            break;
                        case '9':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_9: 'true' },
                                { asiento_9 : 'false' }
                            );
                            break;
                        case '10':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_10: 'true' },
                                { asiento_10 : 'false' }
                            );
                            break;
                        case '11':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_11: 'true' },
                                { asiento_11 : 'false' }
                            );
                            break;
                        case '12':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_12: 'true' },
                                { asiento_12 : 'false' }
                            );
                            break;
                        case '13':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_13: 'true' },
                                { asiento_13 : 'false' }
                            );
                            break;
                        case '14':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_14: 'true' },
                                { asiento_14 : 'false' }
                            );
                            break;
                        case '15':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_15: 'true' },
                                { asiento_15 : 'false' }
                            );
                            break;
                        case '16':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_16: 'true' },
                                { asiento_16 : 'false' }
                            );
                            break;
                        case '17':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_17: 'true' },
                                { asiento_17 : 'false' }
                            );
                            break;
                        case '19':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_19: 'true' },
                                { asiento_19 : 'false' }
                            );
                            break;
                        case '20':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_20: 'true' },
                                { asiento_20 : 'false' }
                            );
                            break;
                        case '21':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_21: 'true' },
                                { asiento_21 : 'false' }
                            );
                            break;
                        case '22':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_22: 'true' },
                                { asiento_22 : 'false' }
                            );
                            break;
                        case '23':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_23: 'true' },
                                { asiento_23 : 'false' }
                            );
                            break;
                        case '24':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_24: 'true' },
                                { asiento_24 : 'false' }
                            );
                            break;
                        case '25':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_25: 'true' },
                                { asiento_25 : 'false' }
                            );
                            break;
                        case '26':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_26: 'true' },
                                { asiento_26 : 'false' }
                            );
                            break;
                        case '27':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_27: 'true' },
                                { asiento_27 : 'false' }
                            );
                            break;
                        case '28':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_28: 'true' },
                                { asiento_28 : 'false' }
                            );
                            break;
                        case '29':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_29: 'true' },
                                { asiento_29 : 'false' }
                            );
                            break;
                        case '30':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_30: 'true' },
                                { asiento_30 : 'false' }
                            );
                            break;
                        case '31':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_31: 'true' },
                                { asiento_31 : 'false' }
                            );
                            break;
                        case '32':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_32: 'true' },
                                { asiento_32 : 'false' }
                            );
                            break;
                        case '33':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_33: 'true' },
                                { asiento_33 : 'false' }
                            );
                            break;
                        case '34':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_34: 'true' },
                                { asiento_34 : 'false' }
                            );
                            break;
                        case '35':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_35: 'true' },
                                { asiento_35 : 'false' }
                            );
                            break;
                        case '36':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_36: 'true' },
                                { asiento_36 : 'false' }
                            );
                            break;
                        case '37':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_37: 'true' },
                                { asiento_37 : 'false' }
                            );
                            break;
                        case '38':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_38: 'true' },
                                { asiento_38 : 'false' }
                            );
                            break;
                        case '39':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_39: 'true' },
                                { asiento_39 : 'false' }
                            );
                            break;
                        case '40':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_40: 'true' },
                                { asiento_40 : 'false' }
                            );
                            break;
                        case '41':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_41: 'true' },
                                { asiento_41 : 'false' }
                            );
                            break;
                        case '42':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_42: 'true' },
                                { asiento_42 : 'false' }
                            );
                            break;
                        default:
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
            case '19':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_19: 'false' },
                        { asiento_19 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '1':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_1: 'true' },
                                { asiento_1 : 'false' }
                            );
                            break;
                        case '2':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_2: 'true' },
                                { asiento_2 : 'false' }
                            );
                            break;
                        case '3':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_3: 'true' },
                                { asiento_3 : 'false' }
                            );
                            break;
                        case '4':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_4: 'true' },
                                { asiento_4 : 'false' }
                            );
                            break;
                        case '5':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_5: 'true' },
                                { asiento_5 : 'false' }
                            );
                            break;
                        case '6':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_6: 'true' },
                                { asiento_6 : 'false' }
                            );
                            break;
                        case '7':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_7: 'true' },
                                { asiento_7 : 'false' }
                            );
                            break;
                        case '8':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_8: 'true' },
                                { asiento_8 : 'false' }
                            );
                            break;
                        case '9':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_9: 'true' },
                                { asiento_9 : 'false' }
                            );
                            break;
                        case '10':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_10: 'true' },
                                { asiento_10 : 'false' }
                            );
                            break;
                        case '11':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_11: 'true' },
                                { asiento_11 : 'false' }
                            );
                            break;
                        case '12':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_12: 'true' },
                                { asiento_12 : 'false' }
                            );
                            break;
                        case '13':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_13: 'true' },
                                { asiento_13 : 'false' }
                            );
                            break;
                        case '14':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_14: 'true' },
                                { asiento_14 : 'false' }
                            );
                            break;
                        case '15':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_15: 'true' },
                                { asiento_15 : 'false' }
                            );
                            break;
                        case '16':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_16: 'true' },
                                { asiento_16 : 'false' }
                            );
                            break;
                        case '17':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_17: 'true' },
                                { asiento_17 : 'false' }
                            );
                            break;
                        case '18':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_18: 'true' },
                                { asiento_18 : 'false' }
                            );
                            break;
                        case '20':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_20: 'true' },
                                { asiento_20 : 'false' }
                            );
                            break;
                        case '21':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_21: 'true' },
                                { asiento_21 : 'false' }
                            );
                            break;
                        case '22':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_22: 'true' },
                                { asiento_22 : 'false' }
                            );
                            break;
                        case '23':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_23: 'true' },
                                { asiento_23 : 'false' }
                            );
                            break;
                        case '24':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_24: 'true' },
                                { asiento_24 : 'false' }
                            );
                            break;
                        case '25':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_25: 'true' },
                                { asiento_25 : 'false' }
                            );
                            break;
                        case '26':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_26: 'true' },
                                { asiento_26 : 'false' }
                            );
                            break;
                        case '27':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_27: 'true' },
                                { asiento_27 : 'false' }
                            );
                            break;
                        case '28':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_28: 'true' },
                                { asiento_28 : 'false' }
                            );
                            break;
                        case '29':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_29: 'true' },
                                { asiento_29 : 'false' }
                            );
                            break;
                        case '30':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_30: 'true' },
                                { asiento_30 : 'false' }
                            );
                            break;
                        case '31':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_31: 'true' },
                                { asiento_31 : 'false' }
                            );
                            break;
                        case '32':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_32: 'true' },
                                { asiento_32 : 'false' }
                            );
                            break;
                        case '33':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_33: 'true' },
                                { asiento_33 : 'false' }
                            );
                            break;
                        case '34':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_34: 'true' },
                                { asiento_34 : 'false' }
                            );
                            break;
                        case '35':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_35: 'true' },
                                { asiento_35 : 'false' }
                            );
                            break;
                        case '36':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_36: 'true' },
                                { asiento_36 : 'false' }
                            );
                            break;
                        case '37':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_37: 'true' },
                                { asiento_37 : 'false' }
                            );
                            break;
                        case '38':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_38: 'true' },
                                { asiento_38 : 'false' }
                            );
                            break;
                        case '39':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_39: 'true' },
                                { asiento_39 : 'false' }
                            );
                            break;
                        case '40':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_40: 'true' },
                                { asiento_40 : 'false' }
                            );
                            break;
                        case '41':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_41: 'true' },
                                { asiento_41 : 'false' }
                            );
                            break;
                        case '42':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_42: 'true' },
                                { asiento_42 : 'false' }
                            );
                            break;
                        default:
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
            case '20':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_20: 'false' },
                        { asiento_20 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '1':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_1: 'true' },
                                { asiento_1 : 'false' }
                            );
                            break;
                        case '2':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_2: 'true' },
                                { asiento_2 : 'false' }
                            );
                            break;
                        case '3':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_3: 'true' },
                                { asiento_3 : 'false' }
                            );
                            break;
                        case '4':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_4: 'true' },
                                { asiento_4 : 'false' }
                            );
                            break;
                        case '5':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_5: 'true' },
                                { asiento_5 : 'false' }
                            );
                            break;
                        case '6':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_6: 'true' },
                                { asiento_6 : 'false' }
                            );
                            break;
                        case '7':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_7: 'true' },
                                { asiento_7 : 'false' }
                            );
                            break;
                        case '8':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_8: 'true' },
                                { asiento_8 : 'false' }
                            );
                            break;
                        case '9':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_9: 'true' },
                                { asiento_9 : 'false' }
                            );
                            break;
                        case '10':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_10: 'true' },
                                { asiento_10 : 'false' }
                            );
                            break;
                        case '11':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_11: 'true' },
                                { asiento_11 : 'false' }
                            );
                            break;
                        case '12':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_12: 'true' },
                                { asiento_12 : 'false' }
                            );
                            break;
                        case '13':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_13: 'true' },
                                { asiento_13 : 'false' }
                            );
                            break;
                        case '14':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_14: 'true' },
                                { asiento_14 : 'false' }
                            );
                            break;
                        case '15':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_15: 'true' },
                                { asiento_15 : 'false' }
                            );
                            break;
                        case '16':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_16: 'true' },
                                { asiento_16 : 'false' }
                            );
                            break;
                        case '17':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_17: 'true' },
                                { asiento_17 : 'false' }
                            );
                            break;
                        case '18':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_18: 'true' },
                                { asiento_18 : 'false' }
                            );
                            break;
                        case '19':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_19: 'true' },
                                { asiento_19 : 'false' }
                            );
                            break;
                        case '21':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_21: 'true' },
                                { asiento_21 : 'false' }
                            );
                            break;
                        case '22':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_22: 'true' },
                                { asiento_22 : 'false' }
                            );
                            break;
                        case '23':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_23: 'true' },
                                { asiento_23 : 'false' }
                            );
                            break;
                        case '24':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_24: 'true' },
                                { asiento_24 : 'false' }
                            );
                            break;
                        case '25':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_25: 'true' },
                                { asiento_25 : 'false' }
                            );
                            break;
                        case '26':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_26: 'true' },
                                { asiento_26 : 'false' }
                            );
                            break;
                        case '27':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_27: 'true' },
                                { asiento_27 : 'false' }
                            );
                            break;
                        case '28':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_28: 'true' },
                                { asiento_28 : 'false' }
                            );
                            break;
                        case '29':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_29: 'true' },
                                { asiento_29 : 'false' }
                            );
                            break;
                        case '30':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_30: 'true' },
                                { asiento_30 : 'false' }
                            );
                            break;
                        case '31':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_31: 'true' },
                                { asiento_31 : 'false' }
                            );
                            break;
                        case '32':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_32: 'true' },
                                { asiento_32 : 'false' }
                            );
                            break;
                        case '33':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_33: 'true' },
                                { asiento_33 : 'false' }
                            );
                            break;
                        case '34':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_34: 'true' },
                                { asiento_34 : 'false' }
                            );
                            break;
                        case '35':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_35: 'true' },
                                { asiento_35 : 'false' }
                            );
                            break;
                        case '36':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_36: 'true' },
                                { asiento_36 : 'false' }
                            );
                            break;
                        case '37':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_37: 'true' },
                                { asiento_37 : 'false' }
                            );
                            break;
                        case '38':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_38: 'true' },
                                { asiento_38 : 'false' }
                            );
                            break;
                        case '39':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_39: 'true' },
                                { asiento_39 : 'false' }
                            );
                            break;
                        case '40':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_40: 'true' },
                                { asiento_40 : 'false' }
                            );
                            break;
                        case '41':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_41: 'true' },
                                { asiento_41 : 'false' }
                            );
                            break;
                        case '42':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_42: 'true' },
                                { asiento_42 : 'false' }
                            );
                            break;
                        default:
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
            case '21':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_21: 'false' },
                        { asiento_21 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '1':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_1: 'true' },
                                { asiento_1 : 'false' }
                            );
                            break;
                        case '2':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_2: 'true' },
                                { asiento_2 : 'false' }
                            );
                            break;
                        case '3':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_3: 'true' },
                                { asiento_3 : 'false' }
                            );
                            break;
                        case '4':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_4: 'true' },
                                { asiento_4 : 'false' }
                            );
                            break;
                        case '5':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_5: 'true' },
                                { asiento_5 : 'false' }
                            );
                            break;
                        case '6':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_6: 'true' },
                                { asiento_6 : 'false' }
                            );
                            break;
                        case '7':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_7: 'true' },
                                { asiento_7 : 'false' }
                            );
                            break;
                        case '8':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_8: 'true' },
                                { asiento_8 : 'false' }
                            );
                            break;
                        case '9':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_9: 'true' },
                                { asiento_9 : 'false' }
                            );
                            break;
                        case '10':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_10: 'true' },
                                { asiento_10 : 'false' }
                            );
                            break;
                        case '11':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_11: 'true' },
                                { asiento_11 : 'false' }
                            );
                            break;
                        case '12':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_12: 'true' },
                                { asiento_12 : 'false' }
                            );
                            break;
                        case '13':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_13: 'true' },
                                { asiento_13 : 'false' }
                            );
                            break;
                        case '14':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_14: 'true' },
                                { asiento_14 : 'false' }
                            );
                            break;
                        case '15':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_15: 'true' },
                                { asiento_15 : 'false' }
                            );
                            break;
                        case '16':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_16: 'true' },
                                { asiento_16 : 'false' }
                            );
                            break;
                        case '17':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_17: 'true' },
                                { asiento_17 : 'false' }
                            );
                            break;
                        case '18':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_18: 'true' },
                                { asiento_18 : 'false' }
                            );
                            break;
                        case '19':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_19: 'true' },
                                { asiento_19 : 'false' }
                            );
                            break;
                        case '20':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_20: 'true' },
                                { asiento_20 : 'false' }
                            );
                            break;
                        case '22':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_22: 'true' },
                                { asiento_22 : 'false' }
                            );
                            break;
                        case '23':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_23: 'true' },
                                { asiento_23 : 'false' }
                            );
                            break;
                        case '24':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_24: 'true' },
                                { asiento_24 : 'false' }
                            );
                            break;
                        case '25':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_25: 'true' },
                                { asiento_25 : 'false' }
                            );
                            break;
                        case '26':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_26: 'true' },
                                { asiento_26 : 'false' }
                            );
                            break;
                        case '27':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_27: 'true' },
                                { asiento_27 : 'false' }
                            );
                            break;
                        case '28':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_28: 'true' },
                                { asiento_28 : 'false' }
                            );
                            break;
                        case '29':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_29: 'true' },
                                { asiento_29 : 'false' }
                            );
                            break;
                        case '30':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_30: 'true' },
                                { asiento_30 : 'false' }
                            );
                            break;
                        case '31':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_31: 'true' },
                                { asiento_31 : 'false' }
                            );
                            break;
                        case '32':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_32: 'true' },
                                { asiento_32 : 'false' }
                            );
                            break;
                        case '33':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_33: 'true' },
                                { asiento_33 : 'false' }
                            );
                            break;
                        case '34':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_34: 'true' },
                                { asiento_34 : 'false' }
                            );
                            break;
                        case '35':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_35: 'true' },
                                { asiento_35 : 'false' }
                            );
                            break;
                        case '36':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_36: 'true' },
                                { asiento_36 : 'false' }
                            );
                            break;
                        case '37':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_37: 'true' },
                                { asiento_37 : 'false' }
                            );
                            break;
                        case '38':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_38: 'true' },
                                { asiento_38 : 'false' }
                            );
                            break;
                        case '39':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_39: 'true' },
                                { asiento_39 : 'false' }
                            );
                            break;
                        case '40':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_40: 'true' },
                                { asiento_40 : 'false' }
                            );
                            break;
                        case '41':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_41: 'true' },
                                { asiento_41 : 'false' }
                            );
                            break;
                        case '42':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_42: 'true' },
                                { asiento_42 : 'false' }
                            );
                            break;
                        default:
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
            case '22':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_22: 'false' },
                        { asiento_22 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '1':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_1: 'true' },
                                { asiento_1 : 'false' }
                            );
                            break;
                        case '2':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_2: 'true' },
                                { asiento_2 : 'false' }
                            );
                            break;
                        case '3':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_3: 'true' },
                                { asiento_3 : 'false' }
                            );
                            break;
                        case '4':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_4: 'true' },
                                { asiento_4 : 'false' }
                            );
                            break;
                        case '5':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_5: 'true' },
                                { asiento_5 : 'false' }
                            );
                            break;
                        case '6':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_6: 'true' },
                                { asiento_6 : 'false' }
                            );
                            break;
                        case '7':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_7: 'true' },
                                { asiento_7 : 'false' }
                            );
                            break;
                        case '8':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_8: 'true' },
                                { asiento_8 : 'false' }
                            );
                            break;
                        case '9':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_9: 'true' },
                                { asiento_9 : 'false' }
                            );
                            break;
                        case '10':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_10: 'true' },
                                { asiento_10 : 'false' }
                            );
                            break;
                        case '11':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_11: 'true' },
                                { asiento_11 : 'false' }
                            );
                            break;
                        case '12':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_12: 'true' },
                                { asiento_12 : 'false' }
                            );
                            break;
                        case '13':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_13: 'true' },
                                { asiento_13 : 'false' }
                            );
                            break;
                        case '14':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_14: 'true' },
                                { asiento_14 : 'false' }
                            );
                            break;
                        case '15':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_15: 'true' },
                                { asiento_15 : 'false' }
                            );
                            break;
                        case '16':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_16: 'true' },
                                { asiento_16 : 'false' }
                            );
                            break;
                        case '17':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_17: 'true' },
                                { asiento_17 : 'false' }
                            );
                            break;
                        case '18':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_18: 'true' },
                                { asiento_18 : 'false' }
                            );
                            break;
                        case '19':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_19: 'true' },
                                { asiento_19 : 'false' }
                            );
                            break;
                        case '20':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_20: 'true' },
                                { asiento_20 : 'false' }
                            );
                            break;
                        case '21':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_21: 'true' },
                                { asiento_21 : 'false' }
                            );
                            break;
                        case '23':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_23: 'true' },
                                { asiento_23 : 'false' }
                            );
                            break;
                        case '24':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_24: 'true' },
                                { asiento_24 : 'false' }
                            );
                            break;
                        case '25':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_25: 'true' },
                                { asiento_25 : 'false' }
                            );
                            break;
                        case '26':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_26: 'true' },
                                { asiento_26 : 'false' }
                            );
                            break;
                        case '27':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_27: 'true' },
                                { asiento_27 : 'false' }
                            );
                            break;
                        case '28':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_28: 'true' },
                                { asiento_28 : 'false' }
                            );
                            break;
                        case '29':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_29: 'true' },
                                { asiento_29 : 'false' }
                            );
                            break;
                        case '30':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_30: 'true' },
                                { asiento_30 : 'false' }
                            );
                            break;
                        case '31':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_31: 'true' },
                                { asiento_31 : 'false' }
                            );
                            break;
                        case '32':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_32: 'true' },
                                { asiento_32 : 'false' }
                            );
                            break;
                        case '33':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_33: 'true' },
                                { asiento_33 : 'false' }
                            );
                            break;
                        case '34':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_34: 'true' },
                                { asiento_34 : 'false' }
                            );
                            break;
                        case '35':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_35: 'true' },
                                { asiento_35 : 'false' }
                            );
                            break;
                        case '36':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_36: 'true' },
                                { asiento_36 : 'false' }
                            );
                            break;
                        case '37':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_37: 'true' },
                                { asiento_37 : 'false' }
                            );
                            break;
                        case '38':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_38: 'true' },
                                { asiento_38 : 'false' }
                            );
                            break;
                        case '39':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_39: 'true' },
                                { asiento_39 : 'false' }
                            );
                            break;
                        case '40':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_40: 'true' },
                                { asiento_40 : 'false' }
                            );
                            break;
                        case '41':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_41: 'true' },
                                { asiento_41 : 'false' }
                            );
                            break;
                        case '42':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_42: 'true' },
                                { asiento_42 : 'false' }
                            );
                            break;
                        default:
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
            case '23':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_23: 'false' },
                        { asiento_23 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '1':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_1: 'true' },
                                { asiento_1 : 'false' }
                            );
                            break;
                        case '2':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_2: 'true' },
                                { asiento_2 : 'false' }
                            );
                            break;
                        case '3':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_3: 'true' },
                                { asiento_3 : 'false' }
                            );
                            break;
                        case '4':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_4: 'true' },
                                { asiento_4 : 'false' }
                            );
                            break;
                        case '5':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_5: 'true' },
                                { asiento_5 : 'false' }
                            );
                            break;
                        case '6':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_6: 'true' },
                                { asiento_6 : 'false' }
                            );
                            break;
                        case '7':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_7: 'true' },
                                { asiento_7 : 'false' }
                            );
                            break;
                        case '8':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_8: 'true' },
                                { asiento_8 : 'false' }
                            );
                            break;
                        case '9':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_9: 'true' },
                                { asiento_9 : 'false' }
                            );
                            break;
                        case '10':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_10: 'true' },
                                { asiento_10 : 'false' }
                            );
                            break;
                        case '11':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_11: 'true' },
                                { asiento_11 : 'false' }
                            );
                            break;
                        case '12':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_12: 'true' },
                                { asiento_12 : 'false' }
                            );
                            break;
                        case '13':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_13: 'true' },
                                { asiento_13 : 'false' }
                            );
                            break;
                        case '14':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_14: 'true' },
                                { asiento_14 : 'false' }
                            );
                            break;
                        case '15':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_15: 'true' },
                                { asiento_15 : 'false' }
                            );
                            break;
                        case '16':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_16: 'true' },
                                { asiento_16 : 'false' }
                            );
                            break;
                        case '17':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_17: 'true' },
                                { asiento_17 : 'false' }
                            );
                            break;
                        case '18':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_18: 'true' },
                                { asiento_18 : 'false' }
                            );
                            break;
                        case '19':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_19: 'true' },
                                { asiento_19 : 'false' }
                            );
                            break;
                        case '20':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_20: 'true' },
                                { asiento_20 : 'false' }
                            );
                            break;
                        case '21':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_21: 'true' },
                                { asiento_21 : 'false' }
                            );
                            break;
                        case '22':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_22: 'true' },
                                { asiento_22 : 'false' }
                            );
                            break;
                        case '24':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_24: 'true' },
                                { asiento_24 : 'false' }
                            );
                            break;
                        case '25':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_25: 'true' },
                                { asiento_25 : 'false' }
                            );
                            break;
                        case '26':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_26: 'true' },
                                { asiento_26 : 'false' }
                            );
                            break;
                        case '27':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_27: 'true' },
                                { asiento_27 : 'false' }
                            );
                            break;
                        case '28':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_28: 'true' },
                                { asiento_28 : 'false' }
                            );
                            break;
                        case '29':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_29: 'true' },
                                { asiento_29 : 'false' }
                            );
                            break;
                        case '30':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_30: 'true' },
                                { asiento_30 : 'false' }
                            );
                            break;
                        case '31':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_31: 'true' },
                                { asiento_31 : 'false' }
                            );
                            break;
                        case '32':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_32: 'true' },
                                { asiento_32 : 'false' }
                            );
                            break;
                        case '33':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_33: 'true' },
                                { asiento_33 : 'false' }
                            );
                            break;
                        case '34':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_34: 'true' },
                                { asiento_34 : 'false' }
                            );
                            break;
                        case '35':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_35: 'true' },
                                { asiento_35 : 'false' }
                            );
                            break;
                        case '36':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_36: 'true' },
                                { asiento_36 : 'false' }
                            );
                            break;
                        case '37':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_37: 'true' },
                                { asiento_37 : 'false' }
                            );
                            break;
                        case '38':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_38: 'true' },
                                { asiento_38 : 'false' }
                            );
                            break;
                        case '39':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_39: 'true' },
                                { asiento_39 : 'false' }
                            );
                            break;
                        case '40':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_40: 'true' },
                                { asiento_40 : 'false' }
                            );
                            break;
                        case '41':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_41: 'true' },
                                { asiento_41 : 'false' }
                            );
                            break;
                        case '42':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_42: 'true' },
                                { asiento_42 : 'false' }
                            );
                            break;
                        default:
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
            case '24':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_24: 'false' },
                        { asiento_24 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '1':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_1: 'true' },
                                { asiento_1 : 'false' }
                            );
                            break;
                        case '2':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_2: 'true' },
                                { asiento_2 : 'false' }
                            );
                            break;
                        case '3':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_3: 'true' },
                                { asiento_3 : 'false' }
                            );
                            break;
                        case '4':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_4: 'true' },
                                { asiento_4 : 'false' }
                            );
                            break;
                        case '5':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_5: 'true' },
                                { asiento_5 : 'false' }
                            );
                            break;
                        case '6':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_6: 'true' },
                                { asiento_6 : 'false' }
                            );
                            break;
                        case '7':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_7: 'true' },
                                { asiento_7 : 'false' }
                            );
                            break;
                        case '8':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_8: 'true' },
                                { asiento_8 : 'false' }
                            );
                            break;
                        case '9':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_9: 'true' },
                                { asiento_9 : 'false' }
                            );
                            break;
                        case '10':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_10: 'true' },
                                { asiento_10 : 'false' }
                            );
                            break;
                        case '11':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_11: 'true' },
                                { asiento_11 : 'false' }
                            );
                            break;
                        case '12':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_12: 'true' },
                                { asiento_12 : 'false' }
                            );
                            break;
                        case '13':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_13: 'true' },
                                { asiento_13 : 'false' }
                            );
                            break;
                        case '14':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_14: 'true' },
                                { asiento_14 : 'false' }
                            );
                            break;
                        case '15':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_15: 'true' },
                                { asiento_15 : 'false' }
                            );
                            break;
                        case '16':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_16: 'true' },
                                { asiento_16 : 'false' }
                            );
                            break;
                        case '17':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_17: 'true' },
                                { asiento_17 : 'false' }
                            );
                            break;
                        case '18':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_18: 'true' },
                                { asiento_18 : 'false' }
                            );
                            break;
                        case '19':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_19: 'true' },
                                { asiento_19 : 'false' }
                            );
                            break;
                        case '20':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_20: 'true' },
                                { asiento_20 : 'false' }
                            );
                            break;
                        case '21':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_21: 'true' },
                                { asiento_21 : 'false' }
                            );
                            break;
                        case '22':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_22: 'true' },
                                { asiento_22 : 'false' }
                            );
                            break;
                        case '23':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_23: 'true' },
                                { asiento_23 : 'false' }
                            );
                            break;
                        case '25':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_25: 'true' },
                                { asiento_25 : 'false' }
                            );
                            break;
                        case '26':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_26: 'true' },
                                { asiento_26 : 'false' }
                            );
                            break;
                        case '27':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_27: 'true' },
                                { asiento_27 : 'false' }
                            );
                            break;
                        case '28':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_28: 'true' },
                                { asiento_28 : 'false' }
                            );
                            break;
                        case '29':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_29: 'true' },
                                { asiento_29 : 'false' }
                            );
                            break;
                        case '30':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_30: 'true' },
                                { asiento_30 : 'false' }
                            );
                            break;
                        case '31':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_31: 'true' },
                                { asiento_31 : 'false' }
                            );
                            break;
                        case '32':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_32: 'true' },
                                { asiento_32 : 'false' }
                            );
                            break;
                        case '33':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_33: 'true' },
                                { asiento_33 : 'false' }
                            );
                            break;
                        case '34':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_34: 'true' },
                                { asiento_34 : 'false' }
                            );
                            break;
                        case '35':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_35: 'true' },
                                { asiento_35 : 'false' }
                            );
                            break;
                        case '36':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_36: 'true' },
                                { asiento_36 : 'false' }
                            );
                            break;
                        case '37':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_37: 'true' },
                                { asiento_37 : 'false' }
                            );
                            break;
                        case '38':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_38: 'true' },
                                { asiento_38 : 'false' }
                            );
                            break;
                        case '39':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_39: 'true' },
                                { asiento_39 : 'false' }
                            );
                            break;
                        case '40':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_40: 'true' },
                                { asiento_40 : 'false' }
                            );
                            break;
                        case '41':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_41: 'true' },
                                { asiento_41 : 'false' }
                            );
                            break;
                        case '42':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_42: 'true' },
                                { asiento_42 : 'false' }
                            );
                            break;
                        default:
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
            case '25':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_25: 'false' },
                        { asiento_25 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '1':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_1: 'true' },
                                { asiento_1 : 'false' }
                            );
                            break;
                        case '2':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_2: 'true' },
                                { asiento_2 : 'false' }
                            );
                            break;
                        case '3':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_3: 'true' },
                                { asiento_3 : 'false' }
                            );
                            break;
                        case '4':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_4: 'true' },
                                { asiento_4 : 'false' }
                            );
                            break;
                        case '5':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_5: 'true' },
                                { asiento_5 : 'false' }
                            );
                            break;
                        case '6':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_6: 'true' },
                                { asiento_6 : 'false' }
                            );
                            break;
                        case '7':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_7: 'true' },
                                { asiento_7 : 'false' }
                            );
                            break;
                        case '8':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_8: 'true' },
                                { asiento_8 : 'false' }
                            );
                            break;
                        case '9':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_9: 'true' },
                                { asiento_9 : 'false' }
                            );
                            break;
                        case '10':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_10: 'true' },
                                { asiento_10 : 'false' }
                            );
                            break;
                        case '11':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_11: 'true' },
                                { asiento_11 : 'false' }
                            );
                            break;
                        case '12':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_12: 'true' },
                                { asiento_12 : 'false' }
                            );
                            break;
                        case '13':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_13: 'true' },
                                { asiento_13 : 'false' }
                            );
                            break;
                        case '14':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_14: 'true' },
                                { asiento_14 : 'false' }
                            );
                            break;
                        case '15':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_15: 'true' },
                                { asiento_15 : 'false' }
                            );
                            break;
                        case '16':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_16: 'true' },
                                { asiento_16 : 'false' }
                            );
                            break;
                        case '17':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_17: 'true' },
                                { asiento_17 : 'false' }
                            );
                            break;
                        case '18':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_18: 'true' },
                                { asiento_18 : 'false' }
                            );
                            break;
                        case '19':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_19: 'true' },
                                { asiento_19 : 'false' }
                            );
                            break;
                        case '20':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_20: 'true' },
                                { asiento_20 : 'false' }
                            );
                            break;
                        case '21':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_21: 'true' },
                                { asiento_21 : 'false' }
                            );
                            break;
                        case '22':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_22: 'true' },
                                { asiento_22 : 'false' }
                            );
                            break;
                        case '23':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_23: 'true' },
                                { asiento_23 : 'false' }
                            );
                            break;
                        case '24':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_24: 'true' },
                                { asiento_24 : 'false' }
                            );
                            break;
                        case '26':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_26: 'true' },
                                { asiento_26 : 'false' }
                            );
                            break;
                        case '27':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_27: 'true' },
                                { asiento_27 : 'false' }
                            );
                            break;
                        case '28':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_28: 'true' },
                                { asiento_28 : 'false' }
                            );
                            break;
                        case '29':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_29: 'true' },
                                { asiento_29 : 'false' }
                            );
                            break;
                        case '30':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_30: 'true' },
                                { asiento_30 : 'false' }
                            );
                            break;
                        case '31':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_31: 'true' },
                                { asiento_31 : 'false' }
                            );
                            break;
                        case '32':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_32: 'true' },
                                { asiento_32 : 'false' }
                            );
                            break;
                        case '33':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_33: 'true' },
                                { asiento_33 : 'false' }
                            );
                            break;
                        case '34':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_34: 'true' },
                                { asiento_34 : 'false' }
                            );
                            break;
                        case '35':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_35: 'true' },
                                { asiento_35 : 'false' }
                            );
                            break;
                        case '36':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_36: 'true' },
                                { asiento_36 : 'false' }
                            );
                            break;
                        case '37':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_37: 'true' },
                                { asiento_37 : 'false' }
                            );
                            break;
                        case '38':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_38: 'true' },
                                { asiento_38 : 'false' }
                            );
                            break;
                        case '39':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_39: 'true' },
                                { asiento_39 : 'false' }
                            );
                            break;
                        case '40':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_40: 'true' },
                                { asiento_40 : 'false' }
                            );
                            break;
                        case '41':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_41: 'true' },
                                { asiento_41 : 'false' }
                            );
                            break;
                        case '42':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_42: 'true' },
                                { asiento_42 : 'false' }
                            );
                            break;
                        default:
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
            case '26':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_26: 'false' },
                        { asiento_26 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '1':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_1: 'true' },
                                { asiento_1 : 'false' }
                            );
                            break;
                        case '2':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_2: 'true' },
                                { asiento_2 : 'false' }
                            );
                            break;
                        case '3':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_3: 'true' },
                                { asiento_3 : 'false' }
                            );
                            break;
                        case '4':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_4: 'true' },
                                { asiento_4 : 'false' }
                            );
                            break;
                        case '5':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_5: 'true' },
                                { asiento_5 : 'false' }
                            );
                            break;
                        case '6':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_6: 'true' },
                                { asiento_6 : 'false' }
                            );
                            break;
                        case '7':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_7: 'true' },
                                { asiento_7 : 'false' }
                            );
                            break;
                        case '8':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_8: 'true' },
                                { asiento_8 : 'false' }
                            );
                            break;
                        case '9':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_9: 'true' },
                                { asiento_9 : 'false' }
                            );
                            break;
                        case '10':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_10: 'true' },
                                { asiento_10 : 'false' }
                            );
                            break;
                        case '11':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_11: 'true' },
                                { asiento_11 : 'false' }
                            );
                            break;
                        case '12':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_12: 'true' },
                                { asiento_12 : 'false' }
                            );
                            break;
                        case '13':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_13: 'true' },
                                { asiento_13 : 'false' }
                            );
                            break;
                        case '14':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_14: 'true' },
                                { asiento_14 : 'false' }
                            );
                            break;
                        case '15':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_15: 'true' },
                                { asiento_15 : 'false' }
                            );
                            break;
                        case '16':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_16: 'true' },
                                { asiento_16 : 'false' }
                            );
                            break;
                        case '17':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_17: 'true' },
                                { asiento_17 : 'false' }
                            );
                            break;
                        case '18':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_18: 'true' },
                                { asiento_18 : 'false' }
                            );
                            break;
                        case '19':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_19: 'true' },
                                { asiento_19 : 'false' }
                            );
                            break;
                        case '20':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_20: 'true' },
                                { asiento_20 : 'false' }
                            );
                            break;
                        case '21':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_21: 'true' },
                                { asiento_21 : 'false' }
                            );
                            break;
                        case '22':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_22: 'true' },
                                { asiento_22 : 'false' }
                            );
                            break;
                        case '23':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_23: 'true' },
                                { asiento_23 : 'false' }
                            );
                            break;
                        case '24':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_24: 'true' },
                                { asiento_24 : 'false' }
                            );
                            break;
                        case '25':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_25: 'true' },
                                { asiento_25 : 'false' }
                            );
                            break;
                        case '27':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_27: 'true' },
                                { asiento_27 : 'false' }
                            );
                            break;
                        case '28':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_28: 'true' },
                                { asiento_28 : 'false' }
                            );
                            break;
                        case '29':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_29: 'true' },
                                { asiento_29 : 'false' }
                            );
                            break;
                        case '30':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_30: 'true' },
                                { asiento_30 : 'false' }
                            );
                            break;
                        case '31':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_31: 'true' },
                                { asiento_31 : 'false' }
                            );
                            break;
                        case '32':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_32: 'true' },
                                { asiento_32 : 'false' }
                            );
                            break;
                        case '33':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_33: 'true' },
                                { asiento_33 : 'false' }
                            );
                            break;
                        case '34':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_34: 'true' },
                                { asiento_34 : 'false' }
                            );
                            break;
                        case '35':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_35: 'true' },
                                { asiento_35 : 'false' }
                            );
                            break;
                        case '36':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_36: 'true' },
                                { asiento_36 : 'false' }
                            );
                            break;
                        case '37':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_37: 'true' },
                                { asiento_37 : 'false' }
                            );
                            break;
                        case '38':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_38: 'true' },
                                { asiento_38 : 'false' }
                            );
                            break;
                        case '39':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_39: 'true' },
                                { asiento_39 : 'false' }
                            );
                            break;
                        case '40':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_40: 'true' },
                                { asiento_40 : 'false' }
                            );
                            break;
                        case '41':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_41: 'true' },
                                { asiento_41 : 'false' }
                            );
                            break;
                        case '42':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_42: 'true' },
                                { asiento_42 : 'false' }
                            );
                            break;
                        default:
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
            case '27':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_27: 'false' },
                        { asiento_27 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '1':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_1: 'true' },
                                { asiento_1 : 'false' }
                            );
                            break;
                        case '2':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_2: 'true' },
                                { asiento_2 : 'false' }
                            );
                            break;
                        case '3':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_3: 'true' },
                                { asiento_3 : 'false' }
                            );
                            break;
                        case '4':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_4: 'true' },
                                { asiento_4 : 'false' }
                            );
                            break;
                        case '5':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_5: 'true' },
                                { asiento_5 : 'false' }
                            );
                            break;
                        case '6':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_6: 'true' },
                                { asiento_6 : 'false' }
                            );
                            break;
                        case '7':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_7: 'true' },
                                { asiento_7 : 'false' }
                            );
                            break;
                        case '8':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_8: 'true' },
                                { asiento_8 : 'false' }
                            );
                            break;
                        case '9':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_9: 'true' },
                                { asiento_9 : 'false' }
                            );
                            break;
                        case '10':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_10: 'true' },
                                { asiento_10 : 'false' }
                            );
                            break;
                        case '11':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_11: 'true' },
                                { asiento_11 : 'false' }
                            );
                            break;
                        case '12':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_12: 'true' },
                                { asiento_12 : 'false' }
                            );
                            break;
                        case '13':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_13: 'true' },
                                { asiento_13 : 'false' }
                            );
                            break;
                        case '14':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_14: 'true' },
                                { asiento_14 : 'false' }
                            );
                            break;
                        case '15':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_15: 'true' },
                                { asiento_15 : 'false' }
                            );
                            break;
                        case '16':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_16: 'true' },
                                { asiento_16 : 'false' }
                            );
                            break;
                        case '17':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_17: 'true' },
                                { asiento_17 : 'false' }
                            );
                            break;
                        case '18':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_18: 'true' },
                                { asiento_18 : 'false' }
                            );
                            break;
                        case '19':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_19: 'true' },
                                { asiento_19 : 'false' }
                            );
                            break;
                        case '20':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_20: 'true' },
                                { asiento_20 : 'false' }
                            );
                            break;
                        case '21':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_21: 'true' },
                                { asiento_21 : 'false' }
                            );
                            break;
                        case '22':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_22: 'true' },
                                { asiento_22 : 'false' }
                            );
                            break;
                        case '23':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_23: 'true' },
                                { asiento_23 : 'false' }
                            );
                            break;
                        case '24':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_24: 'true' },
                                { asiento_24 : 'false' }
                            );
                            break;
                        case '25':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_25: 'true' },
                                { asiento_25 : 'false' }
                            );
                            break;
                        case '26':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_26: 'true' },
                                { asiento_26 : 'false' }
                            );
                            break;
                        case '28':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_28: 'true' },
                                { asiento_28 : 'false' }
                            );
                            break;
                        case '29':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_29: 'true' },
                                { asiento_29 : 'false' }
                            );
                            break;
                        case '30':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_30: 'true' },
                                { asiento_30 : 'false' }
                            );
                            break;
                        case '31':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_31: 'true' },
                                { asiento_31 : 'false' }
                            );
                            break;
                        case '32':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_32: 'true' },
                                { asiento_32 : 'false' }
                            );
                            break;
                        case '33':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_33: 'true' },
                                { asiento_33 : 'false' }
                            );
                            break;
                        case '34':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_34: 'true' },
                                { asiento_34 : 'false' }
                            );
                            break;
                        case '35':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_35: 'true' },
                                { asiento_35 : 'false' }
                            );
                            break;
                        case '36':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_36: 'true' },
                                { asiento_36 : 'false' }
                            );
                            break;
                        case '37':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_37: 'true' },
                                { asiento_37 : 'false' }
                            );
                            break;
                        case '38':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_38: 'true' },
                                { asiento_38 : 'false' }
                            );
                            break;
                        case '39':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_39: 'true' },
                                { asiento_39 : 'false' }
                            );
                            break;
                        case '40':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_40: 'true' },
                                { asiento_40 : 'false' }
                            );
                            break;
                        case '41':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_41: 'true' },
                                { asiento_41 : 'false' }
                            );
                            break;
                        case '42':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_42: 'true' },
                                { asiento_42 : 'false' }
                            );
                            break;
                        default:
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
            case '28':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_28: 'false' },
                        { asiento_28 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '1':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_1: 'true' },
                                { asiento_1 : 'false' }
                            );
                            break;
                        case '2':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_2: 'true' },
                                { asiento_2 : 'false' }
                            );
                            break;
                        case '3':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_3: 'true' },
                                { asiento_3 : 'false' }
                            );
                            break;
                        case '4':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_4: 'true' },
                                { asiento_4 : 'false' }
                            );
                            break;
                        case '5':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_5: 'true' },
                                { asiento_5 : 'false' }
                            );
                            break;
                        case '6':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_6: 'true' },
                                { asiento_6 : 'false' }
                            );
                            break;
                        case '7':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_7: 'true' },
                                { asiento_7 : 'false' }
                            );
                            break;
                        case '8':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_8: 'true' },
                                { asiento_8 : 'false' }
                            );
                            break;
                        case '9':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_9: 'true' },
                                { asiento_9 : 'false' }
                            );
                            break;
                        case '10':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_10: 'true' },
                                { asiento_10 : 'false' }
                            );
                            break;
                        case '11':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_11: 'true' },
                                { asiento_11 : 'false' }
                            );
                            break;
                        case '12':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_12: 'true' },
                                { asiento_12 : 'false' }
                            );
                            break;
                        case '13':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_13: 'true' },
                                { asiento_13 : 'false' }
                            );
                            break;
                        case '14':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_14: 'true' },
                                { asiento_14 : 'false' }
                            );
                            break;
                        case '15':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_15: 'true' },
                                { asiento_15 : 'false' }
                            );
                            break;
                        case '16':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_16: 'true' },
                                { asiento_16 : 'false' }
                            );
                            break;
                        case '17':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_17: 'true' },
                                { asiento_17 : 'false' }
                            );
                            break;
                        case '18':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_18: 'true' },
                                { asiento_18 : 'false' }
                            );
                            break;
                        case '19':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_19: 'true' },
                                { asiento_19 : 'false' }
                            );
                            break;
                        case '20':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_20: 'true' },
                                { asiento_20 : 'false' }
                            );
                            break;
                        case '21':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_21: 'true' },
                                { asiento_21 : 'false' }
                            );
                            break;
                        case '22':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_22: 'true' },
                                { asiento_22 : 'false' }
                            );
                            break;
                        case '23':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_23: 'true' },
                                { asiento_23 : 'false' }
                            );
                            break;
                        case '24':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_24: 'true' },
                                { asiento_24 : 'false' }
                            );
                            break;
                        case '25':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_25: 'true' },
                                { asiento_25 : 'false' }
                            );
                            break;
                        case '26':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_26: 'true' },
                                { asiento_26 : 'false' }
                            );
                            break;
                        case '27':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_27: 'true' },
                                { asiento_27 : 'false' }
                            );
                            break;
                        case '29':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_29: 'true' },
                                { asiento_29 : 'false' }
                            );
                            break;
                        case '30':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_30: 'true' },
                                { asiento_30 : 'false' }
                            );
                            break;
                        case '31':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_31: 'true' },
                                { asiento_31 : 'false' }
                            );
                            break;
                        case '32':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_32: 'true' },
                                { asiento_32 : 'false' }
                            );
                            break;
                        case '33':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_33: 'true' },
                                { asiento_33 : 'false' }
                            );
                            break;
                        case '34':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_34: 'true' },
                                { asiento_34 : 'false' }
                            );
                            break;
                        case '35':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_35: 'true' },
                                { asiento_35 : 'false' }
                            );
                            break;
                        case '36':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_36: 'true' },
                                { asiento_36 : 'false' }
                            );
                            break;
                        case '37':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_37: 'true' },
                                { asiento_37 : 'false' }
                            );
                            break;
                        case '38':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_38: 'true' },
                                { asiento_38 : 'false' }
                            );
                            break;
                        case '39':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_39: 'true' },
                                { asiento_39 : 'false' }
                            );
                            break;
                        case '40':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_40: 'true' },
                                { asiento_40 : 'false' }
                            );
                            break;
                        case '41':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_41: 'true' },
                                { asiento_41 : 'false' }
                            );
                            break;
                        case '42':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_42: 'true' },
                                { asiento_42 : 'false' }
                            );
                            break;
                        default:
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
            case '29':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_29: 'false' },
                        { asiento_29 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '1':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_1: 'true' },
                                { asiento_1 : 'false' }
                            );
                            break;
                        case '2':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_2: 'true' },
                                { asiento_2 : 'false' }
                            );
                            break;
                        case '3':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_3: 'true' },
                                { asiento_3 : 'false' }
                            );
                            break;
                        case '4':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_4: 'true' },
                                { asiento_4 : 'false' }
                            );
                            break;
                        case '5':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_5: 'true' },
                                { asiento_5 : 'false' }
                            );
                            break;
                        case '6':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_6: 'true' },
                                { asiento_6 : 'false' }
                            );
                            break;
                        case '7':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_7: 'true' },
                                { asiento_7 : 'false' }
                            );
                            break;
                        case '8':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_8: 'true' },
                                { asiento_8 : 'false' }
                            );
                            break;
                        case '9':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_9: 'true' },
                                { asiento_9 : 'false' }
                            );
                            break;
                        case '10':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_10: 'true' },
                                { asiento_10 : 'false' }
                            );
                            break;
                        case '11':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_11: 'true' },
                                { asiento_11 : 'false' }
                            );
                            break;
                        case '12':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_12: 'true' },
                                { asiento_12 : 'false' }
                            );
                            break;
                        case '13':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_13: 'true' },
                                { asiento_13 : 'false' }
                            );
                            break;
                        case '14':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_14: 'true' },
                                { asiento_14 : 'false' }
                            );
                            break;
                        case '15':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_15: 'true' },
                                { asiento_15 : 'false' }
                            );
                            break;
                        case '16':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_16: 'true' },
                                { asiento_16 : 'false' }
                            );
                            break;
                        case '17':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_17: 'true' },
                                { asiento_17 : 'false' }
                            );
                            break;
                        case '18':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_18: 'true' },
                                { asiento_18 : 'false' }
                            );
                            break;
                        case '19':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_19: 'true' },
                                { asiento_19 : 'false' }
                            );
                            break;
                        case '20':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_20: 'true' },
                                { asiento_20 : 'false' }
                            );
                            break;
                        case '21':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_21: 'true' },
                                { asiento_21 : 'false' }
                            );
                            break;
                        case '22':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_22: 'true' },
                                { asiento_22 : 'false' }
                            );
                            break;
                        case '23':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_23: 'true' },
                                { asiento_23 : 'false' }
                            );
                            break;
                        case '24':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_24: 'true' },
                                { asiento_24 : 'false' }
                            );
                            break;
                        case '25':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_25: 'true' },
                                { asiento_25 : 'false' }
                            );
                            break;
                        case '26':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_26: 'true' },
                                { asiento_26 : 'false' }
                            );
                            break;
                        case '27':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_27: 'true' },
                                { asiento_27 : 'false' }
                            );
                            break;
                        case '28':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_28: 'true' },
                                { asiento_28 : 'false' }
                            );
                            break;
                        case '30':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_30: 'true' },
                                { asiento_30 : 'false' }
                            );
                            break;
                        case '31':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_31: 'true' },
                                { asiento_31 : 'false' }
                            );
                            break;
                        case '32':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_32: 'true' },
                                { asiento_32 : 'false' }
                            );
                            break;
                        case '33':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_33: 'true' },
                                { asiento_33 : 'false' }
                            );
                            break;
                        case '34':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_34: 'true' },
                                { asiento_34 : 'false' }
                            );
                            break;
                        case '35':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_35: 'true' },
                                { asiento_35 : 'false' }
                            );
                            break;
                        case '36':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_36: 'true' },
                                { asiento_36 : 'false' }
                            );
                            break;
                        case '37':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_37: 'true' },
                                { asiento_37 : 'false' }
                            );
                            break;
                        case '38':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_38: 'true' },
                                { asiento_38 : 'false' }
                            );
                            break;
                        case '39':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_39: 'true' },
                                { asiento_39 : 'false' }
                            );
                            break;
                        case '40':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_40: 'true' },
                                { asiento_40 : 'false' }
                            );
                            break;
                        case '41':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_41: 'true' },
                                { asiento_41 : 'false' }
                            );
                            break;
                        case '42':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_42: 'true' },
                                { asiento_42 : 'false' }
                            );
                            break;
                        default:
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
            case '30':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_30: 'false' },
                        { asiento_30 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '1':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_1: 'true' },
                                { asiento_1 : 'false' }
                            );
                            break;
                        case '2':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_2: 'true' },
                                { asiento_2 : 'false' }
                            );
                            break;
                        case '3':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_3: 'true' },
                                { asiento_3 : 'false' }
                            );
                            break;
                        case '4':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_4: 'true' },
                                { asiento_4 : 'false' }
                            );
                            break;
                        case '5':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_5: 'true' },
                                { asiento_5 : 'false' }
                            );
                            break;
                        case '6':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_6: 'true' },
                                { asiento_6 : 'false' }
                            );
                            break;
                        case '7':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_7: 'true' },
                                { asiento_7 : 'false' }
                            );
                            break;
                        case '8':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_8: 'true' },
                                { asiento_8 : 'false' }
                            );
                            break;
                        case '9':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_9: 'true' },
                                { asiento_9 : 'false' }
                            );
                            break;
                        case '10':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_10: 'true' },
                                { asiento_10 : 'false' }
                            );
                            break;
                        case '11':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_11: 'true' },
                                { asiento_11 : 'false' }
                            );
                            break;
                        case '12':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_12: 'true' },
                                { asiento_12 : 'false' }
                            );
                            break;
                        case '13':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_13: 'true' },
                                { asiento_13 : 'false' }
                            );
                            break;
                        case '14':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_14: 'true' },
                                { asiento_14 : 'false' }
                            );
                            break;
                        case '15':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_15: 'true' },
                                { asiento_15 : 'false' }
                            );
                            break;
                        case '16':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_16: 'true' },
                                { asiento_16 : 'false' }
                            );
                            break;
                        case '17':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_17: 'true' },
                                { asiento_17 : 'false' }
                            );
                            break;
                        case '18':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_18: 'true' },
                                { asiento_18 : 'false' }
                            );
                            break;
                        case '19':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_19: 'true' },
                                { asiento_19 : 'false' }
                            );
                            break;
                        case '20':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_20: 'true' },
                                { asiento_20 : 'false' }
                            );
                            break;
                        case '21':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_21: 'true' },
                                { asiento_21 : 'false' }
                            );
                            break;
                        case '22':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_22: 'true' },
                                { asiento_22 : 'false' }
                            );
                            break;
                        case '23':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_23: 'true' },
                                { asiento_23 : 'false' }
                            );
                            break;
                        case '24':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_24: 'true' },
                                { asiento_24 : 'false' }
                            );
                            break;
                        case '25':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_25: 'true' },
                                { asiento_25 : 'false' }
                            );
                            break;
                        case '26':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_26: 'true' },
                                { asiento_26 : 'false' }
                            );
                            break;
                        case '27':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_27: 'true' },
                                { asiento_27 : 'false' }
                            );
                            break;
                        case '28':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_28: 'true' },
                                { asiento_28 : 'false' }
                            );
                            break;
                        case '29':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_29: 'true' },
                                { asiento_29 : 'false' }
                            );
                            break;
                        case '31':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_31: 'true' },
                                { asiento_31 : 'false' }
                            );
                            break;
                        case '32':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_32: 'true' },
                                { asiento_32 : 'false' }
                            );
                            break;
                        case '33':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_33: 'true' },
                                { asiento_33 : 'false' }
                            );
                            break;
                        case '34':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_34: 'true' },
                                { asiento_34 : 'false' }
                            );
                            break;
                        case '35':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_35: 'true' },
                                { asiento_35 : 'false' }
                            );
                            break;
                        case '36':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_36: 'true' },
                                { asiento_36 : 'false' }
                            );
                            break;
                        case '37':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_37: 'true' },
                                { asiento_37 : 'false' }
                            );
                            break;
                        case '38':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_38: 'true' },
                                { asiento_38 : 'false' }
                            );
                            break;
                        case '39':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_39: 'true' },
                                { asiento_39 : 'false' }
                            );
                            break;
                        case '40':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_40: 'true' },
                                { asiento_40 : 'false' }
                            );
                            break;
                        case '41':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_41: 'true' },
                                { asiento_41 : 'false' }
                            );
                            break;
                        case '42':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_42: 'true' },
                                { asiento_42 : 'false' }
                            );
                            break;
                        default:
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
            case '31':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_31: 'false' },
                        { asiento_31 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '1':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_1: 'true' },
                                { asiento_1 : 'false' }
                            );
                            break;
                        case '2':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_2: 'true' },
                                { asiento_2 : 'false' }
                            );
                            break;
                        case '3':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_3: 'true' },
                                { asiento_3 : 'false' }
                            );
                            break;
                        case '4':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_4: 'true' },
                                { asiento_4 : 'false' }
                            );
                            break;
                        case '5':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_5: 'true' },
                                { asiento_5 : 'false' }
                            );
                            break;
                        case '6':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_6: 'true' },
                                { asiento_6 : 'false' }
                            );
                            break;
                        case '7':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_7: 'true' },
                                { asiento_7 : 'false' }
                            );
                            break;
                        case '8':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_8: 'true' },
                                { asiento_8 : 'false' }
                            );
                            break;
                        case '9':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_9: 'true' },
                                { asiento_9 : 'false' }
                            );
                            break;
                        case '10':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_10: 'true' },
                                { asiento_10 : 'false' }
                            );
                            break;
                        case '11':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_11: 'true' },
                                { asiento_11 : 'false' }
                            );
                            break;
                        case '12':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_12: 'true' },
                                { asiento_12 : 'false' }
                            );
                            break;
                        case '13':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_13: 'true' },
                                { asiento_13 : 'false' }
                            );
                            break;
                        case '14':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_14: 'true' },
                                { asiento_14 : 'false' }
                            );
                            break;
                        case '15':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_15: 'true' },
                                { asiento_15 : 'false' }
                            );
                            break;
                        case '16':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_16: 'true' },
                                { asiento_16 : 'false' }
                            );
                            break;
                        case '17':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_17: 'true' },
                                { asiento_17 : 'false' }
                            );
                            break;
                        case '18':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_18: 'true' },
                                { asiento_18 : 'false' }
                            );
                            break;
                        case '19':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_19: 'true' },
                                { asiento_19 : 'false' }
                            );
                            break;
                        case '20':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_20: 'true' },
                                { asiento_20 : 'false' }
                            );
                            break;
                        case '21':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_21: 'true' },
                                { asiento_21 : 'false' }
                            );
                            break;
                        case '22':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_22: 'true' },
                                { asiento_22 : 'false' }
                            );
                            break;
                        case '23':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_23: 'true' },
                                { asiento_23 : 'false' }
                            );
                            break;
                        case '24':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_24: 'true' },
                                { asiento_24 : 'false' }
                            );
                            break;
                        case '25':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_25: 'true' },
                                { asiento_25 : 'false' }
                            );
                            break;
                        case '26':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_26: 'true' },
                                { asiento_26 : 'false' }
                            );
                            break;
                        case '27':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_27: 'true' },
                                { asiento_27 : 'false' }
                            );
                            break;
                        case '28':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_28: 'true' },
                                { asiento_28 : 'false' }
                            );
                            break;
                        case '29':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_29: 'true' },
                                { asiento_29 : 'false' }
                            );
                            break;
                        case '30':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_30: 'true' },
                                { asiento_30 : 'false' }
                            );
                            break;
                        case '32':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_32: 'true' },
                                { asiento_32 : 'false' }
                            );
                            break;
                        case '33':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_33: 'true' },
                                { asiento_33 : 'false' }
                            );
                            break;
                        case '34':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_34: 'true' },
                                { asiento_34 : 'false' }
                            );
                            break;
                        case '35':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_35: 'true' },
                                { asiento_35 : 'false' }
                            );
                            break;
                        case '36':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_36: 'true' },
                                { asiento_36 : 'false' }
                            );
                            break;
                        case '37':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_37: 'true' },
                                { asiento_37 : 'false' }
                            );
                            break;
                        case '38':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_38: 'true' },
                                { asiento_38 : 'false' }
                            );
                            break;
                        case '39':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_39: 'true' },
                                { asiento_39 : 'false' }
                            );
                            break;
                        case '40':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_40: 'true' },
                                { asiento_40 : 'false' }
                            );
                            break;
                        case '41':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_41: 'true' },
                                { asiento_41 : 'false' }
                            );
                            break;
                        case '42':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_42: 'true' },
                                { asiento_42 : 'false' }
                            );
                            break;
                        default:
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
            case '32':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_32: 'false' },
                        { asiento_32 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '1':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_1: 'true' },
                                { asiento_1 : 'false' }
                            );
                            break;
                        case '2':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_2: 'true' },
                                { asiento_2 : 'false' }
                            );
                            break;
                        case '3':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_3: 'true' },
                                { asiento_3 : 'false' }
                            );
                            break;
                        case '4':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_4: 'true' },
                                { asiento_4 : 'false' }
                            );
                            break;
                        case '5':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_5: 'true' },
                                { asiento_5 : 'false' }
                            );
                            break;
                        case '6':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_6: 'true' },
                                { asiento_6 : 'false' }
                            );
                            break;
                        case '7':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_7: 'true' },
                                { asiento_7 : 'false' }
                            );
                            break;
                        case '8':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_8: 'true' },
                                { asiento_8 : 'false' }
                            );
                            break;
                        case '9':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_9: 'true' },
                                { asiento_9 : 'false' }
                            );
                            break;
                        case '10':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_10: 'true' },
                                { asiento_10 : 'false' }
                            );
                            break;
                        case '11':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_11: 'true' },
                                { asiento_11 : 'false' }
                            );
                            break;
                        case '12':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_12: 'true' },
                                { asiento_12 : 'false' }
                            );
                            break;
                        case '13':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_13: 'true' },
                                { asiento_13 : 'false' }
                            );
                            break;
                        case '14':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_14: 'true' },
                                { asiento_14 : 'false' }
                            );
                            break;
                        case '15':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_15: 'true' },
                                { asiento_15 : 'false' }
                            );
                            break;
                        case '16':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_16: 'true' },
                                { asiento_16 : 'false' }
                            );
                            break;
                        case '17':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_17: 'true' },
                                { asiento_17 : 'false' }
                            );
                            break;
                        case '18':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_18: 'true' },
                                { asiento_18 : 'false' }
                            );
                            break;
                        case '19':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_19: 'true' },
                                { asiento_19 : 'false' }
                            );
                            break;
                        case '20':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_20: 'true' },
                                { asiento_20 : 'false' }
                            );
                            break;
                        case '21':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_21: 'true' },
                                { asiento_21 : 'false' }
                            );
                            break;
                        case '22':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_22: 'true' },
                                { asiento_22 : 'false' }
                            );
                            break;
                        case '23':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_23: 'true' },
                                { asiento_23 : 'false' }
                            );
                            break;
                        case '24':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_24: 'true' },
                                { asiento_24 : 'false' }
                            );
                            break;
                        case '25':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_25: 'true' },
                                { asiento_25 : 'false' }
                            );
                            break;
                        case '26':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_26: 'true' },
                                { asiento_26 : 'false' }
                            );
                            break;
                        case '27':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_27: 'true' },
                                { asiento_27 : 'false' }
                            );
                            break;
                        case '28':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_28: 'true' },
                                { asiento_28 : 'false' }
                            );
                            break;
                        case '29':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_29: 'true' },
                                { asiento_29 : 'false' }
                            );
                            break;
                        case '30':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_30: 'true' },
                                { asiento_30 : 'false' }
                            );
                            break;
                        case '31':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_31: 'true' },
                                { asiento_31 : 'false' }
                            );
                            break;
                        case '33':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_33: 'true' },
                                { asiento_33 : 'false' }
                            );
                            break;
                        case '34':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_34: 'true' },
                                { asiento_34 : 'false' }
                            );
                            break;
                        case '35':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_35: 'true' },
                                { asiento_35 : 'false' }
                            );
                            break;
                        case '36':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_36: 'true' },
                                { asiento_36 : 'false' }
                            );
                            break;
                        case '37':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_37: 'true' },
                                { asiento_37 : 'false' }
                            );
                            break;
                        case '38':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_38: 'true' },
                                { asiento_38 : 'false' }
                            );
                            break;
                        case '39':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_39: 'true' },
                                { asiento_39 : 'false' }
                            );
                            break;
                        case '40':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_40: 'true' },
                                { asiento_40 : 'false' }
                            );
                            break;
                        case '41':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_41: 'true' },
                                { asiento_41 : 'false' }
                            );
                            break;
                        case '42':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_42: 'true' },
                                { asiento_42 : 'false' }
                            );
                            break;
                        default:
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
            case '33':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_33: 'false' },
                        { asiento_33 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '1':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_1: 'true' },
                                { asiento_1 : 'false' }
                            );
                            break;
                        case '2':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_2: 'true' },
                                { asiento_2 : 'false' }
                            );
                            break;
                        case '3':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_3: 'true' },
                                { asiento_3 : 'false' }
                            );
                            break;
                        case '4':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_4: 'true' },
                                { asiento_4 : 'false' }
                            );
                            break;
                        case '5':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_5: 'true' },
                                { asiento_5 : 'false' }
                            );
                            break;
                        case '6':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_6: 'true' },
                                { asiento_6 : 'false' }
                            );
                            break;
                        case '7':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_7: 'true' },
                                { asiento_7 : 'false' }
                            );
                            break;
                        case '8':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_8: 'true' },
                                { asiento_8 : 'false' }
                            );
                            break;
                        case '9':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_9: 'true' },
                                { asiento_9 : 'false' }
                            );
                            break;
                        case '10':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_10: 'true' },
                                { asiento_10 : 'false' }
                            );
                            break;
                        case '11':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_11: 'true' },
                                { asiento_11 : 'false' }
                            );
                            break;
                        case '12':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_12: 'true' },
                                { asiento_12 : 'false' }
                            );
                            break;
                        case '13':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_13: 'true' },
                                { asiento_13 : 'false' }
                            );
                            break;
                        case '14':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_14: 'true' },
                                { asiento_14 : 'false' }
                            );
                            break;
                        case '15':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_15: 'true' },
                                { asiento_15 : 'false' }
                            );
                            break;
                        case '16':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_16: 'true' },
                                { asiento_16 : 'false' }
                            );
                            break;
                        case '17':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_17: 'true' },
                                { asiento_17 : 'false' }
                            );
                            break;
                        case '18':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_18: 'true' },
                                { asiento_18 : 'false' }
                            );
                            break;
                        case '19':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_19: 'true' },
                                { asiento_19 : 'false' }
                            );
                            break;
                        case '20':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_20: 'true' },
                                { asiento_20 : 'false' }
                            );
                            break;
                        case '21':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_21: 'true' },
                                { asiento_21 : 'false' }
                            );
                            break;
                        case '22':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_22: 'true' },
                                { asiento_22 : 'false' }
                            );
                            break;
                        case '23':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_23: 'true' },
                                { asiento_23 : 'false' }
                            );
                            break;
                        case '24':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_24: 'true' },
                                { asiento_24 : 'false' }
                            );
                            break;
                        case '25':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_25: 'true' },
                                { asiento_25 : 'false' }
                            );
                            break;
                        case '26':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_26: 'true' },
                                { asiento_26 : 'false' }
                            );
                            break;
                        case '27':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_27: 'true' },
                                { asiento_27 : 'false' }
                            );
                            break;
                        case '28':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_28: 'true' },
                                { asiento_28 : 'false' }
                            );
                            break;
                        case '29':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_29: 'true' },
                                { asiento_29 : 'false' }
                            );
                            break;
                        case '30':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_30: 'true' },
                                { asiento_30 : 'false' }
                            );
                            break;
                        case '31':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_31: 'true' },
                                { asiento_31 : 'false' }
                            );
                            break;
                        case '32':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_32: 'true' },
                                { asiento_32 : 'false' }
                            );
                            break;
                        case '34':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_34: 'true' },
                                { asiento_34 : 'false' }
                            );
                            break;
                        case '35':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_35: 'true' },
                                { asiento_35 : 'false' }
                            );
                            break;
                        case '36':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_36: 'true' },
                                { asiento_36 : 'false' }
                            );
                            break;
                        case '37':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_37: 'true' },
                                { asiento_37 : 'false' }
                            );
                            break;
                        case '38':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_38: 'true' },
                                { asiento_38 : 'false' }
                            );
                            break;
                        case '39':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_39: 'true' },
                                { asiento_39 : 'false' }
                            );
                            break;
                        case '40':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_40: 'true' },
                                { asiento_40 : 'false' }
                            );
                            break;
                        case '41':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_41: 'true' },
                                { asiento_41 : 'false' }
                            );
                            break;
                        case '42':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_42: 'true' },
                                { asiento_42 : 'false' }
                            );
                            break;
                        default:
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
            case '34':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_34: 'false' },
                        { asiento_34 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '1':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_1: 'true' },
                                { asiento_1 : 'false' }
                            );
                            break;
                        case '2':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_2: 'true' },
                                { asiento_2 : 'false' }
                            );
                            break;
                        case '3':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_3: 'true' },
                                { asiento_3 : 'false' }
                            );
                            break;
                        case '4':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_4: 'true' },
                                { asiento_4 : 'false' }
                            );
                            break;
                        case '5':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_5: 'true' },
                                { asiento_5 : 'false' }
                            );
                            break;
                        case '6':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_6: 'true' },
                                { asiento_6 : 'false' }
                            );
                            break;
                        case '7':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_7: 'true' },
                                { asiento_7 : 'false' }
                            );
                            break;
                        case '8':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_8: 'true' },
                                { asiento_8 : 'false' }
                            );
                            break;
                        case '9':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_9: 'true' },
                                { asiento_9 : 'false' }
                            );
                            break;
                        case '10':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_10: 'true' },
                                { asiento_10 : 'false' }
                            );
                            break;
                        case '11':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_11: 'true' },
                                { asiento_11 : 'false' }
                            );
                            break;
                        case '12':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_12: 'true' },
                                { asiento_12 : 'false' }
                            );
                            break;
                        case '13':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_13: 'true' },
                                { asiento_13 : 'false' }
                            );
                            break;
                        case '14':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_14: 'true' },
                                { asiento_14 : 'false' }
                            );
                            break;
                        case '15':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_15: 'true' },
                                { asiento_15 : 'false' }
                            );
                            break;
                        case '16':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_16: 'true' },
                                { asiento_16 : 'false' }
                            );
                            break;
                        case '17':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_17: 'true' },
                                { asiento_17 : 'false' }
                            );
                            break;
                        case '18':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_18: 'true' },
                                { asiento_18 : 'false' }
                            );
                            break;
                        case '19':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_19: 'true' },
                                { asiento_19 : 'false' }
                            );
                            break;
                        case '20':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_20: 'true' },
                                { asiento_20 : 'false' }
                            );
                            break;
                        case '21':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_21: 'true' },
                                { asiento_21 : 'false' }
                            );
                            break;
                        case '22':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_22: 'true' },
                                { asiento_22 : 'false' }
                            );
                            break;
                        case '23':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_23: 'true' },
                                { asiento_23 : 'false' }
                            );
                            break;
                        case '24':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_24: 'true' },
                                { asiento_24 : 'false' }
                            );
                            break;
                        case '25':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_25: 'true' },
                                { asiento_25 : 'false' }
                            );
                            break;
                        case '26':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_26: 'true' },
                                { asiento_26 : 'false' }
                            );
                            break;
                        case '27':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_27: 'true' },
                                { asiento_27 : 'false' }
                            );
                            break;
                        case '28':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_28: 'true' },
                                { asiento_28 : 'false' }
                            );
                            break;
                        case '29':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_29: 'true' },
                                { asiento_29 : 'false' }
                            );
                            break;
                        case '30':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_30: 'true' },
                                { asiento_30 : 'false' }
                            );
                            break;
                        case '31':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_31: 'true' },
                                { asiento_31 : 'false' }
                            );
                            break;
                        case '32':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_32: 'true' },
                                { asiento_32 : 'false' }
                            );
                            break;
                        case '33':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_33: 'true' },
                                { asiento_33 : 'false' }
                            );
                            break;
                        case '35':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_35: 'true' },
                                { asiento_35 : 'false' }
                            );
                            break;
                        case '36':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_36: 'true' },
                                { asiento_36 : 'false' }
                            );
                            break;
                        case '37':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_37: 'true' },
                                { asiento_37 : 'false' }
                            );
                            break;
                        case '38':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_38: 'true' },
                                { asiento_38 : 'false' }
                            );
                            break;
                        case '39':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_39: 'true' },
                                { asiento_39 : 'false' }
                            );
                            break;
                        case '40':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_40: 'true' },
                                { asiento_40 : 'false' }
                            );
                            break;
                        case '41':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_41: 'true' },
                                { asiento_41 : 'false' }
                            );
                            break;
                        case '42':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_42: 'true' },
                                { asiento_42 : 'false' }
                            );
                            break;
                        default:
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
            case '35':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_35: 'false' },
                        { asiento_35 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '1':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_1: 'true' },
                                { asiento_1 : 'false' }
                            );
                            break;
                        case '2':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_2: 'true' },
                                { asiento_2 : 'false' }
                            );
                            break;
                        case '3':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_3: 'true' },
                                { asiento_3 : 'false' }
                            );
                            break;
                        case '4':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_4: 'true' },
                                { asiento_4 : 'false' }
                            );
                            break;
                        case '5':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_5: 'true' },
                                { asiento_5 : 'false' }
                            );
                            break;
                        case '6':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_6: 'true' },
                                { asiento_6 : 'false' }
                            );
                            break;
                        case '7':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_7: 'true' },
                                { asiento_7 : 'false' }
                            );
                            break;
                        case '8':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_8: 'true' },
                                { asiento_8 : 'false' }
                            );
                            break;
                        case '9':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_9: 'true' },
                                { asiento_9 : 'false' }
                            );
                            break;
                        case '10':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_10: 'true' },
                                { asiento_10 : 'false' }
                            );
                            break;
                        case '11':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_11: 'true' },
                                { asiento_11 : 'false' }
                            );
                            break;
                        case '12':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_12: 'true' },
                                { asiento_12 : 'false' }
                            );
                            break;
                        case '13':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_13: 'true' },
                                { asiento_13 : 'false' }
                            );
                            break;
                        case '14':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_14: 'true' },
                                { asiento_14 : 'false' }
                            );
                            break;
                        case '15':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_15: 'true' },
                                { asiento_15 : 'false' }
                            );
                            break;
                        case '16':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_16: 'true' },
                                { asiento_16 : 'false' }
                            );
                            break;
                        case '17':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_17: 'true' },
                                { asiento_17 : 'false' }
                            );
                            break;
                        case '18':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_18: 'true' },
                                { asiento_18 : 'false' }
                            );
                            break;
                        case '19':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_19: 'true' },
                                { asiento_19 : 'false' }
                            );
                            break;
                        case '20':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_20: 'true' },
                                { asiento_20 : 'false' }
                            );
                            break;
                        case '21':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_21: 'true' },
                                { asiento_21 : 'false' }
                            );
                            break;
                        case '22':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_22: 'true' },
                                { asiento_22 : 'false' }
                            );
                            break;
                        case '23':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_23: 'true' },
                                { asiento_23 : 'false' }
                            );
                            break;
                        case '24':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_24: 'true' },
                                { asiento_24 : 'false' }
                            );
                            break;
                        case '25':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_25: 'true' },
                                { asiento_25 : 'false' }
                            );
                            break;
                        case '26':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_26: 'true' },
                                { asiento_26 : 'false' }
                            );
                            break;
                        case '27':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_27: 'true' },
                                { asiento_27 : 'false' }
                            );
                            break;
                        case '28':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_28: 'true' },
                                { asiento_28 : 'false' }
                            );
                            break;
                        case '29':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_29: 'true' },
                                { asiento_29 : 'false' }
                            );
                            break;
                        case '30':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_30: 'true' },
                                { asiento_30 : 'false' }
                            );
                            break;
                        case '31':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_31: 'true' },
                                { asiento_31 : 'false' }
                            );
                            break;
                        case '32':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_32: 'true' },
                                { asiento_32 : 'false' }
                            );
                            break;
                        case '33':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_33: 'true' },
                                { asiento_33 : 'false' }
                            );
                            break;
                        case '34':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_34: 'true' },
                                { asiento_34 : 'false' }
                            );
                            break;
                        case '36':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_36: 'true' },
                                { asiento_36 : 'false' }
                            );
                            break;
                        case '37':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_37: 'true' },
                                { asiento_37 : 'false' }
                            );
                            break;
                        case '38':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_38: 'true' },
                                { asiento_38 : 'false' }
                            );
                            break;
                        case '39':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_39: 'true' },
                                { asiento_39 : 'false' }
                            );
                            break;
                        case '40':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_40: 'true' },
                                { asiento_40 : 'false' }
                            );
                            break;
                        case '41':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_41: 'true' },
                                { asiento_41 : 'false' }
                            );
                            break;
                        case '42':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_42: 'true' },
                                { asiento_42 : 'false' }
                            );
                            break;
                        default:
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
            case '36':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_36: 'false' },
                        { asiento_36 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '1':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_1: 'true' },
                                { asiento_1 : 'false' }
                            );
                            break;
                        case '2':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_2: 'true' },
                                { asiento_2 : 'false' }
                            );
                            break;
                        case '3':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_3: 'true' },
                                { asiento_3 : 'false' }
                            );
                            break;
                        case '4':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_4: 'true' },
                                { asiento_4 : 'false' }
                            );
                            break;
                        case '5':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_5: 'true' },
                                { asiento_5 : 'false' }
                            );
                            break;
                        case '6':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_6: 'true' },
                                { asiento_6 : 'false' }
                            );
                            break;
                        case '7':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_7: 'true' },
                                { asiento_7 : 'false' }
                            );
                            break;
                        case '8':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_8: 'true' },
                                { asiento_8 : 'false' }
                            );
                            break;
                        case '9':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_9: 'true' },
                                { asiento_9 : 'false' }
                            );
                            break;
                        case '10':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_10: 'true' },
                                { asiento_10 : 'false' }
                            );
                            break;
                        case '11':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_11: 'true' },
                                { asiento_11 : 'false' }
                            );
                            break;
                        case '12':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_12: 'true' },
                                { asiento_12 : 'false' }
                            );
                            break;
                        case '13':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_13: 'true' },
                                { asiento_13 : 'false' }
                            );
                            break;
                        case '14':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_14: 'true' },
                                { asiento_14 : 'false' }
                            );
                            break;
                        case '15':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_15: 'true' },
                                { asiento_15 : 'false' }
                            );
                            break;
                        case '16':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_16: 'true' },
                                { asiento_16 : 'false' }
                            );
                            break;
                        case '17':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_17: 'true' },
                                { asiento_17 : 'false' }
                            );
                            break;
                        case '18':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_18: 'true' },
                                { asiento_18 : 'false' }
                            );
                            break;
                        case '19':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_19: 'true' },
                                { asiento_19 : 'false' }
                            );
                            break;
                        case '20':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_20: 'true' },
                                { asiento_20 : 'false' }
                            );
                            break;
                        case '21':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_21: 'true' },
                                { asiento_21 : 'false' }
                            );
                            break;
                        case '22':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_22: 'true' },
                                { asiento_22 : 'false' }
                            );
                            break;
                        case '23':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_23: 'true' },
                                { asiento_23 : 'false' }
                            );
                            break;
                        case '24':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_24: 'true' },
                                { asiento_24 : 'false' }
                            );
                            break;
                        case '25':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_25: 'true' },
                                { asiento_25 : 'false' }
                            );
                            break;
                        case '26':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_26: 'true' },
                                { asiento_26 : 'false' }
                            );
                            break;
                        case '27':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_27: 'true' },
                                { asiento_27 : 'false' }
                            );
                            break;
                        case '28':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_28: 'true' },
                                { asiento_28 : 'false' }
                            );
                            break;
                        case '29':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_29: 'true' },
                                { asiento_29 : 'false' }
                            );
                            break;
                        case '30':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_30: 'true' },
                                { asiento_30 : 'false' }
                            );
                            break;
                        case '31':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_31: 'true' },
                                { asiento_31 : 'false' }
                            );
                            break;
                        case '32':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_32: 'true' },
                                { asiento_32 : 'false' }
                            );
                            break;
                        case '33':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_33: 'true' },
                                { asiento_33 : 'false' }
                            );
                            break;
                        case '34':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_34: 'true' },
                                { asiento_34 : 'false' }
                            );
                            break;
                        case '35':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_35: 'true' },
                                { asiento_35 : 'false' }
                            );
                            break;
                        case '37':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_37: 'true' },
                                { asiento_37 : 'false' }
                            );
                            break;
                        case '38':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_38: 'true' },
                                { asiento_38 : 'false' }
                            );
                            break;
                        case '39':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_39: 'true' },
                                { asiento_39 : 'false' }
                            );
                            break;
                        case '40':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_40: 'true' },
                                { asiento_40 : 'false' }
                            );
                            break;
                        case '41':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_41: 'true' },
                                { asiento_41 : 'false' }
                            );
                            break;
                        case '42':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_42: 'true' },
                                { asiento_42 : 'false' }
                            );
                            break;
                        default:
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
            case '37':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_37: 'false' },
                        { asiento_37 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '1':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_1: 'true' },
                                { asiento_1 : 'false' }
                            );
                            break;
                        case '2':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_2: 'true' },
                                { asiento_2 : 'false' }
                            );
                            break;
                        case '3':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_3: 'true' },
                                { asiento_3 : 'false' }
                            );
                            break;
                        case '4':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_4: 'true' },
                                { asiento_4 : 'false' }
                            );
                            break;
                        case '5':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_5: 'true' },
                                { asiento_5 : 'false' }
                            );
                            break;
                        case '6':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_6: 'true' },
                                { asiento_6 : 'false' }
                            );
                            break;
                        case '7':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_7: 'true' },
                                { asiento_7 : 'false' }
                            );
                            break;
                        case '8':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_8: 'true' },
                                { asiento_8 : 'false' }
                            );
                            break;
                        case '9':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_9: 'true' },
                                { asiento_9 : 'false' }
                            );
                            break;
                        case '10':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_10: 'true' },
                                { asiento_10 : 'false' }
                            );
                            break;
                        case '11':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_11: 'true' },
                                { asiento_11 : 'false' }
                            );
                            break;
                        case '12':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_12: 'true' },
                                { asiento_12 : 'false' }
                            );
                            break;
                        case '13':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_13: 'true' },
                                { asiento_13 : 'false' }
                            );
                            break;
                        case '14':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_14: 'true' },
                                { asiento_14 : 'false' }
                            );
                            break;
                        case '15':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_15: 'true' },
                                { asiento_15 : 'false' }
                            );
                            break;
                        case '16':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_16: 'true' },
                                { asiento_16 : 'false' }
                            );
                            break;
                        case '17':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_17: 'true' },
                                { asiento_17 : 'false' }
                            );
                            break;
                        case '18':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_18: 'true' },
                                { asiento_18 : 'false' }
                            );
                            break;
                        case '19':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_19: 'true' },
                                { asiento_19 : 'false' }
                            );
                            break;
                        case '20':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_20: 'true' },
                                { asiento_20 : 'false' }
                            );
                            break;
                        case '21':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_21: 'true' },
                                { asiento_21 : 'false' }
                            );
                            break;
                        case '22':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_22: 'true' },
                                { asiento_22 : 'false' }
                            );
                            break;
                        case '23':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_23: 'true' },
                                { asiento_23 : 'false' }
                            );
                            break;
                        case '24':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_24: 'true' },
                                { asiento_24 : 'false' }
                            );
                            break;
                        case '25':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_25: 'true' },
                                { asiento_25 : 'false' }
                            );
                            break;
                        case '26':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_26: 'true' },
                                { asiento_26 : 'false' }
                            );
                            break;
                        case '27':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_27: 'true' },
                                { asiento_27 : 'false' }
                            );
                            break;
                        case '28':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_28: 'true' },
                                { asiento_28 : 'false' }
                            );
                            break;
                        case '29':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_29: 'true' },
                                { asiento_29 : 'false' }
                            );
                            break;
                        case '30':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_30: 'true' },
                                { asiento_30 : 'false' }
                            );
                            break;
                        case '31':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_31: 'true' },
                                { asiento_31 : 'false' }
                            );
                            break;
                        case '32':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_32: 'true' },
                                { asiento_32 : 'false' }
                            );
                            break;
                        case '33':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_33: 'true' },
                                { asiento_33 : 'false' }
                            );
                            break;
                        case '34':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_34: 'true' },
                                { asiento_34 : 'false' }
                            );
                            break;
                        case '35':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_35: 'true' },
                                { asiento_35 : 'false' }
                            );
                            break;
                        case '36':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_36: 'true' },
                                { asiento_36 : 'false' }
                            );
                            break;
                        case '38':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_38: 'true' },
                                { asiento_38 : 'false' }
                            );
                            break;
                        case '39':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_39: 'true' },
                                { asiento_39 : 'false' }
                            );
                            break;
                        case '40':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_40: 'true' },
                                { asiento_40 : 'false' }
                            );
                            break;
                        case '41':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_41: 'true' },
                                { asiento_41 : 'false' }
                            );
                            break;
                        case '42':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_42: 'true' },
                                { asiento_42 : 'false' }
                            );
                            break;
                        default:
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
            case '38':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_38: 'false' },
                        { asiento_38 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '1':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_1: 'true' },
                                { asiento_1 : 'false' }
                            );
                            break;
                        case '2':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_2: 'true' },
                                { asiento_2 : 'false' }
                            );
                            break;
                        case '3':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_3: 'true' },
                                { asiento_3 : 'false' }
                            );
                            break;
                        case '4':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_4: 'true' },
                                { asiento_4 : 'false' }
                            );
                            break;
                        case '5':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_5: 'true' },
                                { asiento_5 : 'false' }
                            );
                            break;
                        case '6':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_6: 'true' },
                                { asiento_6 : 'false' }
                            );
                            break;
                        case '7':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_7: 'true' },
                                { asiento_7 : 'false' }
                            );
                            break;
                        case '8':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_8: 'true' },
                                { asiento_8 : 'false' }
                            );
                            break;
                        case '9':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_9: 'true' },
                                { asiento_9 : 'false' }
                            );
                            break;
                        case '10':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_10: 'true' },
                                { asiento_10 : 'false' }
                            );
                            break;
                        case '11':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_11: 'true' },
                                { asiento_11 : 'false' }
                            );
                            break;
                        case '12':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_12: 'true' },
                                { asiento_12 : 'false' }
                            );
                            break;
                        case '13':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_13: 'true' },
                                { asiento_13 : 'false' }
                            );
                            break;
                        case '14':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_14: 'true' },
                                { asiento_14 : 'false' }
                            );
                            break;
                        case '15':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_15: 'true' },
                                { asiento_15 : 'false' }
                            );
                            break;
                        case '16':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_16: 'true' },
                                { asiento_16 : 'false' }
                            );
                            break;
                        case '17':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_17: 'true' },
                                { asiento_17 : 'false' }
                            );
                            break;
                        case '18':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_18: 'true' },
                                { asiento_18 : 'false' }
                            );
                            break;
                        case '19':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_19: 'true' },
                                { asiento_19 : 'false' }
                            );
                            break;
                        case '20':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_20: 'true' },
                                { asiento_20 : 'false' }
                            );
                            break;
                        case '21':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_21: 'true' },
                                { asiento_21 : 'false' }
                            );
                            break;
                        case '22':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_22: 'true' },
                                { asiento_22 : 'false' }
                            );
                            break;
                        case '23':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_23: 'true' },
                                { asiento_23 : 'false' }
                            );
                            break;
                        case '24':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_24: 'true' },
                                { asiento_24 : 'false' }
                            );
                            break;
                        case '25':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_25: 'true' },
                                { asiento_25 : 'false' }
                            );
                            break;
                        case '26':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_26: 'true' },
                                { asiento_26 : 'false' }
                            );
                            break;
                        case '27':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_27: 'true' },
                                { asiento_27 : 'false' }
                            );
                            break;
                        case '28':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_28: 'true' },
                                { asiento_28 : 'false' }
                            );
                            break;
                        case '29':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_29: 'true' },
                                { asiento_29 : 'false' }
                            );
                            break;
                        case '30':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_30: 'true' },
                                { asiento_30 : 'false' }
                            );
                            break;
                        case '31':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_31: 'true' },
                                { asiento_31 : 'false' }
                            );
                            break;
                        case '32':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_32: 'true' },
                                { asiento_32 : 'false' }
                            );
                            break;
                        case '33':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_33: 'true' },
                                { asiento_33 : 'false' }
                            );
                            break;
                        case '34':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_34: 'true' },
                                { asiento_34 : 'false' }
                            );
                            break;
                        case '35':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_35: 'true' },
                                { asiento_35 : 'false' }
                            );
                            break;
                        case '36':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_36: 'true' },
                                { asiento_36 : 'false' }
                            );
                            break;
                        case '37':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_37: 'true' },
                                { asiento_37 : 'false' }
                            );
                            break;
                        case '39':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_39: 'true' },
                                { asiento_39 : 'false' }
                            );
                            break;
                        case '40':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_40: 'true' },
                                { asiento_40 : 'false' }
                            );
                            break;
                        case '41':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_41: 'true' },
                                { asiento_41 : 'false' }
                            );
                            break;
                        case '42':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_42: 'true' },
                                { asiento_42 : 'false' }
                            );
                            break;
                        default:
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
            case '39':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_39: 'false' },
                        { asiento_39 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '1':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_1: 'true' },
                                { asiento_1 : 'false' }
                            );
                            break;
                        case '2':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_2: 'true' },
                                { asiento_2 : 'false' }
                            );
                            break;
                        case '3':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_3: 'true' },
                                { asiento_3 : 'false' }
                            );
                            break;
                        case '4':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_4: 'true' },
                                { asiento_4 : 'false' }
                            );
                            break;
                        case '5':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_5: 'true' },
                                { asiento_5 : 'false' }
                            );
                            break;
                        case '6':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_6: 'true' },
                                { asiento_6 : 'false' }
                            );
                            break;
                        case '7':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_7: 'true' },
                                { asiento_7 : 'false' }
                            );
                            break;
                        case '8':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_8: 'true' },
                                { asiento_8 : 'false' }
                            );
                            break;
                        case '9':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_9: 'true' },
                                { asiento_9 : 'false' }
                            );
                            break;
                        case '10':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_10: 'true' },
                                { asiento_10 : 'false' }
                            );
                            break;
                        case '11':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_11: 'true' },
                                { asiento_11 : 'false' }
                            );
                            break;
                        case '12':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_12: 'true' },
                                { asiento_12 : 'false' }
                            );
                            break;
                        case '13':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_13: 'true' },
                                { asiento_13 : 'false' }
                            );
                            break;
                        case '14':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_14: 'true' },
                                { asiento_14 : 'false' }
                            );
                            break;
                        case '15':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_15: 'true' },
                                { asiento_15 : 'false' }
                            );
                            break;
                        case '16':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_16: 'true' },
                                { asiento_16 : 'false' }
                            );
                            break;
                        case '17':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_17: 'true' },
                                { asiento_17 : 'false' }
                            );
                            break;
                        case '18':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_18: 'true' },
                                { asiento_18 : 'false' }
                            );
                            break;
                        case '19':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_19: 'true' },
                                { asiento_19 : 'false' }
                            );
                            break;
                        case '20':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_20: 'true' },
                                { asiento_20 : 'false' }
                            );
                            break;
                        case '21':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_21: 'true' },
                                { asiento_21 : 'false' }
                            );
                            break;
                        case '22':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_22: 'true' },
                                { asiento_22 : 'false' }
                            );
                            break;
                        case '23':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_23: 'true' },
                                { asiento_23 : 'false' }
                            );
                            break;
                        case '24':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_24: 'true' },
                                { asiento_24 : 'false' }
                            );
                            break;
                        case '25':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_25: 'true' },
                                { asiento_25 : 'false' }
                            );
                            break;
                        case '26':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_26: 'true' },
                                { asiento_26 : 'false' }
                            );
                            break;
                        case '27':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_27: 'true' },
                                { asiento_27 : 'false' }
                            );
                            break;
                        case '28':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_28: 'true' },
                                { asiento_28 : 'false' }
                            );
                            break;
                        case '29':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_29: 'true' },
                                { asiento_29 : 'false' }
                            );
                            break;
                        case '30':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_30: 'true' },
                                { asiento_30 : 'false' }
                            );
                            break;
                        case '31':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_31: 'true' },
                                { asiento_31 : 'false' }
                            );
                            break;
                        case '32':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_32: 'true' },
                                { asiento_32 : 'false' }
                            );
                            break;
                        case '33':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_33: 'true' },
                                { asiento_33 : 'false' }
                            );
                            break;
                        case '34':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_34: 'true' },
                                { asiento_34 : 'false' }
                            );
                            break;
                        case '35':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_35: 'true' },
                                { asiento_35 : 'false' }
                            );
                            break;
                        case '36':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_36: 'true' },
                                { asiento_36 : 'false' }
                            );
                            break;
                        case '37':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_37: 'true' },
                                { asiento_37 : 'false' }
                            );
                            break;
                        case '38':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_38: 'true' },
                                { asiento_38 : 'false' }
                            );
                            break;
                        case '40':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_40: 'true' },
                                { asiento_40 : 'false' }
                            );
                            break;
                        case '41':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_41: 'true' },
                                { asiento_41 : 'false' }
                            );
                            break;
                        case '42':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_42: 'true' },
                                { asiento_42 : 'false' }
                            );
                            break;
                        default:
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
            case '40':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_40: 'false' },
                        { asiento_40 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '1':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_1: 'true' },
                                { asiento_1 : 'false' }
                            );
                            break;
                        case '2':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_2: 'true' },
                                { asiento_2 : 'false' }
                            );
                            break;
                        case '3':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_3: 'true' },
                                { asiento_3 : 'false' }
                            );
                            break;
                        case '4':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_4: 'true' },
                                { asiento_4 : 'false' }
                            );
                            break;
                        case '5':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_5: 'true' },
                                { asiento_5 : 'false' }
                            );
                            break;
                        case '6':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_6: 'true' },
                                { asiento_6 : 'false' }
                            );
                            break;
                        case '7':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_7: 'true' },
                                { asiento_7 : 'false' }
                            );
                            break;
                        case '8':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_8: 'true' },
                                { asiento_8 : 'false' }
                            );
                            break;
                        case '9':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_9: 'true' },
                                { asiento_9 : 'false' }
                            );
                            break;
                        case '10':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_10: 'true' },
                                { asiento_10 : 'false' }
                            );
                            break;
                        case '11':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_11: 'true' },
                                { asiento_11 : 'false' }
                            );
                            break;
                        case '12':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_12: 'true' },
                                { asiento_12 : 'false' }
                            );
                            break;
                        case '13':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_13: 'true' },
                                { asiento_13 : 'false' }
                            );
                            break;
                        case '14':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_14: 'true' },
                                { asiento_14 : 'false' }
                            );
                            break;
                        case '15':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_15: 'true' },
                                { asiento_15 : 'false' }
                            );
                            break;
                        case '16':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_16: 'true' },
                                { asiento_16 : 'false' }
                            );
                            break;
                        case '17':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_17: 'true' },
                                { asiento_17 : 'false' }
                            );
                            break;
                        case '18':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_18: 'true' },
                                { asiento_18 : 'false' }
                            );
                            break;
                        case '19':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_19: 'true' },
                                { asiento_19 : 'false' }
                            );
                            break;
                        case '20':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_20: 'true' },
                                { asiento_20 : 'false' }
                            );
                            break;
                        case '21':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_21: 'true' },
                                { asiento_21 : 'false' }
                            );
                            break;
                        case '22':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_22: 'true' },
                                { asiento_22 : 'false' }
                            );
                            break;
                        case '23':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_23: 'true' },
                                { asiento_23 : 'false' }
                            );
                            break;
                        case '24':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_24: 'true' },
                                { asiento_24 : 'false' }
                            );
                            break;
                        case '25':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_25: 'true' },
                                { asiento_25 : 'false' }
                            );
                            break;
                        case '26':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_26: 'true' },
                                { asiento_26 : 'false' }
                            );
                            break;
                        case '27':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_27: 'true' },
                                { asiento_27 : 'false' }
                            );
                            break;
                        case '28':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_28: 'true' },
                                { asiento_28 : 'false' }
                            );
                            break;
                        case '29':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_29: 'true' },
                                { asiento_29 : 'false' }
                            );
                            break;
                        case '30':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_30: 'true' },
                                { asiento_30 : 'false' }
                            );
                            break;
                        case '31':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_31: 'true' },
                                { asiento_31 : 'false' }
                            );
                            break;
                        case '32':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_32: 'true' },
                                { asiento_32 : 'false' }
                            );
                            break;
                        case '33':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_33: 'true' },
                                { asiento_33 : 'false' }
                            );
                            break;
                        case '34':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_34: 'true' },
                                { asiento_34 : 'false' }
                            );
                            break;
                        case '35':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_35: 'true' },
                                { asiento_35 : 'false' }
                            );
                            break;
                        case '36':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_36: 'true' },
                                { asiento_36 : 'false' }
                            );
                            break;
                        case '37':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_37: 'true' },
                                { asiento_37 : 'false' }
                            );
                            break;
                        case '38':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_38: 'true' },
                                { asiento_38 : 'false' }
                            );
                            break;
                        case '39':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_39: 'true' },
                                { asiento_39 : 'false' }
                            );
                            break;
                        case '41':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_41: 'true' },
                                { asiento_41 : 'false' }
                            );
                            break;
                        case '42':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_42: 'true' },
                                { asiento_42 : 'false' }
                            );
                            break;
                        default:
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
            case '41':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_41: 'false' },
                        { asiento_41 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '1':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_1: 'true' },
                                { asiento_1 : 'false' }
                            );
                            break;
                        case '2':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_2: 'true' },
                                { asiento_2 : 'false' }
                            );
                            break;
                        case '3':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_3: 'true' },
                                { asiento_3 : 'false' }
                            );
                            break;
                        case '4':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_4: 'true' },
                                { asiento_4 : 'false' }
                            );
                            break;
                        case '5':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_5: 'true' },
                                { asiento_5 : 'false' }
                            );
                            break;
                        case '6':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_6: 'true' },
                                { asiento_6 : 'false' }
                            );
                            break;
                        case '7':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_7: 'true' },
                                { asiento_7 : 'false' }
                            );
                            break;
                        case '8':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_8: 'true' },
                                { asiento_8 : 'false' }
                            );
                            break;
                        case '9':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_9: 'true' },
                                { asiento_9 : 'false' }
                            );
                            break;
                        case '10':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_10: 'true' },
                                { asiento_10 : 'false' }
                            );
                            break;
                        case '11':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_11: 'true' },
                                { asiento_11 : 'false' }
                            );
                            break;
                        case '12':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_12: 'true' },
                                { asiento_12 : 'false' }
                            );
                            break;
                        case '13':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_13: 'true' },
                                { asiento_13 : 'false' }
                            );
                            break;
                        case '14':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_14: 'true' },
                                { asiento_14 : 'false' }
                            );
                            break;
                        case '15':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_15: 'true' },
                                { asiento_15 : 'false' }
                            );
                            break;
                        case '16':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_16: 'true' },
                                { asiento_16 : 'false' }
                            );
                            break;
                        case '17':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_17: 'true' },
                                { asiento_17 : 'false' }
                            );
                            break;
                        case '18':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_18: 'true' },
                                { asiento_18 : 'false' }
                            );
                            break;
                        case '19':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_19: 'true' },
                                { asiento_19 : 'false' }
                            );
                            break;
                        case '20':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_20: 'true' },
                                { asiento_20 : 'false' }
                            );
                            break;
                        case '21':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_21: 'true' },
                                { asiento_21 : 'false' }
                            );
                            break;
                        case '22':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_22: 'true' },
                                { asiento_22 : 'false' }
                            );
                            break;
                        case '23':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_23: 'true' },
                                { asiento_23 : 'false' }
                            );
                            break;
                        case '24':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_24: 'true' },
                                { asiento_24 : 'false' }
                            );
                            break;
                        case '25':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_25: 'true' },
                                { asiento_25 : 'false' }
                            );
                            break;
                        case '26':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_26: 'true' },
                                { asiento_26 : 'false' }
                            );
                            break;
                        case '27':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_27: 'true' },
                                { asiento_27 : 'false' }
                            );
                            break;
                        case '28':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_28: 'true' },
                                { asiento_28 : 'false' }
                            );
                            break;
                        case '29':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_29: 'true' },
                                { asiento_29 : 'false' }
                            );
                            break;
                        case '30':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_30: 'true' },
                                { asiento_30 : 'false' }
                            );
                            break;
                        case '31':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_31: 'true' },
                                { asiento_31 : 'false' }
                            );
                            break;
                        case '32':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_32: 'true' },
                                { asiento_32 : 'false' }
                            );
                            break;
                        case '33':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_33: 'true' },
                                { asiento_33 : 'false' }
                            );
                            break;
                        case '34':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_34: 'true' },
                                { asiento_34 : 'false' }
                            );
                            break;
                        case '35':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_35: 'true' },
                                { asiento_35 : 'false' }
                            );
                            break;
                        case '36':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_36: 'true' },
                                { asiento_36 : 'false' }
                            );
                            break;
                        case '37':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_37: 'true' },
                                { asiento_37 : 'false' }
                            );
                            break;
                        case '38':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_38: 'true' },
                                { asiento_38 : 'false' }
                            );
                            break;
                        case '39':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_39: 'true' },
                                { asiento_39 : 'false' }
                            );
                            break;
                        case '40':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_40: 'true' },
                                { asiento_40 : 'false' }
                            );
                            break;
                        case '42':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_42: 'true' },
                                { asiento_42 : 'false' }
                            );
                            break;
                        default:
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
            case '42':
                try {
                    let updateViaje = await Viaje.findOneAndUpdate(
                        { _id: req.params.idViaje, asiento_42: 'false' },
                        { asiento_42 : 'true' }
                    );
                    let updateReservacion = await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { numeroAsiento : req.params.noAsientoNew }
                    );
                    switch (updateReservacion.numeroAsiento) {
                        case '1':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_1: 'true' },
                                { asiento_1 : 'false' }
                            );
                            break;
                        case '2':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_2: 'true' },
                                { asiento_2 : 'false' }
                            );
                            break;
                        case '3':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_3: 'true' },
                                { asiento_3 : 'false' }
                            );
                            break;
                        case '4':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_4: 'true' },
                                { asiento_4 : 'false' }
                            );
                            break;
                        case '5':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_5: 'true' },
                                { asiento_5 : 'false' }
                            );
                            break;
                        case '6':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_6: 'true' },
                                { asiento_6 : 'false' }
                            );
                            break;
                        case '7':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_7: 'true' },
                                { asiento_7 : 'false' }
                            );
                            break;
                        case '8':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_8: 'true' },
                                { asiento_8 : 'false' }
                            );
                            break;
                        case '9':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_9: 'true' },
                                { asiento_9 : 'false' }
                            );
                            break;
                        case '10':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_10: 'true' },
                                { asiento_10 : 'false' }
                            );
                            break;
                        case '11':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_11: 'true' },
                                { asiento_11 : 'false' }
                            );
                            break;
                        case '12':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_12: 'true' },
                                { asiento_12 : 'false' }
                            );
                            break;
                        case '13':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_13: 'true' },
                                { asiento_13 : 'false' }
                            );
                            break;
                        case '14':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_14: 'true' },
                                { asiento_14 : 'false' }
                            );
                            break;
                        case '15':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_15: 'true' },
                                { asiento_15 : 'false' }
                            );
                            break;
                        case '16':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_16: 'true' },
                                { asiento_16 : 'false' }
                            );
                            break;
                        case '17':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_17: 'true' },
                                { asiento_17 : 'false' }
                            );
                            break;
                        case '18':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_18: 'true' },
                                { asiento_18 : 'false' }
                            );
                            break;
                        case '19':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_19: 'true' },
                                { asiento_19 : 'false' }
                            );
                            break;
                        case '20':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_20: 'true' },
                                { asiento_20 : 'false' }
                            );
                            break;
                        case '21':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_21: 'true' },
                                { asiento_21 : 'false' }
                            );
                            break;
                        case '22':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_22: 'true' },
                                { asiento_22 : 'false' }
                            );
                            break;
                        case '23':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_23: 'true' },
                                { asiento_23 : 'false' }
                            );
                            break;
                        case '24':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_24: 'true' },
                                { asiento_24 : 'false' }
                            );
                            break;
                        case '25':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_25: 'true' },
                                { asiento_25 : 'false' }
                            );
                            break;
                        case '26':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_26: 'true' },
                                { asiento_26 : 'false' }
                            );
                            break;
                        case '27':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_27: 'true' },
                                { asiento_27 : 'false' }
                            );
                            break;
                        case '28':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_28: 'true' },
                                { asiento_28 : 'false' }
                            );
                            break;
                        case '29':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_29: 'true' },
                                { asiento_29 : 'false' }
                            );
                            break;
                        case '30':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_30: 'true' },
                                { asiento_30 : 'false' }
                            );
                            break;
                        case '31':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_31: 'true' },
                                { asiento_31 : 'false' }
                            );
                            break;
                        case '32':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_32: 'true' },
                                { asiento_32 : 'false' }
                            );
                            break;
                        case '33':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_33: 'true' },
                                { asiento_33 : 'false' }
                            );
                            break;
                        case '34':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_34: 'true' },
                                { asiento_34 : 'false' }
                            );
                            break;
                        case '35':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_35: 'true' },
                                { asiento_35 : 'false' }
                            );
                            break;
                        case '36':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_36: 'true' },
                                { asiento_36 : 'false' }
                            );
                            break;
                        case '37':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_37: 'true' },
                                { asiento_37 : 'false' }
                            );
                            break;
                        case '38':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_38: 'true' },
                                { asiento_38 : 'false' }
                            );
                            break;
                        case '39':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_39: 'true' },
                                { asiento_39 : 'false' }
                            );
                            break;
                        case '40':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_40: 'true' },
                                { asiento_40 : 'false' }
                            );
                            break;
                        case '41':
                            resetAsiento = await Viaje.findOneAndUpdate(
                                { _id: req.params.idViaje, asiento_41: 'true' },
                                { asiento_41 : 'false' }
                            );
                            break;
                    }
                    res.json({'updateViaje': updateViaje, 'updateReservacion':updateReservacion, 'disponible': true});
                } catch (error) {
                    res.json(error);
                }
                break;
                
        
            default:
                break;
        }
    }
});

router.put('/:idReservacion/:idViaje/:noAsientoNew/:field/:a', async (req, res) => {
    switch (req.params.field) {
        case 'asiento':
            let viaje = await Viaje.findById(req.params.idViaje);
            let noAsientoNew = req.params.noAsientoNew;
            let disponible = viaje[`asiento_${noAsientoNew}`];
            res.json(viaje);
            //res.json({'viaje': viaje, 'noAsientoNew': noAsientoNew, 'disponible': disponible});
            break;
        case 'estado':
            //idReservacion = id, idViaje = value, noAsientoNew = idUsuario, field = field, a = pago
            //res.json({'idReservacion': req.params.idReservacion, 'idViaje': req.params.idViaje, 'noAsientoNew': req.params.noAsientoNew, 'field': req.params.field});
            try {
                if(req.params.a == 'anticipo'){
                    await Reservacion.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { statePagadoAnticipo : req.params.idViaje }
                    );
                    let modificacion = await ModificacionCorte.find({idVenta: req.params.idReservacion});
                    if(modificacion.length == 0){//Si no ha sido creada, procedemos a crearla
                        let idVenta = req.params.idReservacion;
                        let idUsuario = req.params.noAsientoNew;
                        const mcorte= new ModificacionCorte({idVenta,idUsuario});
                        await mcorte.save();
                    }else{//En caso contrario lo modificamos
                        await ModificacionCorte.findOneAndUpdate(
                            { idVenta: req.params.idReservacion },
                            { idUsuario : req.params.noAsientoNew }
                        );
                    }
                    res.json({status:'RESERVACION ACTUALIZADA!!!'});
                }else{
                    //api/Reservaciones/5fb70540987a1023b0435f59/true/5f8a4ffafb09011b407dcb76/estado/abono
                    await Pagos.findOneAndUpdate(
                        { _id: req.params.idReservacion },
                        { statePagado : req.params.idViaje }
                    );
                    let modificacion = await ModificacionCorte.find({idVenta: req.params.idReservacion});
                    if(modificacion.length == 0){//Si no ha sido creada, procedemos a crearla
                        let idVenta = req.params.idReservacion;
                        let idUsuario = req.params.noAsientoNew;
                        const mcorte= new ModificacionCorte({idVenta,idUsuario});
                        await mcorte.save();
                    }else{//En caso contrario lo modificamos
                        await ModificacionCorte.findOneAndUpdate(
                            { idVenta: req.params.idReservacion },
                            { idUsuario : req.params.noAsientoNew }
                        );
                    }
                    res.json({status:'RESERVACION ACTUALIZADA!!!'});
                }
                
                //res.json(modificacion);
               
            } catch (error) {
                res.json(error);
            }
            break;
    
        default:
            break;
    }
});

router.delete('/:id', async (req, res) => {
    await Reservacion.findByIdAndRemove(req.params.id);
    res.json({status:'RESERVACION ELIMINADO!!!'});
})
module.exports = router;