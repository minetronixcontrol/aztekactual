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
import "../css/asientosAutobus.css";
import "../css/styles.css"

//Componentes Externos
import ModalNewDescuento from './ModalNewDescuento.js'
import AsientosAutobus from "./asientosAutobus.js"
import GenerarReservacion from "./reservacionPDF";
import WizardCliente from "./TabNewCliente.js";


//Configuracion del Wizard
ReactWizard.defaultProps = {
  previousButtonText: "Atrás",
  finishButtonText: "Guardar",
  nextButtonText: "Siguiente",
  progressbar: true
};

//Declaración de variables o constantes globales

//La variable venta almacenará los datos para ser guardados en la colección venta
var venta = null;

//La variable generalData, almacenará los datos que se utilizaran en el formulario
var generalData = {
  folio: null,
  folioVendedor: null,
  costoBoleto: 0, //Precio en Dollar
  precioDollar: 0, 
  idioma: 'espanol',
  imagenPublicidad: null,
  configuracion: {
    politicas: '',
    informacionPermiso: '',
    reservacion: '',
  },
  origen: {
    id: null,
    direccion: null,
    ciudad: null,
    estado: null,
    pais: null
  },
  destino: {
    id: null,
    direccion: null,
    ciudad: null,
    estado: null,
    pais: null
  },
  //fechahora: null,
  cliente: null,
  nombreCliente: null,
  clienteTipo: null,
  razon: null,
  cambio: 'US',
  //total: '100',
  descuento: {
    idDescuento: null,
    tipo: 'Ninguno',
    porc: 0
  },
  cobro: {
    subtotal: 0,
    descuento: 0,
    iva: 0,
    total: 0,
    anticipo: 0,
  },
  detalles:{
    fechaAbierta: false,
    dia: null,
    hora: '00:00',
    anio: null,
    diaDelAnio:  null,
    idViaje: null,
    numeroEconomico: null,
    noAsiento: null
  },
  vendedor:{
    id_Usuario: null,
    username: null,
    nombre: null,
    apellidoPaterno: null,
    apellidoMaterno: null,
    sucursal: null,
    tipoDescuento: null,
    seguridad: null
  },
  sucursalVendedor: {
    nombre: null,
    direccion: null,
    tel: null,
    tel2: null,
    correo: null,
    tipo: null
  },
  sucursales: {
    direccionMatriz: null,
    direccionMatrizEU: null,
    telefonoMatriz: null,
    telefonoMatrizEU: null
  }
};

