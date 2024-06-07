import React, { Component } from 'react';
import {Button, Card, CardTitle, Container, Col, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, ModalFooter, Row} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

import GenerarBoleto from "./boletoPDF";

/* Variables */
var ventas = [];

var clientes = [];

var descuentos = [];

var vendedores = [];

var origenesDestinos = [];

var viajes = [];

var fechaAnt = null;

var validateNewFecha = false;

//Variables OPTION
var clientesIDs = [];
var clientesNombres = [];

var descuentosIDS = [];
var descuentosNombres = [];

var origenesDestinosIDS = [];
var origenesDestinosNombres = [];

var fechasIDS = [];
var fechasLabels = [];

var razones = [
    'Ciudadano',
    'Residente',
    'Visa'
];

var fechas = [];

//Solo los asientos disponibles
var asientos = [];

export default class modificarVenta extends Component {
    constructor(props){
        super(props);
        this.state = {
            idVentaCancelacion: null,
            validationTxtMotivo: true,
            ventas: null,
            modal: false,
            modalCancelar: false,
            validationFecha: false,
            nameClienteCancelacion: '',
            fechaClienteCancelacion: '',
            origenClienteCancelacion: '',
            destinoClienteCancelacion: '',
            txtMotivo: '',
            fecha: '',
            camiones: [],
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
        }

        this.fetchClientes = this.fetchClientes.bind(this);
        this.fetchOrigenesYDestinos = this.fetchOrigenesYDestinos.bind(this);
        this.fetchDescuentos = this.fetchDescuentos.bind(this);
        this.fetchUsuarios = this.fetchUsuarios.bind(this);
        this.fetchVentas = this.fetchVentas.bind(this);
        /////////////////////////////////Asignaciones
        this.fetchFolio = this.fetchFolio.bind(this);
        this.fetchCliente = this.fetchCliente.bind(this);
        this.fetchDescuento = this.fetchDescuento.bind(this);
        this.fetchOrigenDestino = this.fetchOrigenDestino.bind(this);
        this.fetchViajes = this.fetchViajes.bind(this);
        //////////////////////////////////Set Options
        this.setOptClientes = this.setOptClientes.bind(this);
        this.setOptDescuentos = this.setOptDescuentos.bind(this);
        this.setOptOrigenesDestinos = this.setOptOrigenesDestinos.bind(this);
        this.setOptFechas = this.setOptFechas.bind(this);
        /////////////////////////////TaBLE
        this.onAfterSaveCell = this.onAfterSaveCell.bind(this);
        this.onBeforeSaveCell = this.onBeforeSaveCell.bind(this);
        this.asientoFormatter = this.asientoFormatter.bind(this);
        //////////////////////////////////UPDATES
        this.comprobarDia = this.comprobarDia.bind(this);
        this.cancelarVenta = this.cancelarVenta.bind(this);
        this.updateAsiento = this.updateAsiento.bind(this);
        /////////////
        this.imprimirBoleto = this.imprimirBoleto.bind(this);
        this.printBoleto = this.printBoleto.bind(this);
        this.asientosDisponibles = this.asientosDisponibles.bind(this);
        this.fechaViaje = this.fechaViaje.bind(this);
        this.toggle = this.toggle.bind(this);
        this.toggleCancelar = this.toggleCancelar.bind(this);
        this.handleTxtMotivo = this.handleTxtMotivo.bind(this);
        this.fetchDatosCancelacion = this.fetchDatosCancelacion.bind(this);
        this.validarCancelacion = this.validarCancelacion.bind(this);
    }

