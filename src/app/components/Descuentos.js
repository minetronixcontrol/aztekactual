import React, { Component } from 'react'
import {Button, Container, FormGroup, Col, Modal, Label, Input, ModalHeader, ModalBody, ModalFooter, Table, Row} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import MyCustomBody from './modalsBodys/modalGeneral';

var descuentos = [];

var usuarios = [];

var newDescuento = {};

export default class Descuentos extends Component {
    constructor(props){
        super(props);
        this.state = {
            descuentos: [],
            optDescuentos: [],
            usuarios: [],
            idUsuario: '',
            usuario: '',
            descuento: '',
            modal: false,
            modalDesc: false,
            modalGeneral1: false,
            modalGeneral2: false,
            nombreDescuento: '',
            dollarDesc: '',
            detalle: '',
            defaultDescuento: [],
            fechaInicial: '',
            fechaFinal: ''
        };

        this.fetchDescuentos = this.fetchDescuentos.bind(this);
        this.handleOnChangeDollarDesc = this.handleOnChangeDollarDesc.bind(this);
        this.handleChangeDescuentos = this.handleChangeDescuentos.bind(this);
        this.handleChangeFechaInicial = this.handleChangeFechaInicial.bind(this);
        this.handleChangeFechaFinal = this.handleChangeFechaFinal.bind(this);
        this.modificarDescuento = this.modificarDescuento.bind(this);
        this.modificarDescuentoGeneral = this.modificarDescuentoGeneral.bind(this);

        this.editDescUser = this.editDescUser.bind(this);
        this.toggle = this.toggle.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.toggleModalGeneral1 = this.toggleModalGeneral1.bind(this);
        this.toggleModalGeneral2 = this.toggleModalGeneral2.bind(this);

        this.onAfterDeleteRow = this.onAfterDeleteRow.bind(this);
        this.deleteDescuento = this.deleteDescuento.bind(this);

        this.rowClassNameFormat = this.rowClassNameFormat.bind(this);
    }

    componentDidMount(){
        this.fetchDescuentos();
        this.fetchUsuarios();
    }

    fetchDescuentos(){
        let optDescuentos = [];
        fetch(`/api/DescuentosNuevo/true/activo`)
        .then(res => res.json())
        .then(data => {
            descuentos = data;
            this.setState({
                descuentos: data,
            });
            for (let i = 0; i < data.length; i++) {
                optDescuentos.push({
                    value: data[i]._id,
                    label: data[i].nombre,
                });
            }
        })
        .then(() => {
            this.setState({
                optDescuentos: optDescuentos
            })
        })
    }

    fetchUsuarios(){
        fetch(`/api/Usuarios/c/descuentos`)
        .then(res => res.json())
        .then(data => {
            usuarios = data;
            this.setState({
                usuarios: data,
            });
        })
    }

    editDescUser(){
        let selectDescuentos = document.getElementById('selectDescuentos');
        let newDescuentos = []
        for (let i = 0; i < selectDescuentos.options.length; i++) {
            if(selectDescuentos.options[i].selected === true){
                newDescuentos.push(selectDescuentos.options[i].value);
            }
        }
        console.log('Nuevos descuentos',newDescuentos);

        fetch(`/api/Usuarios/${this.state.idUsuario}/descuentos`, {
                method: 'PUT',
                body: JSON.stringify(newDescuentos),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                this.fetchUsuarios();
                this.setState(prevState => ({
                modal: !prevState.modal
                }));
            });
    }

    handleChangeDescuentos(){
        
    }

    handleOnChangeDollarDesc(e){
        console.log(e.target.value);
        this.setState({
            dollarDesc: e.target.value
        });
    }

    handleChangeFechaInicial(e){
        this.setState({
            fechaInicial: e.target.value
        });
    }

    handleChangeFechaFinal(e){
        this.setState({
            fechaFinal: e.target.value
        });
    }

