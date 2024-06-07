import React, { Component } from 'react';
import {Button, Col, Container, Form, Label, Modal, ModalHeader, ModalBody, ModalFooter, Row, Input, Table} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import Select from 'react-select';
import MyCustomBody from './modalsBodys/modalGeneral';

import GenerarViajes from "./ViajesPDF";

var newViaje = {}

var idUser = '';

var user = '';

var viajes = [];

var capacidades = [
  {value: '38', label: '38'},
  {value: '39', label: '39'},
  {value: '40', label: '40'},
  {value: '41', label: '41'},
  {value: '42', label: '42'},
  {value: '43', label: '43'},
  {value: '44', label: '44'},
  {value: '45', label: '45'},
  {value: '46', label: '46'},
  {value: '47', label: '47'},
  {value: '48', label: '48'}
]

export default class Viajes extends Component {
  constructor(props){
    super(props);
    this.state = {
      columns: [],
      modal: false,
      idUsuario: '',
      userType: '',
      idViaje: '',
      viajes: [],
      optTripulantes: [],
      optCamiones: [],
      optAuxiliares: [],
      optRutas: [],
      fecha: '',
      capacidad: '',
      ruta: {},
      rutaTxt: '',
      noEco: {},
      chofer_1: {},
      chofer_2: {},
      sobrecargo: {},
      auxiliar: {},
      viaje: ''
    }

    user = this.props.match.params.id_Usuario;

    this.fetchUser = this.fetchUser.bind(this);
    this.fetchOptions = this.fetchOptions.bind(this);
    this.fetchConfViajes = this.fetchConfViajes.bind(this);
    this.modificarViaje = this.modificarViaje.bind(this);
    this.modificar = this.modificar.bind(this);
    this.saveNewViaje = this.saveNewViaje.bind(this);
    this.deleteViaje = this.deleteViaje.bind(this);
    this.getFecha = this.getFecha.bind(this);
    this.getAnio = this.getAnio.bind(this);
    this.getDiaDelAnio = this.getDiaDelAnio.bind(this);

    this.onAfterInsertRow = this.onAfterInsertRow.bind(this);
    this.onAfterDeleteRow = this.onAfterDeleteRow.bind(this);
    this.rowClassNameFormat = this.rowClassNameFormat.bind(this);
    this.createCustomModalBody = this.createCustomModalBody.bind(this);

    this.handleChangeRuta = this.handleChangeRuta.bind(this);
    this.handleChangeCamion = this.handleChangeCamion.bind(this);
    this.handleChofer1 = this.handleChofer1.bind(this);
    this.handleChofer2 = this.handleChofer2.bind(this);
    this.handleChangeSobrecargo = this.handleChangeSobrecargo.bind(this);
    this.handleChangeAux = this.handleChangeAux.bind(this);
    this.handleChangeCapacidades = this.handleChangeCapacidades.bind(this);
    this.toggle = this.toggle.bind(this);
    this.imprimirSeleccion = this.imprimirSeleccion.bind(this);
  }

  componentDidMount(){
    this.fetchUser();
    this.fetchOptions();
    this.fetchConfViajes();
  }

