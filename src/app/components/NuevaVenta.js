import React from "react";
import ReactDOM from "react-dom";
import ReactWizard from "react-bootstrap-wizard";
//import ReactBootstrap, { Button } from "react-bootstrap";
import { Button, Badge, Container, Col, CustomInput, Card, CardTitle, CardText, Form, FormGroup, Input, Label, Row, Table } from "reactstrap";
import Select from 'react-select';

//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "bootstrap/dist/css/bootstrap.css";
import "../css/wizardStyles.css";
//Componentes Externos
//import ModalNewCliente from "./ModalNewCliente";
import ModalNewDescuento from "./ModalNewDescuento";
import ModalPassword from "./ModalPassword";

import AsientosAutobus from "./asientosAutobus.js"
import GenerarBoleto from "./boletoPDF";

ReactWizard.defaultProps = {
  previousButtonText: "Atrás",
  finishButtonText: "Guardar",
  nextButtonText: "Siguiente",
  progressbar: true
};

//Declaración de variables o constantes globales

//La variable data, almacenará los datos que enviará el formulario
var data = {
  costoBoleto: '100',
  origen: null,
  destino: null,
  cliente: null,
  clienteTipo: null,
  razon: null,
  cambio: null,
  descuento: {
    tipo: null,
    porc: null
  },
  detalles:{
    fechaAbierta: false,
    dia: null,
    hora: null,
    noAsiento: null
  }
};

//Opciones de los Select
var optOrigen = [];
var optDestino = [];
var optRazon = [];
var optTipoDeCambio = [];


//FirstStep
class FirstStep extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      firstStep: "first step here",
      fechaAbierta: false,
    };
    //this.handleFechaAbierta = this.handleFechaAbierta.bind(this);
    this.handleSetOptionsOrigen = this.handleSetOptionsOrigen.bind(this);    
    this.handleSetOptionsDestino = this.handleSetOptionsDestino.bind(this);
    this.handleChangeOrigen = this.handleChangeOrigen.bind(this);
  }

  //Se ejecuta al monar el componente
  componentDidMount(){
    console.log("El componente fue montado con exito");
    this.handleSetOptionsOrigen();
    this.handleSetOptionsDestino();
    //console.log(optOrigen);
  }

  //Establece las opciones del select /* Falta consulta a DB */
  handleSetOptionsOrigen(){
    optOrigen = [
      { value: 'Fresnillo', label: 'Fresnillo' },
      { value: 'Jerez', label: 'Jerez' },
      { value: 'Momax', label: 'Momax' }
    ];
  } 
  handleSetOptionsDestino(){
    optDestino = [
      { value: 'California', label: 'California' },
      { value: 'Texas', label: 'Texas' },
      { value: 'Nuevo Mexico', label: 'Nuevo Mexico' }
    ];
  } 

  //Se ejecuta al cambiar la opcion del select origen
 
  handleChangeOrigen(e){
    data.origen = e.value;
    console.log(data.origen);
  }
  handleChangeDestino(e){
    data.destino = e.value;
    console.log(data.destino);
  }
  
  /*handleFechaAbierta(e){
    console.log(e.target.checked);
  }*/

   render() {
    return  <div>
      <br></br>
      <Row form> 
        <Col lg={6} md={6} sm={12} xs={12}>
          <Label for="selectOrigen">Origen:</Label>
          <Select
            id="selectOrigen"
            onChange={this.handleChangeOrigen}
            options={optOrigen}
            placeholder = "Selecciona..."
          />
        </Col>
        <Col lg={6} md={6} sm={12} xs={12}>          
          <Label for="selectDestino">Destino:</Label>
          <Select
            id="selectDestino"
            onChange={this.handleChangeDestino}
            options={optDestino}
            placeholder = "Selecciona..."
          />
        </Col>
      </Row>
      <br/>
      <Row form> 
        <Col lg={6} md={6} sm={12} xs={12}>
          <FormGroup check>
            <CustomInput onChange={e => this.setState({ fechaAbierta: e.target.checked })} type="switch" id="switchFechaAbierta" name="switchFechaAbierta" label="Fecha abierta" />
          </FormGroup>
        </Col>
      </Row>
      <br/>
      <Row form> 
        <Col lg={6} md={6} sm={12} xs={12}>
          <Label for="inputFecha">Fecha:</Label>
          <Input
            type="date"
            name="date"
            id="inputFecha"
            placeholder="date placeholder"
            disabled = {this.state.fechaAbierta}
          />
        </Col>
        <Col lg={6} md={6} sm={12} xs={12}>
          <Label for="inputHora">Hora:</Label>
          <Input
            type="time"
            name="time"
            id="inputHora"
            placeholder="time placeholder"
            disabled = {this.state.fechaAbierta}
          />
        </Col>
      </Row>
    </div>;
  }
}
//SecondStep
class SecondStep extends React.Component {
  constructor(props) {
    super(props);
    let tipoDeCambio = "MXN";
    this.state = {
      tipoDeCambio,
      precioDeBoleto: null,
      descuento: null,
      descuentoPorc: null,
      total: null
    };
    //Inicializacion de los option
    this.handleSetInitialState = this.handleSetInitialState.bind(this);    
    this.handleSetOptionsRazon = this.handleSetOptionsRazon.bind(this);
    this.handleSetOptionsCambio = this.handleSetOptionsCambio.bind(this);
    //Onchanges
    this.handleOnChangeRazon = this.handleOnChangeRazon.bind(this);
    this.handleOnChangeTipoDeCambio = this.handleOnChangeTipoDeCambio.bind(this);
    this.handleOnChangeDescuento = this.handleOnChangeDescuento.bind(this);
    //Funciones
  }

