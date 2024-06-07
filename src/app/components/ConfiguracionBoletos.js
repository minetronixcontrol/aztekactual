import React, { Component } from 'react';
import {Button, Container, Col, CustomInput, Form, FormGroup, FormText, Input, Label, Row} from 'reactstrap';
import { ConnectionBase } from 'mongoose';

import GenerarBoleto from "./boletoPDF";

var generalData = {
    id: '',
    politicas: '',
    informacionPermiso: '',
    frase: '',
    reservacion: ''
};

var imagen = {
    type: 'Boleto',
    imagen: '',
    id: ''
};

var dollar = {
    id: '',
    precioDollar: '',
    fecha: ''
};

var vistaPrevia ={
    vendedor: 'Jane Doe',
    sucursal: 'Viajes Azteca',
    pasajero: 'John Doe',
    tipo: 'Adulto',
    origen: 'Tlaltenango',
    fecha: '00-00-0000',
    hora: '00:00 --',
    destino: 'Pacoima',
    tipoDeCambio: 'MX',
    subtotal: '0.00',
    descuento: '0.00',
    total: '0.00',
    noAsiento: '0',
    telSucursal: '4931234567',
    tel2Sucursal: '4931234567',
    correoSucursal: 'example@correo.com',
    dirSucursal: 'nowhere',
    idioma: 'espanol',
    imagenPublicidad: '',
    folio: '000',
    direccionMatriz: 'nowhere',
    telefonoMatriz: '4931234567',
    direccionMatrizEU: 'nowhere',
    telefonoMatrizEU: '4931234567',
    frase: '',
    permiso: '',
    politicas: '',
}

