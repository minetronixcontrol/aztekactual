import React, { Component } from 'react';
import {Button, Card, CardTitle, Col, Container, Form, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter, Row, Input, Table} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import Select from 'react-select';

export default class Viajes extends Component{
    constructor(props){
        super(props);
        this.state = {
            user: this.props.match.params.id_Usuario,
            userType: '',
            idUsuario: '',
            //fecha: '',
            optTripulantes: [],
            optCamiones: [],
            optAuxiliares: [],
            optRutas: [],
            optCapacidad: [
                {
                    value: 38,
                    label: '38'
                },
                {
                    value: 39,
                    label: '39'
                },
                {
                    value: 40,
                    label: '40'
                },
                {
                    value: 41,
                    label: '41'
                },
                {
                    value: 42,
                    label: '42'
                },
                {
                    value: 43,
                    label: '43'
                },
                {
                    value: 44,
                    label: '44'
                },
                {
                    value: 45,
                    label: '45'
                },
                {
                    value: 46,
                    label: '46'
                },
                {
                    value: 47,
                    label: '47'
                },
                {
                    value: 48,
                    label: '48'
                }
            ],
            modalNuevoViaje: false,
            modalEditarViaje: false,
            //Variables para el nuevo viaje
            nuevaFechaDeViaje: '',
            ruta: '',
            noEconomico: '',
            capacidad: '',
            chofer1: '',
            chofer2: '',
            sobrecargo: '',
            auxiliar: '',
            tipoBusqueda: 'inicial',
            //Variables para editar viaje
            editFecha: '',
            editarRuta: '',
            editarNoEconomico: '',
            editarCapacidad: '',
            chofer1Edit: '',
            chofer2Edit: '',
            sobrecargoEdit: '',
            auxiliarEdit: '',
            rutaTxt: '',
            viajes:[],
        }

        this.busquedaFecha = this.busquedaFecha.bind(this);
        this.viajes = this.viajes.bind(this);
        this.rowClassNameFormat = this.rowClassNameFormat.bind(this);
        this.editar = this.editar.bind(this);
        this.eliminar = this.eliminar.bind(this);
        this.fetchUser = this.fetchUser.bind(this);
        this.fetchConfViajes = this.fetchConfViajes.bind(this);
        this.handleOnChangeNuevaFechaDeViaje = this.handleOnChangeNuevaFechaDeViaje.bind(this);
        this.handleChangeRuta = this.handleChangeRuta.bind(this);
        this.fetchOptions = this.fetchOptions.bind(this);
        this.handleChangeCamiones = this.handleChangeCamiones.bind(this);
        this.handleChangeCapacidad = this.handleChangeCapacidad.bind(this);
        this.handleChangeChofer1 = this.handleChangeChofer1.bind(this);
        this.handleChangeChofer2 = this.handleChangeChofer2.bind(this);
        this.handleChangeSobrecargo = this.handleChangeSobrecargo.bind(this);
        this.handleChangeAuxiliar = this.handleChangeAuxiliar.bind(this);
        this.validarNuevoViaje = this.validarNuevoViaje.bind(this);
        this.prepararObjetoParaGuardar = this.prepararObjetoParaGuardar.bind(this);
        this.toggleNuevoViaje = this.toggleNuevoViaje.bind(this);
        this.saveNewViaje = this.saveNewViaje.bind(this);
        this.getFecha = this.getFecha.bind(this);
        this.getAnio = this.getAnio.bind(this);
        this.getDiaDelAnio = this.getDiaDelAnio.bind(this);
        this.toggleEditarViaje = this.toggleEditarViaje.bind(this);
        this.handleChangeEditarRuta = this.handleChangeEditarRuta.bind(this);
        this.handleChangeEditarCamiones = this.handleChangeEditarCamiones.bind(this);
        this.handleChangeEditarCapacidad = this.handleChangeEditarCapacidad.bind(this);
        this.handleChangeEditarChofer1 = this.handleChangeEditarChofer1.bind(this);
        this.handleChangeEditarChofer2 = this.handleChangeEditarChofer2.bind(this);
        this.handleChangeEditSobrecargo = this.handleChangeEditSobrecargo.bind(this);
        this.handleChangeEditAuxiliar = this.handleChangeEditAuxiliar.bind(this);
    }

