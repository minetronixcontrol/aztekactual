import React, { Component } from 'react';
import {Button, Card, CardTitle, Col, Container, CustomInput, Label, Form, Row} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

import Select from 'react-select';

import GenerarListaDeCorte from "./listaDeCortePDF"
import { USER_TYPES } from '../constants';

import "bootstrap/dist/css/bootstrap.css";

var user = null;

var idUser = null;

var stateTypes = [
  'pagado',
  'no pagado'
];

export default class BoletosPagados extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarios: [],
      opc: 'NoPagados',
      tipo: 'boletos',
      idUsuario: '',
      idUsuarioA: null,
      nombreUsuario: '',
      sucursal: '',
      municipio: '',
      tipoUsuario: '',
      ventas: [],
      totales: {},
      userType: ''
    }

    user = this.props.match.params.id_Usuario;

    this.fetchUser = this.fetchUser.bind(this);
    this.fetchUsuarios = this.fetchUsuarios.bind(this);
    this.fetchBoletos = this.fetchBoletos.bind(this);
    this.handleChangeVendedor = this.handleChangeVendedor.bind(this);
    this.fetchReservaciones = this.fetchReservaciones.bind(this);
    this.handleOnChangeOpc = this.handleOnChangeOpc.bind(this);   
    this.handleOnChangeTipo = this.handleOnChangeTipo.bind(this);
    this.imprimir = this.imprimir.bind(this);
    this.onBeforeSaveCell = this.onBeforeSaveCell.bind(this);
    this.onAfterSaveCell = this.onAfterSaveCell.bind(this);
  }

  componentDidMount(){
    this.fetchUser();
  }

  imprimir(){
    let hoy = new Date();
    let data = {
      nombreVendedor: this.state.nombreUsuario,
      sucursal: this.state.sucursal,
      municipio: this.state.municipio,
      fecha: `${hoy.getDate()}-${hoy.getMonth()+1}-${hoy.getFullYear()}`
    }
    console.log('imprimir seleccion');
    let selectedRowKeys = this.refs.table.state.selectedRowKeys;
    console.log(selectedRowKeys);
    let auxArray = this.state.ventas;
    let dataventas = [];
    for (let i = 0; i < auxArray.length; i++) {
      for (let j = 0; j < selectedRowKeys.length; j++) {
        if(auxArray[i]._id == selectedRowKeys[j]){
          dataventas.push(auxArray[i]);
        }
      }
    }

    GenerarListaDeCorte(data, dataventas, this.state.totales);
  }

  fetchUser(){
    fetch(`/api/Usuarios/${user}`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          idUsuarioA: data[0]._id,
          idUsuario: data[0]._id,
          userType: data[0].seguridad
        });
        idUser = data[0]._id
      })
      .then(()=>{
        if(this.state.userType == USER_TYPES.ADMIN || this.state.userType == USER_TYPES.VIAJES){
          this.fetchUsuarios();
        }else{
          this.fetchBoletos(idUser, this.state.opc);
        }
      });
  }

  fetchUsuarios(){
    let usuarios = [];
    fetch(`/api/Usuarios/all/activo`)
      .then(res => res.json())
      .then(data => {
        for (let i = 0; i < data.length; i++) {
          usuarios[i] = {
            value: data[i]._id,
            label: `${data[i].nombre} ${data[i].apellidoPaterno} ${data[i].apellidoMaterno}`,
            sucursal: data[i].sucursal,
            municipio: data[i].municipio,
            tipoUsuario: data[i].tipoUsuario
          }
        }
      })
      .then(() => {
        this.setState({
          usuarios: usuarios
        });
      });
  }

  handleOnChangeOpc(e){
    let idUsuario = this.state.idUsuario;
    this.setState({
      opc: e.target.value
    });
    if(this.state.tipoUsuario == 'Ventas' && this.state.tipo == 'reservaciones'){
      alert('Éste usuario no puede hacer reservaciones');
    }else{
      if(this.state.tipo == 'reservaciones'){
        this.fetchReservaciones(idUsuario, e.target.value);
      }else{
        this.fetchBoletos(idUsuario, e.target.value);
      }
    }
    
  }

  handleChangeVendedor(e){
    this.setState({
      idUsuario: e.value,
      nombreUsuario: e.label,
      sucursal: e.sucursal,
      municipio: e.municipio,
      tipoUsuario: e.tipoUsuario
    });
    let opc = this.state.opc;
    if(e.tipoUsuario == 'Ventas' && this.state.tipo == 'reservaciones'){
      alert('Éste usuario no puede hacer reservaciones');
    }else{
      if(this.state.tipo == 'reservaciones'){
        this.fetchReservaciones(e.value, opc);
      }else{
        this.fetchBoletos(e.value, opc);
      }
    }
  }

  fetchBoletos(idUsuario, opc){
    console.log('idUsuario',idUsuario);
    console.log('opc',opc);
    let corte = [];
    if(idUsuario != ''){
      fetch(`/api/Ventas/${idUsuario}/${opc}/Boletos`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          ventas: data.respuesta,
          totales: data.totales
        });
      });
    }
  }

  fetchReservaciones(idUsuario, opc){
    console.log('idUsuario',idUsuario);
    console.log('opc',opc);
    let corte = [];
    if(idUsuario != ''){
      console.log(`/api/Reservaciones/${idUsuario}/${opc}/Reservaciones`);
      fetch(`/api/Reservaciones/${idUsuario}/${opc}/Reservaciones`)
      .then(res => res.json())
      .then(data => {
        console.log('data',data);
        this.setState({
          ventas: data.respuesta,
          totales: data.totales
        });
      });
    }
  }

  handleOnChangeTipo(e){
    let idUsuario = this.state.idUsuario;
    let opc = this.state.opc;
    this.setState({
      tipo: e.target.value
    });
    if(this.state.tipoUsuario == 'Ventas' && e.target.value == 'reservaciones'){
      alert('Éste usuario no puede hacer reservaciones');
    }else{
      if(e.target.value == 'reservaciones'){
        this.fetchReservaciones(idUsuario, opc);
      }else{
        this.fetchBoletos(idUsuario, opc);
      }
    }
  }

  onBeforeSaveCell(row, cellName, cellValue){
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

  onAfterSaveCell(row, cellName, cellValue){
    console.log('row', row);
    console.log('cellName', cellName);
    console.log('cellValue', cellValue);

    let estado = '';

    if(cellValue == 'pagado'){
      estado = 'true'
    }else{
      estado = 'false'
    }

    if(row.type == 'Reservaciones'){
      console.log(`/api/Reservaciones/${row._id}/${estado}/${this.state.idUsuarioA}/${cellName}/${row.pago}`);
      fetch(`/api/Reservaciones/${row._id}/${estado}/${this.state.idUsuarioA}/${cellName}/${row.pago}`, {
          method: 'PUT',
          //body: JSON.stringify(this.state),
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          }
      })
      .then(res => {
        this.fetchReservaciones(this.state.idUsuario, this.state.opc);
      })
      .catch(err => {
        console.log(err);
      })
    }else{
      console.log(`/api/Ventas/${row._id}/${estado}/${cellName}/${this.state.idUsuarioA}/hola`);
      fetch(`/api/Ventas/${row._id}/${estado}/${cellName}/${this.state.idUsuarioA}/hola`, {
          method: 'PUT',
          //body: JSON.stringify(this.state),
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          }
      })
      .then(res => {
        this.fetchBoletos(this.state.idUsuario, this.state.opc);
      })
    }
  }

  render() {
    const selectRow = {
      mode: 'checkbox',
    };
    const cellEditProp = {
      mode: 'dbclick',
      blurToSave: true,
      beforeSaveCell: this.onBeforeSaveCell, // a hook for before saving cell
      afterSaveCell: this.onAfterSaveCell  // a hook for after saving cell
    };
    
    return(
      <div>
        <Container style={{ marginTop: "15px" }}>
          <Row>
            <Card body outline color="secondary">
              <CardTitle className="text-center"><h3>CORTE</h3></CardTitle>
              <br/>
              <Row>
                {/** Herramientas **/}
                {
                  (this.state.userType == USER_TYPES.ADMIN || this.state.userType == USER_TYPES.VIAJES)? 
                  <Col lg='3' md='3' sm='12' xs='12'>
                      <Label for="selectVendedor"><i className="fas fa-user-circle"></i> Vendedor:</Label>
                      <Select
                          id="selectVendedor"
                          onChange={this.handleChangeVendedor}
                          options={this.state.usuarios}
                          placeholder = "Selecciona..."
                      />
                  </Col>
                  :
                  <Col lg='3' md='3' sm='12' xs='12'>
                  </Col>
                }
                <Col lg='3' md='3' sm='12' xs='12' className="text-left">
                  <Label><i className="fas fa-ticket-alt"></i> Tipo:</Label>
                    {
                      (this.state.userType == USER_TYPES.ADMIN || this.state.userType == USER_TYPES.VIAJES || this.state.userType == USER_TYPES.MATRIZ || this.state.userType == USER_TYPES.RESERVACIONES)?
                      <div>
                        <CustomInput type="radio" id="radioBoleto" onChange={this.handleOnChangeTipo} value="boletos" name="radioTipoDoc" label="Boletos" defaultChecked/>
                        <CustomInput type="radio" id="radioReservacion" onChange={this.handleOnChangeTipo} value="reservaciones" name="radioTipoDoc" label="Reservaciones" />
                      </div>
                      :
                      <div>
                        <CustomInput type="radio" id="radioBoleto" onChange={this.handleOnChangeTipo} value="boletos" name="radioTipoDoc" label="Boletos" defaultChecked/>
                        </div>
                    }
                </Col>
                <Col lg='3' md='3' sm='12' xs='12' className="text-left">
                  <Label><i className="fas fa-clipboard"></i> Opciones:</Label>
                  <div>
                    <CustomInput type="radio" id="exampleCustomRadio2" onChange={this.handleOnChangeOpc} value="NoPagados" name="radioTipo" label="No pagados" defaultChecked/>
                    <CustomInput type="radio" id="exampleCustomRadio" onChange={this.handleOnChangeOpc} value="Pagados" name="radioTipo" label="Pagados" />
                    <CustomInput type="radio" id="exampleCustomRadio3" onChange={this.handleOnChangeOpc} value="Todo" name="radioTipo" label="Todo" />
                  </div>
                </Col>
                <Col lg='3' md='3' sm='12' xs='12' className="text-left">
                  <br/>
                  <Button outline color="info" onClick={this.imprimir} ><i className="fas fa-print"></i></Button>
                </Col>
              </Row>
            </Card>
          </Row>
          <Row>
            <Col lg='12' md='12' sm='12' xs='12' style={{ marginTop: "10px" }}>
            {
                    (this.state.userType == 'Admin')?
                    <BootstrapTable ref='table' data={ this.state.ventas } search={ true } cellEdit={ cellEditProp } selectRow={ selectRow } pagination>
                        <TableHeaderColumn width='200' dataField='_id' hidden isKey>Folio</TableHeaderColumn>
                        <TableHeaderColumn width='200' dataField='type' hidden>tipo</TableHeaderColumn>
                        <TableHeaderColumn width='200' dataField='pago' hidden>pago</TableHeaderColumn>
                        <TableHeaderColumn width='200' dataField='folio' editable={ false } tdStyle={ { whiteSpace: 'normal' } }>Folio</TableHeaderColumn>
                        <TableHeaderColumn width='300' dataField='cliente' editable={ false } tdStyle={ { whiteSpace: 'normal' } }>Pasajero</TableHeaderColumn>
                        <TableHeaderColumn width='300' dataField='origen' editable={ false } tdStyle={ { whiteSpace: 'normal' } }>Origen</TableHeaderColumn>
                        <TableHeaderColumn width='300' dataField='destino' editable={ false } tdStyle={ { whiteSpace: 'normal' } }>Destino</TableHeaderColumn>
                        <TableHeaderColumn width='150' dataField='fecha' editable={ false } tdStyle={ { whiteSpace: 'normal' } }>Fecha de Viaje</TableHeaderColumn>
                        <TableHeaderColumn width='150' dataField='montoMXN' editable={ false } tdStyle={ { whiteSpace: 'normal' } }>Monto MXN</TableHeaderColumn>
                        <TableHeaderColumn width='150' dataField='montoUS' editable={ false } tdStyle={ { whiteSpace: 'normal' } }>Monto US</TableHeaderColumn>
                        <TableHeaderColumn width='200' dataField='estado' editable={ { type: 'select', options: { values: stateTypes } } }>Estado</TableHeaderColumn>
                        <TableHeaderColumn width='200' dataField='usuario'>Modificación</TableHeaderColumn>
                    </BootstrapTable>
                    :
                    <BootstrapTable ref='table' data={ this.state.ventas } search={ true } cellEdit={ cellEditProp } selectRow={ selectRow } pagination>
                        <TableHeaderColumn width='200' dataField='_id' hidden isKey>Folio</TableHeaderColumn>
                        <TableHeaderColumn width='200' dataField='type' hidden>tipo</TableHeaderColumn>
                        <TableHeaderColumn width='200' dataField='pago' hidden>pago</TableHeaderColumn>
                        <TableHeaderColumn width='200' dataField='folio' editable={ false } tdStyle={ { whiteSpace: 'normal' } }>Folio</TableHeaderColumn>
                        <TableHeaderColumn width='300' dataField='cliente' editable={ false } tdStyle={ { whiteSpace: 'normal' } }>Pasajero</TableHeaderColumn>
                        <TableHeaderColumn width='300' dataField='origen' editable={ false } tdStyle={ { whiteSpace: 'normal' } }>Origen</TableHeaderColumn>
                        <TableHeaderColumn width='300' dataField='destino' editable={ false } tdStyle={ { whiteSpace: 'normal' } }>Destino</TableHeaderColumn>
                        <TableHeaderColumn width='150' dataField='fecha' editable={ false } tdStyle={ { whiteSpace: 'normal' } }>Fecha de Viaje</TableHeaderColumn>
                        <TableHeaderColumn width='150' dataField='montoMXN' editable={ false } tdStyle={ { whiteSpace: 'normal' } }>Monto MXN</TableHeaderColumn>
                        <TableHeaderColumn width='150' dataField='montoUS' editable={ false } tdStyle={ { whiteSpace: 'normal' } }>Monto US</TableHeaderColumn>
                        <TableHeaderColumn width='200' dataField='estado' editable={ false }>Estado</TableHeaderColumn>
                    </BootstrapTable>
                }
            </Col>
          </Row>
        </Container>
        <br/><br/><br/>
      </div>
    );
  }
}