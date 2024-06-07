import React, { Component } from 'react';
import {Col, Container, Form, Row} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import MyCustomBody from './modalsBodys/modalGeneral';

var newViaje = {}

var viajes = [];

var columns = [];

var tripulantesNames = [];
var tripulantesIds = [];

var usuariosNames = [];
var usuariosIds = [];

var choferesTypes = [];

var sobrecargosTypes = [];

var camionesTypes = []

var numerosEconomicos = [];

function dateFormatter(cell, row) {
    let res = cell.substring(4, 5);
    if(res == "-"){
        let dia = cell.substring(8, 10);
        let mes = cell.substring(5, 7);
        let anio = cell.substring(0, 4);
        return dia+'/'+mes+'/'+anio;
    }else{
        return cell;
    }
}

export default class Viajes extends Component {
  constructor(props){
    super(props);
    this.state = {
        viajes: [],
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
            type: 'select',
            options: null,
            field: 'chofer_1',
            name: 'Chofer 1',
            hiddenOnInsert: false
          },
          {
            type: 'select',
            options: null,
            field: 'chofer_2',
            name: 'Chofer 2',
            hiddenOnInsert: false
          },
          {
            type: 'select',
            options: null,
            field: 'sobrecargo',
            name: 'Sobrecargo',
            hiddenOnInsert: false
          },
          {
            type: 'select',
            options: null,
            field: 'auxiliar',
            name: 'Auxiliar',
            hiddenOnInsert: false
          },
          {
            type: 'input',
            options: null,
            field: 'numeroEconomico',
            name: 'no. Economico',
            hiddenOnInsert: false
          },
          {
            type: 'select',
            options: null,
            field: 'numeroEconomico',
            name: 'no. Economico',
            hiddenOnInsert: false
          },
        ],
    };

    this.fetchTripulantes = this.fetchTripulantes.bind(this);
    this.fetchViajes = this.fetchViajes.bind(this);
    this.fetchUsuariosMatriz = this.fetchUsuariosMatriz.bind(this);
    this.fetchCamiones = this.fetchCamiones.bind(this);
    ////////////////////////////////////
    this.getNameTripulante = this.getNameTripulante.bind(this);
    this.getNameUsuarios = this.getNameUsuarios.bind(this);
    this.getFecha = this.getFecha.bind(this);
    this.getAnio = this.getAnio.bind(this);
    this.getDiaDelAnio = this.getDiaDelAnio.bind(this);
    this.getIdTripulante = this.getIdTripulante.bind(this);
    this.getIdAux = this.getIdAux.bind(this);
    //////////////////////////////////////
    this.onAfterInsertRow = this.onAfterInsertRow.bind(this);
    this.createCustomModalBody = this.createCustomModalBody.bind(this);
    this.onAfterDeleteRow = this.onAfterDeleteRow.bind(this);
    this.onBeforeSaveCell = this.onBeforeSaveCell.bind(this);
    this.onAfterSaveCell = this.onAfterSaveCell.bind(this);
    ////////////////////////////////////
    this.saveNewViaje = this.saveNewViaje.bind(this);
    this.deleteViajes = this.deleteViajes.bind(this);
  }

  componentDidMount(){
    this.fetchTripulantes();
  }

  fetchTripulantes(){
    fetch(`/api/Tripulantes/true/activo`)
      .then(res => res.json())
      .then(data => {
        if(data.length > 0){
          for (let i = 0; i < data.length; i++) {
            tripulantesNames[i] = `${data[i].nombre} ${data[i].apellidoPaterno} ${data[i].apellidoMaterno}`;
            tripulantesIds[i] = data[i]._id;
          }
        }
        console.log(tripulantesNames);
        //console.log(tripulantesIds);
      }).then(()=>{
        this.fetchUsuariosMatriz();
      });
  }

  fetchUsuariosMatriz(){
    fetch(`/api/Usuarios/Matriz/seguridad`)
      .then(res => res.json())
      .then(data => {
        if(data.length > 0){
          for (let i = 0; i < data.length; i++) {
            usuariosNames[i] = `${data[i].nombre} ${data[i].apellidoPaterno} ${data[i].apellidoMaterno}`;
            usuariosIds[i] = data[i]._id;
          }
        }
        //console.log(usuariosNames);
        //console.log(usuariosIds);
      }).then(()=>{
        this.fetchCamiones();
      });
  }

  fetchViajes(){
    fetch(`/api/AsignarViajes/true/activo`)
      .then(res => res.json())
      .then(data => {
        if(data.length > 0){
          console.log(data);
          for (let i = 0; i < data.length; i++) {
            viajes[i] = {
              _id: data[i]._id,
              fecha: data[i].fecha,
              hora: data[i].hora,
              anio: data[i].anio,
              diaDelAnio: data[i].diaDelAnio,
              chofer_1: this.getNameTripulante(data[i].chofer_1),
              chofer_2: this.getNameTripulante(data[i].chofer_2),
              sobrecargo: this.getNameTripulante(data[i].sobrecargo),
              auxiliar: this.getNameUsuarios(data[i].auxiliar),
              numeroEconomico: data[i].numeroEconomico
            }
          }
        }
      }).then(()=>{
        console.log(viajes);
        this.setState({
          viajes: viajes,
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
              type: 'select',
              options: tripulantesNames,
              field: 'chofer_1',
              name: 'Chofer 1',
              hiddenOnInsert: false
            },
            {
              type: 'select',
              options: tripulantesNames,
              field: 'chofer_2',
              name: 'Chofer 2',
              hiddenOnInsert: false
            },
            {
              type: 'select',
              options: tripulantesNames,
              field: 'sobrecargo',
              name: 'Sobrecargo',
              hiddenOnInsert: false
            },
            {
              type: 'select',
              options: usuariosNames,
              field: 'auxiliar',
              name: 'Auxiliar',
              hiddenOnInsert: false
            },
            {
              type: 'select',
              options: numerosEconomicos,
              field: 'numeroEconomico',
              name: 'no. Economico',
              hiddenOnInsert: false
            },
          ],
        });
      });
  }

  fetchCamiones(){
    fetch(`/api/Camiones/true/activo`)
      .then(res => res.json())
      .then(data => {
        if(data.length > 0){
          for (let i = 0; i < data.length; i++) {
            numerosEconomicos.push(data[i].numeroEconomico);
          }
        }
      })
      .then(()=>{
        this.fetchViajes();
      })
  }

  getNameTripulante(id){
    let i = tripulantesIds.indexOf(id+'');
    return tripulantesNames[i];
  }

  getNameUsuarios(id){
    let i = usuariosIds.indexOf(id+'');
    return usuariosNames[i];
  }

  getIdTripulante(nombre){
    let i = tripulantesNames.indexOf(nombre+'');
    return tripulantesIds[i]
  }

  getIdAux(nombre){
    let i = usuariosNames.indexOf(nombre+'');
    return usuariosIds[i];
  }

  createCustomModalBody(){
    return (
      <MyCustomBody 
        columns={ this.state.columns } />
    );
  }

  onAfterDeleteRow(rowKeys){
    console.log(rowKeys);
    //Falta validar que no se haya hecho ya una venta o reservación.
    //En caso de que se haya hecho ya alguna venta o reservación, no será posible eliminar ese viaje
    for (let i = 0; i < rowKeys.length; i++) {
      console.log(rowKeys[i]);
      this.deleteViajes(rowKeys[i]);
    }
    this.fetchTripulantes();
    alert('Se ha borrado el viaje');
  }

  onAfterInsertRow(row) {
    newViaje = {};
    for (const prop in row) {
      if(prop == "fecha"){
        newViaje.fecha = this.getFecha(row[prop]);
      }
      if(prop == "chofer_1"){
        newViaje.chofer_1 = this.getIdTripulante(row[prop]);
      }
      if(prop == "chofer_2"){
        newViaje.chofer_2 = this.getIdTripulante(row[prop]);
      }
      if(prop == "sobrecargo"){
        newViaje.sobrecargo = this.getIdTripulante(row[prop]);
      }
      if(prop == "auxiliar"){
        newViaje.auxiliar = this.getIdAux(row[prop]);
      }
      if(prop == "numeroEconomico"){
        newViaje.numeroEconomico = row[prop];
      }
    }
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
    //console.log('newViaje', newViaje);
    this.saveNewViaje(newViaje);
  }

  onAfterSaveCell(row, cellName, cellValue){

    if(cellName == 'chofer_1' || cellName == 'chofer_2' || cellName == 'sobrecargo'){
      cellValue = this.getIdTripulante(cellValue);
    }

    if(cellName == 'auxiliar'){
      cellValue = this.getIdAux(cellValue);
    }

    fetch(`/api/AsignarViajes/${row._id}/${cellValue}/${cellName}`, {
        method: 'PUT',
        //body: JSON.stringify(this.state),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(res => {
          this.fetchTripulantes();
        })
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
      console.log(res.json());
      this.fetchTripulantes();
    }) 
    .catch(err => {
      console.log(err);
      alert('Ha ocurrido un error, intentalo más tarde');
      this.fetchTripulantes();
    });
  }

  deleteViajes(id){
    console.log('idVaiejs',id);
    fetch(`/api/AsignarViajes/${id}/false/activo`, {
      method: 'PUT',
      //body: JSON.stringify(this.state),
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }
    })
        .then(res => {
          //console.log(res);
          //this.fetchTripulantes();
        })
  }

  render() {
    const cellEditProp = {
      mode: 'dbclick',
      blurToSave: true,
      beforeSaveCell: this.onBeforeSaveCell, // a hook for before saving cell
      afterSaveCell: this.onAfterSaveCell  // a hook for after saving cell
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
      }     
    };

    return (
      <div>
        <Container style={{ marginTop: "15px" }}>
          <h3 className="text-center">VIAJES</h3>
          <br/>
          <Row>
            <Col lg='12' md='12' sm='12' xs='12'>
              <BootstrapTable  data={ this.state.viajes } deleteRow={ true } selectRow={ {mode: 'checkbox'} } insertRow={ true } search={ true } cellEdit={ cellEditProp } options={ options } pagination>
                  <TableHeaderColumn width='80' dataField='_id' isKey hidden>ID</TableHeaderColumn>
                  <TableHeaderColumn width='110' dataField='fecha'  editable={ false }>Fecha</TableHeaderColumn>
                  <TableHeaderColumn width='250' dataField='chofer_1' editable={ { type: 'select', options: { values: tripulantesNames } } }>Chofer 1</TableHeaderColumn>
                  <TableHeaderColumn width='250' dataField='chofer_2' editable={ { type: 'select', options: { values: tripulantesNames } } }>Chofer 2</TableHeaderColumn>
                  <TableHeaderColumn width='250' dataField='sobrecargo' editable={ { type: 'select', options: { values: tripulantesNames } } }>Sobrecargo</TableHeaderColumn>
                  <TableHeaderColumn width='250' dataField='auxiliar' editable={ { type: 'select', options: { values: usuariosNames } } }>Auxiliar</TableHeaderColumn>
                  <TableHeaderColumn width='100' dataField='numeroEconomico' >No. Economico</TableHeaderColumn>
              </BootstrapTable>
            </Col>
          </Row><br/><br/><br/>
        </Container>
      </div>
    )
  }
}
