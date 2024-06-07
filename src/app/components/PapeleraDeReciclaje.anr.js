import React, { Component } from 'react';
import {Col, Container, Form, Row} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';


/***** STYLES ******/
import "../css/viajes.css";

/***** Variables ******/

var elementosBorrados = [
    {
        id: '1',
        seccion: 'Ver',
        tipo: 'Clientes',
        dato: 'Sandra Adriana Enciso Rios',
        fecha: '11/06/2019'
    },
    {
        id: '2',
        seccion: 'Ver',
        tipo: 'Origenes y Destinos',
        dato: 'Jerez de García Salinas',
        fecha: '11/06/2019'
    },
    {
        id: '1',
        seccion: 'Opciones',
        tipo: 'Usuarios',
        dato: 'Jorge Alberto Rodríguez Euan',
        fecha: '11/06/2019'
    }
]

/***** FIN Variables ******/

/***** Config Tabla ******/

const options = {
    //afterSearch: afterSearch,  // define a after search hook
    deleteBtn: () => {
        return(
          <DeleteButton
          btnText='Restaurar'
          btnContextual='btn-danger'
          className='my-custom-class'
          btnGlyphicon='fas fa-trash-alt'/>
        );
    }    
};

/***** Fin Config Tabla ******/

export default class papeleraDeReciclaje extends Component {
    render() {
        return (
            <div>
                    <Container style={{ marginTop: "15px" }}>
                    <h3 className="text-center">Papelera de Reciclaje</h3>
                    <br/>
                    <Row>
                        <Col lg='12' md='12' sm='12' xs='12'>
                            <BootstrapTable  data={ elementosBorrados } selectRow={ {mode: 'checkbox'} } deleteRow={ true } search={ true } options={ options } pagination>
                                <TableHeaderColumn width="10%" dataField='id' isKey>ID</TableHeaderColumn>
                                <TableHeaderColumn dataField='seccion'>Sección</TableHeaderColumn>
                                <TableHeaderColumn dataField='tipo'>Tipo</TableHeaderColumn>
                                <TableHeaderColumn dataField='dato'>Dato</TableHeaderColumn>
                                <TableHeaderColumn dataField='fecha'>Fecha de eliminación</TableHeaderColumn>
                            </BootstrapTable>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}
