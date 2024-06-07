import React, { Component } from 'react'
import {Button, Card, CardTitle, Container, Col, Form, FormGroup, Input, InputGroupAddon, Label, Modal, ModalHeader, ModalBody, ModalFooter, Row} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import GenerarBoleto from "./boletoPDF";
import GenerarCancelacion from "./cancelacionPDF";

var razones = [
  'Ciudadano',
  'Residente',
  'Visa'
];

var username;

var tipoFetchVentas = 'Inicio';

var optAsientos = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28',
  '29',
  '30',
  '31',
  '32',
  '33',
  '34',
  '35',
  '36',
  '37',
  '38',
  '39',
  '40',
  '41',
  '42',
  '43',
  '44',
  '45',
  '46',
  '47',
  '48',
]

export default class modificarVenta extends Component {
  constructor(props){
    super(props);
    this.state = {
      tipoUsuario: '',
      radioTipoCambio:'MXN',
      cantPenalizacion: 0,
      txtMotivoReasignacion: '',
      idVentaReasignacion: '',
      tipoReasignacion: 'Venta',
      reasignado: false,
      vendedor: '',
      cliente: '',
      motivo: '',
      penalizacion: true,
      ventas: [],
      camiones: [],
      modal: false,
      modalCancelar: false,
      validationFecha: false,
      modalReasignacion: false,
      noAsientos: 0,
      fecha: '',
      validationTxtMotivo: true,
      nameClienteCancelacion: '',
      fechaClienteCancelacion: '',
      origenClienteCancelacion: '',
      destinoClienteCancelacion: '',
      busqueda: 'fechahoy',
      busquedaFecha: '',
      folio: '',
      folioUsuario: '',
      asiento1: false,
      asiento2: false,
      asiento3: false,
      asiento4: false,
      asiento5: false,
      asiento6: false,
      asiento7: false,
      asiento8: false,
      asiento9: false,
      asiento10: false,
      asiento11: false,
      asiento12: false,
      asiento13: false,
      asiento14: false,
      asiento15: false,
      asiento16: false,
      asiento17: false,
      asiento18: false,
      asiento19: false,
      asiento20: false,
      asiento21: false,
      asiento22: false,
      asiento23: false,
      asiento24: false,
      asiento25: false,
      asiento26: false,
      asiento27: false,
      asiento28: false,
      asiento29: false,
      asiento30: false,
      asiento31: false,
      asiento32: false,
      asiento33: false,
      asiento34: false,
      asiento35: false,
      asiento36: false,
      asiento37: false,
      asiento38: false,
      asiento39: false,
      asiento40: false,
      asiento41: false,
      asiento42: false,
      asiento43: false,
      asiento44: false,
      asiento45: false,
      asiento46: false,
      asiento47: false,
      asiento48: false,
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
      apartado1: {apartado: false, vendedor: null},
      apartado2: {apartado: false, vendedor: null},
      apartado3: {apartado: false, vendedor: null},
      apartado4: {apartado: false, vendedor: null},
      apartado5: {apartado: false, vendedor: null},
      apartado6: {apartado: false, vendedor: null},
      apartado7: {apartado: false, vendedor: null},
      apartado8: {apartado: false, vendedor: null},
      apartado9: {apartado: false, vendedor: null},
      apartado10: {apartado: false, vendedor: null},
      apartado11: {apartado: false, vendedor: null},
      apartado12: {apartado: false, vendedor: null},
      apartado13: {apartado: false, vendedor: null},
      apartado14: {apartado: false, vendedor: null},
      apartado15: {apartado: false, vendedor: null},
      apartado16: {apartado: false, vendedor: null},
      apartado17: {apartado: false, vendedor: null},
      apartado18: {apartado: false, vendedor: null},
      apartado19: {apartado: false, vendedor: null},
      apartado20: {apartado: false, vendedor: null},
      apartado21: {apartado: false, vendedor: null},
      apartado22: {apartado: false, vendedor: null},
      apartado23: {apartado: false, vendedor: null},
      apartado24: {apartado: false, vendedor: null},
      apartado25: {apartado: false, vendedor: null},
      apartado26: {apartado: false, vendedor: null},
      apartado27: {apartado: false, vendedor: null},
      apartado28: {apartado: false, vendedor: null},
      apartado29: {apartado: false, vendedor: null},
      apartado30: {apartado: false, vendedor: null},
      apartado31: {apartado: false, vendedor: null},
      apartado32: {apartado: false, vendedor: null},
      apartado33: {apartado: false, vendedor: null},
      apartado34: {apartado: false, vendedor: null},
      apartado35: {apartado: false, vendedor: null},
      apartado36: {apartado: false, vendedor: null},
      apartado37: {apartado: false, vendedor: null},
      apartado38: {apartado: false, vendedor: null},
      apartado39: {apartado: false, vendedor: null},
      apartado40: {apartado: false, vendedor: null},
      apartado41: {apartado: false, vendedor: null},
      apartado42: {apartado: false, vendedor: null},
      apartado43: {apartado: false, vendedor: null},
      apartado44: {apartado: false, vendedor: null},
      apartado45: {apartado: false, vendedor: null},
      apartado46: {apartado: false, vendedor: null},
      apartado47: {apartado: false, vendedor: null},
      apartado48: {apartado: false, vendedor: null},
    }

    
    this.descuentoFormatter = this.descuentoFormatter.bind(this);
    this.onBeforeSaveCell = this.onBeforeSaveCell.bind(this);
    this.onAfterSaveCell = this.onAfterSaveCell.bind(this);
    this.fetchVentas = this.fetchVentas.bind(this);
    this.buquedaFechaFolio = this.buquedaFechaFolio.bind(this);
    this.limpiarFechaFolio = this.limpiarFechaFolio.bind(this);
    this.reimprimirBoleto = this.reimprimirBoleto.bind(this);
    this.printBoleto = this.printBoleto.bind(this);
    this.validarCancelacion = this.validarCancelacion.bind(this);
    this.validarCancelarVenta = this.validarCancelarVenta.bind(this);
    this.toggleCancelar = this.toggleCancelar.bind(this);
    this.toggle = this.toggle.bind(this);
    this.fetchDatosCancelacion = this.fetchDatosCancelacion.bind(this);
    this.cancelarVenta = this.cancelarVenta.bind(this);
    this.fechaViaje = this.fechaViaje.bind(this);
    this.getDiaDelAnio = this.getDiaDelAnio.bind(this);
    this.handleChangeCamion = this.handleChangeCamion.bind(this);
    this.buquedaNombre = this.buquedaNombre.bind(this);
    this.limpiarNombres = this.limpiarNombres.bind(this);
    this.validarReasignarVenta = this.validarReasignarVenta.bind(this);
    this.fetchDatosReasignación = this.fetchDatosReasignación.bind(this);
    this.toggleReasignacion = this.toggleReasignacion.bind(this);
    this.handleChangePenalizacion = this.handleChangePenalizacion.bind(this);
    this.fetchUsuario = this.fetchUsuario.bind(this);
    //this.guardarReasignacion = this.guardarReasignacion.bind(this);
  }

  componentDidMount(){
    username = this.props.match.params.id_Usuario;
    this.fetchUsuario();
    this.refs.table.state.selectedRowKeys.length = 0;
    var f = new Date();
    let dia = (f.getDate() > 9)? f.getDate():'0'+f.getDate();
    let mes = (f.getMonth() +1);
    let anio = f.getFullYear();
    console.log(`${dia}-${mes}-${anio}`);
    this.setState({
      busquedaFecha: `${dia}-${mes}-${anio}`
    });
    
    this.fetchVentas(`${dia}-${mes}-${anio}`, 'fechaViaje', false, true);
  }

