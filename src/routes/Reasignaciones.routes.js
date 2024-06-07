const express = require('express'); //requerimiento de express
const router = express.Router();   // invocacion de la funcion router del modulo express
const Reasignacion = require('../models/Reasignaciones.js');
const Venta = require('../models/Ventas');
const Origen = require('../models/OrigenesYdestinos');
const Cliente = require('../models/Clientes');
const Usuario = require('../models/Usuarios');
const Sucursal = require('../models/Sucursales');
const Apartado = require('../models/Apartados');
const Viaje = require('../models/AsignarViajes');


function getArray(id, array){
    for (let i = 0; i < array.length; i++) {
        if(array[i]._id == id){
            return array[i];
        }
    }
}


router.get('/', async (req, res) => {
    const reasignacion = await Reasignacion.find();
    res.json(reasignacion);
});

router.get('/:id', async (req, res) =>{
    const reasignacion = await Reasignacion.findById(req.params.id);
    res.json(reasignacion);
});

router.get('/:value/:field', async (req, res) =>{
    switch (req.params.field) {
        case 'reasignado':
            try {
                let respuesta = [];
                let reasignaciones = await Reasignacion.find({reasignado: 'false'}).sort({ $natural: -1 }).limit(10);
                let origenes = await Origen.find();
                let vendedores = await Usuario.find();

                for (let i = 0; i < reasignaciones.length; i++) {
                    let venta = await Venta.findById(reasignaciones[i].idVentaReasignacion);
                    //res.json(venta);
                    let vendedor = getArray(reasignaciones[i].vendedor, vendedores);
                    let cliente = await Cliente.findById(reasignaciones[i].cliente);
                    let origen = getArray(venta.origen, origenes);
                    let destino = getArray(venta.destino, origenes);
                    respuesta.push({
                        _id: reasignaciones[i]._id,
                        idVentaReasignacion: reasignaciones[i].idVentaReasignacion,
                        idVentaEnlazado: venta._id,
                        folio: `${vendedor.prefijoFolio}-${venta.folio}`,
                        foliovendedor: venta.folio,
                        total: venta.total,
                        tipoCambio: venta.tipoCambio,
                        clienteID: cliente._id,
                        cliente: `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
                        tipo: venta.tipo,
                        razon: venta.razon,
                        descuento: venta.descuento,
                        origenID: origen._id,
                        origen: origen.nombre,
                        origenMunicipio: origen.municipio,
                        origenDireccion: origen.direccion,
                        origenEstado: origen.estado,
                        origenPais: origen.pais,
                        destinoID: destino._id,
                        destino: destino.nombre,
                        destinoMunicipio: destino.municipio,
                        destinoDireccion: destino.direccion,
                        destinoEstado: destino.estado,
                        destinoPais: destino.pais,
                        vendedorID: vendedor._id,
                        vendedorNombre: vendedor.nombre,
                        vendedorAPaterno: vendedor.apellidoPaterno,
                        vendedorAMaterno: vendedor.apellidoMaterno,
                        username: vendedor.nickname,
                        sucursal: vendedor.sucursal

                    });
                    //res.json(respuesta);
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

router.get('/:value/:value2/:field', async (req, res) =>{
    switch (req.params.field) {
        case 'folio':
            try {
                let respuesta = [];
                let vendedor = await Usuario.find({prefijoFolio: req.params.value});
                let idVendedor = vendedor[0]._id;
                let ventas = await Venta.find({folio: req.params.value2, vendedor: idVendedor, activo: 'true'});
                let reasignaciones = [];

                let origenes = await Origen.find();

                if(ventas[0].idVentasReasignacion){//Si el primer resultado es una reasignacion, procedemos a buscar con el id original
                    reasignaciones = await Reasignacion.find({reasignado: 'false', idVentaReasignacion: ventas[0].idVentasReasignacion});
                }else{
                    reasignaciones = await Reasignacion.find({reasignado: 'false', idVentaReasignacion: ventas[0]._id});
                }

                for (let i = 0; i < reasignaciones.length; i++) {
                    let venta = await Venta.findById(reasignaciones[i].idVentaReasignacion);
                    let cliente = await Cliente.findById(reasignaciones[i].cliente);
                    let origen = getArray(venta.origen, origenes);
                    let destino = getArray(venta.destino, origenes);
                    respuesta.push({
                        _id: reasignaciones[i]._id,
                        idVentaReasignacion: reasignaciones[i].idVentaReasignacion,
                        idVentaEnlazado: venta._id,
                        folio: `${vendedor[0].prefijoFolio}-${venta.folio}`,
                        foliovendedor: venta.folio,
                        total: venta.total,
                        tipoCambio: venta.tipoCambio,
                        clienteID: cliente._id,
                        cliente: `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
                        tipo: venta.tipo,
                        razon: venta.razon,
                        descuento: venta.descuento,
                        origenID: origen._id,
                        origen: origen.nombre,
                        origenMunicipio: origen.municipio,
                        origenDireccion: origen.direccion,
                        origenEstado: origen.estado,
                        origenPais: origen.pais,
                        destinoID: destino._id,
                        destino: destino.nombre,
                        destinoMunicipio: destino.municipio,
                        destinoDireccion: destino.direccion,
                        destinoEstado: destino.estado,
                        destinoPais: destino.pais,
                        vendedorID: vendedor[0]._id,
                        vendedorNombre: vendedor[0].nombre,
                        vendedorAPaterno: vendedor[0].apellidoPaterno,
                        vendedorAMaterno: vendedor[0].apellidoMaterno,
                        username: vendedor[0].nickname,
                        sucursal: vendedor[0].sucursal
                    });                  
                }

                res.json(respuesta);

            } catch (error) {
                
            }
            break;
    
        default:
            break;
    }
});