  fetchUser(){
    fetch(`/api/Usuarios/${user}`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          idUsuario: data[0]._id,
          userType: data[0].seguridad
        });
        idUser = data[0]._id;
        console.log('idUser', idUser);
      });
  }

  toggle(e){
    let selectedRows = this.refs.table.state.selectedRowKeys;
    this.setState({
      idViaje: selectedRows[0]
    })
    if(selectedRows.length > 0){
      for (let i = 0; i < viajes.length; i++) {
        if(viajes[i]._id == selectedRows[0]){
          this.setState(prevState => ({
            fecha: viajes[i].fecha,
            ruta: { value: viajes[i].idRuta, label: viajes[i].ruta },
            rutaTxt: viajes[i].rutaTxt,            
            noEco: { value: viajes[i].numeroEconomico, label: viajes[i].numeroEconomico },
            capacidad: { value: viajes[i].capacidad, label: viajes[i].capacidad },
            chofer_1: { value: viajes[i].idChofer1, label: viajes[i].chofer_1 },
            chofer_2: { value: viajes[i].idChofer2, label: viajes[i].chofer_2 },
            sobrecargo: { value: viajes[i].idSobrecargo, label: viajes[i].sobrecargo },
            auxiliar: { value: viajes[i].idAuxiliar, label: viajes[i].auxiliar },
            modal: !prevState.modal
          }));
        }
      }
    }
  }

  fetchOptions(){
    fetch(`/api/AsignarViajes/c/options`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          optTripulantes: data.respuestaTripulantes,
          optCamiones: data.respuestaCamiones,
          optAuxiliares: data.respuestaAuxiliares,
          optRutas: data.respuestaRutas,
          columns: [
            {
              type: 'input',
              options: null,
              field: '_id',
              name: 'id',
              hiddenOnInsert: true
            },
            {
              type: 'date',
              options: null,
              field: 'fecha',
              name: 'Fecha',
              hiddenOnInsert: false
            },
            {
              type: 'select-ruta',
              options: data.respuestaRutas,
              field: 'ruta',
              name: 'Ruta',
              hiddenOnInsert: false
            },
            {
              type: 'select-eco',
              options: data.respuestaCamiones,
              field: 'numeroEconomico',
              name: 'No. Económico',
              hiddenOnInsert: false
            },
            {
              type: 'select',
              options: [38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48],
              field: 'capacidad',
              name: 'Capacidad',
              hiddenOnInsert: false
            },
            {
              type: 'select-chofer_1',
              options: data.respuestaTripulantes,
              field: 'chofer_1',
              name: 'Chofer 1',
              hiddenOnInsert: false
            },
            {
              type: 'select-chofer_2',
              options: data.respuestaTripulantes,
              field: 'chofer_2',
              name: 'Chofer 2',
              hiddenOnInsert: false
            },
            {
              type: 'select-sobrecargo',
              options: data.respuestaTripulantes,
              field: 'sobrecargo',
              name: 'Sobrecargo',
              hiddenOnInsert: false
            },
            {
              type: 'select-aux',
              options: data.respuestaAuxiliares,
              field: 'auxiliar',
              name: 'Auxiliar',
              hiddenOnInsert: false
            },
          ]
        });
      });
  }

  fetchConfViajes(){
    fetch(`/api/AsignarViajes/c/configViajes`)
      .then(res => res.json())
      .then(data => {
        viajes = data;
        this.setState({
          viajes: data,
        });
      })
      .then(()=>{
        console.log(this.state.columns);
      })
  }


  handleChangeRuta(e){
    this.setState({
      ruta: { value: e.value, label: e.label },
      rutaTxt: e.transbordos
    });
  }

  handleChangeCamion(e){
    this.setState({
      noEco: { value: e.label, label: e.label },
    });
  }

  handleChofer1(e){
    this.setState({
      chofer_1: { value: e.value, label: e.label },
    });
  }

  handleChofer2(e){
    this.setState({
      chofer_2: { value: e.value, label: e.label },
    });
  }

  handleChangeSobrecargo(e){
    this.setState({
      sobrecargo: { value: e.value, label: e.label },
    });
  }

  handleChangeAux(e){
    this.setState({
      auxiliar: { value: e.value, label: e.label },
    });
  }

  handleChangeCapacidades(e){
    this.setState({
      capacidad: { value: e.value, label: e.label },
    });
  }

  modificarViaje(){
    console.log(this.state);
    let prevViaje = {};
    //Primero consultamos a la bd para sabr si ha habido un cambio 
    fetch(`/api/AsignarViajes/${this.state.idViaje}`)
      .then(res => res.json())
      .then(data => {
        prevViaje = data;
        console.log('data',data);

        if(data.ruta != this.state.ruta.value){
          console.log('ruta modificada');
          this.modificar(this.state.idViaje, this.state.ruta.value,'ruta');
        }

        if(data.capacidad != this.state.capacidad.value){
          console.log('capacidad modificada');
          this.modificar(this.state.idViaje, this.state.capacidad.value,'capacidad');
        }

        if(data.numeroEconomico != this.state.noEco.value){
          console.log('noEco modificado');
          this.modificar(this.state.idViaje, this.state.noEco.value,'numeroEconomico');
        }

        if(data.chofer_1 != this.state.chofer_1.value){
          this.modificar(this.state.idViaje, this.state.chofer_1.value,'chofer_1');
        }

        if(data.chofer_2 != this.state.chofer_2.value){
          console.log('chofer_2 modificado');
          this.modificar(this.state.idViaje, this.state.chofer_2.value,'chofer_2');
        }

        if(data.sobrecargo != this.state.sobrecargo.value){
          console.log('sobrecargo modificado');
          this.modificar(this.state.idViaje, this.state.sobrecargo.value,'sobrecargo');
        }

        if(data.auxiliar != this.state.auxiliar.value){
          console.log('auxiliar modificado');
          this.modificar(this.state.idViaje, this.state.auxiliar.value,'auxiliar');
        }
      })
    ///////////////////////////////////////////////////////////////
    
  }

  modificar(id, value, field){
    console.log(`modificar | id - ${id} | value - ${value} | field - ${field}`);
    fetch(`/api/AsignarViajes/${id}/${value}/${field}/`, {
      method: 'PUT',
      //body: JSON.stringify(body),
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => {
      if(data.respuesta){
        alert('Se ha modificado el campo');
      }else{
        //alert('Ya hay boletos vendidos para este viaje, no es posible modificar este campo');
      }
      this.fetchConfViajes();
      this.setState(prevState => ({
        modal: !prevState.modal
      }));
    })
  }

  saveNewViaje(obj){
    fetch('/api/AsignarViajes', {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }
    })
    .then(res => {
      this.fetchConfViajes();
    })
    .catch(error => {
      this.fetchConfViajes();
    })
  }

  deleteViaje(id){  
    console.log(`/api/AsignarViajes/${id}/${false}/BorrarViaje`);
    fetch(`/api/AsignarViajes/${id}/${false}/BorrarViaje`, {
      method: 'PUT',
      //body: JSON.stringify(this.state),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        if(data.respuesta){
          this.fetchConfViajes();
        }else{
          alert('Ya hay boletos vendidos para este viaje, no es posible eliminarlo');
        }
      })
  }

  getFecha(fecha){
    let arr = fecha.split('-', 3);
    fecha = `${arr[2]}-${arr[1]}-${arr[0]}`
    //console.log('fecha',fecha);
    return fecha;
  }

  getAnio(fecha){
    let arr = fecha.split('-', 3);
    let anio = arr[2];
    //console.log('anio',anio);
    return anio;
  }

  getDiaDelAnio(fecha){
    let arr = fecha.split('-', 3);
    let fechaini = new Date(`${arr[2]}-01-01`);
    console.log(fechaini);
    let fechafin = new Date(`${arr[2]}-${arr[1]}-${arr[0]}`);
    console.log(fechafin);
    let diasdif= fechafin.getTime()-fechaini.getTime();
    let contdias = Math.round(diasdif/(1000*60*60*24));
    console.log('contdias',contdias);
    return (contdias+1);
  }

  onAfterInsertRow(row) {
    newViaje = {};
    for (const prop in row) {
      if(prop == "fecha"){
        newViaje.fecha = this.getFecha(row[prop]);
      }
      if(prop == "ruta"){
        newViaje.ruta = row[prop];
      }
      if(prop == "capacidad"){
        newViaje.capacidad = row[prop];
      }
      if(prop == "chofer_1"){
        newViaje.chofer_1 = row[prop];
      }
      if(prop == "chofer_2"){
        newViaje.chofer_2 = row[prop];
      }
      if(prop == "sobrecargo"){
        newViaje.sobrecargo = row[prop];
      }
      if(prop == "auxiliar"){
        newViaje.auxiliar = row[prop];
      }
      if(prop == "numeroEconomico"){
        newViaje.numeroEconomico = row[prop];
      }
    }
    newViaje.creadoPor = this.state.idUsuario;
    newViaje.hora = '00:00';
    newViaje.anio = this.getAnio(newViaje.fecha);
    newViaje.diaDelAnio = this.getDiaDelAnio(newViaje.fecha);
    newViaje.id_Viajes = '0';
    newViaje.activo = 'true';
    newViaje.asiento_1 = 'false';
    newViaje.asiento_2 = 'false';
    newViaje.asiento_3 = 'false';
    newViaje.asiento_4 = 'false';
    newViaje.asiento_5 = 'false';
    newViaje.asiento_6 = 'false';
    newViaje.asiento_7 = 'false';
    newViaje.asiento_8 = 'false';
    newViaje.asiento_9 = 'false';
    newViaje.asiento_10 = 'false';
    newViaje.asiento_11 = 'false';
    newViaje.asiento_12 = 'false';
    newViaje.asiento_13 = 'false';
    newViaje.asiento_14 = 'false';
    newViaje.asiento_15 = 'false';
    newViaje.asiento_16 = 'false';
    newViaje.asiento_17 = 'false';
    newViaje.asiento_18 = 'false';
    newViaje.asiento_19 = 'false';
    newViaje.asiento_20 = 'false';
    newViaje.asiento_21 = 'false';
    newViaje.asiento_22 = 'false';
    newViaje.asiento_23 = 'false';
    newViaje.asiento_24 = 'false';
    newViaje.asiento_25 = 'false';
    newViaje.asiento_26 = 'false';
    newViaje.asiento_27 = 'false';
    newViaje.asiento_28 = 'false';
    newViaje.asiento_29 = 'false';
    newViaje.asiento_30 = 'false';
    newViaje.asiento_31 = 'false';
    newViaje.asiento_32 = 'false';
    newViaje.asiento_33 = 'false';
    newViaje.asiento_34 = 'false';
    newViaje.asiento_35 = 'false';
    newViaje.asiento_36 = 'false';
    newViaje.asiento_37 = 'false';
    newViaje.asiento_38 = 'false';
    newViaje.asiento_39 = 'false';
    newViaje.asiento_40 = 'false';
    newViaje.asiento_41 = 'false';
    newViaje.asiento_42 = 'false';
    newViaje.asiento_43 = 'false';
    newViaje.asiento_44 = 'false';
    newViaje.asiento_45 = 'false';
    newViaje.asiento_46 = 'false';
    newViaje.asiento_47 = 'false';
    newViaje.asiento_48 = 'false';
    console.log('newViaje', newViaje);
    this.saveNewViaje(newViaje);
  }

  onAfterDeleteRow(rowKeys){
    for (let i = 0; i < rowKeys.length; i++) {
      this.deleteViaje(rowKeys[i]);
    }
  }

  rowClassNameFormat(row, rowIdx){
    return row.origenPais == 'US' ? 'US' : 'MX';
  }

  createCustomModalBody(){
    return (
      <MyCustomBody 
        columns={ this.state.columns } />
    );
  }

  imprimirSeleccion(){
    GenerarViajes(this.state.viajes);
  }


  render(){
    const selectRow = {
      mode: 'radio',
      showOnlySelected: true
    };
    const options = {
      afterDeleteRow: this.onAfterDeleteRow,
      insertModalBody: this.createCustomModalBody,
      afterInsertRow: this.onAfterInsertRow,
      insertModalFooter: () => {
          return (
            <InsertModalFooter
              saveBtnText='Guardar'
              closeBtnText='Cancelar'/>
          );
      },
        //afterSearch: afterSearch,  // define a after search hook
      insertBtn: () => {
          return(
            <InsertButton
              btnText='Nuevo'
              btnContextual='btn-info'
              className='my-custom-class'
              btnGlyphicon='fas fa-plus'/>
          );
      },
      insertModalHeader: () => {
          return (
            <InsertModalHeader
              title='Nuevo Viaje'
              hideClose={ true }/>
              // hideClose={ true } to hide the close button
          );
      },
      deleteBtn: () => {
          return(
            <DeleteButton
            btnText='Eliminar'
            btnContextual='btn-danger'
            className='my-custom-class'
            btnGlyphicon='fas fa-trash-alt'/>
          );
      },
      exportCSVBtn: () => {
        return(
          <ExportCSVButton
          btnText='Editar'
          btnContextual='btn-warning'
          btnGlyphicon='fas fa-pencil-alt'
          onClick={ (e) => this.toggle(e) }/>
        );
      },
      showSelectedOnlyBtn: () => {
        return(
          <ShowSelectedOnlyButton
          showAllText='custom all'
          showOnlySelectText='Imprimir Lista'
          btnContextual='btn-info'
          btnGlyphicon='fas fa-print'
          onClick={ e => this.imprimirSeleccion(e) }/>
        );
      },
    };

    return (
      <div>
        <Container style={{ marginTop: "15px" }}>
          <h3 className="text-center">VIAJES</h3>
          <br/>
          {
            (this.state.userType == 'Admin' || this.state.userType == 'Viajes')?
              <Row>
                <Col lg='12' md='12' sm='12' xs='12'>
                  <BootstrapTable ref='table' exportCSV data={ this.state.viajes } deleteRow={ true } selectRow={ selectRow } insertRow={ true } search={ true } options={ options } trClassName={this.rowClassNameFormat} pagination>
                      <TableHeaderColumn width='80' dataField='_id' isKey hidden>ID</TableHeaderColumn>
                      <TableHeaderColumn width='110' dataField='fecha'>Fecha</TableHeaderColumn>
                      <TableHeaderColumn width='250' dataField='ruta'>Ruta</TableHeaderColumn>
                      <TableHeaderColumn width='150' dataField='numeroEconomico' >No. Economico</TableHeaderColumn>
                      <TableHeaderColumn width='150' dataField='capacidad' >Capacidad</TableHeaderColumn>
                      <TableHeaderColumn width='250' dataField='chofer_1'>Chofer 1</TableHeaderColumn>
                      <TableHeaderColumn width='250' dataField='chofer_2'>Chofer 2</TableHeaderColumn>
                      <TableHeaderColumn width='250' dataField='sobrecargo'>Sobrecargo</TableHeaderColumn>
                      <TableHeaderColumn width='250' dataField='auxiliar'>Auxiliar</TableHeaderColumn>
                      <TableHeaderColumn width='250' dataField='creadoPor'>Creado Por:</TableHeaderColumn>
                  </BootstrapTable>
                </Col>
              </Row>
            :
              <Row>
                <Col lg='12' md='12' sm='12' xs='12'>
                  <BootstrapTable ref='table' exportCSV data={ this.state.viajes } selectRow={ {mode: 'radio'} } search={ true } options={ options } trClassName={this.rowClassNameFormat} pagination>
                      <TableHeaderColumn width='80' dataField='_id' isKey hidden>ID</TableHeaderColumn>
                      <TableHeaderColumn width='110' dataField='fecha'>Fecha</TableHeaderColumn>
                      <TableHeaderColumn width='250' dataField='ruta'>Ruta</TableHeaderColumn>
                      <TableHeaderColumn width='150' dataField='numeroEconomico' >No. Economico</TableHeaderColumn>
                      <TableHeaderColumn width='150' dataField='capacidad' >Capacidad</TableHeaderColumn>
                      <TableHeaderColumn width='250' dataField='chofer_1'>Chofer 1</TableHeaderColumn>
                      <TableHeaderColumn width='250' dataField='chofer_2'>Chofer 2</TableHeaderColumn>
                      <TableHeaderColumn width='250' dataField='sobrecargo'>Sobrecargo</TableHeaderColumn>
                      <TableHeaderColumn width='250' dataField='auxiliar'>Auxiliar</TableHeaderColumn>
                  </BootstrapTable>
                </Col>
              </Row>
          }
          <br/><br/><br/>
        </Container>

        {/************************************** MODAL EDITAR ************************************************/}
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Editar</ModalHeader>
          <ModalBody>
              <Row>
                  <Col lg={{ size: 10, offset: 1 }} md={{ size: 10, offset: 1 }} sm='12' xs='12'>
                    <Label for="exampleDate">Fecha</Label>
                    <Input
                      plaintext
                      defaultValue = {this.state.fecha}
                      type="text"
                      name="date"
                      id="exampleDate"
                      placeholder="date placeholder"
                    />
                  </Col>
              </Row>
              <Row>
                  <Col lg={{ size: 10, offset: 1 }} md={{ size: 10, offset: 1 }} sm='12' xs='12'>
                    <Label for="selectRuta">Ruta:</Label>
                    <Select
                      isDisabled={(this.state.userType == 'Admin' || this.state.userType == 'Viajes')? false : true}
                      id="selectRuta"
                      defaultValue={this.state.ruta}
                      onChange={this.handleChangeRuta}
                      options={this.state.optRutas}
                      placeholder = "Selecciona..."
                    />
                  </Col>
              </Row>
              <Row>
                  <Col lg={{ size: 10, offset: 1 }} md={{ size: 10, offset: 1 }} sm='12' xs='12'>
                    <Input plaintext value={this.state.rutaTxt} />
                  </Col>
              </Row>
              <Row>
                  <Col lg={{ size: 10, offset: 1 }} md={{ size: 10, offset: 1 }} sm='12' xs='12'>
                    <Label for="selectNoEco">No. Económico:</Label>
                    <Select
                      isDisabled={(this.state.userType == 'Admin' || this.state.userType == 'Viajes')? false : true}
                      id="selectNoEco"
                      defaultValue={this.state.noEco}
                      onChange={this.handleChangeCamion}
                      options={this.state.optCamiones}
                      placeholder = "Selecciona..."
                    />
                  </Col>
              </Row>
              <Row>
                <Col lg={{ size: 10, offset: 1 }} md={{ size: 10, offset: 1 }} sm='12' xs='12'>
                    <Label for="selectCapacidad">Capacidad:</Label>
                    <Select
                      id="selectCapacidad"
                      defaultValue={this.state.capacidad}
                      onChange={this.handleChangeCapacidades}
                      options={capacidades}
                      placeholder = "Selecciona..."
                    />
                  </Col>
              </Row>
              <Row>
                  <Col lg={{ size: 10, offset: 1 }} md={{ size: 10, offset: 1 }} sm='12' xs='12'>
                    <Label for="selectChofer1">Chofer 1:</Label>
                    <Select
                      isDisabled={(this.state.userType == 'Admin' || this.state.userType == 'Viajes')? false : true}
                      id="selectChofer1"
                      defaultValue={this.state.chofer_1}
                      onChange={this.handleChofer1}
                      options={this.state.optTripulantes}
                      placeholder = "Selecciona..."
                    />
                  </Col>
              </Row>
              <Row>
                  <Col lg={{ size: 10, offset: 1 }} md={{ size: 10, offset: 1 }} sm='12' xs='12'>
                    <Label for="selectChofer2">Chofer 2:</Label>
                    <Select
                      isDisabled={(this.state.userType == 'Admin' || this.state.userType == 'Viajes')? false : true}
                      id="selectChofer2"
                      defaultValue={this.state.chofer_2}
                      onChange={this.handleChofer2}
                      options={this.state.optTripulantes}
                      placeholder = "Selecciona..."
                    />
                  </Col>
              </Row>
              <Row>
                  <Col lg={{ size: 10, offset: 1 }} md={{ size: 10, offset: 1 }} sm='12' xs='12'>
                    <Label for="selectSobrecargo">Sobrecargo:</Label>
                    <Select
                      isDisabled={(this.state.userType == 'Admin' || this.state.userType == 'Viajes')? false : true}
                      id="selectSobrecargo"
                      defaultValue={this.state.sobrecargo}
                      onChange={this.handleChangeSobrecargo}
                      options={this.state.optTripulantes}
                      placeholder = "Selecciona..."
                    />
                  </Col>
              </Row>
              <Row>
                  <Col lg={{ size: 10, offset: 1 }} md={{ size: 10, offset: 1 }} sm='12' xs='12'>
                    <Label for="selectAuxiliar">Auxiliar:</Label>
                    <Select
                      isDisabled={(this.state.userType == 'Admin' || this.state.userType == 'Viajes')? false : true}
                      id="selectAuxiliar"
                      defaultValue={this.state.auxiliar}
                      onChange={this.handleChangeAux}
                      options={this.state.optAuxiliares}
                      placeholder = "Selecciona..."
                    />
                  </Col>
              </Row>
          </ModalBody>
          <ModalFooter>
              <Button color="secondary" onClick={this.toggle}>Cancelar</Button>
              <Button color="primary" onClick={this.modificarViaje}>Guardar</Button>{' '}                            
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}