  componentWillUnmount(){
    this.refs.table.state.selectedRowKeys.length = 0;
    this.setState({});
  }

  fetchUsuario(){
    console.log(`/api/Usuarios/${username}`);
    fetch(`/api/Usuarios/${username}`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          tipoUsuario: data[0].seguridad
        })
      })
  }

  fetchVentas(value, field, folio, init){
    console.log(`/api/Ventas/${value}/${field}/${folio}`);
    if(folio){
      fetch(`/api/Ventas/${value}/${field}/${folio}`)
      .then(res => res.json())
      .then(data => {
        if(data.length == 0){
          this.setState({
            ventas: []
          })
          alert('No se encontró resultado que coincida con tu búsqueda');
        }else{
          this.setState({
            ventas: data
          })
        }
      })
    }else{
      fetch(`/api/Ventas/${value}/${field}`)
      .then(res => res.json())
      .then(data => {
        if(data.length > 0){
          this.setState({
            ventas: data
          }) 
        }else{
          this.setState({
            ventas: []
          }) 
          if(!init){
            alert('No se encontró resultado que coincida con tu búsqueda');
          }   
        }
      })
    }
  }

  buquedaFechaFolio(){
    tipoFetchVentas = 'fechaFolio';
    let fechaViaje = document.getElementById('fechaViaje').value;
    console.log(fechaViaje);
    let folio = document.getElementById('folio').value;
    let folioUsuario = document.getElementById('folioUsuario').value;
    if((fechaViaje == null || fechaViaje == '') && (folioUsuario == null || folioUsuario == '')){
      alert('Por favor llena un campo de busqueda');
    }else if((fechaViaje != null && fechaViaje != '') && (folioUsuario == null || folioUsuario == '')){
      ///Hacemos busqueda por fecha de viaje
      console.log('Busqueda por fecha');      
      let arrayFechaDeViaje = fechaViaje.split('-', 3);
      this.setState({
        busqueda: 'fechaViaje',
        busquedaFecha: `${arrayFechaDeViaje[2]}-${arrayFechaDeViaje[1]}-${arrayFechaDeViaje[0]}`
      });
      this.fetchVentas(`${arrayFechaDeViaje[2]}-${arrayFechaDeViaje[1]}-${arrayFechaDeViaje[0]}`, 'fechaViaje');
    }else if((folioUsuario != null && folioUsuario != '') && (folio != null && folio != '') && (fechaViaje == null || fechaViaje == '')){
      //Hacemos busqueda Por folio    
      console.log('Busqueda por folio');   
      this.setState({
        busqueda: 'folio',
        folio: folio,
        folioUsuario: folioUsuario
      }); 
      this.fetchVentas(folioUsuario, 'folio', folio);
    }else{
      alert('Llena solo un campo para la busqueda');
    }
  }

  limpiarFechaFolio(){
    document.getElementById('fechaViaje').value = '';
    document.getElementById('folio').value = '';
    document.getElementById('folioUsuario').value = '';
  }

  reimprimirBoleto(){
    let selectedRowKeys = this.refs.table.state.selectedRowKeys;
    console.log(selectedRowKeys);
    for (let i = 0; i < selectedRowKeys.length; i++) {
      this.printBoleto(selectedRowKeys[i]);
    }
  }

  validarCancelarVenta(){
    try {
      let selectedRowKeys = null;
      selectedRowKeys = this.refs.table.state.selectedRowKeys;
      console.log(selectedRowKeys);
      if(selectedRowKeys.length == 1){
        this.fetchDatosCancelacion(selectedRowKeys[0]);
      }else{
        alert('Por favor selecciona sólo un registro');
      }
    } catch (error) {
      alert('Ha ocurrido un error, por favor intentalo más tarde');
      console.log(error);
    }
  }

  fetchDatosCancelacion(id){
    fetch(`/api/Ventas/${id}/datosVenta`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          idVentaCancelacion: id,
          nameClienteCancelacion: data.nameCliente,
          fechaClienteCancelacion: data.fecha,
          origenClienteCancelacion: data.origen,
          destinoClienteCancelacion: data.destino
        })
      })
    this.toggleCancelar();
  }

  toggleCancelar(){
    this.setState(prevState => ({
      modalCancelar: !prevState.modalCancelar
    })); 
  }

  toggle(){
    this.setState(prevState => ({
      modal: !prevState.modal,
      validationFecha: false,
      asiento1: false,
      asiento2: false,
      asiento3: false,
      asiento4: false,
      asiento5: false,
      asiento6: false,
      asiento7: false,
      asiento8: false,
      asiento9: false,
      asiento10: false,
      asiento11: false,
      asiento12: false,
      asiento13: false,
      asiento14: false,
      asiento15: false,
      asiento16: false,
      asiento17: false,
      asiento18: false,
      asiento19: false,
      asiento20: false,
      asiento21: false,
      asiento22: false,
      asiento23: false,
      asiento24: false,
      asiento25: false,
      asiento26: false,
      asiento27: false,
      asiento28: false,
      asiento29: false,
      asiento30: false,
      asiento31: false,
      asiento32: false,
      asiento33: false,
      asiento34: false,
      asiento35: false,
      asiento36: false,
      asiento37: false,
      asiento38: false,
      asiento39: false,
      asiento40: false,
      asiento41: false,
      asiento42: false,
      asiento43: false,
      asiento44: false,
      asiento45: false,
      asiento46: false,
      asiento47: false,
      asiento48: false,
    }));
  }

  toggleReasignacion(){
    this.setState(prevState => ({
      modalReasignacion: !prevState.modalReasignacion
    })); 
  }

  getDiaDelAnio(fechaInicial, fechaFinal){

    let fechaini = new Date(fechaInicial);
    let fechafin = new Date(fechaFinal);
    let diasdif= fechafin.getTime()-fechaini.getTime();
    let contdias = Math.round(diasdif/(1000*60*60*24));

    return (contdias+1);
  }

  fechaViaje(e){
    let dateViaje = document.getElementById('dateViaje');
    
    let fechaDeViaje = e.target.value;
    let arrayFechaDeViaje = fechaDeViaje.split('-', 3);
    let anioFechaDeViaje = arrayFechaDeViaje[0];

    let hoy = new Date();
    let anio = hoy.getFullYear();

    let diaDeHoy = `${anio}-${hoy.getMonth()+1}-${hoy.getDate()}`;
    let diaAnioHoy = this.getDiaDelAnio(`${anio}-01-01`,diaDeHoy);

    let diaAnioViaje = this.getDiaDelAnio(`${anioFechaDeViaje}-01-01`,fechaDeViaje);

    if((anioFechaDeViaje < anio) || ((anioFechaDeViaje == anio) && (diaAnioViaje<diaAnioHoy))){//si el anio que seleccionamos es menor al año actual, retornamos false
      dateViaje.value = '';
      alert('No puedes seleccionar fecha anterior al dia de hoy');
      return false;
    }else{
      //Ahora verificamos que ya esté abierta la fecha
      //El formato de la fecha debe ser "dd-mm-aaaa"
      let buscarFecha = `${arrayFechaDeViaje[2]}-${arrayFechaDeViaje[1]}-${arrayFechaDeViaje[0]}`;
      fetch(`/api/AsignarViajes/${buscarFecha}/camiones`)
        .then(res => res.json())
        .then(data => {
          if(data.length > 0){
            this.setState({
                validationFecha: true,
                fecha: buscarFecha,
                camiones: data,
            });
            this.handleChangeCamion(data[0]._id);
          }else{
              this.setState({
                  validationFecha: false,
              });
              dateViaje.value = '';
              alert('No hay viaje disponible para esa fecha, escoge otra fecha o contáctate con la matriz');
          }
        })
    }
  }

  handleChangeCamion(e){
    let id = '';
    try {
      id = e.target.value;
    } catch (error) {
      id = e;
    }
    fetch(`/api/AsignarViajes/${id}/asientosVenta`)
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
        //APARTADOS
        apartado1: {apartado: data.asientos.asiento_1.apartado, vendedor: data.asientos.asiento_1.vendedor},
        apartado2: {apartado: data.asientos.asiento_2.apartado, vendedor: data.asientos.asiento_2.vendedor},
        apartado3: {apartado: data.asientos.asiento_3.apartado, vendedor: data.asientos.asiento_3.vendedor},
        apartado4: {apartado: data.asientos.asiento_4.apartado, vendedor: data.asientos.asiento_4.vendedor},
        apartado5: {apartado: data.asientos.asiento_5.apartado, vendedor: data.asientos.asiento_5.vendedor},
        apartado6: {apartado: data.asientos.asiento_6.apartado, vendedor: data.asientos.asiento_6.vendedor},
        apartado7: {apartado: data.asientos.asiento_7.apartado, vendedor: data.asientos.asiento_7.vendedor},
        apartado8: {apartado: data.asientos.asiento_8.apartado, vendedor: data.asientos.asiento_8.vendedor},
        apartado9: {apartado: data.asientos.asiento_9.apartado, vendedor: data.asientos.asiento_9.vendedor},
        apartado10: {apartado: data.asientos.asiento_10.apartado, vendedor: data.asientos.asiento_10.vendedor},
        apartado11: {apartado: data.asientos.asiento_11.apartado, vendedor: data.asientos.asiento_11.vendedor},
        apartado12: {apartado: data.asientos.asiento_12.apartado, vendedor: data.asientos.asiento_12.vendedor},
        apartado13: {apartado: data.asientos.asiento_13.apartado, vendedor: data.asientos.asiento_13.vendedor},
        apartado14: {apartado: data.asientos.asiento_14.apartado, vendedor: data.asientos.asiento_14.vendedor},
        apartado15: {apartado: data.asientos.asiento_15.apartado, vendedor: data.asientos.asiento_15.vendedor},
        apartado16: {apartado: data.asientos.asiento_16.apartado, vendedor: data.asientos.asiento_16.vendedor},
        apartado17: {apartado: data.asientos.asiento_17.apartado, vendedor: data.asientos.asiento_17.vendedor},
        apartado18: {apartado: data.asientos.asiento_18.apartado, vendedor: data.asientos.asiento_18.vendedor},
        apartado19: {apartado: data.asientos.asiento_19.apartado, vendedor: data.asientos.asiento_19.vendedor},
        apartado20: {apartado: data.asientos.asiento_20.apartado, vendedor: data.asientos.asiento_20.vendedor},
        apartado21: {apartado: data.asientos.asiento_21.apartado, vendedor: data.asientos.asiento_21.vendedor},
        apartado22: {apartado: data.asientos.asiento_22.apartado, vendedor: data.asientos.asiento_22.vendedor},
        apartado23: {apartado: data.asientos.asiento_23.apartado, vendedor: data.asientos.asiento_23.vendedor},
        apartado24: {apartado: data.asientos.asiento_24.apartado, vendedor: data.asientos.asiento_24.vendedor},
        apartado25: {apartado: data.asientos.asiento_25.apartado, vendedor: data.asientos.asiento_25.vendedor},
        apartado26: {apartado: data.asientos.asiento_26.apartado, vendedor: data.asientos.asiento_26.vendedor},
        apartado27: {apartado: data.asientos.asiento_27.apartado, vendedor: data.asientos.asiento_27.vendedor},
        apartado28: {apartado: data.asientos.asiento_28.apartado, vendedor: data.asientos.asiento_28.vendedor},
        apartado29: {apartado: data.asientos.asiento_29.apartado, vendedor: data.asientos.asiento_29.vendedor},
        apartado30: {apartado: data.asientos.asiento_30.apartado, vendedor: data.asientos.asiento_30.vendedor},
        apartado31: {apartado: data.asientos.asiento_31.apartado, vendedor: data.asientos.asiento_31.vendedor},
        apartado32: {apartado: data.asientos.asiento_32.apartado, vendedor: data.asientos.asiento_32.vendedor},
        apartado33: {apartado: data.asientos.asiento_33.apartado, vendedor: data.asientos.asiento_33.vendedor},
        apartado34: {apartado: data.asientos.asiento_34.apartado, vendedor: data.asientos.asiento_34.vendedor},
        apartado35: {apartado: data.asientos.asiento_35.apartado, vendedor: data.asientos.asiento_35.vendedor},
        apartado36: {apartado: data.asientos.asiento_36.apartado, vendedor: data.asientos.asiento_36.vendedor},
        apartado37: {apartado: data.asientos.asiento_37.apartado, vendedor: data.asientos.asiento_37.vendedor},
        apartado38: {apartado: data.asientos.asiento_38.apartado, vendedor: data.asientos.asiento_38.vendedor},
        apartado39: {apartado: data.asientos.asiento_39.apartado, vendedor: data.asientos.asiento_39.vendedor},
        apartado40: {apartado: data.asientos.asiento_40.apartado, vendedor: data.asientos.asiento_40.vendedor},
        apartado41: {apartado: data.asientos.asiento_41.apartado, vendedor: data.asientos.asiento_41.vendedor},
        apartado42: {apartado: data.asientos.asiento_42.apartado, vendedor: data.asientos.asiento_42.vendedor},
        apartado43: {apartado: data.asientos.asiento_43.apartado, vendedor: data.asientos.asiento_43.vendedor},
        apartado44: {apartado: data.asientos.asiento_44.apartado, vendedor: data.asientos.asiento_44.vendedor},
        apartado45: {apartado: data.asientos.asiento_45.apartado, vendedor: data.asientos.asiento_45.vendedor},
        apartado46: {apartado: data.asientos.asiento_46.apartado, vendedor: data.asientos.asiento_46.vendedor},
        apartado47: {apartado: data.asientos.asiento_47.apartado, vendedor: data.asientos.asiento_47.vendedor},
        apartado48: {apartado: data.asientos.asiento_48.apartado, vendedor: data.asientos.asiento_48.vendedor},
      })
    })
  }

  validarCancelacion(){
    let motivo = document.getElementById('txtMotivo').value;
    if(motivo == '' || motivo == null){
      this.setState({
        validationTxtMotivo: false,        
      });
      return false
    }else{
      this.cancelarVenta(motivo);
    }
  }

  /////////////////////CANCELACION DE VENTA
  cancelarVenta(motivo){
    console.log('selectedRowKeys',this.refs.table.state.selectedRowKeys);   
    console.log(`/api/Ventas/${this.state.idVentaCancelacion}/${motivo}/cancelarVenta/`);
    fetch(`/api/Ventas/${this.state.idVentaCancelacion}/${motivo}/cancelarVenta/`, {
      method: 'PUT',
      //body: JSON.stringify({motivo: m}),
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      var f = new Date();
      let dia = (f.getDate() > 9)? f.getDate():'0'+f.getDate();
      let mes = (f.getMonth() +1);
      let anio = f.getFullYear();
      this.fetchVentas(`${dia}-${mes}-${anio}`, 'fechaViaje');
      this.toggleCancelar();
      GenerarCancelacion(data);
      this.refs.table.state.selectedRowKeys.length = 0;
      alert('Se ha generado la cancelacion!!');
    })
    .catch(() => {
      alert('Ha ocurrido un error, por favor intentalo mas tarde');
    });
  }

  printBoleto(folio){
    fetch(`/api/Ventas/${folio}/reimpresion`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        let datos = {
          'correoSucursal': data.correoSucursal,
          'descuento': data.descuento,
          'destino': data.destino,
          'dirSucursal': data.dirSucursal,
          'direccionMatriz': data.direccionMatriz,
          'direccionMatrizEU': data.direccionMatrizEU,
          'fecha': data.fecha,
          'folio': data.folio,
          'frase': data.frase,
          'hora': data.hora,
          'idioma': '',
          'imagenPublicidad': data.imagenPublicidad,
          'noAsiento': data.noAsiento,
          'origen': data.origen,
          'pasajero': data.pasajero,
          'permiso': data.permiso,
          'politicas': data.politicas,
          'subtotal': data.subtotal,
          'sucursal': data.sucursal,
          'tel2Sucursal': data.tel2Sucursal,
          'telSucursal': data.telSucursal,
          'telefonoMatriz': data.telefonoMatriz,
          'telefonoMatrizEU': data.telefonoMatrizEU,
          'tipo': data.tipo,
          'tipoDeCambio': data.tipoDeCambio,
          'total': data.total,
          'vendedor': data.vendedor
        };
        GenerarBoleto(datos);
      })
  }

  descuentoFormatter(cell, row){
    if(row.tipoDeCambio == 'MX'){
      return '<span class="badge badge-success">MX</span> $'+cell;
    }else{
        return '<span class="badge badge-primary">US</span> $'+cell;
    }
  }

  onBeforeSaveCell(row, cellName, cellValue) {
    if(cellValue == '' || cellValue == null){
      alert('Por favor llena correctamente el campo');
      return false;
    }else{
        if(confirm("En verdad deseas modificar el campo?")){
          if(cellName == 'numeroAsiento'){
            fetch(`/api/Ventas/${row._id}/${row.idViaje}/${cellValue}/${cellName}`, {//IdVenta es el id del viaje (Asignar viajes)
              method: 'PUT',
              //body: JSON.stringify(this.state),
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
              }
            })
            .then(res => res.json())
            .then(data => {
              alert(data.status);

              if(tipoFetchVentas == 'fechaFolio'){
                this.buquedaFechaFolio();
              }

              if(tipoFetchVentas == 'buquedaNombre'){
                this.buquedaNombre();
              }

              if(tipoFetchVentas == 'Inicio'){
                /*Aquivoy*/
                var f = new Date();
                let dia = (f.getDate() > 9)? f.getDate():'0'+f.getDate();
                let mes = (f.getMonth() +1);
                let anio = f.getFullYear();
                //console.log(`${dia}-${mes}-${anio}`);
                this.setState({
                  busquedaFecha: `${dia}-${mes}-${anio}`
                });
                this.fetchVentas(`${dia}-${mes}-${anio}`, 'fechaViaje', false, true);
              }

              return data.res;
            })
          }else{
            return true;
          }
        }else{
          return false;
        }
    }
  }

  onAfterSaveCell(row, cellName, cellValue) {
    switch (cellName) {
      case 'razon':
        fetch(`/api/Ventas/${row._id}/${cellValue}/${cellName}`, {
          method: 'PUT',
          //body: JSON.stringify(this.state),
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          }
        })
        .then(res => res.json())
        .then(data => {
          alert('Se ha modificado la razón');
          this.fetchVentas();
        })
        break;

      case 'numeroAsiento':
        
        break;
    
      default:
        console.log(cellName);
        break;
    }
  }

  buquedaNombre(){
      tipoFetchVentas = 'buquedaNombre';

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

    if(nom == 'null' && ap == 'null' && am == 'null'){
      alert('Ingresa un nombre para hacer la búsqueda');
    }else{
      console.log(`/api/Ventas/${nom}/clienteModificarVenta/${ap}/${am}`);
      fetch(`/api/Ventas/${nom}/clienteModificarVenta/${ap}/${am}`)
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

    
  }

  limpiarNombres(){
    document.getElementById('nombreCliente').value = '';
    document.getElementById('apellidoPCliente').value = '';
    document.getElementById('apellidoMCliente').value = '';
  }

  validarReasignarVenta(){
    //Validamos que esté seleccionada una venta
    try {
      let selectedRowKeys = null;
      selectedRowKeys = this.refs.table.state.selectedRowKeys;
      console.log(selectedRowKeys, 'rowSelected');
      if(selectedRowKeys.length == 1){
        this.setState({
          idVentaReasignacion: selectedRowKeys[0]
        });
        this.toggleReasignacion();
      }else{
        alert('Por favor selecciona sólo un registro');
      }
    } catch (error) {
      alert('Ha ocurrido un error, por favor intentalo más tarde');
      console.log(error);
    }
  }

  fetchDatosReasignación(){
    //obtenemos los datos para hacer la reasignación
    let eCantPenalizacion = document.getElementById('inputPenalizacion').value;
    if(this.state.penalizacion){
      this.setState({
        cantPenalizacion: eCantPenalizacion
      });
    }else{
      this.setState({
        cantPenalizacion: 0
      });
    }

    let seleccionRadio = document.querySelector('input[name=inlineRadioOptions]:checked').value;
    let txtMotivoReasignacion = document.getElementById('txtMotivoReasignacion').value;
    this.setState({
      radioTipoCambio: seleccionRadio,
      txtMotivoReasignacion: txtMotivoReasignacion
    });

    let dataf = {};
    let cont = true;
    let validated = true;
    //Validamos que este correcta la informacion, que no hayan quedado vacias las variables

    if(this.state.penalizacion && (eCantPenalizacion == '' || eCantPenalizacion == null || eCantPenalizacion == 0)){
      validated = false;
    }

    if(txtMotivoReasignacion == '' || txtMotivoReasignacion == null){
      validated = false;
    }

    if(validated){
      fetch(`/api/Ventas/${this.state.idVentaReasignacion}/vendedorcliente`)
      .then(res => res.json())
      .then(data => {
        console.log('data reasiganciones', data.reasignaciones);
        if(data.resp){
          dataf = {idVentaReasignacion: data.ventaResp._id,
                    tipoReasignacion: 'Venta',
                    reasignado: false,
                    motivo: txtMotivoReasignacion,
                    cantPenalizacion: this.state.cantPenalizacion,
                    tipoDeCambio: seleccionRadio,
                    vendedor: data.ventaResp.vendedor,
                    cliente: data.ventaResp.cliente};
        }else{
          alert("Este cliente ha llegado al limite de reasignaciones");
          cont = false;
          this.toggleReasignacion();
        }        
      })
      .then(() => {
        if(cont){
          fetch(`/api/Reasignaciones/${this.state.idVentaReasignacion}`, {
            method: 'POST',
            body: JSON.stringify(dataf),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
          })
          .then(res => {
            console.log(res.json());
            this.toggleReasignacion();
            alert('Se ha guardado la reasignacion');
          }) 
          .catch(err => {
            console.log(err);
            alert('Ha ocurrido un error, intentalo más tarde');
            this.toggleReasignacion();
          });
        }
      })
    }else{
      alert('Llena los campos correctamente');
    }    
  }


  handleChangePenalizacion(e){
    this.setState(prevState => ({
      penalizacion: !prevState.penalizacion
    })); 
  }

  render() {

    const selectRowProp = {
      mode: 'checkbox'
    };

    const cellEditProp = {
      mode: 'dbclick',
      blurToSave: true,
      beforeSaveCell: this.onBeforeSaveCell, // a hook for before saving cell
      afterSaveCell: this.onAfterSaveCell,  // a hook for after saving cell     
    };

    return (
      <div>
        <Container style={{ marginTop: "15px" }}>
          <br/>
            <Form>
              <Card body outline color="secondary">
                <CardTitle className="text-center"><h3>VENTAS</h3></CardTitle>
                <br/>
                {/** BUSQUEDA **/}
                <h5>Buscar Por:</h5>
                <Row>
                    <Col lg='3' md='3' sm='3' xs='3'>
                      <FormGroup>
                        <Label for="fechaViaje">Fecha de viaje</Label>
                        <Input type="date" name="fechaViaje" id="fechaViaje"/>
                      </FormGroup>
                    </Col>
                    <Col lg='3' md='3' sm='3' xs='3'>
                      <FormGroup>
                        <Label for="folio">Folio</Label>
                        <Input id="folioUsuario" name="folioUsuario" type="text" />
                      </FormGroup>
                    </Col>
                    <Col lg='1' md='1' sm='1' xs='1'>
                      <h3 className="guion text-center">-</h3>
                    </Col>
                    <Col lg='3' md='3' sm='3' xs='3'>
                      <FormGroup>
                        <Label for="folio">No.</Label>
                        <Input id="folio" name="folio" type="text" />
                      </FormGroup>
                    </Col>
                    <Col className="btn-nuevoPasajero" lg='1' md='1' sm='1' xs='1'>
                      <Button color="primary" title="Buscar" onClick={this.buquedaFechaFolio}><i className="fa fa-search"/></Button>
                    </Col>
                    <Col className="btn-nuevoPasajero" lg='1' md='1' sm='1' xs='1'>
                      <Button color="primary" title="Limpiar campos" onClick={this.limpiarFechaFolio}><i className="fa fa-eraser"/></Button>
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
                {
                  (this.state.tipoUsuario == 'Admin' || this.state.tipoUsuario == 'Matriz')?
                    <Row>
                      <Col lg='3' md='3' sm='3' xs='3'>
                        <Button color="warning" onClick={this.reimprimirBoleto}><i className="fa fa-print"/> Reimprimir Boleto</Button>
                      </Col>
                      <Col lg='3' md='3' sm='3' xs='3'>
                        <Button color="dark" onClick={this.toggle}><i className="fa fa-bus"/> Asientos Disponibles</Button>
                      </Col>
                      <Col lg='3' md='3' sm='3' xs='3'>
                        <Button color="danger" onClick={this.validarCancelarVenta}><i className="fa fa-ban"/> Cancelar Venta</Button>
                      </Col>
                      <Col lg='3' md='3' sm='3' xs='3'>
                        <Button color="primary" onClick={this.validarReasignarVenta}><i className="fa fa-redo-alt"/> Reasignar Venta</Button>
                      </Col>
                    </Row>
                  :
                    <Row>
                      <Col lg='3' md='3' sm='3' xs='3'>
                        <Button color="warning" onClick={this.reimprimirBoleto}><i className="fa fa-print"/> Reimprimir Boleto</Button>
                      </Col>
                    </Row>
                }
                
                {/** TERMINA ACCIONES **/}
              </Card>
            </Form>
            <br/>
            <br/>
              {
                (this.state.tipoUsuario != 'Admin' && this.state.tipoUsuario != 'Matriz')?
                  <Row style={{ marginTop: "10px" }}>
                    <Col lg='12' md='12' sm='12' xs='12'>
                      <BootstrapTable ref='table'data={ this.state.ventas } selectRow={ selectRowProp } striped hover >
                        <TableHeaderColumn dataField='_id' isKey hidden>ID</TableHeaderColumn>
                        <TableHeaderColumn width='200' dataField='folio' editable={ false }>Folio</TableHeaderColumn>
                        <TableHeaderColumn width='85' dataField='numeroAsiento' editable={ false }>Asiento</TableHeaderColumn>
                        <TableHeaderColumn width='250' dataField='cliente' editable={ false }>Cliente</TableHeaderColumn>
                        <TableHeaderColumn width='150' dataField='dia' editable={ false }>Fecha de Viaje</TableHeaderColumn>
                        <TableHeaderColumn width='150' dataField='fechaDeVenta' editable={ false }>Fecha de Venta</TableHeaderColumn>
                        <TableHeaderColumn width='150' dataField='origen' editable={ false }>Origen</TableHeaderColumn>
                        <TableHeaderColumn width='150' dataField='destino' editable={ false }>Destino</TableHeaderColumn>
                        <TableHeaderColumn width='110' dataField='razon' editable={ { type: 'select', options: { values: razones } } }>Razón</TableHeaderColumn>
                        <TableHeaderColumn width='150' dataField='descuento' editable={ false } dataFormat={ this.descuentoFormatter }>Descuento</TableHeaderColumn>
                        <TableHeaderColumn width='110' dataField='tipoDeCambio' hidden>Tipo de Cambio</TableHeaderColumn>                              
                      </BootstrapTable>
                    </Col>
                  </Row>
                :
                  <Row style={{ marginTop: "10px" }}>
                    <Col lg='12' md='12' sm='12' xs='12'>
                      <BootstrapTable ref='table'data={ this.state.ventas } selectRow={ selectRowProp } cellEdit={ cellEditProp } striped hover >
                        <TableHeaderColumn dataField='_id' isKey hidden>ID</TableHeaderColumn>
                        <TableHeaderColumn width='200' dataField='folio' editable={ false }>Folio</TableHeaderColumn>
                        <TableHeaderColumn width='85' dataField='numeroAsiento' editable={ { type: 'select', options: { values: optAsientos } } }>Asiento</TableHeaderColumn>
                        <TableHeaderColumn width='250' dataField='cliente' editable={ false }>Cliente</TableHeaderColumn>
                        <TableHeaderColumn width='150' dataField='dia' editable={ false }>Fecha de Viaje</TableHeaderColumn>
                        <TableHeaderColumn width='150' dataField='fechaDeVenta' editable={ false }>Fecha de Venta</TableHeaderColumn>
                        <TableHeaderColumn width='150' dataField='origen' editable={ false }>Origen</TableHeaderColumn>
                        <TableHeaderColumn width='150' dataField='destino' editable={ false }>Destino</TableHeaderColumn>
                        <TableHeaderColumn width='110' dataField='razon' editable={ { type: 'select', options: { values: razones } } }>Razón</TableHeaderColumn>
                        <TableHeaderColumn width='150' dataField='descuento' editable={ false } dataFormat={ this.descuentoFormatter }>Descuento</TableHeaderColumn>
                        <TableHeaderColumn width='110' dataField='tipoDeCambio' hidden>Tipo de Cambio</TableHeaderColumn>                              
                      </BootstrapTable>
                    </Col>
                  </Row>
              }            
            <br/>
            {/* Modal Cancelaciones */}
            <Modal size="lg" isOpen={this.state.modalCancelar} toggle={this.toggleCancelar}>
              <ModalHeader toggle={this.toggleCancelar}>Cancelación de viaje</ModalHeader>
              <ModalBody>
                <Row>
                  <Col lg={6} md={6} sm={12} xs={12}>
                    <Label><strong>Cliente:</strong></Label>
                    <Input plaintext value={this.state.nameClienteCancelacion} />
                  </Col>
                  <Col lg={6} md={6} sm={12} xs={12}>
                    <Label><strong>Fecha de viaje:</strong></Label>
                    <Input plaintext value={this.state.fechaClienteCancelacion} />
                  </Col>
                </Row>
                <Row>
                  <Col lg={6} md={6} sm={12} xs={12}>
                    <Label><strong>Origen:</strong></Label>
                    <Input plaintext value={this.state.origenClienteCancelacion} />
                  </Col>
                  <Col lg={6} md={6} sm={12} xs={12}>
                    <Label><strong>Destino:</strong></Label>
                    <Input plaintext value={this.state.destinoClienteCancelacion} />
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12} xs={12}>
                    <Label for="txtMotivo"><strong>Motivo:</strong></Label>
                    <div class={(this.state.validationTxtMotivo) ? 'card border-light': 'card border-danger'}>
                      <Input type="textarea" name="txtMotivo" id="txtMotivo" onChange={this.handleTxtMotivo} rows="5"/>
                    </div>
                    <p class={(this.state.validationTxtMotivo) ? 'textValid': 'textInvalid'}>Ingresa el motivo</p>
                  </Col>
                </Row>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" onClick={this.toggleCancelar}>Cancelar</Button>
                <Button color="primary" onClick={this.validarCancelacion}>Guardar Cancelación</Button>{' '}
              </ModalFooter>
            </Modal>
          {/* FIN Modal Cancelaciones */}
          {/* Modal Disponibilidad de asientos */}
          <Modal size="lg" isOpen={this.state.modal} toggle={this.toggle}>
            <ModalHeader toggle={this.toggle}></ModalHeader>
            <ModalBody>
              <Card body outline color="secondary">
                <CardTitle className="text-center"><h3>Ver Asientos Disponibles</h3></CardTitle>
                <br/>
                <Row>
                  <Col lg='6' md='6' sm='12' xs='12'>
                    <FormGroup>
                      <Label for="dateViaje"><i className="fas fa-calendar-alt"></i>{ ' Fecha:' }</Label>
                      <Input
                        type="date"
                        name="dateViaje"
                        id="dateViaje"
                        placeholder="date placeholder"
                        onChange={this.fechaViaje}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg='6' md='6' sm='12' xs='12'>
                    <FormGroup>
                      <Label for="autoBus"><i className="fas fa-bus"></i>{ ' Autobus:' }</Label>
                      <select disabled={!this.state.validationFecha} class="form-control" id="autoBus" onChange={this.handleChangeCamion}>
                        {
                          this.state.camiones.map((column, i) => {
                            return(
                              <option key={column._id} value={column._id}>{column.numeroEconomico}</option>
                            )
                          })
                        }
                      </select>
                    </FormGroup>
                  </Col>
                </Row>
              </Card>
              <br/><br/>
              <Row>
                <Col md="12" xs="12" sm="12" lg="12">
                  <div>
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
                                    <button name='1' id='1' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                )
                                :
                                (
                                  (this.state.apartado1.apartado)? 
                                    <button title={this.state.apartado1.vendedor} name='1' id='1' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                  :
                                    <button type="button" class={(this.state.genero1 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero1 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                )
                            }
                            <p className="smallDevice text-center">01</p>
                        </Col>
                        <Col xs="2" sm="1">
                            {(this.state.asiento2  == 'false') ? 
                                (
                                  <button name='2' id='2' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                )
                                :
                                (
                                  (this.state.apartado2.apartado)? 
                                    <button title={this.state.apartado2.vendedor} name='2' id='2' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                  :
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
                                  <button name='3' id='3' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                )
                                :
                                (
                                  (this.state.apartado3.apartado)? 
                                    <button title={this.state.apartado3.vendedor} name='3' id='3' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                  :
                                    <button type="button" class={(this.state.genero3 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero3 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                )
                            }
                            <p className="smallDevice text-center">03</p>
                        </Col>
                        <Col xs="2" sm="1">
                            {(this.state.asiento4  == 'false') ? 
                                 (
                                  <button name='4' id='4' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                )
                                :
                                (
                                  (this.state.apartado4.apartado)? 
                                    <button title={this.state.apartado4.vendedor} name='4' id='4' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                  :
                                    <button type="button" class={(this.state.genero4 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero4 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                )
                            }
                            <p className="smallDevice text-center">04</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs="2" sm="1">
                            {(this.state.asiento5 == 'false') ? 
                                (
                                    <button name='5' id='5' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                )
                                :
                                (
                                  (this.state.apartado5.apartado)? 
                                    <button title={this.state.apartado5.vendedor} name='5' id='5' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                  :
                                    <button type="button" class={(this.state.genero5 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero5 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                )
                            }
                            <p className="smallDevice text-center">05</p>
                        </Col>
                        <Col xs="2" sm="1">
                            {(this.state.asiento6  == 'false') ? 
                                (
                                  <button name='6' id='6' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                )
                                :
                                (
                                  (this.state.apartado6.apartado)? 
                                    <button title={this.state.apartado6.vendedor} name='6' id='6' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                  :
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
                                  <button name='7' id='7' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                )
                                :
                                (
                                  (this.state.apartado7.apartado)? 
                                    <button title={this.state.apartado7.vendedor} name='7' id='7' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                  :
                                    <button type="button" class={(this.state.genero7 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero7 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                )
                            }
                            <p className="smallDevice text-center">07</p>
                        </Col>
                        <Col xs="2" sm="1">
                            {(this.state.asiento8  == 'false') ? 
                                 (
                                  <button name='8' id='8' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                )
                                :
                                (
                                  (this.state.apartado8.apartado)? 
                                    <button title={this.state.apartado8.vendedor} name='8' id='8' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                  :
                                    <button type="button" class={(this.state.genero8 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero8 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                )
                            }
                            <p className="smallDevice text-center">08</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs="2" sm="1">
                            {(this.state.asiento9 == 'false') ? 
                                (
                                    <button name='9' id='9' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                )
                                :
                                (
                                  (this.state.apartado9.apartado)? 
                                    <button title={this.state.apartado9.vendedor} name='9' id='9' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                  :
                                    <button type="button" class={(this.state.genero9 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero9 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                )
                            }
                            <p className="smallDevice text-center">09</p>
                        </Col>
                        <Col xs="2" sm="1">
                            {(this.state.asiento10  == 'false') ? 
                                (
                                  <button name='10' id='10' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                )
                                :
                                (
                                  (this.state.apartado10.apartado)? 
                                    <button title={this.state.apartado10.vendedor} name='10' id='10' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                  :
                                    <button type="button" class={(this.state.genero10 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero10 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                )
                            }
                            <p className="smallDevice text-center">10</p>
                        </Col>
                        <Col xs="3">
                        </Col>
                        <Col xs="2" sm="1">
                            {(this.state.asiento11  == 'false') ? 
                                 (
                                  <button name='11' id='11' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                )
                                :
                                (
                                  (this.state.apartado11.apartado)? 
                                    <button title={this.state.apartado11.vendedor} name='11' id='11' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                  :
                                    <button type="button" class={(this.state.genero11 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero11 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                )
                            }
                            <p className="smallDevice text-center">11</p>
                        </Col>
                        <Col xs="2" sm="1">
                            {(this.state.asiento12  == 'false') ? 
                                 (
                                  <button name='12' id='12' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                )
                                :
                                (
                                  (this.state.apartado12.apartado)? 
                                    <button title={this.state.apartado12.vendedor} name='12' id='12' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                  :
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
                                    <button name='13' id='13' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                )
                                :
                                (
                                  (this.state.apartado13.apartado)? 
                                    <button title={this.state.apartado13.vendedor} name='13' id='13' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                  :
                                    <button type="button" class={(this.state.genero13 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero13 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                )
                            }
                            <p className="smallDevice text-center">13</p>
                        </Col>
                        <Col xs="2" sm="1">
                            {(this.state.asiento14  == 'false') ? 
                                (
                                  <button name='14' id='14' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                )
                                :
                                (
                                  (this.state.apartado14.apartado)? 
                                    <button title={this.state.apartado14.vendedor} name='14' id='14' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                  :
                                    <button type="button" class={(this.state.genero14 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero14 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                )
                            }
                            <p className="smallDevice text-center">14</p>
                        </Col>
                        <Col xs="3">
                        </Col>
                        <Col xs="2" sm="1">
                            {(this.state.asiento15  == 'false') ? 
                                 (
                                  <button name='15' id='15' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                )
                                :
                                (
                                  (this.state.apartado15.apartado)? 
                                    <button title={this.state.apartado15.vendedor} name='15' id='15' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                  :
                                    <button type="button" class={(this.state.genero15 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero15 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                )
                            }
                            <p className="smallDevice text-center">15</p>
                        </Col>
                        <Col xs="2" sm="1">
                            {(this.state.asiento16  == 'false') ? 
                                 (
                                  <button name='16' id='16' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                )
                                :
                                (
                                  (this.state.apartado16.apartado)? 
                                    <button title={this.state.apartado16.vendedor} name='16' id='16' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                  :
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
                                    <button name='17' id='17' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                )
                                :
                                (
                                  (this.state.apartado17.apartado)? 
                                    <button title={this.state.apartado17.vendedor} name='17' id='17' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                  :
                                    <button type="button" class={(this.state.genero17 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero17 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                )
                            }
                            <p className="smallDevice text-center">17</p>
                        </Col>
                        <Col xs="2" sm="1">
                            {(this.state.asiento18  == 'false') ? 
                                (
                                  <button name='18' id='18' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                )
                                :
                                (
                                  (this.state.apartado18.apartado)? 
                                    <button title={this.state.apartado18.vendedor} name='18' id='18' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                  :
                                    <button type="button" class={(this.state.genero18 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero18 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                )
                            }
                            <p className="smallDevice text-center">18</p>
                        </Col>
                        <Col xs="3">
                        </Col>
                        <Col xs="2" sm="1">
                            {(this.state.asiento19  == 'false') ? 
                                 (
                                  <button name='19' id='19' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                )
                                :
                                (
                                  (this.state.apartado19.apartado)? 
                                    <button title={this.state.apartado19.vendedor} name='19' id='19' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                  :
                                    <button type="button" class={(this.state.genero19 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero19 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                )
                            }
                            <p className="smallDevice text-center">19</p>
                        </Col>
                        <Col xs="2" sm="1">
                            {(this.state.asiento20  == 'false') ? 
                                 (
                                  <button name='20' id='20' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                )
                                :
                                (
                                  (this.state.apartado20.apartado)? 
                                    <button title={this.state.apartado20.vendedor} name='20' id='20' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                  :
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
                                    <button name='21' id='21' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                )
                                :
                                (
                                  (this.state.apartado21.apartado)? 
                                    <button title={this.state.apartado21.vendedor} name='21' id='21' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                  :
                                    <button type="button" class={(this.state.genero21 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero21 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                )
                            }
                            <p className="smallDevice text-center">21</p>
                        </Col>
                        <Col xs="2" sm="1">
                            {(this.state.asiento22  == 'false') ? 
                                (
                                  <button name='22' id='22' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                )
                                :
                                (
                                  (this.state.apartado22.apartado)? 
                                    <button title={this.state.apartado22.vendedor} name='22' id='22' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                  :
                                    <button type="button" class={(this.state.genero22 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero22 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                )
                            }
                            <p className="smallDevice text-center">22</p>
                        </Col>
                        <Col xs="3">
                        </Col>
                        <Col xs="2" sm="1">
                            {(this.state.asiento23  == 'false') ? 
                                 (
                                  <button name='23' id='23' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                )
                                :
                                (
                                  (this.state.apartado23.apartado)? 
                                    <button title={this.state.apartado23.vendedor} name='23' id='23' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                  :
                                    <button type="button" class={(this.state.genero23 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero23 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                )
                            }
                            <p className="smallDevice text-center">23</p>
                        </Col>
                        <Col xs="2" sm="1">
                            {(this.state.asiento24  == 'false') ? 
                                 (
                                  <button name='24' id='24' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                )
                                :
                                (
                                  (this.state.apartado24.apartado)? 
                                    <button title={this.state.apartado24.vendedor} name='24' id='24' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                  :
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
                                    <button name='25' id='25' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                )
                                :
                                (
                                  (this.state.apartado25.apartado)? 
                                    <button title={this.state.apartado25.vendedor} name='25' id='25' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                  :
                                    <button type="button" class={(this.state.genero25 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero25 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                )
                            }
                            <p className="smallDevice text-center">25</p>
                        </Col>
                        <Col xs="2" sm="1">
                            {(this.state.asiento26  == 'false') ? 
                                (
                                  <button name='26' id='26' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                )
                                :
                                (
                                  (this.state.apartado26.apartado)? 
                                    <button title={this.state.apartado26.vendedor} name='26' id='26' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                  :
                                    <button type="button" class={(this.state.genero26 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero26 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                )
                            }
                            <p className="smallDevice text-center">26</p>
                        </Col>
                        <Col xs="3">
                        </Col>
                        <Col xs="2" sm="1">
                            {(this.state.asiento27  == 'false') ? 
                                 (
                                  <button name='27' id='27' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                )
                                :
                                (
                                  (this.state.apartado27.apartado)? 
                                    <button title={this.state.apartado27.vendedor} name='27' id='27' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                  :
                                    <button type="button" class={(this.state.genero27 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero27 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                )
                            }
                            <p className="smallDevice text-center">27</p>
                        </Col>
                        <Col xs="2" sm="1">
                            {(this.state.asiento28  == 'false') ? 
                                 (
                                  <button name='28' id='28' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                )
                                :
                                (
                                  (this.state.apartado28.apartado)? 
                                    <button title={this.state.apartado28.vendedor} name='28' id='28' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                  :
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
                                    <button name='29' id='29' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                )
                                :
                                (
                                  (this.state.apartado29.apartado)? 
                                    <button title={this.state.apartado29.vendedor} name='29' id='29' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                  :
                                    <button type="button" class={(this.state.genero29 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero29 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                )
                            }
                            <p className="smallDevice text-center">29</p>
                        </Col>
                        <Col xs="2" sm="1">
                            {(this.state.asiento30  == 'false') ? 
                                (
                                  <button name='30' id='30' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                )
                                :
                                (
                                  (this.state.apartado30.apartado)? 
                                    <button title={this.state.apartado30.vendedor} name='30' id='30' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                  :
                                    <button type="button" class={(this.state.genero30 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero30 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                )
                            }
                            <p className="smallDevice text-center">30</p>
                        </Col>
                        <Col xs="3">
                        </Col>
                        <Col xs="2" sm="1">
                            {(this.state.asiento31  == 'false') ? 
                                 (
                                  <button name='31' id='31' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                )
                                :
                                (
                                  (this.state.apartado31.apartado)? 
                                    <button title={this.state.apartado31.vendedor} name='31' id='31' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                  :
                                    <button type="button" class={(this.state.genero31 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero31 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                )
                            }
                            <p className="smallDevice text-center">31</p>
                        </Col>
                        <Col xs="2" sm="1">
                            {(this.state.asiento32  == 'false') ? 
                                 (
                                  <button name='32' id='32' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                )
                                :
                                (
                                  (this.state.apartado32.apartado)? 
                                    <button title={this.state.apartado32.vendedor} name='32' id='32' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                  :
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
                                    <button name='33' id='33' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                )
                                :
                                (
                                  (this.state.apartado33.apartado)? 
                                    <button title={this.state.apartado33.vendedor} name='33' id='33' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                  :
                                    <button type="button" class={(this.state.genero33 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero33 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                )
                            }
                            <p className="smallDevice text-center">33</p>
                        </Col>
                        <Col xs="2" sm="1">
                            {(this.state.asiento34  == 'false') ? 
                                (
                                  <button name='34' id='34' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                )
                                :
                                (
                                  (this.state.apartado34.apartado)? 
                                    <button title={this.state.apartado34.vendedor} name='34' id='34' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                  :
                                    <button type="button" class={(this.state.genero34 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero34 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                )
                            }
                            <p className="smallDevice text-center">34</p>
                        </Col>
                        <Col xs="3">
                        </Col>
                        <Col xs="2" sm="1">
                            {(this.state.asiento35  == 'false') ? 
                                 (
                                  <button name='35' id='35' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                )
                                :
                                (
                                  (this.state.apartado35.apartado)? 
                                    <button title={this.state.apartado35.vendedor} name='35' id='35' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                  :
                                    <button type="button" class={(this.state.genero35 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero35 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                )
                            }
                            <p className="smallDevice text-center">35</p>
                        </Col>
                        <Col xs="2" sm="1">
                            {(this.state.asiento36  == 'false') ? 
                                 (
                                  <button name='36' id='36' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                )
                                :
                                (
                                  (this.state.apartado36.apartado)? 
                                    <button title={this.state.apartado36.vendedor} name='36' id='36' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                  :
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
                                    <button name='37' id='37' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                )
                                :
                                (
                                  (this.state.apartado37.apartado)? 
                                    <button title={this.state.apartado37.vendedor} name='37' id='37' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                  :
                                    <button type="button" class={(this.state.genero37 == 'H')? "btn btn-outline-secondary Hombre":(this.state.genero37 == 'M')? "btn btn-outline-secondary Mujer":"btn btn-outline-secondary None"} disabled></button>
                                )
                            }
                            <p className="smallDevice text-center">37</p>
                        </Col>
                        <Col xs="2" sm="1">
                            {(this.state.asiento38  == 'false') ? 
                                (
                                  <button name='38' id='38' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                )
                                :
                                (
                                  (this.state.apartado38.apartado)? 
                                    <button title={this.state.apartado38.vendedor} name='38' id='38' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                  :
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
                                          <button name='39' id='39' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                      )
                                      :
                                      (
                                        (this.state.apartado39.apartado)? 
                                          <button title={this.state.apartado39.vendedor} name='39' id='39' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                        :
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
                                          <button name='40' id='40' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                      )
                                      :
                                      (
                                        (this.state.apartado40.apartado)? 
                                          <button title={this.state.apartado40.vendedor} name='40' id='40' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                        :
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
                      <Row>
                          {
                            (this.state.noAsientos >= 41) ?
                            (
                              <Col xs="2" sm="1">
                                  {(this.state.asiento41 == 'false') ? 
                                      (
                                          <button name='41' id='41' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                      )
                                      :
                                      (
                                        (this.state.apartado41.apartado)? 
                                          <button title={this.state.apartado41.vendedor} name='41' id='41' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                        :
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
                                          <button name='42' id='42' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                      )
                                      :
                                      (
                                        (this.state.apartado42.apartado)? 
                                          <button title={this.state.apartado42.vendedor} name='42' id='42' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                        :
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
                                          <button name='43' id='43' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                      )
                                      :
                                      (
                                        (this.state.apartado43.apartado)? 
                                          <button title={this.state.apartado43.vendedor} name='43' id='43' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                        :
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
                                          <button name='44' id='44' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                      )
                                      :
                                      (
                                        (this.state.apartado44.apartado)? 
                                          <button title={this.state.apartado44.vendedor} name='44' id='44' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                        :
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
                                          <button name='45' id='45' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                      )
                                      :
                                      (
                                        (this.state.apartado45.apartado)? 
                                          <button title={this.state.apartado45.vendedor} name='45' id='45' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                        :
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
                                          <button name='46' id='46' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                      )
                                      :
                                      (
                                        (this.state.apartado46.apartado)? 
                                          <button title={this.state.apartado46.vendedor} name='46' id='46' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                        :
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
                                          <button name='47' id='47' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                      )
                                      :
                                      (
                                        (this.state.apartado47.apartado)? 
                                          <button title={this.state.apartado47.vendedor} name='47' id='47' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                        :
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
                                          <button name='48' id='48' type="button" className="btn btn-danger btn-lg asientoDisponible"></button>
                                      )
                                      :
                                      (
                                        (this.state.apartado48.apartado)? 
                                          <button title={this.state.apartado48.vendedor} name='48' id='48' type="button" className="btn btn-outline-danger asientoSeleccionado"></button>
                                        :
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
                      {/* FIN Asientos */}
                    </Col>
                  </div>
                </Col>
              </Row>
            </ModalBody>
          </Modal>
          {/* FIN Modal Disponibilidad de asientos */}
          {/* Modal Reprogramación */}
          <Modal size="lg" isOpen={this.state.modalReasignacion} toggle={this.toggleReasignacion}>
            <ModalHeader toggle={this.toggleReasignacion}>Reprogramación de viaje</ModalHeader>
            <ModalBody>
              <Row>
                <Col lg='4' md='4' sm='12' xs='12'>
                  <div class="form-group form-check">
                    <input type="checkbox" class="form-check-input" id="checkPenalizacion" onChange={this.handleChangePenalizacion} checked={this.state.penalizacion}/>
                    <label class="form-check-label" for="checkPenalizacion">Penalización</label>
                  </div>
                </Col>
                <Col lg='4' md='4' sm='12' xs='12'>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="radioMXN" value="MXN" checked/>
                    <label class="form-check-label" for="radioMXN">MXN</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="radioUS" value="US"/>
                    <label class="form-check-label" for="radioUS">US</label>
                  </div>
                </Col>
                <Col lg='4' md='4' sm='12' xs='12'>
                  <div class="form-group">
                    <label class="sr-only" for="inputPenalizacion">Penalización</label>
                    <div class="input-group mb-2">
                      <div class="input-group-prepend">
                        <div class="input-group-text">$</div>
                      </div>
                      <input type="number" min="0" class="form-control" id="inputPenalizacion" placeholder="Penalización" disabled={!this.state.penalizacion}/>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg='12' md='12' sm='12' xs='12'>
                  <div class="form-group">
                    <label for="txtMotivoReasignacion">Motivo</label>
                    <textarea class="form-control" id="txtMotivoReasignacion" rows="3"></textarea>
                  </div>
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.toggleReasignacion}>Cancelar</Button>
              <Button color="primary" onClick={this.fetchDatosReasignación}>Guardar</Button>{' '}
            </ModalFooter>
          </Modal>
          {/* FIN Modal Reprogramación */}
        </Container>
      </div>
    )
  }
}