const express = require('express'); //requerimiento de express
const router = express.Router();   // invocacion de la funcion router del modulo express
const Cliente = require('../models/Clientes');
const Venta = require('../models/Ventas');

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



async function buscarSoloNombre(Nombre, elemento, Limit ) {
    
    let regularName = `^${Nombre}.*`
    let rNombre = new RegExp(regularName, "i");
    try {
    let busqueda =[];
    busqueda = await Cliente.aggregate([
       { $match : { nombre : rNombre  } },
       { $match: {activo: 'true'}},
       { $sort: { nombre : 1 } },
       { $sort: { apellidoPaterno : 1 } },   
       { $skip: elemento },
       { $limit: Limit } 
      ]);
      return busqueda;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
                                }

async function buscarSoloApellido(Apaterno, elemento, Limit ) {
    try {
        let busqueda =[];
        let regularApaterno = `^${Apaterno}.*`
        let rApaterno = new RegExp(regularApaterno, "i");
        busqueda = await Cliente.aggregate([
           { $match : { apellidoPaterno : rApaterno  } },
           { $match: {activo: 'true'}},
           { $sort: { apellidoPaterno : 1 } },
           { $sort: { nombre : 1 } },  
           { $skip: elemento },
           { $limit: Limit } 
          ]);
          return busqueda;
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error interno del servidor' });
          }
                                }

async function buscarNombreApellido(Nombre, Apaterno, elemento, Limit ) {
    
                                  let regularName = `^${Nombre}.*`
                                  let rNombre = new RegExp(regularName, "i");
                                  let regularApaterno = `^${Apaterno}.*`
                                  let rApaterno = new RegExp(regularApaterno, "i");
                                  try {
                                  let busqueda =[];
                                  busqueda = await Cliente.aggregate([
                                     { $match : { nombre : rNombre  } },
                                     { $match : { apellidoPaterno : rApaterno  } },
                                     { $match: {activo: 'true'}},
                                     { $sort: { nombre : 1 } },
                                     { $sort: { apellidoPaterno : 1 } },   
                                     { $skip: elemento },
                                     { $limit: Limit } 
                                    ]);
                                    return busqueda;
                                  } catch (error) {
                                      console.error(error);
                                      res.status(500).json({ error: 'Error interno del servidor' });
                                    }
                                                              }
                              
async function pasajeroNombre(Nombre, elemento, Limit  ) {

  try { 
    let clientes = [];
    let respuesta = [];
    clientes = await buscarSoloNombre(Nombre, elemento, Limit );
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
        return respuesta;
} catch (error) {
                    res.json(error);
        }
      }

async function pasajeroApellido(Apaterno, elemento, Limit  ) {

        try { 
          let clientes = [];
          let respuesta = [];
          clientes = await buscarSoloApellido(Apaterno, elemento, Limit );
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
              return respuesta;
      } catch (error) {
                          res.json(error);
              }
            }

async function pasajeroNombreApellido(Nombre, Apaterno, elemento, Limit  ) {

              try { 
                let clientes = [];
                let respuesta = [];
                clientes = await buscarNombreApellido(Nombre,Apaterno, elemento, Limit );
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
                    return respuesta;
            } catch (error) {
                                res.json(error);
                    }
                  }
      
      

router.get('/:Limit', async(req,res) => {
    try {
        let busqueda =[];
        let Limit = parseInt(req.params.Limit);
        busqueda = await Cliente.aggregate([
           { $match: {activo: 'true'}},
           { $limit: Limit } 
          ]);
          res.json(busqueda);
          return busqueda;
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error interno del servidor' });
          }
                                    })
router.get('/:nombre/:apaterno/:controlCase/:pagina/:limit', async(req,res) => {
              let respuesta = [];    
       
               let Nombre = req.params.nombre;
               let Apaterno = req.params.apaterno;
               let ControlCase = req.params.controlCase;
               let elemento = parseInt(req.params.pagina);
               let Limit = parseInt(req.params.limit);
               switch (ControlCase) {
                    
                       case "soloNombre":
                                        try { 

                                                respuesta = await buscarSoloNombre(Nombre, elemento, Limit );
                                                res.json(respuesta);
                                                

                                            } catch (error) {
                                                                res.json(error);
                                                    }
                           break;
                       case "soloApellido":
                                        try {

                                                respuesta = await buscarSoloApellido(Apaterno, elemento, Limit );
                                                res.json(respuesta);
                                            
                                        } catch (error) {
                                                                res.json(error);
                                            }
                               break;
                       case "nombreApellido":
                                        try {

                                                respuesta = await buscarNombreApellido(Nombre, Apaterno, elemento, Limit );
                                                res.json(respuesta);

                                            } catch (error) {
                                                                res.json(error);
                                        }   
                                 break;
                      case "pasajeroNombre":
                                        try {

                                                respuesta = await pasajeroNombre(Nombre, elemento, Limit );
                                                res.json(respuesta);

                                            } catch (error) {
                                                                res.json(error);
                                        }   
                                 break;
                      case "pasajeroApellido":
                                        try {

                                                respuesta = await pasajeroApellido(Apaterno, elemento, Limit );
                                                res.json(respuesta);

                                            } catch (error) {
                                                                res.json(error);
                                        }   
                                 break;
                      case "pasajeroNombreApellido":
                                        try {

                                                respuesta = await pasajeroNombreApellido(Nombre,Apaterno, elemento, Limit );
                                                res.json(respuesta);

                                            } catch (error) {
                                                                res.json(error);
                                        }   
                                 break;

                   default:
                       break;
               }
           }
               
   )
module.exports = router;