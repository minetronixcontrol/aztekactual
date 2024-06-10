import React, { Component } from 'react'
import {Button, Card, CardTitle, Container, Col, Form, FormGroup, Input, InputGroupAddon, Label, Row} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

import GenerarClientes from "./ClientesPDF";

/* Variables */
var user = null;

var clientes = [];

var optParentesco = [
    'Cónyuge',
    'Padre/Madre',
    'Hermano(a)',
    'Hijo(a)',
    'Abuelo(a)',
    'Nieto(a)',
    'Otro'
];
  
var optGenero = [
    'H',
    'M'
];

export default class Clientes extends Component {
    constructor(props){
      super(props);
      this.state = {
        clientes: [],
        usuario: this.props.match.params.id_Usuario,
        idUsuario: '',
        idUsuarioA: '',
        userType: ''
      }

      user = this.props.match.params.id_Usuario;

      this.fetchUser = this.fetchUser.bind(this);
      this.fetchClientes = this.fetchClientes.bind(this);
      this.limpiarCampos = this.limpiarCampos.bind(this);
      this.onAfterSaveCell = this.onAfterSaveCell.bind(this);
      this.onBeforeSaveCell = this.onBeforeSaveCell.bind(this);
    }

    componentDidMount(){
        this.fetchUser(this.state.usuario);
        //this.fetchClientes('ultimosRegistrosAdmin');
    }

