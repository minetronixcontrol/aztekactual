import React, { Component } from 'react';
import {Container, Col, Row} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import MyCustomBody from './modalsBodys/modalGeneral';

import GenerarTripulantes from "./TripulantesPDF";

/* Componentes Externos */
/** Termina Componentes Externos **/
var newTripulante = {}

var tripulantes = [];

var tripulationTypes = [
  'chofer',
  'sobrecargo',
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
    field: 'apellidoPaterno',
    name: 'Apellido Paterno',
    hiddenOnInsert: false
  },
  {
    type: 'input',
    options: null,
    field: 'apellidoMaterno',
    name: 'Apellido Materno',
    hiddenOnInsert: false
  },
  {
    type: 'input',
    options: null,
    field: 'telefono',
    name: 'Telefono',
    hiddenOnInsert: false
  },
  {
    type: 'input',
    options: null,
    field: 'telefono2',
    name: 'Telefono 2 Opcional',
    hiddenOnInsert: false
  },
  {
    type: 'select',
    options: tripulationTypes,
    field: 'tipo',
    name: 'Tipo',
    hiddenOnInsert: false
  },
];

export default class Choferes extends Component {
  constructor(props){
    super(props);

    this.state = {
      tripulantes: []
    };

    this.fetchTripulantes = this.fetchTripulantes.bind(this);
    this.saveTripulante = this.saveTripulante.bind(this);
    this.deleteTripulante = this.deleteTripulante.bind(this);

    this.createCustomModalBody = this.createCustomModalBody.bind(this);
    this.onAfterInsertRow = this.onAfterInsertRow.bind(this);
    this.onAfterSaveCell = this.onAfterSaveCell.bind(this);
    this.onBeforeSaveCell = this.onBeforeSaveCell.bind(this);
    this.onAfterDeleteRow = this.onAfterDeleteRow.bind(this);
    this.imprimirSeleccion = this.imprimirSeleccion.bind(this);
  }

  componentDidMount(){
    this.fetchTripulantes();
  }

  fetchTripulantes(){
    fetch('/api/Tripulantes/true/activo')
      .then(res => res.json())
      .then(data => {
          if(data.length > 0){
            tripulantes = data;
          }
      }).then(()=>{
          this.setState({
              tripulantes: tripulantes
          });
      })
  }

  onBeforeSaveCell(row, cellName, cellValue){
    if((cellName != 'telefono2' && cellName != 'apellidoMaterno') && (cellValue == '' || cellValue == null)){
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
    fetch(`/api/Tripulantes/${row._id}/${cellValue}/${cellName}`, {
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

  onAfterInsertRow(row) {
    newTripulante = {};
  
    for (const prop in row) {
      if(prop == "nombre"){
        newTripulante.nombre = row[prop];
      }
      if(prop == "apellidoPaterno"){
        newTripulante.apellidoPaterno = row[prop];
      }
      if(prop == "apellidoMaterno"){
        newTripulante.apellidoMaterno = row[prop];
      }
      if(prop == "telefono"){
        newTripulante.telefono = row[prop];
      }
      if(prop == "telefono2"){
        newTripulante.telefono2 = row[prop];
      }
      if(prop == "tipo"){
        newTripulante.tipo = row[prop];
      }
    }

    newTripulante.activo = 'true';
    newTripulante.id_tripulante = '0';

    this.saveTripulante(newTripulante);
  
  }

  onAfterDeleteRow(rowKeys){
    for (let i = 0; i < rowKeys.length; i++) {
      console.log(rowKeys[i]);
      this.deleteTripulante(rowKeys[i]);
    }
    alert('Se ha borrado el tripulante');
  }

  deleteTripulante(id){
    fetch(`/api/Tripulantes/${id}/false/activo`, {
        method: 'PUT',
        //body: JSON.stringify(this.state),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(res => {
            //console.log(res);
            this.fetchTripulantes();
        })
  }  

  saveTripulante(obj){
    fetch('/api/Tripulantes', {
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

  createCustomModalBody(){
    return (
      <MyCustomBody 
        columns={ columns } />
    );
  }

  imprimirSeleccion(){
    console.log('imprimir seleccion');
    let selectedRowKeys = this.refs.table.state.selectedRowKeys;
    console.log(selectedRowKeys);
    fetch(`/api/Tripulantes/c/printTripulantes`, {//IdVenta es el id del viaje (Asignar viajes)
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
      GenerarTripulantes(data);
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
              title='Nuevo Tripulante'
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
          <h3 className="text-center">TRIPULANTES</h3>
          <br/>
          <Row>
            <Col lg='12' md='12' sm='12' xs='12'>
              <BootstrapTable ref='table' data={ this.state.tripulantes } deleteRow={ true } insertRow={ true } search={ true } cellEdit={ cellEditProp } selectRow={ selectRow } options={ options } pagination>
                  <TableHeaderColumn width='50' dataField='_id' isKey hidden>ID</TableHeaderColumn>
                  <TableHeaderColumn width='100' dataField='nombre'>Nombre</TableHeaderColumn>
                  <TableHeaderColumn width='150' dataField='apellidoPaterno'>Apellido Paterno</TableHeaderColumn>
                  <TableHeaderColumn width='150' dataField='apellidoMaterno'>Apellido Materno</TableHeaderColumn>
                  <TableHeaderColumn width='120'dataField='telefono'>telefono</TableHeaderColumn>
                  <TableHeaderColumn width='120'dataField='telefono2'>telefono 2 </TableHeaderColumn>
                  <TableHeaderColumn width='100' dataField='tipo' editable={ { type: 'select', options: { values: tripulationTypes } } }>Tipo</TableHeaderColumn>
              </BootstrapTable>
            </Col>
          </Row>
          <br/>
          <br/>
          <br/>
        </Container>
      </div>
    )
  }
}
