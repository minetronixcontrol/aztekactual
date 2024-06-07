import React from "react";
import ReactDOM from "react-dom";
import ReactWizard from "react-bootstrap-wizard";
import {Redirect} from 'react-router-dom';

import { Button, Badge, Container, Col, CustomInput, Card, CardTitle, CardText, Form, FormGroup, FormText, Input, InputGroupAddon, Label, Modal, ModalHeader, ModalBody, ModalFooter, Row, Table } from "reactstrap";
import Select from 'react-select';
import AsyncSelect from 'react-select/lib/Async';

import GenerarReservacion from "./reservacionPDF";
import WizardCliente from "./TabNewCliente.js";

import "../css/wizardStyles.css";
import "../css/validaciones.css";
import "../css/asientosAutobus.css";
import "../css/styles.css"

ReactWizard.defaultProps = {
    previousButtonText: "Atrás",
    finishButtonText: "Guardar",
    nextButtonText: "Siguiente",
    progressbar: true
};

var tipoDeViaje = "Normal";

var descPacoima = false;

var dllDescPacoima = 0;

var generalData = {
    fechaHoyF: new Date(),
    fechaHoy: '',
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
    nombreCliente: null,
    clienteTipo: null,
    razon: null,
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
        noAsiento: null
    },
    vendedor:{
        id_Usuario: null,
        username: null,
        nombre: null,
        apellidoPaterno: null,
        apellidoMaterno: null,
        sucursal: null,
        tipoDescuento: null,
        seguridad: null
    },
    sucursalVendedor: {
        nombre: null,
        direccion: null,
        tel: null,
        tel2: null,
        correo: null
    },
    noPasajeros: 0
};

var asientos = [];

//FISRT STEP VARS
var optOrigen = [];
var optFechaHora = [];
//ENDS FISRT STEP VARS

//THIRD STEP VARS
var optCliente = [];
var props = [];
var asientos = [];
var optRazon = [
    { value: 'Ciudadano', label: 'Ciudadano' },
    { value: 'Residente', label: 'Residente' },
    { value: 'Turista', label: 'Turista' }
];
var clientes = [];
var pasajeros = [];
var razones = [];
var descuentos = [];
var tiposClientes = [];
var totales = [];
var anticipos = [];
var cambios = [];
var subtotales = [];
var descuentosLabel = [];
//ENDS THIRD STEP VARS