//Opciones de los Select
var optOrigen = [];
var optDestino = [];
//var optDescuento = [];
var optRazon = [];
var optTipoDeCambio = [];
var optFechaHora = [];
var optCliente = [];
var asientosCamion = null;
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
      validationFechaHora: true,
      optOrigen: [],
      optDestino: [],
      optFechaHora: [],
      hora: "00:00"
    };
    //this.handleFechaAbierta = this.handleFechaAbierta.bind(this);
    this.handleSetOptionsOrigen = this.handleSetOptionsOrigen.bind(this);    
    this.handleSetOptionsDestino = this.handleSetOptionsDestino.bind(this);
    this.handleSetOptionsFechaHora = this.handleSetOptionsFechaHora.bind(this);

    this.handleChangeDestino = this.handleChangeDestino.bind(this);
    this.handleChangeOrigen = this.handleChangeOrigen.bind(this);
    this.handleChangeFechaHora = this.handleChangeFechaHora.bind(this);

    this.handleChangeFechaAbierta = this.handleChangeFechaAbierta.bind(this);

    this.getDiaDelAnio = this.getDiaDelAnio.bind(this);
  }

  //Para validar esta parte del formulario
  isValidated() {
    if(generalData.origen.id == null){
      this.setState({
        validationOrigen: false
      })
    }

    if(generalData.destino.id == null){
      this.setState({
        validationDestino: false
      })
    }

    if(!this.state.fechaAbierta && generalData.detalles.dia == null){
        this.setState({
          validationFechaHora: false
        })
    }

    if(this.state.fechaAbierta){
        if(generalData.origen.id == null || generalData.destino.id == null){
          return false;
        }else{
          return true;
        }
    }else{
        if(generalData.origen.id == null || generalData.destino.id == null || generalData.detalles.dia == null){
          return false;
        }else{
          return true;
        }
    }
  }  

  //Se ejecuta al montar el componente
  componentDidMount(){
    this.handleSetOptionsOrigen();
    this.handleSetOptionsFechaHora();
  }

  //Establece las opciones del select 
  handleSetOptionsOrigen(){

    fetch('/api/OrigenesYdestinos/')
      .then(res => res.json())
      .then(data => {
          //console.log(data);
          if(data.length > 0){
            //console.log('origen');
            for(let i = 0; i < data.length; i++){
              optOrigen[i] = { 
                value: data[i]._id,
                label: data[i].municipio,
                estado: data[i].estado,
                pais: data[i].pais,
                direccion: data[i].direccion,
                hora: data[i].horaDeCita
              };
            }
            this.setState({
              optOrigen: optOrigen
            })
          }
          //console.log('optOrigen', this.state.optOrigen);
      });

    /*optOrigen = [
      { value: '1', label: 'Fresnillo', estado: 'Zacatecas', pais: 'MX' },*/
  } 

  handleSetOptionsDestino(pais){    
    let opt = [];
    for(let i = 0; i < optOrigen.length; i++){
      if(optOrigen[i].pais == pais){
        opt.push(optOrigen[i]);
      }
    }
    this.setState({
      optDestino: opt
    });
  } 

  handleSetOptionsFechaHora(){
    //let hora = data.detalles.hora;
    fetch('/api/AsignarViajes/')
      .then(res => res.json())
      .then(data => {
          //console.log(data);
          if(data.length > 0){
            for(let i = 0; i < data.length; i++){
              optFechaHora[i] = { 
                value: data[i]._id,
                label: data[i].fecha,
                diaDelAnio: data[i].diaDelAnio,
                anio: data[i].anio,
                numeroEconomico: data[i].numeroEconomico
              };
            }
            this.setState({
              optFechaHora: optFechaHora
            })
          }
      });
  }

  //Se ejecuta al cambiar la opcion del select origen
 
  handleChangeOrigen(e){
    generalData.origen.id = e.value;
    generalData.origen.ciudad = e.label;
    generalData.origen.estado = e.estado;
    generalData.origen.pais = e.pais;
    generalData.origen.direccion = e.direccion;
    generalData.detalles.hora = e.hora;
    this.setState({
      validationOrigen: true,
      hora: e.hora
    });
    let pais = (e.pais == 'MX')? 'US' : 'MX';
    //this.handleSetOptionsFechaHora();
    this.handleSetOptionsDestino(pais);
    //console.log(data.origen);
  }

  handleChangeDestino(e){
    generalData.destino.id = e.value;
    generalData.destino.ciudad = e.label;
    generalData.destino.estado = e.estado;
    generalData.destino.pais = e.pais;
    generalData.destino.direccion = e.direccion;
    this.setState({
      validationDestino: true
    })
    //console.log(data.destino);
    
  }

  handleChangeFechaHora(e){
    let selectFechaHora = document.getElementById('selectFechaHora');
    let fechaDeViaje = e.target.value;             
    let arrayFechaDeViaje = fechaDeViaje.split('-', 3);
    let anioFechaDeViaje = arrayFechaDeViaje[0];
    let hoy = new Date();
    let anio = hoy.getFullYear();

    let diaDeHoy = `${anio}-${hoy.getMonth()+1}-${hoy.getDate()}`;
    let diaAnioHoy = this.getDiaDelAnio(`${anio}-01-01`,diaDeHoy);

    let diaAnioViaje = this.getDiaDelAnio(`${anioFechaDeViaje}-01-01`,fechaDeViaje);

    if((anioFechaDeViaje < anio) || ((anioFechaDeViaje == anio) && (diaAnioViaje<diaAnioHoy))){//si el anio que seleccionamos es menor al año actual, retornamos false
      this.setState({
          validationFechaHora: false,
      });
      selectFechaHora.value = '';
      return false;
    }else{
        //Ahora verificamos que ya esté abierta la fecha
        //El formato de la fecha debe ser "dd-mm-aaaa"
        let buscarFecha = `${arrayFechaDeViaje[2]}-${arrayFechaDeViaje[1]}-${arrayFechaDeViaje[0]}`; 
        fetch(`/api/AsignarViajes/${buscarFecha}/fecha`)
        .then(res => res.json())
        .then(data => {
            if(data.length > 0){
                //console.log(data);
                generalData.detalles.idViaje =  data[0]._id;
                generalData.detalles.dia = data[0].fecha;
                generalData.detalles.numeroEconomico = data[0].numeroEconomico;
                generalData.detalles.anio = data[0].anio;
                generalData.detalles.diaDelAnio = data[0].diaDelAnio;
                this.setState({
                    validationFechaHora: true,
                });
            }else{
                this.setState({
                    validationFechaHora: false,
                });
                selectFechaHora.value = '';
                alert('No hay viaje disponible para esa fecha, escoge otra fecha o contáctate con la matriz');
            }
        });
    }


    /*generalData.detalles.idViaje =  e.value;
    generalData.detalles.dia = e.label;
    generalData.detalles.numeroEconomico = e.numeroEconomico;
    generalData.detalles.anio = e.anio;
    generalData.detalles.diaDelAnio = e.diaDelAnio;
    //Aqui debemos guardar la variable del dia del año y el año.
    this.setState({
      validationFechaHora: true,
    });*/
    
    //console.log(generalData);        
  }

  handleChangeFechaAbierta(e){
    if(e.target.checked){
      document.getElementById('selectFechaHora').value = '';
    }
    this.setState({ 
        fechaAbierta: e.target.checked,
        validationFechaHora: true 
    });
    generalData.detalles.fechaAbierta = e.target.checked
  }

  getDiaDelAnio(fechaInicial, fechaFinal){
    let fechaini = new Date(fechaInicial);
    let fechafin = new Date(fechaFinal);
    let diasdif= fechafin.getTime()-fechaini.getTime();
    let contdias = Math.round(diasdif/(1000*60*60*24));

    return (contdias+1);
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
              options={this.state.optOrigen}
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
              options={this.state.optDestino}
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
          <Label for="selectFechaHora">Fecha:</Label>
          <div class={(this.state.validationFechaHora) ? 'card border-light': 'card border-danger'}>
            <Input
                type="date"
                name="date"
                id="selectFechaHora"
                placeholder="date placeholder"
                onChange={this.handleChangeFechaHora}
                disabled={this.state.fechaAbierta}
            />
            {/* <Select
              id="selectFechaHora"
              isDisabled={this.state.fechaAbierta}
              onChange={this.handleChangeFechaHora}
              options={this.state.optFechaHora}
              placeholder = "Selecciona..."
            /> */}
          </div>
          <p class={(this.state.validationFechaHora) ? 'textValid': 'textInvalid'}>Selecciona la fecha</p>
        </Col>
        <Col lg={6} md={6} sm={12} xs={12}>
          <Label >Hora:</Label>
          <Input plaintext value={this.state.hora} readOnly/>
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
      tipoDeCambio: 'US',
      precioDeBoleto: '0', //Precio del boleto en dollar
      descuento: null, //Nombre del descuento
      descuentoDollares: '0',
      descuentoNeto: '0',//Descuento Neto, depende si el tipo de cambio es en dollar o peso MX
      total: '0',
      //Variables de validacion
      validationRazon: true,
      validationCliente: true,
      validationActualizar: false,
      //Variables de control MODALS
      modal: false,
      //Variables opt para Selects
      optCliente: [],
      optDescuento: [],
    };
    //Funciones
    this.toggle = this.toggle.bind(this);
    this.getColor = this.getColor.bind(this);
    this.getType = this.getType.bind(this);
    this.handleClickActualizar = this.handleClickActualizar.bind(this);
    this.fetchUser = this.fetchUser.bind(this);
    this.fetchSucursalVendedor = this.fetchSucursalVendedor.bind(this);
    //Inicializacion de los option   
    this.handleSetOptionsRazon = this.handleSetOptionsRazon.bind(this);
    this.handleSetOptionsCambio = this.handleSetOptionsCambio.bind(this);
    this.handleSetOptionsCliente = this.handleSetOptionsCliente.bind(this);
    //Onchanges 
    this.handleOnChangeRazon = this.handleOnChangeRazon.bind(this);
    this.handleOnChangeTipoDeCambio = this.handleOnChangeTipoDeCambio.bind(this);
    this.handleOnChangeDescuento = this.handleOnChangeDescuento.bind(this);
    this.handleOnChangeCliente = this.handleOnChangeCliente.bind(this);
    this.handleSetOptionsDescuentos = this.handleSetOptionsDescuentos.bind(this);
    this.fetchDollar = this.fetchDollar.bind(this);
    
  }

  isValidated() {
    if(generalData.razon == null){
      this.setState({
        validationRazon: false
      })
    }

    if(generalData.cliente == null){
      this.setState({
        validationCliente: false
      })
    }

    if((generalData.descuento.tipo == 'Niño') || (generalData.descuento.tipo == 'INSEN')){
      if(generalData.clienteTipo != generalData.descuento.tipo){
        alert('El descuento seleccionado no aplica para ese cliente');
        return false;
      }
    }    

    if(generalData.razon == null || generalData.cambio == null || generalData.cliente == null || !this.state.validationActualizar){
      return false;
    }else{
      return true;
    } 
  }

  //Se ejecuta al montar el componente
  componentDidMount(){
    //console.log('Cliente component did mount');
    this.fetchUser();
    this.handleSetOptionsRazon();
    this.handleSetOptionsCambio();
    this.handleSetOptionsCliente();
    this.fetchDollar();
  }

  //Utilizamos fetch user para traernos los datos del usuario
  fetchUser(){
    fetch(`/api/Usuarios/${generalData.vendedor.username}`)
      .then(res => res.json())
      .then(data => {
          //console.log(data);
          generalData.vendedor.id_Usuario = data[0]._id;
          generalData.vendedor.nombre = data[0].nombre;
          generalData.vendedor.apellidoPaterno = data[0].apellidoPaterno;
          generalData.vendedor.apellidoMaterno = data[0].apellidoMaterno;
          generalData.vendedor.sucursal = data[0].sucursal;
          generalData.vendedor.tipoDescuento = data[0].tipoDescuento;
          generalData.vendedor.seguridad = data[0].seguridad;
      })
      .then(() => {
        //console.log('general data', generalData);
        this.fetchSucursalVendedor(generalData.vendedor.sucursal);
        this.handleSetOptionsDescuentos();
      });
  }

  //Funcion que obtiene la informacion de la sucursal del vendedor actual
  fetchSucursalVendedor(idSucursal){
    fetch(`/api/Sucursales/${idSucursal}`)
      .then(res => res.json())
      .then(data => {
        generalData.sucursalVendedor.direccion = data.direccion+" "+data.ciudad+", "+data.estado+", "+data.pais;
        generalData.sucursalVendedor.tel =  data.telefono_1;
        generalData.sucursalVendedor.tel2 = data.telefono_2;
        generalData.sucursalVendedor.correo = data.correo;
        generalData.sucursalVendedor.nombre = data.nombre;
        generalData.sucursalVendedor.tipo = data.tipo;
      });  
  }

  // Funcion que obtiene el precio del Dollar
  fetchDollar(){
    fetch(`/api/Dollar/`)
      .then(res => res.json())
      .then(data => {
          //console.log(data);
          if(data.length > 0){
            generalData.precioDollar = data[0].precioDollar;
          }
      });
    //console.log(generalData);
  }

  //Valores de los option obtenidos de la DB
  handleSetOptionsRazon(){
    optRazon = [
      { value: 'Ciudadano', label: 'Ciudadano' },
      { value: 'Residente', label: 'Residente' },
      { value: 'Turista', label: 'Turista' }
    ];
  } 

  handleSetOptionsCambio(){
    optTipoDeCambio = [
      { value: 'MXN', label: 'MXN' },
      { value: 'US', label: 'US' }
    ];
  } 


  handleClickActualizar(){
    this.setState({
      validationActualizar: true
    });
    fetch(`/api/Precios/${generalData.origen.id}/${generalData.destino.id}`)
      .then(res => res.json())
      .then(data => {
          //console.log(data);
          if(data.length > 0){
              this.setState({
                precioDeBoleto: data[0].costo,
                total: data[0].costo
              });
              generalData.costoBoleto = data[0].costo;
              generalData.cobro.subtotal = data[0].costo;
              generalData.cobro.total = data[0].costo
          }
      });

  }

  handleSetOptionsCliente(){
    
    fetch('/api/Clientes/')
      .then(res => res.json())
      .then(data => {
          //console.log(data);
          if(data.length > 0){
            //console.log('origen');
            for(let i = 0; i < data.length; i++){
              optCliente[i] = { 
                value: data[i]._id,
                label: data[i].nombre+" "+data[i].apellidoPaterno+" "+data[i].apellidoMaterno,
                color: this.getColor(data[i].fechaNacimiento),
                type: this.getType(data[i].fechaNacimiento),
                listaNegra: data[i].listaNegra
              };
            }
            this.setState({
              optCliente: optCliente
            })
          }
          
         // console.log('optOrigen', this.state.optOrigen);
      });
  } 

  getColor(fechaNacimiento){
    //console.log(fechaNacimiento);
    let fecha = new Date();
    let anioActual = fecha.getFullYear();
    fechaNacimiento = fechaNacimiento.split("/", 3);
    fechaNacimiento = fechaNacimiento[2];
    let edad = anioActual-fechaNacimiento;
    //console.log(edad);
    if(edad < 10){
      return '#FF7F70';
    }else if(edad > 59){
      return '#A466E8'
    }else{
      return '#4C76FF'
    }
    
  }
  
  getType(fechaNacimiento){
    let fecha = new Date();
    let anioActual = fecha.getFullYear();
    fechaNacimiento = fechaNacimiento.split("/", 3);
    fechaNacimiento = fechaNacimiento[2];
    let edad = anioActual-fechaNacimiento;
    if(edad < 10){
      return 'Niño';
    }else if(edad > 59){
      return 'Adulto Mayor'
    }else{
      return 'Adulto'
    }
  }

  handleSetOptionsDescuentos(){
    //Si el usuario tiene tipo de descuento Public, 
    //Se obtendrán todos los descuentos de tipo public,
    //Si el usuario es de tipo private,
    //Obtendrá los descuentos public and private
    //Si el usuario es tipo de descuento null
    // No obtendrá ningún descuento
    let opt = [];
    let optDescuento = [];
    let tipo = generalData.vendedor.tipoDescuento;
    fetch('/api/Descuentos')
      .then(res => res.json())
      .then(data => {
          if(data.length > 0){
            for(let i=0; i<data.length; i++){
              if(tipo == 'Privado' && (data[i].tipo == 'Privado' || data[i].tipo == 'Público')){
                opt.push(data[i]);
              }else if(tipo == data[i].tipo){
                opt.push(data[i]);
              }
            }
            for(let i=0; i<opt.length; i++){
              optDescuento[i] = {
                value: opt[i]._id,
                label: opt[i].desc,
                desc: opt[i].dollarDesc
              };
            }
            optDescuento[opt.length] = {
              value: '0',
              label: 'Ninguno',
              desc: '0'
            };
            this.setState({
              optDescuento : optDescuento
            })
            //console.log(this.state.optDescuento);
          }
      });

    /*optDescuento = [
      { value: 'Ninguno', label: 'Ninguno', desc: '0' },
    ];*/
  } 

  //Handle Changes del los select
  handleOnChangeCliente(e){
    if(e.listaNegra == 'true'){
      alert('Ver detalle en lista Negra para este cliente');
    }
    generalData.cliente = e.value;
    generalData.nombreCliente = e.label
    generalData.clienteTipo = e.type;
    //console.log(generalData.cliente);
    //console.log(generalData.clienteTipo);
    this.setState({
      validationCliente: true
    });
  }
  handleOnChangeRazon(e){
    generalData.razon = e.value;
    this.setState({
      validationRazon: true
    })
  }
  handleOnChangeTipoDeCambio(e){
    //console.log(e.target.value);
    let descuento = this.state.descuentoDollares;
    descuento = (e.target.value  == 'US')? descuento : parseFloat(descuento*generalData.precioDollar);
    let subtotal = (e.target.value  == 'US')? generalData.costoBoleto : parseFloat(generalData.costoBoleto*generalData.precioDollar);
    
    this.setState({
      tipoDeCambio: e.target.value,
      descuentoNeto: descuento,
      precioDeBoleto: subtotal,
      total: subtotal-descuento
    });

    generalData.cambio = e.target.value;
    generalData.cobro.subtotal = subtotal;
    generalData.cobro.descuento = descuento;
    generalData.cobro.total = subtotal-descuento;
  }

  handleOnChangeDescuento(e){
    //console.log(e);
    let descuento = ((this.state.tipoDeCambio == 'MX')? (e.desc*generalData.precioDollar) : e.desc);
    //console.log('descuento', descuento);
    let total = this.state.precioDeBoleto - descuento;   
    this.setState({
      descuentoDollares: e.desc, //Descuento en Dollares
      descuentoNeto: descuento, //No será en dollares, eso dependerá del ripo de cambio
      descuento: e.label,
      total: total
    });

    //Aginación en Variables generalData
    generalData.descuento.idDescuento = e.value;
    generalData.descuento.tipo = e.label;
    generalData.descuento.porc = descuento;
    generalData.cobro.descuento = descuento;
    generalData.cobro.total = total;

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
    
    return ( 
    <div>
      <br/>
      <Row form>
        <Col lg={6} md={6} sm={12} xs={12}>
          <span className="dot nino"></span>{' Niño '}<span className="dot adulto"></span>{' Adulto '}<span className="dot adultoM"></span>{' Adulto Mayor '}
        </Col>
        <Col lg={6} md={6} sm={12} xs={12}>
          <Button onClick={this.handleClickActualizar} size="lg" outline color="info">Actualizar</Button>
        </Col>
      </Row>
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
          <Modal size="lg" isOpen={this.state.modal} toggle={this.toggle}>
            <ModalHeader toggle={this.toggle}>Nuevo Cliente</ModalHeader>
              <WizardCliente toggle={this.toggle} refresh={this.handleSetOptionsCliente}></WizardCliente>
          </Modal>
          {/* FIN MODAL NUEVO CLIENTE */}

        </Col>
        <Col lg={6} md={6} sm={12} xs={12}>
        <Label for="selectRazon">Razón:</Label>
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
                  <div disabled={ (!this.state.validationActualizar) ? true : false}>
                    <CustomInput  type="radio" id="radioUS" name="radioCambio" value="US" label="US" onChange={this.handleOnChangeTipoDeCambio} defaultChecked inline />
                    <CustomInput type="radio" id="radioMX" name="radioCambio" value="MX" label="MX" onChange={this.handleOnChangeTipoDeCambio} inline />
                  </div>
                </FormGroup>
            </Col>
            <Col lg={12} md={12} sm={12} xs={12}>
            <Label for="selectRazon">Descuento:</Label>
                <Select
                  id="selectDescuento"
                  isSearchable={false}
                  isDisabled={!this.state.validationActualizar}
                  defaultValue={{ value: 'Ninguno', label: 'Ninguno', desc: '0' }}
                  onChange={this.handleOnChangeDescuento}
                  options={this.state.optDescuento}
                  placeholder = "Selecciona..."
                />              
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
                <th scope="row">Descuento </th>
                <td className="text-right">{this.state.tipoDeCambio+" $"+this.state.descuentoNeto}</td>
              </tr>
              <tr>
                <th scope="row">Total</th>
                <td className="text-right">{this.state.tipoDeCambio+" $"+this.state.total}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    
    </div>);
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
      asiento41: null,
      asiento42: null
    };
    this.handleClickComprobar = this.handleClickComprobar.bind(this);
    this.handleSelectAsiento = this.handleSelectAsiento.bind(this);
    this.fetchCamion = this.fetchCamion.bind(this);
    this.fetchAsientos = this.fetchAsientos.bind(this);
  }  

  handleClickComprobar(){
    //Primero sacamos la capacidad del camión.
    //console.log(generalData.detalles.fechaAbierta);
    if(generalData.detalles.fechaAbierta){
        this.setState({
            comprobar:true,
            fechaAbierta: true,
        })
    }else{
        this.fetchCamion();
    }
  }

  fetchCamion(){
    fetch(`/api/Camiones/${generalData.detalles.numeroEconomico}`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          noAsientos: data[0].capacidad
        })
      })
      .then(() => {
        this.fetchAsientos();
      });
  }

  fetchAsientos(){
    fetch(`/api/AsignarViajes/${generalData.detalles.idViaje}`)
      .then(res => res.json())
      .then(data => {
        //console.log(generalData.detalles.idViaje);
        this.setState({
          asiento1: data.asiento_1,
          asiento2: data.asiento_2,
          asiento3: data.asiento_3,
          asiento4: data.asiento_4,
          asiento5: data.asiento_5,
          asiento6: data.asiento_6,
          asiento7: data.asiento_7,
          asiento8: data.asiento_8,
          asiento9: data.asiento_9,
          asiento10: data.asiento_10,
          asiento11: data.asiento_11,
          asiento12: data.asiento_12,
          asiento13: data.asiento_13,
          asiento14: data.asiento_14,
          asiento15: data.asiento_15,
          asiento16: data.asiento_16,
          asiento17: data.asiento_17,
          asiento18: data.asiento_18,
          asiento19: data.asiento_19,
          asiento20: data.asiento_20,
          asiento21: data.asiento_21,
          asiento22: data.asiento_22,
          asiento23: data.asiento_23,
          asiento24: data.asiento_24,
          asiento25: data.asiento_25,
          asiento26: data.asiento_26,
          asiento27: data.asiento_27,
          asiento28: data.asiento_28,
          asiento29: data.asiento_29,
          asiento30: data.asiento_30,
          asiento31: data.asiento_31,
          asiento32: data.asiento_32,
          asiento33: data.asiento_33,
          asiento34: data.asiento_34,
          asiento35: data.asiento_35,
          asiento36: data.asiento_36,
          asiento37: data.asiento_37,
          asiento38: data.asiento_38,
          asiento39: data.asiento_39,
          asiento40: data.asiento_40,
          asiento41: data.asiento_41,
          asiento42: data.asiento_42
        })
        //console.log('Capacidad de asientos', this.state.noAsientos);
      });
  }

  handleSelectAsiento(e){
    
    //Primero verificamos que anteriormente no haya algun asiento ya seleccionado
    //En caso de que ya este seleccionado alguno, procedemos a regresar a su estado original
    let id = e.target.id;
    generalData.detalles.noAsiento = id;
    this.setState({
      noAsiento: id
    })
    console.log(generalData.detalles.noAsiento);
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
                    {
                    (this.state.fechaAbierta)? 
                    (
                        <h6>La reservación de asientos no está disponible para fecha abierta.
                        <br/>
                        Click en siguiente para continuar
                        </h6>
                    )
                    :
                    (<div>
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
                        {/* Asientos */}
                        <Row>
                        <Col xs="2" sm="1">
                            {(this.state.asiento1 == 'false') ? 
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
                            {(this.state.asiento2  == 'false') ? 
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
                            {(this.state.asiento3  == 'false') ? 
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
                            {(this.state.asiento4  == 'false') ? 
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
                            {(this.state.asiento5  == 'false') ? 
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
                            {(this.state.asiento6  == 'false') ? 
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
                            {(this.state.asiento7  == 'false') ? 
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
                            {(this.state.asiento8  == 'false') ? 
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
                            {(this.state.asiento9  == 'false') ? 
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
                            {(this.state.asiento10  == 'false') ? 
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
                            {(this.state.asiento11 == 'false') ? 
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
                            {(this.state.asiento12 == 'false') ? 
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
                            {(this.state.asiento13 == 'false') ? 
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
                            {(this.state.asiento14 == 'false') ? 
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
                            {(this.state.asiento15 == 'false') ? 
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
                            {(this.state.asiento16 == 'false') ? 
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
                            {(this.state.asiento17 == 'false') ? 
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
                            {(this.state.asiento18 == 'false') ? 
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
                            {(this.state.asiento19 == 'false') ? 
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
                            {(this.state.asiento20 == 'false') ? 
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
                            {(this.state.asiento21 == 'false') ? 
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
                            {(this.state.asiento22 == 'false') ? 
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
                            {(this.state.asiento23 == 'false') ? 
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
                            {(this.state.asiento24 == 'false') ? 
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
                            {(this.state.asiento25 == 'false') ? 
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
                            {(this.state.asiento26 == 'false') ? 
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
                            {(this.state.asiento27 == 'false') ? 
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
                            {(this.state.asiento28 == 'false') ? 
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
                            {(this.state.asiento29 == 'false') ? 
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
                            {(this.state.asiento30 == 'false') ? 
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
                            {(this.state.asiento31 == 'false') ? 
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
                            {(this.state.asiento32 == 'false') ? 
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
                            {(this.state.asiento33 == 'false') ? 
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
                            {(this.state.asiento34 == 'false') ? 
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
                            {(this.state.asiento35 == 'false') ? 
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
                            {(this.state.asiento36 == 'false') ? 
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
                            {(this.state.asiento37 == 'false') ? 
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
                            {(this.state.asiento38 == 'false') ? 
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
                        {
                            (this.state.noAsientos > 38) ?
                            (
                                <Col xs="3">
                                </Col>
                            )
                            :
                            ''
                        }
                        {
                            (this.state.noAsientos > 38) ?
                            (
                                <Col xs="2" sm="1">
                                    {(this.state.asiento39 == 'false') ? 
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
                            )
                            :
                            ''
                        }
                        {
                            (this.state.noAsientos > 38) ?
                            (
                                <Col xs="2" sm="1">
                                    {(this.state.asiento40 == 'false') ? 
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
                            )
                            :
                            ''
                        }
                        {
                            (this.state.noAsientos > 38) ?
                            (
                                <Row>
                                <Col xs="2" sm="1">
                                    {(this.state.asiento41 == 'false') ? 
                                        (
                                        (this.state.noAsiento == 41)?
                                        (
                                            <Button outline color="danger"><i className="fa fa-check" /></Button>
                                        )
                                        :
                                        (
                                            <Button id='41' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                        )
                                        )
                                        :
                                        (
                                        <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                        )
                                    }
                                    <p className="smallDevice text-center">41</p>
                                </Col>
                                <Col xs="2" sm="1">
                                    {(this.state.asiento42 == 'false') ? 
                                        (
                                        (this.state.noAsiento == 42)?
                                        (
                                            <Button outline color="danger"><i className="fa fa-check" /></Button>
                                        )
                                        :
                                        (
                                            <Button id='42' color="danger" size="lg" className="asientoDisponible" onClick={this.handleSelectAsiento}></Button>
                                        )
                                        )
                                        :
                                        (
                                        <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                        )
                                    }
                                    <p className="smallDevice text-center">42</p>
                                </Col>
                                </Row>
                            )
                            :
                            ''
                        }
                        </Row>
                        {/* FIN Asientos */}
                    </div>)
                    }
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
      //variables del resumen de venta
      nombreCliente: null,
      tipoCliente: null,
      razon: null,
      descuentoTipo: null,
      descuentoDollares: null,
      descuentoNeto: null,
      origen: null,
      paisOrigen: null,
      destino: null,
      paisDestino: null,
      dia: null,
      hora: null,
      asiento: null,
      tipoDeCambio: null,
      cambio: 0.00
    };
    this.handleOnChangePago = this.handleOnChangePago.bind(this);
    this.handleClickActualizar = this.handleClickActualizar.bind(this);
    this.handleOnChangeIdioma = this.handleOnChangeIdioma.bind(this);
  }

  /*isValidated() {
    
  }*/

  handleOnChangePago(e){
    //console.log(e.target.value);
    this.setState({
      pago: e.target.value
    });

    if(parseFloat(e.target.value) > parseFloat(this.state.total)){
      this.setState({
        cambio: (parseFloat(e.target.value) - parseFloat(this.state.total))
      })
      generalData.cobro.anticipo = generalData.cobro.total;
    }else{
      this.setState({
        cambio: ''
      })
    }
  }

  handleOnChangeIdioma(e){
    generalData.idioma = e.target.value;
  }
  
  handleClickActualizar(){
    //console.log(generalData.fechahora);
    this.setState({
      nombreCliente: generalData.nombreCliente,
      tipoCliente: generalData.clienteTipo,
      razon: generalData.razon,
      descuentoTipo: generalData.descuento.tipo,
      descuentoDollares: generalData.descuento.porc,
      descuentoNeto: generalData.cobro.descuento,
      origen: generalData.origen.ciudad+', '+generalData.origen.estado,
      paisOrigen: generalData.origen.pais,
      destino: generalData.destino.ciudad+', '+generalData.destino.estado,
      paisDestino: generalData.destino.pais,
      dia: generalData.detalles.dia,
      hora: generalData.detalles.hora,
      asiento: (generalData.detalles.noAsiento < 10) ? '0'+generalData.detalles.noAsiento : generalData.detalles.noAsiento,
      tipoDeCambio: generalData.cambio,
      subtotal: generalData.cobro.subtotal,
      total: generalData.cobro.total
    })
  }


  render() {
    return <div>
      <br/>
      <Row>
        <Col md={{ size: 3}} lg={{ size: 3}} sm={12} xs={12}>
          <h3>Resumen de Venta </h3>
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
                  <td colSpan="2">{this.state.descuentoTipo}{' '}{this.state.tipoDeCambio+' $'+this.state.descuentoDollares}</td>
                </tr>
                <tr>
                  <th scope="row">Origen:</th>
                  <td colSpan="5">{this.state.origen}{' '}<span class={(this.state.paisOrigen == 'MX') ? 'badge badge-pill badge-success' : 'badge badge-pill badge-primary' } >{this.state.paisOrigen}</span></td>
                </tr>
                <tr>
                  <th scope="row">Destino:</th>
                  <td colSpan="5">{this.state.destino}{' '}<span class={(this.state.paisDestino == 'MX') ? 'badge badge-pill badge-success' : 'badge badge-pill badge-primary' }>{this.state.paisDestino}</span></td>
                </tr>
                <tr>
                  <th scope="row">Día:</th>
                  <td>{this.state.dia}</td>
                  <th scope="row">Hora:</th>
                  <td>{this.state.hora}</td>
                  <th scope="row">Asiento:</th>
                  <td>{this.state.asiento}</td>
                </tr>
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
                  <th scope="row">Descuento</th>
                  <td>{this.state.tipoDeCambio}{' $'}{this.state.descuentoNeto}</td>
                </tr>
                <tr>
                  <th scope="row">Total</th>
                  <td>{this.state.tipoDeCambio}{' $'}{this.state.total}</td>
                </tr>
                <tr>
                  <th scope="row">Impresion de Reservacion</th>
                  <td><CustomInput  type="radio" id="radioEs" name="radioIdioma" value="espanol" label="Español" onChange={this.handleOnChangeIdioma} defaultChecked inline />
                    <CustomInput type="radio" id="radioIn" name="radioIdioma" value="ingles" label="Inglés" onChange={this.handleOnChangeIdioma} inline /></td>
                </tr>
              </tbody>
            </Table>
            <br/>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12}>
                <FormGroup>
                  <Label for="inputPago">Pago</Label>
                    <input type="text" class="form-control" name="inputPago" id="inputPago" placeholder="$0.0" onChange={this.handleOnChangePago}></input>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12}>
                <FormGroup>
                  <Label for="inputCambio">Cambio</Label>
                  <Input value={this.state.cambio} type="text" name="inputCambio" id="inputCambio" placeholder="$0.0" readOnly />
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
  constructor(props) {
    super(props);
    this.state = {
      vendedor: null,//nombre completo del vendedor
      sucursal: null,//nombre de la sucursal
      pasajero: null,//nombre completo del pasajero
      tipo: null, //tipo de pasajero, si es niño, adulto etc
      origen: null, //municipio, estado, país y dirección
      fecha: null, //fecha de salida
      fechaHoy: null, //Fecha del dia de hoy
      hora: null, //hora en formato 00:00
      destino: null, //municipio, estado, país y dirección
      tipoDeCambio: null, //Si es MX o US
      subtotal: null,
      descuento:null,
      total: null,
      folio: null,
      noAsiento: null,
      direccionMatriz: null,
      direccionMatrizEU: null,
      dirSucursal: null,
      telSucursal: null,
      tel2Sucursal: null,
      correoSucursal: null,
      imagenPublicidad: '',
      frase: null,
      permiso: null,
      politicas: null,
      idioma: null
    }
    generalData.vendedor.username = this.props.match.params.id_Usuario;
    //console.log('props',match);
    this.finishButtonClick = this.finishButtonClick.bind(this);
    this.updateAsiento = this.updateAsiento.bind(this);
    this.saveVenta = this.saveVenta.bind(this);
    this.fetchBoleto = this.fetchBoleto.bind(this);
    this.fetchSucursales = this.fetchSucursales.bind(this);
    this.fetchImagen = this.fetchImagen.bind(this);
    this.fetchPoliticasFrasePermiso = this.fetchPoliticasFrasePermiso.bind(this);
    this.fetchFolio = this.fetchFolio.bind(this);
  }

  componentDidMount(){
    this.fetchImagen();
    this.fetchSucursales('MX');
    this.fetchSucursales('US');
    let f = new Date();
    this.setState({
      fechaHoy: (f.getDate() + "-" + (f.getMonth() +1) + "-" + f.getFullYear())
    });
  }

  fetchSucursales(pais){
    let direccion = '';
    let telefono = '';
    fetch(`/api/Sucursales/${pais}/matriz`)
      .then(res => res.json())
      .then(data => {
          direccion = data[0].direccion+" "+data[0].ciudad+", "+data[0].estado+", "+data[0].pais;
          telefono =  data[0].telefono_1+"\n"+data[0].telefono_2;
          if(pais == 'MX'){
            generalData.sucursales.direccionMatriz = direccion;
            generalData.sucursales.telefonoMatriz = telefono;
          }else{
            generalData.sucursales.direccionMatrizEU = direccion;
            generalData.sucursales.telefonoMatrizEU = telefono;
          }
      });  
  }

  fetchPoliticasFrasePermiso(){
    fetch(`/api/ConfiguracionBoleto`)
      .then(res => res.json())
      .then(data => {
        if(data.length>0){
          //console.log(data);
          generalData.configuracion.politicas = data[0].politicas;
          generalData.configuracion.informacionPermiso = data[0].informacionPermiso;
          generalData.configuracion.reservacion = data[0].reservacion;
          this.setState({
            frase: data[0].frase,
            permiso: data[0].informacionPermiso,
            politicas: data[0].politicas
          });
        }
      });
  }

  fetchImagen(){
    fetch(`/api/ImagenesBoletos/Publicidad`)
      .then(res => res.json())
      .then(data => {
        if(data.length>0){
          //ConfiguracionDePublicidad.jsconsole.log('imagenesBoletos', data);
          generalData.imagenPublicidad = data[0].imagen
          /*this.setState({
            imagenPublicidad: data[0].imagen
          });*/
        }
      });
  }

  finishButtonClick(allStates) {
    //Aqui va la creación del boleto y el registro a la DB
    /* Primero guardaremos el asiento, si es satisfactorio el guardado de asientos,
    procederemos a guardar la venta y posteriormente a generar el boleto*/

    console.log(generalData.vendedor.seguridad);

    if((generalData.vendedor.seguridad == 'Ventas') && (generalData.cobro.anticipo < (parseFloat(generalData.cobro.total)/2))){
      alert('Para finalizar la reservacion, el cliente debe dejar al menos el 50% del total');
      return false;
    }else{      
      this.fetchPoliticasFrasePermiso();
      this.fetchFolio(generalData.vendedor.id_Usuario)
    }
  }

  

  fetchBoleto(){
    console.log('generar Reservacion');
    GenerarReservacion(generalData);
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
                title="RESERVACION DE VIAJE"
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