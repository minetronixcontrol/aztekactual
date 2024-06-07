import React, { Component } from 'react';
import {Button, Card, CardTitle, Container, Col, CustomInput, Form, FormGroup, Input, Label, Row, Table } from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import Select from 'react-select';
/* Componentes Externos */
import GenerarListaDeAbordaje from "./listaDeAbordajePDF";
/** Termina Componentes Externos **/

/* Estilos */
import './css/react-bootstrap-table-all.min.css';

var datosViaje = {
  idViaje: '',
  conductor1: {
    id: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: ''
  },
  conductor2: {
    id: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: ''
  },
  sobrecargo: {
    id: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: ''
  },
  auxiliar:{
    id: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: ''
  },
  noEconomico: '',
  capacidad: null,
  fecha: ''
}

var precio = false;
var notas = false;
var auxPasajeros = [];
var selectColor = 'Local';

var colourOptions = [
  {
    value: 'Local',
    label: 'Local',
    color: 'YELLOW'
  },
  {
    value: 'Foraneo',
    label: 'Foráneo',
    color: 'DeepSkyBlue'
  },
  {
    value: 'PorAbordar',
    label: 'Por Abordar',
    color: 'HOTPINK'
  },
  {
    value: 'NoSuben',
    label: 'No Suben',
    color: 'DARKGRAY'
  }
];


export default class ListaAbordaje extends Component {

  constructor(props) {
    super(props);

    this.state = {
      conductor1: '',
      conductor2: '',
      sobrecargo: '',
      auxiliar: '',
      noEconomico: '',
      fecha: '',
      color: 'Local',
      imprimirPrecio: false,
      pasajeros: [],
      selected: [],
      sobres: '',
      sobresPorCobrar: '',
      totalBoletos: '',
      entregadosPor: '',
      notas: '',
      optNoEconomico: [],
      idViaje: ''
    }

    this.fetchViaje = this.fetchViaje.bind(this);
    this.handleChangeNoEconomico = this.handleChangeNoEconomico.bind(this);
    this.fetchListaAbordaje = this.fetchListaAbordaje.bind(this);
    this.handleOnChangeColor = this.handleOnChangeColor.bind(this);
    this.onRowSelect = this.onRowSelect.bind(this);
    this.saveStateAbordaje = this.saveStateAbordaje.bind(this);
    this.priceFormatter = this.priceFormatter.bind(this);
    this.fetchNotas = this.fetchNotas.bind(this);
    this.onChangeSobresPorCobrar = this.onChangeSobresPorCobrar.bind(this);
    this.onChangeTotalDeBoletos = this.onChangeTotalDeBoletos.bind(this);
    this.onChangeEntregadosPor = this.onChangeEntregadosPor.bind(this);
    this.onChangeNotas = this.onChangeNotas.bind(this);
    this.guardarNotas = this.guardarNotas.bind(this);
    this.onChangeSobres = this.onChangeSobres.bind(this);
    this.clickLista = this.clickLista.bind(this);
    this.handlePrecio = this.handlePrecio.bind(this);
    this.handleNotas = this.handleNotas.bind(this);
  }

