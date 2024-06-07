import React, { Component } from 'react';
import {Button, Card, CardTitle, Container, Col, Form, FormGroup, Input, Label, Modal, ModalHeader, ModalBody, ModalFooter, Row } from 'reactstrap';
import Select from 'react-select';

import GenerarBoleto from "./boletoPDF";

/* Componentes Externos */
/** Termina Componentes Externos **/

/** Variables **/
var generalData = {
    folio: null,
    costoBoleto: 0, //Precio en Dollar
    precioDollar: 0, 
    idioma: 'espanol',
    noAsientos: 0,
    asientosSelected: {
        selected1: false,
        selected2: false,
        selected3: false,
        selected4: false,
        selected5: false,
        selected6: false,
        selected7: false,
        selected8: false,
        selected9: false,
        selected10: false,
        selected11: false,
        selected12: false,
        selected13: false,
        selected14: false,
        selected15: false,
        selected16: false,
        selected17: false,
        selected18: false,
        selected19: false,
        selected20: false,
        selected21: false,
        selected22: false,
        selected23: false,
        selected24: false,
        selected25: false,
        selected26: false,
        selected27: false,
        selected28: false,
        selected29: false,
        selected30: false,
        selected31: false,
        selected32: false,
        selected33: false,
        selected34: false,
        selected35: false,
        selected36: false,
        selected37: false,
        selected38: false,
        selected39: false,
        selected40: false,
        selected41: false,
        selected42: false,
    },
    origen: {
        id: null,
        direccion: null,
        ciudad: null,
        estado: null,
        pais: null
    },
    destino: {
        id: null,
        direccion: null,
        ciudad: null,
        municipio: null,
        estado: null,
        pais: null
    },
    //fechahora: null,
    cliente: null,
    clienteTipo: null,
    nombreCliente: null,
    clienteTipo: null,
    razon: null,
    clienteRazon:null,
    cambio: 'US',
    //total: '100',
    descuento: {
        idDescuento: null,
        tipo: 'Ninguno',
        porc: 0
    },
    cobro: {
        subtotal: 0,
        descuento: 0,
        cortesia: 0,
        iva: 0,
        total: 0
    },
    detalles:{
        fechaAbierta: false,
        dia: null,
        hora: '04:15',
        anio: null,
        diaDelAnio:  null,
        idViaje: null,
        numeroEconomico: null,
        noAsiento: null,
        corrida: null,
        
    },
    vendedor:{
        id_Usuario: null,
        username: null,
        usernameV: null,
        nombre: null,
        apellidoPaterno: null,
        apellidoMaterno: null,
        sucursal: null,
        seguridad: null,
        tipoDescuento: null
    },
    sucursalVendedor: {
        nombre: null,
        direccion: null,
        tel: null,
        tel2: null,
        correo: null
    },
    noPasajeros: 0,
    descuentoNeto: 0,
    descuentoDlls: 0,
};

var imagenPublicidad = null;

var datosG = {
    cliente: null,
    tipo: null,
    razon: null,
    descuento: null,
    origen: null,
    destino: null,
    fecha: null,
    anio: null,
    diaDelAnio: null,
    horaSalida: null,
    numeroAsiento: null,
    activo: null,
    idVenta: null,
    tipoCambio: null,
    total: null,
    vendedor: null,
    folio: null,
    viajado: null,
    idVentasReasignacion: null,
    tipoReasignacion: null,
    sucursal: null,
    sucursalID: null,
    hora: null,
    tipoDeCambio: null,
    subtotal: null,
    direccionMatriz: null,
    telefonoMatriz: null,
    direccionMatrizEU: null,
    telefonoMatrizEU: null,
    telSucursal: null,
    correoSucursal: null,
    dirSucursal: null,
    frase: null,
    permiso: null,
    politicas: null,
    imagenPublicidad: null,
    noAsiento: null,
    idioma: 'espanol',
    reasignacion: null
};

