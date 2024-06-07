import React, { Component } from 'react';
import {Container, Col, Row} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import MyCustomBody from './ModalBodyUsuarios.js'

import GenerarUsuarios from "./UsuariosPDF";

var newUsuario = {
  id_Usuario: '0',
  nickname: null,
  password: null,
  nombre: null,
  apellidoMaterno: null,
  apellidoPaterno: '',
  sucursal: null,
  telefono: null,
  comision: null,
  seguridad: null,
  activo: 'true',
  tipoDescuento: null,
  prefijoFolio: null,
  noFolio: '0',
}

var users = [];

var optSucursales = [];

var optSucursalesIDs = [];

const columns = [
  {
    type: 'input',
    options: null,
    defaultValue: null,
    field: '_id',
    name: 'id',
    hiddenOnInsert: true
  },
  {
    type: 'input',
    options: null,
    defaultValue: null,
    field: 'nickname',
    name: 'Nombre de Usuario',
    hiddenOnInsert: false
  },
  {
    type: 'input',
    options: null,
    defaultValue: null,
    field: 'password',
    name: 'Contraseña',
    hiddenOnInsert: false
  },
  {
    type: 'input',
    options: null,
    defaultValue: null,
    field: 'nombre',
    name: 'Nombre',
    hiddenOnInsert: false
  },
  {
    type: 'input',
    options: null,
    defaultValue: null,
    field: 'apellidoPaterno',
    name: 'Apellido Paterno',
    hiddenOnInsert: false
  },
  {
    type: 'input',
    options: null,
    defaultValue: null,
    field: 'apellidoMaterno',
    name: 'Apellido Materno',
    hiddenOnInsert: false
  },
  {
    type: 'input',
    options: null,
    defaultValue: null,
    field: 'telefono',
    name: 'Telefono',
    hiddenOnInsert: false
  },
  {
    type: 'select',
    options: 'sucursales',
    defaultValue: null,
    field: 'sucursal',
    name: 'Sucursal',
    hiddenOnInsert: false
  },
  {
    type: 'select',
    options: null,
    defaultValue: null,
    field: 'seguridad',
    name: 'Tipo',
    hiddenOnInsert: false
  },
  {
    type: 'input',
    options: null,
    defaultValue: null,
    field: 'comision',
    name: 'Comisión',
    hiddenOnInsert: false
  },
  {
    type: 'select',
    options: null,
    defaultValue: null,
    field: 'tipoDescuento',
    name: 'Descuentos',
    hiddenOnInsert: false
  },
  {
    type: 'input',
    options: null,
    defaultValue: null,
    field: 'prefijoFolio',
    name: 'Folio',
    hiddenOnInsert: false
  },
];

export default class Usuarios extends Component {
  constructor(props){
    super(props);
    this.state = {
      usuarios: [],
      sucursales: [],
      sucursalesIDs: [],
      sucursalesAll: [],
      usuariosTipos: ['Ventas','Viajes','Matriz', 'Reservaciones', 'Cancelaciones', 'Admin'],
      descuentosTipos: ['Público', 'Privado', 'Ninguno'],
    };
    this.fetchUsuarios = this.fetchUsuarios.bind(this);
    this.fetchSucursales = this.fetchSucursales.bind(this);
    this.getSucursal = this.getSucursal.bind(this);  
    this.getIdSucursal = this.getIdSucursal.bind(this);
    this.fetchUsuario = this.fetchUsuario.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    //Funcionamiento de la tabla
    //this.createCustomModalFooter = this.createCustomModalFooter.bind(this);
    this.onAfterInsertRow = this.onAfterInsertRow.bind(this);
    this.createCustomModalBody = this.createCustomModalBody.bind(this);
    //this.beforeSave = this.beforeSave.bind(this);
    this.saveUser = this.saveUser.bind(this);

    /////Editar celdas
    this.onAfterSaveCell = this.onAfterSaveCell.bind(this);
    this.onBeforeSaveCell = this.onBeforeSaveCell.bind(this);
    this.onAfterDeleteRow = this.onAfterDeleteRow.bind(this);
    this.imprimirSeleccion = this.imprimirSeleccion.bind(this);
  }

  componentDidMount(){
    this.fetchSucursales();
  }

  fetchSucursales(){
    fetch('/api/Sucursales/')
      .then(res => res.json())
      .then(data => {
          //console.log('Sucursales', data);
          if(data.length > 0){
            //console.log('origen');
            for(let i = 0; i < data.length; i++){
              optSucursales[i] = data[i].nombre;
              optSucursalesIDs[i] = data[i]._id;
            }
            this.setState({
              sucursales: optSucursales,
              sucursalesIDs: optSucursalesIDs,
              sucursalesAll: data
            })
          }
          //console.log('sucursales', optSucursales);
          //console.log('ids sucursales', optSucursalesIDs);
      })
      .then(() => {
        this.fetchUsuarios();
      });
  }