router.get('/:value/:opc/:value2/:value3', async (req, res) =>{
    switch (req.params.opc) {
        case 'pasajero':
            let respuesta = [];
            let clientes = [];

            let rNombre = req.params.value;
            let rApaterno = req.params.value2;
            let rAmaterno = req.params.value3;

            if(req.params.value != 'null' && req.params.value2 != 'null' && req.params.value3 != 'null'){
                clientes = await Cliente.find({nombre: rNombre, apellidoPaterno: rApaterno, apellidoMaterno: rAmaterno});
            }

            if(req.params.value != 'null' && req.params.value2 != 'null' && req.params.value3 == 'null'){
                clientes = await Cliente.find({nombre: rNombre, apellidoPaterno: rApaterno});
            }

            if(req.params.value != 'null' && req.params.value2 == 'null' && req.params.value3 != 'null'){
                clientes = await Cliente.find({nombre: rNombre, apellidoMaterno: rAmaterno});
            }

            if(req.params.value != 'null' && req.params.value2 == 'null' && req.params.value3 == 'null'){
                clientes = await Cliente.find({ nombre: rNombre });
            }

            if(req.params.value == 'null' && req.params.value2 != 'null' && req.params.value3 != 'null'){
                clientes = await Cliente.find({apellidoPaterno: rApaterno, apellidoMaterno: rAmaterno});
            }

            if(req.params.value == 'null' && req.params.value2 != 'null' && req.params.value3 == 'null'){
                clientes = await Cliente.find({ apellidoPaterno: rApaterno });
            }

            if(req.params.value == 'null' && req.params.value2 == 'null' && req.params.value3 != 'null'){
                clientes = await Cliente.find({ apellidoMaterno: rAmaterno });
            }

            let origenes = await Origen.find();
            let vendedores = await Usuario.find();

            let reasignaciones = [];

            if(clientes.length > 0){
                for (let i = 0; i < clientes.length; i++) {
                    reasignaciones = await Reasignacion.find({reasignado: 'false', cliente: clientes[i]._id});
                    for (let j = 0; j < reasignaciones.length; j++) {
                        let venta = await Venta.findById(reasignaciones[j].idVentaReasignacion);
                        let origen = getArray(venta.origen, origenes);
                        let destino = getArray(venta.destino, origenes);
                        let vendedor = getArray(venta.vendedor, vendedores);
                        respuesta.push({
                            _id: reasignaciones[j]._id,
                            idVentaReasignacion: reasignaciones[j].idVentaReasignacion,
                            idVentaEnlazado: venta._id,
                            folio: `${vendedor.prefijoFolio}-${venta.folio}`,
                            foliovendedor: venta.folio,
                            total: venta.total,
                            tipoCambio: venta.tipoCambio,
                            clienteID: clientes[i]._id,
                            cliente: `${clientes[i].nombre} ${clientes[i].apellidoPaterno} ${clientes[i].apellidoMaterno}`,
                            tipo: venta.tipo,
                            razon: venta.razon,
                            descuento: venta.descuento,
                            origenID: origen._id,
                            origen: origen.nombre,
                            origenMunicipio: origen.municipio,
                            origenDireccion: origen.direccion,
                            origenEstado: origen.estado,
                            origenPais: origen.pais,
                            destinoID: destino._id,
                            destino: destino.nombre,
                            destinoMunicipio: destino.municipio,
                            destinoDireccion: destino.direccion,
                            destinoEstado: destino.estado,
                            destinoPais: destino.pais,
                            vendedorID: vendedor._id,
                            vendedorNombre: vendedor.nombre,
                            vendedorAPaterno: vendedor.apellidoPaterno,
                            vendedorAMaterno: vendedor.apellidoMaterno,
                            username: vendedor.nickname,
                            sucursal: vendedor.sucursal
                        });
                    }
                }
            }

            res.json(respuesta);


            break;
    
        default:
            break;
    }
});

