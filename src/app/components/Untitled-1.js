const express = require('express'); //requerimiento de express
const router = express.Router();   // invocacion de la funcion router del modulo express
const Venta = require('../models/Ventas');
const Viaje = require('../models/AsignarViajes');

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
        case 'idVenta':
            try {
                const venta = await Venta.find({idVenta: req.params.value, activo: 'true'});
                res.json(venta);
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
    
        default:
            break;
    }
    /*const venta = await Venta.findById(req.params.id);
    res.json(venta);*/
});
router.post('/', async (req, res)=>{
    const {cliente,tipo,razon,descuento,origen,destino,fecha,anio,diaDelAnio,horaSalida,numeroAsiento,statePagado,activo,idVenta,tipoCambio, total, vendedor, folio, viajado} = req.body;
    const venta= new Venta({cliente, tipo, razon,descuento,origen,destino,fecha,anio,diaDelAnio,horaSalida,numeroAsiento,statePagado,activo,idVenta,tipoCambio, total, vendedor, folio, viajado});
    await venta.save();
    res.json({status: 'VENTA GUARDADO!!!!!'});
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
        case 'asiento':
            
            break;
        default:
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

router.put('/:idVenta/:idViaje/:noAsiento/:field', async (req, res) => {
    switch (req.params.noAsiento) {
        case '1':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_1: 'false' },
                    { asiento_1 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;
        case '2':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_2: 'false' },
                    { asiento_2 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;
        case '3':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_3: 'false' },
                    { asiento_3 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;
        case '4':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_4: 'false' },
                    { asiento_4 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;
        case '5':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_5: 'false' },
                    { asiento_5 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;
        case '6':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_6: 'false' },
                    { asiento_6 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;
        case '7':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_7: 'false' },
                    { asiento_7 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;
        case '8':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_8: 'false' },
                    { asiento_8 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;
        case '9':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_9: 'false' },
                    { asiento_9 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;
        case '10':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_10: 'false' },
                    { asiento_10 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;
        case '11':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_11: 'false' },
                    { asiento_11 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;
        case '12':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_12: 'false' },
                    { asiento_12 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;
        case '13':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_13: 'false' },
                    { asiento_13 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;
        case '14':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_14: 'false' },
                    { asiento_14 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;
        case '15':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_15: 'false' },
                    { asiento_15 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;
        case '16':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_16: 'false' },
                    { asiento_16 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;
        case '17':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_17: 'false' },
                    { asiento_17 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;
        case '18':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_18: 'false' },
                    { asiento_18 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;
        case '19':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_19: 'false' },
                    { asiento_19 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;
        case '20':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_20: 'false' },
                    { asiento_20 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;
        case '21':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_21: 'false' },
                    { asiento_21 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;
        case '22':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_22: 'false' },
                    { asiento_22 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;
        case '23':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_23: 'false' },
                    { asiento_23 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;
        case '24':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_24: 'false' },
                    { asiento_24 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;
        case '25':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_25: 'false' },
                    { asiento_25 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;
        case '26':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_26: 'false' },
                    { asiento_26 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;
        case '27':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_27: 'false' },
                    { asiento_27 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;
        case '28':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_28: 'false' },
                    { asiento_28 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;
        case '29':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_29: 'false' },
                    { asiento_29 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;
        case '30':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_30: 'false' },
                    { asiento_30 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;
        case '31':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_31: 'false' },
                    { asiento_31 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;
        case '32':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_32: 'false' },
                    { asiento_32 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;
        case '33':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_33: 'false' },
                    { asiento_33 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;
        case '34':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_34: 'false' },
                    { asiento_34 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;
        case '35':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_35: 'false' },
                    { asiento_35 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;
        case '36':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_36: 'false' },
                    { asiento_36 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;
        case '37':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_37: 'false' },
                    { asiento_37 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;
        case '38':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_38: 'false' },
                    { asiento_38 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;
        case '39':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_39: 'false' },
                    { asiento_39 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;
        case '40':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_40: 'false' },
                    { asiento_40 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;
        case '41':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_41: 'false' },
                    { asiento_41 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;
        case '42':
            try {
                await Viaje.findOneAndUpdate(
                    { _id: req.params.idViaje, asiento_42: 'false' },
                    { asiento_42 : 'true' }
                );
                await Venta.findOneAndUpdate(
                    { _id: req.params.idVenta },
                    { idVenta: req.params.idViaje, numeroAsiento: req.params.noAsiento}
                );
                res.json({status:'VENTA ACTUALIZADO!!!', error: false});
            } catch (error) {
                res.json({err: error, error: true});
                console.log(error);
            }
            break;

        default:
            break;
    }
    
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