  fetchViaje(e){
    //Primero vacíamos todas la variables involucradas y después proseguimos
    this.setState({
      conductor1: '',
      conductor2: '',
      sobrecargo: '',
      auxiliar: '',
      noEconomico: '',
      fecha: '',
      pasajeros: [],
      selected: [],
      sobres: '',
      sobresPorCobrar: '',
      totalBoletos: '',
      entregadosPor: '',
      notas: '',
      optNoEconomico: [],
    });
    let fecha = e.target.value;
    fecha = fecha.split("-", 3);
    fecha = `${fecha[2]}-${fecha[1]}-${fecha[0]}`;
    datosViaje.fecha = fecha;
    console.log(fecha);
    fetch(`/api/AsignarViajes/${fecha}/fechaViajes`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.setState({
          optNoEconomico: data
        });
      })
  }

  handleChangeNoEconomico(e){
    console.log(e);
    this.setState({
      conductor1: e.conductor1,
      conductor2: e.conductor2,
      sobrecargo: e.sobrecargo,
      auxiliar: e.auxiliar,
      capacidad: e.capacidad,
      idViaje: e.value
    });
    this.fetchListaAbordaje(e.value);
    this.fetchNotas(e.value);
    datosViaje.idViaje = e.value;
    datosViaje.conductor1.id = e.idConductor1,
    datosViaje.conductor1.nombre = e.conductor1Nombre,
    datosViaje.conductor1.apellidoPaterno = e.conductor1ApellidoPaterno,
    datosViaje.conductor1.apellidoMaterno = e.conductor1ApellidoMaterno,
    datosViaje.conductor2.nombre = e.conductor2Nombre,
    datosViaje.conductor2.apellidoPaterno = e.conductor2ApellidoPaterno,
    datosViaje.conductor2.apellidoMaterno = e.conductor2ApellidoMaterno,
    datosViaje.sobrecargo.nombre = e.sobrecargoNombre,
    datosViaje.sobrecargo.apellidoPaterno = e.sobrecargoApellidoPaterno,
    datosViaje.sobrecargo.apellidoMaterno = e.sobrecargoApellidoMaterno,
    datosViaje.auxiliar.nombre = e.auxiliarNombre,
    datosViaje.auxiliar.apellidoPaterno = e.auxiliarApellidoPaterno,
    datosViaje.auxiliar.apellidoMaterno = e.auxiliarApellidoMaterno,
    datosViaje.capacidad = e.capacidad;
    datosViaje.noEconomico = e.noEco;
    datosViaje.capacidad = e.capacidad;
    datosViaje.fecha = e.fecha;
    
  }

  fetchListaAbordaje(id){
    console.log(`/api/Ventas/${id}/ListaAbordaje`);
    fetch(`/api/Ventas/${id}/ListaAbordaje`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.setState({
          pasajeros: data.respuesta,
          selected: data.selected
        });
      });
  }

  fetchNotas(id){
    fetch(`/api/NotasListaDeAbordaje/idViaje/${id}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.setState({
          sobres: data[0].sobres,
          totalBoletos: data[0].totalBoletos,
          sobresPorCobrar: data[0].sobresPorCobrar,
          entregadosPor: data[0].entregadosPor,
          notas: data[0].Notas
        });
      });
  }

  handleOnChangeColor(e){
    //console.log(e.value);
    selectColor = e.value;
    this.setState({
      color: e.value
    });
  }

  onChangeSobres(e){
    this.setState({
      sobres: e.target.value
    });
  }

  onChangeSobresPorCobrar(e){
    this.setState({
      sobresPorCobrar: e.target.value
    });
  }

  onChangeTotalDeBoletos(e){
    this.setState({
      totalBoletos: e.target.value
    });
  }

  onChangeEntregadosPor(e){
    this.setState({
      entregadosPor: e.target.value
    });
  }

  onChangeNotas(e){
    this.setState({
      notas: e.target.value
    });
  }

  guardarNotas(){
    let idViaje = datosViaje.idViaje;
    let sobres = this.state.sobres;
    let totalBoletos = this.state.totalBoletos;
    let sobresPorCobrar = this.state.sobresPorCobrar;
    let entregadosPor = this.state.entregadosPor;
    let Notas = this.state.notas;
    fetch(`/api/NotasListaDeAbordaje/${idViaje}`, {
      method: 'PUT',
      body: JSON.stringify({idViaje, sobres, totalBoletos, sobresPorCobrar, entregadosPor, Notas}),
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data =>  console.log(data));
  }

  clickLista(){
    //auxPasajeros = [];
    //console.log(pasajeros);
    let notasAux = {
      aux: notas,
      sobres: this.state.sobres,
      sobresPorCobrar: this.state.sobresPorCobrar,
      totalBoletos: this.state.totalBoletos,
      entregadosPor: this.state.entregadosPor,
      notas: this.state.notas
    }
    GenerarListaDeAbordaje(this.state.pasajeros, datosViaje, precio, notasAux);
  }

  onRowSelect(row, isSelected, e){
    console.log('onRowSelect');
    let selected = this.state.selected;
    if(selected.includes(row.foliofake)){
      console.log('incluye');
      let i = selected.indexOf(row.foliofake);
      selected.splice(i, 1);
    }else{
      console.log('No incluye');
      selected.push(row.foliofake);
    }
    this.setState({
      selected: selected
    });
    console.log('row',row);
    console.log('selected',this.state.selected);
    if ((row.asiento == row.folio)) {
      console.log('hola');
      return false;
    }else{
      let folio = row.folio;
      console.log(folio);
      //buscamos el pasajero con ese folio en nuetro array de pasajeros
      let pasajeros = this.state.pasajeros;
      for (let i = 0; i < pasajeros.length; i++) {
        if(pasajeros[i].folio == folio){
          if(isSelected){
            pasajeros[i].lf = this.state.color;
            this.saveStateAbordaje(datosViaje.idViaje, pasajeros[i].asiento, this.state.color, pasajeros[i].asignacion, pasajeros[i].id); //Para cambiar el estado a viajado
          }else{
            pasajeros[i].lf = '';
            this.saveStateAbordaje(datosViaje.idViaje, pasajeros[i].asiento, 'null', pasajeros[i].asignacion, pasajeros[i].id); //Para cambiar el estado a no viajado
          }
        }
      }
    }
  }

  saveStateAbordaje(idViaje, asiento, estado, asignacion, id){
    console.log(`/api/ListaDeAbordaje/${idViaje}/${asiento}/${estado}/${asignacion}/${id}`);
    fetch(`/api/ListaDeAbordaje/${idViaje}/${asiento}/${estado}/${asignacion}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({idViaje, asiento, estado}),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data =>  console.log(data));
  }

  priceFormatter(cell, row) {
    //console.log(row.tipoDeCambio);
    if(row.pagado == 'true' && row.reasignacion){
        return cell+' <i class="fas fa-check"></i> <i class="fas fa-history"></i>';
    }else if(row.reasignacion){
      return cell+' <i class="fas fa-history"></i>';
    }else if(row.pagado == 'true'){
      return cell+' <i class="fas fa-check"></i>';
    }else{
        return cell;
    }
    
  }

  handlePrecio(){
    precio = !precio;
  }

  handleNotas(){
    notas = !notas;
  }


  render() {

     /** OPCIONES DE COLORES **/
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
    /** TERMINA OPCIONES DE COLORES **/

    /* Configuracion del table */
    const selectRowProp = {
      mode: 'checkbox',
      selected: this.state.selected,
      bgColor: function(row, isSelect) {
        //console.log('row',row);
        //console.log('isSelect', isSelect);
        switch (row.lf) {
          case 'Local':
            return 'YELLOW';
            break;
          case 'Foraneo':
            return 'DeepSkyBlue';
            break;
          case 'PorAbordar':
            return 'HOTPINK'
            break;
          case 'NoSuben':
            return 'DARKGRAY'
            break;
        
          default:
            return '';
            break;
        }
      },
      onSelect: this.onRowSelect,
      hideSelectColumn: true,  // enable hide selection column.
      clickToSelect: true  // you should enable clickToSelect, otherwise, you can't select column.
    };

    return (
      <div>
        <Container style={{ marginTop: "15px" }}>
          <Form>
            <Card body outline color="secondary">
              <CardTitle className="text-center"><h3>LISTA DE ABORDAJE</h3></CardTitle>
              <br/>
              <Row>
                {/** Herramientas **/}
                <Col lg='3' md='3' sm='12' xs='12'>
                  {/** Fecha **/}
                  <Row form>
                    <Col lg='12' md='12' sm='12' xs='12'>
                      <FormGroup>
                        <Label for="dateViaje"><i className="fas fa-calendar-alt"></i>{ ' Fecha:' }</Label>
                        <Input
                          type="date"
                          name="dateViaje"
                          id="dateViaje"
                          placeholder="date placeholder"
                          onChange={this.fetchViaje}
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  {/** Camión **/}
                  <Row form>
                    <Col lg='12' md='12' sm='12' xs='12'>
                      <FormGroup>
                        <Label for="selectNoEconomico"><i className="fas fa-bus-alt"></i>{ ' No. Económico:' }</Label>
                        <Select
                          id="selectNoEconomico"
                          onChange={this.handleChangeNoEconomico}
                          options={this.state.optNoEconomico}
                          placeholder = "Selecciona..."
                          />
                      </FormGroup>
                    </Col>
                  </Row>
                  
                  {/** Color **/}
                  <Row form>
                    <Col lg='12' md='12' sm='12' xs='12'>
                      <FormGroup>
                        <Label for="colorSelect"><i className="fas fa-highlighter"></i>{ ' Color:' }</Label>
                        <Select
                          name="colorSelect"
                          id="colorSelect"
                          defaultValue={colourOptions[0]}
                          options={colourOptions}
                          styles={colourStyles}
                          isSearchable={false}
                          onChange={this.handleOnChangeColor}
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  {/** Imprimir y Precios **/}
                  <Row>
                    <Col lg='6' md='6' sm='6' xs='6'>
                      <Button outline color="info" onClick={this.clickLista}><i className="fas fa-print"></i></Button>
                    </Col>
                    <Col lg='6' md='6' sm='6' xs='6'>
                      <CustomInput type="switch" id="switchPrecio" name="switchPrecio" label="Precio"  onChange={this.handlePrecio}/>
                      <CustomInput type="switch" id="switchNotas" name="switchNotas" label="Notas"  onChange={this.handleNotas}/>
                    </Col>
                  </Row>

                </Col>
                {/** Fin Herramientas **/}

                {/** Datos **/}
                <Col lg='9' md='8' sm='12' xs='12'>
                <Table responsive borderless>
                  <tbody>
                    <tr>
                      <th scope="row">Conductor 1:</th>
                      <td>{this.state.conductor1 || ''}</td>
                    </tr>
                    <tr>
                      <th scope="row">Conductor 2:</th>
                      <td>{this.state.conductor2 || ''}</td>
                    </tr>
                    <tr>
                      <th scope="row">Sobrecarga:</th>
                      <td colSpan="3">{this.state.sobrecargo || ''}</td>
                    </tr>
                    <tr>
                      <th scope="row">Auxiliar:</th>
                      <td colSpan="3">{this.state.auxiliar || ''}</td>
                    </tr>
                  </tbody>
                </Table>
                </Col>
              </Row>
            </Card>
            <br/>
            <br/>
            <Row style={{ marginTop: "10px" }}>
              <Col lg='12' md='12' sm='12' xs='12'>
                <BootstrapTable data={this.state.pasajeros} selectRow={ selectRowProp } striped hover>
                  <TableHeaderColumn width='80' isKey dataField='foliofake' hidden>FOLIOFK</TableHeaderColumn>
                  <TableHeaderColumn dataField='asignacion' hidden>Asignacion</TableHeaderColumn>
                  <TableHeaderColumn dataField='id' hidden>ID</TableHeaderColumn>
                  <TableHeaderColumn width='40' dataField='asiento' dataFormat={ this.priceFormatter }>AS</TableHeaderColumn>
                  <TableHeaderColumn width='100' dataField='pagado' hidden>pagado</TableHeaderColumn>
                  <TableHeaderColumn width='90' dataField='vendedor' tdStyle={ { whiteSpace: 'normal' } }>VENDEDOR</TableHeaderColumn>
                  <TableHeaderColumn width='175' dataField='nombrePasajero' tdStyle={ { whiteSpace: 'normal' } }>PASAJERO</TableHeaderColumn>
                  <TableHeaderColumn width='125' dataField='destino' tdStyle={ { whiteSpace: 'normal' } }>DESTINO</TableHeaderColumn>
                  <TableHeaderColumn width='125' dataField='origen' tdStyle={ { whiteSpace: 'normal' } }>ABORDA EN</TableHeaderColumn>
                  <TableHeaderColumn width='100'  dataField='folio' dataFormat={ this.folioFormatter } tdStyle={ { whiteSpace: 'normal' } }>FOLIO</TableHeaderColumn>
                  <TableHeaderColumn width='100' dataField='tipo'>TIPO</TableHeaderColumn>
                  <TableHeaderColumn width='100' dataField='lf' hidden>LOCAL, FORANEO, etc</TableHeaderColumn>
                  <TableHeaderColumn width='100' dataField='reasignacion' hidden>reasignacion</TableHeaderColumn>
                </BootstrapTable>
              </Col>
            </Row>
            <br/>
            <Row>
              <Col lg='6' md='6' sm='12' xs='12'>
                <div class="form-group">
                  <label for="sobresPorCobrar">Boletos por cobrar:</label>
                  <input type="text" class="form-control" id="sobresPorCobrar" value={this.state.sobresPorCobrar} onChange={this.onChangeSobresPorCobrar}/>
                </div>
              </Col>
              <Col lg='6' md='6' sm='12' xs='12'>
                <div class="form-group">
                  <label for="totalBoletos">Total de boletos:</label>
                  <input type="text" class="form-control" id="totalBoletos" value={this.state.totalBoletos} onChange={this.onChangeTotalDeBoletos}/>
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg='6' md='6' sm='12' xs='12'>
                <div class="form-group">
                  <label for="sobres">Sobres:</label>
                  <input type="text" class="form-control" id="sobres" value={this.state.sobres} onChange={this.onChangeSobres}/>
                </div>
              </Col>
              <Col lg='6' md='6' sm='12' xs='12'>
                <div class="form-group">
                  <label for="entregadosPor">Entregados por:</label>
                  <input type="text" class="form-control" id="entregadosPor" value={this.state.entregadosPor} onChange={this.onChangeEntregadosPor}/>
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg='12' md='12' sm='12' xs='12'>
                <div class="form-group">
                  <label for="exampleFormControlTextarea1">Notas:</label>
                  <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" value={this.state.notas} onChange={this.onChangeNotas}/>
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg='12' md='12' sm='12' xs='12'>
                <div class="form-group text-right">
                  <Button color="danger" size="lg" onClick={this.guardarNotas}>Guardar Notas</Button>
                </div>
              </Col>
            </Row>
            <br/><br/><br/>
          </Form>
        </Container>
      </div>
    )
  }

}