import React, { Component } from 'react';
import {Button, Card, CardTitle, Container, Col, Form, FormGroup, Input, Label, Row} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

import GenerarVentasCanceladas from "./ventasCanceladasPDF";

var usuario = {
    id: '',
    nickname: '',
    seguridad: ''
};

export default class ventasCanceladas extends Component {
    constructor(props){
        super(props);
        this.state = {
          cancelaciones: []
        }

        usuario.nickname = this.props.match.params.id_Usuario;

        this.fetchCancelaciones = this.fetchCancelaciones.bind(this);
        this.buquedaFechaFolio = this.buquedaFechaFolio.bind(this);
        this.limpiarFechaFolio = this.limpiarFechaFolio.bind(this);
        this.fetchUsuario = this.fetchUsuario.bind(this);
        this.buquedaNombre = this.buquedaNombre.bind(this);
        this.limpiarNombres = this.limpiarNombres.bind(this);
    }

    componentDidMount(){
        this.fetchUsuario(usuario.nickname);
    }

    fetchUsuario(nickname){
        fetch(`/api/Usuarios/${nickname}`)
        .then(res => res.json())
        .then(data => {
            if(data.length > 0){
                usuario.id = data[0]._id;
                usuario.seguridad = data[0].seguridad;
            }        
        })
        .then(() => {
            var f = new Date();
            let dia = f.getDate();
            let mes = (f.getMonth() +1);
            let anio = f.getFullYear();
            this.fetchCancelaciones(`${dia}-${mes}-${anio}`, 'fechaViaje', false, true); //Las cancelaciones del viaje de hoy
        });
    }

    fetchCancelaciones(value, field, folio, init){
        if(folio){
            console.log(`/api/Cancelaciones/${value}/${field}/${folio}/${usuario.id}`);
            fetch(`/api/Cancelaciones/${value}/${field}/${folio}/${usuario.id}`)
            .then(res => res.json())
            .then(data => {
                if(data.length > 0){
                    this.setState({
                        cancelaciones: data,
                    });
                }else{
                    this.setState({
                        cancelaciones: [],
                    });
                    alert('No se encontró resultado que coincida con tu búsqueda');
                }
            })
        }else{
            fetch(`/api/Cancelaciones/${value}/${field}/${usuario.id}`)
            .then(res => res.json())
            .then(data => {
                if(data.length > 0){
                    this.setState({
                        cancelaciones: data,
                    });
                }else{
                    this.setState({
                        cancelaciones: [],
                    });
                    if(!init){
                        alert('No se encontró resultado que coincida con tu búsqueda');
                    } 
                }
            })
        }
    }

    buquedaFechaFolio(){
        let fechaViaje = document.getElementById('fechaViaje').value;
        let folio = document.getElementById('folio').value;
        let folioUsuario = document.getElementById('folioUsuario').value;
        if((fechaViaje == null || fechaViaje == '') && (folioUsuario == null || folioUsuario == '')){
          alert('Por favor llena un campo de busqueda');
        }else if((fechaViaje != null && fechaViaje != '') && (folioUsuario == null || folioUsuario == '')){
          ///Hacemos busqueda por fecha de viaje
          console.log('Busqueda por fecha');
          let arrayFechaDeViaje = fechaViaje.split('-', 3);
          this.fetchCancelaciones(`${arrayFechaDeViaje[2]}-${arrayFechaDeViaje[1]}-${arrayFechaDeViaje[0]}`, 'fechaViaje');
        }else if((folioUsuario != null && folioUsuario != '') && (folio != null && folio != '') && (fechaViaje == null || fechaViaje == '')){
          //Hacemos busqueda Por folio      
          this.fetchCancelaciones(folioUsuario, 'folio', folio);
        }else{
          alert('Llena solo un campo para la busqueda');
        }
    }

    limpiarFechaFolio(){
        document.getElementById('fechaViaje').value = '';
        document.getElementById('folio').value = '';
        document.getElementById('folioUsuario').value = '';
    }

    limpiarNombres(){
        document.getElementById('nombreCliente').value = '';
        document.getElementById('apellidoPCliente').value = '';
        document.getElementById('apellidoMCliente').value = '';
    }

    buquedaNombre(){
        let nom = 'null';
        let ap = 'null';
        let am = 'null';

        let nombreBusqueda = document.getElementById('nombreCliente').value;
        let apaternoBusqueda = document.getElementById('apellidoPCliente').value;
        let amaternoBusqueda = document.getElementById('apellidoMCliente').value;

        if(nombreBusqueda != '' && nombreBusqueda != null){
            nom = nombreBusqueda;
        }

        if(apaternoBusqueda != '' && apaternoBusqueda != null){
            ap = apaternoBusqueda;
        }

        if(amaternoBusqueda != '' && amaternoBusqueda != null){
            am = amaternoBusqueda;
        }

        console.log(`/api/Cancelaciones/${nom}/pasajero/${ap}/${am}`);
        fetch(`/api/Cancelaciones/${nom}/pasajero/${ap}/${am}`)
        .then(res => res.json())
        .then(data => {
            if(data.length > 0){
                this.setState({
                    cancelaciones: data,
                });
            }else{
                this.setState({
                    cancelaciones: [],
                });
                alert('No se encontró resultado que coincida con tu búsqueda');
            }
        });
    }