    modificarDescuento(){
        fetch(`/api/DescuentosNuevo/${this.state.descuento}/${this.state.dollarDesc}/dollarDesc`, {
            method: 'PUT',
            //body: JSON.stringify(''),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            this.fetchDescuentos();
            this.setState(prevState => ({
                modalDesc: !prevState.modalDesc
            }));
        });
    }

    onAfterDeleteRow(rowKeys){
        for (let i = 0; i < rowKeys.length; i++) {
          console.log(rowKeys[i]);
          this.deleteDescuento(rowKeys[i]);
        }
    }

    deleteDescuento(id){
        fetch(`/api/DescuentosNuevo/${id}/false/activo`, {
            method: 'PUT',
            //body: JSON.stringify(''),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            this.fetchDescuentos();
        })
        .catch(error => {
            alert('Ha ocurrido un error, por favor intenta mas tarde');
        })
    }

    toggleModalGeneral1(){
        this.setState(prevState => ({
            modalGeneral1: !prevState.modalGeneral1
        }));
    }

    toggleModalGeneral2(){
        this.setState(prevState => ({
            modalGeneral2: !prevState.modalGeneral2
        }));
    }


    modificarDescuentoGeneral(e){
        let modal = e.target.name;
        fetch(`/api/DescuentosNuevo/${this.state.descuento}/${this.state.dollarDesc}/fechas`, {
            method: 'PUT',
            body: JSON.stringify(this.state),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if(modal == 'DescuentoGeneral1'){
                this.toggleModalGeneral1();
            }else{
                this.toggleModalGeneral2();
            }
            this.fetchDescuentos();            
        });
    }

    //Toggle modal usuarios
    toggle(e){
        let selectedRows = this.refs.tableUsers.state.selectedRowKeys;
        //console.log(selectedRows[0]);
        for (let i = 0; i < usuarios.length; i++) {
            if(usuarios[i]._id == selectedRows[0]){
                console.log(usuarios[i]);
                console.log('descuentos',usuarios[i].descuentos);
                this.setState(prevState => ({
                    idUsuario: usuarios[i]._id,
                    defaultDescuento: usuarios[i].descuentos,
                    usuario: usuarios[i].nombre,
                    modal: !prevState.modal
                }));
            }
        }
    }

    //Modals de descuentos
    toggleModal(e){

        let selectedRows = this.refs.descuentos.state.selectedRowKeys;
        this.setState({
            descuento: selectedRows[0]
        });
        console.log('selectedRows',selectedRows);
        console.log('descuentos',descuentos);

        for (let i = 0; i < descuentos.length; i++) {
            if(descuentos[i]._id == selectedRows[0]){
                console.log(descuentos[i]);
                if(descuentos[i].nombre == 'Promoción General 1'){
                    this.setState(prevState => ({
                        nombreDescuento: descuentos[i].nombre,
                        dollarDesc: descuentos[i].dollarDesc,
                        detalle: descuentos[i].detalle,
                        modalGeneral1: !prevState.modalGeneral1,
                        fechaInicial: descuentos[i].fechaInicio,
                        fechaFinal: descuentos[i].fechaFinal,
                    }));
                }else if(descuentos[i].nombre == 'Promoción General 2'){
                    this.setState(prevState => ({
                        nombreDescuento: descuentos[i].nombre,
                        dollarDesc: descuentos[i].dollarDesc,
                        detalle: descuentos[i].detalle,
                        modalGeneral2: !prevState.modalGeneral2,
                        fechaInicial: descuentos[i].fechaInicio,
                        fechaFinal: descuentos[i].fechaFinal,
                    }));
                }else{
                    this.setState(prevState => ({
                        nombreDescuento: descuentos[i].nombre,
                        dollarDesc: descuentos[i].dollarDesc,
                        detalle: descuentos[i].detalle,
                        modalDesc: !prevState.modalDesc
                    }));
                }
            }
        }
    }

  
    rowClassNameFormat(row, rowIdx){
        return (row.activo)? '' : 'desactivado';
    }