router.post('/:id', async (req, res)=>{
    const {idVentaReasignacion, tipoReasignacion, reasignado, motivo, cantPenalizacion, tipoDeCambio, vendedor, cliente} = req.body;
    const reasignacion= new Reasignacion({idVentaReasignacion, tipoReasignacion, reasignado, motivo, cantPenalizacion, tipoDeCambio, vendedor, cliente});
    await reasignacion.save();
    ///// AHORA ACTUALIZAMOS EL NUMERO DE REASIGNACIONES HECHAS EN LAS VENTAS
    const venta = await Venta.findById(req.body.idVentaReasignacion);
    let nreasignaciones = 0;
    if(venta.reasignaciones){
        nreasignaciones = venta.reasignaciones + 1;
    }else{
        nreasignaciones = 1;
    }

    await Venta.findOneAndUpdate(
        { _id: req.body.idVentaReasignacion },
        { reasignaciones : nreasignaciones }
    );

    ///// ACTUALIZAMOS EL CAMPO FECHA DE CANCELACION

    let fecha = new Date();

    await Venta.findOneAndUpdate(
        { _id: req.params.id },
        { fechaCancelacion:  `${fecha}`}
    );

    //ACTUALIZAMOS EL ESTADO DEL ASIENTO, AHORA FALSE (NO OCUPADO)

    let venta1 = await Venta.findById(req.params.id);

    if(venta1.numeroAsiento == 1){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_1: false }
        );
    }

    if(venta1.numeroAsiento == 2){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_2: false }
        );
    }

    if(venta1.numeroAsiento == 3){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_3: false }
        );
    }

    if(venta1.numeroAsiento == 4){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_4: false }
        );
    }

    if(venta1.numeroAsiento == 5){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_5: false }
        );
    }

    if(venta1.numeroAsiento == 6){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_6: false }
        );
    }

    if(venta1.numeroAsiento == 7){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_7: false }
        );
    }

    if(venta1.numeroAsiento == 8){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_8: false }
        );
    }

    if(venta1.numeroAsiento == 9){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_9: false }
        );
    }

    if(venta1.numeroAsiento == 10){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_10: false }
        );
    }

    if(venta1.numeroAsiento == 11){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_11: false }
        );
    }

    if(venta1.numeroAsiento == 12){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_12: false }
        );
    }

    if(venta1.numeroAsiento == 13){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_13: false }
        );
    }

    if(venta1.numeroAsiento == 14){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_14: false }
        );
    }

    if(venta1.numeroAsiento == 15){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_15: false }
        );
    }

    if(venta1.numeroAsiento == 16){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_16: false }
        );
    }

    if(venta1.numeroAsiento == 17){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_17: false }
        );
    }

    if(venta1.numeroAsiento == 18){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_18: false }
        );
    }

    if(venta1.numeroAsiento == 19){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_19: false }
        );
    }

    if(venta1.numeroAsiento == 20){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_20: false }
        );
    }

    if(venta1.numeroAsiento == 21){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_21: false }
        );
    }

    if(venta1.numeroAsiento == 22){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_22: false }
        );
    }

    if(venta1.numeroAsiento == 23){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_23: false }
        );
    }

    if(venta1.numeroAsiento == 24){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_24: false }
        );
    }

    if(venta1.numeroAsiento == 25){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_25: false }
        );
    }

    if(venta1.numeroAsiento == 26){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_26: false }
        );
    }

    if(venta1.numeroAsiento == 27){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_27: false }
        );
    }

    if(venta1.numeroAsiento == 28){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_28: false }
        );
    }

    if(venta1.numeroAsiento == 29){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_29: false }
        );
    }

    if(venta1.numeroAsiento == 30){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_30: false }
        );
    }

    if(venta1.numeroAsiento == 31){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_31: false }
        );
    }

    if(venta1.numeroAsiento == 32){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_32: false }
        );
    }

    if(venta1.numeroAsiento == 33){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_33: false }
        );
    }

    if(venta1.numeroAsiento == 34){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_34: false }
        );
    }

    if(venta1.numeroAsiento == 35){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_35: false }
        );
    }

    if(venta1.numeroAsiento == 36){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_36: false }
        );
    }

    if(venta1.numeroAsiento == 37){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_37: false }
        );
    }

    if(venta1.numeroAsiento == 38){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_38: false }
        );
    }

    if(venta1.numeroAsiento == 39){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_39: false }
        );
    }

    if(venta1.numeroAsiento == 40){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_40: false }
        );
    }

    if(venta1.numeroAsiento == 41){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_41: false }
        );
    }

    if(venta1.numeroAsiento == 42){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_42: false }
        );
    }

    if(venta1.numeroAsiento == 43){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_43: false }
        );
    }

    if(venta1.numeroAsiento == 44){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_44: false }
        );
    }

    if(venta1.numeroAsiento == 45){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_45: false }
        );
    }
    
    if(venta1.numeroAsiento == 46){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_46: false }
        );
    }

    if(venta1.numeroAsiento == 47){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_47: false }
        );
    }

    if(venta1.numeroAsiento == 48){
        await Viaje.findOneAndUpdate(
            { _id: venta1.idVenta},
            { asiento_48: false }
        );
    }

    res.json({status: 'REASIGNACION GUARDADO!!!!!'});
});