    componentDidMount(){
        this.fetchSucursales('MX');
        this.fetchSucursales('US');
        this.fetchPoliticasFrasePermiso();
        this.fetchImagen();
        this.fetchClientes();        
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
                politicas: data[0].politicas
              });
            }
        });
    }

    fetchClientes(){
        fetch(`/api/Clientes/all/nombreCompleto`)
          .then(res => res.json())
          .then(data => {
            if(data.length > 0){
              clientes = data;
            }
          }).then(() => {
            this.fetchOrigenesYDestinos();
            this.setOptClientes();
          });
    }

    fetchOrigenesYDestinos(){
        fetch(`/api/OrigenesYdestinos/all/nombreCompleto`)
          .then(res => res.json())
          .then(data => {
            if(data.length > 0){
              origenesDestinos = data;
            }
          }).then(() => {
            this.fetchDescuentos();
            this.setOptOrigenesDestinos();
          });
    }

    fetchDescuentos(){
        fetch(`/api/Descuentos`)
          .then(res => res.json())
          .then(data => {
            if(data.length > 0){
              descuentos = data;
            }
          }).then(() => {
            this.fetchUsuarios();
            this.setOptDescuentos();
          });
    }

    fetchUsuarios(){
        fetch(`/api/Usuarios/all/nombreCompleto`)
          .then(res => res.json())
          .then(data => {
            if(data.length > 0){
              vendedores = data;
            }
        }).then(() => {
            this.fetchVentas();
            this.fetchViajes();
        });
    }

    fetchVentas(){
        fetch('/api/Ventas/all/modificarVentas')
          .then(res => res.json())
          .then(data => {
            this.setState({
              ventas: data
            })
          })
    }

    fetchViajes(){
        let ahora = new Date();
        let comienzo = new Date(ahora.getFullYear(), 0, 0);
        let dif = ahora - comienzo;
        let unDia = 1000 * 60 * 60 * 24;
        let dia = Math.ceil(dif / unDia);
        fetch(`/api/AsignarViajes/${dia}/fechamayorque`)
          .then(res => res.json())
          .then(data => {
            if(data.length > 0){
                this.setOptFechas(data);
            }
          })

    }

    fetchFolio(id){
        for (const vendedor in vendedores) {
            if(vendedores[vendedor]._id == id){
                return vendedores[vendedor].prefijoFolio;
            }
        }
    }

    fetchCliente(id){
        for (const cliente in clientes) {
          if(clientes[cliente]._id == id){
            return `${clientes[cliente].nombre} ${clientes[cliente].apellidoPaterno} ${clientes[cliente].apellidoMaterno}`;
          }
        }
    }

    fetchDescuento(id){
        for (const descuento in descuentos){
            if(descuentos[descuento]._id == id){
                return descuentos[descuento].desc;
            }
        }
        return 'Ninguno';
    }

    fetchOrigenDestino(id){
        for (const origenDestino in origenesDestinos){
            if(origenesDestinos[origenDestino]._id == id){
                return origenesDestinos[origenDestino].nombre;
            }
        }
    }

    /////////////////////CANCELACION DE VENTA
    cancelarVenta(id){
      fetch(`/api/Ventas/${this.state.idVentaCancelacion}/cancelarVenta/`, {
        method: 'PUT',
        body: JSON.stringify(this.state.txtMotivo),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
      }).then(res => {
        this.fetchVentas();
      });
    }

    //////////////////////FUNCIONES SETOPT

    setOptFechas(arrayFechas){
        for (const i in arrayFechas) {
            fechasIDS[i] = arrayFechas[i]._id;
            fechasLabels[i] = arrayFechas[i].fecha;
        }
        //console.log(fechasLabels);
    }

    setOptClientes(){
        for (const cliente in clientes) {
            clientesIDs[cliente] = clientes[cliente]._id;
            clientesNombres[cliente] = `${clientes[cliente].nombre} ${clientes[cliente].apellidoPaterno} ${clientes[cliente].apellidoMaterno}`;
        }
    }

    setOptDescuentos(){
        for (const descuento in descuentos){
            descuentosIDS[descuento] = descuentos[descuento]._id;
            descuentosNombres[descuento] = descuentos[descuento].desc;
        }
        descuentosIDS.push('null');
        descuentosNombres.push('Ninguno');
        //console.log(descuentosNombres);
    }

    setOptOrigenesDestinos(){
        for (const origenDestino in origenesDestinos){
            origenesDestinosIDS[origenDestino] = origenesDestinos[origenDestino]._id;
            origenesDestinosNombres[origenDestino] = origenesDestinos[origenDestino].nombre;
        }
    }

    ///////////////////////////////FUNCIONES GET

    getIdDescuentos(value){
      let i = descuentosNombres.indexOf(value+'');
      return descuentosIDS[i];
    }

    getIdOrigen(value){
      let i = origenesDestinosNombres.indexOf(value+'');
      return origenesDestinosIDS[i];
    }

    comprobarDia(dia){
      let fecha = dia.split('-',3);
      fecha = `${fecha[2]}-${fecha[1]}-${fecha[0]}`;
      if(fechasLabels.includes(fecha)){
        let i = fechasLabels.indexOf(fecha);
        return fechasIDS[i];
      }else{
        return null;
      }
      
    }

    ///////////////////////////////FUNCIONES TABLE

    onAfterSaveCell(row, cellName, cellValue) {
      console.log(row);
      switch (cellName) {
        case 'razon':
          
          break;
        case 'descuento':
        
          break;
        case 'origen':
      
          break;
        case 'dia':
    
          break;
        case 'numeroAsiento':
          console.log(`/api/Ventas/${row._id}/${row.idVenta}/${cellValue}/${cellName}`);
          fetch(`/api/Ventas/${row._id}/${row.idVenta}/${cellValue}/${cellName}`, {//IdVenta es el id del viaje (Asignar viajes)
            method: 'PUT',
            //body: JSON.stringify(this.state),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
          }).then(res => res.json())
          .then(data => {
            if(data.disponible){
              alert('Se ha actualizado su asiento');
            }else{
              alert('El asiento no se encuentra disponible');
            }
            this.fetchClientes();
            console.log('data',data);
          });
          break;
      
        default:
          console.log(cellName);
          break;
      }
    }

    updateAsiento(id, value, asiento){
      fetch(`/api/AsignarViajes/${id}/${value}/${asiento}`, {
        method: 'PUT',
        //body: JSON.stringify(this.state),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
      });
    }
  
    onBeforeSaveCell(row, cellName, cellValue) {
      if(cellValue == '' || cellValue == null){
        alert('Por favor llena correctamente el campo');
        return false;
      }else{
          if(confirm("En verdad deseas modificar el campo?")){
            return true;
          }else{
            return false;
          }
      }
      
    }

    asientoFormatter(cell, row){
      if(row.numeroAsiento == 'null'){
        return 'Sin asignar';
      }else{
        return row.numeroAsiento;
      }
    }

    imprimirBoleto(e){
      let selectedRowKeys = this.refs.table.state.selectedRowKeys;
      for (let i = 0; i < selectedRowKeys.length; i++) {
        this.printBoleto(selectedRowKeys[i]);
      }
    }

    printBoleto(folio){
      console.log(`/api/Ventas/${folio}/reimpresion`);
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

    asientosDisponibles(e){
      alert('hola');
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
        return false;
      }else{
        //Ahora verificamos que ya esté abierta la fecha
        //El formato de la fecha debe ser "dd-mm-aaaa"
        let buscarFecha = `${arrayFechaDeViaje[2]}-${arrayFechaDeViaje[1]}-${arrayFechaDeViaje[0]}`; 
        fetch(`/api/AsignarViajes/${buscarFecha}/fecha`)
        .then(res => res.json())
        .then(data => {
            if(data.length > 0){
              console.log(data);
              let camiones = [];
              for (let i = 0; i < data.length; i++) {
                camiones[i] = data[i].numeroEconomico;                
              }
              this.setState({
                  validationFecha: true,
                  fecha: buscarFecha,
                  camiones: camiones,
                  asiento1: data[0].asiento_1,
                  asiento2: data[0].asiento_2,
                  asiento3: data[0].asiento_3,
                  asiento4: data[0].asiento_4,
                  asiento5: data[0].asiento_5,
                  asiento6: data[0].asiento_6,
                  asiento7: data[0].asiento_7,
                  asiento8: data[0].asiento_8,
                  asiento9: data[0].asiento_9,
                  asiento10: data[0].asiento_10,
                  asiento11: data[0].asiento_11,
                  asiento12: data[0].asiento_12,
                  asiento13: data[0].asiento_13,
                  asiento14: data[0].asiento_14,
                  asiento15: data[0].asiento_15,
                  asiento16: data[0].asiento_16,
                  asiento17: data[0].asiento_17,
                  asiento18: data[0].asiento_18,
                  asiento19: data[0].asiento_19,
                  asiento20: data[0].asiento_20,
                  asiento21: data[0].asiento_21,
                  asiento22: data[0].asiento_22,
                  asiento23: data[0].asiento_23,
                  asiento24: data[0].asiento_24,
                  asiento25: data[0].asiento_25,
                  asiento26: data[0].asiento_26,
                  asiento27: data[0].asiento_27,
                  asiento28: data[0].asiento_28,
                  asiento29: data[0].asiento_29,
                  asiento30: data[0].asiento_30,
                  asiento31: data[0].asiento_31,
                  asiento32: data[0].asiento_32,
                  asiento33: data[0].asiento_33,
                  asiento34: data[0].asiento_34,
                  asiento35: data[0].asiento_35,
                  asiento36: data[0].asiento_36,
                  asiento37: data[0].asiento_37,
                  asiento38: data[0].asiento_38,
                  asiento39: data[0].asiento_39,
                  asiento40: data[0].asiento_40,
                  asiento41: data[0].asiento_41,
                  asiento42: data[0].asiento_42,
              });
            }else{
                this.setState({
                    validationFecha: false,
                });
                dateViaje.value = '';
                alert('No hay viaje disponible para esa fecha, escoge otra fecha o contáctate con la matriz');
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

    toggle(e){
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
      }));
    }

    toggleCancelar(){
      this.setState(prevState => ({
        modalCancelar: !prevState.modalCancelar
      }));
    }

    //Validamos que hayamos seleccionado un registro
    validarCancelarVenta(){
      try {
        let selectedRowKeys = this.refs.table.state.selectedRowKeys;
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

    handleTxtMotivo(e){
      this.setState({
        validationTxtMotivo: true
      });
    }

    validarCancelacion(){
      let motivo = document.getElementById('txtMotivo').value;
      if(motivo == '' || motivo == null){
        this.setState({
          validationTxtMotivo: false,
          txtMotivo: motivo
        });
        return false
      }else{
        this.cancelarVenta();
      }
      console.log('motivo',motivo);
    }

    render() {
      const cellEditProp = {
        mode: 'dbclick',
        blurToSave: true,
        beforeSaveCell: this.onBeforeSaveCell, // a hook for before saving cell
        afterSaveCell: this.onAfterSaveCell,  // a hook for after saving cell
        
      };

      const options = {
        deleteBtn: () => {
            return(
              <DeleteButton
              btnText='Cancelar'
              btnContextual='btn-danger'
              className='my-custom-class'
              btnGlyphicon='fas fa-ban'
              onClick={ (e) => this.validarCancelarVenta(e) }/>
            );
        },
        exportCSVBtn: () => {
          return(
            <ExportCSVButton
            btnText='Reimprimir Boleto'
            btnContextual='btn-warning'
            btnGlyphicon='fas fa-print'
            onClick={ (e) => this.imprimirBoleto(e) }/>
          );
        },
        insertBtn: () => {
          return(
            <InsertButton
              btnText='Asientos Disponibles'
              btnContextual='btn-secondary'
              btnGlyphicon='fas fa-bus'
              onClick={ (e) => this.toggle(e) }/>
          );
        },
      };
        return (
            <div>
                <Container style={{ marginTop: "15px" }}>
                    <h3 className="text-center">VENTAS</h3>
                    <br/>
                    <Row>
                        <Col lg='12' md='12' sm='12' xs='12'>
                        <BootstrapTable ref='table' insertRow={ true } data={ this.state.ventas } selectRow={ {mode: 'checkbox'} } deleteRow={ true } search={ true } cellEdit={ cellEditProp } options={ options } exportCSV pagination>
                            <TableHeaderColumn dataField='_id' isKey hidden>ID</TableHeaderColumn>
                            <TableHeaderColumn width='200' dataField='folio' editable={ false }>Folio</TableHeaderColumn>
                            <TableHeaderColumn width='250' dataField='cliente' editable={ false }>Cliente</TableHeaderColumn>
                            <TableHeaderColumn width='110' dataField='razon' editable={ { type: 'select', options: { values: razones } } }>Razón</TableHeaderColumn>
                            <TableHeaderColumn width='150' dataField='descuento' editable={ { type: 'select', options: { values: descuentosNombres } } }>Descuento</TableHeaderColumn>
                            <TableHeaderColumn width='150' dataField='origen' editable={ { type: 'select', options: { values: origenesDestinosNombres } } }>Origen</TableHeaderColumn>
                            <TableHeaderColumn width='150' dataField='destino' editable={ { type: 'select', options: { values: origenesDestinosNombres } } }>Destino</TableHeaderColumn>
                            <TableHeaderColumn width='130' dataField='dia'  editable={ { type: 'date' } }>Dia</TableHeaderColumn>
                            <TableHeaderColumn width='85' dataField='numeroAsiento' dataFormat={ this.asientoFormatter } editable={{type: 'input'}} >Asiento</TableHeaderColumn>
                            {/*<TableHeaderColumn width='85' dataField='status' dataFormat={ this.statusFormatter } editable={false} >Viajado</TableHeaderColumn>*/}
                        </BootstrapTable>
                        </Col>
                    </Row>
                    <br/><br/><br/>
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
                                  <select disabled={!this.state.validationFecha} class="form-control" id="autoBus">
                                    {
                                      this.state.camiones.map((column, i) => {
                                        return(
                                          <option>{column}</option>
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
                                                <button name='1' id='1' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
                                            )
                                            :
                                            (
                                                <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                            )
                                        }
                                        <p className="smallDevice text-center">01</p>
                                    </Col>
                                    <Col xs="2" sm="1">
                                        {(this.state.asiento2  == 'false') ? 
                                            (
                                              <button name='2' id='2' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
                                            )
                                            :
                                            (
                                                <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                            )
                                        }
                                        <p className="smallDevice text-center">02</p>
                                    </Col>
                                    <Col xs="3">
                                    </Col>
                                    <Col xs="2" sm="1">
                                        {(this.state.asiento3  == 'false') ? 
                                            (
                                              <button name='3' id='3' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
                                            )
                                            :
                                            (
                                                <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                            )
                                        }
                                        <p className="smallDevice text-center">03</p>
                                    </Col>
                                    <Col xs="2" sm="1">
                                        {(this.state.asiento4  == 'false') ? 
                                            (
                                              <button name='4' id='4' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
                                            )
                                            :
                                            (
                                                <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                            )
                                        }
                                        <p className="smallDevice text-center">04</p>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col xs="2" sm="1">
                                        {(this.state.asiento5  == 'false') ? 
                                            (
                                              <button name='5' id='5' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
                                            )
                                            :
                                            (
                                                <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                            )
                                        }
                                        <p className="smallDevice text-center">05</p>
                                    </Col>
                                    <Col xs="2" sm="1">
                                        {(this.state.asiento6  == 'false') ? 
                                            (
                                              <button name='6' id='6' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
                                            )
                                            :
                                            (
                                                <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                            )
                                        }
                                        <p className="smallDevice text-center">06</p>
                                    </Col>
                                    <Col xs="3">
                                    </Col>
                                    <Col xs="2" sm="1">
                                        {(this.state.asiento7  == 'false') ? 
                                            (
                                              <button name='7' id='7' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
                                            )
                                            :
                                            (
                                                <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                            )
                                        }
                                        <p className="smallDevice text-center">07</p>
                                    </Col>
                                    <Col xs="2" sm="1">
                                        {(this.state.asiento8  == 'false') ? 
                                            (
                                              <button name='8' id='8' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
                                            )
                                            :
                                            (
                                                <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                            )
                                        }
                                        <p className="smallDevice text-center">08</p>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col xs="2" sm="1">
                                        {(this.state.asiento9  == 'false') ? 
                                            (
                                              <button name='9' id='9' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
                                            )
                                            :
                                            (
                                                <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                            )
                                        }
                                        <p className="smallDevice text-center">09</p>
                                    </Col>
                                    <Col xs="2" sm="1">
                                        {(this.state.asiento10  == 'false') ? 
                                            (
                                              <button name='10' id='10' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
                                            )
                                            :
                                            (
                                                <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                            )
                                        }
                                        <p className="smallDevice text-center">10</p>
                                    </Col>
                                    <Col xs="3">
                                    </Col>
                                    <Col xs="2" sm="1">
                                        {(this.state.asiento11 == 'false') ? 
                                            (
                                              <button name='11' id='11' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
                                            )
                                            :
                                            (
                                                <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                            )
                                        }
                                        <p className="smallDevice text-center">11</p>
                                    </Col>
                                    <Col xs="2" sm="1">
                                        {(this.state.asiento12 == 'false') ? 
                                            (
                                              <button name='12' id='12' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
                                            )
                                            :
                                            (
                                                <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                            )
                                        }
                                        <p className="smallDevice text-center">12</p>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col xs="2" sm="1">
                                        {(this.state.asiento13 == 'false') ? 
                                            (
                                              <button name='13' id='13' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
                                            )
                                            :
                                            (
                                                <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                            )
                                        }
                                        <p className="smallDevice text-center">13</p>
                                    </Col>
                                    <Col xs="2" sm="1">
                                        {(this.state.asiento14 == 'false') ? 
                                            (
                                              <button name='14' id='14' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
                                            )
                                            :
                                            (
                                                <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                            )
                                        }
                                        <p className="smallDevice text-center">14</p>
                                    </Col>
                                    <Col xs="3">
                                    </Col>
                                    <Col xs="2" sm="1">
                                        {(this.state.asiento15 == 'false') ? 
                                            (
                                              <button name='15' id='15' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
                                            )
                                            :
                                            (
                                                <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                            )
                                        }
                                        <p className="smallDevice text-center">15</p>
                                    </Col>
                                    <Col xs="2" sm="1">
                                        {(this.state.asiento16 == 'false') ? 
                                            (
                                              <button name='16' id='16' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
                                            )
                                            :
                                            (
                                                <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                            )
                                        }
                                        <p className="smallDevice text-center">16</p>
                                    </Col>
                                    </Row>
                                    <Row>
                                    <Col xs="2" sm="1">
                                        {(this.state.asiento17 == 'false') ? 
                                            (
                                              <button name='17' id='17' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
                                            )
                                            :
                                            (
                                                <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                            )
                                        }
                                        <p className="smallDevice text-center">17</p>
                                    </Col>
                                    <Col xs="2" sm="1">
                                        {(this.state.asiento18 == 'false') ? 
                                            (
                                              <button name='18' id='18' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
                                            )
                                            :
                                            (
                                                <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                            )
                                        }
                                        <p className="smallDevice text-center">18</p>
                                    </Col>
                                    <Col xs="3">
                                    </Col>
                                    <Col xs="2" sm="1">
                                        {(this.state.asiento19 == 'false') ? 
                                            (
                                              <button name='19' id='19' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
                                            )
                                            :
                                            (
                                                <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                            )
                                        }
                                        <p className="smallDevice text-center">19</p>
                                    </Col>
                                    <Col xs="2" sm="1">
                                        {(this.state.asiento20 == 'false') ? 
                                            (
                                              <button name='20' id='20' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
                                            )
                                            :
                                            (
                                                <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                            )
                                        }
                                        <p className="smallDevice text-center">20</p>
                                    </Col>
                                    </Row>
                                    <Row>
                                    <Col xs="2" sm="1">
                                        {(this.state.asiento21 == 'false') ? 
                                            (
                                              <button name='21' id='21' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
                                            )
                                            :
                                            (
                                                <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                            )
                                        }
                                        <p className="smallDevice text-center">21</p>
                                    </Col>
                                    <Col xs="2" sm="1">
                                        {(this.state.asiento22 == 'false') ? 
                                            (
                                              <button name='22' id='22' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
                                            )
                                            :
                                            (
                                                <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                            )
                                        }
                                        <p className="smallDevice text-center">22</p>
                                    </Col>
                                    <Col xs="3">
                                    </Col>
                                    <Col xs="2" sm="1">
                                        {(this.state.asiento23 == 'false') ? 
                                            (
                                              <button name='23' id='23' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
                                            )
                                            :
                                            (
                                                <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                            )
                                        }
                                        <p className="smallDevice text-center">23</p>
                                    </Col>
                                    <Col xs="2" sm="1">
                                        {(this.state.asiento24 == 'false') ? 
                                            (
                                              <button name='24' id='24' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
                                            )
                                            :
                                            (
                                                <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                            )
                                        }
                                        <p className="smallDevice text-center">24</p>
                                    </Col>
                                    </Row>
                                    <Row>
                                    <Col xs="2" sm="1">
                                        {(this.state.asiento25 == 'false') ? 
                                            (
                                              <button name='25' id='25' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
                                            )
                                            :
                                            (
                                                <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                            )
                                        }
                                        <p className="smallDevice text-center">25</p>
                                    </Col>
                                    <Col xs="2" sm="1">
                                        {(this.state.asiento26 == 'false') ? 
                                            (
                                              <button name='26' id='26' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
                                            )
                                            :
                                            (
                                                <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                            )
                                        }
                                        <p className="smallDevice text-center">26</p>
                                    </Col>
                                    <Col xs="3">
                                    </Col>
                                    <Col xs="2" sm="1">
                                        {(this.state.asiento27 == 'false') ? 
                                            (
                                              <button name='27' id='27' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
                                            )
                                            :
                                            (
                                                <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                            )
                                        }
                                        <p className="smallDevice text-center">27</p>
                                    </Col>
                                    <Col xs="2" sm="1">
                                        {(this.state.asiento28 == 'false') ? 
                                            (
                                              <button name='28' id='28' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
                                            )
                                            :
                                            (
                                                <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                            )
                                        }
                                        <p className="smallDevice text-center">28</p>
                                    </Col>
                                    </Row>
                                    <Row>
                                    <Col xs="2" sm="1">
                                        {(this.state.asiento29 == 'false') ? 
                                            (
                                              <button name='29' id='29' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
                                            )
                                            :
                                            (
                                                <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                            )
                                        }
                                        <p className="smallDevice text-center">29</p>
                                    </Col>
                                    <Col xs="2" sm="1">
                                        {(this.state.asiento30 == 'false') ? 
                                            (
                                              <button name='30' id='30' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
                                            )
                                            :
                                            (
                                                <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                            )
                                        }
                                        <p className="smallDevice text-center">30</p>
                                    </Col>
                                    <Col xs="3">
                                    </Col>
                                    <Col xs="2" sm="1">
                                        {(this.state.asiento31 == 'false') ? 
                                            (
                                              <button name='31' id='31' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
                                            )
                                            :
                                            (
                                                <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                            )
                                        }
                                        <p className="smallDevice text-center">31</p>
                                    </Col>
                                    <Col xs="2" sm="1">
                                        {(this.state.asiento32 == 'false') ? 
                                            (
                                              <button name='32' id='32' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
                                            )
                                            :
                                            (
                                                <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                            )
                                        }
                                        <p className="smallDevice text-center">32</p>
                                    </Col>
                                    </Row>
                                    <Row>
                                    <Col xs="2" sm="1">
                                        {(this.state.asiento33 == 'false') ? 
                                            (
                                              <button name='33' id='33' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
                                            )
                                            :
                                            (
                                                <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                            )
                                        }
                                        <p className="smallDevice text-center">33</p>
                                    </Col>
                                    <Col xs="2" sm="1">
                                        {(this.state.asiento34 == 'false') ? 
                                            (
                                              <button name='34' id='34' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
                                            )
                                            :
                                            (
                                                <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                            )
                                        }
                                        <p className="smallDevice text-center">34</p>
                                    </Col>
                                    <Col xs="3">
                                    </Col>
                                    <Col xs="2" sm="1">
                                        {(this.state.asiento35 == 'false') ? 
                                            (
                                              <button name='35' id='35' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
                                            )
                                            :
                                            (
                                                <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                            )
                                        }
                                        <p className="smallDevice text-center">35</p>
                                    </Col>
                                    <Col xs="2" sm="1">
                                        {(this.state.asiento36 == 'false') ? 
                                            (
                                              <button name='36' id='36' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
                                            )
                                            :
                                            (
                                                <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                            )
                                        }
                                        <p className="smallDevice text-center">36</p>
                                    </Col>
                                    </Row>
                                    <Row>
                                    <Col xs="2" sm="1">
                                        {(this.state.asiento37 == 'false') ? 
                                            (
                                              <button name='37' id='37' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
                                            )
                                            :
                                            (
                                                <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                            )
                                        }
                                        <p className="smallDevice text-center">37</p>
                                    </Col>
                                    <Col xs="2" sm="1">
                                        {(this.state.asiento38 == 'false') ? 
                                            (
                                              <button name='38' id='38' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
                                            )
                                            :
                                            (
                                                <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                            )
                                        }
                                        <p className="smallDevice text-center">38</p>
                                    </Col>
                                    {
                                        (this.state.noAsientos > 38) ?
                                        (
                                            <Col xs="3">
                                            </Col>
                                        )
                                        :
                                        ''
                                    }
                                    {
                                        (this.state.noAsientos > 38) ?
                                        (
                                            <Col xs="2" sm="1">
                                                {(this.state.asiento39 == 'false') ? 
                                                    (
                                                      <button name='39' id='39' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
                                                    )
                                                    :
                                                    (
                                                        <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                                    )
                                                }
                                                <p className="smallDevice text-center">39</p>
                                            </Col>
                                        )
                                        :
                                        ''
                                    }
                                    {
                                        (this.state.noAsientos > 38) ?
                                        (
                                            <Col xs="2" sm="1">
                                                {(this.state.asiento40 == 'false') ? 
                                                    (
                                                      <button name='40' id='40' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
                                                    )
                                                    :
                                                    (
                                                        <button type="button" class="btn btn-outline-secondary" disabled><i className="fa fa-user" /></button>
                                                    )
                                                }
                                                <p className="smallDevice text-center">40</p>
                                            </Col>
                                        )
                                        :
                                        ''
                                    }
                                    {
                                        (this.state.noAsientos > 38) ?
                                        (
                                            <Row>
                                            <Col xs="2" sm="1">
                                                {(this.state.asiento41 == 'false') ? 
                                                    (
                                                      <button name='41' id='41' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
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
                                                      <button name='42' id='42' type="button" className={"btn btn-danger btn-lg asientoDisponible"}></button>
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

                    
                </Container>
            </div>
        )
    }
}
