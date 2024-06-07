import React, { Component } from 'react';
import {Button, Card, CardTitle, Container, Col, CustomInput, Form, FormGroup, Input, Label, Modal, ModalHeader, ModalBody, ModalFooter, Row, Table } from 'reactstrap';
import Select from 'react-select';

import GenerarListaDeCorte from "./listaDeCortePDF"

/* Componentes Externos */
/** Termina Componentes Externos **/

/** Variables **/
var user = null;

var idUser = null;

var egresos = [];

var dataAuxCorte, dataAuxVentasCorte;

var stateTypes = [
  'pagado',
  'no pagado'
];


export default class BoletosPagados extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuarios: [],
            opc: 'NoPagados',
            tipo: 'boletos',
            idUsuario: '',
            idUsuarioA: null,
            nombreUsuario: '',
            sucursal: '',
            municipio: '',
            tipoUsuario: '',
            ventas: [],
            totales: {},
            userType: '',
            fechaInicial: '',
            fechaFinal: '',
            statepagado: 'true',
            tipoCorte: 'corteVentas',
            modal: false,
            tipoDeCambio: 'MXN',
            egresos: []
        }

        user = this.props.match.params.id_Usuario;

        this.fetchUsuarios = this.fetchUsuarios.bind(this);
        this.handleChangeUsuario = this.handleChangeUsuario.bind(this);
        this.fetchUser = this.fetchUser.bind(this);
        this.handleChangeFechaInicial = this.handleChangeFechaInicial.bind(this);
        this.handleChangeFechaFinal = this.handleChangeFechaFinal.bind(this);
        this.buscar = this.buscar.bind(this);
        this.imprimir = this.imprimir.bind(this);
        this.getValidacionFechas = this.getValidacionFechas.bind(this);
        this.handleOnChangeStatePagado = this.handleOnChangeStatePagado.bind(this);
        this.handleOnChangeTipoCorte = this.handleOnChangeTipoCorte.bind(this);
        this.guardarEgreso = this.guardarEgreso.bind(this);
        this.toggle = this.toggle.bind(this);
        this.handleOnChangeTipoDeCambio = this.handleOnChangeTipoDeCambio.bind(this);
        this.registrarEgreso = this.registrarEgreso.bind(this);
        this.onBeforeSaveCell = this.onBeforeSaveCell.bind(this);
        this.onAfterSaveCell = this.onAfterSaveCell.bind(this);
    }

    componentDidMount(){
        //Falta que se vacien las selecciones y las variables
        this.fetchUser();
    }

    toggle() {
        this.setState(prevState => ({
          modal: !prevState.modal
        }));
    }

    handleOnChangeTipoDeCambio(e){
        this.setState({
            tipoDeCambio: e.target.value
        })
    }
    
    handleOnChangeStatePagado(e){
        this.setState({
            statepagado: e.target.value
        });
    }
    
    handleOnChangeTipoCorte(e){
        this.setState({
            tipoCorte: e.target.value
        });
    }

    guardarEgreso(){
        let stringEgresos = '';
        let totalesEgresos = {
            egresosMXN: 0,
            egresosUS: 0
        };
        for (let i = 0; i < egresos.length; i++) {
            stringEgresos += `${egresos[i].concepto} $${egresos[i].total}${egresos[i].tipoDeCambio}; `
            if(egresos[i].tipoDeCambio == 'MXN'){
                totalesEgresos.egresosMXN += parseFloat(egresos[i].total);
            }else{
                totalesEgresos.egresosUS += parseFloat(egresos[i].total);
            }
        }

        GenerarListaDeCorte(dataAuxCorte, dataAuxVentasCorte, this.state.totales, stringEgresos, totalesEgresos);
        this.toggle();
    }

    fetchUser(){
        fetch(`/api/Usuarios/${user}`)
          .then(res => res.json())
          .then(data => {
              console.log('data', data);
            this.setState({
              idUsuarioA: data[0]._id,
              idUsuario: data[0]._id,
              userType: data[0].seguridad
            });
            idUser = data[0]._id
          })
          .then(()=>{
            if(this.state.userType == 'Admin'){
              this.fetchUsuarios();
            }
          });
    }

    fetchUsuarios(){
        let usuarios = [];
        fetch(`/api/Usuarios/all/activo`)
            .then(res => res.json())
            .then(data => {
                for (let i = 0; i < data.length; i++) {
                    usuarios[i] = {
                        value: data[i]._id,
                        label: `${data[i].nombre} ${data[i].apellidoPaterno} ${data[i].apellidoMaterno}`,
                        sucursal: data[i].sucursal,
                        municipio: data[i].municipio,
                        tipoUsuario: data[i].tipoUsuario
                    }
                }
            })
            .then(() => {
                this.setState({
                usuarios: usuarios
                });
            });
    }

    handleChangeUsuario(e){
        this.setState({
            idUsuario: e.value,
            nombreUsuario: e.label,
            sucursal: e.sucursal,
            municipio: e.municipio,
            tipoUsuario: e.tipoUsuario
        })
    }

    handleChangeFechaInicial(e){
        this.setState({
            fechaInicial: e.target.value
        })
    }

    handleChangeFechaFinal(e){
        this.setState({
            fechaFinal: e.target.value
        })
    }

    getValidacionFechas(fi, ff){
        let aFecha1 = fi.split('-');
        //console.log(aFecha1, 'aFecha1');
        let aFecha2 = ff.split('-');
        //console.log(aFecha2, 'aFecha2');
        let fFecha1 = Date.UTC(aFecha1[0],aFecha1[1]-1,aFecha1[2]);
        let fFecha2 = Date.UTC(aFecha2[0],aFecha2[1]-1,aFecha2[2]);
        let dif = fFecha2 - fFecha1;
        let dias = Math.floor(dif / (1000 * 60 * 60 * 24));

        if(dif){
            if(dias>30){
                alert('Solo puedes seleccionar un rango máximo de 30 días');
                return false;
            }
        }else{
            alert('Ingrese correctamente el intervalo de fechas');
            return false;
        }

        return true;
    }

    buscar(){

        let validated = true;

        if(this.state.idUsuario == ''){
            validated = false;
        }
        if(this.state.fechaInicial == ''){
            validated = false;
        }
        if(this.state.fechaFinal == ''){
            validated = false;
        }

        if(!this.getValidacionFechas(this.state.fechaInicial, this.state.fechaFinal)){
            validated = false;
        }
        
        if(validated){
            console.log(`/api/Ventas/${this.state.idUsuario}/${this.state.fechaInicial}/${this.state.fechaFinal}/${this.state.statepagado}/${this.state.tipoCorte}`);
            fetch(`/api/Ventas/${this.state.idUsuario}/${this.state.fechaInicial}/${this.state.fechaFinal}/${this.state.statepagado}/${this.state.tipoCorte}`)
            .then(res => res.json())
            .then(data => {
                console.log('data',data);
                this.setState({
                    ventas: data.respuesta,
                    totales: data.totales
                });
            });
        }else{
            alert('Llena todos los campos correctamente');
        }
    }

    registrarEgreso(){
        let concepto, total, tipoDeCambio;
        concepto = document.getElementById("concepto").value;
        total = document.getElementById("total").value;
        tipoDeCambio = this.state.tipoDeCambio;
        egresos.push({concepto,total,tipoDeCambio});
        this.setState({
            egresos: egresos
        });
    }

    imprimir(){
        //Primero validamos que esté seleccionado algún registro
        let selectedRowKeys = this.refs.table.state.selectedRowKeys;
        console.log(selectedRowKeys);
        if(selectedRowKeys.length > 0){
            let hoy = new Date();
            let data = {
                nombreVendedor: this.state.nombreUsuario,
                sucursal: this.state.sucursal,
                municipio: this.state.municipio,
                fecha: `${hoy.getDate()}-${hoy.getMonth()+1}-${hoy.getFullYear()}`
            };
            let auxArray = this.state.ventas;
            let dataventas = [];
            for (let i = 0; i < auxArray.length; i++) {
                for (let j = 0; j < selectedRowKeys.length; j++) {
                    if(auxArray[i]._id == selectedRowKeys[j]){
                        dataventas.push(auxArray[i]);
                    }
                }
            }

            dataAuxCorte = data;
            dataAuxVentasCorte = dataventas;

            egresos = [];
            this.setState({
                egresos: []
            });


            if(confirm("¿Deseas agregar egresos?")){
                //Aqui ponemos el modal del egreso
                this.toggle();
            }else{
                GenerarListaDeCorte(data, dataventas, this.state.totales, '', {egresosMXN: 0, egresosUS: 0});
            }

        }else{
            alert('Seleccione registros para imprimir');
        }
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
        console.log('row', row);
        console.log('cellName', cellName);
        console.log('cellValue', cellValue);
    
        let estado = '';
    
        if(cellValue == 'pagado'){
          estado = 'true'
        }else{
          estado = 'false'
        }
    
        if(row.type == 'Reservaciones'){
            console.log(`/api/Reservaciones/${row._id}/${estado}/${this.state.idUsuarioA}/${cellName}/${row.pago}`);
            fetch(`/api/Reservaciones/${row._id}/${estado}/${this.state.idUsuarioA}/${cellName}/${row.pago}`, {
                method: 'PUT',
                //body: JSON.stringify(this.state),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                let botonClick = document.getElementById('btnBuscar');
                botonClick.click();
            })
            .catch(err => {
                console.log(err);
            })
        }else{
          console.log(`/api/Ventas/${row._id}/${estado}/${cellName}/${this.state.idUsuarioA}/hola`);
          fetch(`/api/Ventas/${row._id}/${estado}/${cellName}/${this.state.idUsuarioA}/hola`, {
              method: 'PUT',
              //body: JSON.stringify(this.state),
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
              }
          })
          .then(res => {
            let botonClick = document.getElementById('btnBuscar');
                botonClick.click();
          })
          .catch(err => {
            console.log(err);
            })
        }
    }

    render() {
        const selectRow = {
            mode: 'checkbox',
        };
        const cellEditProp = {
            mode: 'dbclick',
            blurToSave: true,
            beforeSaveCell: this.onBeforeSaveCell, // a hook for before saving cell
            afterSaveCell: this.onAfterSaveCell  // a hook for after saving cell
        };

        return (
            <div>
                <Container style={{ marginTop: "15px" }}>
                    <Row>
                        <Card body outline color="secondary">
                            <CardTitle className="text-center"><h3>CORTE</h3></CardTitle>
                            <br/>
                            <Row>
                                {
                                    (this.state.userType == 'Admin' || this.state.userType == 'Matriz'|| this.state.userType == 'Reservaciones')?
                                        <Col lg='4' md='4' sm='12' xs='12'>
                                            <FormGroup>
                                                <Label for="selectNoEconomico"><i className="fas fa-user"></i>{ ' Vendedor:' }</Label>
                                                <Select
                                                    id="selectNoEconomico"
                                                    onChange={this.handleChangeUsuario}
                                                    options={this.state.usuarios}
                                                    placeholder = "Selecciona..."
                                                />
                                            </FormGroup>
                                        </Col>
                                    :
                                        <Col lg='4' md='4' sm='12' xs='12'></Col>
                                }
                                <Col lg='4' md='4' sm='12' xs='12'>
                                    <FormGroup>
                                        <Label><i className="fas fa-calendar-alt"></i>{ ' Fecha de Venta Inicial:' }</Label>
                                        <Input
                                            type="date"
                                            name="fecha1"
                                            id="fecha1"
                                            placeholder="date placeholder"
                                            onChange={this.handleChangeFechaInicial}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col lg='4' md='4' sm='12' xs='12'>
                                    <FormGroup>
                                        <Label><i className="fas fa-calendar-alt"></i>{ ' Fecha de Venta Final:' }</Label>
                                        <Input
                                            type="date"
                                            name="fecha1"
                                            id="fecha1"
                                            placeholder="date placeholder"
                                            onChange={this.handleChangeFechaFinal}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg='3' md='3' sm='12' xs='12' style={{ paddingTop: '25px' }}></Col>
                                <Col lg='4' md='4' sm='12' xs='12' style={{ paddingTop: '25px' }}>
                                    <CustomInput  type="radio" id="radioPagado" name="radioPagado" value="true" label="Pagado" onChange={this.handleOnChangeStatePagado} defaultChecked/>
                                    <CustomInput type="radio" id="radioNoPagado" name="radioPagado" value="false" label="No pagado" onChange={this.handleOnChangeStatePagado}/>
                                </Col>
                                <Col className="btn-imprimir" lg='3' md='3' sm='12' xs='12'>
                                    <CustomInput  type="radio" id="radioVenta" name="radioTipoCorte" value="corteVentas" label="Venta" onChange={this.handleOnChangeTipoCorte} defaultChecked/>
                                    <CustomInput type="radio" id="radioReservacion" name="radioTipoCorte" value="corteReservacion" label="Reservación" onChange={this.handleOnChangeTipoCorte}/>
                                </Col>
                                <Col className="btn-imprimir" lg='1' md='1' sm='12' xs='12'>
                                    <button style={{display: 'inline-block'}} type="button" id="btnBuscar" onClick={this.buscar} className="btn btn-outline-primary"><i className="fas fa-search"></i></button>
                                </Col>
                                {
                                    (this.state.userType == 'Admin' || this.state.userType == 'Matriz'|| this.state.userType == 'Reservaciones')?
                                        <Col className="btn-imprimir" lg='1' md='1' sm='12' xs='12'>
                                            <button style={{display: 'inline-block'}} type="button" onClick={this.imprimir} className="btn btn-outline-primary"><i className="fas fa-print"></i></button>
                                        </Col>
                                    :
                                    <Col className="btn-imprimir" lg='1' md='1' sm='12' xs='12'></Col>
                                }
                                
                            </Row>
                        </Card>
                    </Row>
                    <Row>
                        <Col lg='12' md='12' sm='12' xs='12' style={{ marginTop: "10px" }}>
                            {
                                (this.state.userType == 'Admin')?
                                    <BootstrapTable ref='table' data={ this.state.ventas } search={ true } cellEdit={ cellEditProp } selectRow={ selectRow } pagination>
                                        <TableHeaderColumn width='200' dataField='_id' hidden isKey>Folio</TableHeaderColumn>
                                        <TableHeaderColumn width='200' dataField='type' hidden>tipo</TableHeaderColumn>
                                        <TableHeaderColumn width='200' dataField='pago' hidden>pago</TableHeaderColumn>
                                        <TableHeaderColumn width='200' dataField='folio' editable={ false } tdStyle={ { whiteSpace: 'normal' } }>Folio</TableHeaderColumn>
                                        <TableHeaderColumn width='300' dataField='cliente' editable={ false } tdStyle={ { whiteSpace: 'normal' } }>Pasajero</TableHeaderColumn>
                                        <TableHeaderColumn width='300' dataField='origen' editable={ false } tdStyle={ { whiteSpace: 'normal' } }>Origen</TableHeaderColumn>
                                        <TableHeaderColumn width='300' dataField='destino' editable={ false } tdStyle={ { whiteSpace: 'normal' } }>Destino</TableHeaderColumn>
                                        <TableHeaderColumn width='150' dataField='fecha' editable={ false } tdStyle={ { whiteSpace: 'normal' } }>Fecha de Viaje</TableHeaderColumn>
                                        <TableHeaderColumn width='150' dataField='fechaDeVenta' editable={ false } tdStyle={ { whiteSpace: 'normal' } }>Fecha de Venta</TableHeaderColumn>
                                        <TableHeaderColumn width='150' dataField='montoMXN' editable={ false } tdStyle={ { whiteSpace: 'normal' } }>Monto MXN</TableHeaderColumn>
                                        <TableHeaderColumn width='150' dataField='montoUS' editable={ false } tdStyle={ { whiteSpace: 'normal' } }>Monto US</TableHeaderColumn>
                                        <TableHeaderColumn width='200' dataField='estado' editable={ { type: 'select', options: { values: stateTypes } } }>Estado</TableHeaderColumn>
                                        <TableHeaderColumn width='200' dataField='usuario'>Modificación</TableHeaderColumn>
                                    </BootstrapTable>
                                :
                                    <BootstrapTable ref='table' data={ this.state.ventas } search={ true } cellEdit={ cellEditProp } selectRow={ selectRow } pagination>
                                        <TableHeaderColumn width='200' dataField='_id' hidden isKey>Folio</TableHeaderColumn>
                                        <TableHeaderColumn width='200' dataField='type' hidden>tipo</TableHeaderColumn>
                                        <TableHeaderColumn width='200' dataField='pago' hidden>pago</TableHeaderColumn>
                                        <TableHeaderColumn width='200' dataField='folio' editable={ false } tdStyle={ { whiteSpace: 'normal' } }>Folio</TableHeaderColumn>
                                        <TableHeaderColumn width='300' dataField='cliente' editable={ false } tdStyle={ { whiteSpace: 'normal' } }>Pasajero</TableHeaderColumn>
                                        <TableHeaderColumn width='300' dataField='origen' editable={ false } tdStyle={ { whiteSpace: 'normal' } }>Origen</TableHeaderColumn>
                                        <TableHeaderColumn width='300' dataField='destino' editable={ false } tdStyle={ { whiteSpace: 'normal' } }>Destino</TableHeaderColumn>
                                        <TableHeaderColumn width='150' dataField='fecha' editable={ false } tdStyle={ { whiteSpace: 'normal' } }>Fecha de Viaje</TableHeaderColumn>
                                        <TableHeaderColumn width='150' dataField='fechaDeVenta' editable={ false } tdStyle={ { whiteSpace: 'normal' } }>Fecha de Venta</TableHeaderColumn>
                                        <TableHeaderColumn width='150' dataField='montoMXN' editable={ false } tdStyle={ { whiteSpace: 'normal' } }>Monto MXN</TableHeaderColumn>
                                        <TableHeaderColumn width='150' dataField='montoUS' editable={ false } tdStyle={ { whiteSpace: 'normal' } }>Monto US</TableHeaderColumn>
                                        <TableHeaderColumn width='200' dataField='estado' editable={ false }>Estado</TableHeaderColumn>
                                    </BootstrapTable>
                            }
                        </Col>
                    </Row>
                    <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} backdrop="static" size="lg">
                        <ModalHeader toggle={this.toggle}>Ingresa los datos del Egreso</ModalHeader>
                        <ModalBody>
                            <Row form>
                                <Col lg={5} md={5} sm={12} xs={12}>
                                    <Label for="concepto">Concepto:</Label>
                                    <Input type="text" name="concepto" id="concepto" />
                                </Col>
                                <Col style={{ paddingTop: '25px' }} lg={2} md={2} sm={12} xs={12}>
                                    <CustomInput  type="radio" id="radioMXN" name="radioTipoDeCambio" value="MXN" label="MXN" onChange={this.handleOnChangeTipoDeCambio} defaultChecked/>
                                    <CustomInput type="radio" id="radioUS" name="radioTipoDeCambio" value="US" label="US" onChange={this.handleOnChangeTipoDeCambio}/>
                                </Col>
                                <Col lg={3} md={3} sm={12} xs={12}>
                                    <Label for="total">Total:</Label>
                                    <Input type="number" step="0.1" min="0" name="total" id="total" />
                                </Col>
                                <Col className="btn-imprimir" lg={2} md={2} sm={12} xs={12}>
                                    <button style={{display: 'inline-block'}} type="button" onClick={this.registrarEgreso} className="btn btn-outline-primary">Registrar</button>
                                </Col>
                            </Row>
                            <hr/>
                            <Row>
                                <Col lg={12} md={12} sm={12} xs={12}>
                                    <Table responsive hover>
                                        <thead>
                                            <tr>
                                                <th>Concepto</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.egresos.map((egreso, i) => 
                                            <tr key={i}>
                                                <td>{egreso.concepto}</td>
                                                <td>{`$${egreso.total}${egreso.tipoDeCambio}`}</td>
                                            </tr>)}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.guardarEgreso}>Imprimir</Button>{' '}
                            <Button color="secondary" onClick={this.toggle}>Cancelar</Button>
                        </ModalFooter>
                    </Modal>
                </Container>
            </div>
        )
    }
}