import React from "react";
import ReactDOM from "react-dom";
import ReactWizard from "react-bootstrap-wizard";

//import ReactBootstrap, { Button } from "react-bootstrap";
import { Button, Badge, Container, Col, CustomInput, Card, CardTitle, CardText, Form, FormGroup, FormText, Input, Label, Modal, ModalHeader, ModalBody, ModalFooter, Row, Table } from "reactstrap";
import Select from 'react-select';
import AsyncSelect from 'react-select/lib/Async';

//STYLES
import "bootstrap/dist/css/bootstrap.css";
import "../css/wizardStyles.css";
import "../css/validaciones.css";

//Componentes Externos
import ModalNewDescuento from './ModalNewDescuento.js'
import AsientosAutobus from "./asientosAutobus.js"
import GenerarBoleto from "./boletoPDF";
import WizardCliente from "./TabNewCliente.js";


//Configuracion del Wizard
ReactWizard.defaultProps = {
  previousButtonText: "Atrás",
  finishButtonText: "Guardar",
  nextButtonText: "Siguiente",
  progressbar: true
};

//Declaración de variables o constantes globales

//La variable data, almacenará los datos que enviará el formulario
var data = {
  costoBoleto: 100, //Precio en Dollar
  precioDollar: 19, 
  origen: {
    id: null,
    ciudad: null,
    estado: null,
    pais: null
  },
  destino: {
    id: null,
    ciudad: null,
    estado: null,
    pais: null
  },
  //fechahora: null,
  cliente: null,
  clienteTipo: null,
  razon: null,
  cambio: 'US',
  //total: '100',
  descuento: {
    tipo: 'Ninguno',
    porc: 0
  },
  cobro: {
    subtotal: 100,
    descuento: 0,
    iva: 0,
    total: 100
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
var optDescuento = [];
var optRazon = [];
var optTipoDeCambio = [];
var optFechaHora = [];
var optCliente = [];
var asientosCamion = [];
var cont = 0;


//FirstStep
class FirstStep extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      firstStep: "first step here",
      fechaAbierta: false,
      validationOrigen: true,
      validationDestino: true,
      validationFechaHora: true
    };
    //this.handleFechaAbierta = this.handleFechaAbierta.bind(this);
    this.handleSetOptionsOrigen = this.handleSetOptionsOrigen.bind(this);    
    this.handleSetOptionsDestino = this.handleSetOptionsDestino.bind(this);
    this.handleSetOptionsFechaHora = this.handleSetOptionsFechaHora.bind(this);

    this.handleChangeDestino = this.handleChangeDestino.bind(this);
    this.handleChangeOrigen = this.handleChangeOrigen.bind(this);
    this.handleChangeFechaHora = this.handleChangeFechaHora.bind(this);
    this.handleChangeFechaAbierta = this.handleChangeFechaAbierta.bind(this);
  }

  //Para validar esta parte del formulario
  isValidated() {
    if(data.origen.id == null){
      this.setState({
        validationOrigen: false
      })
    }

    if(data.destino.id == null){
      this.setState({
        validationDestino: false
      })
    }

    if(!this.state.fechaAbierta && data.fechahora == null){
      this.setState({
        validationFechaHora: false
      })
    }

    if(this.state.fechaAbierta){
      if(data.origen == null || data.destino == null){
        return false;
      }else{
        return true;
      }
    }else{
      if(data.origen == null || data.destino == null || data.fechahora == null){
        return false;
      }else{
        return true;
      }
    }
  }  

  //Se ejecuta al montar el componente
  componentDidMount(){
    console.log("El componente fue montado con exito");
    this.handleSetOptionsOrigen();
    //this.handleSetOptionsDestino();
    this.handleSetOptionsFechaHora();
    //console.log(optOrigen);
  }

  //Establece las opciones del select /* Falta consulta a DB */
  handleSetOptionsOrigen(){
    optOrigen = [
      { value: '1', label: 'Fresnillo', estado: 'Zacatecas', pais: 'MX' },
      { value: '2', label: 'Jerez', estado: 'Zacatecas', pais: 'MX' },
      { value: '3', label: 'Momax', estado: 'Zacatecas', pais: 'MX' },
      { value: '4', label: 'Los Angeles', estado: 'California', pais: 'EU'},
      { value: '5', label: 'El Paso', estado: 'Texas', pais: 'EU' },
      { value: '6', label: 'Palo Alto', estado: 'Nuevo Mexico', pais: 'EU' }
    ];
  } 
  handleSetOptionsDestino(pais){
    if(pais == 'MX'){
      optDestino = [
        { value: '1', label: 'Fresnillo', estado: 'Zacatecas', pais: 'MX' },
        { value: '2', label: 'Jerez', estado: 'Zacatecas', pais: 'MX' },
        { value: '3', label: 'Momax', estado: 'Zacatecas', pais: 'MX' },
      ];
    }else{
      optDestino = [
        { value: '4', label: 'Los Angeles', estado: 'California', pais: 'EU'},
        { value: '5', label: 'El Paso', estado: 'Texas', pais: 'EU' },
        { value: '6', label: 'Palo Alto', estado: 'Nuevo Mexico', pais: 'EU' }
      ];
    }    
  } 
  handleSetOptionsFechaHora(){
    optFechaHora = [
      { value: '1', label: '10/06/2019 - 06:00am', fecha: '10/06/2019', hora: '06:00am'  },
      { value: '2', label: '11/06/2019 - 06:00am', fecha: '11/06/2019', hora: '06:00am' },
      { value: '3', label: '12/06/2019 - 06:00am', fecha: '12/06/2019', hora: '06:00am' }
    ];
  }

  //Se ejecuta al cambiar la opcion del select origen
 
  handleChangeOrigen(e){
    data.origen.id = e.value;
    data.origen.ciudad = e.label;
    data.origen.estado = e.estado;
    data.origen.pais = e.pais;
    this.setState({
      validationOrigen: true
    });
    let pais = (e.pais == 'MX')? 'EU' : 'MX';
    this.handleSetOptionsDestino(pais);
    //console.log(data.origen);
  }
  handleChangeDestino(e){
    data.destino.id = e.value;
    data.destino.ciudad = e.label;
    data.destino.estado = e.estado;
    data.destino.pais = e.pais;
    this.setState({
      validationDestino: true
    })
    //console.log(data.destino);
  }
  handleChangeFechaHora(e){
    data.detalles.dia = e.fecha;
    data.detalles.hora = e.hora;
    //data.fechahora = e.value;
    //Aqui tenemos que consultar a la DB cuales son los asientos disponibles
    asientosCamion = [
      {id: '1', status: true},
      {id: '2', status: true},
      {id: '3', status: true},
      {id: '4', status: false},
      {id: '5', status: false},
      {id: '6', status: false},
      {id: '7', status: false},
      {id: '8', status: false},
      {id: '9', status: false},
      {id: '10', status: false},
      {id: '11', status: false},
      {id: '12', status: false},
      {id: '13', status: false},
      {id: '14', status: false},
      {id: '15', status: false},
      {id: '16', status: false},
      {id: '17', status: false},
      {id: '18', status: true},
      {id: '19', status: false},
      {id: '20', status: false},
      {id: '21', status: false},
      {id: '22', status: false},
      {id: '23', status: false},
      {id: '24', status: false},
      {id: '25', status: false},
      {id: '26', status: false},
      {id: '27', status: false},
      {id: '28', status: false},
      {id: '29', status: false},
      {id: '30', status: false},
      {id: '31', status: false},
      {id: '32', status: false},
      {id: '33', status: false},
      {id: '34', status: false},
      {id: '35', status: false},
      {id: '36', status: false},
      {id: '37', status: false},
      {id: '38', status: false},
      {id: '39', status: false},
      {id: '40', status: false},
    ]; 

    this.setState({
      validationFechaHora: true,
    });    
  }
  
  handleChangeFechaAbierta(e){
    this.setState({ 
      fechaAbierta: e.target.checked,
      validationFechaHora: true 
    });
    data.detalles.fechaAbierta = e.target.checked
  }

   render() {
    return  <div>
      <br></br>
      <Row form> 
        <Col lg={6} md={6} sm={12} xs={12}>
          <Label for="selectOrigen">Origen:</Label>
          <div class={(this.state.validationOrigen) ? 'card border-light': 'card border-danger'}>
            <Select
              id="selectOrigen"
              onChange={this.handleChangeOrigen}
              options={optOrigen}
              placeholder = "Selecciona..."
            />
          </div>
          <p class={(this.state.validationOrigen) ? 'textValid': 'textInvalid'}>Selecciona el origen</p>
        </Col>
        <Col lg={6} md={6} sm={12} xs={12}>          
          <Label for="selectDestino">Destino:</Label>
          <div class={(this.state.validationDestino) ? 'card border-light': 'card border-danger'}>
            <Select
              id="selectDestino"
              onChange={this.handleChangeDestino}
              options={optDestino}
              placeholder = "Selecciona..."
            />
          </div>
          <p class={(this.state.validationDestino) ? 'textValid': 'textInvalid'}>Selecciona el destino</p>
        </Col>
      </Row>
      <br/>
      <Row form> 
        <Col lg={6} md={6} sm={12} xs={12}>
          <FormGroup check>
            <CustomInput onChange={this.handleChangeFechaAbierta} type="switch" id="switchFechaAbierta" name="switchFechaAbierta" label="Fecha abierta" />
          </FormGroup>
        </Col>
      </Row>
      <br/>
      <Row form> 
        <Col lg={6} md={6} sm={12} xs={12}>
          <Label for="selectFechaHora">Fecha y Hora:</Label>
          <div class={(this.state.validationFechaHora) ? 'card border-light': 'card border-danger'}>
            <Select
              id="selectFechaHora"
              isDisabled={this.state.fechaAbierta}
              onChange={this.handleChangeFechaHora}
              options={optFechaHora}
              isSearchable={false}
              placeholder = "Selecciona..."
            />
          </div>
          <p class={(this.state.validationFechaHora) ? 'textValid': 'textInvalid'}>Selecciona la fecha y hora</p>
        </Col>
      </Row>
    </div>;
  }
}

