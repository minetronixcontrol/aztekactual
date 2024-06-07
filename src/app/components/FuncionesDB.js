import axios from 'axios'
//CONSULTAS DE BOLETO
//CONSULTA POST DE BOLETO
export const boleto = nuevoBoleto => {
        axios.posT('/api/boletos',{
            cliente: nuevoBoleto.cliente, fecha: nuevoBoleto.fecha,
            hora: nuevoBoleto.hora, ruta: nuevoBoleto.ruta,
            vendedor: nuevoBoleto.vendedor, camion: nuevoBoleto.camion,
            numero_asiento: nuevoBoleto.numero_asiento, descuento: nuevoBoleto.descuento,
            costo: nuevoBoleto.costo, viajado: nuevoBoleto.viajado})
        .then(res => {console.log('Nuevo Boleto Registrado!')})}
//CONSULTA PUT DE BOLETO
export const putboleto = putBoleto => {
        axios.put('/api/boletos/:id',{
            cliente: putBoleto.cliente, fecha: putBoleto.fecha,
            hora: putBoleto.hora, ruta: putBoleto.ruta,
            vendedor: putBoleto.vendedor, camion: putBoleto.camion,
            numero_asiento: putBoleto.numero_asiento, descuento: putBoleto.descuento,
            costo: putBoleto.costo, viajado: putBoleto.viajado})
            .then(res => {console.log('Boleto Modificado Registrado!')})}
//CONSULTA GET DE BOLETOS
export const getBoletos = () => {
    axios.get('/api/boletos')
      .then(res=> {console.log(res)})
      .catch(function (error) {console.log(error);})}
//CONSULTAS DE CAMION
//CONSULTA POST DE CAMION
export const camion = nuevoCamion => {
    axios.post('/api/camiones',{
        placas: nuevoCamion.placas, asientos: nuevoCamion.asientos,
        numero_camion: nuevoCamion.numero_camion})
    .then(res => {console.log('Nuevo Camion Registrado!')})}
//CONSULTA PUT DE CAMION
export const putcamion = putCamion => {
    axios.put('/api/camiones/:id',{
        placas: putCamion.placas, asientos: putCamion.asientos,
        numero_camion: putCamion.numero_camion})
    .then(res => {console.log('Camion Modificado Registrado!')})}
//CONSULTA GET DE CAMIONES
export const getCamiones = () => {
    axios.get('/api/camiones')
        .then(res=> {console.log(res)})
        .catch(function (error) {console.log(error);})}
//CONSULTAS DE CHOFER
//CONSULTA POST DE CHOFER
export const chofer = nuevoChofer => {
    axios.post('/api/choferes',{
        nombres: nuevoChofer.nombres, apellido_1: nuevoChofer.apellido_1,
        apellido_2: nuevoChofer.apellido_2, camion: nuevoChofer.camion,
        ruta: nuevoChofer.ruta})
    .then(res => {console.log('Nuevo Chofer Registrado!')})}
//CONSULTA PUT DE CHOFER
export const putchofer = putChofer => {
    axios.put('/api/choferes/:id',{
        nombres: putChofer.nombres, apellido_1: putChofer.apellido_1,
        apellido_2: putChofer.apellido_2, camion: putChofer.camion,
        ruta: putChofer.ruta})
    .then(res => {console.log('Chofer Modificado Registrado!')})}
//CONSULTA GET DE CHOFERES
export const getChofer = () => {
    axios.get('/api/choferes')
        .then(res=> {console.log(res)})
        .catch(function (error) {console.log(error);})}
//CONSULTAS DE CLIENTE
//CONSULTA POST DE CLIENTE
export const cliente = nuevoCliente => {
    axios.post('/api/clientes',{
        nombre: nuevoCliente.nombre, apellido_1: nuevoCliente.apellido_1,
        apellido_2: nuevoCliente.apellido_2, fecha_nacimiento: nuevoCliente.fecha_nacimiento,
        CURP: nuevoCliente.CURP, INE: nuevoCliente.INE,
        INSEN: nuevoCliente.INSEN})
    .then(res => {console.log('Nuevo Cliente Registrado!')})}
