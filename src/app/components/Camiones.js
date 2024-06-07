import React, { Component } from 'react';
import {Container, Col, Row} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import MyCustomBody from './modalsBodys/modalGeneral';

import GenerarCamiones from "./CamionesPDF";


const capacityTypes = [
  '38',
  '42'
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
    field: 'placas',
    name: 'Placas',
    hiddenOnInsert: false
  },
  {
    type: 'input',
    options: null,
    field: 'marca',
    name: 'Marca',
    hiddenOnInsert: false
  },
  {
    type: 'input',
    options: null,
    field: 'modelo',
    name: 'Modelo',
    hiddenOnInsert: false
  },
  {
    type: 'input',
    options: null,
    field: 'numeroEconomico',
    name: 'No. Económico',
    hiddenOnInsert: false
  },
  {
    type: 'select',
    options: capacityTypes,
    field: 'capacidad',
    name: 'Capacidad',
    hiddenOnInsert: false
  },
]

var nuevoCamion = {}
var camiones = [];

export default class Camiones extends Component {
  constructor(props){
    super(props);
    this.state = {
      camiones: null
    };

    this.fetchCamiones = this.fetchCamiones.bind(this);
    this.deleteCamion = this.deleteCamion.bind(this);
    this.guardarCamion = this.guardarCamion.bind(this);

    this.createCustomModalBody = this.createCustomModalBody.bind(this);
    this.onBeforeSaveCell = this.onBeforeSaveCell.bind(this);
    this.onAfterSaveCell = this.onAfterSaveCell.bind(this);
    this.onAfterInsertRow = this.onAfterInsertRow.bind(this);
    this.onAfterDeleteRow = this.onAfterDeleteRow.bind(this);
    this.imprimirSeleccion = this.imprimirSeleccion.bind(this);
  }

  componentDidMount(){
    this.fetchCamiones();
  }

  fetchCamiones(){
    fetch(`/api/Camiones/true/activo`)
      .then(res => res.json())
      .then(data => {
        if(data.length > 0){
          camiones = data;
        }
      }).then(()=>{
        this.setState({
          camiones: camiones
        })
      })
  }

  createCustomModalBody(){
    return (
      <MyCustomBody 
        columns={ columns } />
    );
  }

  onAfterInsertRow(row) {
    nuevoCamion = {};
    for (const prop in row) {
      if(prop == "placas"){
        nuevoCamion.placas = row[prop];
      }
      if(prop == "marca"){
        nuevoCamion.marca = row[prop];
      }
      if(prop == "modelo"){
        nuevoCamion.modelo = row[prop];
      }
      if(prop == "numeroEconomico"){
        nuevoCamion.numeroEconomico = row[prop];
      }
      if(prop == "capacidad"){
        nuevoCamion.capacidad = row[prop];
      }
    }
    nuevoCamion.activo = 'true';
    nuevoCamion.id_Camion = '0';

    this.guardarCamion(nuevoCamion);
  } 

  onAfterSaveCell(row, cellName, cellValue){
    fetch(`/api/Camiones/${row._id}/${cellValue}/${cellName}`, {
        method: 'PUT',
        //body: JSON.stringify(this.state),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(res => {
          this.fetchCamiones();
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
      this.deleteCamion(rowKeys[i]);
    }
    alert('Se ha borrado el origen/destino');
  }

  guardarCamion(obj) {
    fetch('/api/Camiones', {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }
    })
    .then(res => {
      console.log(res.json());
      this.fetchCamiones();
    }) 
    .catch(err => {
      console.log(err);
      alert('Ha ocurrido un error, intentalo más tarde');
      this.fetchCamiones();
    });
  }

  deleteCamion(id){
    fetch(`/api/Camiones/${id}/false/activo`, {
        method: 'PUT',
        //body: JSON.stringify(this.state),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(res => {
            //console.log(res);
            this.fetchCamiones();
        })
  }

  imprimirSeleccion(){
    console.log('imprimir seleccion');
    let selectedRowKeys = this.refs.table.state.selectedRowKeys;
    console.log(selectedRowKeys);
    fetch(`/api/Camiones/c/printCamiones`, {//IdVenta es el id del viaje (Asignar viajes)
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
      GenerarCamiones(data);
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
              title='Nuevo Camión'
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
          <h3 className="text-center">CAMIONES</h3>
          <br/>
          <Row>
            <Col lg='12' md='12' sm='12' xs='12'>
              <BootstrapTable ref='table' data={ this.state.camiones } insertRow={ true } deleteRow={ true } search={ true } selectRow={ selectRow } cellEdit={ cellEditProp } options={ options } pagination>
                  <TableHeaderColumn width='110' dataField='_id' isKey hidden>ID</TableHeaderColumn>
                  <TableHeaderColumn width='110' dataField='placas'>Placas</TableHeaderColumn>
                  <TableHeaderColumn width='110' dataField='marca'>Marca</TableHeaderColumn>
                  <TableHeaderColumn width='110' dataField='modelo'>Modelo</TableHeaderColumn>
                  <TableHeaderColumn width='110' dataField='numeroEconomico'>No. Economico</TableHeaderColumn>
                  <TableHeaderColumn width='110' dataField='capacidad' editable={ { type: 'select', options: { values: capacityTypes } } }>Capacidad</TableHeaderColumn>
              </BootstrapTable>
            </Col>
          </Row><br/><br/><br/>
        </Container>
      </div>
    )
  }
}