    componentDidMount(){
        this.fetchUser();
        this.fetchConfViajes();
        this.fetchOptions();
    }

    fetchUser(){
        fetch(`/api/Usuarios/${this.state.user}`)
        .then(res => res.json())
        .then(data => {
            this.setState({
                idUsuario: data[0]._id,
                userType: data[0].seguridad
            });
        });
    }

    fetchOptions(){
        fetch(`/api/AsignarViajes/c/options`)
        .then(res => res.json())
        .then(data => {
            this.setState({
                optTripulantes: data.respuestaTripulantes,
                optCamiones: data.respuestaCamiones,
                optAuxiliares: data.respuestaAuxiliares,
                optRutas: data.respuestaRutas
            });
        });
    }

    fetchConfViajes(){
        fetch(`/api/AsignarViajes/c/ultimosDiezViajesCreados`)
        .then(res => res.json())
        .then(data => {
            this.setState({
                viajes: data,
            });
        })
    }

    busquedaFecha(){
        if(this.state.fecha == null || this.state.fecha == ''){
            alert('Selecciona una fecha');
        }else{
            fetch(`/api/AsignarViajes/${this.state.fecha}/fechaDelViaje`)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    viajes: data,
                    tipoBusqueda: 'fecha'
                });
            })
        }
    }

    viajes(){

    }

    /*
    editar() obtenemos el key del elemento seleccionado en la tabla, después asignamos los valores que tendrán por defecto los inputs del modal (los actuales de ese viaje)
    */
    editar(){
        let selectedRowKeys = this.refs.table.state.selectedRowKeys;
        console.log(selectedRowKeys);
        if(selectedRowKeys.length > 0){
            let { viajes } = this.state;
            for (let i = 0; i < viajes.length; i++) {
                if(viajes[i]._id == selectedRowKeys[0]){
                    console.log(viajes[i]);
                    this.setState( prevState => ({
                        editFecha: viajes[i].fecha,
                        editarRuta: { value: viajes[i].idRuta, label: viajes[i].ruta },
                        rutaTxt: viajes[i].rutaTxt,
                        editarNoEconomico: { value: viajes[i].numeroEconomico, label: viajes[i].numeroEconomico },
                        editarCapacidad: { value: viajes[i].capacidad, label: viajes[i].capacidad },
                        chofer1Edit: { value: viajes[i].idChofer1, label: viajes[i].chofer_1 },
                        chofer2Edit: { value: viajes[i].idChofer2, label: viajes[i].chofer_2 },
                        sobrecargoEdit: { value: viajes[i].idSobrecargo, label: viajes[i].sobrecargo },
                        auxiliarEdit: { value: viajes[i].idAuxiliar, label: viajes[i].auxiliar },
                        modalEditarViaje: !prevState.modalEditarViaje //Aqui abrimos el modal de editar viajes
                    }))
                }
            }
        }else{
            alert('Selecciona un registro para editar');
        }
    }

    toggleNuevoViaje(){
        this.setState(prevState => ({
            modalNuevoViaje: !prevState.modalNuevoViaje
        }));
    }

    toggleEditarViaje(){
        this.setState(prevState => ({
            modalEditarViaje: !prevState.modalEditarViaje
        }));
    }

    eliminar(){

    }

    handleOnChangeNuevaFechaDeViaje(e){
        this.setState({
            nuevaFechaDeViaje: e.target.value
        })
    }

    handleChangeRuta(e){
        this.setState({
            ruta: e.value
        })
    }

    handleChangeEditarRuta(e){
        this.setState({
            editarRuta: e.value
        })
    }

    handleChangeCamiones(e){
        this.setState({
            noEconomico: e.value
        })
    }

    handleChangeEditarCamiones(e){
        this.setState({
            editarNoEconomico: e.value
        })
    }

    handleChangeCapacidad(e){
        this.setState({
            capacidad: e.value
        })
    }

    handleChangeEditarCapacidad(e){
        this.setState({
            editarCapacidad: e.value
        })
    }

    handleChangeChofer1(e){
        this.setState({
            chofer1: e.value
        })
    }

    handleChangeEditarChofer1(e){
        this.setState({
            chofer1Edit: e.value
        })
    }

    handleChangeChofer2(e){
        this.setState({
            chofer2: e.value
        })
    }

    handleChangeEditarChofer2(e){
        this.setState({
            chofer2Edit: e.value
        })
    }

    handleChangeSobrecargo(e){
        this.setState({
            sobrecargo: e.value
        })
    }

    handleChangeEditSobrecargo(e){
        this.setState({
            sobrecargoEdit: e.value
        })
    }

    handleChangeAuxiliar(e){
        this.setState({
            auxiliar: e.value
        })
    }

    handleChangeEditAuxiliar(e){
        this.setState({
            auxiliarEdit: e.value
        })
    }

    

    //Validamos que los datos sean correctos para proceder a guardar en la db
    validarNuevoViaje(){
        let validacion = true;
        if(this.state.fecha == ''){
            validacion = false;
        }

        if(this.state.ruta == ''){
            validacion = false;
        }

        if(this.state.noEconomico == ''){
            validacion = false;
        }

        if(this.state.capacidad == ''){
            validacion = false;
        }

        if(this.state.chofer1 == ''){
            validacion = false;
        }

        if(this.state.chofer2 == ''){
            validacion = false;
        }

        if(this.state.sobrecargo == ''){
            validacion = false;
        }

        if(this.state.auxiliar == ''){
            validacion = false;
        }

        if(validacion){
            this.prepararObjetoParaGuardar();
        }else{
            alert('Por favor llena correctamente todos los campos')
        }
    }

    // validarEditarViaje() validamos que los datos sean correctos para proceder a actualizar en la db
    validarEditarViaje(){
        console.log(this.state);
    }

    prepararObjetoParaGuardar(){
        let fechaDeViaje = this.getFecha(this.state.nuevaFechaDeViaje);
        let obj = {
            fecha: fechaDeViaje,
            hora: '00:00',
            anio: this.getAnio(fechaDeViaje),
            diaDelAnio: this.getDiaDelAnio(fechaDeViaje),
            chofer_1: this.state.chofer1,
            chofer_2:this.state.chofer2,
            id_Viajes: '0',
            sobrecargo:this.state.sobrecargo, 
            auxiliar: this.state.auxiliar, 
            creadoPor: this.state.idUsuario,
            numeroEconomico: this.state.noEconomico, 
            ruta: this.state.ruta, 
            capacidad: this.state.capacidad, 
            activo: 'true',
            asiento_1: 'false',
            asiento_2: 'false',
            asiento_3: 'false',
            asiento_4: 'false',
            asiento_5: 'false',
            asiento_6: 'false',
            asiento_7: 'false',
            asiento_8: 'false',
            asiento_9: 'false',
            asiento_10: 'false',
            asiento_11: 'false',
            asiento_12: 'false',
            asiento_13: 'false',
            asiento_14: 'false',
            asiento_15: 'false',
            asiento_16: 'false',
            asiento_17: 'false',
            asiento_18: 'false',
            asiento_19: 'false',
            asiento_20: 'false',
            asiento_21: 'false',
            asiento_22: 'false',
            asiento_23: 'false',
            asiento_24: 'false',
            asiento_25: 'false',
            asiento_26: 'false',
            asiento_27: 'false',
            asiento_28: 'false',
            asiento_29: 'false',
            asiento_30: 'false',
            asiento_31: 'false',
            asiento_32: 'false',
            asiento_33: 'false',
            asiento_34: 'false',
            asiento_35: 'false',
            asiento_36: 'false',
            asiento_37: 'false',
            asiento_38: 'false',
            asiento_39: 'false',
            asiento_40: 'false',
            asiento_41: 'false',
            asiento_42: 'false',
            asiento_43: 'false',
            asiento_44: 'false',
            asiento_45: 'false',
            asiento_46: 'false',
            asiento_47: 'false',
            asiento_48: 'false'
        }

        //console.log(obj);
        this.saveNewViaje(obj);
    }

    saveNewViaje(obj){
        fetch('/api/AsignarViajes', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
          })
          .catch((error) => {
              console.log(error);
              alert('Ha ocurrido un error, por favor intentalo más tarde');
          })
          .finally(() => {
            this.toggleNuevoViaje();
            if(this.state.tipoBusqueda == 'fecha'){
                this.busquedaFecha();
            }else{
                this.fetchConfViajes();
            }
          })
    }

    getFecha(fecha){
        let arr = fecha.split('-', 3);
        fecha = `${arr[2]}-${arr[1]}-${arr[0]}`
        return fecha;
    }

    getAnio(fecha){
        let arr = fecha.split('-', 3);
        let anio = arr[2];
        return anio;
    }

    getDiaDelAnio(fecha){
        let arr = fecha.split('-', 3);
        let fechaini = new Date(`${arr[2]}-01-01`);
        console.log(fechaini);
        let fechafin = new Date(`${arr[2]}-${arr[1]}-${arr[0]}`);
        console.log(fechafin);
        let diasdif= fechafin.getTime()-fechaini.getTime();
        let contdias = Math.round(diasdif/(1000*60*60*24));
        console.log('contdias',contdias);
        return (contdias+1);
    }

    rowClassNameFormat(row, rowIdx){
        return row.origenPais == 'US' ? 'US' : 'MX';
    }

    render(){
        return(
            <div>
                <Container style={{marginTop: '15px'}}>
                    <br/>
                    <Card body outline color="secondary">
                        <CardTitle className="text-center"><h3>VIAJES</h3></CardTitle>
                        <br/>
                        {/** BUSQUEDA **/}
                        <h5>Buscar Por:</h5>
                        <Row>
                            <Col lg='6' md='6' sm='6' xs='6'>
                                <FormGroup>
                                    <Label for="fechaViaje">Fecha de viaje</Label>
                                    <Input type="date" name="fechaViaje" id="fechaViaje" onChange={this.handleOnChangeFecha}/>
                                </FormGroup>
                            </Col>
                            <Col className="btn-nuevoPasajero" lg='1' md='1' sm='1' xs='1'>
                                <Button color="primary" title="Buscar" onClick={this.busquedaFecha}><i className="fa fa-search"/></Button>
                            </Col>
                        </Row>
                        {/** TERMINA BUSQUEDA **/}
                        {/** ACCIONES **/}
                        <hr/>
                        <h5>Acciones</h5>
                        {
                            (this.state.userType == 'Admin' || this.state.userType == 'Viajes')?
                                <Row>
                                    <Col lg='2' md='2' sm='2' xs='2'>
                                        <Button color="warning" onClick={this.editar}><i className="fa fa-pencil-alt"/> Editar</Button>
                                    </Col>
                                    <Col lg='2' md='2' sm='2' xs='2'>
                                        <Button color="dark" onClick={this.toggleNuevoViaje}><i className="fa fa-plus"/> Nuevo</Button>
                                    </Col>
                                    <Col lg='2' md='2' sm='2' xs='2'>
                                        <Button color="danger" onClick={this.eliminar}><i className="fa fa-trash-alt"/> Eliminar</Button>
                                    </Col>
                                </Row>
                            :
                                null
                        }
                    </Card>
                    <br/>
                    <Row>
                        <Col lg='12' md='12' sm='12' xs='12'>
                            <BootstrapTable ref='table' data={ this.state.viajes } selectRow={ {mode: 'radio'} }  search={ true } trClassName={this.rowClassNameFormat} pagination>
                                <TableHeaderColumn width='80' dataField='_id' isKey hidden>ID</TableHeaderColumn>
                                <TableHeaderColumn width='110' dataField='fecha'>Fecha</TableHeaderColumn>
                                <TableHeaderColumn width='250' dataField='ruta'>Ruta</TableHeaderColumn>
                                <TableHeaderColumn width='150' dataField='numeroEconomico' >No. Economico</TableHeaderColumn>
                                <TableHeaderColumn width='150' dataField='capacidad' >Capacidad</TableHeaderColumn>
                                <TableHeaderColumn width='250' dataField='chofer_1'>Chofer 1</TableHeaderColumn>
                                <TableHeaderColumn width='250' dataField='chofer_2'>Chofer 2</TableHeaderColumn>
                                <TableHeaderColumn width='250' dataField='sobrecargo'>Sobrecargo</TableHeaderColumn>
                                <TableHeaderColumn width='250' dataField='auxiliar'>Auxiliar</TableHeaderColumn>
                                <TableHeaderColumn width='250' dataField='creadoPor'>Creado Por:</TableHeaderColumn>
                            </BootstrapTable>
                        </Col>
                    </Row>
                    <br/>
                    <br/>
                    <br/>
                    {/* Modal Nuevo Viaje */}
                    <Modal size="lg" isOpen={this.state.modalNuevoViaje} toggle={this.toggleNuevoViaje}>
                        <ModalHeader toggle={this.toggleNuevoViaje}>Nuevo Viaje </ModalHeader>
                        <ModalBody>
                            <Row>
                                <Col lg={6} md={6} sm={12} xs={12}>
                                    <Label><strong>Fecha:</strong></Label>
                                    <Input type="date" name="nuevaFechaDeViaje" id="nuevaFechaDeViaje" onChange={this.handleOnChangeNuevaFechaDeViaje} />
                                </Col>
                                <Col lg={6} md={6} sm={12} xs={12}>
                                    <Label><strong>Ruta:</strong></Label>
                                    <Select
                                        id="selectRuta"
                                        onChange={this.handleChangeRuta}
                                        options={this.state.optRutas}
                                        placeholder = "Selecciona..."
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={6} md={6} sm={12} xs={12}>
                                    <Label><strong>No. Economico:</strong></Label>
                                    <Select
                                        id="selectNoEconomico"
                                        onChange={this.handleChangeCamiones}
                                        options={this.state.optCamiones}
                                        placeholder = "Selecciona..."
                                    />
                                </Col>
                                <Col lg={6} md={6} sm={12} xs={12}>
                                    <Label><strong>Capacidad:</strong></Label>
                                    <Select
                                        id="selectCapacidad"
                                        onChange={this.handleChangeCapacidad}
                                        options={this.state.optCapacidad}
                                        placeholder = "Selecciona..."
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={6} md={6} sm={12} xs={12}>
                                    <Label><strong>Chofer 1:</strong></Label>
                                    <Select
                                        id="selectChofer1"
                                        onChange={this.handleChangeChofer1}
                                        options={this.state.optTripulantes}
                                        placeholder = "Selecciona..."
                                    />
                                </Col>
                                <Col lg={6} md={6} sm={12} xs={12}>
                                    <Label><strong>Chofer 2:</strong></Label>
                                    <Select
                                        id="selectChofer2"
                                        onChange={this.handleChangeChofer2}
                                        options={this.state.optTripulantes}
                                        placeholder = "Selecciona..."
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={6} md={6} sm={12} xs={12}>
                                    <Label><strong>Sobrecargo:</strong></Label>
                                    <Select
                                        id="selectSobrecargo"
                                        onChange={this.handleChangeSobrecargo}
                                        options={this.state.optTripulantes}
                                        placeholder = "Selecciona..."
                                    />
                                </Col>
                                <Col lg={6} md={6} sm={12} xs={12}>
                                    <Label><strong>Auxiliar:</strong></Label>
                                    <Select
                                        id="selectAuxiliar"
                                        onChange={this.handleChangeAuxiliar}
                                        options={this.state.optAuxiliares}
                                        placeholder = "Selecciona..."
                                    />
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={this.toggleNuevoViaje}>Cancelar</Button>
                            <Button color="primary" onClick={this.validarNuevoViaje}>Guardar Cancelación</Button>{' '}
                        </ModalFooter>
                    </Modal>
                    {/* FIN Modal Nuevo Viaje */}
                    {/* Modal Editar Viaje */}
                    <Modal size="lg" isOpen={this.state.modalEditarViaje} toggle={this.toggleEditarViaje}>
                        <ModalHeader toggle={this.toggleEditarViaje}>Editar viaje</ModalHeader>
                        <ModalBody>
                            <Row>
                                <Col lg={6} md={6} sm={12} xs={12}>
                                    <Label>Fecha: </Label>
                                    <Input plaintext value={this.state.editFecha} />
                                </Col>
                                <Col lg={6} md={6} sm={12} xs={12}>
                                    <Label><strong>Ruta:</strong></Label>
                                    <Select
                                        id="selectEditarRuta"
                                        defaultValue={this.state.editarRuta}
                                        onChange={this.handleChangeEditarRuta}
                                        options={this.state.optRutas}
                                        placeholder = "Selecciona..."
                                    />
                                    <Input plaintext value={this.state.rutaTxt} />
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={6} md={6} sm={12} xs={12}>
                                    <Label><strong>No. Economico:</strong></Label>
                                    <Select
                                        id="selectEditarNoEconomico"
                                        defaultValue={this.state.editarNoEconomico}
                                        onChange={this.handleChangeEditarCamiones}
                                        options={this.state.optCamiones}
                                        placeholder = "Selecciona..."
                                    />
                                </Col>
                                <Col lg={6} md={6} sm={12} xs={12}>
                                    <Label><strong>Capacidad:</strong></Label>
                                    <Select
                                        id="selectEditarCapacidad"
                                        defaultValue={this.state.editarCapacidad}
                                        onChange={this.handleChangeEditarCapacidad}
                                        options={this.state.optCapacidad}
                                        placeholder = "Selecciona..."
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={6} md={6} sm={12} xs={12}>
                                    <Label><strong>Chofer 1:</strong></Label>
                                    <Select
                                        id="selectEditarChofer1"
                                        defaultValue={this.state.chofer1Edit}
                                        onChange={this.handleChangeEditarChofer1}
                                        options={this.state.optTripulantes}
                                        placeholder = "Selecciona..."
                                    />
                                </Col>
                                <Col lg={6} md={6} sm={12} xs={12}>
                                    <Label><strong>Chofer 2:</strong></Label>
                                    <Select
                                        id="selectEditarChofer2"
                                        defaultValue={this.state.chofer2Edit}
                                        onChange={this.handleChangeEditarChofer2}
                                        options={this.state.optTripulantes}
                                        placeholder = "Selecciona..."
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={6} md={6} sm={12} xs={12}>
                                    <Label><strong>Sobrecargo:</strong></Label>
                                    <Select
                                        id="selectEditarSobrecargo"
                                        defaultValue={this.state.sobrecargoEdit}
                                        onChange={this.handleChangeEditSobrecargo}
                                        options={this.state.optTripulantes}
                                        placeholder = "Selecciona..."
                                    />
                                </Col>
                                <Col lg={6} md={6} sm={12} xs={12}>
                                    <Label><strong>Auxiliar:</strong></Label>
                                    <Select
                                        id="selectEditAuxiliar"
                                        defaultValue={this.state.auxiliarEdit}
                                        onChange={this.handleChangeEditAuxiliar}
                                        options={this.state.optAuxiliares}
                                        placeholder = "Selecciona..."
                                    />
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={this.toggleEditarViaje}>Cancelar</Button>
                            <Button color="primary" onClick={this.validarEditarViaje}>Guardar Cancelación</Button>{' '}
                        </ModalFooter>
                    </Modal>
                    {/* FIN Modal Editar Viaje */}
                </Container>
            </div>
        )
    }
}