    render() {
        /* Configuracion del table */
        const options = {
            afterDeleteRow: this.onAfterDeleteRow,
            //afterInsertRow: this.onAfterInsertRow,
           // insertModalBody: this.createCustomModalBody,
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
                    title='Nuevo Descuento'
                    hideClose={ true }/>
                    // hideClose={ true } to hide the close button
                );
            },
            deleteBtn: () => {
                return(
                  <DeleteButton
                  btnText='Pausar/Continuar'
                  btnContextual='btn-danger'
                  className='my-custom-class'
                  btnGlyphicon='fas fa-play'/>
                );
            },
            exportCSVBtn: () => {
                return(
                  <ExportCSVButton
                  btnText='Editar'
                  btnContextual='btn-warning'
                  btnGlyphicon='fas fa-pencil-alt'
                  onClick={ (e) => this.toggleModal(e) }/>
                );
            },
        };
        const optionsUsuario = {
            insertModalFooter: () => {
                return (
                  <InsertModalFooter
                    saveBtnText='Guardar'
                    closeBtnText='Cancelar'/>
                );
            },
              //afterSearch: afterSearch,  // define a after search hook
            exportCSVBtn: () => {
                return(
                  <ExportCSVButton
                  btnText='Editar'
                  btnContextual='btn-warning'
                  btnGlyphicon='fas fa-pencil-alt'
                  onClick={ (e) => this.toggle(e) }/>
                );
            },
        };
        return (
            <div>
                <Container style={{ marginTop: "15px" }}>
                    <h3 className="text-center">Descuentos</h3>
                    <br/>
                    <Row>
                        <Col  lg='12' md='12' sm='12' xs='12'>
                            <BootstrapTable ref='descuentos' exportCSV  data={ this.state.descuentos } search={ true } deleteRow={ true } selectRow={ {mode: 'radio'} } options={ options } trClassName={this.rowClassNameFormat}  pagination>
                                <TableHeaderColumn width="50"  dataField='_id' isKey hidden>ID</TableHeaderColumn>
                                <TableHeaderColumn width='150' dataField='nombre'>Nombre de Descuento</TableHeaderColumn>
                                <TableHeaderColumn width='150' dataField='dollarDesc'>Descuento $US</TableHeaderColumn>
                                <TableHeaderColumn width='350' dataField='detalle' tdStyle={ { whiteSpace: 'normal' } }>Detalle</TableHeaderColumn>
                            </BootstrapTable>
                        </Col>
                    </Row>
                    <br/><br/><br/>


                    {/******************************** USUARIOS ************************************/}

                    <h3 className="text-center">Usuarios</h3>
                    <br/>
                    <Row>
                        <Col  lg='12' md='12' sm='12' xs='12'>
                            <BootstrapTable ref='tableUsers' exportCSV  data={ this.state.usuarios } search={ true } selectRow={ {mode: 'radio'} } options={ optionsUsuario } pagination>
                                <TableHeaderColumn width="50"  dataField='_id' isKey hidden>ID</TableHeaderColumn>
                                <TableHeaderColumn width='150' dataField='nickname' >Nickname</TableHeaderColumn>
                                <TableHeaderColumn width='150' dataField='nombre' >Nombre</TableHeaderColumn>
                                <TableHeaderColumn width='350' dataField='descuentosTxt' tdStyle={ { whiteSpace: 'normal' } }>Descuentos</TableHeaderColumn>
                            </BootstrapTable>
                        </Col>
                    </Row>
                    <br/><br/><br/>

                    {/******************************** MODAL DESCUENTOS USUARIOS ************************************/}

                    <Modal isOpen={this.state.modal} toggle={this.toggle}>
                        <ModalHeader toggle={this.toggle}>Descuentos disponibles para: {this.state.usuario}</ModalHeader>
                        <ModalBody>
                            <Row>
                                <Col lg={{ size: 10, offset: 1 }} md={{ size: 10, offset: 1 }} sm='12' xs='12'>
                                    <Input
                                        type='select'
                                        name="selectDescuentos"
                                        id="selectDescuentos"
                                        multiple
                                        defaultValue={this.state.defaultDescuento}
                                        onChange={this.handleChangeDescuentos}
                                    >
                                    {this.state.optDescuentos.map((option, i) => {
                                        return(
                                            <option key={i} value={option.value}>{option.label}</option>
                                        );
                                    })}
                                    </Input>
                                    {/* <p class={(this.state.validationDestino) ? 'textValid': 'textInvalid'}>Selecciona el destino</p> */}
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={this.toggle}>Cancelar</Button>
                            <Button color="primary" onClick={this.editDescUser}>Guardar</Button>{' '}                            
                        </ModalFooter>
                    </Modal>

                    {/******************************** MODAL DESCUENTOS ************************************/}

                    <Modal isOpen={this.state.modalDesc} toggle={this.toggleModal}>
                        <ModalHeader toggle={this.toggleModal}>Editar {this.state.nombreDescuento}:</ModalHeader>
                        <ModalBody>
                            <Row>
                                <Col lg={{ size: 10, offset: 1 }} md={{ size: 10, offset: 1 }} sm='12' xs='12'>
                                    <FormGroup>
                                        <Label for="inputNombre">Nombre:</Label>
                                        <Input plaintext readOnly  type="text" name="inputNombre" id="inputNombre" value={this.state.nombreDescuento} />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={{ size: 10, offset: 1 }} md={{ size: 10, offset: 1 }} sm='12' xs='12'>
                                    <FormGroup>
                                        <Label for="inputDescuento">Descuento $US:</Label>
                                        {
                                            this.state.nombreDescuento == "Cortesía"?
                                            <textarea plaintext readOnly class="form-control" id="inputDescuento" rows="1" value={this.state.dollarDesc}/>
                                            :
                                            <Input type="text" name="inputDescuento" id="inputDescuento" onChange={this.handleOnChangeDollarDesc} value={this.state.dollarDesc} />
                                        }
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={{ size: 10, offset: 1 }} md={{ size: 10, offset: 1 }} sm='12' xs='12'>
                                    <FormGroup>
                                        <Label for="textDetalle">Detalle:</Label>
                                        <textarea plaintext readOnly class="form-control" id="textDetalle" rows="3" value={this.state.detalle}/>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={this.toggleModal}>Cancelar</Button>
                            <Button color="primary" onClick={this.modificarDescuento}>Guardar</Button>{' '}                            
                        </ModalFooter>
                    </Modal>

                    {/******************************** MODAL PROMOCION GENERAL 1 ************************************/}

                    <Modal isOpen={this.state.modalGeneral1} toggle={this.toggleModalGeneral1}>
                        <ModalHeader toggle={this.toggleModalGeneral1}>Editar {this.state.nombreDescuento}:</ModalHeader>
                        <ModalBody>
                            <Row>
                                <Col lg={{ size: 10, offset: 1 }} md={{ size: 10, offset: 1 }} sm='12' xs='12'>
                                    <FormGroup>
                                        <Label for="inputNombre">Nombre:</Label>
                                        <Input plaintext readOnly  type="text" name="inputNombre" id="inputNombre" value={this.state.nombreDescuento} />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={{ size: 10, offset: 1 }} md={{ size: 10, offset: 1 }} sm='12' xs='12'>
                                    <FormGroup>
                                        <Label for="inputDescuento">Descuento $US:</Label>
                                        <Input type="text" name="inputDescuento" id="inputDescuento" onChange={this.handleOnChangeDollarDesc} value={this.state.dollarDesc} />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={{ size: 10, offset: 1 }} md={{ size: 10, offset: 1 }} sm='12' xs='12'>
                                    <Label>Rango de fecha de compra:</Label>
                                    <Row>
                                        <Col lg={{ size: 6 }} md={{ size: 6 }} sm='12' xs='12'>
                                            <Label for="date1">Del Día:</Label>
                                            <Input
                                            type="date"
                                            name="date"
                                            id="date1"
                                            value={this.state.fechaInicial}
                                            onChange={this.handleChangeFechaInicial}
                                            />
                                        </Col>
                                        <Col lg={{ size: 6 }} md={{ size: 6 }} sm='6' xs='6'>
                                            <Label for="date2">Al Día:</Label>
                                            <Input
                                            type="date"
                                            name="date"
                                            id="date2"
                                            value={this.state.fechaFinal}
                                            onChange={this.handleChangeFechaFinal}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={{ size: 10, offset: 1 }} md={{ size: 10, offset: 1 }} sm='12' xs='12'>
                                    <FormGroup>
                                        <Label for="textDetalle">Detalle:</Label>
                                        <textarea plaintext readOnly class="form-control" id="textDetalle" rows="3" value={this.state.detalle}/>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={this.toggleModalGeneral1}>Cancelar</Button>
                            <Button name='DescuentoGeneral1' color="primary" onClick={this.modificarDescuentoGeneral}>Guardar</Button>{' '}                            
                        </ModalFooter>
                    </Modal>

                    {/******************************** MODAL PROMOCION GENERAL 2 ************************************/}

                    <Modal isOpen={this.state.modalGeneral2} toggle={this.toggleModalGeneral2}>
                        <ModalHeader toggle={this.toggleModalGeneral2}>Editar {this.state.nombreDescuento}:</ModalHeader>
                        <ModalBody>
                            <Row>
                                <Col lg={{ size: 10, offset: 1 }} md={{ size: 10, offset: 1 }} sm='12' xs='12'>
                                    <FormGroup>
                                        <Label for="inputNombre">Nombre:</Label>
                                        <Input plaintext readOnly  type="text" name="inputNombre" id="inputNombre" value={this.state.nombreDescuento} />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={{ size: 10, offset: 1 }} md={{ size: 10, offset: 1 }} sm='12' xs='12'>
                                    <FormGroup>
                                        <Label for="inputDescuento">Descuento $US:</Label>
                                        <Input type="text" name="inputDescuento" id="inputDescuento" onChange={this.handleOnChangeDollarDesc} value={this.state.dollarDesc} />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={{ size: 10, offset: 1 }} md={{ size: 10, offset: 1 }} sm='12' xs='12'>
                                    <Label>Rango de fecha de compra:</Label>
                                    <Row>
                                        <Col lg={{ size: 6 }} md={{ size: 6 }} sm='12' xs='12'>
                                            <Label for="date1">Del Día:</Label>
                                            <Input
                                            type="date"
                                            name="date"
                                            id="date1"
                                            value={this.state.fechaInicial}
                                            onChange={this.handleChangeFechaInicial}
                                            />
                                        </Col>
                                        <Col lg={{ size: 6 }} md={{ size: 6 }} sm='6' xs='6'>
                                            <Label for="date2">Al Día:</Label>
                                            <Input
                                            type="date"
                                            name="date"
                                            id="date2"
                                            value={this.state.fechaFinal}
                                            onChange={this.handleChangeFechaFinal}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={{ size: 10, offset: 1 }} md={{ size: 10, offset: 1 }} sm='12' xs='12'>
                                    <FormGroup>
                                        <Label for="textDetalle">Detalle:</Label>
                                        <textarea plaintext readOnly class="form-control" id="textDetalle" rows="3" value={this.state.detalle}/>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={this.toggleModalGeneral2}>Cancelar</Button>
                            <Button name='DescuentoGeneral2' color="primary" onClick={this.modificarDescuentoGeneral}>Guardar</Button>{' '}                            
                        </ModalFooter>
                    </Modal>

                </Container>
            </div>
        )
    }
}