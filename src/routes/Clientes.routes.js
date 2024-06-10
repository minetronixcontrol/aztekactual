const express = require('express'); //requerimiento de express
const router = express.Router();   // invocacion de la funcion router del modulo express
const Cliente = require('../models/Clientes');
const Venta = require('../models/Ventas');
const Usuario = require('../models/Usuarios');

function getType(fechaNacimiento, type){
    let fecha = new Date();
    let anioActual = fecha.getFullYear();
    fechaNacimiento = fechaNacimiento.split("/", 3);
    fechaNacimiento = fechaNacimiento[2];
    let edad = anioActual-fechaNacimiento;
    if(edad < 10){
        if(type=='color'){
            return '#FF7F70';
        }else{
            return 'Niño';
        }      
    }else if(edad > 59){
        if(type=='color'){
            return '#A466E8'
        }else{
            return 'INSEN';
        } 
    }else{
        if(type=='color'){
            return '#4C76FF'
        }else{
            return 'Adulto';
        }
    }
}

function getClienteFrecuente(ventasActual, ventasAnterior) {
    if(ventasActual.length >= 6 || ventasAnterior >= 6){
        return "true"
    }else{
        return "false"
    }
}

router.get('/', async (req, res) => {
    const cliente = await Cliente.find({ activo: 'true' });
    //console.log(cliente);
    res.json(cliente);
});
router.get('/:id', async (req, res) =>{
    const cliente = await Cliente.findById(req.params.id);
    res.json(cliente);
});
router.get('/:value/:field', async (req, res) =>{
    switch (req.params.field) {
        case 'ultimosRegistrosAdmin':
            try {
                let clientes = await Cliente.find().sort({ $natural: -1 }).limit(10);
                res.json(clientes);
            } catch (error) {
                res.json(error);
            }
            break;
        case 'ultimosRegistros':
            try {
                let clientes = await Cliente.find({usuario: req.params.value}).sort({ $natural: -1 }).limit(10);
                res.json(clientes);
            } catch (error) {
                res.json(error);
            }
            break;
        case 'nombreCompleto':
            try {
                const cliente = await Cliente.find({activo: 'true'}, {nombre: 1, apellidoPaterno: 1, apellidoMaterno: 1});
                res.json(cliente);
            } catch (error) {
                console.log(error);
            }
            break;
        case 'activo':
            try {
                const cliente = await Cliente.find({activo: 'true'});
                res.json(cliente);
            } catch (error) {
                console.log(error);
            }
            break;
        case 'newVenta':
            try {
                let respuesta = [];
                const clientes = await Cliente.find({activo: 'true'});
                //Recorremos clientes y determinamos cuantas veces ha viajado en el año, y en el año pasado.
                //Si ha viajado 6 veces o más en el presente año o en el pasado, será acreedor del descuento
                let hoy = new Date();
                let anioActual = hoy.getFullYear();
                let anioAnterior = anioActual-1;
                for (let i = 0; i < clientes.length; i++) {
                    let ventasActual = await Venta.find({activo: 'true', anio: anioActual, cliente: clientes[i]._id});
                    let ventasAnterior = await Venta.find({activo: 'true', anio: anioAnterior, cliente: clientes[i]._id});
                    respuesta.push({
                        value: clientes[i]._id,
                        name: `${clientes[i].nombre} ${clientes[i].apellidoPaterno} ${clientes[i].apellidoMaterno}`, 
                        label: `${clientes[i].nombre} ${clientes[i].apellidoPaterno} ${clientes[i].apellidoMaterno} -  ${clientes[i].fechaNacimiento}`,
                        color: getType(clientes[i].fechaNacimiento, 'color'),
                        type: getType(clientes[i].fechaNacimiento),
                        listaNegra: clientes[i].listaNegra,
                        clienteFrecuente: getClienteFrecuente(ventasActual, ventasAnterior)
                    });
                }
                res.json(respuesta);
            } catch (error) {
                console.log(error);
            }
            break;
        case 'usuario':
            try {
                let usuario = await Usuario.find({ nickname: req.params.value });
                let cliente = null;
                if((usuario[0].seguridad == 'Admin')){
                    cliente = await Cliente.find({activo: 'true'});
                    res.json(cliente);
                }else{
                    cliente = await Cliente.find({activo: 'true', usuario: usuario[0]._id});
                    res.json(cliente)
                }
                res.json(usuario);
            } catch (error) {
                res.json(error);
            }
            break;
        case 'regex':
            try {
                let respuesta = [];
                //Buscamos clientes que coincidan con lo que introdujo el usuario vendedor
                let reg = `.*${req.params.value}.*`;
                let re = new RegExp(reg, "i");
                //let cliente = await Cliente.find({ nombre: re });
                //let clientes = await Cliente.find({tags:{$in:["laborum","sunt","nisi"]}},{name:1,tags:1});
                //La siguiente linea de codigo funciona filtrando solo un campo
                let clientes = await Cliente.find({ $or: [ { nombre: re }, { apellidoPaterno: re }, { apellidoMaterno: re } ]});
                //Recorremos clientes y determinamos cuantas veces ha viajado en el año, y en el año pasado.
                //Si ha viajado 6 veces o más en el presente año o en el pasado, será acreedor del descuento
                let hoy = new Date();
                let anioActual = hoy.getFullYear();
                let anioAnterior = anioActual-1;
                for (let i = 0; i < clientes.length; i++) {
                    let ventasActual = await Venta.find({activo: 'true', anio: anioActual, cliente: clientes[i]._id});
                    let ventasAnterior = await Venta.find({activo: 'true', anio: anioAnterior, cliente: clientes[i]._id});
                    let sim = getType(clientes[i].fechaNacimiento);
                    respuesta.push({
                        value: clientes[i]._id,
                        name: `${clientes[i].nombre} ${clientes[i].apellidoPaterno} ${clientes[i].apellidoMaterno}`, 
                        label: `${clientes[i].fechaNacimiento}`,
                        telefono: clientes[i].telefono,
                        color: getType(clientes[i].fechaNacimiento, 'color'),
                        type: getType(clientes[i].fechaNacimiento),
                        listaNegra: clientes[i].listaNegra,
                        clienteFrecuente: getClienteFrecuente(ventasActual, ventasAnterior),
                        simbologia: (sim == 'Niño')? 'nino' : ((sim == 'Adulto')? 'adulto' : 'adultoM')
                    });
                }
                res.json(respuesta);
            } catch (error) {
                
            }
            break;
    
        default:
            break;
    }
})
router.get('/:nombre/:apaterno/:amaterno', async (req, res) =>{
    try {
        let respuesta = [];    

        let clientes = [];

        let Nombre = req.params.nombre;
        let Apaterno = regApaterno = req.params.apaterno;
        let Amaterno = rAmaterno = req.params.amaterno;
        let regularName = `^${Nombre}.*`
        let rNombre = new RegExp(regularName, "i");
        let regularApaterno = `^${Apaterno}.*`
        let rApaterno = new RegExp(regularApaterno, "i");

        if(req.params.nombre != 'null' && req.params.apaterno != 'null' && req.params.amaterno != 'null'){
            clientes = await Cliente.find({nombre: rNombre, apellidoPaterno: rApaterno, apellidoMaterno: rAmaterno});
        }

        if(req.params.nombre != 'null' && req.params.apaterno != 'null' && req.params.amaterno == 'null'){
            clientes = await Cliente.find({nombre: rNombre, apellidoPaterno: rApaterno});
        }

        if(req.params.nombre != 'null' && req.params.apaterno == 'null' && req.params.amaterno != 'null'){
            clientes = await Cliente.find({nombre: rNombre, apellidoMaterno: rAmaterno});
        }

        if(req.params.nombre != 'null' && req.params.apaterno == 'null' && req.params.amaterno == 'null'){
            clientes = await Cliente.find({ nombre: rNombre });
        }

        if(req.params.nombre == 'null' && req.params.apaterno != 'null' && req.params.amaterno != 'null'){
            clientes = await Cliente.find({apellidoPaterno: rApaterno, apellidoMaterno: rAmaterno});
        }

        if(req.params.nombre == 'null' && req.params.apaterno != 'null' && req.params.amaterno == 'null'){
            clientes = await Cliente.find({ apellidoPaterno: rApaterno });
        }

        if(req.params.nombre == 'null' && req.params.apaterno == 'null' && req.params.amaterno != 'null'){
            clientes = await Cliente.find({ apellidoMaterno: rAmaterno });
        }

        //Recorremos clientes y determinamos cuantas veces ha viajado en el año, y en el año pasado.
        //Si ha viajado 6 veces o más en el presente año o en el pasado, será acreedor del descuento
        let hoy = new Date();
        let anioActual = hoy.getFullYear();
        let anioAnterior = anioActual-1;
        for (let i = 0; i < clientes.length; i++) {
            let ventasActual = await Venta.find({activo: 'true', anio: anioActual, cliente: clientes[i]._id});
            let ventasAnterior = await Venta.find({activo: 'true', anio: anioAnterior, cliente: clientes[i]._id});
            let sim = getType(clientes[i].fechaNacimiento);
            respuesta.push({
                value: clientes[i]._id,
                name: `${clientes[i].nombre} ${clientes[i].apellidoPaterno} ${clientes[i].apellidoMaterno}`, 
                label: `${clientes[i].fechaNacimiento}`,
                telefono: clientes[i].telefono,
                color: getType(clientes[i].fechaNacimiento, 'color'),
                type: getType(clientes[i].fechaNacimiento),
                listaNegra: clientes[i].listaNegra,
                clienteFrecuente: getClienteFrecuente(ventasActual, ventasAnterior),
                simbologia: (sim == 'Niño')? 'nino' : ((sim == 'Adulto')? 'adulto' : 'adultoM')
            });
        }
        res.json(respuesta);
    } catch (error) {
        res.json(error);
    }
    /*try {
        let respuesta = [];
        //Buscamos clientes que coincidan con lo que introdujo el usuario vendedor
        let regNombre = '';
        let regApaterno = '';
        let regAmaterno = '';

        if(req.params.nombre != 'null'){
            regNombre = `.*${req.params.nombre}.*`;
        }

        if(req.params.apaterno != 'null'){
            regApaterno = `.*${req.params.apaterno}.*`;
        }

        if(req.params.amaterno != 'null'){
            regAmaterno = `.*${req.params.amaterno}.*`;
        }      

        let clientes = null;

        let rNombre = new RegExp(regNombre, "i");
        let rApaterno = new RegExp(regApaterno, "i");
        let rAmaterno = new RegExp(regAmaterno, "i");

        if(req.params.nombre != 'null' && req.params.apaterno != 'null' && req.params.amaterno != 'null'){
            clientes = await Cliente.find({ $or: [ { nombre: rNombre }, { apellidoPaterno: rApaterno }, { apellidoMaterno: rAmaterno } ]});
        }

        if(req.params.nombre != 'null' && req.params.apaterno != 'null' && req.params.amaterno == 'null'){
            clientes = await Cliente.find({ $or: [ { nombre: rNombre }, { apellidoPaterno: rApaterno } ]});
        }

        if(req.params.nombre != 'null' && req.params.apaterno == 'null' && req.params.amaterno != 'null'){
            clientes = await Cliente.find({ $or: [ { nombre: rNombre }, { apellidoMaterno: rAmaterno } ]});
        }

        if(req.params.nombre != 'null' && req.params.apaterno == 'null' && req.params.amaterno == 'null'){
            clientes = await Cliente.find({ nombre: rNombre });
        }

        if(req.params.nombre == 'null' && req.params.apaterno != 'null' && req.params.amaterno != 'null'){
            clientes = await Cliente.find({ $or: [{ apellidoPaterno: rApaterno }, { apellidoMaterno: rAmaterno } ]});
        }

        if(req.params.nombre == 'null' && req.params.apaterno != 'null' && req.params.amaterno == 'null'){
            clientes = await Cliente.find({ apellidoPaterno: rApaterno });
        }

        if(req.params.nombre == 'null' && req.params.apaterno == 'null' && req.params.amaterno != 'null'){
            clientes = await Cliente.find({ apellidoMaterno: rAmaterno });
        }

        //Recorremos clientes y determinamos cuantas veces ha viajado en el año, y en el año pasado.
        //Si ha viajado 6 veces o más en el presente año o en el pasado, será acreedor del descuento
        let hoy = new Date();
        let anioActual = hoy.getFullYear();
        let anioAnterior = anioActual-1;
        for (let i = 0; i < clientes.length; i++) {
            let ventasActual = await Venta.find({activo: 'true', anio: anioActual, cliente: clientes[i]._id});
            let ventasAnterior = await Venta.find({activo: 'true', anio: anioAnterior, cliente: clientes[i]._id});
            let sim = getType(clientes[i].fechaNacimiento);
            respuesta.push({
                value: clientes[i]._id,
                name: `${clientes[i].nombre} ${clientes[i].apellidoPaterno} ${clientes[i].apellidoMaterno}`, 
                label: `${clientes[i].fechaNacimiento}`,
                telefono: clientes[i].telefono,
                color: getType(clientes[i].fechaNacimiento, 'color'),
                type: getType(clientes[i].fechaNacimiento),
                listaNegra: clientes[i].listaNegra,
                clienteFrecuente: getClienteFrecuente(ventasActual, ventasAnterior),
                simbologia: (sim == 'Niño')? 'nino' : ((sim == 'Adulto')? 'adulto' : 'adultoM')
            });
        }
        res.json(respuesta);
    } catch (error) {
        
    }*/
});
router.get('/:nombre/:apaterno/:amaterno/:clientes', async (req, res) =>{
    switch (req.params.clientes) {
        case 'clientes':
            try {
                let respuesta = [];
                //Buscamos clientes que coincidan con lo que introdujo el usuario vendedor
                let regNombre = '';
                let regApaterno = '';
                let regAmaterno = '';
        
                if(req.params.nombre != 'null'){
                    regNombre = `.*${req.params.nombre}.*`;
                }
        
                if(req.params.apaterno != 'null'){
                    regApaterno = `.*${req.params.apaterno}.*`;
                }
        
                if(req.params.amaterno != 'null'){
                    regAmaterno = `.*${req.params.amaterno}.*`;
                }      
        
                let clientes = null;
        
                let rNombre = new RegExp(regNombre, "i");
                let rApaterno = new RegExp(regApaterno, "i");
                let rAmaterno = new RegExp(regAmaterno, "i");
        
                if(req.params.nombre != 'null' && req.params.apaterno != 'null' && req.params.amaterno != 'null'){
                    clientes = await Cliente.find({ $or: [ { nombre: rNombre }, { apellidoPaterno: rApaterno }, { apellidoMaterno: rAmaterno } ]});
                }
        
                if(req.params.nombre != 'null' && req.params.apaterno != 'null' && req.params.amaterno == 'null'){
                    clientes = await Cliente.find({ $or: [ { nombre: rNombre }, { apellidoPaterno: rApaterno } ]});
                }
        
                if(req.params.nombre != 'null' && req.params.apaterno == 'null' && req.params.amaterno != 'null'){
                    clientes = await Cliente.find({ $or: [ { nombre: rNombre }, { apellidoMaterno: rAmaterno } ]});
                }
        
                if(req.params.nombre != 'null' && req.params.apaterno == 'null' && req.params.amaterno == 'null'){
                    clientes = await Cliente.find({ nombre: rNombre });
                }
        
                if(req.params.nombre == 'null' && req.params.apaterno != 'null' && req.params.amaterno != 'null'){
                    clientes = await Cliente.find({ $or: [{ apellidoPaterno: rApaterno }, { apellidoMaterno: rAmaterno } ]});
                }
        
                if(req.params.nombre == 'null' && req.params.apaterno != 'null' && req.params.amaterno == 'null'){
                    clientes = await Cliente.find({ apellidoPaterno: rApaterno });
                }
        
                if(req.params.nombre == 'null' && req.params.apaterno == 'null' && req.params.amaterno != 'null'){
                    clientes = await Cliente.find({ apellidoMaterno: rAmaterno });
                }
        
                res.json(clientes);
            } catch (error) {
                res.json(error);
            }
            break;
        default:
            try {
                let respuesta = [];
                //Buscamos clientes que coincidan con lo que introdujo el usuario vendedor
                let regNombre = '';
                let regApaterno = '';
                let regAmaterno = '';
        
                if(req.params.nombre != 'null'){
                    regNombre = `.*${req.params.nombre}.*`;
                }
        
                if(req.params.apaterno != 'null'){
                    regApaterno = `.*${req.params.apaterno}.*`;
                }
        
                if(req.params.amaterno != 'null'){
                    regAmaterno = `.*${req.params.amaterno}.*`;
                }      
        
                let clientes = null;
        
                let rNombre = new RegExp(regNombre, "i");
                let rApaterno = new RegExp(regApaterno, "i");
                let rAmaterno = new RegExp(regAmaterno, "i");
        
                if(req.params.nombre != 'null' && req.params.apaterno != 'null' && req.params.amaterno != 'null'){
                    clientes = await Cliente.find({ usuario: req.params.clientes, $or: [ { nombre: rNombre }, { apellidoPaterno: rApaterno }, { apellidoMaterno: rAmaterno } ]});
                }
        
                if(req.params.nombre != 'null' && req.params.apaterno != 'null' && req.params.amaterno == 'null'){
                    clientes = await Cliente.find({ usuario: req.params.clientes, $or: [ { nombre: rNombre }, { apellidoPaterno: rApaterno } ]});
                }
        
                if(req.params.nombre != 'null' && req.params.apaterno == 'null' && req.params.amaterno != 'null'){
                    clientes = await Cliente.find({ usuario: req.params.clientes, $or: [ { nombre: rNombre }, { apellidoMaterno: rAmaterno } ]});
                }
        
                if(req.params.nombre != 'null' && req.params.apaterno == 'null' && req.params.amaterno == 'null'){
                    clientes = await Cliente.find({ usuario: req.params.clientes, nombre: rNombre });
                }
        
                if(req.params.nombre == 'null' && req.params.apaterno != 'null' && req.params.amaterno != 'null'){
                    clientes = await Cliente.find({ usuario: req.params.clientes, $or: [{ apellidoPaterno: rApaterno }, { apellidoMaterno: rAmaterno } ]});
                }
        
                if(req.params.nombre == 'null' && req.params.apaterno != 'null' && req.params.amaterno == 'null'){
                    clientes = await Cliente.find({ usuario: req.params.clientes, apellidoPaterno: rApaterno });
                }
        
                if(req.params.nombre == 'null' && req.params.apaterno == 'null' && req.params.amaterno != 'null'){
                    clientes = await Cliente.find({ usuario: req.params.clientes, apellidoMaterno: rAmaterno });
                }
        
                res.json(clientes);
            } catch (error) {
                res.json(error);
            }
            break;
    }
});
router.post('/', async (req, res)=>{
    const {nombre, apellidoMaterno, apellidoPaterno, fechaNacimiento, correo, curp, genero, telefono, nombreEmergencia, apellidoMaternoEmergencia, apellidoPaternoEmergencia, parentesco, telefonoEmergencia, activo, id_Cliente, listaNegra, usuario} = req.body;
    const cliente= new Cliente({nombre, apellidoMaterno, apellidoPaterno, fechaNacimiento, correo, curp, genero, telefono, nombreEmergencia, apellidoMaternoEmergencia, apellidoPaternoEmergencia, parentesco, telefonoEmergencia, activo, id_Cliente, listaNegra, usuario});
    await cliente.save();
    res.json({status: 'CLIENTE GUARDADO!!!!!'});
});
router.post('/:returnCliente', async (req, res)=>{
    const {nombre, apellidoMaterno, apellidoPaterno, fechaNacimiento, correo, curp, genero, telefono, nombreEmergencia, apellidoMaternoEmergencia, apellidoPaternoEmergencia, parentesco, telefonoEmergencia, activo, id_Cliente, listaNegra, usuario} = req.body;
    const cliente= new Cliente({nombre, apellidoMaterno, apellidoPaterno, fechaNacimiento, correo, curp, genero, telefono, nombreEmergencia, apellidoMaternoEmergencia, apellidoPaternoEmergencia, parentesco, telefonoEmergencia, activo, id_Cliente, listaNegra, usuario});
    
    await cliente.save(function(err, result){
        if(err) {
          response = { error: true, message: "Error adding data" };
        } else {
          response = { error: false, message: "Data added", 
          data: {
              value: result._id, 
              name: `${result.nombre} ${result.apellidoPaterno} ${result.apellidoMaterno}`,
              label: `${result.fechaNacimiento}`,
              telefono: result.telefono,
              color: getType(result.fechaNacimiento, 'color'),
              type: getType(result.fechaNacimiento),
              listaNegra: "false",
              clienteFrecuente: "false"
            } };
        }
        res.json(response);
    });
});
router.put('/:id', async (req, res) => {
    const {nombre, apellidoMaterno, apellidoPaterno, fechaNacimiento, correo, curp, genero, telefono, nombreEmergencia, apellidoMaternoEmergencia, apellidoPaternoEmergencia, parentesco, telefonoEmergencia, activo, id_Cliente, listaNegra} = req.body;
    const nuevoCliente = {nombre, apellidoMaterno, apellidoPaterno, fechaNacimiento, correo, curp, genero, telefono, nombreEmergencia, apellidoMaternoEmergencia, apellidoPaternoEmergencia, parentesco, telefonoEmergencia, activo, id_Cliente, listaNegra};
    await Cliente.findByIdAndUpdate(req.params.id, nuevoCliente);
    res.json({status:'CLIENTE ACTUALIZADO!!!'});
});

