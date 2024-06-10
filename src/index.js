/* requerimiento de las dependencias necesarias 
   guardandolas en una constante para poder ser reusadas*/
const path = require('path');   //modulo de nodejs que automatiza el manejo de direcctorios 
                                //los une ya sea con / o con \ segun sea el caso.
const morgan = require('morgan');// es una dependencia que permite monitorear las peticiones del servidor 
                                  // 
const express = require('express'); //constante de requerimiento de express 
const app = express(); 
const router = express.Router();
 //constante que manda llamar a la funcion express
/************************************************************************
 * ********************* CONFIGURACIÓN DEL SERVIDOR ***********************
 * **********************************************************************
 */
/* configuración del servidor
   se asigna el puerto por defecto del servidor sino 
   asigna el puerto 3000, esto es para dotar al servidor
   de la capacidad de tomar el puerto que le asigna el sistema operativo
   en el caso de estar alojado en un servidor web, sino le asigna el puerto 3000
   para el caso de estar en etapa de desarrollo o corriendo en un servidor local de node
*/
const {mongoose} = require ('./database');
app.set('port', process.env.PORT || 3000); 
/***********************MIDDLE WARES**********************************************************
 * SON FUNCIONES QUE SE EJECUTAN ANTES DE LLEGAR A LAS RUTAS
 * ********************************************************************************************
 */
app.use(morgan('dev'));
app.use(express.json());    ///FUNCION QUE MONITOREA CADA EVENTO DEL SERVIDOR Y COMPRUEBA SI ES DE FORMATO JSON
 /***********************RUTAS DEL SERVIDOR (ROUTS) ***********************************************/
app.use('/api/AsignarViajes', require('./routes/AsignarViajes.routes'));
app.use('/api/Apartados', require('./routes/Apartados.routes'));
app.use('/api/Cancelaciones', require('./routes/Cancelaciones.routes'));
app.use('/api/Camiones', require('./routes/Camiones.routes'));
app.use('/api/Clientes', require('./routes/Clientes.routes'));
app.use('/api/ConfiguracionBoleto', require('./routes/ConfiguracionBoleto.routes'));
app.use('/api/DescuentosNuevo', require('./routes/DescuentosNuevo.routes'));
app.use('/api/Descuentos', require('./routes/Descuentos.routes'));
app.use('/api/DescuentoFamiliar', require('./routes/DescuentoFamiliar.routes'));
app.use('/api/Dollar', require('./routes/Dollar.routes'));
app.use('/api/FindQuery', require('./routes/find.query'));
app.use('/api/ImagenesBoletos', require('./routes/ImagenesBoletos.routes'));
app.use('/api/ListaDeAbordaje', require('./routes/ListaDeAbordaje.routes'));
app.use('/api/ListaNegra', require('./routes/ListaNegra.routes'));
app.use('/api/ModificacionCorte', require('./routes/ModificacionCorte.routes'));
app.use('/api/NotasListaDeAbordaje', require('./routes/NotasListaDeAbordaje.routes'));
app.use('/api/OrigenesYdestinos', require('./routes/OrigenesYdestinos.routes'));
app.use('/api/Pagos', require('./routes/Pagos.routes'));
app.use('/api/Precios', require('./routes/Precios.routes'));
app.use('/api/Reasignaciones', require('./routes/Reasignaciones.routes'));
app.use('/api/Reservaciones', require('./routes/Reservaciones.routes'));
app.use('/api/Rutas', require('./routes/Rutas.routes'));
app.use('/api/Sucursales', require('./routes/Sucursales.routes'));
app.use('/api/Tripulantes', require('./routes/Tripulantes.routes'));
app.use('/api/Usuarios', require('./routes/Usuarios.routes'));
app.use('/api/UsersNew', require('./routes/UsersNew.routes'));
app.use('/api/Ventas', require('./routes/Ventas.routes'));

/********************ARCHIVOS ESTATICOS DEL SERVIDOR***************************************** */
app.use(express.static(path.join(__dirname, 'public'))); //join es una funcion del modulo de path que permite concatenar directorios
/************************INICIALIZACION DEL SERVIDOR*******************************************/
const server = app.listen (app.get('port'), () => {       
    console.log('server on port', app.get('port'));
}); //la constante server guarda en ella el servidor inicializado de express para ser reutilizado en socket.io 
     //ya que necesita un servidor ya inicializado
     
  /****************CONFIGURACION Y MANEJO DE WEBSOCKETS***************************************** */   
//const SocketIO = require('socket.io'); // constante de requerimiento de la dependencia de socket.io
//const io = SocketIO(server); //inicializacion de socket.io con el parametro server
//como primer evento de la coneccion de websockets
//esta el eschuchar cuando se ha conectado alguien
//io.on ('connection', (socket) => {  //funcion que invoca la constante socket del frontend
 //   console.log('new conection', socket.id);// muestra en pantalla cuando se ha conectado alguien y el id del socket de conexion
  //  });
  module.exports = app ;