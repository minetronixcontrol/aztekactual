import React, { Component } from 'react';
import {Container, Col, Row} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import MyCustomBody from './modalsBodys/modalGeneral';

import GenerarOrigenesYdestinos from "./OrigenesYdestinosPDF";

/* Componentes Externos */
/** Termina Componentes Externos **/

/* Variables */
var newLugar = {}
var lugares = [];

const countryTypes = [
    'MX',
    'US'
];

const columns = [
  {
    type: 'input',
    options: null,
    field: '_id',
    name: 'id',
    hiddenOnInsert: true
  },
  {
    type: 'input',
    options: null,
    field: 'nombre',
    name: 'Nombre',
    hiddenOnInsert: false
  },
  {
    type: 'input',
    options: null,
    field: 'municipio',
    name: 'Municipio',
    hiddenOnInsert: false
  },
  {
    type: 'input',
    options: null,
    field: 'direccion',
    name: 'Dirección',
    hiddenOnInsert: false
  },
  {
    type: 'input',
    options: null,
    field: 'estado',
    name: 'Estado',
    hiddenOnInsert: false
  },
  {
    type: 'select',
    options: countryTypes,
    field: 'pais',
    name: 'País',
    hiddenOnInsert: false
  },
  {
    type: 'time',
    options: countryTypes,
    field: 'horaDeCita',
    name: 'Hora de Cita',
    hiddenOnInsert: false
  },
  {
    type: 'time',
    options: countryTypes,
    field: 'horaDeSalida',
    name: 'Hora de Salida',
    hiddenOnInsert: false
  },
]

export default class OrigenesyDestinos extends Component {
  constructor(props){
    super(props);
    this.state = {
      lugares: []
    };

    this.fetchOrigenesYdestinos = this.fetchOrigenesYdestinos.bind(this);
    this.createCustomModalBody = this.createCustomModalBody.bind(this);
    this.onAfterInsertRow = this.onAfterInsertRow.bind(this);
    this.onAfterSaveCell = this.onAfterSaveCell.bind(this);
    this.onAfterDeleteRow = this.onAfterDeleteRow.bind(this);
    /////////////////////////////////////////////////////
    this.saveLugar = this.saveLugar.bind(this);
    this.imprimirSeleccion = this.imprimirSeleccion.bind(this);
  }

  componentDidMount(){
    this.fetchOrigenesYdestinos();
  }

  fetchOrigenesYdestinos(){
    fetch('/api/OrigenesYdestinos/true/activo')
      .then(res => res.json())
      .then(data => {
        console.log(data);
          if(data.length > 0){
            lugares = data;
          }
      }).then(()=>{
          this.setState({
              lugares: lugares
          });
      })
  }

  createCustomModalBody(){
    return (
        <MyCustomBody 
          columns={ columns } />
    );
  }

  onAfterInsertRow(row) {
    newLugar = {};
    for (const prop in row) {
      if(prop == "nombre"){
        newLugar.nombre = row[prop];
      }
      if(prop == "municipio"){
        newLugar.municipio = row[prop];
      }
      if(prop == "direccion"){
        newLugar.direccion = row[prop];
      }
      if(prop == "estado"){
        newLugar.estado = row[prop];
      }
      if(prop == "pais"){
        newLugar.pais = row[prop];
      }
      if(prop == "horaDeCita"){
        newLugar.horaDeCita = row[prop];
      }
      if(prop == "horaDeSalida"){
        newLugar.horaDeSalida = row[prop];
      }
    }
    newLugar.activo = 'true';
    newLugar.idOrigenesYdestinos = '0';

    this.saveLugar(newLugar);
  }