export default class boletos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //Variables de Validacion
            validationPoliticas: true,
            validationPermiso: true,
            validationFrase: true,
            validationDollar: true,     
        };
        this.validar = this.validar.bind(this);
        this.getB64 = this.getB64.bind(this);
        this.getNewText = this.getNewText.bind(this);
        this.guardar = this.guardar.bind(this);
        this.vistaPrevia = this.vistaPrevia.bind(this);
        this.fetchConfiguracionBoleto = this.fetchConfiguracionBoleto.bind(this);
        this.fetchImagenBoleto = this.fetchImagenBoleto.bind(this);
        this.resetValidation = this.resetValidation.bind(this);
        this.fetchDollar = this.fetchDollar.bind(this);
    }

    componentDidMount(){
        this.fetchConfiguracionBoleto();
        this.fetchImagenBoleto();
        this.fetchDollar();
    }

    //Funciones
    validar(e){
        let guardarConfig = true;
        let politicas = document.getElementById('inputPoliticas').value;
        let permiso = document.getElementById('inputPermiso').value;
        let frase = document.getElementById('inputFrase').value;
        let precioDollar = document.getElementById('inputDollar').value;

        if(politicas == null || politicas == ''){
            this.setState({
                validationPoliticas: false
            });
            guardarConfig = false;
        }
        if(permiso == null || permiso == ''){
            this.setState({
                validationPermiso: false
            });
            guardarConfig = false;
        }
        if(frase == null || frase == ''){
            this.setState({
                validationFrase: false
            });
            guardarConfig = false;
        }
        if(precioDollar == null || precioDollar == ''){
            this.setState({
                validationDollar: false
            });
            guardarConfig = false;
        }
        
        if(guardarConfig){
            generalData.politicas = this.getNewText(document.getElementById('inputPoliticas').value);
            generalData.informacionPermiso = this.getNewText(document.getElementById('inputPermiso').value);
            generalData.frase = this.getNewText(document.getElementById('inputFrase').value);
            dollar.precioDollar = document.getElementById('inputDollar').value;
            if(e == 'vistaPrevia'){
                vistaPrevia.frase = generalData.frase;
                vistaPrevia.permiso = generalData.informacionPermiso;
                vistaPrevia.politicas = generalData.politicas;
                GenerarBoleto(vistaPrevia);
            }else{
                this.guardar(generalData, imagen, dollar);
            }
        }
    }

    resetValidation(event){
        switch (event.target.id) {
            case 'inputPoliticas':
                this.setState({
                    validationPoliticas: true
                });
                break;
            case 'inputPermiso':
                this.setState({
                    validationPermiso: true
                });
                break;
            case 'inputFrase':
                this.setState({
                    validationFrase: true
                });
                break;
            case 'inputDollar':
                this.setState({
                    validationDollar: true
                });
                break;
        
            default:
                break;
        }
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
                    '<embed src="'+e.target.result+'" width="211" height="335" />';
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

    vistaPrevia(){
        vistaPrevia.imagenPublicidad = imagen.imagen;
        this.validar('vistaPrevia');        
    }

    guardar(obj, objImg, objDollar){
        fetch(`/api/ConfiguracionBoleto/${obj.id}`, {
            method: 'PUT',
            body: JSON.stringify(obj),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(res =>{
            if(res.ok){                
                fetch(`/api/ImagenesBoletos/${objImg.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(objImg),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }).then(res => {
                    if(res.ok){
                        console.log('Imagen guardada');
                        fetch(`/api/Dollar/${objDollar.id}`, {
                            method: 'PUT',
                            body: JSON.stringify(objDollar),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            alert('Configuracion guardada correctamente!');
                        })
                    }else{
                        alert('ha ocurrido un error, por favor intenta más tarde');
                    }
                })
            }
        })
    }

    fetchConfiguracionBoleto(){
        fetch(`/api/ConfiguracionBoleto/`)
        .then(res => res.json())
        .then(data => {
            if(data.length > 0){
                document.getElementById('inputPoliticas').value = data[0].politicas;
                generalData.politicas = data[0].politicas;
                document.getElementById('inputPermiso').value = data[0].informacionPermiso;
                generalData.informacionPermiso = data[0].informacionPermiso;
                document.getElementById('inputFrase').value = data[0].frase;
                generalData.frase = data[0].frase;
                generalData.id = data[0]._id;
                generalData.reservacion = data[0].reservacion;
            }
        })
    }

    fetchImagenBoleto(){
        fetch(`/api/ImagenesBoletos/Boleto`)
        .then(res => res.json())
        .then(data => {
            if(data.length > 0){
                document.getElementById('visorArchivo').innerHTML = 
                '<embed src="'+data[0].imagen+'" width="211" height="335" />';
                imagen.imagen=data[0].imagen;
                imagen.id=data[0]._id;
            }
        })
    }

    fetchDollar(){
        fetch(`/api/Dollar/`)
        .then(res => res.json())
        .then(data => {
            if(data.length > 0){
                dollar.id = data[0]._id;
                dollar.precioDollar = data[0].precioDollar;
                dollar.fecha = data[0].fecha;

                document.getElementById('inputDollar').value = data[0].precioDollar;
            }
        })
    }

  render() {
    return (
      <div>
        <Container style={{ marginTop: "15px" }}>
          <h3 className="text-center">INFORMACION DE BOLETO Y POLITICAS</h3>
          <br/>
          <Row>
              <Col>
                <FormGroup>                
                  <Label for="inputPoliticas">Politicas de cancelacion</Label>
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
                    <Label for="exampleText">Informacion de Permiso</Label>
                    <div className={(this.state.validationPermiso) ? 'card border-light': 'card border-danger'}>
                    <Input type="textarea" name="inputPermiso" id="inputPermiso" onChange={this.resetValidation} rows="5"/>
                    </div>
                    <p className={(this.state.validationPermiso) ? 'textValid': 'textInvalid'}>Campo sin llenar</p>
                </FormGroup>
                </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <Label for="exampleText">Frase</Label>
                  <div className={(this.state.validationFrase) ? 'card border-light': 'card border-danger'}>
                    <Input type="textarea" name="inputFrase" id="inputFrase" onChange={this.resetValidation} rows="5"/>
                  </div>
                  <p className={(this.state.validationFrase) ? 'textValid': 'textInvalid'}>Campo sin llenar</p>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <Label for="exampleText">Precio de Dollar</Label>
                  <div className={(this.state.validationDollar) ? 'card border-light': 'card border-danger'}>
                    <Input type="text" name="inputDollar" id="inputDollar" onChange={this.resetValidation}/>
                  </div>
                  <p className={(this.state.validationDollar) ? 'textValid': 'textInvalid'}>Campo sin llenar</p>
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
                        Tamaño recomendado: 211 x 335 px
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
              <Button onClick={this.validar} color="secondary" size="lg">Guardar</Button>
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