//cONSULTA PUT DE CLIENTE
export const putcliente = putCliente => {
    axios.put('/api/clientes/:id',{
        nombre: putCliente.nombre, apellido_1: putCliente.apellido_1,
        apellido_2: putCliente.apellido_2, fecha_nacimiento: putCliente.fecha_nacimiento,
        CURP: putCliente.CURP, INE: putCliente.INE,
        INSEN: putCliente.INSEN})
    .then(res => {console.log('Cliente Modificado Registrado!')})}
//CONSULTA GET DE CLIENTES
export const getClientes = () => {
    axios.get('/api/clientes')
        .then(res=> {console.log(res)})
        .catch(function (error) {console.log(error);})}
//CONSULTAS DE DESUENTO
//CONSULTA POST DE DESCUENTO
export const descuento = nuevoDescuento => {
    axios.post('/api/descuentos/:id',{nombre: nuevoDescuento.nombre, cantidad: nuevoDescuento.cantidad, 
        requisitos: nuevoDescuento.requisitos})
    .then(res => {console.log('Nuevo Descuento Registrado!')})}
//CONSULTA PUT DE DESCUENTO
export const putdescuento = putDescuento => {
    axios.put('/api/descuentos',{nombre: putDescuento.nombre, cantidad: putDescuento.cantidad, 
        requisitos: putDescuento.requisitos})
    .then(res => {console.log('Descuento Modificado Registrado!')})}
//CONSULTA GET DE DESCUENTO
export const getDescuentos = () => {
    axios.get('/api/descuentos')
        .then(res=> {console.log(res)})
        .catch(function (error) {console.log(error);})}
// CONSULTAS DE PUBLICIDAD
//CONSULTA POST DE 
export const publicidad = nuevoPublicidad => {
    axios.post('/api/publicidad',{imagen_publicidad: nuevoPublicidad.imagen_publicidad, sucursal: nuevoPublicidad.sucursal})
    .then(res => {console.log('Nueva Informacion de Boleto Registrada!')})}
//CONSULTA PUT DE PUBLICIDAD
export const putpublicidad = putPublicidad => {
    axios.post('/api/publicidad',{imagen_publicidad: putPublicidad.imagen_publicidad, sucursal: putPublicidad.sucursal})
    .then(res => {console.log('Nueva Informacion de Boleto Registrada!')})}
//CONSULTA GET DE PUBLICIDAD
export const getPublicidad = () => {
    axios.get('/api/publicidad')
        .then(res=> {console.log(res)})
        .catch(function (error) {console.log(error);})}
//CONSULTAS DE RESERVACION
//CONSULTA POST DE RESERVACION
export const reservacion = nuevoReservacion => {
    axios.post('/api/reservaciones',{
        cliente: nuevoReservacion.cliente, fecha: nuevoReservacion.fecha,
        ruta: nuevoReservacion.ruta, anticipo: nuevoReservacion.anticipo,
        vendedor: nuevoReservacion.vendedor, total: nuevoReservacion.total})
    .then(res => {console.log('Nuevo Descuento Registrado!')})}
//CONSULT PUT DE RESERVACION
export const putreservacion = putReservacion => {
    axios.put('/api/reservaciones/:id',{
        cliente: putReservacion.cliente, fecha: putReservacion.fecha,
        ruta: putReservacion.ruta, anticipo: putReservacion.anticipo,
        vendedor: putReservacion.vendedor, total: putReservacion.total})
    .then(res => {console.log('Descuento Modificado Registrado!')})}
//CONSULTA GET DE RESERCACIONES
export const getreservaciones = () => {
    axios.get('/api/reservaciones')
        .then(res=> {console.log(res)})
        .catch(function (error) {console.log(error);})}
//CONSULTAS DE RUTA
//CONSULTA POST DE RUTA
export const ruta = nuevoRuta => {
    axios.post('/api/rutas',{
        costo: nuevoRuta.costo, salida: nuevoRuta.salida, destino: nuevoRuta.destino, camion: nuevoRuta.camion})
    .then(res => {console.log('Nueva Ruta Registrado!')})}
