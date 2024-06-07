/**********
 * 
 * 
 * 
 * ********/

import React, { Component } from 'react';
import {Button, Card, CardTitle, Col, Container, Form, FormGroup, Input, Label, Row, Table} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import GenerarPublicidad from "./publicidadPDF";

/* Configuracion del table */

const selectRowProp = {
    mode: 'radio'
};

var idUsuario = '';

var AllData = [];

export default class configuracionDePublicidad extends Component {
    constructor(props){
        super(props);
        this.state = {
            precios: '',
            nombreSucursal: '',
            direccionSucursal: '',
            correoSucursal: '',
            telefonoSucursal: '',
            direccionMatriz: '',
            telefonoMatriz: '',
            direccionMatrizEU: '',
            telefonoMatrizEU: '',
            imagen: '',
            mensaje: ''
        };
        this.fetchAllData = this.fetchAllData.bind(this);
        this.fetchSucursal = this.fetchSucursal.bind(this);
        this.imprimirPublicidad = this.imprimirPublicidad.bind(this);
        this.obtenerID = this.obtenerID.bind(this);
        this.fetchSucursales = this.fetchSucursales.bind(this);
        this.fetchImagenPublicidad = this.fetchImagenPublicidad.bind(this);
        this.onChangeMensaje = this.onChangeMensaje.bind(this);
        idUsuario = this.props.match.params.id_Usuario;
    }

    componentDidMount(){
        this.fetchAllData();
        this.fetchSucursal();
        this.fetchImagenPublicidad();
        this.fetchSucursales('MX');
        this.fetchSucursales('US');
    }

    onChangeMensaje(e){
        this.setState({
            mensaje: e.target.value
        });
    }

    fetchImagenPublicidad(){
        fetch(`/api/ImagenesBoletos/Publicidad`)
        .then(res => res.json())
        .then(data => {
            if(data.length > 0){
                this.setState({
                    imagen: data[0].imagen
                });
            }
        })
      }

    fetchSucursales(pais){
        let direccion = '';
        let telefono = '';
        fetch(`/api/Sucursales/${pais}/matriz`)
          .then(res => res.json())
          .then(data => {
              direccion = data[0].direccion+" "+data[0].ciudad+", "+data[0].estado+", "+data[0].pais;
              telefono =  data[0].telefono_1+"   "+data[0].telefono_2;
              if(pais == 'MX'){
                this.setState({
                  direccionMatriz: direccion,
                  telefonoMatriz: telefono
                });
              }else{
                this.setState({
                  direccionMatrizEU: direccion,
                  telefonoMatrizEU: telefono
                });
              }
          });  
    }

    fetchAllData(){
        fetch(`/api/Precios/AllData`)
        .then(res => res.json())
        .then(data => {
            AllData = data;
            //console.log('AllData', data);
            this.setState({
                precios: data
            });
        });
    }

    fetchSucursal(){
        console.log(idUsuario);
        fetch(`/api/Usuarios/${idUsuario}/sucursal`)//Realmente lo que envia es el username
        .then(res => res.json())
        .then(data => {
            this.setState({
                nombreSucursal: data.nombre,
                direccionSucursal: data.direccion,
                correoSucursal: data.correo,
                telefonoSucursal: data.telefono_1
            });
        });
    }

    imprimirPublicidad(){
        try {
            let id = this.obtenerID();
            let dataPublicidad = {};
            console.log(id);
            for (let i = 0; i < AllData.length; i++) {
                if(AllData[i]._id == id){
                    dataPublicidad = {
                        'origenMunicipio': AllData[i].municipioOrigen,
                        'origenEstado': AllData[i].estadoOrigen,
                        'destino': AllData[i].municipioDestino,
                        'destinoEstado': AllData[i].estadoDestino,
                        'precio': AllData[i].precio,
                        'precioMX': AllData[i].precioMX,
                        'salida': AllData[i].HoraSalida,
                        'direccionSalida': AllData[i].direccionSalida,
                        'telefonoSucursal': this.state.telefonoSucursal,
                        'correo': this.state.correoSucursal,
                        'direccionMatrizMX': this.state.direccionMatriz,
                        'tel1MX': this.state.telefonoMatriz,
                        'direccionMatrizUS': this.state.direccionMatrizEU,
                        'tel1US': this.state.telefonoMatrizEU,
                        'imagen': this.state.imagen,
                        'mensaje': this.state.mensaje
                    }
                    //console.log(dataPublicidad);
                    GenerarPublicidad(dataPublicidad);
                    break;
                }
            }
        } catch (error) {
            console.log(error);
            alert('Selecciona un precio para imprimir');
        }
    }

    obtenerID(){
        let parent = document.querySelector('input[type="radio"]:checked').parentNode;
        let next = parent.nextSibling;
        let id = next.firstChild;

        return id['wholeText'];
    }

    priceFormatter(cell, row) {
        //console.log(row.tipoDeCambio);
        return '<span class="badge badge-primary">US</span> $'+cell;
    }

    priceFormatterMX(cell, row){
        return '<span class="badge badge-danger">MX</span> $'+cell;
    }

    render() {
        return (
            <div>
                <Container style={{ marginTop: "15px" }}>
                    <Form>
                        <Card body outline color="secondary">
                            <CardTitle className="text-center"><h3>Imprimir Precio</h3></CardTitle>
                            <br/>
                            <Row>
                                <Col lg='4' md='4' sm='12' xs='12' className='text-center'>
                                    <Button outline color="info" onClick={this.imprimirPublicidad}><i className="fas fa-print"></i></Button>
                                </Col>
                                <Col lg='8' md='8' sm='12' xs='12'>
                                    <Table responsive borderless>
                                        <tbody>
                                            <tr>
                                                <th scope="row">{this.state.nombreSucursal}</th>
                                                <td><i className="fas fa-map-marker-alt"></i>{' '+this.state.direccionSucursal}</td>
                                                
                                            </tr>
                                            <tr>
                                                <td><i className="fas fa-envelope"></i>{' '+this.state.correoSucursal}</td>
                                                <td><i className="fas fa-phone"></i>{' '+this.state.telefonoSucursal}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={{ size: 6, offset: 3 }} lg={{ size: 6, offset: 3 }} sm='12' xs='12'>
                                    <FormGroup>
                                        <Label for="exampleText">Mensaje a imprimir:</Label>
                                        <Input type="textarea" name="mensaje" id="mensajeTxt" value={this.state.mensaje} onChange={this.onChangeMensaje} />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Card>
                    </Form>
                    <br/>
                    <br/>
                    <Row>
                        <Col lg='12' md='12' sm='12' xs='12'>
                            <BootstrapTable data={ this.state.precios } selectRow={ selectRowProp } search={ true }>
                                <TableHeaderColumn dataField='_id' isKey hidden>ID</TableHeaderColumn>
                                <TableHeaderColumn dataField='origen'>Origen</TableHeaderColumn>
                                <TableHeaderColumn dataField='destino'>Destino</TableHeaderColumn>
                                <TableHeaderColumn dataField='precio' dataFormat={ this.priceFormatter } >Precio US</TableHeaderColumn>
                                <TableHeaderColumn dataField='precioMX' dataFormat={ this.priceFormatterMX } >Precio MX</TableHeaderColumn>
                                <TableHeaderColumn dataField='HoraSalida'>Hora de Salida</TableHeaderColumn>
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
