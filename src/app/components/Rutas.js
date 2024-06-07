import React, { Component } from 'react';
import {Button, Col, Container, Form, Label, Modal, ModalHeader, ModalBody, ModalFooter, Row, Input, Table} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import Select from 'react-select';
import MyCustomBody from './modalsBodys/modalGeneral';

var precios = null;

var lugares = [];

var rutas = [];

var lugaresId = [];

var lugaresNames = [];

var user = null;

var idUser = null;

var newRow = {};

var optDestino  = [];

class Rutas extends Component {
    constructor(props){
        super(props);
        this.state = {
          ruta: null,
          rutas: null,
          modal: false,
          columns: [],
          validationDestino: true,
          optDestino: [],
          origen: { value: '', label: '' },
          destino: { value: '', label: '' },
          transbordos: {},
          idUsuario: '',
          userType: '',
          selected: [],
          defaultTransbordos: []
        };

        user = this.props.match.params.id_Usuario;

        this.fetchRutas = this.fetchRutas.bind(this);
        this.createCustomModalBody = this.createCustomModalBody.bind(this);
        this.onAfterInsertRow = this.onAfterInsertRow.bind(this);
        this.onBeforeSaveCell =  this.onBeforeSaveCell.bind(this);
        this.onAfterSaveCell= this.onAfterSaveCell.bind(this);
        this.onAfterDeleteRow = this.onAfterDeleteRow.bind(this);
        this.deleteRuta = this.deleteRuta.bind(this);

        this.toggle = this.toggle.bind(this);
        this.handleChangeOrigen = this.handleChangeOrigen.bind(this);
        this.handleChangeDestino = this.handleChangeDestino.bind(this);
        this.handleChangeRuta = this.handleChangeRuta.bind(this);

        this.fetchOrigenesYdestinos = this.fetchOrigenesYdestinos.bind(this);

        this.fetchUser = this.fetchUser.bind(this);

        this.modificarRuta = this.modificarRuta.bind(this);

        this.rowClassNameFormat = this.rowClassNameFormat.bind(this);
    }

    componentDidMount(){
      this.fetchUser();
      this.fetchRutas();
      this.fetchOrigenesYdestinos();
    }

    fetchUser(){
      fetch(`/api/Usuarios/${user}`)
        .then(res => res.json())
        .then(data => {
          this.setState({
            idUsuario: data[0]._id,
            userType: data[0].seguridad
          });
          idUser = data[0]._id
        });
    }

    toggle(e){
      let selectedRows = this.refs.table.state.selectedRowKeys;
      this.setState({
        ruta: selectedRows[0]
      });
      let defaultTransbordos = [];
      if(selectedRows.length > 0){
        for (let i = 0; i < rutas.length; i++) {
          if(rutas[i]._id == selectedRows[0]){
            for (let j = 0; j < rutas[i].transbordos.length; j++) {
              defaultTransbordos.push(rutas[i].transbordos[j].idTransbordo);
            }
            this.setState(prevState => ({
              origen: { value: rutas[i].idOrigen, label: rutas[i].origen },
              destino: { value: rutas[i].idDestino, label: rutas[i].destino },
              defaultTransbordos: defaultTransbordos,
              modal: !prevState.modal
            }));
            break;
          }     
        }
      }
      //{ value: 'Ninguno', label: 'Ninguno', desc: '0' }
      /**/
    }

    fetchRutas(){
      let selected = [];
      fetch(`/api/Rutas/true/activo`)
      .then(res => res.json())
        .then(data => {
          //console.log(data);
          if(data.length > 0){
            rutas = data;
            this.setState({
              rutas: data
            });
          }
        })
        .then(() => {
          for (let i = 0; i < this.state.rutas.length; i++) {
            selected.push(i);
          }
        })
        .then(() => {
          this.setState({
            selected: selected
          });
        });
    }

