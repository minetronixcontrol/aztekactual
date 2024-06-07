import React, { Component } from 'react'
import {Container, Col, Row} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import MyCustomBody from './modalsBodys/modalGeneral';

import GenerarSucursales from "./SucursalesPDF";

var sucursales = [];

var newSucursal = {};

const optPais = ['MX', 'US'];

const optTipo = ['matriz', 'agencia'];

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
        field: 'nombre',
        name: 'Nombre',
        hiddenOnInsert: false
    },
    {
        type: 'input',
        options: null,
        field: 'direccion',
        name: 'Dirección',
        hiddenOnInsert: false
    },
    {
        type: 'input',
        options: null,
        field: 'ciudad',
        name: 'Ciudad',
        hiddenOnInsert: false
    },
    {
        type: 'input',
        options: null,
        field: 'estado',
        name: 'Estado',
        hiddenOnInsert: false
    },
    {
        type: 'select',
        options: optPais,
        field: 'pais',
        name: 'País',
        hiddenOnInsert: false
    },
    {
        type: 'input',
        options: null,
        field: 'telefono_1',
        name: 'Teléfono 1',
        hiddenOnInsert: false
    },
    {
        type: 'input',
        options: null,
        field: 'telefono_2',
        name: 'Teléfono 2',
        hiddenOnInsert: false
    },
    {
        type: 'select',
        options: optTipo,
        field: 'tipo',
        name: 'Tipo',
        hiddenOnInsert: false
    },
    {
        type: 'input',
        options: null,
        field: 'correo',
        name: 'Correo',
        hiddenOnInsert: false
    },
];

export default class ConfigurarSucursales extends Component {
    constructor(props){
        super(props);
        this.state = {
            sucursales: []
        };

        this.onBeforeSaveCell = this.onBeforeSaveCell.bind(this);
        this.onAfterSaveCell = this.onAfterSaveCell.bind(this);
        this.onAfterDeleteRow = this.onAfterDeleteRow.bind(this);
        this.onAfterInsertRow = this.onAfterInsertRow.bind(this);
        this.createCustomModalBody = this.createCustomModalBody.bind(this);

        this.fetchSucursales = this.fetchSucursales.bind(this);
        this.deleteSucursal = this.deleteSucursal.bind(this);
        this.saveNewSucursal = this.saveNewSucursal.bind(this);
        this.imprimirSeleccion = this.imprimirSeleccion.bind(this);
    }

    componentDidMount(){
        this.fetchSucursales();
    }

    fetchSucursales(){
        fetch('/api/Sucursales/all/activo/true')
        .then(res => res.json())
        .then(data => {
            if(data.length > 0){
                for (let i = 0; i < data.length; i++) {
                    sucursales[i] = {
                        _id: data[i]._id,
                        nombre: data[i].nombre,
                        direccion: data[i].direccion,
                        ciudad: data[i].ciudad,
                        estado: data[i].estado,
                        pais: data[i].pais,
                        telefono_1: data[i].telefono_1,
                        telefono_2: data[i].telefono_2,
                        tipo: data[i].tipo,
                        correo: data[i].correo,
                    };
                    
                }
            }
        }).then(()=>{
            this.setState({
                sucursales: sucursales
            });
        })
    }    

    createCustomModalBody(){
        return (
          <MyCustomBody 
            columns={ columns } />
        );
    }

    onBeforeSaveCell(row, cellName, cellValue){
        if(cellValue == '' || cellValue == null){
            alert('Por favor llena correctamente el campo');
            return false;
        }else{
            return true;
        }

        /*switch (cellName) {
            case 'nombre':
                //Verificamos que no exista ya el nombre
                alert('nombre');
                if(this.fetchNombreSucursal(cellValue)){
                    alert('Ya existe una sucursal con ese nombre');
                    return false;
                }else{
                    return true;
                }
                break;
        
            default:
                break;
        }*/
    }

