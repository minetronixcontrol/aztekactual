import React, { Component } from 'react'
import {Container, Col, Row} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import MyCustomBody from './modalsBodys/modalGeneral';

var descuentos = [];

var newDescuento = {};

const optTipoDescuento = [
    'Público',
    'Privado'
];

const columns = [
    {
        type: 'input',
        options: null,
        field: '_id',
        name: 'id',
        hiddenOnInsert: true
    },
    {
        type: 'input',
        options: null,
        field: 'desc',
        name: 'Nombre de Descuento',
        hiddenOnInsert: false
    },
    {
        type: 'input',
        options: null,
        field: 'dollarDesc',
        name: 'Descuento $US',
        hiddenOnInsert: false
    },
    {
        type: 'select',
        options: optTipoDescuento,
        field: 'tipo',
        name: 'Tipo de Descuento',
        hiddenOnInsert: false
    },
];

export default class Descuentos extends Component {
    constructor(props){
        super(props);
        this.state = {
            descuentos: []
        };

        this.onAfterDeleteRow = this.onAfterDeleteRow.bind(this);
        this.onAfterInsertRow = this.onAfterInsertRow.bind(this);
        this.createCustomModalBody = this.createCustomModalBody.bind(this);
        this.onBeforeSaveCell = this.onBeforeSaveCell.bind(this);
        this.onAfterSaveCell = this.onAfterSaveCell.bind(this);

        ///////////////////////////////////////////////////

        this.fetchDescuentos = this.fetchDescuentos.bind(this);

        //////////////////////////////////////////////CONSULTAS
        this.deleteDescuentos = this.deleteDescuentos.bind(this);
        this.saveDescuento = this.saveDescuento.bind(this);
    }

    componentDidMount(){
        this.fetchDescuentos();
    }

    fetchDescuentos(){
        fetch('/api/Descuentos/activo/true')
        .then(res => res.json())
        .then(data => {
            if(data.length > 0){
                for (let i = 0; i < data.length; i++) {
                    descuentos[i] = {
                        _id: data[i]._id,
                        desc: data[i].desc,
                        dollarDesc: data[i].dollarDesc,
                        tipo: data[i].tipo
                    };
                }
            }
        }).then(()=>{
            this.setState({
                descuentos: descuentos
            });
        })
    }

    onAfterDeleteRow(rowKeys){
        for (let i = 0; i < rowKeys.length; i++) {
            console.log(rowKeys[i]);
            this.deleteDescuentos(rowKeys[i]);
        }
        alert('Se ha borrado el descuento');
    }

    onAfterInsertRow(row){
        newDescuento = {};
        for (const prop in row) {            
            if(prop == "desc"){
                newDescuento.desc = row[prop];
            }
            if(prop == "dollarDesc"){
                newDescuento.dollarDesc = row[prop];
            }
            if(prop == "tipo"){
                newDescuento.tipo = row[prop];
            }
        }
        newDescuento.activo = 'true';
        newDescuento.id_Descuento = '0';
        this.saveDescuento(newDescuento);
    }

    createCustomModalBody(){
        return (
            <MyCustomBody 
              columns={ columns } />
        );
    }

    saveDescuento(obj){
        fetch('/api/Descuentos', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
          })
          .then(res => {
            console.log(res.json());
            this.fetchDescuentos();
          }) 
          .catch(err => {
            console.log(err);
            alert('Ha ocurrido un error, intentalo más tarde');
            this.fetchDescuentos();
          });
    }

    deleteDescuentos(id){
        fetch(`/api/Descuentos/${id}/false/activo`, {
            method: 'PUT',
            //body: JSON.stringify(this.state),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
              //console.log(res);
              this.fetchDescuentos();
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

    onAfterSaveCell(row, cellName, cellValue){
        fetch(`/api/Descuentos/${row._id}/${cellValue}/${cellName}`, {
            method: 'PUT',
            //body: JSON.stringify(this.state),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
              this.fetchSucursales();
            })
    }

    render() {
        /* Configuracion del table */
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
              //afterSearch: afterSearch,  // define a after search hook
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
                    title='Nueva Sucursal'
                    hideClose={ true }/>
                    // hideClose={ true } to hide the close button
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
                    <h3 className="text-center">Descuentos</h3>
                    <br/>
                    <Row>
                        <Col lg='12' md='12' sm='12' xs='12'>
                            <BootstrapTable  data={ this.state.descuentos } deleteRow={ true } insertRow={ true } search={ true } selectRow={ {mode: 'checkbox'} } options={ options } cellEdit={ cellEditProp } pagination>
                                <TableHeaderColumn width="50"  dataField='_id' isKey hidden>ID</TableHeaderColumn>
                                <TableHeaderColumn width='150' dataField='desc' >Nombre de Descuento</TableHeaderColumn>
                                <TableHeaderColumn width='250' dataField='dollarDesc' >Descuento $US</TableHeaderColumn>
                                <TableHeaderColumn width='250' dataField='tipo' editable={ { type: 'select', options: { values: optTipoDescuento } } }>Tipo de Descuento</TableHeaderColumn>
                            </BootstrapTable>
                        </Col>
                    </Row><br/><br/><br/>
                </Container>
            </div>
        )
    }
}