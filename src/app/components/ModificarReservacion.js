/*Modificar reservacion o mostrar todas las reservaciones pendientes*/
import React, { Component } from 'react';
//import ReactDOM from "react-dom";
import {Button, Card, CardTitle, Container, Col, Form, FormGroup, Input, Label, Modal, ModalHeader, ModalBody, ModalFooter, Row, Table} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import Select from 'react-select';

import GenerarReservacion from "./reservacionPDF";

import GenerarBoleto from "./boletoPDF";

import GenerarCancelacion from "./cancelacionPDF";

//import ModalHistorialPagoReservacion from "./modalHistorialPagoReservacion.js";

//const node = ReactDOM.findDOMNode(this);

/* Variables */


var origenesDestinosIDS = [];
var origenesDestinosNombres = [];

var origenesDestinos = [];

var validateFecha = false;

export default class ModificarReservacion extends Component {

    constructor(props) {
        super(props);
        this.state = {
            validationTxtMotivo: true,
            validationFechaHora: true,
            nameClienteCancelacion: '',
            fechaClienteCancelacion: '',
            origenClienteCancelacion: '',
            destinoClienteCancelacion: '',
            modalCancelar: false,
            validationPago: true,
            modalHistorialDePagos: false,
            modalModificarReservacion: false,
            modalRegistrarPago: false,
            dataModalCliente: null,
            dataModalFolio: null,
            dataModalCambio: null,
            dataModalTotal: null, //Esta variable representa el total del costo del boleto
            dataModalPagos: null,
            dataModalMontoTotalPagos: null,
            dataModalPagoPendiente: null,
            dataModalAnticipoCantidad: null,
            dataModalAnticipoFecha: null,
            reservaciones: [],
            optCorridas: [],
            optAsientos: [],
            cambio: 0,
            pago: 0,
            idVentaCancelacion: null,
            nameClienteCancelacion: null,
            fechaClienteCancelacion: null,
            origenClienteCancelacion: null,
            destinoClienteCancelacion: null,
            folioBoleto: '',
            nombreCliente: '',
            origenReservacion: '',
            destinoReservacion: '',
            idVentaModificar: '',
            origenID: '',
            destinoID: '',
            idViaje: '',
            asientoModificacion: '',
            idReservacion: '',
            dia: '',
            anio: '',
            diaDelAnio: ''
        };

        this.fetchReservaciones = this.fetchReservaciones.bind(this);
        this.buquedaFechaFolio = this.buquedaFechaFolio.bind(this);
        this.fetchOrigenesYDestinos = this.fetchOrigenesYDestinos.bind(this);
        this.setOptOrigenesDestinos = this.setOptOrigenesDestinos.bind(this);
        this.limpiarFechaFolio = this.limpiarFechaFolio.bind(this);
        this.obtenerID = this.obtenerID.bind(this);
        this.obtenerIdVendedor = this.obtenerIdVendedor.bind(this);
        this.onChangePago = this.onChangePago.bind(this);

        this.imprimirReservacion = this.imprimirReservacion.bind(this);
        this.cancelarReservacion = this.cancelarReservacion.bind(this);
        this.verHistorialDePago = this.verHistorialDePago.bind(this);
        this.registrarPago = this.registrarPago.bind(this);
        this.registrarNuevoPago = this.registrarNuevoPago.bind(this);
        this.savePago = this.savePago.bind(this);
        this.validarCancelarVenta = this.validarCancelarVenta.bind(this);
        this.validarCancelacion = this.validarCancelacion.bind(this);
        this.fetchDatosCancelacion = this.fetchDatosCancelacion.bind(this);
        this.cancelarVenta = this.cancelarVenta.bind(this);
        this.handleChangeFechaHora = this.handleChangeFechaHora.bind(this);
        this.fetchDatosModificacion = this.fetchDatosModificacion.bind(this);
        this.buscarAsientos = this.buscarAsientos.bind(this);
        this.getDiaDelAnio = this.getDiaDelAnio.bind(this);
        this.handleChangeCorrida = this.handleChangeCorrida.bind(this);
        this.handleChangeAsiento = this.handleChangeAsiento.bind(this);
        this.validarModificarReservacion = this.validarModificarReservacion.bind(this);
        this.actualizarReservacion = this.actualizarReservacion.bind(this);

        this.toggleModalHistorialDePagos = this.toggleModalHistorialDePagos.bind(this);
        this.toggleModalRegistrarPago = this.toggleModalRegistrarPago.bind(this);
        this.toggleCancelar = this.toggleCancelar.bind(this);
        this.toggleModalModificar = this.toggleModalModificar.bind(this);
        this.validarToggleModalModificar = this.validarToggleModalModificar.bind(this);

        this.priceFormatter = this.priceFormatter.bind(this);
        this.dateFormatter = this.dateFormatter.bind(this);
        this.seatFormatter = this.seatFormatter.bind(this);
        this.discountFormatter = this.discountFormatter.bind(this);

        this.onBeforeSaveCell = this.onBeforeSaveCell.bind(this);
        this.onAfterSaveCell = this.onAfterSaveCell.bind(this);

        this.buquedaNombre = this.buquedaNombre.bind(this);
        this.limpiarNombres = this.limpiarNombres.bind(this);
    }

