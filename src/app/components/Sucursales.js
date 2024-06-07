import React, { Component } from 'react';
import {Container, Col, Row} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';


import GenerarSucursales from "./SucursalesPDF";

var sucursales = [];

export default class Sucursales extends Component {
    constructor(props){
        super(props);
        this.state = {
            sucursales: null
        };
        this.fetchSucursales = this.fetchSucursales.bind(this);
        this.imprimirSeleccion = this.imprimirSeleccion.bind(this);
    }
    componentDidMount(){
        this.fetchSucursales();
    }

    fetchSucursales(){
        fetch(`/api/Sucursales/true/activo`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if(data.length > 0){
                sucursales = data;
            }
        }).then(() => {
            this.setState({
                sucursales: sucursales
            });
        });
    }

    imprimirSeleccion(){
        GenerarSucursales(this.state.sucursales);
    }

    render() {
        const selectRow = {
            showOnlySelected: true
        };
        const options = {
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
                    <h3 className="text-center">Sucursales</h3>
                    <br/>
                    <Row>
                        <Col lg='12' md='12' sm='12' xs='12'>
                            <BootstrapTable  data={ this.state.sucursales } search={ true } selectRow={ selectRow } options={ options } pagination>
                                <TableHeaderColumn width="10%" dataField='_id' isKey hidden>ID</TableHeaderColumn>
                                <TableHeaderColumn dataField='nombre' tdStyle={ { whiteSpace: 'normal' } }>Nombre</TableHeaderColumn>
                                <TableHeaderColumn dataField='direccion' tdStyle={ { whiteSpace: 'normal' } }>Dirección</TableHeaderColumn>
                                <TableHeaderColumn dataField='ciudad' tdStyle={ { whiteSpace: 'normal' } }>Ciudad</TableHeaderColumn>
                                <TableHeaderColumn dataField='estado' tdStyle={ { whiteSpace: 'normal' } }>Estado</TableHeaderColumn>
                                <TableHeaderColumn dataField='pais' tdStyle={ { whiteSpace: 'normal' } }>Pais</TableHeaderColumn>
                                <TableHeaderColumn dataField='telefono_1' tdStyle={ { whiteSpace: 'normal' } }>Telefono 1</TableHeaderColumn>
                                <TableHeaderColumn dataField='telefono_2' tdStyle={ { whiteSpace: 'normal' } }>Telefono 2</TableHeaderColumn>
                                <TableHeaderColumn dataField='tipo' tdStyle={ { whiteSpace: 'normal' } }>Tipo</TableHeaderColumn>
                                <TableHeaderColumn dataField='correo' tdStyle={ { whiteSpace: 'normal' } }>Correo</TableHeaderColumn>
                            </BootstrapTable>
                        </Col>
                    </Row><br/><br/><br/>
                </Container>
            </div>
        )
    }
}