  //Se ejecuta al montar el componente
  componentDidMount(){
    this.handleSetOptionsRazon();
    this.handleSetOptionsCambio();
    this.handleSetInitialState();
  }

  //Valores de los option obtenidos de la DB
  handleSetOptionsRazon(){
    optRazon = [
      { value: 'Ciudadano', label: 'Ciudadano' },
      { value: 'Residente', label: 'Residente' },
      { value: 'Visa', label: 'Visa' }
    ];
  } 

  handleSetOptionsCambio(){
    optTipoDeCambio = [
      { value: 'MXN', label: 'MXN' },
      { value: 'US', label: 'US' }
    ];
  } 

  handleSetInitialState(){
    this.setState({
      tipoDeCambio: "MXN",
      descuento: 0,
      precioDeBoleto: 100, 
      total: 100     
    });
  }

  //Handle Changes del los select
  handleOnChangeCliente(value){
    data.cliente = value;
    console.log(data.cliente);
  }
  handleOnChangeRazon(e){
    data.razon = e.value;
    console.log(data.razon);
  }
  handleOnChangeTipoDeCambio(e){
    //console.log(e.target.value);
    data.cambio = e.target.value;
    this.setState({
      tipoDeCambio: e.target.value,
      precioDeBoleto: 100
    });
    //Falta modificar tambien el precio al cambiar el tipo de cambio
    //console.log(data.cambio);
  }
  handleOnChangeDescuento(value, porc){
    data.descuento.tipo = value;
    data.descuento.porc = porc;
    this.setState({
      descuentoPorc: porc,
      descuento: parseFloat(this.state.precioDeBoleto*(porc/100)),
      total: parseFloat(this.state.precioDeBoleto-(this.state.precioDeBoleto*(porc/100)))
    });
  }

