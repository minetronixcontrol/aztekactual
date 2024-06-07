import React, { Component } from 'react';
import {Button, Container, Col, CustomInput, Form, FormGroup, FormText, Input, Label, Row} from 'reactstrap';

import GenerarReservacion from './reservacionPDF.js';


var generalData = {
  id: '',
  politicas: '',
  informacionPermiso: '',
  frase: '',
  reservacion: ''
};

var imagen = {
  type: 'Publicidad',
  imagen: '',
  id: ''
};

var vistaPrevia = {
  idioma: 'espanol',
  imagenPublicidad: '',
  folioVendedor: '0',
  nombreCliente: 'John Doe',
  clienteTipo: 'Adulto',
  origen: {
    ciudad: 'Tlaltenango',
    estado: 'Zacatecas',
    pais: 'MX',
    direccion: 'nowhere',
  },
  destino: {
    ciudad: 'Pacoima',
    estado: 'California',
    pais: 'EU',
    direccion: 'nowhere',
  },
  detalles: {
    dia: '00-00-0000'
  },
  cambio: '0.00',
  cobro: {
    subtotal: '0.00',
    descuento: '0.00',
    total: '0.00',
    anticipo: '0.00',
  },
  configuracion: {
    informacionPermiso: '',
    politicas: '',
    reservacion: '',
  },
  sucursales: {
    direccionMatriz: 'nowhere',
    telefonoMatriz: '4931234567',
    direccionMatrizEU: 'nowhere',
    telefonoMatrizEU: '4931234567'
  }
}

export default class boletos extends Component {
  constructor(props) {
    super(props);
    this.state = {
        //Variables de Validacion
        validationPoliticas: true,   
    };
    this.resetValidation = this.resetValidation.bind(this);
    this.fetchConfiguracionBoleto = this.fetchConfiguracionBoleto.bind(this);
    this.validar = this.validar.bind(this);
    this.vistaPrevia = this.vistaPrevia.bind(this);
    this.getB64 = this.getB64.bind(this);
    this.getNewText = this.getNewText.bind(this);
    this.fetchImagenPublicidad = this.fetchImagenPublicidad.bind(this);
    this.guardar = this.guardar.bind(this);
  }

  componentDidMount(){
    this.fetchConfiguracionBoleto();
  }

  validar(e){
    let guardarConfig = true;
    let politicas = document.getElementById('inputPoliticas').value;

    if(politicas == null || politicas == ''){
      this.setState({
          validationPoliticas: false
      });
      guardarConfig = false;
    }

    if(guardarConfig){
      generalData.reservacion = this.getNewText(document.getElementById('inputPoliticas').value);
      if(e == 'vistaPrevia'){
        vistaPrevia.configuracion.informacionPermiso = generalData.informacionPermiso;
        vistaPrevia.configuracion.politicas = generalData.politicas;
        vistaPrevia.configuracion.reservacion = generalData.reservacion;
        GenerarReservacion(vistaPrevia);
      }else{
          this.guardar(generalData, imagen);
      }
    }

  }

  guardar(obj, objImg){
    fetch(`/api/ConfiguracionBoleto/${obj.id}`, {
      method: 'PUT',
      body: JSON.stringify(obj),
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }
    }).then(res =>{
      if(res.ok){
          console.log('infoBoleto guardado');
          fetch(`/api/ImagenesBoletos/${objImg.id}`, {
              method: 'PUT',
              body: JSON.stringify(objImg),
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
              }
          }).then(res => {
              if(res.ok){
                  alert('Configuracion guardada correctamente!')
              }else{
                  alert('ha ocurrido un error, por favor intenta más tarde');
              }
          })
      }
    })
  }

  vistaPrevia(){
    vistaPrevia.imagenPublicidad = imagen.imagen;
    this.validar('vistaPrevia');  
  }

  resetValidation(){
    this.setState({
      validationPoliticas: true
    });
  }

  getB64(){
    let inputFile = document.getElementById('inputFile');
    let archivoRuta = inputFile.value;
    var extPermitidas = /(.jpg|.JPG|jpeg|.JPEG|.png|.PNG)$/i;
    if(!extPermitidas.exec(archivoRuta)){
        alert('Asegurese de seleccionar una imagen con extensión .jpg o .png');
        inputFile.value = '';
        return false;
    }else{
        if (inputFile.files && inputFile.files[0]){
            var visor = new FileReader();
            visor.onload = function(e){
                document.getElementById('visorArchivo').innerHTML = 
                '<embed src="'+e.target.result+'" width="128" height="128" />';
                imagen.imagen = e.target.result;
            };
            visor.readAsDataURL(inputFile.files[0]);
        }
    }
  }

  getNewText(text){
    let newText = '';
    let code = 0;
    for (let i = 0; i < generalData.politicas.length; i++) {
        code = parseInt(text.charCodeAt(i));
        if(code == 13 || code == 10){
            newText+='\n'
        }else{
            newText+=text.charAt(i);
        }
    }
    return newText;
  }

  fetchConfiguracionBoleto(){
    fetch(`/api/ConfiguracionBoleto/`)
    .then(res => res.json())
    .then(data => {
        if(data.length > 0){
          generalData.id = data[0]._id;
          generalData.reservacion = data[0].reservacion;
          document.getElementById('inputPoliticas').value = data[0].reservacion;

          generalData.informacionPermiso = data[0].informacionPermiso;
          generalData.politicas = data[0].politicas;
        }
    }).then(()=>{
        this.fetchImagenPublicidad();
    })
  }

  fetchImagenPublicidad(){
    fetch(`/api/ImagenesBoletos/Publicidad`)
    .then(res => res.json())
    .then(data => {
        if(data.length > 0){
            document.getElementById('visorArchivo').innerHTML = 
            '<embed src="'+data[0].imagen+'" width="128" height="128" />';
            imagen.imagen=data[0].imagen;
            imagen.id=data[0]._id;
        }
    })
  }

  render() {
    return (
      <div>
        <Container style={{ marginTop: "15px" }}>
          <h3 className="text-center">Configuracion de Publicidad y Reservación</h3>
          <br/>
          <Row>
              <Col>
                <FormGroup>                
                  <Label for="inputPoliticas">Politicas de reservación</Label>
                  <div className={(this.state.validationPoliticas) ? 'card border-light': 'card border-danger'}>
                    <Input type="textarea" name="inputPoliticas" id="inputPoliticas" onChange={this.resetValidation} rows="5"/>
                  </div>
                  <p className={(this.state.validationPoliticas) ? 'textValid': 'textInvalid'}>Campo sin llenar</p>
                </FormGroup>
              </Col>
          </Row>
          <Row>
            <Col>
              <FormGroup>
                  <Label for="inputFile">Imagen publicitaria</Label>
                  <Input type="file" name="file" id="inputFile" onChange={this.getB64}/>
                  <FormText color="muted">
                      Selecciona la imagen publicitaria que se mostrará en los boletos.<br/>
                      Tamaño recomendado: 128 x 128 px
                  </FormText>
              </FormGroup>
            </Col>
          </Row><br/>
          <Row>
            <Col id="visorArchivo" className="text-center">
            </Col>
          </Row>
          <Row>
            <Col className="text-left">
              <Button color="secondary" size="lg" onClick={this.validar}>Guardar</Button>
            </Col>
            <Col className="text-right">
              <Button color="info" size="lg" onClick={this.vistaPrevia}>Vista Previa</Button>
            </Col>
          </Row>
          <br/>
        </Container>
      </div>
    )
  }
}