    componentDidMount(){
        this.refs.table.state.selectedRowKeys.length = 0;
        var f = new Date();
        let dia = (f.getDate() > 9)? f.getDate():'0'+f.getDate();
        let mes = (f.getMonth() +1);
        let anio = f.getFullYear();
        //console.log(`${dia}-${mes}-${anio}`);
        this.setState({
            busquedaFecha: `${dia}-${mes}-${anio}`
        });
        this.fetchReservaciones(`${dia}-${mes}-${anio}`, 'fechaViaje', false, true);
        this.fetchOrigenesYDestinos();
    }

    componentWillUnmount(){
        this.refs.table.state.selectedRowKeys.length = 0;
    }

    handleChangeFechaHora(){
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

        if((anioFechaDeViaje < anio) || ((anioFechaDeViaje == anio) && (diaAnioViaje<diaAnioHoy))){//si el anio que seleccionamos es menor al año actual, retornamos false
            alert('No puedes seleccionar una fecha anterior al dia de hoy');
            selectFechaHora.value = '';
            return false;
        }else{
            //Ahora verificamos que ya esté abierta la fecha
            //El formato de la fecha debe ser "dd-mm-aaaa"
            let buscarFecha = `${arrayFechaDeViaje[2]}-${arrayFechaDeViaje[1]}-${arrayFechaDeViaje[0]}`;
            console.log(`/api/AsignarViajes/${this.state.origenID}/${this.state.destinoID}/${buscarFecha}`);
            fetch(`/api/AsignarViajes/${this.state.origenID}/${this.state.destinoID}/${buscarFecha}`)
            .then(res => res.json())
            .then(data => {
                if(data.length > 0){
                    this.setState({
                        optCorridas: data,
                        //validationFechaHora: true,
                    });
                }else{
                    selectFechaHora.value = '';
                    alert('No hay viaje que coincida, escoge otra fecha o contáctate con la matriz');
                }
            });
        }
    }

    fetchReservaciones(value, field, folio, init){
        if(folio){
            console.log(`/api/Reservaciones/${value}/${field}/${folio}`);
            fetch(`/api/Reservaciones/${value}/${field}/${folio}`)
            .then(res => res.json())
            .then(data => {
                if(data.length > 0){
                    this.setState({
                        reservaciones: data
                    })
                }else{
                    this.setState({
                        reservaciones: []
                    });
                    alert('No se encontró resultado que coincida con tu búsqueda');
                }
            })
        }else{
            console.log(`/api/Reservaciones/${value}/${field}`);
            fetch(`/api/Reservaciones/${value}/${field}`)
            .then(res => res.json())
            .then(data => {
                if(data.length > 0){
                    this.setState({
                        reservaciones: data
                    })
                }else{
                    this.setState({
                        reservaciones: []
                    })
                    if(!init){
                        alert('No se encontró resultado que coincida con tu búsqueda');
                    } 
                }
            })
        }
    }

    fetchOrigenesYDestinos(){
        fetch(`/api/OrigenesYdestinos/all/nombreCompleto`)
          .then(res => res.json())
          .then(data => {
            if(data.length > 0){
              origenesDestinos = data;
            }
          }).then(() => {
            this.setOptOrigenesDestinos();
          });
    }

    setOptOrigenesDestinos(){
        for (const origenDestino in origenesDestinos){
            origenesDestinosIDS[origenDestino] = origenesDestinos[origenDestino]._id;
            origenesDestinosNombres[origenDestino] = origenesDestinos[origenDestino].nombre;
        }
    }