  isValidated() {
    // do some validations
    // decide if you will
    return true;
    // or you will
    // return false;
  }
  render() {
    return <div>
      <br/>
      <Row form>
        <Col lg={6} md={6} sm={12} xs={12}>
          {/*<ModalNewCliente onChangeCliente={this.handleOnChangeCliente}></ModalNewCliente>*/}
        </Col>
        <Col lg={6} md={6} sm={12} xs={12}>
          <Label for="selectTipoCliente">Razón:</Label>
          <Select
            id="selectTipoCliente"
            onChange={this.handleOnChangeRazon}
            options={optRazon}
            placeholder = "Selecciona..."
          />
        </Col>
      </Row>
      <Row form>
        <Col lg={6} md={6} sm={12} xs={12}>
          <Row form>
            <Col lg={12} md={12} sm={12} xs={12}>
              <FormGroup>
                  <Label>Tipo de Cambio:</Label><br/>
                  <div>
                    <CustomInput type="radio" id="radioUS" name="radioCambio" value="US" label="US" onChange={this.handleOnChangeTipoDeCambio} inline />
                    <CustomInput type="radio" id="radioMXN" name="radioCambio" value="MXN" label="MXN" onChange={this.handleOnChangeTipoDeCambio} defaultChecked inline />
                  </div>
                </FormGroup>
            </Col>
            <Col lg={12} md={12} sm={12} xs={12}>
              <ModalNewDescuento onChangeDescuento={this.handleOnChangeDescuento}></ModalNewDescuento>
            </Col>            
          </Row>
        </Col>
        <Col lg={6} md={6} sm={12} xs={12}>
          <Table bordered>
            <tbody>
              <tr>
                <th scope="row">Subtotal</th>
                <td className="text-right">{this.state.tipoDeCambio+" $"+this.state.precioDeBoleto}</td>
              </tr>
              <tr>
                <th scope="row">Descuento {this.state.descuentoPorc}%</th>
                <td className="text-right">${this.state.descuento}</td>
              </tr>
              <tr>
                <th scope="row">Total</th>
                <td className="text-right">${this.state.total}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </div>;
  }
}
//ThirdStep
class ThirdStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      thirdStep: "third step here"
    };
  }
  render() {
    return <div>
     <AsientosAutobus/>
    </div>;
  }
}
//FourthStep
class FourthStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: null
    };
  }
  render() {
    return <div>
      <br/>
      <h3>Resumen de Venta</h3>
      <Form>
        <Row form>
          <Col lg={4} md={4} sm={12} xs={12}>
            Cliente: <br/> {this.state.mounted} <Badge color="info">Adulto</Badge>
          </Col>
          <Col lg={4} md={4} sm={12} xs={12}>
            Razón: <br/> Residente 
          </Col>
          <Col lg={4} md={4} sm={12} xs={12}>
            Descuento: <br/> Estudiante 15% 
          </Col>
        </Row>
        <Row>
          <Col lg={6} md={6} sm={12} xs={12}>
            Origen: <br/> Fresnillo, Zacatecas; Mexico
          </Col>
          <Col lg={6} md={6} sm={12} xs={12}>
            Destino: <br/> San Antonio, Texas; Estados Unidos 
          </Col>
        </Row>
        <Row>
          <Col lg={4} md={4} sm={12} xs={12}>
            Dia: <br/> 19 de abril del 2019 
          </Col>
          <Col lg={4} md={4} sm={12} xs={12}>
            Hora: <br/> 01:43 p.m. 
          </Col>
          <Col lg={4} md={4} sm={12} xs={12}>
            No. Asiento: <br/> 01 
          </Col>
        </Row>
        <Row>
          <Col md={{ size: 6, offset: 6 }} lg={{ size: 6, offset: 6 }} sm={12} xs={12}>
            <Table bordered>
              <tbody>
                <tr>
                  <th scope="row">Subtotal</th>
                  <td>US $100.0</td>
                </tr>
                <tr>
                  <th scope="row">Descuento 15%</th>
                  <td>US $15.0</td>
                </tr>
                <tr>
                  <th scope="row">
                    <CustomInput type="switch" id="switchIVA" name="switchIVA" label="IVA" />
                  </th>
                  <td>US $16.0</td>
                </tr>
                <tr>
                  <th scope="row">Total</th>
                  <td>US $131.0</td>
                </tr>
              </tbody>
            </Table>
            <br/>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12}>
                <FormGroup>
                  <Label for="inputPago">Pago</Label>
                  <Input type="text" name="inputPago" id="inputPago" placeholder="$0.0" />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12}>
                <FormGroup>
                  <Label for="inputCambio">Cambio</Label>
                  <Input type="text" name="inputCambio" id="inputCambio" placeholder="$0.0" />
                </FormGroup>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </div>;
  }
}

var steps = [
  // this step hasn't got a isValidated() function, so it will be considered to be true
  { 
    stepName: "Datos de viaje", 
    stepIcon: "fas fa-map-marker-alt",
    component: FirstStep 
  },
  // this step will be validated to false
  { 
    stepName: "Datos del cliente", 
    stepIcon: "fas fa-user",
    component: SecondStep 
  },
  // this step will never be reachable because of the seconds isValidated() steps function that will always return false
  { 
    stepName: "No. de Asiento", 
    stepIcon: "fas fa-bus-alt",
    component: ThirdStep 
  },
  { 
    stepName: "Resumen y cobro", 
    stepIcon: "fas fa-clipboard-check",
    component: FourthStep 
  }
];

class WizardExample extends React.Component {
  finishButtonClick(allStates) {
    //Aqui va la creación del boleto y el registro a la DB
    console.log("Boleto generado");
    GenerarBoleto();
  }
  render() {
    return (
      <div>
        <Container fluid style={{ marginTop: "15px" }}>
          <Row>
            <Col xs={12} md={12} className="mr-auto ml-auto">
              <ReactWizard
                steps={steps}
                navSteps
                title="VENTA DE BOLETOS"
                description=""
                headerTextCenter
                validate
                color="green"
                finishButtonClick={this.finishButtonClick}
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default WizardExample;