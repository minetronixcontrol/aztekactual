import React from "react";
import ReactDOM from "react-dom";
import { Button, Card, CardBody, CardTitle, Container, Col, CustomInput, Form, FormGroup, Input, Label, ModalBody, ModalFooter, Row } from 'reactstrap';
import "bootstrap/dist/css/bootstrap.css";

var newCliente = {
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    fechaNacimiento: '',
    correo: '',
    curp: '',
    genero: '',
    telefono: '',
    activo: 'true',
    id_Cliente: '1',
    listaNegra: 'false',
    usuario: ''
  }

  export default class WizardCliente extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            validationNombre: true,
            validationApellido: true,
            validationFNacimiento: true,
            validationSexo: true,
            validationNombreCE: true,
            validationApellidoCE: true,
            validationParentesco: true,
            validationTelefonoCE: true,
        }
        this.validationNombre = this.validationNombre.bind(this);
        this.validationApellido = this.validationApellido.bind(this);
        this.handleApellidoMaterno = this.handleApellidoMaterno.bind(this);
        this.validationFNacimiento = this.validationFNacimiento.bind(this);
        this.handleOnchageGenero = this.handleOnchageGenero.bind(this);
        this.handleCURP = this.handleCURP.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
        this.validationSexo = this.validationSexo.bind(this);
        this.handleNombreEmergencia = this.handleNombreEmergencia.bind(this);
        this.handleApellidoEmergencia = this.handleApellidoEmergencia.bind(this);
        this.handleApellidoMaternoCE = this.handleApellidoMaternoCE.bind(this);
        this.handleParentesco = this.handleParentesco.bind(this);
        this.handleTelefonoCE = this.handleTelefonoCE.bind(this);
        this.validar = this.validar.bind(this);
        this.cancelar = this.cancelar.bind(this);
        this.saveNewCliente = this.saveNewCliente.bind(this);
        this.formatDate = this.formatDate.bind(this);

        newCliente.usuario = this.props.usuario;
    }

    //Funciones

    validationNombre(e){
        this.setState({
            validationNombre: true
        });
        newCliente.nombre = e.target.value;
    }

    validationApellido(e){
        this.setState({
            validationApellido: true
        });
        newCliente.apellidoPaterno = e.target.value;
    }

    validationFNacimiento(e){
        //console.log(e.target.value);
        this.setState({
            validationFNacimiento: true
        });
        newCliente.fechaNacimiento = this.formatDate(e.target.value);
    }

    validationSexo(e){
        this.setState({
            validationSexo: true
        });
        newCliente.genero = e.target.value;
    }

    handleApellidoMaterno(e){
        newCliente.apellidoMaterno = e.target.value;
    }
    handleCURP(e){
        newCliente.curp = e.target.value;
    }

    handleOnchageGenero(e){
        newCliente.genero = e.target.value;
        this.setState({
            validationSexo: true
        });
    }

    handleEmail(e){
    newCliente.correo = e.target.value;
    }

    handleNombreEmergencia(e){
        this.setState({
            validationNombreCE: true
        });
        newCliente.nombreEmergencia = e.target.value;
    }

    handleApellidoEmergencia(e){
        this.setState({
            validationApellidoCE: true
        });
        newCliente.apellidoPaternoEmergencia = e.target.value;
    }

    handleApellidoMaternoCE(e){
        newCliente.apellidoMaternoEmergencia = e.target.value;
    }

    handleParentesco(e){
        this.setState({
            validationParentesco: true
        });
        newCliente.parentesco = e.target.value;
    }

    handleTelefonoCE(e){
        this.setState({
            validationTelefonoCE: true
        });
        newCliente.telefonoEmergencia = e.target.value;
    }

    validar(){

        let continuar = true;

        if(newCliente.nombre == null || newCliente.nombre == ""){
            this.setState({
              validationNombre: false
            });
            continuar = false;
        }

        if(newCliente.apellidoPaterno == null || newCliente.apellidoPaterno == ""){
            this.setState({
                validationApellido: false
            });
            continuar = false;
        }

        if(newCliente.fechaNacimiento == null || newCliente.fechaNacimiento == ""){
            this.setState({
                validationFNacimiento: false
            });
            continuar = false;
        }

        if(newCliente.genero == null || newCliente.genero == ""){
            this.setState({
                validationSexo: false
            });
            continuar = false;
        }
        if(continuar){
            console.log('guardando el nuevo cliente');
            this.saveNewCliente();
        }else{  
            console.log('kk');
        }
    }

    cancelar(){
        this.props.toggle();
    }

    formatDate(date){
        let formatBirthday = date.split("-", 3);
        return formatBirthday[2]+"/"+formatBirthday[1]+"/"+formatBirthday[0]
    }

    saveNewCliente(){
        console.log('guardando Cliente');
        fetch('/api/Clientes/returnCliente', { //Aqui hace la peticion al servidor
            method: 'POST',
            body: JSON.stringify(newCliente),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json()) //Convierte la respouesta del servidor a formato json para poder mostrarla
            .then(data => {
                console.log('idNwCliente', data);
                this.props.toggle();
                this.props.refresh(data.data);
                //console.log('data', data);
                //this.fetchBoleto();
            }) //Muestra los datos formateados a json
            .catch(err => {
                this.props.toggle();
                console.error(err)
            } );

            
    }

    render() {
        return (
            <div>
                <ModalBody>
                <Container style={{ marginTop: "15px" }}>
                    <Row>
                        <Col lg={12} md={12} sm={12} xs={12}>
                            <Card>
                                <CardTitle>Datos del Cliente</CardTitle>
                                <CardBody>
                                    <Row>
                                        <Col lg={6} md={6} sm={12} xs={12}>
                                            <Label for="inputNombre">* Nombre:</Label>
                                            <div className={(this.state.validationNombre) ? 'card border-light': 'card border-danger'}>
                                            <Input type="text" name="inputNombre" id="inputNombre" placeholder="Nombre del cliente" onKeyUp={this.validationNombre} />
                                            </div>
                                            <p className={(this.state.validationNombre) ? 'textValid': 'textInvalid'}>Campo Obligatorio</p>
                                        </Col>
                                        <Col lg={6} md={6} sm={12} xs={12}>
                                            <Label for="inputAPaterno">* Apellido Paterno:</Label>
                                            <div className={(this.state.validationApellido) ? 'card border-light': 'card border-danger'}>
                                            <Input type="text" name="inputAPaterno" id="inputAPaterno" placeholder="Nombre del cliente" onKeyUp={this.validationApellido} />
                                            </div>
                                            <p className={(this.state.validationApellido) ? 'textValid': 'textInvalid'}>Campo Obligatorio</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg={6} md={6} sm={12} xs={12}>
                                            <Label for="inputAMaterno">Apellido Materno"no es obligatorio"</Label>
                                            <Input onKeyUp={this.handleApellidoMaterno} type="text" name="text" id="inputAMaterno" placeholder="Nombre del cliente" />
                                        </Col>
                                        <Col lg={6} md={6} sm={12} xs={12}>
                                            <Label for="dateNacimiento">* Fecha de nacimiento:</Label>
                                            <div className={(this.state.validationFNacimiento) ? 'card border-light': 'card border-danger'}>
                                            <Input
                                            type="date"
                                            name="dateNacimiento"
                                            id="dateNacimiento"
                                            placeholder="date placeholder"
                                            onChange={this.validationFNacimiento}
                                            />
                                            </div>
                                            <p className={(this.state.validationFNacimiento) ? 'textValid': 'textInvalid'}>Campo Obligatorio</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg={6} md={6} sm={12} xs={12}  style={{display:"none"}}>
                                            <Label for="inputCURP">CURP:</Label>
                                            <Input onKeyUp={this.handleCURP} type="text" name="text" id="inputCURP" placeholder="CURP del cliente" />
                                        </Col>
                                        <Col lg={6} md={6} sm={12} xs={12}>
                                            <Label for="exampleCheckbox">*Género</Label>
                                            <div>
                                                <CustomInput onChange={this.handleOnchageGenero} value="H" type="radio" id="radioHombre" name="radioGenero" label="Hombre" inline />
                                                <CustomInput onChange={this.handleOnchageGenero} value="M" type="radio" id="radioMujer" name="radioGenero" label="Mujer" inline />
                                            </div>
                                            <p className={(this.state.validationSexo) ? 'textValid': 'textInvalid'}>Campo Obligatorio</p>
                                        </Col>
                                        
                                    </Row>
                                    <Row>
                                        <Col lg={6} md={6} sm={12} xs={12}  style={{display:"none"}}>
                                            <Label for="inputTel1">Telefono:</Label>
                                            <div>
                                            <Input type="text" name="text" id="inputTel1" placeholder="Teléfono del cliente"/>
                                            </div>
                                        </Col>
                                        <Col lg={6} md={6} sm={12} xs={12}  style={{display:"none"}}>
                                            <Label for="inputCorreo">Correo:</Label>
                                            <Input onKeyUp={this.handleEmail} type="email" name="email" id="inputCorreo" placeholder="Correo Electrónico"/>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.validar}>Guardar</Button>{' '}
                    <Button color="secondary" onClick={this.cancelar}>Cancelar</Button>
                </ModalFooter>
            </div>
        );
    }
  }