    render() {
        return (
            <div>
                <Container style={{ marginTop: "15px" }}>
                    <Form>
                        <Card body outline color="secondary">
                            <CardTitle className="text-center"><h3>Ventas Canceladas</h3></CardTitle>
                            <br/>
                            {/** BUSQUEDA **/}
                            <h5>Buscar Por:</h5>
                            <Row>
                                <Col lg='3' md='3' sm='3' xs='3'>
                                <FormGroup>
                                    <Label for="fechaViaje">Fecha de viaje</Label>
                                    <Input type="date" name="fechaViaje" id="fechaViaje"/>
                                </FormGroup>
                                </Col>
                                <Col lg='1' md='1' sm='1' xs='1'>
                                    <h5 className="guionca text-center">ca-</h5>
                                </Col>
                                <Col lg='3' md='3' sm='3' xs='3'>
                                    <FormGroup>
                                        <Label for="folio">Folio:</Label>
                                        <Input className="folioca" id="folioUsuario" name="folioUsuario" type="text" />
                                    </FormGroup>
                                </Col>
                                <Col lg='1' md='1' sm='1' xs='1'>
                                <h3 className="guion text-center">-</h3>
                                </Col>
                                <Col lg='2' md='2' sm='2' xs='2'>
                                <FormGroup>
                                    <Label for="folio">No.</Label>
                                    <Input id="folio" name="folio" type="text" />
                                </FormGroup>
                                </Col>
                                <Col className="btn-nuevoPasajero" lg='1' md='1' sm='1' xs='1'>
                                <Button color="primary" title="Buscar" onClick={this.buquedaFechaFolio}><i className="fa fa-search"/></Button>
                                </Col>
                                <Col className="btn-nuevoPasajero" lg='1' md='1' sm='1' xs='1'>
                                <Button color="primary" title="Limpiar campos" onClick={this.limpiarFechaFolio}><i className="fa fa-eraser"/></Button>
                                </Col>
                            </Row>
                            <hr/>
                            <Row>
                                <Col lg='4' md='4' sm='4' xs='4'>
                                    <FormGroup>
                                    <Label for="nombreCliente">Nombre de Cliente</Label>
                                    <Input type="text" name="nombreCliente" id="nombreCliente"/>
                                    </FormGroup>
                                </Col>
                                <Col lg='3' md='3' sm='3' xs='3'>
                                    <FormGroup>
                                    <Label for="apellidoPCliente">Apellido Paterno</Label>
                                    <Input type="text" name="apellidoPCliente" id="apellidoPCliente"/>
                                    </FormGroup>
                                </Col>
                                <Col lg='3' md='3' sm='3' xs='3'>
                                    <FormGroup>
                                    <Label for="apellidoMCliente">Apellido Materno</Label>
                                    <Input id="apellidoMCliente" name="apellidoMCliente" type="text" />
                                    </FormGroup>
                                </Col>
                                <Col className="btn-nuevoPasajero" lg='1' md='1' sm='1' xs='1'>
                                    <Button color="primary" title="Buscar" onClick={this.buquedaNombre}><i className="fa fa-search"/></Button>
                                </Col>
                                <Col className="btn-nuevoPasajero" lg='1' md='1' sm='1' xs='1'>
                                    <Button color="primary" title="Limpiar campos" onClick={this.limpiarNombres}><i className="fa fa-eraser"/></Button>
                                </Col>
                            </Row>
                            {/** TERMINA BUSQUEDA **/}
                            {/** ACCIONES **/}
                        </Card>
                        </Form>
                        <br/>
                        <br/>
                    <Row>
                        <Col lg='12' md='12' sm='12' xs='12'>
                        <BootstrapTable ref='table'  data={ this.state.cancelaciones } >
                            <TableHeaderColumn dataField='_id' isKey hidden>ID</TableHeaderColumn>
                            <TableHeaderColumn width='250' dataField='folio' tdStyle={ { whiteSpace: 'normal' } }>Folio de Cancelación</TableHeaderColumn>
                            <TableHeaderColumn width='250' dataField='clienteName' tdStyle={ { whiteSpace: 'normal' } }>Cliente</TableHeaderColumn>
                            <TableHeaderColumn width='150' dataField='dia' >Fecha de Viaje</TableHeaderColumn>
                            <TableHeaderColumn width='150' dataField='origen' tdStyle={ { whiteSpace: 'normal' } }>Origen</TableHeaderColumn>
                            <TableHeaderColumn width='150' dataField='destino' tdStyle={ { whiteSpace: 'normal' } }>Destino</TableHeaderColumn>
                            <TableHeaderColumn width='300' dataField='motivo' tdStyle={ { whiteSpace: 'normal' } }>Motivo</TableHeaderColumn>
                            <TableHeaderColumn width='250' dataField='vendedorName' tdStyle={ { whiteSpace: 'normal' } }>Vendedor</TableHeaderColumn>
                            <TableHeaderColumn width='200' dataField='fechaCancelacion' >Fecha de Cancelación</TableHeaderColumn>                            
                        </BootstrapTable>
                        </Col>
                    </Row>
                    <br/>
                    <br/>
                </Container>
            </div>
        )
    }
}