  onAfterSaveCell(row, cellName, cellValue){
    fetch(`/api/OrigenesYdestinos/${row._id}/${cellValue}/${cellName}`, {
        method: 'PUT',
        //body: JSON.stringify(this.state),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(res => {
          this.fetchOrigenesYdestinos();
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

  onAfterDeleteRow(rowKeys){
    for (let i = 0; i < rowKeys.length; i++) {
      console.log(rowKeys[i]);
      this.deleteOrigen(rowKeys[i]);
    }
    alert('Se ha borrado el origen/destino');
  }

  saveLugar(obj){
    fetch('/api/OrigenesYdestinos', {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }
    })
    .then(res => {
      console.log(res.json());
      this.fetchOrigenesYdestinos();
    }) 
    .catch(err => {
      console.log(err);
      alert('Ha ocurrido un error, intentalo más tarde');
      this.fetchOrigenesYdestinos();
    });
  }

  deleteOrigen(id){
    fetch(`/api/OrigenesYdestinos/${id}/false/activo`, {
        method: 'PUT',
        //body: JSON.stringify(this.state),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(res => {
            //console.log(res);
            this.fetchOrigenesYdestinos();
        })
  }

  imprimirSeleccion(){
    console.log('imprimir seleccion');
    let selectedRowKeys = this.refs.table.state.selectedRowKeys;
    console.log(selectedRowKeys);
    fetch(`/api/OrigenesYdestinos/c/printOrigenesYdestinos`, {//IdVenta es el id del viaje (Asignar viajes)
      method: 'PUT',
      body: JSON.stringify({selectedRowKeys}),
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      GenerarOrigenesYdestinos(data);
    })
    .catch(error => {
      console.log(error);
      alert('Ha ocurrido un error, por favor intentalo más tarde');
    })
  }

  render() {
    const cellEditProp = {
      mode: 'dbclick',
      blurToSave: true,
      beforeSaveCell: this.onBeforeSaveCell, // a hook for before saving cell
      afterSaveCell: this.onAfterSaveCell  // a hook for after saving cell
    };

    const selectRow = {
      mode: 'checkbox',
      showOnlySelected: true
    };

    const options = {
      afterDeleteRow: this.onAfterDeleteRow,
      afterInsertRow: this.onAfterInsertRow,
      insertModalBody: this.createCustomModalBody,
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
              title='Nuevo Origen/Destino'
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
      showSelectedOnlyBtn: () => {
        return(
          <ShowSelectedOnlyButton
          showAllText='custom all'
          showOnlySelectText='Imprimir Seleccion'
          btnContextual='btn-info'
          btnGlyphicon='fas fa-print'
          onClick={ e => this.imprimirSeleccion(e) }/>
        );
      },   
    };
    return (
      <div>
        <Container style={{ marginTop: "15px" }}>
          <h3 className="text-center">ORIGENES Y DESTINOS</h3>
          <br/>
          <Row>
            <Col lg='12' md='12' sm='12' xs='12'>
              <BootstrapTable ref='table'  data={ this.state.lugares } deleteRow={ true } selectRow={ selectRow } insertRow={ true } search={ true } cellEdit={ cellEditProp } options={ options } pagination>
                  <TableHeaderColumn width='50' dataField='_id' isKey hidden>ID</TableHeaderColumn>
                  <TableHeaderColumn width='110' dataField='nombre' tdStyle={ { whiteSpace: 'normal' } }>Nombre</TableHeaderColumn>
                  <TableHeaderColumn width='110' dataField='municipio' tdStyle={ { whiteSpace: 'normal' } }>Municipio</TableHeaderColumn>
                  <TableHeaderColumn width='250' dataField='direccion' tdStyle={ { whiteSpace: 'normal' } }>Direccion</TableHeaderColumn>
                  <TableHeaderColumn width='150' dataField='estado' tdStyle={ { whiteSpace: 'normal' } }>Estado</TableHeaderColumn>
                  <TableHeaderColumn width='80' dataField='pais' editable={ { type: 'select', options: { values: countryTypes } } } tdStyle={ { whiteSpace: 'normal' } }>País</TableHeaderColumn>
                  <TableHeaderColumn width='130' dataField='horaDeCita' editable={ { type: 'time'} } tdStyle={ { whiteSpace: 'normal' } }>Hora de cita</TableHeaderColumn>
                  <TableHeaderColumn width='130' dataField='horaDeSalida' editable={ { type: 'time'} } tdStyle={ { whiteSpace: 'normal' } }>Hora de Salida</TableHeaderColumn>
              </BootstrapTable>
            </Col><br/><br/><br/>
          </Row>
        </Container>
      </div>
    )
  }
}