router.put('/:id/:value', async (req, res) => {
    switch (req.params.value) {
        case 'printClientes':
            try {
                let respuesta = [];                
                let selectedRowKeys = req.body.selectedRowKeys;
                for (let i = 0; i < selectedRowKeys.length; i++) {
                    let cliente = await Cliente.findById(selectedRowKeys[i]);
                    respuesta.push(cliente);
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
                await Cliente.findOneAndUpdate(
                    { _id: req.params.id },
                    { nombre: req.params.value }
                );
                res.json({status:'CLIENTE ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
        case 'apellidoPaterno':
            try {
                await Cliente.findOneAndUpdate(
                    { _id: req.params.id },
                    { apellidoPaterno: req.params.value }
                );
                res.json({status:'CLIENTE ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
        case 'apellidoMaterno':
            try {
                let value;
                if(req.params.value == 'null'){
                    value == '';
                }else{
                    value = req.params.value;
                }
                await Cliente.findOneAndUpdate(
                    { _id: req.params.id },
                    { apellidoMaterno: value }
                );
                res.json({status:'CLIENTE ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
        case 'fechaNacimiento':
            try {
                await Cliente.findOneAndUpdate(
                    { _id: req.params.id },
                    { fechaNacimiento: req.params.value }
                );
                res.json({status:'CLIENTE ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
        case 'correo':
            try {
                await Cliente.findOneAndUpdate(
                    { _id: req.params.id },
                    { correo: req.params.value }
                );
                res.json({status:'CLIENTE ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
        case 'curp':
            try {
                await Cliente.findOneAndUpdate(
                    { _id: req.params.id },
                    { curp: req.params.value }
                );
                res.json({status:'CLIENTE ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
        case 'genero':
            try {
                await Cliente.findOneAndUpdate(
                    { _id: req.params.id },
                    { genero: req.params.value }
                );
                res.json({status:'CLIENTE ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
        case 'telefono':
            try {
                await Cliente.findOneAndUpdate(
                    { _id: req.params.id },
                    { telefono: req.params.value }
                );
                res.json({status:'CLIENTE ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
        case 'nombreEmergencia':
            try {
                await Cliente.findOneAndUpdate(
                    { _id: req.params.id },
                    { nombreEmergencia: req.params.value }
                );
                res.json({status:'CLIENTE ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
        case 'apellidoMaternoEmergencia':
            try {
                await Cliente.findOneAndUpdate(
                    { _id: req.params.id },
                    { apellidoMaternoEmergencia: req.params.value }
                );
                res.json({status:'CLIENTE ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
        case 'apellidoPaternoEmergencia':
            try {
                await Cliente.findOneAndUpdate(
                    { _id: req.params.id },
                    { apellidoPaternoEmergencia: req.params.value }
                );
                res.json({status:'CLIENTE ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
        case 'parentesco':
            try {
                await Cliente.findOneAndUpdate(
                    { _id: req.params.id },
                    { parentesco: req.params.value }
                );
                res.json({status:'CLIENTE ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
        case 'telefonoEmergencia':
            try {
                await Cliente.findOneAndUpdate(
                    { _id: req.params.id },
                    { telefonoEmergencia: req.params.value }
                );
                res.json({status:'CLIENTE ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
        case 'activo':
            try {
                await Cliente.findOneAndUpdate(
                    { _id: req.params.id },
                    { activo: req.params.value }
                );
                res.json({status:'CLIENTE ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
        case 'listaNegra':
            try {
                await Cliente.findOneAndUpdate(
                    { _id: req.params.id },
                    { listaNegra: req.params.value }
                );
                res.json({status:'CLIENTE ACTUALIZADO!!!'});
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
    await Cliente.findByIdAndRemove(req.params.id);
    res.json({status:'CLIENTE ELIMINADO!!!'});
})
module.exports = router;