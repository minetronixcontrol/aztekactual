import React, { Component } from 'react';
import {Container, Col, Row} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

const status = [
    'Aprobado',
    'No aprobado'
];

var solicitudes = [];

export default class SolicitudDescuentos extends Component {
    constructor(props){
        super(props);
        this.state = {
            solicitudes: []
        };

        this.fetchSolicitudes = this.fetchSolicitudes.bind(this);
        this.deleteSolicitud = this.deleteSolicitud.bind(this);

        this.onBeforeSaveCell = this.onBeforeSaveCell.bind(this);
        this.onAfterSaveCell = this.onAfterSaveCell.bind(this);
        this.onAfterDeleteRow = this.onAfterDeleteRow.bind(this);
    }

    componentDidMount(){
        this.fetchSolicitudes();
    }
    
    fetchSolicitudes(){
        fetch(`/api/DescuentoFamiliar/true/activo`)
        .then(res => res.json())
        .then(data => {
            solicitudes = data;
            this.setState({
                solicitudes: data
            })
        })
    }

    deleteSolicitud(id){
        fetch(`/api/DescuentoFamiliar/${id}/false/activo`, {
            method: 'PUT',
            //body: JSON.stringify(this.state),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                //console.log(res);
                this.fetchSolicitudes();
            })
      }

    onAfterDeleteRow(rowKeys){
        for (let i = 0; i < rowKeys.length; i++) {
          console.log(rowKeys[i]);
          this.deleteSolicitud(rowKeys[i]);
        }
        alert('Se ha borrado la solicitud');
    }

    onAfterSaveCell(row, cellName, cellValue){
        fetch(`/api/DescuentoFamiliar/${row._id}/${cellValue}/${cellName}`, {
            method: 'PUT',
            //body: JSON.stringify(this.state),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
              this.fetchSolicitudes();
            })
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

    render() {
        const cellEditProp = {
            mode: 'dbclick',
            blurToSave: true,
            beforeSaveCell: this.onBeforeSaveCell, // a hook for before saving cell
            afterSaveCell: this.onAfterSaveCell  // a hook for after saving cell
        };

        const options = {
            afterDeleteRow: this.onAfterDeleteRow,
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
                    <h3 className="text-center">SOLICITUDES DE DESCUENTO FAMILIAR</h3>
                    <br/>
                    <Row>
                        <Col lg='12' md='12' sm='12' xs='12'>
                            <BootstrapTable data={ this.state.solicitudes } deleteRow={ true } search={ true } selectRow={ {mode: 'checkbox'} } cellEdit={ cellEditProp } options={ options } pagination>
                                <TableHeaderColumn width='110' dataField='_id' isKey hidden>ID</TableHeaderColumn>
                                <TableHeaderColumn width='110' dataField='usuario' editable={false}>Comisionista</TableHeaderColumn>
                                <TableHeaderColumn width='200' dataField='familia' tdStyle={ { whiteSpace: 'normal' } } editable={false}>Clientes</TableHeaderColumn>
                                <TableHeaderColumn width='90' dataField='fechaDeCompra' editable={false}>Fecha de compra</TableHeaderColumn>
                                <TableHeaderColumn width='90' dataField='status' editable={ { type: 'select', options: { values: status } } }>Status</TableHeaderColumn>
                            </BootstrapTable>
                        </Col>
                    </Row><br/><br/><br/>
                </Container>
            </div>
        )
    }
}