    fetchOrigenesYdestinos(){
      let origenesYdestinos = [];
      fetch(`/api/OrigenesYdestinos/true/activo`)
        .then(res => res.json())
          .then(data => {
            if(data.length > 0){
              for (let i = 0; i < data.length; i++) {
                origenesYdestinos.push({
                  value: data[i]._id,
                  label: data[i].nombre
                });
              }
            }
        })
        .then(()=>{
          this.setState({
            optDestino: origenesYdestinos,
            columns: [
              {
                type: 'input',
                options: null,
                field: '_id',
                name: 'id',
                hiddenOnInsert: true
              },
              {
                type: 'react-select-origen',
                options: origenesYdestinos,
                field: 'origen',
                name: 'Origen',
                hiddenOnInsert: false
              },
              {
                type: 'react-select-destino',
                options: origenesYdestinos,
                field: 'destino',
                name: 'Destino',
                hiddenOnInsert: false
              },
              {
                type: 'react-select-transbordos',
                options: origenesYdestinos,
                field: 'transbordos',
                name: 'Transbordos',
                hiddenOnInsert: false
              },
            ]
          });
        });
    }

    handleChangeOrigen(e){
      this.setState({
        origen: e
      });
    }

    handleChangeDestino(e){
      this.setState({
        destino: e
      });
    }

    handleChangeRuta(e){
      console.log('rutaValue',e.target.value);
    }

    createCustomModalBody(){
      return (
        <MyCustomBody 
          columns={ this.state.columns } />
      );
    }

    onAfterDeleteRow(rowKeys){
      for (let i = 0; i < rowKeys.length; i++) {
        this.deleteRuta(rowKeys[i]);
      }
      alert('Se ha borrado la ruta');
    }

    onAfterInsertRow(row){
      newRow = {};
      for (const prop in row) {
        if(prop == "origen"){
          newRow.origen = row[prop];
        }
        if(prop == "destino"){
          newRow.destino = row[prop];
        }
        if(prop == "transbordos"){
          newRow.transbordos = row[prop];
        }
      }
      newRow.activo = true;

      this.guardarRuta(newRow);
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

    guardarRuta(obj){
      fetch('/api/Rutas', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
      })
      .then(res => {
        this.fetchRutas();
      }) 
      .catch(err => {
        console.log(err);
        alert('Ha ocurrido un error, intentalo más tarde');
        this.fetchRutas();
      });
    }