    fetchUser(){
        let idUser = null;
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
            if(this.state.userType == 'Admin'){
              this.fetchClientes('ultimosRegistrosAdmin');
            }else{
              this.fetchClientes('ultimosRegistros', idUser);
            }
        });
    }

    fetchClientes(field, id){
        if(field == 'ultimosRegistrosAdmin'){
            fetch(`/api/FindQuery/10`)
            .then(res => res.json())
            .then(data => {
                if(data.length > 0){
                    clientes = data;
                }
            }).then(() => {
                this.setState({
                    clientes: clientes
                });
            });
        }else if(field == 'ultimosRegistros'){
            fetch(`/api/FindQuery/10`)
            .then(res => res.json())
            .then(data => {
                if(data.length > 0){
                    clientes = data;
                }
            }).then(() => {
                this.setState({
                    clientes: clientes
                });
            });
        }else{
            let nom = 'null';
            let ap = 'null';
            let am = 'null';

            let nombreBusqueda = document.getElementById('nombreCliente').value;
            let apaternoBusqueda = document.getElementById('aPaternoCliente').value;
            let amaternoBusqueda = document.getElementById('aMaternoCliente').value;
    
            if(nombreBusqueda != '' && nombreBusqueda != null){
                nom = nombreBusqueda
            } 
    
            if(apaternoBusqueda != '' && apaternoBusqueda != null){
                ap = apaternoBusqueda
            }
    
            if(amaternoBusqueda != '' && amaternoBusqueda != null){
                am = amaternoBusqueda
            }
            let controlCase = 'null';

            if( nom == 'null' && ap != 'null' ){
                controlCase = 'soloApellido';
            }

            if( nom != 'null' && ap == 'null' ){
                controlCase = 'soloNombre';
            }
            if( nom != 'null' && ap != 'null' ){
                controlCase = 'nombreApellido';
            }



            if(this.state.userType == 'Admin'){
                fetch(`/api/FindQuery/${nom}/${ap}/${controlCase}/0/100000`)
 //               fetch(`/api/Clientes/${nom}/${ap}/${am}/clientes`)
                .then(res => res.json())
                .then(data => {
                    if(data.length > 0){
                        clientes = data;
                    }
                    this.setState({
                        
                        clientes: clientes
                    })
                })
            }else{
                fetch(`/api/Clientes/${nom}/${ap}/${am}/${this.state.idUsuario}`)
                .then(res => res.json())
                .then(data => {
                    if(data.length > 0){
                        clientes = data;
                    }
                    this.setState({
                        clientes: clientes
                    })
                })
            }
    
            
        }
        
    }

    limpiarCampos(){
        document.getElementById('nombreCliente').value = "";
        document.getElementById('aPaternoCliente').value = "";
        document.getElementById('aMaternoCliente').value = "";
    }

    onAfterSaveCell(row, cellName, cellValue){
        let value = cellValue;
        if(cellValue == '' || cellValue == null){
            value = 'null';
        }
        fetch(`/api/Clientes/${row._id}/${value}/${cellName}`, {
            method: 'PUT',
            //body: JSON.stringify(this.state),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if(this.state.userType == 'Admin'){
                    this.fetchClientes('ultimosRegistrosAdmin');
                }else{
                    this.fetchClientes('ultimosRegistros');
                }
              
            })
    }
    
    onBeforeSaveCell(row, cellName, cellValue){
        if((cellValue == '' || cellValue == null) && (cellName != "apellidoMaterno")){
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

    render() {
        const cellEditProp = {
            mode: 'dbclick',
            blurToSave: true,
            beforeSaveCell: this.onBeforeSaveCell, // a hook for before saving cell
            afterSaveCell: this.onAfterSaveCell  // a hook for after saving cell
        };
        return (
            <div>
                <Container style={{ marginTop: "15px" }}>
                    {/*
                        (this.state.userType == 'Admin')? */
                    }
                    <Form>
                        <Card body outline color="secondary">
                            <CardTitle className="text-center"><h3>Clientes</h3></CardTitle>
                            <br/>
                            {/** BUSQUEDA **/}
                            <h5>Buscar Por:</h5>
                            <Row>
                                <Col lg='4' md='4' sm='12' xs='12'>
                                    <FormGroup>
                                        <Label for="nombreCliente">Nombre</Label>
                                        <Input type="text" name="nombreCliente" id="nombreCliente"/>
                                    </FormGroup>
                                </Col>
                                <Col lg='3' md='3' sm='12' xs='12'>
                                    <FormGroup>
                                        <Label for="aPaternoCliente">Apellido Paterno:</Label>
                                        <Input id="aPaternoCliente" name="aPaternoCliente" type="text" />
                                    </FormGroup>
                                </Col>
                                <Col lg='3' md='3' sm='12' xs='12'>
                                    <FormGroup>
                                        <Label for="aMaternoCliente">Apellido Materno:</Label>
                                        <Input id="aMaternoCliente" name="aMaternoCliente" type="text" />
                                    </FormGroup>
                                </Col>
                                <Col className="btn-nuevoPasajero" lg='1' md='1' sm='6' xs='6'>
                                <Button color="primary" onClick={this.fetchClientes}><i className="fa fa-search"/></Button>
                                </Col>
                                <Col className="btn-nuevoPasajero" lg='1' md='1' sm='6' xs='6'>
                                <Button color="primary" onClick={this.limpiarCampos}><i className="fa fa-eraser"/></Button>
                                </Col>
                            </Row>
                            {/** TERMINA BUSQUEDA **/}
                        </Card>
                    </Form>
                    <br/>
                    <br/>
                    <Row>
                        <Col lg='12' md='12' sm='12' xs='12'>
                        <BootstrapTable ref='table' data={ this.state.clientes } cellEdit={ cellEditProp }>
                            <TableHeaderColumn row='0' colSpan='8'>CLIENTES</TableHeaderColumn>
                            <TableHeaderColumn row='0' colSpan='5'>CONTACTOS DE EMERGENCIA</TableHeaderColumn>
                            <TableHeaderColumn width='65' row='1' dataField='_id' isKey hidden>ID</TableHeaderColumn>
                            <TableHeaderColumn width='200' row='1' dataField='nombre' tdStyle={ { whiteSpace: 'normal' } }>Nombre</TableHeaderColumn>
                            <TableHeaderColumn width='200' row='1' dataField='apellidoPaterno' tdStyle={ { whiteSpace: 'normal' } }>Apellido Paterno</TableHeaderColumn>
                            <TableHeaderColumn width='200' row='1' dataField='apellidoMaterno' tdStyle={ { whiteSpace: 'normal' } }>Apellido Materno</TableHeaderColumn>
                            <TableHeaderColumn width='180' row='1' dataField='fechaNacimiento' editable={ {type: 'date'} } tdStyle={ { whiteSpace: 'normal' } }>Fecha de nacimiento</TableHeaderColumn>
                            <TableHeaderColumn width='200' row='1' dataField='curp' tdStyle={ { whiteSpace: 'normal' } }>CURP</TableHeaderColumn>
                            <TableHeaderColumn width='200' row='1' dataField='genero' editable={ { type: 'select', options: { values: optGenero } } } tdStyle={ { whiteSpace: 'normal' } }>Genero</TableHeaderColumn>
                            <TableHeaderColumn width='250' row='1' dataField='correo' tdStyle={ { whiteSpace: 'normal' } }>Correo electrónico</TableHeaderColumn>
                            <TableHeaderColumn width='120' row='1' dataField='telefono' tdStyle={ { whiteSpace: 'normal' } }>Telefono</TableHeaderColumn>
                            <TableHeaderColumn width='200' row='1' dataField='nombreEmergencia' tdStyle={ { whiteSpace: 'normal' } }>Nombre</TableHeaderColumn>
                            <TableHeaderColumn width='200' row='1' dataField='apellidoPaternoEmergencia' tdStyle={ { whiteSpace: 'normal' } }>Apellido Paterno</TableHeaderColumn>
                            <TableHeaderColumn width='200' row='1' dataField='apellidoMaternoEmergencia' tdStyle={ { whiteSpace: 'normal' } }>Apellido Materno</TableHeaderColumn>
                            <TableHeaderColumn width='180' row='1' dataField='parentesco' editable={ { type: 'select', options: { values: optParentesco } } } tdStyle={ { whiteSpace: 'normal' } }>Parentesco</TableHeaderColumn>
                            <TableHeaderColumn width='120' row='1' dataField='telefonoEmergencia' tdStyle={ { whiteSpace: 'normal' } }>Telefono</TableHeaderColumn>
                        </BootstrapTable>
                        </Col>
                    </Row><br/><br/><br/>
                    </Container>
            </div>
        )
    }
}
