/**********
 * 
 * CORTE -> BOLETOS NO PAGADOS
 * 
 * ********/
import React, { Component } from 'react';
import {Button, Card, CardTitle, Col, Container, Label, Form, Row} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import Select from 'react-select';

var ventas = [
    {
      folio: '1',
      pasajero: 'Benito Juarez',
      destino: 'Paicoma',
      tipo: 'Adulto mayor',
      montoMXN: '$1907.00',
      montoUS: '$100.00',
      vendedor: 'Silvia',
      fechaViaje: '15/05/2019',
      pagado: 'false'
    },
    {
        folio: '2',
        pasajero: 'Benito Juarez',
        destino: 'Paicoma',
        tipo: 'Adulto mayor',
        montoMXN: '$1907.00',
        montoUS: '$100.00',
        vendedor: 'Silvia',
        fechaViaje: '15/05/2019',
        pagado: 'false'
      },
      {
        folio: '3',
        pasajero: 'Benito Juarez',
        destino: 'Paicoma',
        tipo: 'Adulto mayor',
        montoMXN: '$1907.00',
        montoUS: '$100.00',
        vendedor: 'Silvia',
        fechaViaje: '15/05/2019',
        pagado: 'false'
      }
];

  var optVendedores = [
      { value: 'Silvia', label: 'Silvia' },
      { value: 'Malena', label: 'Malena' },
      { value: 'SAndy', label: 'SAndy' }
  ];

  /****** CONFIGURACION TABLE ******/
  function onAfterDeleteRow(rowKeys) {
    alert('The rowkey you drop: ' + rowKeys);
  }

  const selectRowProp = {
    mode: 'checkbox'
  };

  const options = {
    afterDeleteRow: onAfterDeleteRow,
    deleteBtn: () => {
      return(
        <DeleteButton
        btnText='Registrar Pago'
        btnContextual='btn-danger'
        className='my-custom-class'
        btnGlyphicon='fas fa-eraser'/>
      );
    }
  };

  export default class BoletosNoPagados extends Component {
    render() {
        return (
            <div>
                <Container style={{ marginTop: "15px" }}>
                    <Form>
                        <Row>
                            <Card body outline color="secondary">
                                <CardTitle className="text-center"><h3>BOLETOS NO PAGADOS</h3></CardTitle>
                                <br/>
                                <Row>
                                    {/** Herramientas **/}
                                    <Col lg='6' md='6' sm='12' xs='12'>
                                        <Label for="selectVendedor"><i className="fas fa-user-circle"></i> Vendedor:</Label>
                                        <Select
                                            id="selectVendedor"
                                            onChange={this.handleChangeVendedor}
                                            options={optVendedores}
                                            placeholder = "Selecciona..."
                                        />
                                    </Col>
                                    <Col lg='6' md='6' sm='12' xs='12' className="text-right">
                                        <br/>
                                        <Button outline color="info"><i className="fas fa-print"/></Button>
                                    </Col>
                                </Row>
                            </Card>
                        </Row>
                        <Row>
                            <Col lg='12' md='12' sm='12' xs='12' style={{ marginTop: "10px" }}>
                                <BootstrapTable data={ ventas } deleteRow={ true } search={ true } selectRow={ selectRowProp } options={ options } pagination>
                                    <TableHeaderColumn dataField='folio' isKey>Folio</TableHeaderColumn>
                                    <TableHeaderColumn dataField='destino'>Destino</TableHeaderColumn>
                                    <TableHeaderColumn dataField='fecha'>Fecha de Viaje</TableHeaderColumn>
                                    <TableHeaderColumn dataField='montoMXN'>Monto MXN</TableHeaderColumn>
                                    <TableHeaderColumn dataField='montoUS'>Monto US</TableHeaderColumn>
                                </BootstrapTable>
                            </Col>
                        </Row>
                    </Form>
                </Container>
            </div>
        );
    }
  }