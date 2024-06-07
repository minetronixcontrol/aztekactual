import React, { Component } from 'react';
import {Col, Container, Form, Row} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import MyCustomBody from './modalsBodys/modalGeneral';

var precios = null;

var lugares = [];


var lugaresId = [];

var lugaresNames = [];

var newRow = {};

class ConfigurarPrecios extends Component {
    constructor(props){
        super(props);
        this.state = {
          precios: null,
          columns: []
        };
        this.fetchPrecios = this.fetchPrecios.bind(this);
        this.fetchOrigenesYdestinos = this.fetchOrigenesYdestinos.bind(this);
        this.createCustomModalBody = this.createCustomModalBody.bind(this);
        this.onAfterInsertRow = this.onAfterInsertRow.bind(this);
        this.onBeforeSaveCell =  this.onBeforeSaveCell.bind(this);
        this.onAfterSaveCell= this.onAfterSaveCell.bind(this);
        this.onAfterDeleteRow = this.onAfterDeleteRow.bind(this);
        this.deletePrecio = this.deletePrecio.bind(this);
        this.getIdOrigenDestino= this.getIdOrigenDestino.bind(this);
    }

    componentDidMount(){
        this.fetchPrecios();
    }

    fetchPrecios(){
        fetch(`/api/Precios/activo/true`)
          .then(res => res.json())
          .then(data => {
            if(data.length > 0){
              precios = data;
            }
          }).then(()=>{
            this.setState({
              precios: precios
            });
            this.fetchOrigenesYdestinos();
          })
    }

    fetchOrigenesYdestinos(){
      fetch('/api/OrigenesYdestinos/true/activo')
        .then(res => res.json())
        .then(data => {
          if(data.length > 0){
            lugares = data;
            for (const i in data) {
              lugaresNames[i] = data[i].nombre;
              lugaresId[i] = data[i]._id;
            }
          }
        }).then(() => {
          this.setState({
            columns: [
              {
                type: 'input',
                options: null,
                field: '_id',
                name: 'id',
                hiddenOnInsert: true
              },
              {
                type: 'select',
                options: lugaresNames,
                field: 'origen',
                name: 'Origen',
                hiddenOnInsert: false
              },
              {
                type: 'select',
                options: lugaresNames,
                field: 'destino',
                name: 'Destino',
                hiddenOnInsert: false
              },
              {
                type: 'input',
                options: null,
                field: 'costo',
                name: 'Precio $US',
                hiddenOnInsert: false
              },
            ]
          });
        });
    }

    createCustomModalBody(){
      return (
        <MyCustomBody 
          columns={ this.state.columns } />
      );
    }

    onAfterDeleteRow(rowKeys){
      for (let i = 0; i < rowKeys.length; i++) {
        this.deletePrecio(rowKeys[i]);
      }
      alert('Se ha borrado el precio');
    }

    onAfterInsertRow(row){
      newRow = {};
      for (const prop in row) {
        if(prop == "origen"){
          newRow.origen = this.getIdOrigenDestino(row[prop]);
        }
        if(prop == "destino"){
          newRow.destino = this.getIdOrigenDestino(row[prop]);
        }
        if(prop == "costo"){
          newRow.costo = row[prop];
        }
      }
      newRow.id_precio = 0;
      newRow.activo = "true";
      this.guardarPrecio(newRow);
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
      fetch(`/api/Precios/${row._id}/${cellValue}/${cellName}`, {
          method: 'PUT',
          //body: JSON.stringify(this.state),
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          }
      })
          .then(res => {
            this.fetchPrecios();
          })
    }

    guardarPrecio(obj){
      fetch('/api/Precios', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
      })
      .then(res => {
        this.fetchPrecios();
      }) 
      .catch(err => {
        console.log(err);
        alert('Ha ocurrido un error, intentalo más tarde');
        this.fetchPrecios();
      });
    }

    deletePrecio(id){
      fetch(`/api/Precios/${id}/false/activo`, {
          method: 'PUT',
          //body: JSON.stringify(this.state),
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          }
      })
          .then(res => {
            this.fetchPrecios();
          })
    }

    getIdOrigenDestino(nombre){
      let i = lugaresNames.indexOf(nombre+'');
      return lugaresId[i]
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
                title='Nuevo Precio'
                hideClose={ true }/>
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
                <h3 className="text-center">PRECIOS</h3>
                <br/>
                <Row>
                    <Col lg='12' md='12' sm='12' xs='12'>
                    <BootstrapTable  data={ this.state.precios } deleteRow={ true } selectRow={ {mode: 'checkbox'} } insertRow={ true } search={ true } cellEdit={ cellEditProp } options={ options } pagination>
                        <TableHeaderColumn width='80' dataField='_id' isKey hidden>ID</TableHeaderColumn>
                        <TableHeaderColumn width='150' dataField='origen'  editable={ false }>Origen</TableHeaderColumn>
                        <TableHeaderColumn width='150' dataField='destino' editable={ false }>Destino</TableHeaderColumn>
                        <TableHeaderColumn width='150' dataField='costo'>Precio $US</TableHeaderColumn>
                    </BootstrapTable>
                    </Col>
                </Row><br/><br/><br/>
              </Container>
          </div>
      );
    }
}

export default ConfigurarPrecios;