    modificarRuta(){
      let ruta = [];
      let origen = this.state.origen;
      let destino = this.state.destino;
      let selectTransbordos = document.getElementById('selectTransbordos');
      for (let i = 0; i < selectTransbordos.options.length; i++) {
        if(selectTransbordos.options[i].selected === true){
          ruta.push(selectTransbordos.options[i].value);
        }
      }

      let body = {
        origen: origen.value,
        destino: destino.value, 
        transbordos: ruta,
        activo: true
      };

      fetch(`/api/Rutas/${this.state.ruta}/`, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
      })
      .then(res => {
        this.fetchRutas();
        this.setState(prevState => ({
          modal: !prevState.modal
        }));
      });
    }

    deleteRuta(id){
      fetch(`/api/Rutas/${id}/${false}/activo`, {
          method: 'PUT',
          //body: JSON.stringify(this.state),
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          }
      })
          .then(res => {
            this.fetchRutas();
          })
    }

    rowClassNameFormat(row, rowIdx){
      if(row.origenPais === 'US'){
        return 'US';
      }else{
        return 'MX';
      }
    }

    render() {

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
                title='Nueva Ruta'
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
      };

      return (
          <div>
            {
              (this.state.userType == 'Admin' || this.state.userType == 'Viajes')? 
              (
              <Container style={{ marginTop: "15px" }}>
                <h3 className="text-center">RUTAS</h3>
                <br/>
                <Row>
                  <Col lg='12' md='12' sm='12' xs='12'>
                    <BootstrapTable ref='table'  data={ this.state.rutas } exportCSV deleteRow={ true } selectRow={ {mode: 'radio'} } insertRow={ true } search={ true } options={ options } trClassName={this.rowClassNameFormat} pagination>
                        <TableHeaderColumn width='80' dataField='_id' isKey hidden>ID</TableHeaderColumn>
                        <TableHeaderColumn width='150' dataField='origen'  editable={ false }>Origen</TableHeaderColumn>
                        <TableHeaderColumn width='150' dataField='destino' editable={ false }>Destino</TableHeaderColumn>
                        <TableHeaderColumn width='150' dataField='transbordosTxt' editable={ false } tdStyle={ { whiteSpace: 'normal' } }>Recorrido</TableHeaderColumn>
                    </BootstrapTable>
                  </Col>
                </Row><br/><br/><br/>


                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                  <ModalHeader toggle={this.toggle}>Editar</ModalHeader>
                  <ModalBody>
                      <Row>
                          <Col lg={{ size: 10, offset: 1 }} md={{ size: 10, offset: 1 }} sm='12' xs='12'>
                            <Row>
                              <Col>
                                <Label for="selectOrigen">Origen:</Label>
                                <div class={(this.state.validationDestino) ? 'card border-light': 'card border-danger'}>
                                    <Select
                                    id="selectOrigen"
                                    defaultValue={this.state.origen}
                                    onChange={this.handleChangeOrigen}
                                    options={this.state.optDestino}
                                    placeholder = "Selecciona..."
                                    />
                                </div>
                                {/* <p class={(this.state.validationDestino) ? 'textValid': 'textInvalid'}>Selecciona el destino</p> */}
                              </Col>
                            </Row>
                            <Row>
                              <Col>
                                <Label for="selectDestino">Destino:</Label>
                                <div class={(this.state.validationDestino) ? 'card border-light': 'card border-danger'}>
                                    <Select
                                    id="selectDestino"
                                    defaultValue={this.state.destino}
                                    onChange={this.handleChangeDestino}
                                    options={this.state.optDestino}
                                    placeholder = "Selecciona..."
                                    />
                                </div>
                                {/* <p class={(this.state.validationDestino) ? 'textValid': 'textInvalid'}>Selecciona el destino</p> */}
                              </Col>
                            </Row>
                            <Row>
                              <Col>
                              <Label for="selectTransbordos">Ruta</Label>
                              <Input
                                type='select'
                                name="selectTransbordos"
                                id="selectTransbordos"
                                multiple
                                defaultValue={this.state.defaultTransbordos}
                                onChange={this.handleChangeRuta}
                              >
                                {this.state.optDestino.map((option, i) => {
                                    return(
                                        <option key={i} value={option.value}>{option.label}</option>
                                    );
                                  })}
                              </Input>
                                {/* <p class={(this.state.validationDestino) ? 'textValid': 'textInvalid'}>Selecciona el destino</p> */}
                              </Col>
                            </Row>
                          </Col>
                      </Row>
                  </ModalBody>
                  <ModalFooter>
                      <Button color="secondary" onClick={this.toggle}>Cancelar</Button>
                      <Button color="primary" onClick={this.modificarRuta}>Guardar</Button>{' '}                            
                  </ModalFooter>
                </Modal>


              </Container>
              )
              :
              (
                <Container style={{ marginTop: "15px" }}>
                  <h3 className="text-center">RUTAS</h3>
                  <br/>
                  <Row>
                    <Col lg='12' md='12' sm='12' xs='12'>
                      <BootstrapTable ref='table' data={ this.state.rutas } search={ true } trClassName={this.rowClassNameFormat} pagination>
                          <TableHeaderColumn width='80' dataField='_id' isKey hidden>ID</TableHeaderColumn>
                          <TableHeaderColumn width='150' dataField='origen'  editable={ false }>Origen</TableHeaderColumn>
                          <TableHeaderColumn width='150' dataField='destino' editable={ false }>Destino</TableHeaderColumn>
                          <TableHeaderColumn width='150' dataField='transbordosTxt' editable={ false }>Recorrido</TableHeaderColumn>
                      </BootstrapTable>
                    </Col>
                  </Row><br/><br/><br/>
                </Container>
              )
            }

              
          </div>
      );
    }
}

export default Rutas;