class FirstStep extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //Variables de validacion
            validationOrigen: true,
            validationDestino: true,
            validationFechaHora: true,
            validationCorrida: true,
            validationTipoViaje: true,
            //Otras Variables
            optOrigen: [],
            optDestino: [],
            optFechaHora: [],
            optCorridas: [],
            optTipoViaje: [ { value: 'Normal', label: 'Normal'}],
            hora: '00:00',
            fechaAbierta: false,
            selFecha: false
        }
        //Setters
        this.handleSetOptionsOrigen = this.handleSetOptionsOrigen.bind(this);
        this.handleSetOptionsDestino = this.handleSetOptionsDestino.bind(this);
        /////////
        this.handleChangeOrigen = this.handleChangeOrigen.bind(this);
        this.handleChangeDestino = this.handleChangeDestino.bind(this);
        this.handleChangeFechaHora = this.handleChangeFechaHora.bind(this);
        this.handleChangeFechaAbierta = this.handleChangeFechaAbierta.bind(this);
        this.handleChangeCorrida = this.handleChangeCorrida.bind(this);
        this.handleChangeTipoViaje = this.handleChangeTipoViaje.bind(this);
        /////////
        this.getDiaDelAnio = this.getDiaDelAnio.bind(this);
        this.fetchUsuario = this.fetchUsuario.bind(this);
    }

    isValidated() {
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

        console.log('fecha Abierta',this.state.fechaAbierta);
        console.log('selFecha', this.state.selFecha);

        if(!this.state.fechaAbierta && !this.state.selFecha){
            this.setState({
              validationFechaHora: false
            })
        }

        if(!this.state.fechaAbierta && generalData.detalles.numeroEconomico == null){
            this.setState({
                validationCorrida: false
            })
        }

        if(this.state.fechaAbierta){
            if(generalData.origen.id == null || generalData.destino.id == null){
              return false;
            }else{
              return true;
            }
        }else{
            if(generalData.origen.id == null || generalData.destino.id == null || generalData.detalles.dia == null){
              return false;
            }else{
              return true;
            }
        }
    }

    componentDidMount(){
        this.handleSetOptionsOrigen();
        this.fetchUsuario();
        fetch(`/api/Usuarios/${generalData.vendedor.username}/descFamiliar`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if(data.res){
                    this.setState({
                        optTipoViaje: [
                            { value: 'Normal', label: 'Normal'},
                            { value: 'Familiar', label: 'Familiar'},
                        ]
                    })
                }else{
                    this.setState({
                        optTipoViaje: [
                            { value: 'Normal', label: 'Normal'},
                        ]
                    })
                }
            })
    }

    fetchUsuario(){
        fetch(`/api/Usuarios/${generalData.vendedor.username}`)
            .then(res => res.json())
            .then(data => {
                generalData.vendedor.seguridad = data[0].seguridad;
                this.state.seguridad = data[0].seguridad;
                this.state.idVendedor = data[0]._id;
                this.state.nombreVendedor = `${data[0].nombre} ${data[0].apellidoPaterno} ${data[0].apellidoMaterno}`
               /* if(data[0].seguridad == 'Admin'){
                    //Buscar los usuarios
                    generalData.vendedor.id_Usuario = data[0]._id;
                    generalData.vendedor.username = data[0].nickname;
                    generalData.vendedor.usernameV = data[0].nickname;
                    generalData.vendedor.nombre = data[0].nombre;
                    generalData.vendedor.apellidoPaterno = data[0].apellidoPaterno;
                    generalData.vendedor.apellidoMaterno = data[0].apellidoMaterno;
                    generalData.vendedor.sucursal = data[0].sucursal;
                    generalData.vendedor.tipoDescuento = data[0].tipoDescuento;
                    
                    //this.fetchUsuarios();                    
                }*/
            })
    }

    //Setters
    handleSetOptionsOrigen(){
        fetch('/api/OrigenesYdestinos/true/activo')
        .then(res => res.json())
        .then(data => {
            if(data.length > 0){
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

    handleChangeFechaAbierta(e){
        if(e.target.checked){
          document.getElementById('selectFechaHora').value = '';
        }
        this.setState({ 
            fechaAbierta: e.target.checked,
            validationFechaHora: true 
        });
        
        generalData.detalles.fechaAbierta = e.target.checked
    }
    ///////////

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
            hora: e.hora
        });
        //console.log(generalData.origen.id);
        let pais = (e.pais == 'MX')? 'US' : 'MX';
        //this.handleSetOptionsDestino(pais);
        this.handleSetOptionsDestino(e.value);
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

    handleChangeDestino(e){
        generalData.destino.id = e.value;
        generalData.destino.ciudad = e.label;
        generalData.destino.municipio = e.municipio;
        generalData.destino.estado = e.estado;
        generalData.destino.pais = e.pais;
        generalData.destino.direccion = e.direccion;
        this.setState({
          validationDestino: true
        })
    }

    handleChangeFechaHora(e){
        let selectFechaHora = document.getElementById('selectFechaHora');

        let fechaDeViaje = e.target.value;             
        let arrayFechaDeViaje = fechaDeViaje.split('-', 3);
        let anioFechaDeViaje = arrayFechaDeViaje[0];

        let hoy = new Date();
        let anio = hoy.getFullYear();

        let diaDeHoy = `${anio}-${hoy.getMonth()+1}-${hoy.getDate()}`;
        let diaAnioHoy = this.getDiaDelAnio(`${anio}-01-01`,diaDeHoy);

        //console.log('diaAnioHoy', diaAnioHoy);

        let diaAnioViaje = this.getDiaDelAnio(`${anioFechaDeViaje}-01-01`,fechaDeViaje);

        //console.log('diaAnioViaje', diaAnioViaje);

        if((anioFechaDeViaje < anio) || ((anioFechaDeViaje == anio) && (diaAnioViaje<diaAnioHoy))){//si el anio que seleccionamos es menor al año actual, retornamos false
            this.setState({
                selFecha: false,
                validationFechaHora: false,
            });
            selectFechaHora.value = '';
            return false;
        }else{
            //Ahora verificamos que ya esté abierta la fecha
            //El formato de la fecha debe ser "dd-mm-aaaa"
            let buscarFecha = `${arrayFechaDeViaje[2]}-${arrayFechaDeViaje[1]}-${arrayFechaDeViaje[0]}`;
            fetch(`/api/AsignarViajes/${generalData.origen.id}/${generalData.destino.id}/${buscarFecha}`)
            .then(res => res.json())
            .then(data => {
                if(data.length > 0){
                    this.setState({
                        selFecha: true,
                        optCorridas: data,
                        validationFechaHora: true,
                    });
                }else{
                    this.setState({
                        selFecha: false,
                        validationFechaHora: false,
                    });
                    selectFechaHora.value = '';
                    alert('No hay viaje que coincida, escoge otra fecha o contáctate con la matriz');
                }
            });
        }
    }

    getDiaDelAnio(fechaInicial, fechaFinal){

        let fechaini = new Date(fechaInicial);
        let fechafin = new Date(fechaFinal);
        let diasdif= fechafin.getTime()-fechaini.getTime();
        let contdias = Math.round(diasdif/(1000*60*60*24));

        return (contdias+1);
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

    handleChangeTipoViaje(e){
        console.log(e)
        tipoDeViaje = e.value;
        //console.log('tipoDeViaje',generalData.detalles.tipoDeViaje);
    }

    render () {
        return (
            <div>
                <br/>
                <Row form> 
                   <Col lg={6} md={6} sm={12} xs={12}>
                        <FormGroup check>
                            <CustomInput onChange={this.handleChangeFechaAbierta} type="switch" id="switchFechaAbierta" name="switchFechaAbierta" label="Fecha abierta" />
                        </FormGroup>
                    </Col>
                </Row> 
                <br/>
                <Row>
                    <Col lg={6} md={6} sm={12} xs={12}>
                        <Label for="selectOrigen">Origen:</Label>
                        <div class={(this.state.validationOrigen) ? 'card border-light': 'card border-danger'}>
                            <Select
                            id="selectOrigen"
                            onChange={this.handleChangeOrigen}
                            options={this.state.optOrigen}
                            placeholder = "Selecciona..."
                            />
                        </div>
                        <p class={(this.state.validationOrigen) ? 'textValid': 'textInvalid'}>Selecciona el origen</p>
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={12}>          
                        <Label for="selectDestino">Destino:</Label>
                        <div class={(this.state.validationDestino) ? 'card border-light': 'card border-danger'}>
                            <Select
                            id="selectDestino"
                            onChange={this.handleChangeDestino}
                            options={this.state.optDestino}
                            placeholder = "Selecciona..."
                            />
                        </div>
                        <p class={(this.state.validationDestino) ? 'textValid': 'textInvalid'}>Selecciona el destino</p>
                    </Col>
                </Row>
                <br/>                
                <Row form> 
                    <Col lg={6} md={6} sm={12} xs={12}>
                    <Label for="selectFechaHora">Fecha:</Label>
                    <div class={(this.state.validationFechaHora) ? 'card border-light': 'card border-danger'}>
                        <Input
                            type="date"
                            name="date"
                            id="selectFechaHora"
                            placeholder="date placeholder"
                            onChange={this.handleChangeFechaHora}
                            disabled={this.state.fechaAbierta}
                        />
                    </div>
                    <p class={(this.state.validationFechaHora) ? 'textValid': 'textInvalid'}>Selecciona la fecha</p>
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={12}>
                        <Label for="selectCorrida">Corrida:</Label>
                        <div class={(this.state.validationCorrida) ? 'card border-light': 'card border-danger'}>
                            <Select
                            id="selectCorrida"
                            onChange={this.handleChangeCorrida}
                            options={this.state.optCorridas}
                            placeholder = "Selecciona..."
                            isDisabled={this.state.fechaAbierta}
                            />
                        </div>
                        <p class={(this.state.validationCorrida) ? 'textValid': 'textInvalid'}>Selecciona la corrida</p>
                    </Col>
                </Row>
                <Row form>
                    <Col lg={6} md={6} sm={12} xs={12}>
                        <Label for="selectCorrida">Tipo de Viaje:</Label>
                        <div class={(this.state.validationTipoViaje) ? 'card border-light': 'card border-danger'}>
                            <Select
                            id="selectCorrida"
                            defaultValue={{ value: 'Normal', label: 'Normal'}}
                            onChange={this.handleChangeTipoViaje}
                            options={this.state.optTipoViaje}
                            placeholder = "Selecciona..."
                            />
                        </div>
                        <p class={(this.state.validationTipoViaje) ? 'textValid': 'textInvalid'}>Selecciona el tipo de viaje</p>
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={12}>
                        <Label >Hora:</Label>
                        <Input plaintext value={this.state.hora} readOnly/>
                    </Col>
                </Row>
            </div>
        );
    }
}

class SecondStep extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comprobar: false,
            noAsiento: null,
            noAsientos: null,
            cont: 0,
            fechaAbierta: false,
            //Asientos
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
            //FIN IS SELECTED VARS
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
        }
        this.handleClickComprobar = this.handleClickComprobar.bind(this);
        this.handleSelectAsiento = this.handleSelectAsiento.bind(this);
        //this.selectSeat = this.selectSeat.bind(this);
        this.fetchAsientos = this.fetchAsientos.bind(this);
        this.fetchUsuario = this.fetchUsuario.bind(this);
        this.fetchApartados = this.fetchApartados.bind(this);
        this.setCantidadPasajeros = this.setCantidadPasajeros.bind(this);
    }

    isValidated() {
        if(generalData.detalles.fechaAbierta){
            if(generalData.noPasajeros == 0){
                return false;
            }else{
                return true;
            }
        }else{
            return true;
        }        
    }

    handleClickComprobar(){
        //Primero sacamos la capacidad del camión.
        if(!generalData.detalles.fechaAbierta){
            this.fetchAsientos();
        }else{
            this.setState({
                fechaAbierta: true
            });
        }
        this.setState({
            comprobar: true,
        })
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
        }).then(()=>{
            this.fetchUsuario();
        });
    }

    fetchUsuario(){
        fetch(`/api/Usuarios/${generalData.vendedor.username}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                generalData.vendedor.id_Usuario = data[0]._id;
                generalData.vendedor.nombre = data[0].nombre;
                generalData.vendedor.apellidoPaterno = data[0].apellidoPaterno;
                generalData.vendedor.apellidoMaterno = data[0].apellidoMaterno;
                generalData.vendedor.sucursal = data[0].sucursal;
                generalData.vendedor.tipoDescuento = data[0].tipoDescuento;
                generalData.vendedor.seguridad = data[0].seguridad;
            }).then(() => {
                this.fetchApartados();
            })
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
                            selected1: true
                        });
                        generalData.asientosSelected.selected1 = true;
                    }
                    if(data[i].asiento == 2){
                        this.setState({
                            asiento2: 'false',
                            selected2: true
                        });
                        generalData.asientosSelected.selected2 = true;
                    }
                    if(data[i].asiento == 3){
                        this.setState({
                            asiento3: 'false',
                            selected3: true
                        });
                        generalData.asientosSelected.selected3 = true;
                    }
                    if(data[i].asiento == 4){
                        this.setState({
                            asiento4: 'false',
                            selected4: true
                        });
                        generalData.asientosSelected.selected4 = true;
                    }
                    if(data[i].asiento == 5){
                        this.setState({
                            asiento5: 'false',
                            selected5: true
                        });
                        generalData.asientosSelected.selected5 = true;
                    }
                    if(data[i].asiento == 6){
                        this.setState({
                            asiento6: 'false',
                            selected6: true
                        });
                        generalData.asientosSelected.selected6 = true;
                    }
                    if(data[i].asiento == 7){
                        this.setState({
                            asiento7: 'false',
                            selected7: true
                        });
                        generalData.asientosSelected.selected7 = true;
                    }
                    if(data[i].asiento == 8){
                        this.setState({
                            asiento8: 'false',
                            selected8: true
                        });
                        generalData.asientosSelected.selected8 = true;
                    }
                    if(data[i].asiento == 9){
                        this.setState({
                            asiento9: 'false',
                            selected9: true
                        });
                        generalData.asientosSelected.selected9 = true;
                    }
                    if(data[i].asiento == 10){
                        this.setState({
                            asiento10: 'false',
                            selected10: true
                        });
                        generalData.asientosSelected.selected10 = true;
                    }
                    if(data[i].asiento == 11){
                        this.setState({
                            asiento11: 'false',
                            selected11: true
                        });
                        generalData.asientosSelected.selected11 = true;
                    }
                    if(data[i].asiento == 12){
                        this.setState({
                            asiento12: 'false',
                            selected12: true
                        });
                        generalData.asientosSelected.selected12 = true;
                    }
                    if(data[i].asiento == 13){
                        this.setState({
                            asiento13: 'false',
                            selected13: true
                        });
                        generalData.asientosSelected.selected13 = true;
                    }
                    if(data[i].asiento == 14){
                        this.setState({
                            asiento14: 'false',
                            selected14: true
                        });
                        generalData.asientosSelected.selected14 = true;
                    }
                    if(data[i].asiento == 15){
                        this.setState({
                            asiento15: 'false',
                            selected15: true
                        });
                        generalData.asientosSelected.selected15 = true;
                    }
                    if(data[i].asiento == 16){
                        this.setState({
                            asiento16: 'false',
                            selected16: true
                        });
                        generalData.asientosSelected.selected16 = true;
                    }
                    if(data[i].asiento == 17){
                        this.setState({
                            asiento17: 'false',
                            selected17: true
                        });
                        generalData.asientosSelected.selected17 = true;
                    }
                    if(data[i].asiento == 18){
                        this.setState({
                            asiento18: 'false',
                            selected18: true
                        });
                        generalData.asientosSelected.selected18 = true;
                    }
                    if(data[i].asiento == 19){
                        this.setState({
                            asiento19: 'false',
                            selected19: true
                        });
                        generalData.asientosSelected.selected19 = true;
                    }
                    if(data[i].asiento == 20){
                        this.setState({
                            asiento20: 'false',
                            selected20: true
                        });
                        generalData.asientosSelected.selected20 = true;
                    }
                    if(data[i].asiento == 21){
                        this.setState({
                            asiento21: 'false',
                            selected21: true
                        });
                        generalData.asientosSelected.selected21 = true;
                    }
                    if(data[i].asiento == 22){
                        this.setState({
                            asiento22: 'false',
                            selected22: true
                        });
                        generalData.asientosSelected.selected22 = true;
                    }
                    if(data[i].asiento == 23){
                        this.setState({
                            asiento23: 'false',
                            selected23: true
                        });
                        generalData.asientosSelected.selected23 = true;
                    }
                    if(data[i].asiento == 24){
                        this.setState({
                            asiento24: 'false',
                            selected24: true
                        });
                        generalData.asientosSelected.selected24 = true;
                    }
                    if(data[i].asiento == 25){
                        this.setState({
                            asiento25: 'false',
                            selected25: true
                        });
                        generalData.asientosSelected.selected25 = true;
                    }
                    if(data[i].asiento == 26){
                        this.setState({
                            asiento26: 'false',
                            selected26: true
                        });
                        generalData.asientosSelected.selected26 = true;
                    }
                    if(data[i].asiento == 27){
                        this.setState({
                            asiento27: 'false',
                            selected27: true
                        });
                        generalData.asientosSelected.selected27 = true;
                    }
                    if(data[i].asiento == 28){
                        this.setState({
                            asiento28: 'false',
                            selected28: true
                        });
                        generalData.asientosSelected.selected28 = true;
                    }
                    if(data[i].asiento == 29){
                        this.setState({
                            asiento29: 'false',
                            selected29: true
                        });
                        generalData.asientosSelected.selected29 = true;
                    }
                    if(data[i].asiento == 30){
                        this.setState({
                            asiento30: 'false',
                            selected30: true
                        });
                        generalData.asientosSelected.selected30 = true;
                    }
                    if(data[i].asiento == 31){
                        this.setState({
                            asiento31: 'false',
                            selected31: true
                        });
                        generalData.asientosSelected.selected31 = true;
                    }
                    if(data[i].asiento == 32){
                        this.setState({
                            asiento32: 'false',
                            selected32: true
                        });
                        generalData.asientosSelected.selected32 = true;
                    }
                    if(data[i].asiento == 33){
                        this.setState({
                            asiento33: 'false',
                            selected33: true
                        });
                        generalData.asientosSelected.selected33 = true;
                    }
                    if(data[i].asiento == 34){
                        this.setState({
                            asiento34: 'false',
                            selected34: true
                        });
                        generalData.asientosSelected.selected34 = true;
                    }
                    if(data[i].asiento == 35){
                        this.setState({
                            asiento35: 'false',
                            selected35: true
                        });
                        generalData.asientosSelected.selected35 = true;
                    }
                    if(data[i].asiento == 36){
                        this.setState({
                            asiento36: 'false',
                            selected36: true
                        });
                        generalData.asientosSelected.selected36 = true;
                    }
                    if(data[i].asiento == 37){
                        this.setState({
                            asiento37: 'false',
                            selected37: true
                        });
                        generalData.asientosSelected.selected37 = true;
                    }
                    if(data[i].asiento == 38){
                        this.setState({
                            asiento38: 'false',
                            selected38: true
                        });
                        generalData.asientosSelected.selected38 = true;
                    }
                    if(data[i].asiento == 39){
                        this.setState({
                            asiento39: 'false',
                            selected39: true
                        });
                        generalData.asientosSelected.selected39 = true;
                    }
                    if(data[i].asiento == 40){
                        this.setState({
                            asiento40: 'false',
                            selected40: true
                        });
                        generalData.asientosSelected.selected40 = true;
                    }
                    if(data[i].asiento == 41){
                        this.setState({
                            asiento41: 'false',
                            selected41: true
                        });
                        generalData.asientosSelected.selected41 = true;
                    }
                    if(data[i].asiento == 42){
                        this.setState({
                            asiento42: 'false',
                            selected42: true
                        });
                        generalData.asientosSelected.selected42 = true;
                    }
                    if(data[i].asiento == 43){
                        this.setState({
                            asiento43: 'false',
                            selected43: true
                        });
                        generalData.asientosSelected.selected43 = true;
                    }
                    if(data[i].asiento == 44){
                        this.setState({
                            asiento44: 'false',
                            selected44: true
                        });
                        generalData.asientosSelected.selected44 = true;
                    }
                    if(data[i].asiento == 45){
                        this.setState({
                            asiento45: 'false',
                            selected45: true
                        });
                        generalData.asientosSelected.selected45 = true;
                    }
                    if(data[i].asiento == 46){
                        this.setState({
                            asiento46: 'false',
                            selected46: true
                        });
                        generalData.asientosSelected.selected46 = true;
                    }
                    if(data[i].asiento == 47){
                        this.setState({
                            asiento47: 'false',
                            selected47: true
                        });
                        generalData.asientosSelected.selected47 = true;
                    }
                    if(data[i].asiento == 48){
                        this.setState({
                            asiento48: 'false',
                            selected48: true
                        });
                        generalData.asientosSelected.selected48 = true;
                    }
                }
            }
        })
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
                                selected1: true
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
                                selected2: true
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
                                    selected3: true
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
                                    selected4: true
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
                                    selected5: true
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
                                    selected6: true
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
                                    selected7: true
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
                                    selected8: true
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
                                    selected9: true
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
                                    selected10: true
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
                                    selected11: true
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
                                    selected12: true
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
                                    selected13: true
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
                                    selected14: true
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
                                    selected15: true
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
                                    selected16: true
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
                                    selected17: true
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
                                    selected18: true
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
                                    selected19: true
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
                                    selected20: true
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
                                    selected21: true
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
                                    selected22: true
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
                                    selected23: true
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
                                    selected24: true
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
                                    selected25: true
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
                                    selected26: true
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
                                    selected27: true
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
                                    selected28: true
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
                                    selected29: true
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
                                    selected30: true
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
                                    selected31: true
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
                                    selected32: true
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
                                    selected33: true
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
                                    selected34: true
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
                                    selected35: true
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
                                    selected36: true
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
                                    selected37: true
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
                                    selected38: true
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
                                    selected39: true
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
                                    selected40: true
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
                                    selected41: true
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
                                    selected42: true
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
                                    selected43: true
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
                                    selected44: true
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
                                    selected45: true
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
                                    selected46: true
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
                                    selected47: true
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
                                    selected48: true
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

    setCantidadPasajeros(e){
        generalData.noPasajeros = e.target.value
    }

    render () {
        return (
            <div className="text-center">
                {/* Simbologia */}
                <Row>
                    <Col md="4" xs="4" sm="4" lg="4">
                        <Button outline color="danger"><i className="fa fa-check" /></Button>{' '}
                    </Col>
                    <Col md="4" xs="4" sm="4" lg="4">
                        <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                    </Col>
                    <Col md="4" xs="4" sm="4" lg="4">
                        <Button color="danger" size="lg" className="asientoDisponible asiento">{'  '}</Button>
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
                                <CardTitle>Seleccione los lugares</CardTitle>
                                <br/>
                                <div>
                                    <Button disabled={this.state.comprobar} onClick={this.handleClickComprobar} size="lg" outline color="info">Actualizar</Button>
                                </div>
                                <br/>
                                <Col xs="12" sm="12" md="12" lg="12">
                                    {
                                        (this.state.fechaAbierta)? 
                                            (
                                                <div>
                                                    <h6>La reservación de asientos no está disponible para fecha abierta.
                                                        <br/>
                                                        Ingresa la cantidad de personas para continuar
                                                    </h6>
                                                    <Row>
                                                        <Col xs="12" sm="12" md={{ size:6, offset:3 }} lg={{ size:6, offset:3 }}>
                                                            <FormGroup>
                                                                <Input type="number" min="1" max="38" onChange={this.setCantidadPasajeros} name="inputPasajeros" id="inputPasajeros" placeholder="Cantidad de pasajeros" />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            )
                                        :
                                            (
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
                                                                <button name='1' id='1' type="button" className={(this.state.selected1)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                <button name='2' id='2' type="button" className={(this.state.selected2)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                <button name='3' id='3' type="button" className={(this.state.selected3)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                <button name='4' id='4' type="button" className={(this.state.selected4)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                <button name='5' id='5' type="button" className={(this.state.selected5)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                <button name='6' id='6' type="button" className={(this.state.selected6)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                <button name='7' id='7' type="button" className={(this.state.selected7)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                <button name='8' id='8' type="button" className={(this.state.selected8)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                <button name='9' id='9' type="button" className={(this.state.selected9)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                <button name='10' id='10' type="button" className={(this.state.selected10)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                <button name='11' id='11' type="button" className={(this.state.selected11)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                <button name='12' id='12' type="button" className={(this.state.selected12)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                <button name='13' id='13' type="button" className={(this.state.selected13)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                <button name='14' id='14' type="button" className={(this.state.selected14)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                <button name='15' id='15' type="button" className={(this.state.selected15)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                <button name='16' id='16' type="button" className={(this.state.selected16)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                <button name='17' id='17' type="button" className={(this.state.selected17)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                <button name='18' id='18' type="button" className={(this.state.selected18)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                <button name='19' id='19' type="button" className={(this.state.selected19)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                <button name='20' id='20' type="button" className={(this.state.selected20)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                <button name='21' id='21' type="button" className={(this.state.selected21)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                <button name='22' id='22' type="button" className={(this.state.selected22)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                <button name='23' id='23' type="button" className={(this.state.selected23)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                <button name='24' id='24' type="button" className={(this.state.selected24)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                <button name='25' id='25' type="button" className={(this.state.selected25)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                <button name='26' id='26' type="button" className={(this.state.selected26)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                <button name='27' id='27' type="button" className={(this.state.selected27)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                <button name='28' id='28' type="button" className={(this.state.selected28)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                <button name='29' id='29' type="button" className={(this.state.selected29)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                <button name='30' id='30' type="button" className={(this.state.selected30)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                <button name='31' id='31' type="button" className={(this.state.selected31)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                <button name='32' id='32' type="button" className={(this.state.selected32)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                <button name='33' id='33' type="button" className={(this.state.selected33)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                <button name='34' id='34' type="button" className={(this.state.selected34)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                <button name='35' id='35' type="button" className={(this.state.selected35)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                <button name='36' id='36' type="button" className={(this.state.selected36)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                    <button name='37' id='37' type="button" className={(this.state.selected37)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                    <button name='38' id='38' type="button" className={(this.state.selected38)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                            <button name='39' id='39' type="button" className={(this.state.selected39)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                            <button name='40' id='40' type="button" className={(this.state.selected40)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                            <button name='41' id='41' type="button" className={(this.state.selected41)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                            <button name='42' id='42' type="button" className={(this.state.selected42)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                            <button name='43' id='43' type="button" className={(this.state.selected43)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                            <button name='44' id='44' type="button" className={(this.state.selected44)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                            <button name='45' id='45' type="button" className={(this.state.selected45)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                            <button name='46' id='46' type="button" className={(this.state.selected46)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                            <button name='47' id='47' type="button" className={(this.state.selected47)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                            <button name='48' id='48' type="button" className={(this.state.selected48)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                                                        <button name='41' id='41' type="button" className={(this.state.selected41)? "btn btn-outline-danger asientoSeleccionado":"btn btn-danger btn-lg asientoDisponible"} onClick={this.handleSelectAsiento}></button>
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
                                            )
                                    }
                                </Col>                        
                            </Card>
                        </div>
                    </Col>
                </Row>                
            </div>
        );
    }
}

class ThirdStep extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            validationActualizar: false,
            modal: false,
            clientes: [],
            optCliente: [],
            optDescuento: [],
            fechaAbierta: false,
            resultPasajeros: [],
            pasajeros: [],
            asientosPorOcupar: '',
            busqueda: '',
            nombreBusqueda: '',
            apaternoBusqueda: '',
            amaternoBusqueda: '',
        };

        this.actualizar = this.actualizar.bind(this);
        this.buscarPasajeros = this.buscarPasajeros.bind(this);
        this.handleOnChangeNombreBusqueda = this.handleOnChangeNombreBusqueda.bind(this);
        this.handleOnChangeApaternoBusqueda = this.handleOnChangeApaternoBusqueda.bind(this);
        this.handleOnChangeAmaternoBusqueda = this.handleOnChangeAmaternoBusqueda.bind(this);
        this.handleAddPasajero = this.handleAddPasajero.bind(this);
        this.deletePasajero = this.deletePasajero.bind(this);
        this.comprobarRangoDeFecha = this.comprobarRangoDeFecha.bind(this);
        this.toggle = this.toggle.bind(this);
        this.fetchUser = this.fetchUser.bind(this);
        this.handleOnChangeAsiento = this.handleOnChangeAsiento.bind(this);
        this.handleOnChangeRazon = this.handleOnChangeRazon.bind(this);
        this.handleOnChangeDescuento = this.handleOnChangeDescuento.bind(this);
        this.actualizarListaClientes = this.actualizarListaClientes.bind(this);
    }

    componentDidMount(){
        pasajeros = [];
    }

    comprobarRangoDeFecha(fechaAnterior, fechaPosterior, FechaActual){

        if(FechaActual >= fechaAnterior && fechaAnterior <= fechaPosterior){
            console.log('Se encuentra entre el rango de fechas');
            return true
        }else{
            console.log('NO Se encuentra entre el rango de fechas');
            return false
        }
    }

    toggle() {
        this.setState(prevState => ({
        modal: !prevState.modal
        }));
    }

    fetchUser(){
        fetch(`/api/Usuarios/${generalData.vendedor.username}/descuentosVenta`)
          .then(res => res.json())
          .then(data => {
              console.log('descuentos', data);
              generalData.vendedor.id_Usuario = data.usuario.id_Usuario;
              generalData.vendedor.nombre = `${data.usuario.nombre} ${data.usuario.apellidoPaterno} ${data.usuario.apellidoMaterno}`;
              generalData.vendedor.apellidoPaterno = data.usuario.apellidoPaterno;
              generalData.vendedor.apellidoMaterno = data.usuario.apellidoMaterno;
              generalData.vendedor.sucursal = data.usuario.sucursal;
              generalData.vendedor.tipoDescuento = data.usuario.tipoDescuento;
              ///////////////SUCURSAL
              generalData.sucursalVendedor.direccion = data.sucursal.direccion;
              generalData.sucursalVendedor.tel =  data.sucursal.tel;
              generalData.sucursalVendedor.tel2 = data.sucursal.tel2;
              generalData.sucursalVendedor.correo = data.sucursal.correo;
              generalData.sucursalVendedor.nombre = data.sucursal.nombre;
              //////////////DESCUENTOS
              console.log('descuentos', data.descuentos);
              this.setState({
                optDescuento : data.descuentos
              })
              
          })
    }

    handleOnChangeAsiento(e){
        let index = e.target.id;
        let value = e.target.value;
        console.log('index', e.target.id);
        console.log('asiento', e.target.value);
        pasajeros[index].asiento = value;
        this.setState({
            pasajeros: pasajeros
        })
    }

    handleOnChangeRazon(e){
        let index = e.target.id;
        let value = e.target.value;
        console.log('index', e.target.id);
        console.log('razon', e.target.value);
        razones[index].razon = value;
    }
    
    handleOnChangeDescuento(e){
        let i = e.target.selectedIndex;
        let tex = (e.target.options[i].text);
        let index = e.target.id;
        descuentos[index].descuento = (descPacoima)? 0 :  e.target.value;
        descuentosLabel[index] = tex;
    }

    handleOnChangeNombreBusqueda(e){
        this.setState({
            nombreBusqueda: e.target.value
        })
    }

    handleOnChangeApaternoBusqueda(e){
        this.setState({
            apaternoBusqueda: e.target.value
        })
    }

    handleOnChangeAmaternoBusqueda(e){
        this.setState({
            amaternoBusqueda: e.target.value
        })
    }

    actualizar(){
        this.fetchUser();
        this.setState({
            validationActualizar: true,
            fechaAbierta: generalData.detalles.fechaAbierta
        });
        props = [];
        let auxAsientosPorOcupar = '';
        if(generalData.detalles.fechaAbierta){
            for (let i = 0; i < generalData.noPasajeros; i++) {
                props.push(i);
                asientos.push(i);
            }
            this.setState({
                clientes: props
            });
        }else{            
            asientos = [];
            props = [];
            for (const prop in generalData.asientosSelected) {
                if(prop == 'selected1'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(1);
                        auxAsientosPorOcupar+='1, '
                    }
                }
                if(prop == 'selected2'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(2);
                        auxAsientosPorOcupar+='2, '
                    }
                }
                if(prop == 'selected3'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(3);
                        auxAsientosPorOcupar+='3, '
                    }
                }
                if(prop == 'selected4'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(4);
                        auxAsientosPorOcupar+='4, '
                    }
                }
                if(prop == 'selected5'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(5);
                        auxAsientosPorOcupar+='5, '
                    }
                }
                if(prop == 'selected6'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(6);
                        auxAsientosPorOcupar+='6, '
                    }
                }
                if(prop == 'selected7'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(7);
                        auxAsientosPorOcupar+='7, '
                    }
                }
                if(prop == 'selected8'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(8);
                        auxAsientosPorOcupar+='8, '
                    }
                }
                if(prop == 'selected9'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(9);
                        auxAsientosPorOcupar+='9, '
                    }
                }
                if(prop == 'selected10'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(10);
                        auxAsientosPorOcupar+='10, '
                    }
                }
                if(prop == 'selected11'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(11);
                        auxAsientosPorOcupar+='11, '
                    }
                }
                if(prop == 'selected12'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(12);
                        auxAsientosPorOcupar+='12, '
                    }
                }
                if(prop == 'selected13'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(13);
                        auxAsientosPorOcupar+='13, '
                    }
                }
                if(prop == 'selected14'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(14);
                        auxAsientosPorOcupar+='14, '
                    }
                }
                if(prop == 'selected15'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(15);
                        auxAsientosPorOcupar+='15, '
                    }
                }
                if(prop == 'selected16'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(16);
                        auxAsientosPorOcupar+='16, '
                    }
                }
                if(prop == 'selected17'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(17);
                        auxAsientosPorOcupar+='17, '
                    }
                }
                if(prop == 'selected18'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(18);
                        auxAsientosPorOcupar+='18, '
                    }
                }
                if(prop == 'selected19'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(19);
                        auxAsientosPorOcupar+='19, '
                    }
                }
                if(prop == 'selected20'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(20);
                        auxAsientosPorOcupar+='20, '
                    }
                }
                if(prop == 'selected21'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(21);
                        auxAsientosPorOcupar+='21, '
                    }
                }
                if(prop == 'selected22'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(22);
                        auxAsientosPorOcupar+='22, '
                    }
                }
                if(prop == 'selected23'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(23);
                        auxAsientosPorOcupar+='23, '
                    }
                }
                if(prop == 'selected24'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(24);
                        auxAsientosPorOcupar+='24, '
                    }
                }
                if(prop == 'selected25'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(25);
                        auxAsientosPorOcupar+='25, '
                    }
                }
                if(prop == 'selected26'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(26);
                        auxAsientosPorOcupar+='26, '
                    }
                }
                if(prop == 'selected27'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(27);
                        auxAsientosPorOcupar+='27, '
                    }
                }
                if(prop == 'selected28'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(28);
                        auxAsientosPorOcupar+='28, '
                    }
                }
                if(prop == 'selected29'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(29);
                        auxAsientosPorOcupar+='29, '
                    }
                }
                if(prop == 'selected30'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(30);
                        auxAsientosPorOcupar+='30, '
                    }
                }
                if(prop == 'selected31'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(31);
                        auxAsientosPorOcupar+='31, '
                    }
                }
                if(prop == 'selected32'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(32);
                        auxAsientosPorOcupar+='32, '
                    }
                }
                if(prop == 'selected33'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(33);
                        auxAsientosPorOcupar+='33, '
                    }
                }
                if(prop == 'selected34'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(34);
                        auxAsientosPorOcupar+='34, '
                    }
                }
                if(prop == 'selected35'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(35);
                        auxAsientosPorOcupar+='35, '
                    }
                }
                if(prop == 'selected36'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(36);
                        auxAsientosPorOcupar+='36, '
                    }
                }
                if(prop == 'selected37'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(37);
                        auxAsientosPorOcupar+='37, '
                    }
                }
                if(prop == 'selected38'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(38);
                        auxAsientosPorOcupar+='38, '
                    }
                }
                if(prop == 'selected39'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(39);
                        auxAsientosPorOcupar+='39, '
                    }
                }
                if(prop == 'selected40'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(40);
                        auxAsientosPorOcupar+='40, '
                    }
                }
                if(prop == 'selected41'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(41);
                        auxAsientosPorOcupar+='41, '
                    }
                }
                if(prop == 'selected42'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(42);
                        auxAsientosPorOcupar+='42, '
                    }
                }
                if(prop == 'selected43'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(43);
                        auxAsientosPorOcupar+='43, '
                    }
                }
                if(prop == 'selected44'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(44);
                        auxAsientosPorOcupar+='44, '
                    }
                }
                if(prop == 'selected45'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(45);
                        auxAsientosPorOcupar+='45, '
                    }
                }
                if(prop == 'selected46'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(46);
                        auxAsientosPorOcupar+='46, '
                    }
                }
                if(prop == 'selected47'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(47);
                        auxAsientosPorOcupar+='47, '
                    }
                }
                if(prop == 'selected48'){
                    if(generalData.asientosSelected[prop]){
                        props.push(generalData.asientosSelected[prop]);
                        asientos.push(48);
                        auxAsientosPorOcupar+='48, '
                    }
                }
            }
            this.setState({
                clientes: props
            });
            console.log(this.state.clientes);
            generalData.noPasajeros = props.length;
        }
        if(tipoDeViaje=="Familiar" && props.length < 5){
            alert('Para ser acreedor del descuento familiar necesitas 5 o más pasajeros');
        }
        this.setState({
            asientosPorOcupar: auxAsientosPorOcupar
        })
    }

    buscarPasajeros(){
        let nom = 'null';
        let ap = 'null';
        let am = 'null';

        if(this.state.nombreBusqueda != ''){
            nom = this.state.nombreBusqueda
        }

        if(this.state.apaternoBusqueda != ''){
            ap = this.state.apaternoBusqueda
        }

        if(this.state.amaternoBusqueda != ''){
            am = this.state.amaternoBusqueda
        }

        fetch(`/api/Clientes/${nom}/${ap}/${am}/`)
        .then(res => res.json())
        .then(data => {
            this.setState({
                resultPasajeros: data
            })
        })
        .then(() => {
            console.log('resultPasajeros', this.state.resultPasajeros);
        } )
    }

    handleAddPasajero(idCliente, NombreCliente, listaNegra, clienteFrecuente, tipo, type){
        if(asientos.length == pasajeros.length){
            alert('No puedes agregar más pasajeros');
        }else{
            if(listaNegra == 'true'){
                alert('Ver detalle en lista Negra para este cliente');
            }
            pasajeros.push({
                'asiento': 0,
                'idCliente': idCliente,
                'nombre': NombreCliente,
                'tipoDeCliente': tipo,
                'clienteFrecuente': clienteFrecuente,
                'typeClient': type
            });

            razones.push({
                'razon': 'razon'
            });

            descuentos.push({
                'descuento': 0
            });

            descuentosLabel.push('');

            this.setState({
                pasajeros: pasajeros
            });
        }
    }

    deletePasajero(nombre, index){
        if (confirm('En verdad desea quitar al pasajero '+nombre)) {
            pasajeros.splice(index, 1);
            descuentos.splice(index, 1);
            razones.splice(index, 1);
            descuentosLabel.splice(index, 1);
            this.setState({
                pasajeros: pasajeros
            });
        }
    }

    actualizarListaClientes(clienteNuevo){
        let tipo = '';
        if(clienteNuevo.type == 'Niño'){
            tipo = 'nino';
        }else if(clienteNuevo.type == 'INSEN'){
            tipo = 'adultoM';
        }else if(clienteNuevo.type == 'Adulto'){
            tipo = 'adulto';
        }
        this.handleAddPasajero(clienteNuevo.value, clienteNuevo.name, clienteNuevo.listaNegra, clienteNuevo.clienteFrecuente, tipo ,clienteNuevo.type);
    }

    render () {

        return (
            <div>
                <br/>
                <Row>
                    <Col lg='12' md='12' sm='12' xs='12' className="text-center">
                        <Button onClick={this.actualizar} size="lg" outline color="info">Actualizar</Button>
                    </Col>
                </Row>
                <br/>
                <Row>
                {
                    (generalData.vendedor.seguridad == 'Admin')?
                    <Col lg='12' md='12' sm='12' xs='12' className="text-center">
                        <p className="text-center">Vendedor: { (this.state.validationActualizar)? generalData.vendedor.nombre : '' }</p>
                    </Col>
                    :
                    ''
                }
                </Row>
                {
                    (this.state.validationActualizar)?
                    <div>
                        <Row>
                            <Col lg='8' md='8' sm='8' xs='8'>
                                <h5>Buscar Pasajero:</h5>
                                <Form inline>
                                    <FormGroup>
                                        <Input onChange={this.handleOnChangeNombreBusqueda} type="text" placeholder="Nombre" />
                                    </FormGroup>
                                    {' '}
                                    <FormGroup>
                                        <Input onChange={this.handleOnChangeApaternoBusqueda} type="text" placeholder="Apellido Paterno" />
                                    </FormGroup>
                                    {' '}
                                    <FormGroup>
                                        <Input onChange={this.handleOnChangeAmaternoBusqueda} type="text" id="busquedaPasajero" placeholder="Apellido Materno"/>
                                        <InputGroupAddon addonType="append"><Button onClick={this.buscarPasajeros} color="secondary"><i className="fa fa-search"/></Button></InputGroupAddon>
                                    </FormGroup>
                                    {' '}
                                </Form>
                            </Col>
                            <Col className="btn-nuevoPasajero" lg='4' md='4' sm='4' xs='4'>
                                <Button color="primary" onClick={this.toggle}>Nuevo Pasajero <i className="fa fa-user-plus"/></Button>
                            </Col>
                        </Row>
                        <br/>
                        <Row>
                            <Col lg='6' md='6' sm='12' xs='12'><h5>Resultados de la búsqueda:</h5></Col>
                            <Col lg='6' md='6' sm='12' xs='12'>
                                <span className="dot nino"></span>{' Niño '}<span className="dot adulto"></span>{' Adulto '}<span className="dot adultoM"></span>{' Adulto Mayor '}
                            </Col>
                        </Row>
                        <br/>
                        <Row>
                            <Col lg='12' md='12' sm='12' xs='12'>
                                <Table responsive hover>
                                    <thead>
                                        <tr>
                                        <th className="text-center">+</th>
                                        <th>Nombre</th>
                                        <th>Fecha de Nacimiento</th>
                                        <th>Teléfono</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.resultPasajeros.map((pasajero, i) => 
                                        <tr key={i}>
                                            <td className="text-center">
                                                <Button className="btn-sm" color="success" onClick={() => this.handleAddPasajero(pasajero.value, pasajero.name, pasajero.listaNegra, pasajero.clienteFrecuente, pasajero.simbologia, pasajero.type)}><i className="fa fa-plus"/></Button>
                                            </td>
                                            <td><span className={'dot '+pasajero.simbologia}/>{' '+pasajero.name}</td>
                                            <td>{pasajero.label}</td>
                                            <td>{pasajero.telefono}</td>
                                        </tr>)}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                        <br/>
                        <Row>
                            <Col lg='12' md='12' sm='12' xs='12'>
                                <h5>Pasajero(s) en esta venta:</h5>
                                {
                                    (this.state.fechaAbierta)? '' : <p>Asiento(s) por ocupar: {this.state.asientosPorOcupar}</p>
                                }
                                <Table responsive hover>
                                    <thead>
                                        <tr>
                                            <th>Pasajero</th>
                                            {
                                                (this.state.fechaAbierta)? '' : <th>Asiento</th>
                                            }
                                            <th>Razón</th>
                                            <th>Descuento</th>
                                            <th className="text-center">Quitar</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.pasajeros.map((client, i) => 
                                        <tr key={`${i}-${client.idCliente}`}>
                                            <td><span className={'dot '+client.tipoDeCliente}/>{' '+client.nombre}</td>
                                            {
                                                (this.state.fechaAbierta)? 
                                                ''
                                                :
                                                <td>
                                                    <select id={i} onChange={this.handleOnChangeAsiento} class="form-control">
                                                        <option value={0}>Asiento</option>
                                                        {asientos.map((asiento, j) => 
                                                            <option key={`${i}-${asiento}`} value={asiento}>{asiento}</option>
                                                        )}
                                                    </select>
                                                </td>
                                            }
                                            <td>
                                                <select id={i} onChange={this.handleOnChangeRazon} class="form-control">
                                                    <option value="razon">Razón</option>
                                                    <option value="Ciudadano">Ciudadano</option>
                                                    <option value="Residente">Residente</option>
                                                    <option value="Turista">Turista</option>
                                                </select>
                                            </td>
                                            <td>
                                                <select id={i} onChange={this.handleOnChangeDescuento} class="form-control">
                                                    {this.state.optDescuento.map((descuento, i) => 
                                                        <option key={`${i}-${descuento.label}`} value={descuento.desc}>{descuento.label}</option>
                                                    )}
                                                </select>
                                            </td>
                                            <td className="text-center"><Button name={client.nombre} className="btn-sm" color="danger" onClick={() => this.deletePasajero(client.nombre, i)}><i className="fa fa-trash-alt"/></Button></td>
                                        </tr>)}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </div>
                    :
                    ''
                }
                {/* MODAL NUEVO CLIENTE */}
                <Modal size="lg" isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Nuevo Cliente</ModalHeader>
                    <WizardCliente toggle={this.toggle} refresh={this.actualizarListaClientes} usuario={generalData.vendedor.id_Usuario}></WizardCliente>
                </Modal>
                {/* FIN MODAL NUEVO CLIENTE */}
            </div>
        );
    }
}

class FourthStep extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            actualizar: false,
            click: 0,
            validationPago: true,
            tipoDeCambio: 'US',
            subtotal: null,
            descuentoNeto: null,
            total: null,
            cambio: 0.00,
            noAsientos: 0,
            clientes: [],
            subtotales: [],
            totales: [],
            anticipos: [],
            cambios: [],
            tipoDeViaje: 'Normal',
            solicitud: false,
            idSolicitud: '',
            montoDescuentoFamiliar: 0
        };
        this.handleOnChangeIdioma = this.handleOnChangeIdioma.bind(this);
        this.handleClickActualizar = this.handleClickActualizar.bind(this);
        this.handleOnChangePago = this.handleOnChangePago.bind(this);
        this.handleOnChangeTipoDeCambio = this.handleOnChangeTipoDeCambio.bind(this);
    }

    isValidated(){
        if(generalData.vendedor.seguridad != 'Ventas' && generalData.vendedor.seguridad != 'Reservaciones'){
            //Verificamos que ya se haya actualizado y que el click sea
            //console.log('Somos admin');
            if(this.state.actualizar){
                if(this.state.click < 1){
                    for (let i = 0; i < pasajeros.length; i++) {
                        console.log('anticipos[i]', anticipos[i]);
                        if(anticipos[i] === undefined){
                            alert('Ingresar anticipo del pasajero '+pasajeros[i].nombre);
                            return false
                        }
                    }
                    this.setState(prevState => ({
                        click: prevState.click + 1
                    }));
                    return true;
                }else{
                    return false;
                }
            }else{
                return false;
            }
        }else{
            for (let i = 0; i < pasajeros.length; i++) {
                if(anticipos[i] === undefined){
                    alert('Ingresar anticipo del pasajero '+pasajeros[i].nombre);
                    return false
                }
                if((parseFloat(anticipos[i]) < parseFloat(totales[i])/2)){
                    alert('Para finalizar la reservacion, el cliente '+pasajeros[i].nombre+' debe dejar al menos el 50% del total');
                    return false;
                }
            }
            this.setState(prevState => ({
                click: prevState.click + 1
            }));
            return true;
        }
    }

    handleOnChangeIdioma(e){
        generalData.idioma = e.target.value;
    }

    handleOnChangePago(e){
        console.log(e.target.value);
        let id = e.target.id;
        let index = id.split('-');
        index = parseInt(index[1]);
        console.log(index);
        this.setState({
          pago: e.target.value
        });
    
        if(parseFloat(e.target.value) > parseFloat(totales[index])){
            cambios[index] = parseFloat(e.target.value) - parseFloat(totales[index]);
            anticipos[index] = totales[index];
          this.setState({
            cambio: (parseFloat(e.target.value) - parseFloat(this.state.total))
          });
          generalData.cobro.anticipo = generalData.cobro.total;
        }else{
            anticipos[index] = e.target.value;
            cambios[index] = '';
          generalData.cobro.anticipo = e.target.value;
          this.setState({
            cambio: ''
          })
        }
    }

    handleClickActualizar(e){
        let precioDeBoleto = 0;
        let descuentoFamiliar = false;
        this.setState({
            tipoDeViaje: tipoDeViaje,
            clientes: pasajeros,
            noAsientos: generalData.noPasajeros,
        });
        if(this.state.solicitud){
            fetch(`/api/DescuentoFamiliar/${this.state.idSolicitud}`)
                .then(res => res.json())
                .then(data => {
                    console.log('data', data);
                    if(data.status == 'true'){
                        descuentoFamiliar = true
                    }else{
                        alert('Tu solicitud aún no ha sido aprovada, comunicate con la matriz');
                    }
                })
        }
        if(descPacoima){
            alert(`Has seleccionado el tipo de descuento para Pacoima, los boletos tienen un costo de ${dllDescPacoima}`);
        }
        let tipoDeCambio = e.target.value;
        fetch(`/api/Dollar/`)
            .then(res => res.json())
            .then(data => {
                if(data.length > 0){
                    generalData.precioDollar = parseFloat(data[0].precioDollar);
                }
            })
            .then(()=>{
                fetch(`/api/Precios/${generalData.origen.id}/${generalData.destino.id}`)
                    .then(res => res.json())
                    .then(data => {
                        if(data.length > 0){
                            if(tipoDeCambio == 'MX'){
                                generalData.cambio = 'MX';
                                this.setState({
                                    tipoDeCambio: 'MX',
                                    precioDeBoleto: (descPacoima)? parseFloat(dllDescPacoima)*generalData.precioDollar : parseFloat(data[0].costo)*generalData.precioDollar,
                                    total: (descPacoima)? parseFloat(dllDescPacoima)*generalData.precioDollar : parseFloat(data[0].costo)*generalData.precioDollar
                                });
                                precioDeBoleto = (descPacoima)? parseFloat(dllDescPacoima)*generalData.precioDollar : parseFloat(data[0].costo)*generalData.precioDollar,
                                generalData.costoBoleto = (descPacoima)? parseFloat(dllDescPacoima)*generalData.precioDollar : parseFloat(data[0].costo)*generalData.precioDollar;
                                generalData.cobro.subtotal = (descPacoima)? parseFloat(dllDescPacoima)*generalData.precioDollar : parseFloat(data[0].costo)*generalData.precioDollar;
                                generalData.cobro.total = (descPacoima)? parseFloat(dllDescPacoima)*generalData.precioDollar : parseFloat(data[0].costo)*generalData.precioDollar
                            }else{
                                generalData.cambio = 'US';
                                this.setState({
                                    tipoDeCambio: 'US',
                                    precioDeBoleto: (descPacoima)? parseFloat(dllDescPacoima) : data[0].costo,
                                    total: (descPacoima)? parseFloat(dllDescPacoima) : data[0].costo
                                });
                                precioDeBoleto = (descPacoima)? parseFloat(dllDescPacoima) : data[0].costo,
                                generalData.costoBoleto = (descPacoima)? parseFloat(dllDescPacoima) : data[0].costo;
                                generalData.cobro.subtotal = (descPacoima)? parseFloat(dllDescPacoima) : data[0].costo;
                                generalData.cobro.total = (descPacoima)? parseFloat(dllDescPacoima) : data[0].costo
                            }                            
                        }
                    }).then(()=>{
                        this.setState({
                            noAsientos: generalData.noPasajeros
                        });

                        if(tipoDeCambio == 'MX'){
                            let subtotal = generalData.noPasajeros * generalData.costoBoleto;
                            this.state.subtotal = subtotal;
                            let desc=0;
                            for (let i = 0; i < generalData.noPasajeros; i++) {
                                
                                if(descuentoFamiliar){
                                    descuentos[i].descuento = parseFloat(this.state.montoDescuentoFamiliar)*generalData.precioDollar;
                                    desc+= descuentos[i].descuento;
                                    totales[i] = parseFloat(precioDeBoleto)-parseFloat(descuentos[i].descuento);
                                }else{
                                    descuentos[i].descuento = parseFloat(descuentos[i].descuento)*generalData.precioDollar
                                    desc+= descuentos[i].descuento;
                                    totales[i] = parseFloat(precioDeBoleto)-parseFloat(descuentos[i].descuento);
                                }
                                
                                
                            }
                            this.setState({
                                descuentoNeto: desc,
                                total: parseFloat(subtotal)-parseFloat(desc)
                            });
                        }else{
                            let subtotal = generalData.noPasajeros * generalData.costoBoleto;
                            this.state.subtotal = subtotal;
                            let desc=0;
                            for (let i = 0; i < generalData.noPasajeros; i++) {
                                
                                if(descuentoFamiliar){
                                    desc+=parseFloat(this.state.montoDescuentoFamiliar);
                                    totales[i] = precioDeBoleto-descuentos[i].descuento;
                                }else{
                                    desc+=parseFloat(descuentos[i].descuento);
                                    totales[i] = precioDeBoleto-descuentos[i].descuento;
                                }
                                
                            }
                            this.setState({
                                descuentoNeto: desc,
                                total: parseFloat(subtotal)-parseFloat(desc),
                                actualizar: true
                            });
                        }
                    });
            });
    }

    handleDescuentoFamiliar(){
        this.setState({
            solicitud: true
        });
        let familia = [];
        let usuario = generalData.vendedor.id_Usuario;
        let fechaDeCompra = new Date();
        fechaDeCompra = `${fechaDeCompra.getFullYear()}-${parseInt(fechaDeCompra.getMonth())+1}-${fechaDeCompra.getDate()}`;
        let status = 'false';
        let activo = 'true';
        for (let i = 0; i < pasajeros.length; i++) {
            familia.push(pasajeros[i].idCliente);
        }
        fetch('/api/DescuentoFamiliar/', {
            method: 'POST',
            body: JSON.stringify({familia,usuario,fechaDeCompra,status,activo}),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            //console.log('data',data);
            this.setState({
                idSolicitud: data.id
            });
        }) 
    }

    handleOnChangeTipoDeCambio(e){
        //Primero obtenemos el tipo de cambio seleccionado
    }


    render () {
        return (
            <div>
                <Row>
                    <Col md={{ size: 4}} lg={{ size: 4}} sm={12} xs={12}>
                        <h3>Resumen </h3>
                    </Col>
                    <Col md={{ size: 4}} lg={{ size: 4}} sm={12} xs={12}>
                        <Button onClick={this.handleClickActualizar} size="lg" outline color="info">Actualizar</Button>
                    </Col>
                    {
                        (this.state.tipoDeViaje == 'Familiar')? 
                        <Col md={{ size: 4}} lg={{ size: 4}} sm={12} xs={12}>
                            <Button onClick={this.handleDescuentoFamiliar} size="lg" outline color="info">Solicitar Descuento Familiar</Button>
                        </Col>
                        :
                        null
                    }
                </Row>
                <Row>
                    <Col md={{ size: 6}} lg={{ size: 6}} sm={12} xs={12}>
                        <h6>Total de Reservaciones: {this.state.noAsientos}</h6>
                    </Col><br/>
                </Row>
                <Row>
                    <Col md={{ size: 6}} lg={{ size: 6}} sm={12} xs={12}>
                        <h6 style={{display: 'inline'}}>Tipo de Cambio: &nbsp; &nbsp;</h6>
                        <CustomInput  type="radio" id="radioUS" name="radioTipoDeCambio" value="US" label="US" onChange={this.handleClickActualizar} defaultChecked inline />
                        <CustomInput type="radio" id="radioMX" name="radioTipoDeCambio" value="MX" label="MX" onChange={this.handleClickActualizar} inline />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h6 style={{display: 'inline'}}>Impresion: &nbsp; &nbsp;</h6>
                        <CustomInput  type="radio" id="radioEs" name="radioIdioma" value="espanol" label="Español" onChange={this.handleOnChangeIdioma} defaultChecked inline />
                        <CustomInput type="radio" id="radioIn" name="radioIdioma" value="ingles" label="Inglés" onChange={this.handleOnChangeIdioma} inline />
                    </Col>
                </Row>
                <br/><br/>
                <Row>
                    {
                        this.state.clientes.map((column, i) => {
                            return(
                                <Col md={{ size: 6}} lg={{ size: 6}} sm={12} xs={12} key={'pagos'+i}>
                                    <h6>Cliente: {pasajeros[i].nombre}</h6>
                                    <Table bordered>
                                        <tbody>
                                            <tr>
                                                <th scope="row">Subtotal</th>
                                                <td>{this.state.tipoDeCambio}{' $'}{this.state.precioDeBoleto}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Descuento</th>
                                                <td>{this.state.tipoDeCambio}{' $'}{descuentos[i].descuento}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Total</th>
                                                <td>{this.state.tipoDeCambio}{' $'}{totales[i]}</td>
                                            </tr>
                                            <tr>
                                            <th scope="row">Anticipo:</th>
                                                <td><input type="text" class="form-control" name="inputAnticipo" id={'inputAnticipo-'+i} placeholder="$0.0" onChange={this.handleOnChangePago}></input></td>
                                            </tr>
                                            <tr>
                                            <th scope="row">Cambio:</th>
                                                <td> <Input plaintext value={cambios[i]} type="text" name={"inputCambio-"+i} id={"inputCambio-"+i} placeholder="$0.0" readOnly /></td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Col>
                            )
                        })
                    }
                </Row>
                {/* <Row>
                    <Col md={{ size: 6}} lg={{ size: 6}} sm={12} xs={12}>
                    <h3>Resumen de Venta </h3>
                    </Col>
                    <Col md={{ size: 6}} lg={{ size: 6}} sm={12} xs={12}>
                    <Button onClick={this.handleClickActualizar} size="lg" outline color="info">Actualizar</Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h6>Total de Boletos: {this.state.noAsientos}</h6>
                    </Col>
                </Row>
                <Row>
                    <Col md={{ size: 6}} lg={{ size: 6}} sm={12} xs={12}>
                        <Table bordered>
                        <tbody>
                            <tr>
                            <th scope="row">Subtotal</th>
                            <td>{this.state.tipoDeCambio}{' $'}{this.state.subtotal}</td>
                            </tr>
                            <tr>
                            <th scope="row">Descuento</th>
                            <td>{this.state.tipoDeCambio}{' $'}{this.state.descuentoNeto}</td>
                            </tr>
                            <tr>
                            <th scope="row">Total</th>
                            <td>{this.state.tipoDeCambio}{' $'}{this.state.total}</td>
                            </tr>
                            <tr>
                            <th scope="row">Tipo de cambio</th>
                            <td><CustomInput  type="radio" id="radioUS" name="radioTipoDeCambio" value="US" label="US" onChange={this.handleClickActualizar} defaultChecked inline />
                                <CustomInput type="radio" id="radioMX" name="radioTipoDeCambio" value="MX" label="MX" onChange={this.handleClickActualizar} inline /></td>
                            </tr>
                            <tr>
                            <th scope="row">Impresion de Boleto</th>
                            <td><CustomInput  type="radio" id="radioEs" name="radioIdioma" value="espanol" label="Español" onChange={this.handleOnChangeIdioma} defaultChecked inline />
                                <CustomInput type="radio" id="radioIn" name="radioIdioma" value="ingles" label="Inglés" onChange={this.handleOnChangeIdioma} inline /></td>
                            </tr>
                        </tbody>
                        </Table>
                        <br/>
                        <Row>
                            <Col lg={12} md={12} sm={12} xs={12}>
                                <FormGroup>
                                <Label for="inputPago">Pago</Label>
                                <div class={(this.state.validationPago) ? 'card border-light': 'card border-danger'}>
                                    <input type="text" class="form-control" name="inputPago" id="inputPago" placeholder="$0.0" onChange={this.handleOnChangePago}></input>
                                </div>
                                <p class={(this.state.validationPago) ? 'textValid': 'textInvalid'}>Introduce correctamente el pago</p>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12} md={12} sm={12} xs={12}>
                                <FormGroup>
                                <Label for="inputCambio">Cambio</Label>
                                <Input plaintext value={this.state.cambio} type="text" name="inputCambio" id="inputCambio" placeholder="$0.0" readOnly />
                                </FormGroup>
                            </Col>
                        </Row>
                    </Col>
                </Row> */}
            </div>
        )
    }
}

var steps = [
    // this step hasn't got a isValidated() function, so it will be considered to be true
    { 
      stepName: "Datos de viaje", 
      stepIcon: "fas fa-map-marker-alt",
      component: FirstStep 
    },
    // this step will be validated to false
    { 
      stepName: "No. de Asientos", 
      stepIcon: "fas fa-bus",
      component: SecondStep 
    },
    // this step will never be reachable because of the seconds isValidated() steps function that will always return false
    { 
      stepName: "Informacion de pasajeros", 
      stepIcon: "fas fa-users",
      component: ThirdStep 
    },
    { 
        stepName: "Resumen y cobro", 
        stepIcon: "fas fa-clipboard-check",
        component: FourthStep 
    }
];


export default class papeleraDeReciclaje extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            irModificarReservaciones: false,
            modal: false,
        };
        this.finishButtonClick = this.finishButtonClick.bind(this);
        this.fetchSucursales = this.fetchSucursales.bind(this);
        this.fetchPoliticasFrasePermiso = this.fetchPoliticasFrasePermiso.bind(this);
        this.fetchImagen = this.fetchImagen.bind(this);

        this.toggle = this.toggle.bind(this);

        this.reLoad = this.reLoad.bind(this);

        generalData.vendedor.username = this.props.match.params.id_Usuario;
    }

    componentDidMount(){
        this.fetchSucursales('MX');
        this.fetchSucursales('US');
        this.fetchPoliticasFrasePermiso();
        this.fetchImagen();
        let hoy = new Date();
        generalData.fechaHoy = `${hoy.getDate()}-${hoy.getMonth()+1}-${hoy.getFullYear()}`;

        console.log(generalData.fechaHoy);
    }

    fetchSucursales(pais){
        let direccion = '';
        let telefono = '';
        fetch(`/api/Sucursales/${pais}/matriz`)
          .then(res => res.json())
          .then(data => {
              direccion = data[0].direccion+" "+data[0].ciudad+", "+data[0].estado+", "+data[0].pais;
              telefono =  data[0].telefono_1+"\n"+data[0].telefono_2;
              if(pais == 'MX'){
                this.setState({
                  direccionMatriz: direccion,
                  telefonoMatriz: telefono
                });
              }else{
                this.setState({
                  direccionMatrizEU: direccion,
                  telefonoMatrizEU: telefono
                });
              }
          });  
    }

    fetchImagen(){
        fetch(`/api/ImagenesBoletos/Boleto`)
          .then(res => res.json())
          .then(data => {
            if(data.length>0){
              //ConfiguracionDePublicidad.jsconsole.log('imagenesBoletos', data);
              this.setState({
                imagenPublicidad: data[0].imagen
              });
            }
        });
    }

    fetchPoliticasFrasePermiso(){
        fetch(`/api/ConfiguracionBoleto`)
          .then(res => res.json())
          .then(data => {
            if(data.length>0){
              //console.log(data);
              this.setState({
                frase: data[0].frase,
                permiso: data[0].informacionPermiso,
                politicas: data[0].politicas,
                reservacion: data[0].reservacion
              });
            }
        });
    }

    finishButtonClick() {
        console.log('GeneralData Final', generalData);
        let pagados = [];
        for (let i = 0; i < pasajeros.length; i++) {
            console.log('totales', totales[i]);
            console.log('anticipos', anticipos[i]);
            if((generalData.vendedor.seguridad == 'Ventas' || generalData.vendedor.seguridad == 'Reservaciones') && (parseFloat(anticipos[i]) < parseFloat(totales[i])/2)){
                alert('Para finalizar la reservacion, el cliente '+pasajeros[i].nombre+' debe dejar al menos el 50% del total');
                return false;
            }else{
                if(parseFloat(anticipos[i]) < parseFloat(totales[i])){
                    pagados[i] = 'false';
                }else{
                    pagados[i] = 'true';
                }
            }
        }
        console.log('generalData.vendedor.id_Usuario', generalData.vendedor.id_Usuario);
        fetch(`/api/Usuarios/${generalData.vendedor.id_Usuario}/actualizaYobtenFolioReservacion`, {
            method: 'PUT',
            body: JSON.stringify({pasajeros, razones, descuentos, totales, anticipos, pagados, generalData}),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log('data', data);
            let datos = {};
            for (let i = 0; i < data.rJson.length; i++) {
                datos = {
                    'idioma': generalData.idioma,
                    'imagenPublicidad': this.state.imagenPublicidad,
                    'folioVendedor': data.rJson[i],
                    'nombreCliente': pasajeros[i].nombre,
                    'clienteTipo': razones[i].razon,
                    'origen': {
                        'ciudad': generalData.origen.ciudad,
                        'estado': generalData.origen.estado,
                        'pais': generalData.origen.pais,
                        'direccion': generalData.origen.direccion,
                    },
                    'destino': {
                        'ciudad': generalData.destino.ciudad,
                        'estado': generalData.destino.estado,
                        'pais': generalData.destino.pais,
                        'direccion': generalData.destino.direccion,
                    },
                    'detalles':{
                        'dia': (generalData.detalles.fechaAbierta)? '' : generalData.detalles.dia,                            
                    },
                    'cambio': generalData.cambio,
                    'cobro': {
                        'subtotal': generalData.costoBoleto,
                        'descuento': descuentos[i].descuento,
                        'total': totales[i],
                        'anticipo': anticipos[i],
                    },
                    'configuracion': {
                        'informacionPermiso': this.state.permiso,
                        'politicas': this.state.politicas,
                        'reservacion': this.state.reservacion
                    },
                    'sucursales': {
                        'direccionMatriz': this.state.direccionMatriz,
                        'telefonoMatriz': this.state.telefonoMatriz,
                        'direccionMatrizEU': this.state.direccionMatrizEU,
                        'telefonoMatrizEU': this.state.telefonoMatrizEU
                    }

                };
                console.log(generalData.vendedor);
                GenerarReservacion(datos);
            }  
        })
        .then(() => {
            this.setState({
                modal: true
            })
        }); 
    }

    reLoad(){
        console.log(generalData.vendedor.seguridad);
        console.log(generalData.vendedor.username);
        console.log('hola');
        this.setState({
            irModificarReservaciones: true
        });
    }

    toggle(){
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    render() {

        if(this.state.irModificarReservaciones && (generalData.vendedor.seguridad == 'Admin')){return <Redirect to= {"/ModificarReservacion/"+generalData.vendedor.username}/>};
        if(this.state.irModificarReservaciones && (generalData.vendedor.seguridad == 'Matriz')){return <Redirect to= {"/Matriz_ModificarReservacion/"+generalData.vendedor.username}/>};
        if(this.state.irModificarReservaciones && (generalData.vendedor.seguridad == 'Viajes')){return <Redirect to= {"/Viajes_ModificarReservacion/"+generalData.vendedor.username}/>};
        if(this.state.irModificarReservaciones && (generalData.vendedor.seguridad == 'Reservaciones')){return <Redirect to= {"/Reservaciones_Corte/"+generalData.vendedor.username}/>};
        if(this.state.irModificarReservaciones && (generalData.vendedor.seguridad == 'Ventas')){return <Redirect to= {"/Ventas_Corte/"+generalData.vendedor.username}/>};

        return (
            <div>
                <Container fluid style={{ marginTop: "15px" }}>
                    <Row>
                        <Col xs={12} md={12} className="mr-auto ml-auto">
                            <ReactWizard
                                steps={steps}
                                navSteps
                                title="RESERVACION DE BOLETOS"
                                description=""
                                headerTextCenter
                                validate
                                color="green"
                                finishButtonClick={this.finishButtonClick}
                            />
                        </Col>
                    </Row>
                    <Modal isOpen={this.state.modal} toggle={this.toggle} backdrop={'static'}>
                        <ModalHeader>Reservaciones generadas</ModalHeader>
                        <ModalBody>
                            Tus Reservaciones han sido generadas, por favor verifica los datos en los recibos
                        </ModalBody>
                        <ModalFooter>
                        <Button color="primary" onClick={this.reLoad}>Aceptar</Button>
                        </ModalFooter>
                    </Modal>
                </Container>
            </div>
        );
    }
}