//SecondStep
class SecondStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //Variables de control
      tipoDeCambio: null,
      precioDeBoleto: null,
      descuento: null,
      descuentoPorc: null,
      total: null,
      //Variables de validacion
      validationRazon: true,
      validationCliente: true,
      //Variables de control MODALS
      modal: false
    };
    //Funciones
    this.toggle = this.toggle.bind(this);
    //Inicializacion de los option
    this.handleSetInitialState = this.handleSetInitialState.bind(this);    
    this.handleSetOptionsRazon = this.handleSetOptionsRazon.bind(this);
    this.handleSetOptionsCambio = this.handleSetOptionsCambio.bind(this);
    this.handleSetOptionsCliente = this.handleSetOptionsCliente.bind(this);
    //Onchanges 
    this.handleOnChangeRazon = this.handleOnChangeRazon.bind(this);
    this.handleOnChangeTipoDeCambio = this.handleOnChangeTipoDeCambio.bind(this);
    this.handleOnChangeDescuento = this.handleOnChangeDescuento.bind(this);
    this.handleOnChangeCliente = this.handleOnChangeCliente.bind(this);
    this.obtainTotal = this.obtainTotal.bind(this);
    this.obtainDescuento = this.obtainDescuento.bind(this);
    this.handleSetOptionsDescuentos = this.handleSetOptionsDescuentos.bind(this);
    
  }

  isValidated() {
    if(data.razon == null){
      this.setState({
        validationRazon: false
      })
    }

    if(data.cliente == null){
      this.setState({
        validationCliente: false
      })
    }

    if(data.razon == null || data.cambio == null || data.cliente == null){
      return false;
    }else{
      return true;
    } 
  }

  //Se ejecuta al montar el componente
  componentDidMount(){
    this.handleSetOptionsRazon();
    this.handleSetOptionsCambio();
    this.handleSetOptionsCliente();
    this.handleSetOptionsDescuentos();
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
      tipoDeCambio: data.cambio,
      descuento: data.descuento.porc,
      precioDeBoleto: data.costoBoleto, 
      total: data.costoBoleto     
    });
  }

  handleSetOptionsCliente(){
    optCliente = [
      { value: 'Jorge Alberto Rodríguez Euan', label: 'Jorge Alberto Rodríguez Euan', color: '#4C76FF', type: 'Adulto' },
      { value: 'Tlali Yunuen Enciso Ríos', label: 'Tlali Yunuen Enciso Ríos', color: '#FF7F70', type: 'Niño' },
      { value: 'Humberto Enciso Frausto', label: 'Humberto Enciso Frausto', color: '#A466E8', type: 'Adulto Mayor' }
    ];
  } 

  handleSetOptionsDescuentos(){
    optDescuento = [
      { value: 'Ninguno', label: 'Ninguno', desc: '0' },
      { value: 'Niño', label: 'Niño', desc: '10' },
      { value: 'Estudiante', label: 'Estudiante', desc: '25' },
      { value: 'INSEN', label: 'INSEN', desc: '20' }
    ];
  } 

  //Handle Changes del los select
  handleOnChangeCliente(e){
    data.cliente = e.value;
    data.clienteTipo = e.type;
    console.log(data.cliente);
    console.log(data.clienteTipo);
    this.setState({
      validationCliente: true
    });
  }
  handleOnChangeRazon(e){
    data.razon = e.value;
    this.setState({
      validationRazon: true
    })
  }
  handleOnChangeTipoDeCambio(e){
    console.log(e.target.value);
    let cambio = data.cambio;
    let precioDeBoleto = (cambio == 'US')? data.costoBoleto : parseFloat(data.precioDollar*data.costoBoleto);
    let descuento = this.obtainDescuento(e.target.value);
    let total = this.obtainTotal(e.target.value);
    this.setState({
      tipoDeCambio: e.target.value,
      descuento: this.obtainDescuento(e.target.value),
      precioDeBoleto: (cambio == 'US')? data.costoBoleto : parseFloat(data.precioDollar*data.costoBoleto),
      total: this.obtainTotal(e.target.value)
    });
    
    //Asignaciones en la variable data

    data.cambio = e.target.value;
    data.cobro.subtotal = precioDeBoleto;
    data.cobro.descuento = descuento;
    data.cobro.total = total;
  }

  handleOnChangeDescuento(value, porc){
    let boleto = this.state.precioDeBoleto;
    let tipoDeCambio = this.state.tipoDeCambio;
    let total = this.obtainTotal(tipoDeCambio);
    let descuento = this.obtainDescuento(tipoDeCambio);

    this.setState({
      descuentoPorc: porc,
      descuento: this.obtainDescuento(tipoDeCambio),
      total: this.obtainTotal(tipoDeCambio)
    });

    //Asignaciones en la variable data

    data.descuento.tipo = value;
    data.descuento.porc = porc;
    data.cobro.total = total;
    data.cobro.descuento = descuento;
  }

  obtainDescuento(tipoDeCambio){
    let total = data.costoBoleto * (data.descuento.porc/100);
    if(tipoDeCambio == 'US'){
      return total;
    }else{
      return total * data.precioDollar;
    }
  }

  obtainTotal(tipoDeCambio){
    let total = data.costoBoleto - (data.costoBoleto * (data.descuento.porc/100));
    if(tipoDeCambio == 'US'){
      return total;
    }else{
      return total * data.precioDollar;
    }

  }

  /* Metodos del modal */
  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  
  // Aquí está todo el código de la parte gráfica
  render() {
    /* CODIGO PARA CONFIGURACION DEL SELECT DE CLIENTES */
    const filterClientes = (inputValue) => {
      return optCliente.filter(i =>
          i.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    };
    
    const promiseOptions = inputValue =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve(filterClientes(inputValue));
        }, 1000);
    });
    
    const dot = (color) => ({
      
      alignItems: 'center',
      display: 'flex',
    
      ':before': {
        backgroundColor: color,
        borderRadius: 10,
        content: '" "',
        display: 'block',
        marginRight: 8,
        height: 10,
        width: 10,
      },
    });
    
    const colourStyles = {
      control: styles => ({ ...styles, backgroundColor: 'white' }),
      option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        const color = data.color;
        return{
          ...styles,
          color
        }
      },
      input: styles => ({ ...styles, ...dot() }),
      placeholder: styles => ({ ...styles, ...dot() }),
      singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
    };

    /* FIN CODIGO PARA CONFIGURACION DEL SELECT DE CLIENTES */
    
    return <div>
      <br/>
      <Row form>
        <Col lg={6} md={6} sm={12} xs={12}>
          <FormGroup>
            <Button className="mt-n2" color="link" onClick={this.toggle}><i className="fa fa-plus-circle"/></Button><Label for="selectCliente">Cliente</Label>
            <div class={(this.state.validationCliente) ? 'card border-light': 'card border-danger'}>
              <AsyncSelect 
              id="selectCliente"
              placeholder = "Selecciona..."              
              cacheOptions 
              onChange = {this.handleOnChangeCliente}
              options={optCliente} 
              loadOptions={promiseOptions} 
              styles={colourStyles}/>
            </div>
            <p class={(this.state.validationCliente) ? 'textValid': 'textInvalid'}>Selecciona un cliente</p>
          </FormGroup>

          {/* MODAL NUEVO CLIENTE */}
          <Modal isOpen={this.state.modal} toggle={this.toggle}>
            <ModalHeader toggle={this.toggle}>Nuevo Cliente</ModalHeader>
            <ModalBody>
              <WizardCliente></WizardCliente>
            </ModalBody>
          </Modal>
          {/* FIN MODAL NUEVO CLIENTE */}

        </Col>
        <Col lg={6} md={6} sm={12} xs={12}>
        <Label for="selectRazon">Razon:</Label>
          <div class={(this.state.validationRazon) ? 'card border-light': 'card border-danger'}>
            <Select
              id="selectRazon"
              isSearchable={false}
              onChange={this.handleOnChangeRazon}
              options={optRazon}
              placeholder = "Selecciona..."
            />
          </div>
          <p class={(this.state.validationRazon) ? 'textValid': 'textInvalid'}>Selecciona la razón</p>
        </Col>
      </Row>
      <Row form>
        <Col lg={6} md={6} sm={12} xs={12}>
          <Row form>
            <Col lg={12} md={12} sm={12} xs={12}>
              <FormGroup>
                  <Label>Tipo de Cambio:</Label><br/>
                  <div>
                    <CustomInput type="radio" id="radioUS" name="radioCambio" value="US" label="US" onChange={this.handleOnChangeTipoDeCambio} defaultChecked inline />
                    <CustomInput type="radio" id="radioMX" name="radioCambio" value="MX" label="MX" onChange={this.handleOnChangeTipoDeCambio} inline />
                  </div>
                </FormGroup>
            </Col>
            <Col lg={12} md={12} sm={12} xs={12}>
            <Label for="selectRazon">Descuento:</Label>
              <div class={(this.state.validationRazon) ? 'card border-light': 'card border-danger'}>
                <Select
                  id="selectDescuento"
                  isSearchable={false}
                  defaultValue={{ value: 'Ninguno', label: 'Ninguno', desc: '0' }}
                  onChange={this.handleOnChangeDescuento}
                  options={optDescuento}
                  placeholder = "Selecciona..."
                />
              </div>
              <p class={(this.state.validationRazon) ? 'textValid': 'textInvalid'}>Selecciona la razón</p>
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
                <td className="text-right">{this.state.tipoDeCambio+" $"+this.state.total}</td>
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
      thirdStep: "third step here",
      comprobar: false,
      fechaAbierta: false,
      noAsiento: null,
      noAsientos: null,
      cont: 0,
      asiento1: null,
      asiento2: null,
      asiento3: null,
      asiento4: null,
      asiento5: null,
      asiento6: null,
      asiento7: null,
      asiento8: null,
      asiento9: null,
      asiento10: null,
      asiento11: null,
      asiento12: null,
      asiento13: null,
      asiento14: null,
      asiento15: null,
      asiento16: null,
      asiento17: null,
      asiento18: null,
      asiento19: null,
      asiento20: null,
      asiento21: null,
      asiento22: null,
      asiento23: null,
      asiento24: null,
      asiento25: null,
      asiento26: null,
      asiento27: null,
      asiento28: null,
      asiento29: null,
      asiento30: null,
      asiento31: null,
      asiento32: null,
      asiento33: null,
      asiento34: null,
      asiento35: null,
      asiento36: null,
      asiento37: null,
      asiento38: null,
      asiento39: null,
      asiento40: null,
    };
    this.handleClickComprobar = this.handleClickComprobar.bind(this);
    this.handleSelectAsiento = this.handleSelectAsiento.bind(this);
  }  

  handleClickComprobar(){
    console.log(typeof(data.detalles.fechaAbierta));
    if(data.detalles.fechaAbierta){
      this.setState({
        comprobar:true,
        fechaAbierta: true,
      })
    }else{
        this.setState({
        comprobar:true,
        fechaAbierta: false,
        asiento1: asientosCamion[0].status,
        asiento2: asientosCamion[1].status,
        asiento3: asientosCamion[2].status,
        asiento4: asientosCamion[3].status,
        asiento5: asientosCamion[4].status,
        asiento6: asientosCamion[5].status,
        asiento7: asientosCamion[6].status,
        asiento8: asientosCamion[7].status,
        asiento9: asientosCamion[8].status,
        asiento10: asientosCamion[9].status,
        asiento11: asientosCamion[10].status,
        asiento12: asientosCamion[11].status,
        asiento13: asientosCamion[12].status,
        asiento14: asientosCamion[13].status,
        asiento15: asientosCamion[14].status,
        asiento16: asientosCamion[15].status,
        asiento17: asientosCamion[16].status,
        asiento18: asientosCamion[17].status,
        asiento19: asientosCamion[18].status,
        asiento20: asientosCamion[19].status,
        asiento21: asientosCamion[20].status,
        asiento22: asientosCamion[21].status,
        asiento23: asientosCamion[22].status,
        asiento24: asientosCamion[23].status,
        asiento25: asientosCamion[24].status,
        asiento26: asientosCamion[25].status,
        asiento27: asientosCamion[26].status,
        asiento28: asientosCamion[27].status,
        asiento29: asientosCamion[28].status,
        asiento30: asientosCamion[29].status,
        asiento31: asientosCamion[30].status,
        asiento32: asientosCamion[31].status,
        asiento33: asientosCamion[32].status,
        asiento34: asientosCamion[33].status,
        asiento35: asientosCamion[34].status,
        asiento36: asientosCamion[35].status,
        asiento37: asientosCamion[36].status,
        asiento38: asientosCamion[37].status,
        asiento39: asientosCamion[38].status,
        asiento40: asientosCamion[39].status,
      })
    }
    //console.log(asientosCamion[0]);
  }

  handleSelectAsiento(e){
    
    //Primero verificamos que anteriormente no haya algun asiento ya seleccionado
    //En caso de que ya este seleccionado alguno, procedemos a regresar a su estado original
    let id = e.target.id;
    data.detalles.noAsiento = id;
    this.setState({
      noAsiento: id
    })
    console.log(data.detalles.noAsiento);
  }

  render() {
    return (
      <div className="text-center">
        <div>
          {/* Simbologia */}
          <Row>
            <Col md="4" xs="4" sm="4" lg="4">
                <Button outline color="danger"><i className="fa fa-check" /></Button>{' '}
            </Col>
            <Col md="4" xs="4" sm="4" lg="4">
                <Button color="secondary" disabled><i className="fa fa-user" /></Button>
            </Col>
            <Col md="4" xs="4" sm="4" lg="4">
                <Button color="danger" size="lg" className="asientoDisponible asiento">{'  '}</Button>
            </Col>
          </Row>
          <Row>
            <Col md="4" xs="4" sm="4" lg="4">
                <h6>Selecionado</h6>
            </Col>
            <Col md="4" xs="4" sm="4" lg="4">
                <h6>Ocupado</h6>
            </Col>
            <Col md="4" xs="4" sm="4" lg="4">
                <h6>Libre</h6>
            </Col>
          </Row>
          {/* Fin Simbologia */}
          <br/>
          <Row>
            <Col md="12" xs="12" sm="12" lg="12">
              <div>
                <Card body outline color="secondary"  className="text-center">
                  <CardTitle>Seleccione el lugar</CardTitle>
                  <br/>
                  <div>
                    <Button onClick={this.handleClickComprobar} size="lg" outline color="info">Actualizar</Button>
                  </div>
                  <br/>
                  <Col xs="12" sm="12" md={{ size:9, offset:3 }} lg={{ size:9, offset:3 }}>
                    
                    {/* Asientos */}
                    {
                      (this.state.fechaAbierta)? 
                      (
                        <h6>La reservación de asientos no está disponible para fecha abierta.
                          <br/>
                          Click en siguiente para continuar
                        </h6>
                      )
                      :
                      (
                          <div>
                            {/* Elementos CHOFER y ESCALERAS */}
                            <Row>
                              <Col xs="2" sm="1" className="elementosAutobus">
                                  <i className="fa fa-user-tie" />
                              </Col>
                              <Col xs="2" sm="1">
                              </Col>
                              <Col xs="3">
                              </Col>
                              <Col xs="2" sm="1">
                              </Col>
                              <Col xs="2" sm="1" className="elementosAutobus">
                                  <i className="fa fa-sort-amount-down" />
                              </Col>
                            </Row>
                            {/* TERMINA Elementos CHOFER y ESCALERAS */}
                          <Row>
                            <Col xs="2" sm="1">
                                {(this.state.asiento1) ? 
                                  (
                                    (this.state.noAsiento == 1)?
                                    (
                                      <Button outline color="danger"><i className="fa fa-check" /></Button>
                                    )
                                    :
                                    (
                                      <Button id='1' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                    )
                                  )
                                  :
                                  (
                                    <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                  )
                                }
                                <p className="smallDevice text-center">01</p>
                            </Col>
                            <Col xs="2" sm="1">
                                {(this.state.asiento2) ? 
                                  (
                                    (this.state.noAsiento == 2)?
                                    (
                                      <Button outline color="danger"><i className="fa fa-check" /></Button>
                                    )
                                    :
                                    (
                                      <Button id='2' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                    )
                                  )
                                  :
                                  (
                                    <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                  )
                                }
                                <p className="smallDevice text-center">02</p>
                            </Col>
                            <Col xs="3">
                            </Col>
                            <Col xs="2" sm="1">
                                {(this.state.asiento3) ? 
                                  (
                                    (this.state.noAsiento == 3)?
                                    (
                                      <Button outline color="danger"><i className="fa fa-check" /></Button>
                                    )
                                    :
                                    (
                                      <Button id='3' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                    )
                                  )
                                  :
                                  (
                                    <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                  )
                                }
                                <p className="smallDevice text-center">03</p>
                            </Col>
                            <Col xs="2" sm="1">
                                {(this.state.asiento4) ? 
                                  (
                                    (this.state.noAsiento == 4)?
                                    (
                                      <Button outline color="danger"><i className="fa fa-check" /></Button>
                                    )
                                    :
                                    (
                                      <Button id='4' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                    )
                                  )
                                  :
                                  (
                                    <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                  )
                                }
                                <p className="smallDevice text-center">04</p>
                            </Col>
                          </Row>
                          <Row>
                            <Col xs="2" sm="1">
                                {(this.state.asiento5) ? 
                                  (
                                    (this.state.noAsiento == 5)?
                                    (
                                      <Button outline color="danger"><i className="fa fa-check" /></Button>
                                    )
                                    :
                                    (
                                      <Button id='5' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                    )
                                  )
                                  :
                                  (
                                    <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                  )
                                }
                                <p className="smallDevice text-center">05</p>
                            </Col>
                            <Col xs="2" sm="1">
                                {(this.state.asiento6) ? 
                                  (
                                    (this.state.noAsiento == 6)?
                                    (
                                      <Button outline color="danger"><i className="fa fa-check" /></Button>
                                    )
                                    :
                                    (
                                      <Button id='6' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                    )
                                  )
                                  :
                                  (
                                    <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                  )
                                }
                                <p className="smallDevice text-center">06</p>
                            </Col>
                            <Col xs="3">
                            </Col>
                            <Col xs="2" sm="1">
                                {(this.state.asiento7) ? 
                                  (
                                    (this.state.noAsiento == 7)?
                                    (
                                      <Button outline color="danger"><i className="fa fa-check" /></Button>
                                    )
                                    :
                                    (
                                      <Button id='7' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                    )
                                  )
                                  :
                                  (
                                    <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                  )
                                }
                                <p className="smallDevice text-center">07</p>
                            </Col>
                            <Col xs="2" sm="1">
                                {(this.state.asiento8) ? 
                                  (
                                    (this.state.noAsiento == 8)?
                                    (
                                      <Button outline color="danger"><i className="fa fa-check" /></Button>
                                    )
                                    :
                                    (
                                      <Button id='8' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                    )
                                  )
                                  :
                                  (
                                    <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                  )
                                }
                                <p className="smallDevice text-center">08</p>
                            </Col>
                          </Row>
                          <Row>
                            <Col xs="2" sm="1">
                                {(this.state.asiento9) ? 
                                  (
                                    (this.state.noAsiento == 9)?
                                    (
                                      <Button outline color="danger"><i className="fa fa-check" /></Button>
                                    )
                                    :
                                    (
                                      <Button id='9' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                    )
                                  )
                                  :
                                  (
                                    <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                  )
                                }
                                <p className="smallDevice text-center">09</p>
                            </Col>
                            <Col xs="2" sm="1">
                                {(this.state.asiento10) ? 
                                  (
                                    (this.state.noAsiento == 10)?
                                    (
                                      <Button outline color="danger"><i className="fa fa-check" /></Button>
                                    )
                                    :
                                    (
                                      <Button id='10' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                    )
                                  )
                                  :
                                  (
                                    <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                  )
                                }
                                <p className="smallDevice text-center">10</p>
                            </Col>
                            <Col xs="3">
                            </Col>
                            <Col xs="2" sm="1">
                                {(this.state.asiento11) ? 
                                  (
                                    (this.state.noAsiento == 11)?
                                    (
                                      <Button outline color="danger"><i className="fa fa-check" /></Button>
                                    )
                                    :
                                    (
                                      <Button id='11' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                    )
                                  )
                                  :
                                  (
                                    <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                  )
                                }
                                <p className="smallDevice text-center">11</p>
                            </Col>
                            <Col xs="2" sm="1">
                                {(this.state.asiento12) ? 
                                  (
                                    (this.state.noAsiento == 12)?
                                    (
                                      <Button outline color="danger"><i className="fa fa-check" /></Button>
                                    )
                                    :
                                    (
                                      <Button id='12' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                    )
                                  )
                                  :
                                  (
                                    <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                  )
                                }
                                <p className="smallDevice text-center">12</p>
                            </Col>
                          </Row>
                          <Row>
                            <Col xs="2" sm="1">
                                {(this.state.asiento13) ? 
                                  (
                                    (this.state.noAsiento == 13)?
                                    (
                                      <Button outline color="danger"><i className="fa fa-check" /></Button>
                                    )
                                    :
                                    (
                                      <Button id='13' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                    )
                                  )
                                  :
                                  (
                                    <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                  )
                                }
                                <p className="smallDevice text-center">13</p>
                            </Col>
                            <Col xs="2" sm="1">
                                {(this.state.asiento14) ? 
                                  (
                                    (this.state.noAsiento == 14)?
                                    (
                                      <Button outline color="danger"><i className="fa fa-check" /></Button>
                                    )
                                    :
                                    (
                                      <Button id='14' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                    )
                                  )
                                  :
                                  (
                                    <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                  )
                                }
                                <p className="smallDevice text-center">14</p>
                            </Col>
                            <Col xs="3">
                            </Col>
                            <Col xs="2" sm="1">
                                {(this.state.asiento15) ? 
                                  (
                                    (this.state.noAsiento == 15)?
                                    (
                                      <Button outline color="danger"><i className="fa fa-check" /></Button>
                                    )
                                    :
                                    (
                                      <Button id='15' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                    )
                                  )
                                  :
                                  (
                                    <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                  )
                                }
                                <p className="smallDevice text-center">15</p>
                            </Col>
                            <Col xs="2" sm="1">
                                {(this.state.asiento16) ? 
                                  (
                                    (this.state.noAsiento == 16)?
                                    (
                                      <Button outline color="danger"><i className="fa fa-check" /></Button>
                                    )
                                    :
                                    (
                                      <Button id='16' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                    )
                                  )
                                  :
                                  (
                                    <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                  )
                                }
                                <p className="smallDevice text-center">16</p>
                            </Col>
                          </Row>
                          <Row>
                            <Col xs="2" sm="1">
                                {(this.state.asiento17) ? 
                                  (
                                    (this.state.noAsiento == 17)?
                                    (
                                      <Button outline color="danger"><i className="fa fa-check" /></Button>
                                    )
                                    :
                                    (
                                      <Button id='17' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                    )
                                  )
                                  :
                                  (
                                    <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                  )
                                }
                                <p className="smallDevice text-center">17</p>
                            </Col>
                            <Col xs="2" sm="1">
                                {(this.state.asiento18) ? 
                                  (
                                    (this.state.noAsiento == 18)?
                                    (
                                      <Button outline color="danger"><i className="fa fa-check" /></Button>
                                    )
                                    :
                                    (
                                      <Button id='18' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                    )
                                  )
                                  :
                                  (
                                    <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                  )
                                }
                                <p className="smallDevice text-center">18</p>
                            </Col>
                            <Col xs="3">
                            </Col>
                            <Col xs="2" sm="1">
                                {(this.state.asiento19) ? 
                                  (
                                    (this.state.noAsiento == 19)?
                                    (
                                      <Button outline color="danger"><i className="fa fa-check" /></Button>
                                    )
                                    :
                                    (
                                      <Button id='19' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                    )
                                  )
                                  :
                                  (
                                    <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                  )
                                }
                                <p className="smallDevice text-center">19</p>
                            </Col>
                            <Col xs="2" sm="1">
                                {(this.state.asiento20) ? 
                                  (
                                    (this.state.noAsiento == 20)?
                                    (
                                      <Button outline color="danger"><i className="fa fa-check" /></Button>
                                    )
                                    :
                                    (
                                      <Button id='20' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                    )
                                  )
                                  :
                                  (
                                    <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                  )
                                }
                                <p className="smallDevice text-center">20</p>
                            </Col>
                          </Row>
                          <Row>
                            <Col xs="2" sm="1">
                                {(this.state.asiento21) ? 
                                  (
                                    (this.state.noAsiento == 21)?
                                    (
                                      <Button outline color="danger"><i className="fa fa-check" /></Button>
                                    )
                                    :
                                    (
                                      <Button id='21' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                    )
                                  )
                                  :
                                  (
                                    <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                  )
                                }
                                <p className="smallDevice text-center">21</p>
                            </Col>
                            <Col xs="2" sm="1">
                                {(this.state.asiento22) ? 
                                  (
                                    (this.state.noAsiento == 22)?
                                    (
                                      <Button outline color="danger"><i className="fa fa-check" /></Button>
                                    )
                                    :
                                    (
                                      <Button id='22' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                    )
                                  )
                                  :
                                  (
                                    <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                  )
                                }
                                <p className="smallDevice text-center">22</p>
                            </Col>
                            <Col xs="3">
                            </Col>
                            <Col xs="2" sm="1">
                                {(this.state.asiento23) ? 
                                  (
                                    (this.state.noAsiento == 23)?
                                    (
                                      <Button outline color="danger"><i className="fa fa-check" /></Button>
                                    )
                                    :
                                    (
                                      <Button id='23' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                    )
                                  )
                                  :
                                  (
                                    <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                  )
                                }
                                <p className="smallDevice text-center">23</p>
                            </Col>
                            <Col xs="2" sm="1">
                                {(this.state.asiento24) ? 
                                  (
                                    (this.state.noAsiento == 24)?
                                    (
                                      <Button outline color="danger"><i className="fa fa-check" /></Button>
                                    )
                                    :
                                    (
                                      <Button id='24' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                    )
                                  )
                                  :
                                  (
                                    <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                  )
                                }
                                <p className="smallDevice text-center">24</p>
                            </Col>
                          </Row>
                          <Row>
                            <Col xs="2" sm="1">
                                {(this.state.asiento25) ? 
                                  (
                                    (this.state.noAsiento == 25)?
                                    (
                                      <Button outline color="danger"><i className="fa fa-check" /></Button>
                                    )
                                    :
                                    (
                                      <Button id='25' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                    )
                                  )
                                  :
                                  (
                                    <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                  )
                                }
                                <p className="smallDevice text-center">25</p>
                            </Col>
                            <Col xs="2" sm="1">
                                {(this.state.asiento26) ? 
                                  (
                                    (this.state.noAsiento == 26)?
                                    (
                                      <Button outline color="danger"><i className="fa fa-check" /></Button>
                                    )
                                    :
                                    (
                                      <Button id='26' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                    )
                                  )
                                  :
                                  (
                                    <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                  )
                                }
                                <p className="smallDevice text-center">26</p>
                            </Col>
                            <Col xs="3">
                            </Col>
                            <Col xs="2" sm="1">
                                {(this.state.asiento27) ? 
                                  (
                                    (this.state.noAsiento == 27)?
                                    (
                                      <Button outline color="danger"><i className="fa fa-check" /></Button>
                                    )
                                    :
                                    (
                                      <Button id='27' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                    )
                                  )
                                  :
                                  (
                                    <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                  )
                                }
                                <p className="smallDevice text-center">27</p>
                            </Col>
                            <Col xs="2" sm="1">
                                {(this.state.asiento28) ? 
                                  (
                                    (this.state.noAsiento == 28)?
                                    (
                                      <Button outline color="danger"><i className="fa fa-check" /></Button>
                                    )
                                    :
                                    (
                                      <Button id='28' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                    )
                                  )
                                  :
                                  (
                                    <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                  )
                                }
                                <p className="smallDevice text-center">28</p>
                            </Col>
                          </Row>
                          <Row>
                            <Col xs="2" sm="1">
                                {(this.state.asiento29) ? 
                                  (
                                    (this.state.noAsiento == 29)?
                                    (
                                      <Button outline color="danger"><i className="fa fa-check" /></Button>
                                    )
                                    :
                                    (
                                      <Button id='29' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                    )
                                  )
                                  :
                                  (
                                    <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                  )
                                }
                                <p className="smallDevice text-center">29</p>
                            </Col>
                            <Col xs="2" sm="1">
                                {(this.state.asiento30) ? 
                                  (
                                    (this.state.noAsiento == 30)?
                                    (
                                      <Button outline color="danger"><i className="fa fa-check" /></Button>
                                    )
                                    :
                                    (
                                      <Button id='30' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                    )
                                  )
                                  :
                                  (
                                    <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                  )
                                }
                                <p className="smallDevice text-center">30</p>
                            </Col>
                            <Col xs="3">
                            </Col>
                            <Col xs="2" sm="1">
                                {(this.state.asiento31) ? 
                                  (
                                    (this.state.noAsiento == 31)?
                                    (
                                      <Button outline color="danger"><i className="fa fa-check" /></Button>
                                    )
                                    :
                                    (
                                      <Button id='31' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                    )
                                  )
                                  :
                                  (
                                    <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                  )
                                }
                                <p className="smallDevice text-center">31</p>
                            </Col>
                            <Col xs="2" sm="1">
                                {(this.state.asiento32) ? 
                                  (
                                    (this.state.noAsiento == 32)?
                                    (
                                      <Button outline color="danger"><i className="fa fa-check" /></Button>
                                    )
                                    :
                                    (
                                      <Button id='32' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                    )
                                  )
                                  :
                                  (
                                    <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                  )
                                }
                                <p className="smallDevice text-center">32</p>
                            </Col>
                          </Row>
                          <Row>
                            <Col xs="2" sm="1">
                                {(this.state.asiento33) ? 
                                  (
                                    (this.state.noAsiento == 33)?
                                    (
                                      <Button outline color="danger"><i className="fa fa-check" /></Button>
                                    )
                                    :
                                    (
                                      <Button id='33' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                    )
                                  )
                                  :
                                  (
                                    <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                  )
                                }
                                <p className="smallDevice text-center">33</p>
                            </Col>
                            <Col xs="2" sm="1">
                                {(this.state.asiento34) ? 
                                  (
                                    (this.state.noAsiento == 34)?
                                    (
                                      <Button outline color="danger"><i className="fa fa-check" /></Button>
                                    )
                                    :
                                    (
                                      <Button id='34' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                    )
                                  )
                                  :
                                  (
                                    <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                  )
                                }
                                <p className="smallDevice text-center">34</p>
                            </Col>
                            <Col xs="3">
                            </Col>
                            <Col xs="2" sm="1">
                                {(this.state.asiento35) ? 
                                  (
                                    (this.state.noAsiento == 35)?
                                    (
                                      <Button outline color="danger"><i className="fa fa-check" /></Button>
                                    )
                                    :
                                    (
                                      <Button id='35' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                    )
                                  )
                                  :
                                  (
                                    <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                  )
                                }
                                <p className="smallDevice text-center">35</p>
                            </Col>
                            <Col xs="2" sm="1">
                                {(this.state.asiento36) ? 
                                  (
                                    (this.state.noAsiento == 36)?
                                    (
                                      <Button outline color="danger"><i className="fa fa-check" /></Button>
                                    )
                                    :
                                    (
                                      <Button id='36' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                    )
                                  )
                                  :
                                  (
                                    <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                  )
                                }
                                <p className="smallDevice text-center">36</p>
                            </Col>
                          </Row>
                          <Row>
                            <Col xs="2" sm="1">
                                {(this.state.asiento37) ? 
                                  (
                                    (this.state.noAsiento == 37)?
                                    (
                                      <Button outline color="danger"><i className="fa fa-check" /></Button>
                                    )
                                    :
                                    (
                                      <Button id='37' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                    )
                                  )
                                  :
                                  (
                                    <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                  )
                                }
                                <p className="smallDevice text-center">37</p>
                            </Col>
                            <Col xs="2" sm="1">
                                {(this.state.asiento38) ? 
                                  (
                                    (this.state.noAsiento == 38)?
                                    (
                                      <Button outline color="danger"><i className="fa fa-check" /></Button>
                                    )
                                    :
                                    (
                                      <Button id='38' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                    )
                                  )
                                  :
                                  (
                                    <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                  )
                                }
                                <p className="smallDevice text-center">38</p>
                            </Col>
                            <Col xs="3">
                            </Col>
                            <Col xs="2" sm="1">
                                {(this.state.asiento39) ? 
                                  (
                                    (this.state.noAsiento == 39)?
                                    (
                                      <Button outline color="danger"><i className="fa fa-check" /></Button>
                                    )
                                    :
                                    (
                                      <Button id='39' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                    )
                                  )
                                  :
                                  (
                                    <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                  )
                                }
                                <p className="smallDevice text-center">39</p>
                            </Col>
                            <Col xs="2" sm="1">
                                {(this.state.asiento40) ? 
                                  (
                                    (this.state.noAsiento == 40)?
                                    (
                                      <Button outline color="danger"><i className="fa fa-check" /></Button>
                                    )
                                    :
                                    (
                                      <Button id='40' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                    )
                                  )
                                  :
                                  (
                                    <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                  )
                                }
                                <p className="smallDevice text-center">40</p>
                            </Col>
                          </Row>
                          </div>
                      )
                    }
                    
                  {/* FIN Asientos */}
                  </Col>
                </Card>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }

}
//FourthStep
class FourthStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: null,
      //variables de pago
      subtotal: null,
      total: null,
      pago: null,
      //variables de validacion
      validationPago: true,
      //variables del resumen de venta
      nombreCliente: null,
      tipoCliente: null,
      razon: null,
      descuentoTipo: null,
      descuentoPorc: null,
      descuentoNeto: null,
      origen: null,
      paisOrigen: null,
      destino: null,
      paisDestino: null,
      dia: null,
      hora: null,
      asiento: null,
      tipoDeCambio: null,
      fechaAbierta: false,
    };
    this.handleOnChangePago = this.handleOnChangePago.bind(this);
    this.handleClickActualizar = this.handleClickActualizar.bind(this);
  }

  isValidated() {
    let pago = document.getElementById('inputPago').value;
    if(this.state.pago == null){
      this.setState({
        validationPago: false
      });
    }

    if(pago == null){
      return false;
    }else{
      if(pago >= this.state.total){
        return true;
      }
      this.setState({
        validationPago: false
      });
      return false;
    }
    
  }

  handleOnChangePago(){
    this.setState({
      validationPago: true
    });
  }

  
  handleClickActualizar(){
    console.log(data.fechahora);
    this.setState({
      nombreCliente: data.cliente,
      tipoCliente: data.clienteTipo,
      razon: data.razon,
      descuentoTipo: data.descuento.tipo,
      descuentoPorc: data.descuento.porc,
      descuentoNeto: data.cobro.descuento,
      origen: data.origen.ciudad+', '+data.origen.estado,
      paisOrigen: data.origen.pais,
      destino: data.destino.ciudad+', '+data.destino.estado,
      paisDestino: data.destino.pais,
      fechaAbierta: data.detalles.fechaAbierta,
      dia: data.detalles.dia,
      hora: data.detalles.hora,
      asiento: (data.detalles.noAsiento < 10) ? '0'+data.detalles.noAsiento : data.detalles.noAsiento,
      tipoDeCambio: data.cambio,
      subtotal: data.cobro.subtotal,
      total: data.cobro.total
    })
  }


  render() {
    return <div>
      <br/>
      <Row>
        <Col md={{ size: 3}} lg={{ size: 3}} sm={12} xs={12}>
          <h3>Resumen de Reservación </h3>
        </Col>
        <Col md={{ size: 9}} lg={{ size: 9}} sm={12} xs={12}>
          <Button onClick={this.handleClickActualizar} size="lg" outline color="info">Actualizar</Button>
        </Col>
      </Row>
      <br/>
      <Form>
        <Row>
          <Col md={{ size: 6}} lg={{ size: 6}} sm={12} xs={12}>
            <Table responsive borderless>
              <tbody>
                <tr>
                  <th scope="row">Cliente:</th>
                  <td colSpan="5">
                    <span>{this.state.nombreCliente}{' '}</span>
                    <span class="badge badge-pill badge-info">{this.state.tipoCliente}</span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Razón:</th>
                  <td colSpan="2">{this.state.razon}</td>
                  <th scope="row">Descuento:</th>
                  <td colSpan="2">{this.state.descuentoTipo}{' '}{this.state.descuentoPorc+'%'}</td>
                </tr>
                <tr>
                  <th scope="row">Origen:</th>
                  <td colSpan="5">{this.state.origen}{' '}<span class={(this.state.paisOrigen == 'MX') ? 'badge badge-pill badge-success' : 'badge badge-pill badge-primary' } >{this.state.paisOrigen}</span></td>
                </tr>
                <tr>
                  <th scope="row">Destino:</th>
                  <td colSpan="5">{this.state.destino}{' '}<span class={(this.state.paisDestino == 'MX') ? 'badge badge-pill badge-success' : 'badge badge-pill badge-primary' }>{this.state.paisDestino}</span></td>
                </tr>
                {
                  (this.state.fechaAbierta) ? 
                  (
                    <tr>
                      <th scope="row" colSpan="6">Fecha Abierta</th>
                    </tr>
                  )
                  :
                  (
                    <tr>
                      <th scope="row">Día:</th>
                      <td>{this.state.dia}</td>
                      <th scope="row">Hora:</th>
                      <td>{this.state.hora}</td>
                      <th scope="row">Asiento:</th>
                      <td>{this.state.asiento}</td>
                    </tr>
                  )
                }
              </tbody>
            </Table>
          </Col>
          <Col md={{ size: 6}} lg={{ size: 6}} sm={12} xs={12}>
            <Table bordered>
              <tbody>
                <tr>
                  <th scope="row">Subtotal</th>
                  <td>{this.state.tipoDeCambio}{' $'}{this.state.subtotal}</td>
                </tr>
                <tr>
                  <th scope="row">Descuento {this.state.descuentoPorc}%</th>
                  <td>{this.state.tipoDeCambio}{' $'}{this.state.descuentoNeto}</td>
                </tr>
                <tr>
                  <th scope="row">
                    <CustomInput type="switch" id="switchIVA" name="switchIVA" label="IVA" />
                  </th>
                  <td>US $16.0</td>
                </tr>
                <tr>
                  <th scope="row">Total</th>
                  <td>{this.state.tipoDeCambio}{' $'}{this.state.total}</td>
                </tr>
              </tbody>
            </Table>
            <br/>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12}>
                <FormGroup>
                  <Label for="inputPago">Pago</Label>
                  <div class={(this.state.validationPago) ? 'card border-light': 'card border-danger'}>
                    <Input type="text" name="inputPago" id="inputPago" onKeyDown={this.handleOnChangePago} placeholder="$0.0" />
                  </div>
                  <p class={(this.state.validationPago) ? 'textValid': 'textInvalid'}>Introduce correctamente el pago</p>
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

class Reservaciones extends React.Component {
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
                title="RESERVACION DE BOLETO"
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

export default Reservaciones;