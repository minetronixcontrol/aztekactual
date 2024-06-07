import React, { Component } from 'react';
import {Container, Button, Col, Row, Table} from 'reactstrap';

import MyCustomBody from './modalsBodys/modalGeneral';

import GenerarListaNegra from "./ListaNegraPDF";

/* Componentes Externos */
/** Termina Componentes Externos **/

/** Variables **/
var clientes = []

var nuevoClienteListaNegra = {
  idCliente: null,
  motivo: null,
};


export default class ListaNegra extends Component {

  constructor(props) {
    super(props);
    this.state = {
      clientes: null,
    };

    this.fetchClientes = this.fetchClientes.bind(this);
    this.fetchListaNegra = this.fetchListaNegra.bind(this);
    this.createCustomModalBody = this.createCustomModalBody.bind(this);
    this.onAfterInsertRow = this.onAfterInsertRow.bind(this);
    this.guardarClienteListaNegra = this.guardarClienteListaNegra.bind(this);
    this.onBeforeSaveCell = this.onBeforeSaveCell.bind(this);
    this.onAfterSaveCell = this.onAfterSaveCell.bind(this);
    this.onAfterDeleteRow = this.onAfterDeleteRow.bind(this);
  }

  componentDidMount(){
    this.fetchClientes();    
  }

  fetchClientes(){
    fetch('/api/Clientes/')
    .then(res => res.json())
    .then(data => {
      let optCliente = [];
        //console.log(data);
        if(data.length > 0){
          //console.log('origen');
          for(let i = 0; i < data.length; i++){
            optCliente[i] = { 
              value: data[i]._id,
              name: data[i].nombre+" "+data[i].apellidoPaterno+" "+data[i].apellidoMaterno,
              label: data[i].nombre+" "+data[i].apellidoPaterno+" "+data[i].apellidoMaterno+" - "+data[i].fechaNacimiento
            };
          }
          this.setState({
            optCliente: optCliente
          })
        }
        
        // console.log('optOrigen', this.state.optOrigen);
    })
    .then(() => {
      this.fetchListaNegra();
    });
  }

  fetchListaNegra(){
    fetch(`/api/ListaNegra/ListaNegra`)
    .then(res => res.json())
    .then(data => {
      this.setState({
        ListaNegra: data,
        columns: [
          {
            type: 'input',
            options: null,
            field: '_id',
            name: 'id',
            hiddenOnInsert: true
          },
          {
            type: 'selectAsync',
            options: this.state.optCliente,
            field: 'idCliente',
            name: 'Cliente',
            hiddenOnInsert: false
          },
          {
            type: 'input',
            options: null,
            field: 'motivo',
            name: 'Motivo',
            hiddenOnInsert: false
          }, 
        ]
      });
    });
  }

  deleteClienteListaNegra(id){
    fetch(`/api/ListaNegra/${id}`, {
      method: 'DELETE',
      //body: JSON.stringify(this.state),
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }
  })
      .then(res => {
        this.fetchListaNegra();
      })
  }

  onAfterInsertRow(row) {
    nuevoClienteListaNegra = {};
    for (const prop in row) {
      if(prop == "idCliente"){
        nuevoClienteListaNegra.idCliente = row[prop];
      }
      if(prop == "motivo"){
        nuevoClienteListaNegra.motivo = row[prop];
      }
    }
    this.guardarClienteListaNegra(nuevoClienteListaNegra);
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
    fetch(`/api/ListaNegra/${row._id}/${cellValue}/${cellName}`, {
        method: 'PUT',
        //body: JSON.stringify(this.state),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(res => {
          this.fetchListaNegra();
        })
  }

  onAfterDeleteRow(rowKeys){
    for (let i = 0; i < rowKeys.length; i++) {
      console.log(rowKeys[i]);
      this.deleteClienteListaNegra(rowKeys[i]);
    }
    alert('Se ha quitado el cliente de la lista negra');
  }

  createCustomModalBody(){
    return (
      <MyCustomBody 
        columns={ this.state.columns } />
    );
  }


  //////////////
  guardarClienteListaNegra(obj){
    fetch('/api/ListaNegra', {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }
    })
    .then(res => {
      console.log(res.json());
      this.fetchListaNegra();
    }) 
    .catch(err => {
      console.log(err);
      alert('Ha ocurrido un error, intentalo más tarde');
      this.fetchListaNegra();
    });
  }

  imprimirSeleccion(){
    GenerarListaNegra(this.state.ListaNegra);
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
              btnText='Agregar Cliente'
              btnContextual='btn-info'
              className='my-custom-class'
              btnGlyphicon='fas fa-plus'/>
          );
      },
      insertModalHeader: () => {
          return (
            <InsertModalHeader
              title='Agregar Cliente a la Lista Negra'
              hideClose={ true }/>
              // hideClose={ true } to hide the close button
          );
      },
      deleteBtn: () => {
          return(
            <DeleteButton
            btnText='Remover'
            btnContextual='btn-danger'
            className='my-custom-class'
            btnGlyphicon='fas fa-trash-alt'/>
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
          <h3 className="text-center">LISTA NEGRA</h3>
          <br/>
          <Row>
            <Col lg='12' md='12' sm='12' xs='12'>
              <BootstrapTable data={ this.state.ListaNegra } cellEdit={ cellEditProp } insertRow={ true } deleteRow={ true } selectRow={ selectRow } options={ options } pagination>
                  <TableHeaderColumn width='20' dataField='_id' isKey hidden>ID</TableHeaderColumn>
                  <TableHeaderColumn width='100' editable={ false } dataField='idCliente'>Cliente</TableHeaderColumn>
                  <TableHeaderColumn width='150'dataField='motivo'>Motivo</TableHeaderColumn>
              </BootstrapTable>
            </Col>
          </Row><br/><br/><br/>
        </Container>
      </div>
    )
  }
}