    buquedaFechaFolio(){
        let fechaViaje = document.getElementById('fechaViaje').value;
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
            this.fetchReservaciones(`${arrayFechaDeViaje[2]}-${arrayFechaDeViaje[1]}-${arrayFechaDeViaje[0]}`, 'fechaViaje');
        }else if((folioUsuario != null && folioUsuario != '') && (folio != null && folio != '') && (fechaViaje == null || fechaViaje == '')){
            //Hacemos busqueda Por folio     
            this.setState({
                busqueda: 'folio',
                folio: folio,
                folioUsuario: folioUsuario
            }); 
            this.fetchReservaciones(folioUsuario, 'folio', folio);
        }else{
            alert('Llena solo un campo para la busqueda');
        }
    }

    limpiarFechaFolio(){
        document.getElementById('fechaViaje').value = '';
        document.getElementById('folio').value = '';
        document.getElementById('folioUsuario').value = '';
    }

    imprimirReservacion(){
        console.log(this.refs.table.state);
        
        let selectedRowKeys = this.refs.table.state.selectedRowKeys;
        console.log(`/api/Reservaciones/${selectedRowKeys[0]}/reimpresion`);
        /*for (let i = 0; i < selectedRowKeys.length; i++) {
            this.printReservacion(selectedRowKeys[i]);
        }*/
        fetch(`/api/Reservaciones/${selectedRowKeys[0]}/reimpresion`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if(data.type == 'boleto'){
                    GenerarBoleto(data.resBoleto);
                }else{
                    GenerarReservacion(data.respuesta);
                }
            })
    }

    verHistorialDePago(){
        let id = this.obtenerID();
        //Falta abrir modal con el historial de pagos.
        //Dependiendo del id ya obtenido, se buscara en la BD los pagos
        fetch(`/api/Reservaciones/${id}/getHistorialDePago`)
          .then(res => res.json())
          .then(data => {
            if(data.length > 0){
                console.log(data);
                this.setState({
                    dataModalCliente: data[0].general.nombreCliente,
                    dataModalFolio: data[0].general.folioDeReservacion,
                    dataModalCambio: data[0].general.tipoDeCambio,
                    dataModalTotal: data[0].general.totalPagar,
                    dataModalMontoTotalPagos: data[0].general.montoTotalPagos,
                    dataModalPagoPendiente: data[0].general.pagoPendiente,
                    dataModalAnticipoCantidad: data[0].anticipo.cantidad,
                    dataModalAnticipoFecha: data[0].anticipo.fecha,
                    dataModalPagos: data[0].pagos,
                    
                });
            }
          }).then(() => {            
            this.toggleModalHistorialDePagos();
          })        
    } 

    toggleModalHistorialDePagos(){
        this.setState(prevState => ({
            modalHistorialDePagos: !prevState.modalHistorialDePagos,            
        }));
    }

    toggleModalRegistrarPago() {
        this.setState(prevState => ({
            modalRegistrarPago: !prevState.modalRegistrarPago,
            cambio: 0,
        }));
    }

    obtenerID(){
        let parent = document.querySelector('input[type="radio"]:checked').parentNode;
        let next = parent.nextSibling;
        let id = next.firstChild;

        return id['wholeText'];
    }

    cancelarReservacion(){

        /*Abrir modal para cancelar*/

        /*let id = this.obtenerID();

        fetch(`/api/Reservaciones/${id}/false/activo`, {
            method: 'PUT',
            //body: JSON.stringify(this.state),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
              //console.log(res);
              //this.fetchReservaciones();
            })*/
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

    /////////////////////CANCELACION DE VENTA
    cancelarVenta(motivo){
        console.log('selectedRowKeys',this.refs.table.state.selectedRowKeys);   
        console.log(`/api/Ventas/${this.state.idVentaCancelacion}/${motivo}/cancelarReservacion/`);
        fetch(`/api/Ventas/${this.state.idVentaCancelacion}/${motivo}/cancelarReservacion/`, {
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
            this.fetchReservaciones(`${dia}-${mes}-${anio}`, 'fechaViaje');
            this.toggleCancelar();
            GenerarCancelacion(data);
            this.refs.table.state.selectedRowKeys.length = 0;
            alert('Se ha generado la cancelacion!!');
        })
        .catch(() => {
            alert('Ha ocurrido un error, por favor intentalo mas tarde');
        });
    }

    fetchDatosCancelacion(id){
        console.log(`/api/Reservaciones/${id}/datosReservacion`);
        fetch(`/api/Reservaciones/${id}/datosReservacion`)
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

    onChangePago(e){
        let pago = parseFloat(e.target.value);
        if(pago >= this.state.dataModalPagoPendiente){
            this.setState({
                cambio: pago - this.state.dataModalPagoPendiente,
                pago: pago
            });
        }else{
            this.setState({
                cambio: 0,
                pago: pago
            });
        }
    }

    obtenerIdVendedor(){

    }

    savePago(){
        if(this.state.pago == '0' || this.state.pago == null || this.state.pago == ''){
            this.setState({
                validationPago: false
            });
        }else{
            
            if(this.state.pago >= this.state.dataModalPagoPendiente){
                //Aqui ya se concluyó la deuda, por lo que procedemos a modificar en la reservacion el statePagado por true y registrar el pago
                let id = this.obtenerID();

                //let vendedor = this.obtenerIdVendedor(id);
                
                fetch(`/api/Reservaciones/${id}/true/statePagado`, {
                    method: 'PUT',
                    //body: JSON.stringify(this.state),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                    .then(res => {
                        if(res.ok){
                            alert('Se ha registrado su pago!');
                            fetch(`/api/Reservaciones/${id}/vendedor`)
                            .then(res => res.json())
                            .then(data => {
                                console.log('vendedordata',data);
                                //Se ha cambiado el estado de la reservacion a pagado, por lo que procedemos a guardar el pago
                                let hoy = new Date();
                                let dia = (hoy.getDate() > 10)? hoy.getDate() : '0'+hoy.getDate();
                                let mes = (parseInt(hoy.getMonth())+1 > 10)? parseInt(hoy.getMonth())+1 : '0'+parseInt(hoy.getMonth())+1;
                                let newPago = {
                                    id_Reservacion: id,
                                    cantidad: this.state.dataModalPagoPendiente,
                                    fecha: `${dia}-${mes}-${hoy.getFullYear()}`,
                                    statePagado: 'false',
                                    fechaPago: hoy,
                                    vendedor: data
                                }
                                console.log(newPago);
                                this.registrarNuevoPago(newPago);
                            })
                        }else{
                            alert('Ha ocurrido un error, por favor inténtalo más tarde');
                        }
                      //this.fetchReservaciones();
                    })
            }else{
                //Aqui sólo registramos el pago, ya que la deuda sigue inconclusa.
                let id = this.obtenerID();
                fetch(`/api/Reservaciones/${id}/vendedor`)
                    .then(res => res.json())
                    .then(data => {
                        console.log('vendedordata',data);
                        //Se ha cambiado el estado de la reservacion a pagado, por lo que procedemos a guardar el pago
                        let hoy = new Date();
                        let dia = (hoy.getDate() > 10)? hoy.getDate() : '0'+hoy.getDate();
                        let mes = (parseInt(hoy.getMonth())+1 > 10)? parseInt(hoy.getMonth())+1 : '0'+parseInt(hoy.getMonth())+1;
                        let newPago = {
                            id_Reservacion: id,
                            cantidad: this.state.dataModalPagoPendiente,
                            fecha: `${dia}-${mes}-${hoy.getFullYear()}`,
                            statePagado: 'false',
                            fechaPago: hoy,
                            vendedor: data
                        };
                        console.log(newPago);
                        this.registrarNuevoPago(newPago);
                    })
            }
        }
    }

    registrarNuevoPago(newPago){
        //console.log('nuevoPago',newPago);
        fetch('/api/Pagos', {
            method: 'POST',
            body: JSON.stringify(newPago),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
          })
          .then(res => {
            //console.log(res.json());
            this.buquedaFechaFolio();
            this.toggleModalRegistrarPago();
          }) 
          .catch(err => {
            console.log(err);
            alert('Ha ocurrido un error, intentalo más tarde');
          });
    }

    //Este es para buscar
    registrarPago(){
        let id = this.obtenerID();
        //Dependiendo del id ya obtenido, se buscara en la BD los pagos
        fetch(`/api/Reservaciones/${id}/getHistorialDePago`)
          .then(res => res.json())
          .then(data => {
            if(data.length > 0){
                console.log(data);
                this.setState({
                    dataModalCliente: data[0].general.nombreCliente,
                    dataModalFolio: data[0].general.folioDeReservacion,
                    dataModalCambio: data[0].general.tipoDeCambio,
                    dataModalTotal: data[0].general.totalPagar,
                    dataModalMontoTotalPagos: data[0].general.montoTotalPagos,
                    dataModalPagoPendiente: data[0].general.pagoPendiente,
                    dataModalAnticipoCantidad: data[0].anticipo.cantidad,
                    dataModalAnticipoFecha: data[0].anticipo.fecha,
                    dataModalPagos: data[0].pagos,
                    
                });
            }
          }).then(() => {            
            this.toggleModalRegistrarPago();
            //this.buquedaFechaFolio();
          }) 
    }

    priceFormatter(cell, row) {
        //console.log(row.tipoDeCambio);
        if(row.tipoDeCambio == 'MX'){
            return '<span class="badge badge-success">MX</span> $'+cell;
        }else{
            return '<span class="badge badge-primary">US</span> $'+cell;
        }
        
    }

    dateFormatter(cell, row){
        if(row.dia == 'null'){
            return 'Sin asignar';
        }else{
            return row.dia;
        }
    }

    seatFormatter(cell, row){
        if(row.asiento == 'null' || row.asiento == ''){
            return 'Sin asignar'
        }else{
            return row.asiento;
        }
    }

    discountFormatter(cell, row){
        if(row.descuento == 'null'){
            return 'Ninguno';
        }else{
            return row.descuento;
        }
    }

    toggleModalModificar(){
        this.setState(prevState => ({
            modalModificarReservacion: !prevState.modalModificarReservacion,            
        }));
    }

    validarToggleModalModificar(){
        try {
            let selectedRowKeys = null;
            selectedRowKeys = this.refs.table.state.selectedRowKeys;
            console.log(selectedRowKeys);
            this.setState({
                optCorridas: [],
                optAsientos: [],
                folioBoleto: '',
                nombreCliente: '',
                origenReservacion: '',
                destinoReservacion: '',
                idVentaModificar: '',
                origenID: '',
                destinoID: '',
                idViaje: '',
                asientoModificacion: ''
            });
            if(selectedRowKeys.length == 1){
                this.fetchDatosModificacion(selectedRowKeys[0]);
            }else{
              alert('Por favor selecciona sólo un registro');
            }
        }catch (error) {
            alert('Ha ocurrido un error, por favor intentalo más tarde');
            console.log(error);
        }
    }

    fetchDatosModificacion(id){
        console.log(`/api/Reservaciones/${id}/datosReservacion`);
        fetch(`/api/Reservaciones/${id}/datosReservacion`)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    idVentaModificar: id,
                    folioBoleto: data.folio,
                    nombreCliente: data.nameCliente,
                    origenReservacion: data.origen,
                    destinoReservacion: data.destino,
                    origenID: data.origenID,
                    destinoID: data.destinoID
                });
                if(data.pagado == 'true'){
                    console.log('data.asiento', data.asiento);
                    if(typeof data.asiento === 'undefined'){
                        this.toggleModalModificar();                                             
                    }else{
                        alert('Ya ha sido completada esta Reservacion');   
                    }
                }else{
                    alert('El cliente aun no ha liquidado su Boleto');
                }
                
            })
    }

    getDiaDelAnio(fechaInicial, fechaFinal){

        let fechaini = new Date(fechaInicial);
        let fechafin = new Date(fechaFinal);
        let diasdif= fechafin.getTime()-fechaini.getTime();
        let contdias = Math.round(diasdif/(1000*60*60*24));

        return (contdias+1);
    }

    handleChangeCorrida(e){
        this.setState({
            idViaje: e.value,
            dia: e.dia,
            anio: e.anio,
            diaDelAnio: e.diaDelAnio,
        });
    }

    handleChangeAsiento(e){
        this.setState({
            asientoModificacion: e.value
        });
    }

    buscarAsientos(){
        console.log(`/api/AsignarViajes/${this.state.idViaje}/asientosModificarReservacion`);
        fetch(`/api/AsignarViajes/${this.state.idViaje}/asientosModificarReservacion`)
            .then(res => res.json())
            .then(data => {
                if(data.length > 0){
                    this.setState({
                        optAsientos: data
                    })
                }else{
                    alert('No hay asientos disponibles');
                }
            })
    }

    validarModificarReservacion(){
        let valido = true;
        if(this.state.idVentaModificar == ''){
            valido = false;
        }
        if(this.state.dia == ''){
            valido = false;
        }
        if(this.state.anio == ''){
            valido = false;
        }
        if(this.state.diaDelAnio == ''){
            valido = false;
        }
        if(this.state.asientoModificacion == ''){
            valido = false;
        }
        if(this.state.idViaje == ''){
            valido = false;
        }

        if(valido){
            this.actualizarReservacion();
        }else{
            alert('Falta llenar datos');
        }
    }

    actualizarReservacion(){
        console.log(`/api/Reservaciones/${this.state.idVentaModificar}/actualizarReservacion`);
        console.log(this.state);
        fetch(`/api/Reservaciones/${this.state.idVentaModificar}/actualizarReservacion`, {
            method: 'PUT',
            body: JSON.stringify(this.state),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
          })
          .then(res => res.json())
          .then(data => {
            if(data.disponible){
                alert('Se ha actualizado la Rervacion');
                this.buquedaFechaFolio();
                this.toggleModalModificar();
            }else{
                alert('Ha ocurrido un error, vuelve a intentarlo');
                this.toggleModalModificar();
            }
            //this.fetchVentas();
          })
    }

    onBeforeSaveCell(row, cellName, cellValue){
        //CellValue es el nuevo valor
        //row se supone que es el row con el valor anterior, pero si lo imprimo me regresa el nuevo valor (?)
        if(row.dia == cellValue){
            alert('Seleccionaste la misma fecha');
            return false;
        }
        if(confirm("En verdad deseas modificar el campo?")){
            switch (cellName) {
                case 'dia':
                    //formato de fecha aaaa-mm-dd -> CellValue //
                    let fecha = cellValue.split('-',3);
                    fecha = `${fecha[2]}-${fecha[1]}-${fecha[0]}`;
                    //////////////////////////////////////////////
                    fetch(`/api/Reservaciones/${row._id}/${fecha}/fecha`, {
                        method: 'PUT',
                        //body: JSON.stringify(this.state),
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    }).then(res => res.json()
                    ).then((r) => {
                        if(r.message == 'Fecha no disponible'){
                            alert('Fecha no disponible');
                            validateFecha = false;
                            return false;
                        }else{
                            validateFecha = true;
                            return true;
                        }
                    }).catch(e => {console.log(e); return false})
                    break;
                case 'asiento':
                    console.log(
                        `/api/Reservaciones/${row._id}/${row._id}/${cellValue}/${cellName}/hola`
                    );
                    ///api/Reservaciones/5fb70540987a1023b0435f59/5fb70540987a1023b0435f59/5/asiento
                    /*fetch(`/api/Reservaciones/${row._id}/${row.idViaje}/${cellValue}/${cellName}`, {
                        method: 'PUT',
                        //body: JSON.stringify(this.state),
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    }).then((res) => {
                        console.log(res.json);
                        //this.fetchReservaciones();
                    });*/
                    break;
                default:
                    return true;
                    break;
            }
        }else{
            return false;
        }
    }

    onAfterSaveCell(row, cellName, cellValue){
        /*if(cellName == 'asiento'){
            console.log(
                `/api/Reservaciones/${row._id}/${row.idViaje}/${cellValue}/${cellName}`
            );
            fetch(`/api/Reservaciones/${row._id}/${row.idViaje}/${cellValue}/${cellName}`, {
                method: 'PUT',
                //body: JSON.stringify(this.state),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                console.log(res.json);
                //this.fetchReservaciones();
            });
        }else{
            //this.fetchReservaciones();
        }        */
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

        console.log(`/api/Reservaciones/${nom}/pasajeroReservaciones/${ap}/${am}`);
        fetch(`/api/Reservaciones/${nom}/pasajeroReservaciones/${ap}/${am}`)
        .then(res => res.json())
        .then(data => {
            if(data.length > 0){
                this.setState({
                    reservaciones: data,
                });
            }else{
                this.setState({
                    reservaciones: [],
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

    render() {
        const cellEditProp = {
            mode: 'dbclick',
            blurToSave: true,
            beforeSaveCell: this.onBeforeSaveCell, // a hook for before saving cell
            afterSaveCell: this.onAfterSaveCell,  // a hook for after saving cell
        };
        return(
            <div>
                <Container style={{ marginTop: "15px" }}>
                    <br/>
                    <Form>
                    <Card body outline color="secondary">
                        <CardTitle className="text-center"><h3>Reservaciones</h3></CardTitle>
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
                            <Button color="primary" onClick={this.buquedaFechaFolio}><i className="fa fa-search"/></Button>
                            </Col>
                            <Col className="btn-nuevoPasajero" lg='1' md='1' sm='1' xs='1'>
                            <Button color="primary" onClick={this.limpiarFechaFolio}><i className="fa fa-eraser"/></Button>
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
                            <Col lg={{ size: 2, offset: 1 }} md={{ size: 2, offset: 1 }} sm={{ size: 2, offset: 1 }} xs={{ size: 2, offset: 1 }}>
                                <Button color="warning" onClick={this.imprimirReservacion}><i className="fa fa-print"/> Reimprimir Reservación</Button>
                            </Col>
                            <Col lg='2' md='2' sm='2' xs='2'>
                                <Button color="danger" onClick={this.validarCancelarVenta}><i className="fa fa-ban"/> Cancelar Reservacion</Button>
                            </Col>
                            <Col lg='2' md='2' sm='2' xs='2'>
                                <Button color="primary" onClick={this.validarToggleModalModificar}><i className="fa fa-edit"/> Modificar Reservacion</Button>
                            </Col>
                            <Col lg='2' md='2' sm='2' xs='2'>
                                <Button color="info" onClick={this.verHistorialDePago}><i className="fa fa-search-dollar"/> Historial de Pagos</Button>
                            </Col>
                            <Col lg='2' md='2' sm='2' xs='2'>
                                <Button color="success" onClick={this.registrarPago}><i className="fa fa-dollar-sign"/> Registrar Pago</Button>
                            </Col>
                        </Row>
                        {/** TERMINA ACCIONES **/}
                    </Card>
                    </Form>
                    <br/>
                    <br/>
                    <Row>
                        <Col lg='12' md='12' sm='12' xs='12'>
                            <BootstrapTable ref='table' data={ this.state.reservaciones } selectRow={ {mode: 'radio'} }>
                                <TableHeaderColumn dataField='_id' isKey hidden>ID</TableHeaderColumn>
                                <TableHeaderColumn width='100' dataField='folio' editable={ false }>Folio</TableHeaderColumn>
                                <TableHeaderColumn width='250' dataField='cliente' editable={ false }>Cliente</TableHeaderColumn>
                                <TableHeaderColumn width='110' dataField='razon' editable={ false }>Razón</TableHeaderColumn>
                                <TableHeaderColumn width='150' dataField='descuento' dataFormat={ this.discountFormatter } editable={ false }>Descuento</TableHeaderColumn>
                                <TableHeaderColumn width='150' dataField='origen' >Origen</TableHeaderColumn>
                                <TableHeaderColumn width='150' dataField='destino'>Destino</TableHeaderColumn>
                                <TableHeaderColumn width='150' dataField='dia' dataFormat={ this.dateFormatter }>Fecha</TableHeaderColumn>
                                <TableHeaderColumn width='85' dataField='asiento' dataFormat={ this.seatFormatter }>Asiento</TableHeaderColumn>
                                <TableHeaderColumn width='150' dataAlign='right' dataFormat={ this.priceFormatter } dataField='pagoPendiente' editable={ false }>Pago Pendiente</TableHeaderColumn>
                                <TableHeaderColumn dataField='tipoDeCambio' hidden>Tipo de Cambio</TableHeaderColumn>
                                <TableHeaderColumn dataField='idViaje' hidden>ID viaje</TableHeaderColumn>
                            </BootstrapTable>
                        </Col>
                    </Row>
                    <br/>
                    <br/>
                    <br/>
                </Container>
                {/* Modal Modificar Reservacion */}
                <Modal isOpen={this.state.modalModificarReservacion} toggle={this.toggleModalModificar} className={this.props.className}>
                    <ModalHeader toggle={this.toggleModalModificar}>Modificar Reservacion</ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col lg='6' md='6' sm='6' xs='6'>
                                <div class="form-group">
                                    <label>Folio:</label>
                                    <Input id="folioBoleto" plaintext value={this.state.folioBoleto} />
                                </div>
                            </Col>
                            <Col lg='6' md='6' sm='6' xs='6'>
                                <div class="form-group">
                                    <label>Cliente:</label>
                                    <Input id="nombreCliente" plaintext value={this.state.nombreCliente} />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg='6' md='6' sm='6' xs='6'>
                                <div class="form-group">
                                    <label>Origen:</label>
                                    <Input id="origenReservacion" plaintext value={this.state.origenReservacion} />
                                </div>
                            </Col>
                            <Col lg='6' md='6' sm='6' xs='6'>
                                <div class="form-group">
                                    <label>Destino:</label>
                                    <Input id="destinoReservacion" plaintext value={this.state.destinoReservacion} />
                                </div>
                            </Col>
                        </Row>
                        <hr/>
                        <Row form> 
                            <Col lg={10} md={10} sm={10} xs={10}>
                                <Label for="selectFechaHora">Fecha:</Label>
                                <Input
                                    type="date"
                                    name="date"
                                    id="selectFechaHora"
                                    placeholder="date placeholder"
                                />
                            </Col>
                            <Col className="btn-nuevoPasajero" lg={2} md={2} sm={2} xs={2}>
                                <Button onClick={this.handleChangeFechaHora} color="secondary"><i className='fa fa-search'/></Button>
                            </Col>
                        </Row>
                        <br/>
                        <Row form>
                            <Col lg={10} md={10} sm={10} xs={10}>                    
                                <Label for="selectCorrida">Corrida:</Label>
                                <Select
                                    id="selectCorrida"
                                    options={this.state.optCorridas}
                                    placeholder = "Selecciona..."
                                    onChange={this.handleChangeCorrida}
                                />
                            </Col>
                            <Col className="btn-nuevoPasajero" lg={2} md={2} sm={2} xs={2}>
                                <Button onClick={this.buscarAsientos} color="secondary"><i className='fa fa-search'/></Button>
                            </Col>
                        </Row>
                        <br/>
                        <Row form>
                            <Col lg={12} md={12} sm={12} xs={12}>                    
                                <Label for="selectAsiento">Asiento Disponible:</Label>
                                <Select
                                    id="selectAsiento"
                                    options={this.state.optAsientos}
                                    placeholder = "Selecciona..."
                                    onChange = {this.handleChangeAsiento}
                                />
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggleModalModificar}>Cancelar</Button>
                        <Button color="primary" onClick={this.validarModificarReservacion}>Guardar</Button>
                    </ModalFooter>
                </Modal>
                {/* FIN Modal Modificar Reservacion */}
                {/* Modal Ver Historial de Pagos */}
                <Modal isOpen={this.state.modalHistorialDePagos} toggle={this.toggleModalHistorialDePagos} className={this.props.className}>
                    <ModalHeader toggle={this.toggleModalHistorialDePagos}>Historial de pago por reservacion</ModalHeader>
                    <ModalBody>
                        <p><strong>Cliente: </strong><span>{this.state.dataModalCliente}</span></p>
                        <p><strong>Folio: </strong><span> {this.state.dataModalFolio}</span></p>
                        <br/>
                        <div class="card">
                            <div class="card-body">
                                <Row>
                                    <Col lg={6} md={6} sm={12} xs={12}>
                                        <p><strong>Pagos: </strong></p>
                                    </Col>
                                    <Col lg={6} md={6} sm={12} xs={12}>
                                        <p><strong>Total a pagar: </strong>{this.state.dataModalCambio} ${this.state.dataModalTotal}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={12} md={12} sm={12} xs={12}>
                                        <Table>
                                            <thead>
                                                <tr>
                                                    <th>Fecha</th>
                                                    <th>Monto</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* Anticipo */}
                                                {
                                                    (this.state.dataModalAnticipoCantidad != '0')? 
                                                    (<tr>
                                                        <td>{this.state.dataModalAnticipoFecha}</td>
                                                        <td>${this.state.dataModalAnticipoCantidad}</td>
                                                    </tr>)
                                                    :
                                                    null
                                                }  
                                                
                                                {
                                                    (this.state.dataModalPagos != null)? 
                                                        this.state.dataModalPagos.map((pago, i) => {
                                                            const {
                                                                cantidad,
                                                                fecha,
                                                            } = pago;
                                                            return(
                                                                <tr key = {fecha}>
                                                                    <td>{fecha}</td>
                                                                    <td>${cantidad}</td>
                                                                </tr>
                                                            )
                                                        })
                                                    :
                                                    null                                                   
                                                }                                              
                                                {/* Fin Anticipo */}
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <th>Total</th>
                                                    <th>${this.state.dataModalMontoTotalPagos}</th>
                                                </tr>
                                                <tr>
                                                    <th>Pendiente</th>
                                                    <th>${this.state.dataModalPagoPendiente}</th>
                                                </tr>
                                            </tfoot>
                                        </Table>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggleModalHistorialDePagos}>OK</Button>
                    </ModalFooter>
                </Modal>
                {/* FIN Modal Ver Historial de Pagos */}
                {/* Modal Registrar Pago */}
                <Modal isOpen={this.state.modalRegistrarPago} toggle={this.toggleModalRegistrarPago} className={this.props.className}>
                    <ModalHeader toggle={this.toggleModalRegistrarPago}>Registrar Pago</ModalHeader>
                    <ModalBody>
                        <p><strong>Cliente: </strong> {this.state.dataModalCliente}</p>
                        <p><strong>Folio: </strong> {this.state.dataModalFolio}</p>
                        <br/>
                        <div class="card">
                            <Table borderless>
                                <thead>
                                    <tr>
                                        <th>Pendiente</th>
                                        <th>{this.state.dataModalCambio} ${this.state.dataModalPagoPendiente}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th scope="row">Pago:</th>
                                        <td>
                                            <div class={(this.state.validationPago) ? 'card border-light': 'card border-danger'}>
                                                <Input onChange={this.onChangePago} type="text" name="inputPago" id="inputPago" placeholder="Pago"/>
                                            </div>
                                            <p class={(this.state.validationPago) ? 'textValid': 'textInvalid'}>Introduce correctamente el pago</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Cambio:</th>
                                        <td><Input plaintext value={this.state.cambio} type="text" name="inputCambio" id="inputCambio" placeholder="Cambio" readOnly/></td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggleModalRegistrarPago}>Cancelar</Button>
                        <Button color="success" onClick={this.savePago}>Registrar</Button>
                    </ModalFooter>
                </Modal>
                {/* FIN Modal Registrar Pago */}
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
            </div>
        )
    }
}