    onAfterSaveCell(row, cellName, cellValue){
        //Aqui procedemos a hacer update del campo
        fetch(`/api/Sucursales/${row._id}/${cellValue}/${cellName}`, {
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

    onAfterDeleteRow(rowKeys){
        for (let i = 0; i < rowKeys.length; i++) {
            console.log(rowKeys[i]);
            this.deleteSucursal(rowKeys[i]);
        }
        alert('Se ha borrado la sucursal');
    }

    onAfterInsertRow(row){
        newSucursal = {};
        let acceso = true;
        for (const prop in row) {
            if((prop != 'telefono_2' && prop != '_id') && (row[prop] == '' || row[prop] == null)){
                acceso = false;
                alert('Falta llenar el campo '+prop);
            }
            console.log(prop, row[prop])            
            if(prop == "nombre"){                
                newSucursal.nombre = row[prop];
            }
            if(prop == "direccion"){
                newSucursal.direccion = row[prop];
            }
            if(prop == "ciudad"){
                newSucursal.ciudad = row[prop];
            }
            if(prop == "estado"){
                newSucursal.estado = row[prop];
            }
            if(prop == "pais"){
                newSucursal.pais = row[prop];
            }
            if(prop == "telefono_1"){
                newSucursal.telefono_1 = row[prop];
            }
            if(prop == "telefono_2"){
                newSucursal.telefono_2 = row[prop];
            }
            if(prop == "tipo"){
                newSucursal.tipo = row[prop];
            }
            if(prop == "correo"){
                newSucursal.correo = row[prop];
            }
        }
        if(acceso){
            newSucursal.activo = 'true';
            this.saveNewSucursal(newSucursal);
        }else{
            this.fetchSucursales();
        }
    }

    saveNewSucursal(obj){
        fetch('/api/Sucursales', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
          })
          .then(res => {
            console.log(res.json());
            this.fetchSucursales();
          }) 
          .catch(err => {
            console.log(err);
            alert('Ha ocurrido un error, intentalo más tarde');
            this.fetchSucursales();
          });
    }

    deleteSucursal(id){
        fetch(`/api/Sucursales/${id}/false/activo`, {
            method: 'PUT',
            //body: JSON.stringify(this.state),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
              //console.log(res);
              this.fetchSucursales();
            })
    }

    /*fetchNombreSucursal(nombre){
        fetch(`/api/Sucursales/nombre/${nombre}/activo/true`)
            .then(res => res.json())
            .then(data => {
                if(data.length > 0){
                    return false;
                }else{
                    return true;
                }
            });
    }*/

    imprimirSeleccion(){
        GenerarSucursales(this.state.sucursales);
    }

    render() {
        /* Configuracion del table */
        const cellEditProp = {
            mode: 'dbclick',
            blurToSave: true,
            beforeSaveCell: this.onBeforeSaveCell, // a hook for before saving cell
            afterSaveCell: this.onAfterSaveCell  // a hook for after saving cell
        };

        const selectRow = {
            mode: 'checkbox',
            showOnlySelected: true
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
            },
            showSelectedOnlyBtn: () => {
                return(
                  <ShowSelectedOnlyButton
                  showAllText='custom all'
                  showOnlySelectText='Imprimir Seleccion'
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
                            <BootstrapTable  data={ this.state.sucursales } deleteRow={ true } insertRow={ true } search={ true } selectRow={ selectRow } options={ options } cellEdit={ cellEditProp } pagination>
                                <TableHeaderColumn width="50"  dataField='_id' isKey hidden>ID</TableHeaderColumn>
                                <TableHeaderColumn width='250' dataField='nombre' >Nombre</TableHeaderColumn>
                                <TableHeaderColumn width='250' dataField='direccion' tdStyle={ { whiteSpace: 'normal' } }>Dirección</TableHeaderColumn>
                                <TableHeaderColumn width='150' dataField='ciudad' >Ciudad</TableHeaderColumn>
                                <TableHeaderColumn width='150' dataField='estado' >Estado</TableHeaderColumn>
                                <TableHeaderColumn width='150' dataField='pais' editable={ { type: 'select', options: { values: optPais } } }>Pais</TableHeaderColumn>
                                <TableHeaderColumn width='180' dataField='telefono_1'>Telefono 1</TableHeaderColumn>
                                <TableHeaderColumn width='180' dataField='telefono_2'>Telefono 2</TableHeaderColumn>
                                <TableHeaderColumn width='120' dataField='tipo' editable={ { type: 'select', options: { values: optTipo } } }>Tipo</TableHeaderColumn>
                                <TableHeaderColumn width='250' dataField='correo'>Correo</TableHeaderColumn>
                            </BootstrapTable>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}