  fetchUsuarios(){
    fetch('/api/Usuarios/')
      .then(res => res.json())
      .then(data => {
          if(data.length > 0){            
            for(let i = 0; i < data.length; i++){
                users[i] = { 
                  _id: data[i]._id,
                  nickname: data[i].nickname,
                  password: data[i].password,
                  nombre: data[i].nombre,
                  apellidoPaterno: data[i].apellidoPaterno,
                  apellidoMaterno: data[i].apellidoMaterno,
                  telefono: data[i].telefono,
                  sucursal: this.getSucursal(data[i].sucursal),
                  seguridad: data[i].seguridad,
                  comision: data[i].comision,
                  tipoDescuento: data[i].tipoDescuento,
                  prefijoFolio: data[i].prefijoFolio
                };
            }
            this.setState({
              usuarios: users
            })
          }
      });
  }

  getSucursal(idSucursal){
    let i = optSucursalesIDs.indexOf(idSucursal+'');
    return optSucursales[i];
  }

  getIdSucursal(nombreSucursal){
    let i = optSucursales.indexOf(nombreSucursal+'');
    return optSucursalesIDs[i];
  }

  saveUser(newUsuario){
    fetch('/api/Usuarios', {
      method: 'POST',
      body: JSON.stringify(newUsuario),
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }
    })
      .then(res => {
        console.log(res.json());
        this.fetchUsuarios()
      }) //Convierte la respouesta del servidor a formato json para poder mostrarla
      .catch(err => console.log(err));
  }

  updateUser(row, cellName, cellValue){
    let newValue;

    if(cellName == 'sucursal'){
      newValue = cellValue;
    }else{
      newValue = row[cellName];
    }
    

    fetch(`/api/Usuarios/${row._id}/${newValue}/${cellName}`, {
        method: 'PUT',
        //body: JSON.stringify(this.state),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(res => {
          console.log(res);
        })
  }

  deleteUser(id){
    fetch(`/api/Usuarios/${id}/false/activo`, {
        method: 'PUT',
        //body: JSON.stringify(this.state),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(res => {
          console.log(res);
        })
  }

  //Funcionamiento de la tabla
  onAfterDeleteRow(rowKeys) {
    for (let i = 0; i < rowKeys.length; i++) {
      console.log(rowKeys[i]);
      this.deleteUser(rowKeys[i]);
    }
    alert('Se ha borrado el usuario');
  }

  onAfterInsertRow(row) {
    newUsuario = {};
    let acceso = true;
    for (const prop in row) {
      if((prop != 'apellidoMaterno' && prop != '_id') && (row[prop] == '' || row[prop] == null)){
        acceso = false;
        alert('Falta llenar el campo '+prop);
      }
      if(prop == "nickname"){
        newUsuario.nickname = row[prop];
      }
      if(prop == "password"){
        newUsuario.password = row[prop];
      }
      if(prop == "nombre"){
        newUsuario.nombre = row[prop];
      }
      if(prop == "apellidoPaterno"){
        newUsuario.apellidoPaterno = row[prop];
      }
      if(prop == "apellidoMaterno"){
        if(row[prop] == '' || row[prop] == null){
          newUsuario.apellidoMaterno = " ";
        }else{
          newUsuario.apellidoMaterno = row[prop];
        }
      }
      if(prop == "sucursal"){
        newUsuario.sucursal = row[prop];
      }
      if(prop == "telefono"){
        newUsuario.telefono = row[prop];
      }
      if(prop == "comision"){
        newUsuario.comision = row[prop];
      }
      if(prop == "seguridad"){
        newUsuario.seguridad = row[prop];
      }
      if(prop == "tipoDescuento"){
        newUsuario.tipoDescuento = row[prop];
      }
      if(prop == "prefijoFolio"){
        newUsuario.prefijoFolio = row[prop];
      }
    }
    if(acceso){
      newUsuario.activo = 'true';
      newUsuario.id_Usuario = '0';
      newUsuario.noFolio = '0';
        this.saveUser(newUsuario);
    }else{
        this.fetchSucursales();
    }
  }

  onAfterSaveCell(row, cellName, cellValue) {
    if(cellName == 'sucursal'){
      this.updateUser(row, cellName, this.getIdSucursal(cellValue));
    }else{
      this.updateUser(row, cellName, cellValue);
    }
    alert(`Se han guardado sus cambios`);    
  }

  onBeforeSaveCell(row, cellName, cellValue) {
    if(cellName != 'ApellidoMaterno' && (cellValue == '' || cellValue == null)){
      alert('Por favor llena correctamente el campo');
      return false;
    }
    switch (cellName) {
      case 'nickname':
        //Comprobamos que no exista ya ese nickname
        if(this.fetchUsuario(cellValue)){
          alert('Ya existe un usuario con ese nickname');
          return false
        }else{
          if(confirm("En verdad deseas modificar el campo?")){
            return true;
          }else{
            return false;
          }
        }
        break;
      case 'prefijoFolio':
        //Comprobamos que no exista ya ese nickname
        if(this.fetchFolio(cellValue)){
          alert('Ya existe un usuario con ese folio');
          return false
        }else{
          if(confirm("En verdad deseas modificar el campo?")){
            return true;
          }else{
            return false;
          }
        }
        break;
      case 'seguridad':
        //Comprobamos que no sea el admin
        if(row.seguridad == 'Admin'){
          alert('No puedes modificar éste campo!!');
          return false
        }else{
          if(confirm("En verdad deseas modificar el campo?")){
            return true;
          }else{
            return false;
          }
        }
        break;
      default:
          if(confirm("En verdad deseas modificar el campo?")){
            return true;
          }else{
            return false;
          }
        break;
    }
  }

  fetchFolio(folio){
    //console.table(users);
    for (let i = 0; i < users.length; i++) {
      if(users[i].prefijoFolio == folio){
        return true
      }
    }
    return false;
  }

  fetchUsuario(nickname){
    for (let i = 0; i < users.length; i++) {
      if(users[i].nickname == nickname){
        return true
      }
    }
    return false;
  }  

  createCustomModalBody(){
    return (
      <MyCustomBody 
        columns={ columns } 
        sucursales={this.state.sucursalesAll} 
        //usuariosTipos={this.state.usuariosTipos}
        /*descuentosTipos={this.state.descuentosTipos}*//>
    );
  }

  imprimirSeleccion(){
    GenerarUsuarios(this.state.usuarios);
  }

  render() {
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
            title='Nuevo Usuario'
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
          <h3 className="text-center">USUARIOS</h3>
          <br/>
          <Row>
            <Col lg='12' md='12' sm='12' xs='12'>
              <BootstrapTable data={ this.state.usuarios } deleteRow={ true } insertRow={ true } search={ true } cellEdit={ cellEditProp } selectRow={ selectRow } options={ options } pagination>
                  <TableHeaderColumn width="50"  dataField='_id' isKey hidden>ID</TableHeaderColumn>
                  <TableHeaderColumn width="200" dataField='nickname' tdStyle={ { whiteSpace: 'normal' } }>Nombre de Usuario</TableHeaderColumn>
                  <TableHeaderColumn width="200" dataField='password' tdStyle={ { whiteSpace: 'normal' } }>Contraseña</TableHeaderColumn>
                  <TableHeaderColumn width="250" dataField='nombre' tdStyle={ { whiteSpace: 'normal' } }>Nombre</TableHeaderColumn>
                  <TableHeaderColumn width="250" dataField='apellidoPaterno' tdStyle={ { whiteSpace: 'normal' } }>Apellido Paterno</TableHeaderColumn>
                  <TableHeaderColumn width="250" dataField='apellidoMaterno' tdStyle={ { whiteSpace: 'normal' } }>Apellido Materno</TableHeaderColumn>
                  <TableHeaderColumn width="150" dataField='telefono' tdStyle={ { whiteSpace: 'normal' } } tdStyle={ { whiteSpace: 'normal' } }>Telefono</TableHeaderColumn>
                  <TableHeaderColumn width="300" dataField='sucursal' editable={ { type: 'select', options: { values: this.state.sucursales } } } tdStyle={ { whiteSpace: 'normal' } }>Sucursal</TableHeaderColumn>
                  <TableHeaderColumn width="200" dataField='seguridad' editable={ { type: 'select', options: { values: this.state.usuariosTipos } } } tdStyle={ { whiteSpace: 'normal' } }>Tipo</TableHeaderColumn>                  
                  <TableHeaderColumn width="100" dataField='comision' tdStyle={ { whiteSpace: 'normal' } }>Comision</TableHeaderColumn>
                  <TableHeaderColumn width="150" dataField='tipoDescuento' editable={ { type: 'select', options: { values: this.state.descuentosTipos } } } tdStyle={ { whiteSpace: 'normal' } }>Descuentos</TableHeaderColumn>
                  <TableHeaderColumn width="100" dataField='prefijoFolio' tdStyle={ { whiteSpace: 'normal' } }>Folio</TableHeaderColumn>
              </BootstrapTable>
            </Col>
          </Row><br/><br/><br/>
        </Container>
      </div>
    )
  }
}