export default class ReasignacionesPendientes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            ventas: [],
            idVentaEnlazado: null,
            optOrigen: [],
            optDestino: [],
            optCorridas: [],
            foliovendedor: "",
            folio: "",
            validationOrigen: true,
            validationDestino: true,
            hora: "",
            validationFechaHora: true,
            validationCorrida: true,
            checkOrigenDestino: true,
            activo: 1,
            origen: "",
            destino: "",
            fecha: "",
            asiento: "",
            btnSiguiente: "Siguiente",
            idReasignacion: "",
            valOrigen: "",
            valDestino: "",
            labelOrigen: "",
            labelDestino: "",
            //ASIENTOS
            comprobar: false,
            noAsiento: null,
            noAsientos: null,
            cont: 0,
            asiento1: null,
            asiento2: null,
            asiento3: null,
            asiento4: null,
            asiento5: null,
            asiento6: null,
            asiento7: null,
            asiento8: null,
            asiento9: null,
            asiento10: null,
            asiento11: null,
            asiento12: null,
            asiento13: null,
            asiento14: null,
            asiento15: null,
            asiento16: null,
            asiento17: null,
            asiento18: null,
            asiento19: null,
            asiento20: null,
            asiento21: null,
            asiento22: null,
            asiento23: null,
            asiento24: null,
            asiento25: null,
            asiento26: null,
            asiento27: null,
            asiento28: null,
            asiento29: null,
            asiento30: null,
            asiento31: null,
            asiento32: null,
            asiento33: null,
            asiento34: null,
            asiento35: null,
            asiento36: null,
            asiento37: null,
            asiento38: null,
            asiento39: null,
            asiento40: null,
            asiento41: null,
            asiento42: null,
            asiento43: null,
            asiento44: null,
            asiento45: null,
            asiento46: null,
            asiento47: null,
            asiento48: null,
            //FIN Asientos
            //IS SELECTED VARS
            selected1: false,
            selected2: false,
            selected3: false,
            selected4: false,
            selected5: false,
            selected6: false,
            selected7: false,
            selected8: false,
            selected9: false,
            selected10: false,
            selected11: false,
            selected12: false,
            selected13: false,
            selected14: false,
            selected15: false,
            selected16: false,
            selected17: false,
            selected18: false,
            selected19: false,
            selected20: false,
            selected21: false,
            selected22: false,
            selected23: false,
            selected24: false,
            selected25: false,
            selected26: false,
            selected27: false,
            selected28: false,
            selected29: false,
            selected30: false,
            selected31: false,
            selected32: false,
            selected33: false,
            selected34: false,
            selected35: false,
            selected36: false,
            selected37: false,
            selected38: false,
            selected39: false,
            selected40: false,
            selected41: false,
            selected42: false,
            selected43: false,
            selected44: false,
            selected45: false,
            selected46: false,
            selected47: false,
            selected48: false,
            //GENERO VALUE
            genero1: false,
            genero2: false,
            genero3: false,
            genero4: false,
            genero5: false,
            genero6: false,
            genero7: false,
            genero8: false,
            genero9: false,
            genero10: false,
            genero11: false,
            genero12: false,
            genero13: false,
            genero14: false,
            genero15: false,
            genero16: false,
            genero17: false,
            genero18: false,
            genero19: false,
            genero20: false,
            genero21: false,
            genero22: false,
            genero23: false,
            genero24: false,
            genero25: false,
            genero26: false,
            genero27: false,
            genero28: false,
            genero29: false,
            genero30: false,
            genero31: false,
            genero32: false,
            genero33: false,
            genero34: false,
            genero35: false,
            genero36: false,
            genero37: false,
            genero38: false,
            genero39: false,
            genero40: false,
            genero41: false,
            genero42: false,
            genero43: false,
            genero44: false,
            genero45: false,
            genero46: false,
            genero47: false,
            genero48: false,
        };

        this.buquedaFolio = this.buquedaFolio.bind(this);
        this.limpiarFolio = this.limpiarFolio.bind(this);
        this.buquedaNombre = this.buquedaNombre.bind(this);
        this.limpiarNombres = this.limpiarNombres.bind(this);
        this.toogleReasignarVenta = this.toogleReasignarVenta.bind(this);
        this.toggle = this.toggle.bind(this);
        this.handleSetOptionsOrigen = this.handleSetOptionsOrigen.bind(this);
        this.handleSetOptionsDestino = this.handleSetOptionsDestino.bind(this);
        this.handleChangeOrigen = this.handleChangeOrigen.bind(this);
        this.handleChangeDestino = this.handleChangeDestino.bind(this);
        this.handleChangeFechaHora = this.handleChangeFechaHora.bind(this);
        this.handleChangeOrigenDestino = this.handleChangeOrigenDestino.bind(this);
        this.handleChangeCorrida = this.handleChangeCorrida.bind(this);
        this.validarSiguiente = this.validarSiguiente.bind(this);
        this.getDiaDelAnio = this.getDiaDelAnio.bind(this);
        this.handleSelectAsiento = this.handleSelectAsiento.bind(this);
        this.fetchApartados = this.fetchApartados.bind(this);
        this.fetchConfBoleto = this.fetchConfBoleto.bind(this);
        this.fetchImagenBoleto = this.fetchImagenBoleto.bind(this);
    }

    componentDidMount(){
        this.handleSetOptionsOrigen();
        this.fetchReasignacionesDidMount();
        this.fetchConfBoleto();
        this.fetchImagenBoleto();
    }

    fetchConfBoleto(){
        fetch(`/api/ConfiguracionBoleto`)
        .then(res => res.json())
        .then(data => {
            datosG.frase = data[0].frase;
            datosG.permiso = data[0].informacionPermiso;
            datosG.politicas = data[0].politicas;
        })
    }

    fetchImagenBoleto(){
        fetch(`/api/ImagenesBoletos/Boleto`)
        .then(res => res.json())
        .then(data => {
            imagenPublicidad = data[0].imagen
        })
    }

    fetchReasignacionesDidMount(){
        fetch(`/api/Reasignaciones/false/reasignado`)
        .then(res => res.json())
        .then(data => {
            if(data.length == 0){
                this.setState({
                    ventas: []
                })
            }else{
                this.setState({
                    ventas: data
                })
            }
        })
    }

    validarSiguiente(){
        if(this.state.activo == 1){
            //Validamos que estén listos todos los datos antes de avanzar
            if(generalData.origen.id == null){
                this.setState({
                  validationOrigen: false
                })
            }
    
            if(generalData.destino.id == null){
                this.setState({
                  validationDestino: false
                })
            }
    
            if(generalData.detalles.idViaje == null){
                this.setState({
                    validationCorrida: false
                })
            }
    
    
            if(generalData.origen.id == null || generalData.destino.id == null || generalData.detalles.dia == null || generalData.detalles.idViaje == null || !this.state.validationFechaHora){
                alert('Llena correctamente los datos solicitados');
            }else{
                ///AQUI LLENAMOS LOS ASIENTOS DISPONIBLES
                this.fetchAsientos();
                this.fetchApartados();
                this.setState({
                    activo: 2
                });
                let elemento =  document.getElementById("stepOne");
                elemento.className = "noactivo";
                elemento = document.getElementById("stepTwo");
                elemento.className = "activo";
            }
            
        }else if(this.state.activo == 2){
            this.setState({
                activo: 3,
                btnSiguiente: "Guardar"
            });
            let elemento =  document.getElementById("stepTwo");
            elemento.className = "noactivo";
            elemento =  document.getElementById("stepThree");
            elemento.className = "activo";
        }else if(this.state.activo == 3){ //AQUI VOY
            //AQUI GENERAMOS EL BOLETO
            //Obtenemos los datos que faltan y guardamos el boleto
            console.log('GeneramosBoleto');
            let arrAsignacion = this.state.idReasignacion;
            datosG.cliente = generalData.cliente;
            datosG.tipo = generalData.clienteTipo;
            datosG.razon = generalData.clienteRazon;
            datosG.descuento = generalData.cobro.descuento;
            datosG.origen = generalData.origen.id;
            datosG.destino = generalData.destino.id;
            datosG.fecha = generalData.detalles.dia;
            datosG.anio = generalData.detalles.anio;
            datosG.diaDelAnio = generalData.detalles.diaDelAnio;
            datosG.horaSalida = generalData.detalles.hora;
            datosG.numeroAsiento = this.state.asiento;
            datosG.activo = true;
            datosG.idVenta = generalData.detalles.idViaje;
            datosG.tipoCambio = generalData.cambio;
            datosG.total = generalData.cobro.total;
            datosG.vendedor = generalData.vendedor.id_Usuario;
            datosG.folio = this.state.foliovendedor;
            datosG.viajado = false;
            datosG.idVentasReasignacion = this.state.idVentaEnlazado;
            datosG.tipoReasignacion = 'Venta';
            datosG.sucursal = generalData.vendedor.sucursal;
            datosG.hora = generalData.detalles.hora;
            datosG.tipoCambio = generalData.cambio;

            let flag = true;

            console.log('datosG', datosG);
            console.log(`/api/Reasignaciones/${arrAsignacion[0]}/GuardarBoleto`);
            fetch(`/api/Reasignaciones/${arrAsignacion[0]}/GuardarBoleto`, {
                method: 'PUT',
                body: JSON.stringify({datosG}),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(data => {
                console.log('data', data);
                if(data.resp){
                    //SACAMOS LOS DATOS QUE FALTAN PARA IMPRIMIR
                    datosG.vendedor = generalData.vendedor.nombre;
                    datosG.cliente = generalData.nombreCliente;
                    datosG.origen = `${this.state.labelOrigen} ${generalData.origen.direccion}`;
                    datosG.destino = `${this.state.labelDestino} ${generalData.destino.direccion}`;
                    datosG.tipoDeCambio = generalData.cambio;
                    datosG.subtotal = parseInt(datosG.total)+parseInt(datosG.descuento);
                    datosG.folio = this.state.folio;
                    datosG.sucursal = data.resp.sucursal;
                    datosG.direccionMatriz = data.resp.direccionMatriz;
                    datosG.telefonoMatriz = data.resp.telefonoMatriz;
                    datosG.direccionMatrizEU = data.resp.direccionMatrizEU;
                    datosG.telefonoMatrizEU = data.resp.telefonoMatrizEU;
                    datosG.telSucursal = data.resp.telSucursal;
                    datosG.correoSucursal = data.resp.correoSucursal;
                    datosG.dirSucursal = data.resp.dirSucursal;
                    datosG.noAsiento = this.state.asiento;
                    datosG.imagenPublicidad = imagenPublicidad;
                    datosG.reasignacion = `${this.state.folio} - Reasignación`;
                    //IMPRIMIMOS EL BOLETO
                    alert('Se ha reasignado el viaje');
                }else{
                    flag = false;
                    alert('Ha ocurrido un error, por favor intenta más tarde');
                }
            })
            .then(() => {
                if(flag){
                    GenerarBoleto(datosG);
                    this.fetchReasignacionesDidMount();
                }                
            });
            this.setState(prevState => ({
                modal: !prevState.modal
            }));
        }

    }

    handleSelectAsiento(e){
        let id = e.target.id || e.target.name;
        //Primero verificamos que anteriormente no haya algun asiento ya seleccionado
        //En caso de que ya este seleccionado alguno, procedemos a regresar a su estado original

        generalData.detalles.noAsiento = id;
        console.log(id);
        let idVendedor = generalData.vendedor.id_Usuario;
        let idViaje = generalData.detalles.idViaje;
        let fecha = new Date();
        let dia = fecha.getDate();
        let mes = fecha.getMonth();
        let anio = fecha.getFullYear();
        let fechaCreacion = `${dia}-${mes}-${anio}`;
        let asiento = "";
        switch (id) {
            case '1':
                if(!this.state.selected1){//No está seleccionado el asiento
                    asiento = "1";
                    fetch(`/api/AsignarViajes/${idViaje}/1/${idVendedor}/Hola`, {
                        method: 'PUT',
                        body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    }).then(res => res.json())
                    .then(data => {
                        console.log(data.update);
                        let promiseData = data;
                        if(promiseData.update != null){
                            this.setState({
                                selected1: true,
                                asiento: '1'
                            });
                            generalData.asientosSelected.selected1 = true;
                        }else{
                            alert('El asiento está ocupado');
                            this.setState({
                                selected1: false
                            });
                            generalData.asientosSelected.selected1 = false;
                        }
                    }).catch(err => console.log(err));
                }else{
                    fetch(`/api/AsignarViajes/${idViaje}/false/1/${idVendedor}/hola`, {
                        method: 'PUT',
                        //body: JSON.stringify(this.state),
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    }).then(res => {
                        console.log(res.json());
                        this.setState({
                            selected1: false
                        });
                        generalData.asientosSelected.selected1 = false;
                    });                    
                }                
                break;

            case '2':
                if(!this.state.selected2){//No está seleccionado el asiento
                    asiento = "2";
                    fetch(`/api/AsignarViajes/${idViaje}/2/${idVendedor}/Hola`, {
                        method: 'PUT',
                        body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    }).then(res => res.json())
                    .then(data => {
                        console.log(data.update);
                        let promiseData = data;
                        if(promiseData.update != null){
                            this.setState({
                                selected2: true,
                                asiento: '2'
                            });
                            generalData.asientosSelected.selected2 = true;
                        }else{
                            alert('El asiento está ocupado');
                            this.setState({
                                selected2: false
                            });
                            generalData.asientosSelected.selected2 = false;
                        }
                    }).catch(err => console.log(err));
                }else{
                    fetch(`/api/AsignarViajes/${idViaje}/false/2/${idVendedor}/hola`, {
                        method: 'PUT',
                        //body: JSON.stringify(this.state),
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    }).then(res => {
                        console.log(res.json());
                        this.setState({
                            selected2: false
                        });
                        generalData.asientosSelected.selected2 = false;
                    });                    
                }              
                break;

                case '3':
                    if(!this.state.selected3){//No está seleccionado el asiento
                        asiento = "3";
                        fetch(`/api/AsignarViajes/${idViaje}/3/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected3: true,
                                    asiento: '3'
                                });
                                generalData.asientosSelected.selected3 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected3: false
                                });
                                generalData.asientosSelected.selected3 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/3/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected3: false
                            });
                            generalData.asientosSelected.selected3 = false;
                        });                    
                    }                
                    break;

                case '4':
                    if(!this.state.selected4){//No está seleccionado el asiento
                        asiento = "4";
                        fetch(`/api/AsignarViajes/${idViaje}/4/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected4: true,
                                    asiento: '4'
                                });
                                generalData.asientosSelected.selected4 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected4: false
                                });
                                generalData.asientosSelected.selected4 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/4/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected4: false
                            });
                            generalData.asientosSelected.selected4 = false;
                        });                    
                    } 
                    break;

                case '5':
                    if(!this.state.selected5){//No está seleccionado el asiento
                        asiento = "5";
                        fetch(`/api/AsignarViajes/${idViaje}/5/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected5: true,
                                    asiento: '5'
                                });
                                generalData.asientosSelected.selected5 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected5: false
                                });
                                generalData.asientosSelected.selected5 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/5/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected5: false
                            });
                            generalData.asientosSelected.selected5 = false;
                        });                    
                    } 
                    break;
                case '6':
                    if(!this.state.selected6){//No está seleccionado el asiento
                        asiento = "6";
                        fetch(`/api/AsignarViajes/${idViaje}/6/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected6: true,
                                    asiento: '6'
                                });
                                generalData.asientosSelected.selected6 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected6: false
                                });
                                generalData.asientosSelected.selected6 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/6/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected6: false
                            });
                            generalData.asientosSelected.selected6 = false;
                        });                    
                    } 
                    break;
                case '7':
                    if(!this.state.selected7){//No está seleccionado el asiento
                        asiento = "7";
                        fetch(`/api/AsignarViajes/${idViaje}/7/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected7: true,
                                    asiento: '7'
                                });
                                generalData.asientosSelected.selected7 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected7: false
                                });
                                generalData.asientosSelected.selected7 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/7/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected7: false
                            });
                            generalData.asientosSelected.selected7 = false;
                        });                    
                    } 
                    break;
                case '8':
                    if(!this.state.selected8){//No está seleccionado el asiento
                        asiento = "8";
                        fetch(`/api/AsignarViajes/${idViaje}/8/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected8: true,
                                    asiento: '8'
                                });
                                generalData.asientosSelected.selected8 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected8: false
                                });
                                generalData.asientosSelected.selected8 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/8/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected8: false
                            });
                            generalData.asientosSelected.selected8 = false;
                        });                    
                    } 
                    break;
                case '9':
                    if(!this.state.selected9){//No está seleccionado el asiento
                        asiento = "9";
                        fetch(`/api/AsignarViajes/${idViaje}/9/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected9: true,
                                    asiento: '9'
                                });
                                generalData.asientosSelected.selected9 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected9: false
                                });
                                generalData.asientosSelected.selected9 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/9/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected9: false
                            });
                            generalData.asientosSelected.selected9 = false;
                        });                    
                    } 
                    break;
                case '10':
                    if(!this.state.selected10){//No está seleccionado el asiento
                        asiento = "10";
                        fetch(`/api/AsignarViajes/${idViaje}/10/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected10: true,
                                    asiento: '10'
                                });
                                generalData.asientosSelected.selected10 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected10: false
                                });
                                generalData.asientosSelected.selected10 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/10/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected10: false
                            });
                            generalData.asientosSelected.selected10 = false;
                        });                    
                    } 
                    break;
                case '11':
                    if(!this.state.selected11){//No está seleccionado el asiento
                        asiento = "11";
                        fetch(`/api/AsignarViajes/${idViaje}/11/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected11: true,
                                    asiento: '11'
                                });
                                generalData.asientosSelected.selected11 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected11: false
                                });
                                generalData.asientosSelected.selected11 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/11/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected11: false
                            });
                            generalData.asientosSelected.selected11 = false;
                        });                    
                    } 
                    break;
                case '12':
                    if(!this.state.selected12){//No está seleccionado el asiento
                        asiento = "12";
                        fetch(`/api/AsignarViajes/${idViaje}/12/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected12: true,
                                    asiento: '12'
                                });
                                generalData.asientosSelected.selected12 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected12: false
                                });
                                generalData.asientosSelected.selected12 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/12/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected12: false
                            });
                            generalData.asientosSelected.selected12 = false;
                        });                    
                    } 
                    break;
                case '13':
                    if(!this.state.selected13){//No está seleccionado el asiento
                        asiento = "13";
                        fetch(`/api/AsignarViajes/${idViaje}/13/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected13: true,
                                    asiento: '13'
                                });
                                generalData.asientosSelected.selected13 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected13: false
                                });
                                generalData.asientosSelected.selected13 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/13/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected13: false
                            });
                            generalData.asientosSelected.selected13 = false;
                        });                    
                    } 
                    break;
                case '14':
                    if(!this.state.selected14){//No está seleccionado el asiento
                        asiento = "14";
                        fetch(`/api/AsignarViajes/${idViaje}/14/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected14: true,
                                    asiento: '14'
                                });
                                generalData.asientosSelected.selected14 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected14: false
                                });
                                generalData.asientosSelected.selected14 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/14/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected14: false
                            });
                            generalData.asientosSelected.selected14 = false;
                        });                    
                    } 
                    break;
                case '15':
                    if(!this.state.selected15){//No está seleccionado el asiento
                        asiento = "15";
                        fetch(`/api/AsignarViajes/${idViaje}/15/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected15: true,
                                    asiento: '15'
                                });
                                generalData.asientosSelected.selected15 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected15: false
                                });
                                generalData.asientosSelected.selected15 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/15/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected15: false
                            });
                            generalData.asientosSelected.selected15 = false;
                        });                    
                    } 
                    break;
                case '16':
                    if(!this.state.selected16){//No está seleccionado el asiento
                        asiento = "16";
                        fetch(`/api/AsignarViajes/${idViaje}/16/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected16: true,
                                    asiento: '16'
                                });
                                generalData.asientosSelected.selected16 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected16: false
                                });
                                generalData.asientosSelected.selected16 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/16/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected16: false
                            });
                            generalData.asientosSelected.selected16 = false;
                        });                    
                    } 
                    break;
                case '17':
                    if(!this.state.selected17){//No está seleccionado el asiento
                        asiento = "17";
                        fetch(`/api/AsignarViajes/${idViaje}/17/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected17: true,
                                    asiento: '17'
                                });
                                generalData.asientosSelected.selected17 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected17: false
                                });
                                generalData.asientosSelected.selected17 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/17/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected17: false
                            });
                            generalData.asientosSelected.selected17 = false;
                        });                    
                    } 
                    break;
                case '18':
                    if(!this.state.selected18){//No está seleccionado el asiento
                        asiento = "18";
                        fetch(`/api/AsignarViajes/${idViaje}/18/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected18: true,
                                    asiento: '18'
                                });
                                generalData.asientosSelected.selected18 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected18: false
                                });
                                generalData.asientosSelected.selected18 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/18/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected18: false
                            });
                            generalData.asientosSelected.selected18 = false;
                        });                    
                    } 
                    break;
                case '19':
                    if(!this.state.selected19){//No está seleccionado el asiento
                        asiento = "19";
                        fetch(`/api/AsignarViajes/${idViaje}/19/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected19: true,
                                    asiento: '19'
                                });
                                generalData.asientosSelected.selected19 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected19: false
                                });
                                generalData.asientosSelected.selected19 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/19/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected19: false
                            });
                            generalData.asientosSelected.selected19 = false;
                        });                    
                    } 
                    break;
                case '20':
                    if(!this.state.selected20){//No está seleccionado el asiento
                        asiento = "20";
                        fetch(`/api/AsignarViajes/${idViaje}/20/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected20: true,
                                    asiento: '20'
                                });
                                generalData.asientosSelected.selected20 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected20: false
                                });
                                generalData.asientosSelected.selected20 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/20/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected20: false
                            });
                            generalData.asientosSelected.selected20 = false;
                        });                    
                    } 
                    break;
                case '21':
                    if(!this.state.selected21){//No está seleccionado el asiento
                        asiento = "21";
                        fetch(`/api/AsignarViajes/${idViaje}/21/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected21: true,
                                    asiento: '21'
                                });
                                generalData.asientosSelected.selected21 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected21: false
                                });
                                generalData.asientosSelected.selected21 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/21/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected21: false
                            });
                            generalData.asientosSelected.selected21 = false;
                        });                    
                    } 
                    break;
                case '22':
                    if(!this.state.selected22){//No está seleccionado el asiento
                        asiento = "22";
                        fetch(`/api/AsignarViajes/${idViaje}/22/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected22: true,
                                    asiento: '22'
                                });
                                generalData.asientosSelected.selected22 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected22: false
                                });
                                generalData.asientosSelected.selected22 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/22/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected22: false
                            });
                            generalData.asientosSelected.selected22 = false;
                        });                    
                    } 
                    break;
                case '23':
                    if(!this.state.selected23){//No está seleccionado el asiento
                        asiento = "23";
                        fetch(`/api/AsignarViajes/${idViaje}/23/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected23: true,
                                    asiento: '23'
                                });
                                generalData.asientosSelected.selected23 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected23: false
                                });
                                generalData.asientosSelected.selected23 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/23/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected23: false
                            });
                            generalData.asientosSelected.selected23 = false;
                        });                    
                    } 
                    break;
                case '24':
                    if(!this.state.selected24){//No está seleccionado el asiento
                        asiento = "24";
                        fetch(`/api/AsignarViajes/${idViaje}/24/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected24: true,
                                    asiento: '24'
                                });
                                generalData.asientosSelected.selected24 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected24: false
                                });
                                generalData.asientosSelected.selected24 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/24/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected24: false
                            });
                            generalData.asientosSelected.selected24 = false;
                        });                    
                    } 
                    break;
                case '25':
                    if(!this.state.selected25){//No está seleccionado el asiento
                        asiento = "25";
                        fetch(`/api/AsignarViajes/${idViaje}/25/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected25: true,
                                    asiento: '25'
                                });
                                generalData.asientosSelected.selected25 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected25: false
                                });
                                generalData.asientosSelected.selected25 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/25/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected25: false
                            });
                            generalData.asientosSelected.selected25 = false;
                        });                    
                    } 
                    break;
                case '26':
                    if(!this.state.selected26){//No está seleccionado el asiento
                        asiento = "26";
                        fetch(`/api/AsignarViajes/${idViaje}/26/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected26: true,
                                    asiento: '26'
                                });
                                generalData.asientosSelected.selected26 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected26: false
                                });
                                generalData.asientosSelected.selected26 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/26/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected26: false
                            });
                            generalData.asientosSelected.selected26 = false;
                        });                    
                    } 
                    break;
                case '27':
                    if(!this.state.selected27){//No está seleccionado el asiento
                        asiento = "27";
                        fetch(`/api/AsignarViajes/${idViaje}/27/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected27: true,
                                    asiento: '27'
                                });
                                generalData.asientosSelected.selected27 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected27: false
                                });
                                generalData.asientosSelected.selected27 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/27/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected27: false
                            });
                            generalData.asientosSelected.selected27 = false;
                        });                    
                    } 
                    break;
                case '28':
                    if(!this.state.selected28){//No está seleccionado el asiento
                        asiento = "28";
                        fetch(`/api/AsignarViajes/${idViaje}/28/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected28: true,
                                    asiento: '28'
                                });
                                generalData.asientosSelected.selected28 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected28: false
                                });
                                generalData.asientosSelected.selected28 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/28/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected28: false
                            });
                            generalData.asientosSelected.selected28 = false;
                        });                    
                    } 
                    break;
                case '29':
                    if(!this.state.selected29){//No está seleccionado el asiento
                        asiento = "29";
                        fetch(`/api/AsignarViajes/${idViaje}/29/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected29: true,
                                    asiento: '29'
                                });
                                generalData.asientosSelected.selected29 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected29: false
                                });
                                generalData.asientosSelected.selected29 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/29/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected29: false
                            });
                            generalData.asientosSelected.selected29 = false;
                        });                    
                    } 
                    break;
                case '30':
                    if(!this.state.selected30){//No está seleccionado el asiento
                        asiento = "30";
                        fetch(`/api/AsignarViajes/${idViaje}/30/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected30: true,
                                    asiento: '30'
                                });
                                generalData.asientosSelected.selected30 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected30: false
                                });
                                generalData.asientosSelected.selected30 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/30/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected30: false
                            });
                            generalData.asientosSelected.selected30 = false;
                        });                    
                    } 
                    break;
                case '31':
                    if(!this.state.selected31){//No está seleccionado el asiento
                        asiento = "31";
                        fetch(`/api/AsignarViajes/${idViaje}/31/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected31: true,
                                    asiento: '31'
                                });
                                generalData.asientosSelected.selected31 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected31: false
                                });
                                generalData.asientosSelected.selected31 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/31/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected31: false
                            });
                            generalData.asientosSelected.selected31 = false;
                        });                    
                    } 
                    break;
                case '32':
                    if(!this.state.selected32){//No está seleccionado el asiento
                        asiento = "32";
                        fetch(`/api/AsignarViajes/${idViaje}/32/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected32: true,
                                    asiento: '32'
                                });
                                generalData.asientosSelected.selected32 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected32: false
                                });
                                generalData.asientosSelected.selected32 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/32/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected32: false
                            });
                            generalData.asientosSelected.selected32 = false;
                        });                    
                    } 
                    break;
                case '33':
                    if(!this.state.selected33){//No está seleccionado el asiento
                        asiento = "33";
                        fetch(`/api/AsignarViajes/${idViaje}/33/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected33: true,
                                    asiento: '33'
                                });
                                generalData.asientosSelected.selected33 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected33: false
                                });
                                generalData.asientosSelected.selected33 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/33/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected33: false
                            });
                            generalData.asientosSelected.selected33 = false;
                        });                    
                    } 
                    break;
                case '34':
                    if(!this.state.selected34){//No está seleccionado el asiento
                        asiento = "34";
                        fetch(`/api/AsignarViajes/${idViaje}/34/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected34: true,
                                    asiento: '34'
                                });
                                generalData.asientosSelected.selected34 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected34: false
                                });
                                generalData.asientosSelected.selected34 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/34/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected34: false
                            });
                            generalData.asientosSelected.selected34 = false;
                        });                    
                    } 
                    break;
                case '35':
                    if(!this.state.selected35){//No está seleccionado el asiento
                        asiento = "35";
                        fetch(`/api/AsignarViajes/${idViaje}/35/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected35: true,
                                    asiento: '35'
                                });
                                generalData.asientosSelected.selected35 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected35: false
                                });
                                generalData.asientosSelected.selected35 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/35/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected35: false
                            });
                            generalData.asientosSelected.selected35 = false;
                        });                    
                    } 
                    break;
                case '36':
                    if(!this.state.selected36){//No está seleccionado el asiento
                        asiento = "36";
                        fetch(`/api/AsignarViajes/${idViaje}/36/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected36: true,
                                    asiento: '36'
                                });
                                generalData.asientosSelected.selected36 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected36: false
                                });
                                generalData.asientosSelected.selected36 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/36/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected36: false
                            });
                            generalData.asientosSelected.selected36 = false;
                        });                    
                    } 
                    break;
                case '37':
                    if(!this.state.selected37){//No está seleccionado el asiento
                        asiento = "37";
                        fetch(`/api/AsignarViajes/${idViaje}/37/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected37: true,
                                    asiento: '37'
                                });
                                generalData.asientosSelected.selected37 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected37: false
                                });
                                generalData.asientosSelected.selected37 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/37/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected37: false
                            });
                            generalData.asientosSelected.selected37 = false;
                        });                    
                    } 
                    break;
                case '38':
                    if(!this.state.selected38){//No está seleccionado el asiento
                        asiento = "38";
                        fetch(`/api/AsignarViajes/${idViaje}/38/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected38: true,
                                    asiento: '38'
                                });
                                generalData.asientosSelected.selected38 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected38: false
                                });
                                generalData.asientosSelected.selected38 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/38/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected38: false
                            });
                            generalData.asientosSelected.selected38 = false;
                        });                    
                    } 
                    break;
                case '39':
                    if(!this.state.selected39){//No está seleccionado el asiento
                        asiento = "39";
                        fetch(`/api/AsignarViajes/${idViaje}/39/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected39: true,
                                    asiento: '39'
                                });
                                generalData.asientosSelected.selected39 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected39: false
                                });
                                generalData.asientosSelected.selected39 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/39/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected39: false
                            });
                            generalData.asientosSelected.selected39 = false;
                        });                    
                    } 
                    break;
                case '40':
                    if(!this.state.selected40){//No está seleccionado el asiento
                        asiento = "40";
                        fetch(`/api/AsignarViajes/${idViaje}/40/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected40: true,
                                    asiento: '40'
                                });
                                generalData.asientosSelected.selected40 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected40: false
                                });
                                generalData.asientosSelected.selected40 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/40/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected40: false
                            });
                            generalData.asientosSelected.selected40 = false;
                        });                    
                    } 
                    break;
                case '41':
                    if(!this.state.selected41){//No está seleccionado el asiento
                        asiento = "41";
                        fetch(`/api/AsignarViajes/${idViaje}/41/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected41: true,
                                    asiento: '41'
                                });
                                generalData.asientosSelected.selected41 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected41: false
                                });
                                generalData.asientosSelected.selected41 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/41/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected41: false
                            });
                            generalData.asientosSelected.selected41 = false;
                        });                    
                    } 
                    break;
                case '42':
                    if(!this.state.selected42){//No está seleccionado el asiento
                        asiento = "42";
                        fetch(`/api/AsignarViajes/${idViaje}/42/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected42: true,
                                    asiento: '42'
                                });
                                generalData.asientosSelected.selected42 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected42: false
                                });
                                generalData.asientosSelected.selected42 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/42/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected42: false
                            });
                            generalData.asientosSelected.selected42 = false;
                        });                    
                    } 
                    break;
                case '43':
                    if(!this.state.selected43){//No está seleccionado el asiento
                        asiento = "43";
                        fetch(`/api/AsignarViajes/${idViaje}/43/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected43: true,
                                    asiento: '43'
                                });
                                generalData.asientosSelected.selected43 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected43: false
                                });
                                generalData.asientosSelected.selected43 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/43/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected43: false
                            });
                            generalData.asientosSelected.selected43 = false;
                        });                    
                    } 
                    break;
                case '44':
                    if(!this.state.selected44){//No está seleccionado el asiento
                        asiento = "44";
                        fetch(`/api/AsignarViajes/${idViaje}/44/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected44: true,
                                    asiento: '44'
                                });
                                generalData.asientosSelected.selected44 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected44: false
                                });
                                generalData.asientosSelected.selected44 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/44/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected44: false
                            });
                            generalData.asientosSelected.selected44 = false;
                        });                    
                    } 
                    break;
                case '45':
                    if(!this.state.selected45){//No está seleccionado el asiento
                        asiento = "45";
                        fetch(`/api/AsignarViajes/${idViaje}/45/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected45: true,
                                    asiento: '45'
                                });
                                generalData.asientosSelected.selected45 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected45: false
                                });
                                generalData.asientosSelected.selected45 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/45/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected45: false
                            });
                            generalData.asientosSelected.selected45 = false;
                        });                    
                    } 
                    break;
                case '46':
                    if(!this.state.selected46){//No está seleccionado el asiento
                        asiento = "46";
                        fetch(`/api/AsignarViajes/${idViaje}/46/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected46: true,
                                    asiento: '46'
                                });
                                generalData.asientosSelected.selected46 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected46: false
                                });
                                generalData.asientosSelected.selected46 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/46/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected46: false
                            });
                            generalData.asientosSelected.selected46 = false;
                        });                    
                    } 
                    break;
                case '47':
                    if(!this.state.selected47){//No está seleccionado el asiento
                        asiento = "47";
                        fetch(`/api/AsignarViajes/${idViaje}/47/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected47: true,
                                    asiento: '47'
                                });
                                generalData.asientosSelected.selected47 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected47: false
                                });
                                generalData.asientosSelected.selected47 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/47/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected47: false
                            });
                            generalData.asientosSelected.selected47 = false;
                        });                    
                    } 
                    break;
                case '48':
                    if(!this.state.selected48){//No está seleccionado el asiento
                        asiento = "48";
                        fetch(`/api/AsignarViajes/${idViaje}/48/${idVendedor}/Hola`, {
                            method: 'PUT',
                            body: JSON.stringify({idVendedor, idViaje, asiento, fechaCreacion}),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data.update);
                            let promiseData = data;
                            if(promiseData.update != null){
                                this.setState({
                                    selected48: true,
                                    asiento: '48'
                                });
                                generalData.asientosSelected.selected48 = true;
                            }else{
                                alert('El asiento está ocupado');
                                this.setState({
                                    selected48: false
                                });
                                generalData.asientosSelected.selected48 = false;
                            }
                        }).catch(err => console.log(err));
                    }else{
                        fetch(`/api/AsignarViajes/${idViaje}/false/48/${idVendedor}/hola`, {
                            method: 'PUT',
                            //body: JSON.stringify(this.state),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            console.log(res.json());
                            this.setState({
                                selected48: false
                            });
                            generalData.asientosSelected.selected48 = false;
                        });                    
                    } 
                    break;
        
            default:
                break;
        }
        
    }

    fetchAsientos(){
        fetch(`/api/AsignarViajes/${generalData.detalles.idViaje}/asientosVenta`)
          .then(res => res.json())
          .then(data => {
            this.setState({
              noAsientos: data.capacidad,
              //ASIENTOS//////////////////////////////
              asiento1: data.asientos.asiento_1.status,
              asiento2: data.asientos.asiento_2.status,
              asiento3: data.asientos.asiento_3.status,
              asiento4: data.asientos.asiento_4.status,
              asiento5: data.asientos.asiento_5.status,
              asiento6: data.asientos.asiento_6.status,
              asiento7: data.asientos.asiento_7.status,
              asiento8: data.asientos.asiento_8.status,
              asiento9: data.asientos.asiento_9.status,
              asiento10: data.asientos.asiento_10.status,
              asiento11: data.asientos.asiento_11.status,
              asiento12: data.asientos.asiento_12.status,
              asiento13: data.asientos.asiento_13.status,
              asiento14: data.asientos.asiento_14.status,
              asiento15: data.asientos.asiento_15.status,
              asiento16: data.asientos.asiento_16.status,
              asiento17: data.asientos.asiento_17.status,
              asiento18: data.asientos.asiento_18.status,
              asiento19: data.asientos.asiento_19.status,
              asiento20: data.asientos.asiento_20.status,
              asiento21: data.asientos.asiento_21.status,
              asiento22: data.asientos.asiento_22.status,
              asiento23: data.asientos.asiento_23.status,
              asiento24: data.asientos.asiento_24.status,
              asiento25: data.asientos.asiento_25.status,
              asiento26: data.asientos.asiento_26.status,
              asiento27: data.asientos.asiento_27.status,
              asiento28: data.asientos.asiento_28.status,
              asiento29: data.asientos.asiento_29.status,
              asiento30: data.asientos.asiento_30.status,
              asiento31: data.asientos.asiento_31.status,
              asiento32: data.asientos.asiento_32.status,
              asiento33: data.asientos.asiento_33.status,
              asiento34: data.asientos.asiento_34.status,
              asiento35: data.asientos.asiento_35.status,
              asiento36: data.asientos.asiento_36.status,
              asiento37: data.asientos.asiento_37.status,
              asiento38: data.asientos.asiento_38.status,
              asiento39: data.asientos.asiento_39.status,
              asiento40: data.asientos.asiento_40.status,
              asiento41: data.asientos.asiento_41.status,
              asiento42: data.asientos.asiento_42.status,
              asiento43: data.asientos.asiento_43.status,
              asiento44: data.asientos.asiento_44.status,
              asiento45: data.asientos.asiento_45.status,
              asiento46: data.asientos.asiento_46.status,
              asiento47: data.asientos.asiento_47.status,
              asiento48: data.asientos.asiento_48.status,
              //GENERO/////////////////////////////////
              genero1: data.asientos.asiento_1.genero,
              genero2: data.asientos.asiento_2.genero,
              genero3: data.asientos.asiento_3.genero,
              genero4: data.asientos.asiento_4.genero,
              genero5: data.asientos.asiento_5.genero,
              genero6: data.asientos.asiento_6.genero,
              genero7: data.asientos.asiento_7.genero,
              genero8: data.asientos.asiento_8.genero,
              genero9: data.asientos.asiento_9.genero,
              genero10: data.asientos.asiento_10.genero,
              genero11: data.asientos.asiento_11.genero,
              genero12: data.asientos.asiento_12.genero,
              genero13: data.asientos.asiento_13.genero,
              genero14: data.asientos.asiento_14.genero,
              genero15: data.asientos.asiento_15.genero,
              genero16: data.asientos.asiento_16.genero,
              genero17: data.asientos.asiento_17.genero,
              genero18: data.asientos.asiento_18.genero,
              genero19: data.asientos.asiento_19.genero,
              genero20: data.asientos.asiento_20.genero,
              genero21: data.asientos.asiento_21.genero,
              genero22: data.asientos.asiento_22.genero,
              genero23: data.asientos.asiento_23.genero,
              genero24: data.asientos.asiento_24.genero,
              genero25: data.asientos.asiento_25.genero,
              genero26: data.asientos.asiento_26.genero,
              genero27: data.asientos.asiento_27.genero,
              genero28: data.asientos.asiento_28.genero,
              genero29: data.asientos.asiento_29.genero,
              genero30: data.asientos.asiento_30.genero,
              genero31: data.asientos.asiento_31.genero,
              genero32: data.asientos.asiento_32.genero,
              genero33: data.asientos.asiento_33.genero,
              genero34: data.asientos.asiento_34.genero,
              genero35: data.asientos.asiento_35.genero,
              genero36: data.asientos.asiento_36.genero,
              genero37: data.asientos.asiento_37.genero,
              genero38: data.asientos.asiento_38.genero,
              genero39: data.asientos.asiento_39.genero,
              genero40: data.asientos.asiento_40.genero,
              genero41: data.asientos.asiento_41.genero,
              genero42: data.asientos.asiento_42.genero,
              genero43: data.asientos.asiento_43.genero,
              genero44: data.asientos.asiento_44.genero,
              genero45: data.asientos.asiento_45.genero,
              genero46: data.asientos.asiento_46.genero,
              genero47: data.asientos.asiento_47.genero,
              genero48: data.asientos.asiento_48.genero,
            })
        });
    }

    fetchApartados(){
        fetch('/api/Apartados/'+generalData.vendedor.id_Usuario+'/'+generalData.detalles.idViaje)
        .then(res => res.json())
        .then(data => {
            if(data.length>0){
                //console.log(data[0].asientos);
                //let arrayAsientos = data[0].asientos;
                for (let i = 0; i < data.length; i++) {
                    if(data[i].asiento == 1){
                        this.setState({
                            asiento1: 'false',
                            selected1: true,
                            asiento: '1'
                        });
                        generalData.asientosSelected.selected1 = true;
                    }
                    if(data[i].asiento == 2){
                        this.setState({
                            asiento2: 'false',
                            selected2: true,
                            asiento: '2'
                        });
                        generalData.asientosSelected.selected2 = true;
                    }
                    if(data[i].asiento == 3){
                        this.setState({
                            asiento3: 'false',
                            selected3: true,
                            asiento: '3'
                        });
                        generalData.asientosSelected.selected3 = true;
                    }
                    if(data[i].asiento == 4){
                        this.setState({
                            asiento4: 'false',
                            selected4: true,
                            asiento: '4'
                        });
                        generalData.asientosSelected.selected4 = true;
                    }
                    if(data[i].asiento == 5){
                        this.setState({
                            asiento5: 'false',
                            selected5: true,
                            asiento: '5'
                        });
                        generalData.asientosSelected.selected5 = true;
                    }
                    if(data[i].asiento == 6){
                        this.setState({
                            asiento6: 'false',
                            selected6: true,
                            asiento: '6'
                        });
                        generalData.asientosSelected.selected6 = true;
                    }
                    if(data[i].asiento == 7){
                        this.setState({
                            asiento7: 'false',
                            selected7: true,
                            asiento: '7'
                        });
                        generalData.asientosSelected.selected7 = true;
                    }
                    if(data[i].asiento == 8){
                        this.setState({
                            asiento8: 'false',
                            selected8: true,
                            asiento: '8'
                        });
                        generalData.asientosSelected.selected8 = true;
                    }
                    if(data[i].asiento == 9){
                        this.setState({
                            asiento9: 'false',
                            selected9: true,
                            asiento: '9'
                        });
                        generalData.asientosSelected.selected9 = true;
                    }
                    if(data[i].asiento == 10){
                        this.setState({
                            asiento10: 'false',
                            selected10: true,
                            asiento: '10'
                        });
                        generalData.asientosSelected.selected10 = true;
                    }
                    if(data[i].asiento == 11){
                        this.setState({
                            asiento11: 'false',
                            selected11: true,
                            asiento: '11'
                        });
                        generalData.asientosSelected.selected11 = true;
                    }
                    if(data[i].asiento == 12){
                        this.setState({
                            asiento12: 'false',
                            selected12: true,
                            asiento: '12'
                        });
                        generalData.asientosSelected.selected12 = true;
                    }
                    if(data[i].asiento == 13){
                        this.setState({
                            asiento13: 'false',
                            selected13: true,
                            asiento: '13'
                        });
                        generalData.asientosSelected.selected13 = true;
                    }
                    if(data[i].asiento == 14){
                        this.setState({
                            asiento14: 'false',
                            selected14: true,
                            asiento: '14'
                        });
                        generalData.asientosSelected.selected14 = true;
                    }
                    if(data[i].asiento == 15){
                        this.setState({
                            asiento15: 'false',
                            selected15: true,
                            asiento: '15'
                        });
                        generalData.asientosSelected.selected15 = true;
                    }
                    if(data[i].asiento == 16){
                        this.setState({
                            asiento16: 'false',
                            selected16: true,
                            asiento: '16'
                        });
                        generalData.asientosSelected.selected16 = true;
                    }
                    if(data[i].asiento == 17){
                        this.setState({
                            asiento17: 'false',
                            selected17: true,
                            asiento: '17'
                        });
                        generalData.asientosSelected.selected17 = true;
                    }
                    if(data[i].asiento == 18){
                        this.setState({
                            asiento18: 'false',
                            selected18: true,
                            asiento: '18'
                        });
                        generalData.asientosSelected.selected18 = true;
                    }
                    if(data[i].asiento == 19){
                        this.setState({
                            asiento19: 'false',
                            selected19: true,
                            asiento: '19'
                        });
                        generalData.asientosSelected.selected19 = true;
                    }
                    if(data[i].asiento == 20){
                        this.setState({
                            asiento20: 'false',
                            selected20: true,
                            asiento: '20'
                        });
                        generalData.asientosSelected.selected20 = true;
                    }
                    if(data[i].asiento == 21){
                        this.setState({
                            asiento21: 'false',
                            selected21: true,
                            asiento: '21'
                        });
                        generalData.asientosSelected.selected21 = true;
                    }
                    if(data[i].asiento == 22){
                        this.setState({
                            asiento22: 'false',
                            selected22: true,
                            asiento: '22'
                        });
                        generalData.asientosSelected.selected22 = true;
                    }
                    if(data[i].asiento == 23){
                        this.setState({
                            asiento23: 'false',
                            selected23: true,
                            asiento: '23'
                        });
                        generalData.asientosSelected.selected23 = true;
                    }
                    if(data[i].asiento == 24){
                        this.setState({
                            asiento24: 'false',
                            selected24: true,
                            asiento: '24'
                        });
                        generalData.asientosSelected.selected24 = true;
                    }
                    if(data[i].asiento == 25){
                        this.setState({
                            asiento25: 'false',
                            selected25: true,
                            asiento: '25'
                        });
                        generalData.asientosSelected.selected25 = true;
                    }
                    if(data[i].asiento == 26){
                        this.setState({
                            asiento26: 'false',
                            selected26: true,
                            asiento: '25'
                        });
                        generalData.asientosSelected.selected26 = true;
                    }
                    if(data[i].asiento == 27){
                        this.setState({
                            asiento27: 'false',
                            selected27: true,
                            asiento: '27'
                        });
                        generalData.asientosSelected.selected27 = true;
                    }
                    if(data[i].asiento == 28){
                        this.setState({
                            asiento28: 'false',
                            selected28: true,
                            asiento: '28'
                        });
                        generalData.asientosSelected.selected28 = true;
                    }
                    if(data[i].asiento == 29){
                        this.setState({
                            asiento29: 'false',
                            selected29: true,
                            asiento: '29'
                        });
                        generalData.asientosSelected.selected29 = true;
                    }
                    if(data[i].asiento == 30){
                        this.setState({
                            asiento30: 'false',
                            selected30: true,
                            asiento: '30'
                        });
                        generalData.asientosSelected.selected30 = true;
                    }
                    if(data[i].asiento == 31){
                        this.setState({
                            asiento31: 'false',
                            selected31: true,
                            asiento: '31'
                        });
                        generalData.asientosSelected.selected31 = true;
                    }
                    if(data[i].asiento == 32){
                        this.setState({
                            asiento32: 'false',
                            selected32: true,
                            asiento: '32'
                        });
                        generalData.asientosSelected.selected32 = true;
                    }
                    if(data[i].asiento == 33){
                        this.setState({
                            asiento33: 'false',
                            selected33: true,
                            asiento: '33'
                        });
                        generalData.asientosSelected.selected33 = true;
                    }
                    if(data[i].asiento == 34){
                        this.setState({
                            asiento34: 'false',
                            selected34: true,
                            asiento: '34'
                        });
                        generalData.asientosSelected.selected34 = true;
                    }
                    if(data[i].asiento == 35){
                        this.setState({
                            asiento35: 'false',
                            selected35: true,
                            asiento: '35'
                        });
                        generalData.asientosSelected.selected35 = true;
                    }
                    if(data[i].asiento == 36){
                        this.setState({
                            asiento36: 'false',
                            selected36: true,
                            asiento: '36'
                        });
                        generalData.asientosSelected.selected36 = true;
                    }
                    if(data[i].asiento == 37){
                        this.setState({
                            asiento37: 'false',
                            selected37: true,
                            asiento: '37'
                        });
                        generalData.asientosSelected.selected37 = true;
                    }
                    if(data[i].asiento == 38){
                        this.setState({
                            asiento38: 'false',
                            selected38: true,
                            asiento: '38'
                        });
                        generalData.asientosSelected.selected38 = true;
                    }
                    if(data[i].asiento == 39){
                        this.setState({
                            asiento39: 'false',
                            selected39: true,
                            asiento: '39'
                        });
                        generalData.asientosSelected.selected39 = true;
                    }
                    if(data[i].asiento == 40){
                        this.setState({
                            asiento40: 'false',
                            selected40: true,
                            asiento: '40'
                        });
                        generalData.asientosSelected.selected40 = true;
                    }
                    if(data[i].asiento == 41){
                        this.setState({
                            asiento41: 'false',
                            selected41: true,
                            asiento: '41'
                        });
                        generalData.asientosSelected.selected41 = true;
                    }
                    if(data[i].asiento == 42){
                        this.setState({
                            asiento42: 'false',
                            selected42: true,
                            asiento: '42'
                        });
                        generalData.asientosSelected.selected42 = true;
                    }
                    if(data[i].asiento == 43){
                        this.setState({
                            asiento43: 'false',
                            selected43: true,
                            asiento: '43'
                        });
                        generalData.asientosSelected.selected43 = true;
                    }
                    if(data[i].asiento == 44){
                        this.setState({
                            asiento44: 'false',
                            selected44: true,
                            asiento: '44'
                        });
                        generalData.asientosSelected.selected44 = true;
                    }
                    if(data[i].asiento == 45){
                        this.setState({
                            asiento45: 'false',
                            selected45: true,
                            asiento: '45'
                        });
                        generalData.asientosSelected.selected45 = true;
                    }
                    if(data[i].asiento == 46){
                        this.setState({
                            asiento46: 'false',
                            selected46: true,
                            asiento: '46'
                        });
                        generalData.asientosSelected.selected46 = true;
                    }
                    if(data[i].asiento == 47){
                        this.setState({
                            asiento47: 'false',
                            selected47: true,
                            asiento: '47'
                        });
                        generalData.asientosSelected.selected47 = true;
                    }
                    if(data[i].asiento == 48){
                        this.setState({
                            asiento48: 'false',
                            selected48: true,
                            asiento: '48'
                        });
                        generalData.asientosSelected.selected48 = true;
                    }
                }
            }
        })
    }

    handleChangeOrigenDestino(e){
        this.setState(prevState => ({
            checkOrigenDestino: !prevState.checkOrigenDestino
        }))
    }

    handleSetOptionsOrigen(){
        fetch('/api/OrigenesYdestinos/true/activo')
        .then(res => res.json())
        .then(data => {
            if(data.length > 0){
                let optOrigen = [];
                for(let i = 0; i < data.length; i++){
                    optOrigen[i] = { 
                        value: data[i]._id,
                        label: data[i].nombre,
                        estado: data[i].estado,
                        pais: data[i].pais,
                        direccion: data[i].direccion,
                        hora: data[i].horaDeCita
                    };
                }
                this.setState({
                    optOrigen: optOrigen
                })
            }
        });
    }

    handleChangeOrigen(e){
        //console.log(e);
        generalData.origen.id = e.value;
        generalData.origen.ciudad = e.label;
        generalData.origen.estado = e.estado;
        generalData.origen.pais = e.pais;
        generalData.origen.direccion = e.direccion;
        generalData.detalles.hora = e.hora;
        this.setState({
            validationOrigen: true,
            valOrigen: e.value,
            hora: e.hora
        });
        //console.log(generalData.origen.id);
        let pais = (e.pais == 'MX')? 'US' : 'MX';
        //this.handleSetOptionsDestino(pais);
        this.handleSetOptionsDestino(e.value);
    }

    handleChangeDestino(e){
        generalData.destino.id = e.value;
        generalData.destino.ciudad = e.label;
        generalData.destino.municipio = e.municipio;
        generalData.destino.estado = e.estado;
        generalData.destino.pais = e.pais;
        generalData.destino.direccion = e.direccion;
        this.setState({
          validationDestino: true,
          valDestino: e.value
        })
        //console.log(generalData.destino.id);
    }

    handleSetOptionsDestino(idOrigen){
        //Sacamos los destinos que estén guardados en los precios para ese origen
        //console.log(idOrigen);
        fetch(`/api/Precios/destinos/${idOrigen}`)
        .then(res => res.json())
        .then(data => {
            this.setState({
                optDestino: data
            })
        });
    }

    handleChangeCorrida(e){
        generalData.detalles.idViaje =  e.value;
        generalData.detalles.dia = e.dia;
        generalData.detalles.numeroEconomico = e.numeroEconomico;
        generalData.detalles.anio = e.anio;
        generalData.detalles.diaDelAnio = e.diaDelAnio;
        this.setState({
            validationCorrida: true,
        });
    }

    handleChangeFechaHora(e){

        let selectFechaHora = document.getElementById('selectFechaHora');

        let fechaDeViaje = selectFechaHora.value;             
        let arrayFechaDeViaje = fechaDeViaje.split('-', 3);
        let anioFechaDeViaje = arrayFechaDeViaje[0];

        let hoy = new Date();
        let anio = hoy.getFullYear();

        let diaDeHoy = `${anio}-${hoy.getMonth()+1}-${hoy.getDate()}`;
        let diaAnioHoy = this.getDiaDelAnio(`${anio}-01-01`,diaDeHoy);

        //console.log('diaAnioHoy', diaAnioHoy);

        let diaAnioViaje = this.getDiaDelAnio(`${anioFechaDeViaje}-01-01`,fechaDeViaje);

        //console.log('diaAnioViaje', diaAnioViaje);
      console.log('Usuario Admin');
            //Ahora verificamos que ya esté abierta la fecha
            //El formato de la fecha debe ser "dd-mm-aaaa"
            let buscarFecha = `${arrayFechaDeViaje[2]}-${arrayFechaDeViaje[1]}-${arrayFechaDeViaje[0]}`;
            console.log(`/api/AsignarViajes/${this.state.valOrigen}/${this.state.valDestino}/${buscarFecha}`);
            fetch(`/api/AsignarViajes/${this.state.valOrigen}/${this.state.valDestino}/${buscarFecha}`)
            .then(res => res.json())
            .then(data => {
                if(data.length > 0){
                    this.setState({
                        optCorridas: data,
                        validationFechaHora: true,
                        fecha: fechaDeViaje
                    });
                }else{
                    this.setState({
                        validationFechaHora: false,
                    });
                    selectFechaHora.value = '';
                    alert('No hay viaje que coincida, escoge otra fecha o contáctate con la matriz');
                }
            });
    }

    getDiaDelAnio(fechaInicial, fechaFinal){

        let fechaini = new Date(fechaInicial);
        let fechafin = new Date(fechaFinal);
        let diasdif= fechafin.getTime()-fechaini.getTime();
        let contdias = Math.round(diasdif/(1000*60*60*24));

        return (contdias+1);
    }

    buquedaFolio(){ //Aqui voy
        let folio = document.getElementById('folio').value;
        let folioUsuario = document.getElementById('folioUsuario').value;
        fetch(`/api/Reasignaciones/${folioUsuario}/${folio}/folio`)
        .then(res => res.json())
        .then(data => {
            if(data.length == 0){
                this.setState({
                    ventas: []
                });
                alert('No hay resultados que coincidan con tu búsqueda');
            }else{
                this.setState({
                    ventas: data
                });
            }
        })
    }

    limpiarFolio(){
        document.getElementById('folioUsuario').value = '';
        document.getElementById('folio').value = '';
    }

    buquedaNombre(){
        let nom = 'null';
        let ap = 'null';
        let am = 'null';

        let nombreBusqueda = document.getElementById('nombreCliente').value;
        let apaternoBusqueda = document.getElementById('apellidoPCliente').value;
        let amaternoBusqueda = document.getElementById('apellidoMCliente').value;

        if(nombreBusqueda != '' && nombreBusqueda != null){
            nom = nombreBusqueda;
        }

        if(apaternoBusqueda != '' && apaternoBusqueda != null){
            ap = apaternoBusqueda;
        }

        if(amaternoBusqueda != '' && amaternoBusqueda != null){
            am = amaternoBusqueda;
        }

        console.log(`/api/Reasignaciones/${nom}/pasajero/${ap}/${am}`);
        fetch(`/api/Reasignaciones/${nom}/pasajero/${ap}/${am}`)
        .then(res => res.json())
        .then(data => {
            if(data.length > 0){
                this.setState({
                    ventas: data,
                });
            }else{
                this.setState({
                    ventas: [],
                });
                alert('No se encontró resultado que coincida con tu búsqueda');
            }
        });
    }

    limpiarNombres(){
        document.getElementById('nombreCliente').value = '';
        document.getElementById('apellidoPCliente').value = '';
        document.getElementById('apellidoMCliente').value = '';
    }

    toggle(){
        this.setState(prevState => ({
            modal: !prevState.modal,
            activo: 1,
            btnSiguiente: "Siguiente"
        }));
    }

    toogleReasignarVenta(){
        //Validamos que esté seleccionada una venta
        try {
            let selectedRowKeys = null;
            selectedRowKeys = this.refs.table.state.selectedRowKeys;
            if(selectedRowKeys.length == 1){
                //Obtener Origen, destino
                let selectedKey = selectedRowKeys[0];
                console.log('selectedKey', selectedKey);
                let auxArray = this.state.ventas;
                console.log('auxArray', auxArray);
                for (let i = 0; i < auxArray.length; i++) {
                    console.log('selectedKey', selectedKey);
                    console.log('auxArray', auxArray[i]);
                    if(auxArray[i]._id == selectedKey){
                        console.log('si');
                        this.setState({
                            idReasignacion: selectedRowKeys,
                            valOrigen: auxArray[i].origenID,
                            labelOrigen: auxArray[i].origen,
                            valDestino: auxArray[i].destinoID,
                            labelDestino: auxArray[i].destino,
                            checkOrigenDestino: true,
                            foliovendedor: auxArray[i].foliovendedor,
                            idVentaEnlazado: auxArray[i].idVentaEnlazado,
                            folio: auxArray[i].folio
                        });
                        generalData.origen.id = auxArray[i].origenID;
                        generalData.cliente = auxArray[i].clienteID;
                        generalData.clienteTipo = auxArray[i].tipo,
                        generalData.clienteRazon = auxArray[i].razon,
                        generalData.nombreCliente = auxArray[i].cliente,
                        generalData.origen.direccion = auxArray[i].origenDireccion;
                        generalData.origen.ciudad = auxArray[i].origenMunicipio;
                        generalData.origen.estado = auxArray[i].origenEstado;
                        generalData.origen.pais = auxArray[i].origenPais;
                        generalData.destino.id = auxArray[i].destinoID;
                        generalData.destino.direccion = auxArray[i].destinoDireccion;
                        generalData.destino.ciudad = auxArray[i].destinoMunicipio;
                        generalData.destino.estado = auxArray[i].destinoEstado;
                        generalData.destino.pais = auxArray[i].destinoPais;
                        generalData.vendedor.id_Usuario = auxArray[i].vendedorID;
                        generalData.vendedor.username = auxArray[i].username;
                        generalData.vendedor.nombre = `${auxArray[i].vendedorNombre} ${auxArray[i].vendedorAPaterno} ${auxArray[i].vendedorAMaterno}`;
                        generalData.vendedor.sucursal = auxArray[i].sucursal;
                        generalData.cobro.descuento = auxArray[i].descuento;
                        generalData.cambio = auxArray[i].tipoCambio;
                        generalData.cobro.total = auxArray[i].total;
                        generalData.cobro.subtotal = parseInt(auxArray[i].total)-parseInt(auxArray[i].descuento);
                        this.handleSetOptionsDestino(auxArray[i].origenID);
                        break;
                    }
                }
                this.toggle();
            }else{
                alert('Por favor selecciona sólo un registro');
            }
        }catch (error) {
            alert('Ha ocurrido un error, por favor intentalo más tarde');
            console.log(error);
        }
    }

    render() {
        const selectRowProp = {
            mode: 'radio'
        };
        return (
            <div>
                <Container style={{ marginTop: "15px" }}>
                    <br/>
                    <Form>
                        <Card body outline color="secondary">
                            <CardTitle className="text-center"><h3>REASIGNACIONES PENDIENTES</h3></CardTitle>
                            <br/>
                            {/** BUSQUEDA **/}
                            <h5>Buscar Por:</h5>
                            <Row>
                                <Col lg='4' md='4' sm='4' xs='4'>
                                    <FormGroup>
                                        <Label for="folio">Folio</Label>
                                        <Input id="folioUsuario" name="folioUsuario" type="text" />
                                    </FormGroup>
                                </Col>
                                <Col lg='2' md='2' sm='2' xs='2'>
                                    <h3 className="guion text-center">-</h3>
                                </Col>
                                <Col lg='4' md='4' sm='4' xs='4'>
                                    <FormGroup>
                                        <Label for="folio">No.</Label>
                                        <Input id="folio" name="folio" type="text" />
                                    </FormGroup>
                                </Col>
                                <Col className="btn-nuevoPasajero" lg='1' md='1' sm='1' xs='1'>
                                    <Button color="primary" title="Buscar" onClick={this.buquedaFolio}><i className="fa fa-search"/></Button>
                                </Col>
                                <Col className="btn-nuevoPasajero" lg='1' md='1' sm='1' xs='1'>
                                    <Button color="primary" title="Limpiar campos" onClick={this.limpiarFolio}><i className="fa fa-eraser"/></Button>
                                </Col>
                            </Row>
                            <hr/>
                            <Row>
                            <Col lg='3' md='3' sm='3' xs='3'>
                                <FormGroup>
                                    <Label for="nombreCliente">Nombre de Cliente</Label>
                                    <Input type="text" name="nombreCliente" id="nombreCliente"/>
                                </FormGroup>
                            </Col>
                            <Col lg='3' md='3' sm='3' xs='3'>
                                <FormGroup>
                                    <Label for="apellidoPCliente">Apellido Paterno</Label>
                                    <Input type="text" name="apellidoPCliente" id="apellidoPCliente"/>
                                </FormGroup>
                            </Col>
                            <Col lg='3' md='3' sm='3' xs='3'>
                                <FormGroup>
                                    <Label for="apellidoMCliente">Apellido Materno</Label>
                                    <Input id="apellidoMCliente" name="apellidoMCliente" type="text" />
                                </FormGroup>
                            </Col>
                            <Col className="btn-nuevoPasajero" lg='1' md='1' sm='1' xs='1'>
                                <Button color="primary" onClick={this.buquedaNombre}><i className="fa fa-search"/></Button>
                            </Col>
                            <Col className="btn-nuevoPasajero" lg='1' md='1' sm='1' xs='1'>
                                <Button color="primary" onClick={this.limpiarNombres}><i className="fa fa-eraser"/></Button>
                            </Col>
                            </Row>
                            {/** TERMINA BUSQUEDA **/}
                            {/** ACCIONES **/}
                            <hr/>
                            <h5>Acciones</h5>
                            <Row>
                                <Col lg='3' md='3' sm='3' xs='3'>
                                    <Button color="primary" onClick={this.toogleReasignarVenta}><i className="fa fa-redo-alt"/> Reasignar Venta</Button>
                                </Col>
                            </Row>
                            {/** TERMINA ACCIONES **/}
                        </Card>
                    </Form>
                    <br/>
                    <br/>
                    <Row style={{ marginTop: "10px" }}>
                        <Col lg='12' md='12' sm='12' xs='12'>
                            <BootstrapTable ref='table'data={ this.state.ventas } selectRow={ selectRowProp } striped hover >
                            <TableHeaderColumn dataField='_id' isKey hidden>ID</TableHeaderColumn>
                            <TableHeaderColumn width='200' dataField='folio'>Folio</TableHeaderColumn>
                            <TableHeaderColumn width='250' dataField='cliente'>Cliente</TableHeaderColumn>
                            <TableHeaderColumn width='150' dataField='origen'>Origen</TableHeaderColumn>
                            <TableHeaderColumn width='150' dataField='destino'>Destino</TableHeaderColumn>
                            </BootstrapTable>
                        </Col>
                    </Row>
                    <br/>
                    {/* Modal Reprogramación */}
                    <Modal size="lg" isOpen={this.state.modal} toggle={this.toggle}>
                        <ModalHeader toggle={this.toggle}>Reprogramación de viaje</ModalHeader>
                        <ModalBody>
                            <div id="stepOne" className="activo">
                                <Row>
                                    <Col lg='12' md='12' sm='12' xs='12'>
                                        <div class="form-group form-check">
                                            <input type="checkbox" class="form-check-input" id="checkOrigenDestino" onChange={this.handleChangeOrigenDestino} checked={this.state.checkOrigenDestino}/>
                                            <label class="form-check-label" htmlFor="checkOrigenDestino">Conservar Origen y destino</label>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg='6' md='6' sm='12' xs='12'>
                                        <Label for="selectOrigen">Origen:</Label>
                                        <div class={(this.state.validationOrigen) ? 'card border-light': 'card border-danger'}>
                                            <Select
                                                id="selectOrigen"
                                                onChange={this.handleChangeOrigen}
                                                options={this.state.optOrigen}
                                                isDisabled={this.state.checkOrigenDestino}
                                                placeholder = "Selecciona..."
                                                defaultValue = {{ value: this.state.valOrigen, label: this.state.labelOrigen}}
                                            />
                                        </div>
                                        <p class={(this.state.validationOrigen) ? 'textValid': 'textInvalid'}>Selecciona el origen</p>
                                    </Col>
                                    <Col lg='6' md='6' sm='12' xs='12'>
                                        <Label for="selectDestino">Destino:</Label>
                                        <div class={(this.state.validationDestino) ? 'card border-light': 'card border-danger'}>
                                            <Select
                                                id="selectDestino"
                                                onChange={this.handleChangeDestino}
                                                options={this.state.optDestino}
                                                isDisabled={this.state.checkOrigenDestino}
                                                placeholder = "Selecciona..."
                                                defaultValue = {{ value: this.state.valDestino, label: this.state.labelDestino}}
                                            />
                                        </div>
                                        <p class={(this.state.validationDestino) ? 'textValid': 'textInvalid'}>Selecciona el destino</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={4} md={4} sm={6} xs={6}>
                                        <Label for="selectFechaHora">Fecha:</Label>
                                        <div class={(this.state.validationFechaHora) ? 'card border-light': 'card border-danger'}>
                                            <Input
                                                type="date"
                                                name="date"
                                                id="selectFechaHora"
                                                placeholder="date placeholder"
                                            />
                                        </div>
                                        <p class={(this.state.validationFechaHora) ? 'textValid': 'textInvalid'}>Selecciona la fecha</p>
                                    </Col>
                                    <Col className="btn-nuevoPasajero" lg={2} md={2} sm={6} xs={6}>
                                        <Button onClick={this.handleChangeFechaHora} color="secondary"><small>Comprobar Fecha</small></Button>
                                    </Col>
                                    <Col lg={6} md={6} sm={12} xs={12}>                    
                                        <Label for="selectCorrida">Corrida:</Label>
                                        <div class={(this.state.validationCorrida) ? 'card border-light': 'card border-danger'}>
                                            <Select
                                            id="selectCorrida"
                                            onChange={this.handleChangeCorrida}
                                            options={this.state.optCorridas}
                                            placeholder = "Selecciona..."
                                            />
                                        </div>
                                        <p class={(this.state.validationCorrida) ? 'textValid': 'textInvalid'}>Selecciona la corrida</p>
                                    </Col>
                                </Row>
                            </div>
                            <div id="stepTwo" className="noactivo">
                                <Row>
                                    <Col lg='12' md='12' sm='12' xs='12'>
                                        <h5 className="text-center">Selecciona el asiento</h5>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg='12' md='12' sm='12' xs='12'>
                                        <div className="text-center">
                                            {/* Simbologia */}
                                            <Row>
                                                <Col md="4" xs="4" sm="4" lg="4">
                                                    <Button outline color="success"><i className="fa fa-check" /></Button>{' '}
                                                </Col>
                                                <Col md="4" xs="4" sm="4" lg="4">
                                                    <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                                </Col>
                                                <Col md="4" xs="4" sm="4" lg="4">
                                                    <Button color="success" size="lg" className="asientoDisponible asiento">{'  '}</Button>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="4" xs="4" sm="4" lg="4">
                                                    <h6>Selecionado</h6>
                                                </Col>
                                                <Col md="4" xs="4" sm="4" lg="4">
                                                    <h6>Ocupado</h6>
                                                </Col>
                                                <Col md="4" xs="4" sm="4" lg="4">
                                                    <h6>Libre</h6>
                                                </Col>
                                            </Row>
                                            {/* Fin Simbologia */}
                                            <br/>
                                            <Row>
                                                <Col md="12" xs="12" sm="12" lg="12">
                                                    <div>
                                                        <Card body outline color="secondary"  className="text-center">
                                                        <CardTitle>Seleccione los lugares <br/></CardTitle>
                                                        <br/>
                                                        <br/>
                                                        <Col xs="12" sm="12" md={{ size:9, offset:3 }} lg={{ size:9, offset:3 }}>
                                                            {/* Elementos CHOFER y ESCALERAS */}
                                                            <Row>
                                                            <Col xs="2" sm="1" className="elementosAutobus">
                                                                <i className="fa fa-user-tie" />
                                                            </Col>
                                                            <Col xs="2" sm="1">
                                                            </Col>
                                                            <Col xs="3">
                                                            </Col>
                                                            <Col xs="2" sm="1">
                                                            </Col>
                                                            <Col xs="2" sm="1" className="elementosAutobus">
                                                                <i className="fa fa-sort-amount-down" />
                                                            </Col>
                                                            </Row>
                                                            {/* TERMINA Elementos CHOFER y ESCALERAS */}
                                                            {/* Asientos */}
                                                            <Row>
                                                            <Col xs="2" sm="1">
                                                                {(this.state.asiento1 == 'false') ? 
                                                                    (
                                                                        <button name='1' id='1' type="button" className={(this.state.selected1)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                    )
                                                                    :
                                                                    (
                                                                        <button type="button" class={(this.state.genero1 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero1 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                    )
                                                                }
                                                                <p className="smallDevice text-center">01</p>
                                                            </Col>
                                                            <Col xs="2" sm="1">
                                                                {(this.state.asiento2  == 'false') ? 
                                                                    (
                                                                        <button name='2' id='2' type="button" className={(this.state.selected2)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                    )
                                                                    :
                                                                    (
                                                                        <button type="button" class={(this.state.genero2 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero2 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                    )
                                                                }
                                                                <p className="smallDevice text-center">02</p>
                                                            </Col>
                                                            <Col xs="3">
                                                            </Col>
                                                            <Col xs="2" sm="1">
                                                                {(this.state.asiento3  == 'false') ? 
                                                                    (
                                                                        <button name='3' id='3' type="button" className={(this.state.selected3)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                    )
                                                                    :
                                                                    (
                                                                        <button type="button" class={(this.state.genero3 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero3 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                    )
                                                                }
                                                                <p className="smallDevice text-center">03</p>
                                                            </Col>
                                                            <Col xs="2" sm="1">
                                                                {(this.state.asiento4  == 'false') ? 
                                                                    (
                                                                        <button name='4' id='4' type="button" className={(this.state.selected4)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                    )
                                                                    :
                                                                    (
                                                                        <button type="button" class={(this.state.genero4 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero4 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                    )
                                                                }
                                                                <p className="smallDevice text-center">04</p>
                                                            </Col>
                                                            </Row>
                                                            <Row>
                                                            <Col xs="2" sm="1">
                                                                {(this.state.asiento5  == 'false') ? 
                                                                    (
                                                                        <button name='5' id='5' type="button" className={(this.state.selected5)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                    )
                                                                    :
                                                                    (
                                                                        <button type="button" class={(this.state.genero5 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero5 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                    )
                                                                }
                                                                <p className="smallDevice text-center">05</p>
                                                            </Col>
                                                            <Col xs="2" sm="1">
                                                                {(this.state.asiento6  == 'false') ? 
                                                                    (
                                                                        <button name='6' id='6' type="button" className={(this.state.selected6)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                    )
                                                                    :
                                                                    (
                                                                        <button type="button" class={(this.state.genero6 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero6 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                    )
                                                                }
                                                                <p className="smallDevice text-center">06</p>
                                                            </Col>
                                                            <Col xs="3">
                                                            </Col>
                                                            <Col xs="2" sm="1">
                                                                {(this.state.asiento7  == 'false') ? 
                                                                    (
                                                                        <button name='7' id='7' type="button" className={(this.state.selected7)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                    )
                                                                    :
                                                                    (
                                                                        <button type="button" class={(this.state.genero7 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero7 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                    )
                                                                }
                                                                <p className="smallDevice text-center">07</p>
                                                            </Col>
                                                            <Col xs="2" sm="1">
                                                                {(this.state.asiento8  == 'false') ? 
                                                                    (
                                                                        <button name='8' id='8' type="button" className={(this.state.selected8)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                    )
                                                                    :
                                                                    (
                                                                        <button type="button" class={(this.state.genero8 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero8 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                    )
                                                                }
                                                                <p className="smallDevice text-center">08</p>
                                                            </Col>
                                                            </Row>
                                                            <Row>
                                                            <Col xs="2" sm="1">
                                                                {(this.state.asiento9  == 'false') ? 
                                                                    (
                                                                        <button name='9' id='9' type="button" className={(this.state.selected9)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                    )
                                                                    :
                                                                    (
                                                                        <button type="button" class={(this.state.genero9 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero9 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                    )
                                                                }
                                                                <p className="smallDevice text-center">09</p>
                                                            </Col>
                                                            <Col xs="2" sm="1">
                                                                {(this.state.asiento10  == 'false') ? 
                                                                    (
                                                                        <button name='10' id='10' type="button" className={(this.state.selected10)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                    )
                                                                    :
                                                                    (
                                                                        <button type="button" class={(this.state.genero10 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero10 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                    )
                                                                }
                                                                <p className="smallDevice text-center">10</p>
                                                            </Col>
                                                            <Col xs="3">
                                                            </Col>
                                                            <Col xs="2" sm="1">
                                                                {(this.state.asiento11 == 'false') ? 
                                                                    (
                                                                        <button name='11' id='11' type="button" className={(this.state.selected11)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                    )
                                                                    :
                                                                    (
                                                                        <button type="button" class={(this.state.genero11 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero11 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                    )
                                                                }
                                                                <p className="smallDevice text-center">11</p>
                                                            </Col>
                                                            <Col xs="2" sm="1">
                                                                {(this.state.asiento12 == 'false') ? 
                                                                    (
                                                                        <button name='12' id='12' type="button" className={(this.state.selected12)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                    )
                                                                    :
                                                                    (
                                                                        <button type="button" class={(this.state.genero12 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero12 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                    )
                                                                }
                                                                <p className="smallDevice text-center">12</p>
                                                            </Col>
                                                            </Row>
                                                            <Row>
                                                            <Col xs="2" sm="1">
                                                                {(this.state.asiento13 == 'false') ? 
                                                                    (
                                                                        <button name='13' id='13' type="button" className={(this.state.selected13)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                    )
                                                                    :
                                                                    (
                                                                        <button type="button" class={(this.state.genero13 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero13 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                    )
                                                                }
                                                                <p className="smallDevice text-center">13</p>
                                                            </Col>
                                                            <Col xs="2" sm="1">
                                                                {(this.state.asiento14 == 'false') ? 
                                                                    (
                                                                        <button name='14' id='14' type="button" className={(this.state.selected14)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                    )
                                                                    :
                                                                    (
                                                                        <button type="button" class={(this.state.genero14 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero14 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                    )
                                                                }
                                                                <p className="smallDevice text-center">14</p>
                                                            </Col>
                                                            <Col xs="3">
                                                            </Col>
                                                            <Col xs="2" sm="1">
                                                                {(this.state.asiento15 == 'false') ? 
                                                                    (
                                                                        <button name='15' id='15' type="button" className={(this.state.selected15)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                    )
                                                                    :
                                                                    (
                                                                        <button type="button" class={(this.state.genero15 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero15 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                    )
                                                                }
                                                                <p className="smallDevice text-center">15</p>
                                                            </Col>
                                                            <Col xs="2" sm="1">
                                                                {(this.state.asiento16 == 'false') ? 
                                                                    (
                                                                        <button name='16' id='16' type="button" className={(this.state.selected16)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                    )
                                                                    :
                                                                    (
                                                                        <button type="button" class={(this.state.genero16 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero16 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                    )
                                                                }
                                                                <p className="smallDevice text-center">16</p>
                                                            </Col>
                                                            </Row>
                                                            <Row>
                                                            <Col xs="2" sm="1">
                                                                {(this.state.asiento17 == 'false') ? 
                                                                    (
                                                                        <button name='17' id='17' type="button" className={(this.state.selected17)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                    )
                                                                    :
                                                                    (
                                                                        <button type="button" class={(this.state.genero17 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero17 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                    )
                                                                }
                                                                <p className="smallDevice text-center">17</p>
                                                            </Col>
                                                            <Col xs="2" sm="1">
                                                                {(this.state.asiento18 == 'false') ? 
                                                                    (
                                                                        <button name='18' id='18' type="button" className={(this.state.selected18)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                    )
                                                                    :
                                                                    (
                                                                        <button type="button" class={(this.state.genero18 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero18 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                    )
                                                                }
                                                                <p className="smallDevice text-center">18</p>
                                                            </Col>
                                                            <Col xs="3">
                                                            </Col>
                                                            <Col xs="2" sm="1">
                                                                {(this.state.asiento19 == 'false') ? 
                                                                    (
                                                                        <button name='19' id='19' type="button" className={(this.state.selected19)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                    )
                                                                    :
                                                                    (
                                                                        <button type="button" class={(this.state.genero19 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero19 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                    )
                                                                }
                                                                <p className="smallDevice text-center">19</p>
                                                            </Col>
                                                            <Col xs="2" sm="1">
                                                                {(this.state.asiento20 == 'false') ? 
                                                                    (
                                                                        <button name='20' id='20' type="button" className={(this.state.selected20)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                    )
                                                                    :
                                                                    (
                                                                        <button type="button" class={(this.state.genero20 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero20 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                    )
                                                                }
                                                                <p className="smallDevice text-center">20</p>
                                                            </Col>
                                                            </Row>
                                                            <Row>
                                                            <Col xs="2" sm="1">
                                                                {(this.state.asiento21 == 'false') ? 
                                                                    (
                                                                        <button name='21' id='21' type="button" className={(this.state.selected21)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                    )
                                                                    :
                                                                    (
                                                                        <button type="button" class={(this.state.genero21 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero21 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                    )
                                                                }
                                                                <p className="smallDevice text-center">21</p>
                                                            </Col>
                                                            <Col xs="2" sm="1">
                                                                {(this.state.asiento22 == 'false') ? 
                                                                    (
                                                                        <button name='22' id='22' type="button" className={(this.state.selected22)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                    )
                                                                    :
                                                                    (
                                                                        <button type="button" class={(this.state.genero22 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero22 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                    )
                                                                }
                                                                <p className="smallDevice text-center">22</p>
                                                            </Col>
                                                            <Col xs="3">
                                                            </Col>
                                                            <Col xs="2" sm="1">
                                                                {(this.state.asiento23 == 'false') ? 
                                                                    (
                                                                        <button name='23' id='23' type="button" className={(this.state.selected23)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                    )
                                                                    :
                                                                    (
                                                                        <button type="button" class={(this.state.genero23 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero23 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                    )
                                                                }
                                                                <p className="smallDevice text-center">23</p>
                                                            </Col>
                                                            <Col xs="2" sm="1">
                                                                {(this.state.asiento24 == 'false') ? 
                                                                    (
                                                                        <button name='24' id='24' type="button" className={(this.state.selected24)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                    )
                                                                    :
                                                                    (
                                                                        <button type="button" class={(this.state.genero24 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero24 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                    )
                                                                }
                                                                <p className="smallDevice text-center">24</p>
                                                            </Col>
                                                            </Row>
                                                            <Row>
                                                            <Col xs="2" sm="1">
                                                                {(this.state.asiento25 == 'false') ? 
                                                                    (
                                                                        <button name='25' id='25' type="button" className={(this.state.selected25)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                    )
                                                                    :
                                                                    (
                                                                        <button type="button" class={(this.state.genero25 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero25 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                    )
                                                                }
                                                                <p className="smallDevice text-center">25</p>
                                                            </Col>
                                                            <Col xs="2" sm="1">
                                                                {(this.state.asiento26 == 'false') ? 
                                                                    (
                                                                        <button name='26' id='26' type="button" className={(this.state.selected26)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                    )
                                                                    :
                                                                    (
                                                                        <button type="button" class={(this.state.genero26 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero26 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                    )
                                                                }
                                                                <p className="smallDevice text-center">26</p>
                                                            </Col>
                                                            <Col xs="3">
                                                            </Col>
                                                            <Col xs="2" sm="1">
                                                                {(this.state.asiento27 == 'false') ? 
                                                                    (
                                                                        <button name='27' id='27' type="button" className={(this.state.selected27)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                    )
                                                                    :
                                                                    (
                                                                        <button type="button" class={(this.state.genero27 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero27 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                    )
                                                                }
                                                                <p className="smallDevice text-center">27</p>
                                                            </Col>
                                                            <Col xs="2" sm="1">
                                                                {(this.state.asiento28 == 'false') ? 
                                                                    (
                                                                        <button name='28' id='28' type="button" className={(this.state.selected28)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                    )
                                                                    :
                                                                    (
                                                                        <button type="button" class={(this.state.genero28 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero28 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                    )
                                                                }
                                                                <p className="smallDevice text-center">28</p>
                                                            </Col>
                                                            </Row>
                                                            <Row>
                                                            <Col xs="2" sm="1">
                                                                {(this.state.asiento29 == 'false') ? 
                                                                    (
                                                                        <button name='29' id='29' type="button" className={(this.state.selected29)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                    )
                                                                    :
                                                                    (
                                                                        <button type="button" class={(this.state.genero29 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero29 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                    )
                                                                }
                                                                <p className="smallDevice text-center">29</p>
                                                            </Col>
                                                            <Col xs="2" sm="1">
                                                                {(this.state.asiento30 == 'false') ? 
                                                                    (
                                                                        <button name='30' id='30' type="button" className={(this.state.selected30)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                    )
                                                                    :
                                                                    (
                                                                        <button type="button" class={(this.state.genero30 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero30 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                    )
                                                                }
                                                                <p className="smallDevice text-center">30</p>
                                                            </Col>
                                                            <Col xs="3">
                                                            </Col>
                                                            <Col xs="2" sm="1">
                                                                {(this.state.asiento31 == 'false') ? 
                                                                    (
                                                                        <button name='31' id='31' type="button" className={(this.state.selected31)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                    )
                                                                    :
                                                                    (
                                                                        <button type="button" class={(this.state.genero31 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero31 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                    )
                                                                }
                                                                <p className="smallDevice text-center">31</p>
                                                            </Col>
                                                            <Col xs="2" sm="1">
                                                                {(this.state.asiento32 == 'false') ? 
                                                                    (
                                                                        <button name='32' id='32' type="button" className={(this.state.selected32)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                    )
                                                                    :
                                                                    (
                                                                        <button type="button" class={(this.state.genero32 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero32 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                    )
                                                                }
                                                                <p className="smallDevice text-center">32</p>
                                                            </Col>
                                                            </Row>
                                                            <Row>
                                                            <Col xs="2" sm="1">
                                                                {(this.state.asiento33 == 'false') ? 
                                                                    (
                                                                        <button name='33' id='33' type="button" className={(this.state.selected33)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                    )
                                                                    :
                                                                    (
                                                                        <button type="button" class={(this.state.genero33 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero33 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                    )
                                                                }
                                                                <p className="smallDevice text-center">33</p>
                                                            </Col>
                                                            <Col xs="2" sm="1">
                                                                {(this.state.asiento34 == 'false') ? 
                                                                    (
                                                                        <button name='34' id='34' type="button" className={(this.state.selected34)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                    )
                                                                    :
                                                                    (
                                                                        <button type="button" class={(this.state.genero34 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero34 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                    )
                                                                }
                                                                <p className="smallDevice text-center">34</p>
                                                            </Col>
                                                            <Col xs="3">
                                                            </Col>
                                                            <Col xs="2" sm="1">
                                                                {(this.state.asiento35 == 'false') ? 
                                                                    (
                                                                        <button name='35' id='35' type="button" className={(this.state.selected35)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                    )
                                                                    :
                                                                    (
                                                                        <button type="button" class={(this.state.genero35 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero35 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                    )
                                                                }
                                                                <p className="smallDevice text-center">35</p>
                                                            </Col>
                                                            <Col xs="2" sm="1">
                                                                {(this.state.asiento36 == 'false') ? 
                                                                    (
                                                                        <button name='36' id='36' type="button" className={(this.state.selected36)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                    )
                                                                    :
                                                                    (
                                                                        <button type="button" class={(this.state.genero36 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero36 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                    )
                                                                }
                                                                <p className="smallDevice text-center">36</p>
                                                            </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col xs="2" sm="1">
                                                                    {(this.state.asiento37 == 'false') ? 
                                                                        (
                                                                            <button name='37' id='37' type="button" className={(this.state.selected37)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                        )
                                                                        :
                                                                        (
                                                                            <button type="button" class={(this.state.genero37 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero37 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                        )
                                                                    }
                                                                    <p className="smallDevice text-center">37</p>
                                                                </Col>
                                                                <Col xs="2" sm="1">
                                                                    {(this.state.asiento38 == 'false') ? 
                                                                        (
                                                                            <button name='38' id='38' type="button" className={(this.state.selected38)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                        )
                                                                        :
                                                                        (
                                                                            <button type="button" class={(this.state.genero38 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero38 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                        )
                                                                    }
                                                                    <p className="smallDevice text-center">38</p>
                                                                </Col>
                                                                <Col xs="3">
                                                                </Col>
                                                                {
                                                                    (this.state.noAsientos >= 39) ?
                                                                    (
                                                                        <Col xs="2" sm="1">
                                                                            {(this.state.asiento39 == 'false') ? 
                                                                                (
                                                                                    <button name='39' id='39' type="button" className={(this.state.selected39)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                                )
                                                                                :
                                                                                (
                                                                                    <button type="button" class={(this.state.genero39 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero39 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                                )
                                                                            }
                                                                            <p className="smallDevice text-center">39</p>
                                                                        </Col>
                                                                    )
                                                                    :
                                                                    ''
                                                                }
                                                                {
                                                                    (this.state.noAsientos >= 40) ?
                                                                    (
                                                                        <Col xs="2" sm="1">
                                                                            {(this.state.asiento40 == 'false') ? 
                                                                                (
                                                                                    <button name='40' id='40' type="button" className={(this.state.selected40)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                                )
                                                                                :
                                                                                (
                                                                                    <button type="button" class={(this.state.genero40 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero40 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                                )
                                                                            }
                                                                            <p className="smallDevice text-center">40</p>
                                                                        </Col>
                                                                    )
                                                                    :
                                                                    ''
                                                                }
                                                            </Row>
                                                            {/************************** ASIENTOS 41 - 48 **************************/}
                                                            <Row>
                                                                {
                                                                    (this.state.noAsientos >= 41) ?
                                                                    (
                                                                        <Col xs="2" sm="1">
                                                                            {(this.state.asiento41 == 'false') ? 
                                                                                (
                                                                                    <button name='41' id='41' type="button" className={(this.state.selected41)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                                )
                                                                                :
                                                                                (
                                                                                    <button type="button" class={(this.state.genero41 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero41 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                                )
                                                                            }
                                                                            <p className="smallDevice text-center">41</p>
                                                                        </Col>
                                                                    )
                                                                    :
                                                                    ''
                                                                }
                                                                {
                                                                    (this.state.noAsientos >= 42) ?
                                                                    (
                                                                        <Col xs="2" sm="1">
                                                                            {(this.state.asiento42 == 'false') ? 
                                                                                (
                                                                                    <button name='42' id='42' type="button" className={(this.state.selected42)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                                )
                                                                                :
                                                                                (
                                                                                    <button type="button" class={(this.state.genero42 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero42 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                                )
                                                                            }
                                                                            <p className="smallDevice text-center">42</p>
                                                                        </Col>
                                                                    )
                                                                    :
                                                                    ''
                                                                }
                                                                <Col xs="3">
                                                                </Col>
                                                                {
                                                                    (this.state.noAsientos >= 43) ?
                                                                    (
                                                                        <Col xs="2" sm="1">
                                                                            {(this.state.asiento43 == 'false') ? 
                                                                                (
                                                                                    <button name='43' id='43' type="button" className={(this.state.selected43)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                                )
                                                                                :
                                                                                (
                                                                                    <button type="button" class={(this.state.genero43 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero43 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                                )
                                                                            }
                                                                            <p className="smallDevice text-center">43</p>
                                                                        </Col>
                                                                    )
                                                                    :
                                                                    ''
                                                                }
                                                                {
                                                                    (this.state.noAsientos >= 44) ?
                                                                    (
                                                                        <Col xs="2" sm="1">
                                                                            {(this.state.asiento44 == 'false') ? 
                                                                                (
                                                                                    <button name='44' id='44' type="button" className={(this.state.selected44)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                                )
                                                                                :
                                                                                (
                                                                                    <button type="button" class={(this.state.genero44 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero44 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                                )
                                                                            }
                                                                            <p className="smallDevice text-center">44</p>
                                                                        </Col>
                                                                    )
                                                                    :
                                                                    ''
                                                                }
                                                            </Row>
                                                            <Row>
                                                                {
                                                                    (this.state.noAsientos >= 45) ?
                                                                    (
                                                                        <Col xs="2" sm="1">
                                                                            {(this.state.asiento45 == 'false') ? 
                                                                                (
                                                                                    <button name='45' id='45' type="button" className={(this.state.selected45)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                                )
                                                                                :
                                                                                (
                                                                                    <button type="button" class={(this.state.genero45 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero45 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                                )
                                                                            }
                                                                            <p className="smallDevice text-center">45</p>
                                                                        </Col>
                                                                    )
                                                                    :
                                                                    ''
                                                                }
                                                                {
                                                                    (this.state.noAsientos >= 46) ?
                                                                    (
                                                                        <Col xs="2" sm="1">
                                                                            {(this.state.asiento46 == 'false') ? 
                                                                                (
                                                                                    <button name='46' id='46' type="button" className={(this.state.selected46)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                                )
                                                                                :
                                                                                (
                                                                                    <button type="button" class={(this.state.genero46 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero46 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                                )
                                                                            }
                                                                            <p className="smallDevice text-center">46</p>
                                                                        </Col>
                                                                    )
                                                                    :
                                                                    ''
                                                                }
                                                                <Col xs="3">
                                                                </Col>
                                                                {
                                                                    (this.state.noAsientos >= 47) ?
                                                                    (
                                                                        <Col xs="2" sm="1">
                                                                            {(this.state.asiento47 == 'false') ? 
                                                                                (
                                                                                    <button name='47' id='47' type="button" className={(this.state.selected47)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                                )
                                                                                :
                                                                                (
                                                                                    <button type="button" class={(this.state.genero47 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero47 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                                )
                                                                            }
                                                                            <p className="smallDevice text-center">47</p>
                                                                        </Col>
                                                                    )
                                                                    :
                                                                    ''
                                                                }
                                                                {
                                                                    (this.state.noAsientos >= 48) ?
                                                                    (
                                                                        <Col xs="2" sm="1">
                                                                            {(this.state.asiento48 == 'false') ? 
                                                                                (
                                                                                    <button name='48' id='48' type="button" className={(this.state.selected48)? "btn btn-outline-success asientoSeleccionado":"btn btn-success btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                                )
                                                                                :
                                                                                (
                                                                                    <button type="button" class={(this.state.genero48 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero48 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                                                                )
                                                                            }
                                                                            <p className="smallDevice text-center">48</p>
                                                                        </Col>
                                                                    )
                                                                    :
                                                                    ''
                                                                }
                                                            </Row>
                                                            {/*
                                                                (this.state.noAsientos >= 41) ?
                                                                (
                                                                    <Row>
                                                                    <Col xs="2" sm="1">
                                                                        {(this.state.asiento41 == 'false') ? 
                                                                            (
                                                                                <button name='41' id='41' type="button" className={(this.state.selected41)? "btn btn-outline-success asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                            )
                                                                            :
                                                                            (
                                                                                <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                                                            )
                                                                        }
                                                                        <p className="smallDevice text-center">41</p>
                                                                    </Col>
                                                                    <Col xs="2" sm="1">
                                                                        {(this.state.asiento42 == 'false') ? 
                                                                            (
                                                                                <button name='42' id='42' type="button" className={(this.state.selected42)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
                                                                            )
                                                                            :
                                                                            (
                                                                                <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                                                            )
                                                                        }
                                                                        <p className="smallDevice text-center">42</p>
                                                                    </Col>
                                                                    </Row>
                                                                )
                                                                :
                                                                ''
                                                            */}
                                                            
                                                        {/* FIN Asientos */}
                                                        </Col>
                                                        </Card>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>            
                                    </Col>
                                </Row>
                            </div>
                            <div id="stepThree" className="noactivo">
                                <Row>
                                    <Col lg='12' md='12' sm='12' xs='12'>
                                        <h5 className="text-center">Confirmación de viaje</h5>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="text-center">
                                        <table class="table table-bordered">
                                            <tbody>
                                                <tr>
                                                    <th scope="row">Origen</th>
                                                    <th scope="row">Destino</th>
                                                    <th scope="row">Fecha</th>
                                                    <th scope="row">Asiento</th>
                                                </tr>
                                                <tr>
                                                    <th scope="row">{this.state.labelOrigen}</th>
                                                    <td>{this.state.labelDestino}</td>
                                                    <td>{this.state.fecha}</td>
                                                    <td>{this.state.asiento}</td>
                                                </tr>
                                            </tbody>
                                            </table>
                                    </Col>
                                </Row>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={this.toggle}>Cancelar</Button>
                            <Button color="primary" onClick={this.validarSiguiente}>{this.state.btnSiguiente}</Button>{' '}
                        </ModalFooter>
                    </Modal>
                    {/* FIN Modal Reprogramación */}
                </Container>
            </div>
        )
    }
}