router.put('/:id', async (req, res) => {
    const {idVentaReasignacion, tipoReasignacion, reasignado, motivo, cantPenalizacion, tipoDeCambio, vendedor, cliente} = req.body;
    const reasignacion = {idVentaReasignacion, tipoReasignacion, reasignado, motivo, cantPenalizacion, tipoDeCambio, vendedor, cliente};
    await Reasignacion.findByIdAndUpdate(req.params.id, reasignacion);
    res.json({status:'REASIGNACION ACTUALIZADO!!!'});
});

router.put('/:value/:field', async (req, res) => {
    switch (req.params.field) {
        case 'GuardarBoleto':
            try {
                let body = req.body;
                //GUARDAMOS EL NUEVO BOLETO
                const {cliente, tipo, razon, descuento, origen, destino, fecha, anio, diaDelAnio, horaSalida, numeroAsiento, activo, idVenta, tipoCambio, total, vendedor, folio, viajado, idVentasReasignacion, tipoReasignacion} = req.body.datosG;
                const venta = new Venta({cliente, tipo, razon, descuento, origen, destino, fecha, anio, diaDelAnio, horaSalida, numeroAsiento, activo, idVenta, tipoCambio, total, vendedor, folio, viajado, idVentasReasignacion, tipoReasignacion});
                await venta.save();
                //AHORA CAMBIAMOS EL ESTADO DEL OBJETO REASIGNACION POR REASIGNADO = TRUE
                await Reasignacion.findOneAndUpdate(
                    { _id: req.params.value},
                    { reasignado: true }
                );
                //Quitamos los apartados
                let apartado = await Apartado.find({idVendedor: body.datosG.vendedor, idViaje: body.datosG.idVenta, asiento: body.datosG.numeroAsiento});
                if(apartado.length > 0){
                    await Apartado.findByIdAndDelete(apartado[0]._id);
                }
                //OBTENEMOS LOS DATOS QUE NOS FALTAN PARA EL BOLETO
                
                let resp = {
                    sucursal: "",
                    direccionMatriz: "",
                    telefonoMatriz: "",
                    direccionMatrizEU: "",
                    telefonoMatrizEU: "",
                    telSucursal: "",
                    correoSucursal: "",
                    dirSucursal: ""
                };
                let sucursal = await Sucursal.findById(body.datosG.sucursal);

                resp.sucursal = sucursal.nombre;
                resp.telSucursal = sucursal.telefono_1;
                resp.correoSucursal = sucursal.correo;
                resp.dirSucursal = `${sucursal.direccion} ${sucursal.ciudad} ${sucursal.estado} ${sucursal.pais}`;
                
                let matrices = await Sucursal.find({tipo: 'matriz'});
                for (let i = 0; i < matrices.length; i++) {
                    if(matrices[i].pais == 'MX'){
                        resp.direccionMatriz = matrices[i].direccion;
                        resp.telefonoMatriz = matrices[i].telefono_1;
                    }else{
                        resp.direccionMatrizEU = matrices[i].direccion;
                        resp.telefonoMatrizEU = matrices[i].telefono_1;
                    }
                }
                

                res.json({status:'REASIGNACION ACTUALIZADO!!!', resp: true, resp});
            } catch (error) {
                res.json(error);
            }
            break;
    
        default:
            break;
    }
});

router.delete('/:id', async (req, res) => {
    await Reasignacion.findByIdAndRemove(req.params.id);
    res.json({status:'REASIGNACION ELIMINADO!!!'});
});
module.exports = router;