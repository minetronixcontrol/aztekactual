import React, { Component } from 'react';
import {Button, Card, CardTitle, Container, Col, Form, FormGroup, Input, Label, Row} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

import GenerarReservacionesConcluidas from "./ventasConcluidasPDF";

var usuario = {
    id: '',
    nickname: '',
    seguridad: ''
};
var ventas = [];
  

export default class reservacionesConcluidas extends Component {

    constructor(props) {
        super(props);
        this.state = {
            reservaciones: []
        }
        usuario.nickname = this.props.match.params.id_Usuario;

        this.fetchUsuario = this.fetchUsuario.bind(this);
        this.fetchReservaciones = this.fetchReservaciones.bind(this);
        this.limpiarFechaFolio = this.limpiarFechaFolio.bind(this);
        this.buquedaFechaFolio = this.buquedaFechaFolio.bind(this);
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
            this.fetchReservaciones(usuario.seguridad, usuario.id, true);
          });
    }

    fetchReservaciones(seguridad, id, field){
        /* console.log(`/api/Reservaciones/${seguridad}/${id}/Viajados/true`);
        fetch(`/api/Reservaciones/${seguridad}/${id}/Viajados/true`)
          .then(res => res.json())
          .then(data => {
            console.log(data);
            if(data.length > 0){
                this.setState({
                    reservaciones: data
                })
            }
          }) */

        if(field == 'didmount'){
            console.log(`/api/Ventas/${seguridad}/${id}/Viajados/true`);
            fetch(`/api/Ventas/${seguridad}/${id}/Viajados/true`)
            .then(res => res.json())
            .then(data => {
                if(data.length > 0){
                    console.log(data);
                    this.setState({
                        reservaciones: data
                    });
                }else{
                    this.setState({
                        reservaciones: []
                    });
                }
            });
        }else if(field == 'folioViajados'){
            console.log(`/api/Reservaciones/${seguridad}/folioViajados/${id}/${usuario.id}`);
            fetch(`/api/Reservaciones/${seguridad}/folioViajados/${id}/${usuario.id}`)
            .then(res => res.json())
            .then(data => {
                if(data.length > 0){
                    console.log(data);
                    this.setState({
                        reservaciones: data
                    });
                }else{
                    this.setState({
                        reservaciones: []
                    });
                    alert('No se encontró resultado que coincida con tu búsqueda');
                }
            });
        }else{
            console.log(`/api/Reservaciones/${seguridad}/fechaViajeConcluidas/${usuario.id}`);
            fetch(`/api/Reservaciones/${seguridad}/fechaViajeConcluidas/${usuario.id}`)
            .then(res => res.json())
            .then(data => {
                if(data.length > 0){
                    console.log(data);
                    this.setState({
                        reservaciones: data
                    });
                }else{
                    this.setState({
                        reservaciones: []
                    });
                    if(!field){
                        alert('No se encontró resultado que coincida con tu búsqueda');
                    }
                }
            });
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
            this.setState({
                busqueda: 'fechaViaje',
                busquedaFecha: `${arrayFechaDeViaje[2]}-${arrayFechaDeViaje[1]}-${arrayFechaDeViaje[0]}`
            });
            this.fetchReservaciones(`${arrayFechaDeViaje[2]}-${arrayFechaDeViaje[1]}-${arrayFechaDeViaje[0]}`, 'fechaViaje');
        }else if((folioUsuario != null && folioUsuario != '') && (folio != null && folio != '') && (fechaViaje == null || fechaViaje == '')){
            //Hacemos busqueda Por folio     
            this.setState({
                busqueda: 'folio',
                folio: folio,
                folioUsuario: folioUsuario
            }); 
            this.fetchReservaciones(folioUsuario, folio, 'folioViajados');
        }else{
            alert('Llena solo un campo para la busqueda');
        }
    }

    limpiarFechaFolio(){
        document.getElementById('fechaViaje').value = '';
        document.getElementById('folio').value = '';
        document.getElementById('folioUsuario').value = '';
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

        console.log(`/api/Reservaciones/${nom}/pasajeroReservacionesConcluidas/${ap}/${am}`);
        fetch(`/api/Reservaciones/${nom}/pasajeroReservacionesConcluidas/${ap}/${am}`)
        .then(res => res.json())
        .then(data => {
            if(data.length > 0){
                this.setState({
                    reservaciones: data,
                });
            }else{
                this.setState({
                    reservaciones: [],
                });
                alert('No se encontró resultado que coincida con tu búsqueda');
            }
        });
    }

    limpiarNombres(){
        document.getElementById('nombreCliente').value = '';
        document.getElementById('apellidoPCliente').value = '';
        document.getElementById('apellidoMCliente').value = '';
    }

    render() {
        return (
            <div>
                <Container style={{ marginTop: "15px" }}>
                    <br/>
                    <Form>
                        <Card body outline color="secondary">
                            <CardTitle className="text-center"><h3>RESERVACIONES CONCLUIDAS</h3></CardTitle>
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
                                <Col lg='3' md='3' sm='3' xs='3'>
                                <FormGroup>
                                    <Label for="folio">Folio</Label>
                                    <Input id="folioUsuario" name="folioUsuario" type="text" />
                                </FormGroup>
                                </Col>
                                <Col lg='1' md='1' sm='1' xs='1'>
                                <h3 className="guion text-center">-</h3>
                                </Col>
                                <Col lg='3' md='3' sm='3' xs='3'>
                                <FormGroup>
                                    <Label for="folio">No.</Label>
                                    <Input id="folio" name="folio" type="text" />
                                </FormGroup>
                                </Col>
                                <Col className="btn-nuevoPasajero" lg='1' md='1' sm='1' xs='1'>
                                    <Button color="primary" onClick={this.buquedaFechaFolio}><i className="fa fa-search"/></Button>
                                </Col>
                                <Col className="btn-nuevoPasajero" lg='1' md='1' sm='1' xs='1'>
                                    <Button color="primary" onClick={this.limpiarFechaFolio}><i className="fa fa-eraser"/></Button>
                                </Col>
                            </Row>
                            <hr/>
                            <Row>
                                <Col lg='3' md='3' sm='3' xs='3'>
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
                                    <Button color="primary" onClick={this.buquedaNombre}><i className="fa fa-search"/></Button>
                                </Col>
                                <Col className="btn-nuevoPasajero" lg='1' md='1' sm='1' xs='1'>
                                    <Button color="primary" onClick={this.limpiarNombres}><i className="fa fa-eraser"/></Button>
                                </Col>
                            </Row>
                            {/** TERMINA BUSQUEDA **/}
                        </Card>
                    </Form>
                    <br/>
                    <br/>
                    <Row>
                        <Col lg='12' md='12' sm='12' xs='12'>
                            <BootstrapTable ref='table' data={ this.state.reservaciones }>
                                <TableHeaderColumn dataField='_id' isKey hidden>ID</TableHeaderColumn>
                                <TableHeaderColumn width='100' dataField='folio' >Folio</TableHeaderColumn>
                                <TableHeaderColumn width='85' dataField='asiento'>Asiento</TableHeaderColumn>
                                <TableHeaderColumn width='250' dataField='vendedor' >Vendedor</TableHeaderColumn>
                                <TableHeaderColumn width='250' dataField='cliente' >Cliente</TableHeaderColumn>
                                <TableHeaderColumn width='150' dataField='dia'>Fecha de Viaje</TableHeaderColumn>
                                <TableHeaderColumn width='150' dataField='origen' >Origen</TableHeaderColumn>
                                <TableHeaderColumn width='150' dataField='destino' >Destino</TableHeaderColumn>
                                <TableHeaderColumn width='110' dataField='razon' >Razón</TableHeaderColumn>
                                <TableHeaderColumn width='150' dataField='descuento'>Descuento</TableHeaderColumn>
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