//CONSULTA PUT DE RUTA
export const putruta = putRuta => {
    axios.post('/api/rutas:id',{
        costo: putRuta.costo, salida: putRuta.salida, destino: putRuta.destino, camion: putRuta.camion})
    .then(res => {console.log('Ruta Modificada Registrado!')})}
//CONSULTA GET DE RUTAS
export const getRutas = () => {
    axios.get('/api/rutas')
        .then(res=> {console.log(res)})
        .catch(function (error) {console.log(error);})}
// CONSULTAS DE SUCURSAL
//CONSULTA POST DE SUCURSAL
export const sucursal = nuevoSucursal => {
    axios.post('/api/sucursales',{
        calle: nuevoSucursal.calle, numero: nuevoSucursal.numero,
        colonia: nuevoSucursal.colonia, ciudad: nuevoSucursal.ciudad,
        localidad: nuevoSucursal.localidad, estado: nuevoSucursal.estado,
        pais: nuevoSucursal.pais})
    .then(res => {console.log('Nueva Sucursal Registrado!')})}
//CONSULTA PUT DE SUCURSAL
export const putsucursal = putSucursal => {
    axios.put('/api/sucursales/:id',{
        calle: putSucursal.calle, numero: putSucursal.numero,
        colonia: putSucursal.colonia, ciudad: putSucursal.ciudad,
        localidad: putSucursal.localidad, estado: putSucursal.estado,
        pais: putSucursal.pais})
    .then(res => {console.log('Sucursal Modificada Registrado!')})}
//CONSULTA GET DE SUCURSALES
export const getSucursales = () => {
    axios.get('/api/sucursales')
        .then(res=> {console.log(res)})
        .catch(function (error) {console.log(error);})}
//CONSULTAS SUPERUSUARIO
//CONSULTA POST SUPERUSUARIO
export const superUsuario = nuevoSuper => {
    axios.post('/api/super',{
        Usuario: nuevoSuper.Usuario,
        contraseña: nuevoSuper.contraseña})
    .then(res => {console.log('Nuevo Super Registrado!')})}
//CONSULTA PUT SUPERUSUARIO
export const putUsuario = putSuper => {
    axios.put('/api/super/:id',{
        Usuario: putSuper.Usuario,
        contraseña: putSuper.contraseña})
    .then(res => {console.log('SuperUsuario Modificado Registrado!')})}
//CONSULTA GET DE SUPER USUARIOS
export const getSuperUsuarios = () => {
    axios.get('/api/super')
        .then(res=> {console.log(res)})
        .catch(function (error) {console.log(error);})}
//CONSULTAS DE VENDEDOR
//CONSULTA POST DE VENDEDOR    
export const vendedor = nuevoVendedor => {
    axios.post('/api/vendedores',{
        nombres: nuevoVendedor.nombres, apellido_1: nuevoVendedor.apellido_1,
        apellido_2: nuevoVendedor.apellido_2, usuario: nuevoVendedor.usuario,
        contraseña: nuevoVendedor.contraseña, comision: nuevoVendedor.comision,
        cortesias: nuevoVendedor.cortesias, sucursal: nuevoVendedor.sucursal})
    .then(res => {console.log('Nuevo Vendedor Registrado!')})}
//CONSULTA PUT DE VENDEDOR
export const putvendedor = putVendedor => {
    axios.put('/api/vendedores',{
        nombres: putVendedor.nombres, apellido_1: putVendedor.apellido_1,
        apellido_2: putVendedor.apellido_2, usuario: putVendedor.usuario,
        contraseña: putVendedor.contraseña, comision: putVendedor.comision,
        cortesias: putVendedor.cortesias, sucursal: putVendedor.sucursal})
    .then(res => {console.log('Vendedor Modificado Registrado!')})}
//CONSULTA GET DE VENDEDORES        
export const getVendedores = () => {
    axios.get('/api/vendedores')
        .then(res=> {console.log(res)})
        .catch(